<template>
  <div class="fin-profit-paytype-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=fin_paytype" perm="finance:stat:paytype" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { getPayMethods } from '@/api/education'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'finPayType',
  data() {
    return {
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
        },
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'schoolId',
          label: '分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: false,
          show: true,
          treeCheckable: false,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'finType',
          label: '缴费类型',
          show: true,
          placeholder: '请选择缴费类型',
          staticArr: [
            {
              string: '全款',
              value: 'A'
            },
            {
              string: '定金',
              value: 'B'
            },
            {
              string: '补缴',
              value: 'C'
            },
            {
              string: '退款',
              value: 'D'
            }
          ]
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'payTypeId',
          label: '支付方式',
          placeholder: '请选择支付方式',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: false,
          selectFather: false,
          treeOps: {
            api: getPayMethods,
            label: 'dictValue',
            value: 'id',
            children: 'children'
          }
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
