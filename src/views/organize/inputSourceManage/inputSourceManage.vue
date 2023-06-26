<template>
  <div class="stu-leave-wrapper">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
      <a-card :bordered="false">
        <div class="btn-wrapper flex" style='justify-content: end;'>
          <perm-box perm="finance:online:save">
            <a-button icon="plus-circle" type="primary" @click="add()">新增</a-button>
          </perm-box>
          <a-button class='ml10' type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </div>
        <s-table ref="table" size="default" :columns="allocationColunm" :scroll='{x:2000}' :data="loadData" rowKey="id">
          <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:online:save">
              <a href="#" @click="edit(record)">修改</a>
            </perm-box>
             <perm-box perm="finance:onlineInfo:save">
              <a href="#" @click="addInfo(record)">新增</a>
            </perm-box>
            <perm-box perm="finance:online:del">
              <a href="#" @click="remove(record)">删除</a>
            </perm-box>
          </span>
        </s-table>
      </a-card>
    <inputSourceManageEdit ref="inputSourceManageEdit" @refresh="_refreshTable" :title="title"></inputSourceManageEdit>
    <inputSourceManageAdd ref="inputSourceManageAdd" @refresh="_refreshTable" title="新增收款信息"></inputSourceManageAdd>
  </div>
</template>
<script>
import {
  pageFinOnline,
  listIncomePlatform,
  listIncomeType,
  removeFinOnline
} from '@/api/organize'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import inputSourceManageEdit from './inputSourceManageEdit'
import inputSourceManageAdd from './inputSourceManageAdd'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
const allocationColunm = [
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
    title: '账号ID',
    dataIndex: 'incomeAccountId',
    key: 'incomeAccountId',
    ellipsis: true,
    width:200
  },
  {
    title: '登录',
    dataIndex: 'incomeSign',
    key: 'incomeSign',
    ellipsis: true,
    width:200
  },
  {
    title: '密码',
    dataIndex: 'incomePassword',
    key: 'incomePassword',
    ellipsis: true,
    width:200
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
    title: '营业执照',
    dataIndex: 'incomelicense',
    key: 'incomelicense',
    ellipsis: true,
    width:200
  },
  {
    title: '开户行',
    dataIndex: 'incomeBankDeposit',
    key: 'incomeBankDeposit',
    ellipsis: true,
    width:200
  },
  {
    title: '提现日期',
    dataIndex: 'incomeDate',
    key: 'incomeDate',
    width:100
  },
  {
    title: '发票信息',
    dataIndex: 'incomeInvoice',
    key: 'incomeInvoice',
    ellipsis: true,
    width:100
  },
  {
    title: '发票邮寄地址',
    dataIndex: 'incomeAddress',
    key: 'incomeAddress',
    ellipsis: true,
    width:200
  },
  {
    title: '到账周期',
    dataIndex: 'incomeReceipt',
    key: 'incomeReceipt',
    ellipsis: true,
    width:100
  },
  {
    title: '登陆网址',
    dataIndex: 'incomeUrl',
    key: 'incomeUrl',
    ellipsis: true,
    width:200
  },
  {
    title: '更新日期',
    dataIndex: 'createDate',
    key: 'createDate',
    width:135,
  },
  {
    title: '更新人员',
    dataIndex: 'userName',
    key: 'userName',
    ellipsis: true,
    width:100
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width:120
  }
]
export default {
  name: 'inputSourceManage',
  components: {
    inputSourceManageEdit,
    inputSourceManageAdd,
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
          type: 'text',
          key: 'userId',
          label: '更新人员',
          placeholder: '请输入更新人员'
        },
      ],
      allocationColunm,
      queryParam: {},
      loadData: parameter => {
        return pageFinOnline(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      title: ''
    }
  },

  methods: {
    //导出
    downloadStu() {
      let exportUrl ='/finance/online/downOnline'
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
        this.$refs.inputSourceManageAdd.backindData(record)
      })
    },
    add() {
      this.title = '新增收入渠道信息'
      this.$refs.inputSourceManageEdit.open()
    },
    edit(record) {
      this.title = '编辑收入渠道信息'
      this.$refs.inputSourceManageEdit.open()
      this.$nextTick(() => {
        this.$refs.inputSourceManageEdit.backindData(record)
      })
    },
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
          removeFinOnline(params).then(() => {
            this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            this._refreshTable()
          })
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
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
