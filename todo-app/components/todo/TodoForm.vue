<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-xl mb-4">
        {{ isEdit ? 'TODOを編集' : '新しいTODOを作成' }}
      </h2>

      <form @submit.prevent="handleSubmit">
        <div v-if="error" class="alert alert-error mb-4">
          <div class="flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="w-6 h-6 mx-2 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              ></path>
            </svg>
            <label>{{ error }}</label>
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">タイトル</span>
          </label>
          <input
            type="text"
            v-model="form.title"
            placeholder="TODOのタイトル"
            class="input input-bordered"
            :class="{ 'input-error': errors.title }"
            required
          />
          <label v-if="errors.title" class="label">
            <span class="label-text-alt text-error">{{ errors.title }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">説明（任意）</span>
          </label>
          <textarea
            v-model="form.description"
            placeholder="TODOの詳細説明"
            class="textarea textarea-bordered h-24"
            :class="{ 'textarea-error': errors.description }"
          ></textarea>
          <label v-if="errors.description" class="label">
            <span class="label-text-alt text-error">{{
              errors.description
            }}</span>
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">優先度</span>
            </label>
            <select
              v-model="form.priority"
              class="select select-bordered w-full"
              :class="{ 'select-error': errors.priority }"
            >
              <option value="HIGH">高</option>
              <option value="MEDIUM">中</option>
              <option value="LOW">低</option>
            </select>
            <label v-if="errors.priority" class="label">
              <span class="label-text-alt text-error">{{
                errors.priority
              }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">期限（任意）</span>
            </label>
            <input
              type="datetime-local"
              v-model="form.due_date"
              class="input input-bordered"
              :class="{ 'input-error': errors.due_date }"
            />
            <label v-if="errors.due_date" class="label">
              <span class="label-text-alt text-error">{{
                errors.due_date
              }}</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div class="form-control">
            <label class="label">
              <span class="label-text">カテゴリ（任意）</span>
            </label>
            <select
              v-model="form.category_id"
              class="select select-bordered w-full"
              :class="{ 'select-error': errors.category }"
            >
              <option value="">選択なし</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">タグ（任意）</span>
              <button
                type="button"
                class="btn btn-xs btn-ghost"
                @click="showTagModal = true"
              >
                新規作成
              </button>
            </label>
            <select
              v-model="form.tags"
              class="select select-bordered w-full"
              multiple
              :class="{ 'select-error': errors.tags }"
            >
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
            <label class="label">
              <span class="label-text-alt"
                >複数選択可能（Ctrlキーを押しながらクリック）</span
              >
            </label>
          </div>
        </div>

        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner"></span>
            {{ isEdit ? '更新する' : '作成する' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- タグ作成モーダル -->
  <div class="modal" :class="{ 'modal-open': showTagModal }">
    <div class="modal-box">
      <h3 class="font-bold text-lg">新しいタグを作成</h3>
      <div class="py-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">タグ名</span>
          </label>
          <input
            type="text"
            v-model="newTag.name"
            placeholder="タグ名"
            class="input input-bordered"
          />
        </div>
      </div>
      <div class="modal-action">
        <button class="btn" @click="showTagModal = false">キャンセル</button>
        <button class="btn btn-primary" @click="createTag">作成</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useTodoStore } from '~/stores/todo';
import { todoSchema } from '~/utils/validation';
import type { TodoFormData, Todo, Tag, Category } from '~/types';

const props = defineProps<{
  todo?: Todo;
}>();

const emit = defineEmits<{
  (e: 'submit', todo: Todo): void;
  (e: 'cancel'): void;
}>();

const todoStore = useTodoStore();

const isEdit = computed(() => !!props.todo);

const form = reactive<TodoFormData>({
  title: props.todo?.title || '',
  description: props.todo?.description || '',
  priority: props.todo?.priority || 'MEDIUM',
  due_date: props.todo?.due_date
    ? new Date(props.todo.due_date).toISOString().slice(0, 16)
    : '',
  category_id: props.todo?.category_id || '',
  tags: props.todo?.tags?.map((tag) => tag.id) || [],
});

const loading = ref(false);
const error = ref<string | null>(null);
const errors = reactive<Record<string, string>>({});

const categories = ref<string[]>(['仕事', '個人', '買い物', '趣味']);
const tags = ref<Tag[]>([]);

const showTagModal = ref(false);
const newTag = reactive({ name: '' });

onMounted(async () => {
  // タグを取得
  await fetchTags();
});

const fetchTags = async () => {
  const result = await todoStore.fetchTags();
  if (result.success) {
    tags.value = result.data as Tag[];
  }
};

const createTag = async () => {
  if (!newTag.name.trim()) return;

  const result = await todoStore.createTag(newTag.name);
  if (result.success) {
    showTagModal.value = false;
    newTag.name = '';
    await fetchTags();
    form.tags = [...(form.tags || []), result.data.id];
  }
};

const validateForm = () => {
  errors.title = '';
  errors.description = '';
  errors.priority = '';
  errors.due_date = '';
  errors.category = '';
  errors.tags = '';

  try {
    todoSchema.parse(form);
    return true;
  } catch (err: any) {
    if (err.errors) {
      err.errors.forEach((e: any) => {
        if (e.path) {
          errors[e.path[0]] = e.message;
        }
      });
    }
    return false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = null;

  try {
    let result;

    if (isEdit.value && props.todo) {
      // 既存のTODOを更新
      result = await todoStore.updateTodo(props.todo.id, form);
    } else {
      // 新しいTODOを作成
      result = await todoStore.createTodo(form);
    }
    if (result.success && result.data) {
      // 型安全に処理するため、必要なプロパティを変換
      const todoData: Todo = {
        id: result.data.id,
        user_id: result.data.user_id,
        title: result.data.title,
        description: result.data.description || undefined,
        priority: result.data.priority,
        status: result.data.status,
        due_date: result.data.due_date
          ? result.data.due_date instanceof Date
            ? result.data.due_date.toISOString()
            : String(result.data.due_date)
          : undefined,
        completed: false, // デフォルト値を設定
        category_id: undefined, // 必要に応じて設定
        // カテゴリの処理
        category: result.data.category
          ? typeof result.data.category === 'string'
            ? {
                id: '', // ダミーID
                user_id: result.data.user_id,
                name: result.data.category,
                color: '#000000', // デフォルト色
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : result.data.category
          : undefined,
        // タグの処理
        tags: Array.isArray(result.data.tags)
          ? result.data.tags.map((tag: string | Tag) => {
              if (typeof tag === 'string') {
                return {
                  id: tag,
                  user_id: result.data.user_id,
                  name: tag,
                  created_at: new Date().toISOString(),
                };
              }
              return tag;
            })
          : [],
        created_at:
          result.data.created_at instanceof Date
            ? result.data.created_at.toISOString()
            : String(result.data.created_at),
        updated_at:
          result.data.updated_at instanceof Date
            ? result.data.updated_at.toISOString()
            : String(result.data.updated_at),
      };

      emit('submit', todoData);
    } else {
      error.value = result.error as string;
    }
  } catch (err: any) {
    error.value = err.message || 'TODOの保存中にエラーが発生しました';
  } finally {
    loading.value = false;
  }
};
</script>
