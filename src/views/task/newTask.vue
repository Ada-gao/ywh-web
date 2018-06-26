<template>
  <div class="app-container newtask">
    <div class="detail-title">
      <span class="tit-text">新建任务</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="taskGroup" ref="taskGroup" label-width="100px" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="所属公司" prop="companyId" required>
              <!--<el-input v-model="form.name" placeholder="选择/输入公司名称"></el-input>-->
              <el-select v-model="taskGroup.companyId"
                         placeholder="选择/输入所属公司"
                         @change="changeCompany"
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
          <el-col :span="13">
            <el-form-item label="关联名单" prop="outboundNameGroupId" >
              <!--<el-input v-model="form.empNo" placeholder="选择/输入关联名单"></el-input>-->
              <el-select v-model="taskGroup.outboundNameGroupId" placeholder="选择/输入关联名单" filterable>
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
          <el-col :span="13">
            <el-form-item label="任务名称" prop="taskName" required>
              <el-input v-model="taskGroup.taskName" placeholder="输入任务名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="推广产品">
              <el-input v-model="taskGroup.productName" placeholder="输入产品名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="关联团队" prop="team" required>
              <!--<el-input v-model="form.associateteam" placeholder="选择/输入关联团队"></el-input>-->
              <el-select v-model="taskGroup.team" placeholder="选择/输入关联团队" filterable>
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
          <el-col :span="13">
            <el-form-item label="分配规则" prop="assignRule" required>
              <el-radio-group v-model="taskGroup.assignRule">
                <el-radio label="随机平均分配"></el-radio>
                <el-radio label="自定义分配"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="任务目标" prop="taskTarget" required>
              <el-input v-model="taskGroup.taskTarget" placeholder="输入任务目标"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="外呼话术" prop="salesTalk" required>
              <el-input type="textarea" v-model="taskGroup.salesTalk" placeholder="输入外呼话术"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" class="noml">
            <el-form-item prop="taskStartDate" label="任务事件" required>
              <el-date-picker type="date" placeholder="选择日期" v-model="taskGroup.taskStartDate"></el-date-picker>
            </el-form-item>
            <!--<span class="divideline">-</span>-->
            <!--<el-form-item prop="taskEndDate" class="nomargin">-->
              <!--<el-date-picker type="date" placeholder="选择日期" v-model="taskGroup.taskEndDate"></el-date-picker>-->
            <!--</el-form-item>-->
          </el-col>
          <el-col class="line" style="width: 10px">-</el-col>
          <el-col :span="6" class="noml1">
            <el-form-item prop="taskEndDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="taskGroup.taskEndDate"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="define-rule-tit">
          <el-col class="last-item" :span="24">
            <el-form-item label="外呼规则设定" required></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="define-rule-box">
          <el-col :span="7">
            <el-form-item label="有效通话时长" prop="minimumDuration">
              <el-input placeholder="有效通话时长" v-model="taskGroup.minimumDuration"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="有效任务数（通）：通/人" prop="effectiveTasks">
              <el-input placeholder="有效任务数" v-model="taskGroup.effectiveTasks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="define-rule-box">
          <el-col :span="7">
            <el-form-item label="下一步行动规则" prop="nextAction">
              <el-select v-model="taskGroup.nextAction" placeholder="下一步行动规则">
                <el-option
                  v-for="item in nextActionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="外呼频率（间隔）天" prop="interv">
              <el-input placeholder="外呼频率间隔" v-model="taskGroup.interv"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-form-item>-->
          <!--<el-button class="search_btn" @click="cancel('taskGroup')">取消</el-button>-->
          <!--<el-button class="add_btn" @click="create('taskGroup')">提交</el-button>-->
        <!--</el-form-item>-->
      </el-form>
      <el-col :span="11" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" @click="create('taskGroup')">提 交</el-button>
        <el-button class="search_btn" @click="cancel('taskGroup')">取 消</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/common/js/auth'
import {createTask, getCompanies, getTeams, getAssociateList} from '@/api/api'

export default {
  data () {
    return {
      taskGroup: {
        team: '',
        outboundNameGroupId: null
      },
      rules: {
        companyId: [
          { required: true, message: '请选择/输入所属公司', trigger: 'change' }
        ],
        assignRule: [
          {required: true, message: '请选择分配规则', trigger: 'change'}
        ],
        taskTarget: [
          {required: true, message: '请输入任务目标', trigger: 'blur'}
        ],
        salesTalk: [
          { required: true, message: '请输入外呼话术', trigger: 'blur' }
        ],
        // outboundNameGroupId: [
        //   { required: true, message: '请选择/输入关联名单', trigger: 'change' }
        // ],
        taskName: [
          {required: true, message: '请输入任务名称', trigger: 'blur'}
        ],
        team: [
          {required: true, message: '请选择/输入关联团队', trigger: 'change'}
        ],
        taskStartDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        taskEndDate: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        minimumDuration: [
          {required: true, message: '请输入有效通话时长', trigger: 'blur'}
        ],
        effectiveTasks: [
          {required: true, message: '请输入有效任务数', trigger: 'blur'}
        ],
        nextAction: [
          {required: true, message: '请选择下一步行动规则', trigger: 'change'}
        ],
        interv: [
          {required: true, message: '请输入外呼频率间隔', trigger: 'blur'}
        ]
      },
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      selectedOptions: [],
      fileList: [],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      updateStatus: '',
      teamList: [],
      associateList: [],
      listLoading: true,
      tableKey: 0,
      total: null,
      companies: [],
      nextActionList: [
        {
          value: 'CALL_AGAIN',
          label: 'CALL_AGAIN'
        },
        {
          value: 'GIVE_UP',
          label: 'GIVE_UP'
        },
        {
          value: 'FOLLOW',
          label: 'FOLLOW'
        }
      ]
    }
  },
  created () {
    this.listLoading = false
    this.getQuery()
  },
  methods: {
    changeCompany (value) {
      this.taskGroup.team = ''
      this.taskGroup.outboundNameGroupId = null
      getTeams(value).then(res => {
        this.teamList = res.data
      })
      getAssociateList(value).then(res => {
        this.associateList = res.data
      })
    },
    getQuery () {
      getCompanies().then(res => {
        this.companies = res.data
      })
    },
    create (formName) {
      console.log('提交了')
      console.log(this.taskGroup)
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          console.log('验证通过。。')
          this.taskGroup.interv -= 0
          this.taskGroup.effectiveTasks -= 0
          this.taskGroup.minimumDuration -= 0
          createTask(this.taskGroup)
            .then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.$router.push({path: '/task'})
            })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.$router.push({path: '/task'})
    },
    handleChange (value) {
      console.log(value)
    },
    handleSuccess (fileList) {
      console.log(fileList)
    },
    handleSizeChange (z) {
      this.listQuery.limit = z
      // this.getList()
    },
    handleCurrentChange () {
      // this.listQuery.page
      // this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-select {
    display: block;
  }
  .detail-title {
    margin-top: 30px;
    margin-bottom: 20px;
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
</style>
