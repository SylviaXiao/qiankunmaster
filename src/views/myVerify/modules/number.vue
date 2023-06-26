<!--  -->
<template>
  <div>
    <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 15 } }" :label="item.label" :prop="item.key" :required="item.required">
      <a-input-number v-model="data" style="width: 100%"> </a-input-number>
    </a-form-item>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: ''
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    // value: {
    //   type: Number,
    //   default: 0
    // }
  },
  watch: {
    item: {
      immediate: true,
　　　　handler(newVal) {
　　　　　　this.data = this.item.defaultValue
　　　　}
    },
//     value: {
//       immediate: true,
// 　　　　handler(newVal) {
// 　　　　　　this.data = this.value
// 　　　　}
      
//     },
    data() {
      this.$emit('input', this.data)
    }
  },

  components: {},

  computed: {},

  created() {},

  methods: {}
}
</script>
<style lang="less" scoped></style>
