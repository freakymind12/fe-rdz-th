<template>
  <div>
    <a-divider orientation="left">
      <span class="x-large bold">Admin List</span>
    </a-divider>
    <a-row :gutter="[8, 8]">
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="4" v-for="admin in authStore.adminList" :key="admin.id">
        <a-dropdown placement="bottom">
          <template #overlay>
            <a-menu>
              <a-menu-item @click="authStore.deleteAdmin(admin.id)">
                <DeleteOutlined /> Delete
              </a-menu-item>
            </a-menu>
          </template>
          <a-card hoverable size="small">
            <a-flex vertical gap="small" justify="center">
              <span>
                <UserOutlined /> {{ admin.email }}
              </span>
              <span class="small">Created : {{ dayjs(admin.created_at).format('YYYY-MM-DD') }}</span>
            </a-flex>
          </a-card>
        </a-dropdown>
      </a-col>
    </a-row>
    <a-result v-if="authStore.adminList.length === 0">
      <template #title>
        <span>No admin data</span>
      </template>
      <template #subTitle>
        <span>Click the floating button on bottom right to create admin</span>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.fetchAdminList()
})
</script>

<style scoped></style>
