<template>
  <div>
    <h2>Transition Test</h2>
    <button @click="toggleComponent">Toggle Component</button>
    <SensorData 
      :device="{ area: 'test' }"
      sensor-key="sensor.temp"
      sensor-label="Temperature"
      min-key="sensor.t_min"
      max-key="sensor.t_max"
      error-path="error.temperature.isError"
      reason-path="error.temperature.reason"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SensorData from '@/components/dashboard/SensorData.vue'

const showComponent = ref(true)

const toggleComponent = () => {
  showComponent.value = !showComponent.value
}
</script>