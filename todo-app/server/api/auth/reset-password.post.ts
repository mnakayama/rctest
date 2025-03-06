import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// バリデーションスキーマ
const resetPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  redirectUrl: z.string().url('有効なURLを入力してください'),
});

// PostgreSQLクライアント
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // リクエストボディを取得
    const body = await readBody(event);
    
    // バリデーション
    const validatedData = resetPasswordSchema.parse(body);
    
    // ユーザーの検索
    const user = await prisma.users.findUnique({
      where: { email: validatedData.email }
    });
    
    // ユーザーが存在しない場合でもセキュリティのために成功を返す
    if (!user) {
      return {
        success: true,
        message: 'パスワードリセット用のリンクを送信しました（実際には送信されません）'
      };
    }
    
    // リセットトークンの生成
    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1時間後に期限切れ
    
    // リセットトークンの保存
    // 実際のアプリケーションでは、リセットトークンをデータベースに保存し、
    // メール送信サービスを使用してリセットリンクをユーザーに送信します
    
    console.log(`パスワードリセットリンク: ${validatedData.redirectUrl}?token=${resetToken}`);
    
    return {
      success: true,
      message: 'パスワードリセット用のリンクを送信しました（実際には送信されません）'
    };
  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        message: error.errors[0].message
      });
    }
    
    return createError({
      statusCode: 500,
      message: 'パスワードリセット中にエラーが発生しました'
    });
  }
});
