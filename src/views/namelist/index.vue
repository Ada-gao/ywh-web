<template>
  <section>
    <div class="filter-container">
      <div class="list-tit">名单查询</div>
      <el-row>
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
                     @click="handleFilter">查询</el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.companyId"
                     placeholder="公司筛选"
                     @change="handleFilter">
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.companyName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.residence"
                     placeholder="所在地"
                     @change="handleFilter">
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
    <!--<div style="text-align: right">-->
    <!--<el-button class="add_btn" @click="handleCreate">新建销售</el-button>-->
    <!--</div>-->
    <div class="table-add-box">
      <div class="list-table-tit">名单列表</div>
      <div class="add-box" @click="handleCreate">
        <i class="fal fa-plus"></i>
        <span>批量导入</span>
      </div>
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
          <span>{{scope.row.id}}</span>
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
      pageIndex: 0,
      list: null,
      sys_user_add: true,
      value: '',
      companies: [],
      provinceData: provinceAndCityData,
      currentPage: 1
    }
  },
  created () {
    this.getList()
    this.getQuery()
  },
  methods: {
    getList () {
      console.log(this.listQuery)
      getLists(this.listQuery).then(response => {
        this.list = response.data.content
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
      if (this.listQuery.residence) {
        this.listQuery.residence = this.listQuery.residence.label
      }
      if (!this.listQuery.contactName) {
        delete this.listQuery.contactName
      }
      console.log(this.listQuery)
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
