<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">任务描述</span>
      <el-button @click="handleCheck(false)">
        <i class="iconfont icon-jujue"/><span>不通过</span>
      </el-button>
      <el-button @click="handleCheck(true)">
        <i class="iconfont icon-tongguo"/><span>通过</span>
      </el-button>
    </div>
    <div class="com-line"/>
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="关联名单：">
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
      <div class="com_head">
        <span class="com_title">名单列表</span>
      </div>
      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit  highlight-current-row>
        <el-table-column label="任务ID" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人姓名">
          <template slot-scope="scope">
            <span>{{scope.row.contactName?scope.row.contactName:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.phoneNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.age?scope.row.age:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.gender?scope.row.gender:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在地" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.residence?scope.row.residence:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="外呼次数" width="80">
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
            <span v-if="scope.row.lastCallResult === 'NOT_CALL'">未外呼</span>
            <span v-if="scope.row.lastCallResult === 'NOT_EXIST'">空号</span>
            <span v-if="scope.row.lastCallResult === 'UNCONNECTED'">未接通</span>
            <span v-if="scope.row.lastCallResult === 'CONNECTED'">已接通</span>
          </template>
        </el-table-column>
        <el-table-column label="有效通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.duration || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="下一步行动计划">
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
      <el-dialog title="审核通过" :visible.sync="agreeDialog" width="30%">
        <el-form :model="checkForm" :rules="checkRules" ref="checkForm" label-width="100px">
          <el-form-item label="确定审核通过吗？" class="txt" label-width="160px"/>
        </el-form>
        <div style="text-align: right">
          <el-button class="search_btn" @click="agreeDialog = false">取 消</el-button>
          <el-button class="add_btn" @click="commit('2')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="审核不通过" :visible.sync="refuseDialog" width="30%">
        <el-form :model="checkForm" :rules="checkRules" ref="checkForm" label-width="80px">
          <el-form-item label="确定审核不通过吗？请输入驳回原因！" class="txt" label-width="260px"/>
          <el-form-item label="驳回原因" prop="content" class="txt">
            <el-input  type="textarea" v-model="checkForm.content" :rows="3"  placeholder="请输入驳回原因" maxlength="50"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button class="search_btn" @click="refuseDialog = false">取 消</el-button>
          <el-button class="add_btn" @click="commit('1')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
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
        agreeDialog:false,
        refuseDialog:false,
        checkForm:{},
        checkRules: {
          content: [
            {required: true, trigger: 'blur', message: '请输入内容'}
          ],
        },
        obj:{}
      }
    },
    created() {
      this.obj = this.$route.query
      this.isSuperAdmin  = sessionStorage.getItem('isSuperAdmin')
      this.listQuery.taskGroupId = this.$route.query.productId
      // this.groupName = this.$route.query.name
      this.getList()
      this.listLoading = false
    },
    methods: {
      updateLimitedTimes(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.Api.updateTimes(this.listQuery.taskGroupId, this.ruleForm.times).then(res => {
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
      getList() {
        this.Api.getTaskDetail(this.listQuery.taskGroupId, this.listQuery).then(res => {
          this.form = res.data.taskGroup
          this.groupName = res.data.groupName
          this.form.nextAction = this.changeActionText(this.form.nextActionRule)
          this.form.taskStartDate = new Date(this.form.taskStartDate).toLocaleDateString()
          this.form.taskEndDate = new Date(this.form.taskEndDate).toLocaleDateString()
          this.list = res.data.nameList.content
          this.list.forEach(ele => {
            if (ele.gender) {
              ele.gender = ele.gender === 'GENTLEMAN' ? '男' : '女'
            }else{
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
              ele.lastCallDate = this.Utils.formatDateTime(item.lastCallDate)
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
      },
      handleCheck (obj) {
        this.checkForm = {}
        if (this.$refs['checkForm'] !== undefined) {
          this.$refs['checkForm'].resetFields()
        }
        if (obj){
          this.agreeDialog = true
        } else{
          this.refuseDialog = true
        }
      },
      commit (status) {
        this.$refs['checkForm'].validate(valid => {
          if (valid) {
            this.Api.putReview(this.obj.id,status,this.checkForm.content)
              .then((res) => {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$router.push({path: '/check'})
              })
          } else {
            return false
          }
        })
      },
    }
  }
</script>
