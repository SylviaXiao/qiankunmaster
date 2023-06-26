<template>
  <div>
    <div ref="elementSearch" v-if="showSearchBox">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <div class="table-wrapper">
      <a-card :bordered="false">
        <div class="mt10 mb10">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </div>
        <s-table
          :rowKey="(record, index) => index"
          ref="table"
          size="default"
          :pageSizeOptions="pageSizeOptions"
          :columns="columns"
          :data="loadData"
          :scroll="{ x: 150 * columns.length }"
        >
          <span slot="payoff" slot-scope="text, record">
            <span v-if="record.payoffStatus">缴清</span>
            <span v-else style="color:red">{{ text | fixTofloat }}</span>
          </span>
        </s-table>
        <div v-for="item in totalList" :key="item.key">{{ item.title }}：{{ item.totalValue }}</div>
      </a-card>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { pageSizeOptions } from '@/utils/tableDetails/details'
import { STable, SearchComPro } from '@/components'
import { secondLevelReport } from '@/api/table/table'
import { getSchoolList } from '@/api/education/card'
import { getSelectStuSourceData } from '@/api/reception/student'
import { listChannelTree, listEduDance, treeEduClassType, listEduType } from '@/api/common'
const achievementReportColumns = [
  {
    title: '区域',
    dataIndex: 'deptName'
  },
  {
    title: '业务类型',
    dataIndex: 'dataType'
  },
  {
    title: '分馆',
    dataIndex: 'openDeptName'
  },
  {
    title: '操作时间',
    dataIndex: 'operationDate',
    customRender: (text, record) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '角色',
    dataIndex: 'roleName'
  },
  {
    title: '所属人',
    dataIndex: 'owner'
  },
  {
    title: '业绩分馆',
    dataIndex: 'achDeptName'
  },
  {
    title: '业绩金额',
    dataIndex: 'achPrice'
  },
  {
    title: '比例',
    dataIndex: 'radio'
  },
  {
    title: '实际绩效',
    dataIndex: 'actualAchPrice'
  },
  {
    title: '资源来源',
    dataIndex: 'source'
  },
  {
    title:'支付方式',
    dataIndex: 'dictValue'
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName'
  },
  {
    title: '学员手机号',
    dataIndex: 'stuPhone'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardType'
  },
  {
    title: '卡号',
    dataIndex: 'cardNo'
  },
  {
    title: '班级类型',
    dataIndex: 'cardTypeName'
  },
  {
    title: '班型',
    dataIndex: 'classTypeName'
  },
  {
    title: '卡状态',
    dataIndex: 'cardStatus'
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    scopedSlots: { customRender: 'payoff' }
  },
  {
    title: '收款金额',
    dataIndex: 'payment'
  },
  {
    title: '缴费进度',
    dataIndex: 'paymentProgress'
  },
  {
    title: '退费单号',
    dataIndex: 'refundNo'
  },
  {
    title: '是否允许业绩减半',
    dataIndex: 'allowHalf',
    customRender: (text, record) => {
      return text == 'N' ? '否' : text == 'Y' ? '是' : ''
    }
  },
  {
    title: '转入转出备注',
    dataIndex: 'transInOutRemark'
  }
]
import moment from 'moment'
import { getPayMethods } from '@/api/education'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
let stuSource = [
  {
    string: '客服',
    value: '客服'
  }
]
export default {
  name: 'achievementReportDetail',
  props: {},
  components: {
    STable,
    SearchComPro
  },
  data() {
    return {
      showSearchBox: false,
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '操作时间',
          show: true,
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'date',
          key: 'PayDate',
          label: '缴费/付款日期',
          show: true,
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'select',
          key: 'businessType',
          label: '业务类型 ',
          placeholder: '请选择业务类型 ',
          show: true,
          staticArr: [
            {
              string: '收入',
              value: 'A'
            },
            {
              string: '退费',
              value: 'B'
            },
            {
              string: '转入',
              value: 'C'
            },
            {
              string: '转出',
              value: 'D'
            }
          ]
        },
        {
          type: 'treeSelect',
          key: 'deptIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          isShow: !!!this.$store.getters.school_id,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'treeSelect',
          key: 'achDeptIds',
          label: '业绩分馆',
          placeholder: '请选择业绩分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          isShow: !!!this.$store.getters.school_id,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'role',
          label: '角色',
          placeholder: '请选择角色',
          show: true,
          staticArr: [
            {
              string: '客服',
              value: 'A'
            },
            {
              string: '顾问',
              value: 'B'
            },
            {
              string: '导师',
              value: 'C'
            }
          ]
        },
        {
          type: 'text',
          key: 'owner',
          label: '所属人',
          placeholder: '请输入所属人'
        },
        {
          type: 'select',
          key: 'primarySource',
          label: '来源一级',
          placeholder: '请选择来源一级',
          mode: 'multiple',
          search: true,
          staticArr: stuSource
        },
        {
          type: 'treeSelect',
          key: 'secondarySource',
          isShow: true,
          label: '来源二级',
          placeholder: '请选择来源二级',
          expandAll: false,
          mutiple: true,
          search: true,
          selectFather: true,
          noBranch: true,
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'chooseModal',
          key: 'service',
          label: '客服',
          placeholder: '请选择客服'
        },
        {
          type: 'select',
          key: 'paymentProgress',
          label: '缴费进度',
          mode: 'multiple',
          placeholder: '请选择缴费进度',
          staticArr: [
            {
              string: '全款',
              value: 'A'
            },
            {
              string: '定金',
              value: 'B'
            },
            {
              string: '补缴',
              value: 'C'
            }
          ]
        },
        {
          type: 'text',
          key: 'cardType',
          label: '卡种名称',
          placeholder: '请输入卡种名称'
        },
        {
          type: 'text',
          key: 'stuCardNo',
          label: '卡号',
          placeholder: '请输入卡号'
        },
        {
          type: 'text',
          key: 'refundNo',
          label: '退费单号',
          placeholder: '请输入退费单号'
        },
        {
          type: 'text',
          key: 'stuName',
          label: '学员姓名',
          placeholder: '请输入学员姓名'
        },
        {
          type: 'number',
          key: 'stuPhone',
          label: '学员手机号',
          placeholder: '请输入学员手机号'
        },
        {
          type: 'select',
          key: 'isHalf',
          label: '是否允许业绩减半',
          placeholder: '请选择是否允许业绩减半',
          staticArr: [
            {
              string: '是',
              value: 'Y'
            },
            {
              string: '否',
              value: 'N'
            }
          ]
        },
        {
          type: 'select',
          key: 'payoff',
          label: '是否缴清',
          placeholder: '请选择状态',
          staticArr: [
            {
              string: '已缴清',
              value: 'Y'
            },
            {
              string: '未缴清',
              value: 'N'
            }
          ]
        },
        {
          type: 'select', //动态select框
          key: 'stuCardType',
          label: '班级类型',
          placeholder: '请选择班级类型',
          mode: 'multiple',
          apiOption: {
            api: listEduType, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'cascader',
          key: 'stuCardClassType',
          label: '班型',
          placeholder: '请选择班型',
          treeOps: {
            api: treeEduClassType,
            type: 'D',
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'stuCardStatus',
          label: '卡状态',
          mode: 'multiple',
          placeholder: '请选择卡状态',
          staticArr: [
            {
              string: '未使用',
              value: 'A'
            },
            {
              string: '使用中',
              value: 'B'
            },
            {
              string: '停课',
              value: 'C'
            },
            {
              string: '退卡',
              value: 'D'
            },
            {
              string: '结业',
              value: 'E'
            },
            {
              string: '撤销',
              value: 'F'
            },
            {
              string: '结转',
              value: 'G'
            }
          ]
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'dictIds',
          label: '支付方式',
          placeholder: '请选择支付方式',
          expandAll: true,
          treeCheckable: false,
          mutiple:true,
          selectFather: false,
          treeOps: {
            api: getPayMethods,
            label: 'dictValue',
            value: 'id',
            children: 'children'
          }
        }
      ],
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: achievementReportColumns,
      queryParam: {},
      loadData: parameter => {
        let request = secondLevelReport
        return request(Object.assign(parameter, this.queryParam)).then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.totalList = this.columns.filter(item => {
              if (item.isTotal) {
                item.totalValue = res.data.map(col => col[item.key]).reduce((a, b) => parseFloat(a) + parseFloat(b))
                item.totalValue = item.totalValue?.toFixed(2)
              }
              return item.isTotal
            })
          } else {
            this.totalList = []
          }
          return res
        })
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'achievementReportDetail') {
          this.initSearchParams()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getSourceValue()
  },
  methods: {
    getSourceValue() {
      getSelectStuSourceData()
        .then(res => {
          return res.data
        })
        .then(res => {
          if (res instanceof Array) {
            res.forEach(item => {
              stuSource.push({
                string: item.sourceName,
                value: item.sourceName
              })
            })
          }
        })
    },
    initSearchParams() {
      let params = JSON.parse(localStorage.getItem('businessSummarySearchParams'))
      //  defaultValue={itemObj.initialValue ? (itemObj.mode == 'default' ? itemObj.initialValue : itemObj.initialValue.split(',')) : null}
      delete params.limit
      delete params.page
      this.queryParam = params
      this.searchParams.forEach(item => {
        if (item.type == 'date') {
          if (params['start' + item.key]) {
            item.defaultVal = [moment(params['start' + item.key], 'YYYY-MM-DD'), moment(params['end' + item.key], 'YYYY-MM-DD')]
          }
        } else if (item.type == 'treeSelect') {
          if (params[item.key]) {
            item.defaultVal = params[item.key].split(',')
          }
        } else if ((item.type == 'select' && item.mode === 'multiple') || item.type === 'cascader') {
          if (params[item.key]) {
            item.initialValue = params[item.key].split(',')
          }
        } else if (item.key == 'service') {
          item.initialValue = {
            [item.key]: params[item.key],
            [item.key + 'Id']: params[item.key + 'Id'],
            [item.key + 'DeptId']: params[item.key + 'DeptId']
          }
        } else {
          if (params[item.key]) {
            item.initialValue = params[item.key]
          }
        }
      })
      this.$forceUpdate()
      this.showSearchBox = true
      if (this.$refs.table) this.$refs.table.refresh()
    },
    //导出
    downloadStu() {
      let exportUrl = '/finance/achievementReport/secondLevelReportByExportExcel'
      const { queryParam } = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k != 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'school_id', value: this.$store.getters.school_id })
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
    searchSubmit(data, isReset) {
      this.queryParam = data
      if (isReset == 'isReset') {
        this.searchParams.forEach((item, index) => {
          if (item.type == 'date' || item.type == 'treeSelect') {
            if (item.key == 'Date') {
              this.searchParams[index].defaultVal = [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
            } else {
              delete this.searchParams[index].defaultVal
            }
          } else {
            delete this.searchParams[index].initialValue
          }
        })
        this.queryParam.startDate = defaultStart
        this.queryParam.endDate = defaultEnd
        this.$forceUpdate()
      }
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
