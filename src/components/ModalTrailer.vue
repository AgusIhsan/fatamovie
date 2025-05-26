<script setup>
defineProps(['videoKey'])
defineEmits(['close'])
</script>

<template>
  <div
    v-if="videoKey"
    class="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center"
  >
    <div class="relative w-full max-w-3xl aspect-video">
      <iframe
        class="w-full h-full rounded"
        :src="`https://www.youtube.com/embed/${videoKey}?autoplay=1`"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
      <button
        class="absolute top-2 right-2 bg-red-600 text-white px-4 py-2 rounded"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>
  </div>
</template>
