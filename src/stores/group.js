import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

export const useGroupStore = defineStore('group', {
  state: () => ({
    group: [],
  }),
  actions: {
    async getGroup() {
      try {
        const response = await api.get('/group')
        if (response.status === 200) {
          this.group = response.data.data
        } else {
          console.error('Failed to get group data', response.status)
        }
      } catch (error) {
        console.error(error)
      }
    },

    async addGroup(data) {
      try {
        const response = await api.post('/group', data)
        if (response.status === 200) {
          message.success('Group data added successfully')
        }
        return response.status
      } catch (error) {
        message.error(error.response.data.message)
        return error.response.data
      }
    },

    async editGroup(id, data) {
      try {
        const response = await api.patch(`/group/${id}`, data)
        if (response.status === 200) {
          message.success('Update group data success')
        }
        return response.status
      } catch (error) {
        message.error(error.response.data.message)
        return error.response.data
      }
    },

    async deleteGroup(id, password) {
      try {
        if (password !== "adminrdzth123") {
          message.error("Wrong password")
          return
        }

        const response = await api.delete(`/group/${id}`)

        if (response.status === 200) {
          message.success('Delete group data success')
        }
        return response.status
      } catch (error) {
        return error.response.data
      }
    },
  },
  getters: {
    groupOptions(state) {
      return state.group.map((group) => ({
        label: group.group_name,
        value: group.group_id,
      }))
    },
    // Index genap: 0, 2, 4, ...
    evenGroups(state) {
      return state.group.filter((_, index) => index % 2 === 0)
    },

    // Index ganjil: 1, 3, 5, ...
    oddGroups(state) {
      return state.group.filter((_, index) => index % 2 !== 0)
    },
  },
})
