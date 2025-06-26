<template>
  <slot name="data-display" />
  <a-form layout="vertical" :model="formState" @finish="handleAction">
    <a-form-item label="Password" name="password"
      :rules="[{ required: true, message: 'You need password for this action', trigger: 'blur' }]">
      <a-input-password v-model:value="formState.password" auto-complete="password" placeholder="*********" />
    </a-form-item>
    <a-alert type="error" show-icon class="mb">
      <template #message>
        <span>This action will unlink all device connected with this group !</span>
      </template>
    </a-alert>
    <a-flex justify="flex-end">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-flex>
  </a-form>
</template>

<script setup>
import { ref } from 'vue';
import { useGroupStore } from '@/stores/group';


const groupStore = useGroupStore()
const formState = ref({
  password: null,
})

const props = defineProps({ data: Object })

const emit = defineEmits(['close'])

const handleAction = async () => {
  const { group_id } = props.data
  await groupStore.deleteGroup(group_id, formState.value.password)
  await groupStore.getGroup()
  emit('close')
}
</script>

<style scoped></style>