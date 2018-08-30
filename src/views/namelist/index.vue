<template>
  <section>
    <div class="filter-container">
      <div class="detail-title">
        <span class="list-tit">批次查询</span>
      </div>
      <el-row style="margin-top: 10px">
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="输入名单名称"
                    v-model="listQuery.groupName">
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
          <el-select v-model="listQuery.status"
                     placeholder="名单状态"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in states"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">名单列表</span>
      <el-button class="add_btn" @click="handleCreate">
        <i class="fa fa-sign-out" style="color: #fff;margin-right: 10px"></i>批量导入
      </el-button>
    </div>
    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="名单批次号" width="130px">
        <template slot-scope="scope">
          <span>{{scope.row.groupCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名单名称">
        <template slot-scope="scope">
          <span>{{scope.row.groupName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span>{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名单数量">
        <template slot-scope="scope">
          <span>{{scope.row.totalNameCnt}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="隐藏主号">
        <template slot-scope="scope">
          <span>{{scope.row.maskPhoneNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名单状态">
        <template slot-scope="scope">
          <span :style="scope.row.status==='生效'?'color:#17C263': scope.row.status==='待审核'?'color:#F7BA2A':'color:#D0021B'">{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名单导入时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="130px">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
             @click="handleUpdate(scope.row)">查看详情
          </a>
        </template>
      </el-table-column>
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
import {getCompanies, getBatch} from '@/api/api'
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
        pageIndex: 0,
        pageSize: 10
      },
      pageIndex: 0,
      list: null,
      sys_user_add: true,
      value: '',
      companies: [],
      currentPage: 1,
      states:[
        {
          label: '待审核',
          value:  '0'
        },
        {
          label: '审核失败',
          value:  '1'
        },
        {
          label: '生效',
          value: '2'
        }
      ]
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
    //获取批次
    getList(){
      getBatch(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
        this.list.forEach(item => {
          if (item.maskPhoneNo){
            item.maskPhoneNo = '是'
          }else{
            item.maskPhoneNo = '否'
          }
          if (item.status == 1){
            item.status = '审核失败'
          }else if (item.status == 2){
            item.status = '生效'
          }else{
            item.status = '待审核'
          }
          let date = new Date(item.createTime)
          let month = date.getMonth() + 1;
          let day = date.getDate();
          item.createTime = date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
        })
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
    handleUpdate (obj) {
      this.$router.push({name: 'namelist', query: obj})
    },
    handleFilter () {
      delete this.listQuery.companyId
      delete this.listQuery.status
      if (!this.listQuery.groupName) {
        delete this.listQuery.groupName
      }
      this.listQuery.pageIndex = 0
      this.getList()
    },
    handleFilter1 () {
      delete this.listQuery.groupName
      if (!this.listQuery.companyId) {
        delete this.listQuery.companyId
      }
      if (!this.listQuery.status) {
        delete this.listQuery.status
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
