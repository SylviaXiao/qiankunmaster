<template>
  <div>
    <f-frame :searchParamsArray="searchParams" :src="'/report?name=dept_mate_stu_audition_log' + deptId" perm="school:stat:audition:class" date="month"></f-frame>
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
  name: 'dept_mate_stu_audition_log',
  data() {
    let deptId = this.$store.getters.school_id
    return {
      deptId: deptId ? '&deptId=' + deptId : '',
      searchParams: [
        {
          type: 'cascader',
          key: 'deptId',
          isShow: !!!deptId,
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
          type: 'text',
          key: 'className',
          label: '班级名称',
          show: true,
          placeholder: '请输入班级名称'
        },
        {
          type: 'text',
          key: 'teacherName',
          label: '上课老师',
          show: true,
          placeholder: '请输入上课老师'
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
          key: 'Date',
          label: '时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
