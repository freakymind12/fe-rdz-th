<template>
  <a-collapse-panel>
    <template #header>
      <a-flex justify="space-between" align="center" wrap="wrap">
        <span class="bold">PIC List</span>
        <a-tag class="bold" color="#3674B5"> {{ data.length }} Persons</a-tag>
      </a-flex>
    </template>

    <a-flex justify="flex-end" class="mb">
      <a-button type="primary" size="small" @click="handleAssign"><UserOutlined /> Add</a-button>
    </a-flex>
    <a-flex vertical gap="small">
      <a-card
        size="small"
        class="bold"
        v-for="{ email, pic_id, pic_group_id } in data"
        :key="pic_id"
      >
        <a-flex justify="space-between">
          <span class="bold">{{ email }}</span>
          <a-popconfirm
            title="Are you sure to delete this email from group ?"
            @confirm="handleDelete(pic_group_id)"
          >
            <a-button danger type="primary" size="small"><DeleteOutlined /> </a-button>
          </a-popconfirm>
        </a-flex>
      </a-card>
      <a-empty v-if="!data.length" description="There is no data pic for this group" />
    </a-flex>

    <Teleport to="body">
      <BaseModal
        :visible="modalData.visible"
        :mode="modalData.mode"
        @close="handleClose"
        :modal-title="modalData.title"
      >
        <template #body>
          <FormAssign :data="modalData.data" :mode="modalData.mode" @close="handleClose" />
        </template>
      </BaseModal>
    </Teleport>
  </a-collapse-panel>
</template>

<script setup>
import { UserOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { usePicStore } from '@/stores/pic'
import { useGroupStore } from '@/stores/group'
import BaseModal from '@/components/shared/BaseModal.vue'
import FormAssign from './FormAssign.vue'

const groupStore = useGroupStore()
const picStore = usePicStore()

const props = defineProps({
  data: Array,
  group: Object,
})

const modalData = ref({
  visible: false,
  mode: null,
  data: null,
  title: '',
})

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}

const handleAssign = () => {
  console.log(props)
  modalData.value = {
    visible: !modalData.value.visible,
    mode: 'add',
    data: {
      group_id: props.group.group_id,
    },
    title: `Assign new pic to [ ${props.group.group_name} ]`,
  }
}

const handleDelete = async (item) => {
  await picStore.unassignPic(item)
  await groupStore.getGroup()
}
</script>
