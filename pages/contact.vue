<template>
    <div class="container mx-auto px-4 py-8 max-w-2xl">
        <h1 class="text-3xl font-bold mb-6">Contact Us</h1>

        <p class="mb-6">Send us an email at <a href="mailto:virtualcraftinnovations@gmail.com"
                class="text-blue-600 hover:text-blue-800">virtualcraftinnovations@gmail.com</a> or use the form below
        </p>

        <div v-if="productInfo" class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-blue-800">Requesting quote for: {{ productInfo }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name *</label>
                <input v-model="form.name" type="text" id="name" required
                    class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    :class="{ 'border-red-500': showValidation && !form.name }" />
                <p v-if="showValidation && !form.name" class="mt-1 text-sm text-red-600">Name is required</p>
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email *</label>
                <input v-model="form.email" type="email" id="email" required
                    class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    :class="{ 'border-red-500': showValidation && !form.email }" />
                <p v-if="showValidation && !form.email" class="mt-1 text-sm text-red-600">Email is required</p>
            </div>

            <div>
                <label for="message" class="block text-sm font-medium text-gray-700">Message *</label>
                <textarea v-model="form.message" id="message" rows="4" required
                    class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    :class="{ 'border-red-500': showValidation && !form.message }"></textarea>
                <p v-if="showValidation && !form.message" class="mt-1 text-sm text-red-600">Message is required</p>
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
import { useRoute, useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const route = useRoute();
const productInfo = ref('');
const submitted = ref(false);
const showValidation = ref(false);

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
    showValidation.value = true;

    if (!form.value.name || !form.value.email || !form.value.message) {
        return;
    }

    try {
        const response = await fetch('/api/sendEmails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                toEmail: config.public.customQuoteEmail,
                subject: 'New Contact Form Submission',
                htmlTemplate: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${form.value.name}</p>
                    <p><strong>Email:</strong> ${form.value.email}</p>
                    <p><strong>Message:</strong> ${form.value.message}</p>
                    ${productInfo.value ? `<p><strong>Product:</strong> ${productInfo.value}</p>` : ''}
                `
            }),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        submitted.value = true;
        form.value = {
            name: '',
            email: '',
            message: ''
        };
    } catch (error) {
        console.error('Failed to send message:', error);
        // You might want to add error handling UI here
    }
};
</script>
