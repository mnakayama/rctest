import { z } from 'zod';
import { getPrisma } from '~/server/utils/prisma';

// バリデーションスキーマ
const createTodoSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  due_date: z.string().datetime().optional(),
  category_id: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export default defineEventHandler(async (event) => {
  try {
    // 認証ヘッダーからユーザーIDを取得
    const authHeader = getHeader(event, 'Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createError({
        statusCode: 401,
        message: '認証情報が不足しています',
      });
    }

    const userId = authHeader.replace('Bearer ', '');

    // リクエストボディを取得
    const body = await readBody(event);

    // バリデーション
    const validatedData = createTodoSchema.parse(body);

    // サーバーサイドでPrismaClientのインスタンスを作成
    const prisma = getPrisma();

    // TODOの作成
    const todo = await prisma.todo.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        due_date: validatedData.due_date
          ? new Date(validatedData.due_date)
          : null,
        category: validatedData.category_id, // category_idをcategoryとして保存
        tags: validatedData.tags || [], // 必ずString[]として保存
        user_id: userId,
        status: 'NOT_STARTED',
      },
    });

    return {
      success: true,
      todo,
    };
  } catch (error) {
    console.error('Create todo error:', error);

    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        message: error.errors[0].message,
      });
    }

    return createError({
      statusCode: 500,
      message: 'TODOの作成中にエラーが発生しました',
    });
  }
});
