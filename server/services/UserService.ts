// server/services/UserService.ts
import { type DBUser } from '@/types/database'
import { serverSupabase } from '../utils/serverSupabaseClient'
import { GoogleUser } from '~/types/interfaces'

export class UserService {
  static async findByEmail(email: string): Promise<DBUser | null> {
    console.log(`[UserService] Finding user by email:`, email)
    try {
      const { data, error } = await serverSupabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle()

      if (error) {
        console.error(`[UserService] Error finding user:`, error)
        throw error
      }

      console.log(
        `[UserService] Find result:`,
        data ? "User found" : "User not found"
      )
      return data
    } catch (error) {
      console.error(`[UserService] Unexpected error in findByEmail:`, error)
      throw error
    }
  }

  static async getCurrentUser(): Promise<DBUser | null> {
    console.log(`[UserService] Getting current user`)
    try {
      const { data: { user } } = await serverSupabase.auth.getUser()
      if (!user) {
        console.log(`[UserService] No authenticated user found`)
        return null
      }

      const { data, error } = await serverSupabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(`[UserService] Error getting current user:`, error)
        throw error
      }

      console.log(`[UserService] Found current user:`, data.id)
      return data
    } catch (error) {
      console.error(`[UserService] Unexpected error in getCurrentUser:`, error)
      throw error
    }
  }

  static async update(id: string, updates: Partial<DBUser>): Promise<DBUser> {
    console.log(`[UserService] Updating user:`, id)
    try {
      const { data, error } = await serverSupabase
        .from("users")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single()

      if (error) {
        console.error(`[UserService] Error updating user:`, error)
        throw error
      }

      console.log(`[UserService] Successfully updated user:`, id)
      return data
    } catch (error) {
      console.error(`[UserService] Unexpected error in update:`, error)
      throw error
    }
  }

  static async isUserAdmin(id: string): Promise<boolean> {
    console.log(`[UserService] Checking if user is admin:`, id)
    try {
      const { data, error } = await serverSupabase
        .from('users')
        .select('is_admin')
        .eq('id', id)
        .single()

      if (error) {
        console.error(`[UserService] Error checking admin status:`, error)
        throw error
      }

      console.log(`[UserService] Admin check result:`, data?.is_admin || false)
      return data?.is_admin || false
    } catch (error) {
      console.error(`[UserService] Unexpected error in isUserAdmin:`, error)
      throw error
    }
  }

  static async createFromGoogle(googleUser: GoogleUser): Promise<DBUser> {
    console.log(`[UserService] Creating/updating user from Google:`, googleUser.email)
    try {
      const { data, error } = await serverSupabase
        .from("users")
        .upsert({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          is_admin: false, // Default value for new users
        })
        .select("*")
        .single()

      if (error) {
        console.error(`[UserService] Error creating/updating user:`, error)
        throw error
      }

      console.log(`[UserService] Successfully created/updated user:`, data.id)
      return data
    } catch (error) {
      console.error(`[UserService] Unexpected error in createFromGoogle:`, error)
      throw error
    }
  }
}