<template>
  <section>
    <div class="filter-container">
      <el-row>
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入公司名称关键词"
                v-model="listQuery.companyName">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.companyProvince" placeholder="省份筛选" @change="handleFilter">
            <el-option
              v-for="item in provinceData"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.industryType" placeholder="行业筛选" @change="handleFilter">
            <el-option
              v-for="item in industry"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.orgSize" placeholder="公司规模筛选" @change="handleFilter">
            <el-option
              v-for="item in orgSize"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div style="text-align: right">
      <el-button class="add_btn" @click="handleCreate">新建公司</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="公司ID">
        <template slot-scope="scope">
          <span>{{scope.row.companyCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司名称" class-name="left">
        <template slot-scope="scope">
          <span>{{scope.row.companyName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司地址">
        <template slot-scope="scope">
          <span>{{scope.row.companyCity}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司所在省份">
        <template slot-scope="scope">
          <span>{{scope.row.companyCity}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司行业" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.industryType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司规模">
        <template slot-scope="scope">
          <span>{{scope.row.orgSize}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
            @click="handleUpdate(scope.row)">查看
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
import { getCompanies, getCompanyPage, getAuthDustries, getOrgSize } from '@/api/api'
import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

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
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      provinceData: provinceAndCityData,
      industry: [],
      orgSize: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      getCompanies().then(res => {
        this.list = res.data
        this.total = res.data.total
        this.listLoading = false
      })
      getAuthDustries().then(res => {
        this.industry = res.data
      })
      getOrgSize().then(res => {
        this.orgSize = res.data
        // this.form.orgSizeText = transformText(this.coInfo.orgSize, this.form.orgSize)
      })
    },
    getListByQue () {
      getCompanyPage(this.listQuery).then(res => {
        this.list = res.data.content
        this.total = res.data.total
        this.listLoading = false
      })
    },
    handleUpdate (obj) {
      this.$router.push({path: '/company/detail/' + obj.companyCode, query: {item: obj}})
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
      if(this.listQuery.companyProvince) {
        this.listQuery.companyProvince = this.listQuery.companyProvince.label
      }
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.getListByQue()
    },
    handleCreate () {
      this.$router.push({path: '/company/detail/0'})
    }
  }
}
</script>

<style scoped>

</style>
