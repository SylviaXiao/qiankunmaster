<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
    </a-card>
    <a-card :bordered="false">
      <div class="mt10 mb10 flex">
        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
        <div style='width: 100%;margin-left: 20px;'>
          <div class="totalTitle flex">
            <span class='mr20'>
                 <a  href="javascript:;"  @click="toDetail(dataList,true)">总计</a>
            </span>
            <div style="display:flex;"  >
              <div class="priceText" >
                签到次数:{{totalCount.toFixed(2)}}
              </div>
              <div class="priceText" >
                总时数:{{totalTime.toFixed(2)}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-spin tip="加载中..." :spinning="spinning">
        <s-table
          ref="table"
          :columns="columns"
          :data="loadData"
          rowKey="id"
        >
          <span slot="teacherName" slot-scope="text, record">
             <a  href="javascript:;"  @click="toDetail(record,false)">{{text}}</a>
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
import { pageSignStat } from '@/api/table/table'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
export default {
  name: 'masterClassManage',
  data() {
    const columns = [
      {
        title: '导师名称',
        dataIndex: 'teacherName',
        align: 'center',
        width:50,
        scopedSlots: { customRender: 'teacherName' },
      },
      {
        title: '签到次数',
        dataIndex: 'signCount',
        align: 'center',
        width:260,
      },
      {
        title: '总时数',
        dataIndex: 'signTime',
        align: 'center',
        width:180,
        customRender: (text, record) => {
          return text+'H'
        }
      },
    ]
    return {
      spinning: false,
      columns: columns,
      totalCount:0,
      totalTime:0,
      dataList:[],
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '签到日期',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'text',
          key: 'teacherName',
          show: true,
          label: '导师名称',
          placeholder: '请输入导师名称',
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
        return pageSignStat(Object.assign(parameter, this.queryParams)).then(res => {
          this.totalCount=0
          this.totalTime=0
          this.dataList=[]
          if(Array.isArray(res.data)&&res.data.length>0){
            res.data.forEach(item=>{
              this.totalCount+=Number(item.signCount)
              this.totalTime+=Number(item.signTime)
            })
            this.dataList=res.data
          }
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
      let exportUrl = '/class/signStatDown'
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
    toDetail(data,total) {
      let { endDate, startDate } = this.queryParams
      let id =data.teacherId
        if(total){
          id='A'
        }
      const { href } = this.$router.resolve({
        name: 'masterClassManageDetails',
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
