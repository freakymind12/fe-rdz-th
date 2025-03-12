import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    modalVisible: ref(false),
    modalData: ref({
      data: null,
      mode: null,
    }),
    reload: false,
  }),
})
