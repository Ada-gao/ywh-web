<template>
  <div class="com_page">
    <div style="margin-bottom: 20px">
      <el-card :body-style="{ padding: '0px' }" style="height: 140px;">
        <el-row :gutter="1" style="background: #e3e3e3;margin-top: 45px;margin-bottom: 45px;">
          <el-col :span="12">
            <div class="card-item">
              <el-button class="card-button-left" @click="handleOpen" icon="iconfont icon-kaitong"><span>开通账户</span>
              </el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card-item">
              <el-button class="card-button-right" @click="handleRecharge" icon="iconfont icon-recharge"><span>账户充值</span>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="com_head">
      <span class="com_title">账户查询</span>
    </div>
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入所属公司名称" v-model="listQuery.companyName"></el-input>
      <el-input @keyup.enter.native="handleFilter" placeholder="输入联系人姓名" v-model="listQuery.name"></el-input>
      <el-input @keyup.enter.native="handleFilter" placeholder="输入账户ID" v-model="listQuery.accountCode"></el-input>
      <el-button icon="search" @click="handleFilter"><i class="fa fa-search"></i><span>查询</span></el-button>
      <el-select v-model="listQuery.type" placeholder="账户类型筛选" clearable @change="handleFilter1">
        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.status" placeholder="账户状态筛选" clearable @change="handleFilter1">
        <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">账户列表</span>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="账户ID">
        <template slot-scope="scope"><span>{{scope.row.accountCode}}</span></template>
      </el-table-column>
      <el-table-column label="账户名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.accountName}}</span></template>
      </el-table-column>
      <el-table-column label="所属公司">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column label="所属行业">
        <template slot-scope="scope"><span>{{scope.row.industry}}</span></template>
      </el-table-column>
      <el-table-column label="所在地">
        <template slot-scope="scope"><span>{{scope.row.companyProvince}}</span></template>
      </el-table-column>
      <el-table-column label="账户余额">
        <template slot-scope="scope"><span>{{(scope.row.balance * 0.01).toFixed(2)}}</span></template>
      </el-table-column>
      <el-table-column label="累计消费金额" width="130">
        <template slot-scope="scope"><span>{{(scope.row.totalConsumption * 0.01).toFixed(2)}}</span></template>
      </el-table-column>
      <el-table-column label="联系人">
        <template slot-scope="scope"><span>{{scope.row.contact}}</span></template>
      </el-table-column>
      <el-table-column label="联系手机" width="120">
        <template slot-scope="scope"><span>{{scope.row.contactMobile}}</span></template>
      </el-table-column>
      <el-table-column label="账户类型">
        <template slot-scope="scope"><span>{{scope.row.accountType === 'Charge' ? '付费使用': '试用体验'}}</span></template>
      </el-table-column>
      <el-table-column label="账户状态">
        <template slot-scope="scope">
          <div style="cursor:pointer;" @click="showStatusDialog(scope.row)">
            <span :style="scope.row.accountStatus?'color:#009801':'color:#D0021B'">{{scope.row.accountStatus?'启用':'停用'}}</span>
            <i class="fa fa-cog" style="color: #a9a4a4;margin-left: 10px"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope"><a size="small" class="common_btn" @click="handleUpdate(scope.row)">查看详情</a>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="currentPage" background :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="修改状态" :visible.sync="updateStatusDialog" width="20%">
      <el-radio-group v-model="radio" style="text-align: center;width: 100%">
        <el-radio label="启用"></el-radio>
        <el-radio label="停用" style="margin-left: 100px"></el-radio>
      </el-radio-group>
      <div style="text-align: right;margin-top: 30px">
        <el-button class="search_btn" @click="updateStatusDialog = false">取 消</el-button>
        <el-button class="add_btn" @click="enabledAccount">确 定</el-button>
      </div>
    </el-dialog>

      <div class="com_head" style="margin-top: 20px">
        <span class="com_title">充值查询</span>
      </div>
      <div  class="com_filter">
          <el-input @keyup.enter.native="handleFilter3" placeholder="输入充值帐户" v-model="listQuery2.accountName"/>
          <el-input @keyup.enter.native="handleFilter3" placeholder="输入所属公司" v-model="listQuery2.companyName"/>
          <el-button icon="search" @click="handleFilter3"><i class="fa fa-search"/><span>查询</span></el-button>
          <el-select v-model="listQuery2.accountType" placeholder="账户类型筛选" clearable @change="handleFilter4">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          <el-select v-model="listQuery2.status" placeholder="充值状态筛选" clearable @change="handleFilter4">
            <el-option v-for="item in recharges" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">充值列表</span>
      <el-button @click="handlerExcel">
        <i class="iconfont icon-piliangdaochu" /><span>批量导出</span>
      </el-button>
    </div>
    <el-table :data="list2" v-loading="listLoading2" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="充值流水号">
        <template slot-scope="scope"><span>{{scope.row.rechargeCode}}</span></template>
      </el-table-column>
      <el-table-column label="充值帐户">
        <template slot-scope="scope"><span>{{scope.row.accountName}}</span></template>
      </el-table-column>
      <el-table-column label="所属公司">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column label="帐户类型">
        <template slot-scope="scope"><span>{{scope.row.accountType}}</span></template>
      </el-table-column>
      <el-table-column label="充值金额">
        <template slot-scope="scope"><span>{{scope.row.money}}</span></template>
      </el-table-column>
      <el-table-column label="充值时间" >
        <template slot-scope="scope"><span>{{scope.row.createTime}}</span></template>
      </el-table-column>
      <el-table-column label="充值状态">
        <template slot-scope="scope"><span>{{scope.row.status}}</span></template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope"><span>{{scope.row.userName}}</span></template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading2">
      <div style="float: right;line-height: 30px;color: #0299CC;font-size: 14px">累计充值金额：{{(money * 0.01).toFixed(2)}}元</div>
      <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                     :current-page.sync="currentPage2" background :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery2.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total2">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        radio: '',
        updateStatusDialog: false,
        item: null,
        money: 0,
        list: null,
        listLoading: true,
        total: 0,
        currentPage: 1,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        list2: null,
        listLoading2: true,
        total2: 0,
        currentPage2: 1,
        listQuery2: {
          pageIndex: 0,
          pageSize: 10
        },
        types: [
          {
            label: '付费使用',
            value: 'Charge'
          },
          {
            label: '试用体验',
            value: 'Trial'
          }
        ],
        states: [
          {
            label: '启用',
            value: 'true'
          },
          {
            label: '停用',
            value: 'false'
          }
        ],
        recharges: [
          {
            label: '充值成功',
            value: 'true'
          },
          {
            label: '充值失败',
            value: 'false'
          }
        ]
      }
    },
    created() {
      this.getAccounts()
      this.getRechargePage()
    },
    methods: {
      enabledAccount() {
        let enabled = false
        if (this.radio === '启用') {
          enabled = true
        }
        if (enabled != this.item.accountStatus) {
          this.Api.enabledAccount(this.item.id, enabled).then(res => {
            this.item.accountStatus = enabled
            if (enabled) {
              this.$message({
                message: '启用成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '停用成功',
                type: 'success'
              })
            }
          })
        }
        this.updateStatusDialog = false
      },
      showStatusDialog(val) {
        this.item = val
        if (this.item.accountStatus) {
          this.radio = '启用'
        } else {
          this.radio = '停用'
        }
        this.updateStatusDialog = true
      },
      getAccounts() {
        this.Api.getAccounts(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
        })
      },
      getRechargePage() {
        this.Api.getRechargePage(this.listQuery2).then(response => {
          this.money = response.data.statisResult;
          this.list2 = response.data.content
          this.total2 = response.data.totalElements
          this.listLoading2 = false
          this.list2.forEach(item => {
            item.money = (item.money * 0.01).toFixed(2)
            item.accountType = item.accountType === 'Charge' ? '付费使用': '试用体验'
            item.status = item.status ? '充值成功': '充值失败'
            item.createTime = this.Utils.formatDateTime(item.createTime)
          })
        })
      },
      handlerExcel() {
        if (this.total2 === 0){
          this.$message.warning(`查询当前列表为空`);
          return
        }
        let query = JSON.parse(JSON.stringify(this.listQuery2))
        query.pageIndex = 0
        query.pageSize = this.total2
        this.Api.getRechargePage(query).then(response => {
          let list = response.data.content
          list.forEach(item => {
            item.money = (item.money * 0.01).toFixed(2)
            item.accountType = item.accountType === 'Charge' ? '付费使用': '试用体验'
            item.status = item.status ? '充值成功': '充值失败'
            item.createTime = this.Utils.formatDateTime(item.createTime)
            item.充值流水号 = item.rechargeCode
            item.充值帐号 = item.accountName
            item.所属公司 = item.companyName
            item.账户类型 = item.accountType
            item.充值金额 = item.money
            item.充值时间 = item.createTime
            item.充值状态 = item.status
            item.操作人 = item.userName
            delete item.rechargeCode
            delete item.money
            delete item.status
            delete item.userId
            delete item.userName
            delete item.createTime
            delete item.remark
            delete item.accountName
            delete item.companyName
            delete item.accountType
          })
          this.Utils.exportExcel(list,'充值列表.xlsx')
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getAccounts()
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val - 1
        this.getAccounts()
      },
      handleSizeChange2(val) {
        this.listQuery2.pageSize = val
        this.getRechargePage()
      },
      handleCurrentChange2(val) {
        this.listQuery2.pageIndex = val - 1
        this.getRechargePage()
      },
      handleFilter() {
        delete this.listQuery.type
        delete this.listQuery.status
        if (!this.listQuery.companyName) {
          delete this.listQuery.companyName
        }
        if (!this.listQuery.name) {
          delete this.listQuery.name
        }
        if (!this.listQuery.accountCode) {
          delete this.listQuery.accountCode
        }
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.getAccounts()
      },
      handleFilter1() {
        delete this.listQuery.companyName
        delete this.listQuery.name
        delete this.listQuery.accountCode
        if (!this.listQuery.type) {
          delete this.listQuery.type
        }
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.getAccounts()
      },
      handleFilter3() {
        delete this.listQuery2.accountType
        delete this.listQuery2.status
        if (!this.listQuery2.accountName) {
          delete this.listQuery2.accountName
        }
        if (!this.listQuery2.companyName) {
          delete this.listQuery2.companyName
        }
        this.listQuery2.pageIndex = 0
        this.getRechargePage()
      },
      handleFilter4() {
        delete this.listQuery2.accountName
        delete this.listQuery2.companyName
        if (!this.listQuery2.accountType) {
          delete this.listQuery2.accountType
        }
        if (!this.listQuery2.status) {
          delete this.listQuery2.status
        }
        this.listQuery2.pageIndex = 0
        this.getRechargePage()
      },
      handleOpen() {
        this.$router.push({name: 'open'})
      },
      handleRecharge() {
        this.$router.push({name: 'recharge'})
      },
      handleUpdate(obj) {
        this.$router.push({name: 'systemDetail', query: obj})
      },

    }
  }
</script>

<style>
  .card-item {
    text-align: center;
    background: #FFFFFF;
  }

  .card-item span {
    margin-left: 5px;
  }

  .card-button-left, .card-button-left:hover {
    width: 180px;
    height: 50px;
    color: #FFFFFF !important;
    font-size: 16px;
    border-radius: 4px;
    background: #0299CC !important;;
    border-color: #0299CC !important;
  }

  .card-button-right, .card-button-right:hover {
    width: 180px;
    height: 50px;
    color: #FFFFFF !important;
    font-size: 16px;
    border-radius: 4px;
    background: #F8C065 !important;
    border-color: #F8C065 !important;
  }
</style>
