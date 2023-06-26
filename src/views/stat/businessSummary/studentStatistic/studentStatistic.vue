<template>
  <div class="fin-profit-paytype-wrapper">
    <!-- <f-frame :searchParamsArray="searchParams" src="/report?name=fin_source_income" perm="finance:stat:source:income" date="month"></f-frame> -->
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      @onShowSizeChange="onShowSizeChange"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :total="total"
      :showPagination="true"
      :isMerge="true"
      :hideReset="false"
      :exportUrl="'/student/stat/collectStudentDown'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import { collectStudent } from '@/api/table/table'
import { getSelectStuSourceData } from '@/api/reception/student'
import { listChannelTree, listAllByArea, listEduDance } from '@/api/common'
import { ageBracketNoPermissionList } from '@/api/system'
import Vue from 'vue'
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
  name: 'studentStatistic',
  data() {
    return {
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: [
            {
              label: '区域',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '学员',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '学员手机号',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '年龄段',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '顾问',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '来源一级',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '舞种',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '是否缴清',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '合同金额（办卡）',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '报名金额（应收）',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '已缴金额（实收）',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            }
          ]
        }
      ],
      //表内容字段
      headList: [
        {
          key: 'deptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'stuName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'stuPhone',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'ageStart',
          value: '',
          isTotal: false,
          isClick: false,
          formatValue: this.getAgeStart
        },
        {
          key: 'adviserName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'source',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'schoolName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'danceName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'payoffStatus',
          value: '',
          isTotal: false,
          isClick: false,
          formatValue: this.getPayoffStatus
        },
        {
          key: 'stuOriginalPrice',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'stuTotalprice',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'finPrice',
          value: 0,
          isTotal: true,
          isClick: false
        }
      ],
      //表内容
      loadData: [],
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
          mutiple: true,
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
      queryParam: {},
      //表格是否加载
      rpSpinning: false,
      total: 0
    }
  },
  components: {
    ReportTable
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
    getAgeStart(record) {
      if (record.ageStart && record.ageEnd) {
        return record.ageStart + '-' + record.ageEnd
      } else {
        return ''
      }
    },
    getPayoffStatus(record) {
      if (record.payoffStatus == 'Y') {
        return '是'
      } else if (record.payoffStatus == 'N') {
        return '否'
      } else {
        return ''
      }
    },
    getAgeList(item) {
      return item.ageStart + '-' + item.ageEnd
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
    async init(data) {
      this.rpSpinning = true
      this.headList.forEach((col, colIndex) => {
        if (col.isTotal) col.value = 0
      })
      let res = await collectStudent(data)
      this.total = res.count
      if (Array.isArray(res.data) && res.data.length > 0) {
        let loadData = []
        res.data.forEach((item, index) => {
          let data = []
          this.headList.forEach((col, colIndex) => {
            if (col.isTotal) col.value += item[col.key] ? Number(item[col.key]) : 0
            let dataItem = {
              key: col.key,
              label: col.formatValue ? col.formatValue(item) : item[col.key],
              rowspan: 1,
              colspan: 1,
              style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isClick,
              id: item.deptId,
              salTypeName: item.salTypeName,
              salary: item.salary
            }
            data.push(dataItem)
          })
          loadData.push({
            style: 'background:#fff;',
            data: JSON.parse(JSON.stringify(data))
          })
        })
        let total = []
        this.headList.forEach((col, colIndex) => {
          if (colIndex == 0 || col.isTotal) {
            let totalData = {
              key: col.key,
              label: col.value,
              rowspan: 1,
              colspan: colIndex == 0 ? 9 : 1,
              style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isClick,
              id: ''
            }
            if (col.isTotal) totalData.label = Number(col.value).toFixed(2)
            total.push(totalData)
          }
        })
        total[0].label = '总计(点击详情)'
        total[0].isClick = true
        total[0].style = 'color:#1BA97B;cursor:pointer;'
        loadData.push({
          style: 'background:#fff;',
          data: JSON.parse(JSON.stringify(total))
        })
        this.loadData = JSON.parse(JSON.stringify(loadData))
      } else {
        this.loadData = []
      }
      this.rpSpinning = false
    },
    onShowSizeChange(data) {
      this.queryParam = Object.assign(this.queryParam, data)
      this.init(this.queryParam)
    },
    searchSubmit(data) {
      this.queryParam = data
      this.queryParam.startDate = data.startDate || defaultStart
      this.queryParam.endDate = data.endDate || defaultEnd
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        const { href } = this.$router.resolve({
          name: 'studentStatisticDetail'
        })
        localStorage.setItem('businessSummarySearchParams', JSON.stringify(this.queryParam))
        //结合open打开新的页面
        window.open(href, '_blank')
        // this.$router.push({
        //   name: 'businessSummaryDetail',
        //   params: { type: key, startDate: startDate, endDate: endDate },
        //   query: {
        //     id: id,
        //     salTypeName: salTypeName,
        //     salary: salary
        //   }
        // })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
