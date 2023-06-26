<template>
  <div class="pay-detailed">
    <!-- 因为组件复用，暂时兼容 -->
    <detailed :income="false" :showTable="true" :hideSourceDetailList="true"></detailed>
  </div>
</template>

<script>
import detailed from './detailed'

export default {
  name: 'payDetailed',
  components: {
    detailed
  }
}
</script>

<style scoped></style>
