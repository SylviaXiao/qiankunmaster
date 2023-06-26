<template>
  <div class="settle-accounts-wrapper">
    <!--    <a-row type="flex" align="middle" class="should-pay">-->
    <!--      <a-col :span="4" class="should-pay-label"><span :style="{paddingRight:'5px'}">应缴金额</span>:</a-col>-->
    <!--      <a-col :span="12" class="should-pay-value">{{this.shouldPayMoney}}元</a-col>-->
    <!--    </a-row>-->
    <a-form :form="form" class="">
      <a-row>
        <a-col :span="12">
          <!-- 实缴金额 -->
          <a-row type="flex" align="middle">
            <a-col :span="12">
              <a-form-item
                label="实缴金额 : "
                :label-col="{ span: 12 }"
                :wrapper-col="{ span: 12 }">
                <a-input
                  addonAfter="元"
                  @change="getBalance"
                  @focus="resetInput"
                  v-decorator="[
                    'price',
                    {rules: [{ required: true, message: '请输入实缴金额' },{validator:$verify.isNum}]}
                  ]"/>
                <!-- <span v-if="payInYuMoney" class="tips-needpay">应缴费{{needPayMoney}}元</span> -->
              </a-form-item>
            </a-col>
            <a-col v-if="isFullMoney&&oldStudent" class="radio-yu" :span="8">
              <!-- <a-checkbox @change="changeRadioYE">使用余额</a-checkbox> -->
              <span class="tips">
                （余额：￥{{yuMoney}}元）
                <a-icon v-show="freshYE" class="iconye" type="sync" @click="refreshYE"/>
                <a-icon v-show="!freshYE" class="iconye" type="sync" spin/>
              </span>
            </a-col>
          </a-row>

          <a-row>
            <a-col span="12" v-if="hasType">
              <a-form-item
                label="缴费类型 : "
                :label-col="{ span: 12}"
                :wrapper-col="{ span: 12 }"
              >
                <a-select @change="changeType"
                          v-decorator="['priceType', {initialValue: 'A',rules: [{ required: true, message: '请选择缴费类型' }]}]"
                          style="width: 120px">
                  <a-select-option :allowClear="true" value="A">全款</a-select-option>
                  <a-select-option :allowClear="true" value="B">定金</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item
                v-if="payMethods"
                label="支付类型 : "
                :label-col="{ span: 12 }"
                :wrapper-col="{ span:12 }">
                <a-select v-decorator="['payTypeId',{rules: [{ required: true, message: '请选择支付类型' }]}]"
                          style="width: 120px">
                  <a-select-option :allowClear="true" v-for="(item, index) in payMethods" :value="item.id"
                                   :key="index">
                    {{item.dictValue}}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                v-else
                label="支付类型 : "
                :label-col="{ span: 12 }"
                :wrapper-col="{ span: 12 }">
                <a-select initialValue="无" style="width: 120px">
                  <a-select-option :allowClear="true" value="无">暂无</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 缴费类型 -->

          <!-- 支付类型 -->


          <!-- 备注 -->
          <a-form-item
            label="备注 : "
            :label-col="{ span: 6}"
            :wrapper-col="{ span: 18 }">
            <a-textarea
              style="width: 100%;"
              placeholder="请输入备注信息"
              :rows="4"
              v-decorator="[
                'remark',
                {rules: [{ required: false, message: '请输入备注信息' }]}]"/>
          </a-form-item>


        </a-col>
        <a-col :span="12">
          <!-- 业绩归属  -->
          <a-form-item
            v-for="(k, index) in form.getFieldValue('keys')"
            :key="k"
            v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
            :label="index === 0 ? '业绩归属 : ' : ''"
            :required="false">
            <a-input-group style="width: 85%; margin-right: 8px" compact>
              <a-input-search
                disabled
                v-decorator="[`achievementName[${k}]`]"
                placeholder="点右侧图标选择"
                style="width: 55%"
                @search="achievementNameClick(`achievementName[${k}]`,k)"
              />
              <a-input-number
                class="achievementValue"
                placeholder="权重"
                style="width: 25%"
                v-decorator="[
                   `achievementValue[${k}]`,
                   {rules: [{ type: 'number', message: '请输入正确的权重值(1~100)' }]}
                 ]"
                :min="1" :max="100"/>
              <span style="width: 15%" class="percent-sign">%</span>
            </a-input-group>
            <a-icon
              v-if="form.getFieldValue('keys').length > 1"
              class="dynamic-delete-button"
              type="minus-circle-o"
              :disabled="form.getFieldValue('keys').length === 1"
              @click="() => remove(k,index)"/>
          </a-form-item>
          <a-button
            class="add-achievement"
            type="dashed"
            @click="add">
            <a-icon type="plus"/>
            分单
          </a-button>

          <!-- 归属说明 -->
          <a-form-item
            v-bind="formItemLayoutGuishu"
            label="归属说明 : ">
            <a-textarea
              style="width: 100%;"
              placeholder="请输入归属说明"
              :rows="4"
              v-decorator="[
                'achievementRemark',
                {rules: [{ required: false, message: '请输入归属说明' }]}
              ]"/>
          </a-form-item>
        </a-col>
      </a-row>

    </a-form>
    <i-modal
      ref="imodal"
      :multiple="false"
      userType="master"
      @getBackData="getBackData"
    ></i-modal>

  </div>
</template>
<script>
  let id = 0
  const PAY_TYPE = 'pay_type'
  import { getPayMethods, getStudentBalance } from '@/api/education'
  import { IModal } from '@/components'

  export default {
    props: {
      studentInfo: {
        typs: Object,
        default: null
      },
      shouldPayMoney: {
        type: Number,
        default: 0
      },
      hasType: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      studentInfo(nv) {
        console.log("nv",nv.balance)
        if (nv && (nv.stuBalance||nv.balance)) {
          this.yuMoney = nv.stuBalance || nv.balance
          console.log(this.yuMoney)
          let price = ~~this.yuMoney + ~~this.form.getFieldValue('price')
          this.$emit('getBalancePrice', price)
        } else {
          this.$emit('getBalancePrice', 0)
        }
      },
      oldStudent(nv) {
        if (!nv) {
          this.$emit('getBalancePrice', 0)
        }
      },
      needPayMoney(nv) {
        // if(nv) {
        //   this.form.setFieldsValue({ 'price': this.needPayMoney })
        // }
      }
    },
    computed: {
      needPayMoney() {
        return (this.shouldPayMoney - this.yuMoney) >= 0 ? (this.shouldPayMoney - this.yuMoney) : 0
      },
      oldStudent() {
        return !!this.studentInfo && (!!this.studentInfo.stuBalance || !!this.studentInfo.balance)
      }
    },
    data() {
      return {
        // 图标切换flag
        freshYE: true,
        // 是否为全款选项
        isFullMoney: true,
        achievementName: '',
        idIndex: 0,
        formResult: {},
        yuMoney: 0,
        payInYuMoney: false,
        payMethods: null,
        formItemLayout: {
          labelCol: {
            sm: { span: 4 }
          },
          wrapperCol: {
            sm: { span: 12 }
          }
        },
        formItemLayoutGuishu: {
          labelCol: {
            sm: { span: 4 }
          },
          wrapperCol: {
            sm: { span: 16 }
          }
        },
        formItemLayoutWithOutLabel: {
          wrapperCol: {
            sm: { span: 12, offset: 4 }
          }
        }
      }
    },

    beforeCreate() {
      this.form = this.$form.createForm(this)
      this.form.getFieldDecorator('keys', { initialValue: [0], preserve: true })
      this.form.getFieldDecorator('achievementId', { initialValue: [], preserve: true })
    },
    created() {
      //获取支付方法
      this.getPayType()
    },
    mounted() {
      this.form.setFieldsValue({ 'price': this.shouldPayMoney })
    },
    components: {
      IModal
    },
    methods: {
      //
      getPayType() {
        getPayMethods().then(res => {
          if (res.code === 200 && res.data) {
            this.payMethods = res.data
          }
        }).then(() => {
          this.form.setFieldsValue({
            payTypeId: this.payMethods[0].id
          })
        })
      },
      //
      resetInput() {
        const { form: { setFieldsValue, getFieldValue } } = this
        const price = 'price'
        getFieldValue(price) == 0 ? setFieldsValue({ price: null }) : ''
      },
      //获取余额和实缴金额
      getBalance(e) {
        let price = ~~e.target.value + ~~this.yuMoney
        this.$emit('getBalancePrice', price)
      },
      //改变type  select框
      changeType(val) {
        if (val === 'A') {
          this.isFullMoney = true
        } else {
          this.isFullMoney = false
        }
      },
      //刷新余额
      refreshYE() {
        if (this.studentInfo && this.studentInfo.id) {
          let id = this.studentInfo.id
          this.freshYE = false
          getStudentBalance(id).then(res => {
            if (res.code === 200) {
              setTimeout(() => {
                this.freshYE = true
                this.yuMoney = res.data
              }, 1500)
            }
          })
        }
      },
      //验证
      validate() {
        const achievementValue = this.form.getFieldValue('achievementValue')
        const achievementName = this.form.getFieldValue('achievementName')
        let flag = true
        //遍历name检查value
        achievementName.forEach((item, index) => {
          if (item) {
            if (!achievementValue[index]) {
              this._noticeText('业绩归属后请填入权重值')
              flag = false
            }
          }
        })
        //遍历value检查name
        achievementValue.forEach((item, index) => {
          if (item) {
            if (!achievementName[index]) {
              this._noticeText('权重值前未加业绩归属人员')
              flag = false
            }
          }
        })
        let totalPercent = 0
        achievementValue.forEach((item, index) => {
          if (item) {
            totalPercent += ~~item
          }
        })
        return flag
      },
      getAccountsFormData() {
        return this.form.validateFields().then(() => {
          if (this.validate()) {
            this.buildResult()
            return this.formResult
          }
        })
      },
      // changeRadioYE(e) {
      //   if (e.target.checked) {
      //     this.form.setFieldsValue({ 'price': this.needPayMoney })
      //   } else {
      //     this.form.setFieldsValue({ 'price': this.shouldPayMoney })
      //   }
      //   this.payInYuMoney = e.target.checked
      // },
      achievementNameClick(achievementName, index) {
        this.achievementName = achievementName
        this.idIndex = index
        this.$refs.imodal.open()
      },
      getBackData(data, type) {
        if (this.idIndex === 0) {
          this._backingValue()
        }
        let key = this.achievementName
        let keyId = this.achievementId
        const achievementIdArr = this.form.getFieldValue('achievementId')
        let newAchievementIdArr = [...achievementIdArr]
        newAchievementIdArr[this.idIndex] = data.id
        this.form.setFieldsValue({ [key]: data.name, achievementId: newAchievementIdArr })
      },
      buildResult() {
        let formObj = this.form.getFieldsValue()
        if (formObj.priceType) this.formResult.priceType = formObj.priceType
        if (formObj.price) this.formResult.price = formObj.price
        if (formObj.payTypeId) this.formResult.payTypeId = formObj.payTypeId
        if (formObj.remark) this.formResult.remark = formObj.remark
        if (formObj.achievementRemark) this.formResult.achievementRemark = formObj.achievementRemark
        if (formObj.achievementName.length > 0) {
          this.formResult.achievements = []
          formObj.achievementName.forEach((item, index) => {
            let temObj = {}
            if (item && formObj.achievementValue[index]) {
              temObj.id = formObj.achievementId[index]
              temObj.percent = formObj.achievementValue[index]
              this.formResult.achievements.push(temObj)
            }
          })
        }
        this.formResult.useBalance = this.payInYuMoney
      },
      remove(k, index) {
        const { form } = this
        //删除数组achievementId对应的index
        const achievementIdArr = form.getFieldValue('achievementId')
        let newAchievementIdArr = [...achievementIdArr]
        newAchievementIdArr[k] = undefined
        form.setFieldsValue({
          achievementId: newAchievementIdArr
        })


        const keys = form.getFieldValue('keys')
        if (keys.length === 1) {
          return
        }

        form.setFieldsValue({
          keys: keys.filter(key => key !== k)
        })
      },

      add() {
        const { form } = this
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(++id)
        form.setFieldsValue({
          keys: nextKeys
        })
      },

      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
          }
        })
      },
      //回写数据
      dataBacking() {
        // this.form.setFieldsValue({ 'price': this.needPayMoney })
      },
      // 重置form
      resetForm() {
        //表单重置
        this.achievementName = ''
        this.idIndex = 0
        this.form.resetFields()
        this.getPayType()
      },

      _noticeText(text) {
        this.$notification['error']({
          message: '系统通知',
          description: text
        })
      },
      _backingValue() {
        let valueArr = this.form.getFieldValue('achievementValue')
        if (!valueArr[0]) {
          this.form.setFieldsValue({
            'achievementValue[0]': 100
          })
        }
      }
    }
  }
</script>

<style scoped lang=less>
  @import '~@/assets/style/index';

  .settle-accounts-wrapper {
    .add-achievement {
      position: absolute;
      top: 5px;
      color: #999;
      right: 15%;
    }

    .tips-needpay {
      position: absolute;
      color: #999;
      font-size: 12px;
      top: 40px;
      right: -86px;
      width: 200px;
    }

    .percent-sign {
      box-sizing: border-box;
      padding: 8.0px 11px;
      font-size: 14px;
      font-weight: normal;
      line-height: 1;
      color: rgba(0, 0, 0, 0.65);
      text-align: center;
      background-color: #fafafa;
      border: 1px solid #d9d9d9;
      position: relative;
      -webkit-transition: all 0.3s;
      transition: all 0.3s;

    }

    .dynamic-delete-button {
      cursor: pointer;
      position: relative;
      font-size: 14px;
      color: #999;
      transition: all .3s;
    }

    .dynamic-delete-button:hover {
      color: #777;
    }

    .dynamic-delete-button[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .radio-yu {
      padding-left: 20px;
      box-sizing: border-box;
      /*color: rgb(223, 39, 62);*/
      color: #000;
      position: relative;
      top: -10px;
      white-space: nowrap;

      .tips {
        /*position: absolute;*/
        /*color: #999;*/
        /*font-size: 12px;*/
        color: rgb(223, 39, 62);
        padding: 0;

        .iconye {
          position: relative;
          left: 5px;
          cursor: pointer;
          color: #000;
        }
      }

      label {
        // color: rgb(223, 39, 62);
      }
    }

    .should-pay {
      margin-bottom: 20px;

      .should-pay-label {
        color: rgba(0, 0, 0, 0.85);
        padding-right: 7px;
        .right();
      }

      .should-pay-value {
        //font-size: 28px;
        //padding-left: 5px;
        color: rgb(223, 39, 62);
        //.left();
      }
    }
  }
</style>
