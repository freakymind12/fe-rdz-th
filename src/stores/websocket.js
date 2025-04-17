import { notification } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { useDeviceStore } from './device'
import dayjs from 'dayjs'

const deviceStore = useDeviceStore()
export const useWebSocketStore = defineStore('websocketRdzTh', {
  state: () => ({
    selectedGroup: JSON.parse(localStorage.getItem('groupMonitor')) || 'ALL',
    socket: null,
    data: JSON.parse(localStorage.getItem('deviceActive')) || [],
    isConnected: false,
  }),

  actions: {
    connect(wsUrl) {
      if (this.socket) return // Hindari koneksi ganda

      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        this.isConnected = true
        notification.success({
          message: 'Connected',
          description: 'Connection to server successfully established',
          placement: 'bottomRight',
        })
        console.log('WebSocket connected')

        this.checkInactiveDevices()
      }

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          // console.log(message)

          // Perbarui hanya data area yang sesuai
          const index = this.data.findIndex((device) => device.area === message.area)
          if (index !== -1) {
            this.data[index] = {
              ...this.data[index],
              ...message,
              error: message.error || {
                temperature: { isError: false, reason: '' },
                humidity: { isError: false, reason: '' },
              },
            }
          } else {
            this.initializeWsData()
          }

          console.log(this.data)

          this.saveDataToLocalStorage()
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.socket.onclose = () => {
        this.isConnected = false
        notification.info({
          message: 'Closed',
          description: 'Connection to server closed',
          placement: 'bottomRight',
        })
        console.log('WebSocket disconnected')
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    },

    disconnect() {
      if (this.socket) {
        this.socket.close()
        this.socket = null
        this.isConnected = false
      }
    },

    changeArea(oldArea, newArea) {
      this.data.forEach((device) => {
        if (device.area === oldArea) {
          device.area = newArea
        }
      })
      console.log('changeArea : ', this.data)
    },

    saveDataToLocalStorage() {
      localStorage.setItem('deviceActive', JSON.stringify(this.data))
    },

    // initial declare ws data
    async initializeWsData() {
      await deviceStore.getDevice({ status: 1 })

      this.data = deviceStore.devices.map((device) => ({
        area: device.area,
        regional: device.regional,
        date: dayjs(device.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        group_id: device.group_id,
        group_name: device.group_name,
        status: device.status,
        disconnected: false,
        sensor: {
          temp: 0,
          humi: 0,
          t_min: Number(device.t_min).toFixed(0),
          t_max: Number(device.t_max).toFixed(0),
          h_min: Number(device.h_min).toFixed(0),
          h_max: Number(device.h_max).toFixed(0),
        },
        other: {
          calibration: null,
          correction: {
            temp: 0,
            humi: 0,
          },
        },
        error: {
          temperature: {
            isError: false,
            reason: '',
          },
          humidity: {
            isError: false,
            reason: '',
          },
        },
      }))

      this.saveDataToLocalStorage()
    },

    // interval check for device didnt send payload data in 1 minute
    checkInactiveDevices() {
      setInterval(() => {
        const now = dayjs()

        this.data.forEach((device) => {
          if (device.date) {
            const diffInSeconds = now.diff(dayjs(device.date, 'YYYY-MM-DD HH:mm:ss'), 'second')
            device.disconnected = diffInSeconds >= import.meta.env.VITE_DEVICE_DISCONNECT_INTERVAL
            // console.log(diffInSeconds)
            if (diffInSeconds >= import.meta.env.VITE_DASHBOARD_REINITIAL_INTERVAL) {
              this.initializeWsData()
            }
          }
        })

        this.saveDataToLocalStorage() // ✅ Simpan perubahan ke localStorage
      }, 10000) // Cek setiap 10 detik
    },

    handleChangeGroup() {
      localStorage.setItem('groupMonitor', JSON.stringify(this.selectedGroup))
    },
  },

  getters: {
    filterDeviceByGroup: (state) => {
      if (state.selectedGroup === 'ALL') return state.data
      return state.data.filter((item) => item.group_id === state.selectedGroup)
    },
  },
})
