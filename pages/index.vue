<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '~/stores/useTaskStore'
import type { Task } from '~/types'

const taskStore = useTaskStore()
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const selectedTask = ref<Task | null>(null)

function handleTaskCreated() {
  showCreateModal.value = false
}

function handleTaskSelected(task: Task) {
  selectedTask.value = task
  showDetailModal.value = true
}

function handleTaskUpdated() {
  showDetailModal.value = false
}

function handleTaskDeleted() {
  showDetailModal.value = false
}

onMounted(async () => {
  await taskStore.fetchTasks()
})

const incompleteTasks = computed(() => taskStore.getTasksByStatus('incomplete'))
const inProgressTasks = computed(() => taskStore.getTasksByStatus('in_progress'))
const completedTasks = computed(() => taskStore.getTasksByStatus('completed'))

const tasksLoading = computed(() => taskStore.isLoading)
const error = computed(() => taskStore.error)
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">タスク管理</h1>
      <button class="btn btn-primary" @click="showCreateModal = true">新規タスク作成</button>
    </div>

    <div v-if="error" class="alert alert-error mb-4">
      <div class="flex-1">
        <label>{{ error }}</label>
      </div>
    </div>

    <div v-if="tasksLoading" class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 未完了タスク -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">未完了 ({{ incompleteTasks.length }})</h2>
          <div class="divider"></div>
          <ul class="space-y-4">
            <li
              v-for="task in incompleteTasks"
              :key="task.id"
              class="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors"
              @click="handleTaskSelected(task)"
            >
              <div class="card-body p-4">
                <h3 class="font-bold">{{ task.title }}</h3>
                <p v-if="task.description" class="text-sm">{{ task.description }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span v-if="task.due_date" class="text-sm">
                    期限: {{ new Date(task.due_date).toLocaleDateString('ja-JP') }}
                  </span>
                  <div
                    class="badge"
                    :class="{
                      'badge-error': task.priority === 'high',
                      'badge-warning': task.priority === 'medium',
                      'badge-info': task.priority === 'low',
                    }"
                  >
                    {{ task.priority }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 対応中タスク -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">対応中 ({{ inProgressTasks.length }})</h2>
          <div class="divider"></div>
          <ul class="space-y-4">
            <li
              v-for="task in inProgressTasks"
              :key="task.id"
              class="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors"
              @click="handleTaskSelected(task)"
            >
              <div class="card-body p-4">
                <h3 class="font-bold">{{ task.title }}</h3>
                <p v-if="task.description" class="text-sm">{{ task.description }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span v-if="task.due_date" class="text-sm">
                    期限: {{ new Date(task.due_date).toLocaleDateString('ja-JP') }}
                  </span>
                  <div
                    class="badge"
                    :class="{
                      'badge-error': task.priority === 'high',
                      'badge-warning': task.priority === 'medium',
                      'badge-info': task.priority === 'low',
                    }"
                  >
                    {{ task.priority }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 完了タスク -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">完了 ({{ completedTasks.length }})</h2>
          <div class="divider"></div>
          <ul class="space-y-4">
            <li
              v-for="task in completedTasks"
              :key="task.id"
              class="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors"
              @click="handleTaskSelected(task)"
            >
              <div class="card-body p-4">
                <h3 class="font-bold">{{ task.title }}</h3>
                <p v-if="task.description" class="text-sm">{{ task.description }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span v-if="task.due_date" class="text-sm">
                    期限: {{ new Date(task.due_date).toLocaleDateString('ja-JP') }}
                  </span>
                  <div
                    class="badge"
                    :class="{
                      'badge-error': task.priority === 'high',
                      'badge-warning': task.priority === 'medium',
                      'badge-info': task.priority === 'low',
                    }"
                  >
                    {{ task.priority }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- タスク作成モーダル -->
  <div class="modal" :class="{ 'modal-open': showCreateModal }">
    <div class="modal-box w-11/12 max-w-3xl">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="showCreateModal = false"
      >
        ✕
      </button>
      <TaskCreate @created="handleTaskCreated" />
    </div>
    <div class="modal-backdrop" @click="showCreateModal = false">
      <button class="cursor-default">close</button>
    </div>
  </div>

  <!-- タスク詳細モーダル -->
  <div class="modal" :class="{ 'modal-open': showDetailModal }">
    <div class="modal-box w-11/12 max-w-3xl">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="showDetailModal = false"
      >
        ✕
      </button>
      <TaskDetail
        v-if="selectedTask"
        :task="selectedTask"
        @updated="handleTaskUpdated"
        @deleted="handleTaskDeleted"
        @close="showDetailModal = false"
      />
    </div>
    <div class="modal-backdrop" @click="showDetailModal = false">
      <button class="cursor-default">close</button>
    </div>
  </div>
</template>
