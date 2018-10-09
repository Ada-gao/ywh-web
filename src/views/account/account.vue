<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" style="height: 140px;">
      <el-row :gutter="2" style="background: #FFFFFF;margin-top: 35px;margin-bottom: 35px;">
        <el-col :span="12">
         <div>
            <span
              style="width:70px;height:70px;background: #4AD2DB;line-height: 70px;text-align: center;float: left;border-radius: 4px;margin-right: 20px;margin-left: 100px;">
              <i class="iconfont icon-yue-copy" style="color: #FFFFFF;font-size: 50px;"></i>
          </span>
           <span style="font-size: 14px;color: #475669;">账户余额</span>
           <div style="margin-top: 10px;">
             <span style="color: #4AD2DB;"><span style="font-size: 28px;">{{account.balance?(account.balance*0.01).toFixed(2):'0.00'}}</span><span style="font-size: 14px">元</span></span>
             <span style="font-size: 12px;margin-left: 20px;" v-show="account.balance < account.balanceThreshold">
              <i class="iconfont icon-wenti" style="color:#D0021B;"/>
              <span style="color: #475669;">余额不足，请尽快充值！</span>
            </span>
           </div>
         </div>
        </el-col>
        <el-col :span="12">
          <span
            style="width:70px;height:70px;background: #FDCE82;line-height: 70px;text-align: center;float: left;border-radius: 4px;margin-right: 20px;margin-left: 100px">
              <i class="iconfont icon-yue-copy" style="color: #FFFFFF;font-size: 50px;"></i>
          </span>
          <span style="font-size: 14px;color: #475669;">累计消费金额</span>
          <div style="margin-top: 10px;">
            <span style="color: #FDCE82;"><span style="font-size: 28px;">{{account.totalConsumption?(account.totalConsumption*0.01).toFixed(2):'0.00'}}</span><span style="font-size: 14px">元</span></span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div class="detail-title" style="margin-top: 20px">
      <span class="list-tit">账户信息<span style="color: #B2B2B2;font-size: 12px">（变更账号信息，请联系对接商务经理，谢谢）</span></span>
    </div>
    <el-form :model="account" class="form-border">
      <el-row>
        <el-col :span="8">
          <span class="detail-label">账户ID:</span><span class="detail-value">{{account.accountCode}}</span></el-col>
        <el-col :span="8">
          <span class="detail-label">账户名称:</span><span class="detail-value">{{account.accountName}}</span></el-col>
        <el-col :span="8">
          <span class="detail-label">账户类型:</span><span class="detail-value">{{account.accountType}}</span></el-col>
        <el-col :span="8">
          <span class="detail-label">Account ID:</span><span class="detail-value" style="width: 70%">{{account.accountId}}</span>
        </el-col>
        <el-col :span="8">
          <span class="detail-label">账户到期时间:</span><span class="detail-value">{{account.expireDate?account.expireDate:'长期有效'}}</span></el-col>
        <el-col :span="8">
          <span class="detail-label">账户状态:</span><span class="detail-value">{{account.accountStatus}}</span>
        </el-col>
        <el-col :span="8">
          <span class="detail-label">key:</span><span class="detail-value">{{account.accountKey}}</span></el-col>
        <el-col :span="8">
          <span class="detail-label">余额警告值:</span><span class="detail-value">{{(account.warningValue * 0.01).toFixed(2)}}</span></el-col>
      </el-row>
    </el-form>

    <div class="detail-title" style="margin-top: 20px">
      <span class="list-tit">公司信息<span style="color: #B2B2B2;font-size: 12px">（变更公司信息，请联系对接商务经理，谢谢）</span></span>
    </div>
    <el-form :model="company" class="form-border">
      <el-row>
        <el-col :span="8">
          <span class="detail-label">公司ID:</span><span class="detail-value">{{company.companyCode}}</span></el-col>
        <el-col :span="8">
          <span class="detail-label">公司名称:</span><span class="detail-value">{{company.companyName}}</span></el-col>
        <el-col :span="8">
          <span class="detail-label">公司简称:</span><span class="detail-value">{{company.shortName?company.shortName:'-'}}</span></el-col>
        <el-col :span="8">
          <span class="detail-label">所属行业:</span><span class="detail-value">{{company.industryType}}</span>
        </el-col>
        <el-col :span="8">
          <span class="detail-label">公司规模:</span><span class="detail-value">{{company.orgSize}}</span></el-col>
        <el-col :span="8">
          <span class="detail-label">所在地:</span><span class="detail-value">{{company.companyProvince}}</span>
        </el-col>
        <el-col :span="8">
          <span class="detail-label">公司地址:</span><span class="detail-value">{{company.companyAddress}}</span>
        </el-col>
        <el-col :span="8">
          <span class="detail-label">联系人:</span><span class="detail-value">{{company.contact}}</span>
        </el-col>
        <el-col :span="8">
          <span class="detail-label">联系人电话:</span><span class="detail-value">{{company.contactMobile}}</span>
        </el-col>
        <el-col :span="8">
          <span class="detail-label">职务:</span><span class="detail-value">{{company.occupation}}</span>
        </el-col>
        <el-col :span="8">
          <span class="detail-label">企业微信:</span><span class="detail-value">{{company.wechatNo?company.wechatNo:'-'}}</span>
        </el-col>
        <el-col :span="8">
          <span class="detail-label">公司logo:</span><span class="detail-value"><img :src.sync="company.logo" alt="" style="width: 120px; height: 80px;"></span>
        </el-col>
      </el-row>
    </el-form>

    <div class="detail-title" style="margin-top: 22px;">
      <span class="list-tit">消费记录</span>
      <el-button class="add_btn" @click="handleExport">
        <i class="iconfont icon-piliangdaochu" style="color: #fff;margin-right: 10px"></i>批量导出
      </el-button>
    </div>
    <el-table id="consumeTable" :data="list2" v-loading="listLoading2" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="消费流水号">
        <template slot-scope="scope">{{scope.row.consumptionCode}}</template>
      </el-table-column>
      <el-table-column align="center" label="消费产品">
        <template slot-scope="scope">{{scope.row.consumptionProduct}}</template>
      </el-table-column>
      <el-table-column align="center" label="消费内容">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column align="center" label="消费金额">
        <template slot-scope="scope">{{(scope.row.money*0.01).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column align="center" label="消费时间">
        <template slot-scope="scope">{{scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="消费状态">
        <template slot-scope="scope">{{scope.row.status?'消费成功':'消费失败'}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope">{{scope.row.userName}}</template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading2">
      <div style="float: right;line-height: 30px;color: #0299CC;font-size: 14px">累计消费金额：{{(consumeMoney * 0.01).toFixed(2)}}元</div>
      <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                     :current-page.sync="currentPage2"
                     background
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery2.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total2">
      </el-pagination>
    </div>

    <div class="detail-title" style="margin-top: 22px;">
      <span class="list-tit">充值记录</span>
      <el-button class="add_btn" @click="handleExportRecharge">
        <i class="iconfont icon-piliangdaochu" style="color: #fff;margin-right: 10px"></i>批量导出
      </el-button>
    </div>
    <el-table id="rechargeTable" :data="list3" v-loading="listLoading3" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="充值编号">
        <template slot-scope="scope">{{scope.row.rechargeCode}}</template>
      </el-table-column>
      <el-table-column align="center" label="充值金额">
        <template slot-scope="scope">{{(scope.row.money * 0.01).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column align="center" label="充值时间" >
        <template slot-scope="scope">{{scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="充值状态">
        <template slot-scope="scope">{{scope.row.status?'充值成功':'充值失败'}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope">{{scope.row.userName}}</template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading3">
      <div style="float: right;line-height: 30px;color: #0299CC;font-size: 14px">累计充值金额：{{(rechargeMoney * 0.01).toFixed(2)}}元</div>
      <el-pagination @size-change="handleSizeChange3" @current-change="handleCurrentChange3"
                     :current-page.sync="currentPage3"
                     background
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery3.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total3">
      </el-pagination>
    </div>

    <div class="detail-title" style="margin-top: 22px;">
      <span class="list-tit">管理员列表</span>
      <el-button class="add_btn" @click="showCreateAdminDialog">
        <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建管理员
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">{{scope.row.userCode}}</template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column align="center" label="职务">
        <template slot-scope="scope">{{scope.row.level?scope.row.level:'-'}}</template>
      </el-table-column>
      <el-table-column align="center" label="联系手机">
        <template slot-scope="scope">{{scope.row.mobile?scope.row.mobile:'-'}}</template>
      </el-table-column>
      <el-table-column align="center" label="登录账号">
        <template slot-scope="scope">{{scope.row.username}}</template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <div class="switch">
            <el-switch class="sw"
                       v-model="scope.row.enabled"
                       active-color="#0299CC"
                       inactive-color="#C0CCDA"
                       @change="switchMode(scope.row.id, scope.row.enabled)">
            </el-switch>
            <div v-if="scope.row.enabled" class="switch-open">开启</div>
            <div v-else class="switch-close">停用</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
             @click="showUpdateInfoDialog(scope.row)">修改信息
          </a>
          |
          <a size="small" class="common_btn"
             @click="showUpdatePwdDialog(scope.row)">修改密码
          </a>
        </template>
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

    <div class="detail-title" style="margin-top: 22px;">
      <span class="list-tit">登录情况</span>
    </div>
    <el-table :data="list4" v-loading="listLoading4" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="登录账号">
        <template slot-scope="scope">{{scope.row.loginName}}</template>
      </el-table-column>
      <el-table-column align="center" label="登录时间">
        <template slot-scope="scope">{{scope.row.loginTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="登录IP地址" >
        <template slot-scope="scope">{{scope.row.ipaddr}}</template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading4">
      <div style="float: right;line-height: 30px;color: #0299CC;font-size: 14px">累计登录次数：{{total4}}次</div>
      <el-pagination @size-change="handleSizeChange4" @current-change="handleCurrentChange4"
                     :current-page.sync="currentPage4"
                     background
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery4.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total4">
      </el-pagination>
    </div>

    <el-dialog title="新建管理员" :visible.sync="createAdminDialog" width="50%">
      <el-form :model="adminForm" ref="adminForm" :rules="adminRules" label-width="100px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="adminForm.name" placeholder="输入管理员姓名" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职务">
              <el-input v-model="adminForm.level" placeholder="输入职务" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="登录账号" prop="username">
              <el-input v-model="adminForm.username" placeholder="输入登录账号" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="adminForm.password" placeholder="输入登录密码" maxlength="12"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系手机" prop="mobile">
              <el-input v-model="adminForm.mobile" placeholder="请输入联系电话" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="text-align: right">
          <el-button class="search_btn" @click="createAdminDialog = false">取 消</el-button>
          <el-button class="add_btn" @click="createAdminFrom('adminForm')">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="updateInfoDialog" width="30%">
      <el-form :model="adminForm" :rules="adminRules" ref="updateForm" label-width="80px"
               style="margin-right: 20px;">
        <el-form-item label="姓名" prop="name" class="txt">
          <el-input v-model="adminForm.name" placeholder="输入管理员姓名" maxlength="20"/>
        </el-form-item>
        <el-form-item label="职务" class="txt">
          <el-input v-model="adminForm.level" placeholder="输入职务" maxlength="10"/>
        </el-form-item>
        <el-form-item label="联系手机" class="txt" prop="mobile">
          <el-input v-model="adminForm.mobile" placeholder="请输入联系电话" maxlength="11"/>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button class="search_btn" @click="updateInfoDialog = false">取 消</el-button>
        <el-button class="add_btn" @click="updateUsers('updateForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="updatePwdDialog" width="30%">
        <el-form :model="adminForm" :rules="adminRules" ref="pwdForm" label-width="80px"
                 style="margin-right: 20px;">
          <el-form-item label="新密码" prop="password" class="txt">
            <el-input v-model="adminForm.password" placeholder="输入登录密码" maxlength="12"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button class="search_btn" @click="updatePwdDialog = false">取 消</el-button>
          <el-button class="add_btn" @click="resetPassword('pwdForm')">确 定</el-button>
        </div>
      </el-dialog>

  </div>
</template>

<script>
  import * as Utils  from '@/common/js/util'
  export default {
    data() {
      const validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入管理员姓名'))
        } else {
          callback()
        }
      }
      const validateUser = (rule, value, callback) => {
        var reg = /^[0-9a-zA-Z]+$/
        if (!value) {
          callback(new Error('请输入登录账号'))
        } else if (value.length < 4) {
          callback(new Error('登录账号不能少于4位'))
        } else if (!reg.test(value)) {
          callback(new Error('请您输入数字或字母'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        var reg = /^[0-9a-zA-Z]+$/
        if (!value) {
          callback(new Error('请输入登录密码'))
        } else if (value.length < 6) {
          callback(new Error('密码不能少于6位'))
        } else if (!reg.test(value)) {
          callback(new Error('请您输入数字或字母'))
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        if (value) {
          let reg = /^((1[3-9][0-9])+\d{8})$/
          let flag = reg.test(value)
          if (!flag) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      const checkNumber = (rule, value, callback) => {
        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (!value) {
          return callback(new Error('请输入余额提醒'))
        } else {
          if (!(reg.test(value))) {
            callback(new Error('请输入有效金额'))
          } else {
            callback()
          }
        }
      }
      return {
        accountId:null,
        account: {},
        company: {},
        list: null,
        listLoading: true,
        total: 0,
        currentPage: 1,
        listQuery: {
          pageIndex: 0,
          pageSize: 10
        },
        adminRules: {
          accountName: [
            {required: true, trigger: 'blur', message: '请输入账户名称'}
          ],
          balanceThreshold: [
            {required: true, trigger: 'blur', validator: checkNumber}
          ],
          name: [
            {required: true, trigger: 'blur', validator: validateName}
          ],
          username: [
            {required: true, trigger: 'blur', validator: validateUser}
          ],
          password: [
            {required: true, trigger: 'blur', validator: validatePass}
          ],
          mobile: [
            {required: false, trigger: 'blur', validator: validateMobile}
          ]
        },
        adminForm: {},
        updateInfoDialog: false,
        updatePwdDialog: false,
        createAdminDialog: false,
        consumeMoney:0,
        rechargeMoney:0,
        listLoading2: null,
        list2: null,
        total2: null,
        currentPage2: 1,
        listQuery2: {
          pageIndex: 0,
          pageSize: 10
        },
        listLoading3: null,
        list3: null,
        total3: null,
        currentPage3: 1,
        listQuery3: {
          pageIndex: 0,
          pageSize: 10
        },
        listLoading4: null,
        list4: null,
        total4: null,
        currentPage4: 1,
        listQuery4: {
          pageIndex: 0,
          pageSize: 10
        },
      }
    },
    created() {
      this.accountId = sessionStorage.getItem('accountId')
      this.getCompany()
      this.getList()
      this.getConsumption()
      this.getRecharge()
      this.getLoginInfo()
    },
    methods: {
      handleExport(){
        if (this.total2 === 0){
          this.$message.warning(`查询当前列表为空`);
          return
        }
        let query = JSON.parse(JSON.stringify(this.listQuery2))
        query.pageIndex = 0
        query.pageSize = this.total2
        this.$Api.getConsumptionPage(this.accountId,query).then(response => {
          let list = response.data.content
          list.forEach(item => {
            if (item.status){
              item.status = '消费成功'
            } else{
              item.status = '消费失败'
            }
            if (item.consumptionProduct === 'OutboundNameFee'){
              item.consumptionProduct = '营销线索'
            }else if (item.consumptionProduct === 'CommunicationFee'){
              item.consumptionProduct = '通信费'
            }else if (item.consumptionProduct === 'MessageFee'){
              item.consumptionProduct = '短信费'
            }
            item.money = (item.money*0.01).toFixed(2)
            item.createTime = Utils.formatDateTime(item.createTime)
            item.消费流水号 = item.consumptionCode
            item.消费产品 = item.consumptionProduct
            item.消费内容 = item.name
            item.消费金额 = item.money
            item.消费时间 = item.createTime
            item.充值状态 = item.status
            item.操作人 = item.userName
            delete item.id
            delete item.createTime
            delete item.consumptionCode
            delete item.consumptionProduct
            delete item.name
            delete item.money
            delete item.status
            delete item.userId
            delete item.userName
          })
          Utils.exportExcel(list,'消费记录列表.xlsx')
        })
      },
      handleExportRecharge(){
        if (this.total3 === 0){
          this.$message.warning(`查询当前列表为空`);
          return
        }
        let query = JSON.parse(JSON.stringify(this.listQuery3))
        query.pageIndex = 0
        query.pageSize = this.total3
        this.$Api.getRechargePageById(this.accountId,query).then(response => {
          let list = response.data.content
          list.forEach(item => {
            item.money = (item.money * 0.01).toFixed(2)
            if (item.status){
              item.status = '充值成功'
            } else{
              item.status = '充值失败'
            }
            item.createTime = Utils.formatDateTime(item.createTime)
            item.充值编号 = item.rechargeCode
            item.充值金额 = item.money
            item.充值时间 = item.createTime
            item.充值状态 = item.status
            item.操作人 = item.userName
            delete item.rechargeCode
            delete item.money
            delete item.status
            delete item.userId
            delete item.userName
            delete item.createTime
            delete item.remark
            delete item.accountName
            delete item.companyName
            delete item.accountType
          })
          Utils.exportExcel(list,'充值记录列表.xlsx')
        })
      },
      getCompany() {
        this.$Api.accountCompany(this.accountId).then(response => {
          this.account = response.data
          this.account.accountType = this.account.accountType === 'Charge' ? '付费使用' : '试用体验'
          this.account.accountStatus = this.account.accountStatus ? '生效' : '失效'
          if (this.account.expireDate){
            let date = new Date(this.account.expireDate)
            let month = date.getMonth() + 1;
            if (month < 10){
              month = '0' + month
            }
            let day = date.getDate();
            if (day < 10){
              day = '0' + day
            }
            this.account.expireDate = date.getFullYear() + '-' + month + '-' + day
          }
          this.company = this.account.company
          if (this.company.logo) {
            this.company.logo = process.env.BASE_API + '/file?fileUuid=' + this.company.logo
          }
          if (this.company.companyQualification) {
            this.company.companyQualification = process.env.BASE_API + '/file/getCompanyQualification?fileUuid=' + this.company.companyQualification
          }
        })
      },
      getList() {
        this.listLoading = true
        this.listQuery.accountId = this.accountId;
        this.$Api.getAdmin(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
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
      showCreateAdminDialog() {
        this.adminForm = {
          authorities: [{
            'name': 'ROLE_ADMIN'
          }],
        }
        this.createAdminDialog = true;
      },
      showUpdateInfoDialog(val) {
        this.adminForm = JSON.parse(JSON.stringify(val))
        this.adminForm.authorities = [{
          'name': 'ROLE_ADMIN'
        }]
        this.updateInfoDialog = true;
      },
      showUpdatePwdDialog(val) {
        this.adminForm = JSON.parse(JSON.stringify(val))
        this.adminForm.password = ''
        this.adminForm.authorities = [{
          'name': 'ROLE_ADMIN'
        }]
        this.updatePwdDialog = true;
      },
      createAdminFrom(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.adminForm.companyId = this.company.id
            this.$Api.addAdmin(this.accountId, this.adminForm)
              .then((res) => {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.getList()
                this.createAdminDialog = false
              })
          } else {
            return false
          }
        })
      },
      resetPassword(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$Api.resetPWD(this.adminForm.id, this.adminForm.password).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.updatePwdDialog = false
            })
          } else {
            return false
          }
        })
      },
      updateUsers(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$Api.updateUsers(this.adminForm.id, this.adminForm).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.updateInfoDialog = false
              this.getList()
            })
          } else {
            return false
          }
        })
      },
      switchMode (id, enabled) {
        this.$Api.userEnabled(id, enabled).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      handleSizeChange2(val) {
        this.listQuery2.pageSize = val
        this.getConsumption()
      },
      handleCurrentChange2(val) {
        this.listQuery2.pageIndex = val - 1
        this.getConsumption()
      },
      handleSizeChange3(val) {
        this.listQuery3.pageSize = val
        this.getRecharge()
      },
      handleCurrentChange3(val) {
        this.listQuery3.pageIndex = val - 1
        this.getRecharge()
      },
      handleSizeChange4(val) {
        this.listQuery4.pageSize = val
        this.getLoginInfo()
      },
      handleCurrentChange4(val) {
        this.listQuery4.pageIndex = val - 1
        this.getLoginInfo()
      },
      getLoginInfo(){
        this.$Api.getLoginLogPage(this.listQuery4).then(response => {
          this.list4 = response.data.content
          this.total4 = response.data.totalElements
          this.listLoading4 = false
          this.list4.forEach(item => {
            item.loginTime = Utils.formatDateTime(item.loginTime)
          })
        })
      },
      getConsumption(){
        this.$Api.getConsumptionPage(this.accountId,this.listQuery2).then(response => {
          this.consumeMoney = response.data.statisResult;
          this.list2 = response.data.content
          this.total2 = response.data.totalElements
          this.listLoading2 = false
          this.list2.forEach(item => {
            if (item.consumptionProduct === 'OutboundNameFee'){
              item.consumptionProduct = '营销线索'
            }else if (item.consumptionProduct === 'CommunicationFee'){
              item.consumptionProduct = '通信费'
            }else if (item.consumptionProduct === 'MessageFee'){
              item.consumptionProduct = '短信费'
            }
            item.createTime = Utils.formatDateTime(item.createTime)
          })
        })
      },
      getRecharge(){
        this.$Api.getRechargePageById(this.accountId,this.listQuery3).then(response => {
          this.rechargeMoney = response.data.statisResult;
          this.list3 = response.data.content
          this.total3 = response.data.totalElements
          this.listLoading3 = false
          this.list3.forEach(item => {
            item.createTime = Utils.formatDateTime(item.createTime)
          })
        })
      },
    }
  }
</script>
