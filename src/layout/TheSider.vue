<template>
  <a-layout-sider
    collapsible
    :trigger="null"
    v-model:collapsed="siderStore.collapsed"
    theme="dark"
    class="sider"
    v-show="!siderStore.hidden"
    width="220"
  >
    <a-flex vertical>
      <div class="logo">
        <a-image :width="70" :src="hrs" :preview="false" @click="$router.push('/dashboard')" />
      </div>
      <div class="menu-container">
        <a-menu theme="dark" mode="inline" class="menu-style">
          <template v-for="item in menuItems">
            <a-menu-item v-if="!item.children" :key="item.key" :to="item.path" custom>
              <router-link :to="item.path" style="display: flex; align-items: center">
                <component :is="item.icon" />
                <span>{{ item.title }} </span>
              </router-link>
            </a-menu-item>
            <!-- v-if="item.role.includes(authStore.user.role)" -->

            <template v-else>
              <a-sub-menu :key="item.key">
                <template #title>
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </template>

                <a-menu-item
                  v-for="child in item.children"
                  :key="child.key"
                  :to="child.path"
                  custom
                >
                  <router-link :to="child.path" style="display: flex; align-items: center">
                    <component :is="child.icon" />
                    <span>{{ child.title }}</span>
                  </router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
          </template>
        </a-menu>
      </div>
      <!-- <a-flex justify="center" v-if="!siderStore.collapsed"> </a-flex> -->
    </a-flex>
  </a-layout-sider>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  UserOutlined,
  DatabaseTwoTone,
  ScheduleTwoTone,
  DashboardOutlined,
  FileTwoTone,
  FileOutlined,
  ExperimentTwoTone,
  ControlOutlined,
  DatabaseOutlined,
} from '@ant-design/icons-vue'
import SiderMenu from './sider.js'
import { useSiderStore } from '@/stores/sidebar.js'
import hrs from '../assets/images/hrs.png'
// import { useAuthStore } from '@/stores/auth.js'

// auth store untuk hidden menu sesuai role yang login
// const authStore = useAuthStore()

// Menerjemahkan nama icon dari string ke komponen icon
const iconMap = {
  DashboardOutlined,
  UserOutlined,
  DatabaseTwoTone,
  FileTwoTone,
  ScheduleTwoTone,
  ExperimentTwoTone,
  FileOutlined,
  ControlOutlined,
  DatabaseOutlined,
}

const siderStore = useSiderStore()

const menuItems = ref(
  SiderMenu.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
  })),
)

const handleResize = () => {
  if (window.innerWidth < 768) {
    siderStore.setCollapse(true)
    siderStore.setHidden(true)
    siderStore.setIsMobile(true)
  } else {
    siderStore.setHidden(false)
    siderStore.setIsMobile(false)
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo:hover {
  cursor: pointer;
}

.sider {
  border-right: 1px solid #ccc;
}

.menu-container {
  height: calc(100vh - 64px);
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-container::-webkit-scrollbar {
  width: 4px; /* Lebar scrollbar */
}

.menu-container::-webkit-scrollbar-thumb {
  background-color: #888; /* Warna scrollbar */
  border-radius: 10px; /* Membuat scrollbar lebih bulat */
}

.menu-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.menu-container::-webkit-scrollbar-track {
  background-color: #fafafa;
  border-radius: 10px;
}

.menu-style {
  font-size: 0.85rem;
}
</style>
