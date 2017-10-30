import http from '@/lib/http'
import {isWechat} from '@/util'
import wx from 'weixin-js-sdk'
import queryString from 'query-string'
import isFunction from 'lodash/isFunction'

const wxInit = () => {
  return new Promise((resolve, reject) => {
    http.get('/reward/api/wx/jssdk/token', {
      params: {
        url: location.href
      }
    })
    .then(res => {
      wx.config({
        ...res.data,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
      })
      wx.ready(() => { resolve(wx) })
    }, () => {
      reject(new Error('wxconfig 配置失败'))
    })
  })
}

const createShareLink = (path) => {
  return `${window.location.origin}/reward/app/static/auth.html?app_url=${encodeURIComponent(path)}`
}

let createAppURL = (params, fullpath = '/') => {
  let sharepath = fullpath
  if (params && params.join) {
    const joint = queryString.stringify(params)
    sharepath = `${sharepath}?${joint}`
  }
  return `${window.location.origin}/reward/app/#${sharepath}`
}

export const wxShare = ({page, params, fullpath, success, cancel}) => {
  return http.get('/reward/api/resource/forward/actioninfo', {
    params: {
      page: page,
      ...params
    }
  })
  .then(res => {
    const link = createShareLink(createAppURL(res.data.joinparam, fullpath))

    wx.onMenuShareTimeline({
      ...res.data.timeline,
      link,
      success () {
        if (isFunction(success))success('timeline')
        console.log('timeline share success')
      },
      cancel () {
        if (isFunction(cancel))cancel('timeline')
        console.log('timeline share cancel')
      }
    })
    wx.onMenuShareAppMessage({
      ...res.data.appMessage,
      link,
      success () {
        if (isFunction(success))success('appMessage')
        console.log('appMessage share success')
      },
      cancel () {
        if (isFunction(cancel))cancel('appMessage')
        console.log('appMessage share cancel')
      }
    })

    // 为防止上一路由隐藏菜单
    wx.showOptionMenu()
  }, () => {
    console.log('获取分享config失败')
  })
}

export const wxReady = cb => {
  if (isWechat) {
    wxInit().then(cb).catch(msg => { wxReady(cb) })
  }
}

// 示例
// wxReady(() => {
//   wxShare({
//     fullpath: this.$route.fullPath,
//     page: 'detail',
//     params: {
//       resourceId: this.$route.params.resource_id,
//       referid: this.referid
//     },
//     success() {
//       http.post(`/reward/api/resource/forward/${this.$route.resource_id}/do`, {
//         referid: this.referid
//       })
//     }
//   })
// })
