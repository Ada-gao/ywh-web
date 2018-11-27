<template>
  <div class="com_page">
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入销售名称" v-model="listQuery.saleName"/>
      <el-input @keyup.enter.native="handleFilter" v-if="isSuperAdmin === 'true'" placeholder="输入所属公司名称" v-model="listQuery.companyName"/>
      <el-button icon="search" @click="handleFilter"><i class="fa fa-search"/><span>查询</span></el-button>
      <el-select v-model="listQuery.team" placeholder="团队筛选" clearable @change="handleFilter1">
        <el-option v-for="item in teams" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.accountId" placeholder="账户筛选" :disabled="isSuperAdmin !== 'true'" clearable @change="handleFilter1">
        <el-option v-for="item in accounts" :key="item.accountId" :label="item.accountName" :value="item.accountId"></el-option>
      </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">工作量列表</span>
      <el-button  @click="handleExport">
        <i class="iconfont icon-piliangdaochu"/><span>批量导出</span>
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="销售名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.uname}}</span></template>
      </el-table-column>
      <el-table-column label="所属公司">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column label="所属账户">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.accountName}}</span></template>
      </el-table-column>
      <el-table-column label="所属团队">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.team}}</span></template>
      </el-table-column>
      <el-table-column label="有效通话时长" width="140">
        <template slot-scope="scope"><span>{{scope.row.totalEffectiveDuration}}秒</span></template>
      </el-table-column>
      <el-table-column label="目标任务数">
        <template slot-scope="scope"><span>{{scope.row.totalTaskgroupCnt}}</span></template>
      </el-table-column>
      <el-table-column label="目标通话客户数" width="160">
        <template slot-scope="scope"><span>{{scope.row.totalTaskCnt}}</span></template>
      </el-table-column>
      <el-table-column label="实际任务数">
        <template slot-scope="scope"><span>{{scope.row.completeGroupCnt}}</span></template>
      </el-table-column>
      <el-table-column label="实际通话客户数" width="160">
        <template slot-scope="scope"><span>{{scope.row.totalTaskCompleteCnt}}</span></template>
      </el-table-column>
      <el-table-column label="外呼总数">
        <template slot-scope="scope"><span>{{scope.row.cnt}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="平均通话时长" width="140">
        <template slot-scope="scope"><span>{{scope.row.duration}}秒</span></template>
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
        isSuperAdmin:'false',
      }
    },
    created() {
      this.getList()
      this.getQuery()
      let accountId = sessionStorage.getItem('accountId')
      if (accountId) {
        this.listQuery.accountId = parseInt(accountId)
      }
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    },
    methods: {
      getList() {
        this.Api.workload(this.listQuery).then(response => {
          let data = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list  = []
          data.forEach((item,index) => {
            let obj = new Object()
            obj.uname = item[0];
            obj.companyName = item[1];
            obj.accountName = item[2];
            obj.team = item[3];
            obj.totalEffectiveDuration = item[4];
            obj.totalTaskgroupCnt = item[5];
            obj.totalTaskCnt = item[6];
            obj.completeGroupCnt = item[7];
            obj.totalTaskCompleteCnt = item[8]
            obj.cnt = item[9]
            obj.duration = item[10]
            this.list[index] = obj
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
        this.Api.accounts(params).then(res => {
          this.accounts = res.data
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
        if (this.isSuperAdmin === 'true'){
          delete this.listQuery.accountId
        }
        delete this.listQuery.team
        if (!this.listQuery.saleName) {
          delete this.listQuery.saleName
        }
        if (!this.listQuery.companyName) {
          delete this.listQuery.companyName
        }
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.saleName
        delete this.listQuery.companyName
        if (!this.listQuery.accountId) {
          delete this.listQuery.accountId
        }
        if (!this.listQuery.team) {
          delete this.listQuery.team
        }
        this.listQuery.pageIndex = 0
        this.currentPage = 1
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
        this.Api.workload(query).then(response => {
          let data = response.data.content
          let list = []
          data.forEach((item,index) => {
            let obj = new Object()
            obj.销售名称 = item[0];
            obj.所属公司 = item[1];
            obj.所属账户 = item[2];
            obj.所属团队 = item[3];
            obj.有效通话时长 = item[4] + '秒';
            obj.目标任务数 = item[5];
            obj.目标通话客户数 = item[6];
            obj.实际任务数 = item[7];
            obj.实际通话客户数 = item[8]
            obj.外呼总数 = item[9]
            obj.平均通话时长 = item[10] + '秒'
            list[index] = obj
          })
          this.Utils.exportExcel(list,'工作量列表.xlsx')
        })
      },
    }
  }
</script>
