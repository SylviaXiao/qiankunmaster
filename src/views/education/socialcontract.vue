<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane  key="1" :tab="`社保办理(${info.transactNum})`" v-if="handlePermBox('salary:socialSecurity:view')">
        <SocialApply ref="SocialApply" @refresh='init'/>
      </a-tab-pane>
      <a-tab-pane  key="2" :tab="`社保停办(${info.stopNum})`" v-if="handlePermBox('salary:socialSecurity:view')">
        <SocialStop ref="SocialStop"  @refresh='init'/>
      </a-tab-pane>
      <a-tab-pane  key="3" :tab="`合同续签(${info.renewalNum})`" v-if="handlePermBox('salary:socialSecurity:view')">
        <SocialContinue ref="SocialContinue"  @refresh='init'/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import SocialApply from './socialContract/socialApply'
import SocialStop from './socialContract/socialStop'
import SocialContinue from './socialContract/socialContinue'

import {socialSecurityUntreatedNum}  from '@/api/education'
export default {
  name: 'socialcontract',
  data() {
    return {
      info:{
        renewalNum:0,
        stopNum:0,
        transactNum:0
      }
    }
  },
  components: {
    PermBox,
    SocialApply,SocialStop,SocialContinue
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      socialSecurityUntreatedNum().then(res=>{
        this.info=res.data
      })
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
@import '~@/assets/style/index';
</style>
