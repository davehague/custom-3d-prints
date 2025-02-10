// components/ProductImageManager.vue
<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Product Images</h3>
            <label class="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Upload Images
                <input type="file" multiple accept="image/*" class="hidden" @change="handleFileUpload" />
            </label>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-4">
            Loading...
        </div>

        <!-- Image grid -->
        <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="image in images" :key="image.id" class="relative group">
                <img :src="image.public_url" class="w-full h-40 object-cover rounded transition-all duration-200"
                    :class="{ 'ring-2 ring-blue-500 ring-offset-2': image.is_primary }" />

                <!-- Primary badge -->
                <div v-if="image.is_primary"
                    class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Primary
                </div>

                <div
                    class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button @click="setPrimaryImage(image.id)" class="p-2 rounded text-white transition-colors"
                        :class="image.is_primary ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'"
                        :disabled="image.is_primary"
                        :title="image.is_primary ? 'This is the primary image' : 'Set as primary image'">
                        <template v-if="image.is_primary">
                            ✓ Primary
                        </template>
                        <template v-else>
                            Set Primary
                        </template>
                    </button>
                    <button @click="deleteImage(image.id)"
                        class="p-2 bg-red-500 hover:bg-red-600 rounded text-white transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-8 bg-gray-50 rounded">
            No images uploaded yet
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import type { DBProductImage } from '@/types/database'

const props = defineProps<{
    productId: string
}>()

const productStore = useProductStore()
const images = ref<DBProductImage[]>([])
const loading = ref(false)

onMounted(async () => {
    await loadImages()
})

async function loadImages() {
    try {
        loading.value = true
        const result = await productStore.getProductImages(props.productId)
        images.value = result
    } catch (error) {
        console.error('Error loading images:', error)
    } finally {
        loading.value = false
    }
}

async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return

    try {
        loading.value = true
        const files = Array.from(input.files)
        await productStore.uploadProductImages(props.productId, files)
        await loadImages() // Reload images after upload
    } catch (error) {
        console.error('Error uploading files:', error)
    } finally {
        loading.value = false
        // Reset input
        input.value = ''
    }
}

async function setPrimaryImage(imageId: string) {
    try {
        loading.value = true;
        await productStore.updateProductImage(props.productId, {
            imageId,
            isPrimary: true
        });
        await loadImages(); // Reload to get updated primary status
    } catch (error) {
        console.error('Error setting primary image:', error);
    } finally {
        loading.value = false;
    }
}

async function deleteImage(imageId: string) {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
        loading.value = true
        await productStore.deleteProductImage(props.productId, imageId)
        await loadImages() // Reload images after deletion
    } catch (error) {
        console.error('Error deleting image:', error)
    } finally {
        loading.value = false
    }
}
</script>