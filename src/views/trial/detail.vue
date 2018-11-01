<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">试用申请详情</span>
    </div>
    <div class="com-line"/>
    <el-form :model="list">
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="公司名称:">
            <span>{{list.companyName}}</span>
          </el-form-item>
          <el-form-item label="联系人:">
            <span>{{list.contact}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系手机:">
            <span>{{list.mobile}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="所在地:">
            <span>{{list.companyProvince + '-' +list.companyCity}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="所属行业:">
            <span>{{list.industryType}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="公司规模:">
            <span>{{list.orgSize}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="来源:">
            <span>{{list.source}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="产品类别:">
            <span>{{list.productType}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="浏览器:">
            <span>{{list.browser}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="登录地:">
            <span>{{list.loginLocation}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="使用状态:">
            <span>{{list.status}}</span>
            <span @click="isDialogShow = true" style="color: #0299CC;margin-left: 10px">
              <i class="fa fa-edit"/> <span>修改</span>
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="IP地址:">
            <span>{{list.ipaddr}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="申请时间:">
            <span>{{list.createTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog title="提示" :visible.sync="isDialogShow" width="30%" :center="false">
      <el-radio v-model="radio" label="试用中">试用中</el-radio>
      <el-radio v-model="radio" label="试用结束">试用结束</el-radio>
      <span>
        <el-button @click="isDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio: '',
      list: {},
      isDialogShow: false
    }
  },
  created () {
    this.list = this.$route.query
    this.radio = this.list.status
  },
  methods: {
    converStatus (status) {
      switch (status) {
        case '试用中':
          status = '1'
          break
        case '试用结束':
          status = '2'
          break
      }
      return status
    },
    updateStatus () {
      this.isDialogShow = false
      this.list.status = this.radio
      let data = {
        status: this.converStatus(this.list.status)
      }
      this.Api.getTrailDet(this.list.id, data).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
