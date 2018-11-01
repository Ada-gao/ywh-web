<template>
  <div class="page-404">
    404 页面丢失了，<span>{{time}}</span> 秒后跳转到首页！
  </div>
</template>
<script>
  export default {
    data() {
      return {
        time: 5
      }
    },
    methods: {
      countDown() {
        this.time--
      }
    },
    mounted() {
      setInterval(this.countDown, 1000);
    },
    watch: {
      'time': function (newVal, oldVal) {
        if (newVal === 0) {
          this.$router.replace('/dashboard')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-404 {
    font-size: 22px;
    margin-top: 50px;
    text-align: center;
    color: #C0CCDA;
    span {
      color: #f00;
    }
  }
</style>
