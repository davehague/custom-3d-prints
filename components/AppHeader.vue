<template>
  <header class="bg-gray-800 text-white shadow-md">
    <nav class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold">
          <NuxtLink to="/" class="hover:text-gray-300 transition-colors duration-200">
            Vue-Nuxt Starter
          </NuxtLink>
        </div>
        <div class="flex space-x-4">
          <NuxtLink to="/" class="hover:text-gray-300 transition-colors duration-200">Home</NuxtLink>
          <NuxtLink to="/about" class="hover:text-gray-300 transition-colors duration-200">About</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-gray-300 transition-colors duration-200">Contact</NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
// You can add any necessary imports or logic here
</script>