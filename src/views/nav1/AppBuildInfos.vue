<template>
  <section>


    <!--列表-->
    <el-table :data="appBuildInfos" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">

      <el-table-column prop="id" :label="titles.id" sortable>
      </el-table-column>
      <el-table-column prop="appIdentifier" :label="titles.appIdentifier" sortable>
      </el-table-column>
      <el-table-column prop="platformType" :label="titles.platformType" sortable>
      </el-table-column>
      <el-table-column prop="appName" :label="titles.appName" sortable>
      </el-table-column>
      <el-table-column prop="packageFile" :label="titles.packageFile" sortable>
      </el-table-column>
      <el-table-column :label="titles.appBuildDate " sortable>
        <template scope="scope">{{ scope.row.appBuildDate | timestamp }}</template>
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
  import {getAppBuildInfoListPage} from '../../api/api'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        titles: {},
        appBuildInfos: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [] // 列表选中列

      }
    },
    methods: {

      handleCurrentChange (val) {
        this.page = val
        this.getAppBuildInfos()
      },

      getAppBuildInfos () {
        let para = {
          page: this.page - 1,
          pageSize: 20
        }
        this.listLoading = true
        getAppBuildInfoListPage(para).then((res) => {
          this.titles = res.data.keyTitles
          this.total = res.data.total
          this.appBuildInfos = res.data.list
          this.listLoading = false
        })
      },
      selsChange: function (sels) {
        this.sels = sels
      }
    },

    mounted () {
      this.getAppBuildInfos()
    }
  }

</script>

<style scoped>

</style>
