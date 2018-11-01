<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">任务查询</span>
    </div>
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入任务名称" v-model="listQuery.taskName"/>
      <el-button icon="search" @click="handleFilter"><i class="fa fa-search"/><span>查询</span></el-button>
      <el-select v-model="listQuery.status" placeholder="状态筛选" clearable @change="handleFilter2">
        <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.productName" placeholder="产品筛选" clearable @change="handleFilter2">
        <el-option v-for="item in products" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.team" placeholder="团队筛选" clearable @change="handleFilter1">
        <el-option v-for="item in teams" :key="item" :label="item" :value="item"/>
      </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">任务组列表</span>
      <el-button  @click="handleCreate('import')">
        <i class="fa fa-plus" /><span>新建任务</span>
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="任务ID" width="80">
        <template slot-scope="scope"><span>{{scope.row.id}}</span></template>
      </el-table-column>
      <el-table-column label="任务名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.taskName}}</span></template>
      </el-table-column>
      <el-table-column label="产品名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.productName}}</span></template>
      </el-table-column>
      <el-table-column label="关联名单">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.groupName}}</span></template>
      </el-table-column>
      <el-table-column label="任务数" width="80">
        <template slot-scope="scope"><span>{{scope.row.totalTaskCnt}}</span></template>
      </el-table-column>
      <el-table-column label="关联团队" show-overflow-tooltip>
        <template slot-scope="scope"><span>{{scope.row.team}}</span></template>
      </el-table-column>
      <el-table-column label="完成数" width="80">
        <template slot-scope="scope"><span>{{scope.row.totalTaskCompleteCnt}}</span></template>
      </el-table-column>
      <el-table-column label="完成率" width="80">
        <template slot-scope="scope"><span>{{scope.row.taskCompleteRate+'%'}}</span></template>
      </el-table-column>
      <el-table-column label="外呼次数限制" width="120">
        <template slot-scope="scope"><span>{{scope.row.limitedTimes?scope.row.limitedTimes:'无'}}</span></template>
      </el-table-column>
      <el-table-column label="任务计划完成时间" width="160">
        <template slot-scope="scope"><span>{{scope.row.taskEndDate}}</span></template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span :style="scope.row.status==='生效'?'color:#17C263': scope.row.status==='待审核'?'color:#F7BA2A':'color:#D0021B'">{{scope.row.status}}</span>
          <el-tooltip effect="dark" placement="bottom"  :content="scope.row.rejectReason" v-show="scope.row.status==='审核失败'">
            <i class="iconfont icon-wenti" style="color:#D0021B"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope"><a @click="handleUpdate(scope.row)">查看详情</a></template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange"
                   v-show="!listLoading"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   :page-sizes="[10,20,30, 50]"
                   background
                   :page-size="listQuery.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"/>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableKey: 0,
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        currentPage: 1,
        list: null,
        sys_user_add: true,
        value: '',
        orgSize: [],
        teams: [],
        products: [],
        states:[
          {
            label: '待审核',
            value:  '0'
          },
          {
            label: '审核失败',
            value:  '1'
          },
          {
            label: '生效',
            value: '2'
          }
        ],
      }
    },
    created() {
      this.getList()
      this.getQuery()
    },
    methods: {
      getList() {
        let query = JSON.parse(JSON.stringify(this.listQuery))
        if (query.team){
          query.team = encodeURI(query.team)
        }
        query.isReport = false
        this.Api.getAdminTasks(query).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            if(item.status === '0'){
              item.status = '待审核'
            }else if(item.status === '1'){
              item.status = '审核失败'
            }else if(item.status === '2'){
              item.status = '生效'
            }
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
        // getProductList().then(res => {
        //   this.products = res.data
        // })
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
        delete this.listQuery.productName
        delete this.listQuery.team
        delete this.listQuery.status
        if (!this.listQuery.taskName) {
          delete this.listQuery.taskName
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.taskName
        delete this.listQuery.productName
        if (!this.listQuery.team) {
          delete this.listQuery.team
        }
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        this.listQuery.pageIndex = 0
        this.getList()
        this.Api.getProductByTeam(encodeURI(this.listQuery.team)).then((res) => {
          this.products = res.data
        })
      },
      handleFilter2() {
        delete this.listQuery.taskName
        if (!this.listQuery.team) {
          delete this.listQuery.team
        }
        if (!this.listQuery.productName) {
          delete this.listQuery.productName
        }
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleCreate() {
        this.$router.push({name: 'newTask'})
      },
      handleUpdate(obj) {
        this.$router.push({name: 'taskDetail', query: {item:JSON.stringify(obj)}})
      }
    }
  }
</script>
