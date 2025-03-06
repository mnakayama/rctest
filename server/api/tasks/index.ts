import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient<Database>(event)

    const { data, error } = await supabase
      .from('tasks')
      .select(
        `
        *,
        created_by_profile:profiles!tasks_created_by_fkey(id, name, email),
        assigned_to_profile:profiles!tasks_assigned_to_fkey(id, name, email)
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }

    return { tasks: data }
  } catch (err: any) {
    console.error('タスク一覧取得エラー:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `タスク一覧の取得に失敗しました: ${err.message || JSON.stringify(err)}`,
    })
  }
})
