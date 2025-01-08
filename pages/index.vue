<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <div>
            <h1 class="text-2xl font-semibold text-center">Welcome to Vue-Nuxt Starter</h1>
          </div>
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <p>This starter project includes:</p>
              <ul class="list-disc space-y-2 pl-4">
                <li>Vue.js (latest version)</li>
                <li>Nuxt 3</li>
                <li>Pinia for state management</li>
                <li>Supabase integration</li>
                <li>Tailwind CSS for styling</li>
                <li>Lucide Vue Next for icons</li>
              </ul>
            </div>
            <div class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
              <p>Ready to start building?</p>
              <p>
                <a href="https://nuxt.com/docs" class="text-cyan-600 hover:text-cyan-700 transition-colors duration-200"> Explore Nuxt docs &rarr; </a>
              </p>
              <p>
                <a href="https://supabase.com/docs" class="text-cyan-600 hover:text-cyan-700 transition-colors duration-200"> Learn about Supabase &rarr; </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// You can add any necessary imports or logic here
</script>