<template>
  <a-flex justify="center" align="center" class="login-wrapper">
    <a-card size="small" class="card-wrapper">
      <a-flex vertical justify="center" align="center" class="mb" gap="small">
        <a-image :preview="false" :src="hrs" :width="90" />
        <span class="medium secondary">Login for access master data page</span>
      </a-flex>
      <a-form :model="form" @finish="loginAdmin" layout="vertical">
        <a-form-item label="Email" name="email"
          :rules="[{ required: true, message: 'Email is required' }, { type: 'email', message: 'Email format is invalid' }]">
          <a-input type="email" v-model:value="form.email" placeholder="example@mail.com" />
        </a-form-item>
        <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Password is required' }]">
          <a-input-password v-model:value="form.password" placeholder="***********" />
        </a-form-item>
        <a-flex justify="flex-end">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-flex>
      </a-form>

    </a-card>
  </a-flex>
</template>

<script setup>
import { ref } from 'vue';
import hrs from '@/assets/images/hrs.png'
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const authStore = useAuthStore()
const form = ref({
  email: '',
  password: '',
})

const loginAdmin = async () => {
  const isSuccess = await authStore.login(form.value)
  if (isSuccess) {
    router.push('/master-data')
  }
}

</script>

<style scoped>
.login-wrapper {
  height: 80vh;
}

.card-wrapper {
  width: 500px;
  padding: 10px
}
</style>
