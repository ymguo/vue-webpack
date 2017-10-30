export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') > 0
export const isAndroid = UA && UA.indexOf('android') > 0
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
export const isZhisland = UA && UA.indexOf('zhisland') > 0
export const zhVersion = isZhisland && UA.match(/zhisland\/([\\.]*)/)[1]
export const isWechat = UA && UA.indexOf('micromessenger') > 0

export const cookieEnabled = inBrowser && window.navigator.cookieEnabled

export const platform = isWechat ? 'wx'
                      : isZhisland ? 'app' : 'h5'

export const env = /test./.test(document.URL) ? 'test'
                : /pre./.test(document.URL) ? 'pre'
                : /dev./.test(document.URL) ? 'dev'
                : 'production'

export const system = isAndroid ? 'android'
                    : isIOS ? 'ios' : 'other'
