<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-gray-800 text-white">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <img src="/cube.png" alt="3D Cube" class="h-8 w-8 mr-2" />
          <h1 class="text-2xl font-bold">3D Print Shop</h1>
        </div>
        <ul class="flex space-x-4">
          <li><a href="/" class="hover:text-gray-300">Home</a></li>
          <li><a href="/cart" class="hover:text-gray-300">Cart</a></li>
        </ul>
      </nav>
    </header>

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot></slot>
    </main>

    <footer class="bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-4 text-center">
        &copy; 2023 3D Print Shop. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this component
</script>