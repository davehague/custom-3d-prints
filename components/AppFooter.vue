<template>
  <footer class="bg-gray-800 text-white">
    <div class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <div>
          &copy; {{ new Date().getFullYear() }} Vue-Nuxt-Supabase Starter. All rights reserved.
        </div>
        <div class="flex space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="hover:text-gray-300 transition-colors duration-200">
            GitHub
          </a>
          <a href="https://nuxtjs.org" target="_blank" rel="noopener noreferrer" class="hover:text-gray-300 transition-colors duration-200">
            Nuxt
          </a>
          <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" class="hover:text-gray-300 transition-colors duration-200">
            Supabase
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// You can add any necessary imports or logic here
</script>