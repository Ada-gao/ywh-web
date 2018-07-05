<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <i class="fa fa-square"></i>
        {{collapsed ? '' : sysName}}
      </el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-outdent"></i>
          你好，{{sysUser}}
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <!-- <span class="el-dropdown-link userinfo-inner"><img src="../assets/user.png"/> {{sysUserName}}</span> -->
          <span class="el-dropdown-link userinfo-inner"><img src="../assets/user.png"/> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose"
                 @select="handleselect"
                 unique-opened router v-show="!collapsed">
          <template v-for="(item,index) in routers" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf"  :key="index">
              <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
                <i :class="item.iconCls"></i>{{child.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0"  :key="item.children[0].path" :index="item.children[0].path"><i
              :class="item.iconCls"></i>{{item.children[0].name}}
            </el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li v-for="(item,index) in routers" v-if="!item.hidden" class="el-submenu item" :key="index">
            <template v-if="!item.leaf">
              <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)"
                   @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
              <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)"
                  @mouseout="showMenu(index,false)">
                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item"
                    style="padding-left: 40px;background: #343744" :class="$route.path==child.path?'is-active':''"
                    @click="$router.push(child.path)"><i :class="item.iconCls"></i>{{child.name}}
                </li>
              </ul>
            </template>
            <template v-else>
              <div class="el-submenu__title el-menu-item"
                   style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                   :class="$route.path==item.children[0].path?'is-active':''"
                   @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
            </template>
          </li>
        </ul>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <!-- <el-col :span="24" class="breadcrumb-container">
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col> -->
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
// import { getUser } from '../api/api'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      sysName: '雷鸣电销系统',
      collapsed: false,
      sysUserName: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sysUser',
      'menuIds',
      'routers'
    ])
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleopen () {
    },
    handleclose () {
    },
    handleselect: function (a, b) {
    },
    // 退出登录
    logout: function () {
      let _this = this
      this.$confirm('确认退出吗?', '提示', {
        // type: 'warning'
      }).then(() => {
        sessionStorage.removeItem('token')
        _this.$router.push('/login')
      }).catch(() => {

      })
    },
    // 折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed
    },
    showMenu (i, status) {
      this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
    }
  },
  mounted () {
    // let user = sessionStorage.getItem('token')
    // this.$store.dispatch('GetUser', user)
    // if (user) {
    //   getUser().then((res) => {
    //     this.sysUserName = res.data.username
    //   })
    // }
    // this.$router.options.routes.forEach(item => {
    //   if (this.sysUser === 'superadmin') {
    //   } else {
    //     console.log(this.menuIds)
    //     console.log(this.routers)
    //   }
    // })
  }
}

</script>

<style scoped lang="scss">
  @import '~scss_vars';

  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
      height: 60px;
      line-height: 60px;
      background: $header-bg;
      box-shadow: 0 1px 0 0 rgba(219,219,219,0.50);
      color: #000;
      position: fixed;
      z-index: 1111;
      .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
        .userinfo-inner {
          cursor: pointer;
          color: #fff;
          img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
          }
        }
      }
      .logo {
        //width:180px;
        height: 60px;
        font-size: 22px;
        padding-left: 20px;
        padding-right: 20px;
        border-color: rgba(238, 241, 146, 0.3);
        border-right-width: 1px;
        border-right-style: solid;
        img {
          width: 40px;
          float: left;
          margin: 10px 10px 10px 18px;
        }
        .txt {
          color: #fff;
        }
      }
      .logo-width {
        width: 180px;
        background: $sidebar-bg;
        color: $sidebar-item-color;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        letter-spacing: 0;
        height: 60px;
        line-height: 60px;
      }
      .logo-collapse-width {
        width: 60px;
        background: $sidebar-bg;
        color: #fff;
      }
      .tools {
        padding: 0px 23px;
        // width: 14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
    }
    .main {
      display: flex;
      // background: #324057;
      position: absolute;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
      aside {
        flex: 0 0 180px;
        width: 180px;
        background: $sidebar-bg;
        color: $sidebar-item-color;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        letter-spacing: 0;
        // position: absolute;
        // top: 0px;
        // bottom: 0px;
        .el-menu {
          height: 100%;
          background: $sidebar-bg;
          border-right: 0;
          .el-menu-item {
            color: #fff;
            background: #42485B;
          }
          .el-menu-item.is-active {
            background: $sidebar-active-bg;
            min-width: 56px;
          }
          .el-submenu__title i,
          .el-menu-item i {
            color: #fff;
          }
        }
        .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item:hover,
        .el-menu--horizontal.el-menu--dark .el-submenu .el-submenu-title:hover,
        .el-menu-item:hover {
          background: $sidebar-active-bg;
        }
        .el-submenu .el-menu-item {
          min-width: 179px;
          background: #343744;
        }
        .collapsed {
          width: 60px;
          .item {
            position: relative;
          }
          .submenu {
            position: absolute;
            top: 0px;
            left: 60px;
            z-index: 99999;
            height: auto;
            display: none;
          }
          .el-submenu .el-menu-item {
            min-width: 60px;
            background: #42485B;
            &:hover {
              background: #00C1DF;
            }
          }
        }
      }
      .menu-collapsed {
        flex: 0 0 60px;
        width: 60px;
      }
      .menu-expanded {
        flex: 0 0 180px;
        width: 180px;
      }
      .content-container {
        // background: #f1f2f7;
        flex: 1;
        // position: absolute;
        // right: 0px;
        // top: 0px;
        // bottom: 0px;
        // left: 180px;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {
          margin-bottom: 15px;
          .title {
            width: 200px;
            float: left;
            color: #475669;
          }
          .breadcrumb-inner {
            float: left;
          }
        }
        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
