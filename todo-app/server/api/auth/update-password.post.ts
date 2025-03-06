import { hash } from 'bcryptjs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// バリデーションスキーマ
const updatePasswordSchema = z.object({
  password: z.string()
    .min(12, 'パスワードは12文字以上必要です')
    .regex(/[A-Z]/, '大文字を含める必要があります')
    .regex(/[a-z]/, '小文字を含める必要があります')
    .regex(/[0-9]/, '数字を含める必要があります')
    .regex(/[^A-Za-z0-9]/, '特殊文字を含める必要があります'),
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
    const validatedData = updatePasswordSchema.parse(body);
    
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
    
    // パスワードのハッシュ化
    const hashedPassword = await hash(validatedData.password, 10);
    
    // パスワードの更新
    await prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updated_at: new Date()
      }
    });
    
    return {
      success: true,
      message: 'パスワードが正常に更新されました'
    };
  } catch (error) {
    console.error('Update password error:', error);
    
    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        message: error.errors[0].message
      });
    }
    
    return createError({
      statusCode: 500,
      message: 'パスワード更新中にエラーが発生しました'
    });
  }
});
