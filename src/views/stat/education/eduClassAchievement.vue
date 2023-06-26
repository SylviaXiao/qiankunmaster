<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=edu_class_achievement" perm="edu:stat:class:achievement" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listEduDance, listEduType } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'eduClassAchievement',
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '开班时间',
          show: true,
          placeholder: '请选择开班时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'date',
          key: 'ClassEndDate',
          label: '班级结业时间',
          show: true,
          placeholder: '请选择班级结业时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'select', //动态select框
          key: 'eduTypeId',
          show: true,
          label: '班型',
          placeholder: '请选择班型',
          apiOption: {
            api: listEduType, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'classInfo',
          label: '班级信息',
          placeholder: '请输入班级信息'
        },
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
          type: 'select', //动态select框
          key: 'danceId',
          show: true,
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'date',
          key: 'CardEndDate',
          label: '卡有效截止时间',
          show: true,
          placeholder: '请选择卡有效截止时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'date',
          key: 'NextCardDate',
          label: '续卡时间',
          show: true,
          placeholder: '请选择续卡时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'select',
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
        },
        {
          type: 'select', // 静态select框
          key: 'nextCard',
          label: '是否续卡',
          show: true,
          placeholder: '请选择是否续卡',
          staticArr: [
            {
              string: '全部',
              value: '0'
            },
            {
              string: '已续卡',
              value: '1'
            },
            {
              string: '未续卡',
              value: '2'
            }
          ]
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'stuInfo',
          label: '学员信息',
          placeholder: '请输入学员信息'
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'teacherInfo',
          label: '导师信息',
          placeholder: '请输入导师信息'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
