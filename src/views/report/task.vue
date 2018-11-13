<template>
  <div class="com_page">
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入任务名称" v-model="listQuery.taskName"/>
      <el-input @keyup.enter.native="handleFilter" v-if="isSuperAdmin === 'true'" placeholder="输入所属公司名称" v-model="listQuery.companyName"/>
      <el-button icon="search" @click="handleFilter"><i class="fa fa-search"/><span>查询</span></el-button>
      <el-select v-model="listQuery.productName" placeholder="产品筛选" clearable @change="handleFilter2">
        <el-option v-for="item in products" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.team" placeholder="团队筛选" clearable @change="handleFilter1">
        <el-option v-for="item in teams" :key="item" :label="item" :value="item"/>
      </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">外呼任务列表</span>
      <el-button @click="handleExport">
        <i class="iconfont icon-piliangdaochu" /><span>批量导出</span>
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="任务名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.taskName}}</span></template>
      </el-table-column>
      <el-table-column label="推广产品">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.productName}}</span></template>
      </el-table-column>
      <el-table-column label="所属公司">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column label="所属团队">
        <template slot-scope="scope"><span>{{scope.row.team}}</span></template>
      </el-table-column>
      <el-table-column label="名单名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.groupName}}</span></template>
      </el-table-column>
      <el-table-column label="完成数">
        <template slot-scope="scope"><span>{{scope.row.totalTaskCompleteCnt}}</span></template>
      </el-table-column>
      <el-table-column label="完成率">
        <template slot-scope="scope"><span>{{scope.row.taskCompleteRate}}</span></template>
      </el-table-column>
      <el-table-column label="外呼总数">
        <template slot-scope="scope"><span>{{scope.row.cnt}}</span></template>
      </el-table-column>
      <el-table-column label="平均通话时长">
        <template slot-scope="scope"><span>{{scope.row.duration}}秒</span></template>
      </el-table-column>
      <el-table-column label="任务计划完成时间" width="160">
        <template slot-scope="scope"><span>{{scope.row.taskEndDate}}</span></template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading">
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
  export default {
    data() {
      return {
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        currentPage: 1,
        list: null,
        accounts: [],
        teams: [],
        products: [],
        isSuperAdmin:'false',
      }
    },
    created() {
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
      this.getList()
      this.getQuery()
    },
    methods: {
      getList() {
        this.Api.getAdminTasks(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            item.taskCompleteRate = item.taskCompleteRate + '%'
            item.taskEndDate = this.Utils.formatDate(item.taskEndDate)
          })
        })
      },
      getQuery() {
        let params = {
          companyId: sessionStorage.getItem('companyId')
        }
        this.Api.getTeams(params).then(res => {
          this.teams = res.data
        })
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
        delete this.listQuery.team
        delete this.listQuery.productName
        if (!this.listQuery.taskName) {
          delete this.listQuery.taskName
        }
        if (!this.listQuery.companyName) {
          delete this.listQuery.companyName
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.taskName
        delete this.listQuery.companyName
        if (!this.listQuery.team) {
          delete this.listQuery.team
        }
        this.listQuery.pageIndex = 0
        this.getList()
        this.Api.getProductByTeam(encodeURI(this.listQuery.team)).then((res) => {
          this.products = res.data
        })
      },
      handleFilter2() {
        delete this.listQuery.taskName
        delete this.listQuery.companyName
        if (!this.listQuery.team) {
          delete this.listQuery.team
        }
        if (!this.listQuery.productName) {
          delete this.listQuery.productName
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleExport(){
        if (this.total === 0){
          this.$message.warning(`查询当前列表为空`);
          return
        }
        let query = JSON.parse(JSON.stringify(this.listQuery))
        query.pageIndex = 0
        query.pageSize = this.total
        this.Api.getAdminTasks(query).then(response => {
          let data = response.data.content
          let list = []
          data.forEach((item,index) => {
            let obj = new Object()
            obj.任务名称 = item.taskName
            obj.推广产品 = item.productName
            obj.所属公司 = item.companyName
            obj.所属团队 = item.team
            obj.名单名称 = item.groupName
            obj.完成数 = item.totalTaskCompleteCnt
            obj.完成率 = item.taskCompleteRate + '%'
            obj.外呼总数 = item.cnt
            obj.平均通话时长 = item.duration + '秒'
            obj.任务计划完成时间 = this.Utils.formatDate(item.taskEndDate)
            list[index] = obj
          })
          this.Utils.exportExcel(list,'外呼任务列表.xlsx')
        })
      },
    }
  }
</script>
