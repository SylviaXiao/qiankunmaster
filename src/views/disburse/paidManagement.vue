<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" style="margin: 20px 0 ;">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <perm-box perm="finance:spending-pay:view">
        <s-table
          :showSlider="true"
          ref="table"
          size="default"
          :columns="sc_solumns"
          :data="loadData"
          :alert="false"
          rowKey="id"
          :scroll="{ x: 1700 }"
          :defaultRowKeys="true"
          totalMoney="price"
        >
          <div slot="paidAccountTitle" style="display:flex;">
            <div style="width:200px;">付款分馆</div>
            <div style="width:200px;">付款账户</div>
            <div style="width:100px;">付款金额</div>
            <div style="width:130px;">付款日期</div>
          </div>
          <span slot="paidAccount" slot-scope="text, record">
            <div v-for="(item, index) in record.finSpendingBanks" :key="index" style="display:flex;text-align:center;">
              <div style="width:200px;">{{ item.deptName }}</div>
              <div style="width:200px;">{{ item.bankNo }}</div>
              <div style="width:100px;">{{ Math.abs(item.price) }}</div>
              <div style="width:130px;">{{ item.confirmDate.slice(0, 10) }}</div>
            </div>
          </span>
          <span slot="priceDate" slot-scope="text">
            {{ text | filterDate }}
          </span>
        </s-table>
      </perm-box>
    </a-card>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { pagePaySpending, listOrgDept, listBank } from '@/api/education/card'

const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 12
    }
  }
}
const sc_solumns = [
  {
    title: '提交日期',
    dataIndex: 'date',
    width: 100,
    customRender: (text, record) => {
      const { date } = record
      if (record.isSplit) {
        const { date } = record
        return date
      }
      return date.split(' ')[0]
    }
  },

  {
    title: '支出类型',
    dataIndex: 'incType',
    width: 100,
    customRender: (text, record) => {
      const { incType } = record
      if (incType === 'A') {
        return '财务支出'
      } else if (incType === 'K') {
        return '财务收入'
      } else if (incType === 'B') {
        return '社保工资'
      }
    }
  },

  {
    title: '提交部门/分馆',
    dataIndex: 'deptName',
    width: 200,
    ellipsis: true,
    customRender: (text, record) => {
      const { deptName, parentDeptName } = record
      if (record.isSplit) {
        const { deptName, parentDeptName } = record
        return parentDeptName ? parentDeptName + '/' + deptName : deptName
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
    title: '总金额',
    dataIndex: 'price',
    width: 100,
    customRender: (text, record) => {
      const { price } = record
      if (record.isSplit) {
        const { price } = record
        return price
      } else {
        return price
      }
    }
  },
  {
    title: '数量',
    dataIndex: 'number',
    width: 100
  },
  {
    title: '单位',
    dataIndex: 'unit',
    scopedSlots: { customRender: 'unit' },
    width: 100
  },

  {
    title: '单价',
    dataIndex: 'price1',
    width: 100,
    customRender: (text, record) => {
      const { price, number } = record
      if (!record.isSplit) {
        return (price / number).toFixed(2)
      }
    }
  },
  {
    title: '是否有发票',
    dataIndex: 'invoice',
    width: 100,
    scopedSlots: { customRender: 'invoice' },
    customRender: (text, record) => {
      const { invoice } = record
      if (invoice === 1 && !record.isSplit) {
        return '是'
      } else if (invoice === 0 && !record.isSplit) {
        return '否'
      } else if (invoice === 2 && !record.isSplit) {
        return '不需要'
      } else if (invoice === null) {
        return ''
      }
    }
  },
  {
    title: '是否有抵扣',
    dataIndex: 'offset',
    width: 100,
    scopedSlots: { customRender: 'offset' },
    customRender: (text, record) => {
      const { offset } = record
      if (offset && !record.isSplit) {
        return '是'
      } else if (offset === false && !record.isSplit) {
        return '否'
      } else if (offset === null) {
        return ''
      }
    }
  },
  {
    dataIndex: 'paidAccount',
    width: 430,
    ellipsis: true,
    scopedSlots: { title: 'paidAccountTitle', customRender: 'paidAccount' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
    width: 100
  },
  {
    title: '来源',
    dataIndex: 'procinstNo1',
    width: 120,
    customRender: (text, record) => {
      if (record.procinstNo) {
        return '审批'
      } else {
        return '录入'
      }
    }
  },
  {
    title: '单号',
    dataIndex: 'procinstNo',
    width: 120
  },
  {
    title: '操作人',
    dataIndex: 'userName',
    width: 100
  }
]

export default {
  name: 'paidManagement',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'paidManagement') {
          let { deptId, feeName, price, endDate, startDate, startPriceDate, endPriceDate } = this.$route.query
          if (deptId) this.queryParam.deptKey = deptId
          if (feeName) this.queryParam.name = feeName
          if (price) this.queryParam.startPrice = price
          if (price) this.queryParam.endPrice = price
          if (endDate) this.queryParam.endDate = endDate
          if (startDate) this.queryParam.startDate = startDate
          if (startPriceDate) this.queryParam.startPriceDate = startPriceDate
          if (endPriceDate) this.queryParam.startDate = endPriceDate
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },

  data() {
    return {
      sc_solumns,
      defaultLayout,
      loadData: parameter => {
        return pagePaySpending(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
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
              string: '财务收入',
              value: 'K'
            },
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
        {
          type: 'text',
          key: 'name',
          label: '项目名称',
          placeholder: '请输入项目名称',
          show: true
        },

        //区间
        {
          type: 'section',
          key: 'Price',
          label: '总金额',
          minNum: 0, //最小值
          show: true
        },

        {
          type: 'select', // 静态select框
          key: 'invoice',
          label: '发票',
          placeholder: '请选择发票类型',
          staticArr: [
            {
              string: '是',
              value: 1
            },
            {
              string: '否',
              value: 0
            },
            {
              string: '不需要',
              value: 2
            }
          ],
          show: true
        },
        {
          type: 'select', // 静态select框
          key: 'offset',
          label: '抵扣',
          placeholder: '请选择抵扣类型',
          staticArr: [
            {
              string: '是',
              value: 'true'
            },
            {
              string: '否',
              value: 'false'
            }
          ]
        },
        {
          type: 'cascader',
          key: 'orgDeptPay',
          label: '付款分馆',
          placeholder: '请选择付款分馆',
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
          label: '付款账户',
          placeholder: '请选择付款账户',
          search: true,
          apiOption: {
            api: listBank, // promise类型的接口
            string: 'bankNo',
            value: 'id'
          }
        },

        {
          type: 'date',
          key: 'PriceDate',
          label: '付款日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'number',
          key: 'payPrice',
          label: '付款金额'
        }
      ],
      tableData: [],
      queryParam: {},
      loading: false,
      editVisible: false,
      spinning: false,
      id: null
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    searchSubmit(data) {
      if (data.cardName) delete data.cardName
      if (Object.keys(data).length === 0) {
        this.routeQuery = this.$route.query
      }
      if (data.deptKey) {
        let val = data.deptKey.split(',')
        data.deptKey = val[val.length - 1]
      }
      if (data.splitDeptKey) {
        let val1 = data.splitDeptKey.split(',')
        data.splitDeptKey = val1[val1.length - 1]
      }
      if (data.orgDeptPay) {
        let val = data.orgDeptPay.split(',')
        data.orgDeptPay = val[val.length - 1]
      }
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      this.$nextTick(() => {
        this.loadTable()
      })
    },
    loadTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.image_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/ .ant-table-row-level-1 {
  background-color: rgba(245, 227, 220, 0.1) !important;
  font-size: 12px !important;
}
/deep/ .ant-table-row-cell-break-word {
  text-align: center;
}
</style>
