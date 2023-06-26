<template>
  <div class="student-form">
    <a-form :form="form">
      <!-- <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
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
      </a-row> -->
      <a-row>
        <a-col :span="3" style="text-align:right;line-height: 0.4rem;">
          <span
            style="padding-right: 5px;color: rgb(245, 34, 45);font-size: 0.14rem;font-family: SimSun, sans-serif;line-height: 1;transform: translate(20px, 32px);"
            >*</span
          ><span>日期选择：</span></a-col
        >
        <a-col :span="21">
          <div v-for="(item, index) in dateList" :key="index" class="dateList">
            <a-row>
              <a-col :span="19">
                <a-form-item label="" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
                  <a-form-item label="" v-bind="formItemLayout">
                    <a-date-picker
                      :disabled='clash'
                      @change="params => selectDayChange(params, index)"
                      :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
                      v-model="item.selectDay"
                      format="YYYY-MM-DD"
                    />
                  </a-form-item>
                </a-form-item>
              </a-col>
              <a-col :span="5" v-show="!planId && isPersonal">
                <a href="#" style="margin:8px" @click.stop="subtract(index)" v-if="dateList.length !== 1">删除</a>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
      <a href="#" v-show="!planId && isPersonal" @click="add()" style="margin:0 0 20px 20px">添加</a>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="开始时间" v-bind="formItemLayout">
            <a-time-picker
              :disabled='clash'
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
              :disabled='clash'
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
          <a-form-item label="总时长" v-bind="formItemLayout">
            <a-input-number :disabled='clash' :min="1" :max="600" v-model="duration" @change="changeDuration" />
            分钟
            <div>教室使用时长</div>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24" v-show="!isPersonal">
          <a-form-item label="上课时长" v-bind="formItemLayout" required>
            <a-input-number :disabled='clash' :min="1" :max="600" v-model="attendClassDuration" @change="changeAttendClassDuration" />
            分钟
            <div>老师实际上课时长</div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="薪酬类型" v-bind="formItemLayout">
            <a-select
              :disabled='clash'
              allowClear
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto', minWidth: '200px' }"
              :dropdownMatchSelectWidth="false"
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
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="签到计次" v-bind="formItemLayout">
            <a-input-number :disabled='clash'  :min="0" :max="9999" v-model="signCount" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item :label="roomLabel" v-bind="formItemLayout">
            <a-select  :disabled='clash&&clash!=="A"' :allowClear="true" placeholder="请选择教室" v-decorator="['roomId', { rules: [{ required: true, message: '请选择教室' }] }]">
              <a-select-option :allowClear="true" :value="room.id" v-for="(room, roomIndex) in roomList" :key="roomIndex">
                {{ room.roomName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="上课导师" v-bind="formItemLayout">
            <a-select
              mode="multiple"
              style="width: calc(100% - 37px);margin-right: 37px;z-index: 144;border-radius: 4px 0 0 4px;"
              :disabled='clash&&clash!=="B"'
              @deselect="deselect"
              :open="false"
              v-decorator="['teacherIds', { rules: [{ required: true, message: '请选择上课导师' }] }]"
              placeholder="请选择上课导师"
            >
              <a-icon slot="suffixIcon" type="search" />
              <a-select-option v-for="(item, idx) in teaSelectArr" :value="item.teacherId" :key="idx">{{ item.teacherName }} </a-select-option>
            </a-select>
            <a-input style="cursor: pointer; position: absolute;left: -2px;top: -6.5px;border: none;" class="no-border-input" v-show='!(clash&&clash!=="B")'>
              <a-icon slot="addonAfter" type="search" @click="openSelectModal()" />
            </a-input>
            <!-- <a-input placeholder="请选择导师" style="color: #000;" disabled v-decorator="['teaName', { rules: [{ required: true, message: '请选择导师' }]}]">
              <a-icon slot="addonAfter" type="search" class="search-input-searchIcon" @click="openSelectModal" />
            </a-input> -->
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <p style="color:red">重要提示：签到计次按上课时长计算，导师课酬 = 薪酬类型 x 签到计次。</p>
      </a-row>
    </a-form>
    <!-- 老师选择组件 -->
    <choose-tea ref="choosetea" :multiple="true" teaFields="teacher" @getBackData="getTeaData"> </choose-tea>
  </div>
</template>
<script>
import moment from 'moment'
import { getRoomList, getCardInfoDuration, findApplySalType } from '@/api/education'
import { salTypeListById } from '@/api/common'
import ChooseTea from '@/components/ChooseTea'

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
      clash:false,
      planId: null,
      saleryTypeList: [],
      duration: null, //总时长
      attendClassDuration: null, //上课时长
      eduTypeId: null,
      eduCardId: null,
      formItemLayout,
      roomList: [],
      classPlanRoomDef: '',
      classId: this.$route.params.classid,
      signCount: 0,
      teaSelectArr: [],
      teaIdsArr: [],
      cardDuration: null,
      salTypeId: null,
      dateList: [{ selectDay: '' }]
    }
  },
  computed: {
    roomLabel() {
      return this.isPersonal ? '教室' : '默认教室'
    }
  },
  props: {
    classInfo: Object,
    classTypeId: String,
    recordProps: Object,
    isPersonal: Boolean
  },
  components: {
    ChooseTea
  },
  watch: {
    recordProps: {
      handler(nv, ov) {
        this.getCardInfoDuration()
      },
      deep: true
    }
  },
  created() {
    getRoomList({ page: '1', limit: '100' }).then(res => (this.roomList = res.data))
    this.getCardInfoDuration()
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },

  methods: {
    selectDayChange(params, index) {},
    subtract(index) {
      this.dateList.splice(index, 1)
    },
    add() {
      this.dateList.push({ selectDay: '' })
    },
    // 通过上课时长,班型id匹配薪酬类型
    findApplySalType() {
      if (this.eduCardId) {
        return new Promise((resolve, reject) => {
          let params = {
            eduTypeId: this.eduCardId,
            classTypeId: this.eduCardTypeId,
            attendClassDuration: this.attendClassDuration || 0
          }
          if (this.isPersonal) params.salTypeId = this.salTypeId
          findApplySalType(params).then(res => {
            this.saleryTypeList = res.data || []
            let salTypeId = this.form.getFieldValue('salTypeId')
            if (salTypeId && this.saleryTypeList.findIndex(item => item.id === salTypeId) === -1) {
              this.form.setFieldsValue({ salTypeId: undefined })
            }
            resolve()
          })
        })
      } else {
        this.saleryTypeList = []
        return Promise.resolve()
      }
    },
    getCardInfoDuration() {
      let obj = {}
      if (this.classInfo) {
        obj = {
          danceId: this.classInfo?.eduDance?.id,
          eduTypeId: this.classInfo?.eduType?.id,
          classTypeId: this.classInfo?.eduCardType?.id
        }
      } else {
        obj = {
          danceId: this.recordProps?.danceId,
          eduTypeId: this.recordProps?.typeId,
          classTypeId: this.recordProps?.classTypeId
        }
      }

      getCardInfoDuration(obj).then(res => {
        this.cardDuration = res?.data
      })
    },
    deselect(value, option) {
      this.teaIdsArr.remove(value)
      this.form.setFieldsValue({
        teacherIds: this.teaIdsArr.join(',')
      })
    },
    getTeaData(data, type) {
      // if (type == 'teacher') {
      data.map(item => {
        if (this.teaIdsArr.indexOf(item.teacherId) < 0) {
          this.teaSelectArr.push({ teacherName: item.teacherName, teacherId: item.teacherId })
          this.teaIdsArr.push(item.teacherId)
        }
      })
      // this.$nextTick(() => {
      // this.form.setFieldsValue({ teacher: this.teaIdsArr })
      this.form.setFieldsValue({
        teacherIds: this.teaIdsArr
      })
      // })
      // }
    },
    openSelectModal() {
      this.$refs.choosetea.open()
    },
    moment,
    initForm(data) {
      let { recordProps } = this
      if (data) {
        this.teaSelectArr = data.teachers
        let teacherIds = (this.teaIdsArr = data.teachers.map(item => item.teacherId))
        this.form.setFieldsValue({ teacherIds: teacherIds })
      }
      // this.initSalType(recordProps.typeId).then(res => {
      //   this.form.setFieldsValue({
      //     salTypeId: recordProps.salTypeId
      //   })
      // })
      this.eduCardId = this.classInfo?.eduType?.id || data.typeId
      this.eduCardTypeId = this.classInfo?.eduCardType?.id || data.classTypeId
      this.attendClassDuration = data.attendClassDuration
      this.salTypeId = recordProps.salTypeId
      this.findApplySalType().then(res => {
        this.form.setFieldsValue({
          salTypeId: recordProps.salTypeId
        })
      })
    },
    // initSalType(id) {
    //   return salTypeListById({ eduTypeId: id }).then(res => (this.saleryTypeList = res.data))
    // },
    dataBacking(record) {
      const { startDate, endDate, salTypeId, roomId, planId, signCount, attendClassDuration } = record
      const {
        $tools: {
          tailor: { getDate, getTime }
        },
        timeCoputedFn
      } = this
      this.teaSelectArr = record.teachers
      const teacherIds = (this.teaIdsArr = record.teachers.map(item => item.teacherId))
      const selectDay = moment(getDate(startDate), 'YYYY-MM-DD'),
        startTime = moment(getTime(startDate), 'HH:mm'),
        endTime = moment(getTime(endDate), 'HH:mm')
      timeCoputedFn(getTime(startDate), getTime(endDate), undefined, true)
      this.planId = planId
      this.signCount = signCount || 0
      this.attendClassDuration = attendClassDuration
      this.dateList = [{ selectDay: selectDay }]
      // selectDay,
      const formValue = {
        startTime,
        endTime,
        salTypeId,
        roomId,
        planId,
        teacherIds
      }
      this.$nextTick(() => {
        this.salTypeId = salTypeId
        this.form.setFieldsValue(formValue)
      })
    },
    reSalTypeId(record, info) {
      const formValue = {
        salTypeId: record
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(formValue)
        let ids = info.orgUserTeacher.map(item => item.teacherId)
        this.teaIdsArr = ids
        this.teaSelectArr = info.orgUserTeacher
        this.dTimep = undefined
        this.form.setFieldsValue({
          teacherIds: ids
        })
      })
    },
    setFormValue(info, record, type,disabled) {
      this.eduCardId = info?.eduType?.id
      this.eduCardTypeId = info?.eduCardType?.id
      this.attendClassDuration = record?.attendClassDuration
      this.salTypeId = info.salType?.id
      this.clash=false
      if(disabled){
        this.classId=record.classId
        this.clash=record.clash
      }
      const { findApplySalType, dataBacking, reSalTypeId } = this
      if (type === 'add') {
        findApplySalType().then(() => reSalTypeId(record, info))
      }
      if (type === 'edit') {
        findApplySalType().then(() => dataBacking(record))
      }
    },
    changeSalType(value) {
      this.calculationCount()
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
      this.dateList = [{ selectDay: '' }]
      this.saleryTypeList = []
      this.eduCardId = null
      this.eduCardTypeId = null
      this.attendClassDuration = null
      this.duration = null
      this.signCount = 1
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
      let selectDay = this.dateList.map(item => this.$tools.tailor.getDate(item.selectDay))
      // if (formData.selectDay) {
      //   dayString = this.$tools.tailor.getDate(formData.selectDay)
      // }
      //说明是修改,带上planid
      // if (formData.selectDay) {
      if (formData.planId) {
        result.id = formData.planId
      }
      result.dates = JSON.stringify(selectDay)
      result.classId = this.classId
      result.startDate = selectDay[0] && startTimeString && `${selectDay[0]} ${startTimeString}`
      result.endDate = selectDay[0] && endTimeString && `${selectDay[0]} ${endTimeString}`
      result.roomId = formData.roomId
      result.salTypeId = formData.salTypeId
      result.teacherIds = formData.teacherIds.join(',')
      result.signCount = this.signCount
      result.attendClassDuration = this.attendClassDuration
      //去除空值
      result = this.$tools.delUndefined(result)
      return result
    },
    validateData() {
      // return this.form.validateFields()
      return new Promise((resolve, reject) => {
        let flag = this.dateList.every(item => item.selectDay)
        if (!flag) {
          this.$notification['error']({
            message: '系统通知',
            description: '请选择日期'
          })
          reject()
          return
        }
        let selectDay = Array.from(new Set(this.dateList.map(item => this.$tools.tailor.getDate(item.selectDay))))
        if (selectDay.length != this.dateList.length) {
          this.$notification['error']({
            message: '系统通知',
            description: '请不要选择相同的日期'
          })
          reject()
          return
        }
        this.form.validateFields().then(valid => {
          if (!valid) {
            reject()
            return
          }
          let formData = this.form.getFieldsValue()
          let startTime = new Date(formData.startTime).getTime()
          let endTime = new Date(formData.endTime).getTime()
          if (startTime >= endTime) {
            this.$notification['error']({
              message: '系统通知',
              description: '结束时间必须大于开始时间'
            })
            reject()
            return
          }
          if (!(this.attendClassDuration >= 0)) {
              this.$notification['error']({
                message: '系统通知',
                description: '请填写上课时长'
              })
              reject()
              return
          }
          if (this.attendClassDuration > this.duration) {
              this.$notification['error']({
                message: '系统通知',
                description: '上课时长必须小于等于总时长'
              })
              reject()
              return
          }
          if (this.isPersonal) {
            this.attendClassDuration = this.duration
            // if (this.duration != this.attendClassDuration) {
            //   this.$notification['error']({
            //     message: '系统通知',
            //     description: '总时长必须等于上课时长'
            //   })
            //   reject()
            //   return
            // }
            let salTypeId = this.form.getFieldValue('salTypeId')
            let salType = this.saleryTypeList.find(item => item.id === salTypeId)
            let attendClassDuration = this.attendClassDuration || (endTime - startTime) / 60 / 1000
            if (Number(this.signCount).toFixed(2) != ((attendClassDuration / salType.duration) * salType.timesCount).toFixed(2)) {
              this.$notification['error']({
                message: '系统通知',
                description: '签到计次不正确'
              })
              reject()
              return
            }
          }
          resolve() // TODO 提交表单
        })
      })
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

      if (this.isPersonal) {
        this.attendClassDuration = this.duration
        this.findApplySalType().then(() => {
          if (!init) this.calculationCount()
        })
      } else {
        // 取消联动
        // if (this.attendClassDuration > this.duration) {
        //   this.changeAttendClassDuration(this.attendClassDuration)
        // }
      }
    },
    changeAttendClassDuration(value) {
      // let value = e.target.value
      if (value > this.duration) {
        this.attendClassDuration = null
        this.$notification['error']({
          message: '系统通知',
          description: '上课时长必须小于等于总时长'
        })
      } else {
        this.findApplySalType().then(() => this.calculationCount())
      }
    },
    calculationCount() {
      this.$nextTick(() => {
        let salTypeId = this.form.getFieldValue('salTypeId')
        let salType = this.saleryTypeList.find(item => item.id === salTypeId)
        if (salType && this.attendClassDuration >= 0) {
          if (this.isPersonal) {
            this.signCount = ((this.duration / salType.duration) * salType.timesCount).toFixed(2)
          } else {
            this.signCount = ((this.attendClassDuration / salType.duration) * salType.timesCount).toFixed(2)
          }
        }
      })
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
        this.changeDuration(null, init)
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
.dateList {
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
}
</style>
