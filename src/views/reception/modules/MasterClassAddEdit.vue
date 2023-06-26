<template>
  <div class="stu-leave-addedit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      :confirmLoading="confirmAddEditLoading"
      width="800px"
      @ok="onSubmit"
      @cancel="onAddEditCancel"
    >
      <div>
        <a-form :form="formEdit">
          <a-row :gutter="8">
            <a-row>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="班级名称">
                  <a-input
                    v-decorator="[`className`, { rules: [{ required: true, message: '请输入班级名称' }] }]"
                    placeholder="输入班级名称"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="导师姓名">
                  <a-input
                    v-decorator="[`bigMasterName`, { rules: [{ required: true, message: '请输入导师姓名' }] }]"
                    placeholder="输入导师姓名"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="上课地点">
                  <a-input
                    v-decorator="[`address`, { rules: [{ required: true, message: '请输入上课地点' }] }]"
                    placeholder="输入上课地点"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="上课时间">
                  <a-range-picker
                    style="width: 100%;"
                    format="YYYY-MM-DD"
                    v-decorator="['dateRange', { rules: [{ required: true, message: '请选择上课时间' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="联系人姓名">
                  <a-input
                    v-decorator="[`contact`, { rules: [{ required: true, message: '请输入联系人姓名' }] }]"
                    placeholder="输入联系人姓名"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="联系人电话">
                  <a-input
                    v-decorator="[
                      `contactPhone`,
                      { rules: [{ required: true, message: '请输入联系人电话' }] }
                    ]"
                    placeholder="输入联系人电话"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="舞种">
                  <a-select
                    allowClear
                    v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]"
                    placeholder="请选择舞种"
                  >
                    <a-select-option
                      :allowClear="true"
                      :value="item.id"
                      v-for="(item, index) in danceList"
                      :key="index"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item
                v-bind="{
                  labelCol: {
                    sm: {
                      span: 3
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
import { saveMasterClass } from '@/api/recep'
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
      default: '大师课'
    }
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
        let params = Object.assign(
          {},
          {
            id: this.id,
            startDate: this.$tools.tailor.getDate(res.dateRange[0]),
            endDate: this.$tools.tailor.getDate(res.dateRange[1])
          },
          res
        )
        delete params.dateRange
        saveMasterClass(params).then(res => {
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
      let formData = Object.assign({}, record)
      if(record.startDate) {
        formData.dateRange = [
          this.$tools.tailor.dateToMoment(record.startDate),
          this.$tools.tailor.dateToMoment(record.endDate)
        ]
      } else {
        formData.dateRange = null
      }
      this.id = record.masterClassId
      delete formData.startDate
      delete formData.endDate
      delete formData.danceName
      delete formData.masterClassId
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
.stu-leave-addedit {
}
</style>
