import { getPrisma } from '~/server/utils/prisma';

const prisma = getPrisma();

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

    // ユーザーの検索
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // ユーザーが存在しない場合
    if (!user) {
      return createError({
        statusCode: 404,
        message: 'ユーザーが見つかりません',
      });
    }

    // パスワードを除外して返す
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('Get user error:', error);

    return createError({
      statusCode: 500,
      message: 'ユーザー情報の取得中にエラーが発生しました',
    });
  }
});
