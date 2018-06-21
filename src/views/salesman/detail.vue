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
            <el-form-item label="所属公司" prop="name">
              <el-input v-model="form.name" placeholder="请选择/输入公司名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="所属团队" prop="username">
              <el-input v-model="form.empNo" placeholder="请输入所属团队"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="销售名称" prop="empNo">
              <el-input v-model="form.empNo" placeholder="请输入销售名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="对应职级" prop="employeeDate">
              <el-input v-model="form.empNo" placeholder="请输入对应职级"></el-input>
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
        <el-button class="add_btn" @click="create('form')">提 交</el-button>
      </el-col>
    </div>
    <div class="read-detail" v-if="updateStatus==='view'">
      <el-form :model="form" class="form-border">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="销售ID" prop="name">
              <span>:{{form.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属公司" prop="name">
              <span>:{{form.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属团队" prop="username">
              <span>:{{form.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售名称" prop="empNo">
              <span>:</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对应职级" prop="gender">
              <span>:</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系手机" prop="education">
              <span></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间" prop="idType">
              <span>:</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登陆账号" prop="mobile">
              <span>:</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登陆密码" prop="resumeUrl">
              <img src="" alt="">
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
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/common/js/auth'

export default {
  data () {
    return {
      form: {},
      headers: {
        Authorization: getToken()
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
      selectedOptions: [],
      fileList: [],
      options1: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
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
      }
    }
  },
  created () {
    console.log(this.$route.params.id)
    this.id = this.$route.params.id
    if (this.id === '0') {
      this.updateStatus = 'create'
    } else {
      this.updateStatus = 'update'
    }
    this.listLoading = false
  },
  methods: {
    create (formName) {
      console.log('提交了')
      this.updateStatus = 'view'
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
      })

      const set = this.$refs
      this.form.positionId = this.form.positionName
      this.form.idType = this.IDType
      this.form.marriageStatus = this.maritalStatus
      set[formName].validate(valid => {
        if (valid) {
          // addObj(this.form)
          //   .then(() => {
          //     this.dialogFormVisible = false
          //     this.getList()
          //     this.$notify({
          //       title: '成功',
          //       message: '创建成功',
          //       type: 'success',
          //       duration: 2000
          //     })
          //   })
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
  }
}
.form-border {
  border: 1px solid #EFEFEF;
  border-radius: 5px;
  padding: 20px 30px 0 20px;
}
</style>
