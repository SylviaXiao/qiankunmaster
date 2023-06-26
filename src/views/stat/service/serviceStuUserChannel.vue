<template>
  <div class="fin-achievement-wrapper">
    <f-frame
      :searchParamsArray="searchParams"
      src="/report?name=service_stuuser_channel&channelType=0"
      perm="service:stat:stuuser:channel"
      date="month"
      :params="params"
    ></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { listChannelTree } from '@/api/common'
import { ageBracketNoPermissionList, stuTagNoPermissionList } from '@/api/system'
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
  name: 'serviceStuUserChannel',
  data() {
    return {
      params: { channelType: 0 },
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
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'areaSchoolId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          search: true,
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

        // {
        //   type: 'cascader',
        //   key: 'areaSchoolId',
        //   isShow: !!!this.$store.getters.school_id,
        //   search: true,
        //   label: '选择分馆',
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
        },
        {
          type: 'chooseModal',
          key: 'service',
          show: true,
          label: '客服',
          multiple: true,
          placeholder: '请选择'
        }
      ]
    }
  },
  created() {},

  methods: {
    getAgeList(item) {
      return item.ageStart + '-' + item.ageEnd
    }
  }
}
</script>

<style lang="less" scoped></style>
