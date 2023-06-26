<template>
  <div>
    <a-button :btn-type="btnType" v-if="btnPerm[btnType]" :class='className'>
      <slot></slot>
    </a-button>
  </div>
</template>

<script>
  import { hasBtnPerm } from '@/tools'

  export default {
    name: 'permBtn',
    props: {
      btnType: {
        type: String,
        default: ''
      },
      className: {
        type: String,
        default: ''
      }

    },
    data() {
      return {}
    },
    created() {
      hasBtnPerm(this).then()
    },
    methods: {}
  }
</script>

<style scoped lang=less>
  @import "../btn";

</style>
