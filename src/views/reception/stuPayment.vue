<template>
  <div>
    <div v-if="!success">
      <a-card class="stuCards" :bordered="false" title="学员信息">
        <div class="student-info-wrapper" v-if="stuInfo">
          <a-row type="flex" justify="start" align="top">
            <a-col :span="16">
              <a-row class="infoItem" type="flex" justify="space-between" align="top">
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">姓名 :</span>
                    <span class="info-item-content">{{ stuInfo.stuName || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">学号 :</span>
                    <span class="info-item-content">{{ stuInfo.stuNo || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">电话 :</span>
                    <span class="info-item-content">{{ stuInfo.stuPhone || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">QQ号 :</span>
                    <span class="info-item-content">{{ stuInfo.stuQQ }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">微信号 :</span>
                    <span class="info-item-content">{{ stuInfo.stuWechat }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">身份证 :</span>
                    <span class="info-item-content">{{ stuInfo.stuIdcard || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">性别 :</span>
                    <span class="info-item-content">{{ stuInfo.stuSex === 'A' ? '男' : '女' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">省市 :</span>
                    <span class="info-item-content">{{ stuInfo.stuArea }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">来源 :</span>
                    <span class="info-item-content">{{ stuInfo.stuSource || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">紧急联系人 :</span>
                    <span class="info-item-content">{{ stuInfo.stuEmergency || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">顾问 :</span>
                    <span class="info-item-content">{{ stuInfo.adviserName || '' }}</span>
                  </div>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <div class="class-info">
                    <span class="info-item-label">备注 :</span>
                    <span class="info-item-content">{{ stuInfo.stuRemark || '' }}</span>
                  </div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <div class="mt10" v-if="showStuAudition">
            <div class="flex item-height">
              <div class="required">是否试课</div>
              <div class="importText ml20 mr10">
                <a-radio-group v-model="stuInfo.stuAudition">
                  <a-radio value="A">是</a-radio>
                  <a-radio value="B">否</a-radio>
                </a-radio-group>
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <a-card class="stuCards" :bordered="false" title="缴费列表">
        <a-table :pagination="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: selectStu, getCheckboxProps: setDisabled, columnTitle: ' ', }"
          :columns="paymentColumns" :dataSource="stuCardsList" rowKey="id">
          <span slot="discount" slot-scope="text, record">
            <a-input-number :disabled="!record.isSelect" v-model="record.discount"
              @change="getTotalPrice(record)"></a-input-number>
            <!-- :max="Number(record.discount)" -->
          </span>
          <span slot="shouldPay" slot-scope="text, record">
            <a-input-number :disabled="!record.isSelect" v-model="record.shouldPay"></a-input-number>
          </span>
          <span slot="paidNow" slot-scope="text, record">
            <a-input-number :disabled="!record.isSelect" v-model="record.paidNow"></a-input-number>
          </span>
        </a-table>
        <div style="line-height: 50px;">
          <div style="float: left; ">
            应缴金额：<span style="color: rgb(223, 39, 62);font-size: 18px;">{{ payable | fixTofloat }} 元</span>
          </div>
        </div>
      </a-card>
      <PaymentCount ref="paymentCount" :paidPrice="paidPrice1" :studentInfo="stuInfo" :hasTypeValue="false"
        :shouldPayMoney="payable" :disabled="true" :backPayment="true" :hideSourceDetailList="true"
        :studentNewCards="stuCardsList"
        :allowChangeService="true" @getBalancePrice="getBalancePrice" @changeSource="handleChangeSource"></PaymentCount>

      <div style="text-align:right">
        <perm-box perm="student:info:paid">
          <a-button type="primary" @click="sendForm()" :loading="submitLoading">提交</a-button>
        </perm-box>
      </div>
    </div>
    <div v-else>
      <a-card :bordered="false">
        <result type="success" description="请关闭该页面" title="提交成功"></result>
      </a-card>
    </div>
  </div>
</template>

<script>
import { STable, PaymentCount, Result } from '@/components'
import PermBox from '@/components/PermBox'
import { listUnPayoffCard, getStuInfo, paidStuCards, proposalAchievementInfo } from '@/api/recep'
import { getConfig, cardNextType } from '@/api/education'
import { listSysValConf } from '@/api/common'
import { listStuCardNextLog } from '@/api/reception/student'
import moment from 'moment'

export default {
  name: 'stuPayment',
  components: {
    PermBox,
    STable,
    PaymentCount,
    Result
  },
  watch: {
    $route(nv, ov) {
      if (nv.params.stuCardsId && nv.path.indexOf('stuPayment') !== -1) {
        this.initPage()
        this.getRouteInfo()
        this.success = false
      }
    },
    payable(nv, ov) { },
    selectedRowKeys(nv) {
      const selectKey = nv
      if (nv.length) {
        proposalAchievementInfo({
          stuCardIds: selectKey.join(',')
        }).then(res => {
          if (res.data && res.data.source) {
            this.source = res.data.source
            this.sourceId = res.data.sourceId
          }
          this.dataBackBelongsTable(res.data)
        })
        let data = this.stuCardsList.filter(d => selectKey.includes(d.id))
        this.showStuAudition = data.findIndex(d => d.isNewCard) >= 0
      } else {
        this.dataBackBelongsTable()
        this.showStuAudition = false
      }
    }
  },
  computed: {
    paymentColumns() {
      return [...this.sp_columns,
      {
        title: '往期卡种（必填）',
        dataIndex: 'lastCardId',
        width: 180,
        customRender: (value, record, index) => {
          let disabled = !this.isLastCardIdChangeable(record)
          let lastCardList = this.lastCardList.filter(item => {
            return item.stuCardNo != record.stuCardNo
          })
          return {
            children:
              <a-select style="width: 180px;" allowClear={true} value={record.lastCardId} disabled={disabled} onChange={(e) => this.onLastCardIdChange(record, e)}>
                {
                  lastCardList.map(item => {
                    return <a-select-option value={item.cardId} key={item.cardId}>
                      {`${item.stuCardNo}${item.cardName}`}
                    </a-select-option>
                  })
                }
              </a-select>
          }
        }
      },
      {
        title: '续卡分类',
        dataIndex: 'sysValConfId',
        width: 140,
        customRender: (value, record, index) => {
          return {
            children:
              <a-select style="width: 140px;" allowClear={true} v-model={record.sysValConfId} disabled={true}>
                {
                  this.cardNextTypeList.map(item => {
                    return <a-select-option value={item.id} key={item.id}>
                      {item.name}
                    </a-select-option>
                  })
                }
              </a-select>
            // <a-select style="width: 100%;" :allowClear="true" v-model="record.sysValConfId" :disabled="true">
            //     <a-select-option v-for="item in cardNextTypeList" :value="item.id" :key="item.id">
            //       {{ item.name }}
            //     </a-select-option>
            //   </a-select>
          }
        }
      },
      {
        title: '续卡类型',
        dataIndex: 'sysValTypeConfId',
        width: 140,
        customRender: (value, record, index) => {
          return {
            children:
              <a-select style="width: 140px;" allowClear={true} v-model={record.sysValTypeConfId} disabled={true}>
                {
                  this.cardNextList.map(item => {
                    return <a-select-option value={item.id} key={item.id}>
                      {item.name}
                    </a-select-option>
                  })
                }
              </a-select>
          }
        }
      },
      ]
    },
    paidPrice1: {
      get() {
        const list = this.stuCardsList
        let paidPrice = 0
        if (list.length > 0) {
          list.forEach(item => {
            let rowIndex = this.selectedRowKeys.findIndex(id => id === item.id)
            let paidNow = rowIndex >= 0 ? (item.paidNow ? item.paidNow : 0) : 0
            paidPrice += paidNow - 0
          })
        }
        return paidPrice
      }
    },
    payable: {
      get() {
        const { stuCardsList, selectedRowKeys } = this
        let payable = 0
        if (stuCardsList.length > 0 && selectedRowKeys.length > 0) {
          stuCardsList.forEach((sc, scIdx) => {
            selectedRowKeys.forEach((srk, srkIdx) => {
              if (sc.id === srk) {
                payable += sc.originalPrice - sc.paidPrice - (sc.discount ? sc.discount : 0)
              }
            })
          })
        }
        return Number(payable.toFixed(2))
      },
      set() { }
    },
  },
  data() {
    return {
      sp_columns: [
        {
          title: '卡号',
          dataIndex: 'stuCardNo',
          key: 'stuCardNo'
        },
        {
          title: '卡种',
          dataIndex: 'cardName',
          key: 'cardName'
        },
        {
          title: '资源来源',
          dataIndex: 'source',
          customRender: (value, record) => {
            // 没有资源来源不再显示默认客服
            return value
          }
        },
        {
          title: '班级',
          dataIndex: 'className',
          key: 'className'
        },
        {
          title: '类型',
          dataIndex: 'typeName',
          key: 'typeName'
        },
        {
          title: '舞种',
          dataIndex: 'danceName',
          key: 'danceName'
        },
        //状态（A:正常,B:停课,C:退班,D:结业）
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          customRender: text => {
            if (text === 'A') {
              return '未使用'
            }
            if (text === 'B') {
              return '使用中'
            }
            if (text === 'C') {
              return '停课'
            }
            if (text === 'D') {
              return '退课'
            }
            if (text === 'E') {
              return '结业'
            }
          }
        },
        {
          title: '激活时间',
          dataIndex: 'startDate',
          key: 'startDate',
          customRender: (text, record) => {
            return record.startDate ? moment(new Date(record.startDate)).format('YYYY-MM-DD') : ''
          }
        },
        {
          title: '办卡时间',
          dataIndex: 'createDate',
          key: 'createDate',
          customRender: (text, record) => {
            return record.createDate ? moment(new Date(record.createDate)).format('YYYY-MM-DD') : ''
          }
        },
        {
          title: '有效期(天)',
          dataIndex: 'validDay',
          key: 'validDay'
        },
        {
          title: '实收/应收/原价',
          dataIndex: 'totalPrice',
          key: 'totalPrice',
          customRender: (text, record) => {
            return `${record.paidPrice}/${record.totalPrice}/${record.originalPrice}`
          }
        },
        {
          title: '使用/总次数',
          dataIndex: 'availableCount',
          key: 'availableCount',
          customRender: (text, record) => {
            return `${~~record.usedCount}/${~~record.totalCount === 0 ? '不限' : ~~record.totalCount}`
          }
        },
        {
          title: '优惠金额(元)',
          dataIndex: 'discount',
          key: 'discount',
          scopedSlots: { customRender: 'discount' }
        },
        {
          title: '补缴金额(元)',
          dataIndex: 'shouldPay',
          key: 'shouldPay'
        },

        {
          title: '本次缴费',
          dataIndex: 'paidNow',
          key: 'paidNow',
          scopedSlots: { customRender: 'paidNow' },
          // fixed: 'right'
        },
      ],
      showRenewalColumns: false,
      cardNextTypeList: [],
      cardNextList: [],
      //
      stuCardId: null,
      stuId: null,
      stuCardsList: [],
      selectedRowKeys: [],
      stuInfo: {},
      submitLoading: false,
      success: false,
      //余额
      balancePrice: 0,
      //资源
      sourceId: null,
      source: '',
      // 是否显示是否试课
      showStuAudition: false,
      // 缴费列表已选中的来源
      selectedSource: '',
      // 往期卡种下拉列表
      lastCardList: [],
    }
  },
  created() {
    this.getRouteInfo()
    this.queryLastCardList()
    this.queryCardNextTypeList()
    this.queryCardNextList()
  },
  methods: {
    getTotalPrice(data) {
      data.shouldPay = data.originalPrice - data.paidPrice - (data.discount ? data.discount : 0)
    },
    initPage() {
      this.selectedRowKeys = []
      this.stuCardsList = []
      this.stuInfo = {}
      this.balancePrice = 0
    },
    getRouteInfo() {
      const _this = this
      const routeInfo = _this.$route.params.stuCardsId || ''
      if (routeInfo.indexOf('_') !== -1) {
        const infoArr = _this.$route.params.stuCardsId.split('_')
        const [stuCardId, stuId] = infoArr
        _this.stuId = stuId
        _this.selectedRowKeys.push(stuCardId)
        _this
          .getStudentIfo(stuId)
          .then(stu => {
            stu.stuCardId = stuCardId
            return _this.getStuCardsList(stu)
          })
          .then(res => {
            _this.stuCardsList = res
            _this.configPaymentCardList(res)
            if (Array.isArray(_this.selectedRowKeys) && _this.selectedRowKeys.length > 0) {
              _this.selectStu(_this.selectedRowKeys)
            }
          })
      }
    },
    configPaymentCardList(list) {
      for (const record of this.stuCardsList) {
        record.hasLastCardId = !!record.lastCardId
      }
    },
    // 续卡分类下拉列表
    async queryCardNextTypeList() {
      cardNextType().then(res => {
        this.cardNextTypeList = res.data || []
      })
    },
    // 续卡类型下拉列表
    async queryCardNextList() {
      listSysValConf('cardNext').then(res => {
        this.cardNextList = res.data || []
      })
    },
    // 获取当前学员的往期卡种
    async queryLastCardList() {
      const res = await listStuCardNextLog({ stuId: this.stuId })
      this.lastCardList = res.data
    },
    isLastCardIdChangeable(record) {
      // 当前行被选择且往期卡种没有被设置过
      return (record.source == '会员续卡' || this.showRenewalColumns) && record.isSelect && !record.hasLastCardId
    },
    getBalancePrice(price) {
      this.balancePrice = price
    },
    getStudentIfo(stuId) {
      return new Promise((resolve, reject) => {
        getStuInfo(stuId)
          .then(res => {
            const result = res.data
            this.stuInfo = result
            if (this.stuInfo.stuAudition == 'B') {
              this.stuInfo.stuAudition = ''
            }
            if (this.source) {
              this.stuInfo.source = this.source
              this.stuInfo.sourceId = this.sourceId
            }
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getStuCardsList(data) {
      return new Promise((resolve, reject) => {
        listUnPayoffCard({ paid: false, studentId: data.id, studentCardId: data.stuCardId })
          .then(res => {
            const result = res.data
            result.forEach(item => {
              item.shouldPay = (item.totalPrice - item.paidPrice).toFixed(2)
            })
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    selectStu(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      if (selectedRowKeys.length == 0) {
        this.selectedSource = null
      }
      //
      this.showRenewalColumns = false
      this.stuCardsList.forEach(item => {
        if (selectedRowKeys.indexOf(item.id) == -1) {
          item.isSelect = false
          //

          if (!item.hasLastCardId) {
            item.lastCardId = null
            item.sysValConfId = null
            item.sysValTypeConfId = null
          }
        } else {
          // 资源来源 = 会员续卡，缴费列表需要多填三个参数
          if (item.source === '会员续卡') {
            this.showRenewalColumns = true
          }

          if (item.source?.length > 0) {
            this.selectedSource = item.source
          }
          item.isSelect = true
        }
      })
      this.stuCardsList = [...this.stuCardsList]
    },
    paidStuCards(params) {
      paidStuCards(params)
        .then(res => {
          if (res.code === 200) {
            params.stuName = this.stuInfo.stuName
            params.stuPhone = this.stuInfo.stuPhone
            params.isPayment = true
            this.pageChange(params).then(fullPath => this.$multiTab.close(fullPath))
            this.submitLoading = false
          }
        })
        .catch(err => {
          this.submitLoading = false
        })
        .finally(() => (this.submitLoading = false))
    },
    pageChange(data) {
      return new Promise((resolve, reject) => {
        const {
          $route: { fullPath }
        } = this
        console.log(data)
        this.$router.push({ path: `/reception/stuApplyResult/${JSON.stringify(data)}` })
        resolve(fullPath)
      })
    },
    setDisabled(record) {
      let disabled = false
      // 如果资源来源是空的或者当前已选择的资源来源是空的，则可以和任何其他的选项一起选择，不会被禁掉
      if (!(record.source?.length > 0) || !(this.selectedSource?.length > 0)) {
        disabled = false
      } else {
        // 已缴清不可选
        // 没有选择，则全部可选，直到选择了一条缴费后，限制只能选择相同类型
        disabled = record.payoff || (this.selectedSource != null && record.source != this.selectedSource)
      }

      return {
        props: {
          disabled,
        }
      }
    },
    // 切换往期卡种
    async onLastCardIdChange(record, value) {
      record.lastCardId = value
      let name = this.lastCardList.filter(item => item.cardId == value)[0]?.cardTypeName
      if (!name) {
        record.sysValConfId = null
        record.sysValTypeConfId = null
        return
      }
      let res = await getConfig({
        lastCardType: name,
        newCardType: record.cardTypeName
      })
      const { sysValConfId, sysValTypeConfId } = res.data
      record.sysValConfId = sysValConfId
      record.sysValTypeConfId = sysValTypeConfId
    },
    handleChangeSource(value) {
      let isContinued = value === '会员续卡'
      this.showRenewalColumns = isContinued
    },
    dataBackBelongsTable(data) {
      if (data) {
        const { adviserAchievements, teacherAchievements, source, sourceId } = data
        const formatData = {
          adviserAchievements: adviserAchievements || [],
          teacherAchievements: teacherAchievements || [],
          source,
          sourceId,
          finance: { id: '' }
        }
        formatData.teacherAchievements = formatData.teacherAchievements.map(d =>
          Object.assign({}, d, { teacherPrice: 0, teacherRatio: 2, teacherRemark: null })
        )
        this.$refs.paymentCount.backDataBelongsTable(formatData)
      } else {
        this.$refs.paymentCount.initBelongsTable()
      }
    },
    sendForm() {
      if (this.showStuAudition && !this.stuInfo.stuAudition) {
        return this.$notification['error']({
          message: '系统通知',
          description: `请选择是否试课`
        })
      }

      let arr = []
      let hasEmptyLastCard = false
      this.stuCardsList.forEach(item => {
        if (this.selectedRowKeys.includes(item.id)) {
          if ((item.source === '会员续卡' || !item.source) && !item.lastCardId) {
            hasEmptyLastCard = true
          }
          let todo = {
            cardId: item.id,
            discountPrice: item.discount,
            paidPrice: item.paidNow || 0,
            toIssueCard: item.lastCardId,
            sysValConfId: item.sysValConfId,
            sysValTypeConfId: item.sysValTypeConfId,
            source: item.source
          }
          arr.push(todo)
        }
      })
      // 如果资源来源都没有，则不需要选择往期卡种
      let tempRenewalCount = 0
      arr.forEach(item => {
        if (item.source === '会员续卡') { tempRenewalCount++ }
        delete item.source
      })

      if (hasEmptyLastCard && tempRenewalCount > 0) {
        return this.$notification['error']({
          message: '系统通知',
          description: `请完善资源来源为会员续卡的往期卡种`
        })
      }
      const _this = this
      _this.submitLoading = true
      let formValues = new Object()
      formValues.stuId = _this.stuId
      formValues.stuCards = JSON.stringify(arr)
      formValues.stuAudition = _this.stuInfo.stuAudition
      _this.$refs.paymentCount
        .getAccountsFormData()
        .then(data => {
          formValues = Object.assign(formValues, data)

          let { flag, msg } = this.getFlag(arr)
          if (flag) {
            this.$confirm({
              content: msg,
              onOk() {
                _this.paidStuCards(formValues)
              },
              cancelText: '取消',
              onCancel() {
                return
              }
            })
          } else {
            _this.paidStuCards(formValues)
          }
          _this.submitLoading = false
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    getFlag(arr) {
      //结转金额
      let flag = arr.some(item => {
        console.log(1, item.carryForward)
        return item.paidPrice == 0
      })
      let msg = '您当前“交费金额”为0，是否确认？'
      return { flag, msg }
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import '~@/assets/style/index';

.stuCards {
  margin-bottom: 15px;

  .student-info-wrapper {
    width: 100%;

    .infoItem {
      .class-info {
        margin: 10px 0;
      }

      .info-item-label {
        text-align: right;
      }

      .info-item-content {
        padding-left: 5px;
        box-sizing: border-box;
        .ellipsis();
      }
    }
  }
}

.required:before {
  display: inline-block;
  margin-right: 0.04rem;
  color: #f5222d;
  font-size: 0.14rem;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
