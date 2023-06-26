<template>
  <div v-if="classInfo" class="base-content-wrapper">
    <div class="student-info-wrapper" v-if="classInfo">
      <a-row type="flex" justify="start" align="top">
        <a-col :span="16">
          <a-row class="infoItem" type="flex" justify="space-between" align="top">
            <a-col :lg="24" :md="24" :sm="24">
              <div class="class-info">
                <span class="info-item-label">班级名称 :</span>
                <span class="info-item-content">{{ classInfo.eduClass.className }}</span>
                <span class="info-item-content" v-if="classInfo.orgDept">【所属分馆 : {{ classInfo.orgDept.deptName }}】</span>
                <span class="info-item-content" :style="{ color: '#ea4444' }">&nbsp;&nbsp;(状态 : {{ classStateStr }})</span>
              </div>
            </a-col>
          </a-row>
          <a-row class="infoItem" type="flex" justify="space-between" align="top">
            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">顾问 :</span>
                <span class="info-item-content">{{
                  classInfo.orgUserMaster ? (classInfo.orgUserMaster.userName ? classInfo.orgUserMaster.userName : '') : ''
                }}</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">上课导师 :</span>
                <span class="info-item-content" v-for="(item, idx) in classInfo.orgUserTeacher">{{ item.teacherName }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">教务负责人 :</span>
                <span class="info-item-content">{{ classInfo.orgUserEducation ? classInfo.orgUserEducation.userName : '' }}</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24" v-if="!classInfo.isPersonal">
              <div class="class-info">
                <span class="info-item-label">助教 :</span>
                <span class="info-item-content">{{ classInfo.orgUserAsTeacherName }}</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">开班时间 :</span>
                <span class="info-item-content">{{ classInfo.eduClass ? classInfo.eduClass.startDate : '' }}</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">预计结业时间 :</span>
                <span class="info-item-content">{{ classInfo.eduClass ? classInfo.eduClass.endDate : '' }}</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">舞种 :</span>
                <span class="info-item-content">{{ classInfo.eduDance ? classInfo.eduDance.name : '' }}</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">类型 :</span>
                <span class="info-item-content">{{ classInfo.eduType ? classInfo.eduType.name : '' }}</span>
              </div>
            </a-col>

            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">班型 :</span>
                <span class="info-item-content">{{ classInfo.eduCardType ? classInfo.eduCardType.name : '' }}</span>
              </div>
            </a-col>

            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">计划课次 :</span>
                <span class="info-item-content">{{ classInfo.eduClass.courseCount }}</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24" v-if="classInfo.salType">
              <div class="class-info">
                <span class="info-item-label">薪酬类型 :</span>
                <span class="info-item-content">{{ classInfo.salType ? classInfo.salType.name : '' }}</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">备注 :</span>
                <span class="info-item-content">{{ classInfo.eduClass ? classInfo.eduClass.classDesc : '' }}</span>
              </div>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <div class="class-info">
                <span class="info-item-label">难度 :</span>
                <span class="info-item-content">{{ classInfo.eduClass ? classInfo.eduClass.diff : '' }}</span>
              </div>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row type="flex" justify="end" align="top" v-if="classInfo.isOnline">
            <perm-box perm="education:class:suspend:edit && education:class-online:view">
              <a href="#" @click="stopClass">{{ isClassStopped ? '复课' : '停课' }}</a>
            </perm-box>
            <perm-box v-if="classInfo.eduClass.state == 'B'" perm="education:class:graduate && education:class-online:view">
              <a-divider type="vertical" />
              <a @click="handleClassState" href="#"> 班级结业</a>
            </perm-box>
            <perm-box v-if="classInfo.eduClass.state == 'C'" perm="education:class:act">
              <a-divider type="vertical" />
              <a @click="handleActClassState" href="#">重新激活</a>
            </perm-box>
          </a-row>
          <a-row type="flex" justify="end" align="top" v-else>
            <perm-box perm="education:class:suspend:edit">
              <a href="#" @click="stopClass">{{ isClassStopped ? '复课' : '停课' }}</a>
            </perm-box>
            <perm-box v-if="classInfo.eduClass.state == 'B'" perm="education:class:graduate">
              <a-divider type="vertical" />
              <a @click="handleClassState" href="#">班级结业</a>
            </perm-box>
            <perm-box v-if="classInfo.eduClass.state == 'C' || classInfo.eduClass.state == 'D'" perm="education:class:act">
              <a-divider type="vertical" />
              <a @click="handleActClassState" href="#">重新激活</a>
            </perm-box>
            <perm-box v-if="classInfo.actualStudents && classInfo.eduClass.state !== 'A'" perm="cer:grading:save">
              <a-divider type="vertical" />
              <a href="#" @click="registerTest">录入考级信息</a>
            </perm-box>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1000"
      :title="isClassStopped ? `班级复课` : `班级停课`"
      v-model="stopClassModal"
      @ok="submitStopClass"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :labelCol="{ span: 4 }" :wrapperCol="{ span: 16 }">
        <template v-if="isClassStopped">
          <a-form-model-item label="停课开始时间">
            <div>{{ currentSuspend.startDate }}</div>
          </a-form-model-item>
          <a-form-model-item label="复课时间" required prop="restartDate">
            <a-date-picker v-model="form.restartDate" :disabledDate="disabledRestartDate" />
          </a-form-model-item>
        </template>
        <template v-else>
          <a-form-model-item label="停课开始时间" required prop="stopDate">
            <a-date-picker v-model="form.stopDate" />
          </a-form-model-item>
        </template>
        <a-form-model-item label="停课原因" required prop="desc">
          <a-textarea v-model="form.desc" style="width: 100%;" placeholder="请输入停课原因" :rows="4" />
        </a-form-model-item>
      </a-form-model>
      <perm-box perm="education:class:suspend:edit">
        <!-- <a-button type="primary" icon="plus-circle" style="margin-bottom: 15px;" :disabled="isEditStopClass" @click="addStopClass">新增停课记录 </a-button> -->
      </perm-box>
      <a-table :columns="stopClassColumns" :dataSource="stopClassList" :pagination="false" rowKey="suspendId">
        <span slot="startEndDate" slot-scope="text, record">
          <span v-if="record.isEdit">
            <a-range-picker :allowClear="false" :disabledDate="disabledDate" v-model="newStopClassDate" />
          </span>
          <span v-else>{{ `${record.startDate} ~ ${record.endDate}` }}</span>
        </span>
        <span slot="desc" slot-scope="text, record">
          <a-input v-if="record.isEdit" v-model="newStopClassDesc" />
          <span v-else>{{ text }}</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <div class="relative flex" style="width: 100%">
            <perm-box perm="education:suspend:view">
              <a-popover title="" trigger="click" placement="bottom">
                <template slot="content">
                  <a-table :columns="innerColumns" :dataSource="innerSuspendList" :pagination="false" :rowKey="(record, index) => index"></a-table>
                </template>
                <a style="margin:0 5px;" @click="listSuspendInfo(record)">延期卡种</a>
              </a-popover>
            </perm-box>
            <!-- <div v-if="record.remove || record.endDate" class="cancel-tag"></div> -->
            <div v-if="(record.remove)" class="ml-20">
              <a-tag>已取消</a-tag>
              <!-- <a class="ml-20"  style="font-size:12px ;color:#bfbfbf">已取消</a> -->
            </div>
            <perm-box v-else perm="education:class:suspend:del">
              <a style="margin:0 5px;" @click="removeStopClass(record)">取消停课</a>
            </perm-box>
          </div>
        </span>
      </a-table>
    </a-modal>
    <CertAddEdit :title="registerTitle" :isResiger="true" ref="CertAddEdit"></CertAddEdit>
  </div>
</template>
<script>
import PermBox from '@/components/PermBox'
import moment from 'moment'
import CertAddEdit from '@/views/certificate/modules/CertAddEdit'
import { stopClassList, stopClass, removeStopClass, getSuspendInfoList, restartClass } from '@/api/education'

const formItemLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 }
  }
}
const stopClassColumns = [
  {
    title: '停课开始时间',
    width: 200,
    align: 'center',
    dataIndex: 'startDate'
  },
  {
    title: '复课时间',
    width: 200,
    align: 'center',
    dataIndex: 'endDate'
  },
  {
    title: '停课备注',
    align: 'center',
    dataIndex: 'desc',
    scopedSlots: { customRender: 'desc' }
  },
  {
    title: '延长时间',
    width: 200,
    align: 'center',
    dataIndex: 'validDay'
  },
  {
    title: '操作',
    width: 200,
    align: 'center',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const innerColumns = [
  {
    title: '学员名称',
    width: 200,
    align: 'center',
    dataIndex: 'stuName'
  },
  {
    title: '卡号',
    width: 200,
    align: 'center',
    dataIndex: 'stuCardNo'
  },
  {
    title: '延长天数',
    width: 200,
    align: 'center',
    dataIndex: 'actualDay'
  },
  {
    title: '延期前有效期截止',
    width: 200,
    align: 'center',
    dataIndex: 'beforeDate',
    customRender: val => {
      return val
        ? moment(val)
            .subtract(1, 'seconds')
            .format('YYYY-MM-DD HH:mm')
        : ''
    }
  },
  {
    title: '延期后有效期截止',
    width: 200,
    align: 'center',
    dataIndex: 'afterDate',
    customRender: val => {
      return val
        ? moment(val)
            .subtract(1, 'seconds')
            .format('YYYY-MM-DD HH:mm')
        : ''
    }
  },
  {
    title: '卡状态',
    width: 200,
    align: 'center',
    dataIndex: 'status',
    customRender: val => {
      switch (val) {
        case 'A':
          return '未使用'
        case 'B':
          return '使用中'
        case 'C':
          return '停课'
        case 'D':
          return '退卡'
        case 'E':
          return '结业'
        case 'F':
          return '撤销'
        case 'G':
          return '结转'
        default:
          return val
      }
    }
  }
]
export default {
  props: {
    classInfo: Object
  },
  data() {
    return {
      stopClassColumns,
      stopClassList: [],
      formItemLayout,
      registerTitle: '',
      classId: '',
      //
      stopClassModal: false,
      isEditStopClass: false,
      newStopClassDate: null,
      newStopClassDesc: null,
      editStopClassId: null,
      form: {
        restartDate: null,
        startDate: null,
        desc: null
      },
      rules: {
        restartDate: [{ required: true, message: '请输入复课时间', trigger: 'change' }],
        stopDate: [{ required: true, message: '请输入停课开始时间', trigger: 'change' }],
        desc: [{ required: true, message: '请输入停课原因', trigger: 'change' }]
      },
      innerColumns,
      innerSuspendList: []
    }
  },
  components: {
    PermBox,
    CertAddEdit
  },
  computed: {
    currentClassState() {
      return this.classInfo.eduClass.state
    },
    // 停课情况
    currentSuspend() {
      return this.classInfo.suspend || {}
    },
    // 停课
    isClassStopped() {
      return this.currentClassState === 'D'
    },
    classStateStr() {
      let classState = this.classInfo.eduClass.state
      return classState === 'A' ? '计划中' : classState === 'B' ? '开课中' : classState === 'C' ? '班级结业' : classState === 'D' ? '停课' : ''
    }
  },
  methods: {
    disabledDate(current) {
      return current && current < moment().subtract(0, 'days')
    },
    disabledRestartDate(current) {
      if (!this.currentSuspend.startDate) return true
      return current < moment(this.currentSuspend.startDate).endOf('day') || current > moment()
    },
    handleClassState() {
      this.$emit('graduate', this.classInfo.eduClass.id)
    },
    handleActClassState() {
      this.$emit('actClass', this.classInfo.eduClass.id)
    },
    registerTest() {
      this.registerTitle = '录入考级信息'
      this.$refs.CertAddEdit.openModal()
      this.$refs.CertAddEdit.initRegisterTest()
      this.$refs.CertAddEdit.hideAddBtn()
    },
    initStopClass() {
      this.newStopClassDate = null
      this.newStopClassDesc = null
      this.editStopClassId = null
      this.isEditStopClass = false
      if (this.isClassStopped) {
        this.form.desc = this.currentSuspend.desc
      }
    },
    stopClass() {
      const { getStopClassList } = this
      this.initStopClass()
      getStopClassList().then(res => {
        this.stopClassList = res.data
        this.stopClassModal = true
      })
    },
    getStopClassList() {
      const {
        $route: {
          params: { classid }
        }
      } = this
      const params = { classId: classid }
      return stopClassList(params)
    },
    submitStopClass() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return false
        if (this.isClassStopped) {
          this.restartClass()
          return
        }
        const { stopDate, desc } = this.form
        const params = {
          classId: this.$route.params.classid,
          stopDate: stopDate.format('YYYY-MM-DD'),
          desc
        }
        stopClass(params).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.form = { restartDate: null, stopDate: null, desc: null }
          this.stopClassModal = false
          this.$emit('complete')
        })
      })
    },
    restartClass() {
      const { restartDate } = this.form
      const params = {
        classId: this.$route.params.classid,
        suspendId: this.currentSuspend.id,
        restartDate: restartDate.format('YYYY-MM-DD')
      }
      restartClass(params).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.form = { restartDate: null, stopDate: null, desc: null }
        this.stopClassModal = false
        this.classInfo.eduClass.state = 'B'
        this.$emit('complete')
      })
    },
    async listSuspendInfo(record) {
      const params = {
        suspendId: record.suspendId
      }
      let res = await getSuspendInfoList(params)
      this.innerSuspendList = res.data
    },
    addStopClass() {
      const {
        stopClassList: { length },
        stopClassList
      } = this
      this.isEditStopClass = true
      const newStopClassItem = {
        startDate: '',
        endDate: '',
        desc: '',
        isEdit: true
      }
      this.stopClassList = [newStopClassItem, ...stopClassList]
    },
    saveStopClass() {
      const {
        newStopClassDate: [startDate, endDate],
        newStopClassDesc,
        editStopClassId,
        $tools: {
          tailor: { getDate }
        },
        $route: {
          params: { classid }
        },
        $notification
      } = this
      const data = {
        id: editStopClassId,
        startDate: getDate(startDate),
        endDate: getDate(endDate),
        desc: newStopClassDesc
      }
      stopClass(classid, data).then(res => {
        $notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.stopClass()
      })
    },
    cancelStopClass() {
      this.clearInput()
      this.isEditStopClass = false
    },
    editStopClass(record) {
      this.clearInput()
      record.isEdit = true
      this.newStopClassDate = [moment(record.startDate), moment(record.endDate)] || null
      this.newStopClassDesc = record.desc
      this.editStopClassId = record.id
      this.isEditStopClass = true
      this.stopClassList = [...this.stopClassList]
    },
    removeStopClass(record) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认取消停课吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          const params = {
            classId: _this.$route.params.classid,
            suspendId: record.suspendId
          }
          removeStopClass(params).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.stopClass()
          })
        }
      })
    },
    clearInput() {
      this.stopClassList.map((item, idx) => {
        !item.id ? this.stopClassList.splice(idx, 1) : item.isEdit ? (item.isEdit = false) : ''
      })
      this.initStopClass()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

.studentinfo-wrapper {
  width: 100%;

  .student-info-wrapper {
    width: 100%;

    .name-wrapper {
      width: 100%;
      padding: 10px 45px;
      box-sizing: border-box;

      .student-name {
        font-size: 22px;
        font-weight: bold;
        color: #333;
      }
    }

    .infoItem {
      /*margin: 10px 0;*/

      .class-info {
        margin: 10px 0;
      }

      .info-item-label {
        text-align: right;
      }

      .info-item-content {
        padding-left: 5px;
        box-sizing: border-box;
        .ellipsis();
      }
    }
  }
}

.cancel-tag::before {
  content: '';
  width: 0;
  height: 0;
  border: 40px solid transparent;
  border-right: 40px solid #bfbfbf;
  transform: rotate(135deg);
  position: absolute;
  right: -41px;
  top: -41px;
  cursor: pointer;
}

.cancel-tag::after {
  content: '已取消';
  font-size: 12px;
  width: 20px;
  height: 20px;
  color: #7e7e7e;
  transform: rotate(45deg);
  position: absolute;
  right: 16px;
  top: 10px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
}
</style>
