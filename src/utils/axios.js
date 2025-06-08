import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:4523/m1/6411691-6108923-default',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }

})

axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
    console.error('请求出错', err)
    return Promise.reject(err)
  }
)

export default axiosInstance