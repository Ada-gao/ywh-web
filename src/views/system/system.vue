<template>
  <section>
    <el-card :body-style="{ padding: '0px' }" style="height: 140px;padding-top: 45px;padding-bottom: 45px;">
      <el-row :gutter="1" style="background: #e3e3e3">
        <el-col :span="12">
          <div class="card-item">
            <el-button class="card-button-left" @click="handleOpen" icon="iconfont icon-kaitong"><span>开通账户</span></el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="card-item">
            <el-button class="card-button-right" @click="handleRecharge" icon="iconfont icon-recharge"><span>账户充值</span></el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div class="filter-container" style="margin-top: 20px">
      <div class="detail-title">
        <span class="list-tit">账户查询</span>
      </div>
      <el-row>
        <el-col :span="14">
          <el-input @keyup.enter.native="handleFilter" style="width: 190px;" class="filter-item" placeholder="输入所属公司名称" v-model="listQuery.companyName"></el-input>
          <el-input @keyup.enter.native="handleFilter" style="width: 190px;" class="filter-item" placeholder="输入联系人姓名" v-model="listQuery.name"></el-input>
          <el-input @keyup.enter.native="handleFilter" style="width: 190px;" class="filter-item" placeholder="输入账户ID" v-model="listQuery.accountCode"></el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
        </el-col>
        <el-col :span="10" style="text-align: right;">
          <el-select v-model="listQuery.type"
                     placeholder="帐号类型"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.status"
                     placeholder="帐号状态"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in states"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">账户列表</span>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="账户ID">
        <template slot-scope="scope"><span>{{scope.row.accountCode}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="账户名称">
        <template slot-scope="scope"><span>{{scope.row.accountName}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope"><span>{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="所属行业">
        <template slot-scope="scope"><span>{{scope.row.industry}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="所在地">
        <template slot-scope="scope"><span>{{scope.row.companyProvince}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="账户余额">
        <template slot-scope="scope"><span>{{scope.row.balance}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="累计消费金额">
        <template slot-scope="scope"><span>{{scope.row.totalConsumption}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="联系人">
        <template slot-scope="scope"><span>{{scope.row.contact}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="联系手机">
        <template slot-scope="scope"><span>{{scope.row.contactMobile}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="账户类型">
        <template slot-scope="scope"><span>{{scope.row.accountType === 'Charge' ? '付费使用': '试用体验'}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="账户状态">
        <template slot-scope="scope"><span :style="scope.row.accountStatus?'color:#009801':'color:#D0021B'">{{scope.row.accountStatus?'生效':'失效'}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope"><a size="small" class="common_btn" @click="handleUpdate(scope.row)">查看详情</a></template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="currentPage" background :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <div class="filter-container" style="margin-top: 20px">
      <div class="detail-title">
        <span class="list-tit">充值查询</span>
      </div>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :span="14">
          <el-input @keyup.enter.native="handleFilter3" style="width: 190px;" class="filter-item" placeholder="输入充值帐号" v-model="listQuery2.accountName"></el-input>
          <el-input @keyup.enter.native="handleFilter3" style="width: 190px;" class="filter-item" placeholder="输入所属公司" v-model="listQuery2.companyName"></el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter3"><i class="fa fa-search"></i>查询</el-button>
        </el-col>
        <el-col :span="10" style="text-align: right;">
          <el-select v-model="listQuery2.accountType"
                     placeholder="账户类型"
                     clearable
                     @change="handleFilter4">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="listQuery2.status"
                     placeholder="充值状态"
                     clearable
                     @change="handleFilter4">
            <el-option
              v-for="item in recharges"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">充值列表</span>
      <el-button class="add_btn" @click="handleExport">
        <i class="iconfont icon-piliangdaochu" style="color: #fff;margin-right: 10px"></i>批量导出
      </el-button>
    </div>
    <el-table :data="list2" v-loading="listLoading2" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="充值流水号">
        <template slot-scope="scope"><span>{{scope.row.rechargeCode}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="充值帐号">
        <template slot-scope="scope"><span>{{scope.row.accountName}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope"><span>{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="帐号类型">
        <template slot-scope="scope"><span>{{scope.row.accountType === 'Charge' ? '付费使用': '试用体验'}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="充值金额">
        <template slot-scope="scope"><span>{{scope.row.money}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="充值时间">
        <template slot-scope="scope"><span>{{scope.row.createTime}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="充值状态">
        <template slot-scope="scope"><span>{{scope.row.status?'充值成功':'充值失败'}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope"><span>{{scope.row.userName}}</span></template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading2">
      <div style="float: right;line-height: 30px;color: #0299CC;font-size: 14px">累计充值金额：100000元</div>
      <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                     :current-page.sync="currentPage2" background :page-sizes="[10,20,30, 50]" :page-size="listQuery2.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total2">
      </el-pagination>
    </div>

  </section>
</template>

<script>
  import {getAccounts,getRechargePage} from "../../api/api";

  export default {
    data() {
      return {
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
            label: '生效',
            value: 'true'
          },
          {
            label: '失效',
            value: 'false'
          }
        ],
        recharges: [
          {
            label: '成功',
            value: 'true'
          },
          {
            label: '失败',
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
      getAccounts() {
        getAccounts(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
        })
      },
      getRechargePage() {
        getRechargePage(this.listQuery2).then(response => {
          this.list2 = response.data.content
          this.total2 = response.data.totalElements
          this.listLoading2 = false
          this.list2.forEach(item => {
            let date = new Date(item.createTime)
            item.createTime = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate() + ' ' +date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
          })
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
      handleExport(obj) {
        alert('批量导出')
      }
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
    color: #FFFFFF!important;
    font-size: 16px;
    border-radius: 4px;
    background: #0299CC!important;;
    border-color: #0299CC!important;
  }

  .card-button-right, .card-button-right:hover{
    width: 180px;
    height: 50px;
    color: #FFFFFF!important;
    font-size: 16px;
    border-radius: 4px;
    background: #F8C065!important;
    border-color: #F8C065!important;
  }
</style>
