<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
    </a-card>

    <a-card :bordered="false">
      <div class="mt10 mb10">
        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
        <perm-box perm="finance:classPlan:save">
          <a-button class="ml10" icon="plus-circle" type="primary" @click="addEditMasterClass('add')">开班计划录入</a-button>
        </perm-box>
      </div>
      <a-spin tip="加载中..." :spinning="spinning">
        <s-table
          ref="table"
          :columns="columns"
          :data="loadData"
          :scroll="{ x: 1600 }"
          rowKey="id"
        >
          <span slot="action" slot-scope="text, record">
                <perm-box perm="finance:classPlan:update" >
                    <a v-if='isSchoolId(record)' href="javascript:;"  @click="addEditMasterClass('edit', record)">修改</a>
                </perm-box>
                <perm-box perm="finance:classPlan:del" >
                    <a href="javascript:;"  @click="deleteMasterClass( record)">删除</a>
                </perm-box>
          </span>
        </s-table>
      </a-spin>
    </a-card>
    <classPlanTableAdd @refresh="_refreshTable" :title="addEditTitle" ref="classPlanTableAdd"></classPlanTableAdd>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import { listEduDance } from '@/api/common'
import { classPlanDelete, classPlanPage } from '@/api/finance/finance'
import classPlanTableAdd from './classPlanTableAdd'
const date = new Date()
const defaultStart = moment(date)
  .subtract(29, 'days')
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
const defaultSchoolId =['0c18166a-679b-414e-ac2e-c05ba7a2f4c4', '8f63afe7-09ca-4d11-ac51-1187e4381e63', '407913a7-76ff-40ce-967f-0ce0bf0bcdd3', '8109e909-8c8e-463a-9e10-a0804bc59b79', '150d8748-87ab-4935-8f6f-7233d1294413', '4c58a4b3-157b-493f-8b72-707196a26453', 'e07cad7c-7415-421c-a77e-48146d33a3bc', '0c185455-7ae8-4207-a517-91a2f5f26030', '88c5e24d-15c1-4e7c-adfb-f5e291562c33', '5aa46e02-28b9-4e31-936f-60721e07696d', '2d30de5a-9e47-4669-a9e9-534085ab6353', '7b0f4b73-83d9-4d46-adb0-78138e7ed633', '080aabad-e46b-479e-b130-169e970427e0', '66298d15-894b-4e48-9551-5d3795470304', '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f',  'b337887b-ce9d-49e6-89c5-4f822c94d457', '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f', '50232e74-16d1-438d-9c09-bc7454b13fe0', '999e8fb9-6c98-4cc5-bab3-2a2937a36836', 'd923d38e-1699-4137-8f2a-315dcf2fa017', '5c0f0a94-346f-4e82-8848-f8882a7ac0ae', '7aa9901b-6d7f-44a3-8640-e0935516514c', '1207948e-746c-4dc3-9dd8-ab9c4493b49e', '47a6e64a-c166-4bb6-874c-f7e5c91666d7', 'c066c789-e642-45c8-9486-d7e684d44dca', '457cadbe-f9a8-4d18-87b4-85051f99898b', '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a', 'b29cfda3-9609-4939-a8c4-4fe240f54f91']
export default {
  name: 'balanceConsumpution',
  data() {
    const columns = [
      {
        title: '舞种',
        dataIndex: 'danceName',
        align: 'center',
        width:100,
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          return {
            children: <span>{text}</span>,
            attrs: {
              rowSpan: rowSpan
            }
          }
        },
      },
      {
        title: '期数',
        dataIndex: 'periods',
        align: 'center',
        width:50,
      },
      {
        title: '类型',
        dataIndex: 'typeName',
        align: 'center',
        width:260,
        customRender: (text, record) => {
          return text +(record.clsTypeName?'>'+record.clsTypeName:'')
        }
      },
      {
        title: '开课日期',
        dataIndex: 'beginClassDate',
        align: 'center',
        width:180,
        customRender: (text, record) => {
          if(text===record.endClassDate)return text.slice(0,10)
          return text.slice(0,10) + '—'+record.endClassDate.slice(0,10)
        }
      },
      {
        title: '结束日期',
        dataIndex: 'beginFinishDate',
        align: 'center',
        width:180,
        customRender: (text, record) => {
          if(text===record.endFinishDate)return text.slice(0,10)
          return text.slice(0,10) + '—'+record.endFinishDate.slice(0,10)
        }
      },
      {
        title: '上课分馆',
        dataIndex: 'schoolName',
        align: 'center',
        width:180,
      },
      {
        title: '上课时间段',
        dataIndex: 'classPeriod',
        align: 'center',
        width:100,
        customRender: (text, record) => {
          return text =='A' ?'上午': text =='B'?'下午':text == 'C'?'晚上':text == 'D'?'全天':text == 'E'?'待定':''
        }
      },
      {
        title: '上课老师',
        dataIndex: 'teacherNames',
        align: 'center',
        width:200,
        ellipsis: true,
      },
      {
        title: '已招人数',
        dataIndex: 'recruitedNum',
        align: 'center',
        width:100,
      },
      {
        title: '外馆收入',
        dataIndex: 'otherDeptNum',
        align: 'center',
        width:100,
      },
      {
        title: '计划招生',
        dataIndex: 'plansNum',
        align: 'center',
        ellipsis: true,
        width:100,
      },
      {
        title: '开班模式',
        dataIndex: 'dlassModel',
        align: 'center',
        width:100,
        customRender: (text, record) => {
          return text =='A' ?'5+2': text =='B'?'6+1':text == 'C'?'待定':''
        }
      },
      {
        title: '班级负责人',
        dataIndex: 'userName',
        align: 'center',
        width:150,
        ellipsis: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
        ellipsis: true,
        width:200,
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width:100,
        scopedSlots: { customRender: 'action' },
      }
    ]
    return {
      addEditTitle: '开班计划录入',
      spinning: false,
      columns: columns,
      //搜索项
      searchParams: [
        {
          type: 'treeSelect',
          isShow:true,
          key: 'schoolId',
          label: '上课分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          show: true,
          defaultVal: defaultSchoolId,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'singledate',
          key: 'startClassDate',
          label: '开课开始日期',
          placeholder: '请选择时间',
          show: true,
          defaultVal: moment(defaultStart),
          format: 'YYYY-MM-DD'
        },
        {
          type: 'singledate',
          key: 'endClassDate',
          label: '开课结束日期',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        // {
        //   type: 'date',
        //   key: 'ClassDate',
        //   label: '开课日期',
        //   show: true,
        //   placeholder: '请选择时间',
        //   format: 'YYYY-MM-DD',
        //   defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
        //   isDate: true
        // },
        {
          type: 'date',
          key: 'FinishDate',
          label: '结束日期',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [],
          isDate: true
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          show: true,
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
      ],
      queryParams: {
        startClassDate: defaultStart,
        schoolId:defaultSchoolId.join(',')
      },
      //表格是否加载
      rpSpinning: false,
      //表内容
      loadData: parameter => {
        return classPlanPage(Object.assign(parameter, this.queryParams)).then(res => {
          let data ={
            code:res.code,
            count:res.count,
            data:[]
          }
          res.data.forEach(item=>{
            let length = item.dataList.length
            item.dataList.forEach((col,index)=>{
              col.rowSpan=0
              if(index===0){
                col.rowSpan=length
              }
              data.data.push(col)
            })
          })
          return data
        })
      },
    }
  },
  components: {
    STable,
    SearchComPro,
    classPlanTableAdd
  },
  created() {
  },
  methods: {
    isSchoolId(record) {
      const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
      if(Array.isArray((userSchoolId))&&userSchoolId.length>0){
        let flag = false
        userSchoolId.forEach(item=>{
          if(item.deptId===record.schoolId)flag=true
        })
        return flag
      }else{
        return true
      }
    },
    deleteMasterClass(record){
      let params = record.classPlanId
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          classPlanDelete(params).then(() => {
            this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            this._refreshTable()
          })
        }
      })
    },
    addEditMasterClass(type, record) {
      if (type === 'add') {
        this.addEditTitle = '开班计划录入'
        this.$refs.classPlanTableAdd.open()
      }
      if (type === 'edit') {
        this.addEditTitle = '开班计划编辑'
        this.$refs.classPlanTableAdd.open()
        this.$nextTick(() => {
          this.$refs.classPlanTableAdd.backindData(record)
        })
      }
    },
    //导出
    downloadStu() {
      let exportUrl = '/finance/classPlan/down'
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
      console.log(data)
      if (reset === 'isReset') {
        this.queryParams.startClassDate = defaultStart
        this.queryParams.schoolId=defaultSchoolId.join(',')
      }
      this._refreshTable()
    },
    _refreshTable() {
      if(this.$refs.table)this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less"></style>
