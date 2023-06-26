<template>
  <a-form-model-item :label="item.label" style="display: flex;margin-left: 20px;">
    <a-range-picker
      :allowClear="item.allowClear"
      :disabled-date="item.disabledDate ? disabledDate : item.disabledMonth ? disabledMonth : null"
      style="width:220px;"
      @panelChange="handlePanelChange2"
      :format="item.format"
      v-model="item[item.key]"
      :mode="item.mode"
      @openChange="openChange"
    />
    <!-- :showTime="item.format === 'YY-MM-DD hh:mm:ss' || item.format === 'YYYY-MM'" -->
  </a-form-model-item>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      // defaultSelectDate: {
      //   startDate: moment()
      //     .startOf('month')
      //     .subtract(7, 'days'),
      //   endDate: moment()
      //     .endOf('day')
      //     .subtract(0, 'days')
      // },
      //上月
      defaultLastMonth:{
        startDate:moment().subtract(1,'months').startOf('month'),
        endDate:moment().subtract(1,'months').endOf('month')
      },
      //当月
      defaultSelectMonth: {
        startDate: moment().startOf('month'),
        endDate: moment()
          .endOf('day')
          .subtract(0, 'days')
      },
      //昨天
      defaultYesterday: {
        startDate: moment().subtract(1, 'days'),
        endDate: moment().subtract(1, 'days')
      },
      //上周
      defaultLastWeek: {
        startDate: moment(
          moment()
            .week(moment().week() - 1)
            .startOf('week')
            .add(0, 'days')
            .valueOf()
        ),
        endDate: moment(
          moment()
            .week(moment().week() - 1)
            .endOf('week')
            .add(0, 'days')
            .valueOf()
        )
      }
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal) {
        if (!this.item[this.item.key]) {
          let date = []
          if (this.item.defaultDaySection) {
            date = [this.defaultSelectDate(this.item.defaultDaySection).startDate, this.defaultSelectDate().endDate]
          }
          if (this.item.defaultLastWeek) {
            date = [this.defaultLastWeek.startDate, this.defaultLastWeek.endDate]
          }
          if (this.item.defaultSelectMonth) {
            date = [this.defaultSelectMonth.startDate, this.defaultSelectMonth.endDate]
          }
          if (this.item.defaultLastMonth) {
            date = [this.defaultLastMonth.startDate, this.defaultLastMonth.endDate]
          }
          if (this.item.defaultYesterday) {
            date = [this.defaultYesterday.startDate, this.defaultYesterday.endDate]
          }
          if(this.item.customDate && this.item.customDate.startDate) {
            date = [this.$tools.tailor.dateToMoment(this.item.customDate.startDate),this.$tools.tailor.dateToMoment(this.item.customDate.endDate)]
          }
          this.$set(this.item, this.item.key, date)
        }
      }
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  components: {},

  computed: {},

  created() {},

  methods: {
    defaultSelectDate(date) {
      return {
        startDate: moment()
          .startOf('day')
          .subtract(7, 'days'),
        endDate: moment()
          .endOf('day')
          .subtract(0, 'days')
      }
    },
    //超过今天不能选择
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    // //超过这个月不能选择
    disabledMonth(current) {
      return current && current > moment().endOf('day')
    },
    handlePanelChange2(value, mode) {
      this.item.Month = value
    },
    //手动选择时间清空外面时间区间
    openChange(status) {
      if (!status) {
        this.$emit('resetParams')
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
