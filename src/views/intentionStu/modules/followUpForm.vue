<template>
  <div>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item v-bind="invoiceLayout" label="时间" prop="logDate">
        <a-date-picker v-model="form.logDate" format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" />
        <a-checkbox v-show="showAll" class="ml20" :checked="form.visitType == 'Y'" @change="checkboxChange" />
        <span v-show="showAll" class="ml10">到访</span>
      </a-form-model-item>
      <a-form-model-item v-bind="invoiceLayout" label="跟进内容" prop="logRemark">
        <a-textarea v-model="form.logRemark" style="width: 100%;" placeholder="请输入更进内容" :rows="5" />
      </a-form-model-item>
      <a-form-model-item v-bind="invoiceLayout" label=" " :colon="false">
        <div class="between">
          <div>
            <UploadSth btnText="附件上传" ref="uploadSth" :required="false" filePath="reason" v-if="form.visitType == 'N'"></UploadSth>
          </div>
          <a-button type="primary" @click="handleSubmit" :loading="confirmLoading">提交</a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import UploadSth from '@/components/UploadSth'
import { saveStuUserLog } from '@/api/intentionStu/adviser'

const invoiceLayout = {
  labelCol: { md: { span: 3 } },
  wrapperCol: { md: { span: 20 } }
}

export default {
  components: {
    UploadSth
  },
  props: {
    resourceId: String,
    showAll: { type: Boolean, default: true }
  },
  data() {
    return {
      invoiceLayout,
      confirmLoading: false,
      form: {
        stuId: this.resourceId,
        visitType: 'N', // Y.到访 N.跟进
        logDate: undefined,
        logRemark: undefined
      },
      rules: {
        logDate: [{ required: true, message: '请选择时间', trigger: 'change' }],
        logRemark: [{ required: true, message: '请输入备注', trigger: 'change' }]
      }
    }
  },
  methods: {
    checkboxChange(e) {
      this.form.visitType = e.target.checked ? 'Y' : 'N'
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.form.visitType == 'Y') {
            this.handleRequest()
          } else {
            this.$refs.uploadSth.handleUpload().then(res => {
              this.handleRequest(res)
            })
          }
        }
      })
    },
    handleRequest(openId) {
      if (openId) {
        this.form.attachment = openId
      }
      this.confirmLoading = true
      saveStuUserLog(this.form)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: `已添加新的${this.form.visitType == 'Y' ? '到访' : '跟进'}记录`
            })
            this.$emit('refreshTable')
            this.reset()
          }
        })
        .finally(() => (this.confirmLoading = false))
    },
    reset() {
      this.form.attachment = undefined
      this.$refs.uploadSth.reset()
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import '~@/assets/style/index';
</style>
