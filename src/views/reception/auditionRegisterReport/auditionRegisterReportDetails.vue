<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <div class="mb20">
        <a-button type="primary" icon="download" @click.native="downloadStu">导出</a-button>
      </div>
      <s-table
        ref="table"
        :rowKey="(record, index) => index"
        :columns="columns"
        :data="loadData"
        :scroll="{ x: 120 * columns.length }"
        :defaultPagination='true'
      >
      </s-table>
    </a-card>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import moment from 'moment'
  import { STable, PermBox, SearchComPro } from '@/components'
  import { getSchoolList } from '@/api/education/card'
  import { auditionRegisterReportDetails } from '@/api/organize'

  const columns = [
    {
      title: '试课时间',
      dataIndex: 'logDate',
      customRender: (text, record) => {
        if (text === '合计') return text
        return text ? moment(text).format('YYYY-MM-DD') : ''
      }
    },
    {
      title: '姓名',
      dataIndex: 'stuName',
      width: 120
    },
    {
      title: '手机号',
      dataIndex: 'stuPhone'
    },
    {
      title: '试课分馆',
      dataIndex: 'deptName'
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      width: 200,
      ellipsis: true
    },
    {
      title: '舞种',
      dataIndex: 'eduDanceName'
    },
    {
      title: '上课时间',
      dataIndex: 'planStartDate',
      width: 180,
      customRender: (text, record) => {
        return record.planStartDate && record.planEndDate ? moment(record.planStartDate).format('YYYY-MM-DD HH:mm') + '~' + moment(record.planEndDate).format('HH:mm') : ''
      }
    },
    {
      title: '签到状态',
      dataIndex: 'signState',
      customRender: (text, record) => {
        return text ? (text === 'Y' ? '已签' : '未签') : ''
      }
    },
    {
      title: '老师',
      dataIndex: 'teacherName'
    },
    {
      title: '学号',
      dataIndex: 'stuNo'
    },
    {
      title: '报名时间',
      dataIndex: 'auditionApplyDate',
      customRender: (text, record) => {
        return text ? moment(text).format('YYYY-MM-DD') : ''
      }
    },
    {
      title: '报名金额',
      dataIndex: 'price'
    },
    {
      title: '顾问',
      dataIndex: 'adviser',
      width: 120
    },
    {
      title: '备注',
      dataIndex: 'logRemark',
      key: 'logRemark',
      ellipsis: true,
      customRender: (text, record) => {
        if (record.logRemark && record.applyRemark) {
          return record.logRemark + ',' + record.applyRemark
        }
        if (record.logRemark && !record.applyRemark) {
          return record.logRemark
        }
        if (!record.logRemark && record.applyRemark) {
          return record.applyRemark
        }
        return ''
      }
    }
  ]

  export default {
    components: {
      STable,
      PermBox,
      SearchComPro
    },
    data() {
      return {
        queryParam: {
        },
        columns,
        loadData: parameter => {
          let params = Object.assign({}, this.queryParam, {
            page:0,
            limit:0
          })
          return auditionRegisterReportDetails(params).then(res => {
            return res
          })
        },
      }
    },
    // watch: {
    //   $route: {
    //     handler: function(route) {
    //       if (route.name == 'auditionRegisterReportDetails') {
    //         this.initSearchParams()
    //       }
    //     },
    //     immediate: true,
    //     deep: true
    //   }
    // },
    created() {
      this.initSearchParams()
    },
    methods: {
      initSearchParams() {
        // const queryParam = JSON.parse(localStorage.getItem('auditionRegisterReport'))
        const queryParam = this.$route.query
        const { classType, crowdType, school_id, danceId, detailType, startDate, endDate } = queryParam
        this.queryParam.school_id = school_id
        this.queryParam.classType = classType
        this.queryParam.crowdType = crowdType
        this.queryParam.danceIds = danceId
        if (detailType === 'audition') {
          this.queryParam.startAuditionDate = startDate
          this.queryParam.endAuditionDate = endDate
        } else if (detailType === 'enroll') {
          this.queryParam.startEnrollDate = startDate
          this.queryParam.endEnrollDate = endDate
        }
        console.log(this.queryParam)
      },
      _refreshTable() {
        this.$refs.table.refresh()
      },
      downloadStu() {
        let exportUrl = '/auditionCourseEnroll/auditionCourseEnrollMasterReportDetailsByExportExcel'
        const queryParam = this.queryParam
        const token = Vue.ls.get(ACCESS_TOKEN)
        let fields = [{ name: 'auth_token', value: token }]
        for (let k in queryParam) {
          fields.push({ name: k, value: queryParam[k] })
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
      }
    }
  }
</script>

<style lang="less" scoped type="text/less">
</style>
