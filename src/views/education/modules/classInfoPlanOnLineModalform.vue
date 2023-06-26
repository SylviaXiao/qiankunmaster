<template>
  <div class="student-form">
    <a-form :form="form">
      <a-row class="form-row" :gutter="16">
        <a-col :span="12">
          <a-form-item label="日期选择" v-bind="formItemLayout">
            <a-date-picker
              :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
              v-decorator="[
                'selectDay',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择日期'
                    }
                  ]
                }
              ]"
              format="YYYY-MM-DD"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="薪酬类型" v-bind="formItemLayout">
            <a-select
              allowClear
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto', minWidth: '200px' }"
              v-decorator="['salTypeId', { rules: [{ required: true, message: '请选择薪酬类型' }] }]"
              placeholder="请选择薪酬类型"
              @change="changeSalType"
            >
              <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in saleryTypeList" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="开始时间" v-bind="formItemLayout">
            <a-time-picker
              format="HH:mm"
              :minuteStep="5"
              @change="changeSTime"
              v-decorator="['startTime', { rules: [{ required: true, message: '请选择开始时间' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="结束时间" v-bind="formItemLayout">
            <a-time-picker
              :minuteStep="5"
              format="HH:mm"
              @change="changeETime"
              v-decorator="[
                'endTime',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择结束时间'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item style="display: none">
            <a-input v-decorator="['planId']"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="时长" v-bind="formItemLayout">
            <a-input-number :min="1" :max="600" v-model="duration" @change="changeDuration" />
            分钟
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="签到计次" v-bind="formItemLayout">
            <a-input-number :min="0" :max="9999" v-model="signCount" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <p style="color:red">重要提示：学员签到扣次 = 签到计次，导师课酬 = 薪酬类型 x 签到计次。</p>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import moment from 'moment'
import { salTypeListById } from '@/api/common'

const formItemLayout = {
  labelCol: {
    lg: { span: 6 },
    md: { span: 6 },
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 12 },
    md: { span: 12 },
    xs: { span: 12 },
    sm: { span: 12 }
  }
}
export default {
  data() {
    return {
      saleryTypeList: [],
      duration: null,
      formItemLayout,
      classPlanRoomDef: '',
      classId: this.$route.params.classid,
      signCount: 1
    }
  },
  computed: {
    roomLabel() {
      return this.isPersonal ? '教室' : '默认教室'
    }
  },
  props: {
    classTypeId: String,
    recordProps: Object,
    isPersonal: Boolean
  },
  created() {},
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    moment,
    initForm() {
      let { recordProps } = this
      this.initSalType(recordProps.typeId).then(res => {
        this.form.setFieldsValue({
          salTypeId: recordProps.salTypeId
        })
      })
    },
    initSalType(id) {
      return salTypeListById({ eduTypeId: id }).then(res => (this.saleryTypeList = res.data))
    },
    dataBacking(record) {
      console.log('record =>', record)
      const { startDate, endDate, salTypeId, roomId, planId, signCount } = record
      const {
        $tools: {
          tailor: { getDate, getTime }
        },
        timeCoputedFn
      } = this
      const selectDay = moment(getDate(startDate), 'YYYY-MM-DD'),
        startTime = moment(getTime(startDate), 'HH:mm'),
        endTime = moment(getTime(endDate), 'HH:mm')
      timeCoputedFn(getTime(startDate), getTime(endDate), undefined, true)
      this.signCount = signCount || 1
      const formValue = {
        selectDay,
        startTime,
        endTime,
        salTypeId,
        roomId,
        planId
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(formValue)
      })
    },
    reSalTypeId(record) {
      const formValue = {
        salTypeId: record
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(formValue)
      })
    },
    setFormValue(info, record, type) {
      const {
        eduType: { id }
      } = info
      const { initSalType, dataBacking, reSalTypeId } = this
      if (type === 'add') {
        initSalType(id).then(reSalTypeId(record))
      }
      if (type === 'edit') {
        initSalType(id).then(dataBacking(record))
      }
    },

    _filterData(data) {
      let result = {}
      let day = ''
      let sTime = ''
      let eTime = ''
      let duration = 0
      if (data.startDate) {
        day = data.startDate.split(' ')[0]
        sTime = data.startDate.split(' ')[1]
        //标记stime
        this.sTimep = sTime.slice(0, 5)
      }
      if (data.endDate) {
        eTime = data.endDate.split(' ')[1]
        //标记etime
        this.eTime = eTime.slice(0, 5)
      }
      duration = (eTime.slice(0, 2) - sTime.slice(0, 2)) * 60 + (eTime.slice(3, 5) - sTime.slice(3, 5))
      this.duration = duration
      //处理成moment对象
      result.selectDay = moment(day, 'YYYY-MM-DD')
      result.startTime = moment(sTime, 'HH:mm')
      result.endTime = moment(eTime, 'HH:mm')
      result.roomId = data.roomId
      result.salTypeId = data.salTypeId
      return result
    },
    resetForm() {
      this.duration = null
      this.form.resetFields()

      //时间重置
      this.eTime = undefined
      this.duration = undefined
      this.sTime = undefined
    },
    getFormData() {
      let formData = this.form.getFieldsValue()
      let result = {}
      let dayString = ''
      let startTimeString = ''
      let endTimeString = ''
      if (formData.startTime) {
        startTimeString = this.$tools.tailor.getTime(formData.startTime)
      }
      if (formData.endTime) {
        endTimeString = this.$tools.tailor.getTime(formData.endTime)
      }
      if (formData.selectDay) {
        dayString = this.$tools.tailor.getDate(formData.selectDay)
      }
      //说明是修改,带上planid
      if (formData.selectDay) {
        result.id = formData.planId
      }
      result.dates = JSON.stringify([dayString])
      result.classId = this.classId
      result.startDate = dayString && startTimeString && `${dayString} ${startTimeString}`
      result.endDate = dayString && endTimeString && `${dayString} ${endTimeString}`
      result.roomId = formData.roomId
      result.salTypeId = formData.salTypeId
      result.signCount = this.signCount
      //去除空值
      result = this.$tools.delUndefined(result)
      return result
    },
    validateData() {
      return this.form.validateFields()
    },
    listClassWeekPlan() {
      this.resetForm()
    },
    changeSTime(value, time) {
      this.sTimep = time
      this.eTimep = this.$tools.tailor.getTime(this.form.getFieldValue('endTime')) || undefined

      if (this.sTimep && this.eTimep && !this.dTimep) this.duration = this.timeCoputedFn(this.sTimep, this.eTimep, undefined)
      if (this.sTimep && this.dTimep && !this.eTimep) this.timeCoputedFn(this.sTimep, undefined, this.dTimep)
      //全部都有的情况
      if (this.sTimep && this.dTimep && this.eTimep) this.duration = this.timeCoputedFn(this.sTimep, this.eTimep, undefined)
    },
    changeETime(value, time) {
      this.sTimep = this.$tools.tailor.getTime(this.form.getFieldValue('startTime')) || undefined
      this.eTimep = time

      if (this.eTimep && this.sTimep && !this.dTimep) this.duration = this.timeCoputedFn(this.sTimep, this.eTimep, undefined)
      if (this.eTimep && this.dTimep && !this.sTimep) this.timeCoputedFn(undefined, this.eTimep, this.dTimep)
      //全部都有的情况
      if (this.sTimep && this.dTimep && this.eTimep) this.duration = this.timeCoputedFn(this.sTimep, this.eTimep, undefined)
    },
    changeDuration(value, init = false) {
      this.sTimep = this.$tools.tailor.getTime(this.form.getFieldValue('startTime')) || undefined
      this.eTimep = this.$tools.tailor.getTime(this.form.getFieldValue('endTime')) || undefined

      this.duration = ~~value
      this.dTimep = ~~value
      if (this.dTimep && this.sTimep && !this.eTimep) this.timeCoputedFn(this.sTimep, undefined, this.dTimep)
      if (this.dTimep && this.eTimep && !this.sTimep) this.timeCoputedFn(undefined, this.eTimep, this.dTimep)
      //全部都有的情况
      if (this.sTimep && this.dTimep && this.eTimep) this.timeCoputedFn(this.sTimep, undefined, this.dTimep)

      if (!init) this.calculationCount()
    },
    calculationCount() {
      this.$nextTick(() => {
        let salTypeId = this.form.getFieldValue('salTypeId')
        let salType = this.saleryTypeList.find(item => item.id === salTypeId)
        if (salType && this.duration) {
          this.signCount = ((this.duration / salType.duration) * salType.timesCount).toFixed(2)
        }
      })
    },
    changeSalType(value) {
      this.calculationCount()
    },
    timeCoputedFn(s, e, d, init = false) {
      if (s && e && !d) {
        let dValue = (~~e.slice(0, 2) - ~~s.slice(0, 2)) * 60 + (~~e.slice(3, 5) - ~~s.slice(3, 5))
        if (dValue <= 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '结束时间必须大于开始时间'
          })
          return
        }
        this.changeDuration(dValue, init)
        return (this.duration = dValue)
      }
      if (s && !e && d) {
        let eValue = this._compuFormatData('plus', this.sTimep, this.dTimep)
        this.eTime = eValue
        return this.form.setFieldsValue({ ['endTime']: moment(eValue, 'HH:mm') })
      }
      if (!s && e && d) {
        let eValue = this._compuFormatData('minu', this.eTimep, this.dTimep)
        this.sTime = eValue
        return this.form.setFieldsValue({ ['startTime']: moment(eValue, 'HH:mm') })
      }
    },
    _compuFormatData(type, v1, v2) {
      v2 = ~~v2
      let hour = ~~v1.slice(0, 2)
      let min = ~~v1.slice(3, 5)
      if (type === 'plus') {
        let newMin = (min + v2) % 60
        let newHour = hour + Math.floor((min + v2) / 60)
        if (newHour >= 24) {
          this.$notification['error']({
            message: '系统通知',
            description: '时间溢出,时间不能超过24小时'
          })
          return null
        } else {
          return `${newHour}:${newMin}`
        }
      }
      if (type === 'minu') {
        let Dvalue = min - v2
        if (Dvalue >= 0) {
          if (Dvalue === 0) Dvalue = 0
          return `${hour}:${Dvalue}`
        } else {
          let Fmin = 60 + ~~(Dvalue % 60)
          let Dhour = Math.ceil(Dvalue / 60)
          let Fhour = ~~hour + ~~Dhour
          if (Fhour >= 0) {
            if (Fmin === 60) Fmin = 0
            return `${Fhour - 1}:${Fmin}`
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: '时间溢出,时间不能超过24小时'
            })
            return null
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/btn';
</style>
