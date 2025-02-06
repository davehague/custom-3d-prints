<template>
  <div class="min-h-screen">
    <nav class="absolute top-0 right-0 m-6">
      <NuxtLink v-if="!isLoginPage && !loggedIn" to="/login"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
        Login
      </NuxtLink>
      <NuxtLink v-if="!isLoginPage && loggedIn" to="/home"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
        Go to tools →
      </NuxtLink>
    </nav>
    <slot />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { loggedIn } = useUserSession()
const isLoginPage = computed(() => route.path === '/login')
</script>