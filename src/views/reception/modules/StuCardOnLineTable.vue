<template>
  <div>
    <s-table ref="table" :columns="sc_solumns" :data="sc_loadData" rowKey="id">
      <span slot="stuCardNo" slot-scope="text, record" style="display: inline-flex; width: 100%;align-items: center;">
        <a-popover title="卡备注信息">
          <template slot="content">
            <div>{{ record.remark || '无' }}</div>
          </template>
          <a-icon type="qrcode" style="margin-left: 8px;" />
          {{ text }}
        </a-popover>
        <template v-if="record.cardNextId">
          <a-icon type="link" style="margin-left: 8px;" />
        </template>
      </span>
      <span slot="totalPrice" slot-scope="text, record">
        {{ record.paidPrice | fixTofloat }}/{{ record.totalPrice | fixTofloat }}/{{ record.originalPrice | fixTofloat }}
      </span>
      <span slot="payoff" slot-scope="text, record">
        <template v-if="text"
          >结清</template
        >
        <template v-else-if="record.status === 'D'"
          >-</template
        >
        <template v-else>
          <span style="color:red">{{ (record.paidPrice - record.totalPrice) | fixTofloat }}</span>
        </template>
      </span>
      <span slot="createDate" slot-scope="text">{{ handleDate(text) }}</span>
      <span slot="startDate" slot-scope="text">{{ handleDate(text) }}</span>
      <span slot="endDate" slot-scope="text">{{ handleEndDate(text) }}</span>
      <span slot="action" slot-scope="text, record">
        <perm-box perm="education:class-url:bind" v-if="!record.urlStatus || record.urlStatus == 'A'">
          <a href="javascript:;" @click="bindCardHandle(record)">绑定</a>
        </perm-box>
        <perm-box perm="education:class-url:unbind" v-if="record.urlStatus == 'B'">
          <a href="#" @click="unBindCardHandle(record)">作废</a>
        </perm-box>
        <span v-if="record.urlStatus == 'B'">
          <a href="#" style="margin-left: 8px;" @click="copyClassUrlHandle(record)">复制上课链接</a>
        </span>
      </span>
    </s-table>

    <a-modal
      :confirmLoading="loading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="600"
      title="绑定"
      @ok="bindSubmit"
      v-model="bindVisible"
    >
      <div style="display: flex;align-items:center;margin-bottom: 15px;">
        <div class="title">舞种 :</div>
        <div style="margin-left:15px">
          <a-select placeholder="请选择邀请码类型" style="width: 200px" v-model="danceType" @change="changeDanceType">
            <a-select-option :value="item.id" v-for="item in danceTypes" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div style="display: flex;align-items:center;margin-bottom: 15px;" v-if="danceType === 'A' || danceType === 'B'">
        <div class="title">资料包类型 :</div>
        <div style="margin-left:15px">
          <a-select placeholder="请选择邀请码类型" style="width: 200px" v-model="dataType">
            <a-select-option :value="item.id" v-for="item in dataGrams" :key="item.id">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { PermBox, STable } from '@/components'
import { listEduDance, listEduType } from '@/api/common'
import { pageOnStudentCard, pageOnLineStudentCard, bindLiveStudentCard, unBindLiveStudentCard } from '@/api/recep'

const sc_solumns = [
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    scopedSlots: { customRender: 'stuCardNo' },
    width: 120,
    fixed: 'left'
  },
  // {
  //   title: '学员姓名',
  //   dataIndex: 'stuName',
  //   width: 100,
  //   scopedSlots: { customRender: 'stuName' },
  //   fixed: 'left'
  // },
  {
    title: '上课分馆',
    dataIndex: 'deptName',
    width: 120
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    width: 150
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    width: 80
  },
  {
    title: '办卡日期',
    dataIndex: 'createDate',
    width: 100,
    scopedSlots: { customRender: 'createDate' }
  },
  {
    title: '办卡分馆',
    dataIndex: 'createDeptName',
    width: 120
  },
  {
    title: '激活时间',
    dataIndex: 'startDate',
    width: 100,
    scopedSlots: {
      customRender: 'startDate'
    }
  },
  {
    title: '有效期截止',
    dataIndex: 'endDate',
    width: 100,
    scopedSlots: { customRender: 'endDate' }
  },
  {
    title: '实收/应收/原价',
    dataIndex: 'totalPrice',
    width: 150,
    scopedSlots: { customRender: 'totalPrice' }
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    width: 80,
    scopedSlots: { customRender: 'payoff' }
  },
  {
    title: '卡状态',
    dataIndex: 'status',
    width: 80,
    customRender: (text, record) => {
      return text === 'A'
        ? '未使用'
        : text === 'B'
        ? '使用中'
        : text === 'C'
        ? '停课'
        : text === 'D'
        ? '退卡'
        : text === 'E'
        ? '结业'
        : text === 'F'
        ? '撤销'
                  : text === 'G'
                    ? '结转'
        : ''
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]
export default {
  name: 'stuCards',
  components: {
    PermBox,
    STable
  },
  props: {
    queryParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      sc_solumns,
      sc_loadData: parameter => {
        let queryParams = JSON.parse(JSON.stringify(this.queryParams))

        if (!queryParams.invitationType || queryParams.invitationType === 'D') {
          delete queryParams.invitationType
          return pageOnLineStudentCard(Object.assign(parameter, queryParams)).then(res => {
            return res
          })
        } else {
          return pageOnStudentCard(Object.assign(parameter, queryParams)).then(res => {
            return res
          })
        }
      },

      bindVisible: false, //sinvitationType为B时出绑定弹窗
      dataGrams: [{ text: '资料包A', id: 'A' }, { text: '资料包B', id: 'B' }, { text: '资料包C', id: 'C' }],
      danceTypes: [],
      danceType: null,
      dataType: null, //资料包类型
      loading: false,
      bindParams: {
        cardId: '',
        id: ''
      }
    }
  },
  watch: {
    stuId(nv) {
      if (nv) {
        // 拿到studentId以后请求数据渲染列表
        this._refreshTable()
      }
    }
  },
  methods: {
    handleDate(data) {
      return data ? this.$tools.tailor.getDate(data) : ''
    },
    handleEndDate(data) {
      return data ? moment(data).subtract(1, 'seconds').format('YYYY-MM-DD HH:mm') : ''
    },
    // 获取舞种
    getDanceType() {
      return new Promise((resolve, reject) => {
        listEduDance().then(res => {
          resolve(res)
        })
      })
    },
    changeDanceType(val) {
      this.dataType = null
      if (val === 'B') {
        this.dataGrams = [{ text: '孕产瑜伽', id: 'D' }, { text: '普拉提', id: 'E' }, { text: '舞韵瑜伽', id: 'F' }, { text: '阿斯汤加', id: 'G' }]
      } else {
        this.dataGrams = [{ text: '资料包A', id: 'A' }, { text: '资料包B', id: 'B' }, { text: '资料包C', id: 'C' }]
      }
    },
    // 数据导入
    dataImportHandle(danceId, dataType) {
      if (danceId === 'A' || danceId === 'B') {
        this.getDanceType().then(res => {
          if (res.code == 200) {
            this.danceTypes = res.data
          }
        })
        this.danceType = danceId
        this.changeDanceType(danceId)
        this.dataType = null
        this.bindVisible = true
      } else {
        const params = {
          eduCardId: this.bindParams.cardId,
          studentCards: this.bindParams.id,
          invitationType: this.queryParams.invitationType,
          dataType: dataType || '',
          danceId: danceId || ''
        }
        this.bind(params)
      }
    },
    bindCardHandle(record) {
      const params = {
        eduCardId: record.cardId,
        studentCards: record.id,
        invitationType: this.queryParams.invitationType,
        dataType: record.dataType || '',
        danceId: record.danceId || ''
      }
      if (this.queryParams.invitationType === 'C') {
        this.bindParams.cardId = record.cardId
        this.bindParams.id = record.id
        this.dataImportHandle(record.danceId, record.dataType)
        return
      }
      this.bind(params)
    },
    bind(params) {
      this.$confirm({
        title: '系统提示',
        content: '确定要绑定?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          bindLiveStudentCard(params).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '绑定成功'
            })
            this._refreshTable()
          })
        }
      })
    },
    bindSubmit() {
      console.log(this.bindParams)
      this.bindParams.dataType = this.dataType
      this.bindParams.danceId = this.danceType
      const params = {
        eduCardId: this.bindParams.cardId,
        studentCards: this.bindParams.id,
        invitationType: this.queryParams.invitationType,
        dataType: this.bindParams.dataType,
        danceId: this.bindParams.danceId
      }
      this.loading = true
      bindLiveStudentCard(params)
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '绑定成功'
          })

          this._refreshTable()
        })
        .finally((this.loading = false))
    },
    unBindCardHandle(record) {
      const params = {
        studentCards: record.id
      }
      this.$confirm({
        title: '系统提示',
        content: '确定要解除绑定吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unBindLiveStudentCard(params).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '解除成功'
            })
            this._refreshTable()
          })
        }
      })
    },
    copyClassUrlHandle(record) {
      this.$tools.handleCopy(record.url)
    },

    _refreshTable() {
      this.$refs.table.refresh()
      this.$emit('refreshTable', this.queryParams.invitationType)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  text-align: right;
  width: 100px;
}
</style>
