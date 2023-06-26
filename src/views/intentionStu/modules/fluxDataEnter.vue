<template>
  <div>
    <a-modal
      :confirmLoading="loading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="this.selectKey === 1 ? 1400 : 900"
      :title="title"
      @ok="editSubmit"
      @cancel="editCancel"
      v-model="enterVisible"
    >
      <div :class="this.selectKey === 1 ? 'tableBox1' : 'tableBox2'">
        <a-table
          :columns="this.selectKey === 1 ? columns : two_columns"
          :dataSource="tableData"
          :rowKey="(record, index) => index"
          :pagination="false"
          :loading="tableLoading"
          bordered
        >
          <span slot="redTitle">
            标红
            <a-tooltip placement="topLeft" title="有效客资">
              <a-icon type="question-circle" style="font-size:12px;color:#999;" />
            </a-tooltip>
          </span>
          <span slot="yellowTitle">
            标黄
            <a-tooltip placement="topLeft" title="有联系方式，暂时发不出去">
              <a-icon type="question-circle" style="font-size:12px;color:#999;" />
            </a-tooltip>
          </span>
          <span slot="greenTitle">
            标绿
            <a-tooltip placement="topLeft" title="本地的资源客服没有留到联系方式的">
              <a-icon type="question-circle" style="font-size:12px;color:#999;" />
            </a-tooltip>
          </span>
          <span slot="orangeTitle">
            标橙
            <a-tooltip placement="topLeft" title="外地教练班未留到联系方式">
              <a-icon type="question-circle" style="font-size:12px;color:#999;" />
            </a-tooltip>
          </span>
          <span slot="blackTitle">
            标黑
            <a-tooltip placement="topLeft" title="无聊/骂人/已是资源/学员/合作">
              <a-icon type="question-circle" style="font-size:12px;color:#999;" />
            </a-tooltip>
          </span>
          <span slot="blueTitle">
            标蓝
            <a-tooltip placement="topLeft" title="只说了一句话，就走了 ">
              <a-icon type="question-circle" style="font-size:12px;color:#999;" />
            </a-tooltip>
          </span>
          <span slot="grayTitle">
            标灰
            <a-tooltip placement="topLeft" title="外地少儿未满14岁">
              <a-icon type="question-circle" style="font-size:12px;color:#999;" />
            </a-tooltip>
          </span>
          <template slot="date" slot-scope="text, record, index">
            <a-date-picker  format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" @change="changeDate(record.date, index)" @focus="dateFocus(record)" :disabled-date="disabledDate" v-model="record.date" />
          </template>
          <template slot="channelId" slot-scope="text, record, index">
            <!-- @change="dataChange(record.feeItemFinanceArr, index, 'Finance')" -->
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
            <!-- <a-select slot="addonAfter" v-model="record.channelId" style="width: 100%;">
            <a-select-option v-for="(item, index) in channelList" :key="index" :value="item.id">{{ item.name }} </a-select-option>
          </a-select> -->
          </template>
          <template slot="addAnaNum" slot-scope="text, record, index">
            <a-input-number v-model="record.addAnaNum" style="width:100%" :min="0" @blur="changeNum(record.addAnaNum, index, 'addAnaNum')" />
          </template>
          <template slot="addSouNum" slot-scope="text, record, index">
            <a-input-number v-model="record.addSouNum" style="width:100%" :min="0" @blur="changeNum(record.addSouNum, index, 'addSouNum')" disabled />
          </template>
          <template slot="adviceedNum" slot-scope="text, record, index">
            <a-input-number v-model="record.adviceedNum" style="width:100%" :min="0" @blur="changeNum(record.adviceedNum, index, 'adviceedNum')" />
          </template>
          <!-- <template slot="weChatSouNum" slot-scope="text, record, index">
          <a-input-number v-model="record.weChatSouNum" style="width:100%" :min="0" @blur="changeNum(record.weChatSouNum, index, 'weChatSouNum')" disabled />
        </template> -->
          <template slot="markRedNum" slot-scope="text, record, index">
            <a-input-number v-model="record.markRedNum" style="width:100%" :min="0" @blur="changeNum(record.markRedNum, index, 'markRedNum')" />
          </template>
          <template slot="markYellowNum" slot-scope="text, record, index">
            <a-input-number v-model="record.markYellowNum" style="width:100%" :min="0" @blur="changeNum(record.markYellowNum, index, 'markYellowNum')" />
          </template>
          <template slot="markGreenNum" slot-scope="text, record, index">
            <a-input-number v-model="record.markGreenNum" style="width:100%" :min="0" @blur="changeNum(record.markGreenNum, index, 'markGreenNum')" />
          </template>
          <template slot="markOrangeNum" slot-scope="text, record, index">
            <a-input-number v-model="record.markOrangeNum" style="width:100%" :min="0" @blur="changeNum(record.markOrangeNum, index, 'markOrangeNum')" />
          </template>
          <template slot="markBlackNum" slot-scope="text, record, index">
            <a-input-number v-model="record.markBlackNum" style="width:100%" :min="0" @blur="changeNum(record.markBlackNum, index, 'markBlackNum')" />
          </template>
          <template slot="markBlueNum" slot-scope="text, record, index">
            <a-input-number v-model="record.markBlueNum" style="width:100%" :min="0" @blur="changeNum(record.markBlueNum, index, 'markBlueNum')" />
          </template>
          <template slot="markGrayNum" slot-scope="text, record, index">
            <a-input-number v-model="record.markGrayNum" style="width:100%" :min="0" @blur="changeNum(record.markGrayNum, index, 'markGrayNum')" />
          </template>
          <template slot="leftPhoneNum" slot-scope="text, record, index">
            <a-input-number v-model="record.leftPhoneNum" style="width:100%" :min="0" @blur="changeNum(record.leftPhoneNum, index, 'leftPhoneNum')" />
          </template>
          <template slot="adviceedNum" slot-scope="text, record, index">
            <a-input-number v-model="record.adviceedNum" style="width:100%" :min="0" @blur="changeNum(record.adviceedNum, index, 'adviceedNum')" />
          </template>
          <template slot="onlyAnaNum" slot-scope="text, record, index">
            <a-input-number v-model="record.onlyAnaNum" style="width:100%" :min="0" @blur="changeNum(record.onlyAnaNum, index, 'onlyAnaNum')" />
          </template>
          <span slot="action" slot-scope="text, record, index">
            <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="tableData.length - 1 == index && title.includes('录入')" />
            <a-icon
              type="minus-circle"
              class="icon"
              style="margin: 7px;"
              @click.stop="subtract(index)"
              v-if="tableData.length !== 1 && title.includes('录入')"
            />
          </span>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import {
  saveAnaBusiness,
  getChannelTreeByUser,
  getAnaBusinessById,
  updateAnaBusiness,
  saveAnaNewMedia,
  updateAnaNewMedia,
  getAnaNewMediaById,
  newGetChannelTreeByUser
} from '@/api/intentionStu/adviser'

const defaultDate = moment()
  .subtract(1, 'days')
  .format('YYYY-MM-DD')
export default {
  data() {
    return {
      loading: false,
      enterVisible: false,
      title: null,
      columns: [
        {
          title: '录入日期',
          key: 'date',
          dataIndex: 'date',
          scopedSlots: { customRender: 'date' },
          width: 130
        },
        {
          title: '渠道',
          dataIndex: 'channelId',
          scopedSlots: { customRender: 'channelId' },
          width: 400
        },
        {
          title: '新增引流数',
          dataIndex: 'addAnaNum',
          scopedSlots: { customRender: 'addAnaNum' }
        },
        // {
        //   title: '新增资源数',
        //   dataIndex: 'addSouNum',
        //   scopedSlots: { customRender: 'addSouNum' }
        // },
        {
          title: '已咨询数',
          dataIndex: 'adviceedNum',
          scopedSlots: { customRender: 'adviceedNum' }
        },
        // {
        //   title: '微信资源',
        //   dataIndex: 'weChatSouNum',
        //   scopedSlots: { customRender: 'weChatSouNum' }
        // },
        // {
        //   title: '标红',
        //   dataIndex: 'markRedNum',
        //   scopedSlots: { customRender: 'markRedNum', title: 'redTitle' }
        // },
        // {
        //   title: '标黄',
        //   dataIndex: 'markYellowNum',
        //   scopedSlots: { customRender: 'markYellowNum', title: 'yellowTitle' }
        // },
        // {
        //   title: '标橙',
        //   dataIndex: 'markGreenNum',
        //   scopedSlots: { customRender: 'markGreenNum', title: 'greenTitle' }
        // },
        // {
        //   title: '标橙',
        //   dataIndex: 'markOrangeNum',
        //   scopedSlots: { customRender: 'markOrangeNum', title: 'orangeTitle' }
        // },
        // {
        //   title: '标黑',
        //   dataIndex: 'markBlackNum',
        //   scopedSlots: { customRender: 'markBlackNum', title: 'blackTitle' }
        // },
        // {
        //   title: '标蓝',
        //   dataIndex: 'markBlueNum',
        //   scopedSlots: { customRender: 'markBlueNum', title: 'blueTitle' }
        // },
        // {
        //   title: '标灰',
        //   dataIndex: 'markGrayNum',
        //   scopedSlots: { customRender: 'markGrayNum', title: 'grayTitle' }
        // },
        {
          title: '新加好友数',
          dataIndex: 'leftPhoneNum',
          scopedSlots: { customRender: 'leftPhoneNum' }
        },

        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 80
        }
      ],
      two_columns: [
        {
          title: '录入日期',
          key: 'date',
          dataIndex: 'date',
          scopedSlots: { customRender: 'date' },
          width: 130
        },
        {
          title: '渠道',
          dataIndex: 'channelId',
          scopedSlots: { customRender: 'channelId' },
          width: 230
        },
        {
          title: '新增引流数',
          dataIndex: 'addAnaNum',
          scopedSlots: { customRender: 'addAnaNum' }
        },
        // {
        //   title: '新增资源数',
        //   dataIndex: 'addSouNum',
        //   scopedSlots: { customRender: 'addSouNum' }
        // },
        {
          title: '已咨询数',
          dataIndex: 'adviceedNum',
          scopedSlots: { customRender: 'adviceedNum' }
        },
        // {
        //   title: '净引流数',
        //   dataIndex: 'onlyAnaNum',
        //   scopedSlots: { customRender: 'onlyAnaNum' }
        // },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 80
        }
      ],
      tableLoading: false,
      tableData: [],
      channelList: [],
      id: null
    }
  },
  props: {
    selectKey: {
      type: Number,
      default: 0
    }
  },
  components: {},

  computed: {},

  created() {

  },

  methods: {
    dataChange(val, index) {
      if (val && val.length) {
        // 只传最后一级
        let finalChannel = val[val.length - 1]
        this.tableData[index].channelId =  finalChannel // val.join(',')
      }
    },
    dataFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    changeNum(val, index, key) {
      let reg = /^\+?[1-9][0-9]*$/
      if (!reg.test(val)) {
        this.tableData[index][key] = ~~val
      }
    },
    changeDate(date, index) {
      this.tableData[index].date = this.$tools.tailor.getDate(date)
    },
    //获取焦点
    dateFocus(record) {
      // this.DateIndex = this.students.findIndex(item => item.stuId === record.stuId)
    },
    //超过今天不能选择
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    async open(title, record) {
      this.title = title
      let obj = {}
      if (this.selectKey === 1) {
        let { data } = await getChannelTreeByUser()
        this.channelList = data
        obj = {
          date: moment(defaultDate, 'YYYY-MM-DD'),
          channelId: null,
          addAnaNum: null,
          addSouNum: null,
          // adviceedNum: null,
          // weChatSouNum: null,
          markRedNum: null,
          markYellowNum: null,
          markOrangeNum: null,
          markBlackNum: null,
          markBlueNum: null,
          markGrayNum: null,
          leftPhoneNum: null,
          channel: []
        }
      } else {
        let { data } = await newGetChannelTreeByUser()
        this.channelList = data
        obj = {
          date: moment(defaultDate, 'YYYY-MM-DD'),
          channel: [],
          channelId: null,
          addAnaNum: '',
          addSouNum: '',
          adviceedNum: '',
          onlyAnaNum: ''
        }
      }
      this.tableData.push(obj)
      this.changeDate(this.tableData[0].date, 0)
      if (record) {
        this.id = record.id
        if (this.selectKey === 1) {
          let res = await getAnaBusinessById({ id: record.id })
          if (res.code === 200) {
            let id = res.data.ids.split(',')
            this.$set(res.data, 'channel', id)
            res.data.channelId = res.data.ids
            this.tableData = [res.data]
          }
        } else {
          let res = await getAnaNewMediaById({ id: record.id })
          if (res.code === 200) {
            let id = res.data.ids.split(',')
            res.data.channelId = res.data.ids
            this.$set(res.data, 'channel', id)
            this.tableData = [res.data]
          }
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
      if (this.selectKey === 1) {
        this.tableData.push({
          date: defaultDate,
          channelId: null,
          addAnaNum: null,
          addSouNum: null,
          adviceedNum: null,
          markGreenNum: null,
          // weChatSouNum: null,
          markRedNum: null,
          markYellowNum: null,
          markOrangeNum: null,
          markBlackNum: null,
          markBlueNum: null,
          markGrayNum: null,
          leftPhoneNum: null,
          channel: []
        })
      } else {
        this.tableData.push({
          date:defaultDate,
          channel: [],
          channelId: null,
          addAnaNum: '',
          addSouNum: '',
          adviceedNum: '',
          onlyAnaNum: ''
        })
      }
    },
    editCancel() {
      this.id = null
      this.tableData = []
    },
    editSubmit() {
      let arr = [
        'markRedNum',
        'markYellowNum',
        'markOrangeNum',
        'markBlackNum',
        'markBlueNum',
        'markGrayNum',
        'onlyAnaNum',
        'sourcePrice',
        'addSouNum',
        'markGreenNum'
      ]
      for (let i = 0; i < this.tableData.length; i++) {
        for (let key in this.tableData[i]) {
          if (!arr.includes(key) && (this.tableData[i][key] === null || this.tableData[i][key] === '')) {
            return this.$notification['error']({
              message: '系统通知',
              description: '请先填写完整表格'
            })
          }
        }
      }
      this.loading=true
      if (this.selectKey === 1) {
        if (this.id) {
          let {
            date,
            channelId,
            addAnaNum,
            addSouNum,
            adviceedNum,
            markGreenNum,
            // weChatSouNum,
            markRedNum,
            markYellowNum,
            markOrangeNum,
            markBlackNum,
            markBlueNum,
            markGrayNum,
            leftPhoneNum,
            id
          } = this.tableData[0]

          let channelIds = channelId.split(',')
          updateAnaBusiness({
            id,
            date,
            channelId : channelIds[channelIds.length - 1],
            addAnaNum,
            addSouNum,
            adviceedNum,
            markGreenNum,
            markRedNum,
            markYellowNum,
            markOrangeNum,
            markBlackNum,
            markBlueNum,
            markGrayNum,
            leftPhoneNum
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
          let arr = this.tableData.map(item => {
            let todo = item
            delete todo.channel
            return todo
          })
          saveAnaBusiness({
            anaBusinesss: JSON.stringify(arr)
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
      } else {
        if (this.id) {
          let { date, channelId, addAnaNum, addSouNum, adviceedNum, onlyAnaNum, id } = this.tableData[0]

          let channelIds = channelId.split(',')
          updateAnaNewMedia({
            date,
            channelId : channelIds[channelIds.length - 1],
            addAnaNum,
            addSouNum,
            adviceedNum,
            onlyAnaNum,
            id
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
          let arr = this.tableData.map(item => {
            let todo = item
            delete todo.channel
            return todo
          })
          saveAnaNewMedia({
            newMedia: JSON.stringify(arr)
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
}
</script>
<style lang="less" scoped>
.icon {
  color: #1890ff;
  font-size: 16px;
}
@media screen and (max-width: 1200px) {
  /deep/.ant-table-content {
    overflow-x: auto;
  }
  /deep/.ant-table {
    overflow: hidden;
  }
  .tableBox1 {
    /deep/.ant-table-body {
      width: 1400px;
    }
  }
  .tableBox2 {
    /deep/.ant-table-body {
      width: 900px;
    }
  }
}
</style>
