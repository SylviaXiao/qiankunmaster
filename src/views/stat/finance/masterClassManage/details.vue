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
import { listAllByArea, listAllByAreaDept, listEduDance, treeEduClassType } from '@/api/common'
import {  pageSignDetail } from '@/api/table/table'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
// !!!this.$store.getters.school_id
export default {
  name: 'masterClassManageDetails',
  data() {
    const columns = [
      {
        title: '导师名称',
        dataIndex: 'teacherName',
        align: 'center',
        width:100,
      },
      {
        title: '签到日期',
        dataIndex: 'signDate',
        align: 'center',
        width:120,
      },
      {
        title: '签到次数',
        dataIndex: 'signCount',
        align: 'center',
        width:260,
      },
      {
        title: '上课时段',
        dataIndex: 'classTimeFrame',
        align: 'center',
        width:180,
      },
      {
        title: '上课时长',
        dataIndex: 'classTime',
        align: 'center',
        width:180,
        customRender: (text, record) => {
          return text+'H'
        }
      },
      {
        title: '班级类型（大）',
        dataIndex: 'typeName',
        align: 'center',
        width:180,
      },
      {
        title: '班级类型（小）',
        dataIndex: 'clsTypeName',
        align: 'center',
        width:130,
      },
      {
        title: '班级名称',
        dataIndex: 'className',
        align: 'center',
        width:200,
        ellipsis: true,
      },
      {
        title: '舞种',
        dataIndex: 'danceName',
        align: 'center',
        width:100,
      },
      {
        title: '上课分馆',
        dataIndex: 'schoolName',
        align: 'center',
        width:100,
      },
      {
        title: '上课地区',
        dataIndex: 'schoolArea',
        align: 'center',
        width:100,
      }
    ]
    return {
      spinning: false,
      columns: columns,
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
        {
          type: 'treeSelect',
          key: 'classTypeIds',
          label: '班型',
          placeholder: '请选择班型',
          expandAll: true,
          mutiple: true,
          isShow: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: treeEduClassType,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'danceIds',
          label: '舞种',
          placeholder: '请选择舞种',
          mode: 'multiple',
          show: true,
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        }
      ],
      queryParams: {
      },
      //表格是否加载
      rpSpinning: false,
      //表内容
      loadData: parameter => {
        return pageSignDetail(Object.assign(parameter,this.queryParams)).then(res => {
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
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'masterClassManageDetails') {
          this.init()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    init(){
      let {  startDate, endDate, id } = this.$route.params
      this.queryParams={startDate, endDate,teacherId:id==='A'?'':id}
      this.searchParams[0].defaultVal = [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      this.$forceUpdate()
      if(this.$refs.table)this.$refs.table.refresh()
    },
    //导出
    downloadStu() {
      let exportUrl = '/class/signDetailDown'
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
        let {  startDate, endDate, id } = this.$route.params
        this.queryParams={startDate, endDate, teacherId:id==='A'?'':id}
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
