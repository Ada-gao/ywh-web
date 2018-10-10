<template>
  <div>
    <el-row :gutter="15" style="margin-left: 25px;margin-right: 25px;height: 120px;">
      <el-col :span="6">
        <el-card class="card" :body-style="{ padding: '0px' }">
          <div style="height: 50px;margin-left: 20px;margin-top: 35px;">
            <div class="logo" style="background: #4AD2DB">
              <i class="iconfont icon-waihurenwu"/>
            </div>
            <div class="info">
              <div class="title">外呼任务</div>
              <div class="count" style="color: #4AD2DB">
                {{total.totalTaskCnt}}<span style="font-size: 14px">个</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card" :body-style="{ padding: '0px' }">
          <div style="height: 50px;margin-left: 20px;margin-top: 35px;">
            <div class="logo" style="background: #FDCE82">
              <i class="iconfont icon-xiaoshoushu"/>
            </div>
            <div class="info">
              <div class="title">活跃销售人数</div>
              <div class="count" style="color: #FDCE82">
                {{total.enabledSalesCnt}}<span style="font-size: 14px">个</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card" :body-style="{ padding: '0px' }">
          <div style="height: 50px;margin-left: 20px;margin-top: 35px;">
            <div class="logo" style="background: #30CDAA;line-height: 60px;">
              <i class="fa fa-calendar-check-o"/>
            </div>
            <div class="info">
              <div class="title">任务完成数</div>
              <div class="count" style="color: #30CDAA">
                {{total.totalTaskCompleteCnt}}<span style="font-size: 14px">个</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card" :body-style="{ padding: '0px' }">
          <div style="height: 50px;margin-left: 20px;margin-top: 35px;">
            <div class="logo" style="background: #0299CC;">
              <i class="iconfont icon-youxiaotonghuashichang"/>
            </div>
            <div class="info">
              <div class="title">有效通话时长</div>
              <div class="count" style="color: #0299CC">
                {{total_min}}<span style="font-size: 12px;margin-right: 5px">分</span>{{total_sed}}<span style="font-size: 14px">秒</span>
              </div>
            </div>
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
    methods: {
      getCount() {
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
    },
    created () {
      this.getCount()
    }
  }
</script>
<style scoped>
  .card {
    height: 120px;
    /*padding-top: 35px;*/
    /*padding-left: 20px;*/
  }
  .logo {
    width: 50px;
    height: 50px;
    line-height: 50px;
    border-radius: 4px;
    text-align: center;
    float: left;
  }
  .logo i {
    color: #ffffff;
    font-size: 28px
  }
  .info{
    margin-left: 12px;
    float: left;
  }
  .info .title{
    font-size: 14px;
    color: #475669;
  }
  .info .count{
    margin-top: 6px;
    font-size: 20px;
  }
</style>
