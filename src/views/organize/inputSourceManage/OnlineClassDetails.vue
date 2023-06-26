<template>
  <div class="stu-leave-wrapper">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
      <a-card :bordered="false">
        <div class="btn-wrapper flex" style='justify-content: end;'>
          <a-button class='ml10' type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </div>
        <s-table ref="table" size="default" :columns="allocationColunm" :data="loadData" rowKey="id">
          <span slot="incomeAccount" slot-scope="text, record">
              <a href="#" @click="toDetail(record)">{{text}}</a>
          </span>
        </s-table>
      </a-card>
  </div>
</template>
<script>
import {
  listIncomePlatform,
  listIncomeType,
  pageOnlineChannelInfo
} from '@/api/organize'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment'
const allocationColunm = [
  {
    title: '到账日期',
    dataIndex: 'receivedDate',
    key: 'receivedDate',
    ellipsis: true,
    customRender: (text, record) => (text.slice(0,10)),
    width:100
  },
  {
    title: '收入类别',
    dataIndex: 'incomeType',
    key: 'incomeType',
    ellipsis: true,
    width:130
  },
  {
    title: '收入平台',
    dataIndex: 'incomePlatform',
    key: 'incomePlatform',
    ellipsis: true,
    width:100
  },
  {
    title: '账号',
    dataIndex: 'incomeAccount',
    ellipsis: true,
    width:200,
    scopedSlots: { customRender: 'incomeAccount' },
  },
  {
    title: '提现金额',
    dataIndex: 'incomeCash',
    key: 'incomeCash',
    ellipsis: true,
    width:150
  },
  {
    title: '打款手续费',
    dataIndex: 'incomeFee',
    key: 'incomeFee',
    ellipsis: true,
    width:100
  },
  {
    title: '到账金额',
    dataIndex: 'incomeReceived',
    key: 'incomeReceived',
    width:100
  },
]
const defaultStart =  moment()
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .format('YYYY-MM-DD')
export default {
  name: 'receiptOnlineDetails',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
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
          type: 'text',
          key: 'incomeAccount',
          label: '账号',
          placeholder: '请输入账号'
        },
        {
          type: 'date',
          key: 'IntoDate',
          label: '到账日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
        },
      ],
      allocationColunm,
      queryParam: {
        startDate : defaultStart,
        endDate : defaultEnd
      },
      loadData: parameter => {
        return pageOnlineChannelInfo(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      title: ''
    }
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
        if(flag) this.searchParams[3].defaultVal=[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      }
      if(id&&id!=='all'){
        this.queryParam.incomePlatform = id
        if(flag) this.searchParams[1].initialValue=id.split(',')
      }
      this.$forceUpdate()
      this._refreshTable()
    },
    toDetail(data) {
      let { incomeType,incomePlatform, incomeAccount, receivedDate,updateDate} = data
      this.$router.push({
        name: 'receiptOnlineDetails',
        query: {incomeType,incomePlatform, incomeAccount, endIntoDate:receivedDate.slice(0,10), startIntoDate:receivedDate.slice(0,10),
          startDate: updateDate.slice(0,10), endDate:updateDate.slice(0,10)},
      })
    },
    //导出
    downloadStu() {
      let exportUrl ='/finance/online/downTwoOnlineDetail'
      const queryParam = this.queryParam
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k != 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },
    searchSubmit(data, reset) {
      this.queryParam = data
      if (reset === 'isReset') {
        this.queryParam.startDate = defaultStart
        this.queryParam.endDate = defaultEnd
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-wrapper {
  .btn-wrapper {
    margin-bottom: 20px;
  }
}
</style>
