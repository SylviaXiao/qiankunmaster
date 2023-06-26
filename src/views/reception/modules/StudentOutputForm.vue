<template>
  <div class="student-form">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1100"
      :title="modalTitle"
      :visible="modalVisible"
      :confirmLoading="modalLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-row :gutter="8">
          <a-col :md="8" :sm="12">
            <a-form-item v-bind="{ labelCol: { sm: { span: 12 } }, wrapperCol: { sm: { span: 12 } } }" label="学员姓名">
              <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入学员姓名' }] }]" />
              <a-input type="hidden" v-decorator="['id']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item v-bind="defaultLayout" label="性别">
              <a-radio-group v-decorator="['sex', { rules: [{ required: true, message: '请选择性别' }] }]" name="radioGroup">
                <a-radio value="A">男</a-radio>
                <a-radio value="B">女</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="身体情况">
              <a-select v-decorator="['healthy', { rules: [{ required: true, message: '请输入身体情况' }] }]">
                <a-select-option v-for="(option, index) in healthyOptions" :key="index" :value="option">{{ option }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="经济情况">
              <a-select v-decorator="['economic', { rules: [{ required: true, message: '请输入经济情况' }] }]">
                <a-select-option v-for="(option, index) in economicOptions" :key="index" :value="option">{{ option }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="出生年月日" required>
              <span class="space-between">
                <span class="space-between" style="width: 33.3%;">
                  <a-input type="hidden" v-decorator="['birthday', { rules: [{ required: true, validator: verifyBirthDate }] }]" />
                  <a-input ref="birthdayYear" v-model="birthdayYear" @change="changeBirthday" />&nbsp;年&nbsp;
                </span>
                <span class="space-between" style="width: 33.3%;">
                  <a-input ref="birthdayMonth" v-model="birthdayMonth" @change="changeBirthday" />&nbsp;月&nbsp;
                </span>
                <span class="space-between" style="width: 33.3%;"> <a-input ref="birthdayDay" v-model="birthdayDay" @change="changeBirthday" />&nbsp;日 </span>
              </span>
            </a-form-item>
          </a-col>
          <!--<a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="是否交别班定金">
              <a-select v-decorator="['deposit', { rules: [{ required: true, message: '请选择是否交别班定金' }] }]" @change="changeDeposit">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>-->
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="手机号">
              <a-input
                @change="stuPhoneChange"
                v-decorator="['stuPhone', { rules: [{ required: true, message: '请输入手机号' }, { validator: verifyPhone }] }]"
              />
            </a-form-item>
          </a-col>
          <!--<a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="定金金额">
              <a-input-number :disabled="!required.depositMoney" :min="required.depositMoney ? 1 : 0" v-decorator="['depositMoney', { rules: [{ required: required.depositMoney, message: '请输入定金金额' }] }]"/>
            </a-form-item>
          </a-col>-->
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="地区">
              <a-cascader
                autocomplete="new-password"
                :options="addressOptions"
                :showSearch="{ dataFilter }"
                placeholder="请选择地区"
                :fieldNames="{ label: 'value', value: 'value', children: 'children' }"
                changeOnSelect
                v-decorator="['stuArea', { rules: [{ required: false, message: '请选择地区' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="卡种">
              <span @click="selectCard()">
                <a-input
                  style="cursor: pointer;"
                  disabled
                  placeholder="请选择卡种"
                  v-decorator="['cardName', { rules: [{ required: true, message: '请选择卡种' }] }]"
                >
                  <a-icon slot="addonAfter" type="search" />
                </a-input>
                <a-input type="hidden" v-decorator="['stuCardId']" />
              </span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="是否为转卡学员">
              <a-select v-decorator="['transferCard', { rules: [{ required: true, message: '请选择是否为转卡学员' }] }]">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="卡信息">
              <span v-if="cardInfo.stuCardNo"> {{ cardInfo.stuCardNo }}/{{ cardInfo.danceName }}/<span v-html="cardInfo.payoff"></span> </span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="顾问">
              <span @click="getUser()">
                <a-input
                  style="cursor: pointer;"
                  disabled
                  placeholder="请选择顾问"
                  v-decorator="['orgUserAdviserName', { rules: [{ required: true, message: '请选择顾问' }] }]"
                >
                  <a-icon slot="addonAfter" type="search" />
                </a-input>
                <a-input type="hidden" v-decorator="['orgUserAdviserId']" />
              </span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="预定班次（日期+程度）">
              <a-input v-decorator="['scheduledShift', { rules: [{ required: true, message: '请输入预定班次（日期+程度）' }] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="住宿情况">
              <a-select v-decorator="['stay', { rules: [{ required: true, message: '请选择住宿情况' }] }]">
                <a-select-option value="A">住宿</a-select-option>
                <a-select-option value="B">不住宿</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="是否连报">
              <a-select v-decorator="['continuousReport', { rules: [{ required: true, message: '请选择是否连报' }] }]" @change="changeContinuousReport">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="性格">
              <a-select v-decorator="['character', { rules: [{ required: true, message: '请输入性格' }] }]">
                <a-select-option v-for="(option, index) in characterOptions" :key="index" :value="option">{{ option }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="连报详情">
              <a-input
                :disabled="!required.continuousReportDetail"
                v-decorator="['continuousReportDetail', { rules: [{ required: required.continuousReportDetail, message: '请输入连报详情' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="身份">
              <a-input v-decorator="['identity']" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="上课模式">
              <a-input v-decorator="['classMode', { rules: [{ required: true, message: '请输入上课模式' }] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="学跳舞目的">
              <a-input v-decorator="['objective', { rules: [{ required: true, message: '请输入学跳舞目的' }] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-bind="defaultLayout" label="备注">
              <a-input v-decorator="['remark']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider />
        <a-row :gutter="8">
          <a-col :md="12" :sm="24" :offset="6">
            <a-form-item v-bind="defaultLayout" label="接收分馆">
              <a-tree-select
                v-decorator="['orgDeptId', { rules: [{ required: true, message: '请选择接收分馆' }] }]"
                :treeDefaultExpandAll="true"
                allowClear
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="deptList"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- imodal -->
    <i-modal ref="modall" :multiple="false" userType="all" @getBackData="getUserBack" />

    <!--卡种-->
    <StudentCard ref="studentCard" @getBackData="getCardData" />
  </div>
</template>
<script>
import moment from 'moment'
import { IModal, StudentCard } from '@/components'
import { getSchoolList } from '@/api/education/card'
import { getStudentPhone } from '@/api/common'
import DISTRICTS from '@/tools/citydata'

const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 16
    }
  }
}
export default {
  components: {
    IModal,
    StudentCard
  },
  data() {
    return {
      modalTitle: '',
      modalVisible: false,
      modalLoading: false,

      defaultLayout,
      addressOptions: DISTRICTS,
      deptList: [],
      birthdayYear: '',
      birthdayMonth: '',
      birthdayDay: '',
      required: {
        depositMoney: true,
        continuousReportDetail: true
      },
      cardInfo: {},
      healthyOptions: ['一般', '良好', '好', '较差', '其他'],
      economicOptions: ['一般', '良好', '好', '较差', '其他'],
      characterOptions: ['活泼/开朗', '成熟/冷艳', '和蔼可亲', '温柔', '其他']
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.getALLDeptSchools()
  },
  methods: {
    stuPhoneChange() {
      this.$nextTick(() => {
        let stuPhone = this.form.getFieldValue('stuPhone')
        this.$verify.phone(null, stuPhone, this.getStudentInfo, 'edit')
      })
    },
    getStudentInfo(flag) {
      if (!flag) {
        let stuPhone = this.form.getFieldValue('stuPhone')
        getStudentPhone(stuPhone).then(res => {
          if (res.data) {
            let { student, adviser } = res.data
            let formValue = this.form.getFieldsValue()
            if (student) {
              formValue.name = student.stuName || ''
              formValue.sex = student.stuSex || ''
              formValue.birthday = student.stuBirthday || ''
              formValue.stuArea = student.stuArea?.split(',') || []
              if (formValue.birthday) {
                let birthday = formValue.birthday.split('-')
                this.birthdayYear = birthday[0]
                this.birthdayMonth = birthday[1]
                this.birthdayDay = birthday[2]
              }
            }
            if (adviser) {
              formValue.orgUserAdviserName = adviser.userName || ''
              formValue.orgUserAdviserId = adviser.id || ''
            }
            this.$nextTick(() => {
              this.form.setFieldsValue(formValue)
            })
          }
        })
      }
    },
    open(data) {
      if (data) {
        this.modalTitle = '编辑输送'
        this.$nextTick(() => {
          let birthday = moment(data.birthday)
          if (birthday.isValid()) {
            this.birthdayYear = birthday.format('YYYY')
            this.birthdayMonth = birthday.format('MM')
            this.birthdayDay = birthday.format('DD')
          } else {
            this.birthdayYear = ''
            this.birthdayMonth = ''
            this.birthdayDay = ''
          }
          this.setCardInfo(data)
          this.form.setFieldsValue({
            id: data.id,
            name: data.name,
            healthy: data.healthy,
            birthday: birthday.isValid() ? birthday.format('YYYY-MM-DD') : '',
            sex: data.sex,
            economic: data.economic,
            // deposit: data.deposit ? 1 : 0,
            // depositMoney: data.depositMoney,
            stuPhone: data.stuPhone,
            stuCardId: data.stuCardId,
            cardName: data.cardName,
            stuArea: data.stuArea ? data.stuArea.split(',') : [],
            transferCard: data.transferCard ? 1 : 0,
            orgUserAdviserName: data.adviser,
            orgUserAdviserId: data.adviserId,
            scheduledShift: data.scheduledShift,
            stay: data.stay,
            continuousReport: data.continuousReport ? 1 : 0,
            character: data.character,
            continuousReportDetail: data.continuousReportDetail,
            identity: data.identity,
            classMode: data.classMode,
            objective: data.objective,
            remark: data.remark,
            orgDeptId: data.inDeptId
          })

          // this.changeDeposit()
          this.changeContinuousReport()
        })
      } else {
        this.modalTitle = '新增输送'
      }
      this.modalVisible = true
    },
    close() {
      this.birthdayYear = ''
      this.birthdayMonth = ''
      this.birthdayDay = ''
      this.cardInfo = {}
      this.form.resetFields()
      this.modalVisible = false
    },
    handleOk() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let data = JSON.parse(JSON.stringify(values))
          data.stuArea = data.stuArea && data.stuArea.join(',')
          data.age = new Date().getFullYear() - Number(this.birthdayYear)

          this.$emit('ok', data)
        }
      })
    },
    handleCancel() {
      this.close()
      this.$emit('cancel')
    },

    dataFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    changeBirthday(event) {
      this.$nextTick(() => {
        let { birthdayYear, birthdayMonth, birthdayDay } = this
        if (this.$refs.birthdayYear.$el === event.currentTarget) {
          if (birthdayYear.length > 4) this.birthdayYear = birthdayYear = birthdayYear.slice(0, 4)
          if (birthdayYear.length === 4) this.$refs.birthdayMonth.focus()
        }
        if (this.$refs.birthdayMonth.$el === event.currentTarget) {
          if (birthdayMonth.length > 2) this.birthdayMonth = birthdayMonth = birthdayMonth.slice(0, 2)
          if (birthdayMonth.length === 2) this.$refs.birthdayDay.focus()
        }
        if (this.$refs.birthdayDay.$el === event.currentTarget) {
          if (birthdayDay.length > 2) this.birthdayDay = birthdayDay = birthdayDay.slice(0, 2)
        }

        let month = birthdayMonth.length === 1 ? '0' + birthdayMonth : birthdayMonth
        let day = birthdayDay.length === 1 ? '0' + birthdayDay : birthdayDay
        this.form.setFieldsValue({
          birthday: `${birthdayYear}-${month}-${day}`
        })
        this.form.validateFields(['birthday'])
      })
    },
    verifyBirthDate(rule, value, callback) {
      const { birthDate } = this.$verify
      const isInt = /^[0-9]*$/
      let { birthdayYear, birthdayMonth, birthdayDay } = this
      if (birthdayYear && birthdayMonth && birthdayDay) {
        if (isInt.test(birthdayYear) && isInt.test(birthdayMonth) && isInt.test(birthdayDay)) {
          birthdayMonth = birthdayMonth.length === 1 ? '0' + birthdayMonth : birthdayMonth
          birthdayDay = birthdayDay.length === 1 ? '0' + birthdayDay : birthdayDay
          birthDate(rule, `${birthdayYear}${birthdayMonth}${birthdayDay}`, callback, true)
        } else {
          callback('出生年月日格式错误')
        }
      } else {
        callback('请输入出生年月日')
      }
    },
    verifyPhone(rule, value, callback) {
      this.$verify.phone(rule, value, callback, 'edit')
    },
    // 顾问
    getUser() {
      this.$refs.modall.open()
    },
    getUserBack(data, type) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ orgUserAdviserId: data.id, orgUserAdviserName: data.name })
      })
    },
    // 查询所有分馆
    getALLDeptSchools() {
      getSchoolList().then(res => {
        this.deptList = res.data
        this.rewriteDataTree(this.deptList)
      })
    },
    rewriteDataTree(data, parent) {
      data.forEach((item, index) => {
        if (item.title && item.key && item.value) {
          return false
        }
        item.title = item.name || item.deptName
        item.value = item.id
        item.disabled = !!!parent
        if (item.disabled && this.$store.getters.school_id) {
          item.disabled = item.id === this.$store.getters.school_id
        }
        if (item.children && item.children.length > 0) {
          this.rewriteDataTree(item.children, 'parent')
        }
      })
    },
    changeDeposit() {
      this.$nextTick(() => {
        let deposit = this.form.getFieldValue('deposit')
        if (deposit === 1) {
          this.required.depositMoney = true
          this.form.setFieldsValue({
            depositMoney: undefined
          })
        } else {
          this.required.depositMoney = false
          this.form.setFieldsValue({
            depositMoney: 0
          })
        }
      })
    },
    changeContinuousReport() {
      this.$nextTick(() => {
        let continuousReport = this.form.getFieldValue('continuousReport')
        if (continuousReport === 1) {
          this.required.continuousReportDetail = true
        } else {
          this.required.continuousReportDetail = false
          this.form.setFieldsValue({
            continuousReportDetail: undefined
          })
        }
      })
    },
    selectCard() {
      this.form.validateFields(['stuPhone'], (err, values) => {
        if (!err) {
          this.$refs.studentCard.open({ stuInfo: values.stuPhone })
        }
      })
    },
    getCardData(data) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          stuCardId: data.id,
          cardName: data.cardName,
          orgUserAdviserId: data.adviserId,
          orgUserAdviserName: data.adviserName
        })
        this.setCardInfo(data)
      })
    },
    setCardInfo(data) {
      let payoff = ''
      if (data.payoff) {
        payoff = '结清'
      } else if (!data.payoff && (data.status == 'A' || data.status == 'B' || data.status == 'C')) {
        payoff = `<span style="color: red">${(data.paidPrice - data.totalPrice).toFixed(2) || 0}</span>`
      }
      this.cardInfo = {
        stuCardNo: data.stuCardNo,
        danceName: data.danceName,
        payoff
      }
    }
  }
}
</script>

<style scoped lang="less">
.space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
