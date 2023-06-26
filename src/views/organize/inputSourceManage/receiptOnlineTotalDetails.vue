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
      :exportUrl="'/finance/online/downOnlineDetail'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { listIncomePlatform, listIncomeType, pageOnlineChannelInfo } from '@/api/organize'
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
              label: '到账日期',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '收入类别',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '收入平台',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '提现金额',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '打款手续费',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '到账金额',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
          ]
        }
      ],
      //表内容字段
      headList: [
        {
          key: 'receivedDate',
          value: '',
          isTotal: false,
          isClick: false,
          formatValue:(text)=>{
            return text.receivedDate?.slice(0,10)
          }
        },
        {
          key: 'incomeType',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'incomePlatform',
          value: '',
          isTotal: false,
          isClick: true
        },
        {
          key: 'incomeCash',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'incomeFee',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'incomeReceived',
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
          type: 'select',
          key: 'incomeType',
          label: '收入类别',
          placeholder: '请选择收入类别',
          mode:'multiple',
          apiOption: {
            api: listIncomeType,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'incomePlatform',
          label: '收入平台',
          placeholder: '请选择收入平台',
          mode:'multiple',
          apiOption: {
            api: listIncomePlatform,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'date',
          key: 'IntoDate',
          label: '到账日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
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
    this.initSearchParams(true)
  },
  methods: {
    initSearchParams(flag) {
      let {  endDate, startDate,id } = this.$route.params
      if(endDate&& startDate){
        this.queryParam.startIntoDate = startDate
        this.queryParam.endIntoDate = endDate
       if(flag) this.searchParams[2].defaultVal=[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      }
      if(id&&id!=='all'){
        this.queryParam.incomeType = id
        if(flag) this.searchParams[0].initialValue=id.split(',')
      }
      this.$forceUpdate()
      this.init(this.queryParam)
    },
     init(data) {
      this.rpSpinning = true
       pageOnlineChannelInfo(data).then(res=>{
         let totalColspan = 0
         this.headList.forEach((col, colIndex) => {
           if (col.isTotal) col.value = 0
           if (!col.isTotal) totalColspan += 1
         })
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
                 id: item.incomePlatform
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
                 id: 'all'
               }
               if (col.isTotal) totalData.label = Number(col.value).toFixed(2)
               total.push(totalData)
             }
           })
           total[0].label = '总计'
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
       })
    },
    getAgeList(item) {
      return item.ageStart + '-' + item.ageEnd
    },
    onShowSizeChange(data) {
      this.queryParam = Object.assign(this.queryParam, data)
      this.init(this.queryParam)
    },
    searchSubmit(data, isReset) {
      if(data.IntoDate||Array.isArray(data.incomeType)){
        this.queryParam.page=data.page
        this.queryParam.limit=data.limit
        this.initSearchParams()
      }else{
        this.queryParam = data
        if (isReset === 'isReset') {
          this.queryParam.startIntoDate = defaultStart
          this.queryParam.endIntoDate = defaultEnd
        }
        this.init(this.queryParam)
      }
    },
    toDetail(data) {
      if (data.isClick) {
        let { endIntoDate, startIntoDate } = this.queryParam
        let id =data.id
        const { href } = this.$router.resolve({
          name: 'OnlineClassDetails',
          params: {startDate: startIntoDate, endDate: endIntoDate,id: id},
        })
        //结合open打开新的页面
        window.open(href, '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
