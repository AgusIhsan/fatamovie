<script setup>
import { ref, computed } from 'vue'
import imgHero from '@/assets/img/img-hero.jpg'

const movies = ref([
  { title: 'Film 1', desc: 'Deskripsi 1', img: imgHero },
  { title: 'Film 2', desc: 'Deskripsi 2', img: imgHero },
  { title: 'Film 3', desc: 'Deskripsi 3', img: imgHero },
  { title: 'Film 4', desc: 'Deskripsi 4', img: imgHero },
  { title: 'Film 5', desc: 'Deskripsi 5', img: imgHero },
  { title: 'Film 6', desc: 'Deskripsi 6', img: imgHero },
  { title: 'Film 7', desc: 'Deskripsi 7', img: imgHero },
  { title: 'Film 8', desc: 'Deskripsi 8', img: imgHero },
  { title: 'Film 9', desc: 'Deskripsi 9', img: imgHero },
  { title: 'Film 10', desc: 'Deskripsi 10', img: imgHero },
])

const showAll = ref(false)

const displayedMovies = computed(() => (showAll.value ? movies.value : movies.value.slice(0, 4)))
</script>

<template>
  <div>
    <h1 class="text-white text-2xl font-bold mb-10">Popular Top 10 in Genre</h1>

    <transition-group name="fade-expand" tag="div" class="grid grid-cols-4 gap-4">
      <div
        v-for="(movie, index) in displayedMovies"
        :key="movie.title"
        class="relative bg-gray-800 text-white p-4 rounded"
      >
        <img :src="movie.img" alt="" class="mb-2 w-full rounded" />
        <button
          class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-md px-2 py-1 rounded z-10"
          title="Unsave"
        >
          Unsave
        </button>
        <h2 class="text-xl font-bold">{{ movie.title }}</h2>
        <p class="text-sm">{{ movie.desc }}</p>
      </div>
    </transition-group>

    <div class="mt-4 flex justify-end">
      <button @click="showAll = !showAll" class="text-gray-400 hover:text-white">
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

.fade-expand-enter-to,
.fade-expand-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
