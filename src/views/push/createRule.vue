<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">{{textMap[updateStatus]}}</span>
    </div>
    <div class="com-line"/>
    <el-form :model="form" :rules="rules" ref="form" label-width="150px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="信息推送规则名称" prop="ruleName">
            <el-input v-model="form.ruleName" placeholder="请输入信息推送规则名称" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col>
        <el-form-item label="信息推送规则设定"/>
      </el-col>
      <el-row>
        <el-col :span="7">
          <el-form-item label="所属公司" prop="companyId">
            <el-select v-model="form.companyId" placeholder="选择/输入所属公司" @change="changeCompany" filterable
                       style="width: 100%" :disabled="isSuperAdmin !== 'true'">
              <el-option
                v-for="item in companies"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="所属团队" prop="team">
            <el-select v-model="form.team" placeholder="选择/输入所属团队" filterable clearable style="width: 100%">
              <el-option
                v-for="item in teamList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="关联名单">
            <el-select v-model="form.outboundNameGroupId" placeholder="选择/输入关联名单" filterable clearable
                       style="width: 100%">
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
      <el-form-item label="触发场景">
        <el-radio-group v-model="form.triggerScene" @change="changeMode">
          <el-radio label="外呼后"></el-radio>
          <el-radio label="外呼前"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row v-if="form.triggerScene === '外呼后'">
<!--        <el-col :span="7">
          <el-form-item label="有效通话时长/秒" prop="duration">
            <el-select v-model="form.lessOrGreater" style="width: 26%">
              <el-option
                v-for="item in times"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-input v-model="form.duration" placeholder="请输入时长" style="width: 72%;" maxlength="8"/>
          </el-form-item>
        </el-col>-->
        <el-col :span="7">
          <el-form-item label="下一步行动计划">
            <el-select v-model="form.nextAction" placeholder="请选择下一步行动计划" clearable style="width: 100%">
              <el-option v-for="item in actions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="外呼状态" prop="lastCallResult">
            <el-select v-model="form.lastCallResult" placeholder="请选择外呼状态" clearable style="width: 100%"
                       @change="changeStatus">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21">
          <el-form-item label="推送规则模版" prop="ruleTemplate">
            <el-input type="textarea" :rows="5" v-model="form.ruleTemplate" placeholder="请输入推送规则模版"
                      maxlength="70"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="21">
        <el-col :span="2" :offset="3">
          <el-checkbox @change="addInfo" true-label="true ${联系人名称}" false-label="false ${联系人名称}">联系人名称</el-checkbox>
        </el-col>
        <el-col :span="2">
          <el-checkbox @change="addInfo" true-label="true ${销售姓名}" false-label="false ${销售姓名}">销售姓名</el-checkbox>
        </el-col>
        <el-col :span="2">
          <el-checkbox @change="addInfo" true-label="true ${公司名称}" false-label="false ${公司名称}">公司名称</el-checkbox>
        </el-col>
        <el-col :span="2">
          <el-checkbox @change="addInfo" true-label="true ${企业微信}" false-label="false ${企业微信}">企业微信</el-checkbox>
        </el-col>
        <el-col :span="2">
          <el-checkbox @change="addInfo" true-label="true ${销售微信}" false-label="false ${销售微信}">销售微信</el-checkbox>
        </el-col>
      </el-row>
    </el-form>
    <el-col :span="21" style="text-align: center">
      <el-button class="add_btn" @click="commit" :disabled="isCommit">提 交</el-button>
      <el-button class="search_btn" @click="cancel">取 消</el-button>
    </el-col>
  </div>
</template>

<script>
  export default {
    data() {
/*      const checkNumber = (rule, value, callback) => {
        if (!value) {
          callback()
        } else {
          if (!/^[0-9]+$/.test(value)) {
            callback(new Error('请输入数字'))
          } else {
            callback()
          }
        }
      }*/
      const checkTemplate = (rule, value, callback) => {
        if (!value) {
          callback('请输入推送规则模版')
        } else {
          if (value.length > 70) {
            callback(new Error('不能超过70个字'))
          } else {
            callback()
          }
        }
      }
      return {
        isCommit: false,
        form: {
          lessOrGreater: '≥',
          triggerScene: '外呼后',
          ruleTemplate: ''
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
   /*       duration: [
            {required: false, trigger: 'blur', validator: checkNumber}
          ],*/
          lastCallResult: [
            {required: true, trigger: 'blur', message: '请选择外呼状态'}
          ],
          ruleTemplate: [
            {required: true, trigger: 'blur', validator: checkTemplate}
          ],
        },
        companies: [],
        teamList: [],
        associateList: [],
        times: [
          '≥', '<'
        ],
        status: [
          // {
          //   label: '未外呼',
          //   value: 'NOT_CALL'
          // },
          {
            label: '空号',
            value: 'NOT_EXIST'
          },
          {
            label: '未接通',
            value: 'UNCONNECTED'
          },
          {
            label: '已接通',
            value: 'CONNECTED'
          }
        ],
        actions: [
          {
            label: '再次外呼',
            value: 'CALL_AGAIN'
          },
          {
            label: '放弃外呼',
            value: 'GIVE_UP'
          },
          {
            label: '继续跟进',
            value: 'FOLLOW'
          }
        ],
        isSuperAdmin: 'false',
      }
    },
    created() {
      let obj = this.$route.query
      if (obj && obj.id) {
        this.form = obj
        this.updateStatus = 'update'
        if (this.form.triggerScene === '外呼前') {
          delete this.form.lastCallResult
        }
        this.getList(obj.companyId)
      } else {
        this.updateStatus = 'create'
      }
      this.getQuery()
      let companyId = sessionStorage.getItem('companyId')
      if (companyId) {
        this.form.companyId = parseInt(companyId)
        this.getList()
      }
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    },
    methods: {
      getQuery() {
        this.Api.getCompanies().then(res => {
          this.companies = res.data
        })
      },
      changeMode() {
        if (this.form.triggerScene != '外呼后') {
          delete this.form.duration
          delete this.form.nextAction
          delete this.form.lastCallResult
        }
      },
      changeCompany() {
        this.$refs['form'].validateField('companyId')
        delete this.form.team
        delete this.form.outboundNameGroupId
        this.getList()
      },
      changeStatus() {
        this.$refs['form'].validateField('lastCallResult')
      },
      getList() {
        this.Api.getTeams({companyId: this.form.companyId}).then(res => {
          this.teamList = res.data
        })
        this.Api.getNames(this.form.companyId).then(res => {
          this.associateList = res.data
        })
      },
      commit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (!this.form.nextAction) {
              delete this.form.nextAction
            }
            if (this.updateStatus === 'update') {
              if (this.form.createTime) {
                delete this.form.createTime
              }
              if (this.form.status === '待审核') {
                this.form.status = '0'
              } else if (this.form.status === '审核失败') {
                this.form.status = '1'
              } else if (this.form.status === '生效') {
                this.form.status = '2'
              }
              this.Api.putMessage(this.form.id, this.form)
                .then((res) => {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/push/rule'})
                })
            } else {
              this.isCommit = true
              this.Api.message(this.form)
                .then((res) => {
                  this.$message({
                    message: '创建成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/push/rule'})
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
        this.$router.push({path: '/push/rule'})
      },
      addInfo(value) {
        let label = value.split(" ")
        if (label[0] === 'true') {
          this.form.ruleTemplate = this.form.ruleTemplate + label[1]
        } else {
          this.form.ruleTemplate = this.form.ruleTemplate.replace(label[1], '')
        }
      }
    }
  }
</script>
