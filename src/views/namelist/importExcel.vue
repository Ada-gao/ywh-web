<template>
  <div class="app-container">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定要导入这些数据吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
    </el-dialog>
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
            <el-form-item label="名单名称" prop="groupName">
              <el-input v-model="form.groupName" placeholder="请输入名单名称" required maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11" :offset="6">
            <el-form-item label="上传外呼名单" prop="filename">
              <el-input style="display: none" v-model="form.filename"></el-input>
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
      <!--<div class="dialog-footer" style="text-align: center; margin-top: 20px">-->
        <!--<el-button class="add_btn" @click="submit">提 交</el-button>-->
      <!--</div>-->
    </div>
    <div class="detail-title" style="margin-top: 30px">
      <span class="list-tit">名单列表</span>
      <el-button :class="form.companyId && form.groupName &&tableData.length > 0 ? 'add_btn' : 'insert_btn'" @click="showDialog">
        <i class="fa fa-sign-out" style="margin-right: 10px"></i>确认导入
      </el-button>

      <span style="float:right;">共有<i style="color:#0299CC;font-style: normal;">{{tableData.length}}</i>条</span>
    </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:10px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/uploadExcel.vue'
import { addNameExcel, getCompanies } from '@/api/api'
import { replaceKey } from '@/common/js/util'

export default {
  name: 'uploadExcel',
  components: { UploadExcelComponent },
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      tableHeader: [],
      formData: null,
      form: {
        maskPhoneNo: true
      },
      companies: [],
      downloadUrl: '/static/excel/外呼名单导入模版.xlsx',
      rules: {
        companyId: [
          { required: true, message: '请选择所属公司', trigger: 'blur' }
        ],
        groupName: [
          { required: true, message: '请输入名单名称', trigger: 'blur' }
        ],
        filename: [
          { required: true, message: '请选择上传文件', trigger: 'blur' }
        ]
      },
      filename: '',
      error: null
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
      // console.log(this.tableHeader)
      // console.log(this.tableData)
      // this.formData = data.formData
    },
    showDialog () {
      if (this.form.companyId && this.form.groupName && this.tableData.length > 0) {
        this.dialogVisible = true
      }
    },
    checkMobile (value) {
      if (value) {
        return /^((1[3-8][0-9])+\d{8})$/.test(value)
      }
      return false
    },
    checkTelphone (value) {
      if (value) {
        return /^(0[0-9]{2,3}-)([2-9][0-9]{6,7})+$/.test(value)
      }
      return false
    },
    submit () {
      this.dialogVisible = false
      this.error = ''
      if (this.tableHeader[0] === '联系人姓名' && this.tableHeader[1] === '手机号' && this.tableHeader[2] === '年龄' && this.tableHeader[3] === '性别' && this.tableHeader[4] === '所在地' && this.tableHeader[5] === '名单来源') {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].联系人姓名 && this.tableData[i].联系人姓名.length > 50) {
            this.error += '‘联系人姓名’'
          }
          if (this.checkMobile(this.tableData[i].手机号) || this.checkTelphone(this.tableData[i].手机号)) {

          } else {
            this.error += '‘手机号’'
          }
          if (this.error) {
            this.error = '第' + (i + 1) + '行' + this.error + '格式有误'
            break
          }
        }
      } else {
        this.error = '导入的模版不正确，请核对后重新导入'
      }
      if (this.error) {
        this.$notify.error({
          title: '错误',
          message: this.error,
          duration: 2000
        })
      } else {
        let keyMap = {
          联系人姓名: 'contactName',
          手机号: 'phoneNo',
          年龄: 'age',
          性别: 'gender',
          所在地: 'residence',
          名单来源: 'source'
        }
        var table = this.tableData
        table.forEach(item => {
          replaceKey(item, keyMap)
        })
        addNameExcel(this.form, table).then(res => {
            this.$notify({
              title: '成功',
              message: '导入成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({path: '/list'})
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .insert_btn {
      background: #EFF2F7;
      color: #C0CCDA;
      border: none;
      padding: 12px;
      cursor: not-allowed;
    }
    .add_btn {
      padding: 12px;
      border:none;
    }
  }
</style>
