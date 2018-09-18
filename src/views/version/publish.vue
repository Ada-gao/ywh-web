<template>
  <div>
    <div class="detail-title">
      <span class="list-tit">{{textMap[updateStatus]}}</span>
    </div>
    <div class="margin-line"></div>
    <div class="update-detail">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="策略名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入策略名称" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="目标版本号" prop="versionName">
              <el-input v-model="form.versionName" placeholder="请输入目标版本号" :disabled="updateStatus==='update'?true:false" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="VersionCode" prop="versionCode">
              <el-input v-model="form.versionCode" placeholder="请输入VersionCode" :disabled="updateStatus==='update'?true:false" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="升级方式" prop="promptType">
              <el-radio-group v-model="form.promptType">
                <el-radio label="Force">强制升级</el-radio>
                <el-radio label="Recommend">推荐升级</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="updateStatus==='update'?false:true">
          <el-col :span="16">
            <el-form-item label="升级文件" v-model="form.packageUrl" prop="packageUrl">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="uploadUrl"
                :headers="headers"
                :limit="1"
                :on-error="updateError"
                :on-success="updateApk"
                :show-file-list="false"
                :auto-upload="true"
                accept=".apk">
                <div style="float: left;margin-right: 10px;">
                    <el-button size="small" class="add_btn">上传升级文件（apk）</el-button>
                    <div style="font-size: 10px;color: #A1A1A1;margin-top: -10px">只能上传 apk格式文件</div>
                </div>
                <div style="float: left;">
                  {{form.packageUrl}}
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="升级说明" prop="promptText">
              <el-input type="textarea" v-model="form.promptText" :rows="5" placeholder="请输入升级说明"
                        maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="升级时间" prop="type" style="float: left"
                          @change="$refs['form'].validateField('promptDate')">
              <el-radio-group v-model="form.type">
                <el-radio label="Immediately">立即升级</el-radio>
                <el-radio label="Timing">定时升级</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="promptDate" style="float: left;margin-left: -100px">
              <el-date-picker
                v-model="form.promptDate"
                type="date"
                placeholder="选择升级时间"
                :picker-options="pickerOptions0">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="最后升级时间" prop="updateDeadline">
              <el-date-picker
                v-model="form.updateDeadline"
                type="date"
                placeholder="选择最后升级时间"
                :picker-options="pickerOptions0">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="版本状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false" style="margin-left: 60px">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="16" slot="footer" class="dialog-footer" style="text-align: center">
        <el-button class="add_btn" @click="create">提 交</el-button>
        <el-button class="search_btn" @click="cancel">取 消</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
  import * as Api from "@/api/api"
  import {getToken} from '@/common/js/auth'

  export default {
    data() {
      const checkNumber = (rule, value, callback) => {
        if (value) {
          if (value == 0){
            callback(new Error('输入数字的不能为0'))
          } else {
            if (!/^[0-9]+$/.test(value)) {
              callback(new Error('请输入数字'))
            } else {
              callback()
            }
          }
        }else{
          callback(new Error('请输入VersionCode'))
        }
      }
      const validatePromptDate = (rule, value, callback) => {
        if (this.form.type === 'Timing') {
          if (value) {
            callback()
          } else {
            callback(new Error('请输入选择升级时间'))
          }
        } else {
          callback()
        }
      }
      return {
        headers: {
          Authorization: getToken()
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        form: {
          promptType: 'Force',
          type: 'Immediately',
          status: true,
          packageUrl:''
        },
        updateStatus: '',
        textMap: {
          create: '发布新版本',
          update: '编辑新版本',
        },
        rules: {
          name: [
            {required: true, trigger: 'blur', message: '请输入策略名称'}
          ],
          versionName: [
            {required: true, trigger: 'blur', message: '请输入目标版本号'}
          ],
          versionCode: [
            {required: true, trigger: 'blur', validator: checkNumber}
          ],
          promptType: [
            {required: true, trigger: 'blur', message: '请选择升级方式'}
          ],
          packageUrl: [
            {required: true, trigger: 'blur', message: '请选择升级文件'}
          ],
          promptText: [
            {required: true, trigger: 'blur', message: '请输入升级说明'}
          ],
          type: [
            {required: true, trigger: 'blur', message: '请选择升级时间'}
          ],
          promptDate: [
            {required: false, trigger: 'blur', validator: validatePromptDate}
          ],
          updateDeadline: [
            {required: true, trigger: 'blur', message: '请选择最后升级时间'}
          ],
          status: [
            {required: true, trigger: 'blur', message: '请选择版本状态'}
          ],
        },
        uploadUrl: process.env.BASE_API + '/version/upload',
      }
    },
    created() {
      let obj = this.$route.query
      if (obj && obj.id) {
        this.form = obj
        this.updateStatus = 'update'
      } else {
        this.updateStatus = 'create'
      }
    },
    methods: {
      updateError() {
        this.$message.warning('文件上传失败');
      },
      updateApk(response, file, fileList) {
        this.form.packageUrl = response
        this.$refs['form'].validateField('packageUrl')
        this.$refs.upload.clearFiles();
      },
      create() {
        if (this.form.type !== 'Timing') {
          delete this.form.promptDate
        }
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.updateStatus === 'update'){
              Api.updateVersion(this.form.id,this.form)
                .then(res => {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/version/list'})
                })
            } else{
              Api.createVersion(this.form)
                .then(res => {
                  this.$message({
                    message: '新建成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/version/list'})
                })
            }
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.push({path: '/version/list'})
      }
    }
  }
</script>
