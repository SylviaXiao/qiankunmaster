<template>
  <div class="fc-select-feeType">
    <div class="belongs-teacher-header" style="height: 40px">
      <div></div>
      <div style="text-align:right;">
        <a-button type="dashed" @click="addCounselorHandle"> <a-icon type="plus-circle" />添加 </a-button>
      </div>
    </div>
    <div>
      <a-row>
        <a-col :span="3">
          金额
        </a-col>
        <a-col :span="4">
          费用归类
        </a-col>
        <a-col :span="4">
          财务归类
        </a-col>
        <a-col :span="4">
          经营归类
        </a-col>
        <a-col :span="4">
          成本归类
        </a-col>
      </a-row>
      <div class="" v-for="(item, index) in counselorInfo" :key="index">
        <a-row>
          <a-col :span="3">
            <a-input-number
              @focus="priceFocus"
              style="width:95%;"
              id="inputNumber"
              placeholder="请输入金额"
              v-model="item.splitPrice"
              @change="onpriceChange(item.splitPrice, index)"
            />
          </a-col>
          <a-col :span="4">
            <CostType
              style="width:95%;"
              :rowIndex="index"
              :disabled="disabled"
              :formData="item"
              :value="item.feeItemName"
              :defaultType="'feeItemName'"
              :label="'费用归类'"
              @change="onCostTypeChange"
              :bindTypePrice="bindType"
            ></CostType>
          </a-col>
          <a-col :span="4">
            <CostType
              style="width:95%;"
              :rowIndex="index"
              :disabled="disabled || bindType == '财务收支'"
              :formData="item"
              :value="item.financeName"
              :bindPrice="'feeItemName'"
              :defaultType="'financeName'"
              :label="'财务归类'"
              @change="onCostTypeChange"
              :bindTypePrice="bindType"
            ></CostType>
          </a-col>
          <a-col :span="4">
            <CostType
              style="width:95%;"
              :rowIndex="index"
              :disabled="disabled || bindType == '财务收支'"
              :formData="item"
              :value="item.operateName"
              :bindPrice="'financeName'"
              :defaultType="'operateName'"
              :label="'经营归类'"
              @change="onCostTypeChange"
              :bindTypePrice="bindType"
            ></CostType>
          </a-col>
          <a-col :span="4">
            <CostType
              style="width:95%;"
              :rowIndex="index"
              :disabled="disabled || bindType == '财务收支'"
              :formData="item"
              :value="item.costName"
              :bindPrice="'operateName'"
              :vModel="'costName'"
              :defaultType="'costName'"
              :label="'成本归类'"
              @change="onCostTypeChange"
              :bindTypePrice="bindType"
            ></CostType>
          </a-col>
          <a-col :span="4">
            <Apportion :value="item.spendingSplits" :bindPrice="item.splitPrice" :rowIndex="index" :disabled="disabled" @change="onApportionChange"></Apportion>
          </a-col>
          <span style="margin-left:5px;" v-if="counselorInfo.length > 1">
            <a href="javascript:;" @click="deleteCounselorHandle(item)">删除</a>
          </span>
        </a-row>
      </div>
      <div class="text">
        合计金额：<span>{{ maxPrice }}元</span>
      </div>
    </div>
  </div>
</template>
<script>
// import { pageFeeItem } from '@/api/workFlow/request.js'
// import { listFeeItem } from '@/api/workFlow/request.js'
import CostType from './SelectCostType/index.vue'
import Apportion from './Apportion/index.vue'
let defaultValue = { key: 0, feeItemId: null, splitPrice: 0, feeItemName: null, financeName: null, operateName: null, costName: null, spendingSplits: null }
export default {
  // model: {
  //   prop: 'value',
  //   event: 'change'
  // },
  name: 'filterBranch',
  props: {
    bindType: {
      type: String,
      default: '财务收支'
    }
  },

  components: { CostType, Apportion },

  data() {
    return {
      timer: null,
      price: 0,
      counselorkey: 0,
      disabled: false,
      counselorInfo: []
    }
  },
  created() {
    if (this.bindType == '工资社保') {
      this.backData()
    }
  },
  computed: {
    maxPrice() {
      let total = this.counselorInfo.map(item => item.splitPrice).reduce((a, b) => a + b)
      return Number(total.toFixed(2))
    } //已填写金额总和
    // totalPrice() {
    //   return this.counselorInfo.map(item => item.splitPrice).reduce((a, b) => a + b)
    // }
  },
  mounted() {},
  methods: {
    backData(data) {
      if (data) {
        let finSpendingItemSplit = JSON.parse(JSON.stringify(data.finSpendingItemSplit))
        if (Array.isArray(finSpendingItemSplit) && finSpendingItemSplit.length > 0) {
          let splitData = []
          finSpendingItemSplit.forEach((item, index) => {
            splitData.push({
              feeItemName: this.getCostData('feeItemName', item),
              financeName: this.getCostData('financeName', item),
              operateName: this.getCostData('operateName', item),
              costName: this.getCostData('costName', item),
              feeItemId: item.feeItemId,
              spendingSplits: item.spendingSplits,
              splitPrice: Math.abs(item.splitPrice),
              key: index
            })
          })
          this.counselorInfo = splitData
        } else {
          this.counselorInfo = [JSON.parse(JSON.stringify(defaultValue))]
        }

        this.price = data.price
      } else {
        this.counselorInfo = [JSON.parse(JSON.stringify(defaultValue))]
      }
      this.counselorkey = this.counselorInfo.length - 1
    },
    getCostData(type, data) {
      const { feeItemName, financeName, operateName, costName, sysFeeItemId, feeItemId } = JSON.parse(JSON.stringify(data))
      let datas = { feeItemName, financeName, operateName, costName, id: sysFeeItemId || feeItemId, name: data[type] }
      return datas
    },
    getFormData(flag) {
      var root = this.$parent
      while (root) {
        if (flag in root) {
          return root[flag]
        }
        root = root.$parent
      }
    },
    priceFocus() {
      let price = this.price
      if (!price) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请先填写总金额'
        })
      }
    },
    /**
     * 获取指定组件的值
     */
    getFormVal(vModel) {
      let that = this
      try {
        if (vModel.indexOf('.') > -1) {
          let [tabelVModel, cmpVModel] = vModel.split('.')
          if (typeof that.rowIndex === 'number') {
            return (that.formData[tabelVModel] && that.formData[tabelVModel][that.rowIndex] && that.formData[tabelVModel][that.rowIndex][cmpVModel]) || 0
          } else {
            return that.formData[tabelVModel].reduce((sum, c) => (c[cmpVModel] || 0) + sum, 0)
          }
        }
        return that.formData[vModel] || 0
      } catch (error) {
        console.warn('计算公式出错, 可能包含无效的组件值', error)
        return 0
      }
    },

    onApportionChange(data) {
      this.counselorInfo[data.rowIndex]['spendingSplits'] = data.data
    },
    //删除一行
    deleteCounselorHandle(record) {
      this.counselorInfo = this.counselorInfo.filter(item => item.key !== record.key)
    },
    //新增一行
    addCounselorHandle() {
      let temObj = JSON.parse(JSON.stringify(defaultValue))
      temObj.key = ++this.counselorkey
      this.counselorInfo.push(temObj)
    },
    onpriceChange(e, rowIndex) {
      let that = this
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let price = e
        if (that.price) {
          if (that.maxPrice > that.price) {
            price = Number((that.price - (that.maxPrice - e)).toFixed(2))
            that.$notification['error']({
              message: '系统通知',
              description: '拆分金额不得超过总金额'
            })
          }
        } else {
          price = 0
        }
        that.counselorInfo[rowIndex]['splitPrice'] = price
      }, 600)
    },
    onChange(e) {
      this.counselorInfo.forEach((item, index) => {
        item = Object.assign(item, { feeItemName: null, financeName: null, operateName: null, costName: null })
      })
    },
    onCostTypeChange(e) {
      if (e.data && e.data.id) this.counselorInfo[e.rowIndex].feeItemId = e.data.id
      this.counselorInfo[e.rowIndex][e.type] = e.data
    }
  }
}
</script>
<style lang="less" scoped>
.belongs-teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.text {
  margin-top: 20px;
  font-size: 16px;
  span {
    color: red;
  }
}
</style>
