<template>
  <a-col :xs="24" :md="24" :lg="24">
    <a-flex justify="space-between" align="center" class="mb">
      <a-flex gap="large">
        <span class="bold"><UserOutlined /> {{ picList.length }} Persons</span>
      </a-flex>
      <a-flex gap="small">
        <a-space>
          <a-button type="primary" size="small" @click="handleAssign">Assign New</a-button>
        </a-space>
      </a-flex>
    </a-flex>
    <div class="pic-list">
      <a-row :gutter="[6, 6]" :wrap="true">
        <a-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="12"
          size="small"
          v-for="pic in picList"
          :key="pic.id"
        >
          <a-card size="small" :bordered="true">
            <a-flex justify="space-between" align="center">
              <span>{{ pic.email }}</span>
              <a-space>
                <a-popconfirm
                  title="Are you sure to delete this email from group ?"
                  @confirm="handleDelete(pic.pic_group_id)"
                >
                  <a-button danger type="primary" size="small"><DeleteOutlined /> </a-button>
                </a-popconfirm>
              </a-space>
            </a-flex>
          </a-card>
        </a-col>
        <a-col :xs="24" :lg="24" size="small" :md="24" v-if="picList.length === 0">
          <a-empty description="There is no PIC data in this group" />
        </a-col>
      </a-row>
    </div>
  </a-col>
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
</template>

<script setup>
import { DeleteOutlined, UserOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import FormAssign from './FormAssign.vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import { usePicStore } from '@/stores/pic'
import { useGroupStore } from '@/stores/group'

const picStore = usePicStore()
const groupStore = useGroupStore()
const props = defineProps({
  picList: {
    type: Array,
    required: true,
  },
  group: {
    type: Object,
    required: true,
  },
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

<style scoped>
.bold {
  font-weight: bold;
}

.mb {
  margin-bottom: 8px;
}

.pic-list {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
}

.wrapper-list {
  border: 2px solid #a6aec0;
}

.timeline-list {
  padding-top: 24px;
}
</style>
