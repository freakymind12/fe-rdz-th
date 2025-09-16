import { ref, onMounted, onUnmounted } from 'vue'

export function useVisibilityTimeout(sensorDisplay, sensorLabel) {
  // State for controlling component visibility
  const showComponent = ref(true)
  let hideTimeout = null

  // Set timeout to hide component after 5 seconds if sensorDisplay is not available
  const setHideTimeout = () => {
    // Clear any existing timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }

    // Set new timeout
    hideTimeout = setTimeout(() => {
      if (!sensorDisplay.value || 
          (sensorDisplay.value && 
           ((sensorDisplay.value.startsWith('0') && sensorLabel === 'Pressure') || 
            (sensorDisplay.value.startsWith('0') && sensorLabel === 'Noise')))) {
        showComponent.value = false
      }
    }, 5000) // 5 seconds
  }

  // Initialize timeout when component is mounted
  onMounted(() => {
    setHideTimeout()
  })

  // Clear timeout when component is unmounted
  onUnmounted(() => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }
  })

  return {
    showComponent,
    setHideTimeout
  }
}
