<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { store } from './store'

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
  <header>
    <div class="flex justify-between items-center my-8">
      <img src="../src/assets/img/logo-fatamovie.svg" alt="" />
      <nav class="flex items-center gap-2">
        <RouterLink to="/" v-slot="{ isActive }">
          <div
            :class="[
              'rounded-md bg-opacity-10 px-5 py-3',
              isActive ? 'bg-gray-500' : 'text-gray-500',
            ]"
          >
            Home
          </div>
        </RouterLink>
        <RouterLink to="/about" v-slot="{ isActive }">
          <div
            :class="[
              'rounded-md bg-opacity-10 px-5 py-3',
              isActive ? 'bg-gray-500' : 'text-gray-500',
            ]"
          >
            Movie & Show
          </div>
        </RouterLink>
        <RouterLink to="/saved" v-slot="{ isActive }">
          <div
            :class="[
              'rounded-md bg-opacity-10 px-5 py-3',
              isActive ? 'bg-gray-500' : 'text-gray-500',
            ]"
          >
            Favorite
          </div>
        </RouterLink>
        <RouterLink to="/none" v-slot="{ isActive }">
          <div
            :class="[
              'rounded-md bg-opacity-10 px-5 py-3',
              isActive ? 'bg-gray-500' : 'text-gray-500',
            ]"
          >
            Support
          </div>
        </RouterLink>
      </nav>
      <div class="flex gap-2 right-sec">
        <form class="flex items-center">
          <div class="relative">
            <input
              type="text"
              id="simple-search"
              class="w-full pr-10 border text-gray-900 text-sm rounded-md p-3 bg-transparent border-white border-opacity-10 placeholder-white placeholder-opacity-30 text-white"
              placeholder="Search"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 hover:text-white"
            >
              <svg
                class="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
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
        <div v-if="isAuthReady" class="buatLogin">
          <button
            v-if="!store.user"
            @click="loginWithGoogle"
            class="flex gap-1 hover:bg-[#3946D1] font-semibold text-md bg-[--primary] transform transition duration-300 hover:scale-105 rounded-md px-8 py-3"
          >
            Login Dulu Cuiy
          </button>

          <div v-else>
            <!-- <p class="text-white">Halo, {{ store.user.displayName }}</p> -->
            <button
              @click="logout"
              class="flex gap-1 hover:bg-red-600 font-semibold text-md bg-red-500 transform transition duration-300 hover:scale-105 rounded-md px-8 py-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <RouterView />
</template>
