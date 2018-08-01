<template>
  <div class="login-box">
  <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login-container">
    <div class="title"><span class="China-tit">用户登录</span></div>
    <div class="sepa"></div>
    <el-form-item prop="username">
      <el-input name="username" :type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名或邮箱">
        <i slot="prefix" class="fa fa-user" style="padding-left: 5px;"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="on" placeholder="密码">
        <i slot="prefix" class="fa fa-unlock-alt" style="padding-left: 5px;"/>
        <i slot="suffix" @click="showPwd" v-if="pwdType === 'password'" class="fa fa-eye-slash" style="padding-right: 5px;"/>
        <i slot="suffix" @click="showPwd" v-if="pwdType != 'password'" class="fa fa-eye" style="padding-right: 5px;"/>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width:100%;background-color: #00C1DF" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>

import { requestLogin, getUser } from '../api/api'
import NProgress from 'nprogress'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (!value || value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      time: 60,
      timeFlag: false,
      activeName: 'first',
      loginForm: {
        username: null,
        password: null
      },
      loginRules: {
        username: [{required: true, message: '请输入用户名或手机号', trigger: 'blur'}],
        password: [{required: true, trigger: 'blur', validator: validatePass}]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          NProgress.start()
          let loginParams = {username: this.loginForm.username, password: this.loginForm.password}
          requestLogin(loginParams).then(res => {
            this.loading = false
            NProgress.done()
            sessionStorage.setItem('token', res.data.token)
            getUser().then(res => {
              if (res.data.authorities[0].authority === 'ROLE_SALE') {
                sessionStorage.removeItem('token')
                alert('管理权限不足，请联系管理员')
              } else {
                this.$router.push({path: '/dashboard'})
              }
            })
          }).catch(error => {
            this.loading = false
            NProgress.done()
            this.$message({
              message: error.response.data.error,
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-box {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-image: url('/static/img/banner.jpg');
    background-size: cover;
  }
  .China-tit {
    font-size: 34px;
    color: #00C1DF;
  }
  .sepa {
    height: 1px;
    background: #CFCFCF;
    margin: 24px auto;
  }
  .login-container {
    background-clip: padding-box;
    margin: 220px auto 0;
    width: 350px;
    padding: 35px 50px 30px 50px;
    background: rgba(0, 0, 0, .25);
    border-radius: 2px;
    position: absolute;
    right: 14%;
  }

</style>
