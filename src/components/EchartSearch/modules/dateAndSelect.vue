<template>
  <div>
    <!-- <a-col :span="8"> -->
      <a-form-model-item :label="item.label" style="display: flex;margin-left: 20px;">
        <div style="display: flex;">
          <a-form-item style="width: 70px;">
            <a-select
              @change="selectChange(this,item.key)"
              :mode="item.mode || 'default'"
              class="smallSelect"
              v-model="item[item.selectKey]"
              :placeholder="item.placeholder"
              :allowClear="item.allowClear"
            >
              <!-- :defaultValue="item.defaultSelect" -->
              <a-select-option v-for="(todo, index) in item.staticArr" :key="index" :allowClear="true" :value="todo.value">
                {{todo.string}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item style="width: 250px;">
            <a-range-picker
              :disabled-date="item.disabledDate?disabledDate:''"
              @change="handlePanelChange"
             :allowClear="false"
              class="smallPicker"
              :format="item.format"
              :showTime="item.format === 'YY-MM-DD hh:mm:ss'"
              v-model="item[item.key]"
            />
              <!-- :defaultValue="[defaultSelectDate.startDate,defaultSelectDate.endDate]" -->
          </a-form-item>
        </div>
      </a-form-model-item>
    <!-- </a-col> -->
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'dateAndSelect',
  data() {
    return {
      defaultToday: [moment().subtract(0, 'days'), moment().subtract(0, 'days')],
      key:null,
      selectKey: null,
      defaultSelectDate: {startDate: moment().startOf('day').subtract(7, 'days'),endDate: moment().endOf('day').subtract(0, 'days')}
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal) {
        let arr = ['key','selectKey']
        arr.forEach(todo=>{
          if(!this.item[this.item[todo]]) {
            this.$set(this.item,this.item[todo],todo==='selectKey'?this.item.defaultSelect?this.item.defaultSelect:'':[this.defaultSelectDate.startDate,this.defaultSelectDate.endDate])
          }
        })
        // console.log(this.item)
        // this.data = this.item.defaultValue
      }
    },
    // key(n,o) {
    //   console.log(n)
    //   if(n) {
    //   if(!this.item[this.item.key]) {
    //    this.$set(this.item,this.item[this.item.key],n)
    //   }else {
    //     this.item[this.item.key] = n
    //   }        
    //   }


    // },
    // selectKey(n,o) {
    //   console.log(n)

    //   if(n) {
    //   if(!this.item[this.item.selectKey]) {
    //    this.$set(this.item,this.item[this.item.selectKey],n)
    //   }else {
    //     this.item[this.item.selectKey] = n
    //   }        
    //   }
    // }

    // data() {
    //   this.$emit('input', this.data)
    // }
  },
  components: {},

  computed: {},

  created() {},

  methods: {
    //超过今天不能选择
    disabledDate(current) {
      return current && current > moment().endOf('day');
    },
    handlePanelChange(val,mode) {
      console.log(val,mode)
    },
    selectChange(Fieldkey, selectVal) {
      // console.log(this.item.selectKey)
      // console.log(this.item[this.item.selectKey])
      // 向外暴露select框的change事件
      this.$emit('searchSelectChange', Fieldkey, selectVal)
    },
  }
}
</script>
<style lang="less" scoped>
// /deep/ .ant-row .ant-form-item {

// }
</style>
