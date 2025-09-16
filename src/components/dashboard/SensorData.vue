<template>
  <transition name="zoom" mode="out-in">
    <a-flex v-if="showComponent" vertical align="center" class="wrapper-data" :gap="0">
      <span class="bold">{{ sensorLabel }}</span>
      <transition name="zoom" mode="out-in">
        <span class="x-large bold" :class="{ 'ng-sensor': isOutOfRange }" :key="value">
          <component :is="sensorDisplay ? 'span' : LoadingOutlined" v-bind="sensorDisplay ? {} : { spin: true }">
            {{ sensorDisplay }}
          </component>
        </span>
      </transition>

      <a-flex vertical :gap="0" wrap="wrap" align="center">
        <span>Min : {{ min || '-' }} {{ unit }}</span>
        <span>Max : {{ max || '-' }} {{ unit }}</span>
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
  </transition>
</template>

<script setup>
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useSensorData } from '@/composable/useSensorData'
import { useVisibilityTimeout } from '@/composable/useVisibilityTimeout'
import { toRefs } from 'vue'

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

// Convert props to refs for composables
const { device, sensorKey, sensorLabel, minKey, maxKey, errorPath, reasonPath } = toRefs(props)

// Use sensor data composable
const {
  value,
  min,
  max,
  isError,
  errorReasons,
  unit,
  sensorDisplay,
  isOutOfRange,
  sensorColor
} = useSensorData(device, sensorKey.value, minKey.value, maxKey.value, errorPath.value, reasonPath.value)

// Use visibility timeout composable
const { showComponent } = useVisibilityTimeout(sensorDisplay, sensorLabel.value)
</script>

<style scoped>
.wrapper-data {
  padding: 0.5rem;
}

.ng-sensor {
  color: red;
}

/* Zoom transition for sensor value */
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

/* Fade transition for component visibility */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
