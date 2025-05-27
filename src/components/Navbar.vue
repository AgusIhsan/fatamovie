<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { store } from '../store'
import debounce from 'lodash.debounce'
import { useSearchMovies } from '../composables/useSearchMovies'

const isAuthReady = ref(false)
const searchQuery = ref('')
const { query, results, loading } = useSearchMovies()
const router = useRouter()

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
watch(searchQuery, (newValue) => {
  if (newValue.trim() === '') return

  // Misalnya redirect ke halaman hasil pencarian
  // atau tampilkan hasil di dropdown

  console.log('Pencarian:', newValue)
  // Contoh redirect:
  // router.push({ path: '/search', query: { q: newValue } })
})

const handleSearch = debounce((value) => {
  if (value.trim() === '') return
  console.log('Debounced search:', value)
  // router.push({ path: '/search', query: { q: value } })
}, 500)

watch(searchQuery, (newValue) => {
  handleSearch(newValue)
})
const goToDetail = (movieId) => {
  query.value = ''
  router.push(`/movie/${movieId}`)
}
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
      <RouterLink to="/movie&show" v-slot="{ isActive }">
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
      <form @submit.prevent="router.push(`/search?q=${query}`)" class="w-full sm:w-auto">
        <div class="relative">
          <input
            v-model="query"
            type="text"
            class="w-full sm:w-64 pr-10 border text-sm rounded-md p-3 bg-transparent border-white border-opacity-10 placeholder-white placeholder-opacity-30 text-white"
            placeholder="Search"
          />

          <svg
            class="w-4 h-4 absolute inset-y-[14px] right-4 flex text-gray-600 hover:text-white"
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

          <div
            v-if="query && results.length"
            class="absolute z-50 bg-black bg-opacity-90 backdrop-blur-md border border-white border-opacity-10 mt-1 w-full rounded text-sm"
          >
            <div
              v-for="result in results"
              :key="result.id"
              class="p-2 hover:bg-white hover:bg-opacity-10 cursor-pointer flex items-center gap-2"
              @click="goToDetail(result.id)"
            >
              <img
                v-if="result.poster_path"
                :src="`https://image.tmdb.org/t/p/w92${result.poster_path}`"
                class="w-8 h-auto rounded"
                alt=""
              />
              <span>{{ result.title }}</span>
            </div>
          </div>
          <div v-if="loading" class="absolute top-3 right-10">
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
        </div>
      </form>

      <!-- Login / Logout -->
      <div v-if="isAuthReady">
        <button
          v-if="!store.user"
          @click="loginWithGoogle"
          class="text-[--primary] font-semibold transition hover:scale-105 px-2 text-sm"
        >
          Login
        </button>
        <button
          v-else
          @click="logout"
          class="text-red-600 font-semibold transition hover:scale-105 px-2 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>
