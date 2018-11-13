<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">推送规则详情</span>
      <span style="float: right;color: #0299cc">{{form.enabled ? '启用' : '停用'}}</span>
      <el-switch
        v-model="form.enabled"
        class="switch-btn"
        @change="changeMode">
      </el-switch>
      <div class="update" @click="updateStat">
        <i class="fa fa-edit"></i><span>修改</span>
      </div>
    </div>
    <div class="com-line"/>
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
              <span>{{form.team?form.team:'-'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联名单:">
              <span>{{form.outboundNameGroupName?form.outboundNameGroupName:'-'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.triggerScene === '外呼后'">
          <el-col :span="8">
            <el-form-item label="有效通话时长（秒）：">
              <span>{{form.duration ?form.lessOrGreater + form.duration:''}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下一步行动计划:">
              <span>{{nextAction?nextAction:'-'}}</span>
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
        this.Api.getMessage(this.form.id).then(res => {
          this.form = res.data
          if(this.form.nextAction === 'CALL_AGAIN'){
            this.nextAction = '再次外呼'
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
        this.Api.enabeldRule(this.form.id, val).then(res => {
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
