<template>
  <div>
    <f-frame :searchParamsArray="searchParams" src="/report?name=student_auditionlog_school" perm="school:stat:audition:branch" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listEduDance, listEduType } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'student_auditionlog_school',
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'select',
          key: 'eduType',
          label: '卡班型',
          placeholder: '请选择班型',
          show: true,
          staticArr: [
            {
              string: '少儿班',
              value: 'A'
            },
            {
              string: '非少儿班',
              value: 'B'
            }
          ]
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
