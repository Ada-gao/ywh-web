<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">开通账户</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="form" :rules="rules" ref="form" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="账户名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入账户名称" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="账户类型" prop="companyId">
              <el-select v-model="form.companyId" placeholder="请选择账户类型" style="width: 100%">
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
          <el-col :span="10">
            <el-form-item label="余额提醒" prop="team">
              <el-input v-model="form.team" placeholder="请输入余额提醒" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="账户到期时间" prop="team">
              <el-input v-model="form.team" placeholder="请输入账户到期时间" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="姓名" prop="team">
              <el-input v-model="form.team" placeholder="请输入姓名" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="职务" prop="team">
              <el-input v-model="form.team" placeholder="请输入职务" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="登录账号" prop="team">
              <el-input v-model="form.team" placeholder="请输入登录账号" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="登录密码" prop="team">
              <el-input v-model="form.team" placeholder="请输入登录密码" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="联系手机" prop="team">
              <el-input v-model="form.team" placeholder="请输入联系手机" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="所属公司" prop="companyId">
              <el-select v-model="form.companyId" placeholder="请选择公司" style="width: 100%">
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
      </el-form>
      <el-col :span="20" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" @click="create('form')">提交</el-button>
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
  import {getToken} from '@/common/js/auth'
  import {transferCompById} from '@/common/js/util'
  import {addUser, getCompanies, getUserById, resetPWD, taskDoneRate, updSale, userEnabled} from '@/api/api'

  export default {
    data() {
      const validateUser = (rule, value, callback) => {
        var reg = /^[0-9a-zA-Z]+$/
        if (!value) {
          callback(new Error('请输入登录账号'))
        } else if (value.length < 4) {
          callback(new Error('登录账号不能少于4位'))
        } else if (!(reg.test(value))) {
          callback(new Error('请您输入数字或字母'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        var reg = /^[0-9a-zA-Z]+$/
        if (!value) {
          callback(new Error('请输入登录密码'))
        } else if (value.length < 6) {
          callback(new Error('密码不能少于6位'))
        } else if (!(reg.test(value))) {
          callback(new Error('请您输入数字或字母'))
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        let reg = /^((1[3-8][0-9])+\d{8})$/
        let flag = reg.test(value)
        if (!value || !flag) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      const validateWechatNo = (rule, value, callback) => {
        if (value) {
          if (value.length < 6 || value.length > 20) {
            callback(new Error('请输入正确的微信'))
          } else {
            callback()
          }
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
            {required: true, trigger: 'blur', validator: validateUser}
          ],
          password: [
            {required: true, trigger: 'blur', validator: validatePass}
          ],
          wechatNo: [
            {required: false, trigger: 'blur', validator: validateWechatNo}
          ],
          mobile: [
            {required: true, trigger: 'blur', validator: validateMobile}
          ]
        },
        form: {
          authorities: [
            {
              name: 'ROLE_SALE'
            }
          ]
        },
        selectedOptions: [],
        fileList: [],
        value: '',
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
        ruleForm: {
          password: null
        }
      }
    },
    created() {
      this.id = this.$route.query.id
      this.companyName = this.$route.query.companyName
      this.getList()
      this.getQuery()
      this.listLoading = false
    },
    methods: {
      getList() {
        getUserById(this.id).then(res => {
          this.form = res.data
          this.form.createdDate = new Date(this.form.createdDate).toLocaleDateString()
        })
        taskDoneRate(this.id).then(res => {
          this.list.push(res.data)
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
      getQuery() {
        if (this.updateStatus !== 'view') {
          getCompanies().then(res => {
            this.companies = res.data
          })
        }
      },
      updateStat() {
        this.updateStatus = 'update'
        this.$router.replace({path: this.$route.fullPath, query: {updateStatus: this.updateStatus}})
        this.getQuery()
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.form.password = this.trim(this.form.password, 'g')
            this.form.username = this.trim(this.form.username, 'g')
            if (this.updateStatus === 'create') {
              addUser(this.form)
                .then((res) => {
                  this.$message({
                    message: '创建成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/salesman'})
                })
            } else {
              updSale(this.form.id, this.form).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.updateStatus = 'view'
                this.companyName = transferCompById(this.form.companyId, this.companies)
              })
            }
          } else {
            return false
          }
        })
      },
      changeMode(val) {
        userEnabled(this.form.id, val).then(res => {
          this.value3 = val
          if (val) {
            this.$message({
              message: '启用成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '停用成功',
              type: 'success'
            })
          }
        })
      },
      cancel(formName) {
        this.$router.push({path: '/system'})
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
      }
    }
  }
</script>

<style>

</style>
