<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div class="container mx-auto px-4 py-16 md:py-24">
            <div class="max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                <div v-if="loggedIn" class="text-center">
                    <img :src="(user as DBUser)?.picture" :alt="(user as DBUser)?.name"
                        class="w-24 h-24 rounded-full mx-auto mb-4">
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">
                        Welcome {{ (user as DBUser)?.name }}!
                    </h1>
                    <p class="text-gray-600 mb-6">
                        Logged in since {{ formatDate(session.loggedInAt) }}
                    </p>
                    <button @click="clear"
                        class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300">
                        Logout
                    </button>
                </div>
                <div v-else class="text-center">
                    <div class="mb-8">
                        <i class="i-heroicons-book-open text-5xl text-blue-600"></i>
                        <h1 class="text-2xl font-bold text-gray-900 mt-4">
                            VCI Admin Portal
                        </h1>
                        <p class="text-gray-600 mt-2">
                            Sign in with Google to administer the site
                        </p>
                    </div>
                    <div class="flex flex-col gap-4 items-center">
                        <a href="/api/auth/google"
                            class="inline-flex items-center bg-white border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 shadow-sm">
                            <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5 mr-2">
                            Login with Google
                        </a>
                        <NuxtLink to="/" class="text-gray-600 hover:text-gray-800 transition-colors duration-300">
                            ← Back to Home
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type DBUser } from '@/types/interfaces'

definePageMeta({
    layout: 'landing'
})

const { loggedIn, user, session, clear } = useUserSession()
console.log('🔑 useUserSession user:', user.value)

const formatDate = (date: unknown): string => {
    if (date instanceof Date) {
        return date.toLocaleString()
    }
    if (typeof date === 'string') {
        return new Date(date).toLocaleString()
    }
    return 'Unknown date'
}

watch(loggedIn, (newValue) => {
    if (newValue) {
        console.log('🔑 User logged in:', (user.value as DBUser)?.email)
    } else {
        console.log('👋 User logged out')
    }
})
</script>