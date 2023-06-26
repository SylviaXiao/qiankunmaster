<template>
  <div class="footer">
    <div class="copyright"><a-icon type="copyright" /> {{ year }} <span>管理系统</span></div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data() {
    return {
      year: new Date().getFullYear()
    }
  },
  created() {
    //console.log(this.year)
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 10px 0 10px;
  text-align: center;
  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
