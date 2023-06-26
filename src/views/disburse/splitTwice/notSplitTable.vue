<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;text-align: right;" ref="elementBtn">
        <perm-box perm="finance:secspl:save">
          <a-button type="primary" @click="secondSplit()">二次分摊</a-button>
        </perm-box>
        <perm-box perm="finance:splrule:view">
          <a-button class='ml10' type="primary" @click="ruleMaintain()">规则维护</a-button>
        </perm-box>
      </div>
        <s-table
          :showSlider="false"
          :scroll="{ x: 1500 }"
          ref="table"
          size="default"
          :columns="two_solumns"
          :data="loadData"
          :alert="false"
          :rowKey="(record, index) => record.id"
          :rowSelection="rowSelection"
          totalMoney="price"
        >
          <span slot="finSecondSplits" slot-scope="text, record">
              <a-tooltip v-if="text.length>0" trigger='click'>
                <template slot="title">
                  <div v-for='(item ,index) in text' :key='index'>{{item.deptName}}</div>
                </template>
                <a href="javascript:;" >查看分摊</a>
              </a-tooltip>
          </span>
          <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:splrule:save" v-if='record.statue==="A"'>
              <a href="javascript:;" @click="editRules(record,'A')" >修改分摊</a>
            </perm-box>
            <perm-box perm="finance:splrule:save" v-if='record.statue==="C"'>
              <a href="javascript:;" @click="editRules(record,'C')" >新增规则</a>
            </perm-box>
          </span>
        </s-table>
    </a-card>
    <SecondSplit ref='SecondSplit' @refresh='_refreshTable'></SecondSplit>
    <SecondSplitRules ref='SecondSplitRules' ></SecondSplitRules>
    <SecondSplitAddRules ref='SecondSplitAddRules' title='编辑总部规则'  @refresh='_refreshTable'></SecondSplitAddRules>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import {  listOrgDept, getAllSysFeeItem, pageFinSecondSplit } from '@/api/education/card'
import SecondSplit from './secondSplit'
import SecondSplitRules from './secondSplitRules'
import SecondSplitAddRules from './secondSplitAddRules'
import moment from 'moment'
const two_solumns = [
  {
    title: '提交日期',
    dataIndex: 'date',
    width: 100,
    customRender: (text, record) => {
      const { date } = record
      if (record.isSplit) {
        const { date, price, deptName } = record
        return `${date.split(' ')[0]}/${deptName}/${price}`
      }
      return date.split(' ')[0]
    }
  },
  {
    title: '支出类型',
    dataIndex: 'incId',
    width: 120,
    customRender: (text, record) => {
      const { incId } = record
      if (incId === 'A') {
        return '财务支出'
      } else if (incId === 'K') {
        return '财务收入'
      } else if (incId === 'B') {
        return '社保工资'
      }
    }
  },
  {
    title: '提交部门/分馆',
    dataIndex: 'deptName1',
    width: 120,
    customRender: (text, record) => {
      const { deptName, parentDeptName } = record
      if (record.isSplit) {
        return ''
      } else {
        return parentDeptName ? parentDeptName + '/' + deptName : deptName
      }
    }
  },
  {
    title: '项目名称',
    dataIndex: 'feeName',
    width: 100,
    ellipsis: true,
    scopedSlots: { customRender: 'feeName' }
  },
  {
    title: '费用归类',
    dataIndex: 'feeItemName',
    width: 100,
    ellipsis: true
  },
  {
    title: '付款月份',
    dataIndex: 'priceDate',
    width: 100,
    customRender: (text, record) => {
     if(text)return text.slice(0,7)
      return ''
    }
  },
  {
    title: '分摊月份',
    dataIndex: 'splitDate',
    scopedSlots: { customRender: 'splitDate' },
    width: 100
  },
  {
    title: '分摊校区',
    dataIndex: 'splitDeptName',
    width: 200
  },
  {
    title: '分摊金额',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '二次分摊',
    dataIndex: 'finSecondSplits',
    width: 120,
    scopedSlots: { customRender: 'finSecondSplits' }
  },
  {
    title: '分摊业务模式',
    dataIndex: 'type',
    width: 100,
    customRender: (text, record) => {
      if (text === 'A') {
        return '总部定向分摊'
      } else if (text === 'B') {
        return '区域定向分摊'
      } else if (text === 'C') {
        return '总部资源分摊'
      } else if (text === 'D') {
        return '区域资源分摊'
      }else{
        return ''
      }
    }
  },
  {
    title: '状态',
    dataIndex: 'statue',
    width: 120,
    customRender: (text, record) => {
      if (text === 'A') {
        return '待分摊'
      }else if (text === 'B') {
        return '已分摊'
      } else if (text === 'C') {
        return '无规则'
      }else{
        return ''
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name:'NotSplitTable',
  data() {
    return {
      two_solumns,
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '提交日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          show: true
        },
        {
          type: 'select', // 静态select框
          key: 'incType',
          label: '支出类型',
          placeholder: '请选择类型',
          staticArr: [
            {
              string: '财务支出',
              value: 'A'
            },
            {
              string: '社保工资',
              value: 'B'
            }
          ],
          show: true
        },
        {
          type: 'text',
          key: 'name',
          label: '项目名称',
          placeholder: '请输入项目名称',
          show: true
        },
        {
          type: 'cascader',
          key: 'deptKey',
          label: '提交部门/分馆',
          placeholder: '请选择部门/分馆',
          search: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'key',
            children: 'children'
          },
          show: true
        },
        {
          type: 'cascader',
          key: 'feeItemName',
          label: '费用归类',
          placeholder: '请输入费用归类',
          search: true,
          treeOps: {
            api: getAllSysFeeItem,
            label: 'feeItemName',
            value: 'feeItemName',
            children: 'children',
            params: {
              type: 'A'
            }
          },
          show: true
        },
        {
          type: 'date',
          key: 'Month',
          label: '分摊月份',
          placeholder: '请选择时间',
          format: 'YYYY-MM',
          show: true,
          mode: ['month', 'month']
        },
        {
          type: 'cascader',
          key: 'splitDeptKey',
          label: '分摊校区',
          placeholder: '请选择分摊校区',
          search: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'key',
            children: 'children'
          }
        },
        //区间
        {
          type: 'section',
          key: 'Price',
          label: '分摊金额',
          minNum: 0,//最小值
        },
        {
          type: 'select', // 静态select框
          key: 'type',
          label: '分摊业务模式',
          placeholder: '请选择分摊业务模式',
          staticArr: [
            {
              string: '总部定向分摊',
              value: 'A'
            },
            {
              string: '区域定向分摊',
              value: 'B'
            },
            {
              string: '总部资源分摊',
              value: 'C'
            },
            {
              string: '区域资源分摊',
              value: 'D'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'statue',
          label: '状态',
          placeholder: '请选择状态',
          staticArr: [
            {
              string: '待分摊',
              value: 'A'
            },
            {
              string: '无规则',
              value: 'C'
            }
          ]
        },
        {
          type: 'date',
          key: 'PayMonth',
          label: '付款月份',
          placeholder: '请选择时间',
          format: 'YYYY-MM',
          mode: ['month', 'month']
        },
      ],
      queryParam: {},
      loadData: parameter => {
        if(!this.queryParam.statue)this.queryParam.statue='A,C'
        return pageFinSecondSplit(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },

  components: {
    SearchComPro,
    STable,
    PermBox,
    SecondSplit,SecondSplitRules,SecondSplitAddRules
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.statue!=='C'
          }
        })
      }
    }
  },

  created() {},
  methods: {
    //校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          let splitDate = Array.from(new Set(this.selectedRows.map(item=> item.splitDate)))
          if (splitDate.length > 1) {
            this.$notification['error']({
              message: '系统通知',
              description: '分摊月份必须唯一！'
            })
          }else{
            resolve()
          }
        }
      })
    },
    editRules(record,type){
      this.$refs.SecondSplitAddRules.open()
        this.$refs.SecondSplitAddRules.backindData(record,true)
    },
    secondSplit(){
      this.examine().then(() => {
        let record = this.selectedRows.map(item=> {
          return {"finSpendingSplitId":item.id,"feeItemName":item.feeItemName,"price":item.price,"deptId":item.splitDeptId,"date":item.splitDate}
        })
        this.$refs.SecondSplit.open()
        this.$refs.SecondSplit.backindData(record)
      })
    },
    ruleMaintain(){
      this.$refs.SecondSplitRules.open()
    },
    searchSubmit(data) {
      if (data.deptKey) {
        let val = data.deptKey.split(',')
        data.deptKey = val[val.length - 1]
      }
      if (data.splitDeptKey) {
        let val1 = data.splitDeptKey.split(',')
        data.splitDeptKey = val1[val1.length - 1]
      }
      if(data.startPayMonth){
        data.startPayMonth=data.startPayMonth+'-01'
        data.endPayMonth=data.endPayMonth+'-'+new Date(data.endPayMonth.slice(0,4), Number(data.endPayMonth.slice(5,7)), 0).getDate()
      }

      this.queryParam = Object.assign({ orgDeptId: this.queryParam.orgDeptId }, data)
      this._refreshTable()
    },
    _refreshTable() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" scoped></style>
