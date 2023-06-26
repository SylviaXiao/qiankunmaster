<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :searchParams="searchParams" @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <s-table ref="table" :columns="columns" :data="loadData" :rowKey="(record, index) => index"></s-table>
    </a-card>
  </div>
</template>

<script>
import SearchComPro from '@/components/SearchComPro'
import STable from '@/components/Table'
import PermBox from '@/components/PermBox'
import { getResourceDeleteList } from '@/api/intentionStudent'
import { listDeptUserByService } from '@/api/organize'
const columns = [
  {
    title: '操作时间',
    align: 'center',
    dataIndex: 'createDate'
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'orgUser'
  },
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'userName'
  },
  {
    title: '手机号',
    align: 'center',
    dataIndex: 'userPhone'
  },
  {
    title: '微信号',
    align: 'center',
    dataIndex: 'userWechat'
  },
  {
    title: 'QQ号',
    align: 'center',
    dataIndex: 'userQQ'
  },
  {
    title: '来源省市',
    align: 'center',
    dataIndex: 'userArea'
  },
  {
    title: '资源渠道',
    align: 'center',
    dataIndex: 'channelName'
  },
  {
    title: '分配分馆',
    align: 'center',
    dataIndex: 'deptName'
  },
  {
    title: '录入客服',
    align: 'center',
    dataIndex: 'userSource'
  },
  {
    title: '录入时间',
    align: 'center',
    dataIndex: 'startDate'
  }
]
export default {
  name: 'resourceDeleteLog',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
      searchParams: [
        {
          type: 'text', 
          key: 'stuUserInfo',
          label: '资源信息',
          show: true,
          placeholder: '手机号/微信号/QQ/姓名'
        },
        {
          type: 'text', 
          key: 'serviceName',
          label: '客服名称',
          show: true,
          placeholder: '请输入客服名称'
        },
        {
          type: 'text', 
          key: 'orgUser',
          label: '操作人',
          show: true,
          placeholder: '请输入操作人'
        }
      ],
      queryParams: {},
      columns,
      loadData: parameter => {
        return getResourceDeleteList({ ...parameter, ...this.queryParams }).then(res => {
          return res
        })
      }
    }
  },
  computed: {},
  methods: {
    _refreshTable() {
      this.$refs.table.refresh()
    },
    searchSubmit(data) {
      this.queryParams = data
      this._refreshTable()
    }
  }
}
</script>

<style lang="less" scoped></style>
