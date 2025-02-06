import { defineStore } from "pinia";
import { ref } from "vue";
import type { GoogleUser } from "@/types/interfaces";
import type { DBUser } from "@/types/database";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUser = ref<DBUser | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    function clear() {
      currentUser.value = null;
      loading.value = false;
      error.value = null;
    }

    async function findByEmail(email: string): Promise<DBUser | null> {
      try {
        loading.value = true;
        const user = await $fetch<DBUser | null>("/api/database/users", {
          method: "GET",
          params: { email },
        });
        if (user) {
          currentUser.value = user;
        }
        return user;
      } catch (err: any) {
        error.value = err.message;
        return null;
      } finally {
        loading.value = false;
      }
    }

    async function getOrCreateUser(googleUser: GoogleUser): Promise<DBUser> {
      try {
        loading.value = true;
        if (!googleUser.email || !googleUser.name) {
          throw new Error("Email and name are required");
        }

        const user = await $fetch<DBUser>("/api/database/users", {
          method: "POST",
          body: {
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
          },
        });
        console.log("👤 Setting user", user);
        currentUser.value = user;
        return user;
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function updateUser(
      userId: string,
      userData: Partial<DBUser>
    ): Promise<DBUser> {
      try {
        loading.value = true;
        const user = await $fetch<DBUser>("/api/database/users", {
          method: "PATCH",
          body: {
            id: userId,
            ...userData,
          },
        });
        currentUser.value = user;
        return user;
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    return {
      currentUser,
      loading,
      error,
      clear,
      findByEmail,
      getOrCreateUser,
      updateUser,
    };
  },
  { persist: true }
);
