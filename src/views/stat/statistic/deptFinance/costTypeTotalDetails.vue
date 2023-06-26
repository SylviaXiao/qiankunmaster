<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
    </a-card>
    <a-card :bordered="false">
<!--      <div class="mt10 mb10">-->
<!--        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>-->
<!--      </div>-->
      <a-spin tip="加载中..." :spinning="spinning">
        <div>
          <a-switch  @change="onChange" v-model='switchChecked'/>
          <span class='ml10' >
            <a href="javascript:;" @click='onChange(false)' v-if='switchChecked'>收起全部明细</a>
            <a href="javascript:;" @click='onChange(true)' v-else>展开全部明细</a>
          </span>
        </div>
        <a-table
          ref="table"
          class="mt20"
          :pagination="false"
          :data-source="loadData"
          bordered
          :columns="columns"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
          :expandIconColumnIndex='1'
          :expandIconAsCell="false"
          :scroll='{x:true}'
          childrenColumnName='childrenColumnName'
        >
          <span slot='serviceAmount' slot-scope="text, record,idx">
            <div :style="record.children?'':'background:#efefef;'">
              <div class='flex' style='min-height:52px;'>
                <div style="width:150px;border-right: 1px solid #ededed;line-height: 102px;">
                  <a-icon  style='font-size: 18px;color: #67a8e9;' v-if='record.showDetails' type="minus-square" @click='clapseChange(idx,false)'/>
                  <a-icon  style='font-size: 18px;color: #67a8e9;' v-else  type="plus-square" @click='clapseChange(idx,true)'/>
                  {{record.date}}</div>
                <div style="width:150px;border-right: 1px solid #ededed;line-height: 102px;">{{record.total}}</div>
                <div v-for='(item ,index) in record.operateList' :key='index' style='min-width:200px;border-right: 1px solid #e8e8e8;'>
                  <div style='border-bottom: 1px solid #e8e8e8;padding:15px 0;'>{{item.operateName}}</div>
                  <div style='padding:15px 0; '>
                    <a href="javascript:;" @click="toDetails(record,item.operateName,record.date)" > {{item.price}}</a>
                  </div>
                </div>
            </div>
              <div v-if='record.showDetails'>
                  <div v-for='(col,colIndex) in record.children' style='border-top: 1px solid #ededed;background:#ccc;'>
                    <div class='flex' style='min-height:52px;'>
                <div style="width:150px;border-right: 1px solid #ededed;line-height: 102px;">
                  {{col.date.slice(0,7)}}</div>
                <div style="width:150px;border-right: 1px solid #ededed;line-height: 102px;">{{col.total}}</div>
                <div v-for='(item ,index) in col.operateList' :key='index' style='min-width:200px;border-right: 1px solid #e8e8e8;'>
                  <div style='border-bottom: 1px solid #e8e8e8;padding:15px 0;'>{{item.operateName}}</div>
                  <div style='padding:15px 0; '>
                     <a href="javascript:;" @click="toDetails(record,item.operateName,col.date)" > {{item.price}}</a>
                   </div>
                </div>
            </div>
                  </div>
                </div>
            </div>
          </span>
          <div slot="feeitemListTitle" style="display:flex;line-height:46px;">
            <div style="width:150px;border-right: 1px solid #ededed;">分摊月份</div>
            <div style="width:150px;border-right: 1px solid #ededed;">{{title}}</div>
            <div style='width: calc(100% - 300px);'>经营归类</div>
          </div>
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getAllSysFeeItem, getSchoolList, listOrgDept } from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import { areaOperationData } from '@/api/finance/finance'
import { getSecCost, listCost } from '@/api/table/table'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
export default {
  name: 'deptFinanceCostTypeTotalDetails',
  data() {
    const columns = [
      {
        title: '分摊分馆',
        dataIndex: 'deptName',
        align: 'center',
        width:150
      },
      {
        dataIndex: 'operateNameList',
        ellipsis: true,
        align: 'center',
        scopedSlots: { title: 'feeitemListTitle',customRender: 'serviceAmount' },
        customHeaderCell:(column)=>{
          return {
            style: {
              padding: '0 !important'
            }
          }
        }

      }
    ]
    return {
      switchChecked:false,
      title:'月份合计',
      spinning: false,
      columns: columns,
      //表内容
      loadData: [],
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Month',
          label: '分摊月份',
          placeholder: '请选择时间',
          format: 'YYYY-MM',
          mode: ['month', 'month']
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'deptId',
          label: '分摊校区',
          placeholder: '请选择分摊校区',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'cascader',
          key: 'operateName',
          label: '经营归类',
          placeholder: '请输入经营归类',
          search: true,
          treeOps: {
            api: getAllSysFeeItem,
            label: 'feeItemName',
            value: 'feeItemName',
            children: 'children',
            params: {
              type: 'C'
            }
          }
        },
      ],
      queryParams: {
      },
      //表格是否加载
      rpSpinning: false
    }
  },
  components: {
    ReportTable,
    STable,
    SearchComPro
  },
  created() {
    this.initSearchParams()
    this.initData()
  },
  methods: {
    onChange(e){
      this.switchChecked=e
      this.loadData.forEach(item=>{
        item.showDetails=e
      })
    },
    clapseChange(idx,flag){
      this.loadData[idx].showDetails=flag
      this.$forceUpdate()
    },
    initSearchParams() {
      let {  endDate, startDate,id,type } = this.$route.query
      // this.title=type||'月份合计'
      // this.queryParams.type=type==='月份合计'?'A':type==='本馆支出'?'B':type==='总部分摊'?'C':type==='区域分摊'?'D':type==='广告费'?'E':''
      if(endDate&& startDate){
        this.queryParams.startDate = startDate
        this.queryParams.endDate = endDate
        this.searchParams[0].defaultVal=[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      }
      if(id){
        this.queryParams.deptId = id
        this.searchParams[1].defaultVal=id.split(',')
      }
      this.$forceUpdate()
      this._refreshTable()
    },
    toDetails(record,costType,d){
      let date = d.split('~')
      let startDate = date[0]+'-01'
      let endDate = moment(date[1],"YYYY-MM")
        .add(1, 'months')
        .date(0)
        .format('YYYY-MM-DD')
      this.$router.push({
        name: 'deptFinanceSecondDetails',
        params: { type: 'costPrice' },
        query: {
          id: record.deptId,
          costType:costType,
          startDate: startDate,
          endDate: endDate
        }
      })
      // const { href } = this.$router.resolve({
      //   name: 'deptFinanceSecondDetails',
      //   params: { type: 'costPrice' },
      //   query: {
      //     id: record.deptId,
      //     costType:costType,
      //     startDate: startDate,
      //     endDate: endDate
      //   }
      // })
      //结合open打开新的页面
      // window.open(href, '_blank')
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      let exportUrl = '/finance/salarycheck/downCost'
      const queryParam = this.queryParams
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
    initData() {
      this.spinning = true
      let that = this
      let { type } = this.$route.query
      this.queryParams.type=type==='月份合计'?'A':type==='本馆支出'?'B':type==='总部分摊'?'C':type==='区域分摊'?'D':type==='广告费'?'E':''
      listCost(this.queryParams).then(res => {
          let loadData = res.data
          that.loadData = loadData
        that.spinning = false
      })
    },
    searchSubmit(data, reset) {
      if (reset == 'isReset') {
        this.initSearchParams()
      }else{
        this.queryParams = data
        if(data.startMonth){
          this.queryParams.startDate = data.startMonth+'-01'
          let endDate = moment(data.endMonth,"YYYY-MM")
            .add(1, 'months')
            .date(0)
            .format('YYYY-MM-DD')
          this.queryParams.endDate =endDate
          delete this.queryParams.startMonth
          delete this.queryParams.endMonth
        }
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.initData()
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-table-thead > tr > th .ant-table-header-column {
  display: block;
}
/deep/.ant-table-tbody > tr > td, .ant-table-thead > tr > th {
  padding: 0 !important;
}
</style>
