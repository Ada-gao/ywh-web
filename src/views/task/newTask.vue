<template>
  <div class="app-container newtask">
    <div class="detail-title">
      <span class="tit-text">新建任务</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="所属公司" prop="name" required>
              <!--<el-input v-model="form.name" placeholder="选择/输入公司名称"></el-input>-->
              <el-select v-model="ruleForm.name" placeholder="选择/输入所属公司">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="关联名单" prop="associatelist" required>
              <!--<el-input v-model="form.empNo" placeholder="选择/输入关联名单"></el-input>-->
              <el-select v-model="ruleForm.associatelist" placeholder="选择/输入关联名单">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="任务名称" prop="taskname" required>
              <el-input v-model="ruleForm.taskname" placeholder="输入任务名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="推广产品">
              <el-input v-model="ruleForm.productName" placeholder="输入产品名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="关联团队" prop="associateteam" required>
              <!--<el-input v-model="form.associateteam" placeholder="选择/输入关联团队"></el-input>-->
              <el-select v-model="ruleForm.associateteam" placeholder="选择/输入关联团队">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="分配规则" prop="resource" required>
              <el-radio-group v-model="ruleForm.resource">
                <el-radio label="随机平均分配"></el-radio>
                <el-radio label="自定义分配"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="任务目标" prop="taskTarget" required>
              <el-input v-model="ruleForm.taskTarget" placeholder="输入任务目标"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="外呼话术" prop="calloutdesc" required>
              <el-input type="textarea" v-model="ruleForm.calloutdesc" placeholder="输入外呼话术"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" class="noml">
            <el-form-item prop="taskStartDate" label="任务事件" required>
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.taskStartDate"></el-date-picker>
            </el-form-item>
            <!--<span class="divideline">-</span>-->
            <!--<el-form-item prop="taskEndDate" class="nomargin">-->
              <!--<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.taskEndDate"></el-date-picker>-->
            <!--</el-form-item>-->
          </el-col>
          <el-col class="line" style="width: 10px">-</el-col>
          <el-col :span="6" class="noml1">
            <el-form-item prop="taskEndDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.taskEndDate"></el-date-picker>
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
            <el-form-item label="有效通话时长" prop="callTime">
              <el-input placeholder="有效通话时长" v-model="ruleForm.callTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="有效任务数（通）：通/人" prop="callNum">
              <el-input placeholder="有效任务数" v-model="ruleForm.callNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="define-rule-box">
          <el-col :span="7">
            <el-form-item label="下一步行动规则" prop="assignRule">
              <el-select v-model="ruleForm.assignRule" placeholder="下一步行动规则">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="外呼频率（间隔）天" prop="callFrequency">
              <el-input placeholder="外呼频率间隔" v-model="ruleForm.callFrequency"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-form-item>-->
          <!--<el-button class="search_btn" @click="cancel('ruleForm')">取消</el-button>-->
          <!--<el-button class="add_btn" @click="create('ruleForm')">提交</el-button>-->
        <!--</el-form-item>-->
      </el-form>
      <el-col :span="11" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" @click="create('ruleForm')">提 交</el-button>
        <el-button class="search_btn" @click="cancel('ruleForm')">取 消</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/common/js/auth'
import {createTask} from '@/api/api'

export default {
  data () {
    return {
      ruleForm: {},
      rules: {
        name: [
          { required: true, message: '请选择/输入所属公司', trigger: 'change' }
        ],
        associatelist: [
          { required: true, message: '请选择/输入关联名单', trigger: 'change' }
        ],
        taskname: [
          {required: true, message: '请输入任务名称', trigger: 'blur'}
        ],
        associateteam: [
          {required: true, message: '请选择/输入关联团队', trigger: 'change'}
        ],
        resource: [
          {required: true, message: '请选择分配规则', trigger: 'change'}
        ],
        taskTarget: [
          {required: true, message: '请输入任务目标', trigger: 'blur'}
        ],
        taskStartDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        taskEndDate: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        calloutdesc: [
          { required: true, message: '请输入外呼话术', trigger: 'blur' }
        ],
        callTime: [
          {required: true, message: '请输入有效通话时长', trigger: 'blur'}
        ],
        callNum: [
          {required: true, message: '请输入有效任务数', trigger: 'blur'}
        ],
        assignRule: [
          {required: true, message: '请选择下一步行动规则', trigger: 'change'}
        ],
        callFrequency: [
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
      list: [],
      listLoading: true,
      tableKey: 0,
      total: null,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created () {
    this.listLoading = false
  },
  methods: {
    create (formName) {
      console.log('提交了')
      console.log(this.ruleForm)
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          console.log('验证通过。。')
          createTask(this.ruleForm)
            .then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
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
