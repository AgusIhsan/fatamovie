<script setup>
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { store } from '../store'
import { useToast } from 'vue-toastification'

defineProps(['movie'])
const emit = defineEmits(['close'])
const toast = useToast()

const getStars = (voteAverage) => {
  const starCount = Math.round(voteAverage / 2)
  return '★'.repeat(starCount) + '☆'.repeat(5 - starCount)
}
const saveMovie = async (movie) => {
  if (!store.user) {
    toast.error('Login terlebih dahulu.')
    return
  }
  try {
    const userMovieRef = doc(db, `users/${store.user.uid}/savedMovies/${movie.id}`)
    const existingDoc = await getDoc(userMovieRef)
    if (existingDoc.exists()) {
      toast.error('Film telah ditambahkan sebelumnya.')
      return
    }
    await setDoc(userMovieRef, movie)
    toast.success('Berhasil ditambahkan ke Favorite!')
  } catch (err) {
    toast.error('Gagal menambahkan film.')
  }
}
</script>

<template>
  <div
    v-if="movie"
    class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="flex gap-8 bg-black bg-opacity-70 backdrop-blur-xl border border-white border-opacity-10 p-6 rounded w-[650px] max-h-[80vh] overflow-auto"
    >
      <img
        v-if="movie.poster_path"
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        class="mb-4 w-[250px] rounded"
        alt=""
      />
      <div class="flex flex-col">
        <p class="text-xl flex mb-2">
          <strong> {{ movie.title }}</strong>
          <button
            @click="() => saveMovie(movie)"
            class="ml-2 bg-blue-400 px-3 rounded-full bg-opacity-20 text-sm text-white hover:bg-opacity-40 flex items-center gap-1"
          >
            <img src="../assets/img/ic-fav.svg" alt="" class="w-4 h-4" />
            Save
          </button>
        </p>
        <p class="mb-4">{{ movie.overview }}</p>
        <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
        <p>
          <strong>Rating:</strong> {{ getStars(movie.vote_average) }}
          <span>{{ '(' + movie.vote_average + ')' }}</span>
        </p>
        <p><strong>Views:</strong> {{ movie.vote_count }}</p>
        <p><strong>Popularity:</strong> {{ movie.popularity }}</p>
      </div>
    </div>
  </div>
</template>
