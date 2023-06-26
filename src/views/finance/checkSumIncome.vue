<template>
  <div class="check-payment wrapper">
    <a-card :bordered="false" style="margin: 20px 0;">
      <div class="search-wrapper">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin: 20px 0;">
      <perm-box perm="finance:info:public:approve_confirm">
        <div style="text-align:right; margin: 10px 0;">
          <a-radio-group @change="changeCheck" :default-value="queryParam.isConfirm" button-style="solid" v-model="queryParam.isConfirm">
            <a-radio-button :value="false">未确认</a-radio-button>
            <a-radio-button :value="true">已确认</a-radio-button>
          </a-radio-group>
        </div>
      </perm-box>
      <s-table
        ref="table"
        :columns="queryParam.isConfirm ? columns2 : columns1"
        :data="loadData"
        :alert="false"
        :rowKey="(record, index) => index"
        :showPagination="false"
        :defaultPagination="true"
      >
        <span slot="action" slot-scope="text, record">
          <perm-box perm="finance:info:public:approve_confirm">
            <a href="javascript:;" v-if="!queryParam.isConfirm" @click="checkPrice(record, 'Y')">确认</a>
            <a href="javascript:;" v-if="queryParam.isConfirm" @click="checkPrice(record, 'N')">取消</a>
            <a href="javascript:;" @click="openDetail(record)">详情</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <!--列表确认-->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="确认信息"
      v-model="modal"
      width="600px"
      okText="保存"
      cancelText="取消"
      @ok="submit"
      @cancel="cancel"
      :confirmLoading="isloading"
    >
      <!--<div class="mb10">应收金额： {{ record.price }}</div>
      <div class="mb10">到账金额： {{ record.actualPrice }}</div>-->
      <!--<div class="mb10">
        银行账户：
        <a-select v-model="bankName" style="width:200px;">
          <a-select-option v-for="(item, index) in bankNos" :key="index" :value="item.bankNo">{{ item.bankNo }}</a-select-option>
        </a-select>
      </div>
      <div class="mb10">
        确认时间：
        <a-date-picker v-model="confirmDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
      </div>-->
      <div class="mb30">分馆：{{ detailRecordDeptName }}</div>
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
        <div class="mb30" v-for="(item, index) in detailRecordMix" :key="index">
          <div class="mb10">到账时间：{{ item._minDate }} ~ {{ item._maxDate }}</div>
          <div class="mb10">银行账户：{{ item.bankNo }}</div>
          <div class="mb10">到账金额：{{ item._actualPrice }}</div>
        </div>
      </div>
      <div class="mb30">合计：{{ detailRecordActualPrice }}</div>
    </a-modal>

    <!--详情-->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="detailTitle" :footer="null" v-model="detailModal" width="1200px" @cancel="detailCancel">
      <perm-box perm="finance:info:public:approve_confirm">
        <div class="btn-wrapper mb20">
          <a-button v-if="!queryParam.isConfirm" @click.native="checkDetailPrice(null, 'Y')">批量确认</a-button>
          <a-button v-if="queryParam.isConfirm" class="ml20" @click.native="checkDetailPrice(null, 'N')">批量取消</a-button>
        </div>
      </perm-box>
      <a-radio-group v-model="detailModalTableType" @change="detailModalTableTypeChange" style="margin-bottom: 16px">
        <a-radio-button value="income">
          收入明细
        </a-radio-button>
        <a-radio-button value="storefront">
          店面收入管理
        </a-radio-button>
      </a-radio-group>
      <s-table ref="detailTable" v-if="detailModal" :rowSelection="detailRowSelection" :columns="detailColumns" :data="detailLoadData" rowKey="financeId">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="finance:info:public:approve_confirm">
            <a href="javascript:;" v-if="!queryParam.isConfirm" @click="checkDetailPrice(record, 'Y')">确认</a>
            <a href="javascript:;" v-if="queryParam.isConfirm" @click="checkDetailPrice(record, 'N')">取消</a>
          </perm-box>
        </span>
      </s-table>
    </a-modal>

    <!--详情确认-->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="确认信息"
      v-model="detailConfirmModal"
      width="600px"
      okText="保存"
      cancelText="取消"
      @ok="detailConfirmSubmit"
      @cancel="detailConfirmCancel"
      :confirmLoading="isloading"
    >
      <div class="mb30">分馆：{{ detailRecordDeptName }}</div>
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
        <div class="mb30" v-for="(item, index) in detailRecordMix" :key="index">
          <div class="mb10">到账时间：{{ item._minDate }} ~ {{ item._maxDate }}</div>
          <div class="mb10">银行账户：{{ item.bankNo }}</div>
          <div class="mb10">到账金额：{{ item._actualPrice }}</div>
        </div>
      </div>
      <div class="mb30">合计：{{ detailRecordActualPrice }}</div>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro, PermBox } from '@/components'
import {
  listPublicApprove,
  publicApproveConfirm,
  publicApproveCancel,
  listPublicApproveDetail,
  publicApproveSingleConfirm,
  publicApproveSingleConfirmShop,
  publicApproveSingCancelShop,
  publicApproveSingCancel,
  PublicApproveDetail,
  listPublicApproveDetail2
} from '@/api/finance/finance'
import { listBank } from '@/api/education/card'
import moment from 'moment'

const defaultDate = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
export default {
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  computed: {
    detailRowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
    }
  },
  data() {
    return {
      moment,
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '选择时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultDate[0], 'YYYY-MM-DD'), moment(defaultDate[1], 'YYYY-MM-DD')]
        }
      ],
      columns1: [
        {
          title: '分馆',
          dataIndex: 'deptName'
        },
        {
          title: '应收',
          dataIndex: 'price',
          customRender: (text, record) => {
            // if(text)return text.toFixed(2)
            return text
          }
        },
        {
          title: '手续费',
          dataIndex: 'serviceCharge',
          customRender: (text, record) => {
            // if(text)return text.toFixed(2)
            return text
          }
        },
        {
          title: '到账',
          dataIndex: 'actualPrice',
          customRender: (text, record) => {
            // if(text)return text.toFixed(2)
            return text
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns2: [
        {
          title: '分馆',
          dataIndex: 'deptName'
        },
        {
          title: '收入时间',
          dataIndex: 'approveStartDate',
          customRender: (text, record) => {
            let min = record.approveStartDate ? moment(record.approveStartDate).format('YYYY-MM-DD') : ''
            let max = record.approveEndDate ? moment(record.approveEndDate).format('YYYY-MM-DD') : ''
            return min + ' ~ ' + max
          }
        },
        {
          title: '应收',
          dataIndex: 'price'
        },
        {
          title: '到账',
          dataIndex: 'actualPrice'
        },
        {
          title: '手续费',
          dataIndex: 'serviceCharge'
        },
        {
          title: '确认人',
          dataIndex: 'userName'
        },
        {
          title: '确认时间',
          dataIndex: 'confirmDate',
          customRender: (text, record) => {
            return text ? moment(text).format('YYYY-MM-DD') : ''
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        startDate: defaultDate[0],
        endDate: defaultDate[1],
        isConfirm: (() => {
          return !this.$tools.checkPerm('finance:info:public:approve_confirm')
        })()
      },
      tableLoading: false,
      modal: false,
      bankNos: [],
      bankName: '',
      confirmDate: moment(new Date()).format('YYYY-MM-DD'),
      isloading: false,
      loadData: parameter => {
        return listPublicApprove(this.queryParam).then(res => {
          return res
        })
      },
      type: null,
      record: {},

      detailTitle: '详情',
      detailModal: false,
      detailParam: {},
      detailColumns: [
        {
          title: '到账时间',
          dataIndex: 'confirmDate',
          customRender: (text, record) => {
            return text ? moment(text).format('YYYY-MM-DD') : ''
          }
        },
        {
          title: '分馆',
          dataIndex: 'deptName'
        },
        {
          title: '银行账户',
          dataIndex: 'bankNo'
        },
        {
          title: '到账金额',
          dataIndex: 'actualPrice'
        },
        {
          title: '缴费日期',
          dataIndex: 'tradeDate',
          customRender: (text, record) => {
            return text ? moment(text).format('YYYY-MM-DD') : ''
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      detailModalTableType: 'income',
      detailLoadData: parameter => {
        if (this.detailModalTableType == 'income') {
          return listPublicApproveDetail(Object.assign(parameter, this.detailParam)).then(res => {
            return res
          })
        } else {
          return listPublicApproveDetail2(Object.assign(parameter, this.detailParam)).then(res => {
            return res
          })
        }
      },
      selectedRowKeys: [],
      selectedRows: [],
      detailRecordType: '',
      detailRecordIds: [],
      detailRecordMix: [],
      detailRecordDeptName: '',
      detailRecordActualPrice: 0,
      detailConfirmModal: false
    }
  },
  created() {},
  methods: {
    detailModalTableTypeChange(e) {
      this._refreshDetailTable()
    },
    cancel() {},
    submit() {
      // if (!this.bankName && this.type === 'Y') {
      //   return this.$notification['error']({
      //     message: '系统通知',
      //     description: '请先填写银行账户'
      //   })
      // }

      let params = {
        startDate: defaultDate[0],
        endDate: defaultDate[1],
        // bankName: this.bankName,
        confirmDate: this.confirmDate,
        orgDeptId: this.record.deptId
      }
      this.isloading = true
      let confirmApi = this.type === 'Y' ? publicApproveConfirm : publicApproveCancel
      confirmApi(Object.assign(params, this.queryParam))
        .then(res => {
          if (res.code == 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.modal = false
            this._refreshTable()
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: res.msg
            })
          }
        })
        .finally((this.isloading = false))
    },

    searchSubmit(data) {
      console.log(data)
      this.queryParam.startDate = data.startDate || defaultDate[0]
      this.queryParam.endDate = data.endDate || defaultDate[1]
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    checkPrice(record, type) {
      this.type = type
      this.record = record
      this.bankName = ''
      this.confirmDate = (record.confirmDate ? moment(record.confirmDate) : moment()).format('YYYY-MM-DD')
      if (type === 'N') {
        return this.$confirm({
          title: '系统提示',
          content: '是否取消该条数据',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.submit()
          }
        })
      }
      const { startDate, endDate, isConfirm } = this.queryParam
      const { approveStartDate, approveEndDate } = record
      this.detailParam = {
        isConfirm,
        orgDeptId: record.deptId,
        startDate: !isConfirm ? startDate : approveStartDate,
        endDate: !isConfirm ? endDate : approveEndDate
      }
      PublicApproveDetail(Object.assign({ page: 0, limit: 0 }, this.detailParam))
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.checkDetailPriceByBatch(res.data)
          }
        })
        .finally((this.modal = true))
      // listBank({ schoolId: record.deptId })
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.bankNos = res.data
      //     }
      //   })
      //   .finally((this.modal = true))
    },
    changeCheck(e) {
      this.queryParam.isConfirm = e.target.value
      this._refreshTable()
    },

    openDetail(record) {
      const { startDate, endDate, isConfirm } = this.queryParam
      const { approveStartDate, approveEndDate } = record
      this.detailParam = {
        isConfirm,
        orgDeptId: record.deptId,
        startDate: !isConfirm ? startDate : approveStartDate,
        endDate: !isConfirm ? endDate : approveEndDate
      }
      this.detailModalTableType = 'income'
      this.detailModal = true
    },
    detailCancel() {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    checkDetailPrice(record, type) {
      this.detailRecordType = type
      if (record) {
        record._minDate = moment(record.confirmDate).format('YYYY-MM-DD')
        record._maxDate = moment(record.confirmDate).format('YYYY-MM-DD')
        record._actualPrice = record.actualPrice
        this.detailRecordIds = [record.financeId]
        this.detailRecordMix = [record]
        this.detailRecordDeptName = record.deptName
        this.detailRecordActualPrice = record.actualPrice
        this.detailConfirmModal = true
      } else {
        this.examine().then(() => {
          this.checkDetailPriceByBatch(this.selectedRows)
          this.detailRecordIds = this.selectedRowKeys
          this.detailConfirmModal = true
        })
      }
    },
    checkDetailPriceByBatch(list) {
      this.detailRecordMix = []
      list.forEach((cur, index) => {
        let findIndex = this.detailRecordMix.findIndex(item => item.bankNo == cur.bankNo)
        if (findIndex >= 0) {
          let next = this.detailRecordMix[findIndex]
          if (moment(cur.confirmDate).isBefore(moment(next._minDate))) {
            next._minDate = moment(cur.confirmDate).format('YYYY-MM-DD')
          }
          if (moment(cur.confirmDate).isAfter(moment(next._maxDate))) {
            next._maxDate = moment(cur.confirmDate).format('YYYY-MM-DD')
          }
          next._actualPrice = this.$number(next._actualPrice)
            .plus(cur.actualPrice)
            .toNumber()
        } else {
          cur._minDate = moment(cur.confirmDate).format('YYYY-MM-DD')
          cur._maxDate = moment(cur.confirmDate).format('YYYY-MM-DD')
          cur._actualPrice = cur.actualPrice
          this.detailRecordMix.push(cur)
        }
      })
      this.detailRecordDeptName = list[0].deptName
      this.detailRecordActualPrice = this.detailRecordMix
        .map(data => data._actualPrice)
        .reduce((a, b) => this.$number(a).plus(b), this.$number(0))
        .toNumber()
    },
    detailConfirmSubmit() {
      let params = {
        financeIds: this.detailRecordIds.join(','),
        bankName: this.detailRecordMix[0].bankNo,
        orgDeptId: this.detailRecordMix[0].deptId
      }
      this.isloading = true
      // publicApproveSingCancelShop
      let confirmApi = ''
      if (this.detailModalTableType == 'income') {
        confirmApi = this.detailRecordType === 'Y' ? publicApproveSingleConfirm : publicApproveSingCancel
      } else {
        confirmApi = this.detailRecordType === 'Y' ? publicApproveSingleConfirmShop : publicApproveSingCancelShop
      }
      confirmApi(params)
        .then(res => {
          if (res.code == 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.detailConfirmCancel()
            this.detailCancel()
            this._refreshDetailTable()
            this._refreshTable()
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: res.msg
            })
          }
        })
        .finally((this.isloading = false))
    },
    _refreshDetailTable() {
      this.$refs.detailTable.refresh()
    },
    detailConfirmCancel() {
      this._refreshDetailConfirm()
      this.detailConfirmModal = false
    },
    // 校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve()
        }
      })
    },
    _refreshDetailConfirm() {
      this.detailRecordType = ''
      this.detailRecordIds = []
      this.detailRecordMix = []
      this.detailRecordDeptName = ''
      this.detailRecordActualPrice = 0
    }
  }
}
</script>

<style lang="less" scoped>
.radio-wrapper {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;

  .date-content {
    line-height: 40px;
  }
}

.check-payment-table-wrapper {
  .uncheck-price {
    min-width: 248px;
  }

  .ant-table-thead > tr:first-child > th:first-child {
    min-width: 250px !important;
  }
}
</style>
