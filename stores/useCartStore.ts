import { defineStore } from "pinia";
import type { Product } from "@/types/Product";

interface CartItem {
  product: Product;
  quantity: number;
}

export const useCartStore = defineStore(
  "cart",
  () => {
    const items = ref<CartItem[]>([]);
    const addToCart = (product: Product) => {
      const existingItem = items.value.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        items.value.push({ product, quantity: 1 });
      }
    };

    const removeFromCart = (productId: string) => {
      const index = items.value.findIndex(
        (item) => item.product.id === productId
      );
      if (index > -1) {
        items.value.splice(index, 1);
      }
    };

    const updateQuantity = (productId: string, quantity: number) => {
      const item = items.value.find((item) => item.product.id === productId);
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          removeFromCart(productId);
        }
      }
    };

    const clearCart = () => {
      items.value = [];
    };

    const cartTotal = computed(() => {
      return items.value.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
    });

    const itemCount = computed(() => {
      return items.value.reduce((count, item) => count + item.quantity, 0);
    });

    return {
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount,
    };
  },
  {
    persist: true,
  } as any
);
