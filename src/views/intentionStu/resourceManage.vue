<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro
        :style="{ padding: '10px 0' }"
        @searchSubmit="searchSubmit"
        :searchParams="selectKey === 1 ? searchParams : two_searchParams"
      ></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle" defaultActiveKey="0">
        <!-- v-if="handlePermBox('finance:finteacher:view')" -->
        <a-tab-pane :tab="item.name" v-for="(item, index) in tabList" :key="item.id">
          <perm-box perm="analysis:networktarget:save" v-if="selectKey === 1">
            <a-button icon="plus-circle" @click="openModal()" style="margin-bottom:10px;">月度目标录入</a-button>
          </perm-box>
          <s-table
            :ref="`table${index}`"
            :columns="selectKey === 1 ? columns : two_columns"
            :data="tableLoad"
            :rowKey="rowKey => `${rowKey.id}-${Math.random()}`"
          >
            <span slot="month" slot-scope="text, record">
              <span>{{ $tools.tailor.getDate(record.month) }}</span>
            </span>
            <span slot="action" slot-scope="text, record">
              <perm-box perm="analysis:networktarget:change" v-if="selectKey === 1">
                <a href="javascript:;" @click="openModal(record)">修改</a>
              </perm-box>
              <perm-box perm="analysis:networktarget:del" v-if="selectKey === 1">
                <a href="javascript:;" @click="deletes(record)">删除</a>
              </perm-box>
              <perm-box perm="analysis:networktarget:confirm" v-if="selectKey === 2 && record.children && !record.confirm">
                <a href="javascript:;" @click="affirm(record)">确认</a>
              </perm-box>
            </span>
          </s-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <monthTargetEntry ref="monthTargetEntry" @refresh="_refreshTable" />
  </div>
</template>

<script>
import SearchComPro from '@/components/SearchComPro'
import STable from '@/components/Table'
import PermBox from '@/components/PermBox'
import monthTargetEntry from './modules/monthTargetEntry'
import { pageNetworkTarget, removeNetworkTarget, pageNetworkTargetSummary, confirmNetworkTarget } from '@/api/intentionStu/adviser'
import { getChannelTreeByUser } from '@/api/common'

const columns = [
  {
    title: '录入月份',
    dataIndex: 'month'
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    scopedSlots: { customRender: 'deptName' }
  },
  {
    title: '渠道',
    dataIndex: 'channelName'
  },
  {
    title: '引流目标数',
    dataIndex: 'drainageNum'
  },
  {
    title: '资源目标数',
    dataIndex: 'targetNum'
  },
  {
    title: '资源目标率',
    dataIndex: 'inversionRate',
    scopedSlots: { customRender: 'inversionRate' }
  },
  {
    title: '资源目标金额',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '录入人',
    dataIndex: 'userName',
    scopedSlots: { customRender: 'userName' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const two_columns = [
  // {
  //   title: '录入月份',
  //   dataIndex: 'month',
  //   width: 150
  // },
  {
    title: '目标月份',
    dataIndex: 'month',
    width: 150
  },
  {
    title: '目标小组',
    dataIndex: 'deptName',
    scopedSlots: { customRender: 'deptName' },
    width: 200
  },
  {
    title: '引流总目标数',
    dataIndex: 'drainageNum'
  },
  {
    title: '资源总目标数',
    dataIndex: 'targetNum'
  },
  {
    title: '资源转化率总目标值',
    dataIndex: 'inversionRate'
  },
  {
    title: '业绩目标总金额',
    dataIndex: 'price'
  },
  {
    title: '确认状态',
    dataIndex: 'confirm',
    customRender: (text, record) => {
      return !text ? '未确认' : text ? '已确认' : ''
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Month',
          label: '录入月份',
          placeholder: '请选择录入月份',
          format: 'YYYY-MM',
          show: true,
          mode: ['month', 'month']
        },
        {
          type: 'cascader',
          show: true,
          key: 'classTypeId',
          label: '渠道',
          placeholder: '请选择渠道',
          treeOps: {
            api: getChannelTreeByUser,
            // type: 'D',
            label: 'name',
            value: 'id',
            children: 'children'
          }
        }
        // {
        //   type: 'select', //动态select框
        //   key: 'bankId',
        //   label: '录入人',
        //   search: true,
        //   placeholder: '请选择录入人',
        //   apiOption: {
        //     // api: listBank, // promise类型的接口
        //     string: 'bankNo',
        //     value: 'id'
        //   }
        // },
        // {
        //   type: 'select', //动态select框
        //   key: 'bankId',
        //   label: '部门',
        //   search: true,
        //   placeholder: '请选择部门',
        //   apiOption: {
        //     // api: listBank, // promise类型的接口
        //     string: 'bankNo',
        //     value: 'id'
        //   }
        // }
      ],
      two_searchParams: [
        {
          type: 'date',
          key: 'Month',
          label: '录入月份',
          placeholder: '请选择录入月份',
          format: 'YYYY-MM',
          show: true,
          mode: ['month', 'month']
        }
      ],
      tab: [
        { name: '资源目标录入', id: 1, perm: 'analysis:networktarget:view' },
        { name: '网络部目标管理', id: 2, perm: 'analysis:networktarget-summary:view' }
      ],
      tabList: [],
      selectKey: 1,
      columns,
      two_columns,
      tableLoad: parameter => {
        let request = pageNetworkTarget
        if (this.selectKey === 2) {
          request = pageNetworkTargetSummary
        }
        return request(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      queryParam: {}
    }
  },

  components: {
    SearchComPro,
    STable,
    PermBox,
    monthTargetEntry
  },

  computed: {},

  created() {
    this.getTab()
  },

  methods: {
    affirm(record) {
      let _this = this
      let cardId = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          confirmNetworkTarget(cardId).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        }
      })
    },
    //删除按钮
    deletes(record) {
      let _this = this
      let cardId = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeNetworkTarget(cardId).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        }
      })
    },
    openModal(record) {
      console.log(record)
      let title = ''
      if (record) {
        title = this.selectKey === 1 ? '月度目标修改' : ''
      } else {
        title = this.selectKey === 1 ? '月度目标录入' : ''
      }
      this.$refs.monthTargetEntry.open(title, record)
    },
    selectKeyHandle(e) {
      this.selectKey = e
      this._refreshTable()
    },
    getTab() {
      let arr = ['analysis:networktarget:view', 'analysis:networktarget-summary:view']
      arr.forEach(item => {
        if (this.handlePermBox(item)) {
          this.tabList.push(this.tab.find(todo => todo.perm === item))
        }
      })
      this.selectKey = this.tabList[0].id
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      if (this.tabList.length === 2) {
        let index = null
        switch (this.selectKey) {
          case 1:
            index = '0'
            break
          case 2:
            index = '1'
            break
        }
        let str = `table${index}`
        this.$nextTick(() => {
          this.$refs[str][0].refresh()
        })
      } else {
        this.$nextTick(() => {
          console.log(this.$refs['table0'])
          this.$refs['table0'][0].refresh()
        })
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
