-- RLSを有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todo_tags ENABLE ROW LEVEL SECURITY;

-- ユーザーのポリシー
-- ユーザーは自分自身のみ参照可能
CREATE POLICY "Users can view own user"
ON public.users FOR SELECT
USING (id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分自身のみ更新可能
CREATE POLICY "Users can update own user"
ON public.users FOR UPDATE
USING (id = current_setting('app.current_user_id')::UUID);

-- カテゴリのポリシー
-- ユーザーは自分のカテゴリのみ参照可能
CREATE POLICY "Users can view own categories"
ON public.categories FOR SELECT
USING (user_id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分のカテゴリのみ作成可能
CREATE POLICY "Users can create own categories"
ON public.categories FOR INSERT
WITH CHECK (user_id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分のカテゴリのみ更新可能
CREATE POLICY "Users can update own categories"
ON public.categories FOR UPDATE
USING (user_id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分のカテゴリのみ削除可能
CREATE POLICY "Users can delete own categories"
ON public.categories FOR DELETE
USING (user_id = current_setting('app.current_user_id')::UUID);

-- TODOのポリシー
-- ユーザーは自分のTODOのみ参照可能
CREATE POLICY "Users can view own todos"
ON public.todos FOR SELECT
USING (user_id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分のTODOのみ作成可能
CREATE POLICY "Users can create own todos"
ON public.todos FOR INSERT
WITH CHECK (user_id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分のTODOのみ更新可能
CREATE POLICY "Users can update own todos"
ON public.todos FOR UPDATE
USING (user_id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分のTODOのみ削除可能
CREATE POLICY "Users can delete own todos"
ON public.todos FOR DELETE
USING (user_id = current_setting('app.current_user_id')::UUID);

-- タグのポリシー
-- ユーザーは自分のタグのみ参照可能
CREATE POLICY "Users can view own tags"
ON public.tags FOR SELECT
USING (user_id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分のタグのみ作成可能
CREATE POLICY "Users can create own tags"
ON public.tags FOR INSERT
WITH CHECK (user_id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分のタグのみ更新可能
CREATE POLICY "Users can update own tags"
ON public.tags FOR UPDATE
USING (user_id = current_setting('app.current_user_id')::UUID);

-- ユーザーは自分のタグのみ削除可能
CREATE POLICY "Users can delete own tags"
ON public.tags FOR DELETE
USING (user_id = current_setting('app.current_user_id')::UUID);

-- TODO-タグ中間テーブルのポリシー
-- ユーザーは自分のTODOに関連するタグのみ参照可能
CREATE POLICY "Users can view own todo_tags"
ON public.todo_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.todos
    WHERE todos.id = todo_tags.todo_id
    AND todos.user_id = current_setting('app.current_user_id')::UUID
  )
);

-- ユーザーは自分のTODOに関連するタグのみ作成可能
CREATE POLICY "Users can create own todo_tags"
ON public.todo_tags FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.todos
    WHERE todos.id = todo_tags.todo_id
    AND todos.user_id = current_setting('app.current_user_id')::UUID
  )
);

-- ユーザーは自分のTODOに関連するタグのみ削除可能
CREATE POLICY "Users can delete own todo_tags"
ON public.todo_tags FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.todos
    WHERE todos.id = todo_tags.todo_id
    AND todos.user_id = current_setting('app.current_user_id')::UUID
  )
);

-- 現在のユーザーIDを設定する関数
CREATE OR REPLACE FUNCTION set_current_user_id(user_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id::TEXT, false);
END;
$$ LANGUAGE plpgsql;
