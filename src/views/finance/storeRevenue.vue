<template>
  <div class="stu-leave-wrapper">
    <perm-box perm="finance:shop:view">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
      <a-card :bordered="false">
        <div class="btn-wrapper">
          <a-space :size="15">
            <perm-box perm="finance:shop:save">
              <a-button icon="plus-circle" type="primary" @click="add()">新增</a-button>
            </perm-box>
            <perm-box perm="finance:shop:save" v-if="showBatchConfirm">
              <a-button @click="handleConfirm()">批量确认</a-button>
            </perm-box>
            <perm-box perm="finance:shop:save" v-if="showBatchConfirm">
              <a-button @click="handleCancel()">批量取消</a-button>
            </perm-box>
          </a-space>
        </div>
        <s-table
          ref="table"
          size="default"
          :rowSelection="showBatchConfirm ? rowSelection : undefined"
          :columns="storeRevenueColunm"
          :data="loadData"
          rowKey="id"
        >
          <span slot="price" slot-scope="text, record">
            {{ text | fixTofloat }}
          </span>
          <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:shop:save">
              <a href="#" @click="edit(record)">修改</a>
            </perm-box>
            <perm-box perm="finance:shop:del">
              <a href="#" @click="remove(record)">删除</a>
            </perm-box>
            <perm-box perm="finance:shop:confirm" v-if="!record.finSpendingBankId">
              <a href="#" @click="handleConfirm(record)">确认</a>
            </perm-box>
            <perm-box perm="finance:shop:confirm" v-if="record.finSpendingBankId">
              <a href="#" @click="handleCancel(record)">取消确认</a>
            </perm-box>
          </span>
        </s-table>
      </a-card>
    </perm-box>
    <StoreRevenueAddEdit ref="storeRevenue" @refresh="_refreshTable" :title="title"></StoreRevenueAddEdit>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="确认信息"
      v-model="confirmVisible"
      width="600px"
      okText="保存"
      cancelText="取消"
      @ok="handleConfirmOk"
      @cancel="handleConfirmCancel"
    >
      <div>
        银行账户：
        <a-select v-model="bankNo" style="width:200px;">
          <a-select-option v-for="(item, index) in bankNos" :key="index" :value="item.id">{{ item.bankNo }}</a-select-option>
        </a-select>
      </div>
      <div class="mt20">
        确认时间：
        <a-date-picker v-model="confirmDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
      </div>
      <div class="mt20">
        手续费：
        <a-input-number v-model="serviceCharge" :min="0" />
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { getSchoolList, listBank } from '@/api/education/card'
import { pageFinShop, removeFinShop, saveFinShopToBankDetail } from '@/api/finance/finance'
import { getPayMethods } from '@/api/education'
import { storeRevenueColunm } from './finance'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import StoreRevenueAddEdit from './modules/StoreRevenueAddEdit'
export default {
  components: {
    StoreRevenueAddEdit,
    SearchComPro,
    STable,
    PermBox
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'storeRevenue') {
          let { deptId, endDate, startDate, name, payTypeId } = this.$route.query
          if (deptId) this.queryParam.school_id = deptId
          if (endDate) this.queryParam.endDate = endDate
          if (startDate) this.queryParam.startDate = startDate
          if (payTypeId) this.queryParam.dictId = payTypeId
          if (name) this.queryParam.name = name
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '录入时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'text',
          key: 'name',
          label: '搜索收入项',
          placeholder: '请输入收入项'
        },
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'dictId',
          label: '支付方式',
          placeholder: '请选择支付方式',
          expandAll: true,
          treeCheckable: false,
          selectFather: false,
          treeOps: {
            api: getPayMethods,
            label: 'dictValue',
            value: 'id',
            children: 'children'
          }
        }
      ],
      storeRevenueColunm,
      selectedRowKeys: [],
      selectedRows: [],
      queryParam: {},
      loadData: parameter => {
        return pageFinShop(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      title: '',
      record: null,
      confirmVisible: false,
      bankNos: [],
      bankNo: null,
      serviceCharge: 0,
      confirmDate: moment(new Date()).format('YYYY-MM-DD'),
    }
  },
  computed: {
    showBatchConfirm() {
      return this.queryParam.school_id || this.$store.getters.school_id
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
    }
  },

  methods: {
    add() {
      this.title = '新增'
      this.$refs.storeRevenue.open()
    },
    edit(record) {
      this.title = '编辑'
      this.$refs.storeRevenue.open().then(() => {
        this.$nextTick(() => {
          this.$refs.storeRevenue.backindData(record)
        })
      })
    },
    remove(record) {
      let _this = this
      let params = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeFinShop(params).then(() => {
            _this._refreshTable()
          })
        }
      })
    },
    handleConfirm(record) {
      this.record = record
      let func = () => {
        listBank({ schoolId: this.record?.deptId || this.showBatchConfirm }).then(res => {
          if (res.code === 200) {
            this.bankNos = res.data
            this.confirmVisible = true
          }
        })
      }

      if (this.record) {
        func()
      } else {
        this.examine().then(func)
      }
    },
    handleConfirmOk() {
      saveFinShopToBankDetail({
        finShopIds: this.record ? this.record.id : this.selectedRowKeys.join(','), // 店面收入id数组
        bankId: this.bankNo, // 银行id
        serviceCharge: this.serviceCharge,
        confirmDate: this.confirmDate,
        isCancel: false // 是否取消确认
      }).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
        }
        this.handleConfirmCancel()
        this._refreshTable()
      })
    },
    handleConfirmCancel() {
      this.record = null
      this.bankNo = null
      this.serviceCharge = 0
      this.confirmDate = moment(new Date()).format('YYYY-MM-DD')
      this.confirmVisible = false
    },
    handleCancel(record) {
      let func = () => {
        this.$confirm({
          title: '系统提示',
          content: '是否进行"取消确认"操作',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            saveFinShopToBankDetail({
              finShopIds: record ? record.id : this.selectedRowKeys.join(','), // 店面收入id数组
              isCancel: true // 是否取消确认
            }).then(() => {
              this._refreshTable()
            })
          }
        })
      }

      if (record) {
        func()
      } else {
        this.examine().then(func)
      }
    },
    handleBatchConfirm(flag) {
      if (flag) {
      }
    },
    //校验是否有勾选
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
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-wrapper {
  .btn-wrapper {
    margin-bottom: 20px;
  }
}
</style>
