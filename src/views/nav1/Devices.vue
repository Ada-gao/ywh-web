<template>
  <section>


    <!--列表-->
    <el-table :data="devices" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">

      <el-table-column prop="cordova" :label="titles.cordova" sortable>
      </el-table-column>
      <el-table-column prop="model" :label="titles.model" sortable>
      </el-table-column>
      <el-table-column prop="isVirtual" :label="titles.isVirtual" :formatter="formatVirtual" sortable>
      </el-table-column>
      <el-table-column prop="uuid" :label="titles.uuid" sortable>
      </el-table-column>
      <el-table-column prop="version" :label="titles.version" sortable>
      </el-table-column>
      <el-table-column prop="platform" :label="titles.platform" sortable>
      </el-table-column>
      <el-table-column prop="manufacturer" :label="titles.manufacturer" sortable>
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
  import {getDeviceListPage} from '../../api/api'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        titles: {},
        devices: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [] // 列表选中列

      }
    },
    methods: {
      formatVirtual: function (row) {
        return row.isVirtual ? '是' : '否'
      },

      handleCurrentChange (val) {
        this.page = val
        this.getDevices()
      },

      getDevices () {
        let para = {
          page: this.page - 1,
          pageSize: 20
        }
        this.listLoading = true
        getDeviceListPage(para).then((res) => {
          this.titles = res.data.keyTitles
          this.total = res.data.total
          this.devices = res.data.list
          this.listLoading = false
        })
      },
      selsChange: function (sels) {
        this.sels = sels
      }
    },

    mounted () {
      this.getDevices()
    }
  }

</script>

<style scoped>

</style>
