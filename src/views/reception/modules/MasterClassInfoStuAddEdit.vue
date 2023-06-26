<template>
  <div class="master-class-info-stu-edit">
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
            <a-row v-if="isAdd">
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
                  label="报名类型"
                >
                  <div>
                    <a-radio-group :value="type" @change="onTypeChange">
                      <a-radio-button value="one">内部学员</a-radio-button>
                      <a-radio-button value="two">外部咨询者</a-radio-button>
                      <a-radio-button value="three">内部导师</a-radio-button>
                    </a-radio-group>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="type === 'one'">
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="内部学员">
                  <span>
                    <a-input
                      disabled
                      class="show-disabled"
                      v-decorator="['student', { rules: [{ required: true, message: '请选择学生' }] }]"
                    >
                      <a-icon slot="addonAfter" type="search" @click="openChooseStu()" />
                    </a-input>
                  </span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="type === 'two'">
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="姓名">
                  <a-input
                    v-decorator="[`name`, { rules: [{ required: true, message: '请输入姓名' }] }]"
                    placeholder="输入姓名"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="手机号">
                  <a-input
                    v-decorator="[
                      `phone`,
                      { rules: [{ required: true, message: '请输入手机号' }] }
                    ]"
                    placeholder="输入手机号"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="type === 'three'">
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item label="内部导师" v-bind="formLayout">
                  <span>
                    <a-input
                      disabled
                      class="show-disabled"
                      v-decorator="['teacher', { rules: [{ required: true, message: '导师' }] }]"
                    >
                      <a-icon slot="addonAfter" type="search" @click="openChooseTea('teacher')" />
                    </a-input>
                  </span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="金额">
                  <a-input
                    v-decorator="[
                      `price`,
                      { rules: [{ required: true, message: '请输入金额' }, { validator: $verify.isNum }] }
                    ]"
                    placeholder="请输入金额"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="缴费时间">
                  <a-date-picker
                    style="width: 100%;"
                    format="YYYY-MM-DD"
                    v-decorator="['date', { rules: [{ required: true, message: '请选择缴费时间' }] }]"
                  />
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
    <!-- 选择员工组件 -->
    <ChooseTea ref="choosetea" :multiple="false" :teaFields="teaFields" @getBackData="getTeaData"></ChooseTea>
    <ChooseStu ref="choosestu" :multiple="false" @getBackData="getStuData"></ChooseStu>
    
  </div>
</template>
<script>
import ChooseTea from '@/components/ChooseTea'
import ChooseStu from '@/components/ChooseStu'
import { listEduDance } from '@/api/common'
import { saveStuMasterClass } from '@/api/recep'
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
  components: {
    ChooseStu,
    ChooseTea
  },
  props: {
    title: {
      type: String,
      default: '大师课'
    },
    masterClassId: String
  },
  data() {
    return {
      isAdd: true,
      type: 'one',
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      danceList: [],
      teaFields: '',
      formValues: {}
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    init() {
      listEduDance().then(res => (this.danceList = res.data))
    },
    onTypeChange(e) {
      this.teaFields = ''
      this.formValues = {}
      this.type = e.target.value
    },
    onSubmit() {
      this.validateData().then(res => {
        let params = Object.assign({}, res, this.formValues, {
          id: this.id,
          masterClassId: this.masterClassId,
          date: this.$tools.tailor.getDate(res.date)
        })
        saveStuMasterClass(params).then(res => {
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
    openChooseTea(type) {
      this.teaFields = type
      this.$refs.choosetea.open()
    },
    openChooseStu() {
      this.$refs.choosestu.open()
    },
    getTeaData(data, type) {
      this.$nextTick(() => {
        this.formEdit.setFieldsValue({ [type]: data.name })
        this.formValues[`${type}Id`] = data.id
      })
    },
    getStuData(data) {
      this.$nextTick(() => {
        this.formEdit.setFieldsValue({ student: data.stuName })
        this.formValues.studentId = data.stuId
      })
    },
    backindData(record) {
      this.isAdd = false
      let formData = {}
      if (record.stuId) {
        this.type = 'one'
        this.formValues.studentId = record.stuId
        formData.student = record.name
      } else if (record.teacherId) {
        this.type = 'three'
        this.formValues.teacherId = record.teacherId
        formData.teacher = record.name
      } else {
        this.type = 'two'
        formData.name = record.name
        formData.phone = record.phone
      }
      this.id = record.stuMasterClassId
      ;(formData.date = this.$tools.tailor.dateToMoment(record.date)), (formData.price = record.price)
      formData.remark = record.remark

      this.$nextTick(() => {
        this.formEdit.setFieldsValue(formData)
      })
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    reset() {
      this.isAdd = true
      this.id = ''
      this.type = 'one'
      this.teaFields = ''
      this.formValues = {}
      this.formEdit.resetFields()
    },
    refreshTable() {
      this.$emit('refresh', this.stuId)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';
.btn-wrapper {
  width: 100%;
  margin-bottom: 24px;
  .center();
}
.master-class-info-stu-edit {
}
</style>
