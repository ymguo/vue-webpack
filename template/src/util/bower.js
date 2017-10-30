import { isIOS } from './env'

export const setNavTitle = function (title) {
  document.title = title
  if (isIOS) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.addEventListener('load', () => {
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 9)
    }, false)
    iframe.src = '/reward/app/static/favicon.ico'
    document.body.appendChild(iframe)
  }
}

export const getUrlQuery = function (key) {
  const regex = /([^&=]+)=?([^&]*)/g
  let match
  let store = {}

  var haystack = window.location.search || window.location.hash
  haystack = haystack.substring(haystack.indexOf('?') + 1, haystack.length)

  while ((match = regex.exec(haystack))) {
    store[decodeURIComponent(match[1])] = decodeURIComponent(match[2])
  }
  return store[key]
}
