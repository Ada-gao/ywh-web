<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">推送规则详情</span>
      <span style="float: right;color: #0299cc">{{form.enabled ? '启用' : '停用'}}</span>
      <el-switch
        v-model="form.enabled"
        class="switch-btn"
        @change="changeMode">
      </el-switch>
      <el-button class="upd_btn"
                 @click="updateStat">
        <i class="fa fa-edit" style="font-size: 22px;margin-right: 5px;vertical-align: middle;"></i>
        <i style="font-style: normal;">修改</i>
      </el-button>
    </div>
    <div class="margin-line"></div>
    <div class="read-detail">
      <el-form :model="form" class="form-border" style="margin-bottom: 20px" label-width="160px">
        <el-row>
          <el-col>
            <el-form-item label="推送规则名称:" >
              <span>{{form.ruleName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="推送规则"/>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属公司:">
              <span>{{form.companyName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属团队:">
              <span>{{form.team}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联名单:">
              <span>{{form.outboundNameGroupName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.triggerScene === '外呼后'">
          <el-col :span="8">
            <el-form-item label="有效通话时长（秒）：">
              <span>{{form.lessOrGreater + form.duration}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下一步行动计划:">
              <span>{{nextAction}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼结果:">
              <span>{{lastCallResult}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="推送规则模版:" >
              <span>{{form.ruleTemplate}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import * as Api from "@/api/api"

  export default {
    data () {
      return {
        form: {},
        nextAction:'',
        lastCallResult:''
      }
    },
    created () {
      this.form = this.$route.query
      this.getQuery()
    },
    methods: {
      getQuery () {
        getMessage(this.form.id).then(res => {
          this.form = res.data
          if(this.form.nextAction === 'CALL_AGAIN'){
            this.nextAction = '继续外呼'
          }else if(this.form.nextAction === 'GIVE_UP'){
            this.nextAction = '放弃外呼'
          }else if(this.form.nextAction === 'FOLLOW'){
            this.nextAction = '继续跟进'
          }
          if(this.form.lastCallResult === 'NOT_CALL'){
            this.lastCallResult = '未外呼'
          }else if(this.form.lastCallResult === 'NOT_EXIST'){
            this.lastCallResult = '空号'
          }else if(this.form.lastCallResult === 'UNCONNECTED'){
            this.lastCallResult = '未接通'
          }else if(this.form.lastCallResult === 'CONNECTED'){
            this.lastCallResult = '已接通'
          }
        })
      },
      updateStat () {
        this.$router.push({name: 'createRule', query: this.form})
      },
      changeMode (val) {
        Api.enabeldRule(this.form.id, val).then(res => {
          this.form.enabled = val
          if (val) {
            this.$message({
              message: '启用成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '停用成功',
              type: 'success'
            })
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .detail-title {
    /*margin-bottom: 20px;*/
    .upd_btn {
      float: right;
      border: none;
      color: #0299CC;
      i {
        margin-right: 2px;
        vertical-align: text-bottom;
      }
      &:hover {
        background: #ffff;
      }
    }
    .switch-btn {
      float: right;
      margin-left: 30px;
      display: inline-block;
      line-height: 40px;
      margin-right: 3px;
    }
  }
  .form-border {
    border: 1px solid #EFEFEF;
    border-radius: 5px;
    padding: 20px 30px 0 20px;
    overflow: hidden;
  }
</style>
