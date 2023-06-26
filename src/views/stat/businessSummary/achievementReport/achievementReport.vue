<template>
  <div>
    <!-- <f-frame :searchParamsArray="searchParams" src="/report?name=fin_source_income" perm="finance:stat:source:income" date="month"></f-frame> -->
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      @onShowSizeChange="onShowSizeChange"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :total="total"
      :showPagination="true"
      :isMerge="true"
      :hideReset="false"
      :exportUrl="'/finance/achievementReport/firstLevelReportByExportExcel'"
    ></ReportTable>
  </div>
</template>
<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { firstLevelReport } from '@/api/table/table'
import { getSchoolList } from '@/api/education/card'
import { getSelectStuSourceData } from '@/api/reception/student'
import { listChannelTree } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
let stuSource = [
  {
    string: '客服',
    value: '客服'
  }
]
export default {
  name: 'achievementReport',
  data() {
    return {
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: [
            {
              label: '区域',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '业务类型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '业绩分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '业绩金额',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            }
          ]
        }
      ],
      //表内容字段
      headList: [
        {
          key: 'parentDeptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'type',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'deptName',
          value: '',
          isTotal: false,
          isClick: false
        },

        {
          key: 'achPrice',
          value: 0,
          isTotal: true,
          isClick: false
        }
      ],
      //表内容
      loadData: [],
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '操作时间',
          show: true,
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'date',
          key: 'PayDate',
          label: '缴费/付款日期',
          show: true,
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'select',
          key: 'businessType',
          label: '业务类型 ',
          placeholder: '请选择业务类型 ',
          show: true,
          staticArr: [
            {
              string: '收入',
              value: 'A'
            },
            {
              string: '退费',
              value: 'B'
            },
            {
              string: '转入',
              value: 'C'
            },
            {
              string: '转出',
              value: 'D'
            }
          ]
        },
        {
          type: 'treeSelect',
          key: 'deptIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          isShow: !!!this.$store.getters.school_id,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'treeSelect',
          key: 'achDeptIds',
          label: '业绩分馆',
          placeholder: '请选择业绩分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          isShow: !!!this.$store.getters.school_id,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'role',
          label: '角色',
          placeholder: '请选择角色',
          show: true,
          staticArr: [
            {
              string: '客服',
              value: 'A'
            },
            {
              string: '顾问',
              value: 'B'
            },
            {
              string: '导师',
              value: 'C'
            }
          ]
        },
        {
          type: 'text',
          key: 'owner',
          label: '所属人',
          placeholder: '请输入所属人'
        },
        {
          type: 'select',
          key: 'primarySource',
          label: '来源一级',
          placeholder: '请选择来源一级',
          mode: 'multiple',
          search: true,
          staticArr: stuSource
        },
        {
          type: 'treeSelect',
          key: 'secondarySource',
          isShow: true,
          label: '来源二级',
          placeholder: '请选择来源二级',
          expandAll: false,
          mutiple: true,
          search: true,
          selectFather: true,
          noBranch: true,
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'chooseModal',
          key: 'service',
          label: '客服',
          placeholder: '请选择客服'
        },
        {
          type: 'select',
          key: 'paymentProgress',
          label: '缴费进度',
          mode: 'multiple',
          placeholder: '请选择缴费进度',
          staticArr: [
            {
              string: '全款',
              value: 'A'
            },
            {
              string: '定金',
              value: 'B'
            },
            {
              string: '补缴',
              value: 'C'
            }
          ]
        },
        {
          type: 'text',
          key: 'cardType',
          label: '卡种名称',
          placeholder: '请输入卡种名称'
        },
        {
          type: 'text',
          key: 'stuCardNo',
          label: '卡号',
          placeholder: '请输入卡号'
        },
        {
          type: 'text',
          key: 'refundNo',
          label: '退费单号',
          placeholder: '请输入退费单号'
        },
        {
          type: 'text',
          key: 'stuName',
          label: '学员姓名',
          placeholder: '请输入学员姓名'
        },
        {
          type: 'number',
          key: 'stuPhone',
          label: '学员手机号',
          placeholder: '请输入学员手机号'
        },
        {
          type: 'select',
          key: 'isHalf',
          label: '是否允许业绩减半',
          placeholder: '请选择是否允许业绩减半',
          staticArr: [
            {
              string: '是',
              value: 'Y'
            },
            {
              string: '否',
              value: 'N'
            }
          ]
        },
        {
          type: 'select',
          key: 'payoff',
          label: '是否缴清',
          placeholder: '请选择状态',
          staticArr: [
            {
              string: '已缴清',
              value: 'Y'
            },
            {
              string: '未缴清',
              value: 'N'
            }
          ]
        }
      ],
      queryParam: {},
      //表格是否加载
      rpSpinning: false,
      total: 0
    }
  },
  components: {
    ReportTable
  },
  created() {
    this.getSourceValue()
  },
  methods: {
    getSourceValue() {
      getSelectStuSourceData()
        .then(res => {
          return res.data
        })
        .then(res => {
          if (res instanceof Array) {
            res.forEach(item => {
              stuSource.push({
                string: item.sourceName,
                value: item.sourceName
              })
            })
          }
        })
    },
    async init(data) {
      this.rpSpinning = true
      let totalColspan = 0
      this.headList.forEach((col, colIndex) => {
        if (col.isTotal) col.value = 0
        if (!col.isTotal) totalColspan += 1
      })
      let res = await firstLevelReport(data)
      this.total = res.count
      if (Array.isArray(res.data) && res.data.length > 0) {
        let loadData = []
        res.data.forEach((item, index) => {
          let data = []
          this.headList.forEach((col, colIndex) => {
            if (col.isTotal) col.value += item[col.key] ? Number(item[col.key]) : 0
            let dataItem = {
              key: col.key,
              label: col.formatValue ? col.formatValue(item) : item[col.key],
              rowspan: 1,
              colspan: 1,
              style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isClick,
              id: ''
            }
            data.push(dataItem)
          })
          loadData.push({
            style: 'background:#fff;',
            data: JSON.parse(JSON.stringify(data))
          })
        })
        let total = []
        this.headList.forEach((col, colIndex) => {
          if (colIndex == 0 || col.isTotal) {
            let totalData = {
              key: col.key,
              label: col.value,
              rowspan: 1,
              colspan: colIndex == 0 ? totalColspan : 1,
              style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isClick,
              id: ''
            }
            if (col.isTotal) totalData.label = Number(col.value).toFixed(2)
            total.push(totalData)
          }
        })
        total[0].label = '总计(点击详情)'
        total[0].isClick = true
        total[0].style = 'color:#1BA97B;cursor:pointer;'
        loadData.push({
          style: 'background:#fff;',
          data: JSON.parse(JSON.stringify(total))
        })
        this.loadData = JSON.parse(JSON.stringify(loadData))
      } else {
        this.loadData = []
      }
      this.rpSpinning = false
    },
    onShowSizeChange(data) {
      this.queryParam = Object.assign(this.queryParam, data)
      this.init(this.queryParam)
    },
    searchSubmit(data, isReset) {
      this.queryParam = data
      if (isReset == 'isReset') {
        this.queryParam.startDate = defaultStart
        this.queryParam.endDate = defaultEnd
      }
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        const { href } = this.$router.resolve({
          name: 'achievementReportDetail'
        })
        localStorage.setItem('businessSummarySearchParams', JSON.stringify(this.queryParam))
        //结合open打开新的页面
        window.open(href, '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
