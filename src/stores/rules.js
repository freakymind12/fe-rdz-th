import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

export const useRulesStore = defineStore('rules', {
  state: () => ({
    rules: [],
  }),
  actions: {
    async getRules(area) {
      try {
        const response = await api.get(`/rules?area=${area}`)
        if (response.status === 200) {
          this.rules = response.data.data
          this.rules.sort((a, b) => {
            const days = [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ]
            return days.indexOf(a.day) - days.indexOf(b.day)
          })
        } else {
          console.error('Failed to get device rules', response.status)
        }
      } catch (error) {
        console.error(error)
      }
    },

    async deleteRule(data) {
      const { id } = data
      try {
        const response = await api.delete(`/rules/${id}`)
        if (response.status === 200) {
          message.success('Rules data deleted successfully')
        }
      } catch (error) {
        console.error(error)
      }
    },

    async addRule(data) {
      try {
        const response = await api.post('/rules', data)
        if (response.status === 200) {
          message.success('Rules data added successfully')
        }
        return response.status
      } catch (error) {
        console.error(error)
        return error.response.data
      }
    },

    async updateRule(id, data) {
      try {
        const response = await api.patch(`/rules/${id}`, data)
        if (response.status === 200) {
          message.success('Rules data updated successfully')
        }
        return response.status
      } catch (error) {
        console.error(error)
        return error.response.data
      }
    },
  },
})
