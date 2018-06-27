<template>
  <section>
    <div class="filter-container">
      <div class="list-tit">任务查询</div>
      <el-row>
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="输入任务名称"
                    v-model="listQuery.username">
          </el-input>
          <el-button class="filter-item"
                     type="primary"
                     icon="search"
                     @click="handleFilter">查询</el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.companyId"
                     placeholder="销售部门"
                     @change="handleFilter">
            <el-option
              v-for="item in companies"
              :key="item.companyCode"
              :label="item.companyName"
              :value="item.companyCode">
            </el-option>
          </el-select>
          <el-select v-model="value"
                     placeholder="产品名称"
                     @change="handleFilter">
            <el-option
              v-for="item in products"
              :key="item.companyId"
              :label="item.productName"
              :value="item.companyId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="table-add-box">
      <div class="list-table-tit">任务列表</div>
      <div class="add-box" @click="handleCreate">
        <i class="fal fa-plus"></i>
        <span>新建任务</span>
      </div>
    </div>
    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="任务ID">
        <template slot-scope="scope">
          <span>{{scope.row.taskCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务名称">
        <template slot-scope="scope">
          <span>{{scope.row.taskName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="外呼名称">
        <template slot-scope="scope">
          <span>{{scope.row.salesTalk}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务数">
        <template slot-scope="scope">
          <span>{{scope.row.age}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="关联销售"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.gender}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="完成数">
        <template slot-scope="scope">
          <span>{{scope.row.gender}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成率">
        <template slot-scope="scope">
          <span>{{scope.row.source}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                        label="操作"
                        fixed="right"
                        width="150">
        <template slot-scope="scope">
          <a size="small"
             @click="handleUpdate(scope.row.id)"
             class="common_btn">查看</a>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

  </section>
</template>

<script>
import {getAdminTasks, getTasks, getCompanies, getProductList} from '@/api/api'
// import { transformText } from '@/common/js/util'

export default {
  components: {},
  data () {
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
      adminStat: null,
      orgSize: [],
      companies: [],
      products: []
    }
  },
  created () {
    this.adminStat = this.$store.state.adminStat
    this.getList()
    this.getQuery()
  },
  methods: {
    getList () {
      if (this.adminStat) {
        getAdminTasks(this.listQuery).then(response => {
          console.log(response.data)
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
        })
      } else {
        getTasks(this.listQuery).then(response => {
          console.log(response.data)
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
        })
      }
    },
    getQuery () {
      getCompanies().then(res => {
        this.companies = res.data
      })
      getProductList().then(res => {
        this.products = res.data
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
      this.listQuery.pageIndex = 0
      this.getList()
    },
    handleCreate () {
      this.$router.push({path: '/task/newTask'})
    },
    handleUpdate (id) {
      this.$router.push({path: '/task/detail/' + id})
    }
  }
}
</script>

<style scoped lang="scss">
  .table-add-box {
    position: relative;
    line-height: 48px;
    div {
      display: inline-block;
    }
    .list-table-tit {
      margin-bottom: 0;
    }
    .add-box {
      cursor: pointer;
      position: absolute;
      right: 0;
      width: 102px;
      height: 36px;
      /*background: #0299CC;*/
      background: #18c79c;
      line-height: 36px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      text-align: center;
      top: 6px;
    }
  }
</style>
