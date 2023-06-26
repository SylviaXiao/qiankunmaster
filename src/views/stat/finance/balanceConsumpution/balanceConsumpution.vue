<template>
  <div class="fin-profit-paytype-wrapper">
    <!-- <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      @onShowSizeChange="onShowSizeChange"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :total="total"
      :showPagination="true"
      :isMerge="true"
      :hideReset="false"
      :exportUrl="'/student/card/consume/balanceDown'"
    ></ReportTable> -->
    <div ref="elementSearch" :style="{ padding: '20px 0' }">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams"> </search-com-pro>
      </a-card>
    </div>
    <div class="mb20">
      <a-card :bordered="false">
        <div>
          <div class="totalTitle">消耗金额汇总</div>
          <div style="display:flex;">
            <div class="priceText" v-for="(item, index) in totalListall" :key="index">
              {{ item.title }}
              <div class="totalPrice">{{ item.value }}</div>
            </div>
          </div>
        </div>
        <!-- <div>
          <div class="totalTitle">消耗金额当前页面合计</div>
          <div style="display:flex;">
            <div class="priceText" v-for="(item, index) in totalListNow" :key="index">
              {{ item.title }}
              <div class="totalPrice">{{ item.value }}</div>
            </div>
          </div>
        </div> -->
      </a-card>
    </div>
    <div class="table-wrapper">
      <a-card :bordered="false">
        <div class="mt10 mb10">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </div>
        <s-table
          ref="table"
          size="default"
          :pageSizeOptions="pageSizeOptions"
          :columns="columns"
          :data="loadData"
          :rowKey="(record, index) => index"
          :scroll="{ x: true }"
        >
          <span slot="beginRemainAmount" slot-scope="text, record">
            <a href="javascript:;" @click="toDetail(record, 'beginRemainAmount')">{{ text }}</a>
          </span>
          <span slot="consumeAmount" slot-scope="text, record">
            <a href="javascript:;" @click="toDetail(record, 'consumeAmount')">{{ text }}</a>
          </span>
        </s-table>
      </a-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import { consumeBalance, consumeBalanceStat } from '@/api/table/table'
import { listEduDance, listEduType } from '@/api/common'
import { pageSizeOptions } from '@/utils/tableDetails/details'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
const date = new Date()
const defaultStart = moment(date)
  .subtract(1, 'months')
  .startOf('month')
  .format('YYYY-MM-DD')

// moment(date)
//   .date(1)
//   .format('YYYY-MM-DD')
const defaultEnd = moment(date)
  .subtract(1, 'months')
  .endOf('month')
  .format('YYYY-MM-DD')

// moment()
//   .add(1, 'months')
//   .date(0)
//   .format('YYYY-MM-DD')

export default {
  name: 'balanceConsumpution',
  data() {
    const tatalList = [
      {
        title: '期初次数/期初消耗金额',
        dataIndex: 'beginCount',
        value: '0/0'
      },
      {
        title: '期初',
        dataIndex: 'beginRemainAmount',
        value: 0
      },
      {
        title: '增加',
        dataIndex: 'addAmount',
        value: 0
      },
      {
        title: '消耗',
        dataIndex: 'consumeAmount',
        value: 0
      },
      {
        title: '余额',
        dataIndex: 'balance',
        value: 0
      }
    ]
    const tatalListAll = [
      {
        title: '期初次数/期初消耗金额',
        dataIndex: 'sumbeginCount',
        value: '0/0',
        formatValue: this.getSumBeginCount
      },
      {
        title: '期初',
        dataIndex: 'sumbeginRemainAmount',
        value: 0
      },
      {
        title: '增加',
        dataIndex: 'sumaddAmount',
        value: 0
      },
      {
        title: '消耗',
        dataIndex: 'sumconsumeAmount',
        value: 0
      },
      {
        title: '余额',
        dataIndex: 'sumbalance',
        value: 0
      }
    ]
    const columns = [
      {
        title: '办卡分馆',
        dataIndex: 'applyDeptName'
      },
      {
        title: '上课分馆',
        dataIndex: 'classDeptName'
      },
      {
        title: '学员',
        dataIndex: 'stuName'
      },
      {
        title: '学员手机号',
        dataIndex: 'stuPhone'
      },
      {
        title: '卡号',
        dataIndex: 'cardNo'
      },
      {
        title: '卡类型',
        dataIndex: 'cardType',
        customRender: (text, record) => {
          if (text == 'A') {
            return '次卡'
          } else if (text == 'B') {
            return '时卡'
          }
          return ''
        }
      },
      {
        title: '大班型',
        dataIndex: 'typeName'
      },
      {
        title: '小班型',
        dataIndex: 'classTypeName'
      },
      {
        title: '舞种',
        dataIndex: 'danceName'
      },
      {
        title: '期初次数/期初消耗金额',
        dataIndex: 'beginCount',
        customRender: (text, record) => {
          return record.beginCount + '/' + record.beginConsumeAmount
        }
      },
      {
        title: '期初',
        dataIndex: 'beginRemainAmount',
        scopedSlots: { customRender: 'beginRemainAmount' }
      },
      {
        title: '增加',
        dataIndex: 'addAmount'
      },
      {
        title: '消耗',
        dataIndex: 'consumeAmount',
        scopedSlots: { customRender: 'consumeAmount' }
      },
      {
        title: '退费',
        dataIndex: 'returnAmount'
      },
      {
        title: '结转',
        dataIndex: 'transferAmount'
      },
      {
        title: '余额',
        dataIndex: 'balance'
      }
    ]
    return {
      totalListall: tatalListAll,
      totalListNow: tatalList,
      pageSizeOptions: pageSizeOptions,
      columns,
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: [
            {
              label: '办卡分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '上课分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '学员',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '卡号',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '大班型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '小班型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '舞种',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '期初次数/期初消耗金额',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '期初',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '增加',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '消耗',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '余额',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            }
          ]
        }
      ],
      //表内容字段
      headList: [
        {
          key: 'applyDeptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'classDeptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'stuName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'cardNo',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'typeName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'classTypeName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'danceName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'beginCount',
          value: '',
          isTotal: false,
          isClick: false,
          formatValue: this.getBeginCount
        },
        {
          key: 'beginRemainAmount',
          value: 0,
          isTotal: true,
          isClick: true
        },
        {
          key: 'addAmount',
          value: '',
          isTotal: false,
          clearTotal: true,
          isClick: false
        },
        {
          key: 'consumeAmount',
          value: 0,

          isTotal: true,
          isClick: true
        },
        {
          key: 'balance',
          value: 0,
          isTotal: true,
          isClick: false
        }
      ],
      datalength: 0,
      //表内容
      loadData: parameter => {
        return consumeBalance(Object.assign(parameter, this.queryParam)).then(res => {
          this.datalength = res.data.length
          // if (Array.isArray(res.data) && res.data.length > 0) {
          //   this.totalListNow.forEach(item => {
          //     if (item.dataIndex == 'beginCount') {
          //       let a = res.data.reduce((sum, c) => (c[item.dataIndex] || 0) + sum, 0).toFixed(2)
          //       let b = res.data.reduce((sum, c) => (c['beginConsumeAmount'] || 0) + sum, 0).toFixed(2)
          //       item.value = a + '/' + b
          //     } else {
          //       item.value = res.data.reduce((sum, c) => (c[item.dataIndex] || 0) + sum, 0).toFixed(2)
          //     }
          //   })
          // }
          return res
        })
      },
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Month',
          label: '操作时间',
          placeholder: '请选择月份',
          format: 'YYYY-MM',
          show: true,
          mode: ['month', 'month'],
          defaultVal: [moment(defaultStart, 'YYYY-MM'), moment(defaultEnd, 'YYYY-MM')]
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'applyDeptId',
          label: '办卡分馆',
          placeholder: '请选择办卡分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'classDeptId',
          label: '上课分馆',
          placeholder: '请选择上课分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select', //动态select框
          key: 'eduType',
          label: '大班型',
          placeholder: '请选择大班型',
          show: true,
          mode: 'multiple',
          apiOption: {
            api: listEduType, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          label: '舞种',
          mode: 'multiple',
          show: true,
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'text',
          key: 'stuName',
          label: '学员姓名',
          show: true,
          placeholder: '请输入学员姓名'
        },
        {
          type: 'text',
          key: 'cardNo',
          label: '卡号',
          placeholder: '请输入卡号'
        },
        {
          type: 'number',
          key: 'stuPhone',
          label: '学员手机号',
          placeholder: '请输入学员手机号'
        },
        {
          type: 'text',
          key: 'eduCardId',
          label: '选择卡种',
          placeholder: '请输入卡种'
        },
        {
          type: 'select', // 静态select框
          key: 'cardType',
          label: '卡类型',
          placeholder: '请选择卡类型',
          staticArr: [
            {
              string: '次卡',
              value: 'A'
            },
            {
              string: '时卡',
              value: 'B'
            }
          ]
        }
      ],
      queryParam: {
        startDate: defaultStart,
        endDate: defaultEnd
      },
      //表格是否加载
      rpSpinning: false,
      total: 0
    }
  },
  components: {
    ReportTable,
    STable,
    SearchComPro
  },
  created() {
    this.isSchoolId()
    this.getTotalList()
  },
  methods: {
    async getTotalList() {
      let res = await consumeBalanceStat(this.queryParam)
      this.totalListall.forEach(item => {
        if (item.formatValue) {
          item.value = item.formatValue(res.data)
        } else {
          item.value = res.data[item.dataIndex]
        }
      })
    },
    //导出
    downloadStu() {
      let exportUrl = '/student/card/consume/balanceDown'
      const queryParam = this.queryParam
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k != 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },
    renderContent(value, row, index) {
      const obj = {
        children: value,
        attrs: {}
      }
      if (index === this.datalength.length) {
        obj.attrs.colSpan = 0
      }
      return obj
    },
    getSumBeginCount(record) {
      return record.sumbeginCount + '/' + record.sumbeginConsumeAmount
    },
    getBeginCount(record) {
      return record.beginCount + '/' + record.beginConsumeAmount
    },
    isSchoolId() {
      const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
      if (userSchoolId && userSchoolId.length > 0) {
        this.searchParams.forEach((item, index) => {
          if (item.key == 'schoolId') {
            this.searchParams.splice(index, 1)
          }
        })
        this.queryParam.schoolId = userSchoolId.map(item => item.deptId).join(',')
      }
    },
    async init(data) {
      // this.rpSpinning = true
      // this.headList.forEach((col, colIndex) => {
      //   if (col.isTotal) col.value = 0
      // })
      let res = await consumeBalance(data)
      this.loadData = res.data
      return
      this.total = res.count
      if (Array.isArray(res.data) && res.data.length > 0) {
        let loadData = []
        res.data.forEach((item, index) => {
          let data = []
          this.headList.forEach((col, colIndex) => {
            if (col.isTotal) col.value += item[col.key] ? Number(item[col.key]) : 0
            let dataItem = {
              key: col.key,
              label: col.formatValue ? col.formatValue(item) : item[col.key],
              rowspan: 1,
              colspan: 1,
              style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isClick,
              id: item.id,
              beginRemainAmount: item.beginRemainAmount
            }
            data.push(dataItem)
          })
          loadData.push({
            style: 'background:#fff;',
            data: JSON.parse(JSON.stringify(data))
          })
        })
        let total = []
        this.headList.forEach((col, colIndex) => {
          if (colIndex == 0 || col.isTotal || col.clearTotal) {
            let totalData = {
              key: col.key,
              label: col.value,
              rowspan: 1,
              colspan: colIndex == 0 ? 8 : 1,
              style: '',
              isClick: false,
              id: '',
              beginRemainAmount: ''
            }
            if (col.isTotal) totalData.label = Number(col.value).toFixed(2)
            total.push(totalData)
          }
        })
        total[0].label = '总计'
        total[0].isClick = false
        loadData.push({
          style: 'background:#fff;',
          data: JSON.parse(JSON.stringify(total))
        })
        this.loadData = JSON.parse(JSON.stringify(loadData))
      } else {
        this.loadData = []
      }
      this.rpSpinning = false
    },
    onShowSizeChange(data) {
      this.queryParam = Object.assign(this.queryParam, data)
      this.init(this.queryParam)
    },
    getMonth(date) {
      var date = new Date(date)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = new Date(year, month, 0)
      return day.getDate()
    },
    searchSubmit(data) {
      let { Month, startMonth, endMonth } = data
      let startDate = startMonth ? startMonth + '-01' : Month ? Month[0].format('YYYY-MM-DD') : defaultStart
      let endDate = endMonth ? endMonth : Month ? Month[1].format('YYYY-MM') : defaultEnd.slice(0, 7)
      this.queryParam = data
      let date = this.getMonth(endDate + '-01')
      if (startDate) this.queryParam.startDate = startDate
      if (endDate) this.queryParam.endDate = endDate + '-' + date
      if (this.queryParam.Month) delete this.queryParam.Month
      if (this.queryParam.startMonth) delete this.queryParam.startMonth
      if (this.queryParam.endMonth) delete this.queryParam.endMonth
      this._refreshTable()
      // this.init(this.queryParam)
    },
    _refreshTable() {
      this.$refs.table.refresh()
      this.getTotalList()
    },
    toDetail(data, key) {
      let { endDate, startDate } = this.queryParam
      this.$router.push({
        name: 'balanceConsumputionDetail',
        params: { type: key, startDate: startDate, endDate: endDate, id: data.id, beginRemainAmount: data.beginRemainAmount }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.priceText {
  padding: 3px;
  min-width: 180px;
  // height: 90px;
  background-color: #fff;
  margin-right: 15px;
  font-size: 14px;
}
.totalPrice {
  margin-left: 50px;
  // margin-top: 10px;
  font-weight: bold;
  font-size: 17px;
}
.totalTitle {
  background: #f7fbff;
  padding: 5px;
  font-weight: 700;
}
</style>
