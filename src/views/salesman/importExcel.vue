<template>
  <div class="app-container">
    <upload-excel-component @on-selected-file='selected'></upload-excel-component>
    <el-button class="add_btn" v-if="tableHeader.length" size="small" style="float: right" @click="submit">确认导入</el-button>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
    <!-- <div v-if="!tableHeader.length">
      表格模版
    </div>
    <el-table v-if="!tableHeader.length" :data="modelData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of modelHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel.vue'
import { addBatch } from '@/api/api'

export default {
  name: 'uploadExcel',
  components: { UploadExcelComponent },
  data () {
    return {
      tableData: [],
      tableHeader: [],
      formData: null
    }
  },
  methods: {
    selected (data) {
      this.tableHeader = data.header
      this.tableData = data.results
    },
    submit () {
      addBatch(this.tableData).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: '导入成功',
            type: 'success',
            duration: 2000
          })
          this.$router.push({path: '/salesman'})
        }
      //   if(!res) {
      //     console.log('上传失败')
      //   } else {
      //     console.log('上传成功')
      //   }
      })
    }
  }
}
</script>
