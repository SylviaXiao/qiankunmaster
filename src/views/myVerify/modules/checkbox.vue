<template>
  <div>
    <a-form-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 15 } }" :label="item.label" :prop="item.key" :required="item.required">
      <a-checkbox-group v-model="data" style="width: 100%;">
        <span v-for="(todo, inx) in item.dataSource" :key="inx">
          <a-checkbox :value="todo.value" style="margin-bottom:10px;">{{ todo.name }}</a-checkbox>
        </span>
      </a-checkbox-group>
    </a-form-item>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: []
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal) {
        this.data = this.item.defaultValue
      }
    },
    data() {
      this.$emit('input', this.data)
    }
  },
}
</script>
<style lang="less" scoped></style>
