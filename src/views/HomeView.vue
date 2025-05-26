<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getDoc, getFirestore } from 'firebase/firestore'
import { doc, setDoc } from 'firebase/firestore'
import { store } from '../store'
import Popular from '@/components/Popular.vue'
import Trending from '@/components/Trending.vue'
import TopRated from '@/components/TopRate.vue'
import { useToast } from 'vue-toastification'

const db = getFirestore()
const toast = useToast()
const movies = ref([])
const currentIndex = ref(0)
let intervalId

onMounted(async () => {
  const res = await fetch('https://api.themoviedb.org/3/movie/popular', {
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjQzNjk2NTlhMmE2ZjViNGJhNWUwODZjN2I1MTUxOCIsIm5iZiI6MTc0NzcxMzE3Mi42OTIsInN1YiI6IjY4MmJmYzk0NDM3ZmFkY2M2ZjY0OTNiYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gNzrGouvyaTuVIB_HGxIyYd2XtBE0uip8LMI_UZ_21E',
    },
  })
  const data = await res.json()
  movies.value = data.results
  startAutoSlide()
})

onUnmounted(() => {
  clearInterval(intervalId)
})

function startAutoSlide() {
  intervalId = setInterval(() => {
    nextMovie()
  }, 3000)
}

const nextMovie = () => {
  if (movies.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % movies.value.length
  }
}

const prevMovie = () => {
  if (movies.value.length > 0) {
    currentIndex.value = (currentIndex.value - 1 + movies.value.length) % movies.value.length
  }
}

const saveMovie = async (movie) => {
  if (!store.user) {
    toast.error('Login terlebih dahulu')
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
    toast.success('Berhasil ditambahkan ke Favorite')
  } catch (err) {
    toast.error(('Gagal ditambahkan', err))
  }
}
</script>

<template>
  <main>
    <!-- Hero Section -->
    <div class="hero relative h-[500px] sm:h-[600px] md:h-[650px] w-full">
      <img
        v-if="movies[currentIndex]"
        :src="`https://image.tmdb.org/t/p/w1280${movies[currentIndex].backdrop_path}`"
        class="absolute inset-0 w-full h-full object-cover z-0"
        alt=""
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#141414]/0 to-[#141414]/100 z-10"></div>

      <div class="relative z-20 px-4 sm:px-6 md:px-12 text-white h-full">
        <div
          class="content-hero flex flex-col items-center justify-end gap-4 h-full pb-10 sm:pb-12"
        >
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
            {{ movies[currentIndex]?.title || 'Loading...' }}
          </h1>

          <p
            class="text-center w-full max-w-2xl px-4 sm:px-6 font-extralight text-sm sm:text-base break-words"
          >
            {{ movies[currentIndex]?.overview }}
          </p>

          <!-- Tombol Aksi -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <button
              class="flex gap-1 items-center text-md bg-white bg-opacity-10 backdrop-blur-sm transition hover:scale-105 hover:bg-opacity-25 rounded-md px-6 py-2 sm:px-8 sm:py-3"
            >
              <img src="../assets/img/ic-play.svg" alt="" class="w-4 h-4 sm:w-5 sm:h-5" />
              Play
            </button>

            <button
              @click="() => saveMovie(movies[currentIndex])"
              class="flex gap-1 items-center text-md bg-[--black] transition hover:scale-105 hover:bg-black rounded-md px-6 py-2 sm:px-8 sm:py-3"
            >
              <img src="../assets/img/ic-fav.svg" alt="" class="w-4 h-4 sm:w-5 sm:h-5" />
              Save
            </button>
          </div>

          <!-- Slider Navigasi -->
          <div class="slider w-full flex justify-between mt-6 sm:mt-8 px-4 sm:px-12">
            <button
              @click="prevMovie"
              class="bg-white bg-opacity-10 backdrop-blur-sm transition hover:scale-105 hover:bg-opacity-25 rounded-md px-4 py-2"
            >
              <img src="../assets/img/ic-left.svg" alt="" class="w-4 h-4" />
            </button>
            <button
              @click="nextMovie"
              class="bg-white bg-opacity-10 backdrop-blur-sm transition hover:scale-105 hover:bg-opacity-25 rounded-md px-4 py-2"
            >
              <img src="../assets/img/ic-right.svg" alt="" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- List Movie Section -->
    <div
      class="relative flex flex-col gap-16 border border-white border-opacity-10 rounded-md py-16 px-4 sm:px-8 mt-16 sm:mt-20"
    >
      <h1
        class="absolute -top-4 left-6 sm:left-10 text-lg sm:text-xl bg-white bg-opacity-10 backdrop-blur-sm py-1 px-4 rounded-sm"
      >
        Movies
      </h1>
      <TopRated />
      <Trending />
    </div>
  </main>
</template>
