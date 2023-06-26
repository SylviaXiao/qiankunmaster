<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=cost_flow_after" perm="financialStatistics:stat:apportionNext" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { listOrgDept } from '@/api/education/card'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'apportionPre',
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'PriceDate',
          label: '录入时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'cascader',
          key: 'deptKey',
          show: true,
          label: '分摊部门',
          placeholder: '请选择分摊部门',
          search: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'key',
            children: 'children'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'type',
          label: '类型',
          show: true,
          placeholder: '请选择类型',
          staticArr: [
            {
              string: '收入',
              value: 'A'
            },
            {
              string: '支出',
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
