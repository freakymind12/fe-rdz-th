<template>
  <a-row :gutter="[16, 16]" :wrap="true">
    <a-col :xs="24" :lg="12" :md="12">
      <div class="wrapper-list">
        <a-flex justify="space-between" style="margin-bottom: 0.5rem">
          <span class="bold">Parameter Data</span>
        </a-flex>

        <a-form layout="vertical" :model="formState">
          <a-row :gutter="[6, 6]" :wrap="true">
            <a-col :xs="12" :md="12" :lg="12">
              <a-form-item
                label="Max Temperature"
                name="t_max"
                :rules="[
                  { required: true, message: 'Please input max temperature', trigger: 'change' },
                ]"
              >
                <a-input-number class="input-number" v-model:value="formState.t_max" :min="1" />
              </a-form-item>
            </a-col>
            <a-col :xs="12" :md="12" :lg="12">
              <a-form-item
                label="Min Temperature"
                name="t_min"
                :rules="[
                  { required: true, message: 'Please input min temperature', trigger: 'change' },
                ]"
              >
                <a-input-number class="input-number" v-model:value="formState.t_min" :min="1" />
              </a-form-item>
            </a-col>
            <a-col :xs="12" :md="12" :lg="12">
              <a-form-item
                label="Max Humidity"
                name="h_max"
                :rules="[
                  { required: true, message: 'Please input max humidity', trigger: 'change' },
                ]"
              >
                <a-input-number class="input-number" v-model:value="formState.h_max" :min="1" />
              </a-form-item>
            </a-col>
            <a-col :xs="12" :md="12" :lg="12">
              <a-form-item
                label="Min Humidity"
                name="h_min"
                :rules="[
                  { required: true, message: 'Please input min humidity', trigger: 'change' },
                ]"
              >
                <a-input-number class="input-number" v-model:value="formState.h_min" :min="1" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-flex justify="flex-end" gap="small">
            <a-button @click="handleReset">Reset</a-button>
            <a-button type="primary" @click="handleChangeParameter">Submit</a-button>
          </a-flex>
        </a-form>
      </div>
    </a-col>
    <a-col :xs="24" :lg="12" :md="12">
      <div class="wrapper-list">
        <a-flex justify="space-between" style="margin-bottom: 0.5rem">
          <span class="bold">Area Configuration</span>
        </a-flex>
        <a-flex vertical gap="small">
          <div>
            <span>Fill new area here for checking area name</span>
            <a-input
              placeholder="Input new area name to this device"
              v-model:value="formState.area"
            >
              <template #suffix>
                <component :is="iconStatus" v-if="iconStatus" :class="statusClass" />
              </template>
            </a-input>
          </div>
          <a-flex justify="space-between">
            <span class="note-area" :class="statusClass">{{ noteArea }}</span>
            <a-button
              type="primary"
              :disabled="
                !formState.area || (duplicatedDevice.length > 0 && duplicatedDevice[0].status === 1)
              "
              @click="handleChangeArea"
              >Submit</a-button
            >
          </a-flex>
        </a-flex>
        <a-flex vertical gap="small">
          <a-flex vertical>
            <span>Link this device to group for reporting data</span>
            <a-select v-model:value="formState.group_id" :options="groupStore.groupOptions" />
          </a-flex>
          <a-flex justify="flex-end">
            <a-button type="primary" @click="handleChangeGroup" :disabled="!formState.group_id"
              >Submit</a-button
            >
          </a-flex>
        </a-flex>
      </div>
    </a-col>
  </a-row>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDeviceStore } from '@/stores/device'
import { useDashboardStore } from '@/stores/dashboard'
import { useWebSocketStore } from '@/stores/websocket'
import { useGroupStore } from '@/stores/group'
import { CloseCircleOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import { useDebounceFn } from '@vueuse/core'

const wsStore = useWebSocketStore()
const deviceStore = useDeviceStore()
const dashboardStore = useDashboardStore()
const groupStore = useGroupStore()
const formState = ref({
  t_max: dashboardStore.modalData.data.t_max || 0,
  t_min: dashboardStore.modalData.data.t_min || 0,
  h_max: dashboardStore.modalData.data.h_max || 0,
  h_min: dashboardStore.modalData.data.h_min || 0,
  area: null,
  group_id: dashboardStore.modalData.data.group_id || null,
})

const handleReset = () => {
  formState.value = {
    t_max: dashboardStore.modalData.data.t_max || 0,
    t_min: dashboardStore.modalData.data.t_min || 0,
    h_max: dashboardStore.modalData.data.h_max || 0,
    h_min: dashboardStore.modalData.data.h_min || 0,
    area: null,
    group_id: dashboardStore.modalData.data.group_id || null,
  }
}

const duplicatedDevice = ref([])

const areaStatus = computed(() => {
  if (!formState.value.area) return null
  if (duplicatedDevice.value.length === 0) return 'success'
  return duplicatedDevice.value[0].status
})

const statusMap = {
  1: { icon: CloseCircleOutlined, class: 'error', note: 'This area already has a sensor device' },
  0: {
    icon: InfoCircleOutlined,
    class: 'warning',
    note: 'If you submit, you will enable this area',
  },
  success: { icon: CheckCircleOutlined, class: 'success', note: 'Area is clear, you can submit' },
}

const iconStatus = computed(() => statusMap[areaStatus.value]?.icon || null)
const statusClass = computed(() => statusMap[areaStatus.value]?.class || null)
const noteArea = computed(() => statusMap[areaStatus.value]?.note || '')

const handleChangeParameter = async () => {
  await deviceStore.updateParameter({
    regional: dashboardStore.modalData.data.regional,
    area: dashboardStore.modalData.data.area,
    t_max: formState.value.t_max,
    t_min: formState.value.t_min,
    h_max: formState.value.h_max,
    h_min: formState.value.h_min,
  })

  dashboardStore.modalVisible = false
  dashboardStore.reload = true
}

const handleChangeArea = async () => {
  await deviceStore.updateArea({
    regional: dashboardStore.modalData.data.regional,
    oldArea: dashboardStore.modalData.data.area,
    newArea: formState.value.area,
  })

  wsStore.changeArea(dashboardStore.modalData.data.area, formState.value.area)
  handleReset()
  dashboardStore.modalVisible = false
  dashboardStore.reload = true
}

const handleChangeGroup = async () => {
  await deviceStore.updateGroup({
    oldArea: dashboardStore.modalData.data.area,
    group_id: formState.value.group_id,
  })
  handleReset()
  dashboardStore.modalVisible = false
  dashboardStore.reload = true
}

// Gunakan debounce untuk check area yang diinput user
const debouncedCheckArea = useDebounceFn(async () => {
  if (formState.value.area) {
    duplicatedDevice.value = await deviceStore.checkDuplicateArea({ area: formState.value.area })
  }
  console.log(duplicatedDevice.value)
}, 200)

watch(() => formState.value.area, debouncedCheckArea)
</script>

<style scoped>
.wrapper-list {
  border: 1px solid rgba(166, 174, 191, 0.4);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 0.5rem;
  min-height: 270px;
}

.bold {
  font-weight: bold;
}

.input-number {
  width: 100%;
}

.error {
  color: red;
}

.success {
  color: green;
}

.warning {
  color: #ffbd73;
}

.note-area {
  font-style: italic;
  font-size: small;
}
</style>
