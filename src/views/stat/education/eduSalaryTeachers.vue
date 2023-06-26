<template>
  <div class="fin-achievement-wrapper">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="导师工资汇总" key="1">
        <f-frame :searchParamsArray="searchParams1" src="/report?name=edu_salary_teachers" perm="edu:stat:salary:teachers" date="month"></f-frame>
      </a-tab-pane>
      <a-tab-pane tab="外部导师工资汇总" key="2" :forceRender="false">
        <f-frame :searchParamsArray="searchParams2" src="/report?name=edu_salary_teachers_outer" perm="edu:stat:salary:teachers" date="month"></f-frame>
      </a-tab-pane>
    </a-tabs>
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
  name: 'eduSalaryTeachers',
  data() {
    return {
      searchParams1: [
        {
          type: 'date',
          key: 'Date',
          label: '时间',
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
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'teacherName',
          label: '导师姓名',
          placeholder: '请输入导师姓名'
        },
        {
          show: true,
          type: 'select',
          key: 'status',
          label: '在职状态',
          placeholder: '请选择在职状态',
          allowClear: true,
          staticArr: [{ string: '在职', value: 'Y' }, { string: '离职', value: 'N' }, { string: '审批中', value: 'YY' }]
        },
        {
          type: 'select',
          key: 'teacherStatus',
          show: true,
          label: '是否延发',
          initialValue: 'A',
          initialIndex: 1,
          placeholder: '请选择',
          staticArr: [
            {
              string: '是',
              value: 'B'
            },
            {
              string: '否',
              value: 'A'
            },
          ]
        },
      ],
      searchParams2: [
        {
          type: 'date',
          key: 'Date',
          label: '时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'deptId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          show: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          show: true,
          type: 'text',
          key: 'teacherInfo',
          label: '导师信息',
          placeholder: '请输入导师姓名/手机号'
        },
        {
          show: true,
          type: 'select',
          key: 'isSettle',
          label: '结清状态',
          placeholder: '请选择',
          allowClear: true,
          initialValue: '',
          staticArr: [{ string: '全部', value: '' }, { string: '已结清', value: 'Y' }, { string: '未结清', value: 'N' }]
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
