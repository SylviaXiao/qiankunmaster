<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" style="margin: 20px 0 ;">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <perm-box perm="finance:spending-detail:view">
        <s-table
          :showSlider="true"
          :expand="defaultRowKeysExpand"
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
            <div style="width:100px;">付款账户</div>
            <div style="width:150px;">付款金额</div>
            <div style="width:150px;">付款日期</div>
          </div>
          <span slot="paidAccount" slot-scope="text, record">
            <div v-for="(item, index) in record.finSpendingBanks" :key="index" style="display:flex;text-align:center;">
              <div style="width:100px;">{{ item.bankNo }}</div>
              <div style="width:150px;">{{ item.price }}</div>
              <div style="width:150px;">{{ item.confirmDate.slice(0, 10) }}</div>
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
import { pageSpendDetails, listOrgDept, pageFinSpending, removeFinSpendingItem, listBank, getAllSysFeeItem } from '@/api/education/card'

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
    width: 130,
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
    title: '金额',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '费用归类',
    dataIndex: 'feeItemName',
    width: 100
  },
  {
    title: '财务归类',
    dataIndex: 'financeName',

    width: 100
  },

  {
    title: '经营归类',
    dataIndex: 'operateName',
    width: 100
  },
  {
    title: '成本归类',
    dataIndex: 'costName',
    width: 100
  }
]

export default {
  name: 'feeManagement',
  components: {
    SearchComPro,
    STable,
    PermBox
  },

  data() {
    return {
      sc_solumns,
      defaultLayout,
      loadData: parameter => {
        return pageSpendDetails(Object.assign(parameter, this.queryParam)).then(res => {
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
          type: 'select',
          key: 'feeItemName',
          label: '费用归类',
          placeholder: '请输入费用归类',
          search: true,
          apiOption: {
            api: getAllSysFeeItem,
            string: 'feeItemName',
            value: 'feeItemName',
            // children: 'children',
            params: {
              type: 'A'
            }
          },
          show: true
        },
        {
          type: 'cascader',
          key: 'financeName',
          label: '财务归类',
          placeholder: '请输入财务归类',
          search: true,
          treeOps: {
            api: getAllSysFeeItem,
            label: 'feeItemName',
            value: 'feeItemName',
            children: 'children',
            params: {
              type: 'B'
            }
          }
        },
        {
          type: 'cascader',
          key: 'operateName',
          label: '经营归类',
          placeholder: '请输入经营归类',
          search: true,
          treeOps: {
            api: getAllSysFeeItem,
            label: 'feeItemName',
            value: 'feeItemName',
            children: 'children',
            params: {
              type: 'C'
            }
          }
        },
        {
          type: 'cascader',
          key: 'costName',
          label: '成本归类',
          placeholder: '请输入成本归类',
          search: true,
          treeOps: {
            api: getAllSysFeeItem,
            label: 'feeItemName',
            value: 'feeItemName',
            children: 'children',
            params: {
              type: 'D'
            }
          }
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
    //让列表二级可以收缩
    defaultRowKeysExpand(expanded, record) {
      if (expanded) {
        // 设置展开窗Key
        this.$refs.table.defaulKeys.push(record.id)
      } else {
        if (this.$refs.table.defaulKeys.length) {
          this.$refs.table.defaulKeys = this.$refs.table.defaulKeys.filter(v => {
            return v != record.id
          })
        }
      }
    },
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
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      this.$nextTick(() => {
        // this.$refs.table.refresh()
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
