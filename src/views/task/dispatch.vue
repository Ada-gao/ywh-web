<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">任务调配</span>
    </div>
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入潜客信息（客户姓名/所属销售姓名）" style="width: 300px;" v-model="listQuery.name"/>
      <el-button icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
      <el-select v-model="listQuery.type" placeholder="潜客类型" clearable @change="handleFilter">
        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.companyId" placeholder="公司筛选" clearable filterable @change="handleFilter">
        <el-option v-for="item in companies" :key="item.id" :label="item.companyName" :value="item.id"/>
      </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">名单列表</span>
      <el-button @click="handleUpdate('')" :disabled="multipleSelection.length === 0">
        <i class="fa fa-edit"/><span>批量修改</span>
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" @selection-change="handleSelectionChange" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column type="selection" width="105px">
      </el-table-column>
      <el-table-column label="销售名称">
        <template slot-scope="scope"><span>{{scope.row.contactName}}</span></template>
      </el-table-column>
      <el-table-column label="关联团队">
        <template slot-scope="scope"><span>{{scope.row.type}}</span></template>
      </el-table-column>
      <el-table-column label="分配条数">
        <template slot-scope="scope"><span>{{scope.row.saleName}}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="105px">
        <template slot-scope="scope"><a @click="handleUpdate(scope.row)">修改销售</a></template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading">
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
    <el-dialog title="修改销售" :visible.sync="dialogVisible" width="30%">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" style="margin-right: 20px;">
        <el-form-item label="新销售" prop="userId" class="txt">
          <el-select v-model="ruleForm.userId" placeholder="请选择新销售" filterable>
            <el-option v-for="item in sales" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="add_btn" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        dialogVisible: false,
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        currentPage: 1,
        list: null,
        types: [
          {
            label: '意向客户',
            value: 'follow'
          },
          {
            label: '星标客户',
            value: 'star'
          }
        ],
        companies: [],
        sales: [],
        multipleSelection: [],
        rules: {
          userId: [
            {required: true, trigger: 'blur', message: '请选择新销售'}
          ],
        },
        ruleForm: {},
        taskIds:''
      }
    },
    created() {
      this.getCompanies()
      this.getList()
    },
    methods: {
      getCompanies() {
        this.Api.getCompanies().then(res => {
          this.companies = res.data
        })
      },
      getList() {
        this.Api.potentialList(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
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
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.getList()
      },
      handleUpdate(val) {
        this.dialogVisible = true
        let companyId = null
        if (val) {
          companyId = val.companyId
          this.taskIds =  val.taskId
        } else {
          companyId = this.multipleSelection[0].companyId
          this.taskIds = ''
          this.multipleSelection.forEach((item,index)=>{
            if (index === 0){
              this.taskIds = item.taskId
            } else{
              this.taskIds += "," + item.taskId
            }
          })
        }
        this.Api.getAllSaleUsers('').then(res => {
          this.sales = res.data
        })
      },
      handleSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let params = {
              taskIds: this.taskIds + "",
              userId: this.ruleForm.userId
            }
            this.Api.updatePotentialUser(params).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$refs['ruleForm'].resetFields()
              this.dialogVisible = false
              this.getList()
            })
          } else {
            return false
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>
