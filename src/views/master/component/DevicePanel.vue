<template>
  <a-collapse-panel>
    <template #header>
      <a-flex justify="space-between" align="center" wrap="wrap">
        <span class="bold">Device List</span>
        <a-tag class="bold" color="#3674B5">{{ data.length }} Devices</a-tag>
      </a-flex>
    </template>
    <a-flex justify="flex-end" class="wrapper-button">
      <a-button type="primary" size="small" @click="handleOpenModal">Link new
        device to this group</a-button>
    </a-flex>
    <MasterTable :columns="columns" :data="data" :scroll="{ x: 'max-content', y: 200 }">
      <template #bodyCell="{ column, record }">
        <template v-if="['n_min', 'n_max', 'p_min', 'p_max'].includes(column.key)">
          <span v-if="record[column.key] != null">{{ record[column.key] }}</span>
          <a-tag class="bold" v-else color="red">Unsupported</a-tag>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag class="bold" :color="record.status ? 'green' : 'red'">{{
            record.status ? 'Enabled' : 'Disabled'
            }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-flex justify="center">
            <a-popconfirm title="Are you sure unlink this device from group ?" @confirm="handleUnlinkDevice(record)">
              <a-button danger type="primary" size="small">Unlink</a-button>
            </a-popconfirm>
          </a-flex>
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
    <!-- Modal Link new device -->
    <Teleport to="body">
      <BaseModal :visible="modalData.visible" :modal-title="modalData.title" @close="handleClose">
        <template #body>
          <FormLinkDevice @close="handleClose" @link-new="handleAction" />
        </template>
      </BaseModal>
    </Teleport>
  </a-collapse-panel>


</template>

<script setup>
import MasterTable from '@/components/shared/MasterTable.vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import FormLinkDevice from './FormLinkDevice.vue'
import { useDeviceStore } from '@/stores/device'
import { useGroupStore } from '@/stores/group'
import { useWebSocketStore } from '@/stores/websocket'
import { ref } from 'vue'

const groupStore = useGroupStore()
const deviceStore = useDeviceStore()
const wsStore = useWebSocketStore()

const props = defineProps({
  data: Array,
  group: Object
})

const modalData = ref({
  visible: false,
  data: null,
  title: '',
})

const handleOpenModal = () => {
  modalData.value.visible = true
  modalData.value.title = `Link new device to [${props.group.group_name}]`
  modalData.value.data = null
}

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}

const handleAction = async (data) => {
  const { group_name, group_id } = props.group
  for (const area of data.area) {
    const payload = {
      oldArea: area,
      group_id
    }
    await deviceStore.updateGroup(payload)
    const target = wsStore.data.find(item => item.area === area)
    if (target) {
      target.group_id = group_id
      target.group_name = group_name
    }
    console.log(target)
  }
  await groupStore.getGroup()
  await deviceStore.getDevice()
}

const columns = [
  {
    title: 'Area',
    dataIndex: 'device_area',
    key: 'device_area',
    fixed: 'left',
    sorter: (a, b) => a.device_area.localeCompare(b.device_area),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    fixed: 'left',
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
      {
        title: 'Noise',
        children: [
          {
            title: 'Min',
            dataIndex: 'n_min',
            key: 'n_min',
            sorter: (a, b) => a.n_min - b.n_min,
            width: 75,
          },
          {
            title: 'Max',
            dataIndex: 'n_max',
            key: 'n_max',
            sorter: (a, b) => a.n_max - b.n_max,
            width: 75,
          },
        ],
      },
      {
        title: 'Pressure',
        children: [
          {
            title: 'Min',
            dataIndex: 'p_min',
            key: 'p_min',
            sorter: (a, b) => a.p_min - b.p_min,
            width: 75,
          },
          {
            title: 'Max',
            dataIndex: 'p_max',
            key: 'p_max',
            sorter: (a, b) => a.p_max - b.p_max,
            width: 75,
          },
        ],
      },
    ],
  },
  {
    title: 'Action',
    key: 'action',
    width: 100,
  },
]

const handleUnlinkDevice = async (data) => {
  const { device_area } = data
  // update device data pada db
  await deviceStore.updateGroup({ oldArea: device_area, group_id: null })
  // fetch data hasil pembaruan
  await groupStore.getGroup()
  // fetch ulang device
  await deviceStore.getDevice()
  // perbarui data device pada state websocket
  const target = wsStore.data.find(item => item.area === device_area)
  if (target) {
    target.group_id = null
    target.group_name = null
  }
}
</script>

<style scoped>
.wrapper-button {
  margin-bottom: 8px;
}
</style>
