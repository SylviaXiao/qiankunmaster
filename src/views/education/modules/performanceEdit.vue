<template>
  <div>
    <a-modal
      :title="record.className"
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1000"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="close"
    >
      <a-row :gutter="[8, 16]">
        <a-col :span="6">上课分馆：{{ record.deptName }}</a-col>
        <a-col :span="6">开班日期：{{ $tools.tailor.getDate(record.startDate) }}</a-col>
        <a-col :span="6">结业日期：{{ $tools.tailor.getDate(record.endDate) }}</a-col>
        <a-col :span="6">上课导师：{{ Array.isArray(record.teacherName) ? record.teacherName.join(',') : '' }}</a-col>
        <a-col :span="6">班型：{{ record.eduTypeName }}>{{ record.eduClassTypeName }}</a-col>
        <a-col :span="6">舞种：{{ record.eduDanceName }}</a-col>
        <a-col :span="6">教研负责人：{{ record.userName }}</a-col>
      </a-row>

      <div class="mt30">
        <div class="title mb10">上课人数</div>
        <a-table
          ref="table1"
          bordered
          :columns="columns1"
          :dataSource="dataSource1"
          :loading="tableLoading"
          :rowKey="(record, index) => index"
          :pagination="false"
        >
          <span slot="sysValConfId" slot-scope="text, record">
            <a-select
              :allowClear="true"
              v-model="record.sysValConfId"
              placeholder="请选择学员状态"
              :dropdownMatchSelectWidth="false"
              style="width: 100%"
              @change="stateChange(record)"
            >
              <a-select-option v-for="(item, index) in stuStatusList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </span>
          <span slot="stuContinuity" slot-scope="text, record">
            <a-checkbox :checked="record.stuContinuity === 'A'" @change="continuityChange(record)">是</a-checkbox>
          </span>
          <span slot="cardInfo" style="display: flex">
            <div class="head" style="width: 120px;">签到卡号</div>
            <div class="head" style="width: 120px;">续卡卡号</div>
            <div class="head" style="width: 160px;">续卡卡种名称</div>
          </span>
          <span slot="cardInfo" slot-scope="text, record">
            <div v-for="(signCard, si) in record.card" :key="si" class="row">
              <div class="cell" style="width: 120px;">{{ signCard.signCardNo }}</div>
              <div v-if="Array.isArray(signCard.renewalCard) && signCard.renewalCard.length > 0">
                <div v-for="(nextCard, ni) in signCard.renewalCard" :key="ni" class="row">
                  <div class="cell" style="width: 120px;">{{ nextCard.renewalCardNo }}</div>
                  <div class="cell" style="width: 160px;">
                    <div class="ellipsis" :title="nextCard.renewalCardName">{{ nextCard.renewalCardName }}</div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="row">
                  <div class="cell" style="width: 120px;">&nbsp;</div>
                  <div class="cell" style="width: 160px;">&nbsp;</div>
                </div>
              </div>
            </div>
          </span>
        </a-table>
      </div>

      <div class="mt30">
        <div class="title mb10">特殊续卡 （例如：上课学员存在续卡，但无法显示的续卡）</div>
        <div class="mb10">
          <a-space :size="15">
            <a-button type="primary" icon="plus-circle" @click="chooseStu(2)">选择学员</a-button>
            <a-popconfirm title="确定要删除吗" @confirm="removeStu(2)">
              <a-button type="primary" icon="minus-circle">删除学员</a-button>
            </a-popconfirm>
          </a-space>
        </div>
        <a-table
          ref="table2"
          bordered
          :columns="columns2"
          :rowSelection="rowSelection2"
          :dataSource="dataSource2"
          :loading="tableLoading"
          rowKey="studentInfoId"
          :pagination="false"
        >
          <span slot="cardInfo" style="display: flex">
            <div class="head" style="width: 320px;">续卡卡号</div>
            <div class="head" style="width: 200px;">续卡类型</div>
            <div class="head" style="min-width: 60px; width: calc(100% - 400px);">操作</div>
          </span>
          <span slot="cardInfo" slot-scope="text, record, index">
            <div v-for="(card, ni) in record.renewalCard" :key="ni" class="row">
              <div class="cell" style="width: 320px;">
                <a-select
                  :value="card._renewalValue"
                  placeholder="请选择续卡卡号"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  style="width: 100%"
                  @dropdownVisibleChange="queryCardLog(record, card, $event)"
                  @change="renewalCardNoChange(record, card, $event)"
                >
                  <a-select-option v-for="option in record._renewalOptions" :key="option.stuCardNo" :value="option._renewalValue">
                    {{ option._renewalValue }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="cell" style="width: 200px;">{{ card.cardType | cardTypeFilter }}</div>
              <div class="cell" style="min-width: 60px; width: calc(100% - 400px);">
                <a class="ml10 mr10" @click="addRow(2, index, ni)"><a-icon type="plus-circle"/></a>
                <a class="ml10 mr10" v-if="record.renewalCard.length > 1" @click="removeRow(2, index, ni)"><a-icon type="minus-circle"/></a>
              </div>
            </div>
          </span>
        </a-table>
      </div>

      <div class="mt30">
        <div class="title mb10">往期续卡</div>
        <div class="mb10">
          <a-space :size="15">
            <a-button type="primary" icon="plus-circle" @click="chooseStu(3)">选择学员</a-button>
            <a-popconfirm title="确定要删除吗" @confirm="removeStu(3)">
              <a-button type="primary" icon="minus-circle">删除学员</a-button>
            </a-popconfirm>
          </a-space>
        </div>
        <a-table
          ref="table3"
          bordered
          :columns="columns3"
          :rowSelection="rowSelection3"
          :dataSource="dataSource3"
          :loading="tableLoading"
          rowKey="studentInfoId"
          :pagination="false"
        >
          <span slot="cardInfo" style="display: flex">
            <div class="head" style="width: 320px;">续卡卡号</div>
            <div class="head" style="width: 200px;">续卡类型</div>
            <div class="head" style="min-width: 60px; width: calc(100% - 400px);">操作</div>
          </span>
          <span slot="cardInfo" slot-scope="text, record, index">
            <div v-for="(card, ni) in record.renewalCard" :key="ni" class="row">
              <div class="cell" style="width: 320px;">
                <a-select
                  :value="card._renewalValue"
                  placeholder="请选择续卡卡号"
                  :allowClear="true"
                  :dropdownMatchSelectWidth="false"
                  style="width: 100%"
                  @dropdownVisibleChange="queryCardLog(record, card, $event)"
                  @change="renewalCardNoChange(record, card, $event)"
                >
                  <a-select-option v-for="option in record._renewalOptions" :key="option.stuCardNo" :value="option._renewalValue">
                    {{ option._renewalValue }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="cell" style="width: 200px;">{{ card.cardType | cardTypeFilter }}</div>
              <div class="cell" style="min-width: 60px; width: calc(100% - 400px);">
                <a class="ml10 mr10" @click="addRow(3, index, ni)"><a-icon type="plus-circle"/></a>
                <a class="ml10 mr10" v-if="record.renewalCard.length > 1" @click="removeRow(3, index, ni)"><a-icon type="minus-circle"/></a>
              </div>
            </div>
          </span>
        </a-table>
      </div>
    </a-modal>

    <ChooseStu
      ref="choosestu"
      :checkBox="true"
      :branch="true"
      :schooShow="true"
      :adviser="true"
      :stuType="true"
      :coachClass="true"
      @getBackData="chooseStuBackData"
    />
  </div>
</template>

<script>
import { STable, SearchComPro, PermBox, ChooseStu } from '@/components'
import {
  listAchClassStudent,
  listAchClassStudentSpecial,
  listSysValConf,
  getCardLog,
  listAchClassStudentStateSave,
  listAchClassStudentContinuitySave
} from '@/api/education'

const noPaddingCell = (record, rowIndex) => {
  return {
    style: {
      padding: '0px!important'
    }
  }
}
const columns1 = [
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 120
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120
  },
  {
    title: '学员状态',
    dataIndex: 'sysValConfId',
    scopedSlots: { customRender: 'sysValConfId' },
    customCell: noPaddingCell,
    width: 200
  },
  {
    title: '是否连报',
    dataIndex: 'stuContinuity',
    scopedSlots: { customRender: 'stuContinuity' }
  },
  {
    dataIndex: 'cardInfo',
    slots: { title: 'cardInfo' },
    scopedSlots: { customRender: 'cardInfo' },
    customHeaderCell: noPaddingCell,
    customCell: noPaddingCell,
    width: 400
  }
]
const columns2 = [
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 120
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120
  },
  {
    dataIndex: 'cardInfo',
    slots: { title: 'cardInfo' },
    scopedSlots: { customRender: 'cardInfo' },
    customHeaderCell: noPaddingCell,
    customCell: noPaddingCell,
    width: 460
  }
]
const columns3 = [
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 120
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120
  },
  {
    dataIndex: 'cardInfo',
    slots: { title: 'cardInfo' },
    scopedSlots: { customRender: 'cardInfo' },
    customHeaderCell: noPaddingCell,
    customCell: noPaddingCell,
    width: 460
  }
]

export default {
  name: 'performanceEdit',
  components: {
    SearchComPro,
    STable,
    PermBox,
    ChooseStu
  },
  data() {
    return {
      record: {},
      curType: null,
      visible: false,
      confirmLoading: false,

      stuStatusList: [],

      tableLoading: false,
      columns1,
      dataSource1: [],
      columns2,
      dataSource2: [],
      selectedRowKeys2: [],
      selectedRows2: [],
      columns3,
      dataSource3: [],
      selectedRowKeys3: [],
      selectedRows3: []
    }
  },
  computed: {
    rowSelection2() {
      return {
        selectedRowKeys: this.selectedRowKeys2,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys2 = selectedRowKeys
          this.selectedRows2 = selectedRows
        }
      }
    },
    rowSelection3() {
      return {
        selectedRowKeys: this.selectedRowKeys3,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys3 = selectedRowKeys
          this.selectedRows3 = selectedRows
        }
      }
    }
  },
  filters: {
    cardTypeFilter(type) {
      const map = {
        A: '本期续卡',
        B: '往期续卡'
      }
      return map[type] || ''
    }
  },
  created() {
    this.initOptions()
  },
  methods: {
    open(record) {
      this.visible = true
      this.record = record
      this.initList(this.record.id)
    },
    close() {
      this.visible = false
      this.record = {}
      this.curType = null
      this.dataSource1 = []
      this.dataSource2 = []
      this.dataSource3 = []
    },
    showLoading() {
      this.confirmLoading = true
    },
    hideLoading() {
      this.confirmLoading = false
    },
    handleOk() {
      let hasEmptystudentState = false
      this.dataSource1.forEach(student => {
        const { sysValConfId } = student
        if (!sysValConfId) {
          hasEmptystudentState = true
          return false
        }
      })
      if (hasEmptystudentState) {
        this.$message.warning('请完善上课人数学员状态')
        return
      }

      const forEachBack = (data, renewalCardType) => {
        if (Array.isArray(data.renewalCard) && data.renewalCard.length > 0) {
          data.renewalCard.forEach(card => {
            let index = dataSource.findIndex(d => d.renewalCardType === renewalCardType && d.renewalCardNo === card.renewalCardNo)
            if (card.renewalCardNo && index === -1) {
              const { studentInfoId, stuName, stuPhone } = data
              const { renewalCardNo, cardType, cardName } = card
              dataSource.push({
                studentInfoId,
                renewalCardType,
                stuName,
                stuPhone,
                renewalCardNo,
                cardType,
                cardName
              })
            }
          })
        }
      }
      let dataSource = []
      this.dataSource2.forEach(data => forEachBack(data, 'A'))
      this.dataSource3.forEach(data => forEachBack(data, 'B'))
      console.log('dataSource', dataSource)
      this.$emit('confirm', this.record.id, dataSource)
    },
    initList(id) {
      this.queryClassStudent(id)
      this.queryClassStudentSpecial(id)
    },
    async queryClassStudent(id) {
      const res1 = await listAchClassStudent({ id })
      this.dataSource1 = res1.data || []
    },
    async queryClassStudentSpecial(id) {
      const res2 = await listAchClassStudentSpecial({ id })
      const dataSource = res2.data || []
      dataSource.forEach(item => {
        const { renewalCardType } = item
        item.renewalCard.map(card => {
          const { renewalCardNo, cardName } = card
          card._renewalValue = `${renewalCardNo}/${cardName}`
        })
        if (renewalCardType === 'A') {
          this.dataSource2.push(item)
        } else if (renewalCardType === 'B') {
          this.dataSource3.push(item)
        }
      })
    },
    //校验是否有勾选
    examine(type) {
      return new Promise((resolve, reject) => {
        if (this['selectedRowKeys' + type].length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve()
        }
      })
    },
    clearSelectedRows(type) {
      this['selectedRowKeys' + type] = []
      this['selectedRows' + type] = []
    },
    initOptions() {
      listSysValConf('instructAch').then(res => {
        this.stuStatusList = res.data || []
      })
    },
    stateChange(record) {
      const { id, studentInfoId, sysValConfId } = record
      listAchClassStudentStateSave({ id, studentInfoId, sysValConfId })
    },
    continuityChange(record) {
      if (record.stuContinuity !== 'A') {
        record.stuContinuity = 'A'
      } else {
        record.stuContinuity = 'B'
      }
      const { id, studentInfoId, stuContinuity } = record
      listAchClassStudentContinuitySave({ id, studentInfoId, stuContinuity })
    },
    chooseStu(type) {
      this.curType = type
      this.$refs.choosestu.close()
      this.$refs.choosestu.open()
    },
    chooseStuBackData(data) {
      data.forEach(item => {
        if (this['dataSource' + this.curType].findIndex(d => d.studentInfoId === item.id) === -1) {
          // getCardLog({ studentId: item.id }).then(res => {
          this['dataSource' + this.curType].push({
            studentInfoId: item.id,
            stuName: item.stuName,
            stuPhone: item.stuPhone,
            renewalCard: [
              {
                // _renewalCardOptions: res.data || [],
                renewalCardNo: undefined,
                cardType: undefined,
                cardName: undefined,
                stuCardName: undefined
              }
            ]
          })
          // })
        }
      })
    },
    queryCardLog(record, card, open) {
      if (!open) return
      if (record._renewalOptions?.length > 0) return
      getCardLog({ studentId: record.studentInfoId }).then(res => {
        let options = res.data || []
        options.map(option => {
          option._renewalValue = `${option.stuCardNo}/${option.cardName}`
        })
        this.$set(record, '_renewalOptions', options)
      })
    },
    renewalCardNoChange(record, card, valueStr) {
      let value = valueStr.split('/')[0]
      if (!value) {
        card.cardType = null
        card.cardName = null
        card._renewalValue = null
        return
      }
      if (value === card.renewalCardNo) return

      // 不能选择已有的卡
      let isSame = false
      record.renewalCard.forEach(option => {
        if (value === option.renewalCardNo) {
          isSame = true
          return false
        }
      })
      if (isSame) {
        this.$message.warning('不能选择已有的卡')
        return
      }

      let matchData = record._renewalOptions.find(d => d.stuCardNo === value)
      this.$set(card, 'renewalCardNo', matchData.stuCardNo)
      this.$set(card, 'cardType', matchData.cardType)
      this.$set(card, 'cardName', matchData.cardName)
      this.$set(card, '_renewalValue', matchData._renewalValue)
    },
    removeStu(type) {
      this.examine(type).then(() => {
        this['dataSource' + type] = this['dataSource' + type].filter(d => !this['selectedRowKeys' + type].includes(d.studentInfoId))
        this.clearSelectedRows(type)
      })
    },
    addRow(type, di, ni) {
      const { _renewalCardOptions } = this['dataSource' + type][di].renewalCard[ni]
      this['dataSource' + type][di].renewalCard.splice(ni + 1, 0, {
        _renewalCardOptions,
        renewalCardNo: undefined,
        cardType: undefined,
        cardName: undefined
      })
    },
    removeRow(type, di, ni) {
      this['dataSource' + type][di].renewalCard.splice(ni, 1)
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import '~@/assets/style/index';

.title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;

  &:before {
    display: block;
    content: '';
    width: 4px;
    height: 22px;
    background: @theme-colorNew;
    margin-right: 5px;
  }
}

.head {
  display: flex;
  align-items: center;
  height: 45px;
  padding: 0 5px;
  margin-left: -1px;
  border-left: 1px solid #e8e8e8;
}

.row {
  display: flex;
}

.cell {
  display: flex;
  align-items: center;
  padding: 12px 5px;
  margin: 0 0 -1px -1px;
  border-left: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.ellipsis {
  .ellipsis();
}
</style>
