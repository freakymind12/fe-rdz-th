<template>
  <div class="wrapper-list">
    <a-flex justify="space-between" style="margin-bottom: 0.5rem" align="center">
      <span class="bold">Not report data on the following day based on this rules</span>
      <a-button
        type="primary"
        size="small"
        @click="handleAdd"
        :disabled="formState.mode == 'add' && toggleForm"
      >
        <PlusCircleOutlined /> Add
      </a-button>
    </a-flex>
    <a-row :gutter="[16, 16]" :wrap="true" v-if="rulesStore.rules.length > 0">
      <a-col :xs="24" :lg="6" v-for="rule in rulesStore.rules" :key="rule.id">
        <a-card size="small" class="card-rules">
          <a-flex justify="space-between" style="margin-bottom: 0.5rem">
            <span class="bold">{{ rule.day }}</span>
            <a-flex gap="small">
              <a-button size="small" shape="circle" type="primary" @click="handleEdit(rule)">
                <EditOutlined />
              </a-button>
              <a-popconfirm title="Are you sure delete this rule ?" @confirm="handleDelete(rule)">
                <a-button danger size="small" shape="circle" type="primary">
                  <DeleteOutlined />
                </a-button>
              </a-popconfirm>
            </a-flex>
          </a-flex>
          <a-row :gutter="[2, 2]" :wrap="true" justify="space-between ">
            <a-col :xs="24" :lg="12" align="center">
              <span>00:00</span>
            </a-col>
            <a-col :xs="24" :lg="12" align="center">
              <a-tag :color="rule.time00 == 1 ? 'red' : 'green'">{{
                rule.time00 == 1 ? 'Not' : 'Yes'
              }}</a-tag>
            </a-col>
            <a-col :xs="24" :lg="12" align="center">
              <span>06:00</span>
            </a-col>
            <a-col :xs="24" :lg="12" align="center">
              <a-tag :color="rule.time06 == 1 ? 'red' : 'green'">{{
                rule.time06 == 1 ? 'Not' : 'Yes'
              }}</a-tag>
            </a-col>
            <a-col :xs="24" :lg="12" align="center">
              <span>12:00</span>
            </a-col>
            <a-col :xs="24" :lg="12" align="center">
              <a-tag :color="rule.time12 == 1 ? 'red' : 'green'">{{
                rule.time12 == 1 ? 'Not' : 'Yes'
              }}</a-tag>
            </a-col>
            <a-col :xs="24" :lg="12" align="center">
              <span>18:00</span>
            </a-col>
            <a-col :xs="24" :lg="12" align="center">
              <a-tag :color="rule.time18 == 1 ? 'red' : 'green'">{{
                rule.time18 == 1 ? 'Not' : 'Yes'
              }}</a-tag>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-empty
      :image="simpleImage"
      v-else
      description="There is no rule data available for the device."
    />
  </div>
  <transition name="slide-fade" mode="out-in">
    <div class="wrapper-list" v-if="toggleForm">
      <a-flex justify="space-between">
        <span class="bold">{{ formState.mode == 'add' ? 'Add New Rule' : 'Edit Rule Data' }}</span>
      </a-flex>
      <a-form layout="vertical" :model="formState" @finish="handleAction">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="12" :lg="4">
            <a-form-item
              label="Area"
              name="area"
              :rules="[{ required: true, message: 'Please input area', trigger: 'change' }]"
            >
              <a-input v-model:value="formState.area" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="4">
            <a-form-item
              label="Day of the week"
              name="day"
              :rules="[
                { required: true, message: 'Please select one option day', trigger: 'change' },
              ]"
            >
              <a-select
                v-model:value="formState.day"
                :options="dayOptions"
                :disabled="formState.mode == 'edit'"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="4">
            <a-form-item
              label="Report at 00:00"
              name="time00"
              :rules="[
                { required: true, message: 'Please select one option day', trigger: 'change' },
              ]"
            >
              <a-select v-model:value="formState.time00" :options="timeOptions" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="4">
            <a-form-item
              label="Report at 06:00"
              name="time06"
              :rules="[
                { required: true, message: 'Please select one option day', trigger: 'change' },
              ]"
            >
              <a-select v-model:value="formState.time06" :options="timeOptions" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="4">
            <a-form-item
              label="Report at 12:00"
              name="time12"
              :rules="[
                { required: true, message: 'Please select one option day', trigger: 'change' },
              ]"
            >
              <a-select v-model:value="formState.time12" :options="timeOptions" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="4">
            <a-form-item
              label="Report at 18:00"
              name="time18"
              :rules="[
                { required: true, message: 'Please select one option day', trigger: 'change' },
              ]"
            >
              <a-select v-model:value="formState.time18" :options="timeOptions" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-flex justify="space-between" gap="small">
          <div>
            <span class="error-message" v-if="errorMessage">Error : {{ errorMessage }}</span>
          </div>
          <a-flex gap="small">
            <a-button
              size="small"
              type="primary"
              style="background-color: #a6aebf"
              @click="handleClose"
              >Close</a-button
            >
            <a-button size="small" type="primary" html-type="submit">Submit</a-button>
          </a-flex>
        </a-flex>
      </a-form>
    </div>
  </transition>
</template>

<script setup>
import { useDashboardStore } from '@/stores/dashboard'
import { useRulesStore } from '@/stores/rules'
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { Empty } from 'ant-design-vue'
import { ref } from 'vue'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const dashboardStore = useDashboardStore()
const rulesStore = useRulesStore()
const toggleForm = ref(false)
const formState = ref({
  id: null,
  mode: null,
  area: null,
  time00: 0,
  time06: 0,
  time12: 0,
  time18: 0,
  day: null,
})
const dayOptions = ref([
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
])
const timeOptions = ref([
  { label: 'No', value: 1 },
  { label: 'Yes', value: 0 },
])
const errorMessage = ref(null)

const handleAdd = () => {
  console.log(dashboardStore.modalData.data.area)
  formState.value.mode = 'add'
  formState.value.area = dashboardStore.modalData.data.area
  toggleForm.value = true
}

const handleClose = () => {
  errorMessage.value = null
  formState.value.day = null
  toggleForm.value = false
}

const handleEdit = ({ area, id, time00, time06, time12, time18, day }) => {
  Object.assign(formState.value, { mode: 'edit', area, id, time00, time06, time12, time18, day })
  toggleForm.value = true
  console.log(formState.value)
}

const handleDelete = async (data) => {
  await rulesStore.deleteRule(data)
  await rulesStore.getRules(dashboardStore.modalData.data.area)
  handleClose()
}

const handleAction = async (data) => {
  if (formState.value.mode === 'add') {
    const response = await rulesStore.addRule(data)
    console.log(response)
    if (response === 200) {
      handleClose()
      await rulesStore.getRules(dashboardStore.modalData.data.area)
    } else {
      errorMessage.value = response.message
    }
  }
  if (formState.value.mode === 'edit') {
    const response = await rulesStore.updateRule(formState.value.id, data)
    if (response === 200) {
      handleClose()
      await rulesStore.getRules(dashboardStore.modalData.data.area)
    } else {
      errorMessage.value = response.message
    }
  }
}
</script>

<style scoped>
.bold {
  font-weight: bold;
}

.card-rules {
  border: 1px solid rgba(166, 174, 191, 0.4);
}

.wrapper-list {
  border: 1px solid rgba(166, 174, 191, 0.4);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 0.5rem;
}

.error-message {
  color: red;
}
</style>
