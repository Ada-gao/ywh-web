<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">批量导入</span>
    </div>
    <el-form :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="11" :offset="6">
          <el-form-item label="所属公司" prop="companyId">
            <el-select v-model="form.companyId" placeholder="请选择所属公司" style="width: 100%"
                       :disabled="isSuperAdmin !== 'true'">
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
    <div class="com_head">
      <span class="com_title">销售列表</span>
      <el-button :class="tableData.length > 0 && form.companyId && checkSuccess && !isCommit ? 'add_btn' : 'insert_btn'"
                 @click="showDialog">
        <i class="fa fa-sign-out"></i>确认导入
      </el-button>
      <span style="float:right;margin-right: 10px">共有<i style="color:#0299CC;font-style: normal;margin-right: 10px">{{tableData.length}}</i>条</span>
    </div>
    <el-table :data="tableData" v-show="errorData.length == 0" border highlight-current-row>
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'/>
    </el-table>
    <el-table :data="errorData" v-show="errorData.length > 0" border highlight-current-row>
      <el-table-column v-for='item of errorHeader' :prop="item" :label="item" :key='item'/>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定要导入这些数据吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button  class="search_btn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="add_btn" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import UploadExcelComponent from '@/components/uploadExcel.vue'

  export default {
    name: 'uploadExcel',
    components: {UploadExcelComponent},
    data() {
      return {
        isCommit: false,
        dialogVisible: false,
        tableData: [],
        tableHeader: [],
        errorData: [],
        errorHeader: [
          '错误行', '错误项'
        ],
        checkSuccess: true,
        formData: null,
        companies: [],
        form: {},
        downloadUrl: '/static/excel/销售人员导入模版.xlsx',
        rules: {
          companyId: [
            {required: true, message: '请选择所属公司', trigger: 'blur'}
          ],
          filename: [
            {required: true, message: '请选择上传文件', trigger: 'blur,change'}
          ]
        },
        isSuperAdmin: 'false',
      }
    },
    created() {
      this.getQuery()
      let companyId = sessionStorage.getItem('companyId')
      if (companyId) {
        this.form.companyId = parseInt(companyId)
      }
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    },
    methods: {
      getQuery() {
        this.Api.getCompanies().then(res => {
          this.companies = res.data
        })
      },
      selected(data) {
        this.tableHeader = data.header
        this.tableData = data.results
        this.form.filename = data.filename
        this.checkExcel();
      },
      checkExcel() {
        var reg = /^[0-9a-zA-Z]+$/
        if (this.tableHeader[0] === '销售姓名' && this.tableHeader[1] === '所属团队' && this.tableHeader[2] === '对应职级' && this.tableHeader[3] === '手机号' && this.tableHeader[4] === '用户名' && this.tableHeader[5] === '微信号' && this.tableHeader[6] === '密码') {
          this.errorData = []
          let index = 0
          let mobileList = []
          let nameList = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (!this.tableData[i].销售姓名) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '销售姓名（不能为空）'
              index++
            } else if (this.tableData[i].销售姓名.length > 10) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '销售姓名（不能超过10个字）'
              index++
            }
            if (!this.tableData[i].所属团队) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '所属团队（不能为空）'
              index++
            } else if (this.tableData[i].所属团队.length > 20) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '所属团队（不能超过20个字）'
              index++
            }
            if (!this.tableData[i].对应职级) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '对应职级（不能为空）'
              index++
            } else if (this.tableData[i].对应职级.length > 10) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '对应职级（不能超过10个字）'
              index++
            }
            if (!this.tableData[i].手机号) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '手机号（不能为空）'
              index++
            } else if (!this.checkMobile(this.tableData[i].手机号)) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '手机号（不合法）'
              index++
            } else {
              let indexOf = mobileList.indexOf(this.tableData[i].手机号)
              if (indexOf != -1) {
                this.errorData[index] = new Object()
                this.errorData[index].错误行 = i + 2
                this.errorData[index].错误项 = '手机号（与第' + (indexOf + 2) + '行重复）'
                index++
              }
            }
            if (!this.tableData[i].用户名) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '用户名（不能为空）'
              index++
            } else if (this.tableData[i].用户名.length < 4) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '用户名（不能少于4个字）'
              index++
            } else if (this.tableData[i].用户名.length > 50) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '用户名（不能超过50个字）'
              index++
            } else if (!reg.test(this.tableData[i].用户名)) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '用户名（只能是数字和字母组合）'
              index++
            } else {
              let indexOf = nameList.indexOf(this.tableData[i].用户名)
              if (indexOf != -1) {
                this.errorData[index] = new Object()
                this.errorData[index].错误行 = i + 2
                this.errorData[index].错误项 = '用户名（与第' + (indexOf + 2) + '行重复）'
                index++
              }
            }
            if (this.tableData[i].微信号) {
              if (this.tableData[i].微信号.length < 6) {
                this.errorData[index] = new Object()
                this.errorData[index].错误行 = i + 2
                this.errorData[index].错误项 = '微信号（不能少于6个字）'
                index++
              } else if (this.tableData[i].微信号.length > 20) {
                this.errorData[index] = new Object()
                this.errorData[index].错误行 = i + 2
                this.errorData[index].错误项 = '微信号（不能超过20个字）'
                index++
              }
            }
            if (!this.tableData[i].密码) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '密码（不能为空）'
              index++
            } else if (this.tableData[i].密码.length < 6) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '密码（不能少于6个字）'
              index++
            } else if (this.tableData[i].密码.length > 12) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '密码（不能超过12个字）'
              index++
            } else if (!reg.test(this.tableData[i].密码)) {
              this.errorData[index] = new Object()
              this.errorData[index].错误行 = i + 2
              this.errorData[index].错误项 = '密码（只能是数字和字母组合）'
              index++
            }
            mobileList[i] = this.tableData[i].手机号
            nameList[i] = this.tableData[i].用户名
          }
          if (this.errorData.length > 0) {
            this.checkSuccess = false
          } else {
            this.checkSuccess = true
          }
        } else {
          this.$message.error('导入的模版不正确，请核对后重新导入')
          this.checkSuccess = false
        }
      },
      showDialog() {
        if (this.form.companyId && this.tableData.length > 0 && this.checkSuccess && !this.isCommit) {
          this.dialogVisible = true
        }
      },
      checkMobile(value) {
        if (value) {
          return /^((1[3-9][0-9])+\d{8})$/.test(value)
        }
        return false
      },
      submit() {
        this.isCommit = true
        this.dialogVisible = false
        let keyMap = {
          销售姓名: 'name',
          所属团队: 'team',
          对应职级: 'level',
          手机号: 'mobile',
          用户名: 'username',
          微信号: 'wechatNo',
          密码: 'password'
        }
        let table = JSON.parse(JSON.stringify(this.tableData))
        table.forEach(item => {
          this.Utils.replaceKey(item, keyMap)
        })
        this.Api.addBatch(this.form.companyId, table).then(res => {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          this.$router.push({path: '/salesman'})
        }).catch(() => {
          this.isCommit = false
        })
      }
    }
  }
</script>
