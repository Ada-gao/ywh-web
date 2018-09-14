<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
}

</script>

<style lang="scss">
@import './styles/index.scss';
@import "./styles/iconfont.css";
body {
  margin: 0px;
  padding: 0px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.el-submenu [class^=fa] {
  vertical-align: baseline;
  margin-right: 10px;
}

.el-menu-item [class^=fa] {
  vertical-align: baseline;
  margin-right: 10px;
}

.toolbar {
  background: #f2f2f2;
  padding: 10px;
  margin: 10px 0px;
  .el-form-item {
    margin-bottom: 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.el-button--primary{
  background: #ffffff;
}

// 去除table 样式
.el-table--border::after, .el-table--group::after{ display: none;}
// ie浏览器中遮罩层问题
.v-modal{ position: fixed; top:0px; left: 0px; width: 100%; height: 100%; opacity: 0.5; background: #000; z-index: 2000; }
.row:after, .row:before{ display: table; content: "";}


///////////////////////////
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
el-menu-item{
  padding-left: 0px;
  min-width: 173px;
}
.el-submenu .el-menu-item{
  padding-left: 0px;
  min-width: 173px;
}
.el-menu-item i,.el-submenu__title i{
  color: #ffffff;
  font-size: 14px;
  margin-right: 10px;
}
.el-menu-item:focus,.el-menu-item:hover,.el-submenu__title:focus,.el-submenu__title:hover{
  background: #00C1DF ;
}
.el-menu-item.is-disabled{
  opacity: 1;
  height: 60px;
  line-height: 60px;
  /*border-bottom: 1px solid rgba(219,219,219,0.50);*/
}
.el-menu-item.is-active{
  color: #ffffff;
  background: #00C1DF ;
}
.el-menu-nav:not(.el-menu--collapse) {
  width: 173px;
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
.max-line2{
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}

.detail-label {
  width: 100px;
  margin-right: 10px;
  font-size: 13px;
  line-height: 40px;
  text-align: right;
  float: left;
  color: #252525;
}

.detail-value {
  font-size: 14px;
  line-height: 40px;
  color: #000000;
  float: left;
  width:60%;
  word-break:break-all;
}

</style>
