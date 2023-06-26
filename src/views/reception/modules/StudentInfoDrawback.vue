<template>
  <div class="drawback-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      width="600px"
      :visible="visibleDrawback"
      @ok="submitDrawback"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :title="`${showChange ? '转班' : '退班'}`"
    >
      <a-form :form="drawbackForm">
        <div class="return-in-class">
          <a-row>
            <a-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
              <a-form-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }" label="班级">
                <span>{{ record.className }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" v-if="!showChange">
              <a-form-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }" label="扣除金额">
                <a-input-number style="width: 100%;" :formatter="value => `￥ ${value}`" v-decorator="['deductPrice']" />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- deductPrice -->
          <a-row>
            <a-col v-if="showChange" :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
              <a-form-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }" label="转入班级">
                <SearchInput
                  ref="searchInput"
                  :cardValues="{ value: { danceId: record.danceId, typeId: record.typeId, cardTypeId: '' } }"
                  :disabled="true"
                  :index="0"
                  :allowClear="true"
                  :initInput="true"
                  type="class"
                  @select="getCardBackValue(record, $event)"
                  placeholder="不填写此项即为退班"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
              <a-form-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }" label="备注">
                <a-textarea placeholder="请输入备注信息" :rows="2" v-decorator="['logRemark', { rules: [{ required: true, message: '请输入备注信息' }] }]" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { changeCardClass } from '@/api/recep'
import { SearchInput } from '@/components'
export default {
  props: {
    record: {
      type: Object,
      default: () => {}
    },
    showChange: {
      type: Boolean,
      default: true
    }
  },
  components: {
    SearchInput
  },
  watch: {
    visibleDrawback(nv) {
      if (nv) {
        this.$nextTick().then(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.init()
          }
          this.drawbackForm.resetFields()
        })
      }
    }
  },
  data() {
    return {
      visibleDrawback: false,
      confirmLoading: false
    }
  },
  beforeCreate() {
    this.drawbackForm = this.$form.createForm(this)
  },
  methods: {
    showModal() {
      this.visibleDrawback = true
      this.newClassId = ''
    },
    handleCancel() {
      this.visibleDrawback = false
    },
    getCardBackValue(record, value) {
      this.newClassId = value.id
    },
    submitDrawback() {
      const {
        drawbackForm: { validateFields },
        record: { id },
        $notification
      } = this
      validateFields().then(value => {
        value.deductPrice = value.deductPrice ? value.deductPrice : 0
        const returnParams = Object.assign({}, { stuCardId: id }, value, { newClassId: this.newClassId })
        if (returnParams.deductPrice && returnParams.deductPrice > this.record.paidPrice) {
          return this.$notification['error']({
            message: '系统通知',
            description: '扣除金额不能大于实收金额!'
          })
        }
        changeCardClass(returnParams)
          .then(res => {
            $notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.handleCancel()
            this.$emit('refund')
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.confirmLoading = false))
      })
    }
  }
}
</script>

<style scoped lang="less">
.number-ipt {
  width: 100%;
}
</style>
