<template>
  <section>
    <div class="detail-title">
      <span class="list-tit">名单明细</span>
      <el-button class="add_btn" @click="handleCheck(false)" v-show="obj.check">
        <i class="iconfont icon-jujue" style="color: #fff;margin-right: 10px"></i>不通过
      </el-button>
      <el-button class="add_btn" @click="handleCheck(true)" v-show="obj.check">
        <i class="iconfont icon-tongguo" style="color: #fff;margin-right: 10px"></i>通过
      </el-button>
    </div>
    <el-table
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="名单ID">
        <template slot-scope="scope">
          <span>{{scope.row.boundCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span>{{scope.row.companyName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人姓名">
        <template slot-scope="scope">
          <span>{{scope.row.contactName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phoneNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="年龄">
        <template slot-scope="scope">
          <span>{{scope.row.age}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="性别"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.gender}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人所在地">
        <template slot-scope="scope">
          <span>{{scope.row.residence}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名单来源">
        <template slot-scope="scope">
          <span>{{scope.row.source}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[10,20,30, 50]"
                     background
                     :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <el-dialog title="审核通过" :visible.sync="agreeDialog" width="30%">
      <el-form :model="checkForm" :rules="checkRules" ref="checkForm" label-width="100px">
        <el-form-item label="确定审核通过吗？" class="txt" label-width="160px"/>
       <!-- <el-form-item label="模版Code" prop="content" class="txt">
          <el-input v-model="checkForm.content" placeholder="请输入模版Code" maxlength="12"></el-input>
        </el-form-item>-->
      </el-form>
      <div style="text-align: right">
        <el-button class="search_btn" @click="agreeDialog = false">取 消</el-button>
        <el-button class="add_btn" @click="commit('2')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核不通过" :visible.sync="refuseDialog" width="30%">
      <el-form :model="checkForm" :rules="checkRules" ref="checkForm" label-width="80px">
        <el-form-item label="确定审核不通过吗？请输入驳回原因！" class="txt" label-width="260px"/>
        <el-form-item label="驳回原因" prop="content" class="txt">
          <el-input  type="textarea" v-model="checkForm.content" :rows="3"  placeholder="请输入驳回原因" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button class="search_btn" @click="refuseDialog = false">取 消</el-button>
        <el-button class="add_btn" @click="commit('1')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import {getLists,putReview} from '@/api/api'

  export default {
    components: {},
    data () {
      return {
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        pageIndex: 0,
        list: null,
        currentPage: 1,
        agreeDialog:false,
        refuseDialog:false,
        checkForm:{},
        checkRules: {
          content: [
            {required: true, trigger: 'blur', message: '请输入内容'}
          ],
        },
        obj:{
          check: true
        },
      }
    },
    created () {
      this.obj = this.$route.query
      this.listQuery.groupId = this.obj.productId;
      this.getList()
    },
    methods: {
      getList () {
        getLists(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            if (item.gender === 'GENTLEMAN') {
              item.gender = '男'
            }else if (item.gender === 'LADY') {
              item.gender = '女'
            }
          })
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
      handleCheck (obj) {
        delete this.checkForm.content
        if (obj){
          this.agreeDialog = true
        } else{
          this.refuseDialog = true
        }
      },
      commit (status) {
        this.$refs['checkForm'].validate(valid => {
          if (valid) {
            putReview(this.obj.id,status,this.checkForm.content)
              .then((res) => {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$router.push({path: '/check'})
              })
          } else {
            return false
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .txt {
    font-size: 13px !important;
    color: #252525 !important;
  }

</style>
