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
export function replaceKey (target, change) {
  for (let key in target) {
    target[change[key]] = target[key]
    delete target[key]
  }
  return target
}
