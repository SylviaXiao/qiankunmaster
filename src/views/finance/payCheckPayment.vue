<template>
  <div class="payCheckPayment">
    <check-payment :income="false"></check-payment>
  </div>
</template>

<script>
  import checkPayment from './checkPayment'

  export default {
    name: 'payCheckPayment',
    components: {
      checkPayment
    }
  }
</script>

<style scoped>

</style>