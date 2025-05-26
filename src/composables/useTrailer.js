import { ref } from 'vue'

export function useTrailer() {
  const showTrailer = ref(false)
  const videoKey = ref(null)

  const openTrailer = async (movieId) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=064369659a2a6f5b4ba5e086c7b51518`,
    )
    const data = await res.json()

    const trailer = data.results.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer',
    )
    if (trailer) {
      videoKey.value = trailer.key
      showTrailer.value = true
    } else {
      alert('Trailer tidak tersedia')
    }
  }
  const closeTrailer = () => {
    showTrailer.value = false
    videoKey.value = null
  }

  return {
    showTrailer,
    videoKey,
    openTrailer,
    closeTrailer,
  }
}
