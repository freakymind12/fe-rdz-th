import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'
import { useGroupStore } from './group'

const groupStore = useGroupStore()

export const usePicStore = defineStore('pic', {
  state: () => ({
    pic: [],
  }),

  actions: {
    async getPic() {
      try {
        const response = await api.get(`/pic`)
        if (response.status === 200) {
          this.pic = response.data.data
        } else {
          console.error('Failed to get pic on this device', response.status)
        }
      } catch (error) {
        console.error(error)
      }
    },

    async deletePic(id) {
      try {
        const response = await api.delete(`/pic/${id}`)
        if (response.status === 200) {
          message.success('Delete PIC success')
        }
      } catch (error) {
        console.error(error)
      }
    },

    async addPic(data) {
      try {
        const response = await api.post('/pic', data)
        if (response.status === 200) {
          message.success('Add PIC success')
          await this.getPic()
        }
        return response.status
      } catch (error) {
        message.error(error.response.data.message)
        return error.response.data
      }
    },

    async updatePic(id, data) {
      try {
        const response = await api.patch(`/pic/${id}`, data)
        if (response.status === 200) {
          message.success('Update PIC success')
          await this.getPic()
          await groupStore.getGroup()
        }
        return response.status
      } catch (error) {
        message.error(error.response.data.message)
        return error.response.data
      }
    },

    async assignPic(data) {
      try {
        const response = await api.post('/pic/assign', data)
        if (response.status === 200) {
          message.success('Assign PIC success')
        }
        return response.status
      } catch (error) {
        message.error(error.response.data.message)
        return error.response.data
      }
    },

    async unassignPic(id) {
      try {
        const response = await api.delete(`/pic/assign/${id}`)
        if (response.status === 200) {
          message.success('Unassign PIC success')
        }
        return response.status
      } catch (error) {
        console.error(error)
      }
    },
  },

  getters: {
    picOptions: (state) => {
      return state.pic.map((pic) => ({
        label: pic.email,
        value: pic.id,
      }))
    },
  },
})
