<template>
  <a-collapse-panel>
    <template #header>
      <a-flex justify="space-between" align="center" wrap="wrap">
        <span class="bold">Persons In Charge</span>
        <a-tag class="bold" color="#3674B5"> {{ data.length }} Persons</a-tag>
      </a-flex>
    </template>

    <a-flex justify="space-between" class="mb" align="center">
      <a-input
        size="small"
        style="width: 400px"
        v-model:value="searchFilter"
        placeholder="Search email here"
        allow-clear
      >
        <template #addonBefore> <SearchOutlined /> </template>
      </a-input>

      <a-button type="primary" size="small" @click="handleAssign"><UserOutlined /> Add</a-button>
    </a-flex>

    <a-row :gutter="[8, 8]" class="wrapper-pic">
      <a-col :span="12" v-for="{ email, pic_id, pic_group_id } in filteredData" :key="pic_id">
        <a-card size="small" class="bold " :hoverable="true">
          <a-flex justify="space-between" align="center" wrap="wrap">
            <span class="bold"><UserOutlined /> {{ email }}</span>
            <a-popconfirm
              title="Delete this email from group ?"
              @confirm="handleDelete(pic_group_id)"
            >
              <a-button danger type="primary" size="small"><DeleteOutlined /> </a-button>
            </a-popconfirm>
          </a-flex>
        </a-card>
      </a-col>
      <a-col :span="24" v-if="data.length == 0">
        <a-empty description="There is no data pic for this group" />
      </a-col>
    </a-row>

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
import { UserOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { computed, ref } from 'vue'
import { usePicStore } from '@/stores/pic'
import { useGroupStore } from '@/stores/group'
import BaseModal from '@/components/shared/BaseModal.vue'
import FormAssign from './FormAssign.vue'

const groupStore = useGroupStore()
const picStore = usePicStore()
const searchFilter = ref('')

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

const filteredData = computed(() =>
  props.data.filter((item) => item.email.toLowerCase().includes(searchFilter.value.toLowerCase())),
)
</script>

<style scoped>
.wrapper-pic {
  padding: 5px;
  max-height: 180px;
  overflow-y: auto;
}

</style>
