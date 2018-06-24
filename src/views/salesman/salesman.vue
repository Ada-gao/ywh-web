<template>
  <section>
    <div class="filter-container">
      <el-row>
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入销售姓名"
                v-model="listQuery.name">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.companyId" placeholder="公司筛选" @change="handleFilter">
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.companyName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.companyId" placeholder="团队筛选" @change="handleFilter">
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.companyName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div style="text-align: right">
      <el-button class="add_btn" @click="handleCreate('add')">新建销售</el-button>
      <el-button class="add_btn" @click="handleCreate('import')">批量导入</el-button>
    </div>
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
          <span>{{scope.row[7]}}</span>
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
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </section>
</template>

<script>
import { getUsers, getCompanies, getOrgSize } from '@/api/api'
import { transformText } from '@/common/js/util'

export default {
  components: {},
  data () {
    return {
      tableKey: 0,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      list: null,
      sys_user_add: true,
      value: '',
      companies: [],
      orgSize: []
    }
  },
  created () {
    this.getList()
    this.getQuery()
  },
  methods: {
    getList () {
      getUsers(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
        this.listLoading = false
        getOrgSize().then(res => {
          this.orgSize = res.data
          this.list.forEach(item => {
            item[7] = transformText(this.orgSize, item[6])
            console.log(item[7])
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
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate (status) {
      if (status === 'add') {
        this.$router.push({path: '/salesman/detail/0'})
      } else {
        this.$router.push({path: '/salesman/excel'})
      }
    }
  }
}
</script>

<style scoped>

</style>
