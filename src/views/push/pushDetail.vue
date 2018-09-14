<template>
  <div>
    <div class="filter-container">
      <div class="detail-title">
        <span class="list-tit">推送详情查询</span>
      </div>
      <el-row style="margin-top: 10px">
        <el-col :span="16">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                    placeholder="输入联系人名称" v-model="listQuery.contactName"/>
          <el-date-picker v-model="listQuery.date"
                          type="daterange"
                          style="width: 275px"
                          start-placeholder="推送开始时间"
                          :default-time="['00:00:00', '23:59:59']"
                          end-placeholder="推送结束时间"/>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询
          </el-button>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-select v-model="listQuery.status"
                     placeholder="推送结果"
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
      <span class="list-tit">推送详情列表</span>
      <el-button class="add_btn" @click="handleExport">
        <i class="iconfont icon-piliangdaochu" style="color: #fff;margin-right: 10px"></i>批量导出
      </el-button>
    </div>
    <el-table id="consumeTable" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fithighlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="联系人名称">
        <template slot-scope="scope">
          <span>{{scope.row.clientName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人手机">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.phoneNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推送时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单价（元）">
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推送状态">
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
  import * as Api from "@/api/api"
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
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
        Api.getMessageHistory(this.id,query).then(res => {
          this.list = res.data.content
          this.total = res.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            item.money = (item.money*0.01).toFixed(2)
            if (item.status === 'false') {
              item.status = '推送失败'
            }else if (item.status === 'true') {
              item.status = '推送成功'
            }
            let date = new Date(item.createTime)
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let minutes = date.getMinutes();
            item.createTime = date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + date.getHours() + ':' + (minutes < 10 ? '0' : '') + minutes
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
        this.getList()
      },
      handleFilter1() {
        delete this.listQuery.contactName
        delete this.listQuery.date
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        this.listQuery.pageIndex = 0
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
        Api.getMessageHistory(this.id,query).then(res => {
          this.list = res.data.content
          this.total = res.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            item.money = (item.money*0.01).toFixed(2)
            if (item.status === 'false') {
              item.status = '推送失败'
            }else if (item.status === 'true') {
              item.status = '推送成功'
            }
            let date = new Date(item.createTime)
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let minutes = date.getMinutes();
            item.createTime = date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + date.getHours() + ':' + (minutes < 10 ? '0' : '') + minutes
          })
          this.exportExcel(list,'推送详情列表.xlsx')
        })
      },
      exportExcel(list, name){
        const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
        wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(list);
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'})
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), name)
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
      },
    }
  }
</script>
