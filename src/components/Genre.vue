<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select-genre'])
const apiKey = import.meta.env.VITE_TMDB_API_KEY

const genres = ref([])
const loading = ref(false)
const error = ref(null)

const currentIndex = ref(0)
const visibleCount = 4

const visibleGenres = computed(() =>
  genres.value.slice(currentIndex.value, currentIndex.value + visibleCount),
)

function nextSlide() {
  if (currentIndex.value + visibleCount < genres.value.length) {
    currentIndex.value += visibleCount
  }
}

function prevSlide() {
  if (currentIndex.value > 0) {
    currentIndex.value -= visibleCount
  }
}

function selectGenre(genre) {
  const slug = genre.name.toLowerCase().replace(/\s+/g, '-')
  router.push(`/genre/${genre.id}-${slug}`)
}

async function fetchGenres() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
    const data = await res.json()
    if (data.genres) {
      genres.value = data.genres
    } else {
      error.value = 'Failed to load genres'
    }
  } catch (e) {
    error.value = 'Error fetching genres'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGenres()
})
</script>

<style scoped>
/* Pastikan tombol tidak tumpang tindih grid */
.genre-list button {
  top: 50%;
  transform: translateY(-50%);
}
</style>

<template>
  <div class="genre-list relative">
    <h3 class="text-2xl font-semibold mb-4">Genres</h3>

    <div v-if="loading" class="text-gray-500">Loading genres...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div class="relative">
      <!-- Genre Grid Container -->
      <div class="relative flex items-center">
        <!-- Prev Button (Left) -->
        <button
          @click="prevSlide"
          :disabled="currentIndex === 0"
          class="absolute left-0 z-10 disabled:opacity-50"
        >
          <img src="../assets/img/ic-left.svg" alt="" />
        </button>

        <!-- Genre Cards -->
        <div class="mx-12 w-full">
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 transition-all">
            <div
              v-for="genre in visibleGenres"
              :key="genre.id"
              class="p-4 bg-white bg-opacity-5 rounded-xl shadow hover:shadow-md transition cursor-pointer text-center"
              @click="selectGenre(genre)"
            >
              <p class="font-medium text-lg">{{ genre.name }}</p>
            </div>
          </div>
        </div>

        <!-- Next Button (Right) -->
        <button
          @click="nextSlide"
          :disabled="currentIndex + visibleCount >= genres.length"
          class="absolute right-0 z-10 disabled:opacity-50"
        >
          <img src="../assets/img/ic-right.svg" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>
