<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">公司详情页</span>
      <el-button @click="modifyStat">
        <i class="fa fa-edit"/><span>修改</span>
      </el-button>
    </div>
    <div class="com-line"/>
    <el-form :model="form">
      <el-row>
        <el-col :span="11"><span class="detail-label">公司ID:</span><span
          class="detail-value">{{form.companyCode}}</span></el-col>
        <el-col :span="11"><span class="detail-label">公司名称:</span><span class="detail-value">{{form.companyName}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="11"><span class="detail-label">公司简称:</span><span class="detail-value">{{form.shortName?form.shortName:'-'}}</span>
        </el-col>
        <el-col :span="11"><span class="detail-label">所在地:</span><span class="detail-value">{{form.companyProvince}}-{{form.companyCity}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11"><span class="detail-label">公司地址:</span><span
          class="detail-value">{{form.companyAddress}}</span></el-col>
        <el-col :span="11"><span class="detail-label">所属行业:</span><span
          class="detail-value">{{form.industryType}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="11"><span class="detail-label">公司规模:</span><span class="detail-value">{{form.orgSize}}</span>
        </el-col>
        <el-col :span="11"><span class="detail-label">联系人:</span><span class="detail-value">{{form.contact}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11"><span class="detail-label">职务:</span><span class="detail-value">{{form.occupation}}</span>
        </el-col>
        <el-col :span="11"><span class="detail-label">联系手机:</span><span
          class="detail-value">{{form.contactMobile}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="11"><span class="detail-label">企业邮箱:</span><span class="detail-value">{{form.email}}</span>
        </el-col>
        <el-col :span="11"><span class="detail-label">企业微信:</span><span class="detail-value">{{form.wechatNo?form.wechatNo:'-'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11"><span class="detail-label">协同通讯号:</span><span class="detail-value">{{form.ecpId}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <span class="detail-label" style="line-height: 80px;">公司LOGO:</span>
          <img :src="form.logo" alt="" style="width: 120px; height: 80px;"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" style="margin-top: 20px">
          <span class="detail-label" style="line-height: 80px;">公司资质:</span>
          <img v-for="item in imgList" :src="item" v-preview="item" alt=""
               style="width: 120px; height: 80px;margin-right: 10px;cursor: pointer"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" style="margin-top: 20px"><span class="detail-label" style="line-height: normal">备注:</span>
          <div class="detail-value"
               style="max-width:600px;line-height:normal;word-wrap:break-word; word-break:normal;">
            {{form.remark?form.remark:'-'}}
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {},
        companyId: '',
        imgList: [],
      }
    },
    created() {
      this.companyId = this.$route.query.id;
      this.imgList = new Array(5)//不加这句，预览图出不了
      this.getCompaniesInfo()
    },
    methods: {
      getCompaniesInfo() {
        this.Api.getCompanyById(this.companyId).then(res => {
          this.form = res.data
          if (this.form.logo) {
            this.form.logo = process.env.BASE_API + '/file?fileUuid=' + this.form.logo
          }
          if (this.form.companyQualification) {
            this.imgList = this.form.companyQualification.split(',');
            this.imgList.forEach((item, index) => {
              this.imgList[index] = process.env.BASE_API + '/file/getCompanyQualification?fileUuid=' + item
            })
          }
        })
      },
      modifyStat() {
        this.$router.push({name: 'create', query: this.form})
      },
    }
  }
</script>
