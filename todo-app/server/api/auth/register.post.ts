import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getPrisma } from '~/server/utils/prisma';

const prisma = getPrisma();

// バリデーションスキーマ
const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(12, 'パスワードは12文字以上必要です')
    .regex(/[A-Z]/, '大文字を含める必要があります')
    .regex(/[a-z]/, '小文字を含める必要があります')
    .regex(/[0-9]/, '数字を含める必要があります')
    .regex(/[^A-Za-z0-9]/, '特殊文字を含める必要があります'),
  display_name: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    // リクエストボディを取得
    const body = await readBody(event);

    // バリデーション
    const validatedData = registerSchema.parse(body);

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return createError({
        statusCode: 400,
        message: 'このメールアドレスは既に登録されています',
      });
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(validatedData.password, 10);

    // ユーザーの作成
    const userId = uuidv4();
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: validatedData.email,
        password: hashedPassword,
        display_name: validatedData.display_name || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // パスワードを除外して返す
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        message: error.errors[0].message,
      });
    }

    return createError({
      statusCode: 500,
      message: 'ユーザー登録中にエラーが発生しました',
    });
  }
});
