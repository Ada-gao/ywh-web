<template>
  <div>
    <div class="filter-container">
      <div class="detail-title">
        <span class="list-tit">信息推送记录查询</span>
      </div>
      <el-row style="margin-top: 10px">
        <el-col :span="16">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                    placeholder="输入信息推送规则名称" v-model="listQuery.ruleName"/>
          <el-date-picker v-model="listQuery.date"
                          type="daterange"
                          style="width: 275px"
                          start-placeholder="开始日期"
                          :default-time="['00:00:00', '23:59:59']"
                          end-placeholder="结束日期"/>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询
          </el-button>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-select v-model="listQuery.status"
                     placeholder="状态筛选"
                     clearable
                     @change="handleFilter1">
            <el-option
              v-for="item in states"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">信息推送记录列表</span>
      <el-button class="add_btn" @click="handleCreate">
        <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建推送
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fithighlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="信息推送批次号">
        <template slot-scope="scope">
          <span>{{scope.row.messageHistoryCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属公司">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="关联推送规则">
        <template slot-scope="scope">
          <span>{{scope.row.messageRuleName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推送目标">
        <template slot-scope="scope">
          <span>{{scope.row.target}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推送条数" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.totalCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="失败条数" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.failCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推送状态">
        <template slot-scope="scope">
          <span :style="scope.row.isComplete==='推送中'?'color:#009801':'color:#D0021B'">{{scope.row.isComplete}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a size="small" class="common_btn" @click="handleDetail(scope.row)">查看</a>
          <span> | </span>
          <a size="small" class="common_btn" @click="handleUpdate(scope.row)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     background
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="createDialog" width="30%">
      <el-form :model="pushForm" ref="pushForm" :rules="pushRules" label-width="120px" style="padding-right: 30px;">
        <el-form-item label="推送目标" prop="target">
          <el-input v-model="pushForm.target" placeholder="请输入推送目标" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="信息推送规则" prop="ruleId">
          <el-select v-model="pushForm.ruleId"
                     placeholder="请选择推送规则"
                     :disabled="title==='编辑推送'?true:false"
                     clearable
                     style="width: 100%"
                     @change="handleFilter1">
            <el-option
              v-for="item in ruleList"
              :key="item.ruleId"
              :label="item.ruleName"
              :value="item.ruleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="pushForm.sendOccasion" label="Immediately"
                    @change="$refs['pushForm'].validateField('delayMinute')">立即发送<span
            style="font-size: 12px;color: #B2B2B2;">（保存后立即发送）</span></el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="pushForm.sendOccasion" label="Delay"
                    @change="$refs['pushForm'].validateField('delayMinute')">通话结束后立即发送
          </el-radio>
        </el-form-item>
        <el-form-item prop="delayMinute">
          <el-radio v-model="pushForm.sendOccasion" label="DelayMinute">
            通话结束后
            <el-input v-model="pushForm.delayMinute" style="width: 80px;margin-left: 10px;margin-right: 10px;"
                      maxlength="6"/>
            分后发送
          </el-radio>
        </el-form-item>
        <el-form-item v-show="title === '编辑推送'">
          <el-radio v-model="pushForm.sendOccasion" label="Stop"
                    @change="$refs['pushForm'].validateField('delayMinute')">停止发送
          </el-radio>
        </el-form-item>
        <div style="text-align: right;margin-top: 30px;">
          <el-button class="search_btn" @click="createDialog = false">取 消</el-button>
          <el-button class="add_btn" @click="createPush">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      const checkNumber = (rule, value, callback) => {
        if (this.pushForm.sendOccasion === 'DelayMinute') {
          if (!value) {
            return callback(new Error('请输入时长'))
          } else {
            if (value == 0) {
              callback(new Error('输入数字的不能为0'))
            } else {
              if (!/^[0-9]+$/.test(value)) {
                callback(new Error('请输入数字'))
              } else {
                callback()
              }
            }
          }
        } else {
          callback()
        }
      }
      return {
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        list: null,
        currentPage: 1,
        states: [
          {
            label: '停止推送',
            value: '0'
          },
          {
            label: '推送中',
            value: '1'
          },
        ],
        createDialog: false,
        pushRules: {
          target: [
            {required: true, trigger: 'blur', message: '请输入推送目标'}
          ],
          ruleId: [
            {required: true, trigger: 'blur', message: '请选择推送规则'}
          ],
          delayMinute: [
            {required: false, trigger: 'blur', validator: checkNumber}
          ],
        },
        pushForm: {
          sendOccasion: 'Immediately'
        },
        ruleList: {},
        title: '',
        pushItem:null
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        if (this.listQuery.date) {
          this.listQuery.startDate = this.listQuery.date[0]
          this.listQuery.endDate = this.listQuery.date[1]
        } else {
          delete this.listQuery.startDate;
          delete this.listQuery.endDate;
        }
        let query = JSON.parse(JSON.stringify(this.listQuery))
        delete query.date
        this.Api.getMessageHistoryGroupPage(query).then(res => {
          this.list = res.data.content
          this.total = res.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            if (item.isComplete === '0') {
              item.isComplete = '停止推送'
            }
            if (item.isComplete === '1') {
              item.isComplete = '推送中'
            }
            item.createTime = this.Utils.formatDateTime(item.createTime)
          })
        })
      },
      getRule() {
        this.Api.getEnabledRule().then(res => {
          this.ruleList = res.data
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val - 1
        this.getList()
      },
      handleFilter() {
        delete this.listQuery.status
        if (!this.listQuery.ruleName) {
          delete this.listQuery.ruleName
        }
        if (!this.listQuery.date) {
          delete this.listQuery.date
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.ruleName
        delete this.listQuery.date
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleDetail(obj) {
        this.$router.push({name: 'pushDetail', query: obj})
      },
      handleUpdate(obj) {
        this.getRule()
        this.createDialog = true
        this.title = '编辑推送'
        this.pushItem = JSON.parse(JSON.stringify(obj))

        this.pushForm = {
          target: this.pushItem.target,
          ruleId: this.pushItem.ruleId,
          sendOccasion: this.pushItem.sendOccasion,
          delayMinute: this.pushItem.sendOccasion==='DelayMinute'?this.pushItem.delayMinute:'',
        }
      },
      handleCreate() {
        this.getRule()
        this.createDialog = true
        this.title = '新建推送'
        this.pushForm = {
          sendOccasion: 'Immediately'
        }
        if (this.$refs['pushForm'] !== undefined) {
          this.$refs['pushForm'].resetFields();
        }
      },
      createPush() {
        this.$refs['pushForm'].validate(valid => {
          if (valid) {
            if (this.pushForm.sendOccasion != 'DelayMinute') {
              delete this.pushForm.delayMinute
            }
            if (this.title === '新建推送') {
              this.Api.addMessageGroup(this.pushForm)
                .then((res) => {
                  this.$message({
                    message: res.data?res.data:'创建成功',
                    type: res.data?'error':'success'
                  })
                  this.createDialog = false
                  this.getList()
                })
            } else {
              this.Api.updateMessageGroup(this.pushItem.id, this.pushForm)
                .then((res) => {
                  this.$message({
                    message: res.data?res.data:'修改成功',
                    type: res.data?'error':'success'
                  })
                  this.createDialog = false
                  this.getList()
                })
            }
          } else {
            return false
          }
        })
      }
    }
  }
</script>
