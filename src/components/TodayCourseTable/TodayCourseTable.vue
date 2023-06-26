<template>
  <div class="today-course-table-wrapper">
    <div class="table-wrapper">
      <a-table
        ref="table"
        :rowSelection="portType == 'D' ? rowSelection : null"
        :pagination="false"
        :columns="setColumns"
        :rowKey="record => record.planId"
        :loading="tableValueLoad"
        :dataSource="tableloadArr"
      >
        <span slot="duration" slot-scope="text, record">
          <a-tooltip>
            <template slot="title">
              <div style="font-size:12px;">学员签到计次:{{ record.signCount || '' }}</div>
              <div style="font-size:12px;">老师签到计次:{{ record.teaSignCount || '' }}</div>
            </template>
            <a-icon type="question-circle" />
          </a-tooltip>
          {{ `${$tools.tailor.getTime(record.startDate)} ~ ${$tools.tailor.getTime(record.endDate)}` }}
          <a-tag v-if="record.signTeachers && record.signTeachers.length > 0">签</a-tag>
        </span>
        <span slot="stuLogCount" slot-scope="text, record">
          {{ record.stuLogCount }}/{{ record.actualMembers || 0 }}/{{ record.studentCount ? record.studentCount : '不限' }}
        </span>
        <span slot="teachers" slot-scope="text, record" style="display: flex;flex-flow: nowrap row;align-items: center;">
          <span :key="idx" v-for="(item, idx) in record.teachers">
            <span v-if="idx != 0"> ， </span>
            <span>
              <span>
                {{ item.teacherName }}
              </span>
            </span>
          </span>
        </span>
        <span slot="signTeachers" slot-scope="text, record" style="display: flex;flex-flow: nowrap row;align-items: center;">
          <span :key="idx" v-for="(item, idx) in record.signTeachers || []">
            <span v-if="idx != 0"> ， </span>
            <span>
              <span>
                {{ item.signName }}
              </span>
            </span>
          </span>
        </span>
        <span slot="className" slot-scope="text, record">
          <perm-box :text="text" perm="education:class:view" v-if="portType !== 'C'">
            <router-link :to="{ path: `/reception/class/classInfo/${record.classId}` }">{{ text }}</router-link>
          </perm-box>
          <span v-else>{{ text }}</span>
        </span>
        <!-- (record.isOnline || !classInfo.isOnlinePersonal) ||(record.isOnline&& !record.isOnlinePersonal)|| -->
        <span slot="action" slot-scope="text, record" v-if="record.isOnline && !record.isOnlinePersonal">
          <perm-box v-if="portType == 'C' || (portType == 'D' && record.planStatus !== 'A')" perm="education:plan:save && education:class-online:view">
            <a href="#" @click="editClassPlan(record)">编辑</a>
          </perm-box>
          <perm-box v-if="(portType == 'C' || portType == 'D') && !record.stuLogCount" perm="education:plan:del && education:class-online:view">
            <a href="#" @click="deleteClassPlan(record)">删除</a>
          </perm-box>
          <perm-box perm="education:signinlog:sign && education:class-online:view">
            <a href="javascript:;" @click="teacherSign(record)">导师签到</a>
          </perm-box>
        </span>
        <!-- v-if="!record.isOnline || record.isOnlinePersonal" -->
        <span slot="action" slot-scope="text, record" v-else>
          <perm-box v-if="portType == 'C' || (portType == 'D' && record.planStatus !== 'A')" perm="education:plan:save">
            <a href="#" @click="changeClassTime(record)">修改课时</a>
          </perm-box>
          <perm-box v-if="portType == 'C' || (portType == 'D' && record.planStatus !== 'A')" perm="education:plan:save">
            <a href="#" @click="editClassPlan(record)">编辑</a>
          </perm-box>
          <perm-box v-if="(portType == 'C' || portType == 'D') && !record.stuLogCount" perm="education:plan:del">
            <a href="#" @click="deleteClassPlan(record)">删除</a>
          </perm-box>
          <perm-box perm="education:signinlog:sign">
            <a href="javascript:;" @click="teacherSign(record)">导师签到</a>
          </perm-box>
          <perm-box perm="student:signinlog:sign || student:signinlog:view">
            <a href="javascript:;" @click="studentSign(record)">学生签到</a>
            <a href="javascript:;" @click="qrcodeHandle(record)"> 扫一扫签到</a>
          </perm-box>
          <perm-box v-if="portType == 'C' || (portType == 'D' && record.planStatus !== 'A')" perm="student:signinlog:view">
            <a href="#" @click="showSignRecord(record)">签到记录</a>
          </perm-box>
        </span>
      </a-table>
    </div>

    <!--  老师签到  -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :footer="null" :width="800" :title="`导师签到 ${classBaseInfo}`" v-model="teacherSignModal">
      <SignInTea
        ref="SignInTea"
        :tea-record="teacherRecord"
        :teaSigninLog="teaSigninValue"
        @signinTea="refreshTea"
        :modalIsOpen="teacherSignModal"
        :eduTypeId="eduTypeId"
      ></SignInTea>
    </a-modal>

    <!--  学生签到  -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :footer="null"
      :width="1100"
      @cancel="closeStudentModal"
      :visible="studentSignModal"
    >
      <div slot="title" style="display: flex">
        <div>{{ classBaseInfo }}</div>
        <div style="margin-left: 60px">
          <span>
            本班共：
            <b style="color: red">
              {{ studentList.length }}
            </b>
            人， 已签到：
            <b style="color: red">
              {{ hasSignStu }}
            </b>
            人，
          </span>
          实际人数:
          <span>
            <a-input-number style="width:50px; text-align=center;" v-model="actualMembers" :min="0" :max="1000" />
          </span>
          人
          <perm-box perm="student:signinlog:sign">
            <span style="margin-left:30px">
              <a-button @click="actualMembersSubmit">确定</a-button>
            </span>
          </perm-box>
        </div>
      </div>
      <SignInStu
        :dancePlanId="studentSignOptions.danceplanId"
        :classId="studentSignOptions.classId"
        :type="studentSignOptions.typeId"
        ref="signInStu"
        @refresh="refreshStu"
        :record="studentSignOptions.record"
        :planId="studentSignOptions.danceplanId"
        :classStuListProps="studentList"
        :modalIsOpen="studentSignModal"
      />
    </a-modal>

    <!--  编辑班级详情的信息  -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="修改信息"
      :width="800"
      v-model="editClassPlanModal"
      :confirmLoading="classPlanModalLoading"
      okText="保存"
      cancelText="取消"
      @ok="saveClassPlan()"
    >
      <class-info-plan-modalform
        :classTypeId="classInfo && classInfo.eduType ? classInfo.eduType.id : null"
        ref="planModalForm"
        :isPersonal="classInfo.isPersonal"
      >
      </class-info-plan-modalform>
    </a-modal>

    <!--  查看签到记录  -->
    <!-- <SignInReport
      :danceplanId="studentSignOptions.danceplanId"
      :classId="studentSignOptions.classId"
      :type="studentSignOptions.typeId"
      ref="signInReport">
    </SignInReport> -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :footer="null"
      :width="1200"
      title="签到记录"
      @cancel="handleCancelSignRecord"
      :visible="visibleSignRecord"
    >
      <div style="width: 100%;height: 500px;overflow-y:scroll">
        <f-frame :src="`/report?name=student_class_signinlog&danceplanId=${planIdReport}&classId=${classIdReport}`"></f-frame>
      </div>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="400"
      title="班级签到二维码"
      :footer="null"
      @cancel="qrcodeCancel"
      v-model="qrcodeVisible"
    >
      <div class="image_wrapper">
        <img id="image_qrcodeUrl" style="width: 350px" :src="qrcodeUrl" />
        <!-- <a-button style="margin-top: 20px; width:400px" @click="doCopy" icon="copy" block>
          拷贝图片
        </a-button> -->
      </div>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="500"
      title="修改课时"
      @cancel="classTimeCancel"
      @ok="classTimeOk"
      v-model="changeClassTimeVisual"
    >
      <div class="">
        <a-form-model ref="classTimeForm" :model="classTimeForm" :rules="classTimeRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="开始时间" prop="startMinute">
            <span>
              <a-select class="calculator" v-model="classTimeForm.startCalculator" @change="onChange">
                <a-select-option value="+">延后</a-select-option>
                <a-select-option value="-">提前</a-select-option>
              </a-select>
              <a-input-number class="minute" v-model="classTimeForm.startMinute" :min="0" @change="onChange"></a-input-number>
              分钟
            </span>
          </a-form-model-item>
          <a-form-model-item label="结束时间" prop="endMinute">
            <span>
              <a-select class="calculator" v-model="classTimeForm.endCalculator" @change="onChange">
                <a-select-option value="+">延后</a-select-option>
                <a-select-option value="-">提前</a-select-option>
              </a-select>
              <a-input-number class="minute" v-model="classTimeForm.endMinute" :min="0" @change="onChange"></a-input-number>
              分钟
            </span>
          </a-form-model-item>
          <div class="classTime">
            <div class="classTimeItem">
              <span class="title">当前上课时间：</span>
              <!-- <span>{{ classTimeData.startDate }}~{{ classTimeData.endDate }}</span> -->
              <span class="content"> {{ `${$tools.tailor.getTime(classTimeData.startDate)} ~ ${$tools.tailor.getTime(classTimeData.endDate)}` }}</span>
            </div>
            <div class="classTimeItem">
              <span class="title">修改后上课时间： </span>
              <span class="content">
                <!-- <span
                  >{{ classTimeData.modifyStartDate }}<span v-if="classTimeData.modifyStartDate && classTimeData.modifyEndDate">~</span
                  >{{ classTimeData.modifyEndDate }}</span
                > -->
                <span v-if="classTimeData.modifyStartDate && classTimeData.modifyEndDate">{{
                  `${$tools.tailor.getTime(classTimeData.modifyStartDate)} ~ ${$tools.tailor.getTime(classTimeData.modifyEndDate)}`
                }}</span>
              </span>
            </div>
          </div>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import PermBox from '@/components/PermBox'
import SignInTea from '@/components/SignInTea'
import SignInStu from '@/components/SignInStu/SignInStu1'
import { getTodayPlanList, getTeaSignInList, getStuSignInList, actualMembers, SignInTeaList } from '@/api/reception/todayplan'
import { removeClassPlan, editAddClassPlan, getClassPlanList, updatePlanTime } from '@/api/education'
import { getListDayPlan } from '@/api/recep'
import ClassInfoPlanModalform from '@/views/education/modules/classInfoPlanModalform'
import SignInReport from '@/views/education/modules/signInReport'
function getSelect(targetNode) {
  if (window.getSelection) {
    //chrome等主流浏览器
    var selection = window.getSelection()
    var range = document.createRange()
    range.selectNode(targetNode)
    selection.removeAllRanges()
    selection.addRange(range)
  } else if (document.body.createTextRange) {
    //ie
    var range = document.body.createTextRange()
    range.moveToElementText(targetNode)
    range.select()
  }
}
const todayStr = moment().format('YYYY-MM-DD') //今日日期
const defaultColumns = [
  {
    title: '上课时间',
    dataIndex: 'duration',
    key: 'duration',
    width: 100,
    scopedSlots: { customRender: 'duration' }
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    // customRender: text => {
    //   return text.substr(0, 10)
    // }
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    scopedSlots: { customRender: 'className' }
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName',
    width: 200
  },
  {
    title: '计划上课导师',
    dataIndex: 'teachers',
    key: 'teachers',
    scopedSlots: { customRender: 'teachers' },
    width: 200
  },
  {
    title: '签到导师',
    dataIndex: 'signTeachers',
    key: 'signTeachers',
    scopedSlots: { customRender: 'signTeachers' },
    width: 200
  },
  {
    title: '顾问',
    dataIndex: 'masterName',
    key: 'masterName',
    width: 200
  },
  {
    title: '排课分馆',
    dataIndex: 'roomSchoolName',
    key: 'roomSchoolName',
    width: 200
  },
  {
    title: '教室',
    dataIndex: 'roomName',
    key: 'roomName',
    width: 200
  },
  {
    title: '已签/上课数/总数',
    dataIndex: 'stuLogCount',
    scopedSlots: { customRender: 'stuLogCount' },
    key: 'stuLogCount',
    width: 200
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
const classPlanColumnsN = [
  {
    title: '上课日期',
    dataIndex: 'startDate',
    key: 'startDate',
    customRender: text => {
      return text.substr(0, 10)
    }
  },
  {
    title: '上课时间',
    dataIndex: 'duration',
    key: 'duration',
    scopedSlots: { customRender: 'duration' }
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    // customRender: text => {
    //   return text.substr(0, 10)
    // }
  },
  {
    title: '排课分馆',
    dataIndex: 'roomSchoolName',
    key: 'roomSchoolName'
  },
  {
    title: '教室',
    dataIndex: 'roomName',
    key: 'roomName'
  },
  {
    title: '计划上课导师',
    dataIndex: 'teachers',
    key: 'teachers',
    scopedSlots: { customRender: 'teachers' }
  },
  // {
  //   title: '上课状态',
  //   dataIndex: 'status',
  //   key: 'status',
  //   customRender: text => {
  //     return text == 'Y' ? '已上课' : text == 'N' ? '未上课' : '停课'
  //   }
  // },
  {
    title: '薪酬类型',
    dataIndex: 'salTypeName',
    key: 'salTypeName'
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'TodayCourseTable',
  props: {
    portType: {
      type: String,
      default: 'C' //'A'=>今日安排, 'B'=>排课, 'C'=>班级课程列表
    },
    params: {
      type: Object,
      default: () => {}
    },
    classInfo: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    PermBox,
    SignInTea,
    SignInStu,
    ClassInfoPlanModalform,
    SignInReport
  },
  computed: {
    setColumns() {
      const { portType } = this
      switch (portType) {
        case 'A':
          return defaultColumns
          break
        case 'B':
          const spliceColumns = defaultColumns.filter(item => {
            return item.key !== 'action'
          })
          return defaultColumns
          break
        case 'C':
          return defaultColumns
          break
        case 'D':
          return classPlanColumnsN
          break
        default:
          return defaultColumns
      }
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        },
        getCheckboxProps: record => {
          let disabled = false
          if (this.portType === 'D') {
            disabled = (record.signTeachers?.length > 0) || (record.teachers?.length > 1)
          }
          return {
            props: {
              disabled
            }
          }
        }
      }
    },
    hasSignStu() {
      return this.studentList.filter(item => item.signed === 'Y').length
    }
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      timer: null,
      classTimeData: {},
      classTimeRules: {
        // startMinute: [{ required: true, message: '请输入开始时间', trigger: 'change' }],
        // endMinute: [{ required: true, message: '请输入结束时间', trigger: 'change' }]
      },
      classTimeForm: { startMinute: undefined, startCalculator: '+', endMinute: undefined, endCalculator: '+' },
      changeClassTimeVisual: false, //修改课时弹窗
      // 学生签到actualMembersChangeHandle
      actualMembers: 0,
      // setColumns,
      tableValueLoad: false,
      tableloadArr: [],
      classBaseInfo: '',
      //老师签到数据
      teacherSignModal: false,
      teacherRecord: {},
      teaSigninValue: null,
      //学生签到数据
      studentSignModal: false,
      studentSignOptions: {
        danceplanId: null,
        classId: null,
        typeId: null,
        record: null,
        planId: null
      },
      studentList: [],
      //编辑班级信息
      editClassPlanModal: false,
      classPlanModalLoading: false,
      visibleSignRecord: false,

      planIdReport: '',
      classIdReport: '',
      qrcodeVisible: false,
      qrcodeInfo: {},
      qrcodeUrl: null,
      eduTypeId: null,
      pathname: null
    }
  },
  watch: {
    teacherSignModal(n, o) {
      if (!n) {
        this.$nextTick(() => {
          this.$refs.SignInTea.resetForm()
        })
      }
    }
  },
  created() {
    this.pathname = window.location.pathname
    this.setTableloadArr()
  },
  methods: {
    onChange() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        let start = new Date(this.classTimeData.startDate).getTime()
        let end = new Date(this.classTimeData.endDate).getTime()
        if (this.classTimeForm.startCalculator === '+') {
          start = start + (this.classTimeForm.startMinute || 0) * 1000 * 60
        } else if (this.classTimeForm.startCalculator === '-') {
          start = start - (this.classTimeForm.startMinute || 0) * 1000 * 60
        }
        if (this.classTimeForm.endCalculator === '+') {
          end = end + (this.classTimeForm.endMinute || 0) * 1000 * 60
        } else if (this.classTimeForm.endCalculator === '-') {
          end = end - (this.classTimeForm.endMinute || 0) * 1000 * 60
        }
        this.classTimeData.modifyStartDate = moment(new Date(start)).format('YYYY-MM-DD HH:mm:ss')
        this.classTimeData.modifyEndDate = moment(new Date(end)).format('YYYY-MM-DD HH:mm:ss')
        this.$forceUpdate()
      }, 1000)
    },
    changeClassTime(record) {
      this.classTimeData = record
      this.classTimeData.modifyStartDate = ''
      this.classTimeData.modifyEndDate = ''

      this.changeClassTimeVisual = true
    },
    classTimeOk() {
      this.$refs.classTimeForm.validate(valid => {
        if (valid) {
          const { classId, roomId, planId: dancePlanId, teachers, modifyStartDate, modifyEndDate } = this.classTimeData
          let teacherIds = teachers.map(d => d.teacherId).join(',')
          let { startMinute = 0, startCalculator, endMinute = 0, endCalculator } = this.classTimeForm
          if (startCalculator === '-') startMinute = -startMinute
          if (endCalculator === '-') endMinute = -endMinute
          if (moment(modifyStartDate).isAfter(modifyEndDate)) {
            return this.$notification['error']({
              message: '系统通知',
              description: '开始时间不能小于结束时间'
            })
          }
          updatePlanTime({
            classId,
            roomId,
            teacherIds,
            dancePlanId,
            startMinute,
            endMinute
          }).then(res => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '修改课时成功'
              })
              this.setTableloadArr()
              this.classTimeCancel()
            }
          })
        }
      })
    },
    classTimeCancel() {
      this.classTimeForm = { startMinute: undefined, startCalculator: '+', endMinute: undefined, endCalculator: '+' }
      this.changeClassTimeVisual = false
    },
    actualMembersSubmit() {
      const params = {
        nums: this.actualMembers
      }
      actualMembers(params, this.planIdLocal).then(() => {
        this.setTableloadArr()
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
      })
    },
    doCopy() {
      console.log(document.getElementById('image_qrcodeUrl'))
      getSelect(document.getElementById('image_qrcodeUrl'))
      document.execCommand('copy')
      // copy之后清空选择区域
      // window.getSelection().removeAllRanges()
    },
    qrcodeHandle(record) {
      // 将来拓展用
      this.qrcodeInfo = record
      this.qrcodeUrl = process.env.VUE_APP_URL + '/common/qrcode/dancePlan/' + record.planId
      this.qrcodeVisible = true
    },
    qrcodeCancel() {
      this.qrcodeVisible = false
    },
    handleCancelSignRecord() {
      this.visibleSignRecord = false
    },
    useThisPort(str, params) {
      const { portType } = this
      return new Promise((resolve, reject) => {
        if (!portType) reject()
        switch (portType) {
          case 'A':
            resolve(getTodayPlanList(str))
            break
          case 'B':
            resolve(getListDayPlan(str, params))
            break
          case 'C':
            resolve(getListDayPlan(str, params))
            break
          case 'D':
            resolve(getClassPlanList({ limit: 0, page: 0, status: 'N' }, params.classId))
            break
          default:
            reject()
        }
      })
    },
    setTableloadArr(str = todayStr, queryParams = this.params) {
      const { useThisPort, params } = this
      this.tableValueLoad = true
      const hasStr = !!queryParams && !!queryParams['day']
      this.selectedRowKeys = []
      this.selectedRows = []
      useThisPort(hasStr ? queryParams['day'] : str, queryParams)
        .then(res => (this.tableloadArr = res.data))
        .catch(err => console.log(err))
        .finally(() => (this.tableValueLoad = false))
    },
    teacherIsSign(record, item) {
      if (record.signTeachers && record.signTeachers.length > 0) {
        return record.signTeachers.some(signTea => signTea.signTeacherId === item.teacherId)
      } else {
        return false
      }
    },
    setClassBaseInfo(record) {
      const {
        $tools: {
          tailor: { getTime }
        }
      } = this
      this.classBaseInfo = `${record.className || ''} ${getTime(record.startDate)}-${getTime(record.endDate)}`
    },
    teacherSign(record) {
      console.log(record)
      this.eduTypeId = record.eduTypeId
      const { setClassBaseInfo, setTeacherObj } = this
      const { planId } = record
      setClassBaseInfo(record)
      setTeacherObj(planId).then(() => {
        this.teacherRecord = record
        this.teacherSignModal = true
      })
    },
    setTeacherObj(dancePlanId) {
      return getTeaSignInList({ dancePlanId }).then(res => {
        this.teaSigninValue = res.data
      })
    },
    studentSign(record) {
      const { setClassBaseInfo, studentSignOptions, setStudentObj } = this
      const { planId, classId, typeId, actualMembers } = record
      this.planIdLocal = planId
      this.actualMembers = actualMembers
      setClassBaseInfo(record)
      setStudentObj(planId).then(() => {
        studentSignOptions.danceplanId = planId
        studentSignOptions.classId = classId
        studentSignOptions.typeId = typeId
        studentSignOptions.record = record
        this.studentSignModal = true
      })
    },
    setStudentObj(dancePlanId) {
      return getStuSignInList({ dancePlanId }).then(res => {
        this.studentList = res.data
      })
    },
    closeStudentModal() {
      this.$refs.signInStu.isSignin().then(() => {
        this.studentSignModal = false
      })
    },
    editClassPlan(record) {
      const { planStatus, status } = record
      if (planStatus === 'Y' || status === 'Y') {
        return this.$confirm({
          content: '当前排课导师已签到。请重置导师签到再修改课时信息',
          okText: '重置签到',
          cancelText: '取消修改',
          onOk: () => {
            const params = {
              dancePlanId: record.planId,
              type: 0
            }
            SignInTeaList(params).then(res => {
              this.$message.success('重置成功')
              this.setTableloadArr()
            })
          }
        })
      }
      const { classInfo } = this
      // console.log(classInfo)
      this.editClassPlanModal = true
      this.$nextTick(() => {
        this.$refs.planModalForm.setFormValue(classInfo, record, 'edit')
      })
    },
    saveClassPlan() {
      let { setTableloadArr, $notification } = this
      let planModalForm = this.$refs.planModalForm
      planModalForm
        .validateData()
        .then(() => {
          this.classPlanModalLoading = true
          let params = planModalForm.getFormData()
          return editAddClassPlan(params)
        })
        .then(res => {
          setTableloadArr()
          $notification['success']({
            message: '系统通知',
            description: '已成功添加'
          })
          this.classPlanModalLoading = false
          this.editClassPlanModal = false
        })
        .catch(err => {
          this.classPlanModalLoading = false
        })
    },
    deleteClassPlan(record) {
      let { planId } = record
      let { setTableloadArr, $notification } = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeClassPlan(planId).then(res => {
            $notification['success']({
              message: '系统通知',
              description: '操作成功！'
            })
            setTableloadArr()
          })
        },
        onCancel() {}
      })
    },
    showSignRecord(record) {
      // const { studentSignOptions } = this
      const { planId, classId, typeId } = record
      // studentSignOptions.danceplanId = planId
      // studentSignOptions.classId = classId
      // studentSignOptions.typeId = typeId
      // this.$nextTick(() => {
      //   this.$refs.signInReport.open()
      // })

      this.classIdReport = record.classId
      this.planIdReport = record.planId
      this.typeIdReport = record.typeId
      this.visibleSignRecord = true
    },
    refreshStu(planId) {
      this.setTableloadArr()
      this.setStudentObj(planId)
    },
    refreshTea(planId) {
      this.teacherSignModal = false
      this.setTableloadArr()
      this.setTeacherObj(planId)
    }
  }
}
</script>

<style scope lang="less" type="text/less">
.today-course-table-wrapper {
  .table-wrapper {
    .teacherIsSign {
      border: 1px solid #52c41a;
      border-radius: 4px;
      padding: 2px;
      color: #52c41a;
    }
  }
}
.image_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .info {
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 20px;
  }
}
.calculator {
  width: 70px !important;
  /deep/ .ant-select-selection {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
.minute {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  margin-left: -1px !important;
}
.classTime {
  .classTimeItem {
    display: flex;
    line-height: 30px;
    .title {
      width: 120px;
      text-align: right;
    }
  }
}
</style>
