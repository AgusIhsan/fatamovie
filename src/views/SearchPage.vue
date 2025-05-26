<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const query = ref(route.query.q || '')
const results = ref([])
const loading = ref(false)

const fetchSearch = async () => {
  if (!query.value) return
  loading.value = true
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=064369659a2a6f5b4ba5e086c7b51518&query=${encodeURIComponent(query.value)}`,
    )
    const data = await res.json()
    results.value = data.results
  } finally {
    loading.value = false
  }
}

onMounted(fetchSearch)
watch(
  () => route.query.q,
  (newQ) => {
    query.value = newQ
    fetchSearch()
  },
)
</script>

<template>
  <div class="px-4 sm:px-8 lg:px-48 py-8 text-white">
    <h1 class="text-2xl font-bold mb-4">Hasil pencarian untuk "{{ query }}"</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="results.length === 0">Tidak ada hasil ditemukan.</div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="movie in results"
        :key="movie.id"
        @click="$router.push(`/movie/${movie.id}`)"
        class="cursor-pointer hover:opacity-80"
      >
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
          class="rounded"
          alt=""
        />
        <p class="text-sm mt-2">{{ movie.title }}</p>
      </div>
    </div>
  </div>
</template>
