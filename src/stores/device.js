import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'
import { useAuthStore } from './auth'


export const useDeviceStore = defineStore('device', {
  state: () => ({
    devices: [],
  }),
  actions: {
    async getDevice(filters = {}) {
      try {
        const queryParams = new URLSearchParams(
          Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) acc.append(key, value)
            return acc
          }, new URLSearchParams()),
        )

        const response = await api.get(`/device?${queryParams}`)
        if (response.status === 200) {
          this.devices = response.data.data
        } else {
          console.error('Failed to fetch devices:', response.status)
        }
      } catch (error) {
        console.error(error)
      }
    },

    async checkDuplicateArea(filters = {}) {
      try {
        const queryParams = new URLSearchParams(
          Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) acc.append(key, value)
            return acc
          }, new URLSearchParams()),
        )
        const response = await api.get(`/device?${queryParams}`)
        if (response.status === 200) {
          return response.data.data
        } else {
          console.error('Error while checking duplicate area device', response.status)
        }
      } catch (error) {
        console.error(error)
      }
    },

    async updateArea(data) {
      try {
        const response = await api.patch(`/device/change-area`, data)
        if (response.status === 200) {
          message.success('Update area success')
          return true
        }
      } catch (error) {
        console.error(error)
        message.error(error.response.data.message)
        return false
      }
    },

    async updateParameter(data) {
      try {
        const response = await api.patch(`/device/change-parameter`, data)
        if (response.status === 200) {
          message.success(`Update parameter for device ${data.area} success`)
          return true
        }
      } catch (error) {
        console.error(error)
        message.error(error.response.data.message)
        return false
      }
    },

    async updateGroup(data) {
      try {
        const response = await api.patch(`/device/change-group`, data, {
          headers: {
            'Authorization': `Bearer ${useAuthStore().token}`
          }
        })
        if (response.status === 200) {
          message.success('Update group success')
          return true
        }
      } catch (error) {
        console.error(error)
        message.error(error.response.data.message)
        return false
      }
    },
  },
  getters: {
    deviceOptions: (state) => {
      const groupedOptions = Object.values(
        state.devices.reduce((acc, device) => {
          const groupName = device.group_name || 'Ungrouped'

          if (!acc[groupName]) {
            acc[groupName] = { label: groupName, options: [] }
          }

          acc[groupName].options.push({
            value: device.area,
            label: device.area.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
          })

          return acc
        }, {}),
      )
      return [{ label: 'All', value: 'All' }, ...groupedOptions]
    },

    deviceUnlinkedOptions: (state) => {
      return state.devices
        .filter(device => device.group_id === null)
        .map((device) => ({
          value: device.area,
          label: device.area.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
        }))
    },

    getStatusByArea(area) {
      const device = this.devices.find((device) => device.area === area)
      return device ? device.status : 0
    },

    totalDeviceStatusZero(state) {
      const data = state.devices.filter(device => device.status === 0)
      return {
        total: data.length,
        data: data
      }
    },
  },
})
