<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-radio-group v-model="radio" @change="changeRadio">
        <el-radio-button label="账户信息"></el-radio-button>
        <el-radio-button label="公司信息"></el-radio-button>
        <el-radio-button label="消费记录"></el-radio-button>
        <el-radio-button label="充值情况"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-show="radio==='账户信息'">
      <div class="detail-title">
        <span class="list-tit">{{radio}}</span>
        <el-button class="upd_btn" @click="modifyStat">
          <i class="fa fa-edit"
             style="font-size: 22px;margin-right: 5px;vertical-align: middle;"></i>
          <i style="font-style: normal;">修改</i>
        </el-button>
      </div>
      <div class="margin-line"></div>
      <div class="read-detail">
        <el-form :model="account" class="form-border">
          <el-row>
            <el-col :span="8"><span class="detail-label">账户ID:</span><span class="detail-value">{{account.accountCode}}</span></el-col>
            <el-col :span="8"><span class="detail-label">账户名称:</span><span class="detail-value">{{account.accountName}}</span></el-col>
            <el-col :span="8"><span class="detail-label">账户类型:</span><span class="detail-value">{{account.accountType}}</span></el-col>
            <el-col :span="8"><span class="detail-label">Account ID:</span><span class="detail-value">{{account.accountId}}</span></el-col>
            <el-col :span="8"><span class="detail-label">账户到期时间:</span><span class="detail-value">{{account.expireDate}}</span></el-col>
            <el-col :span="8"><span class="detail-label">账户状态:</span><span class="detail-value">{{account.accountStatus}}</span></el-col>
            <el-col :span="8"><span class="detail-label">key:</span><span class="detail-value">{{account.accountKey}}</span></el-col>
            <el-col :span="8"><span class="detail-label">余额提醒:</span><span class="detail-value">{{account.balanceThreshold}}</span></el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-show="radio==='公司信息'">
      <div class="detail-title">
        <span class="list-tit">{{radio}}</span>
        <el-button class="upd_btn" @click="modifyStat">
          <i class="fa fa-edit"
             style="font-size: 22px;margin-right: 5px;vertical-align: middle;"></i>
          <i style="font-style: normal;">修改</i>
        </el-button>
      </div>
      <div class="margin-line"></div>
      <div class="read-detail">
        <el-form :model="form" class="form-border">
        <el-row>
          <el-col :span="11"><span class="detail-label">公司ID:</span><span class="detail-value">{{form.companyCode}}</span></el-col>
          <el-col :span="11"><span class="detail-label">公司名称:</span><span class="detail-value">{{form.companyName}}</span></el-col>
          <el-col :span="11"><span class="detail-label">公司简称:</span><span class="detail-value">{{form.shortName}}</span></el-col>
          <el-col :span="11"><span class="detail-label">所在地:</span><span class="detail-value">{{form.companyProvince}}-{{form.companyCity}}</span></el-col>
          <el-col :span="11"><span class="detail-label">公司地址:</span><span class="detail-value">{{form.companyAddress}}</span></el-col>
          <el-col :span="11"><span class="detail-label">所属行业:</span><span class="detail-value">{{form.industryType}}</span></el-col>
          <el-col :span="11"><span class="detail-label">公司规模:</span><span class="detail-value">{{form.orgSize}}</span></el-col>
          <el-col :span="11"><span class="detail-label">联系人:</span><span class="detail-value">{{form.contact}}</span></el-col>
          <el-col :span="11"><span class="detail-label">职务:</span><span class="detail-value">{{form.occupation}}</span></el-col>
          <el-col :span="11"><span class="detail-label">联系手机:</span><span class="detail-value">{{form.contactMobile}}</span></el-col>
          <el-col :span="11"><span class="detail-label">企业邮箱:</span><span class="detail-value">{{form.email}}</span></el-col>
          <el-col :span="11"><span class="detail-label">企业微信:</span><span class="detail-value">{{form.wechatNo}}</span></el-col>
          <el-col :span="22">
            <span class="detail-label" alt="" style="line-height: 80px;">公司LOGO:</span>
            <img :src="form.logo" v-if="form.logo" style="width: 120px; height: 80px;">
          </el-col>
          <el-col :span="22" style="margin-top: 20px">
            <span class="detail-label" alt="" style="line-height: 80px;">公司资质:</span>
            <img :src="form.companyQualification" v-if="form.companyQualification" style="width: 120px; height: 80px;">
          </el-col>
          <el-col :span="22" style="margin-top: 20px"><span class="detail-label" style="line-height: normal">备注:</span><div class="detail-value" style="max-width:600px;line-height:normal;word-wrap:break-word; word-break:normal;">{{form.remark}}</div></el-col>
        </el-row>
      </el-form>
      </div>
    </div>
    <div v-show="radio==='消费记录'">
    </div>
    <div v-show="radio==='充值情况'">
    </div>
  </div>
</template>

<script>
  import {accountCompany} from '@/api/api'

  export default {
    data() {
      return {
        radio: '账户信息',
        tab1Status: true,
        form: {},
        account:{}
      }
    },
    created() {
      this.form = this.$route.query
      this.getCompany()
    },
    methods: {
      changeRadio(label){
        if (label === '消费记录') {

        }else  if (label === '充值情况') {

        }
      },
      getCompany(){
        accountCompany(this.form.id).then(response => {
          this.account = response.data
          this.account.accountType = this.account.accountType === 'Charge' ? '付费使用': '试用体验'
          this.account.accountStatus = this.account.accountStatus ? '生效': '失效'
          this.account.balanceThreshold = this.account.balanceThreshold * 0.01
          let date = new Date(this.account.expireDate)
          let month = date.getMonth() + 1;
          let day = date.getDate();
          this.account.expireDate = date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
          this.form = this.account.company
          if (this.form.logo) {
            this.form.logo = process.env.BASE_API + '/file?fileUuid=' + this.form.logo
          }
          if (this.form.companyQualification) {
            this.form.companyQualification = process.env.BASE_API + '/file/getCompanyQualification?fileUuid=' + this.form.companyQualification
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  .detail-label{
    width: 100px;
    margin-right: 10px;
    font-size: 13px;
    line-height: 40px;
    text-align: right;
    float: left;
    color: #252525;
  }
  .detail-value{
    font-size: 14px;
    float: left;
    line-height: 40px;
    color: #000000;
  }
  .switch {
    display: inline-flex;
  }
  .switch-open {
    font-size: 10px;
    width: 55px;
    color: #ffffff;
    z-index: 999;
    pointer-events: none;
    padding-left: 10px;
    text-align: left;
    margin-left: -55px;
  }

  .switch-close {
    font-size: 10px;
    width: 55px;
    margin-left: -55px;
    text-align: right;
    color: #ffffff;
    padding-right: 10px;
    z-index: 999;
    pointer-events: none;
  }

  .txt>.el-form-item__label{
    line-height: 40px!important;
  }
  .sw>.el-switch__core{
    width: 55px!important;
    line-height: 40px!important;
  }
  .upd_btn {
    float: right;
    border: none;
    color: #0299CC;
    &:hover {
      background: #ffff;
    }
    i {
      margin-right: 2px;
      vertical-align: text-bottom;
    }

  }

  .form-border {
    border: 1px solid #EFEFEF;
    border-radius: 5px;
    padding: 20px 30px;
  }

</style>
