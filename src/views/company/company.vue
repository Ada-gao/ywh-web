<template>
  <section>
    <div>
      <div class="detail-title">
        <span class="list-tit">公司查询</span>
      </div>
      <el-row style="margin-top: 10px">
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入公司名称关键词"
                v-model="listQuery.companyName">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.companyProvince"
                     placeholder="省份筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in provinceData"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
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
    <div class="detail-title" style="margin-top: 40px">
      <span class="list-tit">公司列表</span>
      <el-button class="add_btn" @click="handleCreate" v-if="isSuperAdmin === 'true'">
        <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建公司
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%" >

      <el-table-column align="center" label="公司ID"  width="130px">
        <template slot-scope="scope">
          <span>{{scope.row.companyCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司名称" >
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.companyName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司地址">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.companyAddress}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司所在省份">
        <template slot-scope="scope">
          <span>{{scope.row.companyProvince}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属行业">
        <template slot-scope="scope">
        <span>{{scope.row.industryType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司规模">
        <template slot-scope="scope">
          <span>{{scope.row.orgSize}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="130px">
        <template slot-scope="scope">
          <a size="small" class="common_btn" @click="handleUpdate(scope.row)">查看详情</a>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     background
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </section>
</template>

<script>
  import * as Api from "@/api/api"
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
      Api.getCompanyPage(this.listQuery).then(res => {
        this.list = res.data.content
        this.total = res.data.totalElements
        this.listLoading = false
        Api.getOrgSize().then(res => {
          this.orgSize = res.data
          this.list.forEach(item => {
          })
        })
      })
      Api.getAuthDustries().then(res => {
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

<style scoped>

</style>
