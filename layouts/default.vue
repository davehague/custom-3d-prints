<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-6 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
// You can add any necessary imports or logic here
</script>