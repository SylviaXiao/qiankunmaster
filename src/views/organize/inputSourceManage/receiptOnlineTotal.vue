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
        <s-table ref="table" size="default" :columns="allocationColunm" :defaultPagination='true' :data="loadData" rowKey="id">
          <span slot="incomeType" slot-scope="text, record">
              <a href="#" @click="toDetail(record)">{{text}}</a>
          </span>
        </s-table>
      </a-card>
  </div>
</template>
<script>
import {
  listIncomeType,
  listOnline
} from '@/api/organize'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment'
const allocationColunm = [
  {
    title: '收入类别',
    dataIndex: 'incomeType',
    key: 'incomeType',
    ellipsis: true,
    scopedSlots: { customRender: 'incomeType' },
  },
  {
    title: '提现金额',
    dataIndex: 'incomeCash',
    key: 'incomeCash',
    ellipsis: true,
  },
  {
    title: '打款手续费',
    dataIndex: 'incomeFee',
    key: 'incomeFee',
    ellipsis: true,
  },
  {
    title: '到账金额',
    dataIndex: 'incomeReceived',
    key: 'incomeReceived',
  }
]
const defaultStart =  moment()
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'receiptOnlineTotal',
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
          type: 'date',
          key: 'Date',
          label: '到账日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
      ],
      allocationColunm,
      queryParam: {
        startDate : defaultStart,
        endDate : defaultEnd
      },
      loadData: parameter => {
        return listOnline(Object.assign(parameter, this.queryParam,{page:0,limit:0})).then(res => {
          if(Array.isArray((res.data))&&res.data.length>0){
            let incomeCash = res.data.reduce((sum, c) => (c.incomeCash || 0) + sum, 0)
            let incomeFee = res.data.reduce((sum, c) => (c.incomeFee || 0) + sum, 0)
            let incomeReceived =  res.data.reduce((sum, c) => (c.incomeReceived || 0) + sum, 0)
            res.data.push({
              isTotal:true,
              incomeType:'总计',
              incomeCash,
              incomeFee,
              incomeReceived
            })
          }
          return res
        })
      },
      title: ''
    }
  },

  methods: {
    //导出
    downloadStu() {
      let exportUrl ='/finance/online/downTotalOnlineExcel'
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
    toDetail(data) {
      let { endDate, startDate } = this.queryParam
      let id =data.isTotal?'all':data.incomeType
      const { href } = this.$router.resolve({
        name: 'receiptOnlineTotalDetails',
        params: {startDate: startDate, endDate: endDate,id: id},
      })
      //结合open打开新的页面
      window.open(href, '_blank')
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
      if(this.$refs.table)this.$refs.table.refresh()
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
