<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="信息推送规则名称" prop="ruleName">
              <el-input v-model="form.ruleName" placeholder="请输入信息推送规则名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col>
          <el-form-item label="信息推送规则设定"/>
        </el-col>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属公司" prop="companyId">
              <el-select v-model="form.companyId" placeholder="选择/输入所属公司" @change="changeCompany" filterable  style="width: 100%" >
                <el-option
                  v-for="item in companies"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属团队" prop="team">
              <el-select v-model="form.team" placeholder="选择/输入所属团队" filterable style="width: 100%">
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="关联任务">
              <el-select v-model="form.task" placeholder="选择/输入关联任务" filterable style="width: 100%">
                <el-option
                  v-for="item in companies"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效通话时长/秒" prop="duration">
              <el-input v-model="form.duration" placeholder="请输入有效通话时长"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="外呼状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择外呼状态" filterable style="width: 100%">
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下一步行动计划">
              <el-select v-model="form.nextAction" placeholder="请选择下一步行动计划" style="width: 100%">
                <el-option
                  v-for="item in actions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="推送规则模版" prop="remark">
              <el-input type="textarea" :rows="5" v-model="form.remark" placeholder="请输入推送规则模版" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="2"  :offset="3">
            <el-checkbox @change="addInfo" true-label="true ${联系人名称}" false-label="false ${联系人名称}">联系人名称</el-checkbox>
          </el-col>
          <el-col :span="2">
            <el-checkbox @change="addInfo" true-label="true ${销售姓名}" false-label="false ${销售姓名}">销售姓名</el-checkbox>
          </el-col>
          <el-col :span="2">
            <el-checkbox @change="addInfo" true-label="true ${公司名称}" false-label="false ${公司名称}">公司名称</el-checkbox>
          </el-col>
          <el-col :span="2">
            <el-checkbox @change="addInfo" true-label="true ${产品名称}" false-label="false ${产品名称}">产品名称</el-checkbox>
          </el-col>
          <el-col :span="2">
            <el-checkbox @change="addInfo" true-label="true ${企业微信}" false-label="false ${企业微信}">企业微信</el-checkbox>
          </el-col>
          <el-col :span="2">
            <el-checkbox @change="addInfo" true-label="true ${销售微信}" false-label="false ${销售微信}">销售微信</el-checkbox>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="16" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" v-show="updateStatus==='create'" @click="create('form')">提 交</el-button>
        <el-button class="add_btn" v-show="updateStatus==='update'" @click="update('form')">提 交</el-button>
        <el-button class="search_btn" @click="cancel">取 消</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
  import {getToken} from '@/common/js/auth'
  import {addCompanies, getAuthDustries,getCompanies,getTeams, getAuthDustryByType, getOrgSize, putCompanies, uploadLogo} from '@/api/api'

  export default {
    data() {
      return {
        form: {
          remark:''
        },
        updateStatus: '',
        textMap: {
          create: '新建信息推送规则',
          update: '修改信息推送规则',
        },
        rules: {
          ruleName: [
            {required: true, trigger: 'blur', message: '请输入信息推送规则名称'}
          ],
          companyId: [
            {required: true, trigger: 'blur', message: '请选择所属公司'}
          ],
          duration: [
            {required: false, trigger: 'blur', message: '请输入有效通话时长'}
          ],
          status: [
            {required: true, trigger: 'blur', message: '请选择外呼状态'}
          ],
          remark: [
            {required: true, trigger: 'blur', message: '请输入推送规则模版'}
          ],
        },
        companies: [],
        teamList: [],
        status: [
          {
            label : '活跃',
            value : '1'
          },
          {
            label : '停用',
            value : '0'
          }
        ],
        actions: [
          {
            label : '活跃',
            value : '1'
          },
          {
            label : '停用',
            value : '0'
          }
        ]
      }
    },
    created() {
      let obj = this.$route.query
      if (obj && obj.id) {
        this.form = obj
        this.updateStatus = 'update'
      } else {
        this.updateStatus = 'create'
      }
      this.getQuery()
    },
    methods: {
      getQuery () {
        getCompanies().then(res => {
          this.companies = res.data
        })
      },
      changeCompany (value) {
        delete this.form.team
        getTeams({companyId: value}).then(res => {
          this.teamList = res.data
        })
      },
      cancel () {
        this.$router.push({path: '/push'})
      },
      addInfo (value){
        let label = value.split(" ")
        if (label[0] === 'true'){
          this.form.remark = this.form.remark + label[1]
        }else{
          this.form.remark = this.form.remark.replace(label[1],'')
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
