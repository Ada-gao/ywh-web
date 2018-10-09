<template>
  <div>
    <div class="filter-container" v-if="isSuperAdmin === 'true'">
      <el-row>
        <el-col :span="14">
          <el-input @keyup.enter.native="handleFilter"
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
                     placeholder="账户筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in accounts"
              :key="item.accountId"
              :label="item.accountName"
              :value="item.accountId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">话务列表</span>
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
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属账户">
        <template slot-scope="scope">
          <span>{{scope.row.accountName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="拨打类型">
        <template slot-scope="scope">
          <span>{{scope.row.callType}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计通话时长">
        <template slot-scope="scope">
          <span>{{scope.row.totalDuration}}秒</span>
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
  import * as Utils  from '@/common/js/util'
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
        isSuperAdmin:'false',
      }
    },
    created() {
      let accountId = sessionStorage.getItem('accountId')
      if (accountId) {
        this.listQuery.accountId = parseInt(accountId)
      }
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
      this.getList()
      this.getQuery()
    },
    methods: {
      getList() {
        this.$Api.getCallStatis(this.listQuery).then(response => {
          let data = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list  = []
          data.forEach((item,index) => {
            let obj = new Object()
            obj.companyName = item[0];
            obj.accountName = item[1];
            obj.callType = (item[2] === 0?'原生拨打' :'第三方拨打');
            obj.totalDuration = item[3];
            this.list[index] = obj
          })
        })
      },
      getQuery() {
        let params = {
          companyId: sessionStorage.getItem('companyId')
        }
        this.$Api.accounts(params).then(res => {
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
        delete this.listQuery.accountId
        if (!this.listQuery.companyName) {
          delete this.listQuery.companyName
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.companyName
        if (!this.listQuery.accountId) {
          delete this.listQuery.accountId
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
        this.$Api.getCallStatis(query).then(response => {
          let data = response.data.content
          let list = []
          data.forEach((item,index) => {
            let obj = new Object()
            obj.所属公司 = item[0];
            obj.所属账户 = item[1];
            obj.拨打类型 = item[2] === 0 ?'原生拨打' :'第三方拨打';
            obj.累计拨打时长 = item[3] + '秒';
            list[index] = obj
          })
          Utils.exportExcel(list,'话务列表.xlsx')
        })
      },
    }
  }
</script>
