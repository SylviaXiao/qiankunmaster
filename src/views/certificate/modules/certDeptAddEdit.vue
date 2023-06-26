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
            <a-form-item v-bind="formLayout" label="城市">
              <a-select
                show-search
                option-filter-prop="children"
                :filter-option="filterOption"
                :allowClear="true"
                placeholder="请输入城市"
                v-decorator="['areaName', { rules: [{ required: true, message: '请输入城市' }] }]"
                style="width: 100%;"
              >
                <a-select-option :allowClear="true" v-for="item in deptList" :key="item.name" :value="item.name">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-bind="formLayout" label="排序">
              <a-input-number v-decorator="['areaOrder']" style="width: 100%;" />
            </a-form-item>
          </a-form>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { saveCerArea } from '@/api/certificate/certificate'
import { formLayout } from '../certificate'
import { getSchoolList } from '@/api/education/card'
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
      stuBirthday: '',
      deptList: []
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleAddEditOk() {
      let id = ''
      if (this.record) {
        id = this.record.id
      }
      this.validateData().then(formData => {
        this.confirmAddEditLoading = true
        formData.id = id
        saveCerArea(formData)
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
    async openModal() {
      this.resetForm()
      let deptList = await getSchoolList()
      this.deptList = deptList.data
      this.visibleAddEdit = true
    },
    backindData(record) {
      let params = {
        areaOrder: record.areaOrder,
        areaName: record.areaName
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
