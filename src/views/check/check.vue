<template>
  <section>
    <div style="margin-bottom: 20px">
      <el-radio-group v-model="radio">
        <el-radio-button label="审核管理"></el-radio-button>
        <el-radio-button label="历史审核查询"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-show="radio==='审核管理'">
      <div class="filter-container">
        <div class="detail-title">
          <span class="list-tit">{{radio}}</span>
        </div>
        <el-row>
          <el-col :span="14">
            <el-input @keyup.enter.native="handleFilter" style="width: 190px;" class="filter-item" placeholder="输入公司名称"
                      v-model="listQuery.companyName"/>
            <el-date-picker v-model="listQuery.date"
                            type="daterange"
                            style="width: 275px"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"/>
            <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"/>查询
            </el-button>
          </el-col>
          <el-col :span="10" style="text-align: right;">
            <el-select v-model="listQuery.type" placeholder="审核类型" clearable @change="handleFilter1">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div class="detail-title">
        <span class="list-tit">待审核列表</span>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">
        <el-table-column align="center" label="审核流水号">
          <template slot-scope="scope">
            <span>{{scope.row.reviewCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属公司">
          <template slot-scope="scope">
            <span>{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template slot-scope="scope">
            <span :style="scope.row.status==='已通过'?'color:#009801':'color:#F7BA2A'">{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <a size="small" class="common_btn" @click="handleUpdate(scope.row)">查看详情</a>
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
    </div>
    <div v-show="radio==='历史审核查询'">
    </div>
  </section>
</template>

<script>
  import {review} from '@/api/api'

  export default {
    data() {
      return {
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
            label: '外呼名单',
            value: 'OutboundName'
          },
          {
            label: '短信模板',
            value: 'SmsTemplate'
          }
        ],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        let pageTab = 'PENDING'
        if (this.radio != '审核管理') {
          pageTab = 'HISTORY'
        }
        if (this.listQuery.date) {
          this.listQuery.startDate = this.listQuery.date[0]
          this.listQuery.endDate = this.listQuery.date[1]
        } else {
          delete this.listQuery.startDate;
          delete this.listQuery.endDate;
        }
        let query = JSON.parse(JSON.stringify(this.listQuery))
        delete query.date
        review(pageTab, query).then(res => {
          this.list = res.data.content
          this.total = res.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            if (item.type === 'OutboundName') {
              item.type = '外呼名单'
            } else if (item.type === 'SmsTemplate') {
              item.type = '推送规则'
            }
            if (item.status === '0') {
              item.status = '待审核'
            } else {
              item.status = '已通过'
            }
            let date = new Date(item.createTime)
            item.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          })
        })
      },
      handleUpdate(obj) {
        alert(obj)
        // this.$router.push({name: 'detail', query: obj})
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
    }
  }
</script>

<style scoped>

</style>
