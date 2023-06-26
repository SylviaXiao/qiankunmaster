<template>
  <div class="reports-iframe-wrapper">
    <div class="table-wrapper">
      <a-card :bordered="false">
<!--        <div class="mt10 mb10">-->
<!--          <a-button type="primary" icon="download" @click.native="downloadStu">-->
<!--            导出-->
<!--          </a-button>-->
<!--        </div>-->
        <a-table ref="table"  bordered :rowClassName="rowClassName" :columns="columns" :loading="loading" :dataSource="dataSource" :rowKey="(record, index) => index" :pagination="false">
          <div slot="usedCount" slot-scope="text, record">
            <template v-if="!record.usedCount">
              <span :style="{ padding: '0px 5px' }">{{ record.usedCount }}</span>
            </template>
            <template v-else>
              <perm-box perm="student:signinlog:view" :text="`${record.usedCount}`">
                <a href="#" @click="openSignInLog(record)">{{ record.usedCount }}</a>
              </perm-box>
            </template>
            <span>/</span>
            <span >{{ record.totalCount === 0 ? '不限' : record.totalCount }}</span>
          </div>
        </a-table>
      </a-card>
    </div>
    <SignInRecord ref="signInRecord"></SignInRecord>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import {  pageSizeOptions } from '@/utils/tableDetails/details'
import { STable } from '@/components'
import SignInRecord from '@/components/SignInRecord'
import { expireContinuationCardDetails } from '@/api/table/table'
export default {
  name: 'teacherClassDetails',
  props: {},
  components: {
    STable,
    SignInRecord
  },
  data() {
    return {
      dataSource: [],
      pageSizeOptions: pageSizeOptions,
      columns: [
        {
          title: '分馆',
          dataIndex: 'deptName',
          key: 'deptName',
          width: 170,
          align: 'center',
          customRender: (text, record) => {
            let rowSpan = 1
            let colSpan = 1
            if(record.rowSpan){
              rowSpan=record.rowSpan>=1?record.rowSpan:0
            }
            return {
              children: <span >{text}</span>,
              attrs: {
                colSpan: colSpan,
                rowSpan:rowSpan
              }
            }
          }
        },
        {
          title: '顾问',
          dataIndex: 'userName',
          key: 'userName',
          width: 170,
          align: 'center',
          customRender: (text, record) => {
            let rowSpan = 1
            let colSpan = 1
            if(record.rowSpan1){
              rowSpan=record.rowSpan1>=1?record.rowSpan1:0
            }
            return {
              children: <span>{text}</span>,
              attrs: {
                colSpan: colSpan,
                rowSpan:rowSpan
              }
            }
          }
        },
        {
          title: '班型',
          align: 'center',
          dataIndex: 'eduTypename',
          width: 100,
          key: 'eduTypename',
          customRender: (text, record) => {
            let rowSpan = 1
            let colSpan = 1
            if(record.rowSpan2){
              rowSpan=record.rowSpan2>=1?record.rowSpan2:0
            }
            return {
              children: <span>{text}</span>,
              attrs: {
                colSpan: colSpan,
                rowSpan:rowSpan
              }
            }
          }
        },
        {
          title: '到期学员人数',
          align: 'center',
          dataIndex: 'studentNum',
          key: 'studentNum',
          width: 200,
          customRender: (text, record) => {
            let rowSpan = 1
            let colSpan = 1
            if(record.rowSpan2){
              rowSpan=record.rowSpan2>=1?record.rowSpan2:0
            }
            return {
              children: <span>{text}</span>,
              attrs: {
                colSpan: colSpan,
                rowSpan:rowSpan
              }
            }
          }
        },
        {
          title: '学员姓名',
          align: 'center',
          dataIndex: 'stuName',
          width: 100,
          key: 'stuName'
        },
        {
          title: '联系电话',
          align: 'center',
          dataIndex: 'stuPhone',
          width: 120,
          key: 'stuPhone',
        },
        {
          title: '人群',
          align: 'center',
          dataIndex: 'stuType',
          key: 'stuType',
          width: 70,
          customRender: (text, record) => {
           return text==='A'?'成人':text==='B'?'少儿':''
          }
        },
        {
          title: '卡号',
          align: 'center',
          dataIndex: 'stuCardNo',
          width: 100,
          key: 'stuCardNo',
        },
        {
          title: '卡种名称',
          align: 'center',
          dataIndex: 'eduCardName',
          width: 100,
          key: 'eduCardName'
        },
        {
          title: '班级名称',
          align: 'center',
          dataIndex: 'className',
          width: 100,
          key: 'className'
        },
        {
          title: '卡状态',
          align: 'center',
          dataIndex: 'status',
          width: 100,
          key: 'status',
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
          },
        },
        {
          title: '班型',
          align: 'center',
          dataIndex: 'eduClassTypeName',
          width: 100,
          key: 'eduClassTypeName',
          customRender: (text, record) => {
           return record.eduTypename+'-'+record.eduClassTypeName
          }
        },
        {
          title: '舞种',
          align: 'center',
          dataIndex: 'eduDanceName',
          width: 100,
          key: 'eduDanceName'
        },
        {
          title: '上课分馆',
          align: 'center',
          dataIndex: 'schoolDeptName',
          width: 100,
          key: 'schoolDeptName'
        },
        {
          title: '办卡分馆',
          align: 'center',
          dataIndex: 'cardDeptName',
          width: 100,
          key: 'cardDeptName'
        },
        {
          title: '使用/总次数',
          align: 'center',
          dataIndex: 'usedCount',
          width: 100,
          key: 'usedCount',
          scopedSlots: {
            customRender: 'usedCount'
          }
        },
        {
          title: '办卡日期',
          align: 'center',
          dataIndex: 'createDate',
          width: 100,
          key: 'createDate'
        },
        {
          title: '有效期截止',
          align: 'center',
          dataIndex: 'endDate',
          width: 100,
          key: 'endDate'
        }
      ],
      queryParam: {},
      type: '',
      loading:false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'continuedCardEndDetails') {
          this.loadData()
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {},
  created() {
    // this.loadData()
  },
  mounted() {},
  methods: {
    async loadData(){
      this.queryParam=this.$route.query
      this.dataSource=[]
      this.loading=true
        expireContinuationCardDetails(this.queryParam).then(res=>{
          let dataSource=[]
          if(res.data.length>0){
            res.data.forEach((item,idx)=>{
              item.rowspan=0
              if(item.userName) {
                item.userName.forEach((col, colIndex) => {
                  col.rowspan1=0
                  col.userList.forEach((list, rowIndex) => {
                    item.rowspan+=list.student.length
                    col.rowspan1+=list.student.length
                  })
                })
                  item.userName.forEach((col, colIndex) => {
                    col.userList.forEach((list, listIndex) => {
                      list.student.forEach((row, rowIndex) => {
                        let rowSpan = colIndex === 0 && listIndex===0 && rowIndex === 0 ? item.rowspan : -1
                        let rowSpan1 =  listIndex===0 && rowIndex === 0 ? col.rowspan1 : -1
                        let rowSpan2 = rowIndex === 0 ? list.student.length : -1
                        dataSource.push(Object.assign(row, { id:row.cardId,studentNum:list.studentNum,deptName:item.deptName,rowSpan, rowSpan1,rowSpan2,rowIndex:colIndex }))
                      })
                    })
                  })
              }
            })
          }
          this.dataSource=dataSource
          this.loading=false
        })
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    openSignInLog(record) {
      this.$refs.signInRecord.openSignInLog(record)
    },
    //导出
    downloadStu() {
      let exportUrl = ''
      let { type } = this.$route.params
      if (type == 'totalPrice') exportUrl = '/finance/teachersalary/downTeachersalaryInfo' //顾问业绩唯一

      const { queryParam } = this
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
  }
}
</script>

<style lang="less" scoped>
.table-cell-y {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 400;
  height: 48px;
}
.pointer{
  cursor:pointer;
}
.table-cell-r {
  justify-content: flex-end;
}
.table-cell-l {
  justify-content: flex-start;
}
div .table-cell-y:last-child {
  border-bottom: 0px;
}

.background-grey {
  background: #e5e5e5;
}
</style>
