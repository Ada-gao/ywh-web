<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">账户充值</span>
    </div>
    <div class="com-line"/>
      <el-form :model="form" :rules="rules" ref="form" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="所属公司" prop="companyId">
              <el-select v-model="form.companyId" placeholder="请选择所属公司" style="width: 100%" @change="changeCompany" filterable :disabled="banUpdate">
                <el-option
                  v-for="item in companies"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="所属账户" prop="accountId">
              <el-select v-model="form.accountId" placeholder="请选择所属账户" style="width: 100%" filterable @change="$refs['form'].validateField('accountId')">
                <el-option
                  v-for="item in accounts"
                  :key="item.accountId"
                  :label="item.accountName"
                  :value="item.accountId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="充值金额(元)" prop="money">
              <el-input v-model="form.money" placeholder="请输入充值金额" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="确认金额(元)" prop="confirmMoney">
              <el-input v-model="form.confirmMoney" placeholder="请再次输入充值金额" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="备注">
              <el-input type="textarea" :rows="3" v-model="form.remark" placeholder="请输入备注内容"  maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="20" style="text-align: center">
        <el-button class="add_btn" @click="create('form')" :disabled="isCommit">提交</el-button>
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
      </el-col>
    </div>
</template>
<script>
  export default {
    data() {
      const checkNumber = (rule, value, callback) => {
        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (!value) {
          return callback(new Error('请输入充值金额'))
        } else {
          if (value == 0){
            callback(new Error('充值金额必须大于0'))
          }else{
            if (!(reg.test(value))) {
              callback(new Error('请输入有效金额'))
            } else {
              callback()
            }
          }
        }
      }
      const checkNumber2 = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入确认充值金额'))
        } else {
          if (this.form.money * 100 == this.form.confirmMoney * 100) {
            callback()
          } else {
            callback(new Error('二次输入的充值金额不一致'))

          }
        }
      }
      return {
        isCommit:false,
        rules: {
          companyId: [
            {required: true, trigger: 'blur', message: '请选择所属公司'}
          ],
          accountId: [
            {required: true, trigger: 'blur', message: '请选择所属账户'}
          ],
          money: [
            {required: true, trigger: 'blur', validator: checkNumber}
          ],
          confirmMoney: [
            {required: true, trigger: 'blur',validator: checkNumber2}
          ]
        },
        form: {},
        companies:[],
        accounts:[],
        banUpdate:false
      }
    },
    created() {
      if (this.$route.query.id) {
        this.form.companyId = this.$route.query.id
        this.banUpdate = true
      }
      this.getQuery()
    },
    methods: {
      getQuery() {
        this.Api.getCompanies().then(res => {
          this.companies = res.data
          if (this.$route.query.id) {
            this.changeCompany()
          }
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.isCommit = true
            this.Api.recharge(this.form)
              .then((res) => {
                this.$message({
                  message: '充值成功',
                  type: 'success'
                })
                this.$router.push({path: '/system'})
              }).catch(() => {
                this.isCommit = false
              })
          } else {
            return false
          }
        })
      },
      cancel() {
        window.history.go(-1)
      },
      changeCompany () {
        this.$refs['form'].validateField('companyId')
        delete this.form.accountId
        this.Api.getAccountByCompanyId(this.form.companyId).then(res => {
          this.accounts = res.data
        })
      },
    }
  }
</script>
