<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">任务描述</span>
    </div>
    <div class="com-line"/>
    <el-form :model="form" style="padding-left: 50px;padding-right: 50px">
      <el-row :gutter="20">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关联名单：">
              <span>{{detail.groupName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务名称：">
              <span>{{detail.taskName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推广产品：">
              <span>{{detail.productName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="销售数：">
              <span>{{detail.userCount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分配规则：">
              <span>{{detail.assignRule}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务目标：">
              <span>{{detail.targets}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="外呼话术：">
              <el-popover placement="right" width="200" :content="detail.talk" trigger="click">
                <span slot="reference" class="blue-color">点击查看</span>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务时间：">
              <span>{{detail.taskStartDate}} - {{detail.taskEndDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效通话时长（秒)：">
              <span>{{detail.minimumDuration}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="有效任务数（通）：通/人/天：">
              <span>{{detail.effectiveTasks}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼次数限制：">
              <span>{{detail.limitedTimes?detail.limitedTimes:'无'}}</span>
              <i class="fa fa-pencil-square-o" v-show="isSuperAdmin === 'true'" @click="updateDialog = true"
                 style="margin-left: 10px"></i>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼频率（间隔）天：">
              <span>{{detail.interv}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
    </el-form>
    <div class="com_head">
      <span class="com_title">名单列表</span>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row>
      <el-table-column label="任务ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人姓名">
        <template slot-scope="scope">
          <span class="com-two-row">{{scope.row.contactName?scope.row.contactName:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phoneNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="scope">
          <span>{{scope.row.age?scope.row.age:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.gender?scope.row.gender:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在地">
        <template slot-scope="scope">
          <span>{{scope.row.residence?scope.row.residence:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="外呼次数" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.callCount || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近通话时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.lastCallDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="外呼结果">
        <template slot-scope="scope">
          <span v-if="scope.row.lastCallResult === 'NOT_CALL'||  scope.row.lastCallResult === null">未外呼</span>
          <span v-if="scope.row.lastCallResult === 'NOT_EXIST'">空号</span>
          <span v-if="scope.row.lastCallResult === 'UNCONNECTED'">未接通</span>
          <span v-if="scope.row.lastCallResult === 'CONNECTED'">已接通</span>
        </template>
      </el-table-column>
      <el-table-column label="有效通话时长" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.duration || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下一步行动计划" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.status === null">无</span>
          <span v-if="scope.row.status === 'CALL_AGAIN'">再次外呼</span>
          <span v-if="scope.row.status === 'GIVE_UP'">放弃外呼</span>
          <span v-if="scope.row.status === 'FOLLOW'">继续跟进</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   v-show="!listLoading"
                   :current-page.sync="currentPage"
                   background
                   :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total"/>
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
</template>
<script>
  export default {
    data() {
      const checkNumber = (rule, value, callback) => {
        if (value) {
          if (value == 0) {
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
        isSuperAdmin: 'false',
      }
    },
    created() {
      this.detail = JSON.parse(this.$route.query.item)
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
      this.listQuery.taskGroupId = this.$route.query.id
      this.groupName = this.$route.query.name
      this.getList()
      this.listLoading = false
    },
    methods: {
      updateLimitedTimes(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.Api.updateTimes(this.detail.id, this.ruleForm.times).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.detail.limitedTimes = this.ruleForm.times;
              //this.form.limitedTimes = this.ruleForm.times
              this.$router.replace({name: 'taskDetail', query: {item: JSON.stringify(this.detail)}})
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
      getList() {
        this.Api.getTaskDetail(this.detail.id, this.listQuery).then(res => {
          this.form = res.data.taskGroup
          this.list = res.data.content
          this.list.forEach((ele, index) => {
            if (ele.gender) {
              ele.gender = ele.gender === 'GENTLEMAN' ? '男' : '女'
            } else {
              ele.gender = ''
            }
            if (ele.duration === null) {
              ele.duration = '-'
            } else {
              ele.duration = this.Datetime(ele.duration)
            }
            if (ele.lastCallDate === null) {
              ele.lastCallDate = '-'
            } else {
              ele.lastCallDate = this.Utils.formatDateTime(ele.lastCallDate)
            }
          })
          //this.salesCnt = res.data.salesCnt
          this.total = res.data.totalElements || 0
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
