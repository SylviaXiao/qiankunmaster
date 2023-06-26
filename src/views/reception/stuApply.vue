<template>
  <div>
    <div v-show="!success">
      <a-card class="card" :bordered="false">
        <!-- <template slot="title">
          <span>学员信息</span>
        </template> -->
        <!-- <template slot="extra">
          <perm-box perm="student:info:period">
            <a-button style="margin-right:0.1rem" @click="oldStudentHandle">旧学员录入</a-button>
          </perm-box> -->
        <!-- 快速报名入口,暂时注释 -->
        <!-- <a-button @click="quickApplayHandle">{{ quickApplayText }}</a-button> -->
        <!-- </template> -->
        <a-card class="mt20 template_table">
          <div class="title mb20">学员信息</div>
          <StudentFormNew
            :studentData="studentData"
            :quickApplayShow="quickApplayShow"
            ref="studentForm"
            @hasCards="setUserPaidList"
            @refreshPayCount="refreshPayCount"
            :routerId="routerId"
            :is-apply="true"
            :courseType="courseType"
          ></StudentFormNew>
        </a-card>
        <a-card class="mt20 template_table" v-if="userPaidList && userPaidList.length > 0">
          <div class="title mb20">
            开卡信息
          </div>
          <!-- bordered -->
          <a-table :columns="userColumns" :dataSource="userPaidList" :pagination="false" rowKey="id" size="small">
            <span slot="action" slot-scope="text, record">
              <router-link
                :to="{ path: `/reception/stuPayment/${record.id}_${record.stuId}` }"
                v-if="!record.payoff && (record.status === 'A' || record.status === 'B')"
                >补缴</router-link
              >
            </span>
          </a-table>
        </a-card>
      </a-card>
      <!--  办卡  -->
      <a-card class="card" v-if="!quickApplayShow" :bordered="false">
        <div class="card_wrapper" style="position: relative">
          <a-button type="primary" @click="setValForTable()" style="margin-bottom: 0.1rem;">新增</a-button>
          <!-- <span style="margin-left: 0.25rem;"><font style="color:#f5222d"></font></span> -->
          <a-tooltip placement="top" style="margin:0 25px; 0 5px" title="请先选择卡，再进行缴费。一行保证只有一张卡，多张卡请新增多行">
            <a-icon type="question-circle" />
          </a-tooltip>
          <a-radio-group v-model="courseType" @change="changeCourseType">
            <a-radio :value="0">新报</a-radio>
            <a-radio :value="1">续报</a-radio>
            <a-radio :value="2">补录 </a-radio>
          </a-radio-group>
          <template v-if="courseType == 2">
            <a-table
              :columns="saleColumnsPre"
              :scroll="{ x: 1000 }"
              class="stuApplyTable"
              size="default"
              :dataSource="tableList"
              :pagination="false"
              rowKey="key"
            >
              <span slot="cardName" slot-scope="text, record">
                <span class="show-disabled">
                  <search-input
                    type="card"
                    :index="record.key"
                    :data="record.cardName"
                    :stuType="studentData.stuType"
                    @select="getBackData"
                    placeholder="请选择卡种"
                  />
                </span>
              </span>
              <span slot="classRoom" slot-scope="text, record">
                <span class="show-disabled">
                  <search-input
                    type="class"
                    @select="setClassName"
                    :card-values="record.cardValues"
                    :index="record.key"
                    :initInput="record.classId === ''"
                    :disabled="!record.deptCardId"
                    :searchIcon="record.deptCardId ? true : false"
                    :placeholder="!record.deptCardId ? '请选择卡种' : '请选择班级'"
                    :queryParam="{ danceId: record.danceId, typeId: record.typeId, classTypeId: record.classTypeId }"
                  ></search-input>
                </span>
              </span>
              <span slot="originalPrice" slot-scope="text, record">
                <span style="min-width: 100px;display: inline-block;">{{ record.originalPrice || 0 }}元</span>
              </span>
              <span slot="paidPrice" slot-scope="text, record">
                <a-input-number :min="0" :max="1000000" v-model="record.paidPrice" style="min-width: 80px;" />
              </span>
              <span slot="remainCount" slot-scope="text, record">
                <a-input-number :min="0" :max="10000" v-model="record.remainCount" style="width: 60px;" />
              </span>
              <span slot="totalCount" slot-scope="text, record">
                <a-input-number :min="0" :max="10000" v-model="record.totalCount" style="width: 60px;" />
              </span>
              <span slot="totalPrice" slot-scope="text, record">
                <a-input-number :min="0" :max="1000000" v-model="record.totalPrice" style="min-width: 80px;" />
              </span>
              <span slot="startDate" slot-scope="text, record">
                <a-date-picker style="width: 120px;" v-model="record.startDateMoment" />
              </span>
              <span slot="endDate" slot-scope="text, record">
                <a-date-picker style="width: 120px;" v-model="record.endDateMoment" />
              </span>
              <span slot="remark" slot-scope="text, record">
                <a-input v-model="record.remark" style="width: 100px;" />
              </span>
              <span slot="action" slot-scope="text, record">
                <a href="javascript:;" v-if="tableList.length > 1" style="min-width: 40px;display: inline-block;" @click="removeList(record)">删除</a>
              </span>
            </a-table>
          </template>
          <template v-else>
            <a-table
              :columns="courseType == 0 ? saleColumns : saleColumnsNext"
              class="stuApplyTable"
              size="default"
              :dataSource="tableList"
              :pagination="false"
              :scroll="{ x: 1000 }"
              rowKey="key"
            >
              <span slot="cardName" slot-scope="text, record">
                <span class="show-disabled">
                  <search-input
                    type="card"
                    :index="record.key"
                    :data="record.cardName"
                    :stuType="studentData.stuType"
                    @select="getBackData"
                    placeholder="请选择卡种"
                  />
                </span>
              </span>
              <span slot="classRoom" slot-scope="text, record">
                <span class="show-disabled">
                  <search-input
                    type="class"
                    @select="setClassName"
                    :card-values="record.cardValues"
                    :index="record.key"
                    :initInput="record.classId === ''"
                    :disabled="!record.deptCardId"
                    :searchIcon="record.deptCardId ? true : false"
                    :placeholder="!record.deptCardId ? '请选择卡种' : '请选择班级'"
                    :queryParam="{ danceId: record.danceId, typeId: record.typeId, classTypeId: record.classTypeId }"
                  ></search-input>
                </span>
              </span>
              <span slot="originalPrice" slot-scope="text, record">
                <span style="min-width: 1rem;display: inline-block;">{{ record.originalPrice || 0 }}元</span>
              </span>
              <span slot="count" slot-scope="text, record">
                <a-input-number :min="1" :max="1000" v-model="record.count" @change="getTotalPrice(record)" style="width: 0.6rem;" />
              </span>
              <span slot="discount" slot-scope="text, record">
                <a-input-number
                  style="width: 0.6rem"
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
                <a-input-number v-model="record.giveCount" style="width: 0.6rem;" />
              </span>
              <span slot="totalPrice" slot-scope="text, record">
                <span style="min-width: 0.8rem;display: inline-block;">{{ record.totalPrice }}元</span>
              </span>
              <span slot="shouldPay" slot-scope="text, record">
                <span style="min-width: 0.8rem;display: inline-block;">{{ record.shouldPay }}元</span>
              </span>
              <span slot="paidPrice" slot-scope="text, record">
                <a-input-number v-model="record.paidPrice" />
              </span>
              <span slot="remark" slot-scope="text, record">
                <a-input v-model="record.remark" style="width: 1rem;" />
              </span>
              <span slot="writeOffCodeTitle">
                  <span style="color:red;">*</span>
                  <span>核销券码</span>
                  <a-popover title="">
                    <template slot="content">
                      <p>当支付方式为抖音时（支付类型为POS抖音）,核销券码必填</p>
                    </template>
                      <span style="cursor: pointer"><a-icon type="question-circle" /></span>
                  </a-popover>
              </span>
              <span slot="writeOffCode" slot-scope="text, record">
                <a-input v-model="record.writeOffCode" style="width: 1rem;" />
              </span>
              <span slot="toIssueCard" slot-scope="text, record">
                <a-select
                  show-search
                  :filter-option="filterOption"
                  style="width: 100%;"
                  :allowClear="true"
                  v-model="record.toIssueCard"
                  :disabled="!record.cardName"
                  @change="toIssueCardChange(record, $event)"
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
          </template>
        </div>
        <div v-if="courseType != 2" class="table-action">
          <div class="count-price" style="width: 100%;">
            <div style="margin-left: 0.15rem">
              应缴金额：<span style="color: rgb(223, 39, 62);font-size: 0.18rem;">{{ payable }} 元</span>
            </div>
          </div>
        </div>
      </a-card>
      <!--  缴费 -->
      <template v-if="courseType != 2">
        <div>
          <PaymentCount
            ref="paymentCount"
            @getBalancePrice="getBalancePrice"
            :quickApplayShow="quickApplayShow"
            :studentInfo="studentInfo"
            :studentCards="userPaidList"
            :studentNewCards="tableList"
            :courseType="courseType"
            :shouldPayMoney="payable"
            :paidPrice="paidPrice1"
            :disabled="true"
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
import { getConfig, cardNextType } from '@/api/education'
import { listSysValConf } from '@/api/common'
import { listStuCardNextLog } from '@/api/reception/student'
import { saveStuRegistration, savePastPeriodStudent } from '@/api/recep'
import moment from 'moment'
import { CardModal, SettleAccount, Result, ChooseTable, SearchInput, PaymentCount } from '@/components'
import PermBox from '@/components/PermBox'
import FooterToolBar from '@/components/FooterToolbar'
import StudentFormNew from './modules/StudentFormNew.vue'

const formItemLayout = {
  labelCol: {
    lg: { span: 6 },
    md: { span: 6 },
    xs: { span: 8 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 12 },
    md: { span: 12 },
    xs: { span: 14 },
    sm: { span: 12 }
  }
}
const sexOptions = [{ label: '男', value: 'A' }, { label: '女', value: 'B' }]
const saleColumns = [
  {
    title: '卡种',
    dataIndex: 'cardName',
    width: 200,
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '班级',
    dataIndex: 'classRoom',
    width: 200,
    scopedSlots: { customRender: 'classRoom' }
  },
  {
    title: '单价',
    dataIndex: 'originalPrice',
    width: 50,
    scopedSlots: { customRender: 'originalPrice' }
  },
  {
    title: '数量',
    dataIndex: 'count',
    width: 50,
    scopedSlots: { customRender: 'count' }
  },
  {
    title: '合计金额',
    dataIndex: 'totalPrice',
    width: 80,
    scopedSlots: { customRender: 'totalPrice' }
  },
  {
    title: '优惠金额',
    dataIndex: 'discountPrice',
    width: 80,
    scopedSlots: { customRender: 'discountPrice' }
  },
  {
    title: '赠送课次',
    dataIndex: 'giveCount',
    width: 100,
    scopedSlots: { customRender: 'giveCount' }
  },
  {
    title: '应缴金额',
    dataIndex: 'shouldPay',
    width: 100,
    scopedSlots: { customRender: 'shouldPay' }
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
  {
    title: '备注',
    dataIndex: 'remark',
    width: 120,
    scopedSlots: { customRender: 'remark' }
  },
  {
    // title: '核销券码',
    dataIndex: 'writeOffCode',
    width: 120,
    scopedSlots: { customRender: 'writeOffCode', title: 'writeOffCodeTitle' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    scopedSlots: { customRender: 'action' }
  }
]
const saleColumnsNext = [
  {
    title: '卡种',
    dataIndex: 'cardName',
    width: 200,
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '班级',
    dataIndex: 'classRoom',
    width: 200,
    scopedSlots: { customRender: 'classRoom' }
  },
  {
    title: '单价',
    dataIndex: 'originalPrice',
    width: 100,
    scopedSlots: { customRender: 'originalPrice' }
  },
  {
    title: '数量',
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
    title: '赠送课次',
    dataIndex: 'giveCount',
    width: 100,
    scopedSlots: { customRender: 'giveCount' }
  },
  {
    title: '应缴金额',
    dataIndex: 'shouldPay',
    width: 100,
    scopedSlots: { customRender: 'shouldPay' }
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
  {
    title: '备注',
    dataIndex: 'remark',
    width: 120,
    scopedSlots: { customRender: 'remark' }
  },
  {
    // title: '核销券码',
    dataIndex: 'writeOffCode',
    width: 120,
    scopedSlots: { customRender: 'writeOffCode', title: 'writeOffCodeTitle' }
  },
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
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    scopedSlots: { customRender: 'action' }
  }
]
const saleColumnsPre = [
  {
    title: '卡种',
    dataIndex: 'cardName',
    width: 200,
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '班级',
    dataIndex: 'classRoom',
    width: 200,
    scopedSlots: { customRender: 'classRoom' }
  },
  {
    title: '单价',
    dataIndex: 'originalPrice',
    width: 80,
    scopedSlots: { customRender: 'originalPrice' }
  },
  {
    title: '剩余次数',
    dataIndex: 'remainCount',
    width: 100,
    scopedSlots: { customRender: 'remainCount' }
  },
  {
    title: '总次数',
    dataIndex: 'totalCount',
    width: 100,
    scopedSlots: { customRender: 'totalCount' }
  },
  {
    title: '剩余金额',
    dataIndex: 'paidPrice',
    width: 100,
    scopedSlots: { customRender: 'paidPrice' }
  },
  {
    title: '办卡金额',
    dataIndex: 'totalPrice',
    width: 100,
    scopedSlots: { customRender: 'totalPrice' }
  },
  {
    title: '开卡时间',
    dataIndex: 'startDate',
    width: 150,
    scopedSlots: { customRender: 'startDate' }
  },
  {
    title: '截止时间',
    dataIndex: 'endDate',
    width: 150,
    scopedSlots: { customRender: 'endDate' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 120,
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    scopedSlots: { customRender: 'action' }
  }
]
const userColumns = [
  {
    title: '卡号',
    dataIndex: 'stuCardNo'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName'
  },
  {
    title: '上课分馆',
    dataIndex: 'deptName'
  },
  {
    title: '办卡时间',
    width: 100,
    dataIndex: 'createDate',
    customRender: (text, record) => {
      return text.split(' ')[0]
    }
  },
  {
    title: '实收/应收',
    dataIndex: 'totalPrice',
    customRender: (text, record) => {
      return record.paidPrice + '/' + record.totalPrice
    }
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    customRender: text => {
      return text ? '已缴清' : '未缴清'
    }
  },
  {
    title: '状态',
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
        : ''
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'stuApply',
  components: {
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

  watch: {
    studentInfo(nv, ov) {
      if (nv) {
        this.getCardIdPre()
      }
    },
    $route(nv, ov) {
      const _this = this
      const {
        name,
        query: { stuId },
        fullPath
      } = nv
      const { firstEnter, $confirm } = this
      if (!stuId) return
      if (name !== 'stuApplyForm') return
      if (this.routerId == stuId) return
      if (firstEnter) {
        if (stuId) {
          this.routerId = stuId
        } else {
          this.routerId = null
          this.resetAllForm()
        }
      } else {
        this.routerId = stuId
      }
    }
  },
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
    }
  },
  data() {
    return {
      issueCards: [], //往期卡种下拉
      //新报、续保、补录
      courseType: 0,
      saleColumnsPre,
      saleColumnsNext,

      // 快速报名
      quickApplayText: '快速报名',
      quickApplayShow: false,
      studentData: {},
      routerId: '',
      // 输入已有手机号,返回学生数据
      studentInfo: null,
      success: false,
      //studentForm
      formItemLayout,
      sexOptions,
      stuSourceList: [],
      formValues: {},
      //studentTable
      userColumns,
      showStuTable: false,
      userPaidList: [],
      //saleTable
      saleColumns,
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
          cardTypeName: '',
          deptCardId: null,
          className: '',
          classId: null,
          originalPrice: 0,
          count: 1,
          totalPrice: 0,
          discountPrice: 0,
          giveCount: 0,
          shouldPay: 0,
          key: 0,
          paidPrice: 0
        }
      ],

      //缴费
      today: moment()
        .subtract(0, 'days')
        .format('YYYY-MM-DD'),
      enrollDate: null,
      firstEnter: false,
      lastPath: null,

      cardNextList: [],
      cardNextTypeList: []
    }
  },
  beforeCreate() {
    this.studentForm = this.$form.createForm(this)
    this.priceForm = this.$form.createForm(this)
  },
  created() {
    this.hasStuId()
    this.getCardNextList()
    this.getCardNextTypeList()
  },
  mounted() {},
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
    toIssueCardChange(record, value) {
      this.initTeacher()
      if (!value) {
        record.sysValConfId = undefined
        record.sysValTypeConfId = undefined
      } else {
        let name = this.issueCards.filter(item => item.cardId == value)[0].cardTypeName
        getConfig({
          lastCardType: name,
          newCardType: record.cardTypeName
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
    //获取往期卡种
    async getCardIdPre() {
      // cardId: id,
      if (this.courseType == 1) {
        if (this.studentInfo) {
          const res = await listStuCardNextLog({ stuId: this.studentInfo.id })
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
        }
      }
    },
    //新报、续报、补录
    changeCourseType(e) {
      // this.userPaidList = []
      // this.studentInfo = null
      this.tableList = []
      this.initTeacher()

      this.$nextTick(() => {
        if (this.courseType == 2) {
          this.tableList = [
            {
              cardName: '', //卡名
              cardTypeName: '',
              deptCardId: null, //卡ID
              className: '', //班级名称
              classId: null, //班级id
              originalPrice: 0, //单价
              remainCount: 0, //剩余次数
              totalCount: 0, //总次数
              paidPrice: 0, //剩余金额
              totalPrice: 0, //总金额金额
              startDate: null, //开卡时间
              startDateMoment: null, //开卡时间
              endDate: null, //结束时间
              endDateMoment: null, //结束时间
              key: 0,
              give: false
            }
          ]
        } else {
          this.tableList = [
            {
              cardName: '',
              cardTypeName: '',
              deptCardId: null,
              className: '',
              classId: null,
              originalPrice: 0,
              count: 1,
              totalPrice: 0,
              discountPrice: 0,
              giveCount: 0,
              shouldPay: 0,
              paidPrice: 0,
              key: 0,
              sysValConfId: undefined,
              sysValTypeConfId: undefined
            }
          ]
        }
        this.getCardIdPre()

        if (this.courseType == 1) {
          this.$refs.paymentCount && this.$refs.paymentCount.setSourceValue({ source: '会员续卡' })
        } else {
          this.$refs.paymentCount && this.$refs.paymentCount.setSourceValue({ source: '' })
        }
      })
    },

    //旧学员录入
    oldStudentHandle() {
      this.$router.push({ name: 'previousStuForm' })
    },
    // 重置缴费信息
    refreshPayCount() {
      this.$refs.paymentCount.resetForm()
      this.studentInfo = null
      this.formValues = {}
    },
    // 快速报名
    quickApplayHandle() {
      this.quickApplayText = this.quickApplayText === '快速报名' ? '普通报名' : '快速报名'
      this.quickApplayShow = !this.quickApplayShow
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
    hasStuId() {
      if (this.$route.query && this.$route.path.indexOf('stuApply') !== -1) {
        this.routerId = this.$route.query.stuId
        const IS_PHONE = /^1[3456789]\d{9,10}$/
        if (IS_PHONE.test(this.routerId)) {
          // 快速报名在这里的特出处理
          this.$nextTick(() => {
            this.$refs.paymentCount.unassignedHandle()
          })
        }
      }
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
    async setUserPaidList(data) {
      let { student, studentCards } = data
      student.stuAudition = ''
      //传给settleAcount组件
      this.studentInfo = student.id ? student : null
      this.studentData = student.id ? student : {}
      this.formValues.id = student.id
      this.formValues.stuUserId = student.stuUserId || null
      if (!this.studentInfo) {
        this.initCardTable()
        this.initBelongsTable()
      }
      if (studentCards && studentCards.length > 0) {
        this.showStuTable = true
        this.userPaidList = studentCards
      } else {
        this.showStuTable = false
        this.userPaidList = []
      }
    },
    // 初始化新报/续报/补录列表
    initCardTable() {
      this.changeCourseType(this.courseType)
    },
    // 初始化业绩归属
    initBelongsTable() {
      this.$refs.paymentCount.initBelongsTable()
      this.$refs.paymentCount.setSourceValue({ source: this.courseType == 1 ? '会员续卡' : '' })
    },
    // 初始化顾问业绩
    initAdviser() {
      this.$refs.paymentCount.initAdviser()
    },
    // 初始化导师业绩
    initTeacher() {
        this.$refs.paymentCount && this.$refs.paymentCount.initTeacher()
    },
    setValForTable() {
      const { tableList } = this
      const key = tableList.length
      let tableItem = {}
      if (this.courseType == 2) {
        tableItem = {
          cardName: '', //卡名
          cardTypeName: '',
          deptCardId: null, //卡ID
          className: '', //班级名称
          classId: null, //班级id
          originalPrice: 0, //单价
          remainCount: 0, //剩余次数
          totalCount: 0, //总次数
          paidPrice: 0, //剩余金额
          totalPrice: 0, //总金额金额
          startDate: null, //开卡时间
          startDateMoment: null, //开卡时间
          endDate: null, //结束时间
          endDateMoment: null, //结束时间
          key: key,
          give: false
        }
      } else {
        tableItem = {
          cardName: '',
          cardTypeName: '',
          deptCardId: null,
          className: '',
          classId: null,
          originalPrice: 0,
          count: 1,
          totalPrice: 0,
          discountPrice: 0,
          giveCount: 0,
          shouldPay: 0,
          paidPrice: 0,
          key: key,
          sysValConfId: undefined,
          sysValTypeConfId: undefined
        }
      }
      // this.tableList = [...tableList, tableItem]
      this.tableList.push(tableItem)
      return key
    },
    getBackData(data) {
      if (Array.isArray(data)) {
        console.log(111,data)
        let notUsedKey = []
        let firstKey = data[0].key
        for (let i = firstKey; i < this.tableList.length; i++) {
          if (i === firstKey || !this.tableList[i].deptCardId) notUsedKey.push(i)
        }

        data.forEach((value, index) => {
          let { id = '', cardName, cardTypeName, deptPrice = 0, danceId = '', typeId = '', cardTypeId = '', crowdType = '', availableCount, key } = value
          if (index > 0) {
            if (notUsedKey[index]) {
              key = notUsedKey[index]
              if (!this.tableList[key]) this.setValForTable()
            } else {
              key = this.setValForTable()
            }
          }

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
          this.tableList[key].availableCount = availableCount
          this.tableList[key].cardValues = { value: value }
          this.tableList[key].sysValConfId = undefined
          this.tableList[key].sysValTypeConfId = undefined
          this.getTotalPrice(this.tableList[key])
        })
        this.setListNo()
      }
    },
    getTotalPrice(data) {
      let { count = 1, availableCount, discountPrice, originalPrice } = data
      if (availableCount !== 1 && count > 1) {
        data.count = count = 1
        this.$notification['error']({
          message: '系统通知',
          description: `该卡种单次办理数量应为1张`
        })
      }
      data.totalPrice = count * (originalPrice - 0)
      data.shouldPay = data.totalPrice - 0 - (data.discountPrice - 0)
      data.shouldPay = Number(data.shouldPay.toFixed(2))
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
        if (this.courseType == 1 && !data.toIssueCard) {
          flag = '请选择往期卡种'
          break
        }
        const toIssueCard = this.issueCards.find(d => d.cardId === data.toIssueCard)
        if (this.courseType == 1 && toIssueCard.experience) {
          flag = '往期卡种只能为正式卡'
          break
        }
        // if (data.toIssueCard && !data.sysValConfId) {
        //   flag = '请选择续卡分类'
        //   break
        // }
        // if (data.sysValTypeConfId && !data.sysValTypeConfId) {
        //   flag = '续卡类型不能为空'
        //   break
        // }
        if (data.crowdType !== 'C' && this.studentData.stuType !== data.crowdType) {
          flag = '请选择学员对应人群的卡种'
          break
        }
      }

      return flag
    },
    sendForm() {
      if (this.courseType == 2) {
        this.submitFormOld()
      } else {
        this.submitFormNew()
      }
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
      if (!this.validateCardsPrice()) {
        this.$notification['error']({
          message: '系统通知',
          description: `实缴金额价格(或加余额价格)不能大于卡金额总和`
        })
        return
      }
      let data = {}
      const priceList = JSON.parse(JSON.stringify(this.tableList))
      let flag = false
      priceList.forEach(item => {
        if(item.cardTypeName==="教练班"&&!item.coachPlanDate&&!item.coachPlanDateSelect){
          flag=true
          return
        }
        item.coachPlanDate=item.coachPlanDate||item.coachPlanDateSelect||''
        delete item.cardValues
        delete item.coachPlanDateSelect
      })
      if(flag){
        this.$notification['error']({
          message: '系统通知',
          description: `请选择预计上课时间`
        })
        return
      }
      data.stuCards = JSON.stringify(priceList)
      let val = Promise.all([this.getstudentInfo(), this.getPriceInfo()])
      val
        .then(info => {
          data = Object.assign({}, data, info[1], info[0])
          if (info[1].stuUserId) {
            data.stuUserId = info[1].stuUserId
          }
          if (!data.stuUserId) {
            data.stuUserId = this.formValues.stuUserId
          }
          data.resubmit = this.courseType == 0 ? false : true
          return data
        })
        .then(params => {
          if (this.courseType == 0) {
            if (params.source == '会员续卡') {
              this.$notification['error']({
                message: '系统通知',
                description: '请对该学员选择续报'
              })
              return
            }
          }
          let flag = priceList.some(item => {
            return item.paidPrice == 0
          })
          if (flag) {
            this.$confirm({
              content: '您当前“交费金额”为0，是否确认？',
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
    save(data) {
      this.loading = true
      saveStuRegistration(data)
        .then(res => {
          if (res.code === 200) {
            data.quickApplayShow = this.quickApplayShow
            data.stuId = res.data
            this.pageChange(data).then(fullPath => this.$multiTab.close(fullPath))
          }
        })
        .finally(this.offLoading)
    },
    submitFormOld() {
      let text = this.validateCards()
      if (text) {
        this.$notification['error']({
          message: '系统通知',
          description: text
        })
        return
      }

      let data = {}
      const priceList = this.tableList
      priceList.forEach(item => {
        item.startDateMoment ? (item.startDate = this.$tools.tailor.getDate(item.startDateMoment)) : ''
        item.endDateMoment ? (item.endDate = this.$tools.tailor.getDate(item.endDateMoment)) : ''
        delete item.cardValues
      })
      data.stuCards = JSON.stringify(priceList)

      this.getstudentInfo()
        .then(info => {
          this.loading = true
          data = Object.assign(data, info)
          return data
        })
        .then(savePastPeriodStudent)
        .then(res => {
          if (res.code === 200) {
            this.pageChange(data).then(fullPath => this.$multiTab.close(fullPath))
          }
        })
        .finally(this.offLoading)
    },
    offLoading() {
      const timeout = setTimeout(() => {
        this.loading = false
        clearTimeout(timeout)
      }, 3000)
    },
    pageChange(data) {
      return new Promise((resolve, reject) => {
        const {
          $route: { fullPath }
        } = this
        data = Object.assign(data, this.studentInfo)
        let params = {}
        params.stuName = data.stuName
        params.stuPhone = data.stuPhone
        params.price = data.price
        params.isPayment = data.isPayment
        params.createDate = data.createDate
        params.enrollDate = data.enrollDate
        params.quickApplayShow = data.quickApplayShow
        params.stuId = this.studentInfo.id
        this.$router.push({ path: '/reception/stuApplyResult/' + JSON.stringify(params) })
        resolve(fullPath)
      })
    },

    getstudentInfo() {
      let studentInfo
      return new Promise((resolve, reject) => {
        studentInfo = Object.assign(this.$refs.studentForm.handleOk(), this.formValues)
        if (!studentInfo.id) {
          reject(
            this.$notification['error']({
              message: '系统通知',
              description: `请选择学员`
            })
          )
        } else if (this.courseType == 0 && !studentInfo.stuAudition) {
          reject(
            this.$notification['error']({
              message: '系统通知',
              description: `请选择是否试课`
            })
          )
        } else {
          resolve({
            studentId: studentInfo.id,
            stuAudition: this.courseType == 0 ? studentInfo.stuAudition : null
          })
        }
        // this.$refs.studentForm
        //   .validateData()
        //   .then(() => {
        //     studentInfo = Object.assign(this.$refs.studentForm.handleOk(), this.formValues)
        //     resolve(studentInfo)
        //   })
        //   .catch(err => {
        //     document.body.scrollTop = document.documentElement.scrollTop = 0
        //   })
      })
    },
    getPriceInfo(student) {
      let allData
      return new Promise((resolve, reject) => {
        this.$refs.paymentCount.getAccountsFormData().then(data => {
          if (!data) return
          resolve(data)
        })
      })
    },
    changeTitleDate(date, str) {},

    continueAdd() {
      setTimeout(() => {
        this.resetAllForm()
        this.success = false
      }, 150)
    },
    goToPreviousStu() {
      this.$router.push({ name: 'previousStu' })
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
