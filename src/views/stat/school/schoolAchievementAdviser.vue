<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=school_achievement_adviser" perm="school:stat:achievement-adviser" date="month"></f-frame>
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
  name: 'schoolAchievementAdviser',
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
          type: 'select', // 静态select框
          key: 'achType',
          label: '合计类型',
          show: true,
          placeholder: '请选择合计类型',
          staticArr: [
            {
              string: '总合计',
              value: '0'
            },
            {
              string: '收入合计(不含退费)',
              value: '1'
            },
            {
              string: '退费合计(仅退费)',
              value: '2'
            },
            {
              string: '退费合计(业绩减半)',
              value: '3'
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
