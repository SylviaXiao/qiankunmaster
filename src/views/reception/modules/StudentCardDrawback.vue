<template>
  <div class="drawback-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      width="1000px"
      :visible="visibleDrawback"
      @ok="submitDrawback"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <template slot="title">
        <div class="checkbox-is-show">
          <span style="margin-right: 20px;">
            退费操作
          </span>
        </div>
      </template>
      <a-form :form="drawbackForm">
        <template v-if="type === 'cardDrawBack'">
          <div class="return-in-card">
            <a-row>
              <div class="base-info">
                <div>卡价值:{{ record.paidPrice || 0 }}元</div>
                <div>卡种:{{ record.cardName }}</div>
                <div>使用次数:{{ record.usedCount || 0 }}</div>
              </div>
            </a-row>
          </div>
          <div style="margin-top: -30px">
            <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">退费</span></a-divider>
          </div>
        </template>
        <div class="drawback">
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="办卡金额">
                <a-input-number
                  placeholder="请输入办卡金额"
                  style="width: 100%;"
                  :min="0"
                  v-decorator="['userEnrollPrice', { rules: [{ required: true, message: '请输入办卡金额' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="办卡时间">
                <a-date-picker
                  placeholder="请选择办卡时间"
                  :disabled-date="disabledPayDate"
                  style="width: 100%"
                  v-decorator="[`userEnrollDate`, { rules: [{ required: true, message: '请选择办卡时间' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="扣除课耗">
                <a-input-number
                  class="number-ipt"
                  placeholder="不大于办卡金额"
                  :min="0"
                  :max="record.paidPrice || 0"
                  @change="cardPriceChange"
                  v-decorator="['consumePrice', { initialValue: defaultConsumption, rules: [{ required: true, message: '请输入扣费金额' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="计算方式">
                <a-textarea
                  placeholder="请输入扣除课耗计算方式"
                  :rows="1"
                  v-decorator="['consumePriceRule', { rules: [{ required: true, message: '请输入计算方式' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="学籍管理费">
                <a-input-number
                  @change="getBalance"
                  placeholder="请输入扣除金额"
                  style="width: 100%;"
                  :min="0"
                  :max="maxDrawbackPrice"
                  v-decorator="['extraPrice', { rules: [{ required: true, message: '请输入扣费金额' }, { validator: $verify.isNum }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="计算方式">
                <a-input
                  placeholder="请输入学籍管理费计算方式"
                  style="width: 100%;"
                  v-decorator="['extraPriceRule', { rules: [{ required: true, message: '请输入计算方式' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="退费金额">
                <!--<span style="color:red;">{{ totalDrawbackPrice }}</span> 元-->
                <a-input-number
                  placeholder="请输入退费金额"
                  style="width: 100%;"
                  v-decorator="['refundPrice', { rules: [{ required: true, message: '请输入退费金额' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="扣费合计">
                <span style="color:red;">{{ totalRefund }}</span> 元
                <!--<a-input-number
                  placeholder="学籍管理费和课耗总和"
                  style="width: 100%;"
                  v-decorator="['totalRefund', { rules: [{ required: true, validator: totalRefundValidator }] }]"
                />-->
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="退费原因">
                <a-select v-decorator="['reason', { rules: [{ required: true, message: '请选择' }] }]">
                  <a-select-option :allowClear="true" value="个人原因">个人原因</a-select-option>
                  <a-select-option :allowClear="true" value="老师教学">老师教学</a-select-option>
                  <a-select-option :allowClear="true" value="店面服务">店面服务</a-select-option>
                  <a-select-option :allowClear="true" value="环境卫生">环境卫生</a-select-option>
                  <a-select-option :allowClear="true" value="产品成果">产品成果</a-select-option>
                  <a-select-option :allowClear="true" value="夸大宣传">夸大宣传</a-select-option>
                  <a-select-option :allowClear="true" value="其他">其他</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="备注">
                <div class='textareaTips'>
                  <a-textarea
                    style="width: 79%;"
                    placeholder="请输入备注 (50字以内)" @input='onstuRemarkChange'
                    :maxLength='50'
                    :rows="1"
                    auto-size
                    v-decorator="['refundRemark', { rules: [{ required: false, message: '请输入备注信息' }] }]"
                  />
                  <span class='tips'>{{stuRemarkTips}}</span>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="退费周期">
                <a-input-number
                  placeholder="请输入退费周期"
                  style="width: calc(100% - 25px);"
                  :min="1"
                  :step="1"
                  :precision="0"
                  @change="refDayChange"
                  v-decorator="['refDay', { rules: [{ required: true, message: '请输入退费周期' }] }]"
                /><span style="padding-left: 10px;">天</span>
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="预计附件上传时间">
                {{refEncolsureDate}}
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
                <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="是否回访">
                  <a-radio-group  v-decorator="['refReturn', { rules: [{ required: true, message: '请选择' }] }]">
                      <a-radio value="B">是</a-radio>
                      <a-radio value="A">否</a-radio>
                  </a-radio-group>
                </a-form-item>
            </a-col>
          </a-row>
          <!--<div style="margin-top: -30px">
            <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">待删除字段</span></a-divider>
          </div>
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="是否开票" class="invoice">
                <a-radio-group
                  @change="changeInvoiceType"
                  :defaultValue="false"
                  v-decorator="[
                    'invoice',
                    {
                      initialValue: 'false',
                      rules: [{ required: true, message: '请选择是否开票' }]
                    }
                  ]"
                >
                  <a-radio value="true">已开票</a-radio>
                  <a-radio value="false">未开票</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="是否作废" v-if="cancellationInvoice" class="invoice">
                <a-radio-group
                  :defaultValue="false"
                  v-decorator="[
                    'cancel',
                    {
                      initialValue: 'false',
                      rules: [{ required: true, message: '请选择是否作废' }]
                    }
                  ]"
                >
                  <a-radio value="true">已作废</a-radio>
                  <a-radio value="false">未作废</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>-->
          <div style="margin-top: -30px">
            <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">收款人信息</span></a-divider>
          </div>
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="户名">
                <a-input placeholder="开户人姓名" style="width: 100%;" v-decorator="['bankUserName', { rules: [{ required: true, message: '开户人姓名' }] }]" />
              </a-form-item>
            </a-col>

            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="卡号">
                <a-input placeholder="银行卡号" style="width: 100%;" v-decorator="['bankNo', { rules: [{ required: true, message: '银行卡号' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="开户行">
                <a-input placeholder="开户银行" style="width: 100%;" v-decorator="['bank', { rules: [{ required: true, message: '开户银行' }] }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="与收款人关系">
                <a-select v-decorator="['userRelate', { rules: [{ required: true, message: '请选择' }] }]">
                  <a-select-option :allowClear="true" value="本人">本人</a-select-option>
                  <a-select-option :allowClear="true" value="夫妻">夫妻</a-select-option>
                  <a-select-option :allowClear="true" value="父子">父子</a-select-option>
                  <a-select-option :allowClear="true" value="母子">母子</a-select-option>
                  <a-select-option :allowClear="true" value="爷孙">爷孙</a-select-option>
                  <a-select-option :allowClear="true" value="其他">其他</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12" :xs="24">
              <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="关系备注">
                <a-input placeholder="备注" style="width: 100%;" v-decorator="['userRelateRemark', { rules: [{ required: true, message: '关系备注' }] }]" />
              </a-form-item>
            </a-col>
          </a-row>

          <div style="margin-top: -30px">
            <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">扣除业绩</span></a-divider>
          </div>
          <div style="margin-left: 30px">
            <a-checkbox @change="changeAllowHalfAchievement" :checked="allowHalfAchievement" style="margin-bottom:10px;">允许顾问业绩减半 </a-checkbox>
            <BelongsTable
              :dimission="true"
              :refund="true"
              :counselorDimission="true"
              message="退费金额"
              :dataBacking="proposalAchievements"
              ref="belongsTable"
              :total="totalBelongs"
              :staffStateOptions="staffStateOptions"
              :hideSourceDetailList="true"
            ></BelongsTable>
          </div>
        </div>
      </a-form>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      v-model="visibleTable"
      title="退费明细表"
      width="1000px"
      @cancel="handleTableCancel"
      :footer="null"
    >
      <RefundDetail v-if="visibleTable" :stuCardId="record && record.id"></RefundDetail>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="attachmentVisible" title="上传附件" width="600px" @ok="uploadAttachHandle">
      <upload-sth ref="uploadsth" :multiple="true" :required="false" btn-text="附件上传" filePath="interview-resume"></upload-sth>
    </a-modal>
  </div>
</template>
<script>
import { getPayMethods } from '@/api/education'
import BelongsTable from '@/components/BelongsTable'
import { drawback, previousRefundCard, refundCardAll } from '@/api/recep'
import { refundDetail, saveRefundAttachment } from '@/api/finance/finance'
import { formatCusTabelData } from '@/components/CusTable/detailedInfoCusTable'
import CusTable from '@/components/CusTable/CusTable'
import CusTableHtml from '@/components/CusTable/CusTableHtml'
import UploadSth from '@/components/UploadSth'
import RefundDetail from '@/views/finance/modules/RefundDetail'
import { isNumber } from '@/utils/util'
import moment from 'moment'
// import html2canvas from 'html2canvas'
// import printJs from 'print-Js'

export const defaultLayout = {
  labelCol: { md: { span: 8 } },
  wrapperCol: { md: { span: 16 } }
}
const defaultShowOptions = [
  { label: '退班', value: 'returnInClass', disabled: false },
  { label: '退卡', value: 'returnInCard', disabled: false },
  { label: '退费', value: 'drawback', disabled: false }
]
export default {
  props: {
    type: {
      type: String,
      default: 'cardDrawBack'
    },
    studentInfo: {
      type: Object,
      default: () => {}
    },
    record: {
      type: Object,
      default: () => {}
    },
    staffStateOptions: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CusTableHtml,
    BelongsTable,
    CusTable,
    UploadSth,
    RefundDetail
  },

  watch: {
    visibleDrawback(nv) {
      if (nv) {
        this.init()
        this.$nextTick().then(() => {
          this.drawbackForm.resetFields()
          this.$refs.belongsTable ? this.$refs.belongsTable.initBelongs() : ''
        })
      }
    }
  },
  data() {
    return {
      refEncolsureDate:'',//退费周期
      timer:null,
      stuRemarkTips:'',
      // 办卡
      cardsPrice: 0,
      allowHalfAchievement: false,
      // 表
      cusTableData: [],
      dataHtml: '',
      dataHtmlCss: '',
      dataHtmlPrint: '',
      visibleTable: false,
      attachmentVisible: false,

      refundCardValue: 0, // 课时费
      refundPrice: 0,
      fileId: '',
      achiRes: null,
      visibleDrawback: false,
      confirmLoading: false,
      defaultLayout,
      checkboxValues: [],
      payMethods: [],
      refundDate: moment().subtract(0, 'days'),//退费时间
      totalBelongs: 99999999, // 不需判断
      proposalAchievements: {}, // 参考绩效
      defaultConsumption: 0,
      cancellationInvoice: false,
      totalRefund: 0 //扣费合计
    }
  },
  computed: {
    maxDrawbackPrice() {
      const result = parseFloat((this.record.paidPrice - (this.refundPrice || 0) - (this.cardsPrice || 0)).toFixed(2))
      return result
    },
    // totalDrawbackPrice() {
    //   // 总退费金额
    //   if (this.type === 'cardDrawBack') {
    //     var drawbackPrice = parseFloat((this.record.paidPrice - this.refundPrice - this.cardsPrice - this.refundCardValue).toFixed(2))
    //     return drawbackPrice >= 0 ? drawbackPrice : 0
    //   } else {
    //     return parseFloat((this.record.balance - this.refundPrice).toFixed(2))
    //   }
    // }
  },
  beforeCreate() {
    this.drawbackForm = this.$form.createForm(this)
    getPayMethods().then(res => {
      this.payMethods = res.data
    })
  },
  methods: {
    onstuRemarkChange(){
      const {
        drawbackForm: { getFieldsValue },
      } = this
      const {refundRemark} = getFieldsValue()
      if(refundRemark.length>=45){
        this.stuRemarkTips=`还剩${50-refundRemark.length}字`
      }else{ this.stuRemarkTips=''}
    },
    disabledPayDate(current) {
      return current && current > moment().endOf('day')
    },
    changeInvoiceType(val) {
      let type = val.target.value
      if (type === 'true') {
        this.cancellationInvoice = true
      } else {
        this.cancellationInvoice = false
      }
    },
    init() {
      this.refundCardValue = 0
      this.refundPrice = 0
      this.cardsPrice = 0
      this.refEncolsureDate=''
    },
    changeAllowHalfAchievement(e) {
      this.allowHalfAchievement = e.target.checked
    },

    uploadAttachmentHandle() {
      this.attachmentVisible = true
    },
    uploadAttachHandle() {
      this.$refs.uploadsth
        .multipleHandleUpload()
        .then(res => {
          return saveRefundAttachment({
            financeId: this.financeId,
            attachment: res
          })
        })
        .then(() => {
          this.$refs.uploadsth.reset()
          this.attachmentVisible = false
          this.handleTableCancel()
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
        })
        .catch(err => {
          this.$notification['error']({
            message: '系统通知',
            description: '操作失败'
          })
        })
    },
    handleTableCancel() {
      this.visibleTable = false
    },
    printHandle() {
      this.$refs.cusTableHtml.print()
    },
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    showModal() {
      this.refundPrice = 0
      this.visibleDrawback = true
      this.$nextTick(() => {
        this.backData()
      })
    },
    backData() {
      if (this.type === 'cardDrawBack') {
        previousRefundCard(this.record.id).then(res => {
          const { consumePriceDefault, teacherAchievements, adviserAchievements } = res.data
          this.defaultConsumption = consumePriceDefault
          let teacherAch = teacherAchievements ? teacherAchievements.map(d => Object.assign(d, { teacherPrice: 0 })) : []
          let adviserAch = adviserAchievements ? adviserAchievements.map(d => Object.assign(d, { price: 0 })) : []
          this.proposalAchievements = {
            teacherAchievements: teacherAch,
            adviserAchievements: adviserAch,
            source: res.data.source || null,
            sourceId: res.data.sourceId || null,
            finance: { id: null }
          }
        })
      }
    },
    handleCancel() {
      this.visibleDrawback = false
      this.$nextTick(() => {
        this.$refs.belongsTable ? this.$refs.belongsTable.initBelongs() : ''
      })
    },
    getBalance(value) {
      const {
        maxDrawbackPrice,
        drawbackForm: { getFieldsValue },
        $number,
        $notification
      } = this
      this.$nextTick().then(() => {
        const { consumePrice, extraPrice } = getFieldsValue()
        // 扣除课耗+学籍管理费
        this.totalRefund = isNumber(consumePrice) && isNumber(extraPrice)
          ? $number(consumePrice).plus(extraPrice).toNumber()
          : 0
        if (maxDrawbackPrice < value) {
          $notification['error']({
            message: '系统通知',
            description: '扣除金额不能大于卡可用余额'
          })
          this.refundCardValue = 0
          return
        }
        this.refundCardValue = value
      })
    },
    /*
     *
     * @methods submitDrawback 提交操作
     * */
    submitDrawback() {
      const {
        drawbackForm: { validateFields },
        record: { id },
        $notification,
        totalRefund,
        refundDate
      } = this
      const interfaceApi = this.type === 'cardDrawBack' ? refundCardAll : drawback
      validateFields().then(value => {
        let idParams =
          this.type === 'cardDrawBack'
            ? { stuCardId: id, totalRefund, refundDate }
            : {
              studentId: id,
              totalRefund,
              refundDate
            }
        const returnParams = Object.assign({}, idParams, value)
        this.$nextTick()
          .then(() => {
            this.confirmLoading = true
            return this.$refs.belongsTable.getAllValue()
          })
          .then(arr => {
            const params = Object.assign({}, returnParams, arr)
            params.refundDate = this.$tools.tailor.getDate(params.refundDate)
            params.userEnrollDate = this.$tools.tailor.getDate(params.userEnrollDate)
            params.allowHalfAchievement = this.allowHalfAchievement
            params.refEncolsureDate=this.refEncolsureDate
            return params
          })
          .then(params => {
            return params
          })
          .then(params => {
            return interfaceApi(params)
          })
          .then(res => {
            // 自动弹窗的逻辑
            if (!res.data) {
              $notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.cancellationInvoice = false
              this.handleCancel()
              this.$emit('refund')
            } else {
              this.financeId = res.data
              this.handleCancel()
              this.visibleTable = true
              this.$emit('refund')
              // return refundDetail(res.data).catch(err => {
              //   this.handleCancel()
              //   this.$emit('refund')
              // })
            }
          })
          // .then(res => {
          //   this.dataHtml = res.data.refundDetailView
          //   this.dataHtmlCss = res.data.refundDetailViewCss
          //   this.dataHtmlPrint = res.data.refundDetailView_Print
          //   this.cusTableData = formatCusTabelData(res.data)
          //   this.handleCancel()
          //   this.$emit('refund')
          // })
          .catch(err => {})
          .finally(() => (this.confirmLoading = false))
      })
    },
    refDayChange(v) {
      const {
        drawbackForm: { getFieldsValue },
      } = this
      this.$nextTick().then(() => {
        if(this.timer){
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(()=>{
          const { refDay } = getFieldsValue()
          let refEncolsureDate = ''
          if(refDay)refEncolsureDate=moment().add(refDay, 'days').format('YYYY-MM-DD')
          this.refEncolsureDate=refEncolsureDate
        },1000)
      })
    },
    cardPriceChange(v) {
      const {
        record: { totalPrice, paidPrice },
        drawbackForm: { getFieldsValue, setFieldsValue },
        $number,
        $notification
      } = this
      this.$nextTick().then(() => {
        const { consumePrice, extraPrice } = getFieldsValue()
        this.totalRefund = isNumber(consumePrice) && isNumber(extraPrice)
          ? $number(consumePrice).plus(extraPrice).toNumber()
          : 0
        this.refundPrice = parseFloat(consumePrice) || 0
        if (paidPrice - this.refundPrice < 0) {
          $notification['error']({
            message: '系统通知',
            description: '扣除课时费不能大于卡余额'
          })
          setFieldsValue({ consumePrice: 0 })
          this.refundPrice = 0
          return
        }
      })
    },
    totalRefundValidator(rule, value, callback) {
      const {
        totalRefund,
        drawbackForm: { getFieldsValue },
        $number
      } = this
      const { consumePrice, extraPrice } = getFieldsValue()
      const total = $number(consumePrice)
        .plus(extraPrice)
        .toNumber()
      if (total !== totalRefund) {
        callback('扣费合计必须等于学籍管理费和课耗总和')
      } else {
        callback()
      }
    }
  }
}
</script>

<style scoped lang="less">
.number-ipt {
  width: 100%;
}

.base-info {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.invoice {
  /deep/ .ant-radio-group {
    display: flex;
    height: 40px;
    align-items: center;
  }
}
.textareaTips{
  position:relative;
  .tips {
    //position: absolute;
    //bottom: -5px;
    //right: 10px;
    font-size: 12px;
    padding-left: 5px;
  }
}
</style>
