import { Todo, TodoFilter, TodoSort, Category } from '@/types/todo';

const TODO_STORAGE_KEY = 'todos';
const CATEGORY_STORAGE_KEY = 'categories';

// カテゴリの操作
export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCategories = (categories: Category[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
};

// TODOの操作
export const getTodos = (): Todo[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(TODO_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTodos = (todos: Todo[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
};

// フィルタリングと並び替え
export const filterTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  return todos.filter((todo) => {
    if (filter.completed !== undefined && todo.completed !== filter.completed) {
      return false;
    }
    if (filter.priority && todo.priority !== filter.priority) {
      return false;
    }
    if (filter.categoryId && todo.categoryId !== filter.categoryId) {
      return false;
    }
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      return (
        todo.title.toLowerCase().includes(query) ||
        todo.description?.toLowerCase().includes(query)
      );
    }
    return true;
  });
};

export const sortTodos = (todos: Todo[], sort: TodoSort): Todo[] => {
  return [...todos].sort((a, b) => {
    switch (sort.option) {
      case 'dueDate':
        if (!a.dueDate) return sort.direction === 'asc' ? 1 : -1;
        if (!b.dueDate) return sort.direction === 'asc' ? -1 : 1;
        return sort.direction === 'asc'
          ? a.dueDate.getTime() - b.dueDate.getTime()
          : b.dueDate.getTime() - a.dueDate.getTime();

      case 'priority':
        const priorityValue = { low: 0, medium: 1, high: 2 };
        return sort.direction === 'asc'
          ? priorityValue[a.priority] - priorityValue[b.priority]
          : priorityValue[b.priority] - priorityValue[a.priority];

      case 'created':
        return sort.direction === 'asc'
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();

      case 'title':
        return sort.direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);

      default:
        return 0;
    }
  });
};

// ヘルパー関数
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const createTodo = (
  title: string,
  description?: string,
  categoryId?: string,
  priority: Todo['priority'] = 'medium',
  dueDate?: Date
): Todo => {
  const now = new Date();
  return {
    id: generateId(),
    title,
    description,
    completed: false,
    priority,
    categoryId,
    dueDate,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateTodo = (todos: Todo[], updatedTodo: Todo): Todo[] => {
  const index = todos.findIndex((t) => t.id === updatedTodo.id);
  if (index === -1) return todos;

  const newTodos = [...todos];
  newTodos[index] = {
    ...updatedTodo,
    updatedAt: new Date(),
  };

  return newTodos;
};

export const deleteTodo = (todos: Todo[], todoId: string): Todo[] => {
  return todos.filter((todo) => todo.id !== todoId);
};

export const toggleTodoComplete = (todos: Todo[], todoId: string): Todo[] => {
  return todos.map((todo) =>
    todo.id === todoId
      ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
      : todo
  );
};
