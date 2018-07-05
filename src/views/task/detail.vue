<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">任务描述</span>
    </div>
    <div class="margin-line"></div>
    <div class="task-detail">
      <el-form :model="form" class="form-border">
        <el-row :gutter="20">
          <!--<el-col :span="8">-->
            <!--<el-form-item label="所属公司：" prop="name">-->
              <!--<span>{{form.id}}</span>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label="外呼名称：" prop="name">
              <span>{{groupName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务名称：" prop="username">
              <span>{{form.taskName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推广产品：" prop="empNo">
              <span>{{form.productName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售数：" prop="gender">
              <span>{{salesCnt}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分配规则：" prop="education">
              <span>{{form.assignRule}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务目标：" prop="idType">
              <span>{{form.taskTarget}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼话术：" prop="mobile">
              <!--<span>{{form.salesTalk}}</span>-->
              <span class="blue-color" v-popover:popover>点击查看</span>
              <el-popover
                ref="popover"
                placement="right"
                width="200"
                trigger="click">
                <span v-html="form.salesTalk"></span>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务时间：" prop="resumeUrl">
              <span>{{form.taskStartDate}} - {{form.taskEndDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效通话时长：" prop="mobile">
              <span>{{form.minimumDuration}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效任务数（通）：通/人：" prop="mobile">
              <span>{{form.effectiveTasks}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下一步行动规则：" prop="mobile">
              <span>{{form.nextAction}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼频率（间隔）天：" prop="mobile">
              <span>{{form.interv}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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

        <el-table-column align="center" label="任务ID">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
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

        <el-table-column align="center" label="性别">
          <template slot-scope="scope">
            <span>{{scope.row.gender}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="所在地">
          <template slot-scope="scope">
            <span>{{scope.row.residence}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="外呼次数">
          <template slot-scope="scope">
            <span>{{scope.row.callCount || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="最近通话时间">
          <template slot-scope="scope">
            <span>{{scope.row.lastCallDate || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="外呼结果">
          <template slot-scope="scope">
            <span>{{scope.row.lastCallResult}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.orgSize || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下一步行动计划">
          <template slot-scope="scope">
            <span>{{scope.row.nextAction}}</span>
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
    </div>
  </div>
</template>

<script>
import { getToken } from '@/common/js/auth'
// import { addUser, getUserById, updUser } from '@/api/api'
import {getTaskDetail} from '@/api/api'
import {formatDateTime} from '@/common/js/util'
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
        pageSize: 10,
        taskGroupId: null
      },
      salesCnt: null,
      groupName: ''
    }
  },
  created () {
    this.listQuery.taskGroupId = this.$route.params.id
    this.groupName = this.$route.params.name
    this.getList()
    this.listLoading = false
  },
  methods: {
    changeActionText (status) {
      switch (status) {
        case 'FOLLOW':
          status = '继续跟进'
          break
        case 'CUSTOMER_TRANSFORM':
          status = '客户转到其他部门'
          break
        case 'INFO_ERROR':
          status = '信息有误'
          break
        case 'GIVE_UP':
          status = '放弃跟进'
          break
      }
      return status
    },
    getList () {
      getTaskDetail(this.listQuery.taskGroupId, this.listQuery).then(res => {
        this.form = res.data.taskGroup
        this.form.nextAction = this.changeActionText(this.form.nextActionRule)
        this.form.taskStartDate = formatDateTime(this.form.taskStartDate)
        this.form.taskEndDate = formatDateTime(this.form.taskEndDate)
        this.list = res.data.nameList.content
        this.list.forEach((ele, index) => {
          ele.gender = ele.gender === 'GENTLEMAN' ? '男' : '女'
        })
        this.salesCnt = res.data.salesCnt
        this.total = res.data.nameList.totalElements || 0
      })
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.pageIndex = val - 1
      this.getList()
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
  .blue-color {
    font-size: 14px;
    color: #0299CC;
    cursor: pointer;
  }
</style>
