<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedMovie = ref(null)
const TopRateMovies = ref([])
const showAll = ref(false)
const toastMessage = ref('')
const showToast = ref(false)
const goToDetail = (id) => {
  router.push(`/movie/${id}`)
}

onMounted(async () => {
  const res = await fetch('https://api.themoviedb.org/3/movie/popular', {
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

const triggerToast = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000) // hilang dalam 3 detik
}
</script>

<template>
  <div class="px-4 sm:px-8 lg:px-0">
    <h1 class="text-white text-2xl font-bold mb-4">Popular</h1>

    <transition-group
      name="fade-expand"
      tag="div"
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="movie in displayedMovies"
        :key="movie.id"
        class="relative bg-white bg-opacity-5 text-white p-4 rounded hover:border hover:border-white hover:border-opacity-20 hover:cursor-pointer flex flex-col"
        @click="goToDetail(movie.id)"
      >
        <!-- Poster -->
        <img
          v-if="movie.backdrop_path"
          :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
          alt=""
          class="mb-3 w-full rounded object-cover"
        />

        <!-- Views & Rating Row -->
        <div class="flex flex-col justify-between gap-2 items-start lg:mb-2 lg:flex-row lg:items-center">
          <!-- Views -->
          <div
            class="views flex items-center gap-1 bg-black bg-opacity-30 px-2 py-1 rounded-full border border-white border-opacity-20 text-xs"
          >
            <img src="../assets/img/ic-eye.svg" class="w-4 h-4" alt="views" />
            <span>{{ formatNumber(movie.vote_count) }}</span>
          </div>

          <!-- Rating -->
          <div
            class="rating flex items-center gap-1 bg-black bg-opacity-30 px-2 py-1 rounded-full border border-white border-opacity-20 text-xs"
          >
            <span class="text-yellow-400">{{ getStars(movie.vote_average) }}</span>
            <span class="text-gray-400">
              ({{ movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A' }})
            </span>
          </div>
        </div>
      </div>
    </transition-group>

    <!-- Toggle Button -->
    <div class="mt-6 flex justify-center">
      <button @click="showAll = !showAll" class="text-gray-400 hover:text-white underline">
        {{ showAll ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua' }}
      </button>
    </div>

    <!-- Detail Modal & Toast -->
    <DetailTopRate :movie="selectedMovie" @close="closeModal" @toast="triggerToast" />
    <div
      v-if="showToast"
      class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50 transition-opacity"
    >
      {{ toastMessage }}
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

/* Jika ingin clamp judul 2 baris */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
