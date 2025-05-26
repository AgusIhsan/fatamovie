<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const movies = ref([])
const loading = ref(false)
const error = ref(null)
const goToDetail = (id) => {
  router.push(`/movie/${id}`)
}

const idAndSlug = route.params.idAndSlug || ''
const [genreId, ...slugParts] = idAndSlug.split('-')
const genreName = slugParts.join(' ').replace('-', ' ')

const apiKey = import.meta.env.VITE_TMDB_API_KEY // ganti jika kamu passing apiKey sebagai prop

async function fetchMoviesByGenre() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=1`,
    )
    const data = await res.json()
    if (data.results) {
      movies.value = data.results
    } else {
      error.value = 'Failed to load movies'
    }
  } catch (e) {
    error.value = 'Error fetching movies'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMoviesByGenre()
})
</script>

<template>
  <div class="p-4">
    <button @click="router.back()" class="mb-4 text-sm text-blue-400 hover:underline">
      ← Kembali
    </button>
    <h2 class="text-2xl font-bold mb-4 capitalize">{{ genreName }} Movies</h2>

    <div v-if="loading" class="text-gray-500">Loading movies...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="movies.length" class="grid grid-cols-2 md:grid-cols-4 gap-4 cursor-pointer">
      <div
        @click="goToDetail(movie.id)"
        v-for="movie in movies"
        :key="movie.id"
        class="bg-white bg-opacity-5 rounded shadow p-2 text-center hover:border hover:border-white hover:border-opacity-20"
      >
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
          class="w-full h-64 object-cover rounded"
        />
        <p class="mt-2 font-semibold">{{ movie.title }}</p>
      </div>
    </div>
  </div>
</template>
