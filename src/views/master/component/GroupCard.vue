<template>
  <a-card size="small">
    <a-flex justify="space-between" wrap="wrap" align="center" gap="small" class="mb">
      <a-tag class="bold large" color="#3674B5">{{ group.group_name }}</a-tag>
      <a-space :size="5">
        <a-button size="small" style="background-color: #b7b7b7" type="primary"
          @click="emit('edit', group)">Edit</a-button>
        <a-popconfirm title="Are you sure to delete this group?" @confirm="handleDelete">
          <a-button size="small" type="primary" danger>Delete</a-button>
        </a-popconfirm>
      </a-space>
    </a-flex>
    <a-flex vertical gap="small">
      <a-collapse>
        <DevicePanel :data="group.devices" :group="group" />
      </a-collapse>
      <a-collapse>
        <PicPanel :data="group.pics" :group="{ group_id: group.group_id, group_name: group.group_name }" />
      </a-collapse>
    </a-flex>
  </a-card>
</template>

<script setup>

import DevicePanel from './DevicePanel.vue';
import PicPanel from './PicPanel.vue';
import { useGroupStore } from '@/stores/group';

const groupStore = useGroupStore()

const props = defineProps({
  group: Object,
})

const emit = defineEmits(['edit'])

const handleDelete = async () => {
  const { group_id } = props.group
  await groupStore.deleteGroup(group_id)
  await groupStore.getGroup()
}
</script>
