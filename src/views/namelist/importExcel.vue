<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">批量导入</span>
    </div>
    <div class="upload-container">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="11" :offset="6">
            <el-form-item label="所属公司" prop="companyId">
              <el-select v-model="form.companyId" placeholder="请选择所属公司" style="width: 100%">
                <el-option
                  v-for="item in companies"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11" :offset="6">
            <el-form-item label="名单名称" prop="nameList">
              <el-input v-model="form.groupName" placeholder="请输入名单名称" required></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11" :offset="6">
            <el-form-item label="上传外呼名单" prop="filename">
              <upload-excel-component @on-selected-file='selected'></upload-excel-component>
            </el-form-item>
          </el-col>
          <el-checkbox style="margin-top: 5px" v-model="form.maskPhoneNo">隐藏主号</el-checkbox>
        </el-row>
        <el-row>
          <el-col style="text-align: center">
            <span style="color: #BABBBB">
              备注：批量导入名单，请按照要求格式进行导入，模板表格请点击
            </span>
            <a :href="downloadUrl">下载</a>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer" style="text-align: center; margin-top: 20px">
        <el-button class="add_btn" @click="submit">提 交</el-button>
      </div>
    </div>
    <div class="detail-title">
      <span class="list-tit">名单列表</span>
    </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel.vue'
import { addNameExcel, getCompanies } from '@/api/api'

export default {
  name: 'uploadExcel',
  components: { UploadExcelComponent },
  data () {
    return {
      tableData: [],
      tableHeader: [],
      formData: null,
      form: {
        maskPhoneNo: true
      },
      companies: [],
      downloadUrl: 'http://10.9.60.142:8888/group1/M00/00/0A/Cgk8jlsV8_yAd5EUAAAssi76hjc78.xlsx'
    }
  },
  created () {
    this.getQuery()
  },
  methods: {
    getQuery () {
      getCompanies().then(res => {
        this.companies = res.data
      })
    },
    selected (data) {
      this.tableHeader = data.header
      this.tableData = data.results
      this.filename = data.filename
      // console.log(this.tableHeader)
      // console.log(this.tableData)
      // this.formData = data.formData
      console.log(data)
    },
    submit () {
      addNameExcel(this.form, this.tableData).then(res => {
        console.log(res)
      //   if(!res) {
      //     console.log('上传失败')
      //   } else {
      //     console.log('上传成功')
      //   }
      })
    }
  }
}
</script>
