<template>
  <div class="fin-profit-paytype-wrapper">
<!--    <ReportTable-->
<!--      @searchSubmit="searchSubmit"-->
<!--      @toDetail="toDetail"-->
<!--      @onShowSizeChange="onShowSizeChange"-->
<!--      :headData="headData"-->
<!--      :rpSpinning="rpSpinning"-->
<!--      :searchParamsArray="searchParams"-->
<!--      :loadData="loadData"-->
<!--      :total="total"-->
<!--      :autoLoad="false"-->
<!--      :showPagination="false"-->
<!--      :hideReset='false'-->
<!--      :exportUrl="'/education/coachplan/downCoachPlan'"-->
<!--    ></ReportTable>-->
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="table-wrapper">
        <div class="mt10 mb10 flex" style="justify-content:space-between;">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </div>
        <s-table ref="table" :columns="columns" :defaultPagination="true" :data="loadData">>
          <span slot="num" slot-scope="text, record">
            <a href='#' @click="toDetail(record)">{{text}}</a>
          </span>
        </s-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listCoachPlan, pageCoachPlan } from '@/api/table/table'
import Vue from 'vue'
import { listEduDance, treeEduClassType } from '@/api/common'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import PermBox from '@/components/PermBox'
let columns = [
  {
  title: '上课分馆',
  dataIndex: 'deptName',
  key: 'deptName',
    align:'center',
  width: 140
},
  {
    title: '班型',
    dataIndex: 'eduTypeName',
    key: 'eduTypeName',
    align:'center',
    width: 140,
    customRender: (text, record) => {
      return text+'/'+record.eduClassTypeName
    }
  },
  {
    title: '未使用卡数量',
    dataIndex: 'num',
    align:'center',
    key: 'num',
    width: 140,
    scopedSlots: { customRender: 'num' },
  }
  ]
export default {
  name: 'teacherClass',
  data() {
    return {
      columns: columns,
      //表内容
      loadData: parameter => {
        return listCoachPlan(this.queryParam).then(res => {
          return res
        })
      },
      //搜索项
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          show: true,
          key: 'schoolDeptId',
          label: '上课分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
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
          show: true,
          key: 'eduTypeId',
          label: '班型',
          placeholder: '请选择班型',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: treeEduClassType,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'treeSelect',
          isShow: true,
          show: true,
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: listEduDance,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text',
          key: 'adviserName',
          label: '顾问',
          show: true,
          placeholder: '请输入顾问名称'
        },
        {
          type: 'date',
          key: 'Month',
          label: '预计上课时间',
          placeholder: '请选择时间',
          show: true,
          format: 'YYYY-MM',
          mode: ['month', 'month']
        },
        {
          type: 'select', // 静态select框
          key: 'payoff',
          label: '是否缴清',
          placeholder: '请选择状态',
          show: true,
          staticArr: [
            {
              string: '已缴清',
              value: 'Y'
            },
            {
              string: '未缴清',
              value: 'N'
            }
          ]
        },
        {
          type: 'date',
          key: 'Date',
          label: '办卡时间',
          isShow: true,
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
      ],
      queryParam: {},
      //表格是否加载
      rpSpinning: false,
      total: 0,
    }
  },
  components: {
    SearchComPro,
    PermBox,
    STable
  },
  created() {
  },
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/education/coachplan/downCoachPlan'
      const queryParam = this.queryParam
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k != 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      if (this.$store.getters.school_id)fields.push({ name: 'school_id', value: this.$store.getters.school_id })
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
    // async init(data) {
    //   this.rpSpinning = true
    //   this.headList.forEach((col, colIndex) => {
    //     if (col.isTotal) col.value = 0
    //   })
    //   let res = await listCoachPlan(data)
    //   this.total = res.count
    //   if (Array.isArray(res.data) && res.data.length > 0) {
    //     let loadData = []
    //     res.data.forEach((item, index) => {
    //       let data = []
    //       this.headList.forEach((col, colIndex) => {
    //         console.log(111,item.eduTypeName , item.eduClassTypeName)
    //         if (col.isTotal) col.value += item[col.key]
    //         let dataItem = Object.assign( item,
    //           {
    //           eduTypeName : item.eduTypeName + item.eduClassTypeName,
    //           key: col.key,
    //           label: item[col.key],
    //           rowspan: 1,
    //           colspan: 1,
    //           style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
    //           isClick: col.isClick,
    //         })
    //         data.push(dataItem)
    //       })
    //       loadData.push({
    //         style: 'background:#fff;',
    //         data: JSON.parse(JSON.stringify(data))
    //       })
    //     })
    //     this.loadData = JSON.parse(JSON.stringify(loadData))
    //   } else {
    //     this.loadData = []
    //   }
    //   this.rpSpinning = false
    // },
    // onShowSizeChange(data) {
    //   this.queryParam = Object.assign(this.queryParam, data)
    //   this.init(this.queryParam)
    // },
    searchSubmit(data,reset) {
      // if(reset){
      //   this.loadData=[]
      //   this.headData[0].data[3].label='即将到期学员人数'
      //   this.queryParam={
      //     endExpire: 30,
      //     startExpire: 1,
      //     type: "A"
      //   }
      //   return
      // }
      // if(data.type){
      //   this.headData[0].data[3].label=data.type==='A'?'即将到期学员人数':'已结业学员人数'
      // }
      if(data.startMonth){
        data.startPlanDate=data.startMonth
        data.endPlanDate=data.endMonth
        delete data.startMonth
        delete data.endMonth
      }
      this.queryParam = data
      this._refreshTable()
    },
    toDetail(data) {
      let {eduTypeId,schoolDeptId,danceId, adviserName, startDate,endDate, startPlanDate, endPlanDate, payoff} = this.queryParam
        this.$router.push({
          name: 'coachClassPlanDetails',
          query: {
             danceId, adviserName, startDate,endDate, startPlanDate, endPlanDate, payoff,
            schoolDeptId: data.deptId||schoolDeptId,
            eduTypeId: data.eduClassTypeId||eduTypeId
          }

        })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
