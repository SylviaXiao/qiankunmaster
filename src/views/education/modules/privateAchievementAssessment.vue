<template>
  <div>
    <a-card :bordered="false">
      <search-com-pro :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="mb20">
        <perm-box perm="education:achievescore:save">
          <a-button class="mr10" icon="plus-circle" type="primary" @click="addReportOpen">新建报表</a-button>
        </perm-box>
        <!--<perm-box perm="education:achievescore:save">
          <a-button class="mr10" type="primary" @click="batchApproveReportOpen">批量审核</a-button>
        </perm-box>
        <perm-box perm="education:achievescore:save">
          <a-button class="mr10" type="primary" @click="batchCancelApproveReportOpen">批量取消审核</a-button>
        </perm-box>-->
        <perm-box perm="education:achievescore:remove">
          <a-button class="mr10" type="primary" @click="batchDelete">批量删除</a-button>
        </perm-box>
        <perm-box perm="education:achievescore:down">
          <a-button class="mr10" type="primary" @click="batchExport">批量导出</a-button>
        </perm-box>
        <perm-box perm="education:achievescore:refresh">
          <a-button class="mr10" type="primary" @click="refreshAchieveScore">刷新</a-button>
        </perm-box>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id" :rowSelection="rowSelection">
        <span slot="action" slot-scope="text, record">
          <a href="#" style="margin-right:5px;" v-if="record.auditBtn == 'Y'" @click="scoreOpen(record, true)">评分</a>
          <!--<perm-box perm="education:achievescore:save" v-if="record.achieveStatus === 'Y'">
            <a href="#" v-if="record.authority == 'A'" @click="approveReportOpen(record)">审核</a>
          </perm-box>-->
          <a href="#" style="margin-right:5px;" @click="scoreOpen(record, false)">查看</a>
          <a href="#" @click="printHandle(record)">打印</a>
        </span>
      </s-table>
    </a-card>

    <!-- 评分 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      width="70%"
      :title="curRecord && curRecord.achieveScoreName"
      :visible="scoreVisible"
      :confirmLoading="confirmLoading"
      @ok="scoreOk"
      @cancel="scoreCancel"
    >
      <assessmentScore :checked="checked" ref="assessmentScore" />
    </a-modal>

    <!-- 审核报表 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      width="70%"
      :title="curRecord && curRecord.achieveScoreName"
      :visible="approveReportVisible"
      :confirmLoading="confirmLoading"
      @ok="approveReportOk"
      @cancel="approveReportCancel"
    >
      <approveAchieveScore ref="approveAchieveScore" />
    </a-modal>
    <!-- 打印 -->
    <div style="overflow:hidden;height:0;">
      <span ref="printHtml">
        <h2 class="printTitle">{{ curRecord && curRecord.achieveScoreName }}</h2>
        <approveAchieveScore ref="approveAchieveScorePrint" type="print" @print="print" />
      </span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import tools from '@/tools/common.js'
import html2canvas from 'html2canvas'
import printJs from 'print-js'
import moment from 'moment'
import assessmentScore from './assessmentScore.vue'
import approveAchieveScore from './approveAchieveScore.vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable, PermBox, SearchComPro } from '@/components'
import { scopeDanceList, scopeListAreaAndChildren } from '@/api/common'
import { pageAchieveScore, removeAchieveScore, saveEduAchieveScore, saveScore, updateAchieveScoreStatus,refreshAchieveScore } from '@/api/education'
import { getSchoolList } from '@/api/education/card'

const searchParams = [
  {
    type: 'treeSelect',
    isShow: true,
    show: true,
    key: 'schoolId',
    label: '选择分馆',
    placeholder: '请选择分馆',
    expandAll: true,
    selectFather: true,
    mutiple: true,
    treeCheckable: true,
    treeOps: {
      api: scopeListAreaAndChildren,
      label: 'deptName',
      value: 'id',
      children: 'children'
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
    type: 'select',
    key: 'achieveStatus',
    show: true,
    label: '评分状态',
    placeholder: '请选择评分状态',
    staticArr: [
      {
        string: '已评分',
        value: 'Y'
      },
      {
        string: '未评分',
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
    key: 'achieveScoreName',
    show: true,
    label: '报表名称',
    placeholder: '请输入报表名称'
  },
  // {
  //   type: 'select',
  //   key: 'status',
  //   show: true,
  //   label: '审核状态',
  //   placeholder: '请选择审核状态',
  //   staticArr: [
  //     {
  //       string: '通过',
  //       value: 'Y'
  //     },
  //     {
  //       string: '待审',
  //       value: 'W'
  //     }
  //   ]
  // },
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
  },
  {
    type: 'date',
    key: 'ExamineDate',
    show: true,
    label: '评分时间',
    placeholder: '请选择时间',
    format: 'YYYY-MM-DD'
  },
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
    dataIndex: 'achieveScoreName',
    key: 'achieveScoreName',
    scopedSlots: { customRender: 'achieveScoreName' }
  },
  {
    title: '截止时间',
    dataIndex: 'endDate',
    key: 'endDate',
    scopedSlots: { customRender: 'endDate' },
    customRender: (text, record) => {
      return text ? tools.tailor.getDate(text) : ''
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
    title: '评分状态',
    dataIndex: 'achieveStatus',
    key: 'achieveStatus',
    scopedSlots: { customRender: 'achieveStatus' },
    customRender: (text, record) => {
      return text == 'Y' ? '已评分' : text == 'W' ? '未评分' : ''
    }
  },
  {
    title: '评分人',
    dataIndex: 'userName',
    key: 'userName',
    scopedSlots: { customRender: 'userName' }
  },
  {
    title: '评分时间',
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
    assessmentScore,
    approveAchieveScore
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
        return pageAchieveScore(Object.assign(parameter, this.queryParams)).then(res => {
          this.selectedRowKeys = []
          this.selectedRows = []
          return res
        })
      },
      defaultLayout,
      confirmLoading: false,
      curRecord: null, // 当前选中的单条的数据

      /* 评分 */
      scoreVisible: false,

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
      }
    }
  },
  created() {},
  methods: {
    refreshAchieveScore(){
      let {startDate,endDate,startExamineDate,endExamineDate}=this.queryParams
      let params = {
        startDate: startDate,
        endDate: endDate,
        scoreStartDate: startExamineDate,
        scoreEndDate: endExamineDate
      }
      if(!startDate&&!startExamineDate){
        this.$notification['error']({
          message: '温馨提示',
          description:'请选择创建时间或者评分时间'
        })
        return
      }
      refreshAchieveScore(params).then(res=>{
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
    },
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    searchSubmit(data) {
      this.queryParams = data
      this._refreshTable()
    },

    /* 新建报表 */
    addReportOpen() {
      this.$confirm({
        title: '系统提示',
        content: '确定要新建报表?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          saveEduAchieveScore().then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '报表生成中，请稍后查询'
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
    },

    /* 评分 */
    scoreOpen(record, checked) {
      this.checked = checked
      this.curRecord = record
      this.scoreVisible = true
      this.$nextTick(() => {
        this.$refs.assessmentScore.backData(record)
      })
    },
    scoreOk() {
      if (!this.checked) {
        this.scoreVisible = false
        return
      }
      this.$refs.assessmentScore.validateFields().then(data => {
        this.confirmLoading = true
        saveScore({ eduAchieveScores: JSON.stringify(data) })
          .then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.scoreCancel()
              this._refreshTable()
            } else {
              this.$notification['error']({
                message: '系统通知',
                description: res.msg
              })
            }
          })
          .finally(() => (this.confirmLoading = false))
      })
    },
    scoreCancel() {
      this.$refs.assessmentScore.reset()
      this.scoreVisible = false
    },

    /* 审核报表 */
    approveReportOpen(record) {
      this.curRecord = record
      this.approveReportVisible = true
      this.$nextTick(() => {
        this.$refs.approveAchieveScore.backData(record)
      })
    },
    approveReportOk() {
      let reportStatus = this.$refs.approveAchieveScore.reportStatus
      if (reportStatus !== this.curRecord.reportStatus) {
        this.confirmLoading = true
        updateAchieveScoreStatus({ reportIds: this.curRecord.id, status: reportStatus })
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
      this.$refs.approveAchieveScore.reset()
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
          if (this.selectedRows.filter(item => item.achieveStatus === 'W').length > 0) {
            return this.$notification['error']({
              message: '系统通知',
              description: '未评分的报表无法审核'
            })
          }
          this.$confirm({
            title: '系统提示',
            content: '确定要提交审核?',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              updateAchieveScoreStatus({ reportIds: this.selectedRowKeys.join(','), status: 'Y' }).then(res => {
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
              updateAchieveScoreStatus({ reportIds: this.selectedRowKeys.join(','), status: 'W' }).then(res => {
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
            removeAchieveScore(this.selectedRowKeys.join(',')).then(res => {
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
      form.action = `${process.env.VUE_APP_URL}/eduscore/achievescore/downAchievescore`
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
      this.$refs.approveAchieveScorePrint.backData(record)
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
