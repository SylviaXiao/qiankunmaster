<template>
  <div>
    <a-card :bordered="false">
      <search-com-pro :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="mb20">
        <perm-box perm="education:eduReport:save">
          <a-button class="mr10" icon="plus-circle" type="primary" @click="addReportOpen">新建报表</a-button>
        </perm-box>
        <perm-box perm="education:report:save">
          <a-button class="mr10" type="primary" @click="batchApproveReportOpen">批量审核</a-button>
        </perm-box>
        <perm-box perm="education:report:save">
          <a-button class="mr10" type="primary" @click="batchCancelApproveReportOpen">批量取消审核</a-button>
        </perm-box>
        <perm-box perm="education:report:remove">
          <a-button class="mr10" type="primary" @click="batchDelete">批量删除</a-button>
        </perm-box>
        <perm-box perm="education:report:down">
          <a-button class="mr10" type="primary" @click="batchExport">批量导出</a-button>
        </perm-box>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id" :rowSelection="rowSelection">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="education:report:save">
            <a href="#" v-if="record.auditBtn == 'Y'" @click="approveReportOpen(record, true)">审核</a>
          </perm-box>
          <a href="#" style="margin-right:5px;" @click="approveReportOpen(record, false)">查看</a>
          <a href="#" @click="printHandle(record)">打印</a>
        </span>
      </s-table>
    </a-card>

    <!-- 新建报表 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="新建报表"
      :visible="addReportVisible"
      :confirmLoading="confirmLoading"
      @ok="addReportOk"
      @cancel="addReportCancel"
    >
      <a-form-model ref="ruleForm" :model="addReportForm" :rules="addReportFormRules">
        <a-form-model-item v-bind="defaultLayout" label="报表名称" prop="reportName">
          <a-input v-model="addReportForm.reportName" />
        </a-form-model-item>
        <a-form-model-item v-bind="defaultLayout" label="报表时间" prop="reportDate">
          <a-range-picker v-model="addReportForm.reportDate" valueFormat="YYYY-MM-DD" :allowClear="false"></a-range-picker>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 审核报表 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      width="70%"
      :title="curRecord && curRecord.reportName"
      :visible="approveReportVisible"
      :confirmLoading="confirmLoading"
      @ok="approveReportOk"
      @cancel="approveReportCancel"
    >
      <approveReport :checked="checked" ref="approveReport" />
    </a-modal>

    <!-- 打印 -->
    <div style="overflow:hidden;height:0;">
      <span ref="printHtml">
        <h2 class="printTitle">{{ curRecord && curRecord.reportName }}</h2>
        <approveReport ref="approveReportPrint" type="print" @print="print" />
      </span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import html2canvas from 'html2canvas'
import printJs from 'print-js'
import tools from '@/tools/common.js'
import approveReport from './approveReport.vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable, PermBox, SearchComPro } from '@/components'
import { scopeDanceList, scopeListArea } from '@/api/common'
// listEduDance
import { pageEduReport, removeReport, saveReport, updateStatus, downEduReport } from '@/api/education'
import { getSchoolList } from '@/api/education/card'

const searchParams = [
  {
    type: 'treeSelect',
    isShow: true,
    key: 'areaId',
    label: '选择地区',
    placeholder: '请选择地区',
    expandAll: true,
    mutiple: false,
    show: true,
    treeCheckable: false,
    selectFather: false,
    treeOps: {
      api: scopeListArea,
      label: 'deptName',
      value: 'id'
    }
  },
  {
    type: 'date',
    key: 'Date',
    show: true,
    label: '创建时间',
    placeholder: '请选择时间',
    format: 'YYYY-MM-DD'
  },
  {
    type: 'text',
    key: 'asTeacherName',
    show: true,
    label: '导师',
    placeholder: '请选择上课导师'
  },
  {
    type: 'text',
    key: 'stuInfo',
    show: true,
    label: '学员',
    placeholder: '学员姓名/手机号码'
  },
  {
    type: 'select',
    key: 'status',
    show: true,
    label: '审核状态',
    placeholder: '请选择审核状态',
    staticArr: [
      {
        string: '通过',
        value: 'Y'
      },
      {
        string: '待审',
        value: 'W'
      }
    ]
  },
  {
    type: 'select', //动态select框
    key: 'danceId',
    show: true,
    label: '舞种',
    placeholder: '请选择舞种',
    apiOption: {
      api: scopeDanceList, // promise类型的接口
      string: 'name',
      value: 'id'
    }
  },
  {
    type: 'text',
    key: 'reportName',
    show: true,
    label: '报表名称',
    placeholder: '请输入报表名称'
  },
  {
    type: 'select',
    key: 'crowdType',
    label: '学员卡人群',
    show: true,
    placeholder: '请选择人群',
    staticArr: [
      {
        string: '成人',
        value: 'A'
      },
      {
        string: '少儿',
        value: 'B'
      },
      {
        string: '通用',
        value: 'C'
      }
    ]
  }
]
const columns = [
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    scopedSlots: { customRender: 'createDate' }
  },
  {
    title: '报表名称',
    dataIndex: 'reportName',
    key: 'reportName',
    scopedSlots: { customRender: 'reportName' }
  },
  {
    title: '数据时间',
    dataIndex: 'startDate',
    key: 'startDate',
    scopedSlots: { customRender: 'startDate' },
    customRender: (text, record) => {
      if (record.startDate && record.endDate) {
        return `${tools.tailor.getDate(record.startDate)} ~ ${tools.tailor.getDate(record.endDate)}`
      }
      return ''
    }
  },
  {
    title: '老师姓名',
    dataIndex: 'asTeacherName',
    key: 'asTeacherName',
    scopedSlots: { customRender: 'asTeacherName' }
  },
  {
    title: '教研负责人',
    dataIndex: 'educationUserName',
    key: 'educationUserName',
    scopedSlots: { customRender: 'educationUserName' }
  },
  {
    title: '学员卡人群',
    dataIndex: 'crowdType',
    key: 'crowdType',
    scopedSlots: { customRender: 'crowdType' },
    customRender: (text, record) => {
      return text === 'A' ? '成人' : text === 'B' ? '少儿' : text === 'C' ? '通用' : ''
    }
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName',
    scopedSlots: { customRender: 'danceName' }
  },
  {
    title: '审核状态',
    dataIndex: 'reportStatus',
    key: 'reportStatus',
    scopedSlots: { customRender: 'reportStatus' },
    customRender: (text, record) => {
      return text == 'Y' ? '通过' : text == 'W' ? '待审' : ''
    }
  },
  {
    title: '审核时间',
    dataIndex: 'examineDate',
    key: 'examineDate',
    scopedSlots: { customRender: 'examineDate' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]
const defaultLayout = {
  labelCol: { md: { span: 6 } },
  wrapperCol: { md: { span: 14 } }
}

export default {
  components: {
    SearchComPro,
    STable,
    PermBox,
    approveReport
  },
  data() {
    return {
      checked: false,
      selectedRowKeys: [],
      selectedRows: [],
      searchParams,
      queryParams: {},
      columns,
      loadData: parameter => {
        // return Promise.resolve({ code: 200, data: [{}], count: 1 })
        return pageEduReport(Object.assign(parameter, this.queryParams)).then(res => {
          this.selectedRowKeys = []
          this.selectedRows = []
          return res
        })
      },
      defaultLayout,
      confirmLoading: false,
      curRecord: null, // 当前选中的单条的数据

      /* 新建报表 */
      addReportVisible: false,
      addReportForm: {
        reportName: '',
        reportDate: []
      },
      addReportFormRules: {
        reportName: [{ required: true, message: '请输入报表名称', trigger: 'change' }],
        reportDate: [{ required: true, message: '请选择报表时间', trigger: 'change' }]
      },

      /* 审核报表 */
      approveReportVisible: false
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
        // getCheckboxProps: record => ({
        //   props: {
        //     disabled: record.auditBtn !== 'Y'
        //   }
        // })
      }
    }
  },
  created() {},
  methods: {
    searchSubmit(data) {
      this.queryParams = data
      this._refreshTable()
    },

    /* 新建报表 */
    addReportOpen() {
      this.addReportVisible = true
    },
    addReportOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          saveReport({
            reportName: this.addReportForm.reportName,
            startDate: this.addReportForm.reportDate[0],
            endDate: this.addReportForm.reportDate[1]
          })
            .then(res => {
              if (res.code === 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: res.msg
                })
                this.addReportCancel()
                this._refreshTable()
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: res.msg
                })
              }
            })
            .finally(() => (this.confirmLoading = false))
        }
      })
    },
    addReportCancel() {
      this.$refs.ruleForm.resetFields()
      this.addReportVisible = false
    },

    /* 审核报表 */
    approveReportOpen(record, checked) {
      this.checked = checked
      this.curRecord = record
      this.approveReportVisible = true
      this.$nextTick(() => {
        this.$refs.approveReport.backData(record)
      })
    },
    approveReportOk() {
      let reportStatus = this.$refs.approveReport.reportStatus
      if (reportStatus !== this.curRecord.reportStatus) {
        this.confirmLoading = true
        updateStatus({ reportIds: this.curRecord.id, status: reportStatus })
          .then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.approveReportCancel()
              this._refreshTable()
            } else {
              this.$notification['error']({
                message: '系统通知',
                description: res.msg
              })
            }
          })
          .finally(() => (this.confirmLoading = false))
      } else {
        this.approveReportCancel()
      }
    },
    approveReportCancel() {
      this.$refs.approveReport.reset()
      this.approveReportVisible = false
    },
    // 校验是否可以审核
    examineAuditBtn() {
      return new Promise((resolve, reject) => {
        let flag = this.selectedRows.every(item => item.auditBtn == 'Y')
        if (!flag) {
          this.$notification['error']({
            message: '系统通知',
            description: '存在没有审核权限的数据'
          })
        } else {
          resolve()
        }
      })
    },
    // 批量审核
    batchApproveReportOpen() {
      this.examine().then(() => {
        this.examineAuditBtn().then(() => {
          this.$confirm({
            title: '系统提示',
            content: '确定要提交审核?',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              updateStatus({ reportIds: this.selectedRowKeys.join(','), status: 'Y' }).then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '操作成功'
                  })
                  this._refreshTable()
                } else {
                  this.$notification['error']({
                    message: '系统通知',
                    description: res.msg
                  })
                }
              })
            }
          })
        })
      })
    },
    // 批量取消审核
    batchCancelApproveReportOpen() {
      this.examine().then(() => {
        this.examineAuditBtn().then(() => {
          this.$confirm({
            title: '系统提示',
            content: '确定要取消审核?',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              updateStatus({ reportIds: this.selectedRowKeys.join(','), status: 'W' }).then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '操作成功'
                  })
                  this._refreshTable()
                } else {
                  this.$notification['error']({
                    message: '系统通知',
                    description: res.msg
                  })
                }
              })
            }
          })
        })
      })
    },
    // 批量删除
    batchDelete() {
      this.examine().then(() => {
        if (this.selectedRows.filter(item => item.reportStatus === 'Y').length > 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '已通过审核的报表无法删除'
          })
        }

        this.$confirm({
          title: '系统提示',
          content: '确定要删除选中数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            removeReport(this.selectedRowKeys.join(',')).then(res => {
              if (res.code === 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                this._refreshTable()
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: res.msg
                })
              }
            })
          }
        })
      })
    },
    // 批量导出
    batchExport() {
      const { queryParams } = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      const schoolId = Vue.ls.get('userDefaultId')
      let fields = [{ name: 'auth_token', value: token }, { name: 'schoolId', value: schoolId }]
      for (let k in queryParams) {
        fields.push({ name: k, value: queryParams[k] })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}/eduscore/report/downEduReport`
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
    // 打印
    printHandle(record) {
      this.curRecord = record
      this.$refs.approveReportPrint.backData(record)
    },
    print() {
      html2canvas(this.$refs.printHtml, {
        useCORS: true,
        scale: 2,
        dpi: 150
      })
        .then(canvas => {
          const printable = canvas.toDataURL()
          printJs({ printable, type: 'image' })
        })
        .catch(err => console.log(err))
    },

    // 校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve()
        }
      })
    },
    // 刷新列表
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
.printTitle {
  width: 100%;
  text-align: center;
}
</style>
