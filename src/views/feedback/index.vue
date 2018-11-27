<template>
  <div class="com_page">
      <div class="com_head">
        <span class="com_title">反馈查询</span>
      </div>
    <div class="com_filter">
      <el-input @keyup.enter.native="handleFilter" placeholder="输入反馈人姓名" v-model="listQuery.name"/>
      <el-button icon="search" @click="handleFilter">
        <i class="fa fa-search"/><span>查询</span>
      </el-button>
    </div>
    <div class="com_head">
      <span class="com_title">反馈列表</span>
    </div>
    <el-table
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row>
      <el-table-column label="序号" width="130px">
        <template slot-scope="scope"><span>{{scope.row.id}}</span></template>
      </el-table-column>
      <el-table-column label="反馈人">
        <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
      </el-table-column>
      <el-table-column label="反馈问题">
        <template slot-scope="scope"><span class="com-two-row">{{scope.row.feedbackContent}}</span></template>
      </el-table-column>
      <el-table-column label="反馈时间">
        <template slot-scope="scope"><span>{{scope.row.createTime}}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope"><a @click="handleUpdate(scope.row)">查看详情</a></template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading">
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
  </div>
</template>

<script>
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
      currentPage: 1,
      list: null,
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.Api.getFeedback(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
        this.list.forEach(item => {
          item.createTime = this.Utils.formatDateTime(item.createTime)
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
    handleFilter () {
      this.listQuery.pageIndex = 0
      this.currentPage = 1
      if (!this.listQuery.name) {
        delete this.listQuery.name
      }
      this.getList()
    },
    handleUpdate (query) {
      this.$router.push({path: '/feedback/detail', query})
    }
  }
}
</script>
