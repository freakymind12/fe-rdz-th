<template>
  <a-form :model="form" @finish="handleSubmit" layout="vertical">
    <a-form-item label="Email" name="email"
      :rules="[{ required: true, message: 'Please input email', trigger: 'change' }]">
      <a-input type="email" v-model:value="form.email" placeholder="example@mail.com" />
    </a-form-item>
    <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Password is required' }]">
      <a-input-password v-model:value="form.password" placeholder="***********" />
    </a-form-item>
    <a-flex justify="flex-end">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-flex>
  </a-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

const props = defineProps({
  mode: {
    type: String,
    default: null
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const form = ref({
  email: null,
  password: null
})

const emit = defineEmits(['close'])

const handleSubmit = async () => {
  await authStore.register(form.value)
  await authStore.fetchAdminList()
  emit('close', false)
}

const resetForm = (data) => {
  form.value = {
    email: data?.email || null,
    password: data?.password || null,
  }
}

watch(
  () => props.data,
  (newVal) => {
    resetForm(newVal)
  },
)

</script>

<style scoped></style>
