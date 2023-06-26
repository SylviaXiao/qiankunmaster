<template>
  <div class="cus_table_wrapper">
    <a-card>
      <div id="custable">
        <div class="cus_table" :style="`width: ${cusWidth};`" style="border: 1px solid #9d9d9d;">
          <div class="cus_row" :class="{ cus_row_hide: cols.hide }" :data-empty="cols.empty ? 'empty' : 'show'" v-for="(cols, index) in tableData" :key="index">
            <div class="cus_col" :class="{ label: col.type === 'label' }" v-for="(col, idx) in cols.children" :key="idx" :style="`border-right: 1px solid #9d9d9d;flex: ${col.width}`">
              <div :class="{ has_icon: col.showIcon }" class="text_wrapper" v-if="!col.children">
                <span data-empty="empty"></span>
                <span :style="col.red ? 'color:red' : ''">{{ col.text }}</span>
                <span data-empty="empty" v-if="col.showIcon" @click="showModalHandle(col)" style="margin-left: 10px">
                  <img width="16px" src="~@/assets/icons/info_icon.png" class="icon" alt="logo" style="padding:0;" />
                </span>
              </div>
              <div v-else>
                <div class="cus_row" v-for="(subCols, subIndex) in col.children" :key="subIndex">
                  <div class="cus_col" v-for="(subCol, subIdx) in subCols.children" :key="subIdx" :style="`border-right: 1px solid #9d9d9d;flex: ${subCol.width}`">
                    <div v-if="!subCol.children" style="white-space: pre-wrap;" class="text_wrapper">{{ subCol.text }}</div>
                    <div v-else>
                      <div class="cus_row" v-for="(subsubCols, subsubIndex) in subCol.children" :key="subsubIndex">
                        <div class="cus_col center" :class="{ beforeLi: subsubCol.redLi }" v-for="(subsubCol, subsubIdx) in subsubCols.children" :key="subsubIdx" :style="`flex: ${subCol.width}`">
                          {{ subsubCol.text }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="visible" :title="title" width="800px" :footer="null">
      <!-- <a-table
        ref="table"
        :columns="columns"
        :dataSource="dataArr"
        :pagination="false"
        :rowKey="
          record => {
            return Math.random() + new Date().getTime()
          }
        "
      >
      </a-table> -->
      <div class="table_list_wrapper">
        <div style="display: flex; justify-content: space-between;margin-bottom: 15px">
          <div>历史缴费合计:{{ otherData.totalPayPrice }}</div>
          <div>历史退费合计:{{ otherData.totalOriginalRefundPrice }}</div>
          <div>总合计:{{ (otherData.totalPayPrice || 0) + (otherData.totalOriginalRefundPrice || 0) }}</div>
        </div>
        <div class="table_item_wrapper" v-for="(item, index) in dataArr" :key="index">
          <template v-if="item.type !== 'D'">
            <div class="price_info">
              <div>缴费日期:{{ item.date | subStringDate }}</div>
              <div>缴费类型:{{ item.type | filterPayType }}</div>
              <div>缴费分馆:{{ item.finSchoolName || '' }}</div>
              <div>支付类型:{{ item.payType }}</div>
              <div>缴费金额:{{ item.price || 0 }}元</div>
            </div>
            <div class="card_info" v-for="(it, idx) in item.cardPayInfos" :key="idx">
              <div>卡号: {{ it.stuCardNo }}</div>
              <div>卡种: {{ it.eduTypeName }}</div>
              <div>本次缴费: {{ it.price || it.paidPrice || 0 }}元</div>
              <div>应收金额: {{ it.totalPrice || 0 }}元</div>
            </div>
          </template>
          <template v-else>
            <div class="price_info">
              <div>退费日期:{{ item.date | subStringDate }}</div>
              <div>退费分馆:{{ item.finSchoolName || '' }}</div>
              <div>办卡金额:{{ item.cardTotalPaidPrice }}元</div>
              <div>退费金额:{{ item.price || 0 }}元</div>
            </div>
            <div class="card_info" v-for="(it, idx) in item.cardPayInfos" :key="idx">
              <div>卡号: {{ it.stuCardNo }}</div>
              <div>卡种: {{ it.eduTypeName }}</div>
              <div>扣除课耗: {{ it.consumePrice || 0 }}元</div>
              <div>扣除学籍管理费: {{ it.extraPrice || 0 }}元</div>
            </div>
          </template>
        </div>
      </div>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="visibleCard" :title="title" width="1350px" :footer="null">
      <a-table
        ref="table"
        :columns="columnsCard"
        :dataSource="dataArrCard"
        :pagination="false"
        :rowKey="
          record => {
            return Math.random() + new Date().getTime()
          }
        "
      >
        <span slot="totalPrice" slot-scope="text, record"> {{ record.paidPrice | fixTofloat }}/{{ record.totalPrice | fixTofloat }}/{{ record.originalPrice | fixTofloat }} </span>
        <span slot="payoff" slot-scope="text, record">
          <template v-if="text">
            结清
          </template>
          <template v-else-if="record.status === 'D'">-</template>
          <template v-else>
            <span style="color:red">
              {{ (record.paidPrice - record.totalPrice) | fixTofloat }}
            </span>
          </template>
        </span>
      </a-table>
      <a-divider orientation="right"><span :style="{ color: '#e8e8e8' }">日志</span></a-divider>
      <a-table
        ref="table"
        :columns="columnsCardLog"
        :dataSource="dataArrCardLog"
        :pagination="false"
        :rowKey="
          record => {
            return Math.random() + new Date().getTime()
          }
        "
      >
        <span slot="stuName" slot-scope="text, record">
          {{ record.type == 'B' ? record.targetStuName : record.stuName }}
        </span>
        <span slot="parseDate" slot-scope="text">
          <span>{{ $tools.tailor.getDate(text) }}</span>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    cusWidth: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      title: '',
      visible: false,
      visibleCard: false,
      columns: [],
      columnsCard: [],
      columnsCardLog: [],
      dataArr: [],
      dataArrCard: [],
      dataArrCardLog: [],
      otherData: {}
    }
  },
  filters: {
    totalPaidPriceFn(arr) {
      console.log(arr)
    }
  },
  methods: {
    pageSetup_null() {
      var hkey_key
      var hkey_root = 'HKEY_CURRENT_USER'
      var hkey_path = '\\Software\\Microsoft\\Internet Explorer\\PageSetup\\'
      try {
        var RegWsh = new ActiveXObject('WScript.Shell')
        hkey_key = 'header'
        RegWsh.ReWrite(hkey_root + hkey_path + hkey_key, '')
        hkey_key = 'footer'
        RegWsh.ReWrite(hkey_root + hkey_path + hkey_key, '')
      } catch (e) {}
    },
    print() {
      var el = document.getElementById('custable')
      var iframe = document.createElement('IFRAME')
      var doc = null
      iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
      document.body.appendChild(iframe)
      doc = iframe.contentWindow.document
      let formatStr = el.innerHTML
        .replace(/\"cus_row\"/g, '"cus_row" style="min-height:45px;display: flex;border-bottom: 1px solid #9d9d9d"')
        .replace(/class\=\"text_wrapper/g, 'style="line-height:45px;padding:5px;text-align:center;color: #333;" class\="text_wrapper')
        .replace(/\"empty\"/g, '"empty" style="display:none"')
        .replace(/\>转账方式/g, 'style="position:relative;top:110px;"\>转账方式')
      let headerHtml = '<div style="font-size: 22px;font-weight:bold;text-align:center;margin-top:20px; margin-bottom:50px">退费申请表</div>'
      let docStyle = '<style media="print"> @page {size: auto; margin: 0mm; }</style>'
      doc.write('<div style="margin:16mm">' + headerHtml + formatStr + '</div>' + docStyle)
      doc.title = 'ERP管理系统'
      doc.close()

      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      if (navigator.userAgent.indexOf('MSIE') > 0) {
        document.body.removeChild(iframe)
      }
    },
    showModalHandle(item) {
      if (item.title === '学员卡信息') {
        this.title = item.title
        this.visibleCard = true
        this.columnsCard = item.columnsCard
        this.dataArrCard = item.dataArrCard
        this.columnsCardLog = item.columnsCardLog
        this.dataArrCardLog = item.dataArrCardLog
        return
      }
      this.visible = true
      this.title = item.title
      this.columns = item.column
      this.dataArr = this.formateData(item.data)
      this.otherData = item.other
    },
    formateData(data) {
      return data.map(item => {
        if (item.type !== 'D') {
          return item
        }
        item.cardTotalPaidPrice = (item.cardPayInfos && item.cardPayInfos[0] && (-item.cardPayInfos[0].paidPrice || (item.cardPayInfos[0].payoff ? item.cardPayInfos[0].totalPrice : 0))) || 0
        return item
      })
    }
  }
}
</script>

<style lang="less" scoped>
.center {
  display: flex;
  justify-content: center;
  align-content: center;
}
.table_list_wrapper {
  width: 100%;
  padding: 10px;
  box-sizing: 5px;
  .table_item_wrapper {
    margin-bottom: 15px;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    background: #fafafa;

    .price_info,
    .card_info {
      display: flex;
      justify-content: space-between;
      padding: 5px;
    }
    .price_info {
      border-bottom: 1px solid #999;
      font-weight: bold;
    }
  }
}
.cus_table_wrapper {
  .beforeLi {
    &::before {
      content: '(离)';
      color: red;
    }
  }
  .cus_table {
    width: 800px;
    background: #fff;
    border: 1px solid #9d9d9d;
    .cus_row {
      min-height: 40px;
      display: flex;
      border-bottom: 1px solid #9d9d9d;
      &:nth-last-child(1) {
        border-bottom: none;
      }
      &.cus_row_hide {
        display: none;
      }
    }
    .cus_col {
      border-right: 1px solid #9d9d9d;
      &:nth-last-child(1) {
        border-right: none;
      }
      .text_wrapper {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        &.has_icon {
          box-sizing: border-box;
          padding: 0 20px;
          justify-content: space-between;
        }
      }
      &.label {
        background: #f2f2f2;
      }
    }
  }
}
</style>
