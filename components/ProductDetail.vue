<template>
  <div v-if="product" class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row">
      <div class="md:w-1/2">
        <img :src="product.imageUrl" :alt="product.name" class="w-full rounded-lg shadow-md" />
      </div>
      <div class="md:w-1/2 md:pl-8 mt-4 md:mt-0">
        <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
        <p class="text-gray-600 mb-4">{{ product.description }}</p>
        <div class="text-2xl font-bold mb-4">${{ product.price.toFixed(2) }}</div>

        <div v-for="customization in product.customizations" :key="customization.type" class="mb-4">
          <h3 class="text-lg font-semibold mb-2">{{ customization.type }}</h3>
          <div class="flex flex-wrap gap-2">
            <button v-for="option in customization.options" :key="option"
              @click="selectOption(customization.type, option)" :class="[
                'px-4 py-2 rounded',
                selectedOptions[customization.type] === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              ]">
              {{ option }}
            </button>
          </div>
        </div>

        <button @click="addToCart"
          class="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 mt-4">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { type Product } from '@/types/Product';

// In a real application, you would fetch this data based on the route parameter
const product = ref<Product>({
  id: '1',
  name: '3D Printed Vase',
  description: 'A beautiful customizable vase that you can personalize to your liking.',
  price: 29.99,
  imageUrl: '/placeholder.svg?height=500&width=500',
  customizations: [
    { type: 'Color', options: ['Red', 'Blue', 'Green'] },
    { type: 'Size', options: ['Small', 'Medium', 'Large'] },
    { type: 'Personalization', options: ['None', 'Add Name', 'Add Date'] },
  ],
});

const selectedOptions = ref<Record<string, string>>({});

const selectOption = (type: string, option: string) => {
  selectedOptions.value[type] = option;
};

const isFullyCustomized = computed(() => {
  return product.value.customizations.every(customization =>
    selectedOptions.value[customization.type] !== undefined
  );
});

const addToCart = () => {
  if (isFullyCustomized.value) {
    console.log('Adding to cart:', {
      product: product.value,
      customizations: selectedOptions.value,
    });
    // Implement your add to cart logic here
  } else {
    alert('Please select all customization options before adding to cart.');
  }
};
</script>