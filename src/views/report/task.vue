<template>
  <div>
    <div class="filter-container">
      <el-row>
        <el-col :span="14">
          <el-input @keyup.enter.native="handleFilter"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="输入任务名称"
                    v-model="listQuery.taskName"/>
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
          <el-select v-model="listQuery.productName"
                     placeholder="产品名称"
                     clearable
                     @change="handleFilter2">
            <el-option
              v-for="item in products"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">外呼任务列表</span>
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
      <el-table-column align="center" label="任务名称">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.taskName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推广产品">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.productName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属团队">
        <template slot-scope="scope">
          <span>{{scope.row.team}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名单名称">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.groupName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成数">
        <template slot-scope="scope">
          <span>{{scope.row.totalTaskCompleteCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成率">
        <template slot-scope="scope">
          <span>{{scope.row.taskCompleteRate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务计划完成时间">
        <template slot-scope="scope">
          <span>{{scope.row.taskEndDate}}</span>
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
  import {getAdminTasks, getProductByTeam, getTeams} from '@/api/api'
  export default {
    computed : {
      ...mapGetters([
        'getUserInfo'
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
        products: []
      }
    },
    created() {
      this.getList()
      this.getQuery()
    },
    methods: {
      getList() {
        getAdminTasks(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            let date = new Date(item.taskEndDate)
            let month = date.getMonth() + 1;
            let day = date.getDate();
            item.taskEndDate = date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
          })
        })
      },
      getQuery() {
        let params = {
          companyId: this.getUserInfo.companyId
        }
        getTeams(params).then(res => {
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
        getProductByTeam(this.listQuery.team).then((res) => {
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
        var wb = XLSX.utils.table_to_book(document.querySelector('#consumeTable'))
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'})
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '外呼任务列表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      },
    }
  }
</script>
<style scoped lang="scss">

</style>
