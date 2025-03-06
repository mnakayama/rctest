import { defineStore } from 'pinia'
import { useSupabaseClient, useSupabaseUser } from '#supabase/client'
import type { Profile } from '~/types'

export const useUserStore = defineStore('user', () => {
  // state
  const profile = ref<Profile | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // getters
  const isAuthenticated = computed(() => {
    const user = useSupabaseUser()
    return !!user.value
  })

  // actions
  async function fetchProfile() {
    const user = useSupabaseUser()
    if (!user.value?.id) return

    const supabase = useSupabaseClient()
    isLoading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (err) throw err
      profile.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'プロフィールの取得に失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    const user = useSupabaseUser()
    if (!user.value?.id) return

    const supabase = useSupabaseClient()
    isLoading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (err) throw err
      profile.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'プロフィールの更新に失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function signUp(email: string, password: string, name: string) {
    const supabase = useSupabaseClient()
    isLoading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })

      if (err) throw err
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'サインアップに失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    const supabase = useSupabaseClient()
    isLoading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (err) throw err
      await fetchProfile()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'ログインに失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function signOut() {
    const supabase = useSupabaseClient()
    isLoading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
      profile.value = null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'ログアウトに失敗しました'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    profile,
    isLoading,
    error,
    // getters
    isAuthenticated,
    // actions
    fetchProfile,
    updateProfile,
    signUp,
    signIn,
    signOut,
  }
})
