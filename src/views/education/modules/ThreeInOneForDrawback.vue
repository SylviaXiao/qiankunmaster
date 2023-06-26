<template>
  <div class="three-in-one-drawback-wrapper">
    <div class="checkbox-is-show">
      <a-checkbox-group :options="isShowOptions" v-model="checkboxValues" @change="checkboxChange"/>
    </div>
    <a-form :form="drawbackForm">
      <div class="return-in-class">
        <a-row>
          <a-col :span="12">
            <a-form-item v-bind="defaultLayout" label="原卡金额">
              <span>{{record.originalPrice||0}}元</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="defaultLayout" label="办卡金额">
              <span>{{record.totalPrice ||0}}元</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item v-bind="defaultLayout" label="卡余额(参考)">
              <span>{{record.paidPrice ||0}}元</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="defaultLayout" label="课耗扣除金额">
              <!--TODO        MAX !> 办卡金额 -->
              <a-input-number class="number-ipt" placeholder="该金额不能大于办卡金额"
                              :min="0" :max="record.totalPrice||0"
                              @change="priceChange"
                              v-decorator="['price',{rules:[{required:true,message:'请输入课耗扣除金额'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item v-bind="defaultLayout" label="扣除后余额">
              <!--TODO    扣除后卡余额 = 办卡金额 - 课耗扣除金额 -->
              <span>{{ruteunInClassComputed ||record.totalPrice||0}}元</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="defaultLayout" label="备注">
              <a-textarea placeholder="请输入备注信息" :rows="1"/>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="return-in-card" v-if="false">
<!--           v-if="!!checkboxValues&&checkboxValues.length>0?checkboxValues.indexOf('returnInCard')!== -1:false">-->

        <div class="title">
          <a-divider orientation="left">退卡</a-divider>
        </div>
        <a-row>
          <a-col :span="12">
            <a-form-item v-bind="defaultLayout" label="非课耗扣除金额">
              <!--TODO        MAX !> 扣除后卡余额 -->
              <a-input-number class="number-ipt" placeholder="该金额不能大于扣除后卡余额" :min="0" :max="ruteunInClassComputed ||record.totalPrice||0"
                              v-decorator="['notprice',{rules:[{required:true,message:'请输入课耗扣除金额'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="defaultLayout" label="退卡金额">
              <!--TODO    退卡金额 = 办卡金额 - 课耗扣除金额 - 非课耗扣除金额-->
              <span>{{ruteunInClassComputed ||record.totalPrice||0}}元</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item v-bind="{labelCol: { md: { span: 4 } }, wrapperCol: { md: { span: 20 } }}" label="退卡备注">
              <a-textarea placeholder="请输入退班备注信息" :rows="1"/>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="drawback"
           v-if="!!checkboxValues&&checkboxValues.length>0?checkboxValues.indexOf('drawback')!== -1:false">
        <div class="title">
          <a-divider orientation="left">退款</a-divider>
        </div>
        <a-row :style="{marginBottom: '20px'}">
          <a-col :style="{textAlign: 'right',color: 'rgba(1,1,1,.85)',paddingRight: '6px'}" :span="4">可退金额 :</a-col>
          <a-col :span="12">{{studentInfo?studentInfo.balance:0}}元</a-col>
        </a-row>
        <a-row>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="退款金额">
              <a-input-number
                @change="getBalance"
                placeholder="请输入退款金额"
                style="width: 100%;"
                :min="0"
                :max="studentInfo?studentInfo.balance:0"
                v-decorator="['price',{rules: [{ required: true, message: '请输入退款金额' },{validator:$verify.isNum}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="实退金额">
              <a-input-number
                placeholder="实退金额不能大于退款金额"
                style="width: 100%;"
                :min="0"
                :max="totalPrice"
                v-decorator="['actualPrice',{rules: [{ required: true, message: '请输入实退金额' }]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :offset="4" :lg="8" :md="8" :sm="8">
            <UploadSth ref="uploadSth" :required="true" btnText="退款附件" filePath="reason"/>
          </a-col>
          <a-col :lg="12" :md="12" :sm="12">
            <a-form-item v-bind="defaultLayout" label="备注">
              <a-textarea
                style="width: 100%;"
                placeholder="请输入备注信息"
                :rows="1"
                v-decorator="[
                      'paidLogRemark',
                      {rules: [{ required: true, message: '请输入备注信息' }]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider orientation="right"><span :style="{color:'rgba(1,1,1,.3)'}">扣除业绩</span></a-divider>
        <belongs-table ref="belongsTable" :total="totalPrice"></belongs-table>

      </div>
    </a-form>
  </div>
</template>

<script>
  import Drawback from '@/views/reception/modules/StudentInfoDrawback'
  import BelongsTable from '@/components/BelongsTable'
  import UploadSth from '@/components/UploadSth'


  const defaultLayout = {
    labelCol: { md: { span: 8 } },
    wrapperCol: { md: { span: 16 } }
  }
  const isShowOptions = [
    { label: '退班', value: 'returnInClass' },
    { label: '退卡', value: 'returnInCard' },
    { label: '退费', value: 'drawback' }
  ]
  export default {
    name: 'ThreeInOneForDrawback',
    props: {
      record: {
        type: Object, default: () => {
        }
      }
    },
    components: { Drawback, BelongsTable, UploadSth },
    data() {
      return {
        defaultLayout,
        isShowOptions,
        checkboxValues: null,
        ruteunInClassComputed: null
      }
    },
    beforeCreate() {
      this.drawbackForm = this.$form.createForm(this)
    },
    methods: {
      //选择checkbox后的callback
      checkboxChange(event) {
        // const {target:{checked}} = event
        console.log(event)
        console.log(this.checkboxValues)
      },
      priceChange() {
        const { record: { totalPrice }, drawbackForm: { getFieldValue, setFieldsValue }, $notification } = this
        this.$nextTick()
          .then(() => {
            if (totalPrice - getFieldValue('price') < 0) {
              $notification['error']({
                message: '系统通知',
                description: '课耗扣除金额不能大于办卡金额'
              })
              this.ruteunInClassComputed = null
              setFieldsValue({ 'price': 0 })
              return
            }
            this.ruteunInClassComputed = totalPrice - getFieldValue('price')
          })
      }


    }

  }
</script>

<style scoped lang=less>
  .three-in-one-drawback-wrapper {
    .number-ipt {
      width: 100%;
    }
  }
</style>