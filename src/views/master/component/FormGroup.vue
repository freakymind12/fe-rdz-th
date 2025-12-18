<template>
  <a-form layout="vertical" :model="formState" @finish="handleAction(props.mode)">
    <a-form-item label="Name" name="name"
      :rules="[{ required: true, message: 'Please input group name', trigger: 'change' }]">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-space size="small" class="mb" v-if="mode === 'edit'">
      <a-switch size="small" v-model:checked="changePassword" />
      <span>Change Password</span>
    </a-space>
    <a-form-item label="Password" name="password" :rules="passwordRules" v-if="changePassword || mode === 'add'">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>
    <a-form-item label="Retype Password" name="retype_password" :rules="retypeRules"
      v-if="changePassword || mode === 'add'">
      <a-input-password v-model:value="formState.retype_password" />
    </a-form-item>
    <a-flex justify="flex-end" gap="small">
      <a-button type="default" @click="emit('close')">Cancel</a-button>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-flex>
  </a-form>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useGroupStore } from '@/stores/group'
const groupStore = useGroupStore()

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

const changePassword = ref(false)

const passwordRules = computed(() => {
  if (props.mode === 'add') {
    return [{ required: true, message: 'Password is required', trigger: 'change' }, {
      min: 6,
      message: 'Password must be at least 6 characters',
      trigger: 'change'
    }]
  }
  return []
})

const retypeRules = computed(() => {
  if (props.mode === 'add') {
    return [
      { required: true, message: 'Please retype password', trigger: 'change' },
      {
        validator: (_, value) => {
          if (value !== formState.value.password) {
            return Promise.reject(new Error('Password does not match'))
          }
          return Promise.resolve()
        }, trigger: 'change'
      },
      {
        min: 6,
        message: 'Password must be at least 6 characters',
        trigger: 'change'
      }
    ]
  }
  return []
})

const formState = ref({
  name: props.data?.group_name || null,
  password: null,
  retype_password: null,
})

const emit = defineEmits(['close'])

const resetForm = (data) => {
  formState.value = {
    name: data?.group_name || null,
    password: data?.password || null,
    retype_password: data?.retype_password || null,
  }
}

const handleAction = async (mode) => {
  if (mode === 'add') {
    await groupStore.addGroup({
      name: formState.value.name,
      password: formState.value.password,
    })
    await groupStore.getGroup()
    resetForm()
  }
  if (mode === 'edit') {
    const payload = {
      name: formState.value.name
    }

    if (formState.value.password) payload.password = formState.value.password

    await groupStore.editGroup(props.data.group_id, payload)
    await groupStore.getGroup()
  }
  emit('close')
}

watch(
  () => props.data,
  (newVal) => {
    resetForm(newVal)
  },
)
</script>
