<template>
  <div>
    <a-card :bordered="false" class="card" :title="formTitle">
      <a-form :form='addClassForm'>
        <!-- 班级名称 计划课次 预招人数 -->
        <a-row class="form-row" :gutter="16">
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="班级名称" v-bind="formItemLayout">
              <a-input placeholder="请输入班级名称"
                       v-decorator="[
                'className',
                {rules: [{ required: true, message: '请输入班级名称' }]}
              ]"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="计划课次" v-bind="formItemLayout">
              <a-input
                placeholder="请输入计划课次"
                addonAfter="课次"
                v-decorator="['courseCount']"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="16">
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="卡种" v-bind="formItemLayout">
              <span @click="setCardValue()">
                  <a-input placeholder="请选择卡种" disabled
                           style="cursor: pointer;color: #000;"
                           v-decorator="[ 'deptCardName']"/>
                </span>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item
              label="默认教室"
              v-bind="formItemLayout">
              <a-select :allowClear="true"
                @change='roomChange'
                placeholder="请选择教室"
                v-decorator="[ 'roomId']">
                <a-select-option :allowClear="true" :value="room.id" v-for="(room,roomIndex) in roomList" :key="roomIndex">
                  {{room.roomName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 计划开班时间 计划结业时间 -->
        <a-row class="form-row" :gutter="16">
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="起止时间" v-bind="formItemLayout">
              <a-range-picker
                v-decorator="[ 'classDate']"
                style="width: 100%;"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item
              label="预招人数"
              v-bind="formItemLayout">
              <a-input placeholder="请输入预招人数" v-decorator="['total']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 上课导师 顾问 -->
        <a-row class="form-row" :gutter="16">
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="上课导师" v-bind="formItemLayout">
               <span>
                  <a-input disabled v-decorator="['teacher']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('teacher')"/>
                  </a-input>
               </span>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="顾问" v-bind="formItemLayout">
              <span>
                  <a-input disabled v-decorator="['master']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('master')"/>
                  </a-input>
               </span>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 助教  教研组负责人 -->
        <a-row class="form-row" :gutter="16">
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="助教" v-bind="formItemLayout">
               <span>
                 <a-input v-decorator="['assistant']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('assistant')"/>
                  </a-input>
               </span>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="教研组负责人" v-bind="formItemLayout">
              <span>
                  <a-input disabled v-decorator="['educator']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('educator')"/>
                  </a-input>
               </span>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 备注 -->
        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :xs='24' :sm="24">
            <a-form-item label="备注"
                         v-bind="aLineLayout">
              <a-textarea
                placeholder="请输入备注"
                aotosize
                v-decorator="['classDesc']"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false" class="card">
      <div class="classPlans">
        <header>
          <span class='title'>上课时间</span>
          <span><a-button style="height: 30px; width: 150px; margin: 0 20px;"
                          @click='addClassDate()'>添加</a-button></span>
          <!--        <span>(系统自动排一周的课程)</span>-->
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
    <!-- fixed footer toolbar -->
    <footer-tool-bar>
      <a-button type="primary" @click="sendForm()" :loading="loading">提交</a-button>
    </footer-tool-bar>
    <!-- 员工选择 -->
    <i-modal ref="modal"
             :multiple='false'
             :userType="userType"
             @ok="imodalOk"
             @close="imodalClose"
             @getBackData="getBackData"></i-modal>
    <!-- 新增排课Modal -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
      title="排课计划"
      :width="600"
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
          <div class="title">上课时间</div>
          <a-form :form="classPlanForm">
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="开始时间" v-bind="formItemLayout">
                  <a-time-picker :minuteStep="5" format="HH:mm" @change="changeSTime" v-decorator="[ 'startTime']"/>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="结束时间" v-bind="formItemLayout">
                  <a-time-picker :minuteStep="5" format="HH:mm" @change="changeETime" v-decorator="[ 'endTime']"/>
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
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item
                  label="默认教室"
                  v-bind="formItemLayout">
                  <a-select :allowClear="true"
                    placeholder="请选择教室"
                    v-decorator="[ 'roomId',{initialValue:classPlanRoomDef}]">
                    <a-select-option :allowClear="true" :value="room.id" v-for="(room,roomIndex) in roomList" :key="roomIndex">
                      {{room.roomName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item>
                  <a href="javascript:;" @click="listClassWeekPlan()">教室使用安排</a>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="watchRoom"
             title="教室使用情况"
             width="1200px">
      <div class="wr-header">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              label="当前教室"
              :labelCol="{span:4}"
              :wrapperCol="{span:12}">
              <a-select :allowClear="true"
                placeholder="请选择教室" style="width: 100%;"
                defaultValue="0" @change="changeRoomForPlans">
                <a-select-option :allowClear="true" value="0">所有教室</a-select-option>
                <a-select-option :allowClear="true" :value="room.id" v-for="(room,roomIndex) in roomList" :key="roomIndex">
                  {{room.roomName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="wr-container">
        <a-row :gutter="16" type="flex" justify="space-between" align="top" style="margin-bottom: 12px;">
          <a-col :lg="3" :md="3" :sm="3"
                 v-for="(item,index) in plainOptions" :key='index'>
            <div class="wr-week">{{item.weekStr}}</div>
          </a-col>
        </a-row>
        <a-row :gutter="16" type="flex" justify="space-between" align="top">
          <a-col :lg="3" :md="3" :sm="3"
                 v-for="(item,index) in plainOptions" :key='index'>
            <div class="wr-class">
              <div class="wr-class-list" v-for="(val,classIndex) in wrObject[index+1]" :key="classIndex">
                <div class="wr-time">
                  {{`${val.startTime}-${val.endTime}`}}
                </div>
                <div class="wr-roomName">{{`${val.roomName}`}}</div>
                <a-divider style="margin: 5px 0;"/>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <card-modal ref="cardModal"
                @ok="cardModalOk"
                @close="cardModalClose"
                @getBackData="getCardData">

    </card-modal>
  </div>
</template>

<script>
  import { IModal, CardModal } from '@/components'
  import FooterToolBar from '@/components/FooterToolbar'

  import {
    getDanceList,
    getRoomList,
    getCardList,
    getCardTypeList,
    saveClass,
    getClassInfo,
    listClassWeekPlan
  } from '@/api/education'
  import moment from 'moment'
  import MultiTab from '@/components/MultiTab'

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
  const fieldNameList = ['className', 'danceId', 'deptCardId', 'roomId', 'total',
    'courseCount', 'classDesc', 'cardTypeId'
  ]
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
  const classForWeekData = [
    // { dayInWeek: '周一', startTime: '9:30', endTime: '12:00', roomName: '西湖教室', duration: '150', roomId: '1' }
  ]
  // const plainOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
    name: 'addClass',
    components: {
      FooterToolBar,
      IModal,
      CardModal
    },
    data() {
      return {
        formItemLayout,
        aLineLayout,
        classForWeek,
        plainOptions,
        formTitle: '新增班级',
        //下拉数据
        cardList: [],
        cardTypeList: [],
        danceList: [],
        roomList: [],
        //
        formValues: {},
        userType: null,

        classForWeekData: classForWeekData,
        classPlanModal: false,
        // classPlanRoomDef: null,
        weekList: [],
        startTime: null,
        endTime: null,
        duration: null,
        classPlanRoom: '',
        classPlanRoomDef: '',
        loading: false,
        editCPId: null,
        checkDisabled: false,
        //查看教室
        watchRoom: false,
        wrObject: {}

      }
    },
    beforeCreate() {
      this.addClassForm = this.$form.createForm(this)
      this.classPlanForm = this.$form.createForm(this)
    },
    created() {
      this.getSelectList()
    },
    methods: {
      editClass() {
        const classId = this.$route.params.classid
        getClassInfo(classId).then(res => {
          const result = res.data
          const planList = result.planList
          const deptCard = result.eduDeptCard
          let classDate
          this.$nextTick(() => {
            fieldNameList.forEach(item => {
              this.addClassForm.setFieldsValue({ [item]: result[item] })
            })
            result.startDate && result.endDate ? classDate = [moment(result.startDate, 'YYYY-MM-DD'), moment(result.endDate, 'YYYY-MM-DD')] : classDate = []
            this.addClassForm.setFieldsValue({ ['classDate']: classDate })
            if (deptCard) {
              this.addClassForm.setFieldsValue({ ['danceId']: deptCard.eduCard.eduDance.id || '' })
              this.addClassForm.setFieldsValue({ ['deptCardId']: deptCard.eduCard.id || '' })
              this.addClassForm.setFieldsValue({ ['roomId']: result.eduRoom.id || '' })
              this.addClassForm.setFieldsValue({ ['cardTypeId']: deptCard.eduCard.eduCardType.id || '' })
            }
            if (result.orgUserMaster) {
              this.addClassForm.setFieldsValue({ ['master']: result.orgUserMaster.userName })
              this.formValues.masterId = result.orgUserMaster.id
            }
            if (result.orgUserTeacher) {
              this.addClassForm.setFieldsValue({ ['teacher']: result.orgUserTeacher.userName })
              this.formValues.teacherId = result.orgUserTeacher.id
            }
            if (result.orgUserEducator) {
              this.addClassForm.setFieldsValue({ ['educator']: result.orgUserEducator.userName })
              this.formValues.educatorId = result.orgUserEducator.id
            }
            if (result.orgUserAssistant) {
              this.addClassForm.setFieldsValue({ ['assistant']: result.orgUserAssistant.userName })
              this.formValues.assistantId = result.orgUserAssistant.id
            }
          })
          this.classForWeekData = planList ? planList : []

        })
      },
      getSelectList() {
        getRoomList({ page: '1', limit: '100' }).then(res => this.roomList = res.data)
      },

      setCardValue() {
        this.$refs.cardModal.open()
      },
      cardModalOk() {
      },
      cardModalClose() {
      },
      getCardData(value) {
        this.$nextTick(() => {
          this.formValues.deptCardId = value.id
          this.addClassForm.setFieldsValue({ ['deptCardName']: value.cardName })
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
        if (data) {
          this.$nextTick(() => {
            this.classPlanForm.resetFields()
            this.classPlanForm.setFieldsValue({ ['startTime']: moment(data.startTime, 'HH:mm') })
            this.classPlanForm.setFieldsValue({ ['endTime']: moment(data.endTime, 'HH:mm') })
            this.classPlanForm.setFieldsValue({ ['roomId']: data.roomId })
            this.duration = data.duration
            this.startTime = data.startTime
            this.endTime = data.endTime
            this.weekList = [data.dayInWeek]
            this.editCPId = data.createdId
            this.checkDisabled = true
          })
        } else {
          this.$nextTick(() => {
            this.weekList = []
            this.classPlanForm.resetFields()
            this.startTime = null
            this.endTime = null
            this.duration = null
            this.editCPId = null
            this.checkDisabled = false
          })
        }
        this.classPlanModal = true
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
      imodalOk() {
      },
      imodalClose() {
      },
      getBackData(data, type) {
        this.$nextTick(() => {
          this.addClassForm.setFieldsValue({ [type]: data.name })
          this.formValues[`${type}Id`] = data.id
        })
      },
      roomChange(val) {
        this.classPlanRoomDef = val
      },
      checkClassPlan(data) {
        this.classPlanForm.validateFields((err, values) => {
          if (!err) {
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
                  createdId: `${week}${values.roomId}${index}`
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
          }
        })
      },
      calssPlanReset(arr) {
        if (this.classForWeekData.length > 0) {
          const newArr = this.classForWeekData.concat(arr)
          this.classForWeekData = newArr
        } else {
          this.classForWeekData = arr
        }

      },
      listClassWeekPlan() {
        listClassWeekPlan().then(res => {
          this.wrObject = res.data
          this.watchRoom = true
        })
      },
      changeRoomForPlans(val) {
        let data
        val == 0 ? data = {} : data = { roomId: val }
        listClassWeekPlan(data).then(res => {
          this.wrObject = res.data
        })
      },
      sendForm() {
        const key = '/education/addClass'
        MultiTab.methods.closeThat(key)
        return
        this.addClassForm.validateFields((err, values) => {
          if (!err) {
            if (values.classDate && values.classDate.length == 2) {
              values.startDate = values.classDate[0].format('YYYY-MM-DD')
              values.endDate = values.classDate[1].format('YYYY-MM-DD')
            }
            if (!this.formValues.assistantId && values.assistant) {
              this.formValues.assistantName = values.assistant
            }
            const deleteFields = ['classDate', 'master', 'teacher', 'assistant', 'educator']
            deleteFields.forEach(item => {
              delete values[item]
            })
            this.formValues.plans = JSON.stringify(this.classForWeekData)
            saveClass(Object.assign(values, this.formValues)).then(res => {

              this.$router.push({ path: '/education/class' })
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
  .classPlans {
    header {
      margin-bottom: 20px;

      .title {
        font-size: 18px;
        font-weight: 700;
      }
    }

    .ant-checkbox-group {
      width: 100% !important;
    }
  }

  .classPlanForm {
    .title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
    }
  }

  .card {
    margin-bottom: 24px;
  }

  .wr-container {
    .wr-class {
      .wr-week {
        margin-bottom: 15px;
      }
    }
  }
</style>
