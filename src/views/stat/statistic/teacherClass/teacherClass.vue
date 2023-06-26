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
      :exportUrl="'/finance/teachersalary/downTeachersalary'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import { pageTeachersalary } from '@/api/table/table'
import Vue from 'vue'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'teacherClass',
  data() {
    return {
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: [
            {
              label: '分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '薪酬类型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '薪酬',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '课时数',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '薪酬总额',
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
          key: 'salTypeName',
          value: 0,
          isTotal: false,
          isClick: false
        },
        {
          key: 'salary',
          value: 0,
          isTotal: false,
          isClick: false
        },
        {
          key: 'signCount',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'totalPrice',
          value: 0,
          isTotal: true,
          isClick: true
        }
      ],
      //表内容
      loadData: [],
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '缴费时间',
          show: true,
          placeholder: '请选择缴费时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
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
          type: 'text',
          key: 'salTypeName',
          label: '薪酬类型',
          show: true,
          placeholder: '请输入薪酬类型'
        },
        {
          type: 'text',
          key: 'salary',
          label: '薪酬',
          show: true,
          placeholder: '请输入薪酬'
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
  },
  methods: {
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
      let res = await pageTeachersalary(data)
      this.total = res.count
      if (Array.isArray(res.data) && res.data.length > 0) {
        let loadData = []
        res.data.forEach((item, index) => {
          let data = []
          this.headList.forEach((col, colIndex) => {
            if (col.isTotal) col.value += item[col.key]
            let dataItem = {
              key: col.key,
              label: item[col.key],
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
              colspan: colIndex == 0 ? 3 : 1,
              style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isClick,
              id: ''
            }
            if (col.isTotal) totalData.label = col.value.toFixed(2)
            total.push(totalData)
          }
        })
        total[0].label = '合计'
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
      this.queryParam = Object.assign(this.queryParam, data)
      if (this.queryParam.salary) this.queryParam.salary = parseFloat(this.queryParam.salary)
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        let { endDate, startDate, schoolId } = this.queryParam
        let id = data.id || schoolId
        let salTypeName = data.salTypeName || this.queryParam.salTypeName
        let salary = data.salary || this.queryParam.salary
        let { key } = data
        this.$router.push({
          name: 'teacherClassDetails',
          params: { type: key, startDate: startDate, endDate: endDate },
          query: {
            id: id,
            salTypeName: salTypeName,
            salary: salary
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
