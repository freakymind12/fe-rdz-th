<template>
  <div>
    <a-flex justify="space-between" align="center" style="margin-bottom: 1rem" wrap="wrap" gap="small">
      <span class="bold x-large">Temperature & Humidity Monitor </span>
      <a-space :size="0" direction="vertical">
        <span class="bold">Group</span>
        <a-select style="width: 200px;" :options="groupOptions" v-model:value="wsStore.selectedGroup"
          @change="wsStore.handleChangeGroup" />
      </a-space>
    </a-flex>
    <a-divider orientation="left">
      <a-tag class="large" color="#212121">{{ wsStore.filterDeviceByGroup?.length }} Devices</a-tag>
    </a-divider>
    <a-result v-if="wsStore.filterDeviceByGroup.length === 0" class="no-device">
      <template #title>
        <span>No device online</span>
      </template>
      <template #subTitle>
        <span>Try to refresh periodically to see changes in connection to the server</span>
      </template>
    </a-result>
    <a-row :gutter="[16, 16]">
      <BaseCardColumn :xs="24" :md="12" :sm="24" :lg="12" :xl="6" size="small" :bordered="true"
        v-for="device in wsStore.filterDeviceByGroup" :key="device.area" :hoverable="true">
        <template #body>
          <a-spin :spinning="device.disconnected">
            <template #tip>
              <a-space direction="vertical" :size="1">
                <span class="bold">Connection Problem</span>
                <span class="bold">Waiting data from this device</span>
              </a-space>
            </template>
            <!-- Device Area & Last Updated -->
            <a-flex justify="space-between" align="start" wrap="wrap">
              <a-space direction="vertical" :size="1">
                <span class="x-large bold">{{ formatArea(device.area) }}</span>
                <a-space :size="0">
                  <a-tag :color="device.group_name ? '#3D8D7A' : '#AC1754'" class="bold">
                    {{ device.group_name || 'Ungrouped' }}</a-tag>
                  <a-tag color="grey" class="bold"> {{ getWsData(device.area, 'other.th_id') || 'Unknown' }}</a-tag>
                </a-space>
              </a-space>
              <a-flex vertical class="small">
                <span class="bold">Last Updated</span>
                <span> {{ getWsData(device.area, 'date') }}</span>
              </a-flex>
            </a-flex>
            <!-- Wrapper Sensor -->
            <a-flex justify="space-evenly" align="center" wrap="wrap">
              <!-- Temperature Sensor Data -->
              <SensorData :device="device" sensorKey="sensor.temp" sensorLabel="Temperature" minKey="sensor.t_min"
                maxKey="sensor.t_max" errorPath="error.temperature.isError" reasonPath="error.temperature.reason"/>
              <!-- Humidity Sensor Data -->
              <SensorData :device="device" sensorKey="sensor.humi" sensorLabel="Humidity" minKey="sensor.h_min"
                maxKey="sensor.h_max" errorPath="error.humidity.isError" reasonPath="error.humidity.reason" />
              <!-- Noise Sensor Data -->
              <SensorData :device="device" sensorKey="sensor.noise" sensorLabel="Noise" minKey="sensor.n_min"
                maxKey="sensor.n_max" errorPath="error.noise.isError" reasonPath="error.noise.reason" />
              <!-- Pressure Sensor Data -->
              <SensorData :device="device" sensorKey="sensor.pressure" sensorLabel="Pressure" minKey="sensor.p_min"
                maxKey="sensor.p_max" errorPath="error.pressure.isError" reasonPath="error.pressure.reason" />
            </a-flex>
            <!-- Wrapper Calibration & Device Setting -->
            <a-flex justify="space-around" align="start" wrap="wrap">
              <!-- Calibration Data -->
              <a-flex vertical class="wrapper-data">
                <span class="small">Calibration Date : </span>
                <a-flex justify="space-between" gap="small" wrap="wrap" align="center">
                  <a-tag color="grey" class="bold">{{ dayjs(getWsData(device.area,
                    'other.calibration')).format('YYYY-MM-DD') }}
                  </a-tag>
                  <a-tag color="grey" class="bold">
                    {{
                      daysRemaining(getWsData(device.area, 'other.calibration')).toLocaleString(
                        'id',
                        'ID',
                      )
                    }}
                    Days
                  </a-tag>
                </a-flex>
              </a-flex>
              <!-- Device Setting -->
              <a-flex vertical class="wrapper-data">
                <span class="small">Device Setting : </span>
                <a-flex justify="space-between" gap="small" wrap="wrap" align="center">
                  <a-tag color="#205781" class="bold" @click="handleModal(device, 'config')">Configuration</a-tag>
                  <a-tag color="#205781" class="bold" @click="handleModal(device, 'rules')">Rules</a-tag>
                </a-flex>
              </a-flex>
            </a-flex>
          </a-spin>
        </template>
      </BaseCardColumn>
    </a-row>
    <ModalSetting />
  </div>
</template>

<script setup>
import ModalSetting from '@/components/dashboard/ModalSetting.vue'
import BaseCardColumn from '@/components/shared/BaseCardColumn.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useWebSocketStore } from '@/stores/websocket'
import { useGroupStore } from '@/stores/group'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import SensorData from '@/components/dashboard/SensorData.vue'

import dayjs from 'dayjs'

const wsStore = useWebSocketStore()
const dashboardStore = useDashboardStore()
const groupStore = useGroupStore()
const groupOptions = ref()

// Handle modal operation
const handleModal = (data, mode) => {
  const mappedData = {
    area: data.area,
    regional: data.regional,
    group_id: data.group_id,
    group_name: data.group_name,
    t_min: data.sensor.t_min,
    t_max: data.sensor.t_max,
    h_min: data.sensor.h_min,
    h_max: data.sensor.h_max,
  }
  dashboardStore.modalData.data = mappedData
  dashboardStore.modalData.mode = mode
  dashboardStore.modalVisible = true
}

// Access Websocket Data
const getWsData = (area, key) => {
  const deviceData = wsStore.data.find((d) => d.area === area)

  if (!deviceData) return '-'

  // Fungsi untuk mengakses nested key
  const getNestedValue = (obj, path) => {
    return path
      .split('.')
      .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
  }

  return getNestedValue(deviceData, key)
}

// Get calibration remaining days
const daysRemaining = (targetDate) => {
  const target = dayjs(targetDate, 'YYYY-M-D')
  if (!target.isValid()) return 0 // Memeriksa apakah target date valid
  const now = dayjs().startOf('day') // Pastikan hanya menghitung hari tanpa jam, menit, detik
  return target.diff(now, 'day') // Menghitung selisih hari
}

// Format device area string
const formatArea = (str) => {
  return str
    .replace(/_/g, ' ') // Ganti semua underscore dengan spasi
    .replace(/\b[a-z]/g, (match) => match.toUpperCase()); // Kapitalisasi huruf pertama tiap kata
};

// Hooks
onMounted(async () => {
  if (wsStore.data.length === 0) {
    wsStore.initializeWsData()
  }
  wsStore.connect(import.meta.env.VITE_WEBSOCKET_URL)
  await groupStore.getGroup()
  groupOptions.value = groupStore.groupOptions
  groupOptions.value.unshift({
    value: 'ALL',
    label: 'All',
  })
})

// Menutup koneksi websocket ketika component di hapus dari dom
onUnmounted(() => {
  wsStore.disconnect()
})

// Watch reload
watch(
  () => dashboardStore.reload,
  async () => {
    if (dashboardStore.reload) {
      wsStore.initializeWsData()
      dashboardStore.reload = false
    }
  },
)
</script>

<style scoped>
.no-device {
  padding-top: 15%;
}

.wrapper-data {
  padding: 0.5rem;
}
</style>
