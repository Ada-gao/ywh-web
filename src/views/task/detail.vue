<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="tit-text">任务描述</span>
    </div>
    <div class="margin-line"></div>
    <div class="task-detail">
      <el-form :model="form" class="form-border">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="所属公司：" prop="name">
              <span>{{form.id}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼名单：" prop="name">
              <span>{{form.companyName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务名称：" prop="username">
              <span>{{form.team}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推广产品：" prop="empNo">
              <span>{{form.productName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售数：" prop="gender">
              <span>{{form.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分配规则：" prop="education">
              <span>{{form.mobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务目标：" prop="idType">
              <span>{{form.createdDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼话术：" prop="mobile">
              <span>{{form.username}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务时间：" prop="resumeUrl">
              <span>{{form.password}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效通话时长：" prop="mobile">
              <span>{{form.username}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效任务数（通）：通/人：" prop="mobile">
              <span>{{form.username}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下一步行动规则：" prop="mobile">
              <span>{{form.username}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼频率（间隔）天：" prop="mobile">
              <span>{{form.username}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="detail-title">
        <span class="tit-text">名单列表</span>
      </div>
      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">

        <el-table-column align="center" label="任务ID">
          <template slot-scope="scope">
            <span>{{scope.row.companyCode}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="联系人姓名">
          <template slot-scope="scope">
            <span>{{scope.row.companyName}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.companyCity}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="年龄">
          <template slot-scope="scope">
            <span>{{scope.row.companyCity}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="性别">
          <template slot-scope="scope">
            <span>{{scope.row.companyCity}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="所在地">
          <template slot-scope="scope">
            <span>{{scope.row.industryType}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="外呼次数">
          <template slot-scope="scope">
            <span>{{scope.row.orgSize}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="最近通话事件">
          <template slot-scope="scope">
            <span>{{scope.row.orgSize}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="外呼结果">
          <template slot-scope="scope">
            <span>{{scope.row.orgSize}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.orgSize}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下一步行动计划">
          <template slot-scope="scope">
            <span>{{scope.row.orgSize}}</span>
          </template>
        </el-table-column>

      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="currentPage"
                       :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken, getAdminStat } from '@/common/js/auth'
// import { addUser, getUserById, updUser } from '@/api/api'
import {getTaskDetail, getAdminTaskDetail} from '@/api/api'
export default {
  data () {
    return {
      form: {},
      headers: {
        Authorization: getToken()
      },
      selectedOptions: [],
      fileList: [],
      value: '',
      list: [],
      listLoading: true,
      tableKey: 0,
      total: null,
      currentPage: 1,
      listQuery: {
        pageIndex: 0,
        pageSize: 10
      },
      id: ''
    }
  },
  computed: {
    adminStat () {
      return Boolean(getAdminStat())
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getList()
    this.listLoading = false
  },
  methods: {
    getList () {
      if (this.adminStat) {
        getAdminTaskDetail(this.id).then(response => {
          console.log(response.data)
          this.form = response.data
          this.total = response.data.totalElements
          this.listLoading = false
        })
      } else {
        getTaskDetail(this.id).then(response => {
          console.log(response.data)
          this.form = response.data
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
        })
      }
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      // this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val - 1
      // this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-title {
    margin-top: 30px;
    margin-bottom: 20px;
    .upd_btn {
      float: right;
    }
  }
  .form-border {
    border: 1px solid #EFEFEF;
    border-radius: 5px;
    padding: 20px 30px 0 20px;
    overflow: hidden;
  }
  .task-detail {
    .el-form-item__content {}
  }
</style>
