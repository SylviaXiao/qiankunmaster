<template>
  <div class="classinfo-plan-wrapper">
    <div class="table-wrapper">
      <a-tabs defaultActiveKey="1" tabPosition="left" type="card" @change="handleTabsChange">
        <a-tab-pane tab="今日" key="1" :forceRender="true">
          <div class="btn-wrapper">
            <perm-box v-if="!isGraduate" perm="education:plan:save && education:class-online:view">
              <a-button icon="plus-circle" type="primary" @click="addClassPlan()">新增</a-button>
            </perm-box>
          </div>
          <todaycourse-table
            port-type="C"
            :params="{ classId }"
            :class-info="classInfo"
            ref="todaycourseTableC"
          ></todaycourse-table>
        </a-tab-pane>
        <a-tab-pane tab="未上课" key="2" :forceRender="true">
          <div class="btn-wrapper">
            <perm-box v-if="!isGraduate" perm="education:plan:save && education:class-online:view">
              <a-button icon="plus-circle" type="primary" @click="addClassPlan()">新增</a-button>
            </perm-box>
          </div>
          <todaycourse-table
            port-type="D"
            :params="{ classId }"
            :class-info="classInfo"
            ref="todaycourseTableD"
          ></todaycourse-table>
        </a-tab-pane>
        <a-tab-pane tab="已上课" key="3" :forceRender="true">
          <s-table ref="tableY" size="default" :columns="columnsY" :data="loadYData" rowKey="planId">
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
            <span slot="duration" slot-scope="text, record">
              <a-tooltip>
                <template slot="title">签到计次:{{ record.signCount || '' }}</template>
                <a-icon type="question-circle" />
              </a-tooltip>
              {{ text }}
            </span>
            <span slot="action" slot-scope="text, record">
              <perm-box v-if="!isGraduate" perm="student:signinlog:delete && education:class-online:view">
                <a href="#" @click="deleteClassPlan(record)">删除</a>
              </perm-box>
              <perm-box perm="student:signinlog:signup && education:class-online:view" v-if="record.status !== 'A'">
                <a href="#" @click="signInView(record)">补签</a>
              </perm-box>
              <perm-box
                v-if="!isGraduate && record.status !== 'A'"
                perm="education:plan:signcount && education:class-online:view"
              >
                <a href="#" @click="signCountOpen(record)">变更计次</a>
              </perm-box>
              <perm-box
                v-if="!isGraduate && record.status !== 'A'"
                perm="education:plan:saltype && education:class-online:view"
              >
                <a href="#" @click="salTypeOpen(record)">变更薪酬</a>
              </perm-box>
            </span>
          </s-table>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- modal -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      :title="title"
      :visible="visible"
      @ok="handleAddEditOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <class-info-plan-modalform :classTypeId="classInfo.eduType.id" ref="planModalForm"></class-info-plan-modalform>
    </a-modal>
    <!-- 签到modal层 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :footer="null"
      :width="modalWidth"
      :title="titleS"
      :visible="visibleS"
      class="sign-modal"
      @cancel="handleCancelS"
    >
      <SignInTea
        v-if="signInSwitch === 'teacher'"
        ref="SignInTea"
        :tea-record="record"
        :teaSigninLog="classTeaList"
        @signinTea="signInTea"
        :modalIsOpen="visibleS"
      ></SignInTea>
      <SignInStu
        v-if="signInSwitch === 'student'"
        ref="signInStu"
        :record="record"
        :danceplanId="planIdReport"
        :classId="classIdReport"
        :type="typeIdReport"
        :planId="record.planId"
        :classStuListProps="classStuList"
        @signInStu="signInStu"
      ></SignInStu>
    </a-modal>
    <!-- 查看签到modal层 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :footer="null"
      :width="600"
      :title="titleV"
      :visible="visibleV"
      @cancel="handleCancelV"
    >
      <SignInView
        ref="signIn"
        :planId="planId"
        :record="signinViewRecord"
        :isConventionClass="isConventionClass"
        :classTeaListProps="classTeaViewList"
        :isOnline="true"
        @refreshTeaList="loadTeacherData(planId)"
        @refreshStuList="loadStuList(planId)"
        :classStuListProps="classStuViewList"
      ></SignInView>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :footer="null"
      :width="1200"
      title="签到记录"
      @cancel="handleCancelSignRecord"
      :visible="visibleSignRecord"
    >
      <div style="width: 100%;height: 500px;overflow-y:scroll">
        <f-frame
          :src="`/report?name=student_class_signinlog&danceplanId=${planIdReport}&classId=${classIdReport}`"
        ></f-frame>
      </div>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="变更签到计次"
      @ok="signCountSubmit"
      @cancel="signCountClose"
      :visible="signCountVisible"
    >
      <div class="sign_count_wrapper">
        <div class="label">签到计次：</div>
        <div class="text">{{ signCountRecord.signCount }}</div>
      </div>
      <div class="sign_count_wrapper">
        <div class="label">变更计次：</div>
        <div class="text">
          <a-input-number v-model="signCount" palceholder="请输入变更计次" />
        </div>
      </div>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="变更薪酬类型"
      @ok="salTypeSubmit"
      @cancel="salTypeClose"
      :visible="salTypeVisible"
    >
      <div class="sign_count_wrapper">
        <div class="label">薪酬类型：</div>
        <div class="text">
          <a-select
            allowClear
            placeholder="请选择薪酬类型"
            @change="salTypeSelectHandle"
            :value="salTypeId"
            style="width: 200px"
          >
            <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in saleryTypeList" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
    <!-- <SignInReport
      :danceplanId="planIdReport"
      :classId="classIdReport"
    :type="typeIdReport" ref="signInReport"></SignInReport>-->
  </div>
</template>
<script>
import ClassInfoPlanModalform from './classInfoPlanOnLineModalform'
import SignInReport from './signInReport'
import { getClassPlanList, removeClassPlan, editAddClassPlan, getClassStuList } from '@/api/education'
import { getStuSignInList, getTeaSignInList } from '@/api/reception/todayplan'
import { getListDayPlan, signCountEduDancePlan, salTypeEduDancePlan } from '@/api/recep'
import TodaycourseTable from '@/components/TodayCourseTable'

import { classPlanColumnsN, classPlanColumnsY, classPlanColumnsT } from '@/utils/education/classInfo'
import { salTypeListById } from '@/api/common'
import { STable, SignInView, SignInTea, SignInStu } from '@/components'
import PermBox from '@/components/PermBox'
import moment from 'moment'

export default {
  mounted() {
    console.log(this.classInfo)
  },
  data() {
    return {
      //签到记录组件的传值
      planIdReport: '',
      classIdReport: '',
      typeIdReport: '',
      //modal singnInView
      titleV: '',
      visibleV: false,
      //modal signIn
      record: null,
      titleS: '',
      visibleS: false,
      planId: null,
      classStuList: [],
      classStuViewList: [],
      classTeaList: {},
      classTeaViewList: [],
      signInSwitch: '',
      //modal  data
      title: '',
      visible: false,
      confirmLoading: false,
      //table  data
      columnsN: classPlanColumnsN,
      columnsT: classPlanColumnsT,
      columnsY: classPlanColumnsY,
      queryParam: {},
      loadYData: this.loadYDataFn(),
      loadNData: this.loadNDataFn(),
      loadTData: [],
      modalWidth: 800,
      signinViewRecord: null,
      // 签到记录
      visibleSignRecord: false,

      //签到计次
      signCountVisible: false,
      signCountRecord: {},
      signCount: 0,

      //变更薪酬
      salTypeVisible: false,
      salTypeId: '',
      saleryTypeList: []
    }
  },
  created() {
    this.loadTDataFn()
  },
  props: {
    classInfo: Object,
    classId: String,
    isGraduate: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    classId(nv, ov) {
      if (nv !== ov) {
        this.refreshTableN()
      }
    },
    visible(nv) {
      if (nv === false) {
        this.$refs.planModalForm.resetForm()
      } else {
      }
    },
    visibleS(nv) {
      //关闭弹窗时清空之前表单,打开弹窗时运行refresh方法
      if (!nv) {
        this.$nextTick(() => {
          if (this.signInSwitch === 'teacher') {
            // this.$refs.SignInTea.resetTeaForm()
          }
          if (this.signInSwitch === 'student') {
            this.$refs.signInStu.resetStuForm()
            this.$refs.signInStu.initModal()
          }
        })
      } else {
        if (this.signInSwitch === 'teacher') {
          this.modalWidth = 800
        }
        if (this.signInSwitch === 'student') {
          this.modalWidth = '1100px'
        }
      }
    }
  },
  computed: {
    isConventionClass() {
      return this.classInfo.isGeneral || false
    }
  },
  methods: {
    handleTabsChange(e) {
      this.tabKey = e
      if (e == 1) {
        this.$refs.todaycourseTableC.setTableloadArr()
      }
      if (e == 2) {
        this.$refs.todaycourseTableD.setTableloadArr()
      }
      if (e == 3) {
        this.$refs.tableY.refresh()
      }
    },
    //变更薪酬类型
    salTypeOpen(record) {
      console.log(record)
      this.dancePlanId = record.planId
      this.salTypeVisible = true
      this.signCountRecord = record
      this.salTypeId = record.salTypeId
      this.initSalType(record.eduTypeId)
    },
    salTypeClose() {
      this.salTypeVisible = false
    },
    salTypeSelectHandle(e) {
      this.salTypeId = e
    },
    initSalType(id) {
      return salTypeListById({ eduTypeId: id }).then(res => {
        this.saleryTypeList = res.data
      })
    },
    salTypeSubmit() {
      const { dancePlanId, salTypeId } = this
      const params = {
        dancePlanId,
        salTypeId
      }
      salTypeEduDancePlan(params).then(res => {
        console.log(res)
        this.refreshYTable()
        this.salTypeClose()
        this.$notification['success']({
          message: '系统通知',
          description: res.msg
        })
      })
    },
    //变更签到计次
    signCountOpen(record) {
      console.log(record)
      this.dancePlanId = record.planId
      this.signCountVisible = true
      this.signCountRecord = record
      this.signCount = record.signCount
    },
    signCountClose() {
      this.signCountVisible = false
    },
    signCountSubmit() {
      const { dancePlanId, signCount } = this
      const params = {
        dancePlanId,
        signCount
      }
      signCountEduDancePlan(params).then(res => {
        console.log(res)
        this.refreshYTable()
        this.signCountClose()
        this.$notification['success']({
          message: '系统通知',
          description: res.msg
        })
      })
    },
    //签到记录
    handleCancelSignRecord() {
      this.visibleSignRecord = false
    },
    showSignRecord(record) {
      this.classIdReport = record.classId
      this.planIdReport = record.planId
      this.typeIdReport = record.typeId
      // this.$nextTick(() => {
      //   this.$refs.signInReport.open()
      // })
      this.visibleSignRecord = true
    },
    //学生签到成功
    signInStu() {
      this.$emit('signInStu')
      this.refreshTableAll()
    },
    //导师签到成功
    signInTea() {
      this.$emit('signInTea')
      this.refreshTableAll()
    },

    changeStyle(record) {
      let className = ''
      if (record.conflict) {
        className = 'conflict-table'
      }
      return className
    },
    // 签到组件
    handleCancelS() {
      if (this.signInSwitch === 'student') {
        this.$refs.signInStu.isSignin().then(() => {
          this.visibleS = false
        })
      } else {
        this.visibleS = false
      }
    },
    handleCancelV() {
      this.visibleV = false
    },
    handleCancel() {
      this.visible = false
    },
    handleAddEditOk() {
      let planModalForm = this.$refs.planModalForm
      //通过数据验证
      planModalForm
        .validateData()
        .then(() => {
          this.confirmLoading = true
          //拿正确的数据
          let params = planModalForm.getFormData()
          //请求接口
          return editAddClassPlan(params)
        })
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '已成功添加'
          })
          this.confirmLoading = false
          this.visible = false
          //刷新表格
          this.refreshTableAll()
          //弹出成功提醒
        })
        .catch(err => {
          this.confirmLoading = false
        })
    },
    addClassPlan() {
      this.title = '添加'
      this.visible = true
      const { classInfo } = this
      let salTypeId = classInfo.salType && classInfo.salType.id
      this.$nextTick(() => {
        this.$refs.planModalForm.setFormValue(classInfo, salTypeId, 'add')
      })
    },
    editClassPlan(record) {
      this.title = '修改'
      this.visible = true
      const { classInfo } = this
      this.$nextTick(() => {
        this.$refs.planModalForm.setFormValue(classInfo, record, 'edit')
      })
      console.log(record)
    },
    signInClassPlan(record, type) {
      var signInTitle = ''
      //获取学生列表数据
      if (type === 'student') {
        this.classIdReport = record.classId
        this.planIdReport = record.planId
        this.typeIdReport = record.typeId
        this.loadStuList(record.planId)
        signInTitle = '学生签到 : '
      }
      //获取导师数据
      if (type === 'teacher') {
        this.loadTeacherData(record.planId)
        signInTitle = '导师签到 : '
      }
      //弹出框标题
      signInTitle += `${record.roomName} ${record.startDate.split(' ')[1].substr(0, 5)}-${record.endDate
        .split(' ')[1]
        .substr(0, 5)}`
      this.titleS = signInTitle
      this.visibleS = true
      this.planId = record.planId
      this.signInSwitch = type
      this.record = record
    },
    signInView(record) {
      this.signinViewRecord = record

      this.loadStuList(record.planId)
      this.loadTeacherData(record.planId)
      this.titleV = '补签'
      this.visibleV = true
      this.planId = record.planId
      this.record = record
    },
    loadStuList(planId) {
      console.log('shuax1')
      let params = { dancePlanId: planId }
      getStuSignInList(params)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.classStuList = res.data
            this.classStuViewList = res.data
          }
        })
        .catch(res => {
          console.error(res)
        })
    },
    loadTeacherData(planId) {
      let params = { dancePlanId: planId }
      getTeaSignInList(params)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.classTeaList = res.data
            this.classTeaViewList = [res.data]
          }
        })
        .catch(res => {
          console.error(res)
        })
    },
    deleteClassPlan(record) {
      this.planId = record.planId
      this.confirm(record)
    },
    confirm() {
      let { planId } = this
      let self = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return removeClassPlan(planId)
            .then(res => {
              if (res.code === 200) {
                self.refreshTable()
              }
            })
            .catch(() => {})
        },
        onCancel() {}
      })
    },
    loadYDataFn() {
      return parameter => {
        return getClassPlanList(Object.assign(parameter, this.queryParam, { status: 'Y' }), this.classId).then(res => {
          if (res.code === 200) {
            res.data.forEach(item => {
              if (item.startDate) {
                item.duration = `${this.$tools.tailor.getTime(item.startDate)}-${this.$tools.tailor.getTime(
                  item.endDate
                )}`
              }
            })
            return res
          }
        })
      }
    },
    loadNDataFn() {
      return parameter => {
        return getClassPlanList(Object.assign(parameter, this.queryParam, { status: 'N' }), this.classId).then(res => {
          if (res.code === 200) {
            res.data.forEach(item => {
              if (item.startDate) {
                // item.duration = `${item.startDate.substr(11, 5)}-${item.endDate.substr(11, 5)}`
                item.duration = `${this.$tools.tailor.getTime(item.startDate)}-${this.$tools.tailor.getTime(
                  item.endDate
                )}`
              }
            })
            return res
          }
        })
      }
    },
    loadTDataFn() {
      // return (parameter) => {
      // this.queryParam.day= moment().subtract(0, 'days').format('YYYY-MM-DD')
      this.queryParam.classId = this.classId
      return getListDayPlan(
        moment()
          .subtract(0, 'days')
          .format('YYYY-MM-DD'),
        this.queryParam
      ).then(res => {
        if (res.code === 200) {
          res.data.forEach(item => {
            if (item.startDate) {
              // item.duration = `${item.startDate.substr(11, 5)}-${item.endDate.substr(11, 5)}`
              item.duration = `${this.$tools.tailor.getTime(item.startDate)}-${this.$tools.tailor.getTime(
                item.endDate
              )}`
            }
          })
          this.loadTData = res.data
          // return res
        }
      })
      // }
    },
    refreshTable() {
      if (this.tabKey == 2) {
        this.$refs.tableN.refresh()
      }
      if (this.tabKey == 3) {
        this.$refs.tableY.refresh()
      }
    },
    refreshYTable() {
      this.$refs.tableY.refresh()
    },
    refreshTableAll() {
      this.$refs.todaycourseTableC.setTableloadArr()
      this.$refs.todaycourseTableD.setTableloadArr()
      this.$refs.tableN.refresh()
      this.$refs.tableY.refresh()
    }
  },
  components: {
    SignInReport,
    SignInStu,
    SignInTea,
    SignInView,
    STable,
    PermBox,
    ClassInfoPlanModalform,
    TodaycourseTable
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/btn';
.sign_count_wrapper {
  width: 400px;
  height: 60px;
  display: flex;
  align-items: center;
  .label {
    width: 200px;
    text-align: right;
  }
  .text {
    width: 200px;
  }
}
.classinfo-plan-wrapper {
  .btn-wrapper {
    margin-bottom: 20px;
  }
}
</style>
