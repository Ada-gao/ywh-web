<template>
  <el-container style="height: 100%;">
    <el-menu class="el-menu-nav"text-color="#fff" :collapse-transition="false" active-text-color="#fff" index="0" :collapse="isCollapse":unique-opened="true" :router="true" default-active="1" @open="handleChange" @close="handleChange">
      <el-menu-item index="0" disabled style="cursor:default"><i class="fa fa-flash"/><span slot="title">雷鸣外呼管理平台</span></el-menu-item>
      <el-menu-item index="1" route="/dashboard"><i class="fa fa-home"/><span slot="title">首页-工作台</span></el-menu-item>
      <el-menu-item index="2" v-if="isSuperAdmin === 'false'" route="/account"><i class="iconfont icon-zhanghu"/><span slot="title">账户管理</span></el-menu-item>
      <el-menu-item index="3" route="/company"><i class="iconfont icon-gongsiguanli"/><span slot="title">公司管理</span></el-menu-item>
      <el-menu-item index="4" route="/salesman"><i class="iconfont icon-xiaoshoushu"/><span slot="title">销售管理</span></el-menu-item>
      <el-menu-item index="5" route="/list"><i class="iconfont icon-guize"/><span slot="title">名单管理</span></el-menu-item>
      <el-menu-item index="6" route="/task"><i class="fa fa-phone"/><span slot="title">任务管理</span></el-menu-item>
      <el-submenu index="7">
        <template slot="title"><i class="iconfont icon-xiaoxishezhi"></i><span slot="title" >推送管理</span></template>
        <el-menu-item index="7-1" route="/push/rule"><i class="iconfont icon-guize"/><span slot="title">推送规则</span></el-menu-item>
        <el-menu-item index="7-2" route="/push/push"><i class="iconfont icon-fasong"/><span slot="title">信息推送</span></el-menu-item>
      </el-submenu>
      <el-menu-item index="8" v-if="isSuperAdmin === 'true'" route="/trial"><i class="fa fa-list-ul"/><span slot="title">试用管理</span></el-menu-item>
      <el-menu-item index="9" v-if="isSuperAdmin === 'true'" route="/check"><i class="iconfont icon-shenheguanli"/><span slot="title">审核管理</span></el-menu-item>
      <el-submenu index="10">
        <template slot="title"><i class="iconfont icon-chart"></i><span slot="title">报表统计</span></template>
        <el-menu-item index="10-1" route="/report/workload"><i class="iconfont icon-wodegongzuoliang"/><span slot="title">工作量统计</span></el-menu-item>
        <el-menu-item index="10-2" route="/report/task"><i class="iconfont icon-boda"/><span slot="title">外呼任务统计</span></el-menu-item>
        <el-menu-item index="10-3" route="/report/count"><i class="iconfont icon-lishi"/><span slot="title">话务统计</span></el-menu-item>
        <el-menu-item index="10-4" route="/report/record"><i class="iconfont icon-tonghuahuawuliang"/><span slot="title">历史通话记录</span></el-menu-item>
      </el-submenu>
      <el-menu-item index="11" v-if="isSuperAdmin === 'true'" route="/system"><i class="iconfont icon-quanxian"/><span slot="title">系统管理</span></el-menu-item>
      <el-menu-item index="12" v-if="isSuperAdmin === 'true'" route="/feedback"><i class="fa fa-question-circle"/><span slot="title">问题反馈</span></el-menu-item>
      <el-menu-item index="13" v-if="isSuperAdmin === 'true'" route="/version/list"><i class="iconfont icon-banben"/><span slot="title">版本管理</span></el-menu-item>
    </el-menu>
    <el-container :style="{width:'90%',height:pageHeight+'px'}">
      <el-header>
        <div class="hello" @click="collapse" style="cursor:pointer">
          <i :class="isCollapse ? 'iconfont icon-zhankaicaidan' : 'iconfont icon-shouqicaidan'"/>{{now}}好，{{username}}！
        </div>
        <div class="head">
          <el-dropdown>
            <img src="/static/img/user.png" width="40px" height="40px" style="border-radius: 40px;margin-top: 10px"/>
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
  export default {
    data() {
      return {
        now: '凌晨',
        isCollapse: false,
        isSuperAdmin: 'false',
        username: '',
        pageHeight: 0
      }
    },
    created() {
      let hour = new Date().getHours();
      if (hour < 5) {
        this.now = '凌晨'
      } else if (hour < 9) {
        this.now = '早上'
      } else if (hour < 12) {
        this.now = '上午'
      } else if (hour < 14) {
        this.now = '中午'
      } else if (hour < 18) {
        this.now = '下午'
      } else if (hour < 19) {
        this.now = '傍晚'
      } else if (hour < 24) {
        this.now = '晚上'
      }
      this.username = sessionStorage.getItem('username')
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
      this.$router.replace('/dashboard')
      this.handleChange()
    },
    methods: {
      handleChange() {
        let that = this
        let windowHeight = document.documentElement.clientHeight
        that.pageHeight = windowHeight
        setTimeout(function () {
          let pageHeight = document.documentElement.scrollHeight
          if (pageHeight < windowHeight) {
            pageHeight = windowHeight
          }
          that.pageHeight = pageHeight
        }, 350)
      },
      // 退出登录
      logout() {
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          sessionStorage.clear()
          this.$router.push('/login')
        })
      },
      // 折叠导航栏
      collapse() {
        this.isCollapse = !this.isCollapse
        this.handleChange()
      }
    }
  }
</script>
<style lang="scss">
  ::-webkit-scrollbar {
    width: 0; /* 滚动条宽度为0 */
    height: 0; /* 滚动条高度为0 */
    display: none; /* 滚动条隐藏 */
  }
  .el-menu{
    background: #343744;
  }
  .el-menu-item.is-disabled{
    opacity: 1;
    height: 60px;
    line-height: 60px;
  }
  .el-menu-item.is-active{
    background: #00C1DF;
  }
  .el-menu-item,.el-submenu{
    background: #42485B;
  }
  .el-menu-item:focus,.el-menu-item:hover,.el-submenu__title:focus,.el-submenu__title:hover{
    background: #00C1DF ;
  }
  .el-menu-item i,.el-submenu i{
    margin-right: 10px;
  }
  .el-menu-item i,.el-menu-item span,.el-submenu i,.el-submenu span{
    color: #fff;
    font-size: 16px;
  }
</style>
