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
      total_min: 0,
      total_sed: 0
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
    .el-col-6{ width: 25%; }
    .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9{ float: left; }
    .panel { margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); box-shadow: 0 1px 1px rgba(0,0,0,.05); }
    .content-container .panel { background: #FFFFFF; border: 1px solid #EFEFEF; box-shadow: 0 2px 6px 2px rgba(7, 17, 27, 0.05); border-radius: 4px;}
    .statistic .panel-heading{ padding: 35px 0 35px 20px; }
    .panel-heading{ padding: 10px 15px; border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; }
    .row { margin-right: -15px; margin-left: -15px; }
    .statistic .row { margin: 0; }
    .statistic .stat-tit { font-family: PingFangSC-Medium; font-size: 14px; color: #475669; letter-spacing: 0; line-height: 20px; }
    .el-col-24{ width: 100%; }
    .col-xs-3{ width: 25%; }
    .col-xs-8{ width: 66.66666667%; }
    .statistic .col-xs-8 { padding-left: 12px; position: relative; height: 80px; }
    .huge{ font-size: 32px; position: absolute; bottom: -10px; }
    .panel-blue .col-xs-3{ background: #4AD2DB; }
    .statistic .col-xs-3 { padding: 15px 10px; -webkit-box-sizing: content-box; box-sizing: content-box; }
    .statistic .spicle{ height: 50px; overflow: hidden;}
    .statistic .col-xs-3{ padding: 0; vertical-align: middle; }
    .panel-blue .col-xs-3, .panel-green .col-xs-3, .panel-yellow .col-xs-3, .panel-red .col-xs-3{ text-align: center;
    box-shadow: 0 2px 6px 2px rgba(7, 17, 27, 0.05); border-radius: 4px; }
    .panel-blue .huge{ color: #4AD2DB; }
    .panel-green .huge{ color: #FDCE82; }
    .panel-yellow .huge { color: #0299CC; }
    .panel-red .huge { color: #30CDAA; }
    .statistic .spicle{ height: 50px; overflow: hidden; }
    .statistic .col-xs-3 { padding: 15px 10px; -webkit-box-sizing: content-box; box-sizing: content-box; }
    .panel-red .col-xs-3{ background: #30CDAA; }
    .panel-yellow .col-xs-3 { background: #0299CC; }
    .panel-green .col-xs-3{ background: #FDCE82; }
    .panel-blue .col-xs-3{ background: #4AD2DB; }
    .icon_style{ color: #fff; font-size: 46px; position: relative; top: -8px; }
    .total_style i{ font-size:25px; }
    .total_style em{ font-style: normal; }
    .btn-group-vertical>.btn-group:after, .btn-group-vertical>.btn-group:before, .btn-toolbar:after, .btn-toolbar:before, .clearfix:after, .clearfix:before, .container-fluid:after, .container-fluid:before, .container:after, .container:before, .dl-horizontal dd:after, .dl-horizontal dd:before, .form-horizontal .form-group:after, .form-horizontal .form-group:before, .modal-footer:after, .modal-footer:before, .modal-header:after, .modal-header:before, .nav:after, .nav:before, .navbar-collapse:after, .navbar-collapse:before, .navbar-header:after, .navbar-header:before, .navbar:after, .navbar:before, .pager:after, .pager:before, .panel-body:after, .panel-body:before, .row:after, .row:before{ display: table;
    content: ""; }
</style>
