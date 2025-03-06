// タスクのステータス
export type TaskStatus = 'incomplete' | 'in_progress' | 'completed'

// タスクの優先度
export type TaskPriority = 'high' | 'medium' | 'low'

// ユーザープロフィール
export interface Profile {
  id: string
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

// タスク
export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  due_date: string | null
  priority: TaskPriority | null
  created_by: string
  assigned_to: string | null
  created_at: string
  updated_at: string
}

// タスク作成時の型
export type TaskCreate = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'> & {
  created_by?: string
}

// タスク更新時の型
export type TaskUpdate = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>>

// データベースのテーブル定義
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      tasks: {
        Row: Task
        Insert: TaskCreate
        Update: TaskUpdate
      }
    }
  }
}
