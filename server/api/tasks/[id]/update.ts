import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types'
import type { TaskUpdate } from '~/types'

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

    // リクエストボディを取得
    const updates = (await readBody(event)) as TaskUpdate

    // ユーザー認証チェック
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: '認証が必要です',
      })
    }

    const supabase = await serverSupabaseClient<Database>(event)

    // タスクの所有者または担当者かどうかを確認
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw createError({
        statusCode: 404,
        statusMessage: 'タスクが見つかりません',
      })
    }

    // タスクの作成者または担当者でない場合はエラー
    if (task.created_by !== user.id && task.assigned_to !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'このタスクを更新する権限がありません',
      })
    }

    // タスクを更新
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }

    return { task: data }
  } catch (err: any) {
    console.error('タスク更新エラー:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'タスクの更新に失敗しました',
    })
  }
})
