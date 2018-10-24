<template>
  <div class="app-container newtask">
    <div class="detail-title">
      <span class="list-tit">新建任务</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="taskGroup" ref="taskGroup" label-width="100px" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="所属公司" prop="companyId">
              <!--<el-input v-model="form.name" placeholder="选择/输入公司名称"></el-input>-->
              <el-select v-model="taskGroup.companyId"
                         placeholder="选择/输入所属公司"
                         @change="changeCompany"
                         :disabled="isSuperAdmin !== 'true'"
                         filterable>
                <el-option
                  v-for="item in companies"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="关联名单" prop="outboundNameGroupId">
              <!--<el-input v-model="form.empNo" placeholder="选择/输入关联名单"></el-input>-->
              <el-select v-model="taskGroup.outboundNameGroupId" placeholder="选择/输入关联名单" @change="$refs['taskGroup'].validateField('outboundNameGroupId')" >
                <el-option
                  v-for="item in associateList"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="taskGroup.taskName" placeholder="输入任务名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="推广产品" prop="productName">
              <el-input v-model="taskGroup.productName" placeholder="输入产品名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="关联团队" prop="team">
              <!--<el-input v-model="form.associateteam" placeholder="选择/输入关联团队"></el-input>-->
              <el-select v-model="taskGroup.team" placeholder="选择/输入关联团队" @change="$refs['taskGroup'].validateField('team')" >
                <el-option
                  v-for="item in teamList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="分配规则" prop="assignRule">
              <el-radio-group v-model="taskGroup.assignRule">
                <el-radio label="随机平均分配"></el-radio>
                <el-radio label="自定义分配" disabled></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="任务目标" prop="taskTarget">
              <el-input v-model="taskGroup.taskTarget" placeholder="输入任务目标" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="外呼话术" prop="salesTalk">
              <el-input type="textarea" :rows="3" maxlength="1000" v-model="taskGroup.salesTalk" placeholder="输入外呼话术"></el-input>
              <div class="limit" v-if="taskGroup.salesTalk">当前已输入 <span>{{taskGroup.salesTalk.length}}</span> 个字符，您还可以输入 <span>{{1000 - taskGroup.salesTalk.length}}</span> 个字符。</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item prop="taskDate" label="任务时间" >
              <el-date-picker type="daterange"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :default-time="['00:00:00', '23:59:59']"
                              v-model="taskGroup.taskDate"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="define-rule-tit">
          <el-col class="last-item" :span="24">
            <el-form-item label="外呼规则设定"></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="define-rule-box">
          <el-col :span="8">
            <el-form-item label="有效通话时长（秒）" prop="minimumDuration">
              <el-input placeholder="有效通话时长" v-model="taskGroup.minimumDuration" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效任务数（通）：通/人/天" prop="effectiveTasks">
              <el-input placeholder="有效任务数" v-model="taskGroup.effectiveTasks" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="define-rule-box">
          <el-col :span="8">
            <el-form-item label="外呼次数限制" prop="limitedTimes">
              <el-input placeholder="外呼次数限制" v-model="taskGroup.limitedTimes" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外呼频率（间隔）天" prop="interv">
              <el-input placeholder="外呼频率间隔" v-model="taskGroup.interv" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="17" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" @click="create('taskGroup')" :disabled="isCommit">提 交</el-button>
        <el-button class="search_btn" @click="cancel('taskGroup')">取 消</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入有效通话时长'))
      } else {
        if (value == 0){
          callback(new Error('输入数字的不能为0'))
        }else{
          if (!/^[0-9]+$/.test(value)) {
            callback(new Error('请输入数字'))
          } else {
            callback()
          }
        }
      }
    }
    const checkNumber2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入有效任务数'))
      } else {
        if (value == 0){
          callback(new Error('输入数字的不能为0'))
        }else{
          if (!/^[0-9]+$/.test(value)) {
            callback(new Error('请输入数字'))
          } else {
            callback()
          }
        }
      }
    }
    const checkNumber3 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入外呼频率间隔'))
      } else {
        if (value == 0){
          callback(new Error('输入数字的不能为0'))
        }else{
          if (!/^[0-9]+$/.test(value)) {
            callback(new Error('请输入数字'))
          } else {
            callback()
          }
        }
      }
    }
    const checkNumber4 = (rule, value, callback) => {
      if (value) {
        if (value == 0){
          callback(new Error('输入数字的不能为0'))
        } else {
          if (!/^[0-9]+$/.test(value)) {
            callback(new Error('请输入数字'))
          } else {
            callback()
          }
        }
      }else{
        callback()
      }
    }
    return {
      isCommit:false,
      isSuperAdmin:'false',
      taskGroup: {
        taskDate: [],
        team: '',
        outboundNameGroupId: '',
        assignRule: '随机平均分配'
      },
      rules: {
        companyId: [
          { required: true, message: '请选择/输入所属公司', trigger: 'blur' }
        ],
        assignRule: [
          {required: true, message: '请选择分配规则', trigger: 'blur'}
        ],
        taskTarget: [
          {required: true, message: '请输入任务目标', trigger: 'blur'}
        ],
        productName: [
          {required: true, message: '请输入产品名称', trigger: 'blur'}
        ],
        salesTalk: [
          { required: true, message: '请输入外呼话术', trigger: 'blur' }
        ],
        outboundNameGroupId: [
          { required: true, message: '请选择/输入关联名单', trigger: 'blur' }
        ],
        taskName: [
          {required: true, message: '请输入任务名称', trigger: 'blur'}
        ],
        team: [
          {required: true, message: '请选择/输入关联团队', trigger: 'blur'}
        ],
        taskDate: [
          {required: true, message: '请选择日期', trigger: 'blur'}
        ],
        minimumDuration: [
          {required: true, trigger: 'blur', validator: checkNumber}
        ],
        effectiveTasks: [
          {required: true, trigger: 'blur', validator: checkNumber2}
        ],
        nextActionRule: [
          {required: true, message: '请选择下一步行动规则', trigger: 'blur'}
        ],
        interv: [
          {required: true, trigger: 'blur', validator: checkNumber3}
        ],
        limitedTimes: [
          {required: false, trigger: 'blur', validator: checkNumber4}
        ]
      },
      updateStatus: '',
      teamList: [],
      associateList: [],
      listLoading: true,
      tableKey: 0,
      total: null,
      companies: [],
      nextActionList: null,
      textLength: '',
      SurplusLength: ''
    }
  },
  created () {
    this.listLoading = false
    this.nextActionList = this.Utils.nextActionList()
    this.getQuery()
    let companyId = sessionStorage.getItem('companyId')
    if (companyId) {
      this.taskGroup.companyId = parseInt(companyId)
      this.changeCompany()
    }
    this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
  },
  methods: {
    changeCompany () {
      if (this.$refs['taskGroup']){
        this.$refs['taskGroup'].validateField('companyId')
      }
      if (this.taskGroup.team) {
        this.taskGroup.team = ''
      }
      if (this.taskGroup.outboundNameGroupId){
        this.taskGroup.outboundNameGroupId = ''
      }
      this.Api.getTeams({companyId: this.taskGroup.companyId}).then(res => {
        this.teamList = res.data
      })
      this.Api.getNames(this.taskGroup.companyId).then(res => {
        this.associateList = res.data
      })
    },
    getQuery () {
      this.Api.getCompanies().then(res => {
        this.companies = res.data
      })
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.isCommit = true
          this.taskGroup.taskStartDate = this.taskGroup.taskDate[0]
          this.taskGroup.taskEndDate = this.taskGroup.taskDate[1]
          this.taskGroup.interv -= 0
          this.taskGroup.effectiveTasks -= 0
          this.taskGroup.minimumDuration -= 0
          this.Api.createTask(this.taskGroup)
            .then((res) => {
              if (res.data) {
                this.$alert(res.data, '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$message({
                      message: '创建成功',
                      type: 'success'
                    })
                    this.$router.push({path: '/task'})
                  }
                });
              }else{
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.$router.push({path: '/task'})
              }
            }).catch(() => {
              this.isCommit = false
            })
        } else {
          return false
        }
      })
    },
    cancel () {
      this.$router.push({path: '/task'})
    },
  }
}
</script>

<style lang="scss" scoped>
  .el-select {
    display: block;
  }
  .detail-title {
    .upd_btn {
      float: right;
    }
  }
  .form-border {
    border: 1px solid #EFEFEF;
    border-radius: 5px;
    padding: 20px 30px 0 20px;
  }
  .noml{
    .el-form-item {
      display: inline-block;
    }
    .divideline {
      margin: 0 4px;
    }
    .nomargin {
      margin-left: -100px;
    }
  }
  //外呼样式
.limit { position:relative; height: 25px; text-align: right;}
.limit span {color: #ee2a7b; }
</style>
