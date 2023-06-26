<template>
  <div class="fin-profit-paytype-wrapper">
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :exportUrl="'/finance/teachercheck/downTeachercheck'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import { listTeacherCheck } from '@/api/table/table'
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
  name: 'teacherAchievement',
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
              label: '导师收款业绩7%',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '导师收款业绩5%',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '导师收款业绩2%',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '导师退费业绩7%',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '导师退费业绩5%',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '导师退费业绩2%',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '提成业绩7%',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '提成业绩5%',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '提成业绩2%',
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
          key: 'sevenPrice',
          value: 0,
          isTotal: true,
          isClick: true,
          type: 'A',
          targ: true
        },
        {
          key: 'fivePrice',
          value: 0,
          isTotal: true,
          isClick: true,
          type: 'B',
          targ: true
        },
        {
          key: 'twoPrice',
          value: 0,
          isTotal: true,
          isClick: true,
          type: 'C',
          targ: true
        },
        {
          key: 'sevenRefund',
          value: 0,
          isTotal: true,
          isClick: true,
          type: 'A',
          targ: false
        },
        {
          key: 'fiveRefund',
          value: 0,
          isTotal: true,
          isClick: true,
          type: 'B',
          targ: false
        },
        {
          key: 'twoRefund',
          value: 0,
          isTotal: true,
          isClick: true,
          type: 'C',
          targ: false
        },
        {
          key: 'sevenCommission',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'fiveCommission',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'twoCommission',
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
          key: 'schoolIds',
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
        }
      ],
      queryParam: {},
      //表格是否加载
      rpSpinning: false
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
          if (item.key == 'schoolIds') {
            this.searchParams.splice(index, 1)
          }
        })
        this.queryParam.schoolIds = userSchoolId.map(item => item.deptId).join(',')
      }
    },
    async init(data) {
      this.rpSpinning = true
      this.headList.forEach((col, colIndex) => {
        if (col.isTotal) col.value = 0
      })
      let res = await listTeacherCheck(data)
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
              type: col.type,
              targ: col.targ
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
          total[colIndex] = {
            key: col.key,
            label: col.value,
            rowspan: 1,
            colspan: 1,
            style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
            isClick: col.isClick,
            id: '',
            type: col.type,
            targ: col.targ
          }
          if (col.isTotal) total[colIndex].label = col.value.toFixed(2)
        })
        total[0].label = '合计'
        loadData.push({
          style: 'background:#fff;',
          data: JSON.parse(JSON.stringify(total))
        })
        this.loadData = JSON.parse(JSON.stringify(loadData))
      }
      this.rpSpinning = false
    },
    searchSubmit(data) {
      this.queryParam = Object.assign(this.queryParam, data)
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        let { endDate, startDate, schoolIds } = this.queryParam
        let id = data.id || schoolIds
        let { type, targ, key } = data
        this.$router.push({
          name: 'teacherAchievementDetails',
          params: { itemType: type, targ: targ, type: key, startDate: startDate, endDate: endDate },
          query: {
            id: id
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
