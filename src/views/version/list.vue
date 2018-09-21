<template>
  <div>
    <div class="detail-title">
      <span class="list-tit">版本列表</span>
      <el-button class="add_btn" @click="handleCreate">
        <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>发布新版本
      </el-button>
    </div>
    <el-table :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="版本名称">
        <template slot-scope="scope">
          <span>{{scope.row.versionName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="策略名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本号">
        <template slot-scope="scope">
          <span>{{scope.row.versionCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本状态">
        <template slot-scope="scope">
          <span :style="scope.row.status?'color:#009801':'color:#D0021B'">{{scope.row.status?'启用':'停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a size="small" class="common_btn" @click="handleUpdate(scope.row)">编辑</a>
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
  </div>
</template>

<script>
  import * as Api from "@/api/api"

  export default {
    data() {
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
    created() {
      this.getList()
    },
    methods: {
      getList() {
        Api.getVersionPage(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            let date = new Date(item.createTime)
            let month = date.getMonth() + 1;
            let day = date.getDate();
            item.createTime = date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
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
      handleCreate() {
        this.$router.push({name: 'publishVersion'})
      },
      handleUpdate (obj) {
        this.$router.push({name: 'publishVersion', query: obj})
      },
    }
  }
</script>

