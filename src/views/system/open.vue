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
            <el-form-item label="账户名称" prop="accountName">
              <el-input v-model="form.accountName" placeholder="请输入账户名称" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="账户类型" prop="accountType">
              <el-select v-model="form.accountType" placeholder="请选择账户类型" style="width: 100%" @change="$refs['form'].validateField('accountType')">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="余额提醒" prop="balanceThreshold">
              <el-input v-model="form.balanceThreshold" placeholder="请输入余额提醒" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="账户到期时间">
              <el-date-picker
                v-model="form.expireDate"
                type="date"
                style="width: 100%"
                placeholder="选择账户到期时间"
                :picker-options="pickerOptions0">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="职务">
              <el-input v-model="form.level" placeholder="请输入职务" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="登录账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入登录账号" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="登录密码" prop="passWord">
              <el-input v-model="form.passWord" placeholder="请输入登录密码" maxlength="12"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="联系手机" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入联系手机" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="所属公司" prop="companyId">
              <el-select v-model="form.companyId" placeholder="请选择公司" style="width: 100%" @change="$refs['form'].validateField('companyId')">
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
            <el-form-item label="余额警告值" prop="warningValue">
              <el-input v-model="form.warningValue" placeholder="请输入余额警告值" maxlength="8"></el-input>
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
  import * as Api from "@/api/api"

  export default {
    data() {
      const checkNumber = (rule, value, callback) => {
        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (!value) {
          return callback(new Error('请输入余额提醒'))
        } else {
          if (!(reg.test(value))) {
            callback(new Error('请输入有效金额'))
          } else {
            callback()
          }
        }
      }
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
        if (value) {
          if (flag){
            callback()
          }else{
            callback(new Error('请输入正确的手机号'))
          }
        } else {
          //callback(new Error('请输入手机号'))
          callback()
        }
      }
      const checkValue = (rule, value, callback) => {
        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (!value) {
          return callback(new Error('请输入余额警告值'))
        } else {
          if (!(reg.test(value))) {
            callback(new Error('请输入有效金额'))
          } else {
            callback()
          }
        }
      }
      return {
        rules: {
          accountName: [
            {required: true, trigger: 'blur', message: '请输入账户名称'}
          ],
          accountType: [
            {required: true, trigger: 'blur', message: '请选择账户类型'}
          ],
          balanceThreshold: [
            {required: true, trigger: 'blur', validator: checkNumber}
          ],
          name: [
            {required: true, trigger: 'blur', message: '请输入姓名'}
          ],
          userName: [
            {required: true, trigger: 'blur', validator: validateUser}
          ],
          passWord: [
            {required: true, trigger: 'blur', validator: validatePass}
          ],
          mobile: [
            {required: false, trigger: 'blur', validator: validateMobile}
          ],
          companyId: [
            {required: true, trigger: 'blur', message: '请选择所属公司'}
          ],
          warningValue:[
            {required: true, trigger: 'blur', validator: checkValue}
          ],
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        form: {},
        companies: [],
        types: [
          {
            label: '付费使用',
            value: 'Charge'
          },
          {
            label: '试用体验',
            value: 'Trial'
          }
        ],
      }
    },
    created() {
      this.getQuery()
    },
    methods: {
      getQuery() {
        Api.getCompanies().then(res => {
          this.companies = res.data
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            Api.account(this.form)
              .then((res) => {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.$router.push({path: '/system'})
              })
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.push({path: '/system'})
      }
    }
  }
</script>

<style>

</style>
