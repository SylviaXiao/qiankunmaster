<template>
  <div class="refund-detail-print-wrapper">
    <div ref="printHtml">
      <div class="title mb20">
        退费申请表
      </div>
      <table class="table">
        <tr>
          <th>学员姓名</th>
          <td colspan="3">{{data.studentName}}</td>
        </tr>
        <tr>
          <th>办卡日期</th>
          <td>{{$tools.tailor.getDate(data.cardCreatDate)}}</td>
          <th>办卡金额</th>
          <td>{{data.cardPrice}}元</td>
        </tr>
        <tr>
          <th>扣费合计</th>
          <td>{{data.deductTotal}}元</td>
          <th>退费金额</th>
          <td>{{data.refundPrice}}元</td>
        </tr>
        <tr>
          <th>退费原因</th>
          <td>{{data.refundReason}}</td>
          <th >备注</th>
          <td style='text-align:left;'>{{data.refundRemark}}</td>
        </tr>
        <tr>
          <th rowspan="5">退费原因</th>
          <td>收款人户名</td>
          <td colspan="2">{{data.bankUserName}}</td>
        </tr>
        <tr>
          <td>开户行</td>
          <td colspan="2">{{data.bank}}</td>
        </tr>
        <tr>
          <td>银行卡号</td>
          <td colspan="2">{{data.bankNo}}</td>
        </tr>
        <tr>
          <td>与收款人关系</td>
          <td colspan="2">{{data.userRelate}}</td>
        </tr>
        <tr>
          <td>备注</td>
          <td colspan="2">{{data.userRelateRemark}}</td>
        </tr>
        <tr>
          <th>退费日期</th>
          <td>{{$tools.tailor.getDate(data.creatDate)}}</td>
          <th>学员签字</th>
          <td></td>
        </tr>
        <tr>
          <th>签字盖章</th>
          <td colspan="3"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
  import printJs from 'print-js'

  export default {
    data() {
      return {
        data: {},
        cardInfo: {}
      }
    },
    created() {
    },
    methods: {
      print(data) {
        this.data = data || {}
        this.cardInfo = this.data.defaultInformation || {}
        this.$nextTick(() => {
          this.handlePrint()
        })
      },
      handlePrint() {
        html2canvas(this.$refs.printHtml, {
          useCORS: true,
          scale: 2,
          dpi: 150
        })
          .then(canvas => {
            const printable = canvas.toDataURL()
            printJs({ printable, type: 'image' })
          })
          .catch(err => console.log(err))
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .refund-detail-print-wrapper {
    overflow: hidden;
    width: 952px;
    height: 0;

    .title {
      text-align: center;
      line-height: 50px;
      font-weight: 700;
      font-size: 18px;
    }

    .table {
      width: 100%;
      table-layout: fixed;
      word-break: break-all;
      border-collapse: collapse;
      border-spacing: 0;
      background: #FFF;
      border: 1px solid #999;

      tr {
        text-align: center;

        &.row-hover {
          transition: background 0.3s;

          &:hover {
            background: #c4f7dd;
          }
        }
      }

      th,
      td {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 400;
        padding: 16px 5px !important;
        //white-space: nowrap;
        border: 1px solid #999;

        &.gray {
          background: #D9D9D9;
        }
      }

      th {
        font-weight: bold;
        background: #f2f2f2;
        justify-content: center;
        text-align: center;
      }

      td {
      }
    }
  }
</style>
