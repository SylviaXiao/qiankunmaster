<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" style="margin: 20px 0 ;">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;" ref="elementBtn">
        <perm-box perm="finance:spending:payment-save">
          <a-button type="primary" @click="expendEnter()">财务支出录入</a-button>
        </perm-box>
        <perm-box style="margin-left:20px;" perm="finance:spending-social:save">
          <a-button type="primary" @click="socialSecurity()">社保工资录入</a-button>
        </perm-box>
        <perm-box style="margin-left:20px;" perm="finance:spending:payment-export">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </perm-box>
        <perm-box style="margin-left:20px;" perm="finance:splitproject:payment—view">
          <a-button type="primary" @click="danceClassType">
            舞种班型导出
          </a-button>
        </perm-box>
      </div>
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
          :expand="defaultRowKeysExpand"
          totalMoney="price"
        >
          <div slot="feeItemNameTitle" style="display:flex;">
            <div style="width:100px;">拆分金额</div>
            <div style="width:150px;">费用归类</div>
            <div style="width:150px;">财务归类</div>
            <div style="width:150px;">经营归类</div>
            <div style="width:150px;">成本归类</div>
            <div style="width:80px;"></div>
          </div>
          <span slot="feeItemName" slot-scope="text, record">
            <div v-for="(item, index) in record.mapQueryList" :key="index" style="display:flex;text-align:center;">
              <div style="width:100px;">{{ item.splitPrice }}</div>
              <div style="width:150px;">{{ item.feeItemName }}</div>
              <div style="width:150px;">{{ item.financeName }}</div>
              <div style="width:150px;">{{ item.operateName }}</div>
              <div style="width:150px;">{{ item.costName }}</div>
              <div style="width:80px;">
                <a-popover title="分摊" v-show="item.finSpendingItemSplitList && item.finSpendingItemSplitList.length > 0">
                  <template slot="content">
                    <div v-for="(items, index) in item.finSpendingItemSplitList" :key="index">
                      {{ items.date }}/{{ items.parentDeptName || '' }}<span v-if="items.parentDeptName">/</span>{{ items.deptName }}/{{ items.price }}
                    </div>
                  </template>
                  <a href="#">查看分摊</a>
                </a-popover>
              </div>
            </div>
          </span>
          <div slot="paidAccountTitle" style="display:flex;">
            <div style="width:200px;">付款分馆</div>
            <div style="width:200px;">付款账户</div>
            <div style="width:100px;">付款金额</div>
            <!-- <div style="width:130px;">付款日期</div> -->
          </div>
          <span slot="paidAccount" slot-scope="text, record">
            <div v-for="(item, index) in record.finSpendingBanks" :key="index" style="display:flex;text-align:center;">
              <div style="width:200px;">{{ item.deptName }}</div>
              <div style="width:200px;">{{ item.bankNo }}</div>
              <div style="width:100px;">{{ Math.abs(item.price) }}</div>
              <!-- <div style="width:130px;">{{ item.confirmDate.slice(0, 10) }}</div> -->
            </div>
          </span>
          <span slot="priceDate" slot-scope="text">
            {{ text | filterDate }}
          </span>
          <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:spending:payment-update">
              <a href="javascript:;" @click="edit(record)" v-if="!record.isSplit">修改</a>
            </perm-box>
            <perm-box perm="finance:spending:payment-del">
              <a href="#" @click="delect(record)" v-if="!record.isSplit">删除</a>
            </perm-box>
          </span>
        </s-table>
    </a-card>
    <fiscalChargesEnter ref="expenditure" @refresh="loadTable"></fiscalChargesEnter>
    <securitySpending ref="securitySpending" @refresh="loadTable"></securitySpending>
    <DanceClassTypeList ref="danceClassTypeList"></DanceClassTypeList>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { listOrgDept, getFiscalChargesList, deleteFiscalCharge, getBankList, getAllSysFeeItem } from '@/api/education/card'
import fiscalChargesEnter from './modules/fiscalChargesEnter.vue'
import securitySpending from './modules/securitySpending.vue'
import DanceClassTypeList from './modules/danceClassTypeList.vue'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
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
    title: '是否分摊舞种班型',
    dataIndex: 'projectType',
    width: 100,
    customRender: (text, record) => {
      let flag = text === 'A' ? '否' : text === 'B' ? '是' : ''
      return flag
    }
  },
  // {
  //   title: '大班型',
  //   dataIndex: 'eduTypeName',
  //   scopedSlots: { customRender: 'eduTypeName' },
  //   width: 100
  // },
  // {
  //   title: '小班型',
  //   dataIndex: 'eduClassTypeName',
  //   scopedSlots: { customRender: 'eduClassTypeName' },
  //   width: 100
  // },
  // {
  //   title: '舞种',
  //   dataIndex: 'eduDanceName',
  //   scopedSlots: { customRender: 'eduDanceName' },
  //   width: 100
  // },
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
    title: '是否可抵扣',
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
    dataIndex: 'feeItemName',
    width: 780,
    ellipsis: true,
    scopedSlots: { title: 'feeItemNameTitle', customRender: 'feeItemName' }
  },
  {
    dataIndex: 'paidAccount',
    width: 300,
    ellipsis: true,
    scopedSlots: { title: 'paidAccountTitle', customRender: 'paidAccount' }
  },

  {
    title: '付款日期',
    dataIndex: 'priceDate',
    width: 200,
    customRender: (text, record) => {
      return text?.split(' ')[0]
    }
  },
  {
    title: '开票公司',
    dataIndex: 'companyName',
    width: 200,
    scopedSlots: { customRender: 'companyName' }
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
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

export default {
  name: 'fiscalCharges',
  components: {
    SearchComPro,
    STable,
    PermBox,
    fiscalChargesEnter,
    securitySpending,
    DanceClassTypeList
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'spendManagement') {
          let { bankId, deptId, feeName, price, endDate, startDate, startPriceDate, endPriceDate, startMonth, endMonth, splitDeptKey } = this.$route.query
          if (deptId) this.queryParam.deptKey = deptId
          if (feeName) this.queryParam.name = feeName
          if (price) this.queryParam.startPrice = price
          if (price) this.queryParam.endPrice = price
          if (endDate) this.queryParam.endDate = endDate
          if (startDate) this.queryParam.startDate = startDate
          if (startMonth) this.queryParam.startMonth = startMonth
          if (endMonth) this.queryParam.endMonth = endMonth
          if (bankId) this.queryParam.bankId = bankId
          if (splitDeptKey) this.queryParam.splitDeptKey = splitDeptKey
          if (startPriceDate) this.queryParam.startPriceDate = startPriceDate
          if (endPriceDate) this.queryParam.endPriceDate = endPriceDate
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
      selectedRowKeys: [],
      sc_solumns,
      defaultLayout,
      loadData: parameter => {
        // { incType: 'A' }
        return getFiscalChargesList({...parameter, ...{ incType: 'A,B' }, ...this.queryParam}).then(res => {
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
          mode: 'multiple',
          staticArr: [
            // {
            //   string: '财务收入',
            //   value: 'K'
            // },
            {
              string: '财务支出',
              value: 'A'
            },
            {
              string: '社保工资',
              value: 'B'
            }
          ],
          show: true,
          // defaultVal: ['A', 'B']
        },
        {
          type: 'select', //动态select框
          key: 'bankId',
          label: '银行账户',
          placeholder: '请选择银行账户',
          search: true,
          apiOption: {
            api: getBankList, // promise类型的接口
            string: 'bankNo',
            value: 'id'
          },
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
          ]
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
          type: 'text',
          key: 'name',
          label: '项目名称',
          placeholder: '请输入项目名称'
        },
        {
          type: 'date',
          key: 'Month',
          label: '分摊月份',
          placeholder: '请选择月份',
          format: 'YYYY-MM',
          mode: ['month', 'month']
        },
        // {
        //   type: 'treeSelect',
        //   isShow: !!!this.$store.getters.school_id,
        //   key: 'splitDeptKey',
        //   label: '分摊部门',
        //   placeholder: '请选择分摊部门',
        //   expandAll: true,
        //   selectFather: true,
        //   treeOps: {
        //     api: listOrgDept,
        //     label: 'deptName',
        //     value: 'key',
        //     children: 'children'
        //   }
        // },
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
        },
        {
          type: 'text',
          key: 'procinstNo',
          label: '单号',
          placeholder: '请输入单号'
        }
      ],
      tableData: [],
      queryParam: {
        incType: 'A,B'
      },
      loading: false,
      editVisible: false,
      spinning: false,
      indexArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      id: null,
      pagination: {},
      count: null
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    danceClassType() {
      this.$refs.danceClassTypeList.open()
    },
    //导出
    downloadStu() {
      let exportUrl = '/finance/spending/pageFinSpendingByExportExcel/payment'
      const { queryParam } = this
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
    random(index) {
      let data = Math.floor(Math.random() * (9999 - 1 + 1)) + 1 + 'index' + index
      return data
    },
    // 修改支出录入
    edit(record) {
      if (record.incType === 'A' || record.incType === 'K') {
        this.$refs.expenditure.open(record.id, record.finSpendingId)
      } else {
        this.$refs.securitySpending.open(record.id, record.finSpendingId)
      }
    },
    //支出录入
    expendEnter() {
      this.$refs.expenditure.open(null, null, 'A', '支出录入')
    },
    //社保工资录入
    socialSecurity() {
      this.$refs.securitySpending.open()
    },
    //重置修改弹窗
    editreset() {
      Object.keys(this.form).forEach(item => {
        this.form[item] = ''
      })
    },
    editCancel() {
      this.editVisible = false
      this.editreset()
    },
    editSubmit() {},

    selectKeyHandle(e) {
      this.selectKey = e
      // this._refreshTable()
    },
    //删除
    delect(record) {
      this.$confirm({
        title: '系统提示',
        content: '确定要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          deleteFiscalCharge(record.id).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            this._refreshTable()
          })
        }
      })
    },

    searchSubmit(data, type) {
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
      if (type == 'isReset') {
        this.queryParam = { ...this.queryParam, incType: 'A,B' }
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.$nextTick(() => {
        // this.$refs.table.refresh()
        this.loadTable()
      })
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
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
