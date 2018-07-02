<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">批量导入</span>
    </div>
    <div class="upload-container">
      <el-form :model="form" :rules="rules" label-width="120px">
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
            <el-form-item label="上传销售名单" prop="filename">
              <el-input style="display: none" v-model="form.filename"></el-input>
              <upload-excel-component @on-selected-file='selected'></upload-excel-component>
            </el-form-item>
          </el-col>
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
      <span class="list-tit">销售列表</span>
    </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/uploadExcel.vue'
import { addBatch, getCompanies } from '@/api/api'

export default {
  name: 'uploadExcel',
  components: { UploadExcelComponent },
  data () {
    return {
      tableData: [],
      tableHeader: [],
      formData: null,
      companies: [],
      form: {},
      downloadUrl: '/static/excel/sale_module.xlsx',
      rules: {
        companyId: [
          { required: true, message: '请选择所属公司', trigger: 'change' }
        ],
        filename: [
          { required: true, message: '请选择上传文件', trigger: 'change' }
        ]
      }
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
      this.form.filename = data.filename
    },
    submit () {
      addBatch(this.form.companyId, this.tableData).then(res => {
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: '导入成功',
            type: 'success',
            duration: 2000
          })
          this.$router.push({path: '/salesman'})
        }
      })
    }
  }
}
</script>
