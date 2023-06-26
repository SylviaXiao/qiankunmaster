<template>
  <div class="today-course-table-wrapper">
    <div class="table-wrapper">
      <STable
        :showSlider="true"
        ref="planTable"
        :columns="defaultColumns"
        :rowSelection="enableSelections ? rowSelection : null"
        :rowKey="record => record.planId"
        :loading="tableValueLoad"
        :data="loadData"
        :scroll="{ x: true }"
      >
        <span slot="duration" slot-scope="text, record">
          <a-tooltip>
            <template slot="title">
              <div style="font-size:12px;">学员签到计次: {{ record.signCount || '' }}</div>
              <div style="font-size:12px;">老师签到计次: {{ record.teaSignCount || '' }}</div>
              <div style="font-size:12px;">上课时长: {{ record.attendClassDuration || '' }}分钟</div>
            </template>
            <a-icon type="question-circle" />
          </a-tooltip>
          {{ `${$tools.tailor.getTime(record.startDate)} ~ ${$tools.tailor.getTime(record.endDate)}` }}
          <a-tag v-if="(record.signTeachers && record.signTeachers.length > 0) || record.substituteTeacher">签</a-tag>
          <perm-box perm="education:plan:abnormal">
            <a-tag v-if="record.abnormalStatus === 'Y'" color="#d9001b" class="pointer" @click.native="openAbnormalModal(record)">异常</a-tag>
          </perm-box>
        </span>
        <span slot="stuLogCount" slot-scope="text, record">
          {{ record.stuLogCount }}/{{ record.actualMembers || 0 }}/{{ record.studentCount ? record.studentCount : '不限' }}
        </span>
        <span slot="teachers" slot-scope="text, record" style="display: flex;flex-flow: nowrap row;align-items: center;">
          <a href="javascript:;" :style="record.signTeachers && record.signTeachers.length > 0 ? 'color:#000;cursor:auto;' : ''" @click="changeTeacher(record)">
            <span :key="idx" v-for="(item, idx) in record.teachers">
              <span v-if="idx != 0">, </span>
              <span>
                <span>
                  {{ item.teacherName }}
                </span>
              </span>
            </span>
          </a>
        </span>
        <span slot="signTeachers" slot-scope="text, record" style="display: flex;flex-flow: nowrap row;align-items: center;">
          <template v-if="record.signTeachers && record.signTeachers.length">
            <span :key="idx" v-for="(item, idx) in record.signTeachers || []">
              <span v-if="idx != 0"> ， </span>
              <span>
                <template v-if='item.teacherStatus==="B"'>
                  <span>
                  </span>
                   <a-tooltip>
                    <template slot="title">
                      <div style="font-size:12px;">扣费: {{ item.deductSalary ||'' }}</div>
                    </template>
                    <span style='color:#7805F2;cursor: pointer;'>{{ item.signName }}</span>
                  </a-tooltip>
                </template>
                <template v-else>
                  <span>
                   {{ item.signName }}
                  </span>
                </template>
              </span>
            </span>
          </template>
          <template>
            <span v-if="(!record.signTeachers || !record.signTeachers.length) && record.substituteTeacher">
              {{ record.substituteTeacher.name || '' }}
            </span>
          </template>
        </span>
        <span slot="signDances" slot-scope="text, record" class="flex align-center">
          <template v-if="record.signTeachers && record.signTeachers.length > 0">
              {{ getSignDances(record) }}
          </template>
        </span>
        <span slot="className" slot-scope="text, record">
          <perm-box :text="text" perm="education:class:view">
            <router-link :to="{ path: `/reception/class/classInfo/${record.classId}` }">{{ text }}</router-link>
          </perm-box>
        </span>
        <span slot="clashType" slot-scope="text, record">
          <!--          <div v-if="text&&text.includes('0')">无冲突</div>-->
          <!--          <div v-if="text&&text.includes('1')" style="color: red">教室冲突</div>-->
          <!--          <div v-if="text&&text.includes('2')" style="color: red">时间冲突</div>-->
          <!--          <div v-if="text&&text.includes('3')" style="color: red">导师冲突</div>-->
          <div v-if="text" style="color: red;cursr:pointer;" @click="editClassPlan(record)">{{ text }}</div>
        </span>
        <span slot="classSplit" slot-scope="text, record">
          <div v-for="(item, index) in text">
            <span>{{ item.name }}</span>
            <span v-if="item.ratio">{{ item.ratio }}%</span>
          </div>
        </span>
        <span slot="action" slot-scope="text, record" v-if="record.isOnline || (classInfo && classInfo.isOnline && record.isOnlinePersonal)">
          <perm-box v-if="record.classState != 'C' && record.classState != 'D'" perm="education:signinlog:sign && education:class-online:view">
            <a href="javascript:;" @click="teacherSign(record)">导师签到</a>
          </perm-box>
          <perm-box
            v-if="record.classState != 'C' && record.classState != 'D' && record.isOnlinePersonal"
            perm="student:signinlog:sign || student:signinlog:view"
          >
            <a href="javascript:;" @click="studentSign(record)">学生签到</a>
          </perm-box>
        </span>
        <span slot="action" slot-scope="text, record" v-else>
          <perm-box v-if="record.classState != 'C' && record.classState != 'D'" perm="education:signinlog:sign">
            <a href="javascript:;" @click="teacherSign(record)">导师签到</a>
          </perm-box>
          <perm-box v-if="record.classState != 'C' && record.classState != 'D'" perm="student:signinlog:sign || student:signinlog:view">
            <a href="javascript:;" @click="studentSign(record)">学生签到</a>
            <a href="javascript:;" @click="qrcodeHandle(record)">扫一扫签到</a>
          </perm-box>
          <perm-box perm="student:signinlog:view">
            <a href="#" @click="showSignRecord(record)">签到记录</a>
          </perm-box>
          <perm-box perm="education:plan:abnormal">
            <a href="#" v-if="record.abnormalMapList === 'Y'" style="color:#d9001b;" @click="openAbnormalModal(record)">异常记录</a>
          </perm-box>

        </span>
      </STable>
    </div>

    <!--  老师签到  -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :footer="null"
      :width="1200"
      :title="`导师签到 ${classBaseInfo}`"
      v-model="teacherSignModal"
      @cancel="teacherSignCancel"
    >
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
            <a-input style="width:50px; text-align=center;" v-model="actualMembers" />
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
        :eduTypeId="eduTypeId"
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
      <class-info-plan-modalform :classTypeId="classInfo && classInfo.eduType ? classInfo.eduType.id : null" ref="planModalForm"> </class-info-plan-modalform>
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
      <div style="position: relative" v-if="visibleSignRecord">
        <f-frame fType="signinlog" :src="`/report?name=student_class_signinlog&danceplanId=${planIdReport}&classId=${classIdReport}`"></f-frame>
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
    <!-- 老师选择组件 -->
    <choose-tea ref="choosetea" :checkType="true" teaFields="teacher" @getBackData="getTeaData"> </choose-tea>
    <!-- 异常列表 -->
    <AbnormalList ref="abnormalList" @allSolved="refreshTable" />
  </div>
</template>

<script>
import moment from 'moment'
import { STable, PermBox } from '@/components'
import SignInTea from '@/components/SignInTea'
import SignInStu from '@/components/SignInStu/SignInStu1'
import { getTodayPlanList, getTeaSignInList, getStuSignInList, actualMembers, updateClassTeacher } from '@/api/reception/todayplan'
import { removeClassPlan, editAddClassPlan, getClassPlanList, getClassInfo } from '@/api/education'
import { pageDayPlan } from '@/api/recep'
import ClassInfoPlanModalform from '@/views/education/modules/classInfoPlanModalform'
import SignInReport from '@/views/education/modules/signInReport'
import ChooseTea from '@/components/ChooseTea'
import AbnormalList from './AbnormalList.vue'
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
    width: 160,
    scopedSlots: { customRender: 'duration' },
    fixed: 'left'
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    width: 200,
    scopedSlots: { customRender: 'className' },
    fixed: 'left'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName',
    width: 80
  },
  {
    title: '上课导师',
    dataIndex: 'teachers',
    key: 'teachers',
    scopedSlots: { customRender: 'teachers' },
    width: 140
  },
  {
    title: '签到导师',
    dataIndex: 'signTeachers',
    key: 'signTeachers',
    scopedSlots: { customRender: 'signTeachers' },
    width: 140
  },
  {
    title: '签到导师舞种',
    scopedSlots: { customRender: 'signDances' },
    width: 140
  },
  {
    title: '顾问',
    dataIndex: 'masterName',
    key: 'masterName',
    width: 120
  },
  {
    title: '排课分馆',
    dataIndex: 'roomSchoolName',
    key: 'roomSchoolName',
    width: 120
  },
  {
    title: '成本分摊',
    dataIndex: 'classSplit',
    key: 'classSplit',
    width: 120,
    scopedSlots: { customRender: 'classSplit' }
  },
  {
    title: '教室',
    dataIndex: 'roomName',
    key: 'roomName',
    width: 130
  },
  {
    title: '已签/上课数/总数',
    dataIndex: 'stuLogCount',
    scopedSlots: { customRender: 'stuLogCount' },
    key: 'stuLogCount',
    width: 130
  },
  {
    title: '是否冲突',
    dataIndex: 'clashType',
    scopedSlots: { customRender: 'clashType' },
    key: 'clashType',
    width: 130
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

export default {
  name: 'TodayCourseTablePage',
  props: {
    height: {
      type: Number,
      default: 400
    },
    params: {
      type: Object,
      default: () => {}
    },
    classInfo: {
      type: Object,
      default: () => {}
    },
    missClass: {
      type: Boolean,
      default: false
    },
    batchSignIn: {
      type: Boolean,
      default: false
    }
  },
  components: {
    PermBox,
    SignInTea,
    SignInStu,
    ClassInfoPlanModalform,
    STable,
    SignInReport,
    ChooseTea,
    AbnormalList
  },
  computed: {
    isAdmin() {
      return this.$store.getters.userInfo.perms.includes('*')
    },
    enableSelections() {
      return this.missClass || this.batchSignIn
    },
    hasSignStu() {
      return this.studentList.filter(item => item.signed === 'Y').length
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
          if (this.missClass) {
            // 学生或者老师只要有签到就不能删除
            disabled = !!record.stuLogCount || ((record.signTeachers?.length > 0) || record.substituteTeacher)
          } else if (this.batchSignIn) {
            if (record.roomSchoolName == '武汉网课组') {
              disabled = (record.signTeachers?.length > 0) || (record.teachers?.length > 1)
            } else {
              disabled = ((record.signTeachers?.length > 0) || (record.teachers?.length > 1)) || !record.actualMembers
            }
          }
          return {
            props: {
              disabled
            }
          }
        }
      }
    }
  },
  data() {
    return {
      changeTeacherInfo: {},
      // 学生签到actualMembersChangeHandle
      actualMembers: 0,
      defaultColumns,
      // setColumns,
      tableValueLoad: false,
      totalCount: 0,
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
      dateStr: todayStr,
      loadData: parameter => {
        let params = Object.assign({}, this.params, parameter)
        return pageDayPlan(this.dateStr, params).then(res => {
          return res
        })
      },
      eduTypeId: null,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    getTeaData(data, type) {
      let id = data.map(item => {
        return item.teacherId
      })
      let params = {
        id: this.changeTeacherInfo.planId,
        salTypeId: this.changeTeacherInfo.salTypeId,
        teacherIds: id.join(',')
      }
      updateClassTeacher(params).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '系统通知',
            description: res.msg
          })
          this.setTableloadArr(this.dateStr)
        }
      })
    },
    changeTeacher(record) {
      if (record.signTeachers && record.signTeachers.length > 0) return
      this.changeTeacherInfo = record
      this.$refs.choosetea.open()
    },
    teacherSignCancel() {
      this.$refs.SignInTea.resetForm()
    },
    // actualMembersSubmit
    actualMembersSubmit() {
      const params = {
        nums: this.actualMembers
      }
      actualMembers(params, this.planIdLocal).then(() => {
        this.setTableloadArr(this.dateStr)
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
    setTableloadArr(str = todayStr, queryParams) {
      queryParams ? (this.params = Object.assign({}, queryParams)) : ''
      this.dateStr = str
      this.$refs.planTable.refresh()
    },
    clearSelectedRows() {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    refreshTable() {
      this.$refs.planTable.refresh()
    },
    // 校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve(this.selectedRowKeys, this.selectedRows)
        }
      })
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
      if (!this.isAdmin && !(record.actualMembers > 0) && record.roomSchoolName != '武汉网课组') {
        this.$notification['warning']({
          message: '提示',
          description: '当前上课数为0不允许导师签到，请先在学生签到页面填写实际人数',
          duration: null
        })
        return
      }

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
      const { planId, classId, typeId, actualMembers, eduTypeId } = record
      this.eduTypeId = eduTypeId
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
      getClassInfo(record.classId).then(res => {
        if (res.code === 200 && res.data) {
          let classInfo = res.data
          this.editClassPlanModal = true
          this.$nextTick(() => {
            this.$refs.planModalForm.setFormValue(classInfo, record, 'edit', record.clash)
          })
        }
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
          setTableloadArr(this.dateStr)
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
            setTableloadArr(this.dateStr)
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
      this.setTableloadArr(this.dateStr)
      this.setStudentObj(planId)
    },
    refreshTea(planId) {
      this.teacherSignModal = false
      this.setTableloadArr(this.dateStr)
      this.setTeacherObj(planId)
    },
    // 查看反馈异常
    openAbnormalModal(record) {
      this.$refs.abnormalList.open(record)
    },
    // 签到舞种
    getSignDances(record) {
      let signDances = record.signTeachers.map(item => {
        return item.danceName
      })
      return signDances.join('，')
    }
  }
}
</script>

<style scope lang="less">
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
</style>
