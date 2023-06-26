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
          :scroll="{ x: 1600 }"
          rowKey="id"
        >
        </s-table>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import { listAllByArea, listAllByAreaDept } from '@/api/common'
import { pageClassStat } from '@/api/table/table'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
export default {
  name: 'balanceConsumpution',
  data() {
    const columns = [
      {
        title: '区域',
        dataIndex: 'deptAreaName',
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
        title: '分馆',
        dataIndex: 'deptName',
        align: 'center',
        width:50,
      },
      {
        title: '班级名称',
        dataIndex: 'className',
        align: 'center',
        width:260,
      },
      {
        title: '开班日期',
        dataIndex: 'classStartDate',
        align: 'center',
        width:180,
        customRender: (text, record) => {
          return text.slice(0,10)
        }
      },
      {
        title: '满班人数',
        dataIndex: 'classTotal',
        align: 'center',
        width:180,
      },
      {
        title: '开班人数',
        dataIndex: 'openClassNum',
        align: 'center',
        width:180,
      },
      {
        title: '增加人数',
        dataIndex: 'increaseNum',
        align: 'center',
        width:100,
      },
      {
        title: '减少人数',
        dataIndex: 'decreaseNum',
        align: 'center',
        width:200,
        ellipsis: true,
      },
      {
        title: '结业人数',
        dataIndex: 'graduateNum',
        align: 'center',
        width:100,
      },
      {
        title: '结业日期',
        dataIndex: 'graduateDate',
        align: 'center',
        width:100,
        customRender: (text, record) => {
          return text.slice(0,10)
        }
      }
    ]
    return {
      spinning: false,
      columns: columns,
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'OpenClassDate',
          label: '开班日期',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'date',
          key: 'GraduateDate',
          label: '结业日期',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [],
          isDate: true
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'deptId',
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
        {
          type: 'text',
          key: 'className',
          show: true,
          label: '班级名称',
          placeholder: '请输入班级名称',
        },
      ],
      queryParams: {
        startOpenClassDate: defaultStart,
        endOpenClassDate: defaultEnd,
      },
      //表格是否加载
      rpSpinning: false,
      //表内容
      loadData: parameter => {
        return pageClassStat(Object.assign(parameter, this.queryParams)).then(res => {
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
    SearchComPro
  },
  created() {
  },
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/class/classStatDown'
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
        this.queryParams.startOpenClassDate = defaultStart
        this.queryParams.endOpenClassDate = defaultEnd
      }
      if(data.className&&!data.deptId){
        this.$notification['error']({
          message: '系统通知',
          description: '请先选择分馆'
        })
        return
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
