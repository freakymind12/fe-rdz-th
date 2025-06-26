<template>
  <a-row :wrap="true" :gutter="[16, 16]">
    <BaseCardColumn size="small" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <template #body>
        <a-flex vertical gap="small">
          <FilterReport />
          <div v-if="loading" class="loading-container">
            <a-spin size="large" />
            <p>Loading...</p>
          </div>
          <!-- Table hanya muncul saat tidak loading -->
          <ReportTable v-else :data="reportStore.reports.data" />
        </a-flex>
      </template>
    </BaseCardColumn>
  </a-row>
</template>

<script setup>
import ReportTable from '@/components/ReportTable.vue'
import { useReportStore } from '@/stores/report'
import { useDeviceStore } from '@/stores/device'
import { ref, watch, onMounted } from 'vue'
import FilterReport from './component/FilterReport.vue'
import BaseCardColumn from '@/components/shared/BaseCardColumn.vue'

const deviceStore = useDeviceStore()
const reportStore = useReportStore()
const loading = ref(false)

const handleSearch = async () => {
  loading.value = true
  await reportStore.getReport()
  loading.value = false
}

onMounted(async () => {
  await deviceStore.getDevice()
  await reportStore.getReport()
})

watch(
  [() => reportStore.yearmonth, () => reportStore.area],
  async ([newYearMonth, newArea], [oldYearMonth, oldArea]) => {
    if (newYearMonth !== oldYearMonth || newArea !== oldArea) {
      reportStore.pagination.current = 1
      reportStore.pagination.pageSize = 20
      handleSearch()
    }
  },
)
</script>

<style scoped>
.title {
  font-weight: bold;
  font-size: x-large;
}

.bold {
  font-weight: bold;
}

.selector {
  width: 200px;
}

.filter {
  margin-bottom: 1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-height: 780px;
  min-height: 500px;
}
</style>
