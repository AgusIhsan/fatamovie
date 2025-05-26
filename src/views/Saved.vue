<script setup>
import { onMounted, ref, watch } from 'vue'
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { store } from '../store'
import { useToast } from 'vue-toastification'

const toast = useToast()
const savedMovies = ref([])
const loading = ref(true)
const db = getFirestore()

const fetchSavedMovies = async () => {
  loading.value = true
  try {
    const colRef = collection(db, `users/${store.user.uid}/savedMovies`)
    const snapshot = await getDocs(colRef)
    savedMovies.value = snapshot.docs.map((doc) => doc.data())
  } catch (err) {
    console.error('Gagal mengambil film:', err)
  } finally {
    loading.value = false
  }
}

const unsaveMovie = async (movieId) => {
  const konfirmasi = confirm('Apakah kamu yakin ingin menghapus darri favorite?')
  if (!konfirmasi) return
  if (!store.user) return
  try {
    const docRef = doc(db, `users/${store.user.uid}/savedMovies/${movieId}`)
    await deleteDoc(docRef)

    // Hapus juga dari state lokal
    savedMovies.value = savedMovies.value.filter((movie) => movie.id !== movieId)
    toast.success('Film berhasil dihapus.')
  } catch (err) {
    toast.error('Gagal menyimpan film.')
  }
}

// Pantau perubahan user login
watch(
  () => store.user,
  async (user) => {
    if (user) {
      await fetchSavedMovies()
    } else {
      // Jika tidak ada user (belum login), tidak usah loading terus
      loading.value = false
      savedMovies.value = []
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-1 py-8 text-white mx-1 lg:mx-48">
    <h1 v-if="store.user" class="text-2xl sm:text-3xl font-bold mb-6">Saved Movies</h1>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>

    <!-- Jika belum login -->
    <div v-else-if="!store.user" class="text-center py-10">
      <p class="text-lg sm:text-xl">⚠️ Silakan login untuk melihat movie favorit Anda.</p>
    </div>

    <!-- Jika sudah login dan ada film -->
    <div v-else>
      <div
        v-if="savedMovies.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="movie in savedMovies"
          :key="movie.id"
          class="relative bg-gray-800 bg-opacity-50 text-white p-4 rounded shadow hover:shadow-lg transition duration-300"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            alt=""
            class="mb-3 w-full rounded"
          />
          <button
            @click="unsaveMovie(movie.id)"
            class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1 rounded z-10"
            title="Unsave"
          >
            Unsave
          </button>
          <h2 class="text-lg font-semibold mb-2">{{ movie.title }}</h2>
          <p class="text-sm text-gray-300">{{ movie.overview }}</p>
        </div>
      </div>

      <div v-else class="text-center py-10 text-gray-400">
        <p>📭 Belum ada movie yang disimpan.</p>
      </div>
    </div>
  </div>
</template>
