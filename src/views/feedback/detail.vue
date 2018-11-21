<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">问题反馈列表</span>
    </div>
    <div class="fd-item">
      <span class="width-limit">反馈人：</span>
      <span>{{data.name}}</span>
    </div>
    <div class="fd-item">
      <span class="width-limit">反馈问题：</span>
      <span>{{data.feedbackContent}}</span>
    </div>
    <div class="fd-item">
      <span class="width-limit">截图：</span>
      <template v-for="item in imgList">
        <img :src="item" alt="" v-preview="item" style="cursor: pointer">
      </template>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: null,
      imgList: [],
    }
  },
  created () {
    this.data = this.$route.query
    this.getImgList(this.data.feedbackImgPath)
  },
  methods: {
    getImgList (uId) {
      if (uId) {
        uId.split(',').forEach(item => {
          this.imgList.push(process.env.BASE_API + '/feedback/getImg/?fileUuid=' + item)
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .fd-item {
    max-width: 800px;
    margin: 20px 0;
    .width-limit {
      display: inline-block;
      text-align: right;
      vertical-align: top;
      width: 82px;
      color: #252525;
    }
    i {
      color: #000;
      font-weight: 500;
      font-style: normal;
    }
    img{
      margin-left: 10px;
      width: 100px;
      height: 175px;
    }
  }
</style>
