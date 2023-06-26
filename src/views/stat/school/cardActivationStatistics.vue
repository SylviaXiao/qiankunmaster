<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" :src="'/report?name=activation_card' + deptId" perm="school:stat:card:active" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listEduType } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'eduClassUrl',
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
          placeholder: '请选择使用时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        // {
        //   type: 'cascader',
        //   key: 'deptId',
        //   isShow: !!!deptId,
        //   search: true,
        //   label: '分馆',
        //   show: true,
        //   placeholder: '请选择分馆',
        //   treeOps: {
        //     api: getSchoolList,
        //     label: 'deptName',
        //     value: 'id',
        //     children: 'children'
        //   }
        // },
        {
          type: 'treeSelect',
          isShow: !!!deptId,
          key: 'deptId',
          label: '分馆',
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
          show: true,
          type: 'text',
          key: 'phone',
          label: '手机号',
          placeholder: '请输入手机号'
        },
        {
          show: true,
          type: 'text',
          key: 'remark',
          label: '备注',
          placeholder: '请输入备注'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
