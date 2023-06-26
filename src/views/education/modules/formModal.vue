<template>
  <a-modal :maskClosable="$store.state.modalMaskClickEnable"
    :title="classTitle"
    :width="800"
    :visible="addClassModal"
    :confirmLoading="confirmLoading"
    @ok='sendForm'
    @cancel='handleCancel'
  >
    <a-form :form='addClassForm'>
      <!-- 班级名称 -->
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="班级名称" v-bind="formItemLayout">
            <a-input placeholder="请输入班级名称"
                     v-decorator="[
                'className',
                {rules: [{ required: true, message: '请输入班级名称' }]}
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 舞种 类型 -->
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="舞种" v-bind="formItemLayout">
            <a-select :allowClear="true"
              placeholder="请选择舞种"
              v-decorator="[ 'danceId']">
              <a-select-option :allowClear="true" :value="dance.id" v-for="(dance,danceIndex) in danceList" :key="danceIndex">
                {{dance.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            label="卡种类型"
            v-bind="formItemLayout">
            <a-select :allowClear="true"
              placeholder="请选择卡种类型"
              v-decorator="[ 'cardTypeId']">
              <a-select-option :allowClear="true" :value="cardType.id" v-for="(cardType,cardTypeIndex) in cardTypeList"
                               :key="cardTypeIndex">{{cardType.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 卡种 默认教室 -->
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="卡种" v-bind="formItemLayout">
            <a-select :allowClear="true"
              placeholder="请选择卡种"
              v-decorator="[ 'deptCardId']">
              <a-select-option :allowClear="true" :value="card.id" v-for="(card,cardIndex) in cardList" :key="cardIndex">
                {{card.cardName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
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
      <!-- 计划课次 预招人数 -->
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="计划课次" v-bind="formItemLayout">
            <a-input
              placeholder="请输入计划课次"
              addonAfter="课次"
              v-decorator="['courseCount']"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            label="预招人数"
            v-bind="formItemLayout">
            <a-input placeholder="请输入预招人数" v-decorator="['total']"/>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 计划开班时间 计划结业时间 -->
      <a-row class="form-row" :gutter="16">
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="计划起止时间" v-bind="aLineItem">
            <a-range-picker
              v-decorator="[ 'classDate']"
              style="width: 100%;"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 上课导师 顾问 -->
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="上课导师" v-bind="formItemLayout">
               <span>
                  <a-input disabled v-decorator="['teacher']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('teacher')"/>
                  </a-input>
               </span>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
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
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="助教" v-bind="formItemLayout">
               <span>
                  <a-select :allowClear="true"
                    mode="tags"
                    placeholder="若无选择请手动输入"
                    v-decorator="['assistantName ']"
                  >
                    </a-select>
               </span>
          </a-form-item>
          <a-icon type="search" style="position: absolute;right: 0;top: 0;" @click="openTreeModal('assistant')"/>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
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
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="备注"
                       :labelCol="{xs: { span: 4 },sm: { span: 4  }}"
                       :wrapperCol="{xs: { span: 20 },sm: { span: 20 }}">
            <a-textarea
              placeholder="请输入备注"
              aotosize
              v-decorator="['classDesc']"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-divider/>
    <div class="classList">
      <header>
        <span class='title'>上课时间</span>
        <span><a-button style="height: 30px; width: 150px; margin: 0 20px;"
                        @click='addClassDate()'>添加</a-button></span>
        <span>(系统自动排一周的课程)</span>
      </header>
      <div class="container">
        <a-table :columns="classForWeek"
                 :dataSource='classForWeekData'
                 size="middle"
                 :pagination="false"
                 rowKet="key">
          <span slot='action' slot-scope="text, record">
            <a href="javascript:;" style='margin-right: 15px'>编辑</a>
            <a href="javascript:;">删除</a>
          </span>
        </a-table>
      </div>
    </div>
    <i-modal ref="modal"
             :multiple='false'
             :userType="userType"
             @ok="imodalOk"
             @close="imodalClose"
             @getBackData="getBackData"></i-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
      title="排课计划"
      :width="600"
      v-model='classPlanModal'
      @ok="checkClassPlan()">
      <div class="classPlansContent">
        <div class="weekCheckboxs">
          <a-checkbox-group @change="onChange" style="width: 100%;" v-decorator="[ 'weekList']">
            <a-row type="flex" justify="space-between">
              <a-col :span="3" v-for="(item,index) in plainOptions" :key="index">
                <a-checkbox :value="item">{{item}}</a-checkbox>
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
                  <a-time-picker  :minuteStep="5" format="HH:mm" @change="changeSTime" v-decorator="[ 'startTime']"/>
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
                  <a href="javascript:;">教室使用安排</a>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </a-modal>
  </a-modal>
</template>

<script>
  import { IModal } from '@/components'
  import {
    getDanceList,
    getRoomList,
    getCardList,
    getClassTypeList,
    saveClass,
    removeClass
  } from '@/api/education'
  import moment from 'moment'

  const formItemLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 }
    }
  }
  const fieldNameList = ['className', 'danceId', 'deptCardId', 'roomId', 'total',
    'courseCount', 'classDesc', 'cardTypeId'
  ]
  const classForWeek = [
    {
      title: '星期',
      dataIndex: 'week'
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
      scopedSlots: { customRender: 'action' }
    }
  ]
  const classForWeekData = [
    { week: '周一', startTime: '9:30', endTime: '12:00', room: '西湖教室', key: '1' }
  ]
  const plainOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  export default {
    name: 'addClass',
    components: {
      IModal
    },
    data() {
      return {
        classTitle: '班级表单',
        formItemLayout,
        aLineItem: this.$tools.aLineItem,
        addClassModal: false,
        confirmLoading: false,
        //TODO
        cardList: [],
        cardTypeList: [],
        danceList: [],
        roomList: [],
        formValues: {},
        userType: '',

        classPlanModal: false,
        classForWeek,
        classForWeekData: classForWeekData,
        plainOptions,
        weekList: [],
        startTime: null,
        endTime: null,
        duration: null,
        classPlanRoom: '',
        classPlanRoomDef: ''
      }
    },
    watch: {
      addClassModal(newValue, oldValue) {
        newValue ? this.getSelectData() : ''
      }
    },
    beforeCreate() {
      this.addClassForm = this.$form.createForm(this)
      this.classPlanForm = this.$form.createForm(this)
    },
    methods: {
      add() {
        this.classTitle = '新增班级'
        this.edit()
      },
      edit(data) {
        this.addClassModal = true
        if (data) {
          this.classTitle = '修改班级'
          this.formValues.id = data.id
          const info = data
          let classDate
          fieldNameList.forEach(item => {
            this.$nextTick(() => {
              this.addClassForm.setFieldsValue({ [item]: info[item] })
            })
          })
          info.startDate && info.endDate ? classDate = [moment(info.startDate, 'YYYY-MM-DD'), moment(info.endDate, 'YYYY-MM-DD')] : classDate = []
          this.$nextTick(() => {
            this.addClassForm.setFieldsValue({ ['classDate']: classDate })
          })
        }
      },
      close() {
        this.$emit('close')
        this.addClassModal = false
      },
      getSelectData() {
        getCardList({ page: '1', limit: '100' }).then(res => this.cardList = res.data)
        getDanceList({ page: '1', limit: '100' }).then(res => this.danceList = res.data)
        getRoomList({ page: '1', limit: '100' }).then(res => this.roomList = res.data)
        getClassTypeList().then(res => this.cardTypeList = res.data)
      },
      sendForm() {
        this.addClassForm.validateFields((err, values) => {
          if (!err) {
            if (values.classDate && values.classDate.length == 2) {
              values.startDate = values.classDate[0].format('YYYY-MM-DD')
              values.endDate = values.classDate[1].format('YYYY-MM-DD')
            }
            const deleteFields = ['classDate', 'master', 'teacher', 'assistant', 'educator']
            deleteFields.forEach(item => {
              delete values[item]
            })
            if (!this.formValues.assistantId && this.assistant) {
              this.formValues.assistantName = this.assistant[0]
            }
            saveClass(Object.assign(values, this.formValues)).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.close()
            })
          }
        })
      },
      handleCancel() {
        this.close()
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

      addClassDate() {
        this.classPlanModal = true
      },
      onChange(checkedValues) {
        this.weekList = checkedValues
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
      roomChange(val) {
        this.classPlanRoomDef = val
      },
      checkClassPlan() {
        this.classPlanForm.validateFields((err, values) => {
          if (!err) {
            values.startTime = values.startTime.format('HH:mm')
            values.endTime = values.endTime.format('HH:mm')
            this.roomList.forEach(item => {
              if (item.id == values.roomId) {
                values.roomName = item.roomName
              }
            })
            let weekStr = ''
            if (this.weekList && this.weekList.length > 0) {
              this.weekList.forEach(week => {
                weekStr = weekStr + week + '、'
              })
              weekStr = weekStr.slice(0, weekStr.length - 1)
            }
            let classPlan = {
              duration: this.duration,
              week: weekStr
            }
            classPlan = Object.assign(classPlan, values)
            this.classForWeekData.push(classPlan)
            this.classPlanModal = false
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
  .classList {
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

</style>