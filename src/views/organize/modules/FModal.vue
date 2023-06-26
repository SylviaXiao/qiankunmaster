<template>
  <div>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="modalTitle"
             :visible="visible"
             okText="okText"
             cancelText="cancelText"
             @ok="handleOk"
             @cancel="handleCancel">

    </a-modal>
  </div>
</template>

<script>
  export default {
    name: 'FModal',
    props: {
      modalTitle: {
        type: String,
        default: '新增or编辑'
      },
      // visible: {
      //   type: Boolean,
      //   default: false
      // },
      okText: {
        type: String,
        default: '保存'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      ok:{
        type:Object,
        default:function() {
        }
      }
    },
    data() {
      return {
        visible:false
      }
    },
    methods: {
      open() {
        this.visible = true
      },
      close () {
        this.$emit('close')
        this.visible = false
      },
      handleOk(){
      },
      handleCancel(){
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>
