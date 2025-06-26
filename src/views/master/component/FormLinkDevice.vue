<template>
  <a-form layout="vertical" :model="formState" @finish="handleAction">
    <a-form-item label="Device Area" name="area"
      :rules="[{ required: true, message: 'Please select device area', trigger: 'blur' }]">
      <a-select mode="multiple" :options="deviceStore.deviceUnlinkedOptions" show-search v-model:value="formState.area"
        :filterOption="filterOption" />
    </a-form-item>
    <a-flex justify="flex-end" gap="small">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-flex>
  </a-form>
</template>

<script setup>
import { ref } from 'vue'
import { useDeviceStore } from '@/stores/device'

const deviceStore = useDeviceStore()

const formState = ref({
  area: []
})

const emit = defineEmits(['close', 'link-new'])

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const handleAction = () => {
  emit('link-new', formState.value)
  emit('close')
  formState.value = {
    area: []
  }
}

</script>

<style scoped></style>