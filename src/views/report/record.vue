<template>
  <div class="com_page">
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入销售名称" v-model="listQuery.saleName"/>
      <el-input @keyup.enter.native="handleFilter" v-if="isSuperAdmin === 'true'" placeholder="输入所属公司名称" v-model="listQuery.companyName"/>
      <el-input @keyup.enter.native="handleFilter" v-if="isSuperAdmin === 'true'" placeholder="输入任务名称" v-model="listQuery.taskName"/>
      <el-button icon="search" @click="handleFilter"><i class="fa fa-search"/><span>查询</span></el-button>
    </div>
    <div class="com_filter com_filter_noFloat">
      <el-select v-model="listQuery.callType" placeholder="拨打类型筛选" clearable @change="handleFilter1">
        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.team" placeholder="团队筛选" clearable @change="handleFilter1">
        <el-option v-for="item in teams" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.accountId" :disabled="isSuperAdmin !== 'true'" placeholder="账户筛选" clearable @change="handleFilter1">
        <el-option v-for="item in accounts" :key="item.accountId" :label="item.accountName" :value="item.accountId"/>
      </el-select>
      <el-select v-model="listQuery.accountId" :disabled="isSuperAdmin !== 'true'" placeholder="下一步行动计划" clearable @change="handleFilter1">
        <el-option v-for="item in actions" :key="item.accountId" :label="item.accountName" :value="item.accountId"/>
      </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">历史通话记录列表</span>
      <el-button @click="handleExport">
        <i class="iconfont icon-piliangdaochu"/><span>批量导出</span>
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="销售名称">
        <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
      </el-table-column>
      <el-table-column label="所属公司">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column label="所属账户">
        <template slot-scope="scope"><span>{{scope.row.accountName}}</span></template>
      </el-table-column>
      <el-table-column label="所属团队">
        <template slot-scope="scope"><span>{{scope.row.team}}</span></template>
      </el-table-column>
      <el-table-column label="拨打类型">
        <template slot-scope="scope"><span>{{scope.row.callType }}</span></template>
      </el-table-column>
      <el-table-column label="关联任务">
        <template slot-scope="scope"><span>{{scope.row.taskName}}</span></template>
      </el-table-column>
      <el-table-column label="客户名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.contactName?scope.row.contactName:'-'}}</span></template>
      </el-table-column>
      <el-table-column label="外呼结果">
        <template slot-scope="scope"><span>{{scope.row.result}}</span></template>
      </el-table-column>
      <el-table-column label="下一步行动计划" width="140">
        <template slot-scope="scope"><span>{{scope.row.status}}</span></template>
      </el-table-column>
      <el-table-column label="通话时长" width="120">
        <template slot-scope="scope"><span>{{scope.row.duration}}秒</span></template>
      </el-table-column>
      <el-table-column label="拨打时间" width="160">
        <template slot-scope="scope"><span>{{scope.row.actualCallStartDate}}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <a v-if="scope.row.record" @click="handlePlay(scope.row.record)">播放录音</a>
          <span v-else>暂无录音</span>
        </template>
      </el-table-column>
    </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[10,20,30, 50]"
                     v-show="!listLoading"
                     background
                     :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    <div class="dialog">
      <el-dialog title="录音详情" :visible="playDialog" :before-close="handleClose">
        <VueAudio :url="url"/>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import VueAudio from '@/components/VueAudio'
  export default {
    components:{
      VueAudio
    },
    data() {
      return {
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10,
          userId: ''
        },
        currentPage: 1,
        list: null,
        playDialog:false,
        accounts: [],
        teams: [],
        types: [
          {
            label: '原生拨打',
            value: '0'
          },
          {
            label: '第三方拨打',
            value: '1'
          }
        ],
        actions: [
          {label: '再次外呼'}
        ],
        isSuperAdmin:'false',
        url:''
      }
    },
    created() {
      // this.getQuery()
      this.listQuery.userId = this.$route.params.userId
      // let accountId = sessionStorage.getItem('accountId')
      // if (accountId) {
      //   this.listQuery.accountId = parseInt(accountId)
      // }
      this.getList()
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    },
    methods: {
      handlePlay(url){
        this.url = url
        this.playDialog = true
      },
      handleClose(){
        this.url = ''
        this.playDialog = false
      },
      getList() {
        if (this.listQuery.userId == 0) this.listQuery.userId = ''
        this.Api.getCallHistory(this.listQuery).then(response => {
          let data = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list  = []
          data.forEach((item,index) => {
            if(item[7] === 'NOT_CALL'){
              item[7] = '未外呼'
            }else if(item[7] === 'NOT_EXIST'){
              item[7] = '空号'
            }else if(item[7] === 'UNCONNECTED'){
              item[7] = '未接通'
            }else if(item[7] === 'CONNECTED'){
              item[7] = '已接通'
            }
            if(item[8] === 'CALL_AGAIN'){
              item[8] = '再次外呼'
            }else if(item[8] === 'GIVE_UP'){
              item[8] = '放弃外呼'
            }else if(item[8] === 'FOLLOW'){
              item[8] = '继续跟进'
            }
            item[10] = this.Utils.formatDateTime(item[10])
            let obj = new Object()
            obj.name = item[0]
            obj.companyName = item[1]
            obj.accountName = item[2]
            obj.team = item[3]
            obj.callType = item[4] === 0 ?'原生拨打' :'第三方拨打'
            // obj.phoneNo = item[5]
            obj.contactName = item[6]
            obj.result = item[7]
            obj.status = item[8]
            obj.duration = item[9]
            obj.actualCallStartDate = item[10]
            obj.record = item[11]
            obj.taskName = item[5]
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
        delete this.listQuery.callType
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
        if (!this.listQuery.callType) {
          delete this.listQuery.callType
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
        this.Api.getCallHistory(query).then(response => {
          let data = response.data.content
          let list = []
          data.forEach((item,index) => {
            if(item[7] === 'NOT_CALL'){
              item[7] = '未外呼'
            }else if(item[7] === 'NOT_EXIST'){
              item[7] = '空号'
            }else if(item[7] === 'UNCONNECTED'){
              item[7] = '未接通'
            }else if(item[7] === 'CONNECTED'){
              item[7] = '已接通'
            }
            if(item[8] === 'CALL_AGAIN'){
              item[8] = '再次外呼'
            }else if(item[8] === 'GIVE_UP'){
              item[8] = '放弃外呼'
            }else if(item[8] === 'FOLLOW'){
              item[8] = '继续跟进'
            }
            item[10] = this.Utils.formatDateTime(item[10])
            let obj = new Object()
            obj.销售名称 = item[0];
            obj.所属公司 = item[1];
            obj.所属账户 = item[2];
            obj.所属团队 = item[3];
            obj.拨打类型 = item[4] === 0 ?'原生拨打' :'第三方拨打';
            obj.拨打号码 = item[5];
            obj.客户名称 = item[6];
            obj.外呼结果 = item[7]
            obj.下一步行动计划 = item[8];
            obj.有效通话时长 = item[9] + '秒';
            obj.拨打时间 = item[10]
            list[index] = obj
          })
          this.Utils.exportExcel(list,'历史通话记录列表.xlsx')
        })
      },
    }
  }
</script>
