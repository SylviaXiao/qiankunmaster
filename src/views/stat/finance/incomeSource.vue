<template>
  <div class="fin-profit-paytype-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=fin_source_income" perm="finance:stat:source:income" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSelectStuSourceData } from '@/api/reception/student'
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
  name: 'branchClassType',
  data() {
    return {
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
          type: 'select', // 静态select框
          key: 'sourceName',
          label: '资源来源',
          show: true,
          placeholder: '请选择资源来源',
          staticArr: stuSource
        }
      ]
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
            stuSource.push({
              string: '其他',
              value: '其他'
            })
            console.log(stuSource)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
