<template>
  <div class="fin-profit-paytype-wrapper">
    <f-frame
      :searchParamsArray="searchParams"
      :src="'/report?name=fin_paytype_public_school&isUser=true' + deptId"
      perm="finance:stat:paytype-school:public"
      date="month"
    ></f-frame>
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
  name: 'finPayTypePublicSchool',
  data() {
    let deptId = this.$store.getters.school_id
    return {
      deptId: deptId ? '&deptId=' + deptId : '',
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '付款时间',
          show: true,
          placeholder: '请选择付款时间',
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
