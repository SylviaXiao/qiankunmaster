<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=edu_class_url" perm="edu:stat:class:url" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listEduType } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'eduClassUrl',
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '使用时间',
          show: true,
          placeholder: '请选择使用时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'cardTypeName',
          label: '卡种',
          placeholder: '请输入卡种'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
