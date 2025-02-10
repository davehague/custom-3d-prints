import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  DBProduct,
  DBProductImage,
  DBProductWithDetails,
  DBProductWithImages,
  Database,
} from "@/types/database";

interface ImageUpdatePayload {
  imageId: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export const useProductStore = defineStore(
  "products",
  () => {
    // Change the type to include images
    const products = ref<DBProductWithImages[]>([]);
    const currentProduct = ref<DBProductWithDetails | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const productImages = ref<Record<string, DBProductImage[]>>({});

    function clear() {
      products.value = [];
      currentProduct.value = null;
      loading.value = false;
      error.value = null;
    }

    async function getAllProducts(): Promise<DBProductWithImages[]> {
      try {
        loading.value = true;
        error.value = null; // Reset error state
        const response = await $fetch<{
          success: boolean;
          data: DBProductWithImages[];
        }>("/api/database/products", {
          method: "GET",
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

    async function getProductById(
      id: string
    ): Promise<DBProductWithDetails | null> {
      try {
        loading.value = true;
        const response = await $fetch<{
          success: boolean;
          data: DBProductWithDetails;
        }>("/api/database/products", {
          method: "GET",
          params: { id },
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

    async function createProduct(
      productData: Database["public"]["Tables"]["products"]["Insert"]
    ): Promise<DBProductWithImages> {
      try {
        loading.value = true;
        const product = await $fetch<DBProduct>("/api/database/products", {
          method: "POST",
          body: productData,
        });
        // Convert to DBProductWithImages with empty images array for local state
        const productWithImages: DBProductWithImages = {
          ...product,
          images: [],
        };
        products.value.push(productWithImages);
        return productWithImages;
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function updateProduct(
      id: string,
      updates: Partial<DBProduct>
    ): Promise<DBProductWithImages> {
      try {
        loading.value = true;
        const product = await $fetch<DBProduct>("/api/database/products", {
          method: "PATCH",
          body: { id, ...updates },
        });

        // Find existing product to preserve images
        const existingProduct = products.value.find((p) => p.id === id);
        const productWithImages: DBProductWithImages = {
          ...product,
          images: existingProduct?.images || [],
        };

        // Update local state
        const index = products.value.findIndex((p) => p.id === id);
        if (index !== -1) {
          products.value[index] = productWithImages;
        }
        if (currentProduct.value?.id === id) {
          currentProduct.value = { ...currentProduct.value, ...product };
        }

        return productWithImages;
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
          params: { id },
        });

        // Update local state
        products.value = products.value.filter((p) => p.id !== id);
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

    async function getProductImages(
      productId: string
    ): Promise<DBProductImage[]> {
      try {
        loading.value = true;
        const response = await $fetch<{
          success: boolean;
          data: DBProductImage[];
        }>(`/api/database/products/${productId}/images`, { method: "GET" });
        productImages.value[productId] = response.data;
        return response.data;
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function uploadProductImages(
      productId: string,
      files: File[]
    ): Promise<DBProductImage[]> {
      try {
        loading.value = true;
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const response = await $fetch<{
          success: boolean;
          data: DBProductImage[];
        }>(`/api/database/products/${productId}/images`, {
          method: "POST",
          body: formData,
        });

        // Update local state
        if (!productImages.value[productId]) {
          productImages.value[productId] = [];
        }
        productImages.value[productId].push(...response.data);

        return response.data;
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function updateProductImage(
      productId: string,
      updates: ImageUpdatePayload
    ): Promise<DBProductImage> {
      try {
        loading.value = true;
        const response = await $fetch<{
          success: boolean;
          data: DBProductImage;
        }>(`/api/database/products/${productId}/images`, {
          method: "PATCH",
          body: updates,
        });

        // Update local state
        if (productImages.value[productId]) {
          const index = productImages.value[productId].findIndex(
            (img) => img.id === updates.imageId
          );
          if (index !== -1) {
            productImages.value[productId][index] = response.data;
          }
        }

        return response.data;
      } catch (err: any) {
        error.value = err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function deleteProductImage(
      productId: string,
      imageId: string
    ): Promise<void> {
      try {
        loading.value = true;
        await $fetch(`/api/database/products/${productId}/images`, {
          method: "DELETE",
          params: { imageId },
        });

        // Update local state
        if (productImages.value[productId]) {
          productImages.value[productId] = productImages.value[
            productId
          ].filter((img) => img.id !== imageId);
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
      deleteProduct,

      productImages,
      getProductImages,
      uploadProductImages,
      updateProductImage,
      deleteProductImage,
    };
  },
  { persist: true }
);
