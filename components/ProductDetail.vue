<template>
  <div v-if="productStore.loading" class="text-center py-8">
    Loading...
  </div>
  <div v-else-if="productStore.error" class="text-center py-8 text-red-600">
    {{ productStore.error }}
  </div>
  <div v-else-if="product" class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Image Gallery Section -->
      <div class="md:w-1/2">
        <img :src="currentImage || product.images?.[0]?.public_url || '/cube.png'" :alt="product.name"
          class="w-full rounded-lg shadow-md object-cover aspect-square" />
        <div v-if="product.images?.length > 1" class="mt-4 flex gap-2 overflow-x-auto">
          <img v-for="image in product.images" :key="image.id" :src="image.public_url" :alt="product.name"
            @click="currentImage = image.public_url"
            class="w-24 h-24 object-cover cursor-pointer rounded border-2 hover:border-blue-500"
            :class="currentImage === image.public_url ? 'border-blue-500' : 'border-transparent'" />
        </div>
      </div>

      <!-- Product Details Section -->
      <div class="md:w-1/2">
        <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
        <div class="text-2xl font-semibold mb-4 text-blue-600">
          {{ product.price }}
        </div>
        <div class="prose max-w-none mb-8">
          <p class="text-gray-600">{{ product.description }}</p>
        </div>

        <div v-if="product.active" class="space-y-4">
          <button @click="contactForQuote"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors">
            Request Quote
          </button>
          <p class="text-sm text-gray-600">
            Contact us for custom specifications and pricing details.
          </p>
        </div>
        <div v-else class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-600">This product is currently unavailable.</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-8">
    Product not found
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProductStore } from '~/stores/products';
import { useRouter } from 'vue-router';

const props = defineProps<{
  productId: string
}>();

const productStore = useProductStore();
const router = useRouter();
const currentImage = ref<string | null>(null);

const product = computed(() => productStore.currentProduct);

onMounted(async () => {
  await productStore.getProductById(props.productId);
  if (productStore.currentProduct?.images?.[0]) {
    currentImage.value = productStore.currentProduct.images[0].public_url;
  }
});

const contactForQuote = () => {
  router.push('/contact');
};
</script>