<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">试用查询</span>
    </div>
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入公司名称" v-model="listQuery.companyName"/>
      <el-button icon="search" @click="handleFilter">
        <i class="fa fa-search"/><span>查询</span>
      </el-button>
      <el-select v-model="listQuery.status" placeholder="试用状态筛选" clearable @change="handleFilter1">
        <el-option v-for="item in statusList" :key="item.label" :label="item.label" :value="item.value"/>
      </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">试用列表</span>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间"  border fit highlight-current-row>
      <el-table-column label="序号">
        <template slot-scope="scope"><span>{{scope.row.id}}</span></template>
      </el-table-column>
      <el-table-column label="公司名称">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.companyName}}</span></template>
      </el-table-column>
      <el-table-column label="联系人姓名">
        <template slot-scope="scope"><span>{{scope.row.contact}}</span></template>
      </el-table-column>
      <el-table-column label="手机号码">
        <template slot-scope="scope"><span>{{scope.row.mobile}}</span></template>
      </el-table-column>
      <el-table-column  label="所在地">
        <template slot-scope="scope"><span>{{scope.row.companyCity}}</span></template>
      </el-table-column>
      <el-table-column label="所属行业" show-overflow-tooltip>
        <template slot-scope="scope"><span>{{scope.row.industryType}}</span></template>
      </el-table-column>
      <el-table-column  label="公司规模">
        <template slot-scope="scope"><span>{{scope.row.orgSize}}</span></template>
      </el-table-column>
      <el-table-column  label="来源">
        <template slot-scope="scope"><span>{{scope.row.source}}</span></template>
      </el-table-column>
      <el-table-column  label="产品类别">
        <template slot-scope="scope"><span>{{scope.row.productType}}</span></template>
      </el-table-column>
      <el-table-column  label="试用状态">
        <template slot-scope="scope">
          <div style="cursor:pointer;" @click="showDialog(scope.row.id, scope.row.status)">
            <i :class="{
                        'stat-yel': scope.row.status === '新申请',
                        'stat-green': scope.row.status === '试用中',
                        'stat-red': scope.row.status === '试用结束'}"></i>
            <span :class="{
                        'text-yel': scope.row.status === '新申请',
                        'text-green': scope.row.status === '试用中',
                        'text-red': scope.row.status === '试用结束'}">{{scope.row.status}}</span>
            <i class="fa fa-cog" style="color: #a9a4a4"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="申请时间">
        <template slot-scope="scope"><span>{{scope.row.createTime}}</span></template>
      </el-table-column>
      <el-table-column  label="操作" width="150">
        <template slot-scope="scope"><a @click="handleUpdate(scope.row)">查看详情</a></template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange"
                   v-show="!listLoading"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   :page-sizes="[10,20,30, 50]"
                   background
                   :page-size="listQuery.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"/>
    <el-dialog title="提示" :visible.sync="isDialogShow" width="350px" :center="false">
      <el-radio-group v-model="radio" style="text-align: center;width: 100%">
        <el-radio label="试用中"/>
        <el-radio label="试用结束" style="margin-left: 100px"/>
      </el-radio-group>
      <div style="text-align: right;margin-top: 30px">
        <el-button class="search_btn" @click="isDialogShow = false">取 消</el-button>
        <el-button class="add_btn" @click="updateStatus">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio: '',
        id: '',
        isDialogShow: false,
        tableKey: 0,
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        currentPage: 1,
        list: null,
        orgSize: [],
        statusList: [
          {
            value: '0',
            label: '新申请'
          },
          {
            value: '1',
            label: '试用中'
          },
          {
            value: '2',
            label: '试用结束'
          }
        ],
        products: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.Api.getTrial(this.listQuery).then((response) => {
          this.list = response.data.content
          this.converStatus(this.list)
          this.total = response.data.totalElements
          this.listLoading = false
          this.Api.getOrgSize().then(res => {
            this.orgSize = res.data
            this.list.forEach(item => {
              item.createTime = this.Utils.formatDate(item.createTime)
            })
          })
        })
      },
      showDialog(id) { // 点击item弹出与item.id对应的修改试用状态弹框
        this.id = ''
        this.isDialogShow = true
        this.id = id
        this.list.forEach(item => {
          if (item.id === id) {
            this.radio = item.status
            return false
          }
        })
      },
      converStatus(data) { // 将'0'/'1'/'2' 转换为 新申请/试用中/试用结束
        data.forEach((ele, index) => {
          switch (ele.status) {
            case '0':
              ele.status = '新申请'
              break
            case '1':
              ele.status = '试用中'
              break
            case '2':
              ele.status = '试用结束'
              break
          }
        })
      },
      converStatus1(status) { // 将试用中/试用结束 转换为 '1'/'2'
        switch (status) {
          case '试用中':
            status = '1'
            break
          case '试用结束':
            status = '2'
            break
        }
        return status
      },
      updateTrialText(id, radio) {
        this.list.forEach((ele, index) => {
          if (ele.id === id) {
            ele.status = radio
            return false
          }
        })
      }, // 更新试用状态时，将对应的文字修改过来
      updateStatus() { // 更新试用状态
        this.isDialogShow = false
        let data = {
          status: this.converStatus1(this.radio)
        }
        this.Api.getTrailDet(this.id, data).then(res => {
          this.updateTrialText(this.id, this.radio)
          this.$message({
            message: '修改成功',
            type: 'success'
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
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.listQuery.status = null
        delete this.listQuery.status
        if (!this.listQuery.companyName) {
          delete this.listQuery.companyName
        }
        this.getList()
      },
      handleFilter1() {
        this.listQuery.pageIndex = 0
        this.currentPage = 1
        this.listQuery.companyName = ''
        delete this.listQuery.companyName
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        this.getList()
      },
      handleUpdate(params) {
        this.$router.push({name: 'trialDetail', query: params})
      }
    }
  }
</script>

<style scoped lang="scss">
  .stat-yel,
  .stat-green,
  .stat-red {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    vertical-align: unset;
  }

  .stat-yel {
    background: #F7BA2A;
  }

  .stat-green {
    background: #34CD00;
  }

  .stat-red {
    background: #FF4C4C;
  }

  .text-yel {
    color: #F7BA2A;
  }

  .text-green {
    color: #34CD00;
  }

  .text-red {
    color: #FF4C4C;
  }
</style>
