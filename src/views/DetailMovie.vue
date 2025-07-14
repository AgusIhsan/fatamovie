<!-- src/views/PageDetail.vue -->
<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { store } from '../store'
import { useToast } from 'vue-toastification'
import { useTrailer } from '../composables/useTrailer'
import ModalTrailer from '@/components/ModalTrailer.vue'

const { showTrailer, videoKey, openTrailer, closeTrailer } = useTrailer()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const movie = ref(null)
const loading = ref(true)

const getStars = (voteAverage) => {
  const starCount = Math.round(voteAverage / 2)
  return '★'.repeat(starCount) + '☆'.repeat(5 - starCount)
}

const fetchMovieDetail = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${route.params.id}?api_key=064369659a2a6f5b4ba5e086c7b51518&language=en-US`,
    )
    const data = await res.json()
    movie.value = data
  } catch (err) {
    toast.error('Gagal mengambil detail movie.')
  } finally {
    loading.value = false
  }
}

const saveMovie = async () => {
  if (!store.user) {
    toast.error('Login terlebih dahulu.')
    return
  }
  try {
    const userMovieRef = doc(db, `users/${store.user.uid}/savedMovies/${movie.value.id}`)
    const existingDoc = await getDoc(userMovieRef)
    if (existingDoc.exists()) {
      toast.error('Film telah ditambahkan sebelumnya.')
      return
    }
    await setDoc(userMovieRef, movie.value)
    toast.success('Berhasil ditambahkan ke Favorite!')
  } catch (err) {
      console.error("SAVE ERROR:", err)
    toast.error('Gagal menambahkan film.')
  }
}

onMounted(fetchMovieDetail)

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchMovieDetail()
    }
  },
)
</script>

<template>
  <div class="py-2 lg:py-8 mx-4 md:mx-12 lg:mx-48 text-white">
    <button @click="router.back()" class="mb-4 text-sm text-blue-400 hover:underline">
      ← Kembali
    </button>

    <div v-if="loading">Loading...</div>

    <div v-else-if="movie" class="flex flex-col md:flex-row gap-8">
      <img
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        alt=""
        class="w-full max-w-[250px] rounded self-center md:self-start"
      />
      <div>
        <h1 class="text-2xl font-bold mb-2">{{ movie.title }}</h1>
        <p class="mb-4 leading-relaxed text-sm sm:text-base">{{ movie.overview }}</p>
        <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
        <p>
          <strong>Rating:</strong> {{ getStars(movie.vote_average) }}
          <span>{{ '(' + movie.vote_average + ')' }}</span>
        </p>
        <p><strong>Views:</strong> {{ movie.vote_count }}</p>
        <p><strong>Popularity:</strong> {{ movie.popularity }}</p>
        <div class="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            @click="saveMovie"
            class="bg-blue-400 px-3 py-1 rounded-full bg-opacity-20 text-sm text-white hover:bg-opacity-40 flex items-center gap-1"
          >
            <img src="../assets/img/ic-fav.svg" alt="" class="w-4 h-4" />
            Save
          </button>
          <button
            @click="openTrailer(movie.id)"
            class="bg-blue-400 px-3 py-1 rounded-full bg-opacity-20 text-sm text-white hover:bg-opacity-40 flex items-center gap-1"
          >
            <img src="../assets/img/ic-play.svg" alt="" class="w-4 h-4" />
            Play Trailer
          </button>
        </div>
      </div>
    </div>
  </div>

  <ModalTrailer v-if="showTrailer" :videoKey="videoKey" @close="closeTrailer" />
</template>
