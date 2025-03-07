import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../types/user';

export const useUserStore = defineStore('user', () => {
  const router = useRouter();
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // クライアントサイドかどうかの判定
  const isClient = typeof window !== 'undefined';

  // 認証状態の確認
  const isAuthenticated = computed(() => !!token.value);

  // ログイン処理
  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    error.value = null;

    try {
      // 実際のAPIリクエストに置き換える
      // const response = await $fetch<AuthResponse>('/api/auth/login', {
      //   method: 'POST',
      //   body: credentials
      // })

      // モックレスポンス（開発用）
      const response: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
        },
        token: 'mock-jwt-token',
      };

      user.value = response.user;
      token.value = response.token;

      // トークンをローカルストレージに保存
      if (isClient) {
        localStorage.setItem('auth_token', response.token);
      }

      return true;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'ログインに失敗しました';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // 新規ユーザー登録
  async function register(data: RegisterData) {
    isLoading.value = true;
    error.value = null;

    try {
      // 実際のAPIリクエストに置き換える
      // const response = await $fetch<AuthResponse>('/api/auth/register', {
      //   method: 'POST',
      //   body: data
      // })

      // モックレスポンス（開発用）
      const response: AuthResponse = {
        user: {
          id: '1',
          email: data.email,
          name: data.name,
        },
        token: 'mock-jwt-token',
      };

      user.value = response.user;
      token.value = response.token;

      // トークンをローカルストレージに保存
      if (isClient) {
        localStorage.setItem('auth_token', response.token);
      }

      return true;
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : 'ユーザー登録に失敗しました';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // ログアウト処理
  function logout() {
    user.value = null;
    token.value = null;

    // ローカルストレージからトークンを削除
    if (isClient) {
      localStorage.removeItem('auth_token');
    }

    // ログインページにリダイレクト
    router.push('/login');
  }

  // 認証状態の初期化（アプリ起動時）
  async function initAuth() {
    if (isClient) {
      const savedToken = localStorage.getItem('auth_token');

      if (savedToken) {
        token.value = savedToken;

        try {
          // 実際のAPIリクエストに置き換える
          // const userData = await $fetch<User>('/api/auth/me', {
          //   headers: {
          //     Authorization: `Bearer ${savedToken}`
          //   }
          // })

          // モックユーザーデータ（開発用）
          const userData: User = {
            id: '1',
            email: 'user@example.com',
            name: 'テストユーザー',
          };

          user.value = userData;
        } catch (e: unknown) {
          // トークンが無効な場合はログアウト
          logout();
        }
      }
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    initAuth,
  };
});
