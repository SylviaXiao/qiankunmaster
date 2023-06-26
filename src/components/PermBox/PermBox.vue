<template>
 <span class='container'>
    <span :text="text" :perm="perm" v-if="superAdmin||handlePerm" class="perm">
<!--    <slot name="perm" v-if="superAdmin||btnPerm[perm]"></slot>-->
      <!--    <slot name="switchText" v-else>{{text}}</slot>-->
      <slot></slot>
  </span>
   <span v-else>{{text}}</span>
 </span>
</template>

<script>
  import { hasBtnPerm } from '@/tools'

  export default {
    name: 'PermBox',
    props: {
      text: {
        type: String,
        default: ''
      },
      perm: {
        type: String,
        default: ''
      }
    },
    computed: {
      handlePerm() {
        return this.checkPerm(this.perm)
      }
    },
    data() {
      return {
        switchBtn: this.superAdmin ? false : true,
        btnIsShow: true
      }
    },
    created() {
      hasBtnPerm(this).then()
    },
    methods: {
      checkPerm(str) {
        if(str.indexOf('||') !== -1) {
          let permArr = str.split('||')
          return permArr.some(item => {
            return this.btnPerm[item.trim()]
          })
        }
        // 有"&&"的情况
        if(str.indexOf('&&') !== -1) {
          let permArr = str.split('&&')
          return permArr.every(item => {
            return this.btnPerm[item.trim()]
          })
        }
        // 什么都没有的情况
        if(str.indexOf('||') === -1 && str.indexOf('&&') === -1) {
          let permStr = str
          return !!this.btnPerm[permStr]
        }
      }
    }
  }
</script>

<style scoped lang=less>
  .container {
    .perm {
      > a {
        padding: 0 5px;
      }
    }
  }

</style>
