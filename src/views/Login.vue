<template>
  <div class="login-box">
  <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
           class="demo-loginForm login-container">
    <div class="title">
      <span class="China-tit">用户登陆</span>
      <span class="foreign-tit">User login</span>
    </div>
    <div class="sepa"></div>
    <!--<el-form-item prop="account">-->
      <!--<el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item prop="checkPass">-->
      <!--<el-input type="password"  @keyup.enter.native="handleLogin" v-model="loginForm.checkPass" auto-complete="off" placeholder="密码"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
    <!--<el-form-item style="width:100%;">-->
      <!--<el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="logining">登录-->
      <!--</el-button>-->
      <!--&lt;!&ndash;<el-button @click.native.prevent="handleReset2">重置</el-button>&ndash;&gt;-->
    <!--</el-form-item>-->

    <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <i class="fa fa-user"></i>
            </span>
      <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名或邮箱"/>
    </el-form-item>
    <el-form-item prop="password">
            <span class="svg-container svg-container_login">
              <i class="fa fa-unlock-alt"></i>
            </span>
      <el-input name="password" :type="pwdType" v-model="loginForm.password"
                autoComplete="on"
                placeholder="密码"></el-input>
      <span class="show-pwd" @click="showPwd">
              <i v-if="pwdType === 'password'" class="fa fa-eye-slash"></i>
              <i v-else class="fa fa-eye"></i>
            </span>
      <!-- <a class="forget-psd" @click="pwdStep=2">忘记密码</a> -->
    </el-form-item>

    <input name="randomStr" type="hidden" v-model="loginForm.randomStr"/>
    <!--<el-form-item prop="code">-->
      <!--<el-col :span="3">-->
              <!--<span class="svg-container svg-container_login">-->
                <!--<i class="fa fa-paper-plane-o"></i>-->
              <!--</span>-->
      <!--</el-col>-->
      <!--<el-col :span="10">-->
        <!--<el-input name="code" type="text" v-model="loginForm.code" @keyup.enter.native="handleLogin"-->
                  <!--autoComplete="on" placeholder="验证码"/>-->
      <!--</el-col>-->
      <!--<el-col :span="10" align="right">-->
        <!--<img :src="src" style="padding-bottom: 1px;" @click="refreshCode"/>-->
      <!--</el-col>-->
    <!--</el-form-item>-->

    <el-form-item>
      <el-button type="primary" class="btn_light" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form-item>

  </el-form>
  </div>
</template>

<script>
import { requestLogin } from '../api/api'
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
      // src: '',
      loginForm: {
        username: null,
        password: null
        // code: '',
        // randomStr: Math.ceil(Math.random() * 100000) + '_' + Date.now()
      },
      loginRules: {
        username: [{required: true, message: '请输入用户名或手机号', trigger: 'blur'}],
        password: [{required: true, trigger: 'blur', validator: validatePass}]
        // code: [{required: true, message: '请输入验证码', trigger: 'change, blur'}]
      },
      loading: false,
      pwdType: 'password'
      // pwdStep: 1
    }
  },
  methods: {
    // refreshCode () {
    //  this.loginForm.randomStr = Math.ceil(Math.random() * 100000) + Date.now()
    //  this.src = '/admin/code/' + this.loginForm.randomStr
    // },
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
            this.$store.dispatch('GetUser', res.data.token)
            this.$router.push({path: '/dashboard'})
          }).catch(error => {
            this.loading = false
            // this.refreshCode()
            this.$message({
              message: error.response.data.error,
              type: 'error'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created () {
    // this.src = '/admin/code/' + this.loginForm.randomStr
  }
}

</script>

<style lang="scss" scoped>
  $dark_gray: #889aa4;
  $light_gray: #00C1DF;
  $color-primary: #0299cc;
  .login-box {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-image: url('/static/img/banner.jpg');
    background-size: cover;
  }
  .login-container {
    background-clip: padding-box;
    margin: 220px auto;
    width: 350px;
    padding: 35px 50px 30px 50px;
    background: rgba(0, 0, 0, .25);
    border-radius: 2px;
    position: absolute;
    right: 200px;
    .title {
      font-size: 0;
      span {
        display: inline-block;
        vertical-align: bottom;
        font-family: PingFangSC-Semibold;
      }
      span.China-tit {
        font-size: 34px;
        color: #00C1DF;
      }
      span.foreign-tit {
        font-size: 18px;
        color: #FFFFFF;
        margin-left: 20px;
      }
    }
    .sepa {
      height: 1px;
      background: #CFCFCF;
      margin: 24px auto;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }

    input:-webkit-autofill {
      box-shadow: 0 0 0 400px #fff inset;
      -webkit-text-fill-color: #000 !important;
      border: none;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 36px;
      width: 85%;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .el-form-item {
      background: #fff;
      border-radius: 2px;
      color: #454545;
    }
    .el-form-item.is-required {
      height: 44px;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .forget-psd {
      position: absolute;
      right: -70px;
      bottom: 0;
      color: #fff;
    }
  }
  .btn_light {
    background-color: $light_gray;
    border-radius: 2px;
  }
  .btn_light:hover {
    background-color: $color-primary;
    border-color: $color-primary;
  }

</style>
