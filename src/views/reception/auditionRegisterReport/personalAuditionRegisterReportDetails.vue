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
  import { personalAuditionRegisterReportDetails1, personalAuditionRegisterReportDetails2 } from '@/api/organize'

  const defaultColumns = [
    {
      title: '199报名日期',
      dataIndex: 'enrollDate199',
      customRender: (text, record) => {
        if (text === '合计') return text
        return text ? moment(text).format('YYYY-MM-DD') : ''
      }
    },
    {
      title: '199卡号',
      dataIndex: 'cardNo199'
    },
    {
      title: '是否套报',
      dataIndex: 'isTaoBao'
    },
    {
      title: '业绩顾问',
      dataIndex: 'adviserName',
      width: 200,
      ellipsis: true
    },
    {
      title: '学员名称',
      dataIndex: 'studentName',
      width: 150,
      ellipsis: true
    },
    {
      title: '签到分馆',
      dataIndex: 'auditionDeptName'
    },
    {
      title: '试课班型',
      dataIndex: 'classTypeName'
    },
    {
      title: '试课舞种',
      dataIndex: 'danceName'
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      width: 200,
      ellipsis: true
    },
    {
      title: '上课时间',
      dataIndex: 'classDate',
      width: 180
    },
    {
      title: '上课老师',
      dataIndex: 'signTeachers',
      width: 150,
      ellipsis: true
    },
    {
      title: '报名卡号',
      dataIndex: 'enrollCardNo',
      width: 150,
      ellipsis: true
    },
    {
      title: '报名时间',
      dataIndex: 'enrollDate',
      customRender: (text, record) => {
        return text ? moment(text).format('YYYY-MM-DD') : ''
      }
    },
    {
      title: '报名业绩金额',
      dataIndex: 'enrollAchPrice'
    },
    {
      title: '报名人数',
      dataIndex: 'enrollNumber'
    }
  ]

  export default {
    components: {
      STable,
      PermBox,
      SearchComPro
    },
    data() {
      const { detailType } = this.$route.params
      let columns = defaultColumns
      if (detailType === 'audition') {//体验人数
        let index = columns.findIndex(d => d.dataIndex === 'signTeachers')
        columns.splice(index + 1, 0, {
          title: '体验后是否报名',
          dataIndex: 'enrollState',
          width: 110
        })
      } else if (detailType === 'enroll') {//报名人数||报名金额
        let index = columns.findIndex(d => d.dataIndex === 'enrollDate')
        columns.splice(index + 1, 0, {
          title: '业绩分馆',
          dataIndex: 'enrollAchDept'
        })
      }

      return {
        detailType,
        queryParam: {},
        columns,
        loadData: parameter => {
          let params = Object.assign({}, this.queryParam, parameter)

          if (detailType === 'audition') {//体验人数
            return personalAuditionRegisterReportDetails1(params).then(res => {
              return res
            })
          } else if (detailType === 'enroll') {//报名人数||报名金额
            return personalAuditionRegisterReportDetails2(params).then(res => {
              return res
            })
          }
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
        const queryParam = this.$route.query
          // JSON.parse(localStorage.getItem('personalAuditionRegisterReport' + this.detailType))
        const { classType, crowdType, school_id, danceId, detailType, startDate, endDate } = queryParam
        this.queryParam.school_id = school_id||""
        this.queryParam.classType = classType||""
        this.queryParam.crowdType = crowdType||""
        this.queryParam.danceIds = danceId||""
        if (detailType === 'audition') {//体验人数
          this.queryParam.startAuditionDate = startDate
          this.queryParam.endAuditionDate = endDate
        } else if (detailType === 'enroll') {//报名人数||报名金额
          this.queryParam.startEnrollDate = startDate
          this.queryParam.endEnrollDate = endDate
        }
      },
      _refreshTable() {
        this.$refs.table.refresh()
      },
      downloadStu() {
        let exportUrl1 = '/auditionCourseEnroll/privateEduAuditionCourseEnrollMasterDetails1ByExportExcel'
        let exportUrl2 = '/auditionCourseEnroll/privateEduAuditionCourseEnrollMasterDetails2ByExportExcel'
        const queryParam = this.queryParam
        const token = Vue.ls.get(ACCESS_TOKEN)
        let fields = [{ name: 'auth_token', value: token }]
        for (let k in queryParam) {
          fields.push({ name: k, value: queryParam[k] })
        }
        fields.push({ name: 'page', value: 0 })
        fields.push({ name: 'limit', value: 0 })
        const form = document.createElement('form')
        if (this.detailType === 'audition') {//体验人数
          form.action = `${process.env.VUE_APP_URL}${exportUrl1}`
        } else if (this.detailType === 'enroll') {//报名人数||报名金额
          form.action = `${process.env.VUE_APP_URL}${exportUrl2}`
        }
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
