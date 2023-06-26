<template>
  <div v-if="this.record" class="stuCardDate-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="titleChangeCard"
      :visible="visibleCard"
      @ok="submitChangeDate"
      :confirmLoading="confirmChangeLoading"
      @cancel="handleCardCancel"
    >
      <a-form :form="form">
        <a-row>
          <a-row :style="{ margin: '0 0 10px 0' }">
            <a-col :style="{ textAlign: 'right', paddingRight: '5px' }" :span="8"><span>办卡日期 : </span></a-col>
            <a-col :span="12"
              ><span>{{ this.cardInfo.createDate | filterDate }}</span></a-col
            >
          </a-row>
          <a-form-item v-bind="defaultLayout" label="修改办卡日期: ">
            <a-date-picker
              style="width: 100%;"
              :allowClear="false"
              format="YYYY-MM-DD"
              v-decorator="[`createDate`, { rules: [{ required: false, message: '请输入' }] }]"
            />
          </a-form-item>
        </a-row>
        <a-row v-if="this.cardInfo.startDate">
          <a-row :style="{ margin: '0 0 10px 0' }">
            <a-col :style="{ textAlign: 'right', paddingRight: '5px' }" :span="8"><span>激活日期 : </span></a-col>
            <a-col :span="12"
              ><span>{{ this.cardInfo.startDate | filterDate }}</span></a-col
            >
          </a-row>
          <a-form-item v-bind="defaultLayout" label="修改激活时间: ">
            <a-date-picker style="width: 100%;" format="YYYY-MM-DD" v-decorator="[`startDate`, { rules: [{ required: false, message: '请输入' }] }]" />
          </a-form-item>
        </a-row>

        <a-row v-if="this.cardInfo.endDate">
          <a-row :style="{ margin: '0 0 10px 0' }">
            <a-col :style="{ textAlign: 'right', paddingRight: '5px' }" :span="8"><span>截止日期 : </span></a-col>
            <a-col :span="12"
              ><span>{{ this.cardInfo.endDate | filterDate }}</span></a-col
            >
          </a-row>
          <a-form-item v-bind="defaultLayout" label="修改截止日期: ">
            <a-date-picker style="width: 100%;" format="YYYY-MM-DD" v-decorator="[`endDate`, { rules: [{ required: false, message: '请输入' }] }]" />
          </a-form-item>
        </a-row>

        <a-row>
          <a-form-item v-bind="defaultLayout" label="备注: ">
            <a-input style="width: 100%;" v-decorator="[`remark`, { rules: [{ required: true, message: '请输入' }] }]" />
          </a-form-item>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { saveChangeDate } from '@/api/recep'
import moment from 'moment'
const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 12
    }
  }
}
export default {
  data() {
    return {
      cardInfo: {},
      titleChangeCard: '修改有效期',
      visibleCard: false,
      confirmChangeLoading: false,
      defaultLayout
    }
  },
  props: {
    record: Object
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.cardInfo = this.record
  },
  watch: {
    visibleCard(nv) {
      if (nv) {
        this.$nextTick(() => {
          this.form.resetFields()
        })
      }
    },
    record(nv) {
      this.cardInfo = nv
    }
  },
  methods: {
    //打开modal
    openModal() {
      this.visibleCard = true
    },
    //重置数据
    resetForm() {
      this.form.resetFields()
    },
    //回填数据
    backingData(data) {
      let params = {
        createDate: data.createDate ? moment(data.createDate, 'YYYY-MM-DD') : null,
        startDate: data.startDate ? moment(data.startDate, 'YYYY-MM-DD') : null,
        endDate: data.endDate ? moment(data.endDate, 'YYYY-MM-DD') : null
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(params)
      })
    },
    submitChangeDate() {
      this.form
        .validateFields()
        .then(data => {
          let createDate = data.createDate ? this.$tools.tailor.getDate(data.createDate) : ''
          let startDate = data.startDate ? this.$tools.tailor.getDate(data.startDate) : ''
          let endDate = data.endDate ? this.$tools.tailor.getDate(data.endDate) : ''
          let remark = data.remark ? data.remark : ''
          let params = {
            stuCardId: this.cardInfo.id,
            createDate,
            startDate,
            endDate,
            remark
          }
          this._formData = data
          return saveChangeDate(params)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '已修改成功'
            })
            this.visibleCard = false
            this.$emit('refresh')
          }
          this.confirmChangeLoading = false
        })
        .catch(err => {
          this.confirmChangeLoading = false
        })
    },
    handleCardCancel() {
      this.visibleCard = false
    }
  }
}
</script>

<style scoped lang="less">
.stuCardDate-wrapper {
}
</style>
