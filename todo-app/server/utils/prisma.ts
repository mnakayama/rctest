import { PrismaClient } from '@prisma/client';
import { H3Event } from 'h3';

// PrismaClientのグローバルインスタンス
const prisma = new PrismaClient();

// サーバーサイドでのみ実行されるPrismaClient取得関数
export function getPrisma(): PrismaClient {
  return prisma;
}

// APIエラーレスポンスを生成するユーティリティ関数
export function createApiError(statusCode: number, message: string) {
  return createError({
    statusCode,
    message,
  });
}

// ユーザーIDを取得するユーティリティ関数
export async function getUserFromEvent(event: H3Event) {
  try {
    const authHeader = getHeader(event, 'Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createApiError(401, '認証情報が不足しています');
    }

    const prisma = getPrisma();
    const userId = authHeader.replace('Bearer ', '');
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createApiError(404, 'ユーザーが見つかりません');
    }

    return user;
  } catch (error) {
    console.error('Error in getUserFromEvent:', error);
    throw error;
  }
}

// データベースエラーを処理するユーティリティ関数
export function handleDatabaseError(error: unknown) {
  console.error('Database error:', error);

  if (error instanceof Error) {
    // Prismaの一意性制約違反エラーを確認
    if (error.message.includes('Unique constraint failed')) {
      throw createApiError(400, 'このデータは既に存在します');
    }

    // 外部キー制約違反エラーを確認
    if (error.message.includes('Foreign key constraint failed')) {
      throw createApiError(400, '関連するデータが見つかりません');
    }

    throw createApiError(500, 'データベースエラーが発生しました');
  }

  throw createApiError(500, '予期せぬエラーが発生しました');
}
