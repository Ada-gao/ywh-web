<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">任务调配</span>
    </div>
    <div style="margin-bottom: 40px">
      <el-row>
        <el-col :span="8">
          <span class="detail-label">任务名称:</span>
          <span class="detail-value">{{taskInfo.taskName}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="detail-label">未外呼数:</span>
          <span class="detail-value">{{taskInfo.dnfCnt}}个</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="detail-label">分配规则:</span>
          <span class="detail-value">
            <el-radio-group v-model="taskInfo.assignRule">
              <el-radio label="随机平均分配"/>
              <el-radio label="自定义分配"/>
            </el-radio-group>
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="com_head">
      <span class="com_title">名单列表</span>
      <el-button @click="showDialog">
        <i class="fa fa-plus"/><span>新增销售</span>
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="销售名称">
        <template slot-scope="scope"><span>{{scope.row.uname}}</span></template>
      </el-table-column>
      <el-table-column label="关联团队">
        <template slot-scope="scope"><span>{{scope.row.team}}</span></template>
      </el-table-column>
      <el-table-column label="分配条数">
        <template slot-scope="scope"><span>{{scope.row.dnfCnt}}</span></template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope"><a @click="handleUpdate(scope.row)">删除</a></template>
      </el-table-column>
    </el-table>
    <el-col style="text-align: center;margin-top: 50px">
      <el-button class="add_btn" @click="create" :disabled="isCommit">提 交</el-button>
      <el-button class="search_btn" @click="cancel">取 消</el-button>
    </el-col>
    <el-dialog title="新增销售" :visible.sync="dialogVisible" width="30%">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" style="margin-right: 20px;">
        <el-form-item label="销售" prop="userId" class="txt">
          <el-select v-model="ruleForm.userId" placeholder="请选择销售" filterable>
            <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="add_btn" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        listLoading: true,
        list: null,
        taskInfo:{},
        rules: {
          userId: [
            {required: true, trigger: 'blur', message: '请选择销售'}
          ],
        },
        ruleForm:{},
        saleAllList:[],
        saleList:[],
        task:null,
        isCommit:false
      }
    },
    created() {
      this.task = this.$route.query.item
      this.Api.getReAssignInfo(this.task.id).then(res => {
        this.taskInfo = res.data.taskInfo
        this.list = res.data.taskDetail
        this.listLoading = false
      })
      this.Api.getAllSaleUsers('').then(res => {
        this.saleAllList = res.data
      })
    },
    methods: {
      create() {
        this.Api.updateGroup(taskGroup.id,taskGroup)
          .then((res) => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$router.push({path: '/task'})
          }).catch(() => {
          this.isCommit = false
        })
      },
      cancel() {
        this.$router.push({path: '/task'})
      },
      showDialog(){
        this.dialogVisible = true
        this.saleAllList.forEach(item=>{
          let isHas = false
          this.list.forEach(item=>{
            if (item.id){

            }
          })
          this.saleList
        })
      },
      handleSubmit() {

        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {


            this.dialogVisible = false
          } else {
            return false
          }
        })
      }
    }
  }
</script>
