<template>
  <a-card size="small">
    <a-flex justify="space-between" wrap="wrap" align="center" gap="small" class="mb">
      <a-tag class="bold large" color="#3674B5">{{ group.group_name }}</a-tag>
      <a-space :size="5">
        <a-button size="small" style="background-color: #b7b7b7" type="primary"
          @click="emit('edit', group)">Edit</a-button>
        <a-button size="small" type="primary" danger @click="handleOpenModal">Delete</a-button></a-space>
    </a-flex>
    <a-flex vertical gap="small">
      <a-collapse>
        <DevicePanel :data="group.devices" :group="group" />
      </a-collapse>
      <a-collapse>
        <PicPanel :data="group.pics" :group="{ group_id: group.group_id, group_name: group.group_name }" />
      </a-collapse>
    </a-flex>

    <!-- Modal Link new device -->
    <Teleport to="body">
      <BaseModal :visible="modalData.visible" :modal-title="modalData.title" @close="handleClose">
        <template #body>
          <FormPassword @close="handleClose" :data="modalData.data" />
        </template>
      </BaseModal>
    </Teleport>
  </a-card>
</template>

<script setup>
import { ref } from 'vue';
import DevicePanel from './DevicePanel.vue';
import PicPanel from './PicPanel.vue';
import FormPassword from './FormPassword.vue';
import BaseModal from '@/components/shared/BaseModal.vue';

const props = defineProps({
  group: Object,
})

const emit = defineEmits(['edit'])

const modalData = ref({
  visible: false,
  data: null,
  title: `Delete Group [${props.group.group_name}]`,
})

const handleOpenModal = () => {
  modalData.value.visible = true
  modalData.value.data = props.group

}

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}
</script>
