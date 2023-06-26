<template>
  <div class="student-form">
    <a-form :form="form" @submit="handleSubmit">
      <a-row :gutter="8">
        <a-col :lg="8" :md="24" :sm="24">
          <upload-avator ref="uploadAva" :is-take-photo="true" @getFilesId="getFilesId" :userSrc="userSrc" avaType="stu-avatar"></upload-avator>
          <!-- <a-form-item style="display: none;">
            <a-input v-decorator="['avatarId']" />
          </a-form-item> -->
        </a-col>
        <a-col :lg="16" :md="24" :sm="24">
          <a-row :gutter="8">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item v-bind="formItemLayout" label="学员姓名">
                <a-input autocomplete="name" v-decorator="['stuName', { rules: [{ required: true, message: '请输入学员姓名' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item v-bind="formItemLayout" label="手机号码">
                <a-input
                  autocomplete="tel-national"
                  @change="testStudentInfo"
                  :maxLength="12"
                  v-decorator="[
                    'stuPhone',
                    {
                      rules: [{ required: true, message: '请输入正确的手机号码' }, { validator: setPhoneValue }]
                    }
                  ]"
                />
              </a-form-item>
              <a-form-item style="display: none;">
                <a-input v-decorator="['id']" />
              </a-form-item>
              <a-form-item style="display: none;">
                <a-input v-decorator="['stuUserId']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="8">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item v-bind="formItemLayout" label="顾问">
                <span @click="getUser('all')">
                  <a-input
                    style="cursor: pointer;color: #000;"
                    disabled
                    placeholder="请选择顾问"
                    v-decorator="['master', { rules: [{ required: true, message: '请选择顾问' }] }]"
                  >
                    <a-icon slot="addonAfter" type="search" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item v-bind="formItemLayout" label="人群分类">
                <a-radio-group :options="stuTypeOptions" v-decorator="['stuType', { rules: [{ required: true, message: '请选择是否成人' }] }]" />
                <div v-show="studentLimit == 'B'" style="font-size: 12px;color: red;line-height: 1;">人群分类仅能修改一次哦</div>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="8">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item v-bind="formItemLayout" label="微信号">
                <a-input @change="testStudentInfo" v-decorator="['stuWechat', { rules: [{ required: false, message: '请输入微信号' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item v-bind="formItemLayout" label="QQ号">
                <a-input
                  @change="testStudentInfo"
                  v-decorator="['stuQQ', { rules: [{ required: false, message: '请输入QQ号' }, { validator: $verify.isNum }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row v-if="!quickApplayShow" :gutter="8">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item :labelCol="{ sm: { span: 8 } }" :wrapperCol="{ sm: { span: 16 } }" label="性别">
            <a-radio-group v-decorator="['stuSex', { rules: [{ required: false, message: '请选择性别' }] }]" name="radioGroup">
              <a-radio value="A">男</a-radio>
              <a-radio value="B">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item v-bind="formItemLayout" label="身份证号码">
            <a-input
              @change="testStudentInfo"
              v-decorator="['stuIdcard', { rules: [{ required: false, message: '请输入身份证号码' }, { validator: verifyIdCard }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item v-bind="formItemLayout" label="出生年月">
            <span class="space-between">
              <span class="space-between" style="width: 33.3%;">
                <a-input type="hidden" v-decorator="['stuBirthday', { rules: [{ required: true, validator: verifyBirthDate }] }]" />
                <a-input ref="birthdayYear" v-model="birthdayYear" @change="onTimeChange" />&nbsp;年&nbsp;
              </span>
              <span class="space-between" style="width: 33.3%;">
                <a-input ref="birthdayMonth" v-model="birthdayMonth" @change="onTimeChange" />&nbsp;月&nbsp;
              </span>
              <span class="space-between" style="width: 33.3%;"> <a-input ref="birthdayDay" v-model="birthdayDay" @change="onTimeChange" />&nbsp;日 </span>
            </span>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item v-bind="formItemLayout" label="省市">
            <a-cascader
              autocomplete="address-level2"
              :options="addressOptions"
              :showSearch="{ dataFilter }"
              placeholder="请选择省市区"
              :fieldNames="{ label: 'value', value: 'value', children: 'children' }"
              v-decorator="['stuArea', { rules: [{ required: true, message: '请选择省市区' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item v-bind="formItemLayout" label="联系人/电话">
            <a-input
              autocomplete="tel"
              placeholder="紧急联系人及电话"
              v-decorator="[
                'stuEmergency',
                {
                  rules: [
                    {
                      required: false,
                      message: '联系人及电话'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="16" :md="16" :sm="24">
          <a-form-item
            v-bind="{
              labelCol: {
                lg: { span: 4 },
                md: { span: 6 },
                sm: { span: 8 }
              },
              wrapperCol: {
                lg: { span: 20 },
                md: { span: 18 },
                sm: { span: 16 }
              }
            }"
            label="备注"
          >
           <div class='textareaTips'>
             <a-textarea placeholder="请输入备注 (100字以内)" @input='onstuRemarkChange'  v-decorator="['stuRemark', { rules: [{ validator: $verify.lenth }] }]"  auto-size :maxLength='100' />
             <span class='tips'>{{stuRemarkTips}}</span>
           </div>
          </a-form-item>
        </a-col>
        <a-col :lg="16" :md="16" :sm="24" v-if="stuId">
          <a-form-item
            v-bind="{
              labelCol: {
                lg: { span: 4 },
                md: { span: 6 },
                sm: { span: 8 }
              },
              wrapperCol: {
                lg: { span: 20 },
                md: { span: 18 },
                sm: { span: 16 }
              }
            }"
            label="是否试课"
          >
            <a-radio-group v-decorator="['stuAudition', { rules: [{ required: true, message: '请选择是否试课' }] }]">
              <a-radio value="A">是</a-radio>
              <a-radio value="B">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!--  本地学员选择    -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="学员选择" v-model="localStuModal" @cancel="clearInput" width="850px" :footer="null">
      <a-table :columns="columns" :dataSource="localStuInfo" :pagination="false" rowKey="id||stuUserId">
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="assignStuInfo(record)">确认选择</a>
        </span>
      </a-table>
    </a-modal>
    <!--  旧学员数据    -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="旧学员卡" v-model="oldStudentModal" width="850px" :footer="null">
      <a-table :columns="oldColumns" :dataSource="oldStudenList" :pagination="false" :rowKey="rowKey => `${rowKey.amount}-${Math.random()}`">
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="assignStuInfo(record)">确认选择</a>
        </span>
      </a-table>
    </a-modal>

    <!-- imodal -->
    <i-modal ref="modall" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getUserBack"> </i-modal>
  </div>
</template>
<script>
import { UploadAvator, IModal } from '@/components'
import { verifyStudent, verifyUpdateStudent } from '@/api/recep'
import DISTRICTS from '@/tools/citydata'
import moment from 'moment'

const addressOptions = DISTRICTS
const initStuInfo = {
  stuName: '',
  stuPhone: '',
  stuSex: '',
  stuSource: '',
  stuBirthday: null,
  stuIdcard: '',
  avatar: null,
  stuArea: [],
  stuWechat: '',
  stuQQ: '',
  stuEmergency: '',
  stuRemark: '',
  stuAudition: '',
  usedNum: null,
  stuType: ''
}
const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 16
    }
  }
}
const bigLayout = {
  labelCol: {
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    sm: {
      span: 18
    }
  }
}
const columns = [
  {
    title: '录入时间',
    dataIndex: 'student.createDate',
    key: 'createDate'
  },
  {
    title: '姓名',
    dataIndex: 'student.stuName',
    key: 'stuName'
  },
  {
    title: '手机号码',
    dataIndex: 'student.stuPhone',
    key: 'stuPhone'
  },
  {
    title: 'QQ号码',
    dataIndex: 'student.stuQQ',
    key: 'stuQQ'
  },
  {
    title: '微信号码',
    dataIndex: 'student.stuWechat',
    key: 'stuWechat'
  },
  {
    title: '数据来源',
    dataIndex: 'type',
    key: 'type',
    customRender: (text, record) => {
      // return text == 'stuPhone' ? '手机号码查询' : text == 'stuQQ' ? 'QQ查询' : '微信查询'
      let show = '来源错误'
      switch (text) {
        case 'stuPhone':
          show = '手机号码查询'
          break
        case 'stuQQ':
          show = 'QQ查询'
          break
        case 'stuWechat':
          show = '微信查询'
          break
        case 'stuId':
          show = '前台数据'
          break
      }

      return show
    }
  },
  {
    title: '操作',
    width: '150px',
    scopedSlots: { customRender: 'action' },
    key: 'action'
  }
]
const oldColumns = [
  {
    title: '卡种名称',
    dataIndex: 'cardType'
  },
  {
    title: '顾问名称',
    dataIndex: 'masterName'
  },
  {
    title: '客服',
    dataIndex: 'source'
  },
  {
    title: '金额',
    dataIndex: 'amount'
  }
]
export default {
  props: {
    studentLimit: {
      type: String,
      default: null
    },
    quickApplayShow: {
      type: Boolean,
      default: false
    },
    studentData: Object,
    routerId: {
      type: String,
      default: null
    },
    isApply: {
      type: Boolean,
      default: false
    }
  },
  components: {
    IModal,
    UploadAvator
  },
  data() {
    return {
      stuRemarkTips:'',
      columns,
      oldColumns,
      //imdal
      userType: 'all',
      queryParam: {},
      addressOptions,
      test: this.$tools.formLayoutSmall,
      stuBirthday: '',
      birthdayYear: '',
      birthdayMonth: '',
      birthdayDay: '',
      confirmDirty: false,
      formItemLayout: defaultLayout,
      fromBigItemLayout: bigLayout,
      // sourceSelectDataA: [],
      userAvaId: null,
      userSrc: null,
      isStued: false,
      initStuInfo,
      localStuInfo: [],
      localStuModal: false,
      stuId: null,
      stuUserId: null,
      // formItemLayout: this.$tools.formItemLayout,
      oldStudentModal: false,
      oldStudenList: [],
      //
      stuSource: {
        source: '',
        sourceId: null
      },
      stuTypeOptions: [{ label: '成人', value: 'A' }, { label: '少儿', value: 'B' }]
    }
  },
  watch: {
    routerId(nv, ov) {
      nv ? this.routerIdSearch() : ''
    },
    studentData(nv, ov) {
      if (nv !== ov) {
        this.dataBacking(nv)
        this.$nextTick(() => {
          this.$refs.uploadAva.initLocalSrc()
        })
        this.userAvaId = null
      }
      // if (nv.sourceSelectData && nv.sourceSelectData.length > 0) {
      //   this.sourceSelectDataA = nv.sourceSelectData
      // }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    this.dataBacking(this.studentData)
  },
  created() {
    this.routerId ? this.routerIdSearch() : ''
  },
  methods: {
    onstuRemarkChange(){
      const {
        form: { getFieldsValue },
      } = this
      const {stuRemark} = getFieldsValue()
      if(stuRemark.length>=95){
        this.stuRemarkTips=`还剩${100-stuRemark.length}字`
      }else{ this.stuRemarkTips=''}
    },
    setPhoneValue(rule, value, callback) {
      const {
        form: { setFieldsValue }
      } = this
      this.$nextTick(() => {
        setFieldsValue({ stuPhone: (value = value.replace(/[^0-9]/gi, '')) })
        callback()
      })
    },
    //imodal
    getUser(type) {
      this.userType = type
      this.$refs.modall.open()
    },
    imodalOk() {},
    imodalClose() {},
    getUserBack(data, type) {
      if (type === 'all') {
        this.$nextTick(() => {
          this.form.setFieldsValue({ master: data.name })
          this.queryParam.masterId = data.id
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ [type]: data.name })
          this.queryParam[`${type}Id`] = data.id
        })
      }
    },
    verifyIdCard(rule, value, callback) {
      this.$verify.idCard(rule, value, callback, false)
    },

    // setSelectData(data) {
    //   this.sourceSelectDataA = data
    // },
    onTimeChange(event) {
      this.$nextTick(() => {
        let { birthdayYear, birthdayMonth, birthdayDay } = this
        if (this.$refs.birthdayYear.$el === event.currentTarget) {
          if (birthdayYear.length > 4) this.birthdayYear = birthdayYear = birthdayYear.slice(0, 4)
          if (birthdayYear.length === 4) this.$refs.birthdayMonth.focus()
        }
        if (this.$refs.birthdayMonth.$el === event.currentTarget) {
          if (birthdayMonth.length > 2) this.birthdayMonth = birthdayMonth = birthdayMonth.slice(0, 2)
          if (birthdayMonth.length === 2) this.$refs.birthdayDay.focus()
        }
        if (this.$refs.birthdayDay.$el === event.currentTarget) {
          if (birthdayDay.length > 2) this.birthdayDay = birthdayDay = birthdayDay.slice(0, 2)
        }

        let month = birthdayMonth.length === 1 ? '0' + birthdayMonth : birthdayMonth
        let day = birthdayDay.length === 1 ? '0' + birthdayDay : birthdayDay
        this.stuBirthday = `${birthdayYear}-${month}-${day}`
        this.form.setFieldsValue({
          stuBirthday: `${birthdayYear}-${month}-${day}`
        })
        this.form.validateFields(['stuBirthday'])
      })
    },
    validateData() {
      return this.form.validateFields()
    },
    dataFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    dataBacking(data) {
      console.log('data =>', data)
      data.id || data.stuUserId ? (this.isStued = true) : (this.isStued = false)

      if (!!data.avatar || !!data.stuAvatar) {
        this.userSrc = data.avatar || data.stuAvatar
        this.userAvaId = null
      }
      // if (!this.isApply) {
      // this.$refs.uploadAva.initAva()
      // }

      let formData = {
        stuPhone: data.stuPhone || '',
        stuName: data.stuName || '',
        stuSex: data.stuSex || '',
        stuSource: data.stuSource || '',
        stuIdcard: data.stuIdcard || '',
        stuArea: !!data.stuArea ? (typeof data.stuArea == 'object' ? data.stuArea : data.stuArea.split(',')) : [],
        stuWechat: data.stuWechat || '',
        stuQQ: data.stuQQ || '',
        stuEmergency: data.stuEmergency || '',
        stuRemark: data.stuRemark || '',
        stuAudition: data.stuAudition || '',
        master: (this.studentData && this.studentData.adviserName) || data.master,
        stuBirthday: data.stuBirthday ? moment(data.stuBirthday, 'YYYY-MM-DD') : null,
        id: data.id || null,
        stuUserId: !data.id ? data.stuUserId || this.routerId : null,
        stuType: data.stuType || ''
      }
      let birthday = (formData.stuBirthday && formData.stuBirthday.format('YYYY-MM-DD')?.split('-')) || []
      this.stuBirthday = formData.stuBirthday || ''
      this.birthdayYear = birthday[0] || ''
      this.birthdayMonth = birthday[1] || ''
      this.birthdayDay = birthday[2] || ''

      this.stuId = data.id || null
      this.stuUserId = !data.id ? data.stuUserId || this.routerId : null
      //处理意向学员手机号回显顾问
      if (data.studentData) {
        formData.master = data.studentData.adviserName
      }
      this.$tools.delUndefined(formData)

      this.$nextTick(() => {
        this.form.setFieldsValue(formData)
        console.log(777,formData)
        this.onstuRemarkChange()
      })
    },
    getFilesId(fileId) {
      this.userAvaId = fileId
    },
    routerIdSearch() {
      const { routerId, _this, localStuInfo } = this
      const IS_PHONE = /^1[3456789]\d{9,10}$/
      let params = {}
      if (IS_PHONE.test(routerId)) {
        params = {
          stuPhone: routerId
        }
      } else {
        params = {
          stuUserId: routerId
        }
      }
      verifyStudent(params).then(res => {
        const { student } = res.data
        this.stuId = student.id
        res.data.type = 'stuId'
        // localStuInfo.push(res.data)
        this.hasLocalStuInfo(res.data)
        this.dataBacking(student)
        this.$emit('hasCards', res.data)
      })
    },

    searchStudentInfo(e) {
      const {
        routerId,
        dataBacking,
        isApply,
        form: { setFieldsValue },
        studentData,
        $notification
      } = this
      const _this = this
      const data = { stuPhone: e.target.value }
      if (data.stuPhone && data.stuPhone.length == 11) {
        if (isApply) {
          verifyStudent(data).then(res => {
            const { student } = res.data
            if (routerId) {
              if (!student.stuPhone && routerId === student.stuUserId) {
                student.stuPhone = data.stuPhone
              }
              if (student.stuPhone && student.id) {
                this.$confirm({
                  title: '系统提示',
                  content: `该手机号码已存在【${student.stuName}】,是否使用?`,
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    dataBacking(student)
                    delete student.stuUserId
                    let stuInfo = res.data
                    _this.$emit('hasCards', stuInfo)
                  },
                  onCancel() {
                    this.$nextTick(() => {
                      setFieldsValue({ ['stuPhone']: '' })
                    })
                  }
                })
              }
            } else {
              if (student.id || student.stuUserId) {
                if (isApply) {
                  this.dataBacking(student)
                  let stuInfo = res.data
                  this.$emit('hasCards', stuInfo)
                } else {
                  this.$notification['error']({
                    message: '系统通知',
                    description: '该手机号码已存在'
                  })
                }
              } else {
                const data = this.form.getFieldsValue()
                const student = {
                  stuName: '',
                  stuPhone: data.stuPhone,
                  stuSex: '',
                  stuSource: '',
                  stuBirthday: null,
                  stuIdcard: '',
                  avatar: null,
                  stuArea: [],
                  stuWechat: '',
                  stuQQ: '',
                  stuEmergency: '',
                  stuRemark: '',
                  stuAudition: '',
                  usedNum: null,
                  stuType: data.stuType
                }
                let params = {
                  studentCards: null
                }
                if (this.isStued) {
                  params.student = student
                } else {
                  params.student = Object.assign(student, data)
                }
                this.dataBacking(params)
                this.$emit('hasCards', params)
              }
            }
          })
        } else {
          if (studentData && studentData.stuPhone && data.stuPhone !== studentData.stuPhone) {
            verifyUpdateStudent(data)
          } else {
            verifyUpdateStudent(data).then(res => {
              if (res.code === 200 && res.data) {
                let phoneNum = this.form.getFieldsValue(['stuPhone']).stuPhone
                let backData = {
                  stuPhone: res.data.userPhone || phoneNum,
                  stuName: res.data.userName,
                  stuSex: res.data.userSex,
                  stuSource: res.data.userSource,
                  stuIdcard: res.data.stuIdcard,
                  stuArea: res.data.userArea,
                  stuWechat: res.data.userWechat,
                  stuQQ: res.data.userQQ,
                  stuEmergency: '',
                  stuRemark: res.data.userRemark,
                  stuAudition: res.data.stuAudition,
                  studentData: {
                    adviserName: res.data.orgUserAdviser
                  },
                  stuType: res.data.stuType
                }
                //储存顾问id号
                this.queryParam.masterId = res.data.orgUserId
                this.dataBacking(backData)
              }
            })
          }
        }
        routerId ? (data.stuUserId = routerId) : ''
      }
    },
    testStudentInfo(e) {
      const { isApply, routerId, studentData } = this
      const {
        throttle,
        seachStuOnApply,
        seachStuOnStudent,
        dataBacking,
        form: { setFieldsValue },
        $notification
      } = this
      let {
          target: { value, id }
        } = e,
        data = {}
      //.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
      value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
      if (id === 'stuPhone' || id === 'stuQQ') {
        value = value.replace(/[^0-9]/gi, '')
      }
      data[id] = value
      if (id == 'stuPhone' && (value.length < 11 || value.length > 12)) return
      throttle().then(() => {
        this.$nextTick(() => {
          setFieldsValue({ [id]: value })
        })
        isApply ? seachStuOnApply(data, id) : seachStuOnStudent(data, id)
      })
    },
    // '报名页面操作'
    seachStuOnApply(data, type) {
      const {
        routerId,
        localStuInfo,
        form: { resetFields, setFieldsValue }
      } = this
      const _this = this
      const { seachStuOnApplyHasRouterId, seachStuOnApplyNoRouterId, $message, hasLocalStuInfo, isShowLocalInfo, $confirm } = this
      verifyStudent(data)
        .then(res => {
          const result = res.data
          if (result.student['source'] && result.student['sourceId']) {
            this.stuSource['source'] = result.student['source']
            this.stuSource['sourceId'] = result.student['sourceId']
          }
          const hasVal = Object.keys(result.student).length == 0
          !hasVal
            ? $message.success('查询到一条数据')
            : this.$nextTick(() => {
                this.stuId
                  ? $confirm({
                      title: '系统提示',
                      content: `该号码是否为新学员?`,
                      okText: '是',
                      cancelText: '否',
                      onOk: () => {
                        this.initAllValues()
                        this.$emit('refreshPayCount')
                        this.stuId = ''
                        resetFields()
                        setFieldsValue(data)
                      },
                      onCancel() {
                        return false
                      }
                    })
                  : ''
              })
          result.type = type
          return result
        })
        .then(hasLocalStuInfo)
        .then(isShowLocalInfo)
        .then(result => {
          routerId ? seachStuOnApplyHasRouterId(result) : seachStuOnApplyNoRouterId(result)
        })
    },
    //查询本地是否有数据
    hasLocalStuInfo(result) {
      const {
        localStuInfo,
        localStuInfo: { length }
      } = this
      return new Promise((resolve, reject) => {
        if (length == 0) {
          localStuInfo.push(result)
        } else {
          localStuInfo.map((item, index) => {
            if (item.type === result.type) {
              localStuInfo.splice(index, 1)
            }
          })
          localStuInfo.push(result)
        }
        resolve(result)
      })
    },
    //本地数据是否选择并回显
    isShowLocalInfo(result) {
      const {
        localStuInfo,
        localStuInfo: { length }
      } = this
      return new Promise((resolve, reject) => {
        if (Object.keys(result.student).length == 0) {
          resolve(result)
          return
        }
        let num = 0
        localStuInfo.map((item, index) => {
          if (Object.keys(item.student).length !== 0) {
            num++
          } else {
            localStuInfo.splice(index, 1)
          }
        })
        if (num >= 2 && num <= 4) {
          this.localStuModal = true
        } else if (Object.keys(result.student).length !== 0) {
          resolve(result)
        }
      })
    },
    //确认数据并回显合并
    assignStuInfo(info) {
      const {
        form: { getFieldsValue },
        dataBacking
      } = this
      const { student } = info
      const inputData = getFieldsValue()
      const params = Object.assign(inputData, this.$tools.delUndefined(student))
      student && student.stuUserId ? (params.id = null) : ''
      student && student.id ? (params.stuUserId = null) : ''
      dataBacking(params)
      this.$emit('hasCards', { student: params, studentCards: null })
      this.localStuModal = false
    },
    //直接关闭不选数据
    clearInput() {
      const {
        dataBacking,
        localStuInfo,
        localStuInfo: { length },
        form: { setFieldsValue }
      } = this
      const type = localStuInfo[length - 1].type
      localStuInfo.splice(length - 1, 1)
      // this.$nextTick(()=>{
      setFieldsValue({ [type]: '' })
      // })
    },
    //前台跳转报名
    seachStuOnApplyHasRouterId(result) {
      const { stuPhone, stuUserId, id } = result
      const {
        routerId,
        form: { getFieldsValue, setFieldsValue },
        $confirm,
        dataBacking
      } = this
      if (!stuPhone && routerId == stuUserId) student.stuPhone = getFieldsValue().stuPhone
      if (id || stuUserId) {
        $confirm({
          title: '系统提示',
          content: `该已存在【${result.stuName}】,是否使用?`,
          okText: '确认',
          cancelText: '取消',
          onOk() {
            dataBacking(result)
            delete result.stuUserId
            this.$emit('hasCards', result)
          },
          onCancel() {
            this.$nextTick(() => {
              setFieldsValue({ ['stuPhone']: '' })
            })
          }
        })
      }
    },
    //直接报名
    seachStuOnApplyNoRouterId(student) {
      const {
        dataBacking,
        initStuInfo,
        form: { getFieldsValue },
        isStued
      } = this
      const {
        student: { id, stuUserId, isOldResources },
        oldCardRecord
      } = student

      const inputData = getFieldsValue()
      const initStudentInfo = initStuInfo
      initStudentInfo.stuPhone = inputData.stuPhone
      initStudentInfo.stuQQ = inputData.stuQQ
      initStudentInfo.stuWechat = inputData.stuWechat
      initStudentInfo.stuName = inputData.stuName
      initStudentInfo.stuType = inputData.stuType
      initStudentInfo.source = this.stuSource.source
      initStudentInfo.sourceId = this.stuSource.sourceId

      if (id || stuUserId || isOldResources) {
        this.stuId = id
        this.stuUserId = stuUserId
        oldCardRecord
          ? this.$nextTick(() => {
              this.oldStudenList = []
              this.oldStudenList.push(oldCardRecord)
              this.oldStudentModal = true
              student.student['source'] = oldCardRecord.source
            })
          : this.$nextTick(() => {
              this.oldStudenList = []
              this.oldStudentModal = false
            })
        student.student.stuPhone = student.student.stuPhone || inputData.stuPhone
        student.student.stuQQ = student.student.stuQQ || inputData.stuQQ
        student.student.stuWechat = student.student.stuWechat || inputData.stuWechat
        student.student.stuName = student.student.stuName || inputData.stuName
        student.student.stuType = student.student.stuType || inputData.stuType
        // dataBacking(Object.assign(student.student, inputData))
        dataBacking(student.student)
        this.$emit('hasCards', student)
      } else {
        let params = { studentCards: null }
        // params.student = isStued ? initStudentInfo : Object.assign(inputData, initStudentInfo)
        // params.student = isStued ? Object.assign(initStudentInfo, inputData) : initStudentInfo
        params.student = Object.assign(initStudentInfo, inputData)
        dataBacking(params.student)
        this.stuId = null
        this.stuUserId = null
        this.$emit('hasCards', params)
      }
    },
    // '学员页面操作'
    seachStuOnStudent(data, type) {
      const {
        seachStuOnApply,
        searchStuOnEdit,
        studentData: { id }
      } = this

      id ? searchStuOnEdit(data, type) : seachStuOnApply(data, type)
    },
    // 学员页面编辑
    searchStuOnEdit(data, type) {
      const {
        studentData,
        studentData: { stuPhone }
      } = this
      if (studentData && stuPhone && data.stuPhone !== stuPhone) {
        verifyUpdateStudent(data).then(res => {
          console.log('edit', res)
        })
      }
    },
    throttle() {
      return new Promise((resolve, reject) => {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          resolve()
        }, 400)
      })
    },
    handleOk() {
      let result = this.form.getFieldsValue()
      console.log(result)
      //处理生日日期信息
      result.stuBirthday = this.$tools.tailor.getDate(result.stuBirthday)
      result.avatar = this.userAvaId || null
      result.stuArea = !!result.stuArea ? result.stuArea.join(',') : null
      //处理顾问信息
      result.adviserId = this.queryParam.masterId || this.studentData.adviserId || null
      result.id = this.stuId
      result.stuUserId = this.stuUserId

      return result
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
        }
      })
    },
    resetForm() {
      this.localStuInfo = []
      this.form.resetFields()
      this.userAvaId = null

      //创建初始params
      let params = {
        student: {
          id: null,
          stuPhone: ''
        },
        studentCards: null
      }

      this.$emit('hasCards', params)
    },
    initAllValues() {
      this.stuId = null
      this.userSrc = null
      this.userAvaId = null
    },
    verifyBirthDate(rule, value, callback) {
      const { birthDate } = this.$verify
      const isInt = /^[0-9]*$/
      let { birthdayYear, birthdayMonth, birthdayDay } = this
      if (birthdayYear && birthdayMonth && birthdayDay) {
        if (isInt.test(birthdayYear) && isInt.test(birthdayMonth) && isInt.test(birthdayDay)) {
          birthdayMonth = birthdayMonth.length === 1 ? '0' + birthdayMonth : birthdayMonth
          birthdayDay = birthdayDay.length === 1 ? '0' + birthdayDay : birthdayDay
          birthDate(rule, `${birthdayYear}${birthdayMonth}${birthdayDay}`, callback, true)
        } else {
          callback('出生年月日格式错误')
        }
      } else {
        callback('请输入出生年月日')
      }
    }
  }
}
</script>

<style scoped lang="less">
.space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.textareaTips{
  position:relative;
  .tips {
    position: absolute;
    bottom: -5px;
    right: 10px;
    font-size: 12px;
  }
}
</style>
