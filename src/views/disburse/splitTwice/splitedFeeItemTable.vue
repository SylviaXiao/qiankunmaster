<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
        <s-table
          ref="table"
          size="default"
          :columns="two_solumns"
          :data="loadData"
          :alert="false"
          :rowKey="(record, index) => record.id"
          totalMoney="price"
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
  getSchoolList, SecondSplitPageFee
} from '@/api/education/card'
import SecondSplit from './secondSplit'
import SecondSplitRules from './secondSplitRules'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const two_solumns = [
  {
    title: '分摊月份',
    dataIndex: 'date',
    width: 100,
    customRender: (text, record) => {
      if (text) {
        return text.slice(0,7)
      }else{
        return ''
      }
    },
  },
  {
    title: '费用归类',
    dataIndex: 'feeItemName',
    width: 100,
    ellipsis: true
  },
  {
    title: '二次分摊部门/分馆',
    dataIndex: 'deptName',
    width: 200
  },
  {
    title: '分馆分摊金额',
    dataIndex: 'price',
    width: 100
  },

]
export default {
  name:'splitedTable',
  data() {
    return {
      two_solumns,
      searchParams: [
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
          }
        },
        {
          type: 'date',
          key: 'Month',
          label: '分摊月份',
          placeholder: '请选择时间',
          format: 'YYYY-MM',
          mode: ['month', 'month']
        },
        //区间
        {
          type: 'treeSelect',
          isShow: true,
          key: 'secDeptKey',
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
          type: 'section',
          key: 'SecPrice',
          label: '分摊金额',
          minNum: 0,//最小值
        },
      ],
      queryParam: {},
      loadData: parameter => {
        if(!this.queryParam.statue)this.queryParam.statue='B'
        return SecondSplitPageFee(Object.assign(parameter, this.queryParam)).then(res => {
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
