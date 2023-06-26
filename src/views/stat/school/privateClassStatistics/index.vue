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
      :isInitLoad="true"
      :exportUrl="'/report/edu/areaClass/down'"
    ></ReportTable>
  </div>
</template>

<script>
  import moment from 'moment'
  import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
  import { areaClass } from '@/api/reports'
  import { getSchoolList } from '@/api/education/card'
  const defaultStart = moment()
    .date(1)
    .format('YYYY-MM-DD')
  const defaultEnd = moment()
    .format('YYYY-MM-DD')
  export default {
    name: 'privateClassStatistics',
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
                label: '分摊分馆',
                rowspan: 1,
                colspan: 1,
                style: 'min-width: 120px;'
              },
              {
                label: '学员总课时（分摊）',
                rowspan: 1,
                colspan: 1,
                style: 'min-width: 120px;'
              },
              {
                label: '已上总课时',
                rowspan: 1,
                colspan: 1,
                style: 'min-width: 120px;'
              },
              // {
              //   label: '当月已上课时数',
              //   rowspan: 1,
              //   colspan: 1,
              //   style: 'min-width: 120px;'
              // },
              {
                label: '剩余课时数',
                rowspan: 1,
                colspan: 1,
                style: 'min-width: 120px;'
              },
              {
                label: '明细',
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
            key: 'area',
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
            key: 'totalCount',
            value: 0,
            isTotal: true,
            isClick: false,
            formatValue: this.totalCount
          },
          {
            key: 'all',
            value: 0,
            isTotal: true,
            isClick: false,
            formatValue: this.toFixed
          },
          // {
          //   key: 'now',
          //   value: 0,
          //   isTotal: true,
          //   isClick: false,
          //   formatValue: this.toFixed
          // },
          {
            key: 'totalNotUseCount',
            value: 0,
            isTotal: true,
            isClick: false,
            formatValue: this.toFixed
          },
          {
            key: 'action',
            value: '',
            isTotal: false,
            isClick: true
          }
        ],
        //表内容
        loadData: [],
        //搜索项
        searchParams: [
          {
            type: 'treeSelect',
            key: 'school_id',
            label: '选择分馆',
            placeholder: '请选择分馆',
            expandAll: true,
            mutiple: true,
            show: true,
            isShow: !!!this.$store.getters.school_id,
            defaultVal: this.$store.getters.school_id || undefined,
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
            type: 'date',
            key: 'Date',
            label: '时间',
            show: true,
            placeholder: '请选择时间',
            format: 'YYYY-MM-DD',
            defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
            isDate: true
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
    },
    methods: {
      totalCount(record) {
        const { totalCount, totalCount2 } = record
        return this.$number(totalCount || 0).plus(totalCount2 || 0).toNumber().toFixed(2)
      },
      toFixed(record, key) {
        return (record[key] ? record[key] : 0).toFixed(2)
      },
      async init(data) {
        this.rpSpinning = true
        this.headList.forEach((col, colIndex) => {
          if (col.isTotal) col.value = 0
        })
        let res = await areaClass(data)
        this.total = res.count
        if (Array.isArray(res.data) && res.data.length > 0) {
          let loadData = []
          res.data.forEach((item, index) => {
            let data = []
            this.headList.forEach((col, colIndex) => {
              if (col.isTotal) col.value += col.formatValue ? Number(col.formatValue(item, col.key)) : (item[col.key] ? Number(item[col.key]) : 0)
              let dataItem = {
                key: col.key,
                label: col.formatValue ? col.formatValue(item, col.key) : item[col.key],
                rowspan: 1,
                colspan: 1,
                style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
                isClick: col.isClick,
                id: item.orgDeptId
              }
              if (col.key === 'action') {
                dataItem.label = '查看明细'
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
                colspan: colIndex == 0 ? 2 : 1,
                style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
                isClick: col.isClick,
                id: ''
              }
              if (col.isTotal) totalData.label = Number(col.value).toFixed(2)
              total.push(totalData)
            }
          })
          total[0].label = '总计'
          total[0].isClick = false
          total[0].style = ''
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
            name: 'privateClassStatisticsDetail'
          })
          const queryParam = Object.assign({}, this.queryParam, { school_id: data.id })
          localStorage.setItem('privateClassStatisticsSearchParams', JSON.stringify(queryParam))
          //结合open打开新的页面
          window.open(href, '_blank')
        }
      }
    }
  }
</script>

<style lang="less" scoped></style>
