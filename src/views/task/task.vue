<template>
  <section>
    <div class="filter-container">
      <div class="detail-title">
        <span class="list-tit">任务查询</span>
      </div>
      <el-row style="margin-top: 10px">
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="输入任务名称"
                    v-model="listQuery.taskName">
          </el-input>
          <el-button class="filter-item"
                     type="primary"
                     icon="search"
                     @click="handleFilter"><i class="fa fa-search"></i>查询
          </el-button>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <el-select v-model="listQuery.team"
                     placeholder="团队筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in teams"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.productName"
                     placeholder="产品筛选"
                     clearable
                     @change="handleFilter2">
            <el-option
              v-for="item in products"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="listQuery.status"
                     placeholder="状态筛选"
                     clearable
                     @change="handleFilter2">
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
      <span class="list-tit">任务组列表</span>
      <el-button class="add_btn" @click="handleCreate('import')">
        <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建任务
      </el-button>
    </div>
    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="任务ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务名称">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.taskName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="关联名单">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.groupName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务数" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.totalTaskCnt}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="关联团队"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.team}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="完成数" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.totalTaskCompleteCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成率" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.taskCompleteRate+'%'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="外呼次数限制" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.limitedTimes?scope.row.limitedTimes:'无'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务计划完成时间" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.taskEndDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span :style="scope.row.status==='生效'?'color:#17C263': scope.row.status==='待审核'?'color:#F7BA2A':'color:#D0021B'">{{scope.row.status}}</span>
          <el-tooltip effect="dark" placement="bottom"  :content="scope.row.rejectReason" v-show="scope.row.status==='审核失败'">
            <i class="iconfont icon-wenti" style="color:#D0021B"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="130px">
        <template slot-scope="scope">
          <a size="small"
             @click="handleUpdate(scope.row.id, scope.row.groupName)"
             class="common_btn">查看详情</a>
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
  export default {
    data() {
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
        orgSize: [],
        teams: [],
        products: [],
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
        ],
      }
    },
    created() {
      this.getList()
      this.getQuery()
    },
    methods: {
      getList() {
        let query = JSON.parse(JSON.stringify(this.listQuery))
        if (query.team){
          query.team = encodeURI(query.team)
        }
        this.$Api.getAdminTasks(query).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            if(item.status === '0'){
              item.status = '待审核'
            }else if(item.status === '1'){
              item.status = '审核失败'
            }else if(item.status === '2'){
              item.status = '生效'
            }
            item.taskEndDate = this.Utils.formatDate(item.taskEndDate)
          })
        })
      },
      getQuery() {
        let params = {
          companyId: sessionStorage.getItem('companyId')
        }
        this.$Api.getTeams(params).then(res => {
          this.teams = res.data
        })
        // getProductList().then(res => {
        //   this.products = res.data
        // })
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
        delete this.listQuery.productName
        delete this.listQuery.team
        delete this.listQuery.status
        if (!this.listQuery.taskName) {
          delete this.listQuery.taskName
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.taskName
        delete this.listQuery.productName
        if (!this.listQuery.team) {
          delete this.listQuery.team
        }
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        this.listQuery.pageIndex = 0
        this.getList()
        this.$Api.getProductByTeam(encodeURI(this.listQuery.team)).then((res) => {
          this.products = res.data
        })
      },
      handleFilter2() {
        delete this.listQuery.taskName
        if (!this.listQuery.team) {
          delete this.listQuery.team
        }
        if (!this.listQuery.productName) {
          delete this.listQuery.productName
        }
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleCreate() {
        this.$router.push({name: 'newTask'})
      },
      handleUpdate(id, name) {
        this.$router.push({name: 'taskDetail', query: {id: id, name: name}})
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
