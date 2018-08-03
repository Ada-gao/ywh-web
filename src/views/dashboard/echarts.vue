<template>
    <section class="chart-container">
        <el-row class="statistic">
            <el-col :span="6">
                <div class="panel panel-blue">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xs-3 spicle">
                                <i class="iconfont icon-waihurenwu icon_style"></i>
                            </div>
                            <div class="col-xs-8">
                              <div class="stat-tit">外呼任务</div>
                              <span class="huge">{{total.totalTaskCnt}}<small style="font-size: 60%">个</small></span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="panel panel-green">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xs-3 spicle">
                                <i class="iconfont icon-xiaoshoushu icon_style"></i>
                            </div>
                            <div class="col-xs-8">
                              <div class="stat-tit">销售人数</div>
                              <span class="huge">{{total.totalSalesCnt}}<small style="font-size: 60%">人</small></span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="panel panel-yellow">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xs-3 spicle">
                                <i class="fa fa-calendar-check-o icon_style_spel"></i>
                            </div>
                            <div class="col-xs-8">
                              <div class="stat-tit">任务完成数</div>
                              <span class="huge">{{total.totalTaskCompleteCnt}}<small style="font-size: 60%">个</small></span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="panel panel-red">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xs-3 spicle">
                                <i class="iconfont icon-youxiaotonghuashichang icon_style"></i>
                            </div>
                            <div class="col-xs-8">
                              <div class="stat-tit">有效通话时长</div>
                              <span class="huge total_style"><em v-if="total_min != 0">{{total_min}}<small style="font-size: 60%">分</small></em><em>{{total_sed}}<small style="font-size: 60%">秒</small></em></span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>

        </el-row>
    </section>
</template>

<script>
import { getStatistic } from '@/api/api'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      total: {
        totalSalesCnt: 0,
        totalTaskCnt: 0,
        totalEffectiveDuration: 0,
        totalTaskCompleteCnt: 0
      },
      total_min:0,
      total_sed:0
    }
  },
  computed: {
    ...mapGetters([
      'sysUser'
    ])
  },
  methods: {
    getCount () {
      getStatistic().then(res => {
        if (res.data.totalEffectiveDuration === null) {
          this.total.totalEffectiveDuration = '0';
          this.total_min = 0;
          this.total_sed = 0;
        } else {
          let theTime = parseInt(res.data.totalEffectiveDuration)
          let theTime1 = 0
          if (theTime > 60) {
            theTime1 = parseInt(theTime / 60)
            theTime = parseInt(theTime % 60)
          }
          var result = 0;
          if(parseInt(theTime) == 0){
            var result = parseInt(theTime)
          }else{
            var result = parseInt(theTime) + '秒'
          }
          if (theTime1 > 0) {
            result = parseInt(theTime1) + '分' + result
          }
          this.total_min = parseInt(theTime1);
          this.total_sed = parseInt(theTime);
          this.total.totalEffectiveDuration = result
        }
        this.total.totalTaskCompleteCnt = res.data.totalTaskCompleteCnt || 0
        this.total.totalSalesCnt = res.data.totalSalesCnt || 0
        this.total.totalTaskCnt = res.data.totalTaskCnt || 0
      })
    }
  },
  mounted: function () {
    this.getCount()
  }
}
</script>

<style scoped>
@import "../../styles/iconfont.css";
    .chart-container {
        width: 100%;
        float: left;
    }
    .el-col {
        padding: 30px 20px;
    }
    .statistic .spicle{ height: 50px; overflow: hidden; }
    .icon_style{ color: #fff; font-size: 46px; position: relative; top: -8px; }
    .total_style i{ font-size:25px; }
    .total_style em{ font-style: normal; }
</style>
