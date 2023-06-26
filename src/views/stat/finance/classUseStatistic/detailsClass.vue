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
          <span slot="useNum" slot-scope="text, record">
             <a  href="javascript:;"  @click="toDetail(record)">{{text}}</a>
          </span>
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
import {  pageRoomUseStat } from '@/api/table/table'
import { getRoomList } from '@/api/education'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
// !!!this.$store.getters.school_id
export default {
  name: 'classUseStatisticDetailsClass',
  data() {
    const columns = [
      {
        title: '日期',
        dataIndex: 'startDate',
        align: 'center',
        width:50,
        customRender: (text, record) => {
          return text.slice(0,10) + '—'+record.endDate.slice(0,10)
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
        width:260,
      },
      {
        title: '使用',
        dataIndex: 'useNum',
        align: 'center',
        width:180,
        scopedSlots: { customRender: 'useNum' },
      },
      {
        title: '未使用',
        dataIndex: 'unusedNum',
        align: 'center',
        width:260,
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
          type: 'number',
          key: 'useNum',
          show: true,
          label: '使用',
          placeholder: '请输入使用',
        },        {
          type: 'number',
          key: 'unusedNum',
          show: true,
          label: '未使用',
          placeholder: '请输入未使用',
        },

      ],
      queryParams: {
      },
      //表格是否加载
      rpSpinning: false,
      //表内容
      loadData: parameter => {
        return pageRoomUseStat(Object.assign(parameter,this.queryParams)).then(res => {
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
        if (route.name === 'classUseStatisticDetailsClass') {
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
      this.queryParams={startDate, endDate,schoolIds:id}
      this.searchParams[0].defaultVal = [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      this.searchParams[1].defaultVal = [id]
      this.$forceUpdate()
      if(this.$refs.table)this.$refs.table.refresh()
    },
    //导出
    downloadStu() {
      let exportUrl = '/class/pageRoomUseStatDown'
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
      let {  startDate, endDate, id } = this.$route.params
      this.queryParams = data
      if (reset === 'isReset') {
        this.queryParams={startDate, endDate, schoolIds:id}
      }
      this._refreshTable()
    },
    _refreshTable() {
      if(this.$refs.table)this.$refs.table.refresh()
    },
    toDetail(data) {
      let { endDate, startDate } = this.queryParams
      let id =data.roomId
      const { href } = this.$router.resolve({
        name: 'classUseStatisticDetails',
        params: {startDate: startDate, endDate: endDate, id: id },
      })
      //结合open打开新的页面
      window.open(href, '_blank')
    }
  }
}
</script>

<style scoped lang="less"></style>
