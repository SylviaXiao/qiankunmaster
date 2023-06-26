<template>
  <div class="modal-wrapper">
    <a-modal
      :maskClosable="false"
      :destroyOnClose="true"
      :title="title"
      :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }"
      :visible="visible"
      :confirmLoading="loading"
      :width="setWidth"
      @ok="handleOk"
      @cancel="close"
    >
      <a-spin tip="正在加载中..." :spinning="spinning">
        <slot></slot>
      </a-spin>
      <template slot="footer">
        <template v-if="showFooter">
          <a-button @click.stop="close">取消</a-button>
          <a-button type="primary" @click.stop="handleOk">提交</a-button>
        </template>
        <template v-else>{{ null }}</template>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: { type: String, default: 'modal' },
    openLoading: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    size: {
      type: String,
      default: 'middle',
      validator: value => {
        return value === 'small' || value === 'middle' || value === 'large'
      }
    }
  },
  computed: {
    setWidth() {
      const { size } = this
      if (size === 'small') {
        return '600px'
      }
      if (size === 'middle') {
        return '800px'
      }
      if (size === 'large') {
        return '1000px'
      }
      return '600px'
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      spinning: false
    }
  },
  methods: {
    /**
     * @method initModal 初始化modal的函数
     */
    initModal() {
      if (this.openLoading) {
        this.spinning = true
      }

      this.$emit('initValue')
    },
    /**
     * @method open modal的打开函数
     * @param visible 控制modal打开的param
     * @param initModal 初始化modal的函数
     */
    open() {
      this.visible = true
      this.initModal()
    },
    /**
     * @method close modal 关闭的函数
     * @param visible 控制modal打开的param
     */
    close() {
      this.$emit('closeModal')
      this.loading = false
      this.spinning = false
      this.visible = false
    },

    /**
     *@method handleOk 确定按钮的函数
     */
    handleOk() {
      if (this.openLoading) {
        this.loading = true
      }
      this.$emit('ok')
    }
  }
}
</script>

<style lang="less" scoped></style>
