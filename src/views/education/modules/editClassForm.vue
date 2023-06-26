<template>
  <div :roomList="roomList" :formTitle="formTitle" :classInfo="classInfo" :isEdit="isEdit">
    <a-spin :spinning="isEdit">
      <a-card :bordered="false" class="card" :title="formTitle">
        <a-form :form="addClassForm">
          <!-- 班级名称 -->
          <a-row class="form-row" :gutter="16">
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="班级名称" v-bind="formItemLayout">
                <a-input placeholder="请输入班级名称" v-decorator="['className', { rules: [{ required: true, message: '请输入班级名称' }] }]" />
                <span slot="extra" style="color:#999;font-size:12px;">
                  <span v-if="isChildren">少儿班: 舞种+班级名称+老师(身份证名字) -例如“拉丁舞启蒙一班 宋明珠</span>
                  <span v-else>
                    <div>教练班:开班日期+舞种+班级名称+老师(身份证名字)-例“11.2流行舞精进班 游颖</div>
                    <div>常规班: 舞种+班级名称+老师 (身份证名字)-例“中国舞A班 张美琦</div>
                  </span>
                  </span>
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24" style="min-height: 102px;">
              <a-form-item label="班型" v-bind="formItemLayout" required  style="margin-bottom:-0.24rem;" >
                <a-row>
                  <a-col :lg="12" :md="24" >
                    <a-form-item>
                      <span slot="extra" style="color:#999;font-size:12px;">（班型是教练班、集训班时小班型必选）</span>
                      <a-select
                        placeholder="请选择"
                        @change="handleClassTypeChange"
                        :disabled="isChildren"
                        v-decorator="['classTypeId', { rules: [{ required: true, message: '请选择班型' }] }]"
                      >
                        <a-select-option v-for="typeItem in filterClassTypeList" :key="typeItem.id" :value="typeItem.id">{{ typeItem.name }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :lg="12" :md="24">
                    <a-form-item>
                      <a-select allowClear v-decorator="['classTypeIdSec', { rules: [{ required: classTypeIdSecRequired, message: '请选择二级' }] }]">
                        <a-select-option  v-for="child in classTypeChildren" :key="child.id" :value="child.id">{{ child.name }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="舞种" v-bind="formItemLayout">
                <a-select
                  allowClear
                  v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]"
                  placeholder="请选择舞种"
                  @change="changeDance"
                >
                  <a-select-option :allowClear="true" :value="dance.id" v-for="(dance, danceIndex) in danceList" :key="danceIndex">
                    {{ dance.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="人群" v-bind="formItemLayout">
                <a-select :allowClear="true" :disabled="isChildren" v-decorator="['classType', { rules: [{ required: true, message: '请选择人群' }] }]" placeholder="成人/少儿">
                  <a-select-option value="A">成人</a-select-option>
                  <a-select-option value="B">少儿</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="上课导师" style="position: relative;" class="disabled-select" v-bind="formItemLayout">
                <a-select
                  mode="multiple"
                  style="width: calc(100% - 37px);margin-right: 37px;z-index: 144;border-radius: 4px 0 0 4px;"
                  @deselect="deselect"
                  :open="false"
                  v-decorator="['teacher', { rules: [{ required: true, message: '请选择上课导师' }] }]"
                  placeholder="请选择上课导师"
                >
                  <a-icon slot="suffixIcon" type="search" />
                  <a-select-option v-for="(item, idx) in teaSelectArr" :value="item.teacherId" :key="idx">{{ item.teacherName }} </a-select-option>
                </a-select>
                <a-input style="cursor: pointer; position: absolute;left: -2px;top: -6.5px;border: none;" class="no-border-input">
                  <a-icon slot="addonAfter" type="search" @click="openChooseTea('teacher')" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24" v-if="isChildren">
              <a-form-item label="绩点" v-bind="formItemLayout">
                <a-select
                  allowClear
                  v-decorator="['classGradePointId', { rules: [{ required: true, message: '请选择绩点' }] }]"
                  placeholder="请选择绩点"
                  @change="changeDance"
                  :disabled="showclassGradePoint()"
                >
                  <a-select-option :allowClear="true" :value="dance.id" v-for="(dance, danceIndex) in classGradePointList" :key="danceIndex">
                    {{ dance.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          <!-- 默认教室 -->
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="计划课次" v-bind="formItemLayout">
                <a-input-number
                  style="width: 100%"
                  placeholder="请输入计划课次"
                  addonAfter="课次"
                  v-decorator="['courseCount', { rules: [{ required: true, message: '请输入正确的计划课次' }] }]"
                  :min="0"
                  :max="200"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="起止时间" v-bind="formItemLayout">
                <a-range-picker v-decorator="['classDate', { rules: [{ required: true, message: '请选择起止时间' }] }]" style="width: 100%;" />
              </a-form-item>
            </a-col>
          <!-- 上课导师 顾问 -->
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="顾问" v-bind="formItemLayout">
                <span>
                  <a-input disabled v-decorator="['master', { rules: [{ required: true, message: '请选择顾问' }] }]" style="cursor: pointer;color: #000;">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('all', 'master')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="助教" v-bind="formItemLayout">
                <span>
                  <a-input v-decorator="['assistant']" style="cursor: pointer;color: #000;">
                    <a-icon slot="addonAfter" type="search" @click="openChooseTea('assistant')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
          <!-- 计划开班时间 计划结业时间 -->
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="预招人数" v-bind="formItemLayout">
                <!--                <a-input placeholder="请输入预招人数" v-decorator="['total',{rules: [{validator: this.$verify.isNum}]}]"/>-->
                <a-input-number
                  style="width: 100%"
                  placeholder="请输入预招人数"
                  addonAfter="人数"
                  v-decorator="['total', { rules: [{ validator: this.$verify.isNum }] }]"
                  :min="0"
                  :max="999"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="默认教室" v-bind="formItemLayout">
                <a-select :allowClear="true" @change="roomChange" placeholder="请选择教室" v-decorator="['roomId']">
                  <a-select-option :allowClear="true" :value="room.id" v-for="(room, roomIndex) in roomList" :key="roomIndex">
                    {{ `${room.roomName} ` }} <span style="color: #ff4400; margin-left: 15px;">{{ `${room.roomNum}人` }}</span>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          <!-- 助教  教研组负责人 -->
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="教研组负责人" v-bind="formItemLayout">
                <span>
                  <a-input disabled v-decorator="['educator']" style="cursor: pointer;color: #000;">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('educator')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="备注" v-bind="formItemLayout">
                <a-textarea placeholder="请输入备注 (100字以内)" aotosize v-decorator="['classDesc', { rules: [{ validator: $verify.lenth }] }]" />
              </a-form-item>
            </a-col>
            <a-col :lg="10" :md="12" :sm="24">
              <a-form-item label="难度" class="rate" v-bind="formItemLayout">
                <a-rate v-decorator="['diff']" :allowHalf="true" />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24" v-if="!classInfo">
              <a-form-item label="成本分摊" v-bind="aLineLayout" required>
                <span>
                  <apportBelongsTable ref="apportBelongsTable" @closeAchiModal="apportionClear"></apportBelongsTable>
                </span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-spin>

    <!-- 选择员工组件 -->
    <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getBackData"></i-modal>
    <!-- 卡种选择组件 -->
    <card-modal ref="cardModal" classType="D" @ok="cardModalOk" @close="cardModalClose" @getBackData="getCardData"></card-modal>
    <choose-tea ref="choosetea" :multiple="true" :teaFields="teaFields" @ok="chooseteaOk" @close="chooseteaClose" @getBackData="getTeaData"></choose-tea>
  </div>
</template>

<script>
import { IModal, CardModal } from '@/components'
import ChooseTea from '@/components/ChooseTea'
import apportBelongsTable from '@/views/reception/modules/apportBelongsTable'
import moment from 'moment'
import { getRoomList, saveClass, getClassInfo, getCardInfoDuration } from '@/api/education'
import {
  listEduDance,
  listEduCardType,
  pageDeptCard,
  treeEduClassType,
  salTypeListById,
  classGradePointList
} from '@/api/common'

const formItemLayout = {
  labelCol: {
    lg: { span: 6 },
    md: { span: 6 },
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 18 },
    md: { span: 18 },
    xs: { span: 18 },
    sm: { span: 18 }
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
const fieldNameList = ['className', 'danceId', 'deptCardId', 'roomId', 'total', 'courseCount', 'classDesc', 'diff', 'cardTypeId']

export default {
  name: 'editClassForm',
  components: {
    IModal,
    CardModal,
    ChooseTea,
    apportBelongsTable
  },
  props: {
    roomList: {
      type: Array,
      default: () => []
    },
    formTitle: {
      type: String,
      default: '编辑班级'
    },
    classInfo: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isChildren: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formItemLayout,
      aLineLayout,
      formValues: {},
      //  教室列表
      // roomList: [],
      selectRoom: null,
      //
      userType: 'all',
      actualUserType: '',
      classTypeList: [],
      classTypeIdSecRequired: true,
      classTypeChildren: [], // 二级
      danceList: [],
      saleryTypeList: [],
      teaFields: null,
      teaSelectArr: [],
      teaIdsArr: [],
      teaNamesArr: [],
      classGradePointList:[]
    }
  },
  computed: {
    filterClassTypeList() {
      if (this.classTypeList?.length > 0) {
        if (this.isChildren) { return this.classTypeList }
        let list = this.classTypeList.filter(item => {
          const { name } = item
          return name != '线上付费课' && name != '少儿班'
        })
        return list

      }
      return []
    }
  },
  watch: {
    isEdit(nv) {
      !nv ? this.setFormValues() : ''
    },
    // isChildren(nv) {
    //   nv?this.setDefaultClassType():''
    // },
  },
  beforeCreate() {
    this.addClassForm = this.$form.createForm(this)
  },
  created() {
    this.getSelectList()
  },
  methods: {
    showclassGradePoint(){
      return this.$store.getters.userInfo?.account?.id !== 'admin'&&this.$route.name==="editClass"
    },
    emitClassInfo() {
      this.$nextTick(() => {
        this.$emit('classInfo', Object.assign({ teacherName: this.teaNamesArr }, this.addClassForm.getFieldsValue()))
      })
    },
    getCardInfoDuration() {
      let { danceId, classTypeId, classTypeIdSec } = this.addClassForm.getFieldsValue()

      if (danceId && classTypeId?.length > 0) {
        getCardInfoDuration({
          danceId,
          eduTypeId: classTypeId,
          classTypeId: classTypeIdSec
        }).then(res => {
          this.$emit('cardDuration', res?.data)
        })
      } else {
        this.$emit('cardDuration')
      }
    },
    syncClassTypeListSec() {
      let value = this.addClassForm.getFieldValue('classTypeId')
      // 教练班和集训班，二级下拉必填，其他班级类型选填
      this.classTypeIdSecRequired = (value === 'A' || value === 'd5b119a6-d7df-403d-a9e1-cb3de7af1479')
      let secOptions = this.classTypeList.filter(item => {
        const { id } = item
        return value === id
      })
      this.classTypeChildren = secOptions?.length > 0 ? secOptions[0].children : []
      this.setDefaultClassType()
    },
    handleClassTypeChange(value, option) {
      // TODO: 全局封装
      // 教练班和集训班，二级下拉必填，其他班级类型选填
      this.classTypeIdSecRequired = (value === 'A' || value === 'd5b119a6-d7df-403d-a9e1-cb3de7af1479')
      // this.$nextTick(() => {
      //   this.addClassForm.getFieldDecorator('classTypeIdSec', { rules: [{ required: isSecRequired, message: '请选择' }] })
      // })

      this.classTypeChildren = this.classTypeList.filter(item => {
        const { id } = item
        return value === id
      })[0].children
      this.addClassForm.setFieldsValue({ classTypeIdSec: null })
      this.$nextTick(() => {
        this.getDefaultClassType()
        // 班型为少儿班时，人群自动改为少儿，其他情况默认成人
        const defaultClassType = value === 'B' ? 'B' : 'A'
        this.addClassForm.setFieldsValue({ classType: defaultClassType })
      })
    },
    changeClassType() {
      let formData = this.addClassForm.getFieldsValue()
      this.$nextTick(() => {
        // let classTypeIdArr = this.addClassForm.getFieldsValue(['classTypeId'])
        // this.addClassForm.setFieldsValue({ ['salTypeId']: null })
        // if (classTypeIdArr.classTypeId && classTypeIdArr.classTypeId.length > 0) {
        //   this.getSalaryType(classTypeIdArr.classTypeId[0])
        // }
        this.emitClassInfo()
        this.getCardInfoDuration()
      })
    },
    getDefaultClassType(){
      let data = this.addClassForm.getFieldsValue()
      let type = 'A'
      if(data.danceId&&data.danceId!=='B'&&data.classTypeId&&data.classTypeId==='B'){
        type = 'B'
      }
      this.addClassForm.setFieldsValue({ classType:type })

    },
    changeDance() {
      this.$nextTick(() => {
        this.getDefaultClassType()
        this.getCardInfoDuration()
      })
    },
    // getSalaryType(classTypeId) {
    //   return salTypeListById({ eduTypeId: classTypeId }).then(res => {
    //     if (res.code === 200) {
    //       this.saleryTypeList = res.data
    //     }
    //   })
    // },
    initForm() {
      this.addClassForm.resetFields()
      this.formValues = {}
      this.teaSelectArr = []
      this.teaIdsArr = []
      this.teaNamesArr = []
      this.showSalary = false
      this.apportionClear()
    },
    setDefaultClassType(){
      if(this.$route.name!=="editClass"){
        if(this.isChildren){
          let classTypeList =  this.classTypeList.filter(item=>item.name==="少儿班")[0]
          this.$nextTick(()=>{
            this.addClassForm.setFieldsValue({ ['classTypeId']: classTypeList.id || '', ['classType']: 'B' })
          })
          this.classTypeChildren=classTypeList.children
        }else{
          this.$nextTick(()=>{ this.addClassForm.setFieldsValue({ ['classTypeId']:  '', ['classType']: '' })})
          this.classTypeChildren=[]
        }
      }
    },
    setFormValues() {
      this.initForm()
      const result = this.classInfo
      const eduClass = result.eduClass
      let classDate
      this.$nextTick(() => {
        fieldNameList.forEach(item => {
          this.addClassForm.setFieldsValue({ [item]: eduClass[item] })
        })
        this.formValues.id = eduClass.id
        eduClass.startDate && eduClass.endDate
          ? (classDate = [moment(eduClass.startDate, 'YYYY-MM-DD'), moment(eduClass.endDate, 'YYYY-MM-DD')])
          : (classDate = [])
        this.addClassForm.setFieldsValue({ ['classDate']: classDate })
        if (result.eduDeptCard) {
          this.addClassForm.setFieldsValue({ ['deptCardName']: result.eduDeptCardByName || '' })
          this.formValues.deptCardId = result.eduDeptCard.id
        }
        if (result.eduRoom) {
          this.addClassForm.setFieldsValue({ ['roomId']: result.eduRoom.id || '' })
          this.$emit('chooseRoom', result.eduRoom.id)
        }
        if (result.eduDance) {
          this.addClassForm.setFieldsValue({ ['danceId']: result.eduDance.id || '' })
        }
        if(result.gradePointId) this.addClassForm.setFieldsValue({ ['classGradePointId']: result.gradePointId || '' })
        if (result.eduCardType || result.eduType) {
          // let params = []
          // params.push(result.eduType ? result.eduType.id : '')
          // params.push(result.eduCardType ? result.eduCardType.id : '')
          // this.addClassForm.setFieldsValue({ ['classTypeId']: params || [] })
          this.addClassForm.setFieldsValue({ [`classTypeId`]: result.eduType.id, [`classTypeIdSec`]: result.eduCardType?.id })
          this.syncClassTypeListSec()
        }

        if (result.orgUserMaster) {
          this.addClassForm.setFieldsValue({ ['master']: result.orgUserMaster.userName })
          this.formValues.masterId = result.orgUserMaster.id
        }
        if (result.orgUserTeacher && result.orgUserTeacher.length > 0) {
          result.orgUserTeacher.map(item => {
            this.teaSelectArr.push(item)
            this.teaIdsArr.push(item.teacherId)
            this.teaNamesArr.push(item.teacherName)
          })
          this.addClassForm.setFieldsValue({ ['teacher']: this.teaIdsArr })

          this.formValues.teacherIds = this.teaIdsArr.join(',')
          this.formValues.teacherNames = this.teaNamesArr.join(',')
        }
        if (result.orgUserEducation) {
          this.addClassForm.setFieldsValue({ ['educator']: result.orgUserEducation.userName })
          this.formValues.educatorId = result.orgUserEducation.id
        }
        if (result.orgUserAsTeacherName) {
          this.addClassForm.setFieldsValue({ ['assistant']: result.orgUserAsTeacherName })
        } else if (result.orgUserAsTeacher) {
          this.addClassForm.setFieldsValue({ ['assistant']: result.orgUserAsTeacher.userName })
          this.formValues.assistantId = result.orgUserAsTeacher.id
        } else {
          this.addClassForm.setFieldsValue({ ['assistant']: '' })
          this.formValues.assistantId = null
        }
        // if (result.eduType) {
        //   this.getSalaryType(result.eduType.id).then(() => {
        //     if (result.salType) {
        //       this.addClassForm.setFieldsValue({ ['salTypeId']: result.salType.id })
        //     }
        //   })
        // }
        if(result.classType){
          this.addClassForm.setFieldsValue({ classType:result.classType })
        }else{
          this.getDefaultClassType()
        }
        this.emitClassInfo()
        this.getCardInfoDuration()
      })
    },

    getSelectList() {
      // getRoomList({ page: '1', limit: '100' }).then(res => this.roomList = res.data)
      listEduDance({ limit: true }).then(res => (this.danceList = res.data))
      classGradePointList({ limit: true }).then(res => (this.classGradePointList = res.data))
      treeEduClassType({ type: 'D' }).then(res => {
        this.$tools.transNullToArr(res.data)
        this.classTypeList = res.data
        this.syncClassTypeListSec()
      })
    },
    roomChange(val) {
      this.selectRoom = val
      this.$emit('chooseRoom', val)
    },
    choosedRoom(val) {
      this.$emit('chooseRoom', val)
    },
    setCardValue() {
      this.$refs.cardModal.open()
    },
    chooseteaOk() {},
    chooseteaClose() {},
    deselect(value, option) {
      this.teaIdsArr.remove(value)
      this.teaNamesArr.splice(option.key, 1)
      this.formValues.teacherIds = this.teaIdsArr.join(',')
      this.formValues.teacherNames = this.teaNamesArr.join(',')

      this.$nextTick(() => {
        this.emitClassInfo()
      })
    },
    getTeaData(data, type) {
      if (type == 'teacher') {
        data.map(item => {
          if (this.teaIdsArr.indexOf(item.teacherId) < 0) {
            this.teaSelectArr.push({ teacherName: item.teacherName, teacherId: item.teacherId })
            this.teaIdsArr.push(item.teacherId)
            this.teaNamesArr.push(item.teacherName)
          }
        })
        this.$nextTick(() => {
          this.addClassForm.setFieldsValue({ teacher: this.teaIdsArr })
          this.formValues.teacherIds = this.teaIdsArr.join(',')
          this.formValues.teacherNames = this.teaNamesArr.join(',')
          this.emitClassInfo()
        })
        return
      }

      this.$nextTick(() => {
        this.addClassForm.setFieldsValue({ [type]: data.name })
        this.formValues[`${type}Id`] = data.id
      })
    },
    openChooseTea(type) {
      this.teaFields = type
      this.$refs.choosetea.open()
    },
    cardModalOk() {},
    cardModalClose() {},

    getCardData(value) {
      this.$nextTick(() => {
        this.formValues.deptCardId = value.id
        this.addClassForm.setFieldsValue({ ['deptCardName']: value.cardName })
      })
    },
    typeFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    openTreeModal(type, actualType) {
      this.userType = type
      this.actualUserType = actualType || type
      this.$refs.modal.open()
    },
    imodalOk() {},
    imodalClose() {},
    classTypeIsDeep(idArray) {
      let loop = (list, idArray, index = 0) => {
        return list.find(d => d.id === idArray[index])?.children
      }
      let flag = false
      let children = this.classTypeList
      for (let i = 0; i < idArray.length; i++) {
        children = loop(children, idArray, i)
        if (Array.isArray(children) && i < idArray.length) {
          flag = false
        } else {
          flag = true
        }
      }
      return flag
    },
    getBackData(data, type) {
      if (type === 'all') {
        type = this.actualUserType || type
      }
      this.$nextTick(() => {
        this.addClassForm.setFieldsValue({ [type]: data.name })
        this.formValues[`${type}Id`] = data.id
      })
    },
    getFormValues() {
      return new Promise((resolve, reject) => {
        this.addClassForm.validateFields((err, values) => {
          if (!err) {
            if (values.classDate && values.classDate.length == 2) {
              values.startDate = values.classDate[0].format('YYYY-MM-DD')
              values.endDate = values.classDate[1].format('YYYY-MM-DD')
            }
            if (values.classTypeId) {
              // values.classTypeId = values.classTypeId.filter(d => d != null && d != undefined && d != '')
              // if (!this.classTypeIsDeep(values.classTypeId)) {
              //   reject({ msg: '请选择班型最小类目' })
              // }
              // values.classTypeId = values.classTypeId.join(',')
              let sec = values.classTypeIdSec ? `,${values.classTypeIdSec}` : ''
              values.classTypeId = `${values.classTypeId}${sec}`
            }
            if (!this.formValues.assistantId && values.assistant) {
              this.formValues.assistantName = values.assistant
            }
            const deleteFields = ['classDate', 'master', 'teacher', 'assistant', 'educator']
            deleteFields.forEach(item => {
              delete values[item]
            })
            const formVlaues = Object.assign(this.formValues, values)
            resolve(formVlaues)
          } else {
            reject(err)
          }
        })
      })
    },
    resetForm() {
      this.initForm()
    },
    ceshi() {
      const {
        addClassForm: { setFieldsValue }
      } = this
      this.teaSelectArr.push({ name: 'laoshi1', id: 'abc' })
      this.teaSelectArr.push({ name: 'laoshi2', id: 'abcd' })
      setFieldsValue({ teachers: ['abc', 'abcd'] })
    },

    apportionValidate() {
      return new Promise(resolve => {
        const apportion = this.$refs.apportBelongsTable
        if (apportion) {
          resolve(apportion.validate())
        } else {
          resolve()
        }
      })
    },
    apportionSave(id) {
      return new Promise(resolve => {
        const apportion = this.$refs.apportBelongsTable
        if (apportion) {
          if (id) apportion.id = id
          apportion.save2().then(res => resolve(res))
        } else {
          resolve()
        }
      })
    },
    apportionClear() {
      this.$refs.apportBelongsTable && this.$refs.apportBelongsTable.clear()
    }
  }
}
</script>

<style scoped lang="less">
.card {
  margin-bottom: 24px;
}

input[disabled] {
  cursor: pointer !important;
  color: #000 !important;
}

.courseCount {
  &::after {
    content: '课次';
    display: inline-block;
    box-sizing: border-box;
    padding: 8.25px 11px;
    font-size: 14px;
    font-weight: normal;
    line-height: 1;
    color: rgba(0, 0, 0, 0.65);
    text-align: center;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    position: absolute;
    left: 86px;
    top: -1px;
    border-radius: 0 4px 4px 0;
    z-index: 100;
    width: 52px;
  }
}
/*.rate /deep/ .ant-form-item-control {*/
/*height: 40px;*/
/*}*/
</style>
