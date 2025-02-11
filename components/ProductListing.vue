<template>
  <div>
    <div v-if="productStore.loading" class="text-center py-4">
      Loading...
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in activeProducts" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <NuxtLink :to="`/product/${product.id}`">
          <img :src="getPrimaryImage(product) || 'cube.png'" :alt="product.name" class="w-full h-48 object-cover" />
        </NuxtLink>
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
          <p class="text-gray-600 mb-4">{{ product.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold">{{ product.price }}</span>
            <NuxtLink :to="`/product/${product.id}`" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View Details
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '~/stores/products'
import { computed, onMounted } from 'vue'
import type { DBProductWithImages, DBProductImage } from '~/types/database'

const productStore = useProductStore()

const activeProducts = computed(() =>
  productStore.products.filter(product => product.active)
)

const getPrimaryImage = (product: DBProductWithImages) => {
  const primaryImage = product.images?.find((img: DBProductImage) => img.is_primary)
  return primaryImage?.public_url || product.images?.[0]?.public_url
}

onMounted(async () => {
  await productStore.getAllProducts()
})
</script>