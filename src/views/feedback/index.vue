<template>
  <section>
    <div class="filter-container">
      <div class="detail-title">
        <span class="list-tit">反馈查询</span>
      </div>
      <el-row style="margin-top: 10px">
        <el-col :span="8">
          <el-input @keyup.enter.native="handleFilter"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="输入反馈人姓名"
                    v-model="listQuery.name">
          </el-input>
          <el-button class="filter-item"
                     type="primary"
                     icon="search"
                     @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="detail-title">
      <span class="list-tit">反馈列表</span>
    </div>
    <el-table
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="序号" width="130px">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="反馈人">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="反馈问题">
        <template slot-scope="scope">
          <span class="max-line2">{{scope.row.feedbackContent}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="反馈时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="操作"
                       width="130px">
        <template slot-scope="scope">
          <a size="small"
             @click="handleUpdate(scope.row)"
             class="common_btn">查看详情</a>
        </template>
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

  </section>
</template>

<script>
  import * as Api from "@/api/api"
  import * as Utils  from '@/common/js/util'
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
      Api.getFeedback(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
        this.list.forEach(item => {
          item.createTime = Utils.formatDateTime(item.createTime)
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

<style scoped lang="scss">
  .table-add-box {
    position: relative;
    line-height: 48px;
    div {
      display: inline-block;
    }
    .list-table-tit {
      margin-bottom: 0;
    }
    .add-box {
      cursor: pointer;
      position: absolute;
      right: 0;
      width: 102px;
      height: 36px;
      /*background: #0299CC;*/
      background: #18c79c;
      line-height: 36px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      text-align: center;
      top: 6px;
    }
  }
</style>
