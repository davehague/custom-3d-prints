
export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()
  
  if (!userStore.currentUser?.is_admin) {
    return navigateTo('/')
  }
})