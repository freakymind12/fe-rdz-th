<template>
  <a-modal v-model:open="localVisible" :footer="null" centered :width="props.width">
    <template #title>
      <span class="title-modal">{{ props.modalTitle }}</span>
    </template>
    <slot name="body" />
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  modalTitle: {
    type: String,
    default: 'Modal Title',
  },
  width: {
    type: String,
    default: '600px',
  },
})
const emit = defineEmits(['close'])

const localVisible = ref(false)

// Wacthing modal props visibilitas modal
watch([() => props.visible, localVisible], ([newVisible, newLocalVisible]) => {
  if (newVisible !== localVisible.value) {
    localVisible.value = newVisible
  }
  emit('close', newLocalVisible)
})
</script>

<style scoped>
.title-modal {
  font-weight: bold;
  font-size: large;
}
</style>
