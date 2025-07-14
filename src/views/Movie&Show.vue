<script setup>
import Popular from '@/components/Popular.vue'
import Terbaru from '@/components/Terbaru.vue'
import TopRated from '@/components/TopRate.vue'
import Upcoming from '@/components/Upcoming.vue'
</script>

<template>
  <div
    class="relative flex flex-col gap-12 sm:gap-16 border border-white border-opacity-10 rounded-md mt-8 mx-4 sm:px-8 py-10 px-1 lg:mx-48 lg:px-8 my-12 sm:py-16"
  >
    <h1
      class="absolute -top-4 left-4 sm:left-8 text-lg sm:text-xl bg-white bg-opacity-10 backdrop-blur-sm py-1 px-3 sm:px-4 rounded-sm"
    >
      Movies
    </h1>
    <TopRated />
    <Upcoming />
    <Terbaru />
    <Popular />
  </div>
</template>
