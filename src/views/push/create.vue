<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-row>
          <el-col :span="18">
            <el-form-item label="规则名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入规则名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="规则设定">
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="所属公司" prop="companyAddress">
              <el-select v-model="form.industryType" placeholder="请选择公司" @change="changeIndustry">
                <el-option
                  v-for="item in coInfo.industryType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属团队">
              <el-select v-model="form.industryType" placeholder="请选择团队" @change="changeIndustry">
                <el-option
                  v-for="item in coInfo.industryType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关联任务">
              <el-select v-model="form.industryType" placeholder="请选择任务" @change="changeIndustry">
                <el-option
                  v-for="item in coInfo.industryType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="有效通话时长（秒）">
              <el-input v-model="form.contactMobile" :maxlength="11" placeholder="请输入有效通话时长"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="下一步行动计划">
              <el-select v-model="form.industryType" placeholder="请选择下一步行动计划" @change="changeIndustry">
                <el-option
                  v-for="item in coInfo.industryType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="外呼状态" prop="companyAddress">
              <el-select v-model="form.industryType" placeholder="请选择外呼状态" @change="changeIndustry">
                <el-option
                  v-for="item in coInfo.industryType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="17" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" v-show="updateStatus==='create'" @click="create('form')">提 交</el-button>
        <el-button class="add_btn" v-show="updateStatus==='update'" @click="update('form')">提 交</el-button>
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
      </el-col>
    </div>
    <el-dialog :visible.sync="dialogVisible"
               width="30%">
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
            @imgLoad="imgLoad"
          ></vueCropper>
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
          <button @click="down('blob')" class="el-button add_btn el-button--default">确 定</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropper'
  import {getToken} from '@/common/js/auth'
  import {addCompanies, getAuthDustries, getAuthDustryByType, getOrgSize, putCompanies, uploadLogo} from '@/api/api'
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
      return {
        crap: false,
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
          fixedNumber: [4, 3]
        },
        downImg: '#',
        dialogVisible: false,
        form: {
          logo: null
        },
        companyCode: '',
        companyId: null,
        headers: {
          Authorization: getToken()
        },
        fileList: [],
        value: '',
        updateStatus: '',
        textMap: {
          create: '新建信息推送规则',
          update: '修改信息推送规则',
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
          companyName: [
            {required: true, trigger: 'blur', message: '请输入公司名称'}
          ],
          companyCity: [
            {required: true, trigger: 'blur', message: '请选择公司所属地区'}
          ],
          companyAddress: [
            {required: true, trigger: 'blur', message: '请输入公司详细地址'}
          ],
          industry: [
            {required: true, trigger: 'blur', message: '请选择公司行业'}
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
            {required: true, trigger: 'blur', message: '请输入正确的手机号码', validator: validatePass1}
          ],
          logo: [
            {required: false, trigger: 'blur', message: '请上传公司logo'}
          ]
        },
        uploadUrl: process.env.BASE_API + '/file/upload',
        imgUrl: process.env.BASE_API + '/file/',
        centerDialogVisible: false
      }
    },
    created() {
      let obj = this.$route.query
      if (obj && obj.id) {
        this.form = obj
        this.updateStatus = 'update'
      } else {
        this.updateStatus = 'create'
      }
      this.getOrgSize()
    },
    methods: {
      realTime(data) {
        this.previews = data
      },
      down(type) {
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.downImg = window.URL.createObjectURL(data)
            let cc = this.downImg.lastIndexOf('/')
            this.downImg = this.downImg.substring(cc + 1, this.downImg.length)
            let formData = new FormData()
            formData.append('file', data)
            uploadLogo(formData).then(res => {
              this.imgurl = res.data
              this.form.logo = process.env.BASE_API + '/file?fileUuid=' + res.data
              this.dialogVisible = false
            })
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.downImg = data
            let formData = new FormData()
            formData.append('file', data)
            uploadLogo(formData).then(res => {
              this.imgurl = res.data
              this.form.logo = process.env.BASE_API + '/file?fileUuid=' + res.data
              this.dialogVisible = false
            })
          })
        }
      },
      imgLoad(msg) {
      },
      modifyStat() {
        this.updateStatus = 'update'
        this.getOrgSize()
      },
      getOrgSize() {
        getOrgSize().then(res => {
          this.coInfo.orgSize = res.data
        })
        getAuthDustries().then(res => {
          this.coInfo.industryType = res.data
          if (this.updateStatus === 'update') {
            let transferId = retransfer(this.form.industryType, this.coInfo.industryType)
            getAuthDustryByType(transferId).then(res => {
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
        this.cityData = this.cityData.slice(0)
      },
      changeIndustry(val) {
        this.form.industry = ''
        getAuthDustryByType(val).then(res => {
          this.coInfo.industry = res.data
        })
      },
      changeIndustryType(val) {
        this.coInfo.industry = this.coInfo.industry.slice(0)
        this.form.industry = transferIndustry(val, this.coInfo.industry)
      },
      create(formName) {
        let str = this.form.logo
        if (typeof this.form.industryType === 'number') {
          this.form.industryType = transferIndustry(this.form.industryType, this.coInfo.industryType)
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (str) {
              let index = str.lastIndexOf('=')
              this.form.logo = str.substring(index + 1, str.length)
            }
            addCompanies(this.form)
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
      update(formName) {
        const set = this.$refs
        let id = this.form.id || this.companyId
        let str = this.form.logo
        this.form.companyCode = this.form.companyCode || this.companyCode
        if (window.Boolean(this.form.industryType - 0)) {
          this.form.industryType = transferIndustry(this.form.industryType, this.coInfo.industryType)
        }
        set[formName].validate(valid => {
          if (valid) {
            if (str) {
              let index = str.lastIndexOf('=')
              this.form.logo = str.substring(index + 1, str.length)
            }
            putCompanies(id, this.form)
              .then(() => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.push({path: '/company'})
              })
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.$router.push({path: '/company'})
      },
      handleChange(value) {
      },
      handleSuccess(res, file, fileList) {
      },
      beforeAvatarUpload(file) {
        this.option.img = window.URL.createObjectURL(file)
        this.dialogVisible = true
        return false
      },
      dialogRouter(status) {
        if (status === 'view') {
          this.updateStatus = 'view'
          this.centerDialogVisible = false
        } else {
          this.$router.push({path: '/company'})
        }
      },
      changeOrgSize(val) {
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
