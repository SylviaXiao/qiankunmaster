<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=fin_paytype_private" perm="finance:stat:paytype:private" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { getPayMethods } from '@/api/education'
const date = new Date()
const defaultStart = moment()
  .startOf(date)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .endOf(date)
  .format('YYYY-MM-DD')
export default {
  name: 'finPayTypePrivate',
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '录入时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'cascader',
          key: 'areaSchoolId',
          isShow: !!!this.$store.getters.school_id,
          search: true,
          label: '选择分馆',
          show: true,
          placeholder: '请选择分馆',
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'type',
          label: '收入类型',
          show: true,
          placeholder: '请选择收入类型',
          staticArr: [
            {
              string: '学员缴费',
              value: '1'
            },
            {
              string: '店面收入',
              value: '2'
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
