<script setup>
import { ref, onMounted, computed } from 'vue'

const TopRateMovies = ref([])
const showAll = ref(false)

onMounted(async () => {
  const res = await fetch('https://api.themoviedb.org/3/movie/top_rated', {
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjQzNjk2NTlhMmE2ZjViNGJhNWUwODZjN2I1MTUxOCIsIm5iZiI6MTc0NzcxMzE3Mi42OTIsInN1YiI6IjY4MmJmYzk0NDM3ZmFkY2M2ZjY0OTNiYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gNzrGouvyaTuVIB_HGxIyYd2XtBE0uip8LMI_UZ_21E',
    },
  })
  const data = await res.json()
  TopRateMovies.value = data.results.sort((a, b) => b.vote_average - a.vote_average)
})

// computed array berdasarkan showAll
const displayedMovies = computed(() =>
  showAll.value ? TopRateMovies.value : TopRateMovies.value.slice(0, 4),
)
const getStars = (voteAverage) => {
  const starCount = Math.round(voteAverage / 2)
  return '★'.repeat(starCount) + '☆'.repeat(5 - starCount)
}
const formatNumber = (num) => {
  const absNum = Math.floor(num) // amankan angka desimal
  if (absNum >= 1_000_000) return Math.round(absNum / 1_000_000) + 'M'
  if (absNum >= 1_000) return Math.round(absNum / 1_000) + 'k'
  return absNum.toString()
}
console.log(formatNumber(34646)) // → 35k
console.log(formatNumber(31681.4)) // → 32k
console.log(formatNumber(100000)) // → 100k
console.log(formatNumber(999)) // → 999
console.log(formatNumber(100.0)) // → 100
</script>

<template>
  <div>
    <h1 class="text-white text-2xl font-bold mb-6">Top Rated</h1>

    <transition-group name="fade-expand" tag="div" class="grid grid-cols-4 gap-4">
      <div
        v-for="movie in displayedMovies"
        :key="movie.id"
        class="relative bg-gray-800 text-white p-4 rounded"
      >
        <img
          v-if="movie.backdrop_path"
          :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
          alt=""
          class="mb-2 w-full rounded"
        />
        <div class="flex justify-between">
          <div class="views flex items-center gap-1">
            <img src="../assets/img/ic-eye.svg" class="w-4" alt="" />
            <p class="text-sm">{{ formatNumber(movie.vote_count) }}</p>
          </div>
          <div class="rating">
            <span class="text-yellow-400">{{ getStars(movie.vote_average) }}</span>
            <span class="text-gray-400">
              ({{ movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A' }})
            </span>
          </div>
        </div>
      </div>
    </transition-group>

    <div class="mt-6 flex justify-end">
      <button @click="showAll = !showAll" class="text-gray-400 hover:text-white underline">
        {{ showAll ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-expand-enter-active,
.fade-expand-leave-active {
  transition: all 0.3s ease;
}
.fade-expand-enter-from,
.fade-expand-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
