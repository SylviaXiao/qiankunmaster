<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=stuUser_channel_edyType" perm="service:stat:stuuer:EdutypeChannel" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { listChannelTree, listEduType, listEduDance } from '@/api/common'
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
  name: 'stuUserDeptEduType',
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
          type: 'treeSelect',
          key: 'channel',
          isShow: true,
          label: '渠道',
          placeholder: '请选择渠道',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: false,
          selectFather: true,
          noBranch: true,
          defaultVal: 'b50036a2-0def-46b7-b81c-31b836b3f7ce',
          treeOps: {
            api: listChannelTree,
            label: 'name',
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
          type: 'select',
          key: 'achType',
          label: '是否包含退费',
          show: true,
          placeholder: '请选择是否包含退费',
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
          type: 'select',
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
          type: 'date',
          key: 'Date',
          label: '选择日期',
          show: true,
          placeholder: '请选择日期',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'date',
          key: 'CompareDate',
          label: '对比日期',
          show: true,
          placeholder: '请选择对比日期',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
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
  methods: {}
}
</script>

<style lang="less" scoped></style>
