<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">名单查询</span>
    </div>
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入名单名称" v-model="listQuery.groupName"/>
      <el-button icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
      <el-select v-model="listQuery.companyId" placeholder="公司筛选" clearable :disabled="isSuperAdmin !== 'true'" @change="handleFilter1">
        <el-option v-for="item in companies" :key="item.id" :label="item.companyName" :value="item.id"/>
      </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">名单列表</span>
      <el-button @click="handleCreate"><i class="fa fa-sign-out"/><span>批量导入</span></el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="名单批次号" width="130px">
        <template slot-scope="scope"><span>{{scope.row.groupCode}}</span></template>
      </el-table-column>
      <el-table-column label="名单名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.groupName}}</span></template>
      </el-table-column>
      <el-table-column label="所属公司">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column label="名单数量">
        <template slot-scope="scope"><span>{{scope.row.totalNameCnt}}</span></template>
      </el-table-column>
      <el-table-column label="隐藏主号">
        <template slot-scope="scope"><span>{{scope.row.maskPhoneNo}}</span></template>
      </el-table-column>
      <el-table-column label="名单导入时间" width="160">
        <template slot-scope="scope"><span>{{scope.row.createTime}}</span></template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope"><a @click="handleUpdate(scope.row)">查看详情</a></template>
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
  data () {
    return {
      tableKey: 0,
      total: null,
      listLoading: true,
      listQuery: {
        pageIndex: 0,
        pageSize: 10
      },
      pageIndex: 0,
      list: null,
      sys_user_add: true,
      value: '',
      companies: [],
      currentPage: 1,
      isSuperAdmin:'false',
    }
  },
  created () {
    this.getList()
    this.getQuery()
    let companyId = sessionStorage.getItem('companyId')
    if (companyId) {
      this.listQuery.companyId = parseInt(companyId)
    }
    this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
  },
  methods: {
    //获取批次
    getList(){
      this.Api.getBatch(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
        this.list.forEach(item => {
          if (item.maskPhoneNo){
            item.maskPhoneNo = '是'
          }else{
            item.maskPhoneNo = '否'
          }
          if (item.status === '0') {
            item.status = '待审核'
          } if (item.status === '1') {
            item.status = '审核失败'
          } else if (item.status === '2') {
            item.status = '生效'
          }
          item.createTime = this.Utils.formatDateTime(item.createTime)
        })
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
    handleUpdate (obj) {
      this.$router.push({name: 'namelist', query: obj})
    },
    handleFilter () {
      if (this.isSuperAdmin === 'true'){
        delete this.listQuery.companyId
      }
      if (!this.listQuery.groupName) {
        delete this.listQuery.groupName
      }
      this.listQuery.pageIndex = 0
      this.getList()
    },
    handleFilter1 () {
      delete this.listQuery.groupName
      if (!this.listQuery.companyId) {
        delete this.listQuery.companyId
      }
      this.listQuery.pageIndex = 0
      this.getList()
    },
    handleCreate () {
      this.$router.push({path: '/list/excel'})
    }
  }
}
</script>
