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
        <div class="bg-blue-50 shadow-lg rounded-lg p-6 mb-6 border border-blue-100">
            <h2 class="text-2xl font-bold mb-4 text-blue-800 border-b border-blue-200 pb-2">
                {{ editingProduct ? 'Edit Product' : 'Create New Product' }}
            </h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-blue-900 mb-2">Name</label>
                    <input v-model="form.name" type="text" required
                        class="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300" />
                </div>
                <div>
                    <label class="block text-sm font-semibold text-blue-900 mb-2">Description</label>
                    <textarea v-model="form.description"
                        class="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                        rows="3"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-blue-900 mb-2">Price</label>
                    <input v-model="form.price" type="text" required
                        class="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                        placeholder="e.g. $25.00 or 'Custom quote'" />
                </div>
                <div class="flex items-center py-2">
                    <label class="flex items-center text-blue-900 font-semibold">
                        <input v-model="form.active" type="checkbox" class="mr-2 h-5 w-5 text-blue-600" />
                        Active
                    </label>
                </div>
                <div class="flex justify-end space-x-3 pt-4 border-t border-blue-200">
                    <button v-if="editingProduct" type="button" @click="cancelEdit"
                        class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                        {{ editingProduct ? 'Update' : 'Create New' }}
                    </button>
                </div>
            </form>
        </div>

        <div v-if="editingProduct" class="bg-white shadow rounded-lg mb-6">
            <ProductImageManager :product-id="editingProduct" />
        </div>

        <!-- Products List -->
        <h2 class="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Product List</h2>
        <div class="bg-white shadow rounded-lg">
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left">Name</th>
                        <th class="px-4 py-2 text-left">Price</th>
                        <th class="px-4 py-2 text-center">Images</th>
                        <th class="px-4 py-2 text-center">Status</th>
                        <th class="px-4 py-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="productStore.products.length === 0">
                        <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                            No products available. Create one using the form above.
                        </td>
                    </tr>
                    <tr v-else v-for="product in productStore.products" :key="product.id" class="border-t">
                        <td class="px-4 py-2">{{ product.name }}</td>
                        <td class="px-4 py-2">{{ product.price }}</td>
                        <td class="px-4 py-2 text-center">
                            <span class="text-gray-600">
                                {{ product.images?.length || 0 }}
                            </span>
                        </td>
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
import type { DBProduct, DBProductWithImages } from '@/types/database'
import ProductImageManager from '@/components/ProductImageManager.vue'


const productStore = useProductStore()
const editingProduct = ref<string | null>(null)

const form = ref({
    name: '',
    description: '',
    price: '',
    active: true
})

onMounted(async () => {
    await productStore.getAllProducts()
})

function resetForm() {
    form.value = {
        name: '',
        description: '',
        price: '',
        active: true
    }
    editingProduct.value = null
}

function editProduct(product: DBProductWithImages) {
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