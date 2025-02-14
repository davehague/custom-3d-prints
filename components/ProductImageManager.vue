<template>
    <div class="bg-blue-50 border border-blue-100 p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-blue-200 pb-4">
            <h3 class="text-2xl font-bold text-blue-800">Product Images</h3>
            <label
                class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': isProcessing }">
                Upload Images
                <input type="file" multiple accept="image/*" class="hidden" @change="handleFileUpload"
                    :disabled="isProcessing" />
            </label>
        </div>

        <!-- Processing state -->
        <div v-if="isProcessing" class="bg-blue-100/50 rounded-lg p-4 space-y-2">
            <div class="flex items-center justify-between text-blue-800">
                <span>Processing images...</span>
                <span>{{ processedCount }}/{{ totalFiles }} complete</span>
            </div>
            <div class="w-full bg-blue-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(processedCount / totalFiles) * 100}%` }" />
            </div>
            <div v-if="processingStats.length > 0" class="text-sm text-blue-700 space-y-1">
                <div v-for="(stat, index) in processingStats" :key="index">
                    {{ stat }}
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading && !isProcessing" class="text-center py-4 text-blue-800">
            Loading...
        </div>

        <!-- Image grid -->
        <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="image in images" :key="image.id" class="relative group">
                <img :src="image.public_url"
                    class="w-full h-40 object-cover rounded-lg transition-all duration-200 border border-blue-200"
                    :class="{ 'ring-2 ring-blue-500 ring-offset-2': image.is_primary }" />

                <!-- Primary badge -->
                <div v-if="image.is_primary"
                    class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Primary
                </div>

                <div
                    class="absolute inset-0 bg-blue-900 bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 rounded-lg">
                    <button @click="setPrimaryImage(image.id)"
                        class="px-4 py-2 rounded-lg text-white transition-colors font-semibold"
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
                        class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors font-semibold">
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-8 bg-blue-100/50 rounded-lg border border-blue-200 text-blue-800">
            No images uploaded yet
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import type { DBProductImage } from '@/types/database'

// Constants for image processing
const MAX_FILE_SIZE_MB = 2
const MAX_WIDTH = 1920
const MAX_HEIGHT = 1920

interface ProcessedImage {
    file: File
    width: number
    height: number
    originalSize: number
    newSize: number
}

const props = defineProps<{
    productId: string
}>()

const productStore = useProductStore()
const images = ref<DBProductImage[]>([])
const loading = ref(false)
const isProcessing = ref(false)
const processedCount = ref(0)
const totalFiles = ref(0)
const processingStats = ref<string[]>([])

onMounted(async () => {
    await loadImages()
})

const processImage = async (file: File): Promise<ProcessedImage> => {
    // Create a promise wrapper around image loading
    const loadImage = (file: File): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = URL.createObjectURL(file)
        })
    }

    const img = await loadImage(file)
    const canvas = document.createElement('canvas')
    let { width, height } = img

    // Calculate new dimensions while maintaining aspect ratio
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
        width = Math.floor(width * ratio)
        height = Math.floor(height * ratio)
    }

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    // Draw and compress the image
    ctx.drawImage(img, 0, 0, width, height)

    // Try different quality settings to get under maxSizeMB
    let quality = 0.9
    let blob: Blob
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024

    do {
        blob = await new Promise(resolve => {
            canvas.toBlob(b => resolve(b!), 'image/jpeg', quality)
        })
        quality -= 0.1
    } while (blob.size > maxBytes && quality > 0.1)

    // Clean up
    URL.revokeObjectURL(img.src)

    // Convert blob to file
    const processedFile = new File([blob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
    })

    return {
        file: processedFile,
        width,
        height,
        originalSize: file.size,
        newSize: processedFile.size
    }
}

const formatFileSize = (bytes: number): string => {
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`
}

const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return

    try {
        isProcessing.value = true
        loading.value = true
        processedCount.value = 0
        processingStats.value = []

        const files = Array.from(input.files)
        totalFiles.value = files.length

        // Process each image
        const processedFiles = await Promise.all(
            files.map(async (file) => {
                // Basic validation
                if (!file.type.startsWith('image/')) {
                    throw new Error(`${file.name} is not an image file`)
                }

                try {
                    const processed = await processImage(file)
                    processedCount.value++

                    const stat = `${file.name}: ${formatFileSize(processed.originalSize)} → ${formatFileSize(processed.newSize)}`
                    processingStats.value.push(stat)

                    return processed.file
                } catch (error) {
                    console.error(`Error processing ${file.name}:`, error)
                    throw error
                }
            })
        )

        await productStore.uploadProductImages(props.productId, processedFiles)
        await loadImages()
    } catch (error) {
        console.error('Error uploading files:', error)
    } finally {
        loading.value = false
        isProcessing.value = false
        input.value = ''
    }
}

const loadImages = async () => {
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

const setPrimaryImage = async (imageId: string) => {
    try {
        loading.value = true
        await productStore.updateProductImage(props.productId, {
            imageId,
            isPrimary: true
        })
        await loadImages()
    } catch (error) {
        console.error('Error setting primary image:', error)
    } finally {
        loading.value = false
    }
}

const deleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
        loading.value = true
        await productStore.deleteProductImage(props.productId, imageId)
        await loadImages()
    } catch (error) {
        console.error('Error deleting image:', error)
    } finally {
        loading.value = false
    }
}
</script>