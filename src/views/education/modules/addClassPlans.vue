<template>
  <div :roomList="roomList" :classPlansInfo="classPlansInfo" :isEdit="isEdit" :defRoom="defRoom">
    <a-spin :spinning="isEdit">
      <a-card :bordered="false" class="card">
        <div class="classPlans">
          <header>
            <div>
              <span class="title">上课时间</span>
              <span>
                <a-button style="height: 30px; width: 150px; margin: 0 20px;" @click="addClassDate()">添加</a-button>
              </span>
            </div>
            <div class="text"><p style="color:red">重要提示：学员签到扣次 = 签到计次，导师课酬 = 薪酬类型 x 签到计次。</p></div>
          </header>
          <div class="container">
            <a-table :columns="classForWeek" :dataSource="classForWeekData" size="middle" :pagination="false" rowKey="createdId">
              <span slot="action" slot-scope="text, record">
                <a href="javascript:;" style="margin-right: 15px" @click="addClassDate(text)">编辑</a>
                <a href="javascript:;" @click="removeBtn(record.createdId)">删除</a>
              </span>
            </a-table>
          </div>
        </div>
      </a-card>
    </a-spin>
    <!-- 新增排课Modal -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="排课计划"
      :width="800"
      :confirmLoading="classPlanModalLoading"
      v-model="classPlanModal"
      @ok="checkClassPlan()"
    >
      <div class="classPlansContent">
        <div class="weekCheckboxs">
          <a-checkbox-group @change="onChange" style="width: 100%;" v-model="weekList">
            <a-row type="flex" justify="space-between">
              <a-col :span="3" v-for="(item, index) in plainOptions" :key="index">
                <a-checkbox :disabled="checkDisabled" :value="item.weekNo">{{ item.weekStr }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
        <a-divider />
        <div class="classPlanForm">
          <a-form :form="classPlanForm">
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
                    format="HH:mm"
                    :minuteStep="5"
                    @change="changeETime"
                    v-decorator="['endTime', { rules: [{ required: true, message: '请选择开始时间' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="总时长" v-bind="formItemLayout">
                  <a-input-number :min="1" :max="600" v-model="duration" @change="changeDuration" />
                  分钟
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="上课时长" v-bind="formItemLayout">
                  <a-input-number :min="1" :max="600" v-model="attendClassDuration" @change="changeAttendClassDuration" />
                  分钟
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="薪酬类型" v-bind="formItemLayout">
                  <a-select
                    allowClear
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['salTypeId', { rules: [{ required: true, message: '请输入薪酬类型' }] }]"
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
                  <a-input-number :min="0" :max="99999" v-model="signCount" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="默认教室" v-bind="formItemLayout" style="position: relative;">
                  <a-select
                    :allowClear="true"
                    placeholder="请选择教室"
                    v-decorator="['roomId', { initialValue: classPlanRoomDef, rules: [{ required: true, message: '请选择教室' }] }]"
                  >
                    <a-select-option :allowClear="true" :value="room.id" v-for="(room, roomIndex) in roomList" :key="roomIndex">
                      {{ room.roomName }}
                    </a-select-option>
                  </a-select>
                  <a href="javascript:;" @click="listClassWeekPlan()" style="position: absolute; right: -110px;">教室使用安排</a>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="上课导师" v-bind="formItemLayout">
                  <a-select
                    mode="multiple"
                    style="width: calc(100% - 37px);margin-right: 37px;z-index: 144;border-radius: 4px 0 0 4px;"
                    @deselect="deselect"
                    :open="false"
                    v-decorator="['teacherIds', { rules: [{ required: true, message: '请选择上课导师' }] }]"
                    placeholder="请选择上课导师"
                  >
                    <a-icon slot="suffixIcon" type="search" />
                    <a-select-option v-for="(item, idx) in teaSelectArr" :value="item.teacherId" :key="idx">{{ item.teacherName }} </a-select-option>
                  </a-select>
                  <a-input style="cursor: pointer; position: absolute;left: -2px;top: -6.5px;border: none;" class="no-border-input">
                    <a-icon slot="addonAfter" type="search" @click="openSelectModal()" />
                  </a-input>
                  <!-- <a-input placeholder="请选择导师" style="color: #000;" disabled v-decorator="['teaName', { rules: [{ required: true, message: '请选择导师' }]}]">
              <a-icon slot="addonAfter" type="search" class="search-input-searchIcon" @click="openSelectModal" />
            </a-input> -->
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="watchRoom" title="教室使用情况" width="1200px" :footer="null">
      <week-course :defaultRoomId="classPlanRoomDef"></week-course>
    </a-modal>
    <!-- 老师选择组件 -->
    <choose-tea ref="choosetea" :checkType="true" :multiple="true" teaFields="teacher" @getBackData="getTeaData"> </choose-tea>
  </div>
</template>

<script>
import moment from 'moment'
import ChooseTea from '@/components/ChooseTea'
import { listClassWeekPlan, findApplySalType, checkPlanClass } from '@/api/education'
import { WeekCourse } from '@/components'

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
const aLineLayout = {
  labelCol: {
    lg: { span: 2 },
    md: { span: 3 },
    xs: { span: 2 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 12 },
    md: { span: 18 },
    xs: { span: 12 },
    sm: { span: 12 }
  }
}
const classForWeek = [
  {
    title: '星期',
    dataIndex: 'dayInWeek',
    customRender: text => {
      let showText
      if (text == 1) {
        showText = '周一'
      }
      if (text == 2) {
        showText = '周二'
      }
      if (text == 3) {
        showText = '周三'
      }
      if (text == 4) {
        showText = '周四'
      }
      if (text == 5) {
        showText = '周五'
      }
      if (text == 6) {
        showText = '周六'
      }
      if (text == 7) {
        showText = '周日'
      }
      return showText
    }
  },
  {
    title: '开始时间',
    dataIndex: 'startTime'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime'
  },
  {
    title: '上课时长',
    dataIndex: 'attendClassDuration',
    customRender: text => {
      return text ? `${text}分钟` : ''
    }
  },
  {
    title: '总时长',
    dataIndex: 'duration',
    customRender: text => {
      return text ? `${text}分钟` : ''
    }
  },
  {
    title: '薪酬类型',
    dataIndex: 'salTypeName'
  },
  {
    title: '签到计次',
    dataIndex: 'signCount'
  },
  {
    title: '教室',
    dataIndex: 'roomName'
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const plainOptions = [
  { weekStr: '周一', weekNo: 1 },
  { weekStr: '周二', weekNo: 2 },
  { weekStr: '周三', weekNo: 3 },
  { weekStr: '周四', weekNo: 4 },
  { weekStr: '周五', weekNo: 5 },
  { weekStr: '周六', weekNo: 6 },
  { weekStr: '周日', weekNo: 7 }
]
export default {
  name: 'addClassPlans',
  components: {
    WeekCourse,
    ChooseTea
  },
  props: {
    roomList: {
      type: Array,
      default: () => []
    },
    classPlansInfo: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    defRoom: {
      type: String,
      default: '0'
    },
    cardDuration: {
      type: [String, Number],
      default: null
    },
    classInfo: {
      type: Object,
      default: null
    }
  },
  watch: {
    isEdit(nv) {
      !nv ? this.setClassPlansList() : ''
    },
    defRoom(nv) {
      this.classPlanRoomDef = nv
    }
  },
  data() {
    return {
      teaIdsArr: [],
      teaSelectArr: [],
      formItemLayout,
      classForWeek,
      plainOptions,
      classForWeekData: [],
      classPlanModal: false,
      weekList: [],
      startTime: null,
      endTime: null,
      duration: null, //总时长
      attendClassDuration: null, //上课时长
      salTypeId: undefined, //薪酬类型id
      salTypeName: undefined, //薪酬类型
      classPlanRoom: '',
      classPlanRoomDef: '',
      loading: false,
      editCPId: null,
      checkDisabled: false,
      //查看教室
      watchRoom: false,
      wrObject: {},
      classPlanModalLoading: false,
      signCount: 1,
      saleryTypeList: []
    }
  },
  beforeCreate() {
    this.classPlanForm = this.$form.createForm(this)
  },
  created() {
    this.classPlanRoomDef = this.defRoom
  },
  methods: {
    deselect(value, option) {
      this.teaIdsArr.remove(value)
      this.teaSelectArr = this.teaSelectArr.filter(item => item.teacherId != value)
      this.classPlanForm.setFieldsValue({
        teacherIds: this.teaIdsArr.join(',')
      })
    },
    openSelectModal() {
      this.$refs.choosetea.open()
    },
    getTeaData(data, type) {
      data.map(item => {
        if (this.teaIdsArr.indexOf(item.teacherId) < 0) {
          this.teaSelectArr.push({ teacherName: item.teacherName, teacherId: item.teacherId, type: 'Y' })
          this.teaIdsArr.push(item.teacherId)
        }
      })
      this.classPlanForm.setFieldsValue({
        teacherIds: this.teaIdsArr
      })
    },
    setClassPlansList() {
      if (this.classPlansInfo.length > 0) {
        this.classPlansInfo.forEach((item, index) => {
          item.createdId = `${item.classId}${Math.random()}`
          item.duration = this.getDuration(item.startTime, item.endTime)
        })
      }
      this.classForWeekData = this.classPlansInfo
    },
    // 通过上课时长,班型id匹配薪酬类型
    findApplySalType() {
      let classTypeId = this.classInfo?.classTypeId
      let classTypeIdSec = this.classInfo?.classTypeIdSec
      if (classTypeId?.length) {
        return new Promise((resolve, reject) => {
          findApplySalType({
            eduTypeId: classTypeId,
            classTypeId: classTypeIdSec,
            attendClassDuration: this.attendClassDuration || 0
          }).then(res => {
            this.saleryTypeList = res.data || []
            let salTypeId = this.classPlanForm.getFieldValue('salTypeId')
            if (salTypeId && this.saleryTypeList.findIndex(item => item.id === salTypeId) === -1) {
              this.classPlanForm.setFieldsValue({ salTypeId: undefined })
            }
            resolve()
          })
        })
      } else {
        return Promise.resolve()
      }
    },
    initTable() {
      this.classForWeekData = []
      this.initModalValues()
    },

    initModalValues() {
      return new Promise(resolve => {
        this.weekList = []
        this.classPlanForm.resetFields()
        this.startTime = null
        this.endTime = null
        this.duration = null
        this.editCPId = null
        this.salTypeId = undefined
        this.salTypeName = undefined
        this.checkDisabled = false
        this.$nextTick(() => {
          this.classPlanForm.setFieldsValue({ salTypeId: undefined })
        })
        this.findApplySalType()
        resolve()
      })
    },
    setModalValues(data) {
      return new Promise(resolve => {
        this.teaIdsArr = data.teachers.map(item => item.teacherId)
        const val = {
          startTime: moment(data.startTime, 'HH:mm'),
          endTime: moment(data.endTime, 'HH:mm'),
          roomId: data.roomId,
          salTypeId: data.salTypeId,
          teacherIds: this.teaIdsArr
        }
        this.$nextTick(() => {
          this.classPlanForm.setFieldsValue(val)
        })
        this.duration = data.duration
        this.startTime = data.startTime
        this.endTime = data.endTime
        this.weekList = [data.dayInWeek]
        this.editCPId = data.createdId
        this.signCount = data.signCount
        this.attendClassDuration = data.attendClassDuration
        this.salTypeId = data.salTypeId
        this.salTypeName = data.salTypeName
        this.teaSelectArr = JSON.parse(JSON.stringify(data.teachers))
        this.checkDisabled = true
        this.findApplySalType()
        resolve()
      })
    },
    removeBtn(data) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this.removeClassPlan(data)
        }
      })
    },
    removeClassPlan(data) {
      return new Promise(resolve => {
        this.classForWeekData.forEach((item, index) => {
          if (data == item.createdId) {
            this.classForWeekData.splice(index, 1)
            resolve(index)
          }
        })
      })
    },
    addClassDate(data) {
      this.classPlanForm.resetFields()
      this.teaIdsArr = []
      this.teaSelectArr = []
      this.classPlanModal = true
      !data ? this.initModalValues() : this.setModalValues(data)
    },
    onChange(checkedValues) {
      this.weekList = checkedValues.sort(function(a, b) {
        return a - b
      })
    },
    changeSTime(value, time) {
      this.startTime = time
      this.endTime ? this.computedTime(time, this.endTime, undefined) : ''
      !this.endTime && this.duration ? this.computedTime(time, undefined, this.duration) : ''
    },
    changeETime(value, time) {
      this.endTime = time
      this.startTime ? this.computedTime(this.startTime, time, undefined) : ''
      !this.startTime && this.duration ? this.computedTime(undefined, time, this.duration) : ''
    },
    changeDuration(value) {
      // if (Number(this.cardDuration) > 0) {
      //   this.signCount = (Number(value) / this.cardDuration).toFixed(2)
      // }
      !this.startTime && this.endTime ? this.computedTime(undefined, this.endTime, value) : ''
      this.startTime ? this.computedTime(this.startTime, undefined, value) : ''

      if (this.attendClassDuration > this.duration) {
        this.changeAttendClassDuration(this.attendClassDuration)
      }
    },
    changeAttendClassDuration(value) {
      if (value > this.duration) {
        this.attendClassDuration = this.duration
      }
      this.findApplySalType().then(() => this.calculationCount())
    },
    calculationCount() {
      this.$nextTick(() => {
        let salTypeId = this.classPlanForm.getFieldValue('salTypeId')
        let salType = this.saleryTypeList.find(item => item.id === salTypeId)
        if (salType) {
          this.signCount = ((this.attendClassDuration / salType.duration) * salType.timesCount).toFixed(2)
        }
      })
    },
    changeSalType(value) {
      this.salTypeId = value
      if (value) {
        let item = this.saleryTypeList.find(item => item.id === value)
        this.salTypeName = item.name
        this.calculationCount()
      }
    },
    getDuration(stime, etime) {
      const Duration = (etime.slice(0, 2) - stime.slice(0, 2)) * 60 + (etime.slice(3, 5) - stime.slice(3, 5))
      return Duration
    },
    computedTime(stime, etime, duration) {
      let STime, ETime, Duration
      if (stime && etime) {
        const sh = stime.slice(0, 2)
        const eh = etime.slice(0, 2)
        const sm = etime.slice(3, 5)
        const em = etime.slice(3, 5)
        Duration = (etime.slice(0, 2) - stime.slice(0, 2)) * 60 + (etime.slice(3, 5) - stime.slice(3, 5))
        if (eh - sh < 0 || Duration < 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '结束时间必须大于开始时间'
          })
          return
        }
      }
      if (etime && duration) {
        STime = `${etime.slice(0, 2) - Math.floor(duration / 60)}:${etime.slice(3, 5) - (duration % 60)}`
      }
      if (stime && duration) {
        let h, m
        ETime = `${stime.slice(0, 2) - 0 + Math.floor(duration / 60)}:${stime.slice(3, 5) - 0 + (duration % 60)}`
        h = stime.slice(0, 2) - 0 + Math.floor(duration / 60)
        m = stime.slice(3, 5) - 0 + (duration % 60)
        if (m >= 60) {
          m = m % 60
          h = h - 0 + 1
        }
        ETime = `${h}:${m}`
      }

      Duration ? (this.duration = Duration) : ''
      this.$nextTick(() => {
        if (STime) {
          this.classPlanForm.setFieldsValue({ ['startTime']: moment(STime, 'HH:mm') })
        }
        if (ETime) {
          this.classPlanForm.setFieldsValue({ ['endTime']: moment(ETime, 'HH:mm') })
        }
        // if (Number(this.cardDuration) > 0) {
        //   this.signCount = (Number(this.duration) / this.cardDuration).toFixed(2)
        // }
      })
    },
    openTreeModal(type) {
      this.userType = type
      this.$refs.modal.open()
    },
    roomChange(val) {
      this.classPlanRoomDef = val
    },
    checkClassPlan(data) {
      this.classPlanForm.validateFields((err, values) => {
        if (this.weekList.length == 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请选择一个星期'
          })
          return false
        }

        if (err) return
        this.classPlanModalLoading = true
        const checkParams = {
          salTypeId: values.salTypeId,
          teacherIds: values.teacherIds.join(',')
        }
        checkPlanClass(checkParams).then(res => {
          values.startTime = values.startTime.format('HH:mm')
          values.endTime = values.endTime.format('HH:mm')
          this.roomList.forEach(item => {
            if (item.id == values.roomId) {
              values.roomName = item.roomName
            }
          })
  
          let weekList = [],
            classPlan = {}
          if (this.weekList && this.weekList.length > 0) {
            this.weekList.forEach((week, index) => {
              classPlan = {
                duration: this.duration,
                dayInWeek: week,
                createdId: `${week}${values.roomId}${Math.random()}`,
                signCount: this.signCount,
                attendClassDuration: this.attendClassDuration,
                salTypeId: this.salTypeId,
                salTypeName: this.salTypeName,
                teachers: this.teaSelectArr
              }
              classPlan = Object.assign(classPlan, values)
              if (this.checkDisabled) {
                this.removeClassPlan(this.editCPId).then(idx => {
                  this.classForWeekData.splice(idx, 0, classPlan)
                })
              } else {
                weekList.push(classPlan)
              }
              // weekList.push(classPlan)
            })
            // weekStr = weekStr.slice(0, weekStr.length - 1)
          }
          this.calssPlanReset(weekList)
          this.classPlanModal = false
          this.classPlanModalLoading = false

        }).finally(() => {
          this.classPlanModalLoading = false
        })
      })
    },
    calssPlanReset(arr) {
      if (this.classForWeekData.length > 0) {
        // this.classForWeekData.forEach((cfwd, idx) => {
        //   arr.forEach(item => {
        //     if (item.dayInWeek <= cfwd.dayInWeek) {
        //       this.classForWeekData.splice(idx, 0, item)
        //     }else{
        //       console.log(idx)
        //       this.classForWeekData[idx] = item
        //     }
        //   })

        // })

        const newArr = this.classForWeekData.concat(arr)
        this.classForWeekData = newArr
        // let resetArr = new Array()
        // newArr.map((val, idx) => {
        //   console.log(val)
        //   resetArr.map((value, index) => {
        //     if (value.dayInWeek && value) {
        //       if (val.dayInWeek <= value.dayInWeek) {
        //         resetArr.splice(index, 0, val)
        //       } else {
        //         resetArr.splice(index, 0, value)
        //       }
        //     }else{
        //       resetArr.push(val)
        //     }
        //   })
        //   console.log(resetArr)
        // })
      } else {
        this.classForWeekData = arr
      }
    },
    listClassWeekPlan() {
      this.watchRoom = true
    },
    getClassPlansValues() {
      return new Promise((resolve, reject) => {
        const plans = JSON.stringify(this.classForWeekData)
        resolve(plans)
      })
    }
  }
}
</script>

<style scoped lang="less">
.classPlans {
  header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 18px;
      font-weight: 700;
    }
    .text {
      position: relative;
      top: 5px;
    }
  }
  .ant-checkbox-group {
    width: 100% !important;
  }
}
</style>
