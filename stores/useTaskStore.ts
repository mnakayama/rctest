import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskCreate, TaskUpdate, TaskStatus, TaskPriority } from '~/types'
import { useUserStore } from './useUserStore'

export const useTaskStore = defineStore('task', () => {
  // state
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // getters
  const getTasksByStatus = computed(() => {
    return (status: TaskStatus) => tasks.value.filter((task) => task.status === status)
  })

  const getTasksByPriority = computed(() => {
    return (priority: TaskPriority) => tasks.value.filter((task) => task.priority === priority)
  })

  const getTaskById = computed(() => {
    return (id: string) => tasks.value.find((task) => task.id === id)
  })

  const getSortedByDueDate = computed(() => {
    return (ascending = true) =>
      [...tasks.value].sort((a, b) => {
        if (!a.due_date) return ascending ? 1 : -1
        if (!b.due_date) return ascending ? -1 : 1
        return ascending
          ? new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          : new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
      })
  })

  // actions
  async function fetchTasks() {
    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl
      const response = await fetch(`${apiBaseUrl}/api/tasks`)
      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`)
      }

      const data = await response.json()
      tasks.value = data.tasks
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'タスクの取得に失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(task: TaskCreate) {
    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl
      const response = await fetch(`${apiBaseUrl}/api/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.statusMessage || 'タスクの作成に失敗しました')
      }

      const data = await response.json()
      if (data.task) {
        tasks.value.unshift(data.task)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'タスクの作成に失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(id: string, updates: TaskUpdate) {
    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl
      const response = await fetch(`${apiBaseUrl}/api/tasks/${id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.statusMessage || 'タスクの更新に失敗しました')
      }

      const data = await response.json()
      if (data.task) {
        const index = tasks.value.findIndex((task) => task.id === id)
        if (index !== -1) {
          tasks.value[index] = data.task
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'タスクの更新に失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTask(id: string) {
    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl
      const response = await fetch(`${apiBaseUrl}/api/tasks/${id}/delete`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.statusMessage || 'タスクの削除に失敗しました')
      }

      tasks.value = tasks.value.filter((task) => task.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'タスクの削除に失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTaskById(id: string) {
    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl
      const response = await fetch(`${apiBaseUrl}/api/tasks/${id}`)
      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`)
      }

      const data = await response.json()
      currentTask.value = data.task
      return data.task
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'タスクの取得に失敗しました'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    tasks,
    currentTask,
    isLoading,
    error,
    // getters
    getTasksByStatus,
    getTasksByPriority,
    getTaskById,
    getSortedByDueDate,
    // actions
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
  }
})
