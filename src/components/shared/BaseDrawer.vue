<template>
  <a-drawer :visible="visible" :title="title" :width="width" :closable="closable" @close="handleClose"
    :footer="footer ? undefined : null">
    <slot />
    <template v-if="footer" #footer>
      <slot name="footer" />
    </template>
  </a-drawer>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: 400,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  footer: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>
