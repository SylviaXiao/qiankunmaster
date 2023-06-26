<template>
  <div class="print-bills-wrapper">
    <div class="isShowBills" style="display: none;">
      <div class="bills" id="bills">
        <div class="bills-print-wrapper" style="width: 192px;min-width: 192px;max-width: 192px; margin: 0 auto; padding-right: 8px;">
          <div class="bills-logo">
            <img src="~@/assets/logo.png" style="width: 100%;" />
          </div>
          <div class="bills-content">
            <h4 class="bills-title" style="text-align: center;font-weight: 400;">收款单</h4>
            <div class="default-info" style="line-height: 30px;">
              <span style="font-size: 13px;">欢迎光临{{ deptName || '' }}</span>
              <div style="display: flex; flex-flow: row nowrap; justify-content: space-between;">
                <div class="bills-date">
                  <span style="font-size: 12px;">打印日期：{{ todayDateTime || $tools.tailor.getDateTime(new Date()) }}</span>
                </div>
              </div>
            </div>
            <div class="apply-info" style="border-top: 2px dashed black;border-bottom: 2px dashed black; padding: 25px 0;margin: 20px 0;font-size: 12px;">
              <div class="bills-stu-info" style="line-height: 20px;">姓名：{{ stuInfo ? stuInfo.stuName : 'xxxx' }}</div>
              <div class="bills-stu-info" style="line-height: 20px;">电话：{{ stuInfo ? stuInfo.stuPhone : 'xxxx' }}</div>
              <div class="bills-stu-info" style="line-height: 20px;">缴费金额：{{ stuInfo ? stuInfo.price : '0' }} 元</div>
              <div class="bills-stu-info" style="line-height: 20px;">
                缴费时间：{{
                  stuInfo && (stuInfo.enrollDate || stuInfo.createDate)
                    ? stuInfo.enrollDate || $tools.tailor.getDate(stuInfo.createDate)
                    : $tools.tailor.getDate(new Date())
                }}
              </div>
            </div>
          </div>
          <div class="bills-footer">
            <h4 style="padding-bottom: 50px;border-bottom: 1px solid #fffffd;font-weight: 400;font-size: 13px;">让更多中国人享受舞蹈！</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'PrintBills',
  props: {
    stuInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      deptName: '',
      todayDateTime: null
    }
  },
  created() {
    if (Vue.ls.get('userSchoolId') && Vue.ls.get('userSchoolId').length > 0) {
      this.deptName = JSON.parse(Vue.ls.get('userSchoolId'))[0].deptName
    }
  },
  methods: {
    printer(idstr) {
      var el = document.getElementById('bills')
      var iframe = document.createElement('IFRAME')
      var doc = null
      iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
      document.body.appendChild(iframe)
      doc = iframe.contentWindow.document
      doc.write('<div>' + el.innerHTML + '</div>')
      doc.close()

      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      if (navigator.userAgent.indexOf('MSIE') > 0) {
        document.body.removeChild(iframe)
      }
    }
  }
}
</script>

<style scoped></style>
