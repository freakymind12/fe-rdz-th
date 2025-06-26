<template>
  <div>
    <a-divider orientation="left">
      <span class="x-large divider-title bold">Device Group</span>
    </a-divider>
    <a-row :gutter="[8, 8]" :wrap="true">
      <!-- Render Groups yang punya index genap -->
      <a-col :xs="24" :lg="12">
        <div v-for="group in groupStore.evenGroups" :key="group.group_id" class="mb">
          <GroupCard :group="group" @edit="handleEdit(group)" />
        </div>
      </a-col>
      <!-- Render Groups yang punya index ganjil -->
      <a-col :xs="24" :lg="12">
        <div v-for="group in groupStore.oddGroups" :key="group.group_id" class="mb">
          <GroupCard :group="group" @edit="handleEdit(group)" />
        </div>
      </a-col>
    </a-row>

    <a-result v-if="groupStore.group.length === 0" class="no-device">
      <template #title>
        <span>No group data</span>
      </template>
      <template #subTitle>
        <span>Click the floating button on bottom right to add a group device</span>
      </template>
    </a-result>

    <!-- Float Button Add Group -->
    <a-float-button tooltip="Add New Group" type="primary" :style="{
      right: '24px',
    }" @click="handleAdd">
      <template #icon>
        <PlusCircleOutlined />
      </template>
    </a-float-button>

    <!-- Modal Form Group -->
    <Teleport to="body">
      <BaseModal :visible="modalData.visible" :modal-title="modalData.title" @close="handleClose">
        <template #body>
          <FormGroup :data="modalData.data" :mode="modalData.mode" @close="handleClose" />
        </template>
      </BaseModal>
    </Teleport>
  </div>
</template>

<script setup>
import { useGroupStore } from '@/stores/group'
import { useDeviceStore } from '@/stores/device'
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import GroupCard from './component/GroupCard.vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import FormGroup from './component/FormGroup.vue'

import { onMounted, ref } from 'vue'

const deviceStore = useDeviceStore()
const groupStore = useGroupStore()

const modalData = ref({
  visible: false,
  mode: null,
  data: null,
  title: '',
})

const handleEdit = (item) => {
  modalData.value = {
    visible: !modalData.value.visible,
    title: 'Edit Group',
    data: item,
    mode: 'edit',
  }
}

const handleAdd = () => {
  modalData.value = {
    visible: !modalData.value.visible,
    title: 'Add Group',
    data: null,
    mode: 'add',
  }
}

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}

onMounted(async () => {
  await deviceStore.getDevice()
  await groupStore.getGroup()
})
</script>

<style scoped>
.no-device {
  padding-top: 15%;
}

.divider-title {
  background-color: #f5f5f5;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
