<template>
  <div class="login-box">
  <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login-container">
    <div class="title"><span class="China-tit">用户登录</span></div>
    <div class="sepa"></div>
    <el-form-item prop="username">
      <el-input name="username" :type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名或邮箱" maxlength="50">
        <i slot="prefix" class="fa fa-user" style="padding-left: 5px;"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="on" placeholder="密码" maxlength="12">
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


import NProgress from 'nprogress'

export default {
  data () {
    const validateUser = (rule, value, callback) => {
      if (value) {
        if (value.length < 4) {
          callback(new Error('用户名不能小于4位'))
        }else{
          callback()
        }
      } else {
        callback('请输入用户名或手机号')
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value) {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        }else{
          callback()
        }
      } else {
        callback('请输入密码')
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
      text: 'text',
      loginRules: {
        username: [{required: true, trigger: 'blur',validator: validateUser}],
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
          this.$Api.requestLogin(loginParams).then(res => {
            this.loading = false
            NProgress.done()
            sessionStorage.clear()
            sessionStorage.setItem('token', res.data.token)
            this.$Api.getUser().then(res => {
              /*
              {"username":"superadmin",
              "name":"Superadmin",
              "companyId":null,
              "email":"superadmin@shun365.com",
              "level":null,
              "mobile":"15900916362",
              "accountId":null,
              "authorities":[{"authority":"ROLE_SUPERUSER"},{"authority":"ROLE_ADMIN"}],
              "enabled":true}
              */
              let user = res.data
              if (user.authorities[0].authority === 'ROLE_SALE') {
                this.$alert('管理权限不足，请联系管理员', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    sessionStorage.removeItem('token')
                  }
                });
              } else if (user.authorities[0].authority === 'ROLE_ADMIN' && !user.accountId) {
                this.$alert('帐号信息不存在，请联系管理员', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    sessionStorage.removeItem('token')
                  }
                });
              }else {
                sessionStorage.setItem('username',user.username)
                sessionStorage.setItem('isSuperAdmin',user.username === 'superadmin'?'true':'false')
                if (user.accountId){
                  sessionStorage.setItem('accountId',user.accountId)
                }
                if (user.companyId){
                  sessionStorage.setItem('companyId',user.companyId)
                }
                this.$router.push({path: '/dashboard'})
              }
            })
          }).catch(() => {
            this.loading = false
            NProgress.done()
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
    background-size: 100% 100%;
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
    margin: 0 auto 0;
    width: 300px;
    padding: 35px 50px 30px 50px;
    background: rgba(0, 0, 0, .25);
    border-radius: 2px;
    position: absolute;
    right: 14%;
    top:50%;
    transform:translate(0,-50%);
    -webkit-transform:translate(0,-50%);
  }

</style>
