<template>
  <div class="stuCardChange-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="激活"
      :visible="visible"
      @ok="submit"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item v-bind="defaultLayout" label="激活金额">
          <a-input
            placeholder="请输入金额"
            v-decorator="[
              'price',
              {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    type: 'number',
                    transform(value) {
                      if (value) {
                        return Number(value)
                      }
                    },
                    message: '请输入正确的金额'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item v-bind="defaultLayout" label="备注">
          <a-textarea
            placeholder="请输入备注"
            :rows="2"
            v-decorator="['remark', { rules: [{ required: true, message: '请输入备注' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { activeStuCard } from '@/api/recep'
const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 12
    }
  }
}
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      defaultLayout
    }
  },
  props: {
    record: Object,
    default: () => {}
  },
  watch: {
    visibleCard(nv) {
      if (nv) {
        this.$nextTick(() => {
          this.form.resetFields()
          this.classIdArr = []
          this.$refs.uploadSth.reset()
        })
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    openModal() {
      this.visible = true
      this._resetForm()
    },
    submit() {
      this.form
        .validateFields()
        .then(data => {
          this.activeCardBtn(data)
        })
        .catch(err => {
          console.error(err)
        })
    },
    //激活按钮
    activeCardBtn(data) {
      let _this = this
      let params = {
        price: data.price,
        remark: data.remark,
        stuCardId: this.record.id,
        status: 'B'
      }
      this.$confirm({
        title: '系统提示',
        content: '确认要激活吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this._activeApi(params)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    _activeApi(params) {
      activeStuCard(params)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '已成功激活!'
            })
            this.$emit('refresh')
            this.handleCancel()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    _resetForm() {
      this.form.resetFields()
    }
  }
}
</script>

<style scoped lang="less"></style>
