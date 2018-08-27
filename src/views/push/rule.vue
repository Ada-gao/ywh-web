<template>
  <section>
    <div class="filter-container">
      <div class="detail-title">
        <span class="list-tit">信息推送规则查询</span>
      </div>
      <el-row style="margin-top: 10px">
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入信息推送规则名称" v-model="listQuery.companyName">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.status"
                     placeholder="状态筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in states"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.orgSize"
                     placeholder="团队筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in orgSize"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">信息推送规则组列表</span>
      <el-button class="add_btn" @click="handleCreate" v-if="sysUser === 'superadmin'">
        <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建推送规则
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fithighlight-current-row style="width: 100%">

      <el-table-column align="center" label="规则ID">
        <template slot-scope="scope">
          <span>{{scope.row.companyCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="推送规则名称">
        <template slot-scope="scope">
          <span>{{scope.row.companyName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span>{{scope.row.companyAddress}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属团队">
        <template slot-scope="scope">
          <span>{{scope.row.companyProvince}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.industryType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span :style="scope.row.status==='生效'?'color:#17C263':'color:#F7BA2A'">{{scope.row.status}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a size="small" class="common_btn" @click="handleUpdate(scope.row)">查看详情 </a>
          <span> | </span>
          <a size="small" class="common_btn" @click="handleUpdate(scope.row)">修改信息 </a>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     background
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </section>
</template>

<script>
  import { getCompanyPage, getAuthDustries, getOrgSize } from '@/api/api'
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
        industry: [],
        orgSize: [],
        currentPage: 1,
        states:[
          {
            label:'生效',
            value:'1'
          },
          {
            label:'待审核',
            value: '0'
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
    },
    methods: {
      getList () {
        getCompanyPage(this.listQuery).then(res => {
          this.list = res.data.content
          this.total = res.data.totalElements
          this.listLoading = false
          getOrgSize().then(res => {
            this.orgSize = res.data
            this.list.forEach(item => {
            })
          })
        })
        getAuthDustries().then(res => {
          this.industry = res.data
        })
      },
      handleUpdate (obj) {
        this.$router.push({name: 'pMessage', query: obj})
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
        this.listQuery.companyProvince = null
        this.listQuery.industryType = null
        this.listQuery.orgSize = null
        delete this.listQuery.orgSize
        delete this.listQuery.companyProvince
        delete this.listQuery.industryType
        if (!this.listQuery.companyName) {
          delete this.listQuery.companyName
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleFilter1 () {
        if (this.listQuery.companyProvince) {
          this.listQuery.companyProvince = this.listQuery.companyProvince.label || this.listQuery.companyProvince
        }
        this.listQuery.companyName = ''
        delete this.listQuery.companyName
        if (!this.listQuery.companyProvince) {
          delete this.listQuery.companyProvince
        }
        if (!this.listQuery.industryType) {
          delete this.listQuery.industryType
        }
        if (!this.listQuery.orgSize) {
          delete this.listQuery.orgSize
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleCreate () {
        this.$router.push({name: 'pCreate'})
      }
    }
  }
</script>

<style scoped>

</style>
