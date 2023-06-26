<template>
  <div>
    <a-spin :spinning="tableList.length == 0 && !allRankMsg" style="width:100%;">
      <div>
        <div class="title">
          <span v-for="(item, index) in tabList" :key="index">
            <span :class="{ active: seniorityType === item.seniorityType }" @click="changeSeniorityType(item.seniorityType)" style="cursor:pointer;"
              >{{ item.text }}
            </span>
            <span v-if="tabList.length != index + 1" style="margin-right:0.1rem;">|</span>
          </span>
        </div>
        <div class="tableTitle">
          <div v-for="(item, index) in tableTitle" :key="index">{{ item }}</div>
        </div>
        <div class="tableList">
          <div v-for="(item, index) in tableList" :key="item.id" style="display:flex;margin-bottom:0.2rem;">
            <div class="serial" style="flex:1;text-align:center;">{{ index + 1 }}</div>
            <div v-for="(todo, inx) in listKey" :key="inx" style="flex:1;text-align:center;">
              {{ item[todo] }}
            </div>
          </div>
          <div v-if="!tableList.length && allRankMsg" style="color:#999;text-align:center;">暂无数据</div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
export default {
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    tableTitle: {
      type: Array,
      default: () => []
    },
    tableList: {
      type: Array,
      default: () => []
    },
    allRankMsg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      seniorityType: 'A',
      listKey: []
    }
  },
  watch: {
    tableList: {
      deep: true,
      immediate: true,
      handler(n, o) {
        if (this.tableList.length) {
          console.log(this.tableList)
          let arr = []
          for (let key in this.tableList[0]) {
            arr.push(key)
          }
          this.listKey = arr
        } else {
          console.log(this.tableList)
          this.listKey = []
        }
      }
    }
  },
  components: {},

  computed: {},

  created() {},

  methods: {
    changeSeniorityType(val) {
      this.seniorityType = val
      this.$emit('changeRank', val)
    }
  }
}
</script>
<style lang="less" scoped>
.active {
  color: #1890ff;
}
.seniority {
  margin-left: 30px;
  .tableTitle {
    // font-weight: bold;
    height: 40px;
    line-height: 40px;
    background-color: #f0f2f5;
    margin-bottom: 20px;
    display: flex;
    padding-right:20px;
    div {
      flex: 1;
      text-align: center;
    }
    // > div:first-of-type {
    //   flex: 1;
    //   margin-left: 15px;
    //   // margin-right: 45px;
    // }
    // // > div:nth-of-type(2) {
    // //   // margin-right:70px;
    // //   flex:2
    // // }
    // // > div:nth-of-type(3) {
    // //   // margin-right:50px;
    // //   flex:2;
    // // }
    // > div:nth-of-type(4) {
    //   // margin-right:50px;
    //   flex: 1;
    // }
  }
  .tableList {
    // padding-right: 25px;
    height: 280px;
    overflow: hidden;
    overflow-y: auto;
  }
  // > div:first-of-type {
  //   display:flex;
  //   align-items:center;
  //   justify-content:space-between;
  //   margin-bottom:20px;
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  // }
  // .serial {
  //   width: 21px;
  //   // margin-right: 30px;
  //   // margin-left: 15px;
  //   padding: 0 7px;
  //   &.active {
  //     text-align: center;
  //     width: 21px;
  //     height: 20px;
  //     margin-right: 35px;
  //     margin-left: 10px;
  //     padding: 0 7px;
  //     color: #fff;
  //     background-color: #1890ff;
  //     border-radius: 50%;
  //     // border: 1px solid #1890ff;
  //   }
  // }
  // .list {
  //   width: 90%;
  //   display: flex;
  //   align-items: center;
  //   // justify-content: space-between;
  // }
}
</style>
