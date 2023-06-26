<template>
  <div :roomList="roomList" :formTitle="formTitle" :classInfo="classInfo" :isEdit="isEdit">
    <a-spin :spinning="isEdit">
      <a-card :bordered="false" class="card" :title="formTitle">
        <a-form :form="addClassForm">
          <!-- 班级名称 计划课次 预招人数 -->
          <a-row class="form-row" :gutter="16">
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item label="班级名称" v-bind="formItemLayout">
                <a-input placeholder="请输入班级名称" v-decorator="['className', { rules: [{ required: true, message: '请输入班级名称' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item label="舞种" v-bind="formItemLayout">
                <a-select allowClear v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]" placeholder="请选择舞种">
                  <a-select-option :allowClear="true" :value="dance.id" v-for="(dance, danceIndex) in danceList" :key="danceIndex">
                    {{ dance.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item label="班型" v-bind="formItemLayout">
                <a-cascader
                  :options="classTypeList"
                  :showSearch="{ typeFilter }"
                  placeholder="请选择班型"
                  :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                  changeOnSelect
                  @change="changeClassType"
                  v-decorator="['classTypeId', { rules: [{ required: true, message: '请选择班型' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item label="薪酬类型" v-bind="formItemLayout">
                <a-select
                  allowClear
                  v-decorator="['salTypeId', { rules: [{ required: true, message: '请选择薪酬类型' }] }]"
                  placeholder="选择班型后才会生成薪酬类型"
                >
                  <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in saleryTypeList" :key="index">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 卡种 默认教室 -->
          <a-row class="form-row" :gutter="16">
            <a-col :lg="8" :md="12" :sm="24">
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

            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item label="起止时间" v-bind="formItemLayout">
                <a-range-picker v-decorator="['classDate', { rules: [{ required: true, message: '请选择起止时间' }] }]" style="width: 100%;" />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 上课导师 顾问 -->
          <a-row class="form-row" :gutter="16">
            <!--            <a-col :lg="8" :md="12" :sm="24">-->
            <!--              <a-form-item label="上课导师" v-bind="formItemLayout">-->
            <!--               <span>-->
            <!--                  <a-input disabled v-decorator="['teacher',{rules: [{ required: true, message: '请选择上课导师' }]}]"-->
            <!--                           style="cursor: pointer;color: #000;">-->
            <!--                    <a-icon slot="addonAfter" type="search" @click="openChooseTea('teacher')"/>-->
            <!--                  </a-input>-->
            <!--               </span>-->
            <!--              </a-form-item>-->
            <!--            </a-col>-->
            <a-col :lg="8" :md="12" :sm="24">
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
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item label="助教" v-bind="formItemLayout">
                <span>
                  <a-input v-decorator="['assistant']" style="cursor: pointer;color: #000;">
                    <a-icon slot="addonAfter" type="search" @click="openChooseTea('assistant')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- 助教  教研组负责人 -->
          <a-row class="form-row" :gutter="16">
            <a-col :lg="8" :md="12" :sm="24">
              <a-form-item label="教研组负责人" v-bind="formItemLayout">
                <span>
                  <a-input disabled v-decorator="['educator']" style="cursor: pointer;color: #000;">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('educator')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="12" :sm="24"> </a-col>
          </a-row>
          <!-- 备注 -->
          <a-row class="form-row" :gutter="16">
            <a-col :lg="24" :md="24" :xs="24" :sm="24">
              <a-form-item label="备注" v-bind="aLineLayout">
                <a-textarea placeholder="请输入备注 (100字以内)" aotosize v-decorator="['classDesc', { rules: [{ validator: $verify.lenth }] }]" />
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
import moment from 'moment'
import { getRoomList, saveClass, getClassInfo } from '@/api/education'
import { listEduDance, listEduCardType, pageDeptCard, treeEduClassType, salTypeListById, salTypeListByEduType } from '@/api/common'

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
const fieldNameList = ['className', 'danceId', 'deptCardId', 'roomId', 'total', 'courseCount', 'classDesc', 'cardTypeId']

export default {
  name: 'editClassForm',
  components: {
    IModal,
    CardModal,
    ChooseTea
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
    }
  },
  watch: {
    isEdit(nv) {
      !nv ? this.setFormValues() : ''
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
      classTypeList: [],
      danceList: [],
      saleryTypeList: [],
      teaFields: null,
      teaSelectArr: [],
      teaIdsArr: []
    }
  },
  beforeCreate() {
    this.addClassForm = this.$form.createForm(this, { onValuesChange: (props, values) => {
      if (values.salTypeId) {
        let item = this.saleryTypeList.find(item => item.id === values.salTypeId)
        this.$emit('onSalTypeChange', item)
      }
    }})
  },
  created() {
    this.getSelectList()
  },
  methods: {
    changeClassType() {
      this.$nextTick(() => {
        let classTypeIdArr = this.addClassForm.getFieldsValue(['classTypeId'])
        this.addClassForm.setFieldsValue({ ['salTypeId']: null })
        if (classTypeIdArr.classTypeId && classTypeIdArr.classTypeId.length > 0) {
          this.getSalaryType(classTypeIdArr.classTypeId)
        }
      })
    },
    getSalaryType(classTypeId) {
      let eduTypeId = null
      let eduClassType = null
      if (Array.isArray(classTypeId)) {
        eduTypeId = classTypeId[0]
        eduClassType = classTypeId.length > 1 ? classTypeId[1] : null
      } else {
        eduTypeId = classTypeId
      }
      return salTypeListByEduType({ eduTypeId, eduClassType }).then(res => {
        if (res.code === 200) {
          this.saleryTypeList = res.data
        }
      })
    },
    initForm() {
      this.addClassForm.resetFields()
      this.formValues = {}
      this.teaSelectArr = []
      this.teaIdsArr = []
      this.showSalary = false
    },
    setFormValues() {
      this.initForm()
      const result = this.classInfo
      // console.log('result', result)
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
        if (result.eduCardType || result.eduType) {
          let params = []
          params.push(result.eduType ? result.eduType.id : '')
          params.push(result.eduCardType ? result.eduCardType.id : '')
          this.addClassForm.setFieldsValue({ ['classTypeId']: params || [] })
        }

        if (result.orgUserMaster) {
          this.addClassForm.setFieldsValue({ ['master']: result.orgUserMaster.userName })
          this.formValues.masterId = result.orgUserMaster.id
        }
        if (result.orgUserTeacher && result.orgUserTeacher.length > 0) {
          result.orgUserTeacher.map(item => {
            this.teaSelectArr.push(item)
            this.teaIdsArr.push(item.teacherId)
          })
          this.addClassForm.setFieldsValue({ ['teacher']: this.teaIdsArr })
          this.formValues.teacherIds = this.teaIdsArr.join(',')
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
        if (result.eduType) {
          this.getSalaryType(result.eduType.id).then(() => {
            if (result.salType) {
              this.addClassForm.setFieldsValue({ ['salTypeId']: result.salType.id })
            }
          })
        }
      })
    },

    getSelectList() {
      // getRoomList({ page: '1', limit: '100' }).then(res => this.roomList = res.data)
      listEduDance({ limit: true }).then(res => (this.danceList = res.data))
      treeEduClassType({ type: 'F' }).then(res => {
        this.$tools.transNullToArr(res.data)
        this.classTypeList = res.data
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
      this.formValues.teacherIds = this.teaIdsArr.join(',')
    },
    getTeaData(data, type) {
      if (type == 'teacher') {
        data.map(item => {
          if (this.teaIdsArr.indexOf(item.teacherId) < 0) {
            this.teaSelectArr.push({ teacherName: item.teacherName, teacherId: item.teacherId })
            this.teaIdsArr.push(item.teacherId)
          }
        })
        this.$nextTick(() => {
          this.addClassForm.setFieldsValue({ teacher: this.teaIdsArr })
          this.formValues[`teacherIds`] = this.teaIdsArr.join(',')
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
    openTreeModal(type) {
      this.userType = type
      this.$refs.modal.open()
    },
    imodalOk() {},
    imodalClose() {},
    getBackData(data, type) {
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
              values.classTypeId = values.classTypeId.join(',')
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
</style>
