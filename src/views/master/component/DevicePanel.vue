<template>
  <a-collapse-panel>
    <template #header>
      <a-flex justify="space-between" align="center" wrap="wrap">
        <span class="bold">Device List</span>
        <a-tag class="bold" color="#3674B5">{{ data.length }} Devices</a-tag>
      </a-flex>
    </template>
    <MasterTable :columns="columns" :data="data" :scroll-y="200">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag class="bold" :color="record.status ? 'green' : 'red'">{{
            record.status ? 'Enabled' : 'Disabled'
          }}</a-tag>
        </template>
      </template>
      <template #footer>
        <a-flex justify="space-between" wrap="wrap">
          <span class="bold">
            Note : <span class="footer-note"> This device data is readable only</span>
          </span>
          <span class="bold">
            Total :
            {{ data.length }} Devices
          </span>
        </a-flex>
      </template>
    </MasterTable>
  </a-collapse-panel>
</template>

<script setup>
import MasterTable from '@/components/shared/MasterTable.vue'

const columns = [
  {
    title: 'Area',
    dataIndex: 'device_area',
    key: 'device_area',
    sorter: (a, b) => a.device_area - b.device_area,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status - b.status,
  },
]

defineProps({
  data: Array,
})
</script>
