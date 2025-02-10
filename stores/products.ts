import { defineStore } from "pinia";
import { ref } from "vue";
import type { DBProduct, DBProductWithDetails, Database } from "@/types/database";

export const useProductStore = defineStore(
  "products",
  () => {
    const products = ref<DBProduct[]>([]);
    const currentProduct = ref<DBProductWithDetails | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    function clear() {
      products.value = [];
      currentProduct.value = null;
      loading.value = false;
      error.value = null;
    }

    async function getAllProducts(): Promise<DBProduct[]> {
      try {
        loading.value = true;
        error.value = null; // Reset error state
        const response = await $fetch<{ success: boolean; data: DBProduct[] }>("/api/database/products", {
          method: "GET"
        });
        products.value = response.data || [];
        return products.value;
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function getProductById(id: string): Promise<DBProductWithDetails | null> {
      try {
        loading.value = true;
        const response = await $fetch<{ success: boolean; data: DBProductWithDetails }>("/api/database/products", {
          method: "GET",
          params: { id }
        });
        currentProduct.value = response.data;
        return response.data;
      } catch (err: any) {
        error.value = err.message;
        return null;
      } finally {
        loading.value = false;
      }
    }

    async function createProduct(productData: Database['public']['Tables']['products']['Insert']): Promise<DBProduct> {
      try {
        loading.value = true;
        const product = await $fetch<DBProduct>("/api/database/products", {
          method: "POST",
          body: productData
        });
        products.value.push(product);
        return product;
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function updateProduct(id: string, updates: Partial<DBProduct>): Promise<DBProduct> {
      try {
        loading.value = true;
        const product = await $fetch<DBProduct>("/api/database/products", {
          method: "PATCH",
          body: { id, ...updates }
        });
        
        // Update local state
        const index = products.value.findIndex(p => p.id === id);
        if (index !== -1) {
          products.value[index] = product;
        }
        if (currentProduct.value?.id === id) {
          currentProduct.value = { ...currentProduct.value, ...product };
        }
        
        return product;
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function deleteProduct(id: string): Promise<void> {
      try {
        loading.value = true;
        await $fetch("/api/database/products", {
          method: "DELETE",
          params: { id }
        });
        
        // Update local state
        products.value = products.value.filter(p => p.id !== id);
        if (currentProduct.value?.id === id) {
          currentProduct.value = null;
        }
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    return {
      products,
      currentProduct,
      loading,
      error,
      clear,
      getAllProducts,
      getProductById,
      createProduct,
      updateProduct,
      deleteProduct
    };
  },
  { persist: true }
);
