<template>
  <div class="source-page-wrapper">
    <div class="search-wrapper">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </div>
    <div class="table-wrapper">
      <s-table ref="table" :columns="columns" :data="tableLoad" rowKey="id" :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }">
        <span slot="userName" slot-scope="text, record">
          <template v-if="record.studentId">{{ text }} <a-tag>正</a-tag></template>
          <template v-else>{{ text }}</template>
        </span>
      </s-table>
    </div>
  </div>
</template>

<script>
import { treeEduClassType } from '@/api/common'
import { pageSchoolStuUser } from '@/api/intentionStu/adviser'
import STable from '../Table'
import SearchComPro from '../SearchComPro'
const columns = [
  {
    title: '录入日期',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 100,
    fixed: 'left'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
    scopedSlots: { customRender: 'userName' },
    width: 100,
    fixed: 'left'
  },
  {
    title: 'QQ号',
    dataIndex: 'userQQ',
    key: 'userQQ'
  },
  {
    title: '微信号',
    dataIndex: 'userWechat',
    key: 'userWechat'
  },
  {
    title: '手机号码',
    dataIndex: 'userPhone',
    key: 'userPhone'
  },
  {
    title: '来源省市',
    dataIndex: 'userArea',
    key: 'userArea'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    key: 'typeName',
    customRender: (text, record) => {
      if (!text) {
        return '不限'
      } else {
        return text
      }
    }
  },
  {
    title: '班型',
    dataIndex: 'classTypeName',
    key: 'classTypeName',
    width: 100
  },
  {
    title: '资源来源',
    dataIndex: 'userSource',
    key: 'userSource'
  },
  {
    title: '资源状态',
    dataIndex: 'channelStatus',
    key: 'channelStatus',
    customRender: (text, record) => {
      return !record.adviserName || record.adviserName == null ? '未分配' : '已分配'
    }
  },
  {
    title: '摘要备注',
    dataIndex: 'userRemark',
    key: 'userRemark'
  },
  {
    title: '到访/预约',
    dataIndex: 'userVisit/userAudition ',
    key: 'userVisit/userAudition ',
    customRender: (text, record) => {
      const { userVisit, userAudition } = record
      return `${userVisit == 'Y' ? '已到访' : '未到访'}/${userAudition == 'Y' ? '已体验' : userAudition == 'N' ? '已预约' : '未预约'}`
    }
  },
  {
    title: '跟进顾问',
    dataIndex: 'adviserName',
    key: 'adviserName'
  }
]
export default {
  name: 'SourcePage',
  props: {
    searchSource: {
      type: String,
      default: null
    }
  },
  components: {
    STable,
    SearchComPro
  },
  data() {
    return {
      columns,
      queryParam: {},
      tableLoad: parameter => {
        if (!this.isSearch) {
          this.queryParam.userSource = this.searchSource
        }
        return pageSchoolStuUser(Object.assign(parameter, this.queryParam)).then(res => {
          this.isSearch = true
          return res
        })
      },
      isSearch: false,
      selectedRowKeys: [],
      selectedRows: [],
      searchParams: [
        {
          type: 'text',
          key: 'stuUserInfo',
          label: '学员信息',
          placeholder: '请输入姓名/QQ号/微信号/手机号'
        },
        {
          type: 'chooseModal',
          key: 'master',
          label: '选择顾问',
          placeholder: '请选择'
        },
        {
          type: 'date',
          key: 'Date',
          label: '录入时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'cascader',
          key: 'classTypeId',
          label: '班型',
          placeholder: '请选择班型',
          treeOps: {
            api: treeEduClassType,
            type: 'D',
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text',
          key: 'userSource',
          label: '资源来源',
          initialValue: this.searchSource,
          placeholder: '请输入资源来源'
        }
      ]
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    getSelectedValues() {
      const {
        selectedRows,
        selectedRows: { length },
        $notification
      } = this
      if (selectedRows && length > 0) {
        const [selectedValue, ...other] = selectedRows
        const { userPhone, userQQ, userWechat, id } = selectedValue
        return Promise.resolve(selectedValue)
      } else {
        return Promise.reject(new Error('请选择学员!'))
      }
    },
    //搜索功能
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
