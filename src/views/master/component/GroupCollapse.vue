<template>
  <div class="group-card">
    <a-row :gutter="[6, 6]">
      <a-col
        :xs="24"
        :lg="24"
        :md="24"
        size="small"
        v-for="group in groupStore.group"
        :key="group.id"
      >
        <a-collapse collapsible="header" class="group-collapse">
          <a-collapse-panel>
            <template #header>
              <span class="bold">{{ group.group_name }}</span>
            </template>
            <template #extra>
              <a-space>
                <a-button type="primary" size="small" class="edit-btn" @click="emit('edit', group)">
                  <EditOutlined />
                </a-button>
                <a-popconfirm
                  title="Are you sure to delete this group?"
                  @confirm="emit('delete', group)"
                >
                  <a-button danger type="primary" size="small">
                    <DeleteOutlined />
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
            <PicList :picList="group.pics" :group="group" />
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
    <a-empty
      v-if="groupStore.group.length === 0"
      description="There is no group data add some to see group list"
    />
  </div>
</template>

<script setup>
import { useGroupStore } from '@/stores/group'
import PicList from './PicList.vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
const groupStore = useGroupStore()

const emit = defineEmits(['edit', 'delete'])
</script>

<style scoped>
.group-card {
  height: 320px;
  overflow-y: auto;
  padding: 8px 8px 8px 0;
}

.bold {
  font-weight: bold;
}

.mb {
  margin-bottom: 10px;
}

.edit-btn {
  background-color: #eca400;
}

.edit-btn:hover {
  background-color: #eca500a8;
}

.group-collapse {
  margin-bottom: 0.1rem;
}
</style>
