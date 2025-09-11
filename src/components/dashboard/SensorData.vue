<template>
  <!-- Temporary condition waiting update sensor payload -->
  <a-flex vertical align="center" class="wrapper-data" v-if="value !== 0 && value !== null" :gap="0">
    <span class="bold">{{ sensorLabel }}</span>
    <transition name="zoom" mode="out-in">
      <span class="x-large bold" :class="{ 'ng-sensor': isOutOfRange }" :key="value">
        <component :is="sensorDisplay ? 'span' : LoadingOutlined" v-bind="sensorDisplay ? {} : { spin: true }">
          {{ sensorDisplay }}
        </component>
      </span>
    </transition>

    <a-flex vertical :gap="0" wrap="wrap" align="center">
      <span>Min : {{ min || '-' }} {{ sensorDisplay?.split(' ').pop() }}</span>
      <span>Max : {{ max || '-' }} {{ sensorDisplay?.split(' ').pop() }}</span>
    </a-flex>

    <a-flex justify="space-between" gap="small" wrap="wrap" align="center">
      <a-popover placement="bottom">
        <template #title>
          <span>Sensor Message</span>
        </template>
        <template #content>
          <template v-if="isError">
            <span v-for="(msg, index) in errorReasons" :key="index">{{ msg }}</span>
          </template>
          <template v-else>
            <span>There is no error message</span>
          </template>
        </template>
        <a-tag class="bold" :color="sensorColor">
          {{ isError ? 'Error' : 'Normal' }}
        </a-tag>
      </a-popover>
    </a-flex>
  </a-flex>
</template>

<script setup>
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useWebSocketStore } from '@/stores/websocket'
import { computed } from 'vue'

const wsStore = useWebSocketStore()

const props = defineProps({
  device: Object,
  sensorKey: String, // contoh: 'sensor.temp'
  sensorLabel: {
    type: String,
    default: 'Sensor'
  },
  minKey: String, // contoh: 'sensor.t_min'
  maxKey: String, // contoh: 'sensor.t_max'
  errorPath: String, // contoh: 'error.temperature.isError'
  reasonPath: String, // contoh: 'error.temperature.reason'
})

// Access Websocket Data
const getWsData = (area, key) => {
  if (!area || !key) return null

  const deviceData = wsStore.data.find((d) => d.area === area)
  if (!deviceData) return null

  // Helper untuk akses nested path seperti 'sensor.temp'
  const getNestedValue = (obj, path) => {
    return path
      .split('.')
      .reduce((acc, part) => {
        if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
          return acc[part]
        }
        return undefined
      }, obj)
  }

  const result = getNestedValue(deviceData, key)
  return result !== undefined ? result : null
}

const value = computed(() => getWsData(props.device.area, props.sensorKey))
const min = computed(() => getWsData(props.device.area, props.minKey))
const max = computed(() => getWsData(props.device.area, props.maxKey))
const isOutOfRange = computed(() => {
  return value.value <= min.value || value.value >= max.value
})

console.log(`${props.sensorLabel} - ${value.value}`)
// Get & Format Sensor Data
const sensorDisplay = computed(() => {
  const units = {
    'sensor.temp': '°C',
    'sensor.humi': '%',
    'sensor.pressure': 'Pa',
    'sensor.noise': 'dB',
  }
  if (value.value != null) {
    return `${value.value} ${units[props.sensorKey] || ''}`
  }
  return null
})
const isError = computed(() => getWsData(props.device.area, props.errorPath))
const sensorColor = computed(() => isError.value ? '#AC1754' : '#3D8D7A')
const errorReasons = computed(() => getWsData(props.device.area, props.reasonPath) || [])
</script>

<style scoped>
.wrapper-data {
  padding: 0.5rem;
}

.ng-sensor {
  color: red;
}

.zoom-enter-active,
.zoom-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.zoom-enter-from {
  transform: scale(0);
  opacity: 0;
}

.zoom-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
