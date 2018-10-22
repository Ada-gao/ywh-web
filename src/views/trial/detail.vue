<template>
  <div class="app-container">
    <el-dialog
      title="提示"
      :visible.sync="isDialogShow"
      width="30%"
      :center="false">
      <el-radio v-model="radio" label="试用中">试用中</el-radio>
      <el-radio v-model="radio" label="试用结束">试用结束</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus">确 定</el-button>
      </span>
    </el-dialog>
    <div class="detail-title">
      <span class="list-tit">试用申请详情</span>
    </div>
    <div class="margin-line"></div>
    <div class="read-detail">
      <el-form :model="list" class="form-border">
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
            <el-form-item label="申请来源:">
              <span>{{list.source}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="使用状态:">
              <span>{{list.status}}</span>
              <el-button class="upd_btn"
                         @click="isDialogShow = true">
                <i class="fa fa-edit"
                   style="font-size: 22px;margin-left: 5px;vertical-align: middle;"></i>
                <i style="font-style: normal;">修改</i>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="申请时间:">
              <span>{{list.createTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
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

<style lang="scss" scoped>
  .upd_btn {
    padding: 0;
    border: none;
    color: #0299CC;
    float: none!important;
    &:hover {
      background: #fff;
    }
  }
  .container .read-detail .el-form-item__content .upd_btn span {
    color: #0299CC;
  }
</style>
