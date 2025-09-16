import { computed } from 'vue'
import { useWebSocketStore } from '@/stores/websocket'
import { getNestedValue } from '@/composable/useNestedValue'

export function useSensorData(device, sensorKey, minKey, maxKey, errorPath, reasonPath) {
  const wsStore = useWebSocketStore()

  // Access Websocket Data
  const getData = (area, key) => {
    if (!area || !key) return null

    const deviceData = wsStore.data.find((d) => d.area === area)
    if (!deviceData) return null

    const result = getNestedValue(deviceData, key)
    return result !== undefined ? result : null
  }

  // Computed properties for sensor data
  const value = computed(() => getData(device.value?.area, sensorKey))
  const min = computed(() => getData(device.value?.area, minKey))
  const max = computed(() => getData(device.value?.area, maxKey))

  // Computed properties for error handling
  const isError = computed(() => getData(device.value?.area, errorPath))
  const errorReasons = computed(() => getData(device.value?.area, reasonPath) || [])

  // Units mapping
  const units = {
    'sensor.temp': '°C',
    'sensor.humi': '%',
    'sensor.pressure': 'Pa',
    'sensor.noise': 'dB',
  }

  const unit = computed(() => units[sensorKey] || '')

  const sensorDisplay = computed(() => {
    if (value.value != null) {
      return `${value.value} ${unit.value}`
    }
    return null
  })

  const isOutOfRange = computed(() => {
    // Check if min and max are valid numbers before comparison
    const minValue = Number(min.value)
    const maxValue = Number(max.value)
    const sensorValue = Number(value.value)

    // If min or max are not valid numbers, we can't determine if we're out of range
    if (isNaN(minValue) || isNaN(maxValue) || isNaN(sensorValue)) {
      return false
    }

    return sensorValue <= minValue || sensorValue >= maxValue
  })

  const sensorColor = computed(() => isError.value ? '#AC1754' : '#3D8D7A')

  return {
    value,
    min,
    max,
    isError,
    errorReasons,
    unit,
    sensorDisplay,
    isOutOfRange,
    sensorColor
  }
}
