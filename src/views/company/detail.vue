<template>
  <div>
    <div class="detail-title">
      <span class="list-tit">公司详情页</span>
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
</template>

<script>
  import {
    getCompanyById
  } from '@/api/api'

  export default {
    data () {
      return {
        form: { },
        companyId:''
      }
    },
    created () {
      this.companyId = this.$route.query.id;
      this.getCompaniesInfo()
    },
    methods: {
      getCompaniesInfo(){
        getCompanyById(this.companyId).then(res => {
          this.form = res.data
          if (this.form.logo) {
            this.form.logo = process.env.BASE_API + '/file?fileUuid=' + res.data.logo
          }
          if (this.form.companyQualification) {
            this.form.companyQualification = process.env.BASE_API + '/file/getCompanyQualification?fileUuid=' + res.data.companyQualification
          }
        })
      },
      modifyStat () {
        this.$router.push({name: 'create', query: this.form})
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
    width: 400px;
    line-height: 40px;
    color: #000000;
  }
</style>
