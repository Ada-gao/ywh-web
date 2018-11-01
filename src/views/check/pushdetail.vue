<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">推送规则详情</span>
      <el-button @click="handleCheck(false)" v-show="obj.check">
        <i class="iconfont icon-jujue"/><span>不通过</span>
      </el-button>
      <el-button @click="handleCheck(true)" v-show="obj.check">
        <i class="iconfont icon-tongguo"/><span>通过</span>
      </el-button>
    </div>
    <div class="com-line"/>
      <el-form :model="form" label-width="160px">
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
              <span v-show="form.duration">{{form.lessOrGreater}}{{form.duration}}</span>
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
    <el-dialog title="审核通过" :visible.sync="agreeDialog" width="30%">
      <el-form :model="checkForm" :rules="checkRules" ref="checkForm" label-width="100px">
        <el-form-item label="确定审核通过吗？请输入短信模版！" class="txt" label-width="260px"/>
        <el-form-item label="模版Code" prop="content" class="txt">
          <el-input v-model="checkForm.content" placeholder="请输入模版Code" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button class="search_btn" @click="agreeDialog = false">取 消</el-button>
        <el-button class="add_btn" @click="commit('2')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核不通过" :visible.sync="refuseDialog" width="30%">
      <el-form :model="checkForm" :rules="checkRules" ref="checkForm" label-width="80px">
        <el-form-item label="确定审核不通过吗？请输入驳回原因！" class="txt" label-width="260px"/>
        <el-form-item label="驳回原因" prop="content" class="txt">
          <el-input  type="textarea" v-model="checkForm.content" :rows="3"  placeholder="请输入驳回原因" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button class="search_btn" @click="refuseDialog = false">取 消</el-button>
        <el-button class="add_btn" @click="commit('1')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        obj: {},
        form: {
        },
        nextAction:'',
        lastCallResult:'',
        agreeDialog:false,
        refuseDialog:false,
        checkForm:{},
        checkRules: {
          content: [
            {required: true, trigger: 'blur', message: '请输入内容'}
          ],
        },
      }
    },
    created () {
      this.obj = this.$route.query
      this.getQuery()
    },
    methods: {
      getQuery () {
        this.Api.messageDetail(this.obj.productId).then(res => {
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
      handleCheck (obj) {
        if (this.$refs['checkForm'] !== undefined) {
          this.$refs['checkForm'].resetFields()
        }
        if (obj){
          this.agreeDialog = true
        } else{
          this.refuseDialog = true
        }
      },
      commit (status) {
        this.$refs['checkForm'].validate(valid => {
          if (valid) {
            this.Api.putReview(this.obj.id,status,this.checkForm.content)
              .then((res) => {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$router.push({path: '/check'})
              })
          } else {
            return false
          }
        })
      },
    }
  }
</script>
