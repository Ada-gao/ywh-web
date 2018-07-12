<template>
    <section class="chart-container">
        <el-row class="statistic">
            <el-col :span="6">
                <div class="panel panel-blue">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xs-3">
                                <i class="fa fa-volume-control-phone"></i>
                            </div>
                            <div class="col-xs-8">
                              <div class="stat-tit">外呼任务/个</div>
                              <span class="huge">{{total.totalTaskCnt}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="panel panel-green">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xs-3">
                                <i class="fa fa-user"></i>
                            </div>
                            <div class="col-xs-8">
                              <div class="stat-tit">销售人数/人</div>
                              <span class="huge">{{total.totalSalesCnt}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="panel panel-yellow">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xs-3">
                                <i class="fa fa-calendar-check-o"></i>
                            </div>
                            <div class="col-xs-8">
                              <div class="stat-tit">任务完成数/个</div>
                              <span class="huge">{{total.totalTaskCompleteCnt}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="panel panel-red">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xs-3">
                                <i class="fa fa-clock-o"></i>
                            </div>
                            <div class="col-xs-8">
                              <div class="stat-tit">有效通话时长/分钟</div>
                              <span class="huge">{{total.totalEffectiveDuration}}</span>
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
      }
      // sysUser: null
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
        // this.total.totalEffectiveDuration = res.data.totalEffectiveDuration || 0
        if (res.data.totalEffectiveDuration === null) {
          this.total.totalEffectiveDuration = '0'
        } else {
          let theTime = parseInt(res.data.totalEffectiveDuration)
          let theTime1 = 0
          if (theTime > 60) {
            theTime1 = parseInt(theTime / 60)
            theTime = parseInt(theTime % 60)
          }
          var result = parseInt(theTime) + '秒'
          if (theTime1 > 0) {
            result = parseInt(theTime1) + '分' + result
          }
          this.total.totalEffectiveDuration = result
        }
        this.total.totalTaskCompleteCnt = res.data.totalTaskCompleteCnt || 0
        this.total.totalSalesCnt = res.data.totalSalesCnt || 0
        this.total.totalTaskCnt = res.data.totalTaskCnt || 0
      })
    }
  },
  mounted: function () {
    // let params = {
    //  companyId: this.sysUser.companyId
    // }
    // console.log(this.sysUser)
    this.getCount()
  }
}
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    .el-col {
        padding: 30px 20px;
    }
</style>
