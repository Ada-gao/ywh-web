<template>
  <section>
    <div class="filter-container">
      <el-row :gutter="20" style="margin-left: 20px;margin-right: 20px;">
        <el-col :span="8">
          <el-card class="card" :body-style="{ padding: '0px' }">
            <div style="height: 140px;padding-left: 20px;padding-top: 35px;cursor:pointer;" @click="selectStatus('')">
              <div class="logo" style="background: #4AD2DB">
                <i class="iconfont icon-xiaoshoushu"/>
              </div>
              <div class="info">
                <div class="title">销售人员总数</div>
                <div class="count" style="color: #4AD2DB">
                  {{totalSalesCnt?totalSalesCnt:0}}<span style="font-size: 14px">人</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="card" :body-style="{ padding: '0px' }">
            <div style="height: 140px;padding-left: 20px;padding-top: 35px;cursor:pointer;" @click="selectStatus('1')">
              <div class="logo" style="background: #FDCE82">
                <i class="iconfont icon-huoyuerenshu"/>
              </div>
              <div class="info">
                <div class="title">活跃人数</div>
                <div class="count" style="color: #FDCE82">
                  {{enabledSalesCnt?enabledSalesCnt:0}}<span style="font-size: 14px">人</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="card" :body-style="{ padding: '0px' }">
            <div style="height: 140px;padding-left: 20px;padding-top: 35px;cursor:pointer;" @click="selectStatus('0')">
              <div class="logo" style="background: #DFDFDF;">
                <i class="iconfont icon-tingyong"/>
              </div>
              <div class="info">
                <div class="title">停用人数</div>
                <div class="count" style="color: #4A4A4A">
                  {{disabledSalesCnt?disabledSalesCnt:0}}<span style="font-size: 14px">人</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="detail-title" style="margin-top: 40px">
        <span class="list-tit">销售查询</span>
      </div>
      <el-row style="margin-top: 10px">
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入销售姓名"
                    v-model="listQuery.name">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询
          </el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.status"
                     placeholder="状态"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.companyId"
                     placeholder="公司筛选"
                     clearable
                     :disabled="isSuperAdmin !== 'true'"
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
                     @change="handleFilter1">
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
      <el-button class="add_btn" @click="handleCreate('add')">
        <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建销售
      </el-button>
      <el-button class="add_btn" @click="handleCreate('import')">
        <i class="fa fa-sign-out" style="color: #fff;margin-right: 10px"></i>批量导入
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="销售ID" width="130px">
        <template slot-scope="scope">
          <span>{{scope.row.userCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属团队">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.team}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所在省份">
        <template slot-scope="scope">
          <span>{{scope.row.companyProvince}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属行业">
        <template slot-scope="scope">
          <span>{{scope.row.industryType}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司规模">
        <template slot-scope="scope">
          <span>{{scope.row.orgSize}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <div style="cursor:pointer;" @click="showStatusDialog(scope.row)">
            <span :style="scope.row.enabled?'color:#009801':'color:#D0021B'">{{scope.row.enabled?'启用':'停用'}}</span>
            <i class="fa fa-cog" style="color: #a9a4a4;margin-left: 10px"></i>
          </div>
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
    <div v-show="!listLoading">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     background
                     :page-sizes="[5,10,20,30,50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
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
  </section>
</template>

<script>
  import * as Api from "@/api/api"

  export default {
    data() {
      return {
        isSuperAdmin:'false',
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
        this.listQuery.companyId = companyId
        this.handleCompany()
      }
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    },
    methods: {
      getList() {
        Api.getUsers(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
        })
      },
      getQuery() {
        Api.getCompanies().then(res => {
          this.companies = res.data
        })
      },
      getStatisSales() {
        Api.statisSales('').then(res => {
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
        if (this.isSuperAdmin === 'true'){
          delete this.listQuery.companyId
        }
        delete this.listQuery.team
        if (!this.listQuery.name) {
          delete this.listQuery.name
        }
        this.listQuery.pageIndex = 0
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
          Api.getTeams({companyId: this.listQuery.companyId, status: this.listQuery.status}).then(res => {
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
          Api.userEnabled(this.item.id, enabled).then(res => {
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

<style scoped>
  .card {
    height: 120px;
  }

  .logo {
    width: 50px;
    height: 50px;
    line-height: 50px;
    border-radius: 4px;
    text-align: center;
    float: left;
  }

  .logo i {
    color: #ffffff;
    font-size: 28px
  }

  .info {
    margin-left: 12px;
    float: left;
  }

  .info .title {
    font-size: 14px;
    color: #475669;
  }

  .info .count {
    font-size: 28px;
  }
</style>
