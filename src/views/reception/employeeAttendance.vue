<template>
  <div class="audition-list" ref="elementAll" style="height:calc(100vh - 148px)">
    <div ref="elementSearch">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="mt10 mb10">
        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
      </div>
      <s-table
        :sliderIndex="1"
        :scroll="{ x: 1800 }"
        ref="sTable"
        size="default"
        :columns="roleColumns"
        :data="loadData"
        :rowKey="(record, index) => index"
      >
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { STable, SearchComPro, PermBox } from '@/components'
import { attendanceDetailsList } from '@/api/reception/student'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getSchoolList } from '@/api/education/card'
const roleColumns = [
  {
    title: '分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 150,
  },
  {
    title: '月份',
    dataIndex: 'signMonth',
    key: 'signMonth'
  },
  {
    title: '工号',
    dataIndex: 'userNo',
    key: 'userNo',
  },
  {
    title: '姓名',
    dataIndex: 'signName',
    key: 'signName',
    width: 150,
  },
  {
    title: '职务',
    dataIndex: 'signJob',
    key: 'signJob'
  },
  {
    title: '员工类型',
    dataIndex: 'userType',
    key: 'userType',
    ellipsis: true,
    customRender: (text, record) => {
      return text === 'A' ? '正式' :text === 'B' ? '实习' : ''
    }
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    key: 'userStatus',
    customRender: (text, record) => {
      return text === 'A' ? '在职' :text === 'B' ? '离职' : ''
    }
  },
  {
    title: '薪资发放状态',
    width: 180,
    dataIndex: 'salaryStatus',
    key: 'salaryStatus',
    customRender: (text, record) => {
      return text === 'A' ? '正常' :text === 'B' ? '延发' : text === 'C' ? '补发' :text === 'D' ? '不发' :''
    }
  },
  {
    title: '早班天数',
    dataIndex: 'morningShiftDay',
    key: 'morningShiftDay',
  },
  {
    title: '出勤天数',
    dataIndex: 'attendanceDay',
    key: 'attendanceDay'
  },
  {
    title: '休息天数',
    dataIndex: 'restDay',
    key: 'restDay',
  },
  {
    title: '请假天数',
    dataIndex: 'leaveDay',
    key: 'leaveDay',
  },
  {
    title: '加班天数',
    dataIndex: 'overtimeDay',
    key: 'overtimeDay',
    ellipsis: true,
  },
  {
    title: '旷工天数',
    dataIndex: 'absenteeismDay',
    key: 'absenteeismDay',
  },
  {
    title: '是否保底',
    width: 120,
    dataIndex: 'signStatus',
    customRender: (text, record) => {
      return text === 'A' ? '是' :text === 'B' ? '否' : ''
    }
  },
  {
    title: '补发金额',
    dataIndex: 'reissueAmounts',
    key: 'reissueAmounts',
  },

  {
    title: '备注',
    dataIndex: 'signDesc',
    key: 'signDesc',
  },
  {
    title: '工资卡号',
    width: 200,
    dataIndex: 'salaryCardNo',
  },
  {
    title: '所属银行',
    dataIndex: 'bankName',
    key: 'bankName',
  }
]

export default {
  name: 'employeeAttendance',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
      roleColumns,
      queryParam: {},
      loadData: parameter => {
        console.log(Object.assign(parameter, this.queryParam))
        return attendanceDetailsList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      searchParams: [
        {
          type: 'date',
          key: 'Month',
          label: '考勤月份',
          placeholder: '请选择月份',
          format: 'YYYY-MM',
          mode: ['month', 'month']
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'school_id',
          label: '选择分馆',
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
          type: 'text',
          key: 'userName',
          label: '员工',
          placeholder: '请输入员工姓名'
        },
      ],
    }
  },
  beforeCreate() {

  },

  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/education/attendance/downDetail'
      const queryParam = this.queryParam
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k !== 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const userSchoolId = this.$store.getters.school_id
      if (userSchoolId) {
        fields.push({ name: 'school_id', value: userSchoolId })
      }
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
    searchSubmit(data) {
      this.queryParam = data
      if(data.startMonth){
        this.queryParam.startDate=data.startMonth
        delete this.queryParam.startMonth
      }
      if(data.endMonth){
        this.queryParam.endDate= data.endMonth
        delete this.queryParam.endMonth
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.sTable.refresh()
    },
  }
}
</script>

<style scoped lang="less"></style>
