<template>
  <div>
    <!-- <div v-if="isSeriesEmpty"></div> -->
    <!-- <div>{{data.title}}</div> -->
    <component :is="type" v-bind="$props" class="echart" ref="echart" @targetShowList="targetShowList"></component>
  </div>
</template>

<script>
import ChartPie from './ChartPie.vue';
import ChartLine from './ChartLine.vue';
import ChartBar from './ChartBar.vue';
import eightSquare from './eightSquare.vue';

export default {
  name: 'Echarts',
  components: { ChartPie,ChartLine,ChartBar,eightSquare },
  props: {
  //指标设置数据
  targetSetter:{
    type: Array,
    default:()=>[]
  },
  data:{
    type:[Object, Array],
    default:()=>[]
  },
  type:{
    type:String,
    default:'ChartPie'
  },
  setting: {
    type:Object,
    default: ()=>{}
  }
  },
  computed: {
    isSeriesEmpty() {
      console.log(this.data)
      return (
        false
        // isEmpty(this.seriesData) || this.seriesData.every(item => !item.value)
      );
    }
  },
  methods: {
    open() {
      this.$refs.echart.open()
    },
    //指定展示指标
    targetShowList(val) {
      this.$emit('targetShowList',val)
    }
  }

};
</script>
<style lang="less" scoped>
.echart {
    width: 100%;
    height: 100%;
}
</style>