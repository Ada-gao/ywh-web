export default {
  getLocalTime: function (nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ')
  }
}
export const validate = {
  isPositiveNum (num) {
    return (!isNaN(num) && Number(num) > 0)
  }
}
export function transformText (source, k) {
  if (!source && typeof source !== 'object') {
    return '无'
  }
  let obj = {}
  source.forEach((val) => {
    let key = val.value || val.id
    obj[key] = val.label || val.name
  })
  k = obj[k]
  return k
}
/**
 * 获取新建任务时的下一步行动规则列表
 */
export function nextActionList () {
  return [
    {
      value: 'GIVE_UP',
      label: '放弃跟进'
    },
    {
      value: 'INFO_ERROR',
      label: '信息有误'
    },
    {
      value: 'CUSTOMER_TRANSFORM',
      label: '客户转到其他部门'
    },
    {
      value: 'FOLLOW',
      label: '继续跟进'
    }
  ]
}
export function replaceKey (target, change) {
  for (let key in target) {
    target[change[key]] = target[key]
    delete target[key]
  }
  return target
}
/**
 * 创建公司提交时，将所属行业大类由数字转为对应的文字
 * @param id
 * @param arr
 */
export function transferIndustry (id, arr) {
  let idx = arr.findIndex((item, index) => {
    return item.id === id
  })
  return arr[idx].name
}
export function retransfer (name, arr) {
  let idx = arr.findIndex((item, index) => {
    return item.name === name
  })
  return arr[idx].id
}
/**
 * 将时间戳转为年月日时分秒
 * @param inputTime
 * @returns {string}
 */
export function formatDateTime (inputTime) {
  let date = new Date(inputTime)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}
export function transferCompById (id, arr) {
  let idx = arr.findIndex((item, index) => {
    return item.id === id
  })
  return arr[idx].companyName
}
