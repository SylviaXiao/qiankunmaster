<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" style="margin: 20px 0 ;">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle" defaultActiveKey="0">
        <a-tab-pane :tab="item.text" v-for="(item, index) in tabList" :key="item.type + ''">
          <div style="display:flex;justify-content: space-between;margin-bottom:20px;" v-if="selectKey === 'C'">
            <div></div>
            <a-radio-group @change="_refreshTable" v-model="finCardStatus">
              <a-radio-button value="A">未确认</a-radio-button>
              <a-radio-button value="B">已确认</a-radio-button>
              <a-radio-button value="">全部</a-radio-button>
            </a-radio-group>
          </div>
          <div class="btnClass">
            <perm-box perm="finance:fund:save">
              <a-button type="primary" icon="plus-circle" @click.native="openModal()" v-if="selectKey === 'B'">录入转出资金</a-button>
            </perm-box>
          </div>
          <perm-box :perm="selectKey === 'B' ? 'finance:fund:view' : 'finance:fund-into:view'">
            <s-table
              :showSlider="true"
              :sliderIndex="selectKey === 'B' ? 0 : 1"
              :ref="'table' + item.type"
              :columns="selectKey === 'B' ? columns : sc_columns"
              :data="loadData"
              :rowKey="(record, index) => index"
              :totalMoney="selectKey === 'B' ? 'price' : 'intoPrice'"
              :scroll="{ x: 2000 }"
            >
              <span slot="action" slot-scope="text, record">
                <perm-box perm="finance:fund:update">
                  <a href="javascript:;" @click="openModal(record)" v-if="selectKey === 'B'">修改</a>
                </perm-box>
                <perm-box perm="finance:fund:confirm">
                  <a href="javascript:;" @click="openModal(record)" v-if="selectKey === 'C' && !record.userName">确认收入</a>
                </perm-box>
                <perm-box perm="finance:fund:del">
                  <a href="javascript:;" @click="delect(record)">删除</a>
                </perm-box>
              </span>
            </s-table>
          </perm-box>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <cashFlow ref="cashFlow" :selectKey="selectKey" @refresh="_refreshTable" />
  </div>
</template>

<script>
import cashFlow from './modules/cashFlow'
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { listOrgDept, listBank, pageFinAccountFund, pageFinAccountFundInto, removeFinAccountFund } from '@/api/education/card'
import moment from 'moment'
const columns = [
  {
    title: '转出日期',
    dataIndex: 'date',
    key: 'date',
    scopedSlots: { customRender: 'date' },
    customRender: (text, record) => {
      return record.date.split(' ')[0]
    }
  },
  {
    title: '转出部门/分馆',
    dataIndex: 'parentDeptName',
    customRender: (text, record) => {
      const { deptName, parentDeptName } = record
      return parentDeptName + '-' + deptName
    }
  },
  {
    title: '转出费用归类',
    dataIndex: 'feeItemNameOut',
    width: '120px'
  },
  {
    title: '转出财务归类',
    dataIndex: 'financeNameOut',
    width: '120px'
  },
  {
    title: '转出经营归类',
    dataIndex: 'operateNameOut',
    width: '120px'
  },
  {
    title: '转出银行账户',
    dataIndex: 'bankNo',
    width: 200
  },
  {
    title: '转出金额',
    dataIndex: 'price'
  },
  {
    title: '转入部门/分馆',
    dataIndex: 'parentDeptNameInto',
    customRender: (text, record) => {
      const { deptNameInto, parentDeptNameInto } = record
      return parentDeptNameInto + '-' + deptNameInto
    }
  },
  {
    title: '转入银行账户',
    dataIndex: 'bankNoInto',
    width: 200
  },
  {
    title: '转入金额',
    dataIndex: 'intoPrice',
    customRender: (text, record) => {
      const { intoPrice } = record
      return intoPrice
    }
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作人',
    dataIndex: 'userName'
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const sc_columns = [
  {
    title: '转入日期',
    dataIndex: 'date',
    key: 'date',
    scopedSlots: { customRender: 'date' },
    customRender: (text, record) => {
      return record.date.split(' ')[0]
    }
  },
  {
    title: '转入部门/分馆',
    dataIndex: 'parentDeptNameInto',
    customRender: (text, record) => {
      const { deptNameInto, parentDeptNameInto } = record
      return parentDeptNameInto + '-' + deptNameInto
    }
  },
  {
    title: '转入费用归类',
    dataIndex: 'feeItemNameInto',
    width: '180px'
  },
  {
    title: '转入财务归类',
    dataIndex: 'financeNameInto',
    width: '120px'
  },
  {
    title: '转入经营归类',
    dataIndex: 'operateNameInto',
    width: '120px'
  },
  {
    title: '转入银行账户',
    dataIndex: 'bankNoInto',
    width: 200
  },
  {
    title: '转入金额',
    dataIndex: 'intoPrice'
  },
  {
    title: '转出部门/分馆',
    dataIndex: 'deptName',
    customRender: (text, record) => {
      const { deptName, parentDeptName } = record
      return parentDeptName + '-' + deptName
    }
  },
  {
    title: '转出银行账户',
    dataIndex: 'bankNo',
    width: 200
  },
  {
    title: '转出金额',
    dataIndex: 'inPrice',
    customRender: (text, record) => {
      const { price } = record
      return price
    }
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作人',
    dataIndex: 'userName'
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      columns,
      sc_columns,
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '操作日期',
          placeholder: '请选择转入/转出日期',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'cascader',
          key: 'outDeptKey',
          label: '转出校区',
          placeholder: '请选择转出校区',
          search: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'key',
            children: 'children'
          }
        },
        {
          type: 'select', //动态select框
          key: 'bankId',
          label: '转出银行',
          placeholder: '请选择银行账户',
          search: true,
          apiOption: {
            api: listBank, // promise类型的接口
            string: 'bankNo',
            value: 'id'
          }
        },
        {
          type: 'cascader',
          key: 'inDeptKey',
          label: '转入校区',
          placeholder: '请选择转入校区',
          search: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'key',
            children: 'children'
          }
        },
        {
          type: 'select', //动态select框
          key: 'bankIdInto',
          label: '转入银行',
          placeholder: '请选择银行账户',
          search: true,
          apiOption: {
            api: listBank, // promise类型的接口
            string: 'bankNo',
            value: 'id'
          }
        },
        //区间
        {
          type: 'section',
          key: 'Price',
          label: '金额',
          minNum: 0 //最小值
        }
        // {
        //   type: 'text',
        //   key: 'name',
        //   label: '关键字',
        //   placeholder: '请输入关键字'
        // }
      ],
      tabList: (() => {
        let arr = []
        if (this.handlePermBox('finance:fund:view')) {
          arr.push({ text: '账户转出资金列表', type: 'B', perm: 'finance:fund:view' })
        }
        if (this.handlePermBox('finance:fund-into:view')) {
          arr.push({ text: '账户转入资金列表', type: 'C', perm: 'finance:fund-into:view' })
        }
        return arr
      })(),
      selectKey: this.handlePermBox('finance:fund:view') ? 'B' : 'C',
      finCardStatus: 'A',
      loadData: parameter => {
        let request = pageFinAccountFund
        if (this.selectKey !== 'B') {
          request = pageFinAccountFundInto
          this.$set(this.queryParam, 'confirm', this.finCardStatus)
        }
        return request(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      queryParam: {}
    }
  },
  components: {
    SearchComPro,
    STable,
    cashFlow,
    PermBox
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'detailsTransactions') {
          this.initparams()
          this._refreshTable()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initparams(){
      let {  startDate, endDate, type ,price,bankId,deptKey} = this.$route.query
      if(startDate) {
        this.selectKey=type
        this.searchParams[0].defaultVal = [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
        this.queryParam={startDate, endDate,startPrice:price,endPrice:price}
        if(type==='B'){
          this.queryParam.outDeptKey=deptKey
          this.queryParam.bankId=bankId
          this.searchParams[2].initialValue = [bankId]
        }else{
          this.queryParam.inDeptKey=deptKey
          this.queryParam.bankIdInto=bankId
          this.searchParams[4].initialValue = [bankId]
        }
        this.searchParams[5].initialValue = price
        this.$forceUpdate()
      }
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    openModal(record) {
      this.$refs.cashFlow.open(record || '')
    },
    selectKeyHandle(e) {
      this.selectKey = e
      if (e === 'B') {
        delete this.queryParam.confirm
      }
      this._refreshTable()
    },
    delect(record) {
      this.$confirm({
        title: '系统提示',
        content: '确定要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeFinAccountFund(record.id).then(res => {
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
      if (data.cardName) delete data.cardName
      if (Object.keys(data).length === 0) {
        this.routeQuery = this.$route.query
      }
      if (data.inDeptKey) {
        let val = data.inDeptKey.split(',')
        data.inDeptKey = val[val.length - 1]
      }
      if (data.outDeptKey) {
        let val1 = data.outDeptKey.split(',')
        data.outDeptKey = val1[val1.length - 1]
      }
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      let str = `table${this.selectKey}`
      this.$nextTick(() => {
        if(this.$refs[str])this.$refs[str][0].refresh()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.btnClass {
  margin-bottom: 10px;
}
</style>
