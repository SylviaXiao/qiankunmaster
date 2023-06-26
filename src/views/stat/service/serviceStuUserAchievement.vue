<template>
  <div class="fin-achievement-wrapper">
    <f-frame
      :searchParamsArray="searchParams"
      src="/report?name=service_stuUser_achievement"
      perm="service:stat:stuuser:stuUser_achievement"
      date="month"
    ></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { listEduType } from '@/api/common'
import { listChannelTree } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'serviceStuUserAchievement',
  data() {
    return {
      searchParams: [
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'stuInfo',
          label: '学员信息',
          placeholder: '请输入学员信息'
        },
        {
          type: 'date',
          key: 'Date',
          label: '资源录入时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        // {
        //   show: true,
        //   type: 'text', // 文本输入框,返回值为string
        //   key: 'channelName',
        //   label: '渠道',
        //   placeholder: '请输入渠道'
        // },
        {
          type: 'cascader',
          key: 'channel',
          label: '资源渠道',
          show: true,
          search: true,
          placeholder: '请选择资源渠道',
          treeOps: {
            api: listChannelTree,
            label: 'name',
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
          type: 'date',
          key: 'UserDate',
          label: '缴费时间',
          show: true,
          placeholder: '请选择缴费时间',
          format: 'YYYY-MM-DD',
          isDate: true
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
