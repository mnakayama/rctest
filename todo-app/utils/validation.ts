import { z } from 'zod';
import type { Priority } from '~/types';

// ユーザー登録バリデーション
export const registerSchema = z
  .object({
    email: z.string().email('メールアドレスが無効です'),
    password: z
      .string()
      .min(12, 'パスワードは12文字以上必要です')
      .regex(/[A-Z]/, '大文字を含める必要があります')
      .regex(/[a-z]/, '小文字を含める必要があります')
      .regex(/[0-9]/, '数字を含める必要があります')
      .regex(/[^A-Za-z0-9]/, '特殊文字を含める必要があります'),
    confirmPassword: z.string(),
    display_name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// ログインバリデーション
export const loginSchema = z.object({
  email: z.string().email('メールアドレスが無効です'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

// パスワードリセットバリデーション
export const resetPasswordSchema = z.object({
  email: z.string().email('メールアドレスが無効です'),
});

// パスワード更新バリデーション
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, 'パスワードは12文字以上必要です')
      .regex(/[A-Z]/, '大文字を含める必要があります')
      .regex(/[a-z]/, '小文字を含める必要があります')
      .regex(/[0-9]/, '数字を含める必要があります')
      .regex(/[^A-Za-z0-9]/, '特殊文字を含める必要があります'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// TODOバリデーション
export const todoSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルを入力してください')
    .max(100, 'タイトルは100文字以内で入力してください'),
  description: z
    .string()
    .max(500, '説明は500文字以内で入力してください')
    .optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW'] as [Priority, ...Priority[]]),
  due_date: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// カテゴリバリデーション
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名を入力してください')
    .max(50, 'カテゴリ名は50文字以内で入力してください'),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'カラーコードが無効です'),
});

// タグバリデーション
export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'タグ名を入力してください')
    .max(30, 'タグ名は30文字以内で入力してください'),
});

// ユーザープロファイル更新バリデーション
export const profileSchema = z.object({
  display_name: z
    .string()
    .max(50, '表示名は50文字以内で入力してください')
    .optional(),
  avatar_url: z.string().url('URLが無効です').optional(),
});

// 入力サニタイズ関数
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
