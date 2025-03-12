<template>
  <a-form layout="vertical" :model="formState" @finish="handleAction(props.mode)">
    <a-form-item
      label="Select PIC email"
      name="pic_id"
      :rules="[
        {
          type: 'array',
          required: true,
          message: 'Please select at least one pic email',
          trigger: 'change',
        },
      ]"
    >
      <a-select mode="multiple" v-model:value="formState.pic_id" :options="picStore.picOptions" />
    </a-form-item>
    <a-flex justify="flex-end" gap="small">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-flex>
  </a-form>
</template>

<script setup>
import { usePicStore } from '@/stores/pic'
import { useGroupStore } from '@/stores/group'
import { onMounted, ref } from 'vue'

const groupStore = useGroupStore()
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

const emit = defineEmits(['close'])
const formState = ref({
  pic_id: props.data?.pic_id || [],
})

const resetForm = (data) => {
  formState.value = {
    pic_id: data?.pic_id || [],
  }
}

const handleAction = async (mode) => {
  if (mode === 'add') {
    const payload = {
      pic_id: formState.value.pic_id,
      group_id: props.data.group_id,
    }
    await picStore.assignPic(payload)
    await groupStore.getGroup()
  }
  resetForm()
  emit('close')
}

onMounted(() => {
  picStore.getPic()
})
</script>
