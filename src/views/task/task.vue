<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">任务查询</span>
    </div>
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入任务名称" v-model="listQuery.taskName"/>
      <el-button icon="search" @click="handleFilter"><i class="fa fa-search"/><span>查询</span></el-button>
      <el-select v-model="listQuery.status" placeholder="状态筛选" clearable @change="handleFilter">
        <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.productName" placeholder="产品筛选" filterable clearable @change="handleFilter">
        <el-option v-for="item in products" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.saleId" placeholder="销售筛选" filterable clearable @change="handleFilter">
        <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">任务组列表</span>
      <el-button  @click="handleCreate('import')">
        <i class="fa fa-plus" /><span>新建任务</span>
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="任务ID" width="80">
        <template slot-scope="scope"><span>{{scope.row.id}}</span></template>
      </el-table-column>
      <el-table-column label="任务名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.taskName}}</span></template>
      </el-table-column>
      <el-table-column label="产品名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.productName}}</span></template>
      </el-table-column>
      <el-table-column label="关联名单">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.groupName}}</span></template>
      </el-table-column>
      <el-table-column label="任务数" width="80">
        <template slot-scope="scope"><span>{{scope.row.totalTaskCnt}}</span></template>
      </el-table-column>
      <el-table-column label="关联销售">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.sales}}</span></template>
      </el-table-column>
      <el-table-column label="完成数" width="80">
        <template slot-scope="scope"><span>{{scope.row.totalTaskCompleteCnt}}</span></template>
      </el-table-column>
      <el-table-column label="完成率" width="80">
        <template slot-scope="scope"><span>{{scope.row.taskCompleteRate+'%'}}</span></template>
      </el-table-column>
      <el-table-column label="外呼次数限制" width="120">
        <template slot-scope="scope"><span>{{scope.row.limitedTimes?scope.row.limitedTimes:'无'}}</span></template>
      </el-table-column>
      <el-table-column label="任务计划完成时间" width="160">
        <template slot-scope="scope"><span>{{scope.row.taskEndDate}}</span></template>
      </el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status === '0'">
            <span style="color:#F7BA2A">待审核</span>
          </template>
          <template v-else-if="scope.row.status === '1'">
            <span style="color:#D0021B">审核失败</span>
            <el-tooltip effect="dark" placement="bottom" :content="scope.row.reason">
              <i class="iconfont icon-wenti" style="color:#D0021B"/>
            </el-tooltip>
          </template>
          <template v-else-if="scope.row.status === '2'">
            <div style="cursor:pointer;" @click="showDialog(scope.row)">
              <span style="color:#17C263">启用</span>
              <i class="fa fa-cog" style="color: #a9a4a4;margin-left: 10px"></i>
            </div>
          </template>
          <template v-else-if="scope.row.status === '3'">
            <div style="cursor:pointer;" @click="showDialog(scope.row)">
              <span style="color:#D0021B">停用</span>
              <i class="fa fa-cog" style="color: #a9a4a4;margin-left: 10px"></i>
            </div>
          </template>
          <template v-else-if="scope.row.status === '4'">
            <span style="color:#F7BA2A">话术待审核</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope"><a @click="handleUpdate(scope.row)">查看详情</a> | <a @click="handleEdit(scope.row)">编辑</a></template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange"
                   v-show="!listLoading"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   :page-sizes="[10,20,30, 50]"
                   background
                   :page-size="listQuery.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"/>
    <el-dialog title="修改状态" :visible.sync="isDialogShow" width="350px" :center="false">
      <el-radio-group v-model="radio" style="text-align: center">
        <el-radio label="启用"/>
        <el-radio label="停用" style="margin-left: 100px"/>
      </el-radio-group>
      <div style="text-align: right;margin-top: 30px">
        <el-button class="search_btn" @click="isDialogShow = false">取 消</el-button>
        <el-button class="add_btn" @click="handlerCheck">确 定</el-button>
      </div>
    </el-dialog>
  </div>
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
        saleList: [],
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
          },
          {
            label: '停用',
            value: '3'
          },
          {
            label: '话术待审核',
            value: '4'
          }
        ],
        isDialogShow:false,
        radio:'',
        item:null
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
        query.isReport = false
        this.Api.getAdminTasks(query).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            // if(item.status === '0'){
            //   item.status = '待审核'
            // }else if(item.status === '1'){
            //   item.status = '审核失败'
            // }else if(item.status === '2'){
            //   item.status = '生效'
            // }else if(item.status === '3'){
            //   item.status = '停用'
            // }else if(item.status === '4'){
            //   item.status = '话术待审核'
            // }
            item.taskStartDate = this.Utils.formatDate(item.taskStartDate)
            item.taskEndDate = this.Utils.formatDate(item.taskEndDate)
          })
        })
      },
      getQuery() {
        // let params = {
        //   companyId: sessionStorage.getItem('companyId')
        // }
        // this.Api.getTeams(params).then(res => {
        //   this.teams = res.data
        // })
        this.Api.getAllSaleUsers('').then(res => {
          this.saleList = res.data
        })
        this.Api.getProductList().then(res => {
          this.products = res.data
        })
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
        if (!this.listQuery.taskName){
          delete this.listQuery.taskName
        }
        if (!this.listQuery.status){
          delete this.listQuery.status
        }
        if (!this.listQuery.productName){
          delete this.listQuery.productName
        }
        if (!this.listQuery.saleId){
          delete this.listQuery.saleId
        }
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.getList()
      },
      handleCreate() {
        this.$router.push({name: 'newTask'})
      },
      handleEdit(obj) {
        this.$router.push({name: 'newTask', query: {item:obj}})
      },
      handleUpdate(obj) {
        this.$router.push({name: 'taskDetail', query: {item:obj}})
      },
      showDialog(val) {
        this.item = val
        this.isDialogShow = true
        if (this.item.status === '2'){
          this.radio = '启用'
        }else if (this.item.status === '3'){
          this.radio = '停用'
        }
      },
      handlerCheck(){
        this.isDialogShow = false
        if (this.radio === '启用' && this.item.states !== '2'){
          this.Api.updateTaskGroupStatus(this.item.id,'2').then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.item.status = '2'
          })
        } else if (this.radio === '停用' && this.item.states !== '3'){
          this.Api.updateTaskGroupStatus(this.item.id,'3').then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.item.status = '3'
          })
        }
      }
    }
  }
</script>
