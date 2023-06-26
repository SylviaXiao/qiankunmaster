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
      :exportUrl="'/refund/statistics/downRefundStatistics'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { refundStatistics } from '@/api/table/table'
import { getSchoolList } from '@/api/education/card'
import { getSelectStuSourceData } from '@/api/reception/student'
import { listChannelTree, listEduDance, treeEduClassType } from '@/api/common'
import { ageBracketNoPermissionList } from '@/api/system'
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
  name: 'refundStatistic',
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
              label: '卡种',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '大班型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '舞种',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '办卡金额',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '扣费合计',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '退费金额',
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
          key: 'deptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'eduCardName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'eduTypeName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'eduDanceName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'cardValue',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'totalRefund',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'refundPrice',
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
          label: '提交日期',
          show: true,
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'date',
          key: 'TradeDate',
          label: '付款日期',
          show: true,
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'date',
          key: 'CardDate',
          label: '办卡日期',
          show: true,
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'date',
          key: 'OpenDate',
          label: '开卡日期',
          show: true,
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'treeSelect',
          key: 'deptIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          isShow: true,
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
          key: 'sources',
          label: '来源一级',
          placeholder: '请选择来源一级',
          show: true,
          search: true,
          staticArr: stuSource
        },
        {
          type: 'cascader',
          key: 'channelIds',
          label: '来源二级',
          placeholder: '请选择来源二级',
          search: true,
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
          type: 'treeSelect',
          key: 'eduClassTypeId',
          label: '班型',
          placeholder: '请选择班型',
          expandAll: true,
          mutiple: true,
          isShow: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: treeEduClassType,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          mode: 'multiple',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'activation',
          label: '是否开卡',
          placeholder: '请选择是否开卡',
          staticArr: [
            {
              string: '是',
              value: 'A'
            },
            {
              string: '否',
              value: 'B'
            }
          ]
        },
        {
          type: 'text',
          key: 'eduCardId',
          label: '卡种名称',
          placeholder: '请输入卡种名称',
        },
        {
          type: 'text',
          key: 'stuCardNo',
          label: '卡号',
          placeholder: '请输入卡号',
        },
        {
          type: 'text',
          key: 'studentName',
          label: '学员姓名',
          placeholder: '请输入学员姓名'
        },
        {
          type: 'text',
          key: 'studentPhone',
          label: '学员手机号',
          placeholder: '请输入学员手机号'
        },
        {
          type: 'text',
          key: 'reufndNo',
          label: '退费单号',
          placeholder: '请输入退费单号'
        },
        {
          type: 'select',
          key: 'reason',
          label: '退费原因',
          mode: 'multiple',
          placeholder: '请选择退费原因',
          staticArr: [
            { string: '个人原因', value: '个人原因' },
            { string: '老师教学', value: '老师教学' },
            { string: '店面服务', value: '店面服务' },
            { string: '环境卫生', value: '环境卫生' },
            { string: '产品成果', value: '产品成果' },
            { string: '夸大宣传', value: '夸大宣传' },
            { string: '其他', value: '其他' }
          ]
        },
        {
          type: 'select',
          key: 'crowdType',
          label: '人群',
          placeholder: '请选择人群',
          staticArr: [
            {
              string: '成人',
              value: 'A'
            },
            {
              string: '少儿',
              value: 'B'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'ageBracket',
          label: '年龄段',
          placeholder: '请选择年龄段',
          apiOption: {
            api: ageBracketNoPermissionList, // promise类型的接口
            string: this.getAgeList,
            value: 'id'
          }
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
      let res = await refundStatistics(data)
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
    getAgeList(item) {
      return item.ageStart + '-' + item.ageEnd
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
          name: 'refundStatisticDetail'
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
