<template>
  <a-modal
    v-model:open="dashboardStore.modalVisible"
    @ok="handleOk"
    @cancel="handleOk"
    :width="900"
    :footer="null"
  >
    <template #title>
      <span class="title-modal">{{
        dashboardStore.modalData.mode == 'config'
          ? `Setting Config [ ${dashboardStore.modalData.data.area} ]`
          : `Setting Schedule Report [${dashboardStore.modalData.data.area}]`
      }}</span>
    </template>

    <div v-if="dashboardStore.modalData.mode == 'config'">
      <ParameterSetting />
    </div>
    <div v-if="dashboardStore.modalData.mode == 'rules'">
      <RulesSetting />
    </div>
  </a-modal>
</template>

<script setup>
import ParameterSetting from './ConfigSetting.vue'
import RulesSetting from './RulesSetting.vue'

import { useDashboardStore } from '@/stores/dashboard'
import { useRulesStore } from '@/stores/rules'
import { useGroupStore } from '@/stores/group'
import { watch } from 'vue'

const rulesStore = useRulesStore()
const groupStore = useGroupStore()
const dashboardStore = useDashboardStore()

const handleOk = () => {
  dashboardStore.modalVisible = false
  dashboardStore.modalData.mode = null
}

watch(
  () => dashboardStore.modalData.mode,
  async () => {
    if (dashboardStore.modalData.mode === 'config') {
      groupStore.getGroup()
    }
    if (dashboardStore.modalData.mode === 'rules') {
      rulesStore.getRules(dashboardStore.modalData.data.area)
    }
  },
)
</script>

<style scoped>
.title-modal {
  font-weight: bold;
  font-size: large;
}

.bold {
  font-weight: bold;
}
</style>
