<template>
  <div class="app-container">
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
      <span style="float: right;color: #0299cc" v-show="updateStatus==='view'">{{value3 ? '启用' : '停用'}}</span>
      <el-switch
         v-show="updateStatus==='view'"
         v-model="value3"
         class="switch-btn"
         @change="changeMode">
      </el-switch>
      <el-button class="upd_btn"
                 v-show="updateStatus==='view'"
                 @click="updateStatus='update'">
        <i class="fa fa-edit"></i>修改
      </el-button>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail" v-if="updateStatus==='create'||updateStatus==='update'">
      <el-form :model="form" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="所属公司" prop="name">
              <el-select v-model="form.companyId"
                placeholder="请选择公司"
                style="width: 100%">
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
          <el-col :span="11">
            <el-form-item label="所属团队" prop="username">
              <el-input v-model="form.team" placeholder="请输入所属团队"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="销售名称" prop="empNo">
              <el-input v-model="form.name" placeholder="请输入销售名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="对应职级" prop="employeeDate">
              <el-input v-model="form.level" placeholder="请输入对应职级"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="updateStatus==='create'">
          <el-col :span="11">
            <el-form-item label="登录账号" prop="employeeDate">
              <el-input v-model="form.username" placeholder="请输入登录账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="updateStatus==='create'">
          <el-col :span="11">
            <el-form-item label="登录密码" prop="employeeDate">
              <el-input v-model="form.password" placeholder="请输入登录密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="联系手机" prop="education">
              <el-input v-model="form.mobile" :maxlength="11" placeholder="请输入联系手机"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="11" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button v-show="updateStatus==='create'" class="add_btn" @click="create('form')">提 交</el-button>
        <el-button v-show="updateStatus==='update'" class="add_btn" @click="create('form')">提 交1</el-button>
      </el-col>
    </div>
    <div class="read-detail" v-if="updateStatus==='view'">
      <el-form :model="form" class="form-border">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="销售ID:" prop="name">
              <span>{{form.id}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属公司:" prop="name">
              <span>{{form.companyName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属团队:" prop="username">
              <span>{{form.team}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售名称:" prop="empNo">
              <span>{{form.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对应职级:" prop="gender">
              <span>{{form.level}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系手机:" prop="education">
              <span>{{form.mobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:" prop="idType">
              <span>{{form.createdDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登陆账号:" prop="mobile">
              <span>{{form.username}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登陆密码:" prop="resumeUrl">
              <span>{{form.password}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="detail-title">
        <span class="tit-text">任务完成情况</span>
      </div>
      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">

        <el-table-column align="center" label="总任务完成数">
          <template slot-scope="scope">
            <span>{{scope.row.companyCode}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="总有效通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.companyName}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="平均通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.companyCity}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="总完成率">
          <template slot-scope="scope">
            <span>{{scope.row.companyCity}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="今日任务数">
          <template slot-scope="scope">
            <span>{{scope.row.companyCity}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="今日完成数">
          <template slot-scope="scope">
          <span>{{scope.row.industryType}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="今日有效通话时长">
          <template slot-scope="scope">
            <span>{{scope.row.orgSize}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="今日团队排名">
          <template slot-scope="scope">
            <span>{{scope.row.orgSize}}</span>
          </template>
        </el-table-column>

      </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     background
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/common/js/auth'
import { getUserById, updSale, addUser, getCompanies, userEnabled } from '@/api/api'

export default {
  data () {
    return {
      form: {},
      headers: {
        Authorization: getToken()
      },
      selectedOptions: [],
      fileList: [],
      value: '',
      updateStatus: '',
      textMap: {
        create: '新建销售',
        update: '修改销售详情',
        view: '销售详情页'
      },
      list: [],
      listLoading: true,
      tableKey: 0,
      total: null,
      listQuery: {
        page: 1,
        limit: 20
      },
      companies: [],
      value3: true
    }
  },
  created () {
    this.id = this.$route.params.id
    if (this.id === '0') {
      this.updateStatus = 'create'
    } else {
      this.updateStatus = 'view'
      this.getList()
    }
    this.getQuery()
    this.listLoading = false
  },
  methods: {
    getList () {
      getUserById(this.id).then(res => {
        this.form = res.data
        // console.log(this.form)
      })
    },
    getQuery () {
      getCompanies().then(res => {
        this.companies = res.data
      })
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          if (this.updateStatus === 'create') {
            // console.log(this.form)
            addUser(this.form)
              .then((res) => {
                // this.form = res.data
                // this.updateStatus = 'view'
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.$router.push({path: '/salesman'})
              })
          } else {
            updSale(this.form.id, this.form).then(res => {
              this.updateStatus = 'view'
            })
          }
        } else {
          return false
        }
      })
    },
    changeMode (val) {
      console.log(val)
      // val = val ? 1 : 0
      userEnabled(this.form.id, val).then(res => {
        console.log(res)
      })
    },
    cancel (formName) {
      this.$router.push({path: '/salesman'})
    },
    handleChange (value) {
      // console.log(value)
    },
    handleSuccess (fileList) {
      // console.log(fileList)
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      // this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      // this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-title {
  margin-top: 30px;
  margin-bottom: 20px;
  .upd_btn {
    float: right;
    border: none;
    color: #0299CC;
    i {
      margin-right: 2px;
      vertical-align: text-bottom;
    }
    &:hover {
      background: #ffff;
    }
  }
  .switch-btn {
    float: right;
    margin-left: 30px;
    display: inline-block;
    line-height: 40px;
    margin-right: 3px;
  }
}
.form-border {
  border: 1px solid #EFEFEF;
  border-radius: 5px;
  padding: 20px 30px 0 20px;
  overflow: hidden;
}
</style>
