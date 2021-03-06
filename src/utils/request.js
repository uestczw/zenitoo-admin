import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { setToken, getToken, removeToken, getEmp } from '@/utils/auth'
import { resetRouter } from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
      config.headers['employee'] = getEmp()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.headers.token) {
      console.log('重新设置token')
      setToken(response.headers.token)
    }
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.head.code !== 200) {
      Message({
        message: res.head.msg || 'Error',
        type: 'error',
        duration: 10 * 1000
      })
      if(res.head.code === 10001){
        removeToken() // must remove  token  first
        resetRouter()
        location.reload()
      }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.head.code === 50008 || res.head.code === 50012 || res.head.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.head.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log(error) // for debug
    Message({
      message: '网络异常请重试['+error.message+']',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
