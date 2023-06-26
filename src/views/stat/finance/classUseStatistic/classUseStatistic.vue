<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
    </a-card>
    <a-card :bordered="false">
      <div class="mt10 mb10">
        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
      </div>
      <a-spin tip="加载中..." :spinning="spinning">
        <s-table
          ref="table"
          :columns="columns"
          :data="loadData"
          rowKey="id"
        >
          <span slot="deptName" slot-scope="text, record">
             <a  href="javascript:;"  @click="toDetail(record)">{{text}}</a>
          </span>
        </s-table>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import { roomUseShoolStat } from '@/api/table/table'
import { listAllByAreaDept } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
export default {
  name: 'classUseStatistic',
  data() {
    const columns = [
      {
        title: '日期',
        dataIndex: 'startDate',
        align: 'center',
        width:50,
        customRender: (text, record) => {
          return text.slice(0,10) + '—'+record.endDate.slice(0,10)
        }
      },
      {
        title: '分馆',
        dataIndex: 'deptName',
        align: 'center',
        width:260,
        scopedSlots: { customRender: 'deptName' },
      },
      {
        title: '使用',
        dataIndex: 'useDuration',
        align: 'center',
        width:180,
      },
      {
        title: '未使用',
        dataIndex: 'unusedDuration',
        align: 'center',
        width:260,
      },
      {
        title: '教室数量',
        dataIndex: 'classNum',
        align: 'center',
        width:180,
      },
    ]
    return {
      spinning: false,
      columns: columns,
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '操作日期',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'schoolIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          show: true,
          treeOps: {
            api: listAllByAreaDept,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
      ],
      queryParams: {
        startDate: defaultStart,
        endDate: defaultEnd,
      },
      //表格是否加载
      rpSpinning: false,
      //表内容
      loadData: parameter => {
        return roomUseShoolStat(Object.assign(parameter, this.queryParams)).then(res => {
          return res
        })
      },
    }
  },
  components: {
    STable,
    SearchComPro
  },
  created() {
  },
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/class/roomUseShoolStatDown'
      const queryParam = this.queryParams
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k !== 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
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
    searchSubmit(data, reset) {
      this.queryParams = data
      if (reset === 'isReset') {
        this.queryParams.startDate = defaultStart
        this.queryParams.endDate = defaultEnd
      }
      this._refreshTable()
    },
    _refreshTable() {
      if(this.$refs.table)this.$refs.table.refresh()
    },
    toDetail(data) {
      let { endDate, startDate } = this.queryParams
      let id =data.deptId
      const { href } = this.$router.resolve({
        name: 'classUseStatisticDetailsClass',
        params: {startDate: startDate, endDate: endDate, id: id },
      })
      //结合open打开新的页面
      window.open(href, '_blank')
    }
  }
}
</script>

<style scoped lang="less">
.priceText {
  padding: 3px;
  min-width: 180px;
  // height: 90px;
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
