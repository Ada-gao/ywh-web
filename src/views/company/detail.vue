<template>
  <div>
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
      <el-button class="upd_btn" v-show="updateStatus==='view'" @click="modifyStat">
        <i class="fa fa-edit"
           style="font-size: 22px;margin-right: 5px;vertical-align: middle;"></i>
        <i style="font-style: normal;">修改</i>
      </el-button>
    </div>
    <div class="margin-line"></div>
    <div class="read-detail" v-if="updateStatus==='view'">
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
    addUser,
    getUsers,
    resetPWD,
    updateUsers,
    userEnabled
  } from '@/api/api'

  export default {
    data () {
      return {
        dialogVisible: false,
        form: {
          companyCode: null
        },
        value: '',
        updateStatus: '',
        textMap: {
          createManager: '新建管理员',
          view: '公司详情页'
        },
        centerDialogVisible: false,
        manager: {
          authorities: [{
            'name': 'ROLE_ADMIN'
          }],
          companyId: 0,
          enabled: null
        },
        listLoading: null,
        list: null,
        total: null,
        currentPage: 1,
        listQuery: {
          companyId: 0,
          authorityName: 'ROLE_ADMIN',
          pageIndex: 0,
          pageSize: 10
        },
        updateInfo: {},
        pwdForm: {
          password: null
        },
        updateForm: {

        }
      }
    },
    created () {
      let obj = this.$route.query
      this.listQuery.companyId = obj.id
      this.form = obj
      if (this.form.logo) {
        this.form.logo = process.env.BASE_API + '/file?fileUuid=' + this.$route.query.logo
      }
      if (this.form.companyQualification) {
        this.form.companyQualification = process.env.BASE_API + '/file/getCompanyQualification?fileUuid=' + this.$route.query.companyQualification
      }
      this.updateStatus = 'view'
    },
    methods: {
      changeMode (id, enabled) {
        userEnabled(id, enabled).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      // 去除空格
      trim (str, global) {
        var result
        result = str.replace(/(^\s+)|(\s+$)/g, '')
        if (global.toLowerCase() === 'g') {
          result = result.replace(/\s/g, '')
        }
        return result
      },
      modifyStat () {
        this.$router.push({name: 'create', query: this.form})
      },
      dialogRouter (status) {
        if (status === 'view') {
          this.updateStatus = 'view'
          this.centerDialogVisible = false
        } else {
          this.$router.push({path: '/company'})
        }
      }
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
