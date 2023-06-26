<template>
  <div class="course-wrapper" ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="searchCom" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="checkUsedRoom" ref="elementBtn">
      <a-button @click="checkUsedRoom = true">排课计划</a-button>
        <perm-box perm="student:signinlog:view">
            <span class="selectBtn ml20">
            <a-button :disabled="missClass" @click.native="showMissClass">删除未上课课表</a-button>
            <span v-if="missClass">
              <span @click="missClassConfirm" class="checkIcon check">
                确定
              </span>
              <span @click="hideMissClass" class="checkIcon close">
                取消
              </span>
            </span>
          </span>
        </perm-box>
        <span class="selectBtn ml20">
          <perm-box perm="student:signinlog:view">
            <a-button @click.native="printCourse">生成课表</a-button>
          </perm-box>
        </span>
        <perm-box perm="education:signinlog:batchsign">
          <span class="selectBtn ml20">
            <a-button :disabled="batchSignIn" @click="(batchSignIn = true)">导师批量签到</a-button>
            <span v-if="batchSignIn">
              <span @click="confirmBatchSignIn" class="checkIcon check">
                确定
              </span>
              <span @click="cancelBatchSignIn" class="checkIcon close">
                取消
              </span>
            </span>
          </span>
        </perm-box>
        <perm-box perm="education:plan:down">
          <span class="ml20">
            <a-button :disabled="batchSignIn" @click="handleExport">导出</a-button>
          </span>
        </perm-box>
      </div>
      <div class="week-course-carousel">
        <div class="carouse-wrapper">
          <div class="left-select" @click="lastWeek"><a-icon type="arrow-left" style="font-size: 20px;" />上一周</div>
          <div class="center-wrapper">
            <div class="week-course-list">
              <div class="week-course-list-items" :class="item.isSelect ? 'selected' : ''" @click="selectWeek(item)" v-for="(item, idx) in weekList" :key="idx">
                <div class="week-items-date">{{ item.date }}</div>
                <div class="week-items weekStr">{{ item.week }}</div>
              </div>
            </div>
          </div>
          <div class="right-select" @click="nextWeek">下一周<a-icon type="arrow-right" style="font-size: 20px;" /></div>
        </div>
      </div>
      <div class="week-coure-table">
        <TodaycourseTablePage
          port-type="B"
          :height="height"
          :params="queryParam"
          :missClass="missClass"
          :batchSignIn="batchSignIn"
          ref="todaycourseTable"
        ></TodaycourseTablePage>
      </div>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="checkUsedRoom" title="教室使用情况" width="1200px" :footer="null">
      <week-course></week-course>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="checkClassCourse" title="" width="1300px" :footer="null">
      <class-course ref="classCourse"></class-course>
    </a-modal>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import { listEduDance, listEduType, treeEduClassType, removeEduDancePlanSchool } from '@/api/common'
import { getListDayPlan, batchteaSignInLog } from '@/api/recep'
import { WeekCourse, SearchComPro } from '@/components'
import ClassCourse from './modules/WeekCourse'
import { listClassWeekPlan, getRoomList, exportEducationPlan } from '@/api/education'
import { listEduRoom } from '@/api/common'
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import TodaycourseTablePage from '@/components/TodayCourseTable/TodayCourseTablePage'
import Vue from 'vue'
const columns = [
  {
    title: '时间段',
    dataIndex: 'startEndTime',
    scopedSlots: { customRender: 'startEndTime' }
  },
  {
    title: '班级',
    dataIndex: 'className'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '类型',
    dataIndex: 'typeName'
  },
  {
    title: '班型',
    dataIndex: 'classTypeName'
  },
  {
    title: '教室',
    dataIndex: 'roomName'
  },
  {
    title: '上课导师',
    dataIndex: 'teachers',
    customRender: (text, record) => {
      let teacherName = ''
      text.map((item, idx) => {
        idx == 0 ? (teacherName += ` ${item.teacherName}`) : (teacherName += `, ${item.teacherName}`)
      })
      return teacherName
    }
  },
  {
    title: '顾问',
    dataIndex: 'masterName'
  }
]
const todayStr = moment()
  .subtract(0, 'days')
  .format('YYYY-MM-DD')
const todayNo = ~~moment(todayStr, 'YYYY-MM-DD').format('E')
const today = moment().subtract(0, 'days')

export default {
  name: 'course',
  components: {
    SearchComPro,
    WeekCourse,
    TodaycourseTablePage,
    PermBox,
    ClassCourse
  },
  data() {
    return {
      schoolList: [],
      classTypeList: [],
      classCourseInfo: {},
      checkClassCourse: false, //生成课表
      height: 0, //滚动条高度
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        endDate: null,
        schools: []
      },
      rules: {
        endDate: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
      },
      confirmLoading: false,
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '排课分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'singledate',
          key: 'day',
          label: '选择时间',
          placeholder: '请选择时间',
          defaultVal: moment(this.changeStr),
          format: 'YYYY-MM-DD'
        },
        // {
        //   type: 'cascader',
        //   key: 'classTypeId',
        //   label: '班型',
        //   placeholder: '请选择班型',
        //   treeOps: {
        //     api: treeEduClassType,
        //     label: 'name',
        //     value: 'id',
        //     children: 'children'
        //   }
        // },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'classTypeId',
          label: '班型',
          placeholder: '请选择班型',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: listEduType,
            label: 'name',
            value: 'id'
          }
        },
        {
          type: 'text',
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称',
          autoComplete: true
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'chooseModal', // 点击弹框选择类型
          key: 'master', // 根据key来筛选
          label: '顾问',
          placeholder: '请选择顾问'
        },
        {
          type: 'chooseModal', // 点击弹框选择类型
          key: 'teacher', // 根据key来筛选
          label: '导师',
          placeholder: '请选择导师'
        },
        {
          type: 'chooseModal', // 点击弹框选择类型
          key: 'assistant', // 根据key来筛选
          label: '助教',
          placeholder: '请选择助教'
        },
        {
          type: 'select',
          key: 'classState', // 根据key来筛选
          label: '已签/上课数',
          placeholder: '请选择',
          staticArr: [
            {
              string: '相等',
              value: 'A'
            },
            {
              string: '不相等',
              value: 'B'
            },
            {
              string: '未核实',
              value: 'C'
            }
          ]
        },
        {
          type: 'select', //动态select框
          key: 'roomId',
          label: '教室',
          placeholder: '请选择教室',
          search: true,
          apiOption: {
            api: getRoomList, // promise类型的接口
            string: option => `${option.deptName}-${option.roomName}`,
            value: 'id',
            params: {
              schoolId: this.$store.getters.school_id,
              state: 'Y'
            }
          }
        },
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'splitDeptIds',
          label: '分摊分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: true,
          mutiple: true,
          treeCheckable: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'status', // 根据key来筛选
          label: '导师签到',
          placeholder: '请选择',
          staticArr: [
            {
              string: '已签',
              value: 'Y'
            },
            {
              string: '未签',
              value: 'N'
            }
          ]
        }
      ],
      queryParam: {},
      columns,
      dayCourseTable: [],
      tableLoading: false,
      weekList: [],
      changeStr: null,
      checkUsedRoom: false,
      missClass: false, // 是否显示未上课课表勾选框
      batchSignIn: false // 批量签到
    }
  },
  mounted() {},
  created() {
    const {
      $route: {
        meta: { keepAlive }
      }
    } = this
    !keepAlive
      ? (this.$route.meta.keepAlive = true)
      : this.$nextTick(() => {
          this.changeStr = todayStr
          this._renderWeek(todayStr, 'add')
        })
    this.initParams()
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'course') {
          let { day, className, teacher, teacherId } = this.$route.query
          if (className) this.queryParam.className = className
          if (day) {
            this.queryParam.day = day
            this.changeStr = day
            this._renderWeek(day, 'add')
          }
          if (teacher) this.queryParam.teacher = teacher
          if (teacherId) this.queryParam.teacherId = teacherId
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async initParams() {
      let res = await getSchoolList()
      let res1 = await listEduType()
      this.schoolList = res.data || []
      this.classTypeList = res1.data || []
    },
    printCourse() {
      this.classCourseInfo = {
        classType: []
      }
      if (!this.queryParam.school_id && !!!this.$store.getters.school_id) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请选择排课分馆'
        })
      }
      if (!this.queryParam.day) {
        return this.$notification['error']({
          message: '系统通知',
          description: '建议选好时间哦~'
        })
      }
      if (!this.queryParam.classTypeId) {
        return this.$notification['error']({
          message: '系统通知',
          description: '建议选好班型哦~'
        })
      }
      let id = this.queryParam.school_id || this.$store.getters.school_id
      this.schoolList.forEach(item => {
        item.children.forEach(col => {
          if (col.id === id) {
            this.classCourseInfo.school = col
          }
        })
      })
      let classTypeId = this.queryParam.classTypeId.split(',')
      classTypeId.forEach(item => {
        this.classTypeList.forEach(col => {
          if (item === col.id) {
            this.classCourseInfo.classType.push(col)
          }
        })
      })
      this.classCourseInfo.day = this.queryParam.day
      this.classCourseInfo.danceId = this.queryParam.danceId
      this.checkClassCourse = true
      let that = this
      this.$nextTick(res => {
        this.$refs.classCourse.open(that.classCourseInfo)
      })
    },
    // 导师批量签到
    batchTeacherSignIn() {},
    //搜索功能
    searchSubmit(data) {
      this.queryParam = data
      if (this.queryParam.className) this.queryParam.className = encodeURI(this.queryParam.className.replace(' ',''))
      this.changeStr = data.day || todayStr
      this._renderWeek(data.day || todayStr, 'add')
    },
    refreshTable() {
      this.$refs.todaycourseTable && this.$refs.todaycourseTable.refreshTable()
    },
    getDayCourseList(str) {
      this.$refs.todaycourseTable && this.$refs.todaycourseTable.setTableloadArr(str)
    },
    initWeek() {
      const { weekList } = this
      return new Promise((resolve, reject) => {
        weekList.map(item => {
          item.isSelect = false
        })
        resolve()
      })
    },
    selectWeek(item) {
      const { initWeek, getDayCourseList } = this
      initWeek().then(() => {
        item.isSelect = true

        this.$refs.searchCom.form.setFieldsValue({ day: moment(item.date) })
        this.queryParam['day'] = item.date
        console.log('params', this.queryParam)
        getDayCourseList(item.date)
      })
    },
    _renderWeek(str, type) {
      this.weekList = []
      const { weekList, _renderItem, selectWeek } = this
      weekList.push(_renderItem(str))
      for (let i = 1; i < 7; i++) {
        // type == 'add' ? weekList.push(_renderItem(str, type, i)) : weekList.unshift(_renderItem(str, type, i))
        weekList.push(_renderItem(str, 'add', i))
      }
      selectWeek(weekList[0])
    },
    _renderItem(str, type = 'add', nextNo = 0) {
      let arr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      const week = moment(str, 'YYYY-MM-DD').format('E')
      if (nextNo) {
        let nextStr = moment(str)
          [type](nextNo, 'days')
          .format('YYYY-MM-DD')
        let week = moment(nextStr, 'YYYY-MM-DD').format('E')
        return {
          date: nextStr,
          weekNo: week,
          week: !arr[(Math.abs(week) % 7) - 1] ? '周日' : arr[(Math.abs(week) % 7) - 1],
          isSelect: false
        }
      }
      return { date: str, week: arr[week - 1], isSelect: false, weekNo: week }
    },
    lastWeek() {
      const { _renderItem, _renderWeek, changeStr } = this
      const nextStr = _renderItem(changeStr, 'subtract', 7).date
      this.changeStr = nextStr
      _renderWeek(nextStr, 'subtract')
    },
    nextWeek() {
      const { _renderItem, _renderWeek, changeStr } = this
      const nextStr = _renderItem(changeStr, 'add', 7).date
      this.changeStr = nextStr
      _renderWeek(nextStr, 'add')
    },

    showMissClass() {
      this.missClass = true
    },
    hideMissClass() {
      this.missClass = false
      this.$refs.todaycourseTable.clearSelectedRows()
    },
    confirmBatchSignIn() {
      this.$refs.todaycourseTable.examine().then((selectedRowKeys, selectedRows) => {
        this.$confirm({
          title: '系统提示',
          content: '确定批量签到?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            batchteaSignInLog({
              dancePlanIds: selectedRowKeys.join(',')
            }).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.cancelBatchSignIn()
                this.refreshTable()
              }
            })
          }
        })
      })
    },
    cancelBatchSignIn() {
      this.batchSignIn = false
      this.$refs.todaycourseTable.clearSelectedRows()
    },
    missClassConfirm() {
      this.$refs.todaycourseTable.examine().then((selectedRowKeys, selectedRows) => {
        this.$confirm({
          title: '系统提示',
          content: '是否删除选中课表?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
            removeEduDancePlanSchool({
              schools: userSchoolId ? userSchoolId[0].deptId : '',
              planIds: selectedRowKeys.join(',')
            }).then(res => {
              if (res.code == 200) {
                this.hideMissClass()
                this.refreshTable()
              }
            })
          }
        })
      })
    },
    async handleExport() {
      const day = this.queryParam.day
      if (!day) {
        return this.$message.error('请选择时间')
      }
      this.$message.info('正在导出')
      let res = await exportEducationPlan(this.queryParam)
      this.$tools.exportExcel(res, `${day || '全部'}排课管理表`)
    }
  }
}
</script>

<style lang="less" type="text/less">
.course-wrapper {
  .selectBtn {
    border: 1px solid #d9d9d9;
    vertical-align: middle;
    display: inline-block;
    height: 32px;
    line-height: 1.499;
    white-space: nowrap;
    text-align: center;
    // box-shadow: 0 2px 0 rgba(0, 0, 0, 2%);
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;

    .ant-btn {
      border: 0;
      box-shadow: none;
    }

    .checkIcon {
      margin-right: 10px;
      font-size: 14px;
      font-weight: 500;
    }
    .checkIcon.check {
      color: #1ba97b;
      margin-left: 6px;
    }
  }
  .selectBtn.active {
    // background-color: #f5f5f5;
    .ant-btn {
      border: 0;
    }
  }

  .checkUsedRoom {
    display: flex;
    padding: 10px 0;
  }

  .week-course-carousel {
    width: 100%;
    height: 50px;
    margin-bottom: 10px;

    .carouse-wrapper {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      height: 100%;
      width: 100%;

      .center-wrapper {
        flex: 1;
        overflow: hidden;

        .center-wrapper-carousel {
          position: relative;
          transition: all ease 0.35s;
          width: 100%;
        }

        .carousel {
          position: absolute;
          display: inline-block;
          width: 100%;
          height: 50px;
        }

        /*.week-carousel {*/
        /*  width: 100%;*/
        /*  height: 50px;*/
        /*  margin: 0 100px;*/
        /*}*/
      }

      .left-select,
      .right-select {
        width: 100px;
        min-width: 100px;
        cursor: pointer;
        line-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: #1ba97b;
        }
      }
      .right-select {
        text-align: right;
      }

      .week-course-list {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;

        .week-course-list-items {
          width: 15%;
          border: 1px solid #000c17;
          text-align: center;
          cursor: pointer;
        }

        .selected {
          background-color: #1ba97b;
          color: #ffffff;
        }
      }
    }
  }
}

.no-border {
  border: 0px !important;
}
</style>
