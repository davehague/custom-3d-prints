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
      <div class="md:w-1/2 relative">
        <img :src="currentImage || sortedImages[0]?.public_url || '/cube.png'" :alt="product.name"
          class="w-full rounded-lg shadow-md object-cover aspect-square" />

        <!-- Navigation Arrows -->
        <button v-if="canGoPrevious" @click="previousImage"
          class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button v-if="canGoNext" @click="nextImage"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div v-if="product.images?.length > 1" class="mt-4 flex gap-2 overflow-x-auto">
          <img v-for="image in sortedImages" :key="image.id" :src="image.public_url" :alt="product.name"
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
const currentImageIndex = computed(() => {
  if (!currentImage.value || !product.value?.images) return 0;
  return product.value.images.findIndex(img => img.public_url === currentImage.value);
});

const canGoPrevious = computed(() => currentImageIndex.value > 0);
const canGoNext = computed(() => {
  if (!product.value?.images) return false;
  return currentImageIndex.value < product.value.images.length - 1;
});

const previousImage = () => {
  if (!product.value?.images || !canGoPrevious.value) return;
  currentImage.value = product.value.images[currentImageIndex.value - 1].public_url;
};

const nextImage = () => {
  if (!product.value?.images || !canGoNext.value) return;
  currentImage.value = product.value.images[currentImageIndex.value + 1].public_url;
};

const product = computed(() => productStore.currentProduct);

const sortedImages = computed(() => {
  if (!product.value?.images) return [];
  return [...product.value.images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return 0;
  });
});

onMounted(async () => {
  await productStore.getProductById(props.productId);
  if (sortedImages.value[0]) {
    currentImage.value = sortedImages.value[0].public_url;
  }
});

const contactForQuote = () => {
  router.push({
    path: '/contact',
    query: {
      product: product.value?.name,
      id: props.productId
    }
  });
};
</script>