<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=service_stuuser_day" perm="service:stat:stuuser:day" date="day"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listChannelTree } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'serviceStuUserDay',
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
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'schoolId',
          label: '选择分馆',
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
          key: 'youge',
          label: '是否包含优鸽',
          show: true,
          placeholder: '请选择是否包含优鸽',
          staticArr: [
            {
              string: '包含',
              value: 'Y'
            },
            {
              string: '不包含',
              value: 'N'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'resourceClasses',
          label: '资源班型',
          show: true,
          placeholder: '请选择资源班型',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '线上课',
              value: 'A'
            },
            {
              string: '线下课',
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
