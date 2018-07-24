<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
      <el-button class="upd_btn"
                 v-show="updateStatus==='view'"
                 @click="modifyStat">
        <i class="fa fa-edit"
           style="font-size: 22px;margin-right: 5px;vertical-align: middle;"></i>
        <i style="font-style: normal;">修改</i>
      </el-button>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail" v-if="updateStatus==='create'||updateStatus==='update'">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="所在地" prop="companyProvince">
              <el-select v-model="form.companyProvince"
                         placeholder="请选择省份"
                         @change="changeProvince"
                         style="width: 47%;margin-right: 20px">
                <el-option
                  v-for="item in provinceData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
              <el-select v-model="form.companyCity"
                         placeholder="请选择地区"
                         @change="changeCity"
                         style="width: 47%; float: right;">
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
          <el-col :span="17">
            <el-form-item label="公司地址" prop="companyAddress">
              <el-input v-model="form.companyAddress" placeholder="请输入公司地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="form.industryType"
                         placeholder="请选择行业大类"
                         @change="changeIndustry" style="width: 47%;margin-right: 20px;">
                <el-option
                  v-for="item in coInfo.industryType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="form.industry"
                         placeholder="请选择行业小类"
                         @change="changeIndustryType" style="width: 47%; float: right;">
                <el-option
                  v-for="item in coInfo.industry"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
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
          <el-col :span="17">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="职务" prop="occupation">
              <el-input v-model="form.occupation" placeholder="请输入联系人职务"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="联系手机" prop="contactMobile">
              <el-input v-model="form.contactMobile" :maxlength="11" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="公司LOGO" prop="logo">
              <img :src.sync="form.logo"
                   alt=""
                   v-if="form.logo"
                   style="width: 50px; height: 30px;">
              <el-upload
                class="upload-demo"
                style="display: inline-block"
                :action="uploadUrl"
                :headers="headers"
                multiple
                :limit="1"
                :on-success="handleSuccess"
                :before-upload="beforeAvatarUpload"
                :file-list="fileList"
                :show-file-list="false"
                accept=".png, .jpg">
                <el-button size="small" class="add_btn">选择图片</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="17" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" v-show="updateStatus==='create'" @click="create('form')">提 交</el-button>
        <el-button class="add_btn" v-show="updateStatus==='update'" @click="update('form')">提 交</el-button>
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
      </el-col>
      <el-dialog
        title="操作成功"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <span>{{this.form.companyName}}新建成功</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogRouter('view')">查看详情</el-button>
          <el-button type="primary" @click="dialogRouter('')">返回列表</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="read-detail" v-if="updateStatus==='view'">
      <el-form :model="form" class="form-border">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="公司ID:">
              <span>{{form.companyCode || companyCode}}</span>
            </el-form-item>
            <el-form-item label="公司名称:">
              <span>{{form.companyName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="所在地:">
              <span>{{form.companyProvince}}-{{form.companyCity}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司地址:">
              <span>{{form.companyAddress}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="所属行业:">
              <span>{{form.industryType}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司规模:">
              <span>{{form.orgSize}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系人:">
              <span>{{form.contact}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职务:">
              <span>{{form.occupation}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系手机:">
              <span>{{form.contactMobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司LOGO:">
              <img :src="form.logo"
                   alt=""
                   v-if="form.logo"
                   style="width: 50px; height: 30px;">
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注:">
              <span>{{form.remark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!----------------- 管理员 start ------------------>
      <div class="detail-title" style="margin-top: 22px;">
        <span class="list-tit">管理员列表</span>
        <el-button class="add_btn" @click="createManager">
          <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建管理员
        </el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="序号" prop="userCode"/>
        <el-table-column align="center" label="姓名" prop="name"/>
        <el-table-column align="center" label="职务" prop="level"/>
        <el-table-column align="center" label="联系手机" prop="mobile"/>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <div class="switch">
              <el-switch
                v-model="scope.row.enabled"
                active-color="#0299CC"
                inactive-color="#C0CCDA"
                @change="changeMode(scope.row.id, scope.row.enabled)">
              </el-switch>
              <div v-if="scope.row.enabled" class="switch-open">开启</div>
              <div v-else class="switch-close">停用</div>
           </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <a size="small" class="common_btn"
               @click="updateInfoDialog = true">修改信息
            </a>
            |
            <a size="small" class="common_btn"
               @click="updatePwdDialog = true">修改密码
            </a>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="currentPage"
                       background
                       :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-dialog title="修改信息" :visible.sync="updateInfoDialog" width="30%">
        <el-form :model="manager" :rules="rules" ref="manager" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="manager.name" placeholder="输入管理员姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="职务">
                <el-input v-model="manager.occupation" placeholder="输入职务"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="联系手机">
                <el-input v-model="manager.mobile" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateInfoDialog = false">取 消</el-button>
          <el-button type="primary" @click="updateInfoDialog = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改密码" :visible.sync="updatePwdDialog" width="30%">
        <el-form :model="manager" :rules="rules" ref="manager" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="新密码" prop="password">
                <el-input v-model="manager.password" placeholder="输入登录密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updatePwdDialog = false">取 消</el-button>
          <el-button type="primary" @click="updatePwdDialog = false">确 定</el-button>
        </div>
      </el-dialog>
      <!----------------- 管理员 end ------------------->
    </div>
    <!----------------- 管理员 start ------------------>
    <div class="update-detail" v-if="updateStatus==='createManager'">
      <el-form :model="manager" :rules="rulesManager" ref="manager" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="manager.name" placeholder="输入管理员姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="职务">
              <el-input v-model="manager.level" placeholder="输入职务"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="联系手机">
              <el-input v-model="manager.mobile" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="登录账号" prop="username">
              <el-input v-model="manager.username" placeholder="输入登录账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="17">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="manager.password" placeholder="输入登录密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="17" class="dialog-footer" style="text-align: center">
          <el-button class="add_btn" @click="newManager('manager')">提 交</el-button>
          <el-button class="search_btn" @click="cancelManager">取 消</el-button>
        </el-col>
      </el-form>
      <el-dialog
        title="操作成功"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <span>{{this.form.companyName}}新建成功</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogRouter('view')">查看详情</el-button>
          <el-button type="primary" @click="dialogRouter('')">返回列表</el-button>
        </span>
      </el-dialog>
    </div>
    <!----------------- 管理员 end ------------------->
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
import {
  userEnabled,
  addCompanies,
  addUser,
  getAuthDustries,
  getAuthDustryByType,
  getOrgSize,
  getUsers,
  putCompanies,
  uploadLogo
} from '@/api/api'
import {retransfer, transferIndustry} from '@/common/js/util'
import {provinceAndCityData} from 'element-china-area-data' // 省市区数据

export default {
  components: {
    VueCropper
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
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
      imgurl: '',
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
      form: {},
      companyCode: '',
      companyId: null,
      headers: {
        Authorization: getToken()
      },
      fileList: [],
      value: '',
      updateStatus: '',
      textMap: {
        create: '新建公司',
        createManager: '新建管理员',
        update: '修改公司详情页',
        view: '公司详情页'
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
        companyProvince: [
          {required: true, trigger: 'blur', message: '请选择公司所属地区', validator: validatePass}
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
      centerDialogVisible: false,
      /* --------------- 管理员 start ---------------- */
      updateInfoDialog: false,
      updatePwdDialog: false,
      rulesManager: {
        name: [
          {required: true, trigger: 'blur', message: '请输入管理员姓名'}
        ],
        username: [
          {required: true, trigger: 'blur', message: '请输入登录账号'}
        ],
        password: [
          {required: true, trigger: 'blur', message: '请输入输入登录密码'}
        ]
      },
      manager: {
        authorities: [{
          'name': 'ROLE_ADMIN'
        }],
        companyId: 0,
        enabled: null
      },
      listLoading: null,
      list: null,
      total: null,
      currentPage: 1,
      listQuery: {
        companyId: 0,
        authorityName: 'ROLE_ADMIN',
        pageIndex: 0,
        pageSize: 20
      }
      /* --------------- 管理员 end ---------------- */
    }
  },
  created () {
    const obj = this.$route.query.item
    // let logo = (obj.logo).split('/')[1]
    // console.log(logo)
    this.id = this.$route.params.id
    if (obj) {
      /* --------------- 管理员 start ---------------- */
      this.listQuery.companyId = obj.id
      this.getList()
      /* --------------- 管理员 end ---------------- */
      this.form = obj
      this.form.logo = process.env.BASE_API + '/file/' + this.form.logo
      this.updateStatus = 'view'
    } else {
      this.getOrgSize()
      if (this.id === '0') {
        this.updateStatus = 'create'
      } else {
        this.updateStatus = 'update'
      }
    }
  },
  methods: {
    /* --------------- 管理员 start ---------------- */
    changeMode (id, enabled) {
      userEnabled(id, enabled).then(res => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    getList () {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.pageIndex = val - 1
      this.getList()
    },
    createManager () {
      this.updateStatus = 'createManager'
    },
    cancelManager () {
      this.manager.name = null
      this.manager.level = null
      this.manager.mobile = null
      this.manager.username = null
      this.manager.password = null
      this.updateStatus = 'view'
    },
    newManager (formName) {
      const set = this.$refs
      this.manager.companyId = this.form.id
      console.log(this.manager)
      set[formName].validate(valid => {
        if (valid) {
          addUser(this.manager)
            .then((res) => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.updateStatus = 'view'
              this.getList()
            })
        } else {
          return false
        }
      })
    },
    /* --------------- 管理员 end ---------------- */
    realTime (data) {
      this.previews = data
    },
    down (type) {
      console.log('type' + type)
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          this.downImg = window.URL.createObjectURL(data)
          let cc = this.downImg.lastIndexOf('/')
          this.downImg = this.downImg.substring(cc + 1, this.downImg.length)
          let formData = new FormData()
          formData.append('file', data)
          uploadLogo(formData).then(res => {
            this.imgurl = res.data
            this.form.logo = res.data
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
            this.form.logo = res.data
            this.dialogVisible = false
          })
        })
      }
    },
    imgLoad (msg) {
      console.log(msg)
    },
    modifyStat () {
      this.updateStatus = 'update'
      this.getOrgSize()
    },
    getOrgSize () {
      getOrgSize().then(res => {
        this.coInfo.orgSize = res.data
      })
      getAuthDustries().then(res => {
        this.coInfo.industryType = res.data
        console.log(this.coInfo.industryType)
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
    changeProvince (val) {
      let idx = this.provinceData.findIndex((item, index) => {
        return item.label === val
      })
      this.cityData = this.provinceData[idx].children
      this.form.companyCity = null
    },
    changeCity (val) {
      this.cityData = this.cityData.slice(0)
    },
    changeIndustry (val) {
      this.form.industry = ''
      getAuthDustryByType(val).then(res => {
        this.coInfo.industry = res.data
      })
    },
    changeIndustryType (val) {
      this.coInfo.industry = this.coInfo.industry.slice(0)
      this.form.industry = transferIndustry(val, this.coInfo.industry)
      // this.coInfo.industryType = this.coInfo.industryType.slice(0)
    },
    create (formName) {
      const set = this.$refs
      if (this.form.industryType) {
        this.form.industryType = transferIndustry(this.form.industryType, this.coInfo.industryType)
      }
      set[formName].validate(valid => {
        if (valid) {
          console.log(this.imgurl)
          // this.form.companyProvince = this.form.companyProvince.label
          addCompanies(this.form)
            .then(res => {
              this.companyCode = res.data.companyCode
              this.companyId = res.data.id
              this.centerDialogVisible = true
            })
        } else {
          return false
        }
      })
    },
    update (formName) {
      const set = this.$refs
      let id = this.form.id || this.companyId
      this.form.companyCode = this.form.companyCode || this.companyCode
      if (window.Boolean(this.form.industryType - 0)) {
        this.form.industryType = transferIndustry(this.form.industryType, this.coInfo.industryType)
      }
      set[formName].validate(valid => {
        if (valid) {
          putCompanies(id, this.form)
            .then(() => {
              console.log(this.form)
              this.$notify({
                title: '成功',
                message: '修改成功',
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
      // console.log(value)
    },
    handleSuccess (res, file, fileList) {
      // this.form.logo = URL.createObjectURL(file.raw)
      // this.option.img = file.url
      // this.dialogVisible = true
      // console.log(res)
      // console.log(file)
      // this.form.logo = process.env.BASE_API + '/file/' + fileList
      // console.log(this.form.logo)
    },
    beforeAvatarUpload (file) {
      this.option.img = window.URL.createObjectURL(file)
      // console.log(file)
      this.dialogVisible = true
      return false
      // this.form.logo = process.env.BASE_API + '/file/' + fileList
    },
    dialogRouter (status) {
      if (status === 'view') {
        this.updateStatus = 'view'
        // this.form.orgSize = transformText(this.coInfo.orgSize, this.form.orgSize)
        // this.form.industry = transformText(this.coInfo.industry, this.form.industry)
        this.centerDialogVisible = false
      } else {
        this.$router.push({path: '/company'})
      }
    },
    changeOrgSize (val) {
      // console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  /* ---------------- 管理员 start ------------------ */
  .switch{
    display: inline-flex;
    margin-top: 5px;
  }
  .switch-open {
    font-size: 6px;
    margin-left: -38px;
    color: #ffffff;
    z-index: 999;
    pointer-events: none;
  }
  .switch-close {
    margin-left: -24px;
    font-size: 6px;
    color: #ffffff;
    z-index: 999;
    pointer-events: none;
  }
  /* ---------------- 管理员 end ------------------ */
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
