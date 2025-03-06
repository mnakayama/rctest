import { defineStore } from 'pinia';
import type { User } from '~/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const SESSION_KEY = 'todo_app_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24時間

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
  },

  actions: {
    // ユーザー情報を取得
    async fetchUser() {
      this.loading = true;
      this.error = null;

      try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (!sessionData) {
          this.user = null;
          return;
        }

        const { userId, expiresAt } = JSON.parse(sessionData);

        if (new Date().getTime() > expiresAt) {
          localStorage.removeItem(SESSION_KEY);
          this.user = null;
          return;
        }

        const response = await fetch('/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userId}`,
          },
        });

        if (!response.ok) {
          throw new Error('認証情報の取得に失敗しました');
        }

        const data = await response.json();
        this.user = data.user;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : '認証情報の取得に失敗しました';
        this.user = null;
        localStorage.removeItem(SESSION_KEY);
      } finally {
        this.loading = false;
      }
    },

    async register(email: string, password: string, displayName?: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            display_name: displayName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'ユーザー登録に失敗しました');
        }

        return { success: true, data };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'ユーザー登録に失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'ログインに失敗しました');
        }

        const expiresAt = new Date().getTime() + SESSION_DURATION;
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ userId: data.user.id, expiresAt })
        );
        this.user = data.user;
        return { success: true, data };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'ログインに失敗しました';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.user = null;
      localStorage.removeItem(SESSION_KEY);
    },
  },
});
