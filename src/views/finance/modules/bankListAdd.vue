<template>
  <div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="新增/修改开户行"
      v-model="modal"
      width="900px"
      okText="保存"
      cancelText="取消"
      @ok="submit"
      :confirmLoading="isloading"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="开户行" required prop="card">
              <a-input v-model="form.card" style="width:50%"> </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" :min="6" :maxLength="6" label="卡号前6位" required prop="cardPre">
              <a-input v-model="form.cardPre" style="width:50%"> </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }"
              label="状态"
              required
              prop="status"
              style="display:flex;align-items: center;"
            >
              <a-radio-group v-model="form.status" style="display:flex;">
                <a-radio value="A">启用</a-radio>
                <a-radio value="B">禁用</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { listSalConfig, saveSalConfig } from '@/api/finance/finance'
import { getSchoolList } from '@/api/education/card'

export default {
  data() {
    let validatePay = (rule, value, callback) => {
      return callback(new Error('请填写完整'))
      for (let i = 0; i < this.form.basePay.length; i++) {
        for (let key in this.form.basePay[i]) {
          if ((this.form.basePay[i][key] === '' || this.form.basePay[i][key] === null) && key != 'applicablSal') {
          }
        }
      }
      callback()
    }
    let validateDeducts = (rule, value, callback) => {
      return callback(new Error('请填写完整'))
      for (let i = 0; i < this.form.deducts.length; i++) {
        for (let key in this.form.deducts[i]) {
          if (this.form.deducts[i][key] === '' || this.form.deducts[i][key] === null) {
          }
        }
      }
      callback()
    }
    return {
      rules: {
        card: [{ required: true, validator: validatePay, trigger: 'blur' }],
        cardPre: [{ required: true, validator: validateDeducts, trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      form: {
        card: '',
        cardPre: '',
        status: undefined
      },
      modal: false,
      isloading: false
    }
  },
  watch: {
    modal(n, o) {
      if (!n) {
        console.log(n)
        // this.$refs.ruleForm.clearValidate()
        // this.id = null
        // this.editShow = false
        // this.form = {
        //   performanceType: undefined,
        //   deptIds: undefined,
        //   job: '',
        //   basePay: [{ type: '', applicablSal: '', pay: '', types: [{ id: 1, name: '试用' }, { id: 2, name: '正式' }] }],
        //   payFloor: '',
        //   morAllowance: '',
        //   subType: 'B',
        //   deducts: [
        //     {
        //       startSection: null,
        //       endSection: null,
        //       rate: ''
        //     }
        //   ]
        // }
      }
    }
  },

  methods: {
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isloading = true
          let params = {
            card: this.form.card,
            cardPre: this.form.cardPre,
            status: this.form.status
          }
          saveSalConfig(params)
            .then(res => {
              if (res.code === 200) {
                this.modal = false
                this.$emit('update')
              }
            })
            .finally((this.isloading = false))
        }
      })
    },
    async open(record) {
      console.log(1, record)
      if (record) {
        let { card, cardPre, status } = record
        this.card = card
        this.form.cardPre = cardPre
        this.form.status = status
      }
      this.modal = true
    }
  }
}
</script>
<style lang="less" scoped>
.icon {
  color: #1890ff;
  font-size: 16px;
}
</style>
