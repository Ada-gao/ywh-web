<template>
  <div class="com_page">
      <div class="com_head">
        <span class="com_title">名单明细查询</span>
      </div>
    <div class="com_filter">
          <el-input @keyup.enter.native="handleFilter"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="输入联系人姓名"
                    v-model="listQuery.contactName">
          </el-input>
          <el-button class="filter-item"
                     type="primary"
                     icon="search"
                     @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
          <el-select v-model="listQuery.residence"
                     placeholder="所在地"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in provinceData"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">名单明细列表</span>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="名单ID">
        <template slot-scope="scope">
          <span>{{scope.row.boundCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属公司">
        <template slot-scope="scope">
          <span class="com-two-row">{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人姓名">
        <template slot-scope="scope">
          <span class="com-two-row">{{scope.row.contactName?scope.row.contactName:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phoneNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="scope">
          <span>{{scope.row.age?scope.row.age:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.gender?scope.row.gender:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人所在地">
        <template slot-scope="scope">
          <span>{{scope.row.residence?scope.row.residence:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="名单来源">
        <template slot-scope="scope">
          <span>{{scope.row.source}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[10,20,30, 50]"
                     background
                     :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { provinceAndCityData } from 'element-china-area-data' // 省市区数据
export default {
  components: {},
  data () {
    return {
      tableKey: 0,
      total: null,
      listLoading: true,
      listQuery: {
        groupId:0,
        pageIndex: 0,
        pageSize: 10
      },
      pageIndex: 0,
      list: null,
      sys_user_add: true,
      value: '',
      companies: [],
      provinceData: provinceAndCityData,
      currentPage: 1,
      id: 0
    }
  },
  created () {
    let obj = this.$route.query
    this.listQuery.groupId = obj.id;
    this.getList()
    this.getQuery()
  },
  methods: {
    getList () {
      this.Api.getLists(this.listQuery).then(response => {
        this.list = response.data.content
        this.list.forEach((ele, index) => {
          if (ele.gender === 'GENTLEMAN') {
            ele.gender = '男'
          }
          if (ele.gender === 'LADY') {
            ele.gender = '女'
          }
        })
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    getQuery () {
      this.Api.getCompanies().then(res => {
        this.companies = res.data
      })
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
      this.listQuery.residence = null
      this.listQuery.companyId = null
      delete this.listQuery.residence
      delete this.listQuery.companyId
      if (!this.listQuery.contactName) {
        delete this.listQuery.contactName
      }
      this.listQuery.pageIndex = 0
      this.currentPage = 1
      this.getList()
    },
    handleFilter1 () {
      this.listQuery.contactName = ''
      delete this.listQuery.contactName
      if (this.listQuery.residence) {
        this.listQuery.residence = this.listQuery.residence.label || this.listQuery.residence
      } else {
        delete this.listQuery.residence
      }
      if (!this.listQuery.companyId) {
        delete this.listQuery.companyId
      }
      this.listQuery.pageIndex = 0
      this.currentPage = 1
      this.getList()
    },
    handleCreate () {
      this.$router.push({path: '/list/excel'})
    }
  }
}
</script>
