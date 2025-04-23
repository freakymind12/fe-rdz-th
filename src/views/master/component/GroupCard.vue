<template>
  <a-card size="small">
    <a-flex justify="space-between" wrap="wrap" align="center" gap="small" class="mb">
      <a-tag class="bold large" color="#3674B5">{{ group.group_name }}</a-tag>
      <a-button
        size="small"
        style="background-color: #b7b7b7"
        type="primary"
        @click="emit('edit', group)"
        >Edit</a-button
      >
    </a-flex>

    <a-collapse>
      <DevicePanel :data="group.devices" />
      <PicPanel
        :data="group.pics"
        :group="{ group_id: group.group_id, group_name: group.group_name }"
      />
    </a-collapse>
  </a-card>
</template>

<script setup>
import DevicePanel from './DevicePanel.vue';
import PicPanel from './PicPanel.vue';

defineProps({
  group: Object,
})

const emit = defineEmits(['edit'])
</script>

