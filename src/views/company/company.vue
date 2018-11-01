<template>
  <div class="com_page">
      <div class="com_head">
        <span class="com_title">公司查询</span>
      </div>
      <div class="com_filter">
          <el-input @keyup.enter.native="handleFilter" placeholder="输入公司名称关键词" v-model="listQuery.companyName"/>
          <el-button icon="search" @click="handleFilter">
            <i class="fa fa-search"/><span>查询</span>
          </el-button>
          <el-select v-model="listQuery.companyProvince" placeholder="省份筛选" clearable @change="handleFilter1">
            <el-option v-for="item in provinceData" :key="item.value" :label="item.label" :value="item"/>
          </el-select>
          <el-select v-model="listQuery.industryType" placeholder="行业筛选" clearable @change="handleFilter1">
            <el-option v-for="item in industry" :key="item.id" :label="item.name" :value="item.name"/>
          </el-select>
          <el-select v-model="listQuery.orgSize" placeholder="公司规模筛选" clearable @change="handleFilter1">
            <el-option v-for="item in orgSize" :key="item.value" :label="item.label" :value="item.label"/>
          </el-select>
      </div>
    <div class="com_head">
      <span class="com_title">公司列表</span>
      <el-button @click="handleCreate" v-if="isSuperAdmin === 'true'">
        <i class="fa fa-plus"/><span>新建公司</span>
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="公司ID"  width="130px">
        <template slot-scope="scope"><span>{{scope.row.companyCode}}</span></template>
      </el-table-column>
      <el-table-column label="公司名称" >
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column label="公司地址">
        <template slot-scope="scope">
          <span class="com-two-row">{{scope.row.companyAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司所在省份">
        <template slot-scope="scope"><span>{{scope.row.companyProvince}}</span></template>
      </el-table-column>
      <el-table-column label="所属行业">
        <template slot-scope="scope"><span>{{scope.row.industryType}}</span></template>
      </el-table-column>
      <el-table-column label="公司规模">
        <template slot-scope="scope">
          <span>{{scope.row.orgSize}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope"><a @click="handleUpdate(scope.row)">查看详情</a></template>
      </el-table-column>
    </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     v-show="!listLoading"
                     :current-page.sync="currentPage"
                     background
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
  </div>
</template>
<script>
import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

export default {
  data () {
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
      currentPage: 1,
      isSuperAdmin:'false',
    }
  },
  created () {
    this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    this.getList()
  },
  methods: {
    getList () {
      this.Api.getCompanyPage(this.listQuery).then(res => {
        this.list = res.data.content
        this.total = res.data.totalElements
        this.listLoading = false
        this.Api.getOrgSize().then(res => {
          this.orgSize = res.data
          this.list.forEach(item => {
          })
        })
      })
      this.Api.getAuthDustries().then(res => {
        this.industry = res.data
      })
    },
    handleUpdate (obj) {
      this.$router.push({name: 'detail', query: obj})
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.pageIndex = val - 1
      this.getList()
    },
    handleFilter () {
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
    handleFilter1 () {
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
    handleCreate () {
      this.$router.push({path: '/company/create'})
    }
  }
}
</script>
