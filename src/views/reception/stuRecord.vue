<template>
  <div class="stu-record-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
    </a-card>
    <a-card :bordered="false" title="学员信息" :style="{ margin: '20px 0' }">
      <a-spin :spinning="stuBaseInfoLoading">
        <div class="student-info-wrapper">
          <a-row type="flex" justify="start" align="top">
            <a-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
              <a-row class="infoItem" type="flex" justify="space-between" align="top">
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">姓名 :</span>
                    <span class="info-item-content">{{ studentInfo.stuName || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">学号 :</span>
                    <span class="info-item-content">{{ studentInfo.stuNo || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">电话 :</span>
                    <span class="info-item-content">{{ studentInfo.stuPhone || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">QQ号 :</span>
                    <span class="info-item-content">{{ studentInfo.stuQQ }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">微信号 :</span>
                    <span class="info-item-content">{{ studentInfo.stuWechat }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">身份证 :</span>
                    <span class="info-item-content">{{ studentInfo.stuIdcard || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">性别 :</span>
                    <span class="info-item-content">{{ studentInfo.stuSex === 'A' ? '男' : studentInfo.stuSex === 'B' ? '女' : '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">省市 :</span>
                    <span class="info-item-content">{{ studentInfo.stuArea }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">紧急联系人 :</span>
                    <span class="info-item-content">{{ studentInfo.stuEmergency || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">顾问 :</span>
                    <span class="info-item-content">{{ studentInfo.adviserName || '' }}</span>
                  </div>
                </a-col>

                <a-col :lg="24" :md="24" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">上课分馆 :</span>
                    <span class="info-item-content">{{ studentInfoDepts }}</span>
                  </div>
                </a-col>
                <a-col :lg="24" :md="24" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">备注 :</span>
                    <span class="info-item-content">{{ studentInfo.stuRemark || '' }}</span>
                  </div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :xs="24" :sm="8" :md="86" :lg="8" :xl="8">
              <a-row type="flex" justify="end">
                <a-avatar shape="square" :size="160" icon="user" :src="studentInfo.avatar" v-if="studentInfo.avatar" />
                <a-avatar v-else shape="square" :size="160" icon="user" />
              </a-row>
              <a-row v-if="$tools.checkPerm('student:info:synchronous')" type="flex" justify="end">
                <div class="avatar-btn"></div>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </a-spin>
    </a-card>

    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <a-tabs defaultActiveKey="stuCards" @change="stuTableChange">
        <a-tab-pane tab="学员卡信息" key="stuCards">
          <a-table :columns="stuCardsColumns" :loading="stuBaseInfoLoading" :dataSource="stuCards" :pagination="false" rowKey="id"> </a-table>
        </a-tab-pane>
        <a-tab-pane tab="签到记录" key="stuSignlog" forceRender>
          <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchStuSignlog" :searchParams="searchStuSignlogParams" />
          <s-table
            ref="stuSignlogTable"
            size="default"
            :columns="stuSignlogColumns"
            :rowKey="record => record.id"
            :data="stuSignlogTableValues"
            :loading="stuSignlogLoading"
          >
          </s-table>
        </a-tab-pane>
        <a-tab-pane tab="试课记录" key="stuAuditionLog">
          <s-table
            ref="stuAuditionLogTable"
            size="default"
            :columns="stuAuditionLogColumns"
            :rowKey="record => record.id"
            :data="stuAuditionLogTableValues"
            :loading="stuAuditionLogLoading"
          >
          </s-table>
        </a-tab-pane>
        <a-tab-pane tab="操作日志" key="stuChangeLog">
          <operating-record ref="opRecord" :loadData="studentChangeLog"></operating-record>
        </a-tab-pane>
        <a-tab-pane tab="问卷调查" key="questionnaire">
          <Questionnaire ref="questionnaire" :loadData="studentChangeQuestionnaire"></Questionnaire>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import { allStuList } from '@/api/recep'
import { pageSignInLogById, pageAuditionLog } from '@/api/reception/student'
import { SearchComPro, STable } from '@/components'
import OperatingRecord from '../education/modules/operatingRecord'
import Questionnaire from '../education/modules/questionnaire'
import { studentChangeLog } from "@/api/education"
import { getStudentInfoById } from "@/api/common"

const stuAuditionLogColumns = [
  {
    title: '试课日期',
    dataIndex: 'logDate',
    key: 'logDate'
  },
  {
    title: '姓名',
    dataIndex: 'stuName',
    key: 'stuName'
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className'
  },
  {
    title: '上课时间',
    dataIndex: 'planStartDate',
    key: 'planStartDate'
  },
  {
    title: '签到状态',
    dataIndex: 'signState',
    key: 'signState',
    customRender: (text, record) => {
      return record.signState === 'Y' ? '已签' : '未签'
    }
  }
]
const stuSignlogColumns = [
  {
    title: '签到时间',
    dataIndex: 'updateDate',
    key: 'updateDate'
  },
  {
    title: '分馆',
    dataIndex: 'deptName'
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className'
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    key: 'typeName'
  },
  {
    title: '学员名称',
    dataIndex: 'stuName',
    key: 'stuName'
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo'
  }
]
export default {
  name: 'stuRecord',
  components: {
    SearchComPro,
    STable,
    OperatingRecord,
    Questionnaire
  },
  data() {
    return {
      stuSignlogColumns,
      stuAuditionLogColumns,
      searchParams: [
        {
          type: 'text',
          key: 'stuNo',
          label: '学号',
          placeholder: '请输入学号'
        },
        {
          type: 'text',
          key: 'contact',
          label: '学员信息',
          placeholder: '请输入手机号码/微信/QQ'
        },
        {
          type: 'text',
          key: 'idcard',
          label: '身份证号码',
          placeholder: '请输入身份证号码'
        },
        {
          type: 'text',
          key: 'cardNo',
          label: '学员卡号',
          placeholder: '请输入学员卡号'
        }
      ],
      searchStuSignlogParams: [
        {
          type: 'date',
          key: 'Date',
          label: '选择时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'text',
          key: 'deptName',
          label: '分馆名称',
          placeholder: '请输入分馆名称'
        },
        {
          type: 'text',
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称'
        },
        {
          type: 'text',
          key: 'stuCardNo',
          label: '学员卡号',
          placeholder: '请输入学员卡号'
        }
      ],
      stuCardsColumns: [
        {
          title: '卡号',
          dataIndex: 'stuCardNo',
          key: 'stuCardNo'
        },
        {
          title: '卡种',
          dataIndex: 'cardName',
          key: 'cardName'
        },
        {
          title: '分馆',
          dataIndex: 'deptName'
        },
        {
          title: '班级',
          dataIndex: 'className'
        },
        {
          title: '类型',
          dataIndex: 'typeName',
          key: 'typeName'
        },
        {
          title: '舞蹈种类',
          dataIndex: 'danceName',
          key: 'danceName'
        },
        {
          title: '卡状态',
          dataIndex: 'status',
          key: 'status',
          customRender: text => {
            if (text === 'A') {
              return '未使用'
            } else if (text === 'B') {
              return '使用中'
            } else if (text === 'C') {
              return '停课'
            } else if (text === 'D') {
              return '退卡'
            } else if (text === 'E') {
              return '结业'
            } else if (text === 'F') {
              return '撤销'
            } else if (text === 'G') {
              return '结转'
            }
          }
        },
        {
          title: '卡属性',
          dataIndex: 'ctype',
          customRender: (text, record) => {
            return text === 'A' ? '正常' : text === 'B' ? '赠卡' : text === 'C' ? '老卡' : ''
          }
        },
        {
          title: '办卡日期',
          dataIndex: 'createDate',
          customRender: (text, record) => {
            return this.$tools.tailor.getDate(text)
          }
        },
        {
          title: '激活时间',
          dataIndex: 'startDate',
          customRender: (text, record) => {
            return this.$tools.tailor.getDate(text)
          }
        },
        {
          title: '有效期截止',
          dataIndex: 'endDate',
          customRender: (text, record) => {
            return this.$tools.tailor.getDate(text)
          }
        },
        {
          title: '应收/办卡',
          dataIndex: 'totalPrice',
          scopedSlots: { customRender: 'totalPrice' }
        },
        {
          title: '是否缴清',
          dataIndex: 'payoff',
          customRender: (text, record) => {
            return text ? '结清' : record.status == 'D' ? '-' : `${(record.paidPrice - record.totalPrice) | this.fixTofloat}`
          }
        },
        {
          title: '使用/总次数',
          dataIndex: 'availableCount',
          customRender: (text, record) => {
            const { usedCount, status, totalCount } = record
            const totalCountStr = totalCount === 0 ? '不限' : totalCount
            return status !== 'D' ? `${usedCount}/${totalCountStr}` : '-'
          }
        }
      ],
      isSearch: false,
      queryParam: {},
      stuSignlogParam: {},
      studentInfo: {},
      stuCards: [],
      studentId: null,
      stuBaseInfoLoading: false,
      stuSignlogLoading: false,
      stuSignlogTableValues: this.getStuSignlog,
      stuAuditionLogLoading: false,
      stuAuditionLogTableValues: this.getstuAuditionLog,
      studentChangeLog: parameter => {
        return studentChangeLog({ studentId: this.studentId })
      },
      studentChangeQuestionnaire: parameter => {
        return getStudentInfoById(this.studentId)
      }
    }
  },
  watch: {
    studentId(nv) {
      console.log(222,nv)
      nv ? this.refreshAllTable() : ''
    }
  },
  computed: {
    studentInfoDepts() {
      console.log(this.studentInfo)
      return this.studentInfo && this.studentInfo.depts && this.studentInfo.depts.join('')
    }
  },
  methods: {
    stuTableChange(key) {},
    refreshAllTable() {
      this.$refs.stuSignlogTable ? this.$refs.stuSignlogTable.refresh() : ''
      this.$refs.stuAuditionLogTable ? this.$refs.stuAuditionLogTable.refresh() : ''
      this.$refs.questionnaire ? this.$refs.questionnaire.refresh() : ''
    },
    searchSubmit(data) {
      this.queryParam = data
      this.getStuBaseInfo()
    },
    searchStuSignlog(data) {
      this.stuSignlogParam = data
      this.$refs.stuSignlogTable ? this.$refs.stuSignlogTable.refresh() : ''
    },
    getStuBaseInfo() {
      const { queryParam } = this
      this.stuBaseInfoLoading = true
      allStuList(queryParam)
        .then(res => {
          const result = res.data
          if (result && result.id) {
            this.studentInfo = result
            this.studentId = result.id
            this.stuCards = result.cards
            this.$forceUpdate()
            console.log(77,this.studentId)
          } else {
            this.studentInfo = {}
            this.studentId = null
            this.stuCards = []
          }
        })
        .finally(() => (this.stuBaseInfoLoading = false))
    },
    getStuSignlog(parameter) {
      const { studentId, stuSignlogParam } = this
      if (!studentId) return Promise.resolve({ data: [], count: 0 })
      this.stuSignlogLoading = true
      return pageSignInLogById(Object.assign(parameter, { studentId }, stuSignlogParam))
        .then(res => {
          return res
        })
        .finally(() => (this.stuSignlogLoading = false))
    },
    getstuAuditionLog(parameter) {
      const { stuPhone } = this.studentInfo
      if (stuPhone) {
        this.stuAuditionLogLoading = true
        return pageAuditionLog(Object.assign(parameter, { phone: stuPhone }))
          .then(res => {
            return res
          })
          .finally(() => (this.stuAuditionLogLoading = false))
      } else {
        return Promise.resolve({ data: [], count: 0 })
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

.stu-record-wrapper {
  .student-info-wrapper {
    width: 100%;

    .avatar-btn {
      width: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 15px;
    }

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
  }

  .infoItem {
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
</style>
