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
