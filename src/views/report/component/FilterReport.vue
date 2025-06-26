<template>
  <a-flex vertical wrap="wrap">
    <span class="title">RDZ-TH Report</span>
    <a-flex justify="flex-start" wrap="wrap" gap="10">
      <a-space direction="vertical" :size="0">
        <span class="bold">Year Month</span>
        <a-date-picker v-model:value="reportStore.yearmonth" picker="month" :allowClear="false" style="width: 110px" />
      </a-space>
      <a-space direction="vertical" :size="0">
        <span class="bold">Device Area</span>
        <a-select v-model:value="reportStore.area" :options="deviceStore.deviceOptions" class="selector" />
      </a-space>
      <a-space direction="vertical" :size="0">

        <a-popconfirm title="Are you sure to download pdf report file ?" @confirm="reportStore.downloadReport()">
          <a-button type="primary" style="margin-top:1.2rem">
            <FilePdfOutlined /> Download
          </a-button>
        </a-popconfirm>
      </a-space>
    </a-flex>
  </a-flex>
</template>


<script setup>
// import BaseCardColumn from '@/components/shared/BaseCardColumn.vue'
import { useReportStore } from '@/stores/report'
import { useDeviceStore } from '@/stores/device'
import { FilePdfOutlined } from '@ant-design/icons-vue'
import { onMounted } from 'vue'

const reportStore = useReportStore()
const deviceStore = useDeviceStore()



onMounted(() => {
  deviceStore.getDevice()
  reportStore.getReport()
})
</script>

<style scoped>
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

.selector {
  width: 200px;
}
</style>
