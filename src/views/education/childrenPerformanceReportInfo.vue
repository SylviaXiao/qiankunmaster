<template>
  <div>
    <a-card :bordered="false" style="margin: 20px 0;">
      <search-com-pro :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="mb20">
        <a-space :size="15">
          <a-button v-if="exportPerm" type="primary" @click="handleReportExport">导出</a-button>
        </a-space>
      </div>
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :rowKey="(record, index) => index"
        :scroll="{ x: true }"
      ></s-table>
    </a-card>
  </div>
</template>

<script>
  import Vue from 'vue'
  import tools from '@/tools/common'
  import { cloneDeep } from 'lodash'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { STable, SearchComPro, PermBox } from '@/components'
  import { listEduDance } from '@/api/common'
  import { getSchoolList } from '@/api/education/card'
  import { listAchievementRenewalCard, listAchievementLossRenewalCard, listAchievementCard } from '@/api/education'

  const searchParams1 = [
    {
      type: 'treeSelect',
      show: true,
      isShow: true,
      key: 'schoolIds',
      label: '选择分馆',
      placeholder: '请选择分馆',
      expandAll: true,
      mutiple: true,
      treeCheckable: true,
      selectFather: true,
      treeOps: {
        api: getSchoolList,
        label: 'deptName',
        value: 'id',
        children: 'children'
      }
    },
    {
      type: 'text',
      show: true,
      isShow: true,
      key: 'student',
      label: '学员',
      placeholder: '学员姓名/手机号码'
    },
    {
      type: 'text',
      show: true,
      isShow: true,
      key: 'stuCardNo',
      label: '卡号',
      placeholder: '请输入续卡卡号'
    },
    {
      type: 'date',
      show: true,
      isShow: true,
      key: 'Date',
      label: '有效期截止',
      placeholder: '请输入截止时间',
      format: 'YYYY-MM-DD'
    },
    {
      type: 'date',
      show: true,
      isShow: true,
      key: 'ReturnDate',
      label: '退卡时间',
      placeholder: '请输入退卡时间',
      format: 'YYYY-MM-DD'
    },
    {
      type: 'select',
      show: true,
      isShow: true,
      key: 'eduDance',
      label: '舞种',
      placeholder: '请选择舞种',
      apiOption: {
        api: listEduDance,
        string: 'name',
        value: 'id'
      }
    }
  ]
  const searchParams2 = [
    {
      type: 'treeSelect',
      show: true,
      isShow: true,
      key: 'orgDept',
      label: '续卡分馆',
      placeholder: '选择续卡分馆',
      expandAll: true,
      mutiple: true,
      treeCheckable: true,
      selectFather: true,
      treeOps: {
        api: getSchoolList,
        label: 'deptName',
        value: 'id',
        children: 'children'
      }
    },
    {
      type: 'text',
      show: true,
      isShow: true,
      key: 'student',
      label: '学员',
      placeholder: '学员姓名/手机号码'
    },
    {
      type: 'text',
      show: true,
      isShow: true,
      key: 'stuCardNo',
      label: '续卡卡号',
      placeholder: '请输入续卡卡号'
    },
    {
      type: 'date',
      show: true,
      isShow: true,
      key: 'RenewalCardDate',
      label: '续卡日期',
      placeholder: '请输入续卡日期',
      format: 'YYYY-MM-DD'
    },
    {
      type: 'text',
      show: true,
      isShow: true,
      key: 'lastClassName',
      label: '班级名称',
      placeholder: '请输入班级名称'
    },
    {
      type: 'select',
      show: true,
      isShow: true,
      key: 'state',
      label: '班级状态',
      placeholder: '请选择班级状态',
      staticArr: [
        {
          string: '计划中',
          value: 'A'
        },
        {
          string: '上课中',
          value: 'B'
        },
        {
          string: '已结业',
          value: 'C'
        },
        {
          string: '停课',
          value: 'D'
        }
      ]
    },
    {
      type: 'treeSelect',
      show: true,
      isShow: true,
      key: 'orgDeptSchool',
      label: '续卡上课分馆',
      placeholder: '选择续卡上课分馆',
      expandAll: true,
      mutiple: true,
      treeCheckable: true,
      selectFather: true,
      treeOps: {
        api: getSchoolList,
        label: 'deptName',
        value: 'id',
        children: 'children'
      }
    },
    {
      type: 'text',
      show: true,
      isShow: true,
      key: 'lastCardNo',
      label: '往期卡卡号',
      placeholder: '请输入往期卡卡号'
    },
    {
      type: 'treeSelect',
      show: true,
      isShow: true,
      key: 'orgDeptLast',
      label: '往期卡上课分馆',
      placeholder: '选择往期卡上课分馆',
      expandAll: true,
      mutiple: true,
      treeCheckable: true,
      selectFather: true,
      treeOps: {
        api: getSchoolList,
        label: 'deptName',
        value: 'id',
        children: 'children'
      }
    },
    {
      type: 'date',
      show: true,
      isShow: true,
      key: 'PayDate',
      label: '续卡结清时间',
      placeholder: '请输入续卡结清时间',
      format: 'YYYY-MM-DD'
    },
    {
      type: 'date',
      show: true,
      isShow: true,
      key: 'OperateDate',
      label: '往期卡结业时间',
      placeholder: '请输入往期卡结业时间',
      format: 'YYYY-MM-DD'
    },
    {
      type: 'date',
      show: true,
      isShow: true,
      key: 'ReturnCardDate',
      label: '退卡时间',
      placeholder: '请输入退卡时间',
      format: 'YYYY-MM-DD'
    },
    {
      type: 'chooseModal', // 点击弹框选择类型
      show: true,
      isShow: true,
      key: 'teacher', // 根据key来筛选
      label: '导师',
      placeholder: '请选择导师'
    },
    {
      type: 'select',
      show: true,
      isShow: true,
      key: 'eduDance',
      label: '续卡舞种',
      placeholder: '请选择舞种',
      apiOption: {
        api: listEduDance,
        string: 'name',
        value: 'id'
      }
    },
    {
      type: 'select',
      show: true,
      isShow: true,
      key: 'lastEduDance',
      label: '往期卡舞种',
      placeholder: '请选择舞种',
      apiOption: {
        api: listEduDance,
        string: 'name',
        value: 'id'
      }
    }
  ]
  const columns1 = [
    {
      title: '地区',
      dataIndex: 'parentDeptName'
    },
    {
      title: '分馆',
      dataIndex: 'deptName'
    },
    {
      title: '学员姓名',
      dataIndex: 'stuName'
    },
    {
      title: '舞种',
      dataIndex: 'eduDanceName'
    },
    {
      title: '学员手机号',
      dataIndex: 'stuPhone'
    },
    {
      title: '卡号',
      dataIndex: 'stuCardNo'
    },
    {
      title: '退卡时间',
      dataIndex: 'returnCardDate',
      customRender: (text, record) => {
        return tools.tailor.getDate(text)
      }
    },
    {
      title: '卡种名称',
      dataIndex: 'cardName'
    },
    {
      title: '有效期截止',
      dataIndex: 'endDate',
      customRender: (text, record) => {
        return tools.tailor.getDate(text)
      }
    }
  ]
  const columns2 = [
    {
      title: '续卡分馆',
      dataIndex: 'orgDept'
    },
    {
      title: '学员姓名',
      dataIndex: 'stuName'
    },
    {
      title: '续卡卡号',
      dataIndex: 'stuCardNo'
    },
    {
      title: '续卡日期',
      dataIndex: 'renewalCardDate',
      customRender: (text, record) => {
        return tools.tailor.getDate(text)
      }
    },
    {
      title: '续卡计次',
      dataIndex: 'renewalNumber'
    },
    {
      title: '续卡确认金额',
      dataIndex: 'renewalPrice'
    },
    {
      title: '续卡上课分馆',
      dataIndex: 'schoolDeptName'
    },
    {
      title: '班级名称（往期卡上课班级）',
      dataIndex: 'lastClassName'
    },
    {
      title: '班级状态（当前状态）',
      dataIndex: 'state',
      customRender: (text, record) => {
        return text === 'A' ? '计划中' : text === 'B' ? '开课中' : text === 'C' ? '已结业' : text === 'D' ? '停课' : ''
      }
    },
    {
      title: '班级上课分馆（往期卡上课分馆）',
      dataIndex: 'lastDeptName'
    },
    {
      title: '往期卡卡号',
      dataIndex: 'lastCardNo'
    },
    {
      title: '往期卡结业时间',
      dataIndex: 'operateDate',
      customRender: (text, record) => {
        return tools.tailor.getDate(text)
      }
    },
    {
      title: '续费结清时间',
      dataIndex: 'payDate',
      customRender: (text, record) => {
        return tools.tailor.getDate(text)
      }
    },
    {
      title: '退卡时间',
      dataIndex: 'returnCardDate',
      customRender: (text, record) => {
        return tools.tailor.getDate(text)
      }
    },
    {
      title: '导师姓名',
      dataIndex: 'teacherName'
    },
    {
      title: '教研负责人',
      dataIndex: 'educationUserName'
    },
    {
      title: '续卡舞种',
      dataIndex: 'eduDanceName'
    },
    {
      title: '往期卡舞种',
      dataIndex: 'lastEduDanceName'
    }
  ]

  export default {
    name: 'childrenPerformanceReportInfo',
    components: {
      SearchComPro,
      STable,
      PermBox,
    },
    props: {
      status: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true
      },
      deptId: {
        type: String,
        default: ''
      },
      eduDance: {
        type: String,
        default: ''
      }
    },
    computed: {
      exportPerm() {
        const { status, $tools: { checkPerm } } = this
        if (status === 'A' && checkPerm('education:renewalCard:down')) return true
        if (status === 'B' && checkPerm('education:lossRenewalCard:down')) return true
        if ((status === 'C' || status === 'D' || status === 'E') && checkPerm('education:renewal:down')) return true
        return false
      }
    },
    data() {
      const { deptId, eduDance, status } = this
      let columns = {}, searchParams = {}, queryParam = {}
      if (status === 'A' || status === 'B') {
        columns = cloneDeep(columns1)
        searchParams = cloneDeep(searchParams1)
        if (deptId) {
          let dept = searchParams.find(d => d.key === 'schoolIds')
          dept.defaultVal = deptId.split(',')
          queryParam.schoolIds = deptId
        }
        let dance = searchParams.find(d => d.key === 'eduDance')
        dance.initialValue = eduDance
        queryParam.eduDance = eduDance
      } else {
        columns = cloneDeep(columns2)
        searchParams = cloneDeep(searchParams2)
        if (deptId) {
          let dept = searchParams.find(d => d.key === 'orgDept')
          dept.defaultVal = deptId.split(',')
          queryParam.orgDept = deptId
        }
        let dance = searchParams.find(d => d.key === 'lastEduDance')
        dance.initialValue = eduDance
        queryParam.lastEduDance = eduDance
      }
      return {
        searchParams,
        columns,
        queryParam,
        loadData: parameter => {
          const { id, status } = this
          if (status === 'A') {
            return listAchievementRenewalCard(Object.assign(parameter, { id }, this.queryParam))
              .then(res => res)
          } else if (status === 'B') {
            return listAchievementLossRenewalCard(Object.assign(parameter, { id }, this.queryParam))
              .then(res => res)
          } else {
            return listAchievementCard(Object.assign(parameter, { id, type: status }, this.queryParam))
              .then(res => res)
          }
        },
      }
    },
    methods: {
      searchSubmit(data, submitType) {
        this.queryParam = data
        if (submitType === 'isReset') {
          this.searchReset()
        }
        this._refreshTable()
      },
      searchReset() {
        const { deptId, eduDance, status } = this
        if (status === 'A' || status === 'B') {
          this.queryParam.schoolIds = deptId
          this.queryParam.eduDance = eduDance
        } else {
          this.queryParam.orgDept = deptId
          this.queryParam.lastEduDance = eduDance
        }
      },
      _refreshTable() {
        this.$refs.table.refresh()
      },

      // 批量导出
      handleReportExport() {
        const { queryParam, id, status } = this
        const token = Vue.ls.get(ACCESS_TOKEN)
        const form = document.createElement('form')
        form.method = 'POST'
        form.target = 'downloadFrame'

        let fields = [
          { name: 'auth_token', value: token },
          { name: 'id', value: id },
        ]
        if (status === 'A') {
          form.action = `${process.env.VUE_APP_URL}/achievement/children/listAchievement/downRenewalCard`
        }
        if (status === 'B') {
          form.action = `${process.env.VUE_APP_URL}/achievement/children/listAchievement/downLossRenewalCard`
        }
        if (status === 'C' || status === 'D' || status === 'E') {
          form.action = `${process.env.VUE_APP_URL}/achievement/children/listAchievement/downRenewal`
          fields.push({ name: 'type', value: status })
        }
        for (let k in queryParam) {
          fields.push({ name: k, value: queryParam[k] })
        }

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

<style lang="less" type="text/less" scoped>
  /deep/.ant-table-thead > tr > th {
    white-space: nowrap;
  }
</style>
