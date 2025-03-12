<template>
  <BaseCardColumn :xs="24" :lg="24" size="small" :md="24">
    <template #body>
      <div class="wrap-master-group">
        <a-flex justify="space-between" align="center" style="margin-bottom: 8px">
          <span class="title">Group</span>
          <a-button type="primary" size="small" @click="handleAdd">Add Group</a-button>
        </a-flex>
        <GroupCollapse @edit="handleEdit" @delete="handleDelete" />
      </div>
    </template>
  </BaseCardColumn>
  <BaseModal :visible="modalData.visible" :modal-title="modalData.title" @close="handleClose">
    <template #body>
      <FormGroup :data="modalData.data" :mode="modalData.mode" @close="handleClose" />
    </template>
  </BaseModal>
</template>

<script setup>
import BaseCardColumn from '@/components/shared/BaseCardColumn.vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import GroupCollapse from './GroupCollapse.vue'
import FormGroup from './FormGroup.vue'
import { useGroupStore } from '@/stores/group'
import { onMounted, ref } from 'vue'

const groupStore = useGroupStore()
const modalData = ref({
  visible: false,
  mode: null,
  data: null,
  title: '',
})

const handleEdit = (item) => {
  modalData.value = {
    visible: !modalData.value.visible,
    title: 'Edit Group',
    data: item,
    mode: 'edit',
  }
}

const handleDelete = async (item) => {
  const { group_id } = item
  await groupStore.deleteGroup(group_id)
  await groupStore.getGroup()
}

const handleAdd = () => {
  modalData.value = {
    visible: !modalData.value.visible,
    title: 'Add Group',
    data: null,
    mode: 'add',
  }
}

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}

onMounted(() => {
  groupStore.getGroup()
})
</script>

<style scoped>
.title {
  font-size: x-large;
  font-weight: 600;
}

.footer {
  font-weight: bold;
  font-style: italic;
}

.edit-btn {
  background-color: #eca400;
}

.edit-btn:hover {
  background-color: #eca500a8;
}

.wrap-master-group {
  height: 370px;
}
</style>
