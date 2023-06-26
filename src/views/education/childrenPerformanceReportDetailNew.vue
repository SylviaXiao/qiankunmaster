<template>
  <div>
    <div class="flex flex-end mt-16">
      <a-button @click="handleBack">返回</a-button>
    </div>
    <a-card v-if="report" :style="[cardStyle]" :bordered="false">
      <a-row style="font-size:18px;" :gutter="[0, 16]">
        <a-col :span="6">上课分馆：{{ report.classSchool.deptName }}</a-col>
        <a-col :span="6">班级名称：{{ report.className }}</a-col>
        <a-col :span="12">数据时间：{{ moment(report.startReportDate).format('YYYY-MM-DD') + ' ~ ' +
          moment(report.endReportDate).format('YYYY-MM-DD') }}</a-col>
        <a-col :span="6">老师：{{ report.teacherNames }}</a-col>
        <a-col :span="6">舞种：{{ report.eduDance.name }}</a-col>
        <a-col :span="12">教研负责人：{{ report.teachingResearchNames }}</a-col>
      </a-row>

      <div class="section-title mt-40">成果评估</div>
      <a-table class="mt-16" :columns="columns" :dataSource="dataList" :showHeader="false"
        :rowKey="(item, index) => index" bordered :pagination="false">
        <template slot="title" slot-scope="currentPageData">
          <div>特别说明：</div>
          <div>① 半年数据清零，上半年续卡不累计到下半年。</div>
          <div>② 如老师在绩效审核期间离职，该班级考核资格取消。</div>
          <div>③ 班级交接后，交接老师自交接日开始折算该班级绩效。</div>
          <div>为确保导师奖金真实有效，请所有考核责任人谨慎确认，如确认签字后总部审核发现有出入，公司将对相关责任人予以重罚，特此告知！</div>
        </template>
        <span slot="tablePrefix" slot-scope="text, record">
          <div class="flex-col text-center">
            <span class="score-title">评分项</span>
            <span class="score-item-name bottom-line">评分规则</span>
            <span class="score-input">评分</span>
          </div>
        </span>
        <span v-for="(item) in this.scoreItems" :slot="item.id" slot-scope="text, record" class="overflow">
          <div class="score-columns-wrap" :style="{ width: scoreColumnsWidth + 'px' }">
            <div class="score-title">{{ item.scoreItem }}</div>
            <div class="score-item-name bottom-line">{{ item.scoreDescribe }}</div>
            <div class="score-input">
              <a-input-number style="width: 100px;" v-model="item.score" :disabled="!scoreMode" :min="0"
                :max="item.scoreMax"></a-input-number>
              <span v-if="item.isRequired === 'Y'" class="ml-4 text-theme-red">*</span>
            </div>
          </div>
        </span>
        <span slot="tableSuffix" slot-scope="text, record">
          <div class="flex-col text-center">
            <span class="score-title" style="height: 200px;line-height: 200px;">总分</span>
            <span class="score-input">{{ totalScore }}</span>
          </div>
        </span>
        <template v-if="scoreMode" slot="footer" slot-scope="currentPageData">
          <div class="flex flex-end">
            <a-button @click="handleBack">取消</a-button>
            <a-button class="ml-16" type="primary" @click="handleScoreConfirm">确认</a-button>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-card v-if="renewalListA && renewalListA.length > 0" :style="[cardStyle]" :bordered="false">
      <div class="section-title">班课续卡</div>
      <a-table class="mt-16" :columns="renewalColumns" :dataSource="renewalListA" :rowKey="(item, index) => index"
        bordered :pagination="false">
        <template slot="title" slot-scope="currentPageData">
          <div class="flex flex-end">
            合计续卡分数：{{ renewalTotalScoreA }}
          </div>
        </template>
      </a-table>
    </a-card>
    <a-card v-if="renewalListB && renewalListB.length > 0" :style="[cardStyle]" :bordered="false">
      <div class="section-title">少儿续199私教</div>
      <a-table class="mt-16" :columns="renewalColumns" :dataSource="renewalListB" :rowKey="(item, index) => index"
        bordered :pagination="false">
        <template slot="title" slot-scope="currentPageData">
          <div class="flex flex-end">
            合计续卡分数：{{ renewalTotalScoreB }}
          </div>
        </template>
      </a-table>
    </a-card>

    <a-card v-if="renewalListC && renewalListC.length > 0" :style="[cardStyle]" :bordered="false">
      <div class="section-title">少儿续私教</div>
      <a-table class="mt-16" :columns="renewalColumns" :dataSource="renewalListC" :rowKey="(item, index) => index"
        bordered :pagination="false">
        <template slot="title" slot-scope="currentPageData">
          <div class="flex flex-end">
            合计续卡分数：{{ renewalTotalScoreC }}
          </div>
        </template>
      </a-table>
    </a-card>

    <a-card v-if="classListA && classListA.length > 0" :style="[cardStyle]" :bordered="false">
      <div class="flex flex-end">
        <perm-box perm="education:children-report:delstudent">
          <a style="font-size:18px;" @click="classVisible = true">修改</a>
        </perm-box>
      </div>
      <div class="section-title">班级维护-总人数</div>
      <a-table class="mt-16" :columns="classColumnsA" :dataSource="classListA" :rowKey="(item, index) => index" bordered
        :pagination="false">
        <template slot="title" slot-scope="currentPageData">
          <div class="flex flex-end">
            <div>流失率：{{ lossRate + '%' }}</div>
            <div class="ml-40">合计维护分：{{ lossScore }}</div>
          </div>
        </template>

        <template slot="footer" slot-scope="currentPageData">
          <div class="flex flex-end">
            总人数：{{ studentCount }}
          </div>
        </template>
      </a-table>
      <div class="mt-16" v-if="classListB && classListB.length > 0" :style="[cardStyle]" :bordered="false">
        <div class="section-title">班级维护-退卡人数</div>
        <a-table class="mt-16" :columns="classColumnsB" :dataSource="classListB" :rowKey="(item, index) => index" bordered
          :pagination="false">
          <template slot="footer" slot-scope="currentPageData">
            <div class="flex flex-end">
              总人数：{{ lossCount }}
            </div>
          </template>
        </a-table>
      </div>
    </a-card>
    <perm-box perm="education:children-report:courseview">
      <a-card v-if="courseTimeList && courseTimeList.length > 0" :style="[cardStyle]" :bordered="false">
        <div class="section-title">导师课时数</div>
        <a-table class="mt-16" :columns="courseTimeColumns" :dataSource="courseTimeList" :rowKey="(item, index) => index"
          bordered :pagination="false">
        </a-table>
      </a-card>
    </perm-box>

    <a-card v-if="finalScore" :style="[cardStyle]" :bordered="false">
      <div clas="flex text-bold" style="font-size: 28px;">
        <span>班级合计总分 <span class="text-theme-red ml-20">{{ finalScore }}</span></span>
        <span class="ml-40">总奖金 <span class="text-theme-red ml-20">{{ finalBouns }}</span></span>
      </div>
    </a-card>

    <!-- 班级维护 -->
    <a-modal :visible="classVisible" title="" width="90%" @ok="classVisible = false" @cancel="classVisible = false">
      <div class="section-title">班级维护-总人数</div>
      <a-table class="mt-16" :columns="editClassColumnsA" :dataSource="classListA" :rowKey="(item, index) => index"
        bordered :pagination="false">
        <template slot="title" slot-scope="currentPageData">
          <div class="flex flex-end">
            <div>流失率：{{ lossRate + '%' }}</div>
            <div class="ml-40">合计维护分：{{ lossScore }}</div>
          </div>
        </template>

        <template slot="footer" slot-scope="currentPageData">
          <div class="flex flex-end">
            总人数：{{ studentCount }}
          </div>
        </template>
      </a-table>
      <div class="mt-16" v-if="classListB && classListB.length > 0" :style="[cardStyle]" :bordered="false">
        <div class="section-title">班级维护-退卡人数</div>
        <a-table class="mt-16" :columns="editClassColumnsB" :dataSource="classListB" :rowKey="(item, index) => index"
          bordered :pagination="false">
          <template slot="footer" slot-scope="currentPageData">
            <div class="flex flex-end">
              总人数：{{ lossCount }}
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>

    <!-- 查看总课时数 -->
    <a-modal :visible="courseSignInVisible" :width="1200" @ok="courseSignInVisible = false"
      @cancel="courseSignInVisible = false">
      <div class="section-title">{{ className }}</div>
      <a-table class="mt-16" :columns="courseSignInColumns" :dataSource="courseSignInRecordList"
        :rowKey="(item, index) => `${index} + '-' + ${item.id || item.teacherId}`" bordered :pagination="false"
        defaultExpandAllRows>
      </a-table>
    </a-modal>

    <!-- 修改课时 -->
    <a-modal :visible="courseEditVisible" :width="800" @ok="handleEditCourseTimeConfirm"
      @cancel="courseEditVisible = false">
      <div class="section-title">导师课时数</div>
      <a-table class="mt-16" :columns="editCourseTimeColumns" :dataSource="editCourseTimeList"
        :rowKey="(item, index) => index" bordered :pagination="false">
      </a-table>
    </a-modal>

    <!-- 变更记录 -->
    <a-modal :visible="courseEditRecordVisible" :width="1000" @ok="courseEditRecordVisible = false"
      @cancel="courseEditRecordVisible = false">
      <div class="section-title">导师课时数修改记录</div>
      <a-table class="mt-16" :columns="courseEditRecordColumns" :dataSource="courseEditRecordList"
        :rowKey="(item, index) => index" bordered :pagination="false" defaultExpandAllRows>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro, PermBox } from '@/components'
import {
  getChildrenPerformanceGradeList,
  getChildrenPerformanceReportDetail,
  scoreChildrenPerformanceById,
  deleteChildrenPerformanceClassStudent,
  getChildrenPerformanceTeacherSignInRecordList,
  getChildrenPerformanceCourseEditList,
  childrenPerformanceBatchUpdateCourseTime
} from '@/api/education'
import moment from 'moment'

const renewalColumns = [
  {
    title: '学员姓名',
    align: 'center',
    dataIndex: 'studentName',
  },
  {
    title: '手机号',
    align: 'center',
    dataIndex: 'studentPhone',
  },
  {
    title: '续卡卡种名称',
    align: 'center',
    dataIndex: 'renewalCardType',
  },
  {
    title: '续卡卡号',
    align: 'center',
    dataIndex: 'renewalCardNo',
  },
  {
    title: '续卡缴清日期',
    align: 'center',
    dataIndex: 'renewalDate',
    customRender: val => {
      return val && moment(val).format('YYYY-MM-DD')
    }
  },
  {
    title: '续卡金额',
    align: 'center',
    dataIndex: 'renewalCardMoney',
  },
  {
    title: '续卡个数',
    align: 'center',
    dataIndex: 'renewalCardNumber',
  },
  {
    title: '绩点',
    align: 'center',
    dataIndex: 'gradePoint',
    customRender: val => {
      return val || '/'
    }
  },
  {
    title: '续卡类型',
    align: 'center',
    dataIndex: 'renewalType',
  },
  {
    title: '往期卡信息（卡种名称/卡号）',
    align: 'center',
    dataIndex: 'previousCardInfo',
  },
  {
    title: '续卡分数',
    align: 'center',
    dataIndex: 'renewalCardScore',
  },
]

const classColumnsA = [
  {
    title: '学员姓名',
    align: 'center',
    dataIndex: 'studentName',
  },
  {
    title: '手机号',
    align: 'center',
    dataIndex: 'studentPhone',
  },
  {
    title: '卡号',
    align: 'center',
    dataIndex: 'cardNo',
  },
  {
    title: '卡状态',
    align: 'center',
    dataIndex: 'cardStatus',
  },
  {
    title: '卡种名称',
    align: 'center',
    dataIndex: 'cardTypeName',
  },
  {
    title: '最新签到时间',
    align: 'center',
    dataIndex: 'lastSigninTime',
    customRender: val => {
      return val && moment(val).format('YYYY-MM-DD')
    }
  },
  {
    title: '退卡时间',
    align: 'center',
    dataIndex: 'refundCardDate',
    customRender: val => {
      return val && moment(val).format('YYYY-MM-DD')
    }
  },
]

const classColumnsB = [
  {
    title: '学员姓名',
    align: 'center',
    dataIndex: 'studentName',
  },
  {
    title: '手机号',
    align: 'center',
    dataIndex: 'studentPhone',
  },
  {
    title: '卡号',
    align: 'center',
    dataIndex: 'cardNo',
  },
  {
    title: '卡状态',
    align: 'center',
    dataIndex: 'cardStatus',
  },
  {
    title: '卡种名称',
    align: 'center',
    dataIndex: 'cardTypeName',
  },
  {
    title: '退卡时间',
    align: 'center',
    dataIndex: 'refundCardDate',
    customRender: val => {
      return val && moment(val).format('YYYY-MM-DD')
    }
  },
]

const courseSignInColumns = [
  {
    title: '老师姓名',
    align: 'center',
    dataIndex: 'teacherName'
  },
  {
    title: '总课时数',
    width: 100,
    align: 'center',
    dataIndex: 'signInNumberCount'
  },
  {
    title: '上课时间',
    width: 240,
    align: 'center',
    dataIndex: 'courseTime'
  },
  {
    title: '签到时间',
    width: 180,
    align: 'center',
    dataIndex: 'signInTime',
  },
  {
    title: '签到计次',
    width: 100,
    align: 'center',
    dataIndex: 'signInNumber'
  },
  {
    title: '签到老师',
    width: 240,
    align: 'center',
    dataIndex: 'signInTeacherName'
  },
]

const courseEditRecordColumns = [
  {
    title: '修改老师',
    align: 'center',
    dataIndex: 'teacherName'
  },
  {
    title: '修改前课时数',
    width: 120,
    align: 'center',
    dataIndex: 'courseTimeBefore'
  },
  {
    title: '修改后课时数',
    width: 120,
    align: 'center',
    dataIndex: 'courseTimeAfter'
  },
  {
    title: '修改时间',
    width: 200,
    align: 'center',
    dataIndex: 'updateTime',
  },
  {
    title: '操作人',
    width: 180,
    align: 'center',
    dataIndex: 'modifyUser'
  },
]

export default {
  name: 'childrenPerformanceReportDetail',
  components: {
    SearchComPro,
    STable,
    PermBox,
  },
  data() {
    return {
      report: null,
      dataList: [],
      reportScore: null,
      scoreItems: [],
      columns: [], // 评分
      renewalColumns,
      renewalList: [],
      renewalListA: [], // 班课续卡
      renewalListB: [], // 少儿续199私教
      renewalListC: [], // 少儿续私教
      renewalTotalScoreA: 0,
      renewalTotalScoreB: 0,
      renewalTotalScoreC: 0,
      classColumnsA, // 班级维护
      classColumnsB,
      classList: [],
      classListA: [], // 班级维护-总人数
      classListB: [], // 班级维护-退卡人数
      classVisible: false,
      courseTotalCount: 0,
      courseTimeColumns: [
        {
          title: '班级名称',
          align: 'center',
          dataIndex: 'className',
          customRender: (text, row, index) => {
            let rowSpan = this.courseTimeList.length
            if (index > 0) { rowSpan = 0 }
            return {
              children: text,
              attrs: { rowSpan }
            }
          }
        },
        {
          title: '总课时数',
          align: 'center',
          customRender: (text, row, index) => {
            let rowSpan = this.courseTimeList.length
            if (index > 0) { rowSpan = 0 }
            let courseTotalCount = 0
            for (const record of this.courseTimeList) {
              const { teacherCourseTime } = record
              teacherCourseTime && (courseTotalCount += teacherCourseTime)
            }
            this.courseTotalCount = courseTotalCount
            return {
              children: (<a style="font-size: 24px;" onClick={() => this.querySignInRecordList()}>{`${courseTotalCount}`}</a>),
              attrs: { rowSpan }
            }
          }
        },
        {
          title: '导师姓名',
          align: 'center',
          dataIndex: 'teacherName'
        },
        {
          title: '实际课时数',
          align: 'center',
          dataIndex: 'teacherCourseTime',
        },
        {
          title: '实际奖金',
          align: 'center',
          dataIndex: 'teacherPrice',
          customRender: (val, record) => {
            return (this.finalBouns * record.teacherCourseTime / this.courseTotalCount).toFixed(1)
          }
        },
        {
          title: '操作',
          width: 160,
          align: 'center',
          customRender: (text, row, index) => {
            let rowSpan = this.courseTimeList.length
            if (index > 0) { rowSpan = 0 }
            return {
              children: (<a-space>
                <perm-box perm="education:children-report:updatecoursetime">
                  <a onClick={() => this.courseEditVisible = true}>修改课时</a>
                </perm-box>
                <a onClick={() => this.queryCourseEditRecordList()}>变更记录</a>
              </a-space>),
              attrs: { rowSpan }
            }
          },
        },
      ],
      courseTimeList: [], // 课时数列表
      editCourseTimeList: [], // 修改课时列表
      courseSignInVisible: false,
      courseSignInColumns,
      courseSignInRecordList: [],
      courseEditVisible: false,   // 修改课时
      courseEditRecordVisible: false, // 课时变更记录
      courseEditRecordColumns,
      courseEditRecordList: [],
    }
  },
  computed: {
    className() {
      return this.report?.className
    },
    cardStyle() {
      return {
        margin: `20px 0`,
        padding: `20px 0`
      }
    },
    moment() {
      return moment
    },
    scoreMode() {
      return this.$route.params.type === 'score'
    },
    detailMode() {
      return this.$route.params.type === 'detail'
    },
    scoreColumnsWidth() {
      return 160
    },
    customCell() {
      return (record, rowIndex) => {
        return {
          style: {
            padding: '0px !important'
          }
        }
      }
    },
    // 成果评估分
    totalScore() {
      let score = 0
      for (const item of this.scoreItems) {
        if (item.score) {
          score += item.score
        }
      }
      return score
    },
    // 班级总人数（去重）
    studentCount() {
      let idList = []
      for (const student of this.classListA) {
        const { studentInfo: { id } } = student
        idList.push(id)
      }
      let idSet = [... new Set(idList)]
      return idSet.length
    },
    // 班级退卡人数（去重）
    lossCount() {
      let idList = []
      for (const student of this.classListB) {
        const { studentInfo: { id } } = student
        idList.push(id)
      }
      let idSet = [... new Set(idList)]
      return idSet.length
    },
    // 班级总人数 流失率 去掉'%'
    lossRate() {
      return ((this.lossCount / this.classListA.length) * 100).toFixed(2)
    },
    // 合计维护分
    lossScore() {
      let lossRate = this.lossRate
      let score
      if (lossRate < 10) {
        score = 10;
      } else if (lossRate >= 10 && lossRate < 20) {
        score = 3;
      } else if (lossRate >= 20 && lossRate < 30) {
        score = -5;
      } else if (lossRate >= 30 && lossRate < 40) {
        score = -10;
      } else if (lossRate >= 40) {
        score = -15;
      }
      return score
    },
    editClassColumnsA() {
      return [...this.classColumnsA,
      {
        title: '操作',
        width: 100,
        align: 'center',
        customRender: (val, record) => {
          return {
            children: <a onClick={() => this.handleDeleteClassA(record)}>删除</a>
          }
        }
      }]
    },
    editClassColumnsB() {
      return [...this.classColumnsB,
      {
        title: '操作',
        width: 100,
        align: 'center',
        customRender: (val, record) => {
          return {
            children: <a onClick={() => this.handleDeleteClassB(record)}>删除</a>
          }
        }
      }]
    },
    // 修改课时
    editCourseTimeColumns() {
      return [
        {
          title: '班级名称',
          align: 'center',
          dataIndex: 'className',
          customRender: (text, row, index) => {
            let rowSpan = this.courseTimeList.length
            if (index > 0) { rowSpan = 0 }
            return {
              children: text,
              attrs: { rowSpan }
            }
          }
        },
        {
          title: '总课时数',
          align: 'center',
          customRender: (text, row, index) => {
            let rowSpan = this.courseTimeList.length
            if (index > 0) { rowSpan = 0 }
            let courseTotalCount = 0
            for (const record of this.courseTimeList) {
              const { teacherCourseTime } = record
              teacherCourseTime && (courseTotalCount += teacherCourseTime)
            }
            return {
              children: (<a style="font-size: 24px;" onClick={() => this.querySignInRecordList()}>{`${courseTotalCount}`}</a>),
              attrs: { rowSpan }
            }
          }
        },
        {
          title: '导师姓名',
          align: 'center',
          dataIndex: 'teacherName'
        },
        {
          title: '实际课时数',
          align: 'center',
          dataIndex: 'teacherCourseTime',
          customRender: (val, record) => {
            return {
              children: <a-input-number style="width: 160px;" v-model={record.teacherCourseTime} min={0}></a-input-number>
            }
          }
        }]
    },
    // 最终  班级合计总分
    finalScore() {
      let result = (this.totalScore || 0) + (this.renewalTotalScoreA || 0) + (this.renewalTotalScoreB || 0) + (this.renewalTotalScoreC || 0) + (this.lossScore || 0)
      return (result * 1.00).toFixed(2)
    },
    // 总奖金
    finalBouns() {
      let finalScore = this.finalScore
      let bouns = 0
      if (finalScore >= 80 && finalScore < 91) {
        bouns = 1000
      } else if (finalScore >= 91 && finalScore < 101) {
        bouns = 2000
      } else if (finalScore >= 101 && finalScore < 111) {
        bouns = 3000
      } else if (finalScore >= 111 && finalScore < 121) {
        bouns = 4000
      } else if (finalScore >= 121 && finalScore <= 131) {
        bouns = 5000
      } else if (finalScore > 131) {
        bouns = 5000 + ((finalScore - 131) * 50)
      }
      return bouns
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.queryContent()
    })
  },
  methods: {
    queryContent() {
      if (this.scoreMode) {
        this.queryScoreList()
      } else if (this.detailMode) {
        this.queryDetail()
      }
    },
    // 配置成果评估表
    configScoreList() {
      this.columns = []
      // 构造表格
      this.columns.push(
        {
          // title: '评分项',
          align: 'center',
          // width: 100,
          customCell: this.customCell,
          scopedSlots: { customRender: 'tablePrefix' }
        },
      )
      let scoreConfig = {
        tablePrefix: '',
        tableSuffix: '',
        // 评分项数据放在scoreItems里面
      }
      for (const obj of this.scoreItems) {
        const { id } = obj
        const col = {
          align: 'center',
          width: this.scoreColumnsWidth,
          customCell: this.customCell,
          scopedSlots: { customRender: `${id}` }
        }
        this.columns.push(col)
      }
      this.dataList[0] = scoreConfig


      this.columns.push(
        {
          width: 120,
          align: 'center',
          fixed: 'right',
          customCell: this.customCell,
          scopedSlots: { customRender: `tableSuffix` }
        }
      )

    },
    // 打分模式下，仅获取成果评估表
    async queryScoreList() {
      let res = await getChildrenPerformanceGradeList(this.$route.params.id)
      const { report, reportScore: { scoreItems } } = res.data
      this.report = report
      this.scoreItems = JSON.parse(scoreItems)
      this.configScoreList()

    },
    // 查看详情模式
    async queryDetail() {
      let res = await getChildrenPerformanceReportDetail(this.$route.params.id)
      const { report, courseTimeList, renewalList, reportScore, classList } = res.data
      this.report = report
      this.scoreItems = JSON.parse(reportScore.scoreItems)
      this.reportScore = reportScore
      this.renewalList = renewalList

      // 
      this.renewalListA = []
      this.renewalListB = []
      this.renewalListC = []
      this.renewalTotalScoreA = 0
      this.renewalTotalScoreB = 0
      this.renewalTotalScoreC = 0

      for (const record of renewalList) {
        const { type, renewalCardScore } = record
        if (type === 'A') {
          this.renewalListA.push(record)
          renewalCardScore && (this.renewalTotalScoreA = parseFloat((this.renewalTotalScoreA + renewalCardScore).toFixed(2)))
        } else if (type === 'B') {
          this.renewalListB.push(record)
          renewalCardScore && (this.renewalTotalScoreB = parseFloat((this.renewalTotalScoreB + renewalCardScore).toFixed(2)))
        } else if (type === 'C') {
          this.renewalListC.push(record)
          renewalCardScore && (this.renewalTotalScoreC = parseFloat((this.renewalTotalScoreC + renewalCardScore).toFixed(2)))
        }
      }
      // 
      this.classListA = []
      this.classListB = []
      this.classList = classList || []
      for (const record of classList) {
        const { type } = record
        if (type === 'A') { this.classListA.push(record) }
        else if (type === 'B') { this.classListB.push(record) }
      }
      // 
      this.courseTimeList = courseTimeList
      this.editCourseTimeList = JSON.parse(JSON.stringify(courseTimeList))
      this.configScoreList()
    },
    handleBack() {
      this.$router.back()
    },
    handleScoreConfirm() {
      this.$confirm(
        {
          content: `当前评分总分为${this.totalScore}，确定要完成评分吗？`,
          onOk: () => {
            const params = {
              reportId: this.$route.params.id,
              scoreItem: this.scoreItems
            }
            scoreChildrenPerformanceById(params).then(res => {
              res.msg && this.$message.success(res.msg)
              setTimeout(() => {
                this.$router.back()
              }, 500)
            })
          }
        }
      )
    },
    // 删除学员
    handleDeleteClassA(record) {
      const { id, studentName } = record
      this.$confirm({
        content: `确定要删除学员'${studentName}'吗？`,
        onOk: () => {
          deleteChildrenPerformanceClassStudent({ id }).then(res => {
            this.$message.success(res.msg || '删除成功')
            this.queryContent()
          })
        }
      })
    },
    handleDeleteClassB(record) {
      this.handleDeleteClassA(record)
    },
    // 查询课时数
    async querySignInRecordList() {
      this.courseSignInVisible = true
      let res = await getChildrenPerformanceTeacherSignInRecordList({ reportId: this.$route.params.id })
      this.courseSignInRecordList = res.data
    },
    // 修改课时
    async handleEditCourseTimeConfirm() {
      let res = await childrenPerformanceBatchUpdateCourseTime(this.editCourseTimeList)
      this.$message.success(res.msg || '修改成功')
      this.queryContent()
      this.courseEditVisible = false

    },
    // 查询课时数修改记录
    async queryCourseEditRecordList() {
      this.courseEditRecordVisible = true
      let res = await getChildrenPerformanceCourseEditList({ reportId: this.$route.params.id })
      this.courseEditRecordList = res.data
    }
  },
}

</script>

<style lang="less" scoped>
@import '../../assets/style/standard.less';

.table-cell-y {
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #e8e8e8;
  // border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;

  padding: 0 20px;
  height: 48px;
}

div .table-cell-y:last-child {
  border-bottom: 0px;
}

.score-columns-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  // align-items: stretch;
  // flex-wrap: wrap;
  text-align: center;
  overflow: hidden;
}

.score-title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: white;
  background-color: @theme-colorNew;
}

.score-item-name {
  display: flex;
  align-items: center;
  justify-content: center;
  // flex-wrap: wrap;
  width: 100%;
  padding: 0 20px;
  height: 150px;
  // line-height: 160px;
  white-space: pre-wrap;
  // text-overflow: ellipsis;
}

.score-input {
  height: 60px;
  line-height: 60px;
}

.bottom-line {
  border-bottom: 1px solid #e8e8e8;
}
</style>
