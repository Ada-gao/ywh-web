<template>
  <div class="com_page">
    <div class="com_head">
      <span class="com_title">版本列表</span>
      <el-button @click="handleCreate">
        <i class="fa fa-plus"/><span>发布新版本</span>
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column label="平台">
        <template slot-scope="scope"><span>{{scope.row.platform}}</span></template>
      </el-table-column>
      <el-table-column label="标识号">
        <template slot-scope="scope"><span>{{scope.row.appPackage}}</span></template>
      </el-table-column>
      <el-table-column label="版本名称">
        <template slot-scope="scope"><span>{{scope.row.versionName}}</span></template>
      </el-table-column>
      <el-table-column label="版本号">
        <template slot-scope="scope"><span>{{scope.row.versionCode}}</span></template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope"><span>{{scope.row.createTime}}</span></template>
      </el-table-column>
      <el-table-column label="升级方式">
        <template slot-scope="scope"><span>{{scope.row.promptType}}</span></template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope"><a @click="handleUpdate(scope.row)">编辑</a></template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" v-show="!listLoading"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   :page-sizes="[10,20,30,50]"
                   :page-size="listQuery.pageSize"
                   background
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
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
        currentPage: 1,
        list: null,
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.Api.getVersionPage(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            if (item.promptType === 'Silence'){
              item.promptType = '静默'
            } else if (item.promptType === 'Force'){
              item.promptType = '强制'
            }else if (item.promptType === 'Recommend'){
              item.promptType = '推荐'
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
      handleCreate() {
        this.$router.push({name: 'publishVersion'})
      },
      handleUpdate (obj) {
        this.$router.push({name: 'publishVersion', query: obj})
      },
    }
  }
</script>
