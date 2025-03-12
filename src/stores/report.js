import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { message } from 'ant-design-vue'

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: [],
    yearmonth: ref(dayjs()),
    area: ref('All'),
  }),
  actions: {
    async getReport() {
      try {
        const params = new URLSearchParams({
          year: this.yearmonth.year(),
          month: this.yearmonth.month() + 1,
          area: this.area,
        })

        const response = await api.get(`/report?${params.toString()}`)
        if (response.status === 200) {
          this.reports = response.data.data
        }
      } catch (error) {
        console.error('Error fetching reports:', error)
      }
    },

    async downloadReport() {
      try {
        const params = new URLSearchParams({
          year: this.yearmonth.year(),
          month: this.yearmonth.month() + 1,
          area: this.area,
        })

        const response = await api.get(`/report/download?${params.toString()}`, {
          responseType: 'blob', // Menambahkan responseType blob
        })

        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute(
            'download',
            `rdz_th_${this.area}_report_${this.yearmonth.year()}_${this.yearmonth.month() + 1}.pdf`,
          )
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(url) // Membersihkan URL object setelah selesai
          link.parentNode.removeChild(link)
        }
      } catch (error) {
        if (error.response.status === 400) {
          message.error(
            `Can't proceed to download because there is no data with this search filter`,
          )
        } else {
          console.error('Error downloading report:', error)
        }
      }
    },
  },
})
