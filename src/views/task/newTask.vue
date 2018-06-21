<template>
  <div class="app-container newtask">
    <div class="detail-title">
      <span class="tit-text">新建任务</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="11">
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
          <el-col :span="11">
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
          <el-col :span="11">
            <el-form-item label="任务名称" prop="taskname" required>
              <el-input v-model="ruleForm.taskname" placeholder="输入任务名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="推广产品" prop="product">
              <el-input v-model="ruleForm.product" placeholder="输入产品名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
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
          <el-col :span="11">
            <el-form-item label="分配规则" prop="resource" required>
              <el-radio-group v-model="ruleForm.resource">
                <el-radio label="随机平均分配"></el-radio>
                <el-radio label="自定义分配"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="任务目标" prop="tasktarget" required>
              <el-input v-model="ruleForm.tasktarget" placeholder="输入任务目标"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="外呼话术" prop="calloutdesc" required>
              <el-input type="textarea" v-model="ruleForm.calloutdesc" placeholder="输入外呼话术"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class="noml">
            <el-form-item prop="date1" label="任务事件" required>
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1"></el-date-picker>
            </el-form-item>
            <span class="divideline">-</span>
            <el-form-item prop="date2" class="nomargin">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date2"></el-date-picker>
            </el-form-item>
          </el-col>
          <!--<el-col class="line" style="width: 10px">-</el-col>-->
          <!--<el-col :span="6" class="noml1">-->
            <!--<el-form-item prop="date2">-->
              <!--<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date2"></el-date-picker>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
        <el-row :gutter="20">
          <el-col class="last-item" :span="24">
            <el-form-item label="外呼规则设定" prop="calloutRule" required>
              有效通话时长
              <el-input placeholder="有效通话时长" v-model="ruleForm.callTime" style="width: 30%"></el-input>
              有效任务数（通）：通/人
              <el-input placeholder="有效任务数" v-model="ruleForm.callNum" style="width: 30%"></el-input>
              下一步行动规则
              <!--<el-input placeholder="下一步行动规则" v-model="ruleForm.callRule"></el-input>-->
              <el-select v-model="ruleForm.callRule" placeholder="下一步行动规则" style="width: 30%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              外呼频率（间隔）天
              <el-input placeholder="外呼频率间隔" v-model="ruleForm.callFrequency" style="width: 30%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <!--<el-col :span="11" slot="footer" class="dialog-footer" style="text-align: center">-->
        <!--<el-button class="search_btn" @click="cancel('form')">取 消</el-button>-->
        <!--<el-button class="add_btn" @click="create('form')">提 交</el-button>-->
      <!--</el-col>-->
    </div>
  </div>
</template>

<script>
import { getToken } from '@/common/js/auth'

export default {
  data () {
    return {
      ruleForm: {
        name: '',
        associatelist: '',
        taskname: '',
        product: '',
        associateteam: '',
        tasktarget: '',
        date1: '',
        date2: '',
        resource: '',
        calloutdesc: '',
        callTime: '',
        callNum: '',
        callRule: '',
        callFrequency: ''
      },
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
        tasktarget: [
          {required: true, message: '请输入任务目标', trigger: 'blur'}
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        calloutdesc: [
          { required: true, message: '请输入外呼话术', trigger: 'blur' }
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    create (formName) {
      console.log('提交了')
      this.updateStatus = 'view'
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
      })

      const set = this.$refs
      this.form.positionId = this.form.positionName
      this.form.idType = this.IDType
      this.form.marriageStatus = this.maritalStatus
      set[formName].validate(valid => {
        if (valid) {
          // addObj(this.form)
          //   .then(() => {
          //     this.dialogFormVisible = false
          //     this.getList()
          //     this.$notify({
          //       title: '成功',
          //       message: '创建成功',
          //       type: 'success',
          //       duration: 2000
          //     })
          //   })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.$router.push({path: '/company'})
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
