<template>
  <div>
    <div class="filter-container">
      <el-row>
        <el-col :span="14">
          <el-input @keyup.enter.native="handleFilter"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="输入销售名称"
                    v-model="listQuery.saleName"/>
          <el-input @keyup.enter.native="handleFilter"
                    v-if="sysUser === 'superadmin'"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="输入所属公司名称"
                    v-model="listQuery.companyName"/>
          <el-button class="filter-item"
                     type="primary"
                     icon="search"
                     @click="handleFilter"><i class="fa fa-search"></i>查询
          </el-button>
        </el-col>
        <el-col :span="10" style="text-align: right;">
          <el-select v-model="listQuery.accountId"
                     placeholder="所属账户"
                     :disabled="sysUser === 'superadmin'?false:true"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in accounts"
              :key="item.accountId"
              :label="item.accountName"
              :value="item.accountId">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.team"
                     placeholder="所属团队"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in teams"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">工作量列表</span>
      <el-button class="add_btn" @click="handleExport">
        <i class="iconfont icon-piliangdaochu" style="color: #fff;margin-right: 10px"></i>批量导出
      </el-button>
    </div>
    <el-table
      id="consumeTable"
      :data="list"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border fit
      highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="销售名称">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.uname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属账户">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.accountName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属团队">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.team}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效通话时长">
        <template slot-scope="scope">
          <span>{{scope.row.totalEffectiveDuration}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="目标任务数">
        <template slot-scope="scope">
          <span>{{scope.row.totalTaskgroupCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="目标通话客户数">
        <template slot-scope="scope">
          <span>{{scope.row.totalTaskCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际任务数">
        <template slot-scope="scope">
          <span>{{scope.row.completeGroupCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际通话客户数">
        <template slot-scope="scope">
          <span>{{scope.row.totalTaskCompleteCnt}}</span>
        </template>
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
  import { mapGetters } from 'vuex'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import * as Api from "@/api/api"
  export default {
    computed : {
      ...mapGetters([
        'getUserInfo',
        'sysUser'
      ])
    },
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
      }
    },
    created() {
      this.getList()
      this.getQuery()
      if (this.getUserInfo.accountId) {
        this.listQuery.accountId = this.getUserInfo.accountId
      }
    },
    methods: {
      getList() {
        Api.workload(this.listQuery).then(response => {
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
            this.list[index] = obj
          })
        })
      },
      getQuery() {
        let params = {
          companyId: this.getUserInfo.companyId
        }
        Api.getTeams(params).then(res => {
          this.teams = res.data
        })
        Api.accounts(params).then(res => {
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
        if (this.sysUser === 'superadmin'){
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
        Api.workload(query).then(response => {
          let data = response.data.content
          let list = []
          data.forEach((item,index) => {
            let obj = new Object()
            obj.销售名称 = item[0];
            obj.所属公司 = item[1];
            obj.所属账户 = item[2];
            obj.所属团队 = item[3];
            obj.有效通话时长 = item[4];
            obj.目标任务数 = item[5];
            obj.目标通话客户数 = item[6];
            obj.实际任务数 = item[7];
            obj.实际通话客户数 = item[8]
            list[index] = obj
          })
          const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
          wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(list);
          var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'})
          try {
            FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '工作量列表.xlsx')
          } catch (e) {
            if (typeof console !== 'undefined') console.log(e, wbout)
          }
        })
      },
    }
  }
</script>
<style scoped lang="scss">

</style>
