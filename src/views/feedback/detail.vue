<template>
  <section>
    <div class="list-tit">问题反馈列表</div>
    <div class="fd-container">
      <div class="fd-item">
        <span class="width-limit">反馈人：</span>
        <i>{{data.name}}</i>
      </div>
      <div class="fd-item">
        <span class="width-limit">反馈问题：</span>
        <i>{{data.feedbackContent}}</i>
      </div>
      <div class="fd-item">
        <span class="width-limit">截图：</span>
        <ul class="img-ul">
          <li v-for="(item, index) in imgList"
              :key="index"
          >
            <img :src="item"
                 alt="">
            <div class="mask"
                 @click="showBig(index)">
              <i class="fa fa-search-plus"></i>
              <span>查看图片</span>
            </div>
          </li>
        </ul>
      </div>
      <el-dialog
        class="fd-dialog"
        :visible.sync="isDialogShow"
        width="30%">
        <span slot="footer" class="dialog-footer">
        <img :src="bigsrc" alt="" class="big-img">
      </span>
      </el-dialog>
    </div>
  </section>
</template>
<script>

export default {
  name: 'feedbackDetail',
  data () {
    return {
      isDialogShow: false,
      data: null,
      imgList: [],
      bigsrc: ''
    }
  },
  created () {
    this.data = this.$route.params
    this.getImgList(this.data.feedbackImgPath)
  },
  methods: {
    showBig (index) {
      this.isDialogShow = true
      console.log(index)
      this.bigsrc = this.imgList[index]
    },
    getImgList (uId) {
      if (uId) {
        let uIdArr = uId.split(',')
        uIdArr.forEach((ele, index) => {
          this.imgList.push(process.env.BASE_API + '/feedback/getImg/' + ele)
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .fd-container {
    border: 1px solid #EFEFEF;
    border-radius: 2px;
    .big-img {
      display: inline-block;
      width: 242px;
      height: 399px;
    }
  }
  .fd-item {
    span.width-limit {
      display: inline-block;
      text-align: right;
      width: 82px;
      color: #252525;
    }
  }
  .fd-item {
    margin: 20px 0;
    i {
      color: #000;
      font-weight: 500;
      font-style: normal;
    }
  }
  .img-ul {
    vertical-align: text-top;
    display: inline-block;
    padding-left: 0;
    margin-bottom: 0;
    li {
      display: inline-block;
      position: relative;
      border: 0 solid #D2D2D2;
      width: 100px;
      height: 175px;
      -webkit-box-shadow: 0 1px 4px 1px rgba(7, 17, 27, 0.1);
      -moz-box-shadow: 0 1px 4px 1px rgba(7, 17, 27, 0.1);
      box-shadow: 0 1px 4px 1px rgba(7, 17, 27, 0.1);
      .mask {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .1);
        z-index: 1;
        padding-top: 60px;
        opacity: 0;
        i,
        span {
          display: block;
          text-align: center;
          color: #fff;
        }
        i {
          font-size: 20px;
        }
      }
      img {
        display: inline-block;
        width: 100px;
        height: 175px;
      }
      &:hover {
        .mask {
          opacity: 1;
        }
      }
    }
    li:not(:last-child) {
      margin-right: 20px;
    }
  }
</style>
