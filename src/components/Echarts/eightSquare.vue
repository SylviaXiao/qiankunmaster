<template>
  <!-- <a-spin :spinning="spinning"> -->
  <div>
    <div class="eightSquare">
      <!-- <div class="shadow">
      <div></div>
      <div class="down" style="margin-right:10px;cursor: pointer;" @click="setterIndicator"><a-icon type="tool" style="margin-right:5px;" />选择指标</div>
    </div> -->
    <template v-if="blockList.length > 0">
      <div class="box" v-for="(item, index) in blockList" :key="index">
        <div style="display:flex;justify-content: space-between;">
          <div>
            {{ item.name }}
            <a-tooltip placement="topLeft">
              <template slot="title">
                <div v-html="item.remark" style="font-size:12px;width:200px;"></div>
              </template>
              <a-icon type="question-circle" style="font-size:12px;color:#999;" />
            </a-tooltip>
          </div>
          <!-- 点击编辑 -->
          <!-- <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              <a-icon type="dash" class="icon" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a href="http://www.alipay.com/">删除</a>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="1">
                <a href="http://www.taobao.com/">编辑</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </div>
        <div>{{ item.startDate }}~{{ item.endDate }}</div>
        <div>合计</div>
        <div class="total" v-if="item.total !== ''">{{ item.total }}</div>
        <a-spin v-else style="margin-left:45%;">
          <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
        </a-spin>
      </div>
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        title="选择指标"
        :width="700"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange" style="margin-bottom: 10px;">
          全选
        </a-checkbox>
        <a-checkbox-group @change="changePayway" style="width: 100%;" v-model="checkList">
          <a-row type="flex">
            <a-col :span="6" v-for="item in targetSetter" :key="item.code">
              <a-checkbox :value="item.code" style="margin-bottom:10px;">{{ item.name }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-modal>
    </template>
    </div>
    <div @click="showAll" v-if="data.series.length > 8" class="down icon" style="margin-left:49%;">{{ blockList.length>8 ? '收起' : '展开' }}</div>
  </div>
  <!-- </a-spin> -->
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      checkList: [],
      checkAll: false,
      indeterminate: false,
      unfold: false,
      blockList: [],
    }
  },
  props: {
    data: {
      type: Object,
      default: () => []
    },
    targetSetter: {
      type: Array,
      default: () => []
    }
    //横板展示，竖版展示
    // axis: {
    //   type: String,
    //   default: 'x'
    // },
    // setting: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(n) {
        this.blockList = this.data.series
          .map((item, index) => {
            if (index < 8) {
              return item
            }
          })
          .filter(item => item !== undefined)
      }
    }
  },

  methods: {
    showAll() {
      console.log('showAll1', this.unfold, this.blockList)      
      this.unfold = !this.unfold
      if (this.unfold) {
        console.log(this.data.series)
        this.blockList = this.data.series
      } else {
        this.blockList = this.data.series
          .filter((item,index) => index < 8)
      }
      console.log('showAll2', this.unfold, this.blockList)      
    },
    handleCancel() {
      this.confirmLoading = false
      this.checkList = []
      this.checkAll = false
      this.indeterminate = false
      this.visible = false
    },
    handleOk() {
      this.confirmLoading = true
      this.$emit('targetShowList', this.checkList)
    },
    //打开指标设置
    open() {
      this.checkList = this.targetSetter
        .map(item => {
          if (item.show) {
            return item.code
          }
        })
        .filter(item => item)
      this.changePayway()
      this.visible = true
    },
    //全选
    onCheckAllChange(e) {
      Object.assign(this, {
        checkList: e.target.checked ? this.targetSetter.map(item => item.code) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    //多选
    changePayway() {
      this.indeterminate = !!this.checkList.length && this.checkList.length < this.targetSetter.map(item => item.code).length
      this.checkAll = this.checkList.length === this.targetSetter.map(item => item.code).length
      console.log(this.checkList)
    }
  }
}
</script>
<style lang="less" scoped>
.eightSquare {
  // padding-top: 40px;
  position: relative;
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
  .shadow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0;
    background-color: #f0f2f5;
    height: 40px;
    width: 100%;
  }
  .box {
    width: 22%;
    margin: 10px 15px;
    height: 120px;
    padding: 10px 20px;
    border: 1px solid #ddd;
    > div:first-of-type {
      font-size: 14px;
    }
    > div:nth-of-type(2) {
      margin-top: 5px;
      font-size: 12px;
    }
    > div:nth-of-type(3) {
      margin-top: 5px;
      font-size: 14px;
    }
    .total {
      font-size: 20px;
      font-weight: bold;
      margin-left: 20px;
    }
    &:hover {
      // cursor: pointer;
      transform: scale(1.02);
      box-shadow: 0 0 5px rgba(221, 221, 221, 0.794);
      transition: transform linear 0.1s;
    }
  }
  .up {
    color: #d80404;
  }
}
.icon {
  // color: #1890ff;
  cursor: pointer;
}
.down {
  color: #1890ff;
}
</style>
