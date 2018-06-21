<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="tit-text">{{textMap[updateStatus]}}</span>
      <el-button class="upd_btn" v-show="updateStatus==='view'" @click="updateStatus='update'">修改</el-button>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail" v-if="updateStatus==='create'||updateStatus==='update'">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="所在地" prop="companyProvince">
              <el-select v-model="form.companyProvince" placeholder="请选择省份" @change="changeProvince" style="width: 50%">
                <el-option
                  v-for="item in provinceData"
                  :key="item.value"
                  :label="item.label"
                  :value="item">
                </el-option>
              </el-select>
              <el-select v-model="form.companyCity" placeholder="请选择地区" @change="changeCity" style="width: 50%; float: right;">
                <el-option
                  v-for="item in cityData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司地址" prop="companyAddress">
              <el-input v-model="form.companyAddress" placeholder="请输入公司地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="form.industry" placeholder="请选择行业大类" @change="changeIndustry" style="width: 50%">
                <el-option
                  v-for="item in coInfo.industry"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="form.industryType" placeholder="请选择行业小类" @change="changeIndustryType" style="width: 50%; float: right;">
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
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司规模" prop="orgSize">
              <el-select v-model="form.orgSize" placeholder="请选择规模" style="width: 100%">
                <el-option
                  v-for="item in coInfo.orgSize"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" :maxlength="11" placeholder="请输入联系人姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="职务" prop="occupation">
              <el-input v-model="form.occupation" :maxlength="11" placeholder="请输入联系人职务"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="联系手机" prop="contactMobile">
              <el-input v-model="form.contactMobile" :maxlength="11" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司LOGO" prop="logo">
              <img :src="form.logo" alt="" style="width: 50px; height: 30px;" v-show="form.logo">
              <el-upload
                class="upload-demo"
                style="display: inline-block"
                :action="uploadUrl"
                :headers="headers"
                multiple
                :limit="1"
                :on-success="handleSuccess"
                :file-list="fileList"
                :show-file-list="true"
                accept=".png, .jpg">
                <el-button size="small" class="add_btn">选择图片</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="11" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button class="add_btn" v-show="updateStatus==='create'" @click="create('form')">提 交</el-button>
        <el-button class="add_btn" v-show="updateStatus==='update'" @click="update('form')">提 交</el-button>
      </el-col>
    </div>
    <div class="read-detail" v-if="updateStatus==='view'">
      <el-form :model="form" class="form-border">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司ID">
              <span>:{{form.id}}</span>
            </el-form-item>
            <el-form-item label="公司名称">
              <span>:{{form.companyName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="所在地">
              <span>:{{form.companyProvince}}-{{form.companyCity}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司地址">
              <span>:{{form.companyAddress}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="所属行业">
              <span>:{{form.industryText}}-{{form.industryTypeText}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司规模">
              <span>:{{form.orgSizeText}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系人">
              <span>:{{form.contact}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职务">
              <span>:{{form.occupation}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系手机">
              <span>:{{form.contactMobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司LOGO">
              :<img :src="form.logo" alt="" style="width: 50px; height: 30px;">
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注">
              <span>:{{form.remark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/common/js/auth'
import { getOrgSize, getAuthDustries, getAuthDustryByType, putCompanies, addCompanies, upload } from '@/api/api'
import { transformText } from '@/common/js/util'
import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

export default {
  data () {
    return {
      form: {},
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      fileList: [],
      value: '',
      updateStatus: '',
      textMap: {
        create: '新建公司',
        update: '修改公司详情',
        view: '查看公司详情'
      },
      coInfo: {
        orgSize: [],
        industry: []
      },
      industry: [],
      provinceData: provinceAndCityData,
      cityData: [],
      rules: {
        companyName: [
          {required: true, trigger: 'blur', message: '请输入公司名称'}
        ],
        // companyProvince: [
        //   {required: false, trigger: 'change', message: '请选择公司所属地区'},
        // ],
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
          {required: true, trigger: 'blur', message: '请输入联系电话'}
        ],
        logo: [
          {required: false, trigger: 'blur', message: '请上传公司logo'}
        ]
      },
      uploadUrl: process.env.BASE_API + '/file/upload'
    }
  },
  created () {
    const obj = this.$route.query.item
    this.id = this.$route.params.id
    this.getOrgSize()
    if (obj) {
      this.form = obj
      this.updateStatus = 'view'
      getAuthDustryByType(this.form.industry).then(res => {
        this.coInfo.industryType = res.data
        this.form.industryTypeText = transformText(this.coInfo.industryType, this.form.industryType)
      })
    } else {
      if (this.id === '0') {
        this.updateStatus = 'create'
      } else {
        this.updateStatus = 'update'
      }
    }
  },
  methods: {
    getOrgSize () {
      getOrgSize().then(res => {
        this.coInfo.orgSize = res.data
        this.form.orgSizeText = transformText(this.coInfo.orgSize, this.form.orgSize)
      })
      getAuthDustries().then(res => {
        this.coInfo.industry = res.data
        this.form.industryText = transformText(this.coInfo.industry, this.form.industry)
      })
    },
    changeProvince (val) {
      console.log(val)
      this.cityData = val.children
      this.form.companyCity = null
    },
    changeCity (val) {
      this.cityData = this.cityData.slice(0)
    },
    changeIndustry (val) {
      getAuthDustryByType(val).then(res => {
        this.coInfo.industryType = res.data
        this.form.industryType = null
      })
    },
    changeIndustryType (val) {
      this.coInfo.industryType = this.coInfo.industryType.slice(0)
    },
    create (formName) {
      // this.updateStatus = 'view'

      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.form.companyProvince = this.form.companyProvince.label
          addCompanies(this.form)
            .then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
        } else {
          return false
        }
      })
    },
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          putCompanies(this.form.id, this.form)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.updateStatus = 'view'
            })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.$router.push({path: '/company'})
    },
    handleChange (value) {
      console.log(value)
    },
    handleSuccess (fileList) {
      console.log(fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
.upd_btn {
  float: right;
}
.form-border {
  border: 1px solid #EFEFEF;
  border-radius: 5px;
  padding: 20px 30px;
}
</style>
