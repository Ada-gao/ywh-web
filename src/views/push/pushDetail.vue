<template>
  <div class="com_page">
      <div class="com_head">
        <span class="com_title">推送详情查询</span>
      </div>
      <div class="com_filter">
          <el-input @keyup.enter.native="handleFilter" placeholder="输入联系人名称" v-model="listQuery.contactName"/>
          <el-date-picker v-model="listQuery.date" type="daterange" start-placeholder="推送开始时间" :default-time="['00:00:00', '23:59:59']" end-placeholder="推送结束时间"/>
          <el-button icon="search" @click="handleFilter"><i class="fa fa-search"></i><span>查询</span></el-button>
          <el-select v-model="listQuery.status" placeholder="推送结果" clearable @change="handleFilter1">
            <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">推送详情列表</span>
      <el-button @click="handleExport">
        <i class="iconfont icon-piliangdaochu"/><span>批量导出</span>
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fithighlight-current-row>
      <el-table-column label="联系人名称">
        <template slot-scope="scope">
          <span>{{scope.row.clientName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人手机">
        <template slot-scope="scope">
          <span class="com-two-row">{{scope.row.phoneNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价（元）">
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送状态">
        <template slot-scope="scope">
          <span :style="scope.row.status==='推送成功'?'color:#009801':'color:#D0021B'">{{scope.row.status}}</span>
          <el-tooltip effect="dark" placement="bottom"  :content="scope.row.failReason" v-show="scope.row.status!=='推送成功'">
            <i class="iconfont icon-wenti" style="color:#D0021B"/>
          </el-tooltip>
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
</template>
<script>
  export default {
    data() {
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
            label: '推送失败',
            value: 'false'
          },
          {
            label: '推送成功',
            value: 'true'
          },
        ],
        id:''
      }
    },
    created() {
      this.id = this.$route.query.id
      this.getList()
    },
    methods: {
      getList() {
        let query = JSON.parse(JSON.stringify(this.listQuery))
        if (query.date) {
          query.startDate = query.date[0]
          query.endDate = query.date[1]
          delete query.date
        }
        this.Api.getMessageHistory(this.id,query).then(res => {
          this.list = res.data.content
          this.total = res.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            item.money = (item.money*0.01).toFixed(2)
            if (item.status) {
              item.status = '推送成功'
            }else  {
              item.status = '推送失败'
            }
            item.createTime = this.Utils.formatDateTime(item.createTime)
          })
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
        if (!this.listQuery.contactName) {
          delete this.listQuery.contactName
        }
        if (!this.listQuery.date) {
          delete this.listQuery.date
        }
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.contactName
        delete this.listQuery.date
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.getList()
      },
      handleExport(){
        if (this.total === 0){
          this.$message.warning(`查询当前列表为空`);
          return
        }
        let query = JSON.parse(JSON.stringify(this.listQuery))
        if (query.date) {
          query.startDate = query.date[0]
          query.endDate = query.date[1]
          delete query.date
        }
        query.pageIndex = 0
        query.pageSize = this.total
        this.Api.getMessageHistory(this.id,query).then(res => {
          let list = res.data.content
          list.forEach(item => {
            item.money = (item.money*0.01).toFixed(2)
            if (item.status) {
              item.status = '推送成功'
            }else  {
              item.status = '推送失败'
            }
            item.createTime = this.Utils.formatDateTime(item.createTime)
            item.联系人姓名 = item.clientName
            item.联系人手机 = item.phoneNum
            item.推送时间 = item.createTime
            item.单价 = item.money
            item.推送状态 = item.status
            delete item.id
            delete item.createTime
            delete item.consumptionCode
            delete item.clientName
            delete item.phoneNum
            delete item.money
            delete item.status
            delete item.failReason
          })
          this.Utils.exportExcel(list,'推送详情列表.xlsx')
        })
      },
    }
  }
</script>
