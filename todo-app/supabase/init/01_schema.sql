-- スキーマ作成
CREATE SCHEMA IF NOT EXISTS public;

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- カテゴリテーブル
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, name)
);

-- TODOテーブル
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- タグテーブル
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, name)
);

-- TODOとタグの中間テーブル
CREATE TABLE IF NOT EXISTS public.todo_tags (
  todo_id UUID REFERENCES public.todos(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (todo_id, tag_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_category_id ON public.todos(category_id);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON public.todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON public.todos(completed);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON public.tags(user_id);

-- 更新日時を自動的に更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 更新日時トリガー
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at
BEFORE UPDATE ON public.todos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
