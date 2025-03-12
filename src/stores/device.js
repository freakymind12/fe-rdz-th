import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

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
        } else {
          console.error('Error while update area', response.status)
        }
      } catch (error) {
        console.error(error)
      }
    },

    async updateParameter(data) {
      try {
        const response = await api.patch(`/device/change-parameter`, data)
        if (response.status === 200) {
          message.success(`Update parameter for device ${data.area} success`)
        } else {
          console.error('Error while update parameter', response.status)
        }
      } catch (error) {
        console.error(error)
      }
    },

    async updateGroup(data) {
      try {
        const response = await api.patch(`/device/change-group`, data)
        if (response.status === 200) {
          message.success('Update group success')
        } else {
          console.error('Error while update group', response.status)
        }
      } catch (error) {
        console.error(error)
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
            label: device.area,
            value: device.area,
          })

          return acc
        }, {}),
      )

      return [{ label: 'All', value: 'All' }, ...groupedOptions]
    },
  },
})
