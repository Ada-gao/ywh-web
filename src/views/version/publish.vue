<template>
  <div>
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="策略名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入策略名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="目标版本号" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入目标版本号" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="VersionCode" prop="occupation">
              <el-input v-model="form.occupation" placeholder="请输入VersionCode" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="升级文件" prop="logo">
              <img :src.sync="form.logo" alt="" v-if="form.logo" style="width: 120px; height: 80px;float: left;">
              <el-upload
                class="upload-demo"
                action=""
                :limit="1"
                :before-upload="beforeAvatarUpload"
                accept=".png, .jpg">
                <div style="text-align: left;margin-left: 10px;padding-top: 10px;height: 80px">
                  <el-button size="small" class="add_btn" style="margin-top: 0px">上传升级文件（apk）</el-button>
                  <div style="font-size: 10px;color: #A1A1A1;margin-top: -10px">只能上传 apk格式文件</div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="升级说明" prop="remark">
              <el-input type="textarea" v-model="form.remark" :rows="5" placeholder="请输入更新说明"  maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="20" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" v-show="updateStatus==='update'" @click="update('form')">提 交</el-button>
        <el-button class="add_btn" v-show="updateStatus==='create'" @click="create('form')">提 交</el-button>
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
      </el-col>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <div class="cropper-content">
        <div class="cropper">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            @realTime="realTime"
          />
        </div>
        <div class="show-preview"
             :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </div>

      <div class="footer-btn">
        <div class="upload-btn">
          <button @click="uploadLogo" class="el-button add_btn el-button--default">确 定</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropper'
  import {getToken} from '@/common/js/auth'
  import * as Api from "@/api/api"
  import {retransfer, transferIndustry} from '@/common/js/util'
  import {provinceAndCityData} from 'element-china-area-data' // 省市区数据

  export default {
    components: {
      VueCropper
    },
    data() {
      const validatePass1 = (rule, value, callback) => {
        let reg = /^((1[3-8][0-9])+\d{8})$/
        let flag = reg.test(value)
        if (!value || !flag) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
        let flag = reg.test(value)
        if (!value || !flag) {
          callback(new Error('请输入正确的企业邮箱'))
        } else {
          callback()
        }
      }
      const validateWechatNo = (rule, value, callback) => {
        if (value) {
          if (value.length < 6 || value.length > 100) {
            callback(new Error('请输入正确的企业微信'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        previews: {},
        option: {
          img: '',
          size: 1,
          full: false,
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200,
          fixed: true,
          fixedNumber: [3, 2]
        },
        dialogVisible: false,
        form: {
          companyQualification:''
        },
        companyCode: '',
        companyId: null,
        headers: {
          Authorization: getToken()
        },

        updateStatus: '',
        textMap: {
          create: '发布新版本',
          update: '编辑新版本',
        },
        coInfo: {
          orgSize: [],
          industry: [],
          industryType: []
        },
        industryType: [],
        provinceData: provinceAndCityData,
        cityData: [],
        rules: {
          bug: [
            {required: true, trigger: 'blur', message: 'bug'}
          ],
          companyName: [
            {required: true, trigger: 'blur', message: '请输入公司名称'}
          ],
          contact: [
            {required: true, trigger: 'blur', message: '请输入联系人'}
          ],
          occupation: [
            {required: true, trigger: 'blur', message: '请输入对应职务'}
          ],
          contactMobile: [
            {required: true, trigger: 'blur', validator: validatePass1}
          ],
          email: [
            {required: true, trigger: 'blur', validator: validateEmail}
          ],
          wechatNo: [
            {required: false, trigger: 'blur', validator: validateWechatNo}
          ],
          companyQualification: [
            {required: true, trigger: 'blur', message: '请上传公司资质'}
          ]
        },
        uploadUrl: process.env.BASE_API + '/file/uploadCompanyQualification',
        fileList: [],
        isSuperAdmin:'false',
      }
    },
    created() {
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
      let obj = this.$route.query
      if (obj && obj.id) {
        this.form = obj
        this.updateStatus = 'update'
      } else {
        this.form = {
          companyQualification:''
        }
        this.updateStatus = 'create'
      }
      this.getOrgSize()
    },
    methods: {
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      handleRemove(files, fileList) {
        console.log(fileList)
        this.fileList = fileList
        this.form.companyQualification = ''
        this.fileList.forEach(item => {
          let url = item.response
          if (!url){
            let index = item.url.lastIndexOf('=')
            url = item.url.substring(index + 1, item.url.length)
          }
          if (this.form.companyQualification) {
            this.form.companyQualification += "," + url
          } else {
            this.form.companyQualification = url
          }
        })
        this.$refs['form'].validateField('companyQualification')
      },
      realTime(data) {
        this.previews = data
      },
      beforeAvatarUpload(file) {
        this.option.img = window.URL.createObjectURL(file)
        this.dialogVisible = true
        return false
      },
      uploadLogo() {
        this.$refs.cropper.getCropBlob((data) => {
          let formData = new FormData()
          formData.append('file', data)
          Api.uploadLogo(formData).then(res => {
            this.form.logo = process.env.BASE_API + '/file?fileUuid=' + res.data
            this.dialogVisible = false
          })
        })
      },
      modifyStat() {
        this.updateStatus = 'update'
        this.getOrgSize()
      },
      create() {
        // alert(JSON.stringify(this.form))
        let logo = this.form.logo
        if (typeof this.form.industryType === 'number') {
          this.form.industryType = transferIndustry(this.form.industryType, this.coInfo.industryType)
        }
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (logo) {
              let index = logo.lastIndexOf('=')
              this.form.logo = logo.substring(index + 1, logo.length)
            }
            Api.addCompanies(this.form)
              .then(res => {
                this.$message({
                  message: '新建成功',
                  type: 'success'
                })
                this.companyCode = res.data.companyCode
                this.companyId = res.data.id
                this.$router.push({path: '/company'})
              })
          } else {
            return false
          }
        })
      },
      update() {
        const set = this.$refs
        let id = this.form.id || this.companyId
        let logo = this.form.logo
        this.form.companyCode = this.form.companyCode || this.companyCode
        if (window.Boolean(this.form.industryType - 0)) {
          this.form.industryType = transferIndustry(this.form.industryType, this.coInfo.industryType)
        }
        set['form'].validate(valid => {
          if (valid) {
            if (logo) {
              let index = logo.lastIndexOf('=')
              this.form.logo = logo.substring(index + 1, logo.length)
            }
            Api.putCompanies(id, this.form)
              .then(() => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.go(-1)
              })
          } else {
            return false
          }
        })
      },
    }
  }
</script>
