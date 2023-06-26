<template>
  <div>
    <f-frame
      :searchParamsArray="searchParams"
      src="/report?name=month_stuuser_school&isUser=true"
      perm="school:stat:month:school"
      date="month"
    ></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listChannelTree, listEduType } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'monthStuuserSchool',
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
          isDate: true,
          allowClear: false
        },
        {
          type: 'cascader',
          key: 'areaSchoolId',
          isShow: !!!this.$store.getters.school_id,
          search: true,
          label: '选择分馆',
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
          type: 'select', // 静态select框
          key: 'resourceClasses',
          label: '资源类型',
          show: true,
          placeholder: '请选择资源班型',
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
        },
        {
          type: 'select', //动态select框
          key: 'stuEduTypeId',
          show: true,
          label: '资源班型',
          placeholder: '请选择资源班型',
          apiOption: {
            api: listEduType, // promise类型的接口
            string: 'name',
            value: 'id'
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
        // {
        //   type: 'cascader',
        //   key: 'channel',
        //   label: '资源渠道',
        //   show: true,
        //   search: true,
        //   placeholder: '请选择资源渠道',
        //   treeOps: {
        //     api: listChannelTree,
        //     label: 'name',
        //     value: 'id',
        //     children: 'children'
        //   }
        // },
        {
          type: 'treeSelect',
          key: 'channel',
          isShow: true,
          label: '资源渠道',
          placeholder: '请选择资源渠道',
          expandAll: false,
          mutiple: true,
          search: true,
          show: true,
          selectFather: true,
          noBranch: true,
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'service',
          label: '客服',
          placeholder: '请输入客服'
        },
        {
          type: 'select', // 静态select框
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
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
