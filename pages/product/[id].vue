<template>
    <div class="container mx-auto px-4 py-8">
        <ProductDetail :product-id="($route.params.id as string)" />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default'
});
</script>