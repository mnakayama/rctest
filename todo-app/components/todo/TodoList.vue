<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">TODOリスト</h1>
      <button 
        class="btn btn-primary" 
        @click="$emit('new')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新規作成
      </button>
    </div>

    <div class="flex flex-wrap gap-4 mb-6">
      <div class="form-control">
        <div class="input-group">
          <input 
            type="text" 
            placeholder="検索..." 
            class="input input-bordered" 
            v-model="searchQuery"
          />
          <button class="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <select 
        class="select select-bordered" 
        v-model="filterCategory"
      >
        <option value="">すべてのカテゴリ</option>
        <option 
          v-for="category in categories" 
          :key="category.id" 
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>

      <select 
        class="select select-bordered" 
        v-model="filterPriority"
      >
        <option value="">すべての優先度</option>
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>

      <select 
        class="select select-bordered" 
        v-model="filterStatus"
      >
        <option value="all">すべてのステータス</option>
        <option value="completed">完了</option>
        <option value="active">未完了</option>
      </select>
    </div>

    <div v-if="loading" class="flex justify-center my-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="filteredTodos.length === 0" class="text-center my-12">
      <div class="text-4xl mb-4">📝</div>
      <p class="text-xl">TODOが見つかりません</p>
      <p class="text-gray-500 mt-2">新しいTODOを作成するか、フィルターを変更してください</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="todo in filteredTodos" :key="todo.id" class="card-container">
        <TodoCard 
          :todo="todo" 
          @edit="$emit('edit', todo)" 
          @delete="confirmDelete(todo)"
        />
      </div>
    </div>

    <!-- 削除確認モーダル -->
    <div class="modal" :class="{ 'modal-open': todoToDelete }">
      <div class="modal-box">
        <h3 class="font-bold text-lg">TODOを削除</h3>
        <p class="py-4">「{{ todoToDelete?.title }}」を削除してもよろしいですか？この操作は元に戻せません。</p>
        <div class="modal-action">
          <button class="btn" @click="todoToDelete = null">キャンセル</button>
          <button class="btn btn-error" @click="deleteTodo">削除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTodoStore } from '~/stores/todo';
import type { Todo, Category } from '~/types';
import TodoCard from '~/components/todo/TodoCard.vue';

const emit = defineEmits<{
  (e: 'new'): void;
  (e: 'edit', todo: Todo): void;
}>();

const todoStore = useTodoStore();

const todos = ref<Todo[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// フィルター状態
const searchQuery = ref('');
const filterCategory = ref('');
const filterPriority = ref('');
const filterStatus = ref('all');

// 削除確認用
const todoToDelete = ref<Todo | null>(null);

onMounted(async () => {
  await fetchData();
});

const fetchData = async () => {
  loading.value = true;
  
  try {
    // TODOとカテゴリを並行して取得
    const [todosResult, categoriesResult] = await Promise.all([
      todoStore.fetchTodos(),
      todoStore.fetchCategories()
    ]);
    
    if (todosResult.success) {
      todos.value = todosResult.data as Todo[];
    } else {
      error.value = todosResult.error as string;
    }
    
    if (categoriesResult.success) {
      categories.value = categoriesResult.data as Category[];
    }
  } catch (err: any) {
    error.value = err.message || 'データの取得中にエラーが発生しました';
  } finally {
    loading.value = false;
  }
};

// フィルタリングされたTODOリスト
const filteredTodos = computed(() => {
  return todos.value.filter(todo => {
    // 検索クエリでフィルタリング
    if (searchQuery.value && !todo.title.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false;
    }
    
    // カテゴリでフィルタリング
    if (filterCategory.value && todo.category_id !== filterCategory.value) {
      return false;
    }
    
    // 優先度でフィルタリング
    if (filterPriority.value && todo.priority !== filterPriority.value) {
      return false;
    }
    
    // ステータスでフィルタリング
    if (filterStatus.value === 'completed' && !todo.completed) {
      return false;
    }
    
    if (filterStatus.value === 'active' && todo.completed) {
      return false;
    }
    
    return true;
  });
});

// 削除確認
const confirmDelete = (todo: Todo) => {
  todoToDelete.value = todo;
};

// TODO削除
const deleteTodo = async () => {
  if (!todoToDelete.value) return;
  
  try {
    const result = await todoStore.deleteTodo(todoToDelete.value.id);
    
    if (result.success) {
      // 削除成功
      todos.value = todos.value.filter(todo => todo.id !== todoToDelete.value?.id);
      todoToDelete.value = null;
    } else {
      error.value = result.error as string;
    }
  } catch (err: any) {
    error.value = err.message || 'TODOの削除中にエラーが発生しました';
  }
};

// フィルター変更時にURLパラメータを更新
watch([searchQuery, filterCategory, filterPriority, filterStatus], () => {
  // ここでURLパラメータを更新する処理を追加することもできます
  // 例: useRouter().push({ query: { ... } })
});
</script>
