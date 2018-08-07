<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
      <el-button class="upd_btn"
                 v-show="updateStatus==='view'"
                 @click="modifyStat">
        <i class="fa fa-edit"
           style="font-size: 22px;margin-right: 5px;vertical-align: middle;"></i>
        <i style="font-style: normal;">修改</i>
      </el-button>
    </div>
    <div class="margin-line"></div>
    <div class="read-detail" v-if="updateStatus==='view'">
      <el-form :model="form" class="form-border">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司ID:" label-width="100px">
              <span>{{form.companyCode}}</span>
            </el-form-item>
            <el-form-item label="公司名称:" label-width="100px">
              <span>{{form.companyName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="所在地:" label-width="100px">
              <span>{{form.companyProvince}}-{{form.companyCity}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司地址:" label-width="100px">
              <span>{{form.companyAddress}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="所属行业:" label-width="100px">
              <span>{{form.industryType}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司规模:" label-width="100px">
              <span>{{form.orgSize}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系人:" label-width="100px">
              <span>{{form.contact}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职务:" label-width="100px">
              <span>{{form.occupation}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系手机:" label-width="100px">
              <span>{{form.contactMobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司LOGO:" label-width="100px">
              <img :src="form.logo"
                   alt=""
                   v-if="form.logo"
                   style="width: 50px; height: 30px;">
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注:" label-width="100px">
              <span>{{form.remark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="detail-title" style="margin-top: 22px;">
        <span class="list-tit">管理员列表</span>
        <el-button class="add_btn" @click="createManager">
          <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建管理员
        </el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">{{scope.row.userCode}}</template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="职务">
          <template slot-scope="scope">{{scope.row.level}}</template>
        </el-table-column>
        <el-table-column align="center" label="联系手机">
          <template slot-scope="scope">{{scope.row.mobile}}</template>
        </el-table-column>
        <el-table-column align="center" label="登录账号">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <div class="switch">
              <el-switch class="sw"
                         v-model="scope.row.enabled"
                         active-color="#0299CC"
                         inactive-color="#C0CCDA"
                         @change="changeMode(scope.row.id, scope.row.enabled)">
              </el-switch>
              <div v-if="scope.row.enabled" class="switch-open">开启</div>
              <div v-else class="switch-close">停用</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <a size="small" class="common_btn"
               @click="updateInfoDialog = true;updateInfo = scope.row;updateForm.name = updateInfo.name;updateForm.level = updateInfo.level;updateForm.mobile = updateInfo.mobile;">修改信息
            </a>
            |
            <a size="small" class="common_btn"
               @click="updatePwdDialog = true;updateInfo = scope.row">修改密码
            </a>
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
      <el-dialog title="修改信息" :visible.sync="updateInfoDialog" width="30%">
        <el-form :model="updateForm" :rules="rulesManager" ref="updateForm" label-width="80px"
                 style="margin-right: 20px;">
          <el-form-item label="姓名" prop="name" class="txt">
            <el-input v-model="updateForm.name" placeholder="输入管理员姓名" maxlength="50"/>
          </el-form-item>
          <el-form-item label="职务" class="txt">
            <el-input v-model="updateForm.level" placeholder="输入职务" maxlength="255"/>
          </el-form-item>
          <el-form-item label="联系手机" class="txt" prop="mobile">
            <el-input v-model="updateForm.mobile" placeholder="请输入联系电话" maxlength="11"/>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button class="search_btn" @click="cancelUpdateUsers('updateForm')">取 消</el-button>
          <el-button class="add_btn" @click="updateUsers('updateForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改密码" :visible.sync="updatePwdDialog" width="30%">
        <el-form :model="pwdForm" :rules="rulesManager" ref="pwdForm" label-width="80px"
                 style="margin-right: 20px;">
          <el-form-item label="新密码" prop="password" class="txt">
            <el-input v-model="pwdForm.password" placeholder="输入登录密码" maxlength="12"></el-input>
            <div style="line-height: 24px; font-size: 12px;">请输入不少于6位的字母或数字</div>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button class="search_btn" @click="cancelResetPassword('pwdForm')">取 消</el-button>
          <el-button class="add_btn" @click="resetPassword('pwdForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="update-detail" v-if="updateStatus==='createManager'">
      <el-form :model="manager" :rules="rulesManager" ref="manager" label-width="100px">
        <el-row v-show="false"/>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="manager.name" placeholder="输入管理员姓名" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="职务">
              <el-input v-model="manager.level" placeholder="输入职务" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="联系手机" prop="mobile">
              <el-input v-model="manager.mobile" placeholder="请输入联系电话" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="登录账号" prop="username">
              <el-input v-model="manager.username" placeholder="输入登录账号" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="manager.password" placeholder="输入登录密码" maxlength="12"></el-input>
              <div style="line-height: 24px; font-size: 12px;">请输入不少于6位的字母或数字</div>
            </el-form-item>

          </el-col>
        </el-row>
        <el-col :span="17" class="dialog-footer" style="text-align: center">
          <el-button class="add_btn" @click="newManager('manager')">提 交</el-button>
          <el-button class="search_btn" @click="cancelManager('manager')">取 消</el-button>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
import {getToken} from '@/common/js/auth'
import {
  addUser,
  getUsers,
  resetPWD,
  updateUsers,
  userEnabled
} from '@/api/api'

export default {
  data () {
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入管理员姓名'))
      } else {
        callback()
      }
    }
    const validateUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录账号'))
      } else if (value.length < 4) {
        callback(new Error('登录账号不能少于4位'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
      if (!value) {
        callback(new Error('请输入登录密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      }else if(reg.test(value)){
        callback(new Error('请您输入数字或字母'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (value) {
        let reg = /^((1[3-8][0-9])+\d{8})$/
        let flag = reg.test(value)
        if (!flag) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      form: {
        companyCode: null
      },
      headers: {
        Authorization: getToken()
      },
      value: '',
      updateStatus: '',
      textMap: {
        createManager: '新建管理员',
        view: '公司详情页'
      },
      centerDialogVisible: false,
      updateInfoDialog: false,
      updatePwdDialog: false,
      rulesManager: {
        name: [
          {required: true, trigger: 'blur', validator: validateName}
        ],
        username: [
          {required: true, trigger: 'blur', validator: validateUser}
        ],
        password: [
          {required: true, trigger: 'blur', validator: validatePass}
        ],
        mobile: [
          {required: false, trigger: 'blur', validator: validateMobile}
        ]
      },
      manager: {
        authorities: [{
          'name': 'ROLE_ADMIN'
        }],
        companyId: 0,
        enabled: null
      },
      listLoading: null,
      list: null,
      total: null,
      currentPage: 1,
      listQuery: {
        companyId: 0,
        authorityName: 'ROLE_ADMIN',
        pageIndex: 0,
        pageSize: 20
      },
      updateInfo: {},
      pwdForm: {
        password: null
      },
      updateForm: {

      }
    }
  },
  created () {
    let obj = this.$route.query
    this.listQuery.companyId = obj.id
    this.getList()
    this.form = obj
    if (this.form.logo) {
      this.form.logo = process.env.BASE_API + '/file/' + this.form.logo
    }
    this.updateStatus = 'view'
  },
  methods: {
    changeMode (id, enabled) {
      userEnabled(id, enabled).then(res => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    cancelResetPassword (formName) {
      this.updateInfo = null
      this.updatePwdDialog = false
      this.$refs[formName].resetFields()
    },
    resetPassword (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resetPWD(this.updateInfo.id, this.pwdForm.password).then(res => {
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
    newManager (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.manager.companyId = this.form.id
          addUser(this.manager)
            .then((res) => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.$refs[formName].resetFields()
              this.updateStatus = 'view'
              this.getList()
            })
        } else {
          return false
        }
      })
    },
    cancelUpdateUsers (formName) {
      this.updateInfo = null
      this.updateInfoDialog = false
      this.$refs[formName].resetFields()
    },
    updateUsers (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.manager.companyId = this.form.id
          this.manager.level = this.updateForm.level
          this.manager.name = this.updateForm.name
          this.manager.mobile = this.updateForm.mobile
          this.manager.userName = this.updateInfo.userName
          this.manager.userCode = this.updateInfo.userCode
          this.manager.enabled = this.updateInfo.enabled
          updateUsers(this.updateInfo.id, this.manager).then(res => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.updateInfoDialog = false
            this.$refs[formName].resetFields()
            this.getList()
          })
        } else {
          return false
        }
      })
    },
    getList () {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.pageIndex = val - 1
      this.getList()
    },
    createManager () {
      this.manager.name = null
      this.manager.level = null
      this.manager.mobile = null
      this.manager.username = null
      this.manager.password = null
      this.updateStatus = 'createManager'
    },
    cancelManager (formName) {
      this.$refs[formName].resetFields()
      this.updateStatus = 'view'
    },
    modifyStat () {
      this.$router.push({name: 'create', query: this.form})
    },
    dialogRouter (status) {
      if (status === 'view') {
        this.updateStatus = 'view'
        this.centerDialogVisible = false
      } else {
        this.$router.push({path: '/company'})
      }
    }
  }
}
</script>

<style lang="scss">
  .switch {
    display: inline-flex;
  }
  .switch-open {
    font-size: 10px;
    width: 55px;
    color: #ffffff;
    z-index: 999;
    pointer-events: none;
    padding-left: 10px;
    text-align: left;
    margin-left: -55px;
  }

  .switch-close {
    font-size: 10px;
    width: 55px;
    margin-left: -55px;
    text-align: right;
    color: #ffffff;
    padding-right: 10px;
    z-index: 999;
    pointer-events: none;
  }

  .txt>.el-form-item__label{
    line-height: 40px!important;
  }
  .sw>.el-switch__core{
    width: 55px!important;
    line-height: 40px!important;
  }
  .upd_btn {
    float: right;
    border: none;
    color: #0299CC;
    &:hover {
      background: #ffff;
    }
    i {
      margin-right: 2px;
      vertical-align: text-bottom;
    }

  }

  .form-border {
    border: 1px solid #EFEFEF;
    border-radius: 5px;
    padding: 20px 30px;
  }

</style>
