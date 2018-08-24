<template>
  <section>
    <div class="filter-container">
      <div class="detail-title">
        <span class="list-tit">名单查询</span>
      </div>
      <el-row style="margin-top: 10px">
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="输入联系人姓名"
                    v-model="listQuery.contactName">
          </el-input>
          <el-button class="filter-item"
                     type="primary"
                     icon="search"
                     @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.companyId"
                     placeholder="公司筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.companyName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.residence"
                     placeholder="所在地"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in provinceData"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">名单列表</span>
    </div>
    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="名单ID">
        <template slot-scope="scope">
          <span>{{scope.row.boundCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span>{{scope.row.companyName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人姓名">
        <template slot-scope="scope">
          <span>{{scope.row.contactName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phoneNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="年龄">
        <template slot-scope="scope">
          <span>{{scope.row.age}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="性别"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.gender}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人所在地">
        <template slot-scope="scope">
          <span>{{scope.row.residence}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名单来源">
        <template slot-scope="scope">
          <span>{{scope.row.source}}</span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center"-->
      <!--label="操作"-->
      <!--fixed="right"-->
      <!--width="150">-->
      <!--<template slot-scope="scope">-->
      <!--<a size="small" class="common_btn">查看-->
      <!--</a>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
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

  </section>
</template>

<script>
import {getLists, getCompanies} from '@/api/api'
import { provinceAndCityData } from 'element-china-area-data' // 省市区数据
import { mapGetters } from 'vuex'

export default {
  components: {},
  data () {
    return {
      tableKey: 0,
      total: null,
      listLoading: true,
      listQuery: {
        groupId:0,
        pageIndex: 0,
        pageSize: 10
      },
      pageIndex: 0,
      list: null,
      sys_user_add: true,
      value: '',
      companies: [],
      provinceData: provinceAndCityData,
      currentPage: 1,
      id: 0
    }
  },
  computed: {
    ...mapGetters([
      'sysUser'
    ])
  },
  created () {
    let obj = this.$route.query
    this.listQuery.groupId = obj.id;
    this.getList()
    this.getQuery()
  },
  methods: {
    getList () {
      getLists(this.listQuery).then(response => {
        this.list = response.data.content
        this.list.forEach((ele, index) => {
          if (ele.gender === 'GENTLEMAN') {
            ele.gender = '男'
          }
          if (ele.gender === 'LADY') {
            ele.gender = '女'
          }
        })
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    getQuery () {
      getCompanies().then(res => {
        this.companies = res.data
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
      this.listQuery.residence = null
      this.listQuery.companyId = null
      delete this.listQuery.residence
      delete this.listQuery.companyId
      if (!this.listQuery.contactName) {
        delete this.listQuery.contactName
      }
      this.listQuery.pageIndex = 0
      this.getList()
    },
    handleFilter1 () {
      this.listQuery.contactName = ''
      delete this.listQuery.contactName
      if (this.listQuery.residence) {
        this.listQuery.residence = this.listQuery.residence.label || this.listQuery.residence
      } else {
        delete this.listQuery.residence
      }
      if (!this.listQuery.companyId) {
        delete this.listQuery.companyId
      }
      this.listQuery.pageIndex = 0
      this.getList()
    },
    handleCreate () {
      this.$router.push({path: '/list/excel'})
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
