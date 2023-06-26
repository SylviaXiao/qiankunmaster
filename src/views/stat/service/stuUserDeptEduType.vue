<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=stuUser_dept_eduType" perm="service:stat:stuuer:deptEdutype" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { listChannelTree, listEduType, listEduDance } from '@/api/common'
import { getSchoolList } from '@/api/education/card'
import { ageBracketNoPermissionList, stuTagNoPermissionList } from '@/api/system'
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
          isShow: !!!this.$store.getters.school_id,
          type: 'treeSelect',
          isShow: true,
          key: 'schoolId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
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
        // {
        //   type: 'cascader',
        //   key: 'channel',
        //   label: '渠道',
        //   show: true,
        //   search: true,
        //   placeholder: '请选择渠道',
        //   treeOps: {
        //     api: listChannelTree,
        //     label: 'name',
        //     value: 'id',
        //     children: 'children'
        //   }
        // },
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
        },
        {
          type: 'select', // 静态select框
          key: 'ascription',
          label: '地域归属',
          show: true,
          placeholder: '请选择地域归属',
          staticArr: [
            {
              string: '本地资源',
              value: 'A'
            },
            {
              string: '地级市资源',
              value: 'B'
            },
            {
              string: '外地资源',
              value: 'C'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'ageBracket',
          label: '年龄段',
          show: true,
          placeholder: '请选择年龄段',
          apiOption: {
            api: ageBracketNoPermissionList, // promise类型的接口
            string: this.getAgeList,
            value: 'id'
          }
        },
        {
          type: 'select', //动态select框
          key: 'tagId',
          show: true,
          label: '标签',
          placeholder: '请选择标签',
          apiOption: {
            api: stuTagNoPermissionList, // promise类型的接口
            string: 'tagName',
            value: 'id'
          }
        }
      ]
    }
  },
  methods: {
    getAgeList(item) {
      return item.ageStart + '-' + item.ageEnd
    }
  }
}
</script>

<style lang="less" scoped></style>
