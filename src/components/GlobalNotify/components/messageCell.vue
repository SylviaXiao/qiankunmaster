<template>
  <div class="message-cell">
    <div class="text-align-right" :style="{ fontSize: '12px' }">{{ item.createDate }}</div>
    <div class="mt-8 text-weight-b">{{ content }}</div>
    <div class="mt-8" v-if="item.type!=='B'">私教老师：{{ item.teacherName }}</div>
    <div v-if="isUnread" class="checkbox-wrap"><span class="mr-8">此条已读</span> <a-checkbox :checked="checked" @change="emitChange" /></div>
    <a-divider />
  </div>
</template>
<script>
import { columnsReg } from '@/views/education/class/class'

export default {
  // functional: true,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      checked: false
    }
  },
  computed: {
    isUnread() {
      return this.item.status === 'A'
    },
    content() {
      if(this.item.type==='B'){
        let order =this.item.order===1?15:this.item.order===2?14:this.item.order===3?13:this.item.order===4?7:this.item.order===5?3:0
        return `${this.item.content} 距离预计上传附件时间还有${order}天，请及时跟进处理~`
      }
      return `${this.item.content} 临近第${this.item.order}次考核时间，可以开始准备啦`
    }
  },
  mounted() {},
  methods: {
    emitChange(e) {
      this.checked = !this.checked
      this.$emit('change', e)
      setTimeout(() => {
        this.checked = false
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.message-cell {
  width: 320px;
  padding: 0 8px;
}

.checkbox-wrap {
  display: flex;
  justify-content: flex-end;
}
</style>
