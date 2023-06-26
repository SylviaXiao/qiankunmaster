<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=school_sign_orguser" perm="school:stat:sign:orguser" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
const date = new Date()
const defaultStart = moment(date).format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'schoolSignOrgUser',
  data() {
    return {
      searchParams: [
        {
          type: 'singledate',
          key: 'singleDate',
          label: '月份',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: defaultStart
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
