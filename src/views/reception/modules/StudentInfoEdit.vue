<template>
  <div class="drawback-wrapper">
    <a-modal
      title="修改"
      :maskClosable="$store.state.modalMaskClickEnable"
      width="1000px"
      :visible="visibleDrawback"
      @ok="onSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="状态" prop="status">
          <a-select v-model="form.status" placeholder="请选择状态">
            <a-select-option v-for="item in staticArr" :key="item.value" :value="item.value">
              {{ item.string }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="办卡日期" required prop="createDate">
          <a-date-picker v-model="form.createDate" type="date" valueFormat="YYYY-MM-DD" placeholder="请选择办卡日期" style="width: 100%;" />
        </a-form-model-item>
        <a-form-model-item label="激活日期" prop="startDate">
          <a-date-picker v-model="form.startDate" type="date" valueFormat="YYYY-MM-DD" placeholder="请选择激活日期" style="width: 100%;" />
        </a-form-model-item>
        <a-form-model-item label="截止日期" prop="endDate">
          <a-date-picker v-model="form.endDate" type="date" valueFormat="YYYY-MM-DD" placeholder="请选择截止日期" style="width: 100%;" />
        </a-form-model-item>
        <a-form-model-item label="实收金额" prop="paidPrice">
          <a-input-number id="paidPrice" v-model="form.paidPrice" />
        </a-form-model-item>
        <a-form-model-item label="应收金额" prop="totalPrice">
          <a-input-number id="totalPrice" v-model="form.totalPrice" />
        </a-form-model-item>
        <a-form-model-item label="是否缴清" prop="payoff">
          <a-radio-group v-model="form.payoff">
            <a-radio :value="true">
              是
            </a-radio>
            <a-radio :value="false">
              否
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="使用次数" prop="usedCount">
          <a-input-number id="usedCount" v-model="form.usedCount" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { updateStuCard } from '@/api/student'

export default {
  props: {
    record: {
      type: Object,
      default: () => {}
    }
  },
  components: {},

  watch: {
    visibleDrawback(nv) {
      if (nv) {
        // this.init()
        // this.$nextTick().then(() => {
        //   this.drawbackForm.resetFields()
        //   this.$refs.belongsTable ? this.$refs.belongsTable.initBelongs() : ''
        // })
      }
    }
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        id: '',
        status: '',
        createDate: '',
        startDate: '',
        endDate: '',
        paidPrice: '',
        totalPrice: '',
        payoff: '',
        usedCount: ''
      },
      rules: {
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        createDate: [{ required: true, message: '请选择办卡日期', trigger: 'change' }],
        // startDate: [{ required: true, message: '请选择激活日期', trigger: 'change' }],
        // endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
        paidPrice: [{ required: true, message: '请输入实收金额', trigger: 'blur' }],
        totalPrice: [{ required: true, message: '请输入应收金额', trigger: 'blur' }],
        payoff: [{ required: true, message: '请选择是否缴清', trigger: 'change' }]
      },
      staticArr: [
        {
          string: '未使用',
          value: 'A'
        },
        {
          string: '使用中',
          value: 'B'
        },
        {
          string: '停课',
          value: 'C'
        },
        {
          string: '退卡',
          value: 'D'
        },
        {
          string: '结业',
          value: 'E'
        },
        {
          string: '撤销',
          value: 'F'
        }
      ],
      visibleDrawback: false,
      confirmLoading: false
    }
  },
  computed: {},
  beforeCreate() {},
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.form.createDate = moment(this.form.createDate).format('YYYY-MM-DD hh:mm:ss')
          updateStuCard(this.form).then(res => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.handleCancel()
              this.$emit('refund')
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    init() {},
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    showModal() {
      this.visibleDrawback = true
      this.$nextTick(() => {
        this.backData()
      })
    },
    backData() {
      let { id, status, createDate, startDate, endDate, paidPrice, totalPrice, payoff, usedCount } = this.record
      this.form = {
        id: id || null,
        status: status || '',
        createDate: createDate || null,
        startDate: startDate || null,
        endDate: endDate || null,
        paidPrice: paidPrice || 0,
        totalPrice: totalPrice || 0,
        payoff: payoff,
        usedCount: usedCount || 0
      }
    },
    handleCancel() {
      this.visibleDrawback = false
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
</style>
