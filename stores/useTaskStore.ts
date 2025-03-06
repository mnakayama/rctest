import { defineStore } from 'pinia'
import { useSupabaseClient } from '#imports'
import { ref, computed, onUnmounted } from 'vue'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Database } from '~/types'
import type { Task, TaskCreate, TaskUpdate, TaskStatus, TaskPriority } from '~/types'
import { useUserStore } from './useUserStore'

export const useTaskStore = defineStore('task', () => {
  // state
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  let realtimeSubscription: RealtimeChannel | null = null

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
    const supabase = useSupabaseClient<Database>()
    isLoading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('tasks')
        .select(
          `
          *,
          created_by_profile:profiles!tasks_created_by_fkey(id, name, email),
          assigned_to_profile:profiles!tasks_assigned_to_fkey(id, name, email)
        `
        )
        .order('created_at', { ascending: false })

      if (err) throw err
      tasks.value = data as Task[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : '課題の取得に失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  function subscribeToChanges() {
    const supabase = useSupabaseClient<Database>()

    // 既存のサブスクリプションをクリーンアップ
    if (realtimeSubscription) {
      realtimeSubscription.unsubscribe()
    }

    realtimeSubscription = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        async (payload: RealtimePostgresChangesPayload<Task>) => {
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new
            tasks.value.unshift(newTask)
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new
            const index = tasks.value.findIndex((task) => task.id === updatedTask.id)
            if (index !== -1) {
              tasks.value[index] = updatedTask
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedTask = payload.old as Task
            tasks.value = tasks.value.filter((task) => task.id !== deletedTask.id)
          }
        }
      )
      .subscribe()
  }

  async function createTask(task: TaskCreate) {
    const supabase = useSupabaseClient<Database>()
    isLoading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.from('tasks').insert([task]).select().single()

      if (err) throw err
      if (data) tasks.value.unshift(data)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '課題の作成に失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(id: string, updates: TaskUpdate) {
    const supabase = useSupabaseClient<Database>()
    isLoading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      if (data) {
        const index = tasks.value.findIndex((task) => task.id === id)
        if (index !== -1) {
          tasks.value[index] = data
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '課題の更新に失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTask(id: string) {
    const supabase = useSupabaseClient<Database>()
    isLoading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.from('tasks').delete().eq('id', id)

      if (err) throw err
      tasks.value = tasks.value.filter((task) => task.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '課題の削除に失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // クリーンアップ
  onUnmounted(() => {
    if (realtimeSubscription) {
      realtimeSubscription.unsubscribe()
      realtimeSubscription = null
    }
  })

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
    createTask,
    updateTask,
    deleteTask,
    subscribeToChanges,
  }
})
