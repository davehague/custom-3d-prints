<template>
    <div class="container mx-auto px-4 py-8 max-w-2xl">
        <h1 class="text-3xl font-bold mb-6">Contact Us</h1>

        <div v-if="productInfo" class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-blue-800">Requesting quote for: {{ productInfo }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input v-model="form.name" type="text" id="name" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input v-model="form.email" type="email" id="email" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>

            <div>
                <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
                <textarea v-model="form.message" id="message" rows="4" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>

            <button type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors">
                Send Message
            </button>
        </form>

        <div v-if="submitted" class="mt-6 p-4 bg-green-50 rounded-lg">
            <p class="text-green-800">Thank you for your message. We'll get back to you soon!</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const productInfo = ref('');
const submitted = ref(false);

const form = ref({
    name: '',
    email: '',
    message: ''
});

onMounted(() => {
    const product = route.query.product as string;
    if (product) {
        productInfo.value = product;
        form.value.message = `I'm interested in getting a quote for ${product}.`;
    }
});

const handleSubmit = async () => {
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', {
        ...form.value,
        productId: route.query.id
    });

    submitted.value = true;
    form.value = {
        name: '',
        email: '',
        message: ''
    };
};
</script>
