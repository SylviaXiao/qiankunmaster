<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" :src="'/report?name=teacher_no_sign' + deptId" perm="edu:stat:teacher:nosign" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listEduType, listEduDance } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'eduTeacherSign',
  data() {
    let deptId = this.$store.getters.school_id
    return {
      deptId: deptId ? '&deptId=' + deptId : '',
      searchParams: [
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
          key: 'deptId',
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
          type: 'select',
          key: 'danceId',
          label: '舞种',
          show: true,
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称'
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'teacherName',
          label: '导师名称',
          placeholder: '请输入导师名称'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
