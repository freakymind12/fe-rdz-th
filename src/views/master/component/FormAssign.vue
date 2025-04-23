<template>
  <a-form layout="vertical" :model="formState" @finish="handleAction(props.mode)">
    <a-form-item
      label="Select PIC email"
      name="pic_id"
      :rules="[
        {
          type: 'array',
          required: true,
          message: 'Please select at least one pic email',
          trigger: 'change',
        },
      ]"
    >
      <a-select
        mode="multiple"
        show-search
        v-model:value="formState.pic_id"
        :options="picStore.picOptions"
        :filterOption="filterOption"
      >
        <!-- Custom dropdown render untuk menambah email baru jika belum ada pada list pic -->
        <template #dropdownRender="{ menuNode: menu }">
          <v-nodes :vnodes="menu" />
          <a-divider style="margin: 4px 0" />
          <a-flex justify="space-between" gap="small">
            <a-input
              ref="inputRef"
              v-model:value="newEmail"
              placeholder="Please enter new email"
              :status="emailError ? 'error' : ''"
            />
            <a-button type="primary" @click="addEmail">
              <template #icon>
                <PlusOutlined />
              </template>
              Add
            </a-button>
          </a-flex>
          <span v-if="emailError" style="color: red;">{{ emailError }}</span>
        </template>
      </a-select>
    </a-form-item>
    <a-flex justify="flex-end" gap="small">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-flex>
  </a-form>
</template>

<script setup>
import { usePicStore } from '@/stores/pic'
import { useGroupStore } from '@/stores/group'
import { onMounted, ref, defineComponent } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes
  },
})

const newEmail = ref()
const emailError = ref('')
const inputRef = ref()

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Fungsi handler untuk menambahkan email baru ke list pic
const addEmail = async () => {
  if (!validateEmail(newEmail.value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  emailError.value = ''

  console.log('addEmail:', newEmail.value)

  await picStore.addPic({ email: newEmail.value })
  // Reset input dan fokus ulang
  newEmail.value = ''
  setTimeout(() => {
    inputRef.value?.focus()
  }, 0)
}

const groupStore = useGroupStore()
const picStore = usePicStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['close'])

const formState = ref({
  pic_id: props.data?.pic_id || [],
})

const resetForm = (data) => {
  formState.value = {
    pic_id: data?.pic_id || [],
  }
}

const handleAction = async (mode) => {
  if (mode === 'add') {
    const payload = {
      pic_id: formState.value.pic_id,
      group_id: props.data.group_id,
    }
    await picStore.assignPic(payload)
    await groupStore.getGroup()
  }
  resetForm()
  emit('close')
}

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

onMounted(() => {
  picStore.getPic()
})
</script>
