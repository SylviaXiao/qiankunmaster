<template>
  <div class="fin-profit-paytype-wrapper">
    <!-- <f-frame :searchParamsArray="searchParams" src="/report?name=fin_source_income" perm="finance:stat:source:income" date="month"></f-frame> -->
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      @onShowSizeChange="onShowSizeChange"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :isMerge="true"
      :hideReset="false"
      :exportUrl="'/student/stat/stuIncomeStatisticsByExportExcel'"
    ></ReportTable>
  </div>
</template>

<script>
  import moment from 'moment'
  import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
  import { stuIncomeStatistics } from '@/api/table/table'
  import { getSchoolList } from '@/api/education/card'
  import { getPayMethods } from '@/api/education'
  import { getSelectStuSourceData } from '@/api/reception/student'
  import { listChannelTree, listAllByArea } from '@/api/common'
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
    name: 'incomeStatistic',
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
                label: '缴费金额',
                rowspan: 1,
                colspan: 1,
                style: 'min-width: 120px;'
              },
              {
                label: '手续费',
                rowspan: 1,
                colspan: 1,
                style: 'min-width: 120px;'
              },
              {
                label: '到账金额',
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
            key: 'price',
            value: 0,
            isTotal: true,
            isClick: false
          },
          {
            key: 'serviceCharge',
            value: 0,
            isTotal: true,
            isClick: false
          },
          {
            key: 'paidPrice',
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
            label: '操作日期',
            show: true,
            format: 'YYYY-MM-DD',
            defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
            isDate: true
          },
          {
            type: 'date',
            key: 'TradeDate',
            label: '缴费日期',
            show: true,
            format: 'YYYY-MM-DD',
            isDate: true
          },
          {
            type: 'date',
            key: 'ConfirmDate',
            label: '到账日期',
            show: true,
            format: 'YYYY-MM-DD',
            isDate: true
          },
          // {
          //   type: 'treeSelect',
          //   key: 'area',
          //   label: '区域',
          //   placeholder: '请选择区域',
          //   expandAll: true,
          //   mutiple: true,
          //   show: true,
          //   isShow: true,
          //   treeCheckable: true,
          //   selectFather: true,
          //   treeOps: {
          //     api: listAllByArea,
          //     label: 'deptName',
          //     value: 'id',
          //     children: 'children'
          //   }
          // },
          {
            type: 'treeSelect',
            key: 'deptId',
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
            key: 'modeOfPayment',
            label: '支付方式',
            placeholder: '请选择支付方式',
            show: true,
            isShow: true,
            mode: 'multiple',
            apiOption: {
              api: getPayMethods,
              string: 'dictValue',
              value: 'id'
            }
          },
          {
            type: 'select',
            key: 'primarySource',
            label: '来源一级',
            placeholder: '请选择来源一级',
            show: true,
            search: true,
            staticArr: stuSource
          },
          {
            type: 'cascader',
            key: 'secondarySource',
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
            type: 'select',
            key: 'finType',
            label: '缴费进度',
            placeholder: '请选择',
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
            key: 'stuName',
            label: '学员姓名',
            placeholder: '请输入学员姓名'
          },
          {
            type: 'text',
            key: 'stuPhone',
            label: '学员手机号',
            placeholder: '请输入学员手机号'
          },
          {
            type: 'select',
            key: 'stuType',
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
          }
        ],
        queryParam: {},
        //表格是否加载
        rpSpinning: false,
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
        let res = await stuIncomeStatistics(data)
        if (Array.isArray(res?.data?.data) && res?.data?.data.length > 0) {
          let loadData = []
          res.data.data.forEach((item, index) => {
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
                id: item.deptId
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
            name: 'incomeStatisticDetail'
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
