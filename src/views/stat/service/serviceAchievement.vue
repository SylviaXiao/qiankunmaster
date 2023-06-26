<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" ref="iframe" src="/report?name=service_achievement" perm="service:stat:achievement" date="month"></f-frame>
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
  name: 'serviceAchievement',
  data() {
    return {
      searchParams: [
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
          type: 'date',
          key: 'Date',
          label: '录入时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true,
          disabledType: 'disableLastMonthAfter3',
        },
        {
          type: 'treeSelect',
          key: 'channel',
          label: '资源渠道',
          isShow: true,
          expandAll: false,
          mutiple: true,
          show: true,
          treeCheckable: false,
          selectFather: true,
          placeholder: '请选择资源渠道',
          noBranch: true,
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'achType',
          label: '是否含退费',
          show: true,
          placeholder: '请选择是否含退费',
          staticArr: [
            {
              string: '包含',
              value: 'Y'
            },
            {
              string: '不含',
              value: 'N'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'resourceClasses',
          label: '资源类型',
          show: true,
          placeholder: '请选择资源类型',
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
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
