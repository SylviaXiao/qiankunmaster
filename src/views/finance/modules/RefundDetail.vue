<template>
  <div>
    <div class="header">
      <div class="title">
        标题：{{refundDetail.title}}
      </div>
      <a-button @click="handlePrint">打印</a-button>
    </div>
    <div class="upload-wrap mb20">
      <div>上传附件：</div>
      <div class="upload-list">
        <div v-for="(item, index) in refundDetail.attachmentList" :key="index">
          {{item.fileName}}
          <a class="ml20" @click="handlePreview(item.id)">预览</a>
          <a class="ml20" @click="handleDownload(item)">下载</a>
        </div>
      </div>
    </div>
    <div ref="printHtml">
      <table class="table">
        <!-- 核心情况 -->
        <tr>
          <th class="col1 bold" :rowspan="4">核心情况</th>
          <th class="col2">姓名/手机号</th>
          <td class="col3">
            <a @click="handleStudentInfo(refundDetail.studentId)">{{refundDetail.studentName}}/{{refundDetail.phone}}</a>
          </td>
          <td class="col4">
            <a @click="handleExpenseRecord(2)">历史退费合计</a>
          </td>
        </tr>
        <tr>
          <th class="col2">卡号</th>
          <td class="col3">
            <a @click="handleStudentInfo(refundDetail.studentId, 2)">{{refundDetail.cardNo}}</a>
          </td>
          <td class="col4"><a @click="handleModifyRecord">详情</a></td>
        </tr>
        <tr>
          <th class="col2">卡种</th>
          <td class="col3">{{refundDetail.cardName}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">退费金额</th>
          <td class="col3 bold">{{refundDetail.refundPrice}}</td>
          <td class="col4"></td>
        </tr>
        <!-- 其他情况 -->
        <tr>
          <th class="col1 bold" :rowspan="12">其他情况</th>
          <th class="col2">原价/应收/优惠/实收</th>
          <td class="col3">
            <a @click="handleExpenseRecord(1)">
              {{refundDetail.originalPrice}}/{{refundDetail.totalPrice}}/{{refundDetail.discount}}/{{refundDetail.paidPrice}}
            </a>
          </td>
          <td class="col4">
            卡价值：{{refundDetail.cardValue}}
            <span v-if="refundDetail.changeStudntCard && refundDetail.changeStudntCard.studentId">（结转）</span>
          </td>
        </tr>
        <tr>
          <th class="col2">办卡/开卡时间</th>
          <td class="col3">
            {{$tools.tailor.getDate(refundDetail.cardCreatDate)}}/{{$tools.tailor.getDate(refundDetail.activeDate)}}
          </td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">办卡金额</th>
          <td class="col3 bold">{{refundDetail.cardPrice}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">上课情况</th>
          <td class="col3"><a @click="handleSignRecord">{{refundDetail.clasSituation}}({{refundDetail.activDay || 0}}天)</a></td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">扣除课耗/计算方式</th>
          <td class="col3 bold">{{refundDetail.consumePrice}}({{refundDetail.consumePriceRule}})</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">学籍管理费/计算方式</th>
          <td class="col3 bold">{{refundDetail.extraPrice}}({{refundDetail.extraPriceRule}})</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">扣费合计</th>
          <td class="col3 bold">{{refundDetail.deductTotal}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">退费原因</th>
          <td class="col3">{{refundDetail.refundReason}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">是否回访</th>
          <td class="col3 bold">{{refundDetail.refReturn == 'B' ? '是' : '否'}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">备注</th>
          <td class="col3">{{refundDetail.refundRemark}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">上课/办卡分馆</th>
          <td class="col3">{{refundDetail.deptSituation}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">所属顾问</th>
          <td class="col3">{{refundDetail.adviserName}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">大班型/小班型/舞种</th>
          <td class="col3">{{refundDetail.eduType}}/{{refundDetail.dance}}</td>
          <td class="col4"></td>
        </tr>
        <!-- 特殊情况 -->
        <tr>
          <th class="col1 bold" :rowspan="3">特殊情况</th>
          <th class="col2">是否开票</th>
          <td class="col3"><a @click="handleInvoiceManage">开票详情</a></td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">是否转卡</th>
          <td class="col3">
            <a
              v-if="refundDetail.changeStudntCard && refundDetail.changeStudntCard.studentId && refundDetail.changeStudntCard.studentId != refundDetail.studentId"
              @click="handleStudentInfo(refundDetail.changeStudntCard.studentId)"
            >
              {{refundDetail.changeStudntCard.studentName}}
            </a>
            <div v-else>否</div>
          </td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">是否业绩减半扣除</th>
          <td class="col3">{{refundDetail.allowHalfAchievement ? '是' : '否'}}</td>
          <td class="col4"></td>
        </tr>
        <!-- 退费分单情况 -->
        <tr>
          <th class="col1 bold" :rowspan="4">退费分单情况</th>
          <th class="col2">资源来源</th>
          <td class="col3">{{refundDetail.source}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">顾问业绩</th>
          <td class="col3 bold">
            <template v-if="refundDetail.adviserPerList">
              <div v-for="(item, index) in refundDetail.adviserPerList" :key="index">
                {{item.adviserDeptName}}/{{item.adviserName}}/{{item.price}}<span v-if="item.leaveDate">/<span style="color: red">{{item.leaveDate}}</span></span>
              </div>
            </template>
          </td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">导师业绩</th>
          <td class="col3 bold">
            <template v-if="refundDetail.teacherPerList">
              <div v-for="(item, index) in refundDetail.teacherPerList" :key="index">
                {{item.teacherDeptName}}/{{item.teacherName}}/{{item.price}}/{{item.ratio}}%
              </div>
            </template>
          </td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2 bold">业绩合计</th>
          <td class="col3 bold">{{perSum}}</td>
          <td class="col4"></td>
        </tr>
        <!-- 收款人信息 -->
        <tr>
          <th class="col1 bold" :rowspan="5">收款人信息</th>
          <th class="col2">收款人户名</th>
          <td class="col3">{{refundDetail.bankUserName}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">开户行</th>
          <td class="col3">{{refundDetail.bank}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">银行卡号</th>
          <td class="col3">{{refundDetail.bankNo}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">与收款人关系</th>
          <td class="col3">{{refundDetail.userRelate}}</td>
          <td class="col4"></td>
        </tr>
        <tr>
          <th class="col2">备注</th>
          <td class="col3">{{refundDetail.userRelateRemark}}</td>
          <td class="col4"></td>
        </tr>
      </table>
    </div>

    <!--<CardLog ref="cardLog" />-->
    <!--<CardRecord ref="cardRecord" />-->
    <ImagePreview ref="imagePreview" />
    <RefundDetailPrint ref="refundDetailPrint" />
    <RefundModifyRecord ref="refundModifyRecord" />
    <ExpenseRecord ref="expenseRecord" />
    <SignRecord ref="signRecord" />
    <InvoiceManage ref="invoiceManage" />
  </div>
</template>

<script>
  import { CardLog, CardRecord, ImagePreview } from '@/components'
  import RefundDetailPrint from './RefundDetailPrint'
  import RefundModifyRecord from './RefundModifyRecord'
  import ExpenseRecord from './ExpenseRecord'
  import SignRecord from './SignRecord'
  import InvoiceManage from './InvoiceManage'
  import { getRefundDetail } from '@/api/common'
  import { downloadFiles } from '@/api/file'

  export default {
    props: {
      stuCardId: {
        type: String,
        default: null
      },
      finType: {
        type: String,
        default: 'A'
      }
    },
    components: {
      CardLog,
      CardRecord,
      ImagePreview,
      RefundDetailPrint,
      RefundModifyRecord,
      ExpenseRecord,
      SignRecord,
      InvoiceManage
    },
    data() {
      return {
        refundDetail: {}
      }
    },
    filters: {
      cardStateFilter(key) {
        const map = {
          A: '未使用',
          B: '使用中',
          C: '停课',
          D: '退卡',
          E: '结业',
          F: '撤销'
        }
        return map[key]
      }
    },
    computed: {
      perSum() {
        const { adviserPerList, teacherPerList } = this.refundDetail
        let sum = 0
        if (Array.isArray(adviserPerList)) {
          sum = adviserPerList.map(data => data.price).reduce((a, b) => this.$number(a).plus(b), this.$number(0))
        }
        if (Array.isArray(teacherPerList) && sum === 0) {
          sum = teacherPerList.map(data => data.price).reduce((a, b) => this.$number(a).plus(b), this.$number(0))
        }
        return sum
      }
    },
    watch: {
      finType: {
        handler(nv) {
          if (nv) {
            this.getRefundDetail()
          }
        },
        immediate: true
      },
      stuCardId: {
        handler(nv) {
          if (nv) {
            this.getRefundDetail()
          }
        },
        immediate: true
      }
    },
    created() {
    },
    methods: {
      getRefundDetail() {
        const { stuCardId, finType } = this
        getRefundDetail({ stuCardId, finType })
          .then(res => {
            this.refundDetail = res.data || {}
            console.log(this.refundDetail)
          })
          .catch(() => {
            this.refundDetail = {}
          })
      },
      handlePreview(id) {
        this.$refs.imagePreview.open(id)
      },
      handleDownload({ id, fileName }) {
        downloadFiles({ fileId: id }).then(res => {
          const a = document.createElement('a')
          a.download = fileName
          a.href = res.data
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(a.href)
        })
      },
      handlePrint() {
        this.$refs.refundDetailPrint.print(this.refundDetail)
      },
      handleStudentInfo(studentId, tabKey = 1) {
        const href = `${process.env.VUE_APP_WEB_URL}/reception/studentInfo/${studentId}/${tabKey}`
        window.open(href, '_blank')
      },
      handleModifyRecord() {
        const { studentId, studentCardId } = this.refundDetail
        this.$refs.refundModifyRecord.open({ studentId, studentCardId })
      },
      handleExpenseRecord(type) {
        const { studentCardId } = this.refundDetail
        this.$refs.expenseRecord.open({ studentCardId, type })
      },
      handleSignRecord() {
        const { studentCardId } = this.refundDetail
        this.$refs.signRecord.open(studentCardId)
      },
      handleInvoiceManage() {
        const { phone } = this.refundDetail
        this.$refs.invoiceManage.open(phone)
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .upload-wrap {
    display: flex;

    .upload-list {
      display: flex;
      flex-direction: column;
    }
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
      padding: 12px 5px !important;
      border: 1px solid #999;

      &.gray {
        background: #D9D9D9;
      }
    }

    .bold {
      font-weight: bold;
    }

    .col1, .col2 {
      width: 15%;
    }

    .col3, .col4 {
      width: 35%;
    }
  }
</style>
