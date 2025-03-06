<template>
  <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
    <div class="card-body p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            v-model="todo.completed"
            class="checkbox checkbox-primary"
          />
          <h2
            class="card-title text-lg"
            :class="{ 'line-through opacity-70': todo?.completed }"
          >
            {{ todo?.title }}
          </h2>
        </div>
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="w-5 h-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><a @click="$emit('edit')">編集</a></li>
            <li><a @click="$emit('delete')" class="text-error">削除</a></li>
          </ul>
        </div>
      </div>

      <p
        v-if="todo.description"
        class="mt-2 text-sm"
        :class="{ 'opacity-70': todo.completed }"
      >
        {{ todo.description }}
      </p>

      <div class="flex flex-wrap gap-2 mt-3">
        <div
          v-if="todo.category"
          class="badge"
          :style="{
            backgroundColor: todo.category.color,
            color: getContrastColor(todo.category.color),
          }"
        >
          {{ todo.category.name }}
        </div>

        <div v-for="tag in todo.tags" :key="tag.id" class="badge badge-outline">
          {{ tag.name }}
        </div>
      </div>

      <div class="flex justify-between items-center mt-3">
        <div class="flex items-center gap-2">
          <span
            class="badge"
            :class="{
              'badge-error': todo.priority === 'HIGH',
              'badge-warning': todo.priority === 'MEDIUM',
              'badge-info': todo.priority === 'LOW',
            }"
          >
            {{ priorityLabel }}
          </span>
        </div>

        <div
          v-if="todo.due_date"
          class="text-sm"
          :class="{ 'text-error': isOverdue }"
        >
          期限: {{ formatDate(todo.due_date) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTodoStore } from '~/stores/todo';
import type { Todo } from '~/types';

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

const todoStore = useTodoStore();

const priorityLabel = computed(() => {
  switch (props.todo.priority) {
    case 'HIGH':
      return '高';
    case 'MEDIUM':
      return '中';
    case 'LOW':
      return '低';
    default:
      return props.todo.priority;
  }
});

const isOverdue = computed(() => {
  if (!props.todo.due_date || props.todo.completed) return false;
  return new Date(props.todo.due_date) < new Date();
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// カテゴリの色に基づいてテキスト色を決定（コントラスト確保）
const getContrastColor = (hexColor: string) => {
  // カラーコードからRGB値を取得
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // 輝度を計算（YIQ式）
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // 輝度が高い（明るい背景）なら黒、低い（暗い背景）なら白を返す
  return yiq >= 128 ? '#000000' : '#ffffff';
};

const toggleComplete = async () => {
  await todoStore.toggleTodoCompletion(props.todo.id);
};
</script>
