// src/composables/useSearchMovies.js
import { ref, watch } from 'vue'

export function useSearchMovies() {
  const query = ref('')
  const results = ref([])
  const loading = ref(false)

  watch(query, async (newQuery) => {
    if (!newQuery) {
      results.value = []
      return
    }

    loading.value = true
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=064369659a2a6f5b4ba5e086c7b51518&query=${encodeURIComponent(newQuery)}`,
      )
      const data = await res.json()
      results.value = data.results.slice(0, 5) // hanya 5 teratas
    } catch (err) {
      console.error('Error fetching search:', err)
    } finally {
      loading.value = false
    }
  })

  return {
    query,
    results,
    loading,
  }
}
