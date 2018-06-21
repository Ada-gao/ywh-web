<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="tit-text">{{textMap[updateStatus]}}</span>
      <el-button class="upd_btn" v-show="updateStatus==='view'" @click="updateStatus='update'">修改</el-button>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail" v-if="updateStatus==='create'||updateStatus==='update'">
      <el-form :model="form" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司名称" prop="name">
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
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!-- <el-cascader
                style="width: 100%"
                :options="options"
                v-model="companyProvince"
                @change="handleChange">
              </el-cascader> -->
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
            <el-form-item label="所属行业" prop="employeeDate">
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
            <el-form-item label="公司规模" prop="gender">
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
            <el-form-item label="联系人" prop="education">
              <el-input v-model="form.contact" :maxlength="11" placeholder="请输入联系人姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="职务" prop="idType">
              <el-input v-model="form.occupation" :maxlength="11" placeholder="请输入联系人职务"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="联系手机" prop="mobile">
              <el-input v-model="form.contactMobile" :maxlength="11" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司LOGO" prop="resumeUrl">
              <img :src="form.logo" alt="" style="width: 50px; height: 30px;">
              <el-upload
                class="upload-demo"
                style="display: inline-block"
                action="/zuul/admin/user/upload"
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
        <el-button class="add_btn" @click="create('form')">提 交</el-button>
      </el-col>
    </div>
    <div class="read-detail" v-if="updateStatus==='view'">
      <!-- <el-button class="upd_btn" @click="updateStatus='update'">修改</el-button> -->
      <el-form :model="form" class="form-border">
        <el-row :gutter="20">
          <el-col :span="11">
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
import { getOrgSize, getAuthDustries, getAuthDustryByType } from '@/api/api'
import { transformText } from '@/common/js/util'
import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

export default {
  data () {
    return {
      form: {},
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }]
        }
      ],
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
      cityData: []
    }
  },
  created () {
    const obj = this.$route.query.item
    this.id = this.$route.params.id
    this.getOrgSize()
    if (obj) {
      this.form = obj
      // console.log(this.form)
      this.updateStatus = 'view'
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
      })
    },
    changeProvince (val) {
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
      console.log('提交了')
      this.updateStatus = 'view'
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
      })

      // const set = this.$refs
      // this.form.positionId = this.form.positionName
      // this.form.idType = this.IDType
      // this.form.marriageStatus = this.maritalStatus
      // set[formName].validate(valid => {
      //   if (valid) {
      //     addObj(this.form)
      //       .then(() => {
      //         this.dialogFormVisible = false
      // //         this.getList()
      //         this.$notify({
      //           title: '成功',
      //           message: '创建成功',
      //           type: 'success',
      //           duration: 2000
      //         })
      //       })
      //   } else {
      //     return false
      //   }
      // })
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
.read-detail {
  position: relative;
  .upd_btn {
    float: right;
  }
}
.form-border {
  border: 1px solid #EFEFEF;
  border-radius: 5px;
  padding: 20px 30px;
}
</style>
