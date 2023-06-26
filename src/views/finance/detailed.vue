<template>
  <div class="detailed-wrapper">
    <perm-box :perm="!income ? 'finance:info:expend' : 'finance:info:income'">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="income ? intosearchParams : searchParams"></search-com-pro>
      </a-card>
      <a-card :bordered="false">
          <div class="btn-wrapper mb20">
            <perm-box perm="finance:info:public:confirm">
              <div class="btn-wrapper mb20">
                <a-button @click.native="editTime">批量修改确认时间</a-button>
                <a-button v-if="income" class="ml20" @click.native="handleBatchEndConfirm">批量确认</a-button>
              </div>
            </perm-box>
            <perm-box perm="finance:info:down">
              <div class="btn-wrapper mb20">
                <a-button v-if="!income"  class="ml20"  type='primary' icon='download' @click.native='downloadStu'> 导出</a-button>
              </div>
            </perm-box>
          </div>
        <div class="table-wrapper mt20">
          <s-table ref="table" size="default" :rowSelection="income ? rowSelection : null" :columns="detailedColumns" :data="loadData" rowKey="id">
            <!-- :totalMoney="income ? 'price' : ''" -->
            <span slot="tradeDate" slot-scope="text">
              {{ text | filterDate }}
            </span>
            <span slot="createDate" slot-scope="text">
              {{ text }}
            </span>
            <span slot="achPrice" slot-scope="text, record">
              <!-- 顾问业绩减半 -->
              <span v-if="record.allowHalfAchievement">
                <span :style="{ color: record.price / 2 !== text && record.teaPrice !== record.price / 2 ? 'red' : 'black' }">
                  {{ !text && text !== 0 ? '无' : text }}
                </span>
              </span>
              <span v-else>
                <span :style="{ color: record.price !== text && record.teaPrice !== record.price ? 'red' : 'black' }">
                  {{ !text && text !== 0 ? '无' : text }}
                </span>
              </span>
            </span>
            <span slot="teaPrice" slot-scope="text, record">
              <!-- 业绩减半 -->
              <span v-if="record.allowHalfAchievement">
                <span :style="{ color: record.price / 2 !== text && record.achPrice !== record.price / 2 ? 'red' : 'black' }">
                  {{ !text && text !== 0 ? '无' : text }}
                </span>
              </span>
              <span v-else>
                <span :style="{ color: record.price !== text && record.achPrice !== record.price ? 'red' : 'black' }">
                  {{ !text && text !== 0 ? '无' : text }}
                </span>
              </span>
            </span>
            <span slot="stuName" slot-scope="text, record">
              <perm-box :text="record.stuName" perm="student:info:view">
                <router-link :to="{ path: `/reception/studentInfo/${record.stuId}` }">{{ text }}</router-link>
              </perm-box>
            </span>
            <span slot="actualCost" slot-scope="text, record">
              {{ (record.price - record.serviceCharge).toFixed(2) }}
            </span>
            <span slot="action" slot-scope="text, record">
              <template v-if=" !income">
                          <a-tooltip placement="topLeft"  trigger="click">
                            <template slot="title">
                              <span>{{reufundMap}}</span>
                            </template>
                              <a href="#" @click="reufundMapChange(record)">审核步骤</a>
                          </a-tooltip>
              </template>
              <template v-if="isAdmin && !income">
                <a href="#" @click="adminStartRufund(record)" style="padding: 0 5px">重新发起</a>
              </template>
              <perm-box v-if="!showTable" perm="finance:info:change:desk">
                <a href="#" @click="editDetailed(record, 'reception')">修改(前台)</a>
              </perm-box>
              <perm-box perm="finance:info:change" v-if="income">
                <a href="#" @click="editDetailed(record)">修改</a>
              </perm-box>
              <!--<perm-box
                perm="student:card:refund-all"
                v-if="!income && (!record.approveStatus || record.approveStatus === 'A' || record.approveStatus === 'D')"
              >
                <a href="#" @click="editTableDetailed(record)">修改</a>
              </perm-box>-->
              <!--<perm-box perm="finance:info:update:refund">
                &lt;!&ndash; v-if="!income && (!record.approveStatus || record.approveStatus === 'A' || record.approveStatus === 'D')" &ndash;&gt;
                <a href="#" @click="editFin(record)">修改(财务)</a>
              </perm-box>-->
              <perm-box :perm="!income ? 'finance:achievement-spending:change' : 'finance:achievement:change'">
                <a href="javascript:;" @click="changeAchi(record.id)">修改绩效</a>
              </perm-box>
              <perm-box perm="finance:info:view">
                <a href="#" @click="handleView(record)">详情</a>
              </perm-box>

              <perm-box perm="finance:info:private:confirm || finance:info:public:confirm">
                <a href="#" v-if="!record.confirmName && income" @click="handleEndConfirm($event, record, 'Y')">确认</a>
                <a href="#" v-if="record.confirmName && income" @click="handleCancelEndConfirm($event, record, 'N')">取消确认</a>
              </perm-box>
              <perm-box perm="finance:info:del">
                <a href="#" v-if="!record.confirmId" @click="removeDetailed(record.id)">删除</a>
              </perm-box>
            </span>
          </s-table>
          <div>{{ income ? '总金额' : '退费金额' }}：{{ totalPrices }}</div>
        </div>
      </a-card>
      <!-- 详细明细 -->

      <!-- 详情 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        :width="1000"
        :title="income ? '缴费明细表' : '退费明细表'"
        :visible="visibleDetail"
        :footer="null"
        @cancel="handleDetailCancel"
      >
        <template v-if="income">
          <DetailedInfo :showTable="showTable" :income="income" ref="detailInfo" @refresh="_refreshTable" :dataInfo="dataInfo"></DetailedInfo>
        </template>
        <template v-else>
          <RefundDetail :stuCardId="dataInfo && dataInfo.stuCardId" :finType="dataInfo && dataInfo.refundType"></RefundDetail>
        </template>
      </a-modal>

      <DetailedEdit @refresh="_refreshTable" :title="title" ref="detailedEdit" :isReception="isReception" :income="income"></DetailedEdit>
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        :width="900"
        title="修改退费信息"
        :visible="visibleRefund"
        :confirmLoading="confirmLoading"
        @ok="handleRefundSubmit"
        @cancel="handleRefundCancel"
      >
        <a-spin :spinning="refundSpin">
          <a-form :form="editForm">
            <DetailedPayInfoDrawback ref="detailedPayInfoDrawback" :drawbackEditInfo="drawbackEditInfo"></DetailedPayInfoDrawback>
            <a-divider orientation="left">
              <span :style="{ color: 'rgba(1,1,1,.3)' }">附件</span>
            </a-divider>
            <a-form-item v-bind="{ labelCol: { span: 3 }, wrapperCol: { span: 16 } }" label="附件">
              <upload-sth ref="uploadsth" :multiple="true" :required="false" btn-text="附件上传" filePath="reason"></upload-sth>
              <div class="uploadedFile" v-for="(item, idx) in newUploadFiles" :key="idx">
                <span style="display: flex;flex-flow: row nowrap;justify-content: space-between;">
                  <span>{{ item.fileName }}</span>
                  <span style="margin-left: 15px;" class="close" @click="deleteFile(item)"><a-icon type="close" style="font-size: 10px;"/></span>
                </span>
              </div>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
    </perm-box>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      width="70%"
      title="修改绩效"
      :visible="achiModal"
      okText="保存"
      cancelText="取消"
      @cancel="cancelModal"
      @ok="saveAhievement()"
    >
      <a-checkbox
        @change="changeAllowHalfAchievement"
        :checked="allowHalfAchievement"
        style="margin-bottom:10px;"
        v-if="!income && allowHalfAchievement !== null"
        >允许顾问业绩减半</a-checkbox
      >
      <belongs-table ref="belongsTable" :refund="true" :total="999999999" :data-backing="achiInfo" :hideSourceDetailList="hideSourceDetailList"></belongs-table>
    </a-modal>

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
      <div class="mb20" v-if="confirmBranch">分馆：{{ confirmBranch }}</div>
      <div class="mb20" v-if="confirmAmount">金额：{{ confirmAmount }}</div>
      <div class="mb20">
        银行账户：
        <a-select v-model="bankNo" style="width:200px;">
          <a-select-option v-for="(item, index) in bankNos" :key="index" :value="item.id">{{ item.bankNo }}</a-select-option>
        </a-select>
      </div>
      <div class="mb20">
        确认时间：
        <a-date-picker v-model="confirmDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
      </div>
      <div v-if="!confirmBranch">
        手续费：
        <a-input-number v-model="serviceCharge" :min="0" />
      </div>
    </a-modal>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="修改"
      v-model="editFinModal"
      width="600px"
      okText="保存"
      cancelText="取消"
      @ok="finSubmit"
      @cancel="finCancel"
      :confirmLoading="isloading"
    >
      <a-form-model ref="ruleForms" :model="finForm" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }" label="卡号" prop="card">
              <a-input placeholder="银行卡号" style="width: 100%;" v-model="finForm.card" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }" label="开户行" prop="bank">
              <a-input placeholder="开户银行" style="width: 100%;" v-model="finForm.bank" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="600"
      title="批量修改确认时间"
      @ok="editTimeModalOk"
      v-model="editTimeModal"
    >
      <a-form-model ref="editTimeForm" :model="editTimeForm" :rules="rulesEditForm" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="日期" required prop="confirmDate">
          <a-date-picker
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            v-model="editTimeForm.confirmDate"
            show-time
            type="date"
            placeholder="请选择日期"
            style="width: 100%;"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getPayMethods } from '@/api/education'
import { detailedColumns, payDetailColumns } from './finance'
import { getSchoolList } from '@/api/education/card'
import { updateFinDate } from '@/api/finance/finance'
import DetailedInfo from './modules/DetailedInfo'
import RefundDetail from './modules/RefundDetail'
import DetailedEdit from './modules/DetailedEdit'
import DetailedPayInfoDrawback from './modules/DetailedPayInfoDrawback'
import UploadSth from '@/components/UploadSth'
import { Achievement, SearchComPro, STable } from '@/components'
import BelongsTable from '@/components/BelongsTable'
import PermBox from '@/components/PermBox'
import { privateConfirm, publicConfirm, bathConfirm, detail, pageExpend, pageIncome, removeDetailed, updateFinance } from '@/api/finance/finance'
import {
  changeAchievement,
  detailAchievement,
  previousRefundCard,
  refundCardAll,
  changeSpending,
  pageExpendRefundMap
} from '@/api/recep'
import { adminStartRufund } from '@/api/reception/student'
import { listBank } from '@/api/education/card'
import moment from 'moment'
import Vue from "vue"
import { ACCESS_TOKEN } from "@/store/mutation-types"

const defaultStart = moment()
  .subtract(10, 'days')
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .subtract(0, 'days')
  .format('YYYY-MM-DD')
export default {
  props: {
    income: {
      type: Boolean,
      default: true
    },
    ApproveStatus: {
      type: Boolean,
      default: true
    },
    showTable: {
      type: Boolean,
      default: false
    },
    hideSourceDetailList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      reufundMap:'',
      rulesEditForm: {
        confirmDate: [{ required: true, message: '请选择日期', trigger: 'change' }]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      editTimeForm: { confirmDate: '' },
      editTimeModal: false, //批量修改确认时间
      totalPrices: 0,
      // 退费修改
      visibleRefund: false,
      refundSpin: false,
      confirmLoading: false,
      drawbackEditInfo: {},
      newUploadFiles: [],

      achiModal: false,
      totalPrice: 0,
      achiInfo: {},
      title: '',
      //多选
      selectedRows: [],
      selectedRowKeys: [],
      //详情的数据
      dataInfo: null,
      isReception: false,
      // table数据
      intosearchParams: [
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
          type: 'date',
          key: 'Date',
          label: '操作时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
        {
          type: 'text',
          key: 'stuInfo',
          label: '学员信息',
          placeholder: '学号/姓名/手机号',
          autoComplete: true
        },
        {
          type: 'text',
          key: 'recordName',
          label: '确认人姓名',
          isShow: this.income,
          placeholder: '请输入确认人姓名'
        },
        {
          type: 'selectSlot',
          key: 'nePrice',
          label: '金额与业绩',
          placeholder: '请选择是否相等',
          staticArr: [
            {
              string: '相等',
              value: 'Y'
            },
            {
              string: '不等',
              value: 'N'
            }
          ],
          before: {
            key: 'nePriceType',
            placeholder: '请选择类型',
            staticArr: [
              {
                string: '顾问',
                value: 'A'
              },
              {
                string: '导师',
                value: 'B'
              }
            ]
          }
        },
        {
          type: 'select',
          key: 'state',
          label: '确认状态',
          isShow: this.income,
          placeholder: '请选择是否确认',
          staticArr: [
            {
              string: '已确认',
              value: 'Y'
            },
            {
              string: '未确认',
              value: 'N'
            }
          ]
        },
        {
          type: 'select',
          key: 'finType',
          label: '缴费类型',
          isShow: this.income,
          placeholder: '请选择',
          staticArr: [
            {
              string: '全款',
              value: 'A'
            },
            {
              string: '定金',
              value: 'B'
            },
            {
              string: '补缴',
              value: 'C'
            }
          ]
        },
        {
          type: 'select',
          key: 'payTypeId',
          label: '支付类型',
          placeholder: '请选择支付类型',
          apiOption: {
            api: getPayMethods,
            string: 'dictValue',
            value: 'id'
          }
        },
        {
          type: 'date',
          key: 'TradeDate',
          label: '缴费时间',
          placeholder: '请选择缴费时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'arrText',
          key: 'startPrice',
          label: '收款金额',
          placeholder: '请输入收款金额',
          addonAfter: '元',
          selectKey: 'type',
          arrPlaceholder: '请输入',
          staticArr: [
            {
              string: '大于',
              value: 'A'
            },
            {
              string: '等于',
              value: 'B'
            },
            {
              string: '小于',
              value: 'C'
            }
          ]
        }
      ],
      searchParams: [
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
          type: 'date',
          key: 'Date',
          label: '操作时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
        {
          type: 'text',
          key: 'stuInfo',
          label: '学员信息',
          placeholder: '学号/姓名/手机号',
          autoComplete: true
        },
        {
          type: 'text',
          key: 'recordName',
          label: '确认人姓名',
          isShow: this.income,
          placeholder: '请输入确认人姓名'
        },
        {
          type: 'selectSlot',
          key: 'nePrice',
          label: '金额与业绩',
          placeholder: '请选择是否相等',
          staticArr: [
            {
              string: '相等',
              value: 'Y'
            },
            {
              string: '不等',
              value: 'N'
            }
          ],
          before: {
            key: 'nePriceType',
            placeholder: '请选择类型',
            staticArr: [
              {
                string: '顾问',
                value: 'A'
              },
              {
                string: '导师',
                value: 'B'
              }
            ]
          }
        },
        {
          type: 'select',
          key: 'state',
          label: '确认状态',
          isShow: this.income,
          placeholder: '请选择是否确认',
          staticArr: [
            {
              string: '已确认',
              value: 'Y'
            },
            {
              string: '未确认',
              value: 'N'
            }
          ]
        },
        {
          type: 'select',
          key: 'finType',
          label: '缴费类型',
          isShow: this.income,
          placeholder: '请选择',
          staticArr: [
            {
              string: '全款',
              value: 'A'
            },
            {
              string: '定金',
              value: 'B'
            },
            {
              string: '补缴',
              value: 'C'
            }
          ]
        },
        {
          type: 'select',
          key: 'payTypeId',
          label: '支付类型',
          placeholder: '请选择支付类型',
          apiOption: {
            api: getPayMethods,
            string: 'dictValue',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'isHalf',
          label: '业绩减半：',
          placeholder: '请选择是否减半',
          staticArr: [
            {
              string: '减半',
              value: 'Y'
            },
            {
              string: '不减半',
              value: 'N'
            }
          ]
        },
        {
          type: 'select',
          key: 'approveStatus',
          label: '审核状态：',
          placeholder: '请选择审核状态',
          staticArr: [
            {
              string: '审批中',
              value: 'B'
            },
            {
              string: '通过',
              value: 'C'
            },
            {
              string: '驳回',
              value: 'D'
            },
            {
              string: '待上传附件',
              value: 'E'
            }
          ]
        },
        {
          type: 'select',
          key: 'recordName',
          label: '审核步骤：',
          placeholder: '请选择审核步骤',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '馆长审批',
              value: '馆长'
            }
          ]
        },
        {
          type: 'date',
          key: 'TradeDate',
          label: '付款时间',
          placeholder: '请选择付款时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'text',
          key: 'procinstNo',
          label: '单号',
          placeholder: '请输入单号'
        }
      ],
      detailedColumns: this.income ? detailedColumns : payDetailColumns,
      queryParam: {},
      loadData: parameter => {
        const { income } = this
        let defaultDate = this.$route.params.stuInfo
          ? {}
          : {
              startDate: defaultStart,
              endDate: defaultEnd
            }
        let correctParams = this.queryParam.hasOwnProperty('Date') ? this.queryParam : Object.assign({}, defaultDate, this.queryParam)

        if (income) {
          return pageIncome(Object.assign(parameter, correctParams)).then(res => {
            this.forMateTotalPrice(res, 'price')
            return res
          })
        } else {
          return pageExpend(Object.assign(parameter, correctParams)).then(res => {
            this.forMateTotalPrice(res, 'price')
            return res
          })
        }
      },
      // 跟进数据
      visibleDetail: false,
      confirmDetailLoading: false,
      detailInfo: null,
      modal: false,
      confirmBranch: '',
      confirmAmount: 0,
      bankNo: null,
      isloading: false,
      bankNos: [],
      endConfirmParams: {},
      allowHalfAchievement: false,
      editFinModal: false,
      rules: {
        card: [{ required: true, message: '请填写银行卡号', trigger: 'change' }],
        bank: [{ required: true, message: '请填写开户银行', trigger: 'change' }]
      },
      finForm: {
        card: '',
        bank: ''
      },
      refundId: '',
      //确认时间
      confirmDate: moment(new Date()).format('YYYY-MM-DD'),
      //手续费
      serviceCharge: 0
    }
  },
  created() {},
  computed: {
    isAdmin() {
      return this.$store.getters.userInfo.perms.includes('*')
    },
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    rowSelection() {
      let flag = this.$tools.checkPerm('finance:info:private:approve || finance:info:private:confirm || finance:info:public:confirm')
      if (flag) {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRows = selectedRows
            this.selectedRowKeys = selectedRowKeys
          },
          getCheckboxProps: record => ({
            props: {
              // disabled: !!record.confirmName
            }
          })
        }
      } else {
        return null
      }
    },
    achievements() {
      if (this.detailInfo) {
        return this.detailInfo.achievements
      } else {
        return []
      }
    }
  },
  components: {
    UploadSth,
    DetailedEdit,
    SearchComPro,
    Achievement,
    PermBox,
    STable,
    DetailedInfo,
    RefundDetail,
    BelongsTable,
    DetailedPayInfoDrawback
  },
  watch: {
    visibleDetail(nv) {
      if (!nv && this.$refs.detailInfo) {
        this.dataInfo = null
        this.$refs.detailInfo.resetData()
      }
    },
    $route: {
      handler: function(route) {
        if ((route.name == 'payDetailed' || route.name == 'detailed') && !route.params.stuInfo) {
          let { deptId, endDate, startDate, stuPhone } = this.$route.query
          if (deptId) this.queryParam.school_id = deptId
          if (endDate) this.queryParam.endDate = endDate
          if (startDate) this.queryParam.startDate = startDate
          if (stuPhone) this.queryParam.stuInfo = stuPhone
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
        if (route.params.stuInfo) {
          this.queryParam = { stuInfo: route.params.stuInfo }
          if (route.name == 'payDetailed') {
            this.searchParams.find(d => d.key === 'stuInfo').initialValue = route.params.stuInfo
            delete this.searchParams.find(d => d.key === 'Date').defaultVal
          }
          if (route.name == 'detailed') {
            this.intosearchParams.find(d => d.key === 'stuInfo').initialValue = route.params.stuInfo
            delete this.intosearchParams.find(d => d.key === 'Date').defaultVal
          }
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },
  beforeCreate() {
    this.editForm = this.$form.createForm(this)
  },
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/finance/info/downRefundInfo'
      const queryParam = this.queryParam
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k !== 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      if(this.$store.getters.school_id){
        fields.push({ name: 'school_id', value: this.$store.getters.school_id })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },
    reufundMapChange(record){
      pageExpendRefundMap({financeId:record.id}).then(res=>{
        let contents = ''
        const {content,reviewer, state} = res.data||{}
            if (content && reviewer && state) {
              const stateText = state === -1 ? '驳回' : state === 0 ? '待审批' : state === 1 ? '审批中' : state === 2 ? '通过' : state === 3 ? '撤回' : state === 5 ? '确定' : ''
              contents= `${content}${stateText}-${reviewer}`
            }else{
              contents= record.stepName || ''
            }
        this.reufundMap=contents
      })
    },
    editTimeModalOk() {
      this.$refs.editTimeForm.validate(valid => {
        if (valid) {
          let params = Object.assign({ financeIds: this.selectedRowKeys.join(',') }, this.editTimeForm)
          updateFinDate(params).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.editTimeModal = false
              this.$refs.editTimeForm.resetFields()
              this._refreshTable()
            }
          })
        } else {
          return false
        }
      })
      // this.$refs.ruleForm.resetFields();
    },
    editTime() {
      this.examine().then(() => {
        this.editTimeModal = true
      })
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
    forMateTotalPrice(r, flag) {
      if (Array.isArray(r.data) && r.data.length > 0) {
        let price = r.data.map(item => item[flag])
        this.totalPrices = price
          .reduce((a, b) => this.$number(a).plus(b), this.$number(0))
          .toNumber()
          .toFixed(2)
      } else {
        this.totalPrices = 0
      }
    },
    finCancel() {
      this.refundId = ''
      this.finForm = {
        card: '',
        bank: ''
      }
      this.editFinModal = false
    },
    finSubmit() {
      this.$refs.ruleForms.validate(valid => {
        if (valid) {
          this.isloading = true
          updateFinance({
            refundId: this.refundId,
            bankName: this.finForm.bank,
            bankNo: this.finForm.card
          })
            .then(res => {
              if (res.code === 200) {
                this.editFinModal = false
                this._refreshTable()
                this.$notification.success({
                  message: '系统通知',
                  description: '提交成功'
                })
              }
            })
            .finally((this.isloading = false))
        }
      })
    },
    changeAllowHalfAchievement(e) {
      this.allowHalfAchievement = e.target.checked
    },
    // 修改退费信息(支出修改按钮)
    handleRefundSubmit() {
      let params = {}
      this.confirmLoading = true
      this.$refs.uploadsth
        .multipleHandleUpload()
        .then(res => {
          const old = []
          this.newUploadFiles.map(item => {
            old.push(item.id)
          })
          params.attachments = res ? `${old.join(',')},${res}` : old.join(',')
          params.stuCardId = this.drawbackEditInfo.cardId
          return params
        })
        .then(this.$refs.detailedPayInfoDrawback.getAllData)
        .then(drawbackInfo => {
          params.stuCardId = this.drawbackEditInfo.cardId
          Object.assign(params, drawbackInfo)
          return params
        })
        .then(refundCardAll)
        .then(() => {
          this.$notification.success({
            message: '系统通知',
            description: '提交成功'
          })
          this.visibleRefund = false
          this._refreshTable()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleRefundCancel() {
      this.visibleRefund = false
    },
    editFin(record) {
      this.refundId = record.refundId
      this.finForm.bank = record.bankName
      this.finForm.card = record.bankNo
      this.editFinModal = true
    },
    editTableDetailed(record) {
      this.fileList = []
      this.visibleRefund = true
      this.refundSpin = true
      this.$refs.uploadsth && this.$refs.uploadsth.reset()
      previousRefundCard(record.stuCardId)
        .then(res => {
          this.newUploadFiles = [].concat(res.data.attachments)
          this.drawbackEditInfo = res.data
        })
        .then(() => {
          this.$nextTick(() => {
            // 退费明细表,回显
            this.$refs.detailedPayInfoDrawback.backindData()
          })
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.refundSpin = false
        })
    },
    changeAchi(id) {
      this.achiModal = true
      detailAchievement(id).then(res => {
        this.achiInfo = res.data
        if (res.data.allowHalfAchievement === null) {
          this.allowHalfAchievement = null
        } else {
          this.allowHalfAchievement = res.data.allowHalfAchievement
        }
        this.$nextTick(() => {
          console.log('open')
        })
        this.totalPrice = res.data.totalPrice
      })
    },
    deleteFile(item) {
      this.newUploadFiles.remove(item)
    },
    saveAhievement() {
      const { $notification, allowHalfAchievement } = this
      this.$refs.belongsTable
        .getAllValue()
        .then(res => {
          let params = {
            allowHalfAchievement,
            ...res
          }
          if (!this.income) {
            return changeSpending(res.financeId, params)
          } else {
            return changeAchievement(res.financeId, params)
          }
        })
        .then(res => {
          $notification.success({
            message: '系统通知',
            description: '提交成功'
          })
          this.achiModal = false
          this.$refs.belongsTable.initBelongs()
          this.$refs.table.refresh()
        })
    },
    cancelModal() {
      this.achiModal = false
      this.$refs.belongsTable.initBelongs()
    },
    editDetailed(record, isRp) {
      this.isReception = isRp ? true : false
      this.$refs.detailedEdit.open()
      this.title = '修改'
      this.$nextTick(() => {
        this.$refs.detailedEdit.backindData(record)
      })
    },
    // 修改业绩参数
    achievementData() {
      let result = []
      this.achievements.forEach(item => {
        let temObj = {}
        temObj.percent = item.achievementDetail && item.achievementDetail.percent
        temObj.remark = item.achievementDetail && item.achievementDetail.remark
        temObj.id = item.userId
        temObj.name = item.userName
        result.push(temObj)
      })
      return result
    },
    loadInfo(id) {
      detail(id).then(res => {
        if (res.code === 200) {
          this.detailInfo = res.data
        }
      })
    },

    //取消按钮
    handleCancelEndConfirm($event, record) {
      let _this = this
      this.$confirm({
        title: '系统提示',
        content: '是否进行"取消确认"操作',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          let params = {
            financeIds: record.id,
            state: 'N',
            public: record.public,
            school: record.deptId
          }
          _this.confirmApi(params)
        },
        onCancel() {}
      })
    },
    handleEndConfirm($event, record, state) {
      let deptId = null
      if (record) {
        this.endConfirmParams = {
          financeIds: record.id,
          state,
          public: record.public,
          school: record.deptId
        }
        deptId = record.isCorporateAccount ? record.deptId : null
      } else {
        deptId = this.selectedRows[0].deptId
        this.endConfirmParams = {
          state,
          financeIds: this.selectedRowKeys.join(','),
          batch: true,
          school: deptId
        }
      }
      if (deptId) {
        listBank({ schoolId: deptId }).then(res => {
          if (res.code === 200) {
            this.bankNos = res.data
            this.modal = true
          }
        })
      } else {
        let that = this
        this.$confirm({
          title: '系统提示',
          content: '是否确认该条数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            that.confirmApi(that.endConfirmParams)
          }
        })
      }
    },
    cancel() {
      this.bankNo = null
      this.confirmBranch = ''
      this.confirmAmount = 0
      this.modal = false
    },
    handleBatchEndConfirm(e) {
      this.examine().then(() => {
        let selectedRows = this.selectedRows
        if (selectedRows.filter(data => data.deptId === selectedRows[0].deptId).length !== selectedRows.length) {
          return this.$notification['error']({
            message: '系统通知',
            description: '只能批量修改同一分馆！'
          })
        }
        if (selectedRows.filter(data => data.isCorporateAccount).length !== selectedRows.length) {
          return this.$notification['error']({
            message: '系统通知',
            description: '只能批量修改对公账户！'
          })
        }

        this.confirmBranch = selectedRows[0].deptName
        this.confirmAmount = selectedRows.map(data => data.price).reduce((a, b) => a + b, 0)
        this.handleEndConfirm(e, null, 'Y')
      })
    },
    //确认银行账户
    submit() {
      if (this.endConfirmParams.state === 'Y') {
        if (!this.bankNo) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请先填写银行账户'
          })
        }
        this.$set(this.endConfirmParams, 'bankId', this.bankNo)
        this.$set(this.endConfirmParams, 'confirmDate', this.confirmDate)
        this.$set(this.endConfirmParams, 'serviceCharge', this.serviceCharge || 0)
      }
      this.confirmApi(this.endConfirmParams)
    },

    //remove
    removeDetailed(id) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '是否删除该条数据',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeDetailed(id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            _this._refreshTable()
          })
        }
      })
    },
    confirmApi(parmas) {
      this.isloading = true
      let api = parmas.public ? publicConfirm : privateConfirm
      if (parmas.batch) {
        api = bathConfirm
        delete parmas.state
        delete parmas.serviceCharge
        delete parmas.batch
      }
      api(parmas)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.cancel()
            this._refreshTable()
          }
        })
        .finally((this.isloading = false))
    },
    handleView(record) {
      this.dataInfo = record
      this.visibleDetail = true
    },
    //搜索功能
    searchSubmit(data, isReset) {
      this.queryParam = data
      let stuInfo = this.$route.params.stuInfo
      if (isReset == 'isReset' && stuInfo) {
        this.queryParam.stuInfo = stuInfo
      }
      this._refreshTable()
    },
    handleDetailCancel() {
      this.visibleDetail = false
    },
    _handleTime(time) {
      return this.$tools.tailor.getDate(time)
    },
    _refreshTable() {
      this.selectedRows = []
      this.selectedRowKeys = []
      this.$refs.table.refresh()
    },
    _comptime(date) {
      let today = this.$tools.tailor.getDate(new Date())
      let todayYear = today.split('-')[0]
      let todayMonth = today.split('-')[1]
      let dateYear = date.split('-')[0]
      let dateMonth = date.split('-')[1]
      if (todayYear === dateYear && todayMonth === dateMonth) {
        return true
      } else {
        return false
      }
    },
    adminStartRufund(record) {
      this.$confirm({
        title: '系统提示',
        content: '是否重新发起?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const { id: finId, stuCardId: studentCardId } = record
          adminStartRufund({ finId, studentCardId }).then(res => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '发起成功'
              })
              this._refreshTable()
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.btn-wrapper {
  margin-top: 20px;
  display: flex;
  flex-flow: row nowrap;
}
.detailed-wrapper {
  .remark-wrapper {
    max-width: 400px;
  }
}

.radio-wrapper {
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
}
</style>
