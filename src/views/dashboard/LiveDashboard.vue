<template>
  <div>
    <a-flex
      justify="space-between"
      align="center"
      style="margin-bottom: 1rem"
      wrap="wrap"
      gap="small"
    >
      <span class="bold x-large">Temperature & Humidity Monitor </span>

      <a-space :size="0" direction="vertical">
        <span class="bold">Group</span>
        <a-select
          style="width: 200px;"
          :options="groupOptions"
          v-model:value="wsStore.selectedGroup"
          @change="wsStore.handleChangeGroup"
        />
      </a-space>
    </a-flex>
    <a-result v-if="wsStore.filterDeviceByGroup.length === 0" class="no-device">
      <template #title>
        <span>No device online</span>
      </template>
      <template #subTitle>
        <span>Try to refresh periodically to see changes in connection to the server</span>
      </template>
    </a-result>
    <a-row :gutter="[16, 16]">
      <BaseCardColumn
        :xs="24"
        :md="12"
        :sm="12"
        :lg="12"
        :xl="6"
        size="small"
        :bordered="true"
        v-for="device in wsStore.filterDeviceByGroup"
        :key="device.area"
        :hoverable="true"
      >
        <template #body>
          <a-spin :spinning="device.disconnected">
            <template #tip>
              <a-space direction="vertical" :size="1">
                <span class="bold">Connection Problem</span>
                <span class="bold">Waiting data from this device</span>
              </a-space>
            </template>
            <a-flex justify="space-between" align="start" wrap="wrap">
              <a-space direction="vertical" :size="1">
                <span class="area">{{ formatArea(device.area) }}</span>
                <a-tag :color="device.group_name ? '#3D8D7A' : '#AC1754'" class="bold">
                  {{ device.group_name || 'Ungrouped' }}</a-tag
                >
              </a-space>
              <a-flex vertical class="last-updated">
                <span class="bold">Last Updated</span>
                <span> {{ getWsData(device.area, 'date') }}</span>
              </a-flex>
            </a-flex>
            <a-flex justify="space-around" align="center" wrap="wrap">
              <a-flex vertical align="center" class="wrapper-data">
                <span>Temperature </span>
                <transition name="zoom" mode="out-in">
                  <span
                    class="area"
                    :class="{
                      'ng-sensor':
                        getWsData(device.area, 'sensor.temp') <=
                          getWsData(device.area, 'sensor.t_min') ||
                        getWsData(device.area, 'sensor.temp') >=
                          getWsData(device.area, 'sensor.t_max'),
                    }"
                    :key="getWsData(device.area, 'sensor.temp')"
                  >
                    {{ getWsData(device.area, 'sensor.temp') }} °C
                  </span>
                </transition>
                <a-flex justify="space-between" gap="small" wrap="wrap" align="center">
                  <span>Min : {{ getWsData(device.area, 'sensor.t_min') }} °C</span>
                  <span>Max : {{ getWsData(device.area, 'sensor.t_max') }} °C</span>
                </a-flex>
                <a-flex justify="space-between" gap="small" wrap="wrap" align="center">
                  <!-- <span>Status : </span> -->
                  <a-popover placement="bottom">
                    <template #title>
                      <span>Sensor Message</span>
                    </template>
                    <template #content v-if="getWsData(device.area, 'error.temperature.isError')">
                      <span
                        v-for="(msg, index) in getWsData(device.area, 'error.temperature.reason')"
                        :key="index"
                      >
                        {{ msg }}
                      </span>
                    </template>
                    <template #content v-else>
                      <span>There is no error message</span>
                    </template>
                    <a-tag
                      class="bold"
                      :color="
                        getWsData(device.area, 'error.temperature.isError') ? '#AC1754' : '#3D8D7A'
                      "
                    >
                      {{ getWsData(device.area, 'error.temperature.isError') ? 'Error' : 'Normal' }}
                    </a-tag>
                  </a-popover>
                </a-flex>
              </a-flex>
              <a-flex vertical align="center" class="wrapper-data">
                <span>Humidity </span>
                <transition name="zoom" mode="out-in">
                  <span
                    class="area"
                    :key="getWsData(device.area, 'sensor.humi')"
                    :class="{
                      'ng-sensor':
                        getWsData(device.area, 'sensor.humi') <=
                          getWsData(device.area, 'sensor.h_min') ||
                        getWsData(device.area, 'sensor.humi') >=
                          getWsData(device.area, 'sensor.h_max'),
                    }"
                  >
                    {{ getWsData(device.area, 'sensor.humi') }} %
                  </span>
                </transition>
                <a-flex justify="space-between" gap="small" wrap="wrap" align="center">
                  <span>Min : </span> {{ getWsData(device.area, 'sensor.h_min') }} %
                  <span>Max :</span> {{ getWsData(device.area, 'sensor.h_max') }} %
                </a-flex>
                <a-flex justify="space-between" gap="small" wrap="wrap" align="center">
                  <!-- <span>Status : </span> -->
                  <a-popover placement="bottom">
                    <template #title>
                      <span>Sensor Message</span>
                    </template>
                    <template #content v-if="getWsData(device.area, 'error.humidity.isError')">
                      <span
                        v-for="(msg, index) in getWsData(device.area, 'error.humidity.reason')"
                        :key="index"
                      >
                        {{ msg }}
                      </span>
                    </template>
                    <template #content v-else>
                      <span>There is no error message</span>
                    </template>
                    <a-tag
                      class="bold"
                      :color="
                        getWsData(device.area, 'error.humidity.isError') ? '#AC1754' : '#3D8D7A'
                      "
                    >
                      {{ getWsData(device.area, 'error.humidity.isError') ? 'Error' : 'Normal' }}
                    </a-tag>
                  </a-popover>
                </a-flex>
              </a-flex>
            </a-flex>
            <a-flex justify="space-around" align="start" wrap="wrap">
              <a-flex vertical class="wrapper-data">
                <span class="small">Calibration Date : </span>
                <a-flex justify="space-between" gap="small" wrap="wrap" align="center">
                  <a-tag color="grey" class="bold"
                    >{{ dayjs(getWsData(device.area, 'other.calibration')).format('YYYY-MM-DD') }}
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
              <a-flex vertical class="wrapper-data">
                <span class="small">Device Setting : </span>
                <a-flex justify="space-between" gap="small" wrap="wrap" align="center">
                  <a-tag color="#205781" class="bold" @click="handleModal(device, 'config')"
                    >Configuration</a-tag
                  >
                  <a-tag color="#205781" class="bold" @click="handleModal(device, 'rules')"
                    >Rules</a-tag
                  >
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

import dayjs from 'dayjs'

const wsStore = useWebSocketStore()
const dashboardStore = useDashboardStore()
const groupStore = useGroupStore()
const groupOptions = ref()

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

const getWsData = (area, key) => {
  const deviceData = wsStore.data.find((d) => d.area === area)

  if (!deviceData) return '-'

  // Fungsi untuk mengakses nested key
  const getNestedValue = (obj, path) => {
    return path
      .split('.')
      .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : '-'), obj)
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
    .split('_') // Mengganti underscore dengan spasi
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize setiap kata
    .join(' ')
}

// Hooks
onMounted(async () => {
  if (wsStore.data.length === 0) {
    wsStore.initializeWsData()
  }
  wsStore.connect('ws://192.168.148.125:5002/rdz-th')
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

.area {
  font-size: x-large;
  font-weight: bold;
}

.ng-sensor {
  color: red;
}

.bold {
  font-weight: bold;
}

.last-updated {
  font-size: small;
}

.wrapper-data {
  padding: 0.5rem;
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

.small {
  font-size: small;
}

.x-large {
  font-size: x-large;
}
</style>
