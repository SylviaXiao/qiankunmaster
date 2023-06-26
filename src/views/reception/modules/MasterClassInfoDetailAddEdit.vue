<template>
  <div class="master-class-detail-addedit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      :confirmLoading="confirmAddEditLoading"
      @ok="onSubmit"
      @cancel="onAddEditCancel"
    >
      <div>
        <a-form :form="formEdit">
          <a-row :gutter="8">
            <a-col :span="24">
              <a-form-item v-bind="formLayout" label="支出时间">
                <a-date-picker
                  style="width: 100%;"
                  format="YYYY-MM-DD"
                  v-decorator="['spendingDate', { rules: [{ required: true, message: '请选择支出时间' }] }]"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item v-bind="formLayout" label="项目名称">
                <a-input
                  v-decorator="[`item`, { rules: [{ required: true, message: '请输入项目名称' }] }]"
                  placeholder="输入项目名称"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item v-bind="formLayout" label="支出金额">
                <a-input
                  v-decorator="[
                    `spendingPrice`,
                    { rules: [{ required: true, message: '请输入支出金额' }, { validator: $verify.isNum }] }
                  ]"
                  placeholder="输入支出金额"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item
                v-bind="{
                  labelCol: {
                    sm: {
                      span: 6
                    }
                  },
                  wrapperCol: {
                    sm: {
                      span: 16
                    }
                  }
                }"
                label="备注"
              >
                <a-textarea
                  style="width: 80%;"
                  placeholder="请输入备注信息(100字以内)"
                  :rows="4"
                  v-decorator="['remark', { rules: [{ required: false, message: '请输入备注信息' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { listEduDance } from '@/api/common'
import { saveClassSpending } from '@/api/recep'
const formLayout = {
  labelCol: {
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    sm: {
      span: 16
    }
  }
}
export default {
  props: {
    title: {
      type: String,
      default: '项目支出'
    },
    masterClassId: String
  },
  data() {
    return {
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      danceList: []
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    init() {
      listEduDance().then(res => (this.danceList = res.data))
    },
    onSubmit() {
      this.validateData().then(res => {
        let params = Object.assign({}, res, {
          id: this.id,
          masterClassId: this.masterClassId,
          spendingDate: this.$tools.tailor.getDate(res.spendingDate)
        })
        saveClassSpending(params).then(res => {
          this.refreshTable()
          this.onAddEditCancel()
        })
      })
    },
    onAddEditCancel() {
      this.visibleAddEdit = false
    },
    open() {
      this.reset()
      this.init()
      this.visibleAddEdit = true
    },
    backindData(record) {
      const { id, item, remark, spendingPrice } = record
      let formData = {}
      if (record.spendingDate) {
        formData.spendingDate = this.$tools.tailor.dateToMoment(record.spendingDate)
      } else {
        formData.spendingDate = null
      }
      this.id = id
      formData.item = item
      formData.remark = remark
      formData.spendingPrice = spendingPrice
      this.formEdit.setFieldsValue(formData)
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    reset() {
      this.id = ''
      this.formEdit.resetFields()
    },
    refreshTable() {
      this.$emit('refresh', this.stuId)
    }
  }
}
</script>

<style scoped lang="less">
.master-class-detail-addedit {
}
</style>
