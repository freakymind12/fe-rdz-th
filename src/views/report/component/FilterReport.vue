<template>
  <BaseCardColumn :xs="24" :sm="24" :md="24" :lg="4" :xl="4" size="small">
    <template #body>
      <div class="filter-report">
        <a-flex vertical style="margin-bottom: 16px">
          <span class="title">RDZ-TH Report</span>
          <a-form :model="reportStore" layout="vertical">
            <a-form-item>
              <template #label>
                <span class="bold">Year Month</span>
              </template>
              <a-date-picker
                v-model:value="reportStore.yearmonth"
                picker="month"
                :allowClear="false"
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item>
              <template #label>
                <span class="bold">Select Device Area</span>
              </template>
              <a-select
                v-model:value="reportStore.area"
                :options="deviceStore.deviceOptions"
                class="selector"
              />
            </a-form-item>
          </a-form>
          <a-space direction="vertical" :size="0" v-if="reportStore.area !== 'All'">
            <span class="bold">Device Status</span>
            <a-tag
              class="bold"
              :color="deviceStore.getStatusByArea(reportStore.area) == 1 ? '#3D8D7A' : '#AC1754'"
              >{{
                deviceStore.getStatusByArea(reportStore.area) == 1 ? 'Enabled' : 'Disabled'
              }}</a-tag
            >
          </a-space>
        </a-flex>
        <a-flex justify="flex-end" style="margin-bottom: 16px">
          <a-popconfirm
            title="Are you sure to download pdf report file ?"
            @confirm="reportStore.downloadReport()"
          >
            <a-button type="primary"><FilePdfOutlined /> Download</a-button>
          </a-popconfirm>
        </a-flex>
        <a-row>
          <a-col :xs="24">
            <a-collapse v-model:activeKey="activeKey">
              <a-collapse-panel key="1">
                <template #header>
                  <span class="bold">Reading Instruction</span>
                </template>
                <a-flex justify="space-between" wrap="wrap" align="center">
                  <span class="no-control">N/C</span>
                  <span>No need to control or record</span>
                </a-flex>
                <a-flex justify="space-between" wrap="wrap" align="center">
                  <span class="bold">N/A</span>
                  <span>Data not recorded</span>
                </a-flex>
                <a-flex justify="space-between" align="center" wrap="wrap">
                  <div class="rectangle-warning" />
                  <span>Warning sensor value</span>
                </a-flex>
                <a-flex justify="space-between" align="center" wrap="wrap">
                  <div class="rectangle-error-min" />
                  <span>Sensor exceeds min range</span>
                </a-flex>
                <a-flex justify="space-between" align="center" wrap="wrap">
                  <div class="rectangle-error-max" />
                  <span>Sensor exceeds max range</span>
                </a-flex>
              </a-collapse-panel>
            </a-collapse>
          </a-col>
        </a-row>
      </div>
    </template>
  </BaseCardColumn>
</template>

<script setup>
import BaseCardColumn from '@/components/shared/BaseCardColumn.vue'
import { useReportStore } from '@/stores/report'
import { useDeviceStore } from '@/stores/device'
import { FilePdfOutlined } from '@ant-design/icons-vue'
import { onMounted, ref } from 'vue'

const reportStore = useReportStore()
const deviceStore = useDeviceStore()

const activeKey = ref(['1'])

onMounted(() => {
  deviceStore.getDevice()
  reportStore.getReport()
})
</script>

<style scoped>
.filter-report {
  max-height: 780px;
}

.bold {
  font-weight: bold;
}

.large {
  font-size: large;
}

.title {
  font-size: x-large;
  font-weight: bold;
  margin-bottom: 10px;
}

.no-control {
  color: #06bf3a;
  font-weight: bold;
}

.warning {
  color: #fdff99;
  font-weight: bold;
}

.rectangle-warning {
  width: 25px;
  height: 10px;
  background-color: #ffa725;
  border: 1px solid gray;
}
.rectangle-error-min {
  width: 25px;
  height: 10px;
  background-color: #4f959d;
  border: 1px solid gray;
}

.rectangle-error-max {
  width: 25px;
  height: 10px;
  background-color: #fb9a98;
  border: 1px solid gray;
}
</style>
