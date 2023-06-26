<template>
  <div>
    <div v-show="!success">
      <a-card class="card" :bordered="false">
        <div class="mt20 template_table">
          <div class="title mb20">学员信息</div>
          <StudentFormNew
            :studentData="studentData"
            :quickApplayShow="quickApplayShow"
            ref="studentForm"
            @hasCards="setUserPaidList"
            :routerId="routerId"
            :showAdd="false"
          ></StudentFormNew>
        </div>
        <div class="mt20 template_table" v-if="userPaidList && userPaidList.length > 0">
          <div class="title mb20">
            原卡信息
          </div>
          <!-- bordered -->
          <a-table
            :scroll="{ x: 1000 }"
            :columns="userColumns"
            :rowSelection="rowSelection"
            :dataSource="userPaidList"
            :pagination="false"
            rowKey="id"
            size="small"
          >
            <span slot="consumePriceTitle"> <span style="color:red">*</span><span>扣除课耗</span> </span>
            <span slot="calStyleTitle"> <span style="color:red">*</span><span>课耗计算方式</span> </span>
            <span slot="carryForwardTitle" style="color: red"> <span style="color:red">*</span><span>结转金额</span> </span>
            <span slot="chargeBalanceTitle"> <span style="color:red">*</span><span>剩余金额</span> </span>

            <span slot="consumePrice" slot-scope="text, record">
              <a-input-number :min="0" :disabled="!record.isSelect" @blur="carryForwardChange(record, 'consumePrice')" v-model="record.consumePrice" />
            </span>
            <span slot="calStyle" slot-scope="text, record">
              <a-input v-model="record.calStyle" :disabled="!record.isSelect" style="width:100%" />
            </span>
            <span slot="carryForward" slot-scope="text, record">
              <a-input-number :min="0" :disabled="!record.isSelect" @blur="carryForwardChange(record, 'carryForward')" v-model="record.carryForward" />
            </span>
            <span slot="chargeBalance" slot-scope="text, record">
              <a-input-number :min="0" :disabled="!record.isSelect" @blur="carryForwardChange(record, 'chargeBalance')" v-model="record.chargeBalance" />
            </span>
            <span slot="remark" slot-scope="text, record">
              <a-input v-model="record.remark" :disabled="!record.isSelect" style="width:100px" />
            </span>
          </a-table>
        </div>
      </a-card>
      <!--  办卡  -->
      <a-card class="card" v-if="!quickApplayShow" :bordered="false">
        <div class="card_wrapper" style="position: relative">
          <div class="title mb20">接收信息</div>
          <StudentFormNew :studentData="acceptStudentData" ref="studentNewForm" @hasCards="setAcceptUserPaidList"></StudentFormNew>
          <a-button type="primary" class="mt10" @click="setValForTable()" style="margin-bottom: 0.1rem;">新增</a-button>
          <a-table :scroll="{ x: 1000 }" :columns="saleColumns" class="stuApplyTable" size="default" :dataSource="tableList" :pagination="false" rowKey="key">
            <span slot="cardName" slot-scope="text, record">
              <span class="show-disabled">
                <search-input
                  type="card"
                  :index="record.key"
                  :data="record.cardName"
                  :stuType="acceptStudentData.stuType"
                  placeholder="请选择卡种"
                  @select="getBackData"
                />
              </span>
            </span>
            <span slot="deptName" slot-scope="text, record">
              <span style="min-width: 90%;display: inline-block;">{{ record.deptName || '' }}</span>
            </span>
            <span slot="originalPrice" slot-scope="text, record">
              <span style="min-width: 90%;display: inline-block;">{{ record.originalPrice || 0 }}元</span>
            </span>
            <span slot="count" slot-scope="text, record">
              <a-input-number :min="1" :max="1000" v-model="record.count" @change="getTotalPrice(record)" style="width: 90%" />
            </span>
            <span slot="discount" slot-scope="text, record">
              <a-input-number
                style="width:90%"
                v-model="record.discount"
                :min="0"
                :max="100"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                @change="getTotalPrice(record)"
              />
            </span>
            <span slot="discountPrice" slot-scope="text, record">
              <a-input-number @change="getTotalPrice(record)" v-model="record.discountPrice" />
            </span>
            <span slot="giveCount" slot-scope="text, record">
              <a-input-number v-model="record.giveCount" style="width: 90%" />
            </span>
            <span slot="totalPrice" slot-scope="text, record">
              <span style="min-width: 90%;display: inline-block;">{{ record.totalPrice }}元</span>
            </span>
            <span slot="shouldPay" slot-scope="text, record">
              <span style="min-width: 90%;display: inline-block;">{{ record.shouldPay }}元</span>
            </span>
            <span slot="usedNumber" slot-scope="text, record">
              <template v-if="record.availableCount > 0">
                <a-input-number style="width: 80%" v-model="record.usedCount" :min="0" :max="record.availableCount"/> 次
              </template>
              <template v-else-if="record.availableCount == 0">
                <a-input-number style="width: 80%" v-model="record.usedDay" :min="0" :max="record.validDay"/> 天
              </template>
            </span>
            <span slot="surplus" slot-scope="text, record">
              <template v-if="record.availableCount > 0">
                {{ record.availableCount - (record.usedCount || 0) }} 次
              </template>
              <template v-else-if="record.availableCount == 0">
                {{ record.validDay - (record.usedDay || 0) }} 天
              </template>
            </span>
            <span slot="pricePre" style="color: red">
              原卡抵扣金额
            </span>
            <span slot="pricePre" slot-scope="text, record">
              <a-input-number @blur="getPricePre" v-model="record.pricePre" />
            </span>
            <span slot="paidPrice" slot-scope="text, record">
              <a-input-number v-model="record.paidPrice" />
            </span>
            <span slot="usedDay" slot-scope="text, record">
              <a-input v-model="record.usedDay" style="width: 90%;" />
            </span>
            <span slot="remark" slot-scope="text, record">
              <a-input v-model="record.remark" style="width: 90%;" />
            </span>
            <span slot="attachment" slot-scope="text, record">
              <!-- <a-input v-model="record.attachment"  /> -->
              <UploadSth
                @uploadFilesNum1="uploadFilesNum1($event, record)"
                style="width: 90%;margin-top:-5px;"
                btnText="上传"
                :ref="'uploadSth' + record.key"
                filePath="reason"
              ></UploadSth>
            </span>
            <span slot="toIssueCard" slot-scope="text, record">
              <a-select
                show-search
                style="width: 100%;"
                :allowClear="true"
                v-model="record.toIssueCard"
                :disabled="!record.cardName"
                @change="handleToIssueCardChange(record, $event)"
              >
                <a-select-option v-for="item in issueCards" :value="item.cardId" :key="item.cardId">
                  {{ item.cardMsg }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="sysValConfId" slot-scope="text, record">
              <a-select style="width: 100%;" :allowClear="true" v-model="record.sysValConfId" :disabled="true">
                <a-select-option v-for="item in cardNextTypeList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="sysValTypeConfId" slot-scope="text, record">
              <a-select style="width: 100%;" :allowClear="true" v-model="record.sysValTypeConfId" :disabled="true">
                <a-select-option v-for="item in cardNextList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="action" slot-scope="text, record">
              <a href="javascript:;" style="min-width: 0.4rem;display: inline-block;" v-if="tableList.length > 1" @click="removeList(record)">删除</a>
            </span>
            <span slot="coachPlanDate" slot-scope="text, record,index">
                <template v-if="record.cardTypeName==='教练班'">
                  <a-month-picker style="width:70%;" placeholder="请选择" valueFormat="YYYY-MM" format="YYYY-MM"  @change="coachPlanDateChange($event,index)" v-model="record.coachPlanDate" >
                </a-month-picker>
                  <span v-if="record.coachPlanDateSelect"
                        class="coachPlanDateButton"
                        style='color: #fff;
                      background: #1BA97B;
                  '
                        @click="coachPlanDateSelectChange(index)"
                  >
                    未定
                  </span>
                   <span
                     class="coachPlanDateButton"
                     style="
                      background: #d9d9d9;
                      "
                     @click="coachPlanDateSelectChange(index,true)"
                     v-else
                   >
                      未定
                    </span>
                </template>
              </span>
            <span slot="coachPlanDateTitle" >
                <div>
                  <span style="color:red;">*</span>
                  预计上课时间
                  <a-popover title="">
                    <template slot="content">
                      <p>预计上课时间可选择具体上课时间，未知情况下选中【未定】即可，【未定】显示绿色即为选中</p>
                    </template>
                      <span style="cursor: pointer"><a-icon type="question-circle" /></span>
                  </a-popover>
                </div>
              </span>
          </a-table>
        </div>
        <div class="table-action">
          <div class="count-price" style="width: 100%;">
            <div style="margin-left: 0.15rem">
              应缴金额：<span style="color: rgb(223, 39, 62);font-size: 0.18rem;">{{ payable }} 元</span>
            </div>
          </div>
        </div>
      </a-card>
      <!--  缴费 -->
      <template>
        <div>
          <PaymentCount
            :disabled="true"
            ref="paymentCount"
            @getBalancePrice="getBalancePrice"
            :quickApplayShow="quickApplayShow"
            :studentInfo="acceptStudentInfo"
            :studentCards="acceptStudentList"
            :studentNewCards="tableList"
            :shouldPayMoney="payable"
            :paidPrice="paidPrice1"
            :hideSourceDetailList="true"
            @changeSource="handleChangeSource"
          ></PaymentCount>
        </div>
      </template>
      <div style="text-align:right">
        <perm-box perm="student:info:join">
          <a-button type="primary" @click="sendForm()" :loading="loading">提交</a-button>
        </perm-box>
      </div>
    </div>
    <div v-show="success">
      <a-card class="card" :bordered="false">
        <result type="success" title="提交成功">
          <template slot="description">
            <span>请关闭该页面</span>
            <a-divider type="vertical" />
            <span>或</span>
            <a-divider type="vertical" />
            <a href="#" @click="continueAdd">点击继续添加</a>
          </template>
        </result>
      </a-card>
    </div>
  </div>
</template>

<script>
import UploadSth from '@/components/UploadSth'
import { changeStudentCardNew } from '@/api/recep'
import moment from 'moment'
import { CardModal, SettleAccount, Result, ChooseTable, SearchInput, PaymentCount } from '@/components'
import PermBox from '@/components/PermBox'
import FooterToolBar from '@/components/FooterToolbar'
import StudentFormNew from './modules/StudentFormNew.vue'
import { removeStuCardNextLog } from '@/api/reception/student'
import { getConfig, cardNextType } from '@/api/education'
import { listStuCardNextLog } from '@/api/reception/student'
import { listSysValConf } from '@/api/common'

const _saleColumns = [
  {
    title: '卡种',
    dataIndex: 'cardName',
    width: 200,
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '所属分馆',
    dataIndex: 'deptName',
    width: 100,
    scopedSlots: { customRender: 'deptName' }
  },
  {
    title: '单价',
    dataIndex: 'originalPrice',
    width: 100,
    scopedSlots: { customRender: 'originalPrice' }
  },
  {
    title: '办卡数量',
    dataIndex: 'count',
    width: 100,
    scopedSlots: { customRender: 'count' }
  },
  {
    title: '合计金额',
    dataIndex: 'totalPrice',
    width: 100,
    scopedSlots: { customRender: 'totalPrice' }
  },
  {
    title: '优惠金额',
    dataIndex: 'discountPrice',
    width: 100,
    scopedSlots: { customRender: 'discountPrice' }
  },
  {
    title: '应缴金额',
    dataIndex: 'shouldPay',
    width: 100,
    scopedSlots: { customRender: 'shouldPay' }
  },
  {
    title: '原卡消耗次数/时长',
    width: 160,
    scopedSlots: { customRender: 'usedNumber' }
  },
  {
    title: '剩余次数/时长',
    width: 160,
    scopedSlots: { customRender: 'surplus' }
  },
  {
    // title: '原卡抵扣金额',
    dataIndex: 'pricePre',
    width: 100,
    slots: { title: 'pricePre' },
    scopedSlots: { customRender: 'pricePre' }
  },
  {
    title: '本次缴费',
    dataIndex: 'paidPrice',
    width: 100,
    scopedSlots: { customRender: 'paidPrice' }
  },
  {
    dataIndex: 'coachPlanDate',
    width: 180,
    scopedSlots: { customRender: 'coachPlanDate' , title: 'coachPlanDateTitle'}
  },
  // {
  //   title: '已用(次)',
  //   dataIndex: 'giveCount',
  //   width: 100,
  //   scopedSlots: { customRender: 'giveCount' }
  // },
  // {
  //   title: '已用(天)',
  //   dataIndex: 'usedDay',
  //   width: 100,
  //   scopedSlots: { customRender: 'usedDay' }
  // },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '附件',
    dataIndex: 'attachment',
    width: 150,
    scopedSlots: { customRender: 'attachment' }
  }
]
const userColumns = [
  {
    title: '卡号',
    width: 120,
    dataIndex: 'stuCardNo'
  },
  {
    title: '卡种名称',
    width: 200,
    dataIndex: 'cardName'
  },
  {
    title: '所属分馆',
    width: 120,
    dataIndex: 'deptName'
  },
  {
    title: '优惠金额',
    width: 100,
    dataIndex: 'discount'
  },
  {
    title: '赠送课次',
    width: 80,
    dataIndex: 'giveCount'
  },
  {
    title: '办卡数量',
    width: 80,
    dataIndex: 'count'
  },
  {
    title: '实收金额',
    width: 100,
    dataIndex: 'paidPrice'
  },
  {
    title: '应收金额',
    width: 100,
    dataIndex: 'totalPrice'
  },
  {
    title: '原价',
    width: 100,
    dataIndex: 'originalPrice'
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'status',
    customRender: text => {
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
        : text
    }
  },
  {
    title: '激活时间',
    width: 140,
    dataIndex: 'activationDate'
  },
  {
    title: '已用/总次数',
    width: 120,
    align: 'center',
    dataIndex: 'usedCount',
    customRender: (val, record) => {
      return `${record.usedCount}/${record.totalCount}`
    }
  },
  {
    // title: '扣除课耗',
    dataIndex: 'consumePrice',
    scopedSlots: { customRender: 'consumePrice' },
    slots: { title: 'consumePriceTitle' },
    width: 100
  },
  {
    // title: '课耗计算方式',
    dataIndex: 'calStyle',
    scopedSlots: { customRender: 'calStyle' },
    slots: { title: 'calStyleTitle' },
    width: 120
  },
  {
    // title: '结转金额',
    dataIndex: 'carryForward',
    scopedSlots: { customRender: 'carryForward' },
    slots: { title: 'carryForwardTitle' },
    width: 100
  },
  {
    // title: '剩余金额',
    dataIndex: 'chargeBalance',
    scopedSlots: { customRender: 'chargeBalance' },
    slots: { title: 'chargeBalanceTitle' },
    width: 100
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' },
    width: 120
  }
]
export default {
  name: 'stuApply',
  components: {
    UploadSth,
    PermBox,
    CardModal,
    SettleAccount,
    FooterToolBar,
    Result,
    StudentFormNew,
    ChooseTable,
    SearchInput,
    PaymentCount
  },

  data() {
    return {
      //原卡信息
      selectedRows: [],
      selectedRowKeys: [],
      studentInfo: null,
      studentData: {},
      //新卡信息
      acceptStudentData: {},
      acceptStudentInfo: null,
      acceptStudentList: [],
      // 快速报名
      quickApplayText: '快速报名',
      quickApplayShow: false,

      routerId: '',
      // 输入已有手机号,返回学生数据
      success: false,
      //studentForm
      formValues: {},
      //studentTable
      userColumns,
      showStuTable: false,
      userPaidList: [],
      //saleTable
      // saleColumns, 动态  资源来源是会员续卡时
      showPreviousCard: false,
      issueCards: [],
      cardNextTypeList: [],
      cardNextList: [],
      saleList: [],
      danceList: [],
      cardTypeList: [],
      cardList: [],
      classList: [],
      saleCount: 0,
      //
      editNo: null,
      //
      loading: false,
      balancePrice: 0,
      payPrice: 0,
      //table相关
      tableList: [
        {
          cardName: '',
          deptCardId: null,
          originalPrice: 0,
          count: 1,
          totalPrice: 0,
          discountPrice: 0,
          giveCount: 0,
          shouldPay: 0,
          deptId: '',
          deptName: '',
          pricePre: 0,
          paidPrice: 0,
          key: 0
        }
      ],
      //缴费
      today: moment()
        .subtract(0, 'days')
        .format('YYYY-MM-DD'),
      enrollDate: null,
      firstEnter: false,
      lastPath: null
    }
  },
  watch: {},
  computed: {
    paidPrice1: {
      get() {
        const list = this.tableList
        let paidPrice = 0
        if (list.length > 0) {
          list.forEach(item => {
            paidPrice += item.paidPrice - 0
          })
        }
        return paidPrice
      }
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
          this.userPaidList.forEach((item, index) => {
            if (selectedRowKeys.includes(item.id)) {
              this.userPaidList[index].isSelect = true
            } else {
              this.userPaidList[index].isSelect = false
            }
            this.$forceUpdate()
          })
        },
        //禁用
        getCheckboxProps: record => ({
          props: {
            disabled: record.status != 'A' && record.status != 'B' && record.status != 'C'
          }
        })
      }
    },
    payable: {
      get() {
        const list = this.tableList
        let payable = 0
        if (list.length > 0) {
          list.forEach(item => {
            payable += item.shouldPay - 0
          })
        }
        return Number(payable.toFixed(2))
      }
    },
    saleColumns() {
      let actionColumn = {
        title: '操作',
        dataIndex: 'action',
        width: 80,
        scopedSlots: { customRender: 'action' }
      }
      if (this.showPreviousCard) {
        let previousColumns = [
          {
            title: '往期卡种',
            dataIndex: 'toIssueCard',
            width: 200,
            scopedSlots: { customRender: 'toIssueCard' }
          },
          {
            title: '续卡分类',
            dataIndex: 'sysValConfId',
            width: 200,
            scopedSlots: { customRender: 'sysValConfId' }
          },
          {
            title: '续卡类型',
            dataIndex: 'sysValTypeConfId',
            width: 200,
            scopedSlots: { customRender: 'sysValTypeConfId' }
          }
        ]
        return [..._saleColumns, ...previousColumns, actionColumn]
      }

      return [..._saleColumns, actionColumn]
    }
  },
  beforeCreate() {
    this.studentForm = this.$form.createForm(this)
    this.priceForm = this.$form.createForm(this)
  },
  created() {
    this.hasStuId()
  },
  mounted() {},
  methods: {
    uploadFilesNum1(e, record) {
      this.$refs['uploadSth' + record.key]
        .handleUpload()
        .then(res => {
          record.attachment = res
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.confirmAddEditLoading = false
        })
    },
    hasStuId() {
      if (this.$route.query.stuId) {
        this.routerId = this.$route.query.stuId
      }
    },
    refreshTable() {
      const data = this.saleList
      this.saleList = []
      this.saleList = data
    },
    getBalancePrice({ balancePrice = 0, payPrice = 0 }) {
      this.balancePrice = balancePrice
      this.payPrice = payPrice
    },
    setClassName(res) {
      const { id, name, key } = res
      this.tableList[key].classId = id
      this.tableList[key].className = name
    },
    removeClass(data) {
      data.className = ''
      data.classId = ''
    },
    //老学员信息
    async setUserPaidList(data) {
      const { student, studentCards } = data
      //传给settleAcount组件
      this.studentInfo = student
      this.studentData = student
      if (studentCards && studentCards.length > 0) {
        this.showStuTable = true
        studentCards.forEach((item, index) => {
          studentCards[index].consumePrice = null
          studentCards[index].carryForward = null
          studentCards[index].chargeBalance = null
          studentCards[index].calStyle = null
        })
        this.userPaidList = JSON.parse(JSON.stringify(studentCards))
      } else {
        this.showStuTable = false
        this.userPaidList = []
      }
    },
    //新学员信息
    async setAcceptUserPaidList(data) {
      const { student, studentCards } = data
      //传给settleAcount组件
      this.acceptStudentInfo = student
      this.acceptStudentData = student
      this.formValues.stuUserId = student.stuUserId || null
      this.tableList = []
      this.setValForTable()
      if (studentCards && studentCards.length > 0) {
        this.acceptStudentList = JSON.parse(JSON.stringify(studentCards))
      } else {
        this.acceptStudentList = []
      }
    },
    setValForTable() {
      const { tableList } = this
      const key = tableList.length
      let tableItem = {}
      tableItem = {
        cardName: '',
        deptCardId: null,
        originalPrice: 0,
        count: 1,
        totalPrice: 0,
        discountPrice: 0,
        giveCount: 0,
        shouldPay: 0,
        deptId: '',
        deptName: '',
        pricePre: 0,
        paidPrice: 0,
        usedDay: 0,
        key: key
      }
      // this.tableList = [...tableList, tableItem]
      this.tableList.push(tableItem)
      return key
    },
    getBackData(data) {
      if (Array.isArray(data)) {
        let notUsedKey = []
        let firstKey = data[0].key
        for (let i = firstKey; i < this.tableList.length; i++) {
          if (i === firstKey || !this.tableList[i].deptCardId) notUsedKey.push(i)
        }

        data.forEach((value, index) => {
          let {cardTypeName, id = '', cardName, deptPrice = 0, danceId = '', deptId = '', deptName = '', typeId = '', cardTypeId = '', crowdType = '', key, availableCount = 0, validDay = 0, usedCount = 0, usedDay = 0 } = value
          if (index > 0) {
            if (notUsedKey[index]) {
              key = notUsedKey[index]
              if (!this.tableList[key]) this.setValForTable()
            } else {
              key = this.setValForTable()
            }
          }
          console.log(7777,cardTypeName)
          this.tableList[key].deptCardId = id
          this.tableList[key].cardName = cardName
          this.tableList[key].cardTypeName = cardTypeName
          this.tableList[key].originalPrice = deptPrice
          this.tableList[key].totalPrice = deptPrice
          this.tableList[key].shouldPay = deptPrice
          this.tableList[key].danceId = danceId
          this.tableList[key].typeId = typeId
          this.tableList[key].classTypeId = cardTypeId
          this.tableList[key].crowdType = crowdType
          this.tableList[key].classId = ''
          this.tableList[key].cardValues = { value: value }
          this.tableList[key].deptId = deptId
          this.tableList[key].deptName = deptName
          this.tableList[key].availableCount = availableCount
          this.tableList[key].validDay = validDay
          this.getTotalPrice(this.tableList[key])
        })
        this.setListNo()
      }
    },
    getTotalPrice(data) {
      let {
        count = 1,
        discountPrice,
        originalPrice,
        cardValues: { value }
      } = data
      if (value?.availableCount !== 1 && count > 1) {
        data.count = 1
        count = 1
        this.$notification['error']({
          message: '系统通知',
          description: `该卡种单次办理数量应为1张`
        })
      }
      if (data.typeId === 'C' && count % 0.5) {
        this.$notification['error']({
          message: '系统通知',
          description: `办卡数量有误，请核对后输入`
        })
      }
      data.totalPrice = count * (originalPrice - 0)
      data.discountPrice = data.totalPrice >= data.discountPrice ? data.discountPrice : data.totalPrice
      data.shouldPay = Number((data.totalPrice - 0 - (data.discountPrice - 0)).toFixed(2))
    },
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
    setListNo() {
      const { tableList } = this
      tableList.map((item, idx) => {
        item.key = idx
      })
    },
    validateCardsPrice() {
      const cardsPrice = this.tableList.reduce((a, b) => a + b.shouldPay, 0) //卡的总金额

      const { balancePrice, payPrice } = this // 余额, 实缴金额
      // 1,没有余额, 实缴金额大于卡总金额
      if (!balancePrice && payPrice > cardsPrice) {
        return false
      }
      // 2,有余额,并且余额大于卡的总金额,实缴金额>0
      else if (balancePrice && balancePrice >= cardsPrice && payPrice > 0) {
        return false
      }
      // 3,有余额,并且余额小于卡的总金额,(实缴金额+余额) > 卡的总金额
      else if (balancePrice && balancePrice < cardsPrice && Number(payPrice) + Number(balancePrice) > cardsPrice) {
        return false
      } else {
        return true
      }
    },
    validateCards() {
      let flag = ''
      for (let data of this.tableList) {
        if (data.crowdType !== 'C' && this.acceptStudentData.stuType !== data.crowdType) {
          flag = '请选择学员对应人群的卡种'
          break
        }
        if (data.typeId === 'C' && data.count % 0.5) {
          flag = '办卡数量有误，请核对后输入'
          break
        }
      }
      return flag
    },

    handleChangeSource(value) {
      let isContinued = value === '会员续卡'
      if (isContinued) {
        this.queryPreviousCard()
        this.queryCardNextList()
        this.queryCardNextTypeList()
      } else {
        // TODO: 清除往期卡种/续卡分类/续卡类型
      }
      this.showPreviousCard = isContinued
    },
    queryCardNextList() {
      listSysValConf('cardNext').then(res => {
        this.cardNextList = res.data || []
      })
    },
    queryCardNextTypeList() {
      cardNextType().then(res => {
        this.cardNextTypeList = res.data || []
      })
    },
    async queryPreviousCard() {
      if (!this.acceptStudentInfo?.id) return
      const res = await listStuCardNextLog({ stuId: this.acceptStudentInfo.id })
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
    handleToIssueCardChange(record, value) {
      this.initTeacher()
      if (!value) {
        record.sysValConfId = undefined
        record.sysValTypeConfId = undefined
      } else {
        let name = this.issueCards.filter(item => item.cardId == value)[0].cardTypeName
        getConfig({
          lastCardType: name,
          newCardType: record.cardValues.value.cardTypeName
        })
          .then(res => {
            if (res.data && res.data.sysValConfId) {
              record.sysValConfId = res.data.sysValConfId
              if (res.data.sysValTypeConfId) {
                record.sysValTypeConfId = res.data.sysValTypeConfId
                let cardNextTypeName = this.cardNextTypeList.filter(item => item.id == res.data.sysValConfId)[0].name
                if (cardNextTypeName == '导师工资提成') {
                  let tableList = this.tableList.filter(item => item.sysValTypeConfId == res.data.sysValTypeConfId)
                  let index = 0
                  tableList.forEach((item, idx) => {
                    if (item.key == record.key) index = idx
                  })
                  this.$refs.paymentCount.setTeacherHandle({
                    index: index,
                    length: tableList.length,
                    commission: Number(res.data.commission)
                  })
                  this.$forceUpdate()
                }
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
    },

    initTeacher() {
      this.$refs.paymentCount.initTeacher()
    },
    sendForm() {
      this.submitFormNew()
    },
    coachPlanDateChange(e,index){
      this.tableList[index].coachPlanDateSelect = ''
      this.$forceUpdate()
    },
    coachPlanDateSelectChange(index,flag){
      this.tableList[index].coachPlanDate = ''
      if(flag){
        this.tableList[index].coachPlanDateSelect = '未定'
      }else{
        this.tableList[index].coachPlanDateSelect = ''
      }
      this.$forceUpdate()
    },
    submitFormNew() {
      let that = this
      let text = this.validateCards()
      if (text) {
        this.$notification['error']({
          message: '系统通知',
          description: text
        })
        return
      }

      if (!this.validatePreviousCard()) {
        this.$notification['error']({
          message: '系统通知',
          description: `请完善接收信息中的往期卡种`
        })
        return
      }

      const { isPaidListEmpty, emptyRecord } = this.validatePaidListEmpty()
      if (isPaidListEmpty) {
        let { stuCardNo, cardName } = emptyRecord
        this.$notification['error']({
          message: '系统通知',
          description: `请完善原卡信息（${stuCardNo}/${cardName}）扣除课耗、课耗计算方式、结转金额、剩余金额信息`
        })
        return
      }

      if (!this.validateCardsPrice()) {
        this.$notification['error']({
          message: '系统通知',
          description: `实缴金额价格(或加余额价格)不能大于卡金额总和`
        })
        return
      }
      if (!this.validatePricePre()) {
        this.$notification['error']({
          message: '系统通知',
          description: `原卡抵扣金额合计必须等于结转金额合计`
        })
        return
      }
      if (!this.validateAttachment()) {
        this.$notification['error']({
          message: '系统通知',
          description: `请上传附件`
        })
        return
      }

      // 原卡信息中课耗计算方式拼接到备注
      this.joinCalStyleInRemark()

      let data = {}

      let val = Promise.all([this.getstudentInfo(), this.getSelectedRows(), this.getstudentInfoNew(), this.getPriceList(), this.getPriceInfo()])
      val
        .then(info => {
          data = Object.assign({}, data, info[4], info[0], info[1], info[2], info[3])
          if (info[4].stuUserId) {
            data.stuUserId = info[4].stuUserId
          }
          return data
        })
        .then(params => {
          let { flag, msg } = this.getFlag()
          if (flag) {
            this.$confirm({
              content: msg,
              onOk() {
                that.save(params)
              },
              cancelText: '取消',
              onCancel() {
                return
              }
            })
          } else {
            this.save(params)
          }
        })
    },
    getFlag() {
      //结转金额
      let flag1 = this.selectedRows.some(item => {
        return item.carryForward == 0
      })
      //剩余金额
      let flag2 = this.selectedRows.some(item => {
        return item.chargeBalance == 0
      })
      //原卡抵扣金额
      let flag3 = this.tableList.some(item => {
        return item.pricePre == 0
      })
      //本次缴费
      let flag4 = this.tableList.some(item => {
        return item.paidPrice == 0
      })
      let flag = flag1 || flag2 || flag3 || flag4
      let text1 = flag1 ? '“结转金额”' : ''
      let text2 = flag2 ? '“剩余金额”' : ''
      let text3 = flag3 ? '“原卡抵扣金额”' : ''
      let text4 = flag4 ? '“本次缴费”' : ''
      let msg = '您当前' + text1 + text2 + text3 + text4 + '为0，是否确认？'
      return { flag, msg }
    },
    save(data) {
      this.loading = true
      changeStudentCardNew(data)
        .then(res => {
          if (res.code === 200) {
            data.quickApplayShow = this.quickApplayShow
            data.stuId = res.data
            this.pageChange(data).then(fullPath => this.$multiTab.close(fullPath))
          }
        })
        .finally(() => (this.loading = false))
    },
    pageChange(data) {
      return new Promise((resolve, reject) => {
        const {
          $route: { fullPath }
        } = this
        if (this.acceptStudentInfo) {
          data = Object.assign(data, this.acceptStudentInfo)
        } else {
          data = Object.assign(data, this.studentInfo)
        }
        let params = {}
        params.stuName = data.stuName
        params.stuPhone = data.stuPhone
        params.price = data.price
        params.isPayment = data.isPayment
        params.createDate = data.createDate
        params.enrollDate = data.enrollDate
        params.quickApplayShow = data.quickApplayShow
        params.stuId = data.id
        this.$router.push({ path: '/reception/stuApplyResult/' + JSON.stringify(params) })
        resolve(fullPath)
      })
    },
    // 原卡信息中课耗计算方式拼接到备注中
    joinCalStyleInRemark() {
      this.selectedRows.forEach(record => {
        const { calStyle, remark } = record
        if (calStyle) {
          record.remark = `课耗计算方式[${calStyle}]||` + (record.remark || '')
        }
      })
    },
    // handleCalStyleChange(e, record) {
    //   let value = e.target.value
    //   record.remark = `[课耗计算方式{value}]` + record.remark
    //   debugger
    // },
    // 原卡信息单条必填项填写完整
    isPaidRecordCompleted(record) {
      const { consumePrice, carryForward, chargeBalance, paidPrice, calStyle } = record
      return Number.isFinite(consumePrice) && Number.isFinite(carryForward) && Number.isFinite(chargeBalance) && calStyle?.length > 0
    },
    carryForwardChange(record, type) {
      if (!this.isPaidRecordCompleted(record)) {
        // console.log('结转信息没有填完')
        return
      }
      const { consumePrice, carryForward, chargeBalance, paidPrice, calStyle } = record
      if (consumePrice + carryForward + chargeBalance != paidPrice) {
        record[type] = null
        this.$notification['error']({
          message: '系统通知',
          description: `实收金额为${paidPrice}元，扣除课耗、结转金额、剩余金额之和必须等于实收金额`
        })
      }
    },
    validatePaidListEmpty() {
      let isPaidListEmpty = false
      let emptyRecord = null
      this.selectedRows.forEach((record, index) => {
        if (!this.isPaidRecordCompleted(record)) {
          isPaidListEmpty = true
          emptyRecord = record
          return false
        }
      })
      return { isPaidListEmpty, emptyRecord }
    },
    validatePricePre() {
      let pricePre = this.tableList.reduce((total, item) => {
        return total + item.pricePre
      }, 0)
      let carryForward = this.selectedRows.reduce((total, item) => {
        return total + item.carryForward
      }, 0)
      return pricePre.toFixed(2) === carryForward.toFixed(2)
    },
    validateAttachment() {
      let student = this.$refs.studentForm.handleOk()
      let newStudent = Object.assign(this.$refs.studentNewForm.handleOk(), this.formValues)
      if (student.id !== newStudent.id && this.tableList.filter(data => !data.attachment && data.pricePre > 0).length > 0) {
        return false
      }
      return true
    },
    validatePreviousCard() {
      if (!this.showPreviousCard) return true
      let result = true
      for (let item of this.tableList) {
        const { toIssueCard } = item
        if (!toIssueCard) {
          result = false
          break
        }
      }
      return result
    },
    getPricePre() {
      if (!this.validatePricePre()) {
        this.$notification['error']({
          message: '系统通知',
          description: `原卡抵扣金额合计必须等于结转金额合计`
        })
      }
    },
    //原卡信息返回
    getSelectedRows() {
      let selectedRows
      return new Promise((resolve, reject) => {
        selectedRows = this.selectedRows.map(item => {
          return {
            cardId: item.id,
            consumePrice: item.consumePrice,
            carryForward: item.carryForward,
            chargeBalance: item.chargeBalance,
            remark: item.remark
          }
        })
        // remark: item.remark
        if (Array.isArray(selectedRows) && selectedRows.length > 0) {
          resolve({ originalStudents: JSON.stringify(selectedRows) })
        } else {
          reject(
            this.$notification['error']({
              message: '系统通知',
              description: `请选择原卡`
            })
          )
        }
      })
    },
    getPriceList() {
      let priceList
      return new Promise((resolve, reject) => {
        priceList = this.tableList.map(item => {
          return {
            deptCardId: item.deptCardId,
            // schoolId: item.deptId,
            quantity: item.count,
            deductPrice: item.pricePre,
            paidPrice: item.paidPrice,
            giveCount: item.giveCount,
            usedCount: item.usedCount,
            usedDay: item.usedDay,
            remark: item.remark,
            attachment: item.attachment,
            discountPrice: item.discountPrice,
            toIssueCard: item.toIssueCard,
            sysValConfId: item.sysValConfId,
            sysValTypeConfId: item.sysValTypeConfId,
            coachPlanDate:item.coachPlanDate||item.coachPlanDateSelect||'',
            cardTypeName:item.cardTypeName
          }
        })
        let flag = false
        priceList.forEach(item => {
          if(item.cardTypeName==="教练班"&&!item.coachPlanDate){
            flag=true
            return
          }
        })
        if(flag){
          reject(this.$notification['error']({
            message: '系统通知',
            description: `请选择预计上课时间`
          }))
          return
        }
        if (Array.isArray(priceList) && priceList.length > 0) {
          // deptCardId
          resolve({ stuCardVos: JSON.stringify(priceList) })
        } else {
          reject(
            this.$notification['error']({
              message: '系统通知',
              description: `请选择新卡`
            })
          )
        }
      })
    },
    //老学员信息返回
    getstudentInfo() {
      let studentInfo
      return new Promise((resolve, reject) => {
        studentInfo = Object.assign(this.$refs.studentForm.handleOk())
        if (!studentInfo.id) {
          reject(
            this.$notification['error']({
              message: '系统通知',
              description: `请选择老学员`
            })
          )
        } else {
          resolve({ originalStuId: studentInfo.id })
        }
      })
    },
    //新学员信息返回
    getstudentInfoNew() {
      let studentInfo
      return new Promise((resolve, reject) => {
        studentInfo = Object.assign(this.$refs.studentNewForm.handleOk(), this.formValues)
        if (!studentInfo.id) {
          reject(
            this.$notification['error']({
              message: '系统通知',
              description: `请选择新学员`
            })
          )
        } else {
          resolve({ newStuId: studentInfo.id })
        }
      })
    },
    //交钱、业绩返回
    getPriceInfo(student) {
      let allData
      return new Promise((resolve, reject) => {
        this.$refs.paymentCount.getAccountsFormData().then(data => {
          if (!data) return
          resolve(data)
        })
      })
    },
    continueAdd() {
      setTimeout(() => {
        this.resetAllForm()
        this.success = false
      }, 150)
    },
    resetPriceForm() {
      this.tableList = []
      this.cardList = []
      this.classList = []
      this.saleCount = 0
      this.balancePrice = 0
      this.payPrice = 0
      this.today = moment()
        .subtract(0, 'days')
        .format('YYYY-MM-DD')
      this.enrollDate = null
    },
    // 重置所有表单
    resetAllForm() {
      //重置学员信息
      if (this.$refs.studentForm) {
        this.$refs.studentForm.resetForm()
      }
      //重置缴费
      if (this.$refs.settleAccount) {
        this.$refs.settleAccount.resetForm()
      }
      //重置卡种列表
      this.resetPriceForm()
    }
  }
}
</script>

<style scoped lang="less" scoped>
.congratulation {
  width: 100%;
  height: 330px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #df237e;
  font-size: 22px;
  font-weight: bold !important;
}

.card {
  margin-bottom: 15px;
}

.payable {
  font-size: 24px;
  color: #ff4400;
}

.show-disabled .anticon-close-circle {
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
  font-size: 12px;
}

.show-disabled .anticon-close-circle:hover {
  color: #999;
}

.show-disabled .anticon-close-circle:active {
  color: #666;
}

.paidHeader {
  font-size: 16px;
  margin-bottom: 10px;
}

.table-action {
  display: flex;
  justify-content: space-between;
  line-height: 50px;

  .add-combo {
    display: flex;
    width: 800px;

    .comboOptions {
      transition: all 300ms;
    }

    .ipt-title {
      margin: 0 5px;
    }
  }
}

.ant-table-row .ant-table-row-level-0 .is-give {
  background-color: indianred;
}
.title {
  font-size: 16px;
  font-weight: bold;
  background-color: #fff;
}
.title_card {
  padding: 20px 10px 0px 18px;
}
.coachPlanDateButton{
  display: inline-block;
  height: 24px;
  padding: 0 8px;
  line-height: 24px;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 5px;
}
</style>
