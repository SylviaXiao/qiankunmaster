<template>
  <div class="reports-iframe-wrapper">
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
          :scroll="{ x: true }"
        >
          <!-- <span slot="salTypeName" slot-scope="text, record">
            <a href="javascript:;" @click="toSalTypeName(record)">{{ text }}</a>
          </span>
          <span slot="num" slot-scope="text, record">
            <a href="javascript:;" @click="toNum(record)">{{ text }}</a>
          </span> -->
        </s-table>
        <div v-for="item in totalList" :key="item.key">{{ item.title }}：{{ item.totalValue }}</div>
      </a-card>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { studentStatisticColumns, pageSizeOptions } from '@/utils/tableDetails/details'
import { STable, SearchComPro } from '@/components'
import { detailStudent } from '@/api/table/table'
import { getSchoolList } from '@/api/education/card'
import { pageTeachersalary } from '@/api/table/table'
import { getSelectStuSourceData } from '@/api/reception/student'
import { listChannelTree, listAllByArea, listEduDance } from '@/api/common'
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
import DISTRICTS from '@/tools/citydata'
const addressOptions = DISTRICTS
let stuSource = [
  {
    string: '客服',
    value: '客服'
  }
]
export default {
  name: 'businessSummaryDetail',
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
          label: '选择时间',
          show: true,
          placeholder: '请选择选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'cascader',
          key: 'userArea',
          show: true,
          search: true,
          label: '省市',
          placeholder: '请选择省市',
          treeOps: { options: addressOptions, label: 'value', value: 'value', children: 'children' }
        },
        // {
        //   type: 'treeSelect',
        //   isShow: true,
        //   key: 'area',
        //   label: '区域',
        //   placeholder: '请选择区域',
        //   expandAll: true,
        //   mutiple: true,
        //   show: true,
        //   treeCheckable: true,
        //   selectFather: true,
        //   treeOps: {
        //     api: listAllByArea,
        //     label: 'deptName',
        //     value: 'id',
        //     children: 'children'
        //   }
        // },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'schoolId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
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
          key: 'firstChannel',
          label: '来源一级',
          placeholder: '请选择来源一级',
          show: true,
          search: true,
          staticArr: stuSource
        },
        {
          type: 'cascader',
          key: 'secondChannel',
          label: '来源二级',
          show: true,
          search: true,
          placeholder: '请选择来源二级',
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          show: true,
          type: 'text',
          key: 'counselor',
          label: '顾问',
          placeholder: '请输入顾问'
        },
        {
          type: 'chooseModal',
          key: 'service',
          label: '客服',
          placeholder: '请选择客服'
        },
        {
          type: 'select', // 静态select框
          key: 'isApply',
          label: '是否报名',
          placeholder: '请选择是否报名',
          staticArr: [
            {
              string: '是',
              value: 1
            },
            {
              string: '否',
              value: 2
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'isOpenCard',
          label: '是否开卡',
          placeholder: '请选择是否开卡',
          staticArr: [
            {
              string: '开卡',
              value: 1
            },
            {
              string: '未开卡',
              value: 2
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'isPayUp',
          label: '是否缴清',
          placeholder: '请选择是否缴清',
          staticArr: [
            {
              string: '是',
              value: 1
            },
            {
              string: '否',
              value: 2
            }
          ]
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'text',
          key: 'studentname',
          label: '学员姓名',

          placeholder: '请输入学员姓名'
        },
        {
          type: 'text',
          key: 'phone',
          label: '学员手机号',
          placeholder: '请输入学员手机号'
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
        },
        {
          type: 'number',
          key: 'age', //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
          label: '学员年龄',
          placeholder: '请输入学员年龄'
        },
        {
          type: 'select',
          key: 'stuType',
          label: '人群',
          placeholder: '成人/少儿',
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
          type: 'number',
          key: 'cardNum', //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
          label: '办卡数量',
          placeholder: '请输入办卡数量'
        },
        {
          type: 'number',
          key: 'finishCardNum', //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
          label: '结业卡数量',
          placeholder: '请输入结业卡数量'
        },
        {
          type: 'date',
          key: 'FinishDate',
          label: '结业卡时间',
          placeholder: '请选择结业卡时间',
          format: 'YYYY-MM-DD',
          isDate: true
        }
      ],
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: studentStatisticColumns,
      queryParam: {},
      loadData: parameter => {
        let request = detailStudent //导师课时统计
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
        if (route.name == 'studentStatisticDetail') {
          this.initSearchParams()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.isSchoolId()
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
    isSchoolId() {
      const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
      if (userSchoolId && userSchoolId.length > 0) {
        this.searchParams.forEach((item, index) => {
          if (item.key == 'schoolId') {
            this.searchParams.splice(index, 1)
          }
        })
        this.queryParam.schoolId = userSchoolId.map(item => item.deptId).join(',')
      }
    },
    initSearchParams() {
      let params = JSON.parse(localStorage.getItem('businessSummarySearchParams'))
      //  defaultValue={itemObj.initialValue ? (itemObj.mode == 'default' ? itemObj.initialValue : itemObj.initialValue.split(',')) : null}
      delete params.limit
      delete params.pageSizeOptions
      this.queryParam = params
      this.searchParams.forEach(item => {
        if (item.type == 'date') {
          if (params['start' + item.key]) {
            item.defaultVal = [moment(params['start' + item.key], 'YYYY-MM-DD'), moment(params['end' + item.key], 'YYYY-MM-DD')]
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
      let exportUrl = '/student/stat/detailStudentDown'
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
    toSalTypeName(record) {
      let { teacherName, eduTypeId } = record
      this.$router.push({
        name: 'teacherSalary',
        query: {
          name: teacherName,
          eduTypeId: eduTypeId
        }
      })
    },
    toNum(record) {
      let { className, startDate } = record
      this.$router.push({
        name: 'course',
        query: {
          day: startDate.slice(0, 10),
          className: className
        }
      })
    },
    searchSubmit(data, isReset) {
      if (isReset == 'isReset') {
        this.searchParams.forEach(item => {
          if (item.type == 'date') {
            if (item.key == 'Date') {
              item.defaultVal = [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
            } else {
              delete item.defaultVal
            }
          } else {
            delete item.initialValue
          }
        })
        this.$forceUpdate()
      }
      this.queryParam = data
      this.queryParam.startDate = data.startDate || defaultStart
      this.queryParam.endDate = data.endDate || defaultEnd
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.reports-iframe-wrapper {
}
</style>
