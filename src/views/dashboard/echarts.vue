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
import moment from 'moment/moment.js'

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
        this.total.totalEffectiveDuration = moment(res.data.totalEffectiveDuration || 0).format('mm')
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
