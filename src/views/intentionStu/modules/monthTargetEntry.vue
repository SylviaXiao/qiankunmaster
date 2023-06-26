<template>
  <div>
    <a-modal
      :confirmLoading="loading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="1050"
      :title="title"
      @ok="editSubmit"
      @cancel="editCancel"
      v-model="enterVisible"
    >
      <a-table :columns="columns" :dataSource="tableData" :rowKey="(record, index) => index" :pagination="false" :loading="tableLoading" bordered>
        <template slot="month" slot-scope="text, record, index">
          <a-month-picker @change="changeDate(record.month, index)" @focus="dateFocus(record)" v-model="record.month" />
        </template>
        <template slot="channel" slot-scope="text, record, index">
          <a-cascader
            @change="dataChange(record.channel, index)"
            :options="channelList"
            :showSearch="{ dataFilter }"
            notFoundContent="暂无数据"
            placeholder="请选择渠道"
            :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
            changeOnSelect
            style="width:100%;"
            v-model="record.channel"
          />
        </template>
        <template slot="drainageNum" slot-scope="text, record, index">
          <a-input-number v-model="record.drainageNum" style="width:100%" :min="0" @blur="changeNum(record.drainageNum, index, 'drainageNum')" />
        </template>
        <template slot="inversionRate" slot-scope="text, record, index">
          <a-input-number
            v-model="record.inversionRate"
            style="width:80%"
            :min="0"
            :max="100"
            @blur="changeNum(record.inversionRate, index, 'inversionRate')"
          />&nbsp;&nbsp;%
        </template>
        <template slot="targetNum" slot-scope="text, record, index">
          <a-input-number v-model="record.targetNum" style="width:100%" :min="0" @blur="changeNum(record.targetNum, index, 'targetNum')" />
        </template>
        <template slot="price" slot-scope="text, record">
          <a-input-number v-model="record.price" style="width:85%" :min="0" />&nbsp;&nbsp;万
        </template>
        <span slot="action" slot-scope="text, record, index">
          <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="tableData.length - 1 == index && title.includes('录入')" />
          <a-icon type="minus-circle" class="icon" style="margin: 7px;" @click.stop="subtract(index)" v-if="tableData.length !== 1 && title.includes('录入')" />
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { saveNetworkTarget, getNetworkTarget, changeNetworkTarget } from '@/api/intentionStu/adviser'
import { getChannelTreeByUser } from '@/api/common'

export default {
  data() {
    return {
      loading: false,
      enterVisible: false,
      title: null,
      columns: [
        {
          title: '目标月份',
          key: 'month',
          dataIndex: 'month',
          scopedSlots: { customRender: 'month' },
          width: 130
        },
        {
          title: '渠道',
          dataIndex: 'channel',
          scopedSlots: { customRender: 'channel' },
          width: 300
        },
        {
          title: '引流目标数',
          dataIndex: 'drainageNum',
          scopedSlots: { customRender: 'drainageNum' }
        },
        {
          title: '资源转化率目标值',
          dataIndex: 'inversionRate',
          scopedSlots: { customRender: 'inversionRate' }
        },
        {
          title: '资源目标数',
          dataIndex: 'targetNum',
          scopedSlots: { customRender: 'targetNum' }
        },
        {
          title: '业绩目标金额',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 80
        }
      ],
      tableLoading: false,
      tableData: [{ channel: [], sysChannelId: '', drainageNum: '', inversionRate: '', targetNum: '', price: '', month: '' }],
      channelList: [],
      id: null
    }
  },

  components: {},

  computed: {},

  created() {},

  methods: {
    dataFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    dataChange(val, index) {
      if (val && val.length) {
        this.tableData[index].sysChannelId = val.join(',')
      }
    },
    changeNum(val, index, key) {
      let reg = /^\+?[1-9][0-9]*$/
      if (!reg.test(val)) {
        this.tableData[index][key] = ~~val
      }
    },
    changeDate(date, index) {
      this.tableData[index].month = this.$tools.tailor.getMonth(date)
    },
    //获取焦点
    dateFocus(record) {
      // this.DateIndex = this.students.findIndex(item => item.stuId === record.stuId)
    },
    async open(title, record) {
      this.title = title
      let { data } = await getChannelTreeByUser()
      this.channelList = data
      if (record) {
        this.id = record.id
        let res = await getNetworkTarget({ networkTargetId: record.id })
        if (res.code === 200) {
          let id = res.data.ids.split(',')
          this.$set(res.data, 'channel', id)
          this.$set(res.data, 'sysChannelId', res.data.ids)
          this.tableData = [res.data]
        }
      }

      this.enterVisible = true
    },
    //减去多选一行
    subtract(index) {
      this.tableData.splice(index, 1)
    },
    //新增多选部分
    add() {
      this.tableData.push({
        channel: [],
        sysChannelId: '',
        drainageNum: '',
        inversionRate: '',
        targetNum: '',
        price: '',
        month: ''
      })
    },
    editCancel() {
      this.tableData = [{ channel: [], sysChannelId: '', drainageNum: '', inversionRate: '', targetNum: '', price: '', month: '' }]
    },
    editSubmit() {
      if (this.id) {
        changeNetworkTarget({
          networkTargets: JSON.stringify(this.tableData)
        })
          .then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.enterVisible = false
              this.editCancel()
              this.$emit('refresh')
            }
          })
          .finally((this.loading = false))
      } else {
        saveNetworkTarget({
          networkTargets: JSON.stringify(this.tableData)
        })
          .then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.enterVisible = false
              this.editCancel()
              this.$emit('refresh')
            }
          })
          .finally((this.loading = false))
      }
    }
  }
}
</script>
<style lang="less" scoped>
.icon {
  color: #1890ff;
  font-size: 16px;
}
@media screen and (max-width: 1200px) {
  /deep/.ant-table-content {
    overflow-x: scroll;
  }
  /deep/.ant-table {
    overflow: hidden;
  }
  /deep/.ant-table-body {
    width: 1050px;
  }
}
</style>
