<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getDoc, getFirestore } from 'firebase/firestore'
import { doc, setDoc } from 'firebase/firestore'
import { store } from '../store'
const db = getFirestore()
import Popular from '@/components/Popular.vue'
import Trending from '@/components/Trending.vue'

const movies = ref([])
const currentIndex = ref(0)
let intervalId
const alertMessage = ref('')
const alertType = ref('')

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
    alert('Login terlebih dahulu')
    return
  }
  try {
    const userMovieRef = doc(db, `users/${store.user.uid}/savedMovies/${movie.id}`)
    const existingDoc = await getDoc(userMovieRef)
    if (existingDoc.exists()) {
      alert('Film telah ditambahkan sebelumnya.')
      return
    }
    await setDoc(userMovieRef, movie)
    alert('Berhasil ditambahkan ke Favorite')
  } catch (err) {
    alert('Gagal ditambahkan', err)
  }
}
</script>

<template>
  <main>
    <div class="hero relative h-[650px] w-full">
      <img
        v-if="movies[currentIndex]"
        :src="`https://image.tmdb.org/t/p/w1280${movies[currentIndex].backdrop_path}`"
        class="absolute inset-0 w-full h-full object-cover z-0"
        alt=""
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#141414]/0 to-[#141414]/100 z-10"></div>
      <div class="relative z-20 p-4 text-white h-full">
        <div class="content-hero flex flex-col items-center justify-end gap-4 h-full">
          <h1 class="text-4xl font-bold">
            {{ movies[currentIndex]?.title || 'Loading...' }}
          </h1>
          <p class="text-center w-[800px] font-extralight">
            {{ movies[currentIndex]?.overview }}
          </p>
          <div class="flex gap-4 actions">
            <button
              class="flex gap-1 text-md bg-white bg-opacity-10 backdrop-blur-sm transform transition duration-300 hover:scale-105 hover:bg-opacity-25 rounded-md px-8 py-3"
            >
              <img src="../assets/img/ic-play.svg" alt="" />
              Play
            </button>
            <button
              @click="() => saveMovie(movies[currentIndex])"
              class="flex gap-1 text-md bg-[--black] transform transition duration-300 hover:scale-105 hover:bg-black rounded-md px-4 py-3"
            >
              <img src="../assets/img/ic-fav.svg" alt="" />
              save
            </button>
          </div>
          <div class="slider w-full flex justify-between">
            <button
              @click="prevMovie"
              class="bg-white bg-opacity-10 backdrop-blur-sm transform transition duration-300 hover:scale-105 hover:bg-opacity-25 rounded-md px-5 py-2"
            >
              <img src="../assets/img/ic-left.svg" alt="" />
            </button>
            <button
              @click="nextMovie"
              class="bg-white bg-opacity-10 backdrop-blur-sm transform transition duration-300 hover:scale-105 hover:bg-opacity-25 rounded-md px-5 py-2"
            >
              <img src="../assets/img/ic-right.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="relative flex flex-col gap-16 container-list border border-white border-opacity-10 rounded-md py-16 px-8 mt-20"
    >
      <h1
        class="absolute -top-4 left-10 text-xl bg-white bg-opacity-10 backdrop-blur-sm py-1 px-4 rounded-sm"
      >
        Movies
      </h1>
      <Popular />
      <Trending />
    </div>
  </main>
</template>
