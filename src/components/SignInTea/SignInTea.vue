<template>
  <div class="signin-tea-wrapper">
    <a-form :form="signinTeaForm">
      <a-row :gutter="8">
        <a-col :lg="12" :md="12" :sm="24">
          <a-radio-group v-model="teaType">
            <a-radio :value="1">班级老师签到</a-radio>
            <a-radio :value="2">外部老师</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-divider></a-divider>
      <span v-if="teaType === 1">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
          <div></div>
          <a-button type="primary" @click="add()" v-if="!editFlag">新增</a-button>
        </div>
        <a-table
          :columns="acutalInnerColumns"
          :scroll="{ x: 700 }"
          size="default"
          :dataSource="innerData"
          :pagination="false"
          :rowKey="(record, index) => index"
          style="margin-bottom:10px;"
        >
          <template slot="teacher" slot-scope="text, record, index">
            <a-input v-model="record.teacher" style="width:100%;" :disabled="editFlag">
              <a-icon slot="addonAfter" type="search" @click="openModalByString('teacher', index)" />
            </a-input>
          </template>
          <template slot="payType" slot-scope="text, record">
            <a-select v-model="record.salTypeId" style="width:100%" placeholder="请选择薪酬类型" :disabled="editFlag">
              <a-select-option v-for="(item, idx) in salTypes" :value="item.id" :key="idx">{{ item.name }} </a-select-option>
            </a-select>
          </template>
          <template slot="teaSignIn" slot-scope="text, record">
            <a-input-number v-model="record.num" style="width:100%" :min="0" :disabled="editFlag" />
          </template>
          <template slot="deduction" slot-scope="text, record, index">
            <a-input-number
              v-model="record.deductSalary"
              style="width:100%"
              :min="0"
              :disabled="editFlag"
              @blur="changeValue('deductNum', 'deductSalary', index)"
            />
          </template>
          <template slot="time" slot-scope="text, record, index">
            <a-input-number
              v-model="record.deductNum"
              style="width:100%"
              :min="0"
              :disabled="editFlag"
              @blur="changeValue('deductSalary', 'deductNum', index)"
            />
          </template>
          <template slot="teacherStatus" slot-scope="text, record, index">
            <a-select v-model="record.teacherStatus" :disabled="editFlag || !$tools.checkPerm('education:plan:teacherStatus:edit')">
              <a-select-option value="B">是</a-select-option>
              <a-select-option value="A">否</a-select-option>
            </a-select>
          </template>
          <template slot="remark" slot-scope="text, record">
            <a-input v-model="record.remark" style="width:100%" :disabled="editFlag" />
          </template>
          <template slot="action" slot-scope="text, record, index">
            <!-- <a-icon type="plus-circle" class="icon" style="margin-left: 10px;" @click="add()" v-if="innerData.length - 1 == index && !editFlag" /> -->
            <a href="#" @click="edit(record)" v-if="editFlag">重新签到</a>
            <a href="#" @click="subtract(index)" v-if="innerData.length !== 1 && !editFlag">删除</a>
          </template>
        </a-table>
      </span>
      <span v-if="teaType === 2">
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="老师姓名" v-bind="$tools.formItemLayout2">
              <a-input placeholder="请输入老师姓名" v-decorator="['name', { rules: [{ required: true, message: '请输入老师姓名' }] }]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="老师手机号" v-bind="$tools.formItemLayout2">
              <a-input
                placeholder="请输入老师手机号"
                v-decorator="['phone', { rules: [{ required: true, message: '输入手机号码' }, { validator: phoneValidator }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="代课课时" v-bind="$tools.formItemLayout2">
              <a-input-number v-decorator="['substituteTime', { rules: [{ required: true, message: '请输入代课课时' }] }]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="结算情况" v-bind="$tools.formItemLayout2">
              <a-radio-group v-decorator="['settle', { /* initialValue: 1, */ rules: [{ required: true, message: '请选择结算情况' }] }]">
                <a-radio :value="1">已结算</a-radio>
                <a-radio :value="0">未结算</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="结算时间" v-bind="$tools.formItemLayout2">
              <a-date-picker placeholder="请选择结算时间" style="width: 100%" v-decorator="['date']" @change="changeDate()" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="代课工资" v-bind="$tools.formItemLayout2">
              <a-input-number :min="0" v-decorator="['subClassSalary', { rules: [{ required: true, message: '请输入代课工资' }] }]" />
              <div class="mt-8">代课工资=代课课时*单节课时费</div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="备注" v-bind="$tools.formItemLayout2">
              <a-input placeholder="请输入备注" v-decorator="['remark']" />
            </a-form-item>
          </a-col>
        </a-row>
      </span>
      <a-divider></a-divider>
      <!-- <a-row :gutter="8">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="上课导师"
                       style="position: relative;"
                       class="disabled-select"
                       v-bind="$tools.formItemLayout3">
            <a-select
              mode="multiple"
              style="width: calc(100% - 37px);margin-right: 37px;z-index: 144;border-radius: 4px 0 0 4px;"
              @deselect="deselect"
              :open="false"
              v-decorator="['teacher']"
              placeholder="请选择上课导师">
              <a-icon slot="suffixIcon" type="search"/>
              <a-select-option v-for="(item,idx) in teaSelectArr" :value="item.id" :key="idx">{{item.name}}
              </a-select-option>
            </a-select>
            <a-input style="cursor: pointer; position: absolute;left: -2px;top: -6.5px;border: none;"
                     class="no-border-input">
              <a-icon slot="addonAfter" type="search" @click="openModalByString('teacher')"/>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row> -->
      <!-- <a-row :gutter="8">
        <a-col :span="24">
          <a-form-item label="已签到导师" v-bind="{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }" v-if="!!teaSigninLog && !!teaSigninLog.teachers">
            <div class="teacher-signed-items">
              <div class="teacher-signed-item" v-for="(teacher, teaIdx) in teaSigninLog.teachers" :key="teaIdx">
                <div class="teacher-info">
                  <div class="teacher-info-name">{{ teacher.name }}</div>
                  <div class="teacher-info-phone">{{ teacher.mobile }}</div>
                </div>
                <div class="teacher-action">
                  <div class="teacher-action-icon" @click="openTeaSignModal(teacher)">
                    <a-icon type="file-protect" />
                  </div>
                   <a-tag color="cyan" style="margin-right: 2px;">签到</a-tag>-->
      <!-- </div> -->
      <!-- </div> -->
      <!-- </div> -->
      <!-- </a-form-item> -->
      <!-- </a-col> -->
      <!-- </a-row> -->
      <a-row :gutter="8">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="顾问" v-bind="$tools.formItemLayout2">
            <span>
              <a-input class="show-disabled" disabled v-decorator="['master']">
                <a-icon slot="addonAfter" type="search" @click="openModalByString('master')" />
              </a-input>
            </span>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="助教" v-bind="$tools.formItemLayout2">
            <span>
              <a-input v-decorator="['assistant']">
                <a-icon slot="addonAfter" type="search" @click="openModalByString('assistant')" />
              </a-input>
            </span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <perm-box perm="education:signinlog:sign">
      <a-row>
        <a-divider></a-divider>
        <div class="btn-wrapper">
          <a-button class="resetBtn" @click="resetTeaSigninLog">重置签到</a-button>
          <a-button :style="{ marginLeft: '10px' }" type="primary" :loading="submitLoading" @click="submitTeacherSignIn(1)">
            提交签到
          </a-button>
        </div>
      </a-row>
    </perm-box>
    <!-- 员工选择组件 -->
    <i-modal ref="modal" :multiple="false" :userType="userType" @ok="baseFuc" @close="baseFuc" @getBackData="getMasterData"> </i-modal>
    <!-- 老师选择组件 -->
    <choose-tea ref="choosetea" :multiple="true" :teaFields="teaFields" @ok="baseFuc" @close="baseFuc" @getBackData="getTeaData"> </choose-tea>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="导师签到"
      v-model="teaSignModal"
      okText="保存"
      cancelText="取消"
      @ok="sendTeaSign()"
      :confirmLoading="teaSignModalLoading"
      class="sign-modal"
    >
      <a-form :form="teaSignForm" style="margin-top: 20px;">
        <!-- 扣除类型 -->
        <a-form-item label="扣除类型" v-bind="$tools.formItemLayout">
          <a-radio-group buttonStyle="solid" @change="changeDeduct" v-model="deductType">
            <a-radio-button value="salary">扣费</a-radio-button>
            <a-radio-button value="num">扣次</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 备注 -->
        <a-form-item :label="`${textByDeductType}`" v-bind="$tools.formItemLayout">
          <a-input-number :min="0" :max="999999" v-decorator="['number']" />
        </a-form-item>
        <!-- 备注 -->
        <a-form-item :label="`备注`" v-bind="$tools.formItemLayout">
          <a-input v-model="teacherDeductRemark" :placeholder="`请输入${textByDeductType}备注`" v-decorator="['remark']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import IModal from '@/components/InnerModal'
import ChooseTea from '@/components/ChooseTea'
import { salTypeListById } from '@/api/common'
import { getTeaSignInList, SignInTeaList, saveSalDeduct, substTeaSave } from '@/api/reception/todayplan'
import moment from 'moment'
import { axios } from '@/utils/request'

export default {
  name: 'SignInTea',
  props: {
    eduTypeId: {
      type: String,
      default: ''
    },
    teaRecord: {
      type: Object,
      default: () => {}
    },
    teaSigninLog: {
      type: Object,
      default: () => {}
    },
    modalIsOpen: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // console.log(this.eduTypeId)
    this.getsalTypeList()
  },
  components: {
    PermBox,
    ChooseTea,
    IModal
  },
  computed: {
    dancePlanId() {
      const {
        teaRecord: { planId }
      } = this
      return planId
    },
    classId() {
      const {
        teaRecord: { classId }
      } = this
      return classId
    },
    textByDeductType() {
      const { deductType } = this
      return deductType == 'salary' ? '扣费金额' : '扣次数量'
    },
    acutalInnerColumns() {
      const teacherStatusItem = {
          title: '是否延发',
          dataIndex: 'teacherStatus',
          scopedSlots: { customRender: 'teacherStatus' },
          width: 80
        }
      let columns = [...this.innerColumns]
      if (this.$tools.checkPerm('education:plan:teacherStatus:view')) {
        columns.splice(- 2, 0, teacherStatusItem)
      }
      return columns
    }
  },
  watch: {
    modalIsOpen(nv, ov) {
      const { teaSigninLog, setTeaSigninValues, initTeaSignin, getsalTypeList } = this
      nv && getsalTypeList()
      nv && teaSigninLog ? setTeaSigninValues(teaSigninLog) : initTeaSignin()
    },
    eduTypeId() {
      // console.log(this.eduTypeId)
      // this.getsalTypeList()
    }
  },
  data() {
    return {
      //导师选择和master选择组件参数
      teaFields: null,
      userType: null,
      //老师下拉Arr及idArr
      teaSelectArr: [],
      teaIdsArr: [],
      //提交后台的参数
      formValues: {},
      //loading节流阀
      submitLoading: false,
      //导师签到modal
      teaSignModal: false,
      //导师签到loading
      teaSignModalLoading: false,
      //导师签到obj
      openModalTeaInfo: {},
      //导师扣除类型
      deductType: 'salary',
      //导师扣除数量
      teacherDeductNum: 0,
      //导师扣除备注
      teacherDeductRemark: '',
      innerColumns: [
        {
          title: '当前签到导师',
          dataIndex: 'teacher',
          scopedSlots: { customRender: 'teacher' },
          width: 150
        },
        {
          title: '导师薪酬类型',
          dataIndex: 'payType',
          scopedSlots: { customRender: 'payType' },
          width: 180
        },
        {
          title: '导师签到计次',
          dataIndex: 'teaSignIn',
          scopedSlots: { customRender: 'teaSignIn' },
          width: 80
        },
        {
          title: '扣费',
          dataIndex: 'deduction',
          scopedSlots: { customRender: 'deduction' },
          width: 80
        },
        {
          title: '扣次',
          dataIndex: 'time',
          scopedSlots: { customRender: 'time' },
          width: 80
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
          width: 80
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ],
      innerData: [],
      teaType: 1,
      index: null,
      salTypes: [],
      editFlag: false
    }
  },
  beforeCreate() {
    this.signinTeaForm = this.$form.createForm(this)
    this.teaSignForm = this.$form.createForm(this)
  },
  created() {
    const { teaSigninLog, setTeaSigninValues, initTeaSignin } = this
    teaSigninLog ? setTeaSigninValues(teaSigninLog) : initTeaSignin()
  },
  methods: {
    changeValue(delVal, val, index) {
      if (this.innerData[index][delVal]) {
        this.innerData[index][val] = ''
        this.$notification['error']({
          message: '系统通知',
          description: '扣费、扣次选一项填写!'
        })
      }
    },
    formateToday() {
      return new Promise((resolve, reject) => {
        let time = this.teaRecord.startDate.slice(0, 10)
        let now = moment().format('YYYY-MM-DD')
        if (this.$store.getters.school_id && time !== now) {
          this.$notification['error']({
            message: '系统通知',
            description: '导师签到仅允许当天签到！'
          })
          reject()
        }
        resolve(true)
      })
    },
    edit() {
      let _this = this
      this.formateToday().then(res => {
        _this.editFlag = false
      })
    },
    //手机号校验
    phoneValidator(rule, value, callback) {
      let tel = this.signinTeaForm.getFieldsValue().phone
      if (tel) {
        if (!/^1[3456789]\d{9,10}$/.test(tel)) {
          callback(new Error('请输入正确的手机号码'))
        }
      }
      callback()
    },
    changeDate() {
      this.signinTeaForm.setFieldsValue({ [date]: this.$tools.tailor.getDate(this.signinTeaForm.getFieldsValue().date) })
    },
    getsalTypeList() {
      salTypeListById({ eduTypeId: this.eduTypeId }).then(res => {
        if (res.code == 200) {
          this.salTypes = res.data
        }
      })
    },
    //减去一行
    subtract(index) {
      this.innerData.splice(index, 1)
    },
    //新增一行
    add() {
      let obj = { teacher: '', teacherId: '', salTypeId: '', num: '', deductSalary: '', deductNum: '', remark: '', teacherStatus: 'A' }

      this.innerData.push(obj)
    },
    //清空所有值
    initTeaSignin() {
      if (this.teaType === 2) {
        const {
          signinTeaForm: { resetFields }
        } = this
        resetFields()
        this.formValues = {}
        this.teaSelectArr = []
        this.teaIdsArr = []
      } else {
        this.innerData = []
        this.formValues = {}
        this.teaSelectArr = []
        this.teaIdsArr = []
      }
    },
    //回显签到表单
    setTeaSigninValues(data) {
      console.log('回显', data)
      const { initTeaSignin, plusTeaWithoutRepetition, plusAssistant, getMasterData } = this
      // const { teas: { adviserId, adviserName, asTeacherId, asTeacherName }, dancePlanId, teachers } = data
      const {
        teas: { orgUserAdviser, salTemplateAsTeacher, asTeacherName },
        dancePlanId,
        teachers,
        substituteTeacher
      } = data
      // this.innerData = teachers
      const { classTeas, planTeachers } = data
      if (substituteTeacher) {
        this.teaType = 2
      }
      initTeaSignin()
      this.$nextTick().then(() => {
        // 回显默认老师
        let teach
        if (planTeachers.length) {
          teach = planTeachers
        } else {
          teach = classTeas
        }
        if (teach.length > 0 && !teachers.length) {
          // plusTeaWithoutRepetition
          plusTeaWithoutRepetition(
            teach.map(item => {
              item.id = item.teacherId
              item.name = item.teacherName
              return item
            })
          )
        }
        orgUserAdviser
          ? getMasterData(
              {
                name: orgUserAdviser['userName'],
                id: orgUserAdviser['id']
              },
              'master'
            )
          : ''
        asTeacherName ? plusAssistant({ name: asTeacherName, id: null }, 'assistant') : ''
        salTemplateAsTeacher
          ? plusAssistant(
              {
                name: salTemplateAsTeacher['name'],
                id: salTemplateAsTeacher['id']
              },
              'assistant'
            )
          : ''
        !!teachers ? plusTeaWithoutRepetition(this.teaType !== 2 ? teachers : [substituteTeacher], true) : ''
      })
    },

    /*
     *  根据str判断打开的modal
     *  teacher:打开老师modal,赋值teaFields
     *  assistant:打开老师modal,赋值teaFields
     *  master:打开员工modal,赋值userType
     *
     * */
    openModalByString(str, index) {
      if (index !== null && index !== undefined) {
        this.index = index
      }
      const { openTeacherModal, openMasterModal } = this
      str == 'teacher' || str == 'assistant' ? openTeacherModal(str) : openMasterModal(str)
    },
    //打开老师组件操作
    openTeacherModal(str) {
      this.teaFields = str
      this.$refs.choosetea.open()
    },
    //打开员工组件操作
    openMasterModal(str) {
      this.userType = str
      this.$refs.modal.open()
    },
    //老师input删除的操作
    // deselect(value) {
    //   this.teaIdsArr.remove(value)
    //   this.formValues.teacherIds = this.teaIdsArr.join(',')
    // },
    //base fuc 必要 无用
    baseFuc() {},
    //拿到选择老师的值
    getTeaData(data, type) {
      console.log(data, type)
      const { plusTeaWithoutRepetition, plusAssistant } = this
      this.$nextTick().then(() => {
        // console.log(data, type)
        //[{teacher1},{teacher2}] "teacher"
        //{id: "d0b0d14d-f743-4c41-a00e-82ed65334a50", name: " 郭晓璇"} "assistant"
        type == 'teacher' ? plusTeaWithoutRepetition(data) : plusAssistant(data, type)
      })
    },
    //判断老师Arr是否重复然后添加
    plusTeaWithoutRepetition(data, type) {
      const {
        signinTeaForm: { setFieldsValue },
        formValues,
        teaSelectArr,
        teaIdsArr
      } = this
      //是否重复判断
      console.log(this.index, type, data)
      // debugger
      data.map(item => {
        // if (teaIdsArr.indexOf(item.id) == -1) {
        // teaSelectArr.push({ name: item.teacherName || item.name, id: item.id })
        if (this.index !== null) {
          this.innerData[this.index].teacher = item.teacherName
          this.innerData[this.index].teacherId = item.teacherId
        } else {
          if (type) {
            if (this.teaType === 1) {
              this.editFlag = true
              this.innerData = data.map(item => {
                let todo = {
                  teacher: item.name,
                  teacherId: item.id,
                  salTypeId: item.salTypeId,
                  num: item.num,
                  deductSalary: item.deductSalary || '',
                  deductNum: item.deductNum || '',
                  remark: item.remark,
                  teacherStatus: item.teacherStatus || 'A'
                }
                return todo
              })
            } else {
              for (let key in data[0]) {
                setFieldsValue({ [key]: data[0][key] })
              }
            }
            // this.innerData = data
          } else {
            let obj = {
              teacher: item.name,
              teacherId: item.id,
              salTypeId: this.teaRecord.salTypeId,
              num: this.teaRecord.signCount,
              deductSalary: '',
              deductNum: '',
              remark: '',
              teacherStatus: item.teacherStatus || 'A'
            }

            this.innerData.push(obj)
          }
        }
        // teaIdsArr.push(item.id)
        // }
      })
      // setFieldsValue({ ['teacher']: teaIdsArr })
      // this.innerData[0].teacher = teaIdsArr

      // formValues['teacherIds'] = teaIdsArr.join(',')
    },
    //添加助教的操作
    plusAssistant(data = { name: '', id: null }, type = 'assistant') {
      const {
        signinTeaForm: { setFieldsValue },
        formValues
      } = this
      const { name, id } = data
      setFieldsValue({ [type]: name })
      formValues[`${type}Id`] = id
    },
    //拿到员工选择的值
    getMasterData(data = { name: '', id: null }, type) {
      const {
        signinTeaForm: { setFieldsValue },
        formValues
      } = this
      const { name, id } = data
      this.$nextTick().then(() => {
        //{id: "b2fd3843-715c-4926-8747-455b36b7f0a2", name: " 马乾 谦谦"} "master"
        setFieldsValue({ [type]: name })
        formValues[`${type}Id`] = id
      })
    },
    //重置老师签到
    resetTeaSigninLog() {
      let _this = this
      this.formateToday().then(res => {
        const { initTeaSignin, submitTeacherSignIn } = this
        this.$confirm({
          title: '系统提示',
          content: '确实要清空签到操作吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            initTeaSignin()
            submitTeacherSignIn(0)
          },
          onCancel() {}
        })
      })
    },
    //提交签到数据
    submitTeacherSignIn(type) {
      this.signinTeaForm.validateFields((err, values) => {
        if (!err) {
          const {
            signinTeaForm: { getFieldsValue },
            formValues,
            dancePlanId,
            $notification
          } = this

          if (this.teaType === 1) {
            for (let i = 0; i < this.innerData.length; i++) {
              // if(!this.innerData[i].deductNum && !this.innerData[i].deductSalary) {
              //   return this.$notification['error']({
              //       message: '系统通知',
              //       description: '请填写完表格!'
              //     })
              // }
              for (let key in this.innerData[i]) {
                let keyArr = ['teacherId', 'salTypeId', 'num']
                if (keyArr.includes(key) && (this.innerData[i][key] === null || this.innerData[i][key] === '')) {
                  return this.$notification['error']({
                    message: '系统通知',
                    description: '请填写完表格!'
                  })
                }
              }
            }
          }
          const params = Object.assign({}, formValues, { dancePlanId, type })
          getFieldsValue().assistant && !params.assistantId ? (params['asTeacherName'] = getFieldsValue().assistant) : ''
          //开启节流阀
          this.submitLoading = true
          if (this.teaType === 2) {
            values.date = this.$tools.tailor.getDate(values.date)
            let data = { ...values, ...params, classId: this.classId }
            delete data[('master', 'assistant')]
            substTeaSave(data)
              .then(res => {
                $notification['success']({
                  message: '系统通知',
                  description: '您已成功签到!'
                })
                this.$emit('signinTea', dancePlanId)
                this.resetForm()
              })
              .catch(err => console.log(err))
              .finally(() => (this.submitLoading = false))
          } else {
            params.teacherSigns = JSON.stringify(this.innerData)
            console.log(params)
            SignInTeaList(params)
              .then(res => {
                $notification['success']({
                  message: '系统通知',
                  description: '您已成功签到!'
                })
                this.$emit('signinTea', dancePlanId)
                this.resetForm()
              })
              .catch(err => console.log(err))
              .finally(() => (this.submitLoading = false))
          }
        }
      })
    },
    resetForm() {
      this.index = null
      this.innerData = []
      this.editFlag = false
      this.teaType = 1
    },
    //打开modal
    openTeaSignModal(record) {
      if (!this.$tools.checkPerm('salary:deduct:view')) {
        this.$notification['error']({
          message: '系统通知',
          description: '没有权限！'
        })
        return false
      }
      this.teaSignForm.resetFields()
      this.deductType = 'salary'
      this.teaSignModal = true
      this.openModalTeaInfo = record
      this.databacking(record)
    },
    changeDeduct(event) {
      const {
        target: { value }
      } = event
      const {
        openModalTeaInfo: { salary, num, remark },
        teaSignForm: { setFieldsValue }
      } = this
      value == 'salary'
        ? this.$nextTick().then(() => {
            setFieldsValue({ ['number']: salary })
            setFieldsValue({ ['remark']: remark })
          })
        : this.$nextTick().then(() => {
            setFieldsValue({ ['number']: num })
            setFieldsValue({ ['remark']: remark })
          })
    },
    //回显
    databacking(teacher) {
      const {
        teaSignForm: { setFieldsValue }
      } = this
      const { salary, num, remark } = teacher
      // 先以次数为主,
      num > 0
        ? this.$nextTick().then(() => {
            this.deductType = 'num'
            setFieldsValue({ ['number']: num })
          })
        : this.$nextTick().then(() => {
            this.deductType = 'salary'
            setFieldsValue({ ['number']: salary })
          })
      this.$nextTick(() => {
        setFieldsValue({ ['remark']: remark })
      })
    },
    //修改已签到导师状态
    sendTeaSign() {
      const {
        teaSignForm: { validateFields },
        checkTeacher,
        openModalTeaInfo,
        deductType
      } = this
      validateFields((err, values) => {
        if (err) return
        values[deductType] = values.number
        delete values['number']
        checkTeacher(openModalTeaInfo, values)
      })
    },
    //检查权限
    checkTeacher(recoed, values = {}) {
      const { dancePlanId, $notification } = this
      if (!this.$tools.checkPerm('salary:deduct:save')) {
        this.$notification['error']({
          message: '系统通知',
          description: '没有权限！'
        })
        return false
      }
      const salTemplateId = recoed.id
      const params = Object.assign({ salTemplateId }, values, { dancePlanId })
      this.teaSignModalLoading = true
      saveSalDeduct(params)
        .then(res => {
          $notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.teaSignModal = false
        })
        .finally(() => (this.teaSignModalLoading = false))
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

.resetBtn {
  color: #108ee9;
  border: 1px solid #108ee9;
}

.teacher-signed-items {
  display: flex;
  flex-flow: row wrap;

  .teacher-signed-item {
    display: flex;
    width: 140px;
    height: auto;
    border: 1px dashed;
    border-radius: 4px;
    background-color: #e6f7ff;
    border-color: #1ba97b;
    color: #3a86ff;
    margin-right: 10px;
    margin-bottom: 10px;

    .teacher-info {
      width: auto;

      > div {
        line-height: 25px;
        margin: 0 5px;
      }

      .teacher-info-name {
        padding-top: 4px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        color: #3a86ff;
      }

      .teacher-info-phone {
        font-size: 12px;
        color: #aaaaaa;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        color: #3a86ff;
      }
    }

    .teacher-action {
      width: 50px;
      text-align: right;
      font-size: 24px;
      display: flex;
      flex-flow: column nowrap;

      > i {
        color: #3a86ff;
      }

      .teacher-action-icon:hover {
        opacity: 0.7;
        cursor: pointer;
      }
    }
  }
}

.btn-wrapper {
  .right();
}
.icon {
  color: #1890ff;
  font-size: 16px;
}
</style>
