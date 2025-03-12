<template>
  <a-form layout="vertical" :model="formState" @finish="handleAction(props.mode)">
    <a-form-item
      label="Name"
      name="name"
      :rules="[{ required: true, message: 'Please input group name', trigger: 'change' }]"
    >
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-flex justify="flex-end" gap="small">
      <a-button type="default" @click="emit('close')">Cancel</a-button>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-flex>
  </a-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGroupStore } from '@/stores/group'
const groupStore = useGroupStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: null,
  },
})
const formState = ref({
  name: props.data?.group_name || null,
})

const emit = defineEmits(['close'])

const resetForm = (data) => {
  formState.value = {
    name: data?.group_name || null,
  }
}

const handleAction = async (mode) => {
  if (mode === 'add') {
    await groupStore.addGroup(formState.value)
    await groupStore.getGroup()
    resetForm()
  }
  if (mode === 'edit') {
    await groupStore.editGroup(props.data.group_id, formState.value)
    await groupStore.getGroup()
  }
  emit('close')
}

watch(
  () => props.data,
  (newVal) => {
    resetForm(newVal)
  },
)
</script>
