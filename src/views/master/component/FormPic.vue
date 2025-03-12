<template>
  <a-form
    ref="formRef"
    :rules="rules"
    layout="vertical"
    :model="formState"
    @finish="handleAction(props.mode)"
  >
    <a-form-item label="PIC Email" name="email">
      <a-input v-model:value="formState.email" />
    </a-form-item>
    <a-flex justify="flex-end">
      <a-form-item>
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-flex>
  </a-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePicStore } from '@/stores/pic'

const picStore = usePicStore()

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

const formRef = ref()

const formState = ref({
  email: props.data?.email || null,
})

const resetForm = (data) => {
  formState.value = {
    email: data?.email || null,
  }
}

const rules = {
  email: [
    { required: true, message: 'Please input your email', trigger: 'change' },
    { type: 'email', message: 'Please input your valid email', trigger: 'change' },
  ],
}

const emit = defineEmits(['close'])

const handleAction = async (mode) => {
  if (mode === 'add') {
    await picStore.addPic(formState.value)
    resetForm()
  }
  if (mode === 'edit') {
    await picStore.updatePic(props.data.id, formState.value)
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
