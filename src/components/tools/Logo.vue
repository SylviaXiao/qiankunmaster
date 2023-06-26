<template>
  <div class="logo">
    <router-link :to="{ name: 'index' }">
      <!-- <img src="~@/assets/small_logo.png" class="logo" alt="logo" style="padding:0;" /> -->
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  components: {},
  props: {
    title: {
      type: String,
      default: 'ERP',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
<style lang="less" scoped>
.sider.light .logo {
  background: @primary-color;
  box-shadow: 0px 0px 0 0 @primary-color;
  padding-left: 0;
  text-align: center;
}
.sider .logo h1 {
  color: #fff !important;
  font-size: 28px;
  margin: 0;
  font-weight: 500;
}
</style>
