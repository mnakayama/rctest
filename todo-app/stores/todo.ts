import { defineStore } from 'pinia';
import type { Todo, TodoFormData, Category, Tag } from '~/types';
import { usePrisma } from '~/composables/usePrisma';

interface TodoState {
  todos: Todo[];
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  currentTodo: Todo | null;
}

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    categories: [],
    tags: [],
    loading: false,
    error: null,
    currentTodo: null,
  }),

  getters: {
    getTodoById: (state) => (id: string) =>
      state.todos.find((todo) => todo.id === id),

    getTodosByCategory: (state) => (categoryId: string) =>
      state.todos.filter((todo) => todo.category_id === categoryId),

    getCompletedTodos: (state) =>
      state.todos.filter((todo) => todo.status === 'COMPLETED'),

    getIncompleteTodos: (state) =>
      state.todos.filter((todo) => todo.status !== 'COMPLETED'),

    getTodosByPriority: (state) => (priority: string) =>
      state.todos.filter((todo) => todo.priority === priority),

    getTodosByDueDate: (state) => (date: string) =>
      state.todos.filter((todo) => {
        if (!todo.due_date) return false;
        const todoDate = new Date(todo.due_date).toISOString().split('T')[0];
        return todoDate === date;
      }),

    getCategoryById: (state) => (id: string) =>
      state.categories.find((category) => category.id === id),

    getTagById: (state) => (id: string) =>
      state.tags.find((tag) => tag.id === id),
  },

  actions: {
    // TODOの取得
    async fetchTodos() {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const todos = await prisma.todo.findMany({
          include: {
            category: true,
            tags: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        });

        this.todos = todos;
        return { success: true, data: todos };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'TODOの取得に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 単一TODOの取得
    async fetchTodoById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const todo = await prisma.todo.findUnique({
          where: { id },
          include: {
            category: true,
            tags: true,
          },
        });

        if (!todo) {
          throw new Error('TODOが見つかりません');
        }

        this.currentTodo = todo;
        return { success: true, data: todo };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'TODOの取得に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // TODOの作成
    async createTodo(todoData: TodoFormData) {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const todo = await prisma.todo.create({
          data: {
            title: todoData.title,
            description: todoData.description,
            priority: todoData.priority,
            due_date: todoData.due_date ? new Date(todoData.due_date) : null,
            category_id: todoData.category || null,
            tags: {
              connect: todoData.tags?.map((tagId) => ({ id: tagId })) || [],
            },
            status: 'NOT_STARTED',
          },
          include: {
            category: true,
            tags: true,
          },
        });

        this.todos.unshift(todo);
        return { success: true, data: todo };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'TODOの作成に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // TODOの更新
    async updateTodo(id: string, todoData: Partial<TodoFormData>) {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const todo = await prisma.todo.update({
          where: { id },
          data: {
            title: todoData.title,
            description: todoData.description,
            priority: todoData.priority,
            due_date: todoData.due_date ? new Date(todoData.due_date) : null,
            category_id: todoData.category || null,
            tags: todoData.tags
              ? {
                  set: todoData.tags.map((tagId) => ({ id: tagId })),
                }
              : undefined,
          },
          include: {
            category: true,
            tags: true,
          },
        });

        const index = this.todos.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.todos[index] = todo;
        }
        if (this.currentTodo?.id === id) {
          this.currentTodo = todo;
        }

        return { success: true, data: todo };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'TODOの更新に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // TODOの削除
    async deleteTodo(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        await prisma.todo.delete({
          where: { id },
        });

        this.todos = this.todos.filter((todo) => todo.id !== id);
        if (this.currentTodo?.id === id) {
          this.currentTodo = null;
        }

        return { success: true };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'TODOの削除に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // TODOの完了状態を切り替え
    async toggleTodoCompletion(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const todo = this.getTodoById(id);
        if (!todo) throw new Error('TODOが見つかりません');

        const prisma = usePrisma();
        const updatedTodo = await prisma.todo.update({
          where: { id },
          data: {
            status: todo.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED',
          },
          include: {
            category: true,
            tags: true,
          },
        });

        const index = this.todos.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
        if (this.currentTodo?.id === id) {
          this.currentTodo = updatedTodo;
        }

        return { success: true, data: updatedTodo };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'TODOの更新に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // カテゴリの取得
    async fetchCategories() {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const categories = await prisma.category.findMany({
          orderBy: {
            name: 'asc',
          },
        });

        this.categories = categories;
        return { success: true, data: categories };
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : 'カテゴリの取得に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // カテゴリの作成
    async createCategory(name: string, color: string = '#3B82F6') {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const category = await prisma.category.create({
          data: {
            name,
            color,
          },
        });

        this.categories.push(category);
        return { success: true, data: category };
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : 'カテゴリの作成に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // カテゴリの更新
    async updateCategory(id: string, name: string, color: string) {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const category = await prisma.category.update({
          where: { id },
          data: {
            name,
            color,
          },
        });

        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.categories[index] = category;
        }

        return { success: true, data: category };
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : 'カテゴリの更新に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // カテゴリの削除
    async deleteCategory(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        await prisma.category.delete({
          where: { id },
        });

        this.categories = this.categories.filter((c) => c.id !== id);

        return { success: true };
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : 'カテゴリの削除に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // タグの取得
    async fetchTags() {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const tags = await prisma.tag.findMany({
          orderBy: {
            name: 'asc',
          },
        });

        this.tags = tags;
        return { success: true, data: tags };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'タグの取得に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // タグの作成
    async createTag(name: string) {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const tag = await prisma.tag.create({
          data: {
            name,
          },
        });

        this.tags.push(tag);
        return { success: true, data: tag };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'タグの作成に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // タグの更新
    async updateTag(id: string, name: string) {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        const tag = await prisma.tag.update({
          where: { id },
          data: {
            name,
          },
        });

        const index = this.tags.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.tags[index] = tag;
        }

        return { success: true, data: tag };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'タグの更新に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // タグの削除
    async deleteTag(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const prisma = usePrisma();
        await prisma.tag.delete({
          where: { id },
        });

        this.tags = this.tags.filter((t) => t.id !== id);

        return { success: true };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'タグの削除に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});
