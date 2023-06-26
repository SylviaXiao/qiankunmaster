<template>
  <div class="grading-wrapper_print">
    <div v-if="type == '中国舞'">
      <ChineseDanceChangSha ref="ChineseDanceChangSha" v-if="dept == '长沙'" v-bind="$props"></ChineseDanceChangSha>
      <ChineseDance ref="ChineseDance" v-else v-bind="$props"></ChineseDance>
    </div>
    <div v-else>
      <LatinDance ref="LatinDance" v-bind="$props"></LatinDance>
    </div>
  </div>
</template>
<script>
import ChineseDance from './ChineseDance'
import ChineseDanceChangSha from './ChineseDanceChangSha'
import LatinDance from './LatinDance'

export default {
  props: {
    printRecord: {
      type: Object,
      default: {}
    },
    printInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      type: '中国舞',
      dept: '长沙'
    }
  },
  watch: {
    printRecord: {
      handler: function(val) {
        console.log(555, val)
      },
      immediate: true,
      deep: true
    },
    printInfo: {
      handler: function(val) {
        if (val) {
          this.dept = val.cerAreaName
          this.type = val.danceName
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: { ChineseDance, ChineseDanceChangSha, LatinDance },
  methods: {
    print() {
      let that = this
      console.log(this.dept)
      console.log(this.type)
      this.$nextTick(() => {
        if (that.type == '中国舞') {
          if (that.dept == '长沙') {
            that.$refs.ChineseDanceChangSha.$refs.printBtn.$el.click()
          } else {
            that.$refs.ChineseDance.print()
          }
        } else {
          that.$refs.LatinDance.$refs.printBtn.$el.click()
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
