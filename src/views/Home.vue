<template>
  <el-container style="height: 100%;">
      <el-menu class="el-menu-nav" :collapse="isCollapse" router="true">
        <el-menu-item disabled><i class="fa fa-flash" :style="isCollapse ? 'font-size:22px' : 'font-size:14px'"/><span slot="title" >雷鸣外呼管理平台</span></el-menu-item>
        <el-menu-item index="/dashboard"><i class="fa fa-home"/><span slot="title">首页-工作台</span></el-menu-item>
        <el-menu-item index="/account"><i class="fa fa-bank"/><span slot="title">账户管理</span></el-menu-item>
        <el-menu-item index="/company"><i class="fa fa-sitemap"/><span slot="title">公司管理</span></el-menu-item>
        <el-menu-item index="/salesman"><i class="fa fa-users"/><span slot="title">销售管理</span></el-menu-item>
        <el-menu-item index="/list"><i class="fa fa-list-alt"/><span slot="title">名单管理</span></el-menu-item>
        <el-menu-item index="/task"><i class="fa fa-phone"/><span slot="title">任务管理</span></el-menu-item>
        <el-menu-item index="/push"><i class="fa fa-envelope-o"/><span slot="title">消息推送管理</span></el-menu-item>
        <el-menu-item v-show="sysUser === 'superadmin'" index="/trial"><i class="fa fa-list-ul"/><span slot="title">试用管理</span></el-menu-item>
        <el-menu-item v-show="sysUser === 'superadmin'" index="/check"><i class="fa fa-pencil-square-o"/><span slot="title">审核管理</span></el-menu-item>
        <el-submenu v-show="sysUser === 'superadmin'">
          <template slot="title"><i class="fa fa-bar-chart" style="color: #ffffff"></i><span slot="title" style="color: #ffffff">报表统计</span></template>
          <el-menu-item index="/report/workload"><i class="fa fa-cog"/><span slot="title">工作量统计</span></el-menu-item>
          <el-menu-item index="/report/task"><i class="fa fa-cog"/><span slot="title">外呼任务统计</span></el-menu-item>
          <el-menu-item index="/report/record"><i class="fa fa-cog"/><span slot="title">历史通话记录</span></el-menu-item>
          <el-menu-item index="/report/count"><i class="fa fa-cog"/><span slot="title">话务统计</span></el-menu-item>
        </el-submenu>
        <el-menu-item v-show="sysUser === 'superadmin'" index="/system"><i class="fa fa-phone"/><span slot="title">系统管理</span></el-menu-item>
        <el-menu-item v-show="sysUser === 'superadmin'" index="/feedback"><i class="fa fa-question-circle"/><span slot="title">问题反馈</span></el-menu-item>
      </el-menu>
    <el-container>
      <el-header>
        <div class="hello" @click="collapse">
          <i :class="isCollapse ? 'iconfont icon-zhankaicaidan' : 'iconfont icon-shouqicaidan'"/>{{now}}好，{{sysUser}}！
        </div>
        <div class="head">
          <el-dropdown>
            <img src="../assets/user.png" width="40px" height="40px" style="border-radius: 40px"/>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        now: '凌晨',
        isCollapse: false
      }
    },
    computed : {
      ...mapGetters([
        'sysUser'
      ])
    },
    created () {
      let token = sessionStorage.getItem('token')
      this.$store.dispatch('GetUser', token)
      let hour = new Date().getHours();
      if (hour < 5){
        this.now = '凌晨'
      } else if (hour < 9){
        this.now = '早上'
      } else if (hour < 12){
        this.now = '上午'
      } else if (hour < 14){
        this.now = '中午'
      } else if (hour < 18){
        this.now = '下午'
      } else if (hour < 19){
        this.now = '傍晚'
      } else if (hour < 24){
        this.now = '晚上'
      }
    },
    methods: {
      // 退出登录
      logout : function () {
        let _this = this
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          sessionStorage.removeItem('token')
          _this.$router.push('/login')
        })
      },
      // 折叠导航栏
      collapse : function () {
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>

<style>
  @import "../styles/iconfont.css";

  .el-header {
    height: 60px;
    line-height: 60px;
    padding: 0px;
    border-bottom: 1px solid rgba(219,219,219,0.50);
  }
  .el-header .hello {
    float: left;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
  }
  .el-header .hello i{
    margin-left: 10px;
    margin-right: 10px;
  }
  .head {
    float: right;
    margin-right: 40px;
    margin-bottom: 10px;
  }
  .el-menu{
    background: #343744;
  }
  .el-menu-item,.el-submenu__title {
    background: #42485B ;
    color: #ffffff;
    font-size: 14px;
  }
  .el-submenu .el-menu-item{
    padding-left: 0px;
    min-width: 179px;
  }
  .el-menu-item i,.el-submenu__title i{
    color: #ffffff;
    font-size: 14px;
  }
  .el-menu-item:focus,.el-menu-item:hover,.el-submenu__title:focus,.el-submenu__title:hover{
    background: #00C1DF ;
  }
  .el-menu-item.is-disabled{
     opacity: 1;
     height: 60px;
     line-height: 60px;
     border-bottom: 1px solid rgba(219,219,219,0.50);
   }
  .el-menu-item.is-active{
    color: #ffffff;
    background: #00C1DF ;
  }
  .el-menu-nav:not(.el-menu--collapse) {
    width: 180px;
  }
 /* .el-button{
    background: #0299CC;
    color: #ffffff;
  }*/
  .main .el-button--primary {
    border: 1px solid #0299CC;
    color: #0299CC;
    background: #ffff;
    margin-left: 17px;
  }
  .main .el-button--primary:focus,
  .main .el-button--primary:hover {
    background: #00C1DF;
    border-color: #00C1DF;
    color: #fff;
  }
  .main .add_btn {
    background: #0299CC;
    color: #fff;
  }
  .main .add_btn:hover {
    background: #00C1DF;
    color: #fff;
  }
</style>
