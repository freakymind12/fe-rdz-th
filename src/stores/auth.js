import api from '@/axios/interceptor';
import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    adminList: []
  }),
  persist: {
    pick: ['token']
  },
  actions: {
    async login(data) {
      try {
        const response = await api.post(`/auth/login`, data)

        const { token } = response.data.data
        this.token = token
        message.success('Login success')
        return true
      } catch (error) {
        console.error(error)
        message.error('Error while login as admin')
        return false
      }
    },

    async expiredCheck() {
      try {
        await api.get(`/auth/expired-check`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        return true
      } catch (error) {
        console.log(error)
        message.error('Token expired')
        return false
      }
    },

    async register(data) {
      try {
        await api.post(`/auth/register`, data)
        message.success('Admin register success')
      } catch (error) {
        console.error(error)
        message.error('Error while register as admin')
      }
    },

    async fetchAdminList() {
      try {
        const response = await api.get(`/auth/admin-list`)
        if (response.status === 200) {
          this.adminList = response.data.data
        }
      } catch (error) {
        console.log(error)
        message.error("Error while get admin data")
      }
    },

    async deleteAdmin(id) {
      try {
        if (this.adminList.length === 1) {
          message.info('Cannot delete admin, at least 1 admin must be registered')
          return
        }
        await api.delete(`/auth/admin/${id}`)
        message.success("Admin deleted successfully")
        await this.fetchAdminList()
      } catch (error) {
        console.log(error)
        message.error("Error while delete admin")
      }
    },
  },
  getters: {
    isLoggedIn() {
      return !!this.token
    }
  },
});
