<template>
  <div class="test-address-wrapper">
    <div>
      <img src="~@/assets/record/leaf2.png" class="icon1 leaf21"  />
      <img src="~@/assets/record/leaf2.png" class="icon1 leaf22"  />
    </div>
    <img src="~@/assets/record/text.png" class="icon" style="padding:0;width: 74%;margin-left:19%;position: relative;"/>
    <div class="cert_info">
      <div style="padding: 30px 0 0 0;font-size: 35px;">问卷调查</div>
      <div style="padding: 10px 0  0 0;font-size: 20px;">．学员档案调查<span style="padding: 0 0 0 9px;">．</span></div>
      <img src="~@/assets/record/complete.png" class="icon" style="padding:40px 0;width: 110px;" />
      <div style="font-size: 26px;">提交成功</div>
      <div style="padding: 18px 0 0 0;font-size: 16px;">非常感谢您宝贵的意见</div>
    </div>
    <div>
      <img src="~@/assets/record/leaf1.png" class="icon1 leaf11"  />
      <img src="~@/assets/record/leaf1.png" class="icon1 leaf12"  />
      <img src="~@/assets/record/leaf1.png" class="icon1 leaf13"  />
      <img src="~@/assets/record/leaf1.png" class="icon1 leaf14"  />
    </div>
  </div>
</template>
<script>
export default {
  components: {  },
  props: {
  },
  data() {
    return {

    }
  },
  computed: {
  },
  beforeCreate() {
  },
  created() {
  },
  mounted() {},
  methods: {
  }
}
</script>
<style scoped lang="less">
.test-address-wrapper{
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: scroll;
  background-color: #0062e3;
  .cert_info{
    height: 72%;
    text-align: center;
    background: rgba(255, 255, 255 , 84%);
    width: 94%;
    border-radius: 15px;
    position: absolute;
    left: 3%;
    top: 22%;
    color: #0062e3;
    letter-spacing: 1px;
  }
}
.icon1{
  position: fixed;
  width: 120px;
}
.leaf11{
  transform: rotate(-69deg);
  width: 180px;
  bottom: -41px;
  left: -60px;
}
.leaf12{
  transform: rotate(-30deg);
  width: 143px;
  bottom: -32px;
}
.leaf13{
  transform: rotate(-90deg);
  width: 200px;
  bottom: -52px;
  right: 60px;
}
.leaf14{
  transform: rotate(-10deg);
  width: 290px;
  bottom: -52px;
  right: -84px;
}
.leaf21{
  width: 184px;
  left: -24px;
  top: -10px;
  height: 245px;
}
.leaf22{
  transform: rotateY(180deg);
  width: 184px;
  right: -34px;
  top: 50px;
  height: 245px;
}

</style>
