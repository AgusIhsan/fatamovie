<script setup>
import Popular from '@/components/Popular.vue'
import Trending from '@/components/Trending.vue'
import TopRated from '@/components/TopRate.vue'
</script>
<template>
  <div
    class="relative flex flex-col gap-16 container-list border border-white border-opacity-10 rounded-md py-16 px-8 mt-20"
  >
    <h1
      class="absolute -top-4 left-10 text-xl bg-white bg-opacity-10 backdrop-blur-sm py-1 px-4 rounded-sm"
    >
      Movies
    </h1>
    <Popular />
    <!-- <Trending /> -->
    <TopRated />
  </div>
</template>
