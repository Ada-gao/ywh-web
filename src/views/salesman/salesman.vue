<template>
  <div class="page-salesman">
      <el-row :gutter="20">
        <el-col :span="8">
          <div @click="selectStatus('')">
            <el-card>
              <div>
                <div class="logo-one">
                  <i class="iconfont icon-xiaoshoushu"/>
                </div>
                <div class="info">
                  <div class="title">销售人员总数</div>
                  <div class="count-one">
                    {{totalSalesCnt?totalSalesCnt:0}}<span>人</span>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div @click="selectStatus('1')">
            <el-card>
              <div>
                <div class="logo-two">
                  <i class="iconfont icon-huoyuerenshu"/>
                </div>
                <div class="info">
                  <div class="title">活跃人数</div>
                  <div class="count-two">
                    {{enabledSalesCnt?enabledSalesCnt:0}}<span>人</span>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div @click="selectStatus('0')">
            <el-card>
              <div>
                <div class="logo-three">
                  <i class="iconfont icon-tingyong"/>
                </div>
                <div class="info">
                  <div class="title">停用人数</div>
                  <div class="count-three">
                    {{disabledSalesCnt?disabledSalesCnt:0}}<span>人</span>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    <div class="com_page">
      <div class="com_head">
        <span class="com_title">销售查询</span>
      </div>
      <div class="com_filter">
        <el-input @keyup.enter.native="handleFilter" placeholder="输入销售信息（姓名/帐号/电话）" v-model="listQuery.name"/>
        <el-button icon="search" @click="handleFilter">
          <i class="fa fa-search"/><span>查询</span>
        </el-button>
        <el-select v-model="listQuery.team" placeholder="团队筛选" clearable @change="handleFilter1">
          <el-option v-for="(item, index) in teams" :key="index" :label="item" :value="item"/>
        </el-select>
        <el-select v-model="listQuery.companyId" placeholder="公司筛选" clearable :disabled="isSuperAdmin !== 'true'" @change="handleCompany">
          <el-option v-for="item in companies" :key="item.id" :label="item.companyName" :value="item.id"/>
        </el-select>
        <el-select v-model="listQuery.status" placeholder="状态筛选" clearable @change="handleFilter1">
          <el-option v-for="item in status" :key="item.value" :label="item.name" :value="item.value"/>
        </el-select>
      </div>
      <div class="com_head">
        <span class="com_title">销售列表</span>
        <el-button @click="handleCreate('add')">
          <i class="fa fa-plus"/><span>新建销售</span>
        </el-button>
        <el-button @click="handleCreate('import')">
          <i class="fa fa-sign-out"/><span>批量导入</span>
        </el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
        <el-table-column label="销售ID" width="130px">
          <template slot-scope="scope"><span>{{scope.row.userCode}}</span></template>
        </el-table-column>
        <el-table-column label="销售名称">
          <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>
        <el-table-column label="所属团队">
          <template slot-scope="scope"><span class="com-two-row">{{scope.row.team}}</span></template>
        </el-table-column>
        <el-table-column label="所属公司">
          <template slot-scope="scope"><span class="com-two-row">{{scope.row.companyName}}</span></template>
        </el-table-column>
        <el-table-column label="所在省份">
          <template slot-scope="scope"><span>{{scope.row.companyProvince}}</span></template>
        </el-table-column>
        <el-table-column label="所属行业">
          <template slot-scope="scope"><span>{{scope.row.industryType}}</span></template>
        </el-table-column>
        <el-table-column label="公司规模">
          <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div style="cursor:pointer;" @click="showStatusDialog(scope.row)">
              <span :style="scope.row.enabled?'color:#009801':'color:#D0021B'">{{scope.row.enabled?'启用':'停用'}}</span>
              <i class="fa fa-cog" style="color: #a9a4a4;margin-left: 10px"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope"><a @click="handleUpdate(scope.row)">查看详情</a></template>
        </el-table-column>
      </el-table>
      <el-pagination v-show="!listLoading"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     background
                     :page-sizes="[5,10,20,30,50]"
                     :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"/>
      <el-dialog title="修改状态" :visible.sync="updateStatusDialog" width="20%">
        <el-radio-group v-model="radio" style="text-align: center;width: 100%">
          <el-radio label="启用"></el-radio>
          <el-radio label="停用" style="margin-left: 100px"></el-radio>
        </el-radio-group>
        <div style="text-align: right;margin-top: 30px">
          <el-button class="search_btn" @click="updateStatusDialog = false">取 消</el-button>
          <el-button class="add_btn" @click="enabledSale">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        isSuperAdmin: 'false',
        updateStatusDialog: false,
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10,
          authorityName: 'ROLE_SALE'
        },
        item: null,
        radio: '',
        list: null,
        status: [
          {
            name: '启用',
            value: '1'
          },
          {
            name: '停用',
            value: '0'
          }
        ],
        companies: [],
        teams: [],
        currentPage: 1,
        totalSalesCnt: 0,
        enabledSalesCnt: 0,
        disabledSalesCnt: 0
      }
    },
    created() {
      this.getList()
      this.getQuery()
      this.getStatisSales()
      let companyId = sessionStorage.getItem('companyId')
      if (companyId) {
        this.listQuery.companyId = parseInt(companyId)
        this.handleCompany()
      }
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    },
    methods: {
      getList() {
        this.Api.getUsers(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
        })
      },
      getQuery() {
        this.Api.getCompanies().then(res => {
          this.companies = res.data
        })
      },
      getStatisSales() {
        this.Api.statisSales('').then(res => {
          this.totalSalesCnt = res.data.totalSalesCnt
          this.enabledSalesCnt = res.data.enabledSalesCnt
          this.disabledSalesCnt = res.data.disabledSalesCnt
        })
      },
      handleUpdate(item) {
        this.$router.push({name: 'salesmanDetail', query: item})
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
        delete this.listQuery.status
        if (this.isSuperAdmin === 'true') {
          delete this.listQuery.companyId
        }
        delete this.listQuery.team
        if (!this.listQuery.name) {
          delete this.listQuery.name
        }
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.name
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        if (!this.listQuery.companyId) {
          delete this.listQuery.companyId
        }
        if (!this.listQuery.team) {
          delete this.listQuery.team
        }
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.getList()
      },
      handleCreate(status) {
        if (status === 'add') {
          this.$router.push({name: 'salesmanDetail', query: {id: '0'}})
        } else {
          this.$router.push({path: '/salesman/excel'})
        }
      },
      handleCompany() {
        if (this.listQuery.companyId) {
          this.Api.getTeams({companyId: this.listQuery.companyId, status: this.listQuery.status}).then(res => {
            this.teams = res.data
            this.listQuery.team = null
          })
        } else {
          this.teams = []
        }
        this.handleFilter1()
      },
      selectStatus(val) {
        if (val) {
          this.listQuery.status = val
        } else {
          delete this.listQuery.status
        }
        this.handleFilter1()
      },
      showStatusDialog(val) {
        this.item = JSON.parse(JSON.stringify(val))
        if (this.item.enabled) {
          this.radio = '启用'
        } else {
          this.radio = '停用'
        }
        this.updateStatusDialog = true
      },
      enabledSale() {
        let enabled = false
        if (this.radio === '启用') {
          enabled = true
        }
        if (enabled != this.item.enabled) {
          this.Api.userEnabled(this.item.id, enabled).then(res => {
            this.getList()
            this.getStatisSales()
            if (enabled) {
              this.$message({
                message: '启用成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '停用成功',
                type: 'success'
              })
            }
          })
        }
        this.updateStatusDialog = false
      }
    }
  }
</script>
