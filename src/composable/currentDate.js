// src/composables/useCurrentDate.js
import { ref, onMounted, onUnmounted } from 'vue'
import { dayjsModified } from './dayjsModified'

const formatDate = () => {
  return dayjsModified().format('YYYY-MM-DD HH:mm:ss')
}

export function useCurrentDate() {
  const dateNow = ref(formatDate())

  // Update dateNow every second
  const updateDateNow = () => {
    dateNow.value = formatDate()
  }

  onMounted(() => {
    const interval = setInterval(updateDateNow, 1000)
    onUnmounted(() => {
      clearInterval(interval)
    })
  })

  return {
    dateNow,
  }
}
