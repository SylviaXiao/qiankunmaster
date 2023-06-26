<template>
  <div class="test-organizerDesc-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
    >
      <div>
        <a-spin :spinning="spinning">
          <a-form :form="formEdit">
            <a-row :gutter="8">
              <!-- 承办单位 -->
              <a-row>
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item v-bind="formLayout" label="承办单位">
                    <a-input v-decorator="['organizerName', { rules: [{ required: true, message: '请输入承办单位' }] }]" style="width: 100%;" />
                  </a-form-item>
                </a-col>
                <!-- 地址 -->
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item v-bind="formLayout" label="描述">
                    <a-input v-decorator="['organizerDesc']" style="width: 100%;" />
                  </a-form-item>
                </a-col>
              </a-row>
              <!-- 考试 -->
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item v-bind="formLayout" label="排序">
                  <a-input-number v-decorator="['organizerOrder']" style="width: 100%;" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { saveSite } from '@/api/certificate/certificate'
import { formLayout } from '../certificate'

export default {
  props: {
    title: String,
    record: Object
  },
  data() {
    return {
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      spinning: false,
      stuBirthday: ''
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    handleAddEditOk() {
      let id = ''
      if (this.record) {
        id = this.record.id
      }
      this.validateData().then(formData => {
        this.confirmAddEditLoading = true
        formData.id = id
        saveSite(formData)
          .then(res => {
            if (res.code === 200) {
              this.refreshTable()
              this.visibleAddEdit = false
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.confirmAddEditLoading = false
          })
      })
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    openModal() {
      this.resetForm()
      this.visibleAddEdit = true
    },
    backindData(record) {
      let params = {
        organizerDesc: record.organizerDesc,
        organizerOrder: record.organizerOrder,
        organizerName: record.organizerName
      }
      this.$nextTick(() => {
        this.formEdit.setFieldsValue(params)
      })
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    resetForm() {
      this.formEdit.resetFields()
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.test-organizerDesc-wrapper {
}
</style>
