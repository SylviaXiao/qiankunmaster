<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <perm-box perm="finance:spending-dept:view">
        <s-table
          :showSlider="true"
          :scroll="{ x: 1500 }"
          ref="table"
          size="default"
          :columns="two_solumns"
          :data="loadData"
          :alert="false"
          :rowKey="(record, index) => index"
          totalMoney="price"
        >
        </s-table>
      </perm-box>
    </a-card>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { pageDeptFinSpending, listOrgDept, getAllSysFeeItem } from '@/api/education/card'
import { feeItemList } from '@/api/common'
import { mapGetters } from "vuex"

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
    // customRender: (text, record) => {
    //   const { parentOperateName, operateName } = record
    //   if (parentOperateName) {
    //     return operateName
    //   } else {
    //     return null
    //   }
    // }
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
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    ellipsis: true
  },
  {
    title: '操作人',
    dataIndex: 'userName',
    width: 100
  }
]
export default {
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
          label: '提交部门',
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
        //区间
        {
          type: 'section',
          key: 'Price',
          label: '分摊金额',
          minNum: 0,
          show: true //最小值
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
          mode: ['month', 'month']
        },
        {
          type: 'cascader',
          key: 'splitDeptKey',
          label: '分摊部门',
          placeholder: '请选择分摊部门',
          search: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'key',
            children: 'children'
          }
        },
        {
          type: 'date',
          key: 'PriceDate',
          label: '付款日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        }
      ],
      queryParam: {},
      loadData: parameter => {
        return pageDeptFinSpending(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },

  components: {
    SearchComPro,
    STable,
    PermBox
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'branchManagement') {
          let { deptId, feeName, price, endDate, startDate, startPriceDate, endPriceDate, startMonth, endMonth } = this.$route.query
          if (deptId) this.queryParam.deptKey = deptId
          if (feeName) this.queryParam.name = feeName
          if (price) this.queryParam.startPrice = price
          if (price) this.queryParam.endPrice = price
          if (endDate) this.queryParam.endDate = endDate
          if (startDate) this.queryParam.startDate = startDate
          if (startPriceDate) this.queryParam.startPriceDate = startPriceDate
          if (endPriceDate) this.queryParam.endPriceDate = endPriceDate
          if (startMonth) this.queryParam.startMonth = startMonth
          if (endMonth) this.queryParam.endMonth = endMonth
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {},

  created() {},
  methods: {
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
      this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" scoped></style>
