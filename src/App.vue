<script setup>
import { RouterView } from 'vue-router'
import Footerr from './components/Footer.vue'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-grow">
      <RouterView class="px-4 sm:px-8 md:px-16 lg:px-48" />
    </main>

    <Footerr />
  </div>
</template>
