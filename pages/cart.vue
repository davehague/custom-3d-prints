<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

    <div v-if="cartStore.itemCount === 0" class="text-center py-8">
      <p class="text-xl text-gray-600 mb-4">Your cart is empty</p>
      <NuxtLink to="/" class="text-blue-500 hover:text-blue-600">Continue Shopping</NuxtLink>
    </div>

    <div v-else>
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="space-y-4">
          <div v-for="item in cartStore.items" :key="item.product.id"
            class="flex justify-between items-start border-b pb-4">
            <div class="flex gap-4">
              <img :src="item.product.imageUrl" :alt="item.product.name" class="w-12 h-12 object-cover rounded" />
              <div>
                <h3 class="font-semibold">{{ item.product.name }}</h3>
                <div class="text-sm text-gray-600 mt-1">
                  <div v-for="(value, key) in item.product.selectedOptions" :key="key" class="mb-0.5">
                    {{ key }}: {{ value }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-24 text-right font-medium">
                ${{ item.product.price.toFixed(2) }}
              </div>
              <button @click="cartStore.removeFromCart(item.product.id)" class="text-red-500 hover:text-red-700">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between items-center">
          <button @click="cartStore.clearCart" class="text-red-500 hover:text-red-700">
            Clear Cart
          </button>
          <div class="text-xl font-bold">
            Total: ${{ cartStore.cartTotal.toFixed(2) }}
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/useCartStore';

definePageMeta({
  layout: 'default'
});

const cartStore = useCartStore();
</script>