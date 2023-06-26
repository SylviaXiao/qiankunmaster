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
        <s-table ref="table" size="default" :columns="allocationColunm" :scroll='{x:2000}' :data="loadData" rowKey="id">
          <span slot="action" slot-scope="text, record">
             <perm-box perm="finance:onlineInfo:save" v-if='record.status==="A"'>
              <a href="#" @click="addInfo(record)">修改</a>
            </perm-box>
            <perm-box perm="finance:onlineInfo:comfirm" v-if='record.status==="A"'>
              <a href="#" @click="confirm(record)">确认</a>
            </perm-box>
            <perm-box perm="finance:onlineInfo:del"  v-if='record.status==="A"'>
              <a href="#" @click="remove(record)">删除</a>
            </perm-box>
          </span>
        </s-table>
      </a-card>
    <inputSourceManageAdd ref="inputSourceManageAdd" @refresh="_refreshTable" title="修改收款信息"></inputSourceManageAdd>
    <inputSourceConfirm ref="inputSourceConfirm" @refresh="_refreshTable" title="确认收款信息"></inputSourceConfirm>
  </div>
</template>
<script>
import {
  listIncomePlatform,
  listIncomeType,
  removeFinOnlineInfo,
  pageOnlineChannelInfo
} from '@/api/organize'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import inputSourceManageAdd from './inputSourceManageAdd'
import inputSourceConfirm from './inputSourceConfirm'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment'
const allocationColunm = [
  {
    title: '操作日期',
    dataIndex: 'updateDate',
    key: 'updateDate',
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
    width:200
  },
  {
    title: '提现金额',
    dataIndex: 'incomeCash',
    key: 'incomeCash',
    ellipsis: true,
    width:150
  },
  {
    title: '打款方式',
    dataIndex: 'payType',
    customRender: (text, record) => (text === 'A' ? '对公' : text === 'B' ? '对私' : ''),
    width:100
  },
  {
    title: '银行账号',
    dataIndex: 'incomeBank',
    key: 'incomeBank',
    ellipsis: true,
    width:200
  },
  {
    title: '银行名称',
    dataIndex: 'bankName',
    ellipsis: true,
    width: 200
  },
  {
    title: '运营人员',
    dataIndex: 'userName',
    key: 'userName',
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
  {
    title: '到账日期',
    dataIndex: 'receivedDate',
    key: 'receivedDate',
    ellipsis: true,
    customRender: (text, record) => (text.slice(0,10)),
    width:100
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
    width:200
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width:120
  }
]
const defaultStart =  moment()
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .format('YYYY-MM-DD')
export default {
  name: 'receiptOnlineDetails',
  components: {
    inputSourceConfirm,
    inputSourceManageAdd,
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '操作日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
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
          type: 'select', // 静态select框
          key: 'payType',
          label: '打款方式',
          placeholder: '请选择打款方式',
          staticArr: [
            {
              string: '对公',
              value: 'A'
            },
            {
              string: '对私',
              value: 'B'
            }
          ]
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
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'receiptOnlineDetails') {
          let { incomeType, incomePlatform, incomeAccount, endIntoDate, startIntoDate,startDate,endDate} = this.$route.query
          if (incomeType) this.queryParam.incomeType = incomeType
          if (incomePlatform) this.queryParam.incomePlatform = incomePlatform
          if (incomeAccount) this.queryParam.incomeAccount = incomeAccount
          if (endIntoDate) this.queryParam.endIntoDate = endIntoDate
          if (startIntoDate) this.queryParam.startIntoDate = startIntoDate
          if (startDate) this.queryParam.startDate = startDate
          if (endDate) this.queryParam.endDate = endDate
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    remove(record) {
      let params = {
        id:record.id
      }
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeFinOnlineInfo(params).then(() => {
            this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            this._refreshTable()
          })
        }
      })
    },
    //导出
    downloadStu() {
      let exportUrl ='/finance/online/downOnlineInfo'
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
    addInfo(record) {
      this.$refs.inputSourceManageAdd.open()
      this.$nextTick(() => {
        this.$refs.inputSourceManageAdd.backindData(record,true)
      })
    },
    confirm(record) {
      this.$refs.inputSourceConfirm.open()
      this.$nextTick(() => {
        this.$refs.inputSourceConfirm.backindData(record)
      })
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
