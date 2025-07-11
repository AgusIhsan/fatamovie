<script setup>
import bgImage from '@/assets/img/bg-footer.jpg'
import { store } from '../store'
</script>

<template>
  <footer class="relative px-4 sm:px-8 lg:px-48 py-12 text-white mt-20 text-center sm:text-left">
    <!-- Background Image -->
    <div
      class="absolute inset-0 z-0"
      :style="{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    ></div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

    <!-- Content -->
    <div class="relative z-20 flex flex-col sm:flex-row justify-between items-center gap-8">
      <!-- Logo -->
      <img
        src="../assets/img/logo-fatamovie-potrait.svg"
        alt="FataMovie Logo"
        class="w-16 sm:w-24"
      />

      <!-- Greeting -->
      <p
        v-if="store.user"
        class="text-sm sm:text-base bg-white text-[--primary] font-bold p-2 rounded"
      >
        Halo, {{ store.user.displayName + '!' }}
      </p>

      <!-- Links -->
      <div class="flex flex-col gap-2 text-sm sm:text-base text-center sm:text-right">
        <a
          href="https://www.themoviedb.org/privacy-policy"
          class="hover:text-[--primary] transition"
          target="_blank"
        >
          API Terms of Use
        </a>
        <a
          href="https://developer.themoviedb.org/docs/getting-started"
          class="hover:text-[--primary] transition"
          target="_blank"
        >
          API Documentation
        </a>
        <a>
          ©agusihsan | 2025
        </a>
      </div>
    </div>
  </footer>
</template>
