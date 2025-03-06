import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'
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

    // ユーザー認証チェック
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: '認証が必要です',
      })
    }

    const supabase = await serverSupabaseClient<Database>(event)

    // タスクの所有者かどうかを確認
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

    // タスクの作成者でない場合はエラー
    if (task.created_by !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'このタスクを削除する権限がありません',
      })
    }

    // タスクを削除
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }

    return { success: true }
  } catch (err: any) {
    console.error('タスク削除エラー:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'タスクの削除に失敗しました',
    })
  }
})
