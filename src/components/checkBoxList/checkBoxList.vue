<template>
  <div class="popBox">
    <div class="search">
      <a-icon type="search" style="color:#999;font-size:12px;" />
      <a-input placeholder="搜索" v-model.trim="searchVal" @change="changeSearch(searchVal)" />
    </div>
    <div class="list">
      <a-checkbox-group @change="changePayway" style="width: 100%;" v-model="checkId">
        <a-row type="flex" v-for="item in checkList" :key="item.data">
          <a-col :span="24">
            <a-checkbox :value="item.data" style="margin-bottom:10px;">{{ item.name }}</a-checkbox>
          </a-col>
          <div v-if="checkList.length === 0" class="tips">
            暂无相关数据
          </div>
        </a-row>
      </a-checkbox-group>
    </div>
    <div class="footer">
      <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange" style="font-size:13px;">
        全选
      </a-checkbox>
      <div class="button" @click="submit">
        确定
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchVal: '',
      checkId: [],
      payway: [],
      indeterminate: false,
      checkAll: false,
      checkList: []
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    list: {
      immediate: true,
      handler(n) {
        this.checkList = this.list
        this.checkId = []
        this.indeterminate = false
        this.checkAll = false
      }
    }
  },
  methods: {
    changeSearch(val) {
      if (val) {
        this.checkId = []
        this.indeterminate = false
        this.checkAll = false
        this.checkList = this.list.filter(item => item.name.includes(val))
      } else {
        this.checkList = this.list
      }
    },
    //全选
    onCheckAllChange(e) {
      Object.assign(this, {
        checkId: e.target.checked ? this.checkList.map(item => item.data) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    //多选
    changePayway(checkedValue) {
      this.indeterminate = !!this.checkId.length && this.checkId.length < this.checkList.map(item => item.data).length
      this.checkAll = this.checkId.length === this.checkList.map(item => item.data).length
      console.log(this.checkId.length)
    },
    submit() {
      this.$emit('getcheckIds', this.checkId)
    }
  }
}
</script>
<style lang="less" scoped>
.popBox {
  width: 180px;
  box-shadow: 0 0 5px rgba(221, 221, 221, 0.794);
  border-radius: 10px;
  // margin: 10px;
  .search {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 0 10px;
    input {
      padding-left: 5px !important;
      border: none !important;
      &:focus {
        background: #ffffff;
        border: none !important;
        /* 解决input按钮自动填充后 浏览器渲染的默认背景问题 */
        box-shadow: inset 0 0 0 1000px #ffffff !important;
      }
      &::placeholder {
        font-size: 13px;
      }
    }
  }
  .list {
    padding: 10px;
    height: 250px;
    overflow: hidden;
    overflow-y: auto;
    .tips {
      color: #999;
      text-align: center;
      font-size: 13px;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    border-top: 1px solid #ddd;
    font-size: 13px;
    .button {
      color: #fff;
      background-color: #1890ff;
      width: 40px;
      text-align: center;
      line-height: 20px;
      border-radius: 3px;
      cursor: pointer;
    }
  }
}
</style>
