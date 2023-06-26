<template>
  <div>
    <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 15 } }" :label="item.label" :prop="item.key" :required="item.required">
      <a-select v-model="data" style="width: 100%" placeholder="请选择" :option-label-prop="item.multiple ? 'label' : ''" :allowClear="true">
        <a-select-option :value="todo.value" v-for="(todo, inx) in item.dataSource" :key="inx">
          {{ todo.name }}
        </a-select-option>
      </a-select>
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
    //   type: String,
    //   default: ''
    // }
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal) {
        this.data = this.item.defaultValue
      }
    },
    // value() {
    //   this.data = this.value
    // },
    data() {
      console.log(this.data)
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
