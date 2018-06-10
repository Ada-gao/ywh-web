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
