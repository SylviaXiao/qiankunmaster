<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" :extParams="extParams" src="/report?name=service_achievement_diff" perm="service:stat:achievement-diff" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
const defaultStart = moment()
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'serviceAchievementDiff',

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
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'achievementOrgUser',
          label: '业绩所属客服',
          placeholder: '请输入业绩所属客服'
        },
        {
          type: 'chooseModal',
          key: 'service',
          show: true,
          label: '资源录入客服',
          multiple: true,
          placeholder: '请选择'
        },
        {
          type: 'select',
          key: 'type',
          label: '缴费类型',
          show: true,
          placeholder: '请选择是否含退费',
          initialValue: '',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
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
          isShow: !this.$store.getters.school_id,
          key: 'subDeptId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        }
      ]
    }
  },
  computed: {
    extParams() {
      return {userId: this.$store.state.user.info.user.id}
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
