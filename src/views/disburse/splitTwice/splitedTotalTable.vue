<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;text-align: right;" ref="elementBtn">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
      </div>
        <s-table
          :showSlider="false"
          :scroll="{ x: 1500 }"
          ref="table"
          size="default"
          :columns="two_solumns"
          :data="loadData"
          :alert="false"
          :rowKey="(record, index) => index"
          totalMoney="finSecondSplitPrice"
        >
        </s-table>
    </a-card>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import {
  listOrgDept,
  getAllSysFeeItem,
  pageFinSecondSplit,
  pageSecondSplitInfo,
  getSchoolList
} from '@/api/education/card'
import SecondSplit from './secondSplit'
import SecondSplitRules from './secondSplitRules'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

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
    title: '分摊月份',
    dataIndex: 'splitDate',
    customRender: (text, record) => {
      if (text) {
        return text.slice(0,7)
      }else{
        return ''
      }
    },
    width: 100
  },
  {
    title: '分摊校区',
    dataIndex: 'splitDeptName',
    width: 200
  },
  {
    title: '二次分摊',
    dataIndex: 'secSplitDeptName',
    width: 120,
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
    title: '分摊金额',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '分馆分摊金额',
    dataIndex: 'finSecondSplitPrice',
    width: 100,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    ellipsis: true
  },


]
export default {
  name:'splitedTable',
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
          label: '分摊金额(分摊前)',
          minNum: 0,//最小值
        },
        //区间
        {
          type: 'section',
          key: 'SecPrice',
          label: '分摊金额(分摊后)',
          minNum: 0,//最小值
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'secDeptId',
          label: '二次分摊分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
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
      ],
      queryParam: {},
      loadData: parameter => {
        if(!this.queryParam.statue)this.queryParam.statue='B'
        return pageSecondSplitInfo(Object.assign(parameter, this.queryParam)).then(res => {
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
  },
  computed: {
  },

  created() {},
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/finance/secspl/downSecSplInfo'
      const  queryParam  = this.queryParam
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
    editRules(record){
      let data = [{"finSpendingSplitId":record.id,"feeItemName":record.feeItemName,"price":record.price,"deptId":record.splitDeptId,"date":record.splitDate}]
      this.$refs.SecondSplit.open()
      this.$refs.SecondSplit.backindData(data,record)
    },
    secondSplit(){
      this.examine().then(() => {
        let record = this.selectedRows.map(item=> {
          return {"finSpendingSplitId":item.id,"feeItemName":item.feeItemName,"price":item.price,"deptId":item.splitDeptId,"date":item.splitDate}
        })
        this.$refs.SecondSplit.open()
        this.$refs.SecondSplit.backindData(record,{id:this.selectedRowKeys.join(',')})
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
