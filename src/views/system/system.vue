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
      <el-row :gutter="10">
        <el-col :span="3">
          <el-input @keyup.enter.native="handleFilter" style="width: 160px;" class="filter-item" placeholder="输入公司名称关键词" v-model="listQuery.companyName"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input @keyup.enter.native="handleFilter" style="width: 160px;" class="filter-item" placeholder="输入公司名称关键词" v-model="listQuery.companyName"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入公司名称关键词" v-model="listQuery.companyName"></el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-select v-model="listQuery.industryType"
                     placeholder="行业筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in industry"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.orgSize"
                     placeholder="公司规模筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in orgSize"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">账户列表</span>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="账户ID">
        <template slot-scope="scope"><span>{{scope.row.companyCode}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="账户名称">
        <template slot-scope="scope"><span>{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope"><span>{{scope.row.companyAddress}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="所属行业">
        <template slot-scope="scope"><span>{{scope.row.companyProvince}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="所在地">
        <template slot-scope="scope"><span>{{scope.row.industryType}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="账户余额">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="累计消费金额">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="联系人">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="联系手机">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="账户类型">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="账户状态">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
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
        <el-col :span="3">
          <el-input @keyup.enter.native="handleFilter" style="width: 160px;" class="filter-item" placeholder="输入公司名称关键词" v-model="listQuery.companyName"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入公司名称关键词" v-model="listQuery.companyName"></el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
        </el-col>
        <el-col :span="15" style="text-align: right;">
          <el-select v-model="listQuery.industryType"
                     placeholder="行业筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in industry"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.orgSize"
                     placeholder="公司规模筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in orgSize"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">充值列表</span>
      <el-button class="add_btn" @click="handleCreate" v-if="sysUser === 'superadmin'">
        <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>批量导出
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="充值流水号">
        <template slot-scope="scope"><span>{{scope.row.companyCode}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="充值帐号">
        <template slot-scope="scope"><span>{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope"><span>{{scope.row.companyAddress}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="帐号类型">
        <template slot-scope="scope"><span>{{scope.row.companyProvince}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="充值金额">
        <template slot-scope="scope"><span>{{scope.row.industryType}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="充值时间">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="充值状态">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="currentPage" background :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </section>
</template>

<script>
  import {getAuthDustries, getCompanyPage, getOrgSize} from '@/api/api'
  import {provinceAndCityData} from 'element-china-area-data' // 省市区数据
  import {mapGetters} from 'vuex'

  export default {
    components: {},
    data() {
      return {
        tableKey: 0,
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        list: null,
        sys_user_add: true,
        value: '',
        provinceData: provinceAndCityData,
        industry: [],
        orgSize: [],
        currentPage: 1
      }
    },
    computed: {
      ...mapGetters([
        'sysUser'
      ])
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        getCompanyPage(this.listQuery).then(res => {
          this.list = res.data.content
          this.total = res.data.totalElements
          this.listLoading = false
          getOrgSize().then(res => {
            this.orgSize = res.data
            this.list.forEach(item => {
            })
          })
        })
        getAuthDustries().then(res => {
          this.industry = res.data
        })
      },
      handleUpdate(obj) {
        this.$router.push({name: 'detail', query: obj})
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val - 1
        this.getList()
      },
      handleFilter() {
        this.listQuery.companyProvince = null
        this.listQuery.industryType = null
        this.listQuery.orgSize = null
        delete this.listQuery.orgSize
        delete this.listQuery.companyProvince
        delete this.listQuery.industryType
        if (!this.listQuery.companyName) {
          delete this.listQuery.companyName
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleFilter1() {
        if (this.listQuery.companyProvince) {
          this.listQuery.companyProvince = this.listQuery.companyProvince.label || this.listQuery.companyProvince
        }
        this.listQuery.companyName = ''
        delete this.listQuery.companyName
        if (!this.listQuery.companyProvince) {
          delete this.listQuery.companyProvince
        }
        if (!this.listQuery.industryType) {
          delete this.listQuery.industryType
        }
        if (!this.listQuery.orgSize) {
          delete this.listQuery.orgSize
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleCreate() {
        this.$router.push({path: '/company/create'})
      },
      handleOpen() {
        this.$router.push({name: 'open'})
      },
      handleRecharge() {
        this.$router.push({name: 'recharge'})
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
