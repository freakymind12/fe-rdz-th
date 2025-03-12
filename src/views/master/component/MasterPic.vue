<template>
  <BaseCardColumn :xs="24" :lg="24" :md="24" size="small">
    <template #body>
      <div class="wrap-master-pic">
        <a-flex justify="space-between" align="center" style="margin-bottom: 8px">
          <span class="title">PIC</span>
          <a-button type="primary" size="small" @click="handleAdd">Add PIC</a-button>
        </a-flex>
        <a-empty
          v-if="picStore.pic.length === 0"
          description="There is no pic data add some to see pic list"
        />
        <MasterTable
          v-else
          :columns="columns"
          :data="picStore.pic"
          :scroll-x="400"
          :scroll-y="215"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'created_at'">
              {{ formatDate(record.created_at) }}
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="primary" size="small" @click="handleEdit(record)" class="edit-btn"
                  ><EditOutlined
                /></a-button>
                <a-popconfirm
                  title="Are you sure to delete this pic data ?"
                  @confirm="handleDelete(record)"
                >
                  <a-button type="primary" danger size="small">
                    <DeleteOutlined />
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
          <template #footer>
            <span class="footer-note">Total Data : {{ picStore.pic.length }} Persons</span>
          </template>
        </MasterTable>
      </div>
    </template>
  </BaseCardColumn>
  <BaseModal
    :visible="modalData.visible"
    :mode="modalData.mode"
    @close="handleClose"
    :modal-title="modalData.title"
  >
    <template #body>
      <FormPic :data="modalData.data" :mode="modalData.mode" @close="handleClose" />
    </template>
  </BaseModal>
</template>

<script setup>
import BaseCardColumn from '@/components/shared/BaseCardColumn.vue'
import MasterTable from '@/components/shared/MasterTable.vue'
import { onMounted, ref } from 'vue'
import { usePicStore } from '@/stores/pic'
import { useGroupStore } from '@/stores/group'
import dayjs from 'dayjs'
import BaseModal from '@/components/shared/BaseModal.vue'
import FormPic from './FormPic.vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const picStore = usePicStore()
const groupStore = useGroupStore()

const columns = [
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => a.area.localeCompare(b.area),
    maxWidth: 400,
  },

  {
    title: 'Action',
    key: 'action',
    width: 120,
    align: 'center',
  },
]

const modalData = ref({
  visible: false,
  mode: null,
  data: null,
  title: '',
})

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const handleAdd = () => {
  modalData.value = {
    visible: !modalData.value.visible,
    title: 'Add PIC',
    data: null,
    mode: 'add',
  }
}

const handleEdit = (item) => {
  modalData.value = {
    visible: !modalData.value.visible,
    title: 'Edit PIC',
    data: item,
    mode: 'edit',
  }
}

const handleDelete = async (item) => {
  const { id } = item
  await picStore.deletePic(id)
  await picStore.getPic()
  await groupStore.getGroup()
}

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}

onMounted(() => {
  picStore.getPic()
})
</script>

<style scoped>
.title {
  font-size: x-large;
  font-weight: 600;
}

.footer-note {
  font-weight: 700;
  font-style: italic;
}

.edit-btn {
  background-color: #eca400;
}

.edit-btn:hover {
  background-color: #eca500a8;
}

.wrap-master-pic {
  height: 365px;
}
</style>
