<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
      <span style="float: right;color: #0299cc" v-show="updateStatus==='view'">{{value3 ? '启用' : '停用'}}</span>
      <el-switch
         v-show="updateStatus==='view'"
         v-model="value3"
         class="switch-btn"
         @change="changeMode">
      </el-switch>
      <el-button class="upd_btn"
                 v-show="updateStatus==='view'"
                 @click="updateStat">
        <i class="fa fa-edit" style="font-size: 22px;margin-right: 5px;vertical-align: middle;"></i>
        <i style="font-style: normal;">修改</i>
      </el-button>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail" v-if="updateStatus==='create'||updateStatus==='update'">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="所属公司" prop="companyId">
              <el-select v-model="form.companyId"
                placeholder="请选择公司"
                style="width: 100%">
                <el-option
                  v-for="item in companies"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="所属团队" prop="team">
              <el-input v-model="form.team" placeholder="请输入所属团队" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="销售名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入销售名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="对应职级" prop="level">
              <el-input v-model="form.level" placeholder="请输入对应职级"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="updateStatus==='create'">
          <el-col :span="17">
            <el-form-item label="登录账号" prop="username">
              <el-input v-model="form.username" placeholder="请输入登录账号" maxlength="50" minlength="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="updateStatus==='create'">
          <el-col :span="17">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入登录密码" maxlength="12" minlength="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="联系手机" prop="mobile">
              <el-input v-model="form.mobile"
                        :maxlength="11" placeholder="请输入联系手机"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="17" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button v-show="updateStatus==='create'" class="add_btn" @click="create('form')">提 交</el-button>
        <el-button v-show="updateStatus==='update'" class="add_btn" @click="create('form')">提 交</el-button>
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
      </el-col>
    </div>
    <div class="read-detail" v-if="updateStatus==='view'">
      <el-form :model="form" class="form-border" style="margin-bottom: 20px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="销售ID:" prop="name" label-width="70px">
              <span>{{form.userCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属公司:" prop="name">
              <span>{{companyName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属团队:" prop="username">
              <span>{{form.team}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售名称:" prop="empNo">
              <span>{{form.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对应职级:" prop="gender">
              <span>{{form.level}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系手机:" prop="education">
              <span>{{form.mobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:" prop="idType">
              <span>{{form.createdDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录账号:" prop="mobile">
              <span>{{form.username}}</span>
              <a @click="updatePwdDialog = true" style="margin-left: 20px">
                <i class="fa fa-unlock-alt" style="font-size: 14px;margin-right: 5px;vertical-align: middle;"></i>
                <span style="font-size: 14px;color: #0299CC;">修改密码</span>
              </a>
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
            <!--<el-form-item label="登录密码:" prop="resumeUrl">-->
              <!--<span style="display: inline-block;width:100px;overflow: hidden;text-overflow: ellipsis;">{{form.password}}</span>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
      </el-form>
      <div class="detail-title">
        <span class="list-tit">任务完成情况</span>
      </div>
      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">

        <el-table-column align="center" label="总任务完成数">
          <template slot-scope="scope">
            <span>{{scope.row.totalTaskCompleteCnt || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="总有效通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.totalEffectiveDuration || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="平均通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.avgDuration || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="总完成率">
          <template slot-scope="scope">
            <span>{{scope.row.completeRate}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="今日任务数">
          <template slot-scope="scope">
            <span>{{scope.row.dailyTaskCnt || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="今日完成数">
          <template slot-scope="scope">
          <span>{{scope.row.dailyTaskCompleteCnt || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="今日有效通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.dailyEffectiveDuration || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="今日团队排名">
          <template slot-scope="scope">
            <span>{{scope.row.rank || 0}}</span>
          </template>
        </el-table-column>

      </el-table>
    <!--<div v-show="!listLoading" class="pagination-container">-->
      <!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
                     <!--:current-page.sync="listQuery.page"-->
                     <!--background-->
                     <!--:page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"-->
                     <!--layout="total, sizes, prev, pager, next, jumper" :total="total">-->
      <!--</el-pagination>-->
    <!--</div>-->
      <el-dialog title="修改密码" :visible.sync="updatePwdDialog" width="30%">
        <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="80px" style="margin-right: 20px;">
          <el-form-item label="新密码" prop="password" class="txt">
            <el-input v-model="ruleForm.password" placeholder="输入登录密码" maxlength="12"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button class="search_btn" @click="cancelResetPassword('ruleForm')">取 消</el-button>
          <el-button class="add_btn" type="primary" @click="resetPassword('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/common/js/auth'
import {transferCompById} from '@/common/js/util'
import { resetPWD, getUserById, updSale, addUser, getCompanies, userEnabled, taskDoneRate } from '@/api/api'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validatePass1 = (rule, value, callback) => {
      let reg = /^((1[3-8][0-9])+\d{8})$/
      let flag = reg.test(value)
      if (!value || !flag) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        companyId: [
          {required: true, trigger: 'blur', message: '请选择公司'}
        ],
        team: [
          {required: true, trigger: 'blur', message: '请输入所属团队'}
        ],
        name: [
          {required: true, trigger: 'blur', message: '请输入销售名称'}
        ],
        level: [
          {required: true, trigger: 'blur', message: '请输入对应职级'}
        ],
        username: [
          {required: true, trigger: 'blur', message: '请输入登录账号'}
        ],
        password: [
          {required: true, trigger: 'blur', validator: validatePass}
        ],
        mobile: [
          {required: true, trigger: 'blur', message: '请输入正确的联系手机号', validator: validatePass1}
        ]
      },
      form: {
        authorities: [
          {
            name: 'ROLE_SALE'
          }
        ]
      },
      headers: {
        Authorization: getToken()
      },
      selectedOptions: [],
      fileList: [],
      value: '',
      updateStatus: '',
      textMap: {
        create: '新建销售',
        update: '修改销售详情',
        view: '销售详情页'
      },
      list: [],
      listLoading: true,
      tableKey: 0,
      total: null,
      listQuery: {
        page: 1,
        limit: 20
      },
      companies: [],
      companyName: '',
      value3: true,
      updatePwdDialog: false,
      ruleForm: {
        password: null
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.companyName = this.$route.query.companyName
    if (this.$route.query.id === '0') {
      this.updateStatus = 'create'
    } else {
      this.updateStatus = 'view'
      this.getList()
    }
    this.getQuery()
    this.listLoading = false
  },
  methods: {
    resetPassword (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resetPWD(this.id, this.ruleForm.password).then(res => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.updatePwdDialog = false
            this.$refs[formName].resetFields()
          })
        } else {
          return false
        }
      })
    },
    cancelResetPassword (formName) {
      this.updatePwdDialog = false
      this.$refs[formName].resetFields()
    },
    getList () {
      getUserById(this.id).then(res => {
        this.form = res.data
        this.form.createdDate = new Date(this.form.createdDate).toLocaleDateString()
      })
      taskDoneRate(this.id).then(res => {
        this.list.push(res.data)
        console.log(this.list)
        // this.list = []
        // this.list.push(res.data)
        if (this.list.length > 0) {
          if (this.list[0].totalTaskCompleteCnt &&
            this.list[0].totalTaskCompleteCnt > 0 &&
            this.list[0].totalTaskCnt &&
            this.list[0].totalTaskCnt > 0) {
            this.list[0].completeRate = parseInt(this.list[0].totalTaskCompleteCnt / this.list[0].totalTaskCnt * 100) + '%'
          } else {
            this.list[0].completeRate = 0
          }
        }
      })
    },
    getQuery () {
      if (this.updateStatus !== 'view') {
        getCompanies().then(res => {
          this.companies = res.data
        })
      }
    },
    updateStat () {
      this.updateStatus = 'update'
      this.getQuery()
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          if (this.updateStatus === 'create') {
            addUser(this.form)
              .then((res) => {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.$router.push({path: '/salesman'})
              })
          } else {
            updSale(this.form.id, this.form).then(res => {
              this.updateStatus = 'view'
              this.companyName = transferCompById(this.form.companyId, this.companies)
            })
          }
        } else {
          return false
        }
      })
    },
    changeMode (val) {
      console.log(val)
      // val = val ? 1 : 0
      userEnabled(this.form.id, val).then(res => {
        console.log(res)
      })
    },
    cancel (formName) {
      this.$router.push({path: '/salesman'})
      // this.updateStatus = 'view'
    },
    handleChange (value) {
      // console.log(value)
    },
    handleSuccess (fileList) {
      // console.log(fileList)
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      // this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      // this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-title {
  /*margin-bottom: 20px;*/
  .upd_btn {
    float: right;
    border: none;
    color: #0299CC;
    i {
      margin-right: 2px;
      vertical-align: text-bottom;
    }
    &:hover {
      background: #ffff;
    }
  }
  .switch-btn {
    float: right;
    margin-left: 30px;
    display: inline-block;
    line-height: 40px;
    margin-right: 3px;
  }
}
.form-border {
  border: 1px solid #EFEFEF;
  border-radius: 5px;
  padding: 20px 30px 0 20px;
  overflow: hidden;
}
</style>
