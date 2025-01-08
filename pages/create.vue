<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4 text-center">Create a 3D Model</h1>
    <div class="mb-4">
      <label for="model-description" class="block text-sm font-medium mb-2">
        Describe your 3D model:
      </label>
      <input id="model-description" v-model="userInput" placeholder="Enter model description..."
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
    </div>
    <button @click="handleGenerate" :disabled="isLoading"
      class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300 disabled:bg-gray-300 disabled:cursor-not-allowed">
      {{ isLoading ? 'Generating...' : 'Generate Model' }}
    </button>

    <div v-if="isLoading" class="mt-6">
      <p class="text-center text-gray-700">{{ statusMessage }}</p>
      <div class="w-full bg-gray-200 rounded-full h-4 mt-4">
        <div class="bg-blue-500 h-4 rounded-full transition-all" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <div v-if="previewUrl || refinedUrl" class="mt-6">
      <h2 class="text-lg font-bold text-center mb-4">Download Your Model</h2>
      <div v-if="previewUrl" class="text-center mb-2">
        <a :href="previewUrl" download="preview_model.glb" class="text-blue-500 hover:underline">
          Download Preview Model
        </a>
      </div>
      <div v-if="refinedUrl" class="text-center">
        <a :href="refinedUrl" download="refined_model.glb" class="text-blue-500 hover:underline">
          Download Refined Model
        </a>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

const userInput = ref('');
const isLoading = ref(false);
const statusMessage = ref('');
const progress = ref(0);
const previewUrl = ref<string | null>(null);
const refinedUrl = ref<string | null>(null);

const handleGenerate = async () => {
  if (!userInput.value.trim()) {
    alert('Please enter a description for the 3D model.');
    return;
  }

  isLoading.value = true;
  progress.value = 0;
  statusMessage.value = 'Initializing...';
  previewUrl.value = null;
  refinedUrl.value = null;

  try {
    // const response = await $fetch('/api/generate3DModel', {
    //   method: 'POST',
    //   body: { prompt: userInput.value },
    //   onDownloadProgress: (event) => {
    //     // Simulated real-time progress updates for API
    //     const newProgress = event.progress * 100;
    //     progress.value = Math.max(progress.value, Math.floor(newProgress));
    //     statusMessage.value = `Generating model... ${progress.value}%`;
    //   },
    // });

    // previewUrl.value = response.previewModelUrl || null;
    // refinedUrl.value = response.refinedModelUrl || null;

    previewUrl.value = "https://prints.davehague.com/";
    refinedUrl.value = "https://prints.davehague.com/";

    statusMessage.value = 'Model generation completed!';
    progress.value = 100;
  } catch (error) {
    console.error('Failed to generate 3D model:', error);
    statusMessage.value = 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>
