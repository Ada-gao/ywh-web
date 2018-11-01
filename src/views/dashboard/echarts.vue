<template>
  <div class="page-echarts">
    <el-row :gutter="15">
      <el-col :span="6">
        <el-card>
          <div class="logo-one"><i class="iconfont icon-waihurenwu"/></div>
          <div class="info">
            <div class="title"><span>外呼任务</span></div>
            <div class="count-one">{{total.totalTaskCnt}}<span>个</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="logo-two"><i class="iconfont icon-xiaoshoushu"/></div>
          <div class="info">
            <div class="title"><span>活跃销售人数</span></div>
            <div class="count-two">{{total.enabledSalesCnt}}<span>个</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="logo-three"><i class="fa fa-calendar-check-o" style="padding-top:10px;"/></div>
          <div class="info">
            <div class="title"><span>任务完成数</span></div>
            <div class="count-three">{{total.totalTaskCompleteCnt}}<span>个</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="logo-four"><i class="iconfont icon-youxiaotonghuashichang"/></div>
          <div class="info">
            <div class="title"><span>有效通话时长</span></div>
            <div class="count-four">{{total_min}}<span>分</span> {{total_sed}}<span>秒</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        total: {
          enabledSalesCnt: 0,
          totalTaskCnt: 0,
          totalEffectiveDuration: 0,
          totalTaskCompleteCnt: 0
        },
        total_min: 0,
        total_sed: 0
      }
    },
    created() {
      this.Api.getStatistic().then(res => {
        if (res.data.totalEffectiveDuration === null) {
          this.total.totalEffectiveDuration = '0'
          this.total_min = 0
          this.total_sed = 0
        } else {
          let theTime = parseInt(res.data.totalEffectiveDuration)
          let theTime1 = 0
          if (theTime > 60) {
            theTime1 = parseInt(theTime / 60)
            theTime = parseInt(theTime % 60)
          }
          var result = 0
          if (parseInt(theTime) === 0) {
            result = parseInt(theTime)
          } else {
            result = parseInt(theTime) + '秒'
          }
          if (theTime1 > 0) {
            result = parseInt(theTime1) + '分' + result
          }
          this.total_min = parseInt(theTime1)
          this.total_sed = parseInt(theTime)
          this.total.totalEffectiveDuration = result
        }
        this.total.totalTaskCompleteCnt = res.data.totalTaskCompleteCnt || 0
        this.total.enabledSalesCnt = res.data.enabledSalesCnt || 0
        this.total.totalTaskCnt = res.data.totalTaskCnt || 0
      })
    }
  }
</script>
