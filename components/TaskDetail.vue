<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task, TaskUpdate, TaskPriority, TaskStatus } from '~/types'
import { useTaskStore } from '~/stores/useTaskStore'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
  (e: 'deleted'): void
}>()

const taskStore = useTaskStore()
const isEditing = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

// 編集用フォームの状態
const editForm = ref({
  title: props.task.title,
  description: props.task.description,
  status: props.task.status,
  due_date: props.task.due_date,
  priority: props.task.priority,
  assigned_to: props.task.assigned_to,
})

const priorities: TaskPriority[] = ['high', 'medium', 'low']
const statuses: TaskStatus[] = ['incomplete', 'in_progress', 'completed']

const statusText = computed(() => {
  switch (props.task.status) {
    case 'incomplete':
      return '未完了'
    case 'in_progress':
      return '対応中'
    case 'completed':
      return '完了'
    default:
      return props.task.status
  }
})

const priorityText = computed(() => {
  switch (props.task.priority) {
    case 'high':
      return '高'
    case 'medium':
      return '中'
    case 'low':
      return '低'
    default:
      return '設定なし'
  }
})

const priorityClass = computed(() => {
  switch (props.task.priority) {
    case 'high':
      return 'badge-error'
    case 'medium':
      return 'badge-warning'
    case 'low':
      return 'badge-info'
    default:
      return 'badge-ghost'
  }
})

async function handleUpdate() {
  if (!editForm.value.title.trim()) {
    error.value = 'タイトルは必須です'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const updates: TaskUpdate = {
      title: editForm.value.title.trim(),
      description: editForm.value.description?.trim() || null,
      status: editForm.value.status,
      due_date: editForm.value.due_date || null,
      priority: editForm.value.priority,
      assigned_to: editForm.value.assigned_to,
    }

    await taskStore.updateTask(props.task.id, updates)
    isEditing.value = false
    emit('updated')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'タスクの更新に失敗しました'
  } finally {
    isLoading.value = false
  }
}

async function handleDelete() {
  if (!confirm('このタスクを削除してもよろしいですか？')) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    await taskStore.deleteTask(props.task.id)
    emit('deleted')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'タスクの削除に失敗しました'
  } finally {
    isLoading.value = false
  }
}

function cancelEdit() {
  isEditing.value = false
  editForm.value = {
    title: props.task.title,
    description: props.task.description,
    status: props.task.status,
    due_date: props.task.due_date,
    priority: props.task.priority,
    assigned_to: props.task.assigned_to,
  }
  error.value = null
}
</script>

<template>
  <div class="p-4">
    <!-- エラー表示 -->
    <div v-if="error" class="alert alert-error mb-4">
      <div class="flex-1">
        <label>{{ error }}</label>
      </div>
    </div>

    <!-- 表示モード -->
    <div v-if="!isEditing">
      <div class="flex justify-between items-start mb-6">
        <h3 class="text-2xl font-bold">{{ task.title }}</h3>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-outline" @click="isEditing = true">編集</button>
          <button
            class="btn btn-sm btn-error btn-outline"
            @click="handleDelete"
            :disabled="isLoading"
          >
            削除
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-bold">ステータス</span>
          </label>
          <div>{{ statusText }}</div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-bold">優先度</span>
          </label>
          <div>
            <div class="badge" :class="priorityClass">
              {{ priorityText }}
            </div>
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-bold">期限日</span>
          </label>
          <div>
            {{ task.due_date ? new Date(task.due_date).toLocaleDateString('ja-JP') : '設定なし' }}
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-bold">作成日</span>
          </label>
          <div>
            {{ new Date(task.created_at).toLocaleString('ja-JP') }}
          </div>
        </div>
      </div>

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text font-bold">説明</span>
        </label>
        <div class="whitespace-pre-wrap">
          {{ task.description || '説明なし' }}
        </div>
      </div>
    </div>

    <!-- 編集モード -->
    <form v-else @submit.prevent="handleUpdate" class="space-y-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">タイトル *</span>
        </label>
        <input v-model="editForm.title" type="text" class="input input-bordered" required />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">説明</span>
        </label>
        <textarea v-model="editForm.description" class="textarea textarea-bordered h-24"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">ステータス *</span>
          </label>
          <select v-model="editForm.status" class="select select-bordered" required>
            <option v-for="status in statuses" :key="status" :value="status">
              {{
                status === 'incomplete' ? '未完了' : status === 'in_progress' ? '対応中' : '完了'
              }}
            </option>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">優先度</span>
          </label>
          <select v-model="editForm.priority" class="select select-bordered">
            <option value="">選択してください</option>
            <option v-for="priority in priorities" :key="priority" :value="priority">
              {{ priority === 'high' ? '高' : priority === 'medium' ? '中' : '低' }}
            </option>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">期限日</span>
          </label>
          <input v-model="editForm.due_date" type="date" class="input input-bordered" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">担当者</span>
          </label>
          <select v-model="editForm.assigned_to" class="select select-bordered">
            <option value="">選択してください</option>
            <!-- TODO: ユーザー一覧の実装 -->
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button type="button" class="btn btn-ghost" @click="cancelEdit" :disabled="isLoading">
          キャンセル
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :class="{ loading: isLoading }"
          :disabled="isLoading"
        >
          保存
        </button>
      </div>
    </form>
  </div>
</template>
