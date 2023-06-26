<template>
  <div class="detailed-drawback-wrapper">
    <a-form :form="drawbackForm">
      <a-row>
        <a-col :md="8" :sm="8" :xs="8">
          <a-form-item v-bind="{ labelCol: { span: 12 }, wrapperCol: { span: 12 } }" label="卡价值">
            <span>{{ drawbackEditInfo.cardBalance || 0 }}元</span>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="8" :xs="8">
          <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 12 } }" label="使用次数">
            <span>{{ drawbackEditInfo.cardUsedCount || 0 }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <!--<a-row>
        <a-col :md="8" :sm="12" :xs="24">
          <div style="margin-bottom: 30px">
            <span style="margin-right: 20px;margin-left: 90px;">高转低退差额:</span><a-checkbox :checked="showCards" @change="showCardsHandle" />
          </div>
        </a-col>
      </a-row>-->
      <!--<a-row v-if="showCards">
        <div class="newcard-list">
          <div class="list-item" v-for="(item, index) in refundNewCards" :key="index">
            <div>卡种名称 : {{ item.cardName }}</div>
            <div>卡金额 : {{ item.cardPrice }}</div>
          </div>
        </div>
        <div style="margin-bottom:30px"></div>
      </a-row>-->
      <div style="margin-top: -30px">
        <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">退费</span></a-divider>
      </div>
      <a-row>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="退费时间">
            <a-date-picker
              disabled
              placeholder="请选择退费时间"
              style="width: 100%"
              :disabledDate="disabledDate"
              v-decorator="[`refundDate`, { initialValue: momentToday, rules: [{ required: true, message: '请选择退费时间' }] }]"
            />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="支付方式">
            <a-radio-group
              v-decorator="[
                'payType',
                {
                  initialValue: '对私',
                  rules: [{ required: true, message: '请选择支付方式' }]
                }
              ]"
            >
              <a-radio value="对私">其他</a-radio>
              <a-radio value="对公">POS</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col> -->
      </a-row>
      <a-row>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="办卡金额">
            <a-input-number
              placeholder="请输入办卡金额"
              style="width: 100%;"
              :min="0"
              v-decorator="['userEnrollPrice', { rules: [{ required: true, message: '请输入办卡金额' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="办卡时间">
            <a-date-picker
              placeholder="请选择办卡时间"
              style="width: 100%"
              v-decorator="[`userEnrollDate`, { initialValue: defaultDate, rules: [{ required: true, message: '请选择办卡时间' }] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="扣除课耗">
            <a-input-number
              @change="cardPriceChange"
              style="width:100%"
              placeholder="不大于办卡金额"
              :disabled="!handleEnableField('consumePrice')"
              v-decorator="['consumePrice', { rules: [{ required: true, message: '请输入扣费金额' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="计算方式">
            <a-textarea placeholder="请输入扣除课耗计算方式" :rows="1" :disabled="!handleEnableField('consumePriceRule')" v-decorator="['consumePriceRule', { rules: [{ required: true, message: '请输入计算方式' }] }]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="学籍管理费">
            <a-input-number
              @change="extraPriceChange"
              placeholder="请输入扣除金额"
              style="width: 100%;"
              :min="0"
              :disabled="!handleEnableField('extraPrice')"
              v-decorator="['extraPrice', { rules: [{ required: true, message: '请输入扣费金额' }, { validator: $verify.isNum }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="计算方式">
            <a-input
              placeholder="请输入学籍管理费计算方式"
              style="width: 100%;"
              :disabled="!handleEnableField('extraPriceRule')"
              v-decorator="['extraPriceRule', { rules: [{ required: true, message: '请输入计算方式' }] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="退费金额">
            <!--<span style="color:red;">{{ calcDrawPrice }}</span> 元-->
            <a-input-number
              placeholder="请输入退费金额"
              :min="0"
              style="width: 100%;"
              :disabled="!handleEnableField('refundPrice')"
              v-decorator="['refundPrice', { rules: [{ required: true, message: '请输入退费金额' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="扣费合计">
            <span style="color:red;">{{ totalRefund }}</span> 元
            <!--<a-input
              placeholder="学籍管理费和课耗总和"
              style="width: 100%;"
              v-decorator="['totalRefund', { rules: [{ required: true, message: '学籍管理费和课耗总和' }] }]"
            />-->
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="退费原因">
            <a-select :disabled="!handleEnableField('refundReason')" v-decorator="['reason', { rules: [{ required: true, message: '请选择' }] }]">
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
        <a-col :md="16" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 6, sm: 12, xs: 6 }, wrapperCol: { md: 16, sm: 12, xs: 16 } }" label="备注">
            <div class='textareaTips'>
              <a-textarea
                style="width: 59%;"
                :rows="1"
                :disabled="!handleEnableField('refundRemark')"
                v-decorator="['refundRemark', { rules: [{ required: false, message: '请输入备注信息' }] }]"
                placeholder="请输入备注 (50字以内)" @input='onstuRemarkChange'
                :maxLength='50'
                auto-size
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
              @change="refundDayChange"
              v-decorator="['refundDay', { rules: [{ required: true, message: '请输入退费周期' }] }]"
            /><span style="padding-left: 10px;">天</span>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }" label="预计附件上传时间">
            {{refundEncolsureDate}}
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
      <div style="margin-top: -30px">
        <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">收款人信息</span></a-divider>
      </div>
      <a-row>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="户名">
            <a-input placeholder="开户人姓名" style="width: 100%;" :disabled="!handleEnableField('bankUserName')" v-decorator="['bankUserName', { rules: [{ required: true, message: '开户人姓名' }] }]" />
          </a-form-item>
        </a-col>

        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 8, sm: 8, xs: 6 }, wrapperCol: { md: 16, sm: 16, xs: 16 } }" label="卡号">
            <a-input placeholder="银行卡号" style="width: 100%;" :disabled="!handleEnableField('bankNo')" v-decorator="['bankNo', { rules: [{ required: true, message: '银行卡号' }] }]" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 8, sm: 8, xs: 6 }, wrapperCol: { md: 12, sm: 12, xs: 16 } }" label="开户行">
            <a-input placeholder="开户银行" style="width: 100%;" :disabled="!handleEnableField('bank')" v-decorator="['bank', { rules: [{ required: true, message: '开户银行' }] }]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 12, sm: 12, xs: 8 }, wrapperCol: { md: 12, sm: 12, xs: 14 } }" label="与收款人关系">
            <a-select :disabled="!handleEnableField('userRelate')" v-decorator="['userRelate', { rules: [{ required: true, message: '请选择' }] }]">
              <a-select-option :allowClear="true" value="本人">本人</a-select-option>
              <a-select-option :allowClear="true" value="夫妻">夫妻</a-select-option>
              <a-select-option :allowClear="true" value="父子">父子</a-select-option>
              <a-select-option :allowClear="true" value="母子">母子</a-select-option>
              <a-select-option :allowClear="true" value="爷孙">爷孙</a-select-option>
              <a-select-option :allowClear="true" value="其他">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
          <a-form-item v-bind="{ labelCol: { md: 8, sm: 8, xs: 6 }, wrapperCol: { md: 16, sm: 16, xs: 16 } }" label="关系备注">
            <a-input placeholder="备注" style="width: 100%;" :disabled="!handleEnableField('userRelateRemark')" v-decorator="['userRelateRemark', { rules: [{ required: true, message: '关系备注' }] }]" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div style="margin-top: -30px">
      <a-divider orientation="left">
        <span :style="{ color: 'rgba(1,1,1,.3)' }">扣除业绩</span>
      </a-divider>
    </div>
    <div>
      <a-checkbox @change="changeAllowHalfAchievement" :checked="allowHalfAchievement" :disabled="!handleEnableField('allowHalfAchievement')" style="margin-bottom:10px;">允许顾问业绩减半</a-checkbox>
      <BelongsTable :refund="true" message="退费金额" :dataBacking="proposalAchievements" ref="belongsTable" :total="totalBelongs" :limit="limit" :hideSourceDetailList="hideSourceDetailList"></BelongsTable>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { isNumber } from '@/utils/util'
import BelongsTable from '@/components/BelongsTable'
const defaultLayout = {
  labelCol: { md: { span: 8 } },
  wrapperCol: { md: { span: 16 } }
}
export default {
  props: {
    drawbackEditInfo: {
      type: Object,
      default: {}
    },
    limit: {
      type: Array,
      default: () => []
    },
    hideSourceDetailList: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BelongsTable
  },
  data() {
    return {
      defaultRefundEncolsureDate:'',
      refundEncolsureDate:'',
      stuRemarkTips:'',
      totalBelongs: 999999,
      consumePriceTemp: 0,
      extraPriceTemp: 0,
      defaultLayout,
      refundNewCards: [],
      showCards: false,
      allowHalfAchievement: false,
      momentToday: moment().subtract(0, 'days'),
      defaultDate: moment().subtract(0, 'days'),
      proposalAchievements: {},
      totalRefund: 0 //扣费合计
    }
  },
  computed: {
    couldDrawBackPrice() {
      const { drawbackEditInfo, refundNewCards } = this
      const refundNewCardsPrice = (refundNewCards && refundNewCards.reduce((a, b) => a + b.cardPrice, 0)) || 0
      return drawbackEditInfo.cardBalance - refundNewCardsPrice
    },
    // calcDrawPrice() {
    //   const { drawbackEditInfo, couldDrawBackPrice } = this
    //   const val1 = drawbackEditInfo.consumeCardPrice || this.consumePriceTemp
    //   const val2 = (drawbackEditInfo.refundInfo && drawbackEditInfo.refundInfo.extraPrice) || this.extraPriceTemp
    //   return (couldDrawBackPrice - val1 - val2).toFixed(2)
    // }
  },
  beforeCreate() {
    this.drawbackForm = this.$form.createForm(this)
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
    refundDayChange(v) {
      const {
        drawbackForm: { getFieldsValue },
      } = this
      this.$nextTick().then(() => {
        if(this.timer){
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(()=>{
          const { refundDay } = getFieldsValue()
          let refundEncolsureDate = ''
          if(refundDay)refundEncolsureDate=moment(this.defaultRefundEncolsureDate).add(refundDay, 'days').format('YYYY-MM-DD')
          this.refundEncolsureDate=refundEncolsureDate
        },1000)
      })
    },
    // 是否启用字段
    handleEnableField(data) {
      const { limit } = this
      if (!limit || limit.length === 0) return true
      if (Array.isArray(data)) {
        return data.findIndex(d => limit.includes(d)) >= 0
      }
      return limit.includes(data)
    },
    showCardsHandle(e) {
      this.showCards = e.target.checked
      // if (this.showCards) {
      //   this.$nextTick(() => {
      //     this.cardsPrice = 0
      //     this.$refs.newcard.backingDataForDrawBack()
      //   })
      // }
    },
    changeAllowHalfAchievement(e) {
      this.allowHalfAchievement = e.target.checked
    },
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    cardPriceChange(v) {
      const {
        drawbackEditInfo,
        couldDrawBackPrice,
        drawbackForm: { getFieldValue, setFieldsValue ,getFieldsValue},
        $notification,
        $number,
      } = this
      drawbackEditInfo.consumeCardPrice = 0 // 计算属性的兼容方案,不然总退费金额取不到正确的值
      this.$nextTick().then(() => {
        this.consumePriceTemp = parseFloat(getFieldValue('consumePrice')) || 0
        const { consumePrice, extraPrice } = getFieldsValue()
        this.totalRefund = isNumber(consumePrice) && isNumber(extraPrice)
          ? $number(consumePrice).plus(extraPrice).toNumber()
          : 0
        if (v - couldDrawBackPrice > 0) {
          $notification['error']({
            message: '系统通知',
            description: '扣除课时费不能大于可退金额'
          })
          setFieldsValue({ consumePrice: 0 })
          this.consumePriceTemp = 0
          return
        }
      })
    },
    // 该方法将与上面的合并
    extraPriceChange(v) {
      const {
        drawbackEditInfo,
        couldDrawBackPrice,
        drawbackForm: { getFieldValue, getFieldsValue, setFieldsValue },
        $number,
        $notification
      } = this
      drawbackEditInfo.refundInfo.extraPrice = 0 // 计算属性的兼容方案,不然总退费金额取不到正确的值
      this.$nextTick().then(() => {
        const { consumePrice, extraPrice } = getFieldsValue()
        // 扣除课耗+学籍管理费
        this.totalRefund = isNumber(consumePrice) && isNumber(extraPrice)
          ? $number(consumePrice).plus(extraPrice).toNumber()
          : 0
        this.extraPriceTemp = parseFloat(extraPrice) || 0
        if (v - couldDrawBackPrice > 0) {
          $notification['error']({
            message: '系统通知',
            description: '扣除课时费不能大于可退金额'
          })
          setFieldsValue({ extraPrice: 0 })
          this.extraPriceTemp = 0
          return
        }
      })
    },
    backindData() {
      const {
        drawbackForm: { setFieldsValue },
        drawbackEditInfo
      } = this
      const {
        consumeCardPrice,
        consumeCardPriceRule,
        refundNewCards,
        refundInfo,
        refundRemark,
        refundPrice,
        adviserAchievements,
        teacherAchievements,
        source,
        sourceId,
        finance,
        refundEncolsureDate,
        refundDay,
        creatDate,
      } = drawbackEditInfo
      const {
        extraPrice,
        extraPriceRule,
        reason,
        userRelate,
        userRelateRemark,
        bankUserName,
        bankNo,
        bank,
        userEnrollDate,
        userEnrollPrice,
        totalRefund,
        allowHalfAchievement,
        refReturn,
      } = refundInfo
      this.totalRefund = totalRefund
      this.refundNewCards = refundNewCards || []
      this.showCards = refundNewCards && refundNewCards.length ? true : false
      this.allowHalfAchievement = allowHalfAchievement
      this.drawbackForm.setFieldsValue({ ['refundDate']: finance.createDate.split(' ')[0] })
      // console.log(this.drawbackForm.getFieldValue('refundDate'))
      const params = {
        consumePrice: consumeCardPrice,
        consumePriceRule: consumeCardPriceRule,
        extraPrice,
        extraPriceRule,
        reason,
        refundRemark,
        refundDay,
        refundPrice: Math.abs(refundPrice),
        userRelate,
        userRelateRemark,
        bankUserName,
        bankNo,
        bank,
        userEnrollDate: this.$tools.tailor.dateToMoment(userEnrollDate),
        userEnrollPrice,
        refReturn
      }
      this.proposalAchievements = {
        teacherAchievements: drawbackEditInfo.teacherAchievements || [],
        adviserAchievements: drawbackEditInfo.adviserAchievements || [],
        source,
        sourceId,
        finance: { id: finance.id }
      }
      this.refundEncolsureDate=refundEncolsureDate?.slice(0,10)||''
      this.defaultRefundEncolsureDate=creatDate
      setFieldsValue(params)
      this.$nextTick(() => {
        this.$refs.belongsTable.getDom()
      })
    },
    getAllData() {
      const {
        drawbackForm: { validateFields },
        $notification
      } = this
      let params = null
      return validateFields()
        .then(val => {
          params = {
            userEnrollDate: this.$tools.tailor.getDate(val.userEnrollDate),
            userEnrollPrice: val.userEnrollPrice,
            totalRefund: this.totalRefund,
            refundRemark: val.refundRemark,
            refEncolsureDate: this.refundEncolsureDate||'',
            refDay: val.refundDay,
            refundPrice: val.refundPrice,
            consumePrice: val.consumePrice,
            consumePriceRule: val.consumePriceRule,
            extraPrice: val.extraPrice,
            extraPriceRule: val.extraPriceRule,
            payType: val.payType,
            userRelate: val.userRelate,
            userRelateRemark: val.userRelateRemark,
            bankUserName: val.bankUserName,
            bank: val.bank,
            bankNo: val.bankNo,
            allowHalfAchievement: this.allowHalfAchievement,
            reason: val.reason,
            refundDate: this.$tools.tailor.getDate(val.refundDate),
            refReturn: val.refReturn
            // momentToday
          }
          // con
        })
        .then(this.$refs.belongsTable.getAllValue)
        .then(res => {
          return Object.assign({}, params, res)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.detailed-drawback-wrapper {
  .newcard-list {
    width: 600px;
    margin: 0 auto;
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
    }
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
