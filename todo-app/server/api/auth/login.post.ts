import { compare } from 'bcryptjs';
import { z } from 'zod';
import { getPrisma } from '~/server/utils/prisma';

// バリデーションスキーマ
const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

const prisma = getPrisma();

export default defineEventHandler(async (event) => {
  try {
    // リクエストボディを取得
    const body = await readBody(event);

    // バリデーション
    const validatedData = loginSchema.parse(body);

    // ユーザーの検索
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // ユーザーが存在しない場合
    if (!user) {
      return createError({
        statusCode: 401,
        message: 'メールアドレスまたはパスワードが正しくありません',
      });
    }

    // パスワードの検証
    const isPasswordValid = await compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return createError({
        statusCode: 401,
        message: 'メールアドレスまたはパスワードが正しくありません',
      });
    }

    // パスワードを除外して返す
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        message: error.errors[0].message,
      });
    }

    return createError({
      statusCode: 500,
      message: 'ログイン中にエラーが発生しました',
    });
  }
});
