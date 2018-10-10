<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-radio-group v-model="radio" text-color="#FFFFFF" fill="#0299CC">
        <el-radio-button label="账户信息"></el-radio-button>
        <el-radio-button label="公司信息"></el-radio-button>
        <el-radio-button label="消费记录"></el-radio-button>
        <el-radio-button label="充值情况"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-show="radio==='账户信息'">
      <div class="detail-title">
        <span class="list-tit">{{radio}}</span>
        <span style="float: right;color: #0299cc" >{{accountStatus ? '启用' : '停用'}}</span>
        <el-switch
          v-model="accountStatus"
          class="switch-btn"
          @change="changeMode">
        </el-switch>
        <el-button class="upd_btn" @click="modifyStat">
          <i class="fa fa-edit"
             style="font-size: 22px;margin-right: 5px;vertical-align: middle;"></i>
          <i style="font-style: normal;">修改</i>
        </el-button>
      </div>
      <div class="margin-line"></div>
      <div class="read-detail">
        <el-form :model="account" class="form-border">
          <el-row>
            <el-col :span="8"><span class="detail-label">账户ID:</span><span
              class="detail-value">{{account.accountCode}}</span></el-col>
            <el-col :span="8"><span class="detail-label">账户名称:</span><span
              class="detail-value">{{account.accountName}}</span></el-col>
            <el-col :span="8"><span class="detail-label">账户类型:</span><span
              class="detail-value">{{account.accountType}}</span></el-col>
          </el-row>
            <el-row>
              <el-col :span="8"><span class="detail-label">Account ID:</span><span class="detail-value" style="width: 70%">{{account.accountId}}</span>
              </el-col>
              <el-col :span="8"><span class="detail-label">账户到期时间:</span><span
                class="detail-value">{{account.expireDate?account.expireDate:'长期有效'}}</span></el-col>
              <el-col :span="8"><span class="detail-label">账户状态:</span><span class="detail-value">{{accountStatus? '生效' : '失效'}}</span>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span="8"><span class="detail-label">key:</span><span
              class="detail-value">{{account.accountKey}}</span></el-col>
            <el-col :span="8"><span class="detail-label">余额提醒:</span><span class="detail-value">{{(account.balanceThreshold * 0.01).toFixed(2)}}</span>
            </el-col>
            <el-col :span="8"><span class="detail-label">余额警告值</span><span class="detail-value">{{(account.warningValue * 0.01).toFixed(2)}}</span>
            </el-col>
          </el-row>
        </el-form>
        <div class="detail-title" style="margin-top: 22px;">
          <span class="list-tit">管理员列表</span>
          <el-button class="add_btn" @click="showCreateAdminDialog">
            <i class="fa fa-plus" style="color: #fff;margin-right: 10px"></i>新建管理员
          </el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%;">
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
        <el-dialog title="修改账户" :visible.sync="updateAccountDialog" width="50%">
          <el-form :model="accountForm" ref="accountForm" :rules="adminRules" label-width="100px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="账户名称" prop="accountName">
                  <el-input v-model="accountForm.accountName" placeholder="请输入账户名称" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="余额提醒" prop="balanceThreshold">
                  <el-input v-model="accountForm.balanceThreshold" placeholder="请输入余额提醒" maxlength="8"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="账户到期时间">
                  <el-date-picker
                    v-model="timeDefaultShow"
                    type="date"
                    style="width: 100%"
                    placeholder="选择账户到期时间"
                    :picker-options="pickerOptions0">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="余额警告值" prop="warningValue">
                  <el-input v-model="accountForm.warningValue" placeholder="请输入余额警告值" maxlength="8"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="text-align: right">
              <el-button class="search_btn" @click="updateAccountDialog = false">取 消</el-button>
              <el-button class="add_btn" @click="updateAccount">确 定</el-button>
            </div>
          </el-form>
        </el-dialog>
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
            <el-button class="add_btn" @click="updateUsers">确 定</el-button>
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
            <el-button class="add_btn" @click="resetPassword">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div v-show="radio==='公司信息'">
      <div class="detail-title">
        <span class="list-tit">{{radio}}</span>
        <el-button class="upd_btn" @click="handleUpdate">
          <i class="fa fa-edit" style="font-size: 22px;margin-right: 5px;vertical-align: middle;"></i>
          <i style="font-style: normal;">修改</i>
        </el-button>
      </div>
      <div class="margin-line"></div>
      <div class="read-detail">
        <el-form :model="form" class="form-border">
          <el-row>
            <el-col :span="11"><span class="detail-label">公司ID:</span><span
              class="detail-value">{{form.companyCode}}</span></el-col>
            <el-col :span="11"><span class="detail-label">公司名称:</span><span
              class="detail-value">{{form.companyName}}</span></el-col>
          </el-row>
            <el-row>
              <el-col :span="11"><span class="detail-label">公司简称:</span><span
                class="detail-value">{{form.shortName?form.shortName:'-'}}</span></el-col>
              <el-col :span="11"><span class="detail-label">所在地:</span><span class="detail-value">{{form.companyProvince}}-{{form.companyCity}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11"><span class="detail-label">公司地址:</span><span
                class="detail-value">{{form.companyAddress}}</span></el-col>
              <el-col :span="11"><span class="detail-label">所属行业:</span><span
                class="detail-value">{{form.industryType}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="11"><span class="detail-label">公司规模:</span><span class="detail-value">{{form.orgSize}}</span>
              </el-col>
              <el-col :span="11"><span class="detail-label">联系人:</span><span class="detail-value">{{form.contact}}</span>
              </el-col>
            </el-row>
          <el-row>
            <el-col :span="11"><span class="detail-label">职务:</span><span
              class="detail-value">{{form.occupation}}</span></el-col>
            <el-col :span="11"><span class="detail-label">联系手机:</span><span
              class="detail-value">{{form.contactMobile}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="11"><span class="detail-label">企业邮箱:</span><span class="detail-value">{{form.email}}</span>
            </el-col>
            <el-col :span="11"><span class="detail-label">企业微信:</span><span
              class="detail-value">{{form.wechatNo?form.wechatNo:'-'}}</span></el-col>
          </el-row>
           <el-row>
             <el-col :span="22">
               <span class="detail-label" style="line-height: 80px;">公司LOGO:</span>
               <img :src="form.logo" alt="" style="width: 120px; height: 80px;">
             </el-col>
           </el-row>
            <el-row>
              <el-col :span="22" style="margin-top: 20px">
                <span class="detail-label" style="line-height: 80px;">公司资质:</span>
                <template v-for="item in companyQualifications">
                  <img :src="item" alt="" style="width: 120px; height: 80px;margin-right: 10px;">
                </template>
              </el-col>
            </el-row>
          <el-row>
            <el-col :span="22" style="margin-top: 20px"><span class="detail-label"
                                                              style="line-height: normal">备注:</span>
              <div class="detail-value"
                   style="max-width:600px;line-height:normal;word-wrap:break-word; word-break:normal;">{{form.remark?form.remark:'-'}}
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-show="radio==='消费记录'">
      <div class="detail-title" style="margin-top: 22px;">
        <span class="list-tit">{{radio}}</span>
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
          <template slot-scope="scope">{{scope.row.money}}</template>
        </el-table-column>
        <el-table-column align="center" label="消费时间">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="消费状态">
          <template slot-scope="scope">{{scope.row.status}}</template>
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
    </div>
    <div v-show="radio==='充值情况'">
      <div class="detail-title" style="margin-top: 22px;">
        <span class="list-tit">{{radio}}</span>
        <el-button class="add_btn" @click="handleExportRecharge">
          <i class="iconfont icon-piliangdaochu" style="color: #fff;margin-right: 10px"></i>批量导出
        </el-button>
        <el-button class="add_btn" @click="handleRecharge" style="margin-right: 20px">
          <i class="iconfont icon-chongzhi" style="color: #fff;margin-right: 10px"></i>账户充值
        </el-button>
      </div>
      <el-table id="rechargeTable" :data="list3" v-loading="listLoading3" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="充值编号">
          <template slot-scope="scope">{{scope.row.rechargeCode}}</template>
        </el-table-column>
        <el-table-column align="center" label="充值金额">
          <template slot-scope="scope">{{scope.row.money}}</template>
        </el-table-column>
        <el-table-column align="center" label="充值时间" >
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="充值状态">
          <template slot-scope="scope">{{scope.row.status}}</template>
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
    </div>
  </div>
</template>

<script>
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
      const checkValue = (rule, value, callback) => {
        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (value) {
          if (reg.test(value)) {
            if (this.accountForm.balanceThreshold) {
              if (parseInt(value) > this.accountForm.balanceThreshold){
                callback(new Error('余额警告值不能大于余额提醒值'))
              } else{
                callback()
              }
            }else{
              callback()
            }
          } else {
            callback(new Error('请输入有效金额'))
          }
        } else {
          return callback(new Error('请输入余额警告值'))
        }
      }
      return {
        consumeMoney:0,
        rechargeMoney:0,
        timeDefaultShow:null,
        radio: '账户信息',
        tab1Status: true,
        form: {},
        account: {},
        listLoading: null,
        list: null,
        total: null,
        currentPage: 1,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        listQuery: {
          authorityName: 'ROLE_ADMIN',
          pageIndex: 0,
          pageSize: 10
        },
        updateAccountDialog:false,
        updateInfoDialog: false,
        updatePwdDialog: false,
        createAdminDialog: false,
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
          ],
          warningValue:[
            {required: true, trigger: 'blur', validator: checkValue}
          ]
        },
        adminForm: {},
        accountForm:{
          accountName:'',
          balanceThreshold:'',
          expireDate:'',
          warningValue:''
        },
        accountId: '',
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
        accountStatus: null,
        companyQualifications:[]
      }
    },
    created() {
      this.form = this.$route.query
      this.accountId = this.form.id
      this.accountStatus = this.form.accountStatus
      this.getCompany()
      this.getList()
      this.getConsumption()
      this.getRecharge()
    },
    methods: {
      changeMode (val){
        this.Api.enabledAccount(this.accountId, val).then(res => {
          this.accountStatus = val
          if (val) {
            this.$message({
              message: '启用成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '停用成功',
              type: 'success'
            })
          }
          this.getList()
        })
      },
      switchMode (id, enabled) {
        this.Api.userEnabled(id, enabled).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      getList() {
        this.listLoading = true
        this.listQuery.accountId = this.accountId;
        this.Api.getAdmin(this.listQuery).then(response => {
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
      getConsumption(){
        this.Api.getConsumptionPage(this.accountId,this.listQuery2).then(response => {
          this.consumeMoney = response.data.statisResult;
          this.list2 = response.data.content
          this.total2 = response.data.totalElements
          this.listLoading2 = false
          this.list2.forEach(item => {
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
            item.createTime = this.Utils.formatDateTime(item.createTime)
          })
        })
      },
      getRecharge(){
        this.Api.getRechargePageById(this.accountId,this.listQuery3).then(response => {
          this.rechargeMoney = response.data.statisResult;
          this.list3 = response.data.content
          this.total3 = response.data.totalElements
          this.listLoading3 = false
          this.list3.forEach(item => {
            item.money = (item.money * 0.01).toFixed(2)
            if (item.status){
              item.status = '充值成功'
            } else{
              item.status = '充值失败'
            }
            item.createTime = this.Utils.formatDateTime(item.createTime)
          })
        })
      },
      handleExport(){
        if (this.total2 === 0){
          this.$message.warning(`查询当前列表为空`);
          return
        }
        let query = JSON.parse(JSON.stringify(this.listQuery2))
        query.pageIndex = 0
        query.pageSize = this.total2
        this.Api.getConsumptionPage(this.accountId,query).then(response => {
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
            item.money = item.money*0.01.toFixed(2)
            item.createTime = this.Utils.formatDateTime(item.createTime)
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
          this.Utils.exportExcel(list,'消费记录列表.xlsx')
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
        this.Api.getRechargePageById(this.accountId,query).then(response => {
          let list = response.data.content
          list.forEach(item => {
            item.money = (item.money * 0.01).toFixed(2)
            if (item.status){
              item.status = '充值成功'
            } else{
              item.status = '充值失败'
            }
            item.createTime = this.Utils.formatDateTime(item.createTime)
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
          this.Utils.exportExcel(list,'充值记录列表.xlsx')
        })
      },
      handleUpdate(){
        this.$router.push({path: '/company/create', query: this.form})
      },
      handleRecharge(){
        this.$router.push({name: 'recharge',query:this.form})
      },
      modifyStat(){
        if (this.$refs['accountForm']){
          this.$refs['accountForm'].resetFields()
        }
        let account = JSON.parse(JSON.stringify(this.account))
        this.accountForm.accountName = account.accountName
        this.accountForm.balanceThreshold = (account.balanceThreshold*0.01).toFixed(2)
        this.accountForm.warningValue = (account.warningValue*0.01).toFixed(2)
        if (account.expireDate){
          this.timeDefaultShow = new Date(account.expireDate)
        }
        this.updateAccountDialog = true
      },
      getCompany() {
        this.Api.accountCompany(this.accountId).then(res => {
          this.account = res.data
          this.account.accountType = this.account.accountType === 'Charge' ? '付费使用' : '试用体验'
          this.account.accountStatus = this.account.accountStatus ? '生效' : '失效'
          if (this.account.expireDate) {
            this.account.expireDate = this.Utils.formatDate(this.account.expireDate)
          }
          this.form = this.account.company
          if (this.form.logo) {
            this.form.logo = process.env.BASE_API + '/file?fileUuid=' + this.form.logo
          }
          if (this.form.companyQualification) {
            this.companyQualifications = this.form.companyQualification.split(',');
            this.companyQualifications.forEach((item,index)=>{
              this.companyQualifications[index] = process.env.BASE_API + '/file/getCompanyQualification?fileUuid=' + item
            })
          }
        })
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
            this.adminForm.companyId = this.form.id
            this.Api.addAdmin(this.accountId, this.adminForm)
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
      resetPassword() {
        this.$refs['pwdForm'].validate((valid) => {
          if (valid) {
            this.Api.resetPWD(this.adminForm.id, this.adminForm.password).then(res => {
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
      updateUsers() {
        this.$refs['updateForm'].validate((valid) => {
          if (valid) {
            this.Api.updateUsers(this.adminForm.id, this.adminForm).then(res => {
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
      updateAccount() {
        this.$refs['accountForm'].validate((valid) => {
          if (valid) {
            this.accountForm.expireDate = this.timeDefaultShow
            this.Api.updateAccount(this.accountId, this.accountForm).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.updateAccountDialog = false
              this.getCompany()
            })
          } else {
            return false
          }
        })
      },
    }
  }
</script>

<style lang="scss">

  .switch {
    display: inline-flex;
  }

  .switch-open {
    font-size: 10px;
    width: 55px;
    color: #ffffff;
    z-index: 999;
    pointer-events: none;
    padding-left: 10px;
    text-align: left;
    margin-left: -55px;
  }

  .switch-close {
    font-size: 10px;
    width: 55px;
    margin-left: -55px;
    text-align: right;
    color: #ffffff;
    padding-right: 10px;
    z-index: 999;
    pointer-events: none;
  }

  .txt > .el-form-item__label {
    line-height: 40px !important;
  }

  .sw > .el-switch__core {
    width: 55px !important;
    line-height: 40px !important;
  }

  .upd_btn {
    float: right;
    border: none;
    color: #0299CC;
    &:hover {
      background: #ffff;
    }
    i {
      margin-right: 2px;
      vertical-align: text-bottom;
    }

  }
  .switch-btn {
    float: right;
    margin-left: 30px;
    display: inline-block;
    line-height: 40px;
    margin-right: 3px;
  }
  .form-border {
    border: 1px solid #EFEFEF;
    border-radius: 5px;
    padding: 20px 30px;
  }

</style>
