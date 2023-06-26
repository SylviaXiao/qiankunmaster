<template>
  <div class="signin-stu-wrapper">
    <a-tabs :defaultActiveKey="defaultActiveKey" :activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="photoSignin">
        <span slot="tab"><a-icon type="camera" />拍照签到</span>
        <PhotoSignin
          :finallyStudentArr="finallyStudentArr"
          :finallySelectStudentArr="finallySelectStudentArr"
          ref="photoSignin"
          :signsedStuCount="signsedStuCount"
          :dancePlanId="dancePlanId"
          @check="studentCheck"
        >
        </PhotoSignin>
      </a-tab-pane>
      <a-tab-pane key="tableSignin">
        <span slot="tab"><a-icon type="table" />表格签到</span>
        <TableSignin
          :finallyStudentArr="finallyStudentArr"
          :finallySelectStudentArr="finallySelectStudentArr"
          ref="tableSignin"
          @refresh="refreshSignStuList"
          @check="studentCheck"
          @selectAll="selectAll"
        >
        </TableSignin>
      </a-tab-pane>
      <a-tab-pane key="signInReport">
        <span slot="tab"><a-icon type="file-done" />签到记录</span>
        <div style="width: 100%;height: 100%;">
          <f-frame fType="signinlog" :src="`/report?name=student_class_signinlog&danceplanId=${dancePlanId}&classId=${classId}`"></f-frame>
        </div>
      </a-tab-pane>
      <a-tab-pane key="replenishesPlan">
        <span slot="tab"><a-icon type="user-add" />学员补课</span>
        <perm-box perm="education:class:replenishes:save" text="无权访问">
          <replenishes-plan ref="replenishesPlan" :dancePlanId="dancePlanId" :record="record" :eduTypeId="eduTypeId"></replenishes-plan>
        </perm-box>
      </a-tab-pane>
      <a-tab-pane key="auditionLog">
        <span slot="tab"><a-icon type="solution" />体验试课</span>
        <perm-box perm="student:auditionlog:view" text="无权访问">
          <audition-log ref="auditionLog" :dancePlanId="dancePlanId"></audition-log>
        </perm-box>
      </a-tab-pane>
    </a-tabs>
    <perm-box perm="student:signinlog:sign" v-if="activeKey == 'photoSignin' || activeKey == 'tableSignin'">
      <div class="btn-content">
        <a-divider style="margin: 10px 0;"></a-divider>
        <div class="student-signin-btn">
          <div class="search-student-add" v-if="isConventionClass">
            <a-input placeholder="输入手机号或学号或卡号" v-model="addStudentValue" />
            <a-button @click="addStudentByNum" :loading="addBtnLoading">添加</a-button>
          </div>
          <div class="select-all">
            <a-checkbox :checked="selectAllChecked" @change="selectAll">全选</a-checkbox>
          </div>
          <div class="check-signin">
            <perm-box perm="student:signinlog:sign">
              <a-button type="primary" :loading="signinLoading" @click="submitStudentSignIn">提交签到</a-button>
            </perm-box>
          </div>
        </div>
      </div>
    </perm-box>
  </div>
</template>

<script>
import PhotoSignin from './modules/PhotoSignin'
import TableSignin from './modules/TableSignin'
import SignInReport from '@/views/education/modules/signInReport'
import ReplenishesPlan from './modules/ReplenishesPlan'
import AuditionLog from './modules/AuditionLog'
import PermBox from '@/components/PermBox'
import tools from './modules/tools'
import { SignInStuList } from '@/api/reception/todayplan'
import { saveStuSignInLog } from '@/api/student'

const { isOverTimes, isOverdue } = tools
//默认选择的值以及打开modal后重置的值
const defaultActiveKey = 'photoSignin'

export default {
  name: 'SignInStu1',
  props: {
    dancePlanId: { type: String, default: null },
    classId: { type: String, default: null },
    type: { type: String, default: null },
    modalIsOpen: { type: Boolean, default: false },
    record: {
      type: Object,
      default: () => {}
    },
    classStuListProps: {
      type: Array,
      default: () => []
    },
    eduTypeId: {
      type: String,
      default: ''
    }
  },
  mounted() {
    console.log(this.eduTypeId)
  },
  components: {
    SignInReport,
    ReplenishesPlan,
    AuditionLog,
    TableSignin,
    PhotoSignin,
    PermBox
  },
  watch: {
    modalIsOpen(nv, ov) {
      const { classStuListProps, setStuSigned, resetSigninStu } = this
      this.activeKey = defaultActiveKey
      nv && !!classStuListProps ? setStuSigned(classStuListProps) : resetSigninStu()
    },
    classStuListProps(nv, ov) {
      const { classStuListProps, setStuSigned, resetSigninStu } = this
      nv && !!classStuListProps ? setStuSigned(classStuListProps) : resetSigninStu()
    }
  },
  data() {
    return {
      defaultActiveKey,
      //tabs绑定的值 activeKey
      activeKey: defaultActiveKey,
      /*
       * 学生签到信息
       * @params {Array} studentSelectedArr  已签到的学员列表
       * @params {Array} localStudentList    本地获取的学生数据
       * @params {Array} localSelectStudentArr  点击签到未提交保存在本地的数据
       * @params {Boolean} signinLoading  提交签到按钮节流阀
       * @params {Boolean} selectAllChecked  v-model checkbox全选的绑定值
       * @params {Number} addStudentValue  添加学员的手机号码
       * @params {Boolean} addBtnLoading  添加学员按钮节流阀
       * */
      studentSelectedArr: [],
      localStudentList: [],
      localSelectStudentArr: [],
      signinLoading: false,
      selectAllChecked: false,
      addStudentValue: null,
      addBtnLoading: false
    }
  },
  computed: {
    finallyStudentArr() {
      const { classStuListProps, localStudentList } = this
      return classStuListProps.concat(localStudentList).unique()
    },
    finallySelectStudentArr() {
      const { studentSelectedArr, localSelectStudentArr } = this
      // return studentSelectedArr.concat(localSelectStudentArr).unique()
      return localSelectStudentArr.unique()
    },
    //是否常规班
    isConventionClass() {
      const {
        record,
        record: { eduTypeId }
      } = this
      return record && eduTypeId === 'E'
    },
    signsedStuCount() {
      const { classStuListProps, localSelectStudentArr } = this
      let count = 0
      classStuListProps.map(item => {
        if (item.signed === 'Y') {
          count++
        }
      })
      return count
    }
  },
  created() {
    const { classStuListProps, setStuSigned, resetSigninStu } = this
    !!classStuListProps ? setStuSigned(classStuListProps) : resetSigninStu()
  },
  methods: {
    /*
     * 方法说明
     * @methods tabsChange
     * @params {String} activeKey  返回tabs选择的当前页的key
     * key:{
     * photoSignin : 拍照签到
     * tableSignin : 表格签到
     * signInReport : 签到记录
     * replenishesPlan : 学员补课
     * auditionLog : 到访试听
     * }
     * */
    tabsChange(activeKey) {
      this.activeKey = activeKey
      switch (activeKey) {
        case 'replenishesPlan':
          this.$nextTick().then(() => {
            this.$refs.replenishesPlan.getReplenishesPlan()
          })
          break
        case 'auditionLog':
          this.$nextTick().then(() => {
            this.$refs.auditionLog.getAuditionLog()
          })
          break
      }
    },
    /*
     * 方法说明
     * @methods setStuSigned
     * @params {Array} students  获取students里面的学生添加的已签到arr里
     * */
    setStuSigned(students) {
      if (!Array.isArray(students)) return
      this.studentSelectedArr = []
      const { studentSelectedArr, verifyIsCheckAll } = this
      students.map(item => {
        const { signed, stuCardId } = item
        signed && signed === 'Y' && stuCardId && studentSelectedArr.indexOf(stuCardId) == -1 ? studentSelectedArr.push(stuCardId) : ''
      })
      verifyIsCheckAll()
    },
    /*
     * 方法说明
     * @methods  addStudentByNum 通过手机号码添加学生
     * @params {Object}  addStudentValue  学生信息
     * */
    addStudentByNum() {
      const { addStudentValue, dancePlanId, $notification, localStudentList, plusStudent } = this
      if (!!!addStudentValue) return
      this.addBtnLoading = true
      const params = { dancePlanId, stuNo: addStudentValue }
      saveStuSignInLog(params)
        .then(res => {
          const result = res.data
          result && Object.keys(result).length != 0
            ? this.$nextTick().then(() => {
                plusStudent(res.data)
                this.addStudentValue = ''
              })
            : $notification['error']({ message: '错误提示', description: '该学员没有符合该班级的卡' })
        })
        .finally(() => (this.addBtnLoading = false))
    },
    /*
     * 方法说明
     * @methods  studentCheck 点击签到后的操作
     * @params {Object}  student  学生信息
     * */
    studentCheck(student) {
      const { plusSelectStudent } = this
      const { endValidDate, payoff, stuCardId } = student
      this.plusStudent(student)
      if (isOverdue(endValidDate) || isOverTimes(student) || !payoff) return
      stuCardId
        ? plusSelectStudent(stuCardId)
        : this.$nextTick().then(() => {
            this.localSelectStudentArr = student
            this.studentSelectedArr = student
          })
    },
    //判断student列表是否已添加相同的学生并操作
    plusSelectStudent(stuCardId) {
      const { finallySelectStudentArr, verifyIsCheckAll } = this
      if (finallySelectStudentArr.indexOf(stuCardId) == -1) {
        this.$nextTick().then(() => {
          this.studentSelectedArr.push(stuCardId)
          this.localSelectStudentArr.push(stuCardId)
          verifyIsCheckAll()
        })
      } else {
        this.$nextTick().then(() => {
          this.localSelectStudentArr = this.finallySelectStudentArr.filter(i => i !== stuCardId)
          this.studentSelectedArr = this.finallySelectStudentArr.filter(i => i !== stuCardId)
          console.log(2)
          verifyIsCheckAll()
        })
      }
    },
    //添加学生
    plusStudent(student) {
      const { finallyStudentArr, $notification, plusSelectStudent } = this
      const { stuCardId } = student
      this.$nextTick().then(() => {
        const stuCardIdsList = this.finallyStudentArr.map(item => item.stuCardId)
        if (stuCardIdsList.includes(student.stuCardId)) {
          let tempArr = this.localSelectStudentArr
          tempArr.push(student.stuCardId)
          this.localSelectStudentArr = Array.from(new Set(tempArr))
        } else {
          let tempArr = this.localSelectStudentArr
          tempArr.push(student.stuCardId)
          this.localSelectStudentArr = Array.from(new Set(tempArr))
          this.localStudentList.push(student)
        }
      })
    },
    //全选操作
    selectAll(event) {
      const { studentCheck, finallyStudentArr } = this
      this.studentSelectedArr = []
      this.localSelectStudentArr = []
      event.target.checked
        ? this.$nextTick().then(() => {
            finallyStudentArr.map(student => {
              if (student.status !== 'C') {
                studentCheck(student)
              }
            })
            this.selectAllChecked = true
          })
        : (this.selectAllChecked = false)
    },
    /*
     * 方法说明
     * @methods  submitStudentSignIn 提交学院签到
     * @params {Object}  students  选择的学员cardId
     * */
    submitStudentSignIn() {
      const { finallySelectStudentArr, dancePlanId, resetSigninStu, $notification, verifyIsCheckAll, classStuListProps } = this
      const students = { studentCardIds: finallySelectStudentArr.join() }
      this.signinLoading = true
      SignInStuList(students, dancePlanId)
        .then(res => {
          $notification['success']({
            message: '系统通知',
            description: '签到成功!'
          })
          resetSigninStu()
          verifyIsCheckAll()
          this.$emit('refresh', dancePlanId)
        })
        .finally(() => (this.signinLoading = false))
    },
    /*
     * 方法说明
     * @methods  refreshSignStuList 刷新签到学员列表
     * @params {String}  dancePlanId  dancePlanId
     * */
    refreshSignStuList() {
      const { dancePlanId } = this
      this.$emit('refresh', dancePlanId)
    },
    /*
     * 方法说明
     * @methods  isSignin 选择学员但为提交签到的提醒
     * @params {Object}  students  选择的学员cardId
     * */
    isSignin() {
      const { classStuListProps, finallySelectStudentArr, localSelectStudentArr, submitStudentSignIn, $confirm } = this
      return new Promise((resolve, reject) => {
        const signedNo = classStuListProps.filter(item => {
          return item.signed === 'Y'
        }).length
        const selected = localSelectStudentArr.length
        // signedNo == selected
        selected == 0
          ? resolve()
          : $confirm({
              title: '系统提示',
              content: '您还有未提交签到的学员是否关闭?',
              okText: '提交签到',
              cancelText: '仍要关闭',
              onOk() {
                submitStudentSignIn()
              },
              onCancel() {
                resolve()
              }
            })
      })
    },
    //重置数据
    resetSigninStu() {
      this.addStudentValue = null //添加的手机号码清空
      this.studentSelectedArr = []
      this.localSelectStudentArr = []
      this.localStudentList = []
      this.$refs.photoSignin.resetValues()
    },
    verifyIsCheckAll() {
      const { finallyStudentArr, finallySelectStudentArr } = this
      finallyStudentArr.filter(d => d.status !== 'C').length == finallySelectStudentArr.length ? (this.selectAllChecked = true) : (this.selectAllChecked = false)
    }
  }
}
</script>

<style scoped lang="less">
.signin-stu-wrapper {
  position: relative;
  height: 640px;

  .student-signin-btn {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .search-student-add {
      width: 350px;
      display: flex;
      flex-flow: row nowrap;
      border-right: 1px solid #cccccc;

      input {
        width: 250px;
        margin-right: 15px;
      }
    }
    .select-all {
      margin-left: 15px;
    }
  }
  .btn-content {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>
