<template>
  <div class="previous-stu-wrapper">
    <a-card class="card" :bordered="false" title="旧系统学员录入">
      <a-row :gutter="32">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
          <StudentForm ref="studentForm" :studentData="studentData" @hasCards="setUserPaidList" :routerId="routerId" :is-apply="true"></StudentForm>
        </a-col>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
          <header v-if="!showStuTable" class="paidHeader">开卡记录:</header>
          <a-table :columns="userColumns" :dataSource="userPaidList" :pagination="false" rowKey="id" size="small"> </a-table>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="card" :bordered="false">
      <a-button icon="plus-circle" @click="setValForTable(false)" style="margin-bottom: 10px;">新增</a-button>
      <a-table :columns="saleColumns" class="stuApplyTable" size="default" :dataSource="tableList" :pagination="false" rowKey="key">
        <span slot="cardName" slot-scope="text, record">
          <span class="show-disabled">
            <search-input type="card" :index="record.key" @select="getBackData" placeholder="请选择卡种" />
          </span>
        </span>
        <span slot="classRoom" slot-scope="text, record">
          <span class="show-disabled">
            <search-input
              type="class"
              @select="setClassName"
              :card-values="record.cardValues"
              :index="record.key"
              :initInput="record.classId === ''"
              :disabled="!record.deptCardId"
              :searchIcon="record.deptCardId ? true : false"
              :placeholder="!record.deptCardId ? '请选择卡种' : '请选择班级'"
              :queryParam="{ danceId: record.danceId, typeId: record.typeId, classTypeId: record.classTypeId }"
            ></search-input>
          </span>
        </span>
        <span slot="originalPrice" slot-scope="text, record">
          <span style="min-width: 100px;display: inline-block;">{{ record.originalPrice || 0 }}元</span>
        </span>
        <span slot="paidPrice" slot-scope="text, record">
          <a-input-number :min="0" :max="1000000" v-model="record.paidPrice" style="min-width: 80px;" />
        </span>
        <span slot="remainCount" slot-scope="text, record">
          <a-input-number :min="0" :max="10000" v-model="record.remainCount" style="width: 60px;" />
        </span>
        <span slot="totalCount" slot-scope="text, record">
          <a-input-number :min="0" :max="10000" v-model="record.totalCount" style="width: 60px;" />
        </span>
        <span slot="totalPrice" slot-scope="text, record">
          <a-input-number :min="0" :max="1000000" v-model="record.totalPrice" style="min-width: 80px;" />
        </span>
        <span slot="startDate" slot-scope="text, record">
          <a-date-picker style="width: 120px;" v-model="record.startDateMoment" />
        </span>
        <span slot="endDate" slot-scope="text, record">
          <a-date-picker style="width: 120px;" v-model="record.endDateMoment" />
        </span>
        <span slot="remark" slot-scope="text, record">
          <a-input v-model="record.remark" style="width: 100px;" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" style="min-width: 40px;display: inline-block;" @click="removeList(record)">删除</a>
        </span>
      </a-table>
    </a-card>
    <perm-box perm="student:info:period">
      <a-button type="primary" @click="sendForm()" :loading="loading">提交</a-button>
    </perm-box>
  </div>
</template>

<script>
import { savePastPeriodStudent } from '@/api/recep'
import { CardModal, SettleAccount, Result, ChooseTable, SearchInput, PaymentCount } from '@/components'
import StudentForm from './modules/StudentForm.vue'
import PermBox from '@/components/PermBox'
import moment from 'moment'

const userColumns = [
  {
    title: '卡种名称',
    dataIndex: 'cardName'
  },
  {
    title: '上课分馆',
    dataIndex: 'deptName'
  },
  {
    title: '办卡时间',
    dataIndex: 'createDate'
  },
  {
    title: '总金额(元)',
    dataIndex: 'totalPrice'
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: text => {
      return text === 'A'
        ? '未使用'
        : text === 'B'
        ? '使用中'
        : text === 'C'
        ? '停课'
        : text === 'D'
        ? '退卡'
        : text === 'E'
        ? '结业'
        : text === 'F'
        ? '撤销'
        : ''
    }
  }
]
const saleColumns = [
  {
    title: '卡种',
    dataIndex: 'cardName',
    width: 200,
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '班级',
    dataIndex: 'classRoom',
    width: 200,
    scopedSlots: { customRender: 'classRoom' }
  },
  {
    title: '单价',
    dataIndex: 'originalPrice',
    width: 80,
    scopedSlots: { customRender: 'originalPrice' }
  },
  {
    title: '剩余次数',
    dataIndex: 'remainCount',
    width: 100,
    scopedSlots: { customRender: 'remainCount' }
  },
  {
    title: '总次数',
    dataIndex: 'totalCount',
    width: 100,
    scopedSlots: { customRender: 'totalCount' }
  },
  {
    title: '剩余金额',
    dataIndex: 'paidPrice',
    width: 100,
    scopedSlots: { customRender: 'paidPrice' }
  },
  {
    title: '办卡金额',
    dataIndex: 'totalPrice',
    width: 100,
    scopedSlots: { customRender: 'totalPrice' }
  },
  {
    title: '开卡时间',
    dataIndex: 'startDate',
    width: 150,
    scopedSlots: { customRender: 'startDate' }
  },
  {
    title: '截止时间',
    dataIndex: 'endDate',
    width: 150,
    scopedSlots: { customRender: 'endDate' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'previousStu',
  components: {
    StudentForm,
    PermBox,
    SearchInput
  },
  watch: {
    $route(nv, ov) {
      const _this = this
      const {
        name,
        query: { stuId }
      } = nv
      const { firstEnter } = this
      if (!stuId) return
      if (name !== 'previousStu') return
      if (this.routerId == stuId) return
      if (firstEnter) {
        // console.log('第二次進頁面')
        if (stuId) {
          this.routerId = stuId
        } else {
          this.routerId = null
          this.resetAllForm()
        }
      } else {
        this.routerId = stuId
      }
    }
  },
  data() {
    return {
      //stuInfo
      userColumns,
      studentData: {},
      routerId: null,
      showStuTable: true,
      userPaidList: [],

      //cardTable
      saleColumns,
      tableList: [],
      formValues: {},
      loading: false
    }
  },
  created() {
    const {
      $route: {
        meta: { keepAlive }
      }
    } = this
    !keepAlive ? (this.$route.meta.keepAlive = true) : ''
    this.hasStuId()
  },
  methods: {
    hasStuId() {
      if (this.$route.query && this.$route.path.indexOf('stuApply') !== -1) {
        this.routerId = this.$route.query.stuId
      }
    },
    setUserPaidList(data) {
      const { student, studentCards } = data
      //传给settleAcount组件
      this.studentInfo = student
      this.studentData = student
      this.formValues.id = student.id
      this.formValues.stuUserId = student.stuUserId || null
      if (studentCards) {
        this.showStuTable = true
        this.userPaidList = studentCards
      } else {
        this.showStuTable = false
        this.userPaidList = []
      }
    },
    setValForTable(give) {
      const { tableList } = this
      const key = tableList.length
      const tableItem = {
        cardName: '', //卡名
        deptCardId: null, //卡ID
        className: '', //班级名称
        classId: null, //班级id
        originalPrice: 0, //单价
        remainCount: 0, //剩余次数
        totalCount: 0, //总次数
        paidPrice: 0, //剩余金额
        totalPrice: 0, //总金额金额
        startDate: null, //开卡时间
        startDateMoment: null, //开卡时间
        endDate: null, //结束时间
        endDateMoment: null, //结束时间
        key: key,
        give: give
      }
      this.tableList = [...tableList, tableItem]
    },

    setClassName(res) {
      const { id, className, key } = res
      this.tableList[key].classId = id
      this.tableList[key].className = className
    },
    getBackData(value) {
      const { id = '', deptPrice = 0, danceId = '', typeId = '', cardTypeId = '', key } = value
      const { tableList } = this
      tableList[key].deptCardId = id
      tableList[key].originalPrice = deptPrice
      tableList[key].shouldPay = deptPrice
      tableList[key].danceId = danceId
      tableList[key].typeId = typeId
      tableList[key].classTypeId = cardTypeId
      tableList[key].classId = ''
      tableList[key].cardValues = { value: value }
    },
    getTotalPrice(data) {
      let { count = 1, paidPrice, originalPrice, discount = 100 } = data

      data.totalPrice = count * ~~originalPrice
      if (~~data.totalPrice < ~~paidPrice) {
        this.$notification['error']({
          message: '系统通知',
          description: '优惠金额不能大于总金额！'
        })
        data.paidPrice = 0
      }
      data.shouldPay = ~~data.totalPrice - ~~data.paidPrice
    },
    removeList(data) {
      const {
        tableList,
        tableList: { length },
        setListNo
      } = this
      const { key } = data
      for (let i = length - 1; i >= 0; i--) {
        if (i === key) {
          tableList.splice(i, 1)
          setListNo()
        }
      }
    },
    setListNo() {
      const { tableList } = this
      tableList.map((item, idx) => {
        item.key = idx
      })
    },
    pageChange(data) {
      data.previous = true
      return new Promise((resolve, reject) => {
        const {
          $route: { fullPath }
        } = this
        this.$router.push({ path: `/reception/stuApplyResult/${JSON.stringify(data)}` })
        resolve(fullPath)
      })
    },

    getstudentInfo() {
      let studentInfo
      return new Promise((resolve, reject) => {
        this.$refs.studentForm.validateData().then(() => {
          studentInfo = Object.assign(this.formValues, this.$refs.studentForm.handleOk())
          this.routerId ? (studentInfo.stuUserId = this.routerId) : ''
          resolve(studentInfo)
        })
      })
    },

    sendForm() {
      let data = {}
      const priceList = this.tableList
      priceList.forEach(item => {
        item.startDateMoment ? (item.startDate = this.$tools.tailor.getDate(item.startDateMoment)) : ''
        item.endDateMoment ? (item.endDate = this.$tools.tailor.getDate(item.endDateMoment)) : ''
        delete item.cardValues
      })
      data.stuCards = JSON.stringify(priceList)

      this.getstudentInfo()
        .then(info => {
          this.loading = true
          data = Object.assign(data, info)
          return data
        })
        .then(savePastPeriodStudent)
        .then(res => {
          if (res.code === 200) {
            this.pageChange(data).then(fullPath => this.$multiTab.close(fullPath))
          }
        })
        .finally(() => (this.loading = false))
    },
    resetAllForm() {
      //重置学员信息
      if (this.$refs.studentForm) {
        this.$refs.studentForm.resetForm()
      }
      //重置缴费
      if (this.$refs.settleAccount) {
        this.$refs.settleAccount.resetForm()
      }
      //重置卡种列表
      this.resetPriceForm()
    }
  }
}
</script>

<style scoped lang="less">
.card {
  margin-bottom: 15px;
}
</style>
