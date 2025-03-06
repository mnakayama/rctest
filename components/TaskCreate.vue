<script setup lang="ts">
import { ref } from 'vue'
import type { TaskCreate, TaskPriority, TaskStatus } from '~/types'
import { useTaskStore } from '~/stores/useTaskStore'
import { useUserStore } from '~/stores/useUserStore'

const taskStore = useTaskStore()
const userStore = useUserStore()

const emit = defineEmits<{
  (e: 'created'): void
}>()

const title = ref('')
const description = ref('')
const dueDate = ref('')
const priority = ref<TaskPriority | null>(null)
const status = ref<TaskStatus>('incomplete')
const assignedTo = ref<string | null>(null)

const isLoading = ref(false)
const error = ref<string | null>(null)

const priorities: TaskPriority[] = ['high', 'medium', 'low']
const statuses: TaskStatus[] = ['incomplete', 'in_progress', 'completed']

async function handleSubmit() {
  if (!title.value.trim()) {
    error.value = 'タイトルは必須です'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const newTask: TaskCreate = {
      title: title.value.trim(),
      description: description.value.trim() || null,
      status: status.value,
      due_date: dueDate.value || null,
      priority: priority.value,
      assigned_to: assignedTo.value,
    }

    await taskStore.createTask(newTask)
    emit('created')

    // フォームをリセット
    title.value = ''
    description.value = ''
    dueDate.value = ''
    priority.value = null
    status.value = 'incomplete'
    assignedTo.value = null
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'タスクの作成に失敗しました'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">新規タスク作成</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- エラー表示 -->
        <div v-if="error" class="alert alert-error">
          <div class="flex-1">
            <label>{{ error }}</label>
          </div>
        </div>

        <!-- タイトル -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">タイトル *</span>
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="タスクのタイトル"
            class="input input-bordered"
            required
          />
        </div>

        <!-- 説明 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">説明</span>
          </label>
          <textarea
            v-model="description"
            class="textarea textarea-bordered h-24"
            placeholder="タスクの説明"
          ></textarea>
        </div>

        <!-- ステータス -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">ステータス *</span>
          </label>
          <select v-model="status" class="select select-bordered" required>
            <option v-for="s in statuses" :key="s" :value="s">
              {{ s === 'incomplete' ? '未完了' : s === 'in_progress' ? '対応中' : '完了' }}
            </option>
          </select>
        </div>

        <!-- 期限日 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">期限日</span>
          </label>
          <input v-model="dueDate" type="date" class="input input-bordered" />
        </div>

        <!-- 優先度 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">優先度</span>
          </label>
          <select v-model="priority" class="select select-bordered">
            <option value="">選択してください</option>
            <option v-for="p in priorities" :key="p" :value="p">
              {{ p === 'high' ? '高' : p === 'medium' ? '中' : '低' }}
            </option>
          </select>
        </div>

        <!-- 担当者 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">担当者</span>
          </label>
          <select v-model="assignedTo" class="select select-bordered">
            <option value="">選択してください</option>
            <!-- TODO: ユーザー一覧の実装 -->
          </select>
        </div>

        <!-- 送信ボタン -->
        <div class="card-actions justify-end">
          <button
            type="submit"
            class="btn btn-primary"
            :class="{ loading: isLoading }"
            :disabled="isLoading"
          >
            作成
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
