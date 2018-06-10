<template>
  <section style="text-align: center">
    <div>
    <rate-table loanType="GJJ"></rate-table>
    </div>
    <div style="margin-top: 50px">
    <rate-table loanType="SYDK"></rate-table>
    </div>
  </section>
</template>
<script>
import RateTable from '../../components/RateTable.vue'

export default {
  data () {
    return {}
  },
  components: {
    RateTable
  }
}
</script>

<style>
</style>
