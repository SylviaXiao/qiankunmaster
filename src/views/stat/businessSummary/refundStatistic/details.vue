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
        </s-table>
        <div v-for="item in totalList" :key="item.key">{{ item.title }}：{{ item.totalValue }}</div>
      </a-card>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { refundStatisticColumns, pageSizeOptions } from '@/utils/tableDetails/details'
import { STable, SearchComPro } from '@/components'
import { refundStatisticsDetails } from '@/api/table/table'
import { getSchoolList } from '@/api/education/card'
import { getSelectStuSourceData } from '@/api/reception/student'
import { listChannelTree, listEduDance, treeEduClassType } from '@/api/common'
import { ageBracketNoPermissionList } from '@/api/system'
import moment from 'moment'
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
  name: 'refundStatisticDetail',
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
          label: '提交日期',
          show: true,
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'date',
          key: 'TradeDate',
          label: '付款日期',
          show: true,
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'date',
          key: 'CardDate',
          label: '办卡日期',
          show: true,
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'date',
          key: 'OpenDate',
          label: '开卡日期',
          show: true,
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'treeSelect',
          key: 'deptIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          isShow: true,
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
          key: 'sources',
          label: '来源一级',
          placeholder: '请选择来源一级',
          show: true,
          search: true,
          staticArr: stuSource
        },
        {
          type: 'cascader',
          key: 'channelIds',
          label: '来源二级',
          placeholder: '请选择来源二级',
          search: true,
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
          type: 'treeSelect',
          key: 'eduClassTypeId',
          label: '班型',
          placeholder: '请选择班型',
          expandAll: true,
          mutiple: true,
          isShow: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: treeEduClassType,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          mode: 'multiple',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'activation',
          label: '是否开卡',
          placeholder: '请选择是否开卡',
          staticArr: [
            {
              string: '是',
              value: 'A'
            },
            {
              string: '否',
              value: 'B'
            }
          ]
        },
        {
          type: 'text',
          key: 'eduCardId',
          label: '卡种名称',
          placeholder: '请输入卡种名称',
        },
        {
          type: 'text',
          key: 'stuCardNo',
          label: '卡号',
          placeholder: '请输入卡号',
        },
        {
          type: 'text',
          key: 'studentName',
          label: '学员姓名',
          placeholder: '请输入学员姓名'
        },
        {
          type: 'text',
          key: 'studentPhone',
          label: '学员手机号',
          placeholder: '请输入学员手机号'
        },
        {
          type: 'text',
          key: 'reufndNo',
          label: '退费单号',
          placeholder: '请输入退费单号'
        },
        {
          type: 'select',
          key: 'reason',
          label: '退费原因',
          mode: 'multiple',
          placeholder: '请选择退费原因',
          staticArr: [
            { string: '个人原因', value: '个人原因' },
            { string: '老师教学', value: '老师教学' },
            { string: '店面服务', value: '店面服务' },
            { string: '环境卫生', value: '环境卫生' },
            { string: '产品成果', value: '产品成果' },
            { string: '夸大宣传', value: '夸大宣传' },
            { string: '其他', value: '其他' }
          ]
        },
        {
          type: 'select',
          key: 'crowdType',
          label: '人群',
          placeholder: '请选择人群',
          staticArr: [
            {
              string: '成人',
              value: 'A'
            },
            {
              string: '少儿',
              value: 'B'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'ageBracket',
          label: '年龄段',
          placeholder: '请选择年龄段',
          apiOption: {
            api: ageBracketNoPermissionList, // promise类型的接口
            string: this.getAgeList,
            value: 'id'
          }
        }
      ],
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: refundStatisticColumns,
      queryParam: {},
      loadData: parameter => {
        let request = refundStatisticsDetails
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
        if (route.name == 'refundStatisticDetail') {
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
            item.defaultVal = params[item.key]
          }
        } else if ((item.type == 'select' && item.mode === 'multiple') || item.type === 'cascader') {
          if (params[item.key]) {
            item.initialValue = params[item.key].split(',')
          }
        } else if (item.key == 'service') {
          item.initialValue = {
            [item.key]: params[item.key],
            [item.key + 'Id']: params[item.key + 'Id'],
            [item.key + 'DeptId']: params[item.key + 'DeptId'],
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
    getAgeList(item) {
      return item.ageStart + '-' + item.ageEnd
    },
    //导出
    downloadStu() {
      let exportUrl = '/refund/statistics/downCardRefund'
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

<style lang="less" scoped>
</style>
