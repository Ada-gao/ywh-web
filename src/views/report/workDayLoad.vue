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
      <span class="com_title">每日情况列表</span>
      <el-button  @click="handleExport">
        <i class="iconfont icon-piliangdaochu"/><span>批量导出</span>
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="日期">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.uname}}</span></template>
      </el-table-column>
      <el-table-column label="目标客户数">
        <template slot-scope="scope"><span>{{scope.row.taskCnt}}</span></template>
      </el-table-column>
      <el-table-column label="实际客户数">
        <template slot-scope="scope"><span>{{scope.row.actualCustomerCnt}}</span></template>
      </el-table-column>
      <el-table-column label="剩余客户数">
        <template slot-scope="scope"><span>{{scope.row.surplusCustomerCnt}}</span></template>
      </el-table-column>
      <el-table-column label="外呼总数">
        <template slot-scope="scope"><span>{{scope.row.cnt}}</span></template>
      </el-table-column>
      <el-table-column label="通话总时长">
        <template slot-scope="scope"><span>{{scope.row.duration}}</span></template>
      </el-table-column>
      <el-table-column label="平均通话时长">
        <template slot-scope="scope"><span>{{scope.row.duration/scope.row.connectCnt||0}}</span></template>
      </el-table-column>
      <el-table-column label="接通数">
        <template slot-scope="scope"><span>{{scope.row.connectCnt}}</span></template>
      </el-table-column>
      <el-table-column label="接通率">
        <template slot-scope="scope"><span>{{scope.row.connectCnt/scope.row.cn||0}}</span></template>
      </el-table-column>
      <el-table-column label="跟进客户数">
        <template slot-scope="scope"><span>{{scope.row.followCutomerCnt}}</span></template>
      </el-table-column>
      <el-table-column label="跟进客户占比">
        <template slot-scope="scope"><span>{{scope.row.followCutomerCnt/scope.row.actualCustomerCnt||0}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="历史通话记录">
        <template slot-scope="scope"><router-link :to="`/report/record/${scope.row.userId}`">查看详情</router-link></template>
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
          pageSize: 10,
          userId: '',
          startTime: null,
          endTime: null
        },
        currentPage: 1,
        list: null,
        accounts: [],
        teams: [],
        isSuperAdmin:'false'
      }
    },
    created() {
      this.getList()
      // this.getQuery()
      this.listQuery.userId = this.$route.params.userId
      let accountId = sessionStorage.getItem('accountId')
      // if (accountId) {
      //   this.listQuery.accountId = parseInt(accountId)
      // }
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    },
    methods: {
      getList() {
        this.Api.workDayLoad(this.listQuery).then(response => {
          let data = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list  = []
          data.forEach((item,index) => {
            let obj = new Object()
            obj.uname = item[0]
            obj.companyName = item[1]
            obj.accountName = item[3]
            obj.team = item[4]
            // obj.totalEffectiveDuration = item[5]
            obj.connectCnt = item[6] // 接通数
            obj.surplusCustomerCnt = item[7] // 剩余客户数
            obj.actualCustomerCnt = item[8] // 实际客户数
            obj.followCutomerCnt = item[9] // 跟进客户数
            obj.cnt = item[10]
            obj.duration = item[5]
            obj.taskCnt = item[11] // 目标客户数
            obj.userId = item[12]
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
          this.$message.warning(`查询当前列表为空`)
          return
        }
        let query = JSON.parse(JSON.stringify(this.listQuery))
        query.pageIndex = 0
        query.pageSize = this.total
        this.Api.workDayLoad(query).then(response => {
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
