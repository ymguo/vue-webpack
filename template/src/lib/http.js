import axios from 'axios'
import { Indicator } from 'mint-ui'

// axios 通用配置
let config = {}
if (process.env.NODE_ENV === 'development' && !process.env.VUE_APP_SERVER_URL) {
  // 请在此处添加您的应用的 API server url
  config.baseURL = ''
} else if (process.env.VUE_APP_SERVER_URL) {
  config.baseURL = process.env.VUE_APP_SERVER_URL
}

// 自配置 axios 实例
const instance = axios.create(config)

// 在进行网络I/O时 锁定用户界面，等待至respone 或 timeout
const lockHttp = axios.create(config)

lockHttp.interceptors.request.use(config => {
  Indicator.open()
  // do something
  return config
}, error => {
  return Promise.reject(error)
})

lockHttp.interceptors.response.use(response => {
  return Promise.resolve({
    then: function (onFulfill, onReject) {
      /**
       定义拦截操作 只是移除timer和监听器 最终将response交出
       https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
      **/
      const handler = () => {
        // 清掉保险timer
        clearTimeout(timeout)
        // 确保代码块中 其他代码执行完毕
        setTimeout(() => {
          document.removeEventListener('transitionend', handler, false)
        }, 0)
        // 后续的then方法可以接着处理 这里通过onFulfill抛出的response 执行后续操作
        onFulfill(response)
      }

      // 在侦测到动画结束时启动拦截操作
      document.addEventListener('transitionend', handler, false)

      // 加层保险
      const timeout = setTimeout(() => {
        handler()
      }, 400)

      Indicator.close()
    }
  })
}, error => {
  return Promise.reject(error)
})

instance.lock = function () {
  return lockHttp
}

export default instance

export {lockHttp}
