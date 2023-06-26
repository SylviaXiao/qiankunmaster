<template>
  <div :roomList="roomList" :classPlansInfo="classPlansInfo" :isEdit="isEdit" :defRoom="defRoom">
    <a-spin :spinning="isEdit">
      <a-card :bordered="false" class="card">
        <div class="classPlans">
          <header>
            <div>
              <span class='title'>上课时间</span>
              <span >
                <a-button style="height: 30px; width: 150px; margin: 0 20px;" @click='addClassDate()'>添加</a-button>
              </span>
            </div>
            <div class="text"><p style="color:red">重要提示：学员签到扣次 = 签到计次，导师课酬 = 薪酬类型 x 签到计次。</p></div>
          </header>
          <div class="container">
            <a-table :columns="classForWeek"
                     :dataSource='classForWeekData'
                     size="middle"
                     :pagination="false"
                     rowKey="createdId">
          <span slot='action' slot-scope="text, record">
            <a href="javascript:;" style='margin-right: 15px' @click='addClassDate(text)'>编辑</a>
            <a href="javascript:;" @click='removeBtn(record.createdId)'>删除</a>
          </span>
            </a-table>
          </div>
        </div>
      </a-card>
    </a-spin>
    <!-- 新增排课Modal -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
             title="排课计划"
             :width="800"
             :confirmLoading="classPlanModalLoading"
             v-model='classPlanModal'
             @ok="checkClassPlan()">
      <div class="classPlansContent">
        <div class="weekCheckboxs">
          <a-checkbox-group @change="onChange" style="width: 100%;" v-model="weekList">
            <a-row type="flex" justify="space-between">
              <a-col :span="3" v-for="(item,index) in plainOptions" :key="index">
                <a-checkbox :disabled="checkDisabled" :value="item.weekNo">{{item.weekStr}}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
        <a-divider/>
        <div class="classPlanForm">
          <a-form :form="classPlanForm">
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="开始时间" v-bind="formItemLayout">
                  <a-time-picker format="HH:mm" :minuteStep="5" @change="changeSTime"
                                 v-decorator="[ 'startTime',{rules: [{ required: true, message: '请选择开始时间' }]}]"/>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="结束时间" v-bind="formItemLayout">
                  <a-time-picker format="HH:mm" :minuteStep="5" @change="changeETime"
                                 v-decorator="[ 'endTime',{rules: [{ required: true, message: '请选择开始时间' }]}]"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="时长" v-bind="formItemLayout">
                  <a-input-number :min="1" :max="600" v-model="duration" @change="changeDuration"/>
                  分钟
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="学员签到计次" v-bind="formItemLayout">
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
              </a-row>
          </a-form>
        </div>
      </div>
    </a-modal>    
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="watchRoom" title="教室使用情况" width="1200px" :footer="null">
      <week-course :defaultRoomId="classPlanRoomDef"></week-course>
    </a-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import {
    listClassWeekPlan
  } from '@/api/education'
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
      title: '时长',
      dataIndex: 'duration',
      customRender: text => {
        let showText = `${text}分钟`
        return showText
      }
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
      WeekCourse
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
      salType: {
        type: Object,
        required:false
      }
    },
    watch: {
      isEdit(nv) {
        !nv ? this.setClassPlansList() : ''
      },
      defRoom(nv) {
        this.classPlanRoomDef = nv
      },
      // salType(newValue) {
        // console.log('当前salType', newValue)
      // },
      duration(newValue) {
        this.calcSignCount()
      }
    },
    data() {
      return {
        formItemLayout,
        classForWeek,
        plainOptions,
        classForWeekData: [],
        classPlanModal: false,
        weekList: [],
        startTime: null,
        endTime: null,
        duration: null,
        classPlanRoom: '',
        classPlanRoomDef: '',
        loading: false,
        editCPId: null,
        checkDisabled: false,
        wrObject: {},
        classPlanModalLoading: false,
        signCount: 1,
        watchRoom: false
      }
    },
    beforeCreate() {
      this.classPlanForm = this.$form.createForm(this)
    },
    created() {
      this.classPlanRoomDef = this.defRoom
    },
    methods: {
      setClassPlansList() {
        // console.log(this.classPlansInfo)
        if (this.classPlansInfo.length > 0) {
          this.classPlansInfo.forEach((item, index) => {
            // item.createdId = `${item.classId}${index}`
            item.createdId = `${item.classId}${Math.random()}`
            item.duration = this.getDuration(item.startTime, item.endTime)
          })

        }
        this.classForWeekData = this.classPlansInfo
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
          this.checkDisabled = false
          this.signCount = 1
          resolve()
        })

      },
      setModalValues(data) {
        return new Promise(resolve => {
          const val = {
            startTime: moment(data.startTime, 'HH:mm'),
            endTime: moment(data.endTime, 'HH:mm'),
            roomId: data.roomId
          }
          this.$nextTick(() => {
            this.classPlanForm.setFieldsValue(val)
          })
          this.duration = data.duration
          this.startTime = data.startTime
          this.endTime = data.endTime
          this.weekList = [data.dayInWeek]
          this.editCPId = data.createdId
          // this.signCount = data.signCount
          this.calcSignCount()
          this.checkDisabled = true
          resolve()

        })


      },
      calcSignCount() {
        if (this.salType?.duration && this.duration) {
          this.signCount = (this.duration / this.salType.duration).toFixed(2)
          // console.log('当前计次时长', this.salType.duration)
        }
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
        !this.startTime && this.endTime ? this.computedTime(undefined, this.endTime, value) : ''
        this.startTime ? this.computedTime(this.startTime, undefined, value) : ''
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
          STime = `${(etime.slice(0, 2) - Math.floor(duration / 60))}:${(etime.slice(3, 5) - duration % 60)}`

        }
        if (stime && duration) {
          let h, m
          ETime = `${(stime.slice(0, 2) - 0 + Math.floor(duration / 60))}:${(stime.slice(3, 5) - 0 + duration % 60)}`
          h = (stime.slice(0, 2) - 0 + Math.floor(duration / 60))
          m = (stime.slice(3, 5) - 0 + duration % 60)
          if (m >= 60) {
            m = m % 60
            h = h - 0 + 1
          }
          ETime = `${h}:${m}`
        }

        Duration ? this.duration = Duration : ''
        this.$nextTick(() => {
          if (STime) {
            this.classPlanForm.setFieldsValue({ ['startTime']: moment(STime, 'HH:mm') })
          }
          if (ETime) {
            this.classPlanForm.setFieldsValue({ ['endTime']: moment(ETime, 'HH:mm') })
          }
        })

      },
      openTreeModal(type) {
        this.userType = type
        this.$refs.modal.open()
      },
      listClassWeekPlan() {
        this.watchRoom = true
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


          if (!err) {
            this.classPlanModalLoading = true
            values.startTime = values.startTime.format('HH:mm')
            values.endTime = values.endTime.format('HH:mm')
            this.roomList.forEach(item => {
              if (item.id == values.roomId) {
                values.roomName = item.roomName
              }
            })

            let weekList = [], classPlan = {}
            if (this.weekList && this.weekList.length > 0) {
              this.weekList.forEach((week, index) => {
                classPlan = {
                  duration: this.duration,
                  dayInWeek: week,
                  createdId: `${week}${values.roomId}${Math.random()}`,
                  signCount: this.signCount
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
            // console.log(weekList)
            this.classPlanModal = false
            this.classPlanModalLoading = false
          }
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
      getClassPlansValues() {
        return new Promise((resolve, reject) => {
          const plans = JSON.stringify(this.classForWeekData)
          resolve(plans)
        })
      }
    }
  }
</script>

<style scoped lang=less>
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
