<template>
  <div class="intention-adviser-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <template v-if="showSearch">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </template>
    </a-card>
    <a-card :bordered="false">
      <div class="table-wrapper">
        <div class="mt10 mb10 flex" style="justify-content:space-between;">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
          <a-radio-group v-model="status" @change="changeStatus()">
            <a-radio-button value="B" >
              未定（{{notConfirm}}）
            </a-radio-button>
            <a-radio-button value="A" >
              已定（{{confirmed}}）
            </a-radio-button>
            <a-radio-button value="" >
              全部（{{confirmed + notConfirm}}）
            </a-radio-button>
          </a-radio-group>
        </div>
        <s-table ref="table" :columns="columns" :defaultPagination="true" :data="loadData">>
          <span slot="payoff" slot-scope="text, record" >
          <span  v-if="tagRed(text)" style="color:red;">-{{text}}</span>
          <span  v-else>{{text}}</span>
        </span>
          <span  slot="coachPlanDate" slot-scope="text, record">
            <template v-if="hasPerm('education:coachplan:save')" >
              <a-month-picker show-time  placeholder="未定" valueFormat="YYYY-MM" format="YYYY-MM" @change="onChange($event,record)" v-model="record.coachPlanDateTime" >
                <span style="color:blue;cursor: pointer;">
                  <span v-if="text==='未定 '" >{{ record.coachPlanDateTime ? record.coachPlanDateTime : '未定' }}</span>
                  <span v-else >{{ record.coachPlanDateTime ? record.coachPlanDateTime : text }}</span>
                </span>
              </a-month-picker>
            </template>
            <span  v-else>{{text}}</span>
          </span>
        </s-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
const invalidColumns = [
  {
    title: '上课分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 140
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    key: 'stuName',
    width: 140
  },
  {
    title: '手机号码',
    dataIndex: 'stuPhone',
    key: 'stuPhone',
    width: 140
  },
  {
    title: '顾问',
    dataIndex: 'userName',
    key: 'userName',
    width: 100
  },
  {
    title: '卡号',
    dataIndex: 'cardno',
    key: 'cardno',
    width: 100
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName',
    width: 100
  },
  {
    title: '班型',
    dataIndex: 'eduTypeName',
    key: 'eduTypeName',
    width: 140,
    customRender: (text, record) => {
      return text+'/'+record.eduClassTypeName
    }
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName',
    width: 140
  },
  {
    title: '预计上课时间',
    dataIndex: 'coachPlanDate',
    key: 'coachPlanDate',
    width: 100,
    scopedSlots: { customRender: 'coachPlanDate' }
  },
  {
    title: '办卡日期',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 140
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    key: 'payoff',
    width: 140,
    scopedSlots: { customRender: 'payoff' }
  },
  {
    title: '卡状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    customRender: (text, record) => {
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
                : text === 'G'
                  ? '结转'
                  : ''
    }
  },
]
import { getSchoolList } from '@/api/education/card'
import { listEduDance, treeEduClassType } from '@/api/common'
import { pageCoachPlan,getCoachNum ,updatePlanDate} from '@/api/table/table'
import moment from 'moment'
export default {
  components: {
    SearchComPro,
    PermBox,
    STable
  },
  data() {
    return {
      notConfirm:0,
      confirmed:0,
      showSearch:false,
      status: '',
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
        {
          type: 'text',
          key: 'cardName',
          label: '卡种名称',
          show: true,
          placeholder: '请输入卡种名称'
        },
      ],
      columns: invalidColumns,
      queryParam: { type : '' },
      loadData: parameter => {
        return pageCoachPlan(Object.assign({page:0,limit:0}, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'coachClassPlanDetails') {
          this.showSearch=false
          this.status=''
          this.init()
          this.getNum()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    hasPerm(permStr) {
      if (this.$store.state.user.info.user.id==="admin") return true
      let perms=this.$store.state.user.info.perms || []
      return perms.includes(permStr)
    },
    onChange(e,record){
      updatePlanDate({studentCardId:record.studentCardId,date:new Date(e)}).then(res=>{
        this._refreshTable()
      }).catch(err=>{
        record.coachPlanDateTime=''
      })
    },
    tagRed(record){
      return record&&record!=="缴清"
    },
     init(){
       // this.showSearch=false
       let { schoolDeptId, eduTypeId, danceId, adviserName, startDate,endDate, startPlanDate, endPlanDate, payoff } = this.$route.query
       this.queryParam={}
       if (schoolDeptId) {
         this.queryParam.schoolDeptId = schoolDeptId
         this.searchParams[0].defaultVal=schoolDeptId.split(',')
       }else{
        delete this.searchParams[0].defaultVal
       }
       if (eduTypeId) {
         this.queryParam.eduTypeId = eduTypeId
         this.searchParams[1].defaultVal=eduTypeId.split(',')
       }else{
        delete this.searchParams[1].defaultVal
       }
       if (danceId) {
         this.queryParam.danceId = danceId
         this.searchParams[2].defaultVal=danceId.split(',')
         console.log(888,danceId.split(','))
       }else{
         delete this.searchParams[2].initialValue
       }
       if (adviserName){
         this.queryParam.adviserName = adviserName
         this.searchParams[3].initialValue=adviserName
       }else{
         this.searchParams[3].initialValue=null
       }
       if (startPlanDate) {
         this.queryParam.startPlanDate = startPlanDate
         this.searchParams[4].defaultVal=[moment(startPlanDate, 'YYYY-MM'), moment(endPlanDate, 'YYYY-MM')]
       }else{
         this.searchParams[4].defaultVal=null
       }
       if (endPlanDate) this.queryParam.endPlanDate = endPlanDate
       if (payoff) {
         this.queryParam.payoff = payoff
         this.searchParams[5].initialValue=payoff
       }else{
         this.searchParams[5].initialValue=null
       }
       if (startDate){
         this.queryParam.startDate = startDate
         this.searchParams[6].defaultVal=[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
       }else{
         this.searchParams[6].defaultVal=null
       }
       if (endDate)this.queryParam.endDate = endDate
       this.$forceUpdate()
       let that = this
       this.$nextTick(()=>{
         that.showSearch=true
       })
       if (this.$refs.table) this.$refs.table.refresh()
    },
    getNum(){
       let queryParam = JSON.parse(JSON.stringify(this.queryParam))
      delete queryParam.type
      getCoachNum(queryParam).then(res=>{
        this.notConfirm=res.data?.B
        this.confirmed=res.data?.A
      })
    },
    //导出
    downloadStu() {
      let exportUrl = '/education/coachplan/downPageCoachPlan'
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
    //搜索功能
    searchSubmit(data,reset) {
       if(reset){
         this.init()
         this.getNum()
         return
       }
      if(data.startMonth){
        data.startPlanDate=data.startMonth
        data.endPlanDate=data.endMonth
        delete data.startMonth
        delete data.endMonth
      }
      this.queryParam = data
      this._refreshTable()
    },
    changeStatus() {
      let status = this.status
      this.queryParam.type = status
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
      this.getNum()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

:global {
  .data-tree {
    .ant-card {
      top: -17px;
    }

    .ant-timeline {
      margin-top: 10px;
    }
  }
}

.intention-adviser-wrapper {
  .search-wrapper {
  }

  .btn-wrapper {
    margin-top: 20px;
    margin-left: -5px;
  }

  .table-wrapper {
    margin-top: 20px;
  }
}
/deep/.ant-modal-body {
  padding: 30px 0 10px;
}
</style>
