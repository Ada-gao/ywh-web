<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">任务描述</span>
    </div>
    <div class="margin-line"></div>
    <div class="task-detail">
      <el-form :model="form" class="form-border" style="margin-bottom: 20px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="外呼名称：">
              <span>{{groupName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务名称：">
              <span>{{form.taskName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推广产品：">
              <span>{{form.productName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售数：">
              <span>{{salesCnt}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分配规则：">
              <span>{{form.assignRule}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务目标：">
              <span>{{form.taskTarget}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼话术：">
              <el-popover
                placement="right"
                width="200"
                :content="form.salesTalk"
                trigger="click">
                <span  slot="reference" class="blue-color">点击查看</span>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务时间：">
              <span>{{form.taskStartDate}} - {{form.taskEndDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效通话时长（秒)：">
              <span>{{form.minimumDuration}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效任务数（通）：通/人/天：">
              <span>{{form.effectiveTasks}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼次数限制：">
              <span>{{form.limitedTimes?form.limitedTimes:'无'}}</span>
              <i class="fa fa-pencil-square-o" v-show="isSuperAdmin === 'true'" @click="updateDialog = true"
                 style="margin-left: 10px"></i>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼频率（间隔）天：">
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

        <el-table-column align="center" label="任务ID" width="80">
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

        <el-table-column align="center" label="年龄" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.age}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="性别" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.gender}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="所在地" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.residence}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="外呼次数" width="80">
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
            <span v-if="scope.row.lastCallResult === 'NOT_CALL'">未外呼</span>
            <span v-if="scope.row.lastCallResult === 'NOT_EXIST'">空号</span>
            <span v-if="scope.row.lastCallResult === 'UNCONNECTED'">未接通</span>
            <span v-if="scope.row.lastCallResult === 'CONNECTED'">已接通</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.duration || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下一步行动计划">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'CALL_AGAIN'">再次外呼</span>
            <span v-if="scope.row.status === 'GIVE_UP'">放弃外呼</span>
            <span v-if="scope.row.status === 'FOLLOW'">继续跟进</span>
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
      <el-dialog title="修改次数" :visible.sync="updateDialog" width="30%">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="外呼次数限制" prop="times" class="txt">
            <el-input v-model="ruleForm.times" placeholder="请输入外呼次数限制" maxlength="8"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button class="search_btn" @click="cancelLimitedTimes('ruleForm')">取 消</el-button>
          <el-button class="add_btn" @click="updateLimitedTimes('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getToken} from '@/common/js/auth'
  import * as Api from "@/api/api"

  export default {
    data() {
      const checkNumber = (rule, value, callback) => {
        if (value) {
          if (value == 0){
            callback(new Error('输入数字的不能为0'))
          } else {
            if (!/^[0-9]+$/.test(value)) {
              callback(new Error('请输入数字'))
            } else {
              callback()
            }
          }
        } else {
          callback(new Error('请输入外呼次数限制'))
        }
      }
      return {
        rules: {
          times: [
            {required: true, trigger: 'blur', validator: checkNumber}
          ],
        },
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
        groupName: '',
        updateDialog: false,
        ruleForm: {
          times: null
        },
        isSuperAdmin:'false',
      }
    },
    created() {
      this.isSuperAdmin  = sessionStorage.getItem('isSuperAdmin')
      this.listQuery.taskGroupId = this.$route.query.id
      this.groupName = this.$route.query.name
      this.getList()
      this.listLoading = false
    },
    methods: {
      updateLimitedTimes(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Api.updateTimes(this.listQuery.taskGroupId, this.ruleForm.times).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.form.limitedTimes = this.ruleForm.times
              this.updateDialog = false
              this.$refs[formName].resetFields()
            })
          } else {
            return false
          }
        })
      },
      cancelLimitedTimes(formName) {
        this.updateDialog = false
        this.$refs[formName].resetFields()
      },
      changeActionText(status) {
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
      Datetime(date) {
        let theTime = parseInt(date)
        let theTime1 = 0
        if (theTime > 60) {
          theTime1 = parseInt(theTime / 60)
          theTime = parseInt(theTime % 60)
        }
        let result = parseInt(theTime) + '秒'
        if (theTime1 > 0) {
          result = parseInt(theTime1) + '分' + result
        }
        return result
      },
      timestampToTime(timestamp) {
        let date = new Date(timestamp)
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
        let D = date.getDate() + '日'
        let h = date.getHours() + ':'
        let m = date.getMinutes()
        let time = M + D + h + m
        return time
      },
      getList() {
        Api.getTaskDetail(this.listQuery.taskGroupId, this.listQuery).then(res => {
          this.form = res.data.taskGroup
          this.form.nextAction = this.changeActionText(this.form.nextActionRule)
          this.form.taskStartDate = new Date(this.form.taskStartDate).toLocaleDateString()
          this.form.taskEndDate = new Date(this.form.taskEndDate).toLocaleDateString()
          this.list = res.data.nameList.content
          this.list.forEach((ele, index) => {
            if (ele.gender) {
              ele.gender = ele.gender === 'GENTLEMAN' ? '男' : '女'
            }else{
              ele.gender = ''
            }
            if (ele.duration === null) {
              ele.duration = 0
            } else {
              ele.duration = this.Datetime(ele.duration)
            }
            if (ele.lastCallDate === null) {
              ele.lastCallDate = 0
            } else {
              ele.lastCallDate = this.timestampToTime(ele.lastCallDate)
            }
          })
          this.salesCnt = res.data.salesCnt
          this.total = res.data.nameList.totalElements || 0
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val - 1
        this.getList()
      }
    }
  }
</script>

<style lang="scss">
  .txt {
    font-size: 13px !important;
    color: #252525 !important;
  }
  .detail-title {
    /*margin-top: 30px;*/
    /*margin-bottom: 20px;*/
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
    .el-form-item__content {
    }
  }

  .container .task-detail .el-form-item__content span.blue-color {
    font-size: 14px;
    color: #0299CC;
    cursor: pointer;
  }

  .el-popover {
    max-height: 360px;
    overflow: auto;
    word-break: break-all;
  }
</style>
