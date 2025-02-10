<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Product Management</h1>

        <!-- Loading state -->
        <div v-if="productStore.loading" class="text-center py-4">
            Loading...
        </div>

        <!-- Error state -->
        <div v-if="productStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ productStore.error }}
        </div>

        <!-- Product Creation Form -->
        <div class="bg-white shadow rounded-lg p-4 mb-6">
            <h2 class="text-xl font-semibold mb-4">{{ editingProduct ? 'Edit Product' : 'Create New Product' }}</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input v-model="form.name" type="text" required class="w-full p-2 border rounded" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Description</label>
                    <textarea v-model="form.description" class="w-full p-2 border rounded" rows="3"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Price</label>
                    <input v-model="form.price" type="number" required step="0.01" class="w-full p-2 border rounded" />
                </div>
                <div class="flex items-center">
                    <label class="flex items-center">
                        <input v-model="form.active" type="checkbox" class="mr-2" />
                        Active
                    </label>
                </div>
                <div class="flex justify-end space-x-2">
                    <button v-if="editingProduct" type="button" @click="cancelEdit"
                        class="px-4 py-2 bg-gray-200 rounded">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
                        {{ editingProduct ? 'Update' : 'Create' }}
                    </button>
                </div>
            </form>
        </div>

        <div v-if="editingProduct" class="bg-white shadow rounded-lg p-4 mb-6">
            <ProductImageManager :product-id="editingProduct" />
        </div>

        <!-- Products List -->
        <div class="bg-white shadow rounded-lg">
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left">Name</th>
                        <th class="px-4 py-2 text-left">Price</th>
                        <th class="px-4 py-2 text-center">Status</th>
                        <th class="px-4 py-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="productStore.products.length === 0">
                        <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                            No products available. Create one using the form above.
                        </td>
                    </tr>
                    <tr v-else v-for="product in productStore.products" :key="product.id" class="border-t">
                        <td class="px-4 py-2">{{ product.name }}</td>
                        <td class="px-4 py-2">${{ product.price.toFixed(2) }}</td>
                        <td class="px-4 py-2 text-center">
                            <span :class="product.active ? 'text-green-600' : 'text-red-600'">
                                {{ product.active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-4 py-2 text-right space-x-2">
                            <button @click="editProduct(product)" class="text-blue-500 hover:text-blue-700">
                                Edit
                            </button>
                            <button @click="deleteProduct(product.id)" class="text-red-500 hover:text-red-700">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '~/stores/products'
import type { DBProduct } from '@/types/database'
import ProductImageManager from '@/components/ProductImageManager.vue'


const productStore = useProductStore()
const editingProduct = ref<string | null>(null)

const form = ref({
    name: '',
    description: '',
    price: 0,
    active: true
})

onMounted(async () => {
    await productStore.getAllProducts()
})

function resetForm() {
    form.value = {
        name: '',
        description: '',
        price: 0,
        active: true
    }
    editingProduct.value = null
}

function editProduct(product: DBProduct) {
    editingProduct.value = product.id
    form.value = {
        name: product.name,
        description: product.description || '',
        price: product.price,
        active: product.active
    }
}

function cancelEdit() {
    resetForm()
}

async function handleSubmit() {
    try {
        if (editingProduct.value) {
            await productStore.updateProduct(editingProduct.value, form.value)
        } else {
            await productStore.createProduct(form.value)
        }
        resetForm()
    } catch (error) {
        console.error('Error submitting form:', error)
    }
}

async function deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await productStore.deleteProduct(id)
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }
}

// Admin check middleware
definePageMeta({
    middleware: 'admin'
})
</script>