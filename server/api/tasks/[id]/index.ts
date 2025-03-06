import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    // タスクIDを取得
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'タスクIDが必要です',
      })
    }

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
      .eq('id', id)
      .single()

    if (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'タスクが見つかりません',
      })
    }

    return { task: data }
  } catch (err: any) {
    console.error('タスク取得エラー:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'タスクの取得に失敗しました',
    })
  }
})
