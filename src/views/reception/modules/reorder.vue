<template>
  <div class="studentinfo-wrapper">
    <!-- 续卡弹框 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      width="90%"
      title="补录续卡"
      @cancel="reorderCancel"
      :footer="null"
      v-model="reorderVisible"
    >
      <!-- <div class="card_wrapper" style="position: relative">
        <a-button type="primary" class="mt10" @click="setValForTable()" style="margin-bottom: 0.1rem;">新增</a-button>
      </div> -->
      <a-table :columns="columns" class="stuApplyTable" size="default" :dataSource="tableList" :scroll="{ x: 700 }" :pagination="false" rowKey="key">
        <span slot="oldCardId" slot-scope="text, record">
          <!-- 往期卡种 -->
          <a-select
            show-search
            :filter-option="filterOption"
            @change="onChange(true, record, $event)"
            style="width: 100%;"
            :allowClear="true"
            :disabled="!record.newCardId"
            v-model="record.oldCardId"
          >
            <a-select-option v-for="item in lastCardOptions" :value="item.cardId" :disabled="item.disabled" :key="item.cardId" :dropdownMatchSelectWidth="false">
              {{ item.cardMsg }}
            </a-select-option>
          </a-select>
        </span>
        <span slot="newCardId" slot-scope="text, record">
          <!-- 续卡卡种 -->
          <a-select
            show-search
            :filter-option="filterOption"
            @change="onChange(false, record, $event)"
            style="width: 100%;"
            :allowClear="true"
            v-model="record.newCardId"
          >
            <a-select-option
              v-for="item in issueCards"
              :value="item.cardId"
              :disabled="item.disabled || item.type == 'A'"
              :key="item.cardId"
              :dropdownMatchSelectWidth="false"
            >
              {{ item.cardMsg }}
            </a-select-option>
          </a-select>
        </span>
        <span slot="sysValConfId" slot-scope="text, record">
          <!-- 续卡分类 -->
          <a-select show-search :filter-option="filterOption" style="width: 100%;" :allowClear="true" v-model="record.sysValConfId" :disabled="true">
            <a-select-option v-for="item in cardNextTypeList" :value="item.id" :disabled="item.disabled" :key="item.id" :dropdownMatchSelectWidth="false">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </span>
        <span slot="sysValTypeConfId" slot-scope="text, record">
          <!-- 续卡类型 -->
          <a-select style="width: 100%;" :allowClear="true" v-model="record.sysValTypeConfId" :disabled="true">
            <a-select-option v-for="item in cardNextList" :value="item.id" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </span>
        <span slot="remark" slot-scope="text, record">
          <a-input v-model="record.remark" style="width: 100%;" />
        </span>
        <span slot="action" slot-scope="text, record">
          <perm-box perm="student:nextlog:save">
            <a href="javascript:;" style="min-width: 0.4rem;display: inline-block;" @click="reorderOk(record)">确定</a>
          </perm-box>
          <a href="javascript:;" style="min-width: 0.4rem;display: inline-block;" @click="removeList(record)">删除</a>
        </span>
      </a-table>
      <div class="mt20">
        <s-table ref="table" :scroll="{ x: 700 }" :columns="columnsList" :data="loadData" rowKey="id">
          <span slot="usedMsgTitle">
            往期卡信息
            <a-tooltip placement="topLeft" title="往期卡种/往期卡号/结束日期">
              <a-icon type="info-circle" />
            </a-tooltip>
          </span>
          <div slot="usedMsg" slot-scope="text, record">
            <div>{{ record.lastCardName }}{{ '/' + record.lastCardNo }}{{ record.lastEndDate ? '/' + record.lastEndDate.split(' ')[0] : '' }}</div>
          </div>
          <span slot="action" slot-scope="text, record">
            <perm-box perm="student:nextlog:del">
              <a href="#" @click="delect(record)">删除</a>
            </perm-box>
          </span>
        </s-table>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { listSysValConf } from '@/api/common'
import { getConfig, cardNextType } from '@/api/education'
import { listStuCardNextLog, listStuCardNextLog2, saveNextCard, pageNextLog, delStuCardNext } from '@/api/reception/student'
const defaultLayout = {
  labelCol: { md: { span: 6 } },
  wrapperCol: { md: { span: 16 } }
}
import PermBox from '@/components/PermBox'
import { STable } from '@/components'
let columns = [
  {
    title: '续卡卡种',
    dataIndex: 'newCardId',
    width: 200,
    scopedSlots: { customRender: 'newCardId' }
  },
  {
    title: '往期卡种',
    width: 200,
    dataIndex: 'oldCardId',
    scopedSlots: { customRender: 'oldCardId' }
  },
  {
    title: '续卡分类',
    width: 200,
    dataIndex: 'sysValConfId',
    scopedSlots: { customRender: 'sysValConfId' }
  },
  {
    title: '续卡类型',
    dataIndex: 'sysValTypeConfId',
    width: 200,
    scopedSlots: { customRender: 'sysValTypeConfId' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
let columnsList = [
  {
    title: '续卡日期',
    dataIndex: 'createDate',
    width: 100,
    customRender: (text, record) => {
      const { createDate } = record
      return createDate.split(' ')[0]
    }
  },
  {
    title: '续卡分馆',
    width: 120,
    dataIndex: 'deptName'
  },
  {
    title: '续卡卡号',
    dataIndex: 'stuCardNo',
    width: 100
  },
  {
    title: '续卡卡种',
    dataIndex: 'cardName',
    width: 200
  },

  {
    title: '续卡实缴金额',
    dataIndex: 'price',
    width: 100
  },

  {
    title: '应缴金额',
    dataIndex: 'totalPrice',
    width: 100
  },

  {
    title: '缴费类型',
    dataIndex: 'finType',
    width: 100,
    customRender: (text, record) => {
      return record.finType === 'A' ? '全款' : record.finType === 'B' ? '定金' : record.finType === 'C' ? '补缴' : record.finType === 'D' ? '退款' : ''
    }
  },

  {
    dataIndex: 'usedMsg',
    width: 300,
    scopedSlots: { customRender: 'usedMsg', title: 'usedMsgTitle' }
  },
  {
    title: '续卡确认状态',
    dataIndex: 'finCardStatus',
    width: 100,
    customRender: (text, record) => {
      return record.finCardStatus === 'A' ? '未确认' : record.finCardStatus === 'B' ? '已确认' : record.finCardStatus === 'C' ? '已作废' : ''
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: 100
  }
]
export default {
  components: { STable, PermBox },
  props: {
    stuId: {
      type: Object,
      default: ''
    }
  },
  data() {
    return {
      isConfirming: false,
      tableList: [],
      loadData: parameter => {
        return pageNextLog(Object.assign(parameter, { stuInfo: this.stuId.stuPhone })).then(res => {
          return res
        })
      },
      columns,
      columnsList,
      currentRecord: null,
      reorderVisible: false, //续卡弹框
      issueCards: [], //续卡卡种下拉
      lastCardOptions: [], // 往期卡种下拉
      cardNextList: [],
      cardNextTypeList: []
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.getCardNextList()
    this.getCardNextTypeList()
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    onChange(flag, record, value) {
      for (let i of this.tableList) {
        for (let j of this.issueCards) {
          j.disabled = false
          if (i.oldCardId == j.cardId) {
            j.disabled = true
          }
          if (i.newCardId == j.cardId) {
            j.disabled = true
          }
        }
        this.currentRecord = record
        this.getCardIdPre()
      }
      this.$forceUpdate()
      if (flag) {
        if (!value) {
          record.sysValConfId = undefined
          record.sysValTypeConfId = undefined
        } else {
          let name = this.issueCards.filter(item => item.cardId == value)[0].cardTypeName
          let cardTypeName = this.issueCards.filter(item => item.cardId == record.newCardId)[0].cardTypeName
          getConfig({
            lastCardType: name,
            newCardType: cardTypeName
          })
            .then(res => {
              if (res.data && res.data.sysValConfId) {
                record.sysValConfId = res.data.sysValConfId
                if (res.data.sysValTypeConfId) {
                  record.sysValTypeConfId = res.data.sysValTypeConfId
                } else {
                  record.sysValTypeConfId = undefined
                }
              } else {
                record.sysValConfId = undefined
                record.sysValTypeConfId = undefined
              }
              this.$forceUpdate()
            })
            .catch(err => {
              record.sysValConfId = undefined
              record.sysValTypeConfId = undefined
            })
        }
      }
    },
    getCardNextList() {
      listSysValConf('cardNext').then(res => {
        this.cardNextList = res.data || []
      })
    },
    getCardNextTypeList() {
      cardNextType().then(res => {
        this.cardNextTypeList = res.data || []
      })
    },
    //删除
    delect(record) {
      this.$confirm({
        title: '系统提示',
        content: '确定要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          delStuCardNext(record.id).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            this._refreshTable()
          })
        }
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
      this.queryCardSelect()
    },
    //删除
    removeList(data) {
      const {
        tableList,
        tableList: { length },
        setListNo
      } = this
      const { key } = data
      for (let i = length - 1; i >= 0; i--) {
        if (i === key) {
          tableList.splice(i, 1)
          setListNo()
        }
      }
    },
    //重置list
    setListNo() {
      const { tableList } = this
      tableList.map((item, idx) => {
        item.key = idx
      })
    },
    //新增
    setValForTable() {
      const { tableList } = this
      const key = tableList.length
      let tableItem = {
        oldCardId: '',
        newCardId: '',
        remark: '',
        key: key,
        sysValConfId: '',
        sysValTypeConfId: ''
      }
      this.tableList = [...tableList, tableItem]
    },
    // 续卡卡种和往期卡种现在不同
    queryCardSelect() {
      this.getLastCardId()
    },
    // 获取续卡卡种
    async getLastCardId() {
      const res = await listStuCardNextLog2({ stuId: this.stuId.stuId })
      if (res.code == 200) {
        this.issueCards = res.data.map(item => {
          if (item.endDate) {
            let date = item.endDate.split(' ')[0]
            item.cardMsg = `${item.stuCardNo}${item.cardName}(${date})`
          } else {
            item.cardMsg = `${item.stuCardNo}${item.cardName}`
          }
          return item
        })
      }
    },
    //获取往期卡种
    async getCardIdPre() {
      if (!this.currentRecord) return
      let { newCardId } = this.currentRecord
      const res = await listStuCardNextLog({ stuId: this.stuId.stuId, cardId: newCardId })
      if (res.code == 200) {
        this.lastCardOptions = res.data.map(item => {
          if (item.endDate) {
            let date = item.endDate.split(' ')[0]
            item.cardMsg = `${item.stuCardNo}${item.cardName}(${date})`
          } else {
            item.cardMsg = `${item.stuCardNo}${item.cardName}`
          }
          return item
        })
      }
    },

    //续卡
    open() {
      this.queryCardSelect()

      this.tableList = [
        {
          oldCardId: '',
          newCardId: '',
          remark: '',
          key: 0,
          sysValConfId: '',
          sysValTypeConfId: ''
        }
      ]
      this.reorderVisible = true
    },
    //续卡取消
    reorderCancel() {
      this.reorderVisible = false
    },
    //续卡成功
    reorderOk(record) {
      if (this.isConfirming) return
      if (!record.oldCardId) {
        this.$notification['error']({
          message: '系统通知',
          description: `请选择新增续卡`
        })
        return
      }
      if (!record.newCardId) {
        this.$notification['error']({
          message: '系统通知',
          description: `请选择往期卡种`
        })
        return
      }
      // if (!record.sysValConfId) {
      //   this.$notification['error']({
      //     message: '系统通知',
      //     description: `请选择续卡分类`
      //   })
      //   return
      // }
      this.isConfirming = true
      let params = JSON.parse(JSON.stringify(record))
      delete params.key
      saveNextCard(params).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this._refreshTable()
          this.removeList(record)
          this.setValForTable()
        }
      }).finally(() => {
        this.isConfirming = false
      })
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import '~@/assets/style/index';
</style>
