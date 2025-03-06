import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types'
import type { TaskCreate } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    // リクエストボディを取得
    const body = (await readBody(event)) as TaskCreate

    // ユーザー認証チェック
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: '認証が必要です',
      })
    }

    // タスクの作成者IDを設定
    const taskData: TaskCreate = {
      ...body,
      created_by: user.id,
    }

    const supabase = await serverSupabaseClient<Database>(event)

    const { data, error } = await supabase.from('tasks').insert([taskData]).select().single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }

    return { task: data }
  } catch (err: any) {
    console.error('タスク作成エラー:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'タスクの作成に失敗しました',
    })
  }
})
