<template>
  <div>
    <div ref="elementSearch" v-if="showSearchBox">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit"
                        :searchParams="searchParams"></search-com-pro>
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
  import { privateClassStatisticsColumns, pageSizeOptions } from '@/utils/tableDetails/details'
  import { STable, SearchComPro } from '@/components'
  import { areaStudent } from '@/api/reports'
  import { getSchoolList } from '@/api/education/card'
  import moment from 'moment'
  const defaultStart = moment()
    .date(1)
    .format('YYYY-MM-DD')
  const defaultEnd = moment()
    .format('YYYY-MM-DD')
  export default {
    name: 'privateClassStatisticsDetail',
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
            type: 'text',
            show: true,
            isShow: true,
            key: 'className',
            label: '班级名称',
            placeholder: '请输入班级名称'
          },
          {
            type: 'select',
            show: true,
            isShow: true,
            key: 'state',
            label: '班级状态',
            placeholder: '请选择班级状态',
            staticArr: [
              {
                string: '计划中',
                value: 'A'
              },
              {
                string: '上课中',
                value: 'B'
              },
              {
                string: '已结业',
                value: 'C'
              },
              {
                string: '停课',
                value: 'D'
              }
            ]
          },
          {
            type: 'text',
            show: true,
            isShow: true,
            key: 'student',
            label: '学员信息',
            placeholder: '学员姓名/手机号'
          },
          {
            type: 'text',
            show: true,
            isShow: true,
            key: 'stuCardNo',
            label: '卡号',
            placeholder: '请输入卡号'
          },
          {
            type: 'date',
            key: 'Date',
            label: '时间',
            show: true,
            placeholder: '请选择时间',
            format: 'YYYY-MM-DD',
            defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
            isDate: true
          }
        ],
        totalList: [],
        pageSizeOptions: pageSizeOptions,
        columns: privateClassStatisticsColumns,
        school_id: '',
        queryParam: {},
        loadData: parameter => {
          let request = areaStudent
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
          if (route.name == 'privateClassStatisticsDetail') {
            this.initSearchParams()
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {
      initSearchParams() {
        let params = JSON.parse(localStorage.getItem('privateClassStatisticsSearchParams'))
        //  defaultValue={itemObj.initialValue ? (itemObj.mode == 'default' ? itemObj.initialValue : itemObj.initialValue.split(',')) : null}
        delete params.limit
        delete params.page
        this.school_id = params.school_id
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
        let exportUrl = '/report/edu/areaStudent/down'
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
        let parameter = {}
        if (isReset == 'isReset') {
          parameter.startDate = defaultStart
          parameter.endDate = defaultEnd
        }
        this.queryParam = Object.assign(parameter, data, { school_id: this.school_id })
        this.$refs.table.refresh()
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
