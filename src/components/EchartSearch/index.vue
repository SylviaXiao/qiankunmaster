<template>
  <div>
    <!-- <a-row> -->
      <a-form-model :model="form">
        <!-- <a-col span="6"> -->
          <div style="display:flex;flex-wrap: wrap;">
          <component :is="item.type" v-model="item.key" :item="item" v-for="(item, index) in searchParams" :key="index" @resetParams="$emit('resetParams')" />
          </div>
        <!-- </a-col> -->
      </a-form-model>
    <!-- </a-row> -->
  </div>
</template>

<script>
// import { getSchoolList } from '@/api/education/card'
import dateAndSelect from './modules/dateAndSelect'
import treeSelect from './modules/treeSelect'
import date from './modules/date'
export default {
  data() {
    return {
      form: {},
      type: 'ChartLine'
    }
  },
  props: {
    searchParams: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    searchParams: {
      deep: true,
      handler() {
        let obj = {}
        this.searchParams.forEach(item => {
          if (item[item.key] || item[item.selectKey]) {
            if (item.key.includes('Date')) {
              this.$set(obj, `start${item.key}`, this.$tools.tailor.getDate(item[item.key][0]))
              this.$set(obj, `end${item.key}`, this.$tools.tailor.getDate(item[item.key][1]))
              item[item.selectKey] && this.$set(obj, item.selectKey, item[item.selectKey])
            } else if(item.key.includes('Month')) {
              this.$set(obj, `start${item.key}`, this.$tools.tailor.getMonth(item[item.key][0]))
              this.$set(obj, `end${item.key}`, this.$tools.tailor.getMonth(item[item.key][1]))
            } {
              item[item.key] && this.$set(obj, item.key, item[item.key])
            }
          }
        })
        this.$emit('searchSubmit', obj)
        console.log(this.searchParams)
      }
    }
  },
  components: {
    treeSelect,
    dateAndSelect,
    date
  },

  computed: {},

  created() {},

  methods: {
    changeType(type) {
      this.type = type
      this.$emit('changeChartType', type)
    }
  }
}
</script>
<style lang="less" scoped>
.icon {
  font-size: 22px;
}
.active {
  color: #1890ff;
}
.contrast {
  line-height: 40px;
  color: #1890ff;
  cursor: pointer;
}
// style=""
</style>
