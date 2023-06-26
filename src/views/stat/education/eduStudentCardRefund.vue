<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=edu_student_card_refund" perm="edu:stat:student:card:refund" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'eduStudentCardRefund',
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '退费时间',
          show: true,
          placeholder: '请选择退费时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'cascader',
          key: 'areaSchoolId',
          isShow: !!!this.$store.getters.school_id,
          search: true,
          label: '分馆',
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
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'cardInfo',
          label: '卡种信息',
          placeholder: '请输入卡种信息'
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'stuInfo',
          label: '学员信息',
          placeholder: '请输入学员信息'
        },
        {
          type: 'select', // 静态select框
          key: 'haveTeacher',
          label: '是否关联导师',
          show: true,
          placeholder: '请选择是否关联导师',
          staticArr: [
            {
              string: '是',
              value: 'true'
            },
            {
              string: '否',
              value: 'false'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'payStatus',
          label: '付款状态',
          show: true,
          placeholder: '请选择付款状态',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '已付款',
              value: 'Y'
            },
            {
              string: '未付款',
              value: 'N'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'cardStatus',
          label: '卡状态',
          show: true,
          placeholder: '请选择卡状态',
          staticArr: [
            {
              string: '未使用',
              value: 'A'
            },
            {
              string: '使用中',
              value: 'B'
            },
            {
              string: '停课',
              value: 'C'
            },
            {
              string: '退卡',
              value: 'D'
            },
            {
              string: '结业',
              value: 'E'
            },
            {
              string: '撤销',
              value: 'F'
            },
            {
              string: '结转',
              value: 'G'
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
