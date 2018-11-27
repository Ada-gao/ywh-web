<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">{{isEdit?'编辑任务':'新建任务'}}</span>
    </div>
    <div class="com-line"/>
    <el-form :model="taskGroup" ref="taskGroup" label-width="100px" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form-item label="所属公司" prop="companyId">
            <el-select v-model="taskGroup.companyId"
                       placeholder="选择/输入所属公司"
                       @change="changeCompany"
                       :disabled="isSuperAdmin !== 'true' || isEdit"
                       filterable>
              <el-option v-for="item in companies" :key="item.id" :label="item.companyName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form-item label="关联名单" prop="outboundNameGroupId">
            <el-select :disabled="isEdit" v-model="taskGroup.outboundNameGroupId" filterable placeholder="选择/输入关联名单" @change="$refs['taskGroup'].validateField('outboundNameGroupId')">
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
            <el-input :disabled="isEdit" v-model="taskGroup.taskName" placeholder="输入任务名称" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form-item label="推广产品" prop="productName">
            <el-input :disabled="isEdit" v-model="taskGroup.productName" placeholder="输入产品名称" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form-item label="关联销售" prop="salesId">
            <el-select :disabled="isEdit" v-model="taskGroup.salesId" multiple clearable filterable placeholder="选择/输入关联销售" @change="$refs['taskGroup'].validateField('salesId')">
              <el-option
                v-for="item in saleList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
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
            <el-input  :disabled="isEdit" v-model="taskGroup.taskTarget" placeholder="输入任务目标" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form-item label="外呼话术" prop="salesTalk">
            <el-input type="textarea" :rows="3" maxlength="1000" v-model="taskGroup.salesTalk"
                      placeholder="输入外呼话术"></el-input>
            <div class="limit" v-if="taskGroup.salesTalk">当前已输入 <span>{{taskGroup.salesTalk.length}}</span> 个字符，您还可以输入
              <span>{{1000 - taskGroup.salesTalk.length}}</span> 个字符。
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form-item prop="taskDate" label="任务时间">
            <el-date-picker type="daterange"
                            style="width: 100%"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                            @blur="getSTime"
                            v-model="taskGroup.taskDate"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="开启录音">
            <el-checkbox v-model="taskGroup.record"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="外呼规则设定" style="font-weight: bold"></el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form-item label="外呼次数限制" prop="limitedTimes">
            <el-input placeholder="外呼次数限制" v-model="taskGroup.limitedTimes" maxlength="8"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-col :span="17" style="text-align: center">
      <el-button class="add_btn" @click="create('taskGroup')" :disabled="isCommit">提 交</el-button>
      <el-button class="search_btn" @click="cancel('taskGroup')">取 消</el-button>
    </el-col>
  </div>
</template>
<script>
  export default {
    data() {
      const checkNumber4 = (rule, value, callback) => {
        if (value) {
          if (value == 0) {
            callback(new Error('输入数字的不能为0'))
          } else {
            if (!/^[0-9]+$/.test(value)) {
              callback(new Error('请输入数字'))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }
      return {
        isCommit: false,
        isSuperAdmin: 'false',
        taskGroup: {
          taskDate: [],
          salesId: [],
          assignRule: '随机平均分配'
        },
        rules: {
          companyId: [
            {required: true, message: '请选择/输入所属公司', trigger: 'blur'}
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
            {required: true, message: '请输入外呼话术', trigger: 'blur'}
          ],
          outboundNameGroupId: [
            {required: true, message: '请选择/输入关联名单', trigger: 'blur'}
          ],
          taskName: [
            {required: true, message: '请输入任务名称', trigger: 'blur'}
          ],
          salesId: [
            {required: true, message: '请选择/输入关联销售', trigger: 'blur'}
          ],
          taskDate: [
            {required: true, message: '请选择日期', trigger: 'blur'}
          ],
          nextActionRule: [
            {required: true, message: '请选择下一步行动规则', trigger: 'blur'}
          ],
          limitedTimes: [
            {required: false, trigger: 'blur', validator: checkNumber4}
          ]
        },
        saleList: '',
        associateList: [],
        companies: [],
        textLength: '',
        isEdit:false,
      }
    },
    created() {
      this.Api.getCompanies().then(res => {
        this.companies = res.data
      })
      let taskGroup = this.$route.query.item
      if (taskGroup){
        this.isEdit = true
        this.taskGroup = taskGroup
        this.taskGroup.companyId = parseInt(taskGroup.companyId)
        this.taskGroup.taskDate = new Array(new Date(taskGroup.taskStartDate),new Date(taskGroup.taskEndDate))
        let salesId = taskGroup.salesId
        this.Api.getAllSaleUsers(this.taskGroup.companyId).then(res => {
          this.saleList = res.data
          this.taskGroup.salesId = []
          salesId.toString().split(',').forEach((item,index)=>{
            this.taskGroup.salesId[index] = parseInt(item)
          })
        })
        this.Api.getNames(this.taskGroup.companyId).then(res => {
          this.associateList = res.data
          this.taskGroup.outboundNameGroupId = parseInt(taskGroup.outboundNameGroupId)
        })
      } else{
        let companyId = sessionStorage.getItem('companyId')
        if (companyId) {
          this.taskGroup.companyId = parseInt(companyId)
          this.changeCompany()
        }
      }
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    },
    methods: {
      getSTime(){
        this.taskGroup = JSON.parse(JSON.stringify(this.taskGroup))
      },
      changeCompany() {
        if (this.$refs['taskGroup']) {
          this.$refs['taskGroup'].validateField('companyId')
        }
        if (this.taskGroup.salesId){
          this.taskGroup.salesId = []
        }
        if (this.taskGroup.outboundNameGroupId){
          this.taskGroup.outboundNameGroupId = ''
        }
        if (this.taskGroup.companyId) {
          this.Api.getAllSaleUsers(this.taskGroup.companyId).then(res => {
            this.saleList = res.data
          })
          this.Api.getNames(this.taskGroup.companyId).then(res => {
            this.associateList = res.data
          })
        }
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.isCommit = true
            let taskGroup = JSON.parse(JSON.stringify(this.taskGroup))
            taskGroup.taskStartDate = taskGroup.taskDate[0]
            taskGroup.taskEndDate = taskGroup.taskDate[1]
            taskGroup.salesId = taskGroup.salesId.join(",")
            if (this.isEdit){
              this.Api.updateGroup(taskGroup.id,taskGroup)
                .then((res) => {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/task'})
                }).catch(() => {
                this.isCommit = false
              })
            } else{
              this.Api.createTask(taskGroup)
                .then((res) => {
                  this.$message({
                    message: '创建成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/task'})
                }).catch(() => {
                this.isCommit = false
              })
            }
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.push({path: '/task'})
      },
    }
  }
</script>
