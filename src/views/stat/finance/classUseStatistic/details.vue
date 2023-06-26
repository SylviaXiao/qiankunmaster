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
import {  pageRoomUseTimeDetail } from '@/api/table/table'
import { getRoomList } from '@/api/education'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
// !!!this.$store.getters.school_id
export default {
  name: 'classUseStatisticDetails',
  data() {
    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
        align: 'center',
        width:120,
        customRender: (text, record) => {
          return text.slice(0,10)
        }
      },
      {
        title: '分馆',
        dataIndex: 'shoolName',
        align: 'center',
        width:260,
      },
      {
        title: '教室',
        dataIndex: 'roomName',
        align: 'center',
        width:180,
      },
      {
        title: '班级名称',
        dataIndex: 'className',
        align: 'center',
        width:180,
      },
      {
        title: '上课导师',
        dataIndex: 'classTeacher',
        align: 'center',
        width:180,
      },
      {
        title: '签到导师',
        dataIndex: 'signTeacher',
        align: 'center',
        width:130,
      },
      {
        title: '使用时间',
        dataIndex: 'useTime',
        align: 'center',
        width:200,
        ellipsis: true,
      },
      {
        title: '使用时间数量',
        dataIndex: 'duration',
        align: 'center',
        width:100,
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
        {
          type: 'select', //动态select框
          key: 'roomId',
          label: '教室',
          placeholder: '请选择教室',
          search: true,
          show: true,
          mode:'multiple',
          apiOption: {
            api: getRoomList, // promise类型的接口
            string: option => `${option.deptName}-${option.roomName}`,
            value: 'id',
            params: {
              schoolId: this.$store.getters.school_id,
              state: 'Y'
            }
          }
        },
        {
          type: 'text',
          key: 'className',
          show: true,
          label: '班级名称',
          placeholder: '请输入班级名称',
        },
        {
          type: 'chooseModal', // 点击弹框选择类型
          key: 'teacher', // 根据key来筛选
          label: '上课导师',
          show: true,
          placeholder: '请选择导师'
        },
        {
          type: 'text',
          key: 'signTeacherName',
          show: true,
          label: '签到导师',
          placeholder: '请输入签到导师',
        },
      ],
      queryParams: {
      },
      //表格是否加载
      rpSpinning: false,
      //表内容
      loadData: parameter => {
        console.log(777,this.queryParams)
        return pageRoomUseTimeDetail(Object.assign(parameter,this.queryParams)).then(res => {
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
        if (route.name == 'classUseStatisticDetails') {
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
      this.queryParams={startDate, endDate,roomId:id}
      this.searchParams[0].defaultVal = [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      this.$forceUpdate()
      console.log(888,this.queryParams)
      if(this.$refs.table)this.$refs.table.refresh()
    },
    //导出
    downloadStu() {
      let exportUrl = '/class/pageRoomUseTimeDetailDown'
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
        this.queryParams={startDate, endDate,roomId:id}
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
