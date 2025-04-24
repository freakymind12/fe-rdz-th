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
    sorter: (a, b) => a.device_area.localeCompare(b.device_area),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status - b.status,
    width: 100,
  },
  {
    title: 'Sensor Configuration',
    children: [
      {
        title: 'Temperature',
        children: [
          {
            title: 'Min',
            dataIndex: 't_min',
            key: 't_min',
            sorter: (a, b) => a.t_min - b.t_min,
            width: 75,
          },
          {
            title: 'Max',
            dataIndex: 't_max',
            key: 't_max',
            sorter: (a, b) => a.t_max - b.t_max,
            width: 75,
          },
        ],
      },
      {
        title: 'Humidity',
        children: [
          {
            title: 'Min',
            dataIndex: 'h_min',
            key: 'h_min',
            sorter: (a, b) => a.h_min - b.h_min,
            width: 75,
          },
          {
            title: 'Max',
            dataIndex: 'h_max',
            key: 'h_max',
            sorter: (a, b) => a.h_max - b.h_max,
            width: 75,
          },
        ],
      },
    ],
  },
]

defineProps({
  data: Array,
})
</script>
