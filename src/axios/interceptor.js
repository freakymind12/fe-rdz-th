import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Sesuaikan dengan URL backend Anda
})

// Anda bisa menambahkan interceptor lain jika diperlukan, misalnya untuk logging atau menangani error
// Request Interceptor (optional)
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response Interceptor (optional)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('Error response', error)
    return Promise.reject(error)
  },
)

export default api
