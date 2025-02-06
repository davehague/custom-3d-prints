import { useUserStore } from "@/stores/users";
import type { GoogleUser } from "~/types/interfaces";

export function useAuthManager() {
  const { loggedIn, user, clear } = useUserSession();
  const userStore = useUserStore();
  const { addToast } = useToasts();

  const loadUserData = async () => {
    console.log("📚 Loading user data...");
  };

  watch(
    loggedIn,
    async (newValue) => {
      console.log("🔒 Logged in:", newValue);
      if (newValue && user.value) {
        try {
          console.log("👤 User logged in:", user.value);
          await userStore.getOrCreateUser(user.value as unknown as GoogleUser);

          // Load all user data after successful authentication
          await loadUserData();

          addToast("Welcome back! Your data has been loaded.", "success");
        } catch (error) {
          console.error("Failed to get or create user:", error);
          await clear();
          addToast(
            "Failed to load user profile. Please try logging in again.",
            "error"
          );
        }
      } else if (!newValue) {
        // Clear all stores on logout
        userStore.clear();
      }
    },
    { immediate: true }
  );
}