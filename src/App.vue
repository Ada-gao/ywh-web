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

.container .el-button--primary{
  background: #ffffff;
}

// 去除table 样式
.el-table--border::after, .el-table--group::after{ display: none;}
// ie浏览器中遮罩层问题
.v-modal{ position: fixed; top:0px; left: 0px; width: 100%; height: 100%; opacity: 0.5; background: #000; z-index: 2000; }
.row:after, .row:before{ display: table; content: "";}
</style>
