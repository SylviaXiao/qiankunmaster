<template>
  <div>
    <div ref="elementSearch">
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
          :defaultPagination="true"
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
import { pageSizeOptions } from '@/utils/tableDetails/details'
import { STable, SearchComPro } from '@/components'
import { auditStat, procdefList, listAllOrgDeptTreeNoSchoolId } from '@/api/table/table'
const achievementReportColumns = [
  {
    title: '分馆',
    dataIndex: 'branchName'
  },
  {
    title: '单据数量',
    dataIndex: 'receiptsNum'
  },
  {
    title: '审核次数',
    dataIndex: 'auditNum'
  },
  {
    title: '驳回次数',
    dataIndex: 'rejectNum'
  },
  {
    title: '通过次数',
    dataIndex: 'passNum'
  }
]
import moment from 'moment'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'refundStatisticTable',
  props: {},
  components: {
    STable,
    SearchComPro
  },
  data() {
    return {
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '时间',
          show: true,
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'treeSelect',
          key: 'branchIds',
          label: '选择分馆',
          placeholder: '请选择选择分馆',
          expandAll: true,
          isShow: !!!this.$store.getters.school_id,
          mutiple: true,
          show: true,
          treeCheckable: false,
          noBranch: true,
          selectFather: true,
          treeOps: {
            api: listAllOrgDeptTreeNoSchoolId,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'cascader',
          key: 'procdefId',
          label: '单据类型',
          show: true,
          search: true,
          placeholder: '请选择单据类型',
          changeOnSelect: 'A',
          initialValue: ['bc8451dbacd44573944742a3a4b0c641', '1OQ8Ow'],
          treeOps: {
            api: procdefList,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        }
      ],
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: achievementReportColumns,
      queryParam: { startDate: defaultStart, endDate: defaultEnd, procdefId: 'bc8451dbacd44573944742a3a4b0c641,1OQ8Ow' },
      loadData: parameter => {
        let params = Object.assign(parameter, this.queryParam)
        delete params.limit
        delete params.page
        return auditStat(params).then(res => {
          return res
        })
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/refund/auditStatDown'
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
    searchSubmit(data, reset) {
      this.queryParam = data
      if (reset == 'isReset') {
        this.queryParam = {
          startDate: defaultStart,
          endDate: defaultEnd,
          procdefId: 'bc8451dbacd44573944742a3a4b0c641,1OQ8Ow'
        }
      }
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
