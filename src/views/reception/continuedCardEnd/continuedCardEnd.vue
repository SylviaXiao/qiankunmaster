<template>
  <div class="fin-profit-paytype-wrapper">
    <!-- <f-frame :searchParamsArray="searchParams" src="/report?name=fin_source_income" perm="finance:stat:source:income" date="month"></f-frame> -->
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      @onShowSizeChange="onShowSizeChange"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :total="total"
      :autoLoad="false"
      :showPagination="false"
      :hideReset='false'
      :exportTips="exportTips"
      :exportUrl="'/student/card/expireContinuationCardDown'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import { expireContinuationCard } from '@/api/table/table'
import Vue from 'vue'
import { listEduDance, treeEduClassType } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'teacherClass',
  data() {
    return {
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: [
            {
              label: '分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '顾问',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '班型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '即将到期学员人数',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
          ]
        }
      ],
      //表内容字段
      headList: [
        {
          key: 'deptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'userName',
          value: 0,
          isTotal: false,
          isClick: false
        },
        {
          key: 'eduTypename',
          value: 0,
          isTotal: false,
          isClick: false
        },
        {
          key: 'studentCount',
          value: 0,
          isTotal: true,
          isClick: true
        }
      ],
      //表内容
      loadData: [],
      //搜索项
      searchParams: [
        {
          type: 'treeSelect',
          isShow: true,
          show: true,
          key: 'deptIds',
          label: '分馆',
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
          key: 'classType',
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
          type: 'select',
          key: 'danceId',
          show: true,
          label: '舞种',
          mode: 'multiple',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'text',
          key: 'counselor',
          label: '顾问',
          show: true,
          placeholder: '请输入顾问名称'
        },
        {
          type: 'arrSection',
          key: 'Expire',
          numKey:'num',
          label: '',
          placeholder: '输入已使用次数',
          addonAfter: '天内',
          addonAfterTwo: '次',
          selectKey: 'type',
          selectKeyTwo: 'cardCountType',
          selectKeyThree:'numType',
          arrPlaceholder: '请选择',
          show: true,
          arrInitialValue:'A',
          arrInitialValueTwo:'A',
          arrInitialValueThree:'A',
          initialValueStart:1,
          initialValueEnd:30,
          staticArr: [
            {
              string: '即将到期',
              value: 'A'
            },
            {
              string: '已结业',
              value: 'B'
            },
          ],
          staticArrTwo: [
            {
              string: '剩余天数',
              value: 'A'
            },
            {
              string: '剩余次数',
              value: 'B'
            },
          ],
          staticArrThree: [
            {
              string: '大于',
              value: 'A'
            },
            {
              string: '等于',
              value: 'B'
            },
            {
              string: '小于',
              value: 'C'
            },
          ]
        },
      ],
      queryParam: {},
      //表格是否加载
      rpSpinning: false,
      total: 0,
      exportTips: [
        '【即将到期学员人数】：所筛选班型使用中、未使用、停课状态卡种，当学员不含未使用的卡，且停课或使用中的卡种均在“即将到期时间筛选范围内”，则算到期续卡学员',
        '【已结业学员人数】：所筛选班型有效卡种全部结业，且结业时间均在“结业时间筛选范围内”，则算已结业学员'
      ]
    }
  },
  components: {
    ReportTable
  },
  created() {
    // this.isSchoolId()
  },
  methods: {
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
      this.rpSpinning = true
      this.headList.forEach((col, colIndex) => {
        if (col.isTotal) col.value = 0
      })
      let res = await expireContinuationCard(data)
      this.total = res.count
      if (Array.isArray(res.data) && res.data.length > 0) {
        let loadData = []
        res.data.forEach((item, index) => {
          let data = []
          this.headList.forEach((col, colIndex) => {
            if (col.isTotal) col.value += item[col.key]
            let dataItem = Object.assign( {
              userId: item.userId,
              deptId: item.deptId,
              eduTypeId: item.eduTypeId,
              classType: item.classType,
            },{
              key: col.key,
              label: item[col.key],
              rowspan: 1,
              colspan: 1,
              style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isClick,
            })
            data.push(dataItem)
          })
          loadData.push({
            style: 'background:#fff;',
            data: JSON.parse(JSON.stringify(data))
          })
        })
        // let total = []
        // this.headList.forEach((col, colIndex) => {
        //   if (colIndex == 0 || col.isTotal) {
        //     let totalData = {
        //       key: col.key,
        //       label: col.value,
        //       rowspan: 1,
        //       colspan: colIndex == 0 ? 3 : 1,
        //       style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
        //       isClick: col.isClick,
        //       id: ''
        //     }
        //     if (col.isTotal) totalData.label = col.value.toFixed(2)
        //     total.push(totalData)
        //   }
        // })
        // total[0].label = '合计'
        // loadData.push({
        //   style: 'background:#fff;',
        //   data: JSON.parse(JSON.stringify(total))
        // })
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
    searchSubmit(data,reset) {
      if(reset){
        this.loadData=[]
        this.headData[0].data[3].label='即将到期学员人数'
        this.queryParam={
          endExpire: 30,
          startExpire: 1,
          type: "A"
        }
        return
      }
      if(data.type){
        this.headData[0].data[3].label=data.type==='A'?'即将到期学员人数':'已结业学员人数'
      }
      if(data.type==='B'){
        if(data.cardCountType)delete data.cardCountType
        if(data.numType)delete data.numType
        if(data.num)delete data.num
      }
      if(data.type==='A'&&data.cardCountType==='A'){
        if(data.numType)delete data.numType
        if(data.num)delete data.num
      }
      if(data.type==='A'&&data.cardCountType==='B'){
        if(data.startExpire)delete data.startExpire
        if(data.endExpire)delete data.endExpire
      }
      this.queryParam = data
      if(!this.queryParam.classType){
        return  this.$notification['error']({
          message: '系统通知',
          description: '请选择班型'
        })
      }
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        let { danceId, type, startExpire,endExpire ,cardCountType,numType,num} = this.queryParam

        this.$router.push({
          name: 'continuedCardEndDetails',
          query: {
            userId: data.userId,
            deptId: data.deptId,
            eduTypeId: data.eduTypeId,
            classType: data.classType,
            danceId:danceId,
            type:type,
            startExpire:startExpire,
            endExpire:endExpire,
            cardCountType:cardCountType,
            numType:numType,
            num:num,
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
