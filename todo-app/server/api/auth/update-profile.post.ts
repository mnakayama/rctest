import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// バリデーションスキーマ
const updateProfileSchema = z.object({
  display_name: z.string().optional(),
  avatar_url: z.string().url('有効なURLを入力してください').optional(),
});

// PostgreSQLクライアント
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // 認証ヘッダーからユーザーIDを取得
    const authHeader = getHeader(event, 'Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createError({
        statusCode: 401,
        message: '認証情報が不足しています'
      });
    }
    
    const userId = authHeader.replace('Bearer ', '');
    
    // リクエストボディを取得
    const body = await readBody(event);
    
    // バリデーション
    const validatedData = updateProfileSchema.parse(body);
    
    // ユーザーの検索
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });
    
    // ユーザーが存在しない場合
    if (!user) {
      return createError({
        statusCode: 404,
        message: 'ユーザーが見つかりません'
      });
    }
    
    // プロファイルの更新
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        ...validatedData,
        updated_at: new Date()
      }
    });
    
    // パスワードを除外して返す
    const { password, ...userWithoutPassword } = updatedUser;
    
    return {
      success: true,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        message: error.errors[0].message
      });
    }
    
    return createError({
      statusCode: 500,
      message: 'プロファイル更新中にエラーが発生しました'
    });
  }
});
