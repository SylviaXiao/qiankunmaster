<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" style="margin: 20px 0 ;">
        <search-com-pro ref="searchForm" v-if="showSearch" :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit" />
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="mb20">
        <a-space :size="15">
          <perm-box perm="education:instruct:down">
            <a-button type="primary" icon="download" @click="handleExport">导出</a-button>
          </perm-box>
          <perm-box perm="education:instruct:del">
            <a-popconfirm title="确定要删除吗" @confirm="handleRecordDelete">
              <a-button type="primary">批量删除</a-button>
            </a-popconfirm>
          </perm-box>
        </a-space>
      </div>
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :rowKey="(record, index) => index"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :showSlider="true"
      >
        <span v-for="(item, index) in columns" :slot="item.dataIndex" :key="index">
          <a-tooltip>
            <template slot="title">
              <p v-for="(para, paraIndex) in item.desc" :key="paraIndex">{{ para }}</p>
            </template>
            <div>
              <span style="white-space: pre-line;">{{ item.slotTitle }}</span>
              <a-icon class="ml-4" type="info-circle" />
            </div>
          </a-tooltip>
        </span>

        <span slot="realEndDate" slot-scope="text, record">
          <a-date-picker @change="handleRealEndDateChange(record, $event)">
            <a>{{ formatDate(text) }}</a>
          </a-date-picker>
        </span>
        <span slot="feedback" slot-scope="text, record">
          <a @click="handleFeedback(record)">查看</a>
        </span>
        <span slot="action" slot-scope="text, record">
          <perm-box perm="education:instruct:edit">
            <!-- 未确认是可以编辑,一旦确认后就不可编辑 -->
            <a v-if="record.state === 'N'" @click="handleEdit(record)">编辑</a>
          </perm-box>
          <!-- 已编辑(存在编辑时间)过且未确认且有资格评分展示 -->
          <perm-box perm="education:instruct:score_save">
            <a v-if="record.editDate && record.state === 'N' && record.isGrade === 'Y'" @click="handleScore(record)">评分</a>
          </perm-box>
          <perm-box perm="education:instruct:confirm">
            <!-- 评分完成展示，可以多次确认 -->
            <a v-if="record.scoreState === 'C'" @click="handleConfirmScore(record)">确认</a>
          </perm-box>
          <perm-box perm="education:instruct:confirm">
            <a v-if="record.state === 'Y'" @click="handleScoreDetail(record)">评分详情</a>
          </perm-box>
          <perm-box perm="education:instruct:score_print">
            <a v-if="record.state === 'Y'" @click="handlePrint(record)">打印</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <performanceEdit ref="performanceEdit" @confirm="handleEditConfirm" />
    <performanceFeedback ref="feedback" />
    <!-- <performancePrint ref="performancePrint" /> -->
  </div>
</template>

<script>
import moment from 'moment'
import { STable, SearchComPro, PermBox } from '@/components'
import { getSchoolList } from '@/api/education/card'
import { treeEduClassType, listEduDance } from '@/api/common'
import { pageCoachClass, listAchClassStudentSpecialSave, deleteAchClassScore, editAchClassRealEndDate, exportAchClassList } from '@/api/education'
import performanceEdit from './modules/performanceEdit'
import performanceFeedback from './modules/performanceFeedback'
import performancePrint from './performancePrint'

const dateFormatRender = (text, record) => {
  return text ? moment(text).format('YYYY-MM-DD') : ''
}
const columns = [
  {
    slotTitle: '上课分馆',
    align: 'center',
    width: 160,
    dataIndex: 'deptName',
    slots: { title: 'deptName' },
    desc: [
      '教练班（含集训班）的上课分馆',
    ]
  },
  {
    slotTitle: '开班日期',
    dataIndex: 'startDate',
    align: 'center',
    width: 120,
    customRender: dateFormatRender,
    slots: { title: 'startDate' },
    desc: [
      '教练班（含集训班）的开班日期',
    ]
  },
  {
    slotTitle: '结业日期',
    dataIndex: 'endDate',
    align: 'center',
    width: 120,
    customRender: dateFormatRender,
    slots: { title: 'endDate' },
    desc: [
      '教练班（含集训班）的实际结业日期',
    ]
  },
  {
    slotTitle: '实际结业日期',
    dataIndex: 'realEndDate',
    align: 'center',
    width: 120,
    scopedSlots: { customRender: 'realEndDate' },
    slots: { title: 'realEndDate' },
    desc: [
      '默认取结业日期，可手动修改，点击日期弹出【日期组件】',
    ]
  },
  {
    slotTitle: '班级名称',
    align: 'center',
    dataIndex: 'className',
    slots: { title: 'className' },
    desc: [
      '舞种、班型、上课导师：取教练班（含集训班）的数据。班型取完整类目，例如教练班>进修班',
    ]
  },
  {
    title: '舞种',
    align: 'center',
    width: 120,
    dataIndex: 'eduDanceName',
    slots: { title: 'eduDanceName' },
    desc: [
      '舞种、班型、上课导师：取教练班（含集训班）的数据。班型取完整类目，例如教练班>进修班',
    ]
  },
  {
    slotTitle: '班型',
    dataIndex: 'eduTypeName',
    align: 'center',
    width: 120,
    customRender: (text, record) => {
      let eduClassTypeName = record.eduClassTypeName ? `>${record.eduClassTypeName}` : ''
      return `${record.eduTypeName}${eduClassTypeName}`
    },
    slots: { title: 'eduTypeName' },
    desc: [
      '舞种、班型、上课导师：取教练班（含集训班）的数据。班型取完整类目，例如教练班>进修班',
    ]
  },
  {
    slotTitle: '上课导师',
    dataIndex: 'teacherName',
    align: 'center',
    width: 120,
    customRender: (text, record) => {
      return Array.isArray(text) ? text.join(',') : ''
    },
    slots: { title: 'teacherName' },
    desc: [
    '舞种、班型、上课导师：取教练班（含集训班）的数据。班型取完整类目，例如教练班>进修班',
    ]
  },
  {
    slotTitle: '教研负责人',
    align: 'center',
    width: 120,
    dataIndex: 'userName',
    slots: { title: 'userName' },
    desc: [
      '在【教务】-【人员区域配置】-【教研区域舞种配置】-打分推送【地区/舞种/人群】对应的班级的【地区/舞种/人群】',
    ]
  },
  {
    slotTitle: '上课人数',
    align: 'center',
    width: 120,
    dataIndex: 'studentNum',
    slots: { title: 'studentNum' },
    desc: [
      '取该班级历史签到所有人数',
      '人数去重；签到卡种退卡、结转、换班：都算签到人数，不需要回退'
    ]
  },
  {
    slotTitle: '流失人数',
    align: 'center',
    width: 120,
    dataIndex: 'lostStudentNum',
    slots: { title: 'lostStudentNum' },
    desc: [
      '取上课人数的学员状态：【续卡流失】【新报流失】【补课未结课】人数',
    ]
  },
  {
    slotTitle: '连报人数',
    align: 'center',
    width: 120,
    dataIndex: 'stuContinuityNum',
    slots: { title: 'stuContinuityNum' },
    desc: [
      '取上课人数的是否连报：【是】人数',
    ]
  },
  {
    slotTitle: '一阶续卡人头',
    align: 'center',
    width: 120,
    dataIndex: 'renewCardNum',
    slots: { title: 'renewCardNum' },
    desc: [
      '1）上课人数的签到卡种，作为往期卡-续【非教练班、非集训班】的续卡卡种实缴金额合计，对比参考值。大于等于参考值则为1，小于则为0',
      '2）参考值：该班级【上课分馆-地区】【舞种】【班型】匹配【参考值录入】配置表对应的【地区】【舞种】【班型】的参考值',
      '3）该字段仅班型【教练班-教练班】才显示数据，其余都显示【空】（不要显示0）',
      '4）该字段数据评分页面可修改，默认自动计算，同步修改的数据'
    ]
  },
  {
    slotTitle: '已有三阶人数',
    align: 'center',
    width: 120,
    dataIndex: 'thirdNum',
    slots: { title: 'thirdNum' },
    desc: [
      '1）仅【教练班-精进班】，此字段才有数据，其余班型该字段为空',
      '2）该【教练班-精进班】班级，上课人数：开班日期之前，上课学员存在已缴清【教练班-进修班】卡，人数去重；若三阶卡【撤销】【结转】数据不需回退，【退卡】需要回退；'
    ]
  },
  {
    slotTitle: '续卡总个数（含往期）',
    align: 'center',
    width: 120,
    dataIndex: 'allRenewCardNum',
    slots: { title: 'allRenewCardNum' },
    desc: [
      '评分页面【上课人数】【特殊续卡】【往期续卡】三个模块续卡个数合计。刚生成教练班绩效数据时，未维护【特殊续卡、往期续续卡】数据，则仅计算【上课人数】的续卡总个数',
    ]
  },
  {
    slotTitle: '续卡人数（本期）',
    align: 'center',
    width: 120,
    dataIndex: 'allStuNum',
    slots: { title: 'allStuNum' },
    desc: [
      '评分页面【上课人数】模块，且签到卡作为往期卡，存在续卡，且续卡类型=本期续卡的学员人数+【特殊续卡】【往期续卡】模块，续卡类型=本期续卡的学员人数；（人数去重）',
    ]
  },
  {
    slotTitle: '续卡总个数（往期）',
    align: 'center',
    width: 120,
    dataIndex: 'allLostRenewCardNum',
    slots: { title: 'allLostRenewCardNum' },
    desc: [
      '评分页面【上课人数】【特殊续卡】【往期续卡】三个模块，续卡类型=往期续卡，续卡个数合计',
    ]
  },
  {
    slotTitle: '续卡人数（往期）',
    align: 'center',
    width: 120,
    dataIndex: 'allLostStuNum',
    slots: { title: 'allLostStuNum' },
    desc: [
      '评分页面【上课人数】模块，且签到卡作为往期卡，存在续卡，且续卡类型=往期续卡的学员人数+【特殊续卡】【往期续卡】模块，续卡类型=往期续卡的学员人数；（人数去重）',
    ]
  },
  {
    slotTitle: '续卡确认金额',
    align: 'center',
    width: 120,
    dataIndex: 'renewCardPrice',
    slots: { title: 'renewCardPrice' },
    desc: [
      '评分页面【上课人数】【特殊续卡】【往期续卡】三个模块【续卡确认金额】数据合计',
    ]
  },
  {
    slotTitle: '奖金退费',
    align: 'center',
    width: 120,
    dataIndex: 'refundPrice',
    slots: { title: 'refundPrice' },
    desc: [
      '评分页面维护的，刚生成教练班绩效数据时，未维护奖金退费数据，该字段就显示为【空】，不要显示为0',
    ]
  },
  {
    slotTitle: '得分',
    align: 'center',
    width: 120,
    dataIndex: 'totalScore',
    customRender: (val, record) => {
      return record.state === 'Y' ? val : ''
    },
    slots: { title: 'totalScore' },
    desc: [
      '数据计算都在【评分页面】，列表仅取数据。保留一位小数',
    ]
  },
  {
    slotTitle: '奖金',
    align: 'center',
    width: 120,
    dataIndex: 'rewardPrice',
    customRender: (val, record) => {
      return record.state === 'Y' ? val : ''
    },
    slots: { title: 'rewardPrice' },
    desc: [
      '四舍五入，取整数',
      '1）总分 >=80，奖金=【3000+（得分-80）*200】',
      '2）总分 <80，奖金=0'
    ]
  },
  {
    slotTitle: '实发奖金',
    align: 'center',
    width: 120,
    dataIndex: 'realPrice',
    customRender: (val, record) => {
      return record.state === 'Y' ? val : ''
    },
    slots: { title: 'realPrice' },
    desc: [
      '四舍五入，取整数',
      '1）总分 >=80，奖金=【3000+（得分-80）*200】-奖金退费',
      '2）总分 <80，奖金=0'
    ]
  },
  {
    slotTitle: '编辑时间',
    align: 'center',
    width: 120,
    dataIndex: 'editDate',
    slots: { title: 'editDate' },
    desc: [
      '精确到年月日 时分秒',
    ]
  },
  {
    slotTitle: '评分状态',
    align: 'center',
    width: 120,
    dataIndex: 'scoreState',
    customRender: (val, record) => {
      switch (val) {
        case 'A':
          return '未评分'
        case 'B':
          return '部分评分'
        case 'C':
          return '评分完成'
        default:
          return val
      }
    },
    slots: { title: 'scoreState' },
    desc: [
      '未评分、部分评分（存在评分项未评分）、评分完成（每个评分项至少有一人评分）',
    ]
  },
  {
    slotTitle: '评分人',
    align: 'center',
    width: 120,
    dataIndex: 'scorer',
    slots: { title: 'scorer' },
    desc: [
      '取操作评分的人的名称。可以多次评分，评分人、评分时间需要覆盖刷新',
    ]
  },
  {
    slotTitle: '评分时间',
    align: 'center',
    width: 120,
    dataIndex: 'scorerTime',
    slots: { title: 'scorerTime' },
    desc: [
      '可以多次评分，评分人、评分时间需要覆盖刷新',
    ]
  },
  {
    slotTitle: '确认状态',
    align: 'center',
    width: 120,
    dataIndex: 'state',
    customRender: (val, record) => {
      switch (val) {
        case 'Y':
          return '已确认'
        case 'N':
          return '未确认'
        default:
          return val
      }
    },
    slots: { title: 'state' },
    desc: [
      '已确认、未确认',
    ]
  },
  {
    slotTitle: '确认人',
    align: 'center',
    width: 120,
    dataIndex: 'confirmUserName',
    slots: { title: 'confirmUserName' },
    desc: [
      '可以多次确认，确认人、确认时间需要覆盖刷新',
    ]
  },
  {
    slotTitle: '确认时间',
    align: 'center',
    width: 120,
    dataIndex: 'confirmDate',
    slots: { title: 'confirmDate' },
    desc: [
      '可以多次确认，确认人、确认时间需要覆盖刷新',
    ]
  },
  {
    fixed: 'right',
    width: 100,
    title: '表单反馈',
    align: 'center',
    dataIndex: 'feedback',
    scopedSlots: { customRender: 'feedback' },
  },
  {
    fixed: 'right',
    width: 200,
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  }
]

export default {
  name: 'performanceManagement',
  components: {
    SearchComPro,
    STable,
    PermBox,
    performanceEdit,
    performanceFeedback,
    performancePrint
  },
  data() {
    return {
      columns,
      showSearch: false,
      selectedRowKeys: [],
      selectedRows: [],
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'chooseModal',
          key: 'teacher',
          label: '导师',
          placeholder: '请选择导师'
        },
        {
          type: 'empty'
        },
        {
          type: 'text',
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称'
        },
        {
          type: 'cascader',
          key: 'classTypeId',
          label: '班型',
          placeholder: '请选择班型',
          treeOps: {
            api: treeEduClassType,
            type: 'D',
            label: 'name',
            value: 'id',
            children: 'children'
          }
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
          type: 'date',
          key: 'Date',
          label: '开班日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'date',
          key: 'DateEdu',
          label: '结业日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'date',
          key: 'DateEduReal',
          label: '实际结业日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select',
          key: 'scoreStatus', // 根据key来筛选
          label: '评分状态',
          placeholder: '请选择评分状态',
          staticArr: [
            {
              string: '未评分',
              value: 'A'
            },
            {
              string: '部分评分',
              value: 'B'
            },
            {
              string: '评分完成',
              value: 'C'
            }
          ]
        },
        {
          type: 'select',
          key: 'confirmStatus', // 根据key来筛选
          label: '确认状态',
          placeholder: '请选择确认状态',
          staticArr: [
            {
              string: '已确认',
              value: 'Y'
            },
            {
              string: '未确认',
              value: 'N'
            }
          ]
        }
      ],
      queryParam: {},
      loadData: parameter => {
        return pageCoachClass(Object.assign(parameter, this.queryParam))
        // return Promise.resolve({ data: [{}] })
      }
    }
  },
  computed: {},
  created() {
    this.initEduClassType()
  },
  methods: {
    formatDate(text) {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    },
    handleRealEndDateChange(record, date) {
      let realEndDate = date.format('YYYY-MM-DD')
      const { id } = record
      editAchClassRealEndDate({ id, realEndDate }).then(res => {
        this._refreshTable()
      })
    },
    // 评分已完成
    isFinished() {},
    initEduClassType() {
      treeEduClassType({ type: 'D' }).then(res => {
        const index = this.searchParams.findIndex(d => d.key === 'classTypeId')
        let data = res.data || []
        this.searchParams[index].treeOps.options = data.filter(d => d.id === 'A' || d.id === 'd5b119a6-d7df-403d-a9e1-cb3de7af1479')
        this.showSearch = true
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    handleExport() {
      this.$refs.searchForm.getResult().then(res => {
        exportAchClassList(res).then(data => {
          this.$tools.exportExcel(data, '教练班绩效列表')
        })
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      // if (this.queryParam.classTypeId) {
      //   let arr = this.queryParam.classTypeId.split(',')
      //   this.queryParam.classTypeId = arr[arr.length - 1]
      // }
      this._refreshTable()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    async handleRecordDelete(e) {
      let ids = []
      for (const row of this.selectedRows) {
        const { id, state } = row
        if (state === 'Y') {
          this.$message.error('不允许删除已确认数据')
          ids = []
          break
        } else {
          ids.push(id)
        }
      }
      if (ids.length == 0) return
      ids = ids.join(',')
      try {
        let res = await deleteAchClassScore({ ids })
        this.$message.success('删除完成')
        this.selectedRowKeys = []
        this.selectedRows = []
        this._refreshTable()
      } catch (error) {}
    },
    handleFeedback(record) {
      this.$refs.feedback.open(record)
    },
    handleEdit(record) {
      this.$refs.performanceEdit.open(record)
    },
    handleEditConfirm(id, data) {
      this.$refs.performanceEdit.showLoading()
      listAchClassStudentSpecialSave({ id, studentCard: JSON.stringify(data) })
        .then(res => {
          if (res.code == 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.$refs.performanceEdit.close()
            this._refreshTable()
          }
        })
        .finally(() => {
          this.$refs.performanceEdit.hideLoading()
        })
    },
    handleScore(record) {
      this.pushToScore(record, 'edit')
    },
    handleConfirmScore(record) {
      const { id, className } = record
      this.pushToScore(record, 'confirm')
    },
    handleScoreDetail(record) {
      this.pushToScore(record, 'detail')
    },
    handlePrint(record) {
      this.pushToScore(record, 'print')
    },
    pushToScore(record, type) {
      const { id, className } = record
      this.$router.push({ path: `/education/performanceScore/${id}/${className}/${type}` })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped></style>
