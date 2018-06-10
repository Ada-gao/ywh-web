<template>
  <section>

    <!--列表-->
    <el-table :data="appInfos" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">

      <el-table-column prop="appVersion" :label="titles.appVersion" sortable>
      </el-table-column>
      <el-table-column prop="appName" :label="titles.appName" sortable>
      </el-table-column>

      <el-table-column :label="titles.appCompileDate" sortable>
        <template slot-scope="scope">{{ scope.row.appCompileDate | timestamp }}</template>
      </el-table-column>
      <el-table-column prop="appIdentifier" :label="titles.appIdentifier" sortable>
      </el-table-column>
      <el-table-column prop="appBuild" :label="titles.appBuild" sortable>
      </el-table-column>

    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

  </section>
</template>

<script>
// import NProgress from 'nprogress'
import {getAppInfoListPage} from '../../api/api'

export default {
  data () {
    return {
      filters: {
        name: ''
      },
      titles: {},
      appInfos: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [] // 列表选中列

    }
  },
  methods: {

    handleCurrentChange (val) {
      this.page = val
      this.getAppInfos()
    },

    getAppInfos () {
      let para = {
        page: this.page - 1,
        pageSize: 20
      }
      this.listLoading = true
      getAppInfoListPage(para).then((res) => {
        this.titles = res.data.keyTitles
        this.total = res.data.total
        this.appInfos = res.data.list
        this.listLoading = false
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    }

  },

  mounted () {
    this.getAppInfos()
  }
}

</script>

<style scoped>

</style>
