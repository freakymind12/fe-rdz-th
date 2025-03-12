<template>
  <BaseCardColumn :xs="24" :lg="12" size="small" :md="24">
    <template #body>
      <div class="wrap-master-device">
        <span class="title">Device</span>
        <a-empty
          v-if="deviceStore.devices.length === 0"
          description="There is no device data add some to see device list"
        />
        <MasterTable
          :columns="columns"
          :data="deviceStore.devices"
          :scroll-x="300"
          :scroll-y="580"
          v-else
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'group_name'">
              <a-tag class="bold" color="#AC1754" v-if="!record.group_name">Ungrouped</a-tag>
              <a-tag color="#3D8D7A" class="bold" v-else>{{ record.group_name }}</a-tag>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag class="bold" :color="record.status ? 'green' : 'red'">{{
                record.status ? 'Enabled' : 'Disabled'
              }}</a-tag>
            </template>
            <template v-if="column.key === 'updated_at'">
              {{ dayjs(record.updated_at).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </template>
          <template #footer>
            <a-flex justify="space-between" wrap="wrap">
              <span class="bold">
                Note : <span class="footer-note"> This device data is readable only</span>
              </span>
              <span class="bold">
                Total :
                {{ deviceStore.devices.length }} Devices
              </span>
            </a-flex>
          </template>
        </MasterTable>
      </div>
    </template>
  </BaseCardColumn>
</template>

<script setup>
import BaseCardColumn from '@/components/shared/BaseCardColumn.vue'
import MasterTable from '@/components/shared/MasterTable.vue'
import { useDeviceStore } from '@/stores/device'
import { onMounted } from 'vue'
import dayjs from 'dayjs'

const deviceStore = useDeviceStore()

const columns = [
  {
    title: 'Area',
    dataIndex: 'area',
    key: 'area',
    sorter: (a, b) => a.area.localeCompare(b.area),
  },
  {
    title: 'Regional',
    dataIndex: 'regional',
    key: 'regional',
    sorter: (a, b) => a.regional.localeCompare(b.regional),
  },
  {
    title: 'Group',
    dataIndex: 'group_name',
    key: 'group_name',
    sorter: (a, b) => (a.group_name || 'Ungrouped').localeCompare(b.group_name || 'Ungrouped'),
    // minWidth: 200,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status - b.status,
    // maxWidth: 100,
  },
  {
    title: 'Sensor Configuration',
    children: [
      {
        title: 'Temperature',
        children: [
          {
            title: 'Max',
            dataIndex: 't_max',
            key: 't_max',
            width: 70,
            sorter: (a, b) => a.t_max - b.t_max,
          },
          {
            title: 'Min',
            dataIndex: 't_min',
            width: 70,
            key: 't_min',
            sorter: (a, b) => a.t_min - b.t_min,
          },
        ],
      },
      {
        title: 'Humidity',
        children: [
          {
            title: 'Max',
            dataIndex: 'h_max',
            width: 70,
            key: 'h_max',
            sorter: (a, b) => a.h_max - b.h_max,
          },
          {
            title: 'Min',
            dataIndex: 'h_min',
            width: 70,
            key: 'h_min',
            sorter: (a, b) => a.h_min - b.h_min,
          },
        ],
      },
    ],
  },
  // {
  //   title: 'Updated At',
  //   dataIndex: 'updated_at',
  //   key: 'updated_at',
  //   sorter: (a, b) => dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),
  // },
]

onMounted(() => {
  deviceStore.getDevice()
})
</script>

<style scoped>
.bold {
  font-weight: bold;
}

.title {
  font-size: x-large;
  font-weight: 600;
  margin-bottom: 10px;
}

.footer-note {
  font-style: italic;
}

.master-wrapper {
  height: 720px;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
