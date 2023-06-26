<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=edu_salary_teachers_school" perm="edu:stat:salary:teachers" date="month"></f-frame>
  </div>
</template>

<script>
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
  name: 'eduSalaryTeachersSchool',
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
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
