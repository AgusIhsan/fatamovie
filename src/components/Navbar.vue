<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { store } from '../store'

const isAuthReady = ref(false)

// Fungsi login
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    store.user = result.user
  } catch (err) {
    console.error('Login gagal:', err)
  }
}

// Fungsi logout
const logout = async () => {
  const konfirmasi = confirm('Apakah kamu yakin ingin logout?')
  if (!konfirmasi) return

  try {
    await signOut(auth)
    store.user = null
  } catch (err) {
    console.error('Logout gagal:', err)
  }
}

// Pantau status login setiap reload
onAuthStateChanged(auth, (user) => {
  store.user = user
  isAuthReady.value = true
})
</script>

<template>
  <header
    class="px-4 sm:px-8 lg:px-48 py-4 flex flex-wrap gap-y-4 justify-between items-center text-white"
  >
    <!-- Logo -->
    <img src="../assets/img/logo-fatamovie.svg" alt="FataMovie Logo" class="w-28 sm:w-36" />

    <!-- Navigation -->
    <nav
      class="flex flex-wrap gap-2 items-center justify-center sm:justify-start text-sm sm:text-base"
    >
      <RouterLink to="/" v-slot="{ isActive }">
        <div
          :class="[
            'rounded-md bg-opacity-10 px-4 py-2 transition-all',
            isActive ? 'bg-gray-500' : 'text-gray-500 hover:text-white',
          ]"
        >
          Home
        </div>
      </RouterLink>
      <RouterLink to="/about" v-slot="{ isActive }">
        <div
          :class="[
            'rounded-md bg-opacity-10 px-4 py-2 transition-all',
            isActive ? 'bg-gray-500' : 'text-gray-500 hover:text-white',
          ]"
        >
          Movie & Show
        </div>
      </RouterLink>
      <RouterLink to="/saved" v-slot="{ isActive }">
        <div
          :class="[
            'rounded-md bg-opacity-10 px-4 py-2 transition-all',
            isActive ? 'bg-gray-500' : 'text-gray-500 hover:text-white',
          ]"
        >
          Favorite
        </div>
      </RouterLink>
    </nav>

    <!-- Search + Auth -->
    <div class="flex flex-row gap-2 items-center w-full sm:w-auto justify-end">
      <!-- Search -->
      <form class="w-full sm:w-auto">
        <div class="relative">
          <input
            type="text"
            class="w-full sm:w-64 pr-10 border text-sm rounded-md p-3 bg-transparent border-white border-opacity-10 placeholder-white placeholder-opacity-30 text-white"
            placeholder="Search"
            required
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>
      </form>

      <!-- Login / Logout -->
      <div v-if="isAuthReady">
        <button
          v-if="!store.user"
          @click="loginWithGoogle"
          class="flex gap-1 items-center justify-center hover:bg-[#3946D1] font-semibold bg-[--primary] transition hover:scale-105 rounded-md px-6 py-3 text-sm"
        >
          Login
        </button>
        <button
          v-else
          @click="logout"
          class="flex gap-1 items-center justify-center hover:bg-red-600 font-semibold bg-red-500 transition hover:scale-105 rounded-md px-6 py-3 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>
