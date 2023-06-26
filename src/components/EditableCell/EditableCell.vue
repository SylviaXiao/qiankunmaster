<template>
  <div class="edit-cell" :inputType="inputType" @change="changeType" :selectList='selectList'>
    <slot name="edit"></slot>
    <slot name="text"></slot>
  </div>
</template>

<script>
  export default {
    name: 'EditableCell',
    props: {
      inputType: {
        type: String,
        default: 'input'
      },
      selectList: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        inputVal: ''
      }
    },
    created() {
      console.log(this.inputType)
    },
    methods: {
      checkType() {
        if (this.type == 'input') {

        }
      },

      changeType() {

      }
    }
  }
</script>

<style scoped lang=less>

</style>