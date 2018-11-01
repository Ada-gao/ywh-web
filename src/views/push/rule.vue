<template>
  <div class="com_page">
      <div class="com_head">
        <span class="com_title">信息推送规则查询</span>
      </div>
      <div class="com_filter">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入信息推送规则名称" v-model="listQuery.ruleName"/>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter"><i class="fa fa-search"></i>查询</el-button>
          <el-select v-model="listQuery.team" placeholder="团队筛选" clearable @change="handleFilter1">
            <el-option v-for="(item, index) in teams" :key="index" :label="item" :value="item"/>
          </el-select>
        <el-select v-model="listQuery.companyId" placeholder="公司筛选" clearable :disabled="isSuperAdmin !== 'true'" @change="changeCompany">
          <el-option v-for="item in companies" :key="item.id" :label="item.companyName" :value="item.id"/>
        </el-select>
        <el-select v-model="listQuery.status" placeholder="状态筛选" clearable @change="handleFilter1">
          <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
    </div>
    <div class="com_head">
      <span class="com_title">信息推送规则组列表</span>
      <el-button @click="handleCreate">
        <i class="fa fa-plus" /><span>新建推送规则</span>
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fithighlight-current-row style="width: 100%">
      <el-table-column  label="规则ID">
        <template slot-scope="scope">
          <span>{{scope.row.messageRuleCode}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="推送规则名称">
        <template slot-scope="scope">
          <span class="com-two-row">{{scope.row.ruleName}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="所属公司">
        <template slot-scope="scope">
          <span class="com-two-row">{{scope.row.companyName}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="所属团队">
        <template slot-scope="scope">
          <span>{{scope.row.team?scope.row.team:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="状态">
        <template slot-scope="scope">
          <span :style="scope.row.status==='生效'?'color:#17C263': scope.row.status==='待审核'?'color:#F7BA2A':'color:#D0021B'">{{scope.row.status}}</span>
          <el-tooltip effect="dark" placement="bottom"  :content="scope.row.rejectReason" v-show="scope.row.status==='审核失败'">
            <i class="iconfont icon-wenti" style="color:#D0021B"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope"><a @click="handleDetail(scope.row)">查看详情 </a> | <a @click="handleUpdate(scope.row)">修改信息 </a></template>
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
  export default {
    data () {
      return {
        total: null,
        listLoading: true,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        list: null,
        currentPage: 1,
        states:[
          {
            label: '待审核',
            value:  '0'
          },
          {
            label: '审核失败',
            value:  '1'
          },
          {
            label: '生效',
            value: '2'
          }
        ],
        companies:{},
        teams:{},
        isSuperAdmin:'false',
      }
    },
    created () {
      this.getList()
      this.getQuery()
      let companyId = sessionStorage.getItem('companyId')
      if (companyId) {
        this.listQuery.companyId = parseInt(companyId)
        this.changeCompany()
      }
      this.isSuperAdmin = sessionStorage.getItem('isSuperAdmin')
    },
    methods: {
      getList () {
        this.Api.messageRulePage(this.listQuery).then(res => {
          this.list = res.data.content
          this.total = res.data.totalElements
          this.listLoading = false
          this.list.forEach(item => {
            if (item.status === '0') {
              item.status = '待审核'
            } if (item.status === '1') {
              item.status = '审核失败'
            } else if (item.status === '2') {
              item.status = '生效'
            }
            item.createTime = this.Utils.formatDateTime(item.createTime)
          })
        })
      },
      getQuery() {
        this.Api.getCompanies().then(res => {
          this.companies = res.data
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
        delete this.listQuery.status
        if (this.isSuperAdmin === 'true'){
          delete this.listQuery.companyId
        }
        delete this.listQuery.team
        if (!this.listQuery.ruleName) {
          delete this.listQuery.ruleName
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      changeCompany() {
        delete this.listQuery.team
        this.Api.getTeams({companyId: this.listQuery.companyId}).then(res => {
          this.teams = res.data
        })
        this.handleFilter1()
      },
      handleFilter1 () {
        delete this.listQuery.ruleName
        if (!this.listQuery.status) {
          delete this.listQuery.status
        }
        if (!this.listQuery.team) {
          delete this.listQuery.team
        }
        this.listQuery.pageIndex = 0
        this.getList()
      },
      handleDetail (obj) {
        this.$router.push({name: 'ruleDetail', query: obj})
      },
      handleUpdate (obj) {
        this.$router.push({name: 'createRule', query: obj})
      },
      handleCreate () {
        this.$router.push({name: 'createRule'})
      }
    }
  }
</script>
