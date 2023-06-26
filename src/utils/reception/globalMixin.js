import Vue from 'vue'
import moment from 'moment'

Vue.mixin({
  data() {
    return {
      defaultStartEndDay: [moment().subtract(0, 'days'), moment().subtract(0, 'days')]
    }
  }
})