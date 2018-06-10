<template>
  <div style="width: 80%;margin: 0 auto">
    <div class="title">
      <span><span class="sub-title">{{title}}贷款</span>基准利率值:
        <span class="base" v-show="!baseRateEdit" @click="baseRateEdit=true">{{baseRate}}</span>
        <input type="number" step="0.01" class="base" v-show="baseRateEdit" v-model="baseRateTmp"
               @keyup.enter="updateBaseRate"/><i>%</i>
        <el-button v-show="baseRateEdit" type="success" size="small" icon="check"
                   @click="updateBaseRate"></el-button>
        <el-button v-show="baseRateEdit" type="danger" size="small" icon="close"
                   @click.stop.prevent="cancelEditBaseRate"></el-button>
      </span>
      <span><el-button type="primary" size="small" icon="plus" @click="handleAdd"></el-button></span>
    </div>
    <el-table :data="rates" border highlight-current-row v-loading="listLoading" style="width: 100%">
      <el-table-column width="300px" label="对应折扣" align="center">
        <template scope="scope">
          <input type="number" step="0.01" v-show="scope.row.edit" v-model="scope.row.discountTmp"
                 @keyup.enter="handleEdit(scope.$index, scope.row)"/>
          <span class="row1" v-show="!scope.row.edit"
                @click="showInput(scope.$index, scope.row)">{{ scope.row.discount
            }}</span>
          <el-button v-show="scope.row.edit" type="success" size="small" icon="check"
                     @click="handleEdit(scope.$index, scope.row)">
          </el-button>
          <el-button v-show="scope.row.edit" type="danger" size="small" icon="close"
                     @click.stop.prevent="handleCancel(scope.$index, scope.row)">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="折扣利率" align="center">
        <template scope="scope">
          <span>{{scope.row.rate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button type="danger" @click="handleDel(scope.$index)" size="small" icon="delete2"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { getRates, updateRates } from '../api/api'
  import { validate } from '../common/js/util'

  export default {
    props: ['loanType'],
    data () {
      return {
        rates: null,
        listLoading: false,
        baseRate: null,
        baseRateTmp: null,
        baseRateEdit: false,
        title: ''
      }
    },
    methods: {
      async getRates () {
        this.listLoading = true
        let res = await getRates(this.loanType)
        this.baseRate = res.data.baseRate.toFixed(2)
        this.baseRateTmp = this.baseRate
        this.rates = res.data.rates.map(item => {
          item.discount = item.discount.toFixed(2)
          item.discountTmp = item.discount
          item.rate = (item.discount * this.baseRate).toFixed(2) + '%'
          item.edit = false
          return item
        })
        this.listLoading = false
      },
      async handleAdd () {
        if (!this.rates[this.rates.length - 1].discount) {
          return
        }
        this.rates.push({
          discount: null,
          edit: true
        })
      },
      // 删除
      async handleDel (index) {
        await this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        })
        this.rates.splice(index, 1)
        this.listLoading = true
        this.postRates()
      },
      showInput (index, row) {
        row.edit = true
      },
      // 编辑
      handleEdit (index, row) {
        if (!validate.isPositiveNum(row.discountTmp)) {
          this.$message({
            message: '输入不合法',
            type: 'error'
          })
          this.handleCancel(index, row)
          return
        }
        row.edit = false
        if (row.discountTmp === row.discount) {
          return
        }
        row.discount = row.discountTmp
        this.postRates()
      },
      handleCancel (index, row) {
        row.edit = false
        if (!row.discount) {
          this.rates.splice(index, 1)
        }
        row.discountTmp = row.discount
      },
      async postRates () {
        let rates = this.rates.concat()
        rates.forEach(item => {
          item.id = Number(item.id)
          item.discount = Number(item.discount)
          delete item.discountTmp
          delete item.edit
          delete item.rate
        })
        let id = this.loanType === 'GJJ' ? 2 : 1
        await updateRates(id, this.loanType, this.baseRate, rates).catch(err => {
          this.$message({
            message: err.response.data.error,
            type: 'error'
          })
        })
        this.getRates()
      },
      updateBaseRate () {
        if (!validate.isPositiveNum(this.baseRateTmp)) {
          this.$message({
            message: '输入不合法',
            type: 'error'
          })
          this.cancelEditBaseRate()
          return
        }
        this.baseRateEdit = false
        if (this.baseRateTmp === this.baseRate) {
          return
        }
        this.baseRate = this.baseRateTmp
        this.postRates()
      },
      cancelEditBaseRate () {
        this.baseRateTmp = this.baseRate
        this.baseRateEdit = false
      }
    },
    mounted () {
      this.getRates()
      this.title = this.loanType === 'GJJ' ? '公积金' : '商业'
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    margin-top: 10px;
    margin-bottom: 15px;
    text-align: left;
    > span {
      > .sub-title {
        font-size: 20px;
        font-weight: 500;
        margin-right: 20px;
      }
      > .base {
        font-size: 20px;
        font-weight: 500;
        margin-left: 15px;
        margin-right: 15px;
      }
      > input {
        width: 60px;
      }
      > i {
        margin-right: 15px;
      }
      &:nth-of-type(2) {
        float: right;
      }
    }
  }

  .base {
  }

  .row1 {
    display: inline-block;
    width: 100%;
  }
</style>
