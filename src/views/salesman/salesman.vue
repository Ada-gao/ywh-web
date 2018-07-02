<template>
  <section>
    <div class="filter-container">
      <div class="detail-title">
        <span class="list-tit">销售查询</span>
      </div>
      <el-row>
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入销售姓名"
                v-model="listQuery.name">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.companyId"
                     placeholder="公司筛选"
                     clearable
                     @change="handleCompany">
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.companyName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.team"
                     placeholder="团队筛选"
                     clearable
                     @change="handleFilter">
            <el-option
              v-for="(item, index) in teams"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
        <span class="list-tit">销售列表</span>
        <el-button v-if="sysUser.username!=='sale'" class="add_btn" @click="handleCreate('add')">
          <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建销售
        </el-button>
        <el-button v-if="sysUser.username!=='sale'" class="add_btn" @click="handleCreate('import')">
          <i class="fa fa-sign-out" style="color: #fff;margin-right: 10px"></i>批量导入
        </el-button>
      </div>
    <!-- <div style="text-align: right">
      <el-button v-if="sysUser.username!=='sale'" class="add_btn" @click="handleCreate('add')">新建销售</el-button>
      <el-button v-if="sysUser.username!=='sale'" class="add_btn" @click="handleCreate('import')">批量导入</el-button>
    </div> -->
    <!-- {{sysUser.companyId}} -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="销售ID">
        <template slot-scope="scope">
          <span>{{scope.row[0]}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="销售名称">
        <template slot-scope="scope">
          <span>{{scope.row[1]}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          <span>{{scope.row[2]}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span>{{scope.row[3]}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所在省份">
        <template slot-scope="scope">
          <span>{{scope.row[4]}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属行业" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row[5]}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司规模">
        <template slot-scope="scope">
          <span>{{scope.row[6]}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
            @click="handleUpdate(scope.row[0])">查看
          </a>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     background
                     :page-sizes="[5,10,20,30,50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </section>
</template>

<script>
import { getUsers, getCompanies, getOrgSize, getTeams } from '@/api/api'
import { transformText } from '@/common/js/util'
import { mapGetters } from 'vuex'

export default {
  components: {},
  data () {
    return {
      tableKey: 0,
      total: null,
      listLoading: true,
      listQuery: {
        pageIndex: 0,
        pageSize: 20
      },
      list: null,
      sys_user_add: true,
      value: '',
      companies: [],
      teams: [],
      orgSize: [],
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters([
      'sysUser'
    ])
  },
  created () {
    this.getList()
    this.getQuery()
  },
  methods: {
    getList () {
      // if (this.sysUser.username === 'admin') {
      //  this.listQuery.companyId = this.sysUser.companyId
      // }
      getUsers(this.listQuery).then(response => {
        this.list = response.data
        this.total = 11
        this.listLoading = false
        getOrgSize().then(res => {
          this.orgSize = res.data
          this.list.forEach(item => {
            item[6] = transformText(this.orgSize, item[6])
          })
        })
      })
    },
    getQuery () {
      getCompanies().then(res => {
        this.companies = res.data
      })
    },
    handleUpdate (id) {
      this.$router.push({path: '/salesman/detail/' + id})
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
      if (!this.listQuery.team) {
        delete this.listQuery.team
      }
      if (!this.listQuery.name) {
        delete this.listQuery.name
      }
      if (!this.listQuery.companyId) {
        delete this.listQuery.companyId
      }
      this.getList()
    },
    handleCreate (status) {
      if (status === 'add') {
        this.$router.push({path: '/salesman/detail/0'})
      } else {
        this.$router.push({path: '/salesman/excel'})
      }
    },
    handleCompany (val) {
      if (val) {
        getTeams(val).then(res => {
          this.teams = res.data
          this.listQuery.team = null
        })
      } else {
        this.teams = []
      }
      this.handleFilter()
    }
  }
}
</script>

<style scoped>

</style>
