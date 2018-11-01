<template>
  <div class="com_page">
    <div style="margin-bottom: 20px">
      <el-radio-group v-model="radio" text-color="#FFFFFF" fill="#0299CC" @change="changeRadio">
        <el-radio-button label="审核管理"></el-radio-button>
        <el-radio-button label="历史审核查询"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-show="radio==='审核管理'">
        <div class="com_head">
          <span class="com_title">{{radio}}</span>
        </div>
      <div class="com_filter">
            <el-input @keyup.enter.native="handleFilter" placeholder="输入所属公司名称" v-model="listQuery.companyName"/>
            <el-date-picker v-model="listQuery.date"
                            type="daterange"
                            style="width: 275px"
                            start-placeholder="开始日期"
                            :default-time="['00:00:00', '23:59:59']"
                            end-placeholder="结束日期"/>
            <el-button icon="search" @click="handleFilter"><i class="fa fa-search"/>查询
            </el-button>
            <el-select v-model="listQuery.type" placeholder="审核类型筛选" clearable @change="handleFilter1">
              <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
      </div>
      <div class="com_head">
        <span class="com_title">待审核列表</span>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
        <el-table-column label="审核流水号">
          <template slot-scope="scope">
            <span>{{scope.row.reviewCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属公司">
          <template slot-scope="scope">
            <span class="com-two-row">{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <div style="cursor:pointer;" @click="showStatusDialog(scope.row)">
              <span style="color:#F7BA2A">{{scope.row.status}}</span>
              <i class="fa fa-cog" style="color: #a9a4a4;margin-left: 10px"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <a @click="handleUpdate(scope.row)">查看详情</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="!listLoading"
                     :current-page.sync="currentPage"
                     background
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"/>
      <el-dialog title="审核" :visible.sync="updateStatusDialog" width="25%">
        <el-radio-group v-model="checkRadio" @change="resetForm" style="text-align: center;width: 100%">
          <el-radio label="通过"></el-radio>
          <el-radio label="不通过" style="margin-left: 120px"></el-radio>
        </el-radio-group>
        <el-form :model="checkForm" :rules="checkRules" ref="checkForm" label-width="100px" style="margin-top: 20px">
          <template v-if="checkRadio==='通过'">
            <template v-if="item.type === '推送规则'">
              <el-form-item label="模版Code" prop="content" class="txt">
                <el-input v-model="checkForm.content" placeholder="请输入模版Code" maxlength="20"></el-input>
              </el-form-item>
            </template>
          </template>
          <template v-if="checkRadio==='不通过'">
            <el-form-item label="驳回原因" prop="content" class="txt">
              <el-input  type="textarea" v-model="checkForm.content" :rows="3"  placeholder="请输入驳回原因" maxlength="50"></el-input>
            </el-form-item>
          </template>
        </el-form>
        <div style="text-align: right;margin-top: 30px">
          <el-button class="search_btn" @click="updateStatusDialog = false">取 消</el-button>
          <el-button class="add_btn" @click="handlerCheck">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-show="radio==='历史审核查询'">
        <div class="com_head">
          <span class="com_title">{{radio}}</span>
        </div>
        <div class="com_filter">
            <el-input @keyup.enter.native="handleFilter2" style="width: 190px;" class="filter-item" placeholder="输入所属公司名称"
                      v-model="listQuery2.companyName"/>
            <el-date-picker v-model="listQuery2.date"
                            type="daterange"
                            style="width: 275px"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"/>
            <el-button class="filter-item" type="primary" icon="search" @click="handleFilter2"><i class="fa fa-search"/>查询
            </el-button>
            <el-select v-model="listQuery2.status"
                       placeholder="审核状态筛选"
                       clearable
                       @change="handleFilter3">
              <el-option
                v-for="item in states"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="listQuery2.type" placeholder="审核类型筛选" clearable @change="handleFilter3">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </div>
      <div class="com_head">
        <span class="com_title">审核列表</span>
      </div>
      <el-table :data="list2" v-loading="listLoading2" element-loading-text="给我一点时间" border fit highlight-current-row>
        <el-table-column label="审核流水号">
          <template slot-scope="scope">
            <span>{{scope.row.reviewCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属公司">
          <template slot-scope="scope">
            <span class="com-two-row">{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理时间">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span :style="scope.row.status==='已通过'?'color:#009801':'color:#FF4C4C'">{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope"><a @click="handleUpdate(scope.row)">查看详情</a></template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading2">
        <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                       :current-page.sync="currentPage2"
                       background
                       :page-sizes="[10,20,30, 50]" :page-size="listQuery2.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total2">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        checkForm:{
          content:''
        },
        checkRules: {
          content: [
            {required: true, trigger: 'blur', message: '请输入内容'}
          ],
        },
        updateStatusDialog:false,
        item:null,
        checkRadio: '',
        radio: '审核管理',
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        list: null,
        currentPage: 1,
        types: [
          {
            label: '任务审核',
            value: 'OutboundTask'
          },
          {
            label: '推送规则',
            value: 'SmsTemplate'
          }
        ],
        total2: null,
        listLoading2: true,
        listQuery2: {
          pageIndex: 0,
          pageSize: 10
        },
        list2: null,
        currentPage2: 1,
        states:[
          {
            label: '审核失败',
            value:  '1'
          },
          {
            label: '审核通过',
            value: '2'
          }
        ]
      }
    },
    created() {
      this.changeRadio()
    },
    methods: {
      changeRadio(){
        if (this.radio === '审核管理'){
          this.getList()
        } else{
          this.getList2()
        }
      },
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
        this.Api.review('PENDING', query).then(res => {
          this.list = res.data.content
          this.total = res.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            if (item.type === 'OutboundTask') {
              item.type = '任务审核'
            } else if (item.type === 'SmsTemplate') {
              item.type = '推送规则'
            }
            if (item.status === '0') {
              item.status = '待审核'
            } if (item.status === '1') {
              item.status = '审核失败'
            } else if (item.status === '2') {
              item.status = '生效'
            }
            item.createTime = this.Utils.formatDateTime(item.createTime)
          })
        })
      },
      getList2() {
        if (this.listQuery2.date) {
          this.listQuery2.startDate = this.listQuery2.date[0]
          this.listQuery2.endDate = this.listQuery2.date[1]
        } else {
          delete this.listQuery2.startDate;
          delete this.listQuery2.endDate;
        }
        let query = JSON.parse(JSON.stringify(this.listQuery2))
        delete query.date
        this.Api.review('HISTORY', query).then(res => {
          this.list2 = res.data.content
          this.total2 = res.data.totalElements
          this.listLoading2 = false
          this.list2.forEach(item => {
            if (item.type === 'OutboundTask') {
              item.type = '任务审核'
            } else if (item.type === 'SmsTemplate') {
              item.type = '推送规则'
            }
            if (item.status === '1') {
              item.status = '审核失败'
            } else  if (item.status === '2'){
              item.status = '已通过'
            }
            item.createTime = this.Utils.formatDateTime(item.createTime)
            item.updateTime = this.Utils.formatDateTime(item.updateTime)
          })
        })
      },
      handleUpdate(obj) {
        if (this.radio === '审核管理'){
          obj.check = true
        } else{
          obj.check = false
        }
        if (obj.type === '任务审核') {
          this.$router.push({name: 'taskdetail', query: obj})
        }else{
          this.$router.push({name: 'pushdetail', query: obj})
        }
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
        delete this.listQuery.type
        if (!this.listQuery.companyName) {
          delete this.listQuery.companyName
        }
        if (!this.listQuery.date) {
          delete this.listQuery.date
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.companyName
        delete this.listQuery.date
        if (!this.listQuery.type) {
          delete this.listQuery.type
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleSizeChange2(val) {
        this.listQuery2.pageSize = val
        this.getList2()
      },
      handleCurrentChange2(val) {
        this.listQuery2.pageIndex = val - 1
        this.getList2()
      },
      handleFilter2() {
        delete this.listQuery2.states
        delete this.listQuery2.type
        if (!this.listQuery2.companyName) {
          delete this.listQuery2.companyName
        }
        if (!this.listQuery2.date) {
          delete this.listQuery2.date
        }
        this.listQuery2.pageIndex = 0
        this.getList2()
      },
      handleFilter3() {
        delete this.listQuery2.companyName
        delete this.listQuery2.date
        if (!this.listQuery2.states) {
          delete this.listQuery2.states
        }
        if (!this.listQuery2.type) {
          delete this.listQuery2.type
        }
        this.listQuery2.pageIndex = 0
        this.getList2()
      },
      showStatusDialog(val) {
        this.item = JSON.parse(JSON.stringify(val))
        this.checkRadio = '通过'
        this.updateStatusDialog = true
        this.resetForm()
      },
      resetForm(){
        if (this.$refs['checkForm'] !== undefined) {
          this.$refs['checkForm'].resetFields();
        }
      },
      handlerCheck() {
        let status = '1'
        if (this.checkRadio === '通过'){
          status = '2'
        }
        this.$refs['checkForm'].validate(valid => {
          if (valid) {
            this.Api.putReview(this.item.id,status,this.checkForm.content)
              .then((res) => {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getList()
                this.updateStatusDialog = false
              })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
