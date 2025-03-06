<template>
  <div>
    <TodoList 
      @new="showForm = true; editingTodo = null" 
      @edit="editTodo"
    />

    <div class="modal" :class="{ 'modal-open': showForm }">
      <div class="modal-box max-w-3xl">
        <button 
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="showForm = false"
        >✕</button>
        <TodoForm 
          :todo="editingTodo" 
          @submit="handleFormSubmit" 
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useHead } from '#app';
import TodoList from '~/components/todo/TodoList.vue';
import TodoForm from '~/components/todo/TodoForm.vue';
import type { Todo } from '~/types';

useHead({
  title: 'TODOリスト - TODO List Manager',
});

definePageMeta({
  middleware: ['auth'],
});

const showForm = ref(false);
const editingTodo = ref<Todo | null>(null);

const editTodo = (todo: Todo) => {
  editingTodo.value = todo;
  showForm.value = true;
};

const handleFormSubmit = (todo: Todo) => {
  showForm.value = false;
  // フォーム送信後、リストを更新するためにページをリロードする代わりに
  // コンポーネント間の状態管理を行うこともできます
  // ここではシンプルにするためにリロードします
  window.location.reload();
};
</script>
