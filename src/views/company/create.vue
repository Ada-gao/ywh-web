<template>
  <div>
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入公司名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="公司简称">
              <el-input v-model="form.shortName" placeholder="请输入公司简称" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="所在地" prop="companyProvince">
              <el-select v-model="form.companyProvince"
                         placeholder="请选择省份"
                         @change="changeProvince"
                         style="width: 120%;">
                <el-option
                  v-for="item in provinceData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="companyCity" label-width="50px">
              <el-select v-model="form.companyCity"
                         placeholder="请选择地区"
                         @change="changeCity"
                         style="width: 100%; ">
                <el-option
                  v-for="item in cityData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="公司地址" prop="companyAddress">
              <el-input v-model="form.companyAddress" placeholder="请输入公司地址" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="所属行业" prop="industryType">
              <el-select v-model="form.industryType"
                         placeholder="请选择行业大类"
                         @change="changeIndustryType" style="width: 120%;">
                <el-option
                  v-for="item in coInfo.industryType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="industry" label-width="50px">
              <el-select v-model="form.industry" placeholder="请选择行业小类" @change="changeIndustry" style="width: 100%;">
                <el-option
                  v-for="item in coInfo.industry"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="公司规模" prop="orgSize">
              <el-select v-model="form.orgSize" placeholder="请选择规模" style="width: 100%" @change="changeOrgSize">
                <el-option
                  v-for="item in coInfo.orgSize"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人姓名" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="职务" prop="occupation">
              <el-input v-model="form.occupation" placeholder="请输入联系人职务" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="联系手机" prop="contactMobile">
              <el-input v-model="form.contactMobile" :maxlength="11" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="企业邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入企业邮箱" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="企业微信" prop="wechatNo">
              <el-input v-model="form.wechatNo" placeholder="请输入企业微信" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="公司LOGO" prop="logo">
              <img :src.sync="form.logo" alt="" v-if="form.logo" style="width: 120px; height: 80px;float: left;">
              <el-upload
                class="upload-demo"
                action=""
                :limit="1"
                :before-upload="beforeAvatarUpload"
                accept=".png, .jpg">
                <div style="text-align: left;margin-left: 10px;padding-top: 10px;height: 80px">
                  <el-button size="small" class="add_btn" style="margin-top: 0px">选择图片</el-button>
                  <div style="font-size: 10px;color: #A1A1A1;margin-top: -10px">文件格式JPG，文件小于2M</div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20" v-show="isSuperAdmin === true">
            <el-form-item label="公司资质" prop="companyQualification">
              <el-input v-model="form.companyQualification" v-show="false" disabled/>
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :headers="headers"
                multiple
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :limit="5"
                :on-success="uploadCompanyQualification"
                :auto-upload="true"
                list-type="picture-card"
                :file-list="fileList"
                accept=".png, .jpg">
                <div style="text-align: center;vertical-align: center;line-height: 100px;">
                  <div style="font-size: 13px;color: #0299CC;font-weight: bold;height: 30px;">点击添加图片</div>
                  <div style="font-size: 10px;color: #A1A1A1;height: 20px;">支持JPG，最多5张</div>
                  <div style="font-size: 10px;color: #A1A1A1;height: 20px;">文件小于2M</div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark" maxlength="200"></el-input>
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
          create: '新建公司',
          update: '修改公司详情页',
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
          companyProvince: [
            {required: true, trigger: 'blur', message: '请选择公司所属省份'}
          ],
          companyCity: [
            {required: true, trigger: 'blur', message: '请选择公司所属地区'}
          ],
          companyAddress: [
            {required: true, trigger: 'blur', message: '请输入公司详细地址'}
          ],
          industryType: [
            {required: true, trigger: 'blur', message: '请选择公司行业大类'}
          ],
          industry: [
            {required: true, trigger: 'blur', message: '请选择公司行业小类'}
          ],
          orgSize: [
            {required: true, trigger: 'blur', message: '请选择公司规模'}
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
        isSuperAdmin:false,
      }
    },
    created() {
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
      let obj = this.$route.query
      if (obj && obj.id) {
        this.form = obj
        if (this.form.companyQualification) {
          let companyQualifications = this.form.companyQualification.split(',');
          companyQualifications.forEach((item, index) => {
            this.fileList[index] = new Object();
            this.fileList[index].url = process.env.BASE_API + '/file/getCompanyQualification?fileUuid=' + item
          })
        }
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
      uploadCompanyQualification(response, file, fileList) {
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
      getOrgSize() {
        Api.getOrgSize().then(res => {
          this.coInfo.orgSize = res.data
        })
        Api.getAuthDustries().then(res => {
          this.coInfo.industryType = res.data
          if (this.updateStatus === 'update') {
            let transferId = retransfer(this.form.industryType, this.coInfo.industryType)
            Api.getAuthDustryByType(transferId).then(res => {
              this.coInfo.industry = res.data
            })
            let idx = this.provinceData.findIndex((item, index) => {
              return item.label === this.form.companyProvince
            })
            this.cityData = this.provinceData[idx].children
          }
        })
      },
      changeProvince(val) {
        this.$refs['form'].validateField('companyProvince')
        let idx = this.provinceData.findIndex((item, index) => {
          return item.label === val
        })
        var cityarr = []
        if (!this.provinceData[idx].children || typeof this.provinceData[idx].children === 'undefined' || this.provinceData[idx].children.length === 0) {
          this.form.companyCity = null
          cityarr.label = '市辖区'
          this.cityData = []
          this.cityData[0] = cityarr
          return
        }
        this.cityData = this.provinceData[idx].children
        this.form.companyCity = null
      },
      changeCity(val) {
        this.$refs['form'].validateField('companyCity')
        this.cityData = this.cityData.slice(0)
      },
      changeIndustryType(val) {
        this.$refs['form'].validateField('industryType')
        this.form.industry = ''
        Api.getAuthDustryByType(val).then(res => {
          this.coInfo.industry = res.data
        })
      },
      changeIndustry(val) {
        this.$refs['form'].validateField('industry')
        this.coInfo.industry = this.coInfo.industry.slice(0)
        this.form.industry = transferIndustry(val, this.coInfo.industry)
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
      cancel() {
        this.$router.go(-1)
      },
      changeOrgSize() {
        this.$refs['form'].validateField('orgSize')
      }
    }
  }
</script>

<style lang="scss">
  .txt > .el-form-item__label {
    line-height: 3rem !important;
  }

  .sw > .el-switch__core {
    width: 50px !important;
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

  .cropper-content {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .cropper {
      width: 350px;
      height: 300px;
    }
  }

  .cropper-content {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .cropper {
      width: 350px;
      height: 300px;
    }
    .show-preview {
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
      .preview {
        overflow: hidden;
        border-radius: 50%;
        border: 1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
      }
    }
  }

  .footer-btn {
    margin-top: 30px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .upload-btn {
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
    }
    .btn {
      outline: none;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      -webkit-transition: .1s;
      transition: .1s;
      font-weight: 500;
      padding: 8px 15px;
      font-size: 12px;
      border-radius: 3px;
      color: #fff;
      background-color: #67c23a;
      border-color: #67c23a;
    }
  }

</style>
