<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" :params="params" :src="`/report?name=fin_refund_compare`" perm="finance:stat:refund" date="month"></f-frame>
    <!-- <f-frame
      :searchParamsArray="searchParams"
      :params="params"
      :src="`/report?name=fin_refund_compare&month=${getMonth()}&num=12`"
      perm="finance:stat:refund"
      date="month"
    ></f-frame> -->
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
let date = new Date()
var myyear = date.getFullYear()
var mymonth = date.getMonth() + 1
if (mymonth < 10) {
  mymonth = '0' + mymonth
}
let defaultMonth = [myyear + '-' + mymonth]
let monthList = []
if (mymonth < 12) {
  for (let i = mymonth + 1; i <= 12; i++) {
    monthList.push({
      string: `${i}月(${myyear - 1}年)`,
      value: `${myyear - 1}-${i < 10 ? '0' + i : i}`
    })
  }
}
for (let i = 1; i <= mymonth; i++) {
  monthList.push({
    string: `${i}月`,
    value: `${myyear}-${i < 10 ? '0' + i : i}`
  })
}
export default {
  name: 'finRefundCompare',
  data() {
    return {
      params: { num: 12 },
      searchParams: [
        {
          type: 'cascader',
          key: 'areaSchoolId',
          isShow: !!!this.$store.getters.school_id,
          search: true,
          label: '地区/分馆',
          show: true,
          placeholder: '请选择地区/分馆',
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'date',
          key: 'Month',
          label: '对比月份',
          placeholder: '请选择对比月份',
          format: 'YYYY-MM',
          isMonth: true,
          show: true,
          mode: ['month', 'month'],
          defaultVal: [moment(defaultMonth, 'YYYY-MM'), moment(defaultMonth, 'YYYY-MM')]
        }
        // {
        //   type: 'select',
        //   key: 'month',
        //   mode: 'multiple',
        //   label: '对比月份',
        //   initialValue: defaultMonth,
        //   placeholder: '请选择对比月份',
        //   show: true,
        //   staticArr: monthList
        // }
      ]
    }
  },
  created() {
    // this.getMonth()
  },
  methods: {
    // getMonth() {
    //   let date = new Date()
    //   var myyear = date.getFullYear()
    //   var mymonth = date.getMonth() + 1
    //   if (mymonth < 10) {
    //     mymonth = '0' + mymonth
    //   }
    //   return myyear + '-' + mymonth
    // }
  }
}
</script>
<style lang="less" scoped></style>
