<template>
  <div>
    <a-card style="margin: 20px 0;" :bordered="false">
      <search-com-pro :style="{ padding: '10px 0' }" :searchParams="searchParams"
        @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <a-space>
        <perm-box perm="education:children-report:save">
          <a-button type="primary" @click="handleAdd">新建</a-button>
        </perm-box>
        <a-button @click="_refreshTable">刷新</a-button>
        <perm-box perm="education:children-report:del">
          <a-button type="primary" :disabled="!exportEnabled" @click="handleBatchDelete">批量删除</a-button>
        </perm-box>
        <perm-box perm="education:children-report:exportlist">
          <a-button type="primary" @click="handleBatchExportList">批量列表导出</a-button>
        </perm-box>
        <perm-box perm="education:children-report:exportdetails">
          <a-button type="primary" @click="handleBatchExportDetail">批量明细导出</a-button>
        </perm-box>
      </a-space>
      <s-table class="mt-10" ref="table" :rowSelection="rowSelection" :columns="columns" :data="loadData" rowKey="id">
        <span slot="action" slot-scope="text, record">
          <perm-box v-if="hasScored(record)" perm="education:children-report:ungrade">
            <a @click="navToScore(record)">{{ '取消评分' }}</a>
          </perm-box>
          <perm-box v-else perm="education:children-report:grade">
            <a v-if="record.isGrade === 'Y'" @click="navToScore(record)">{{ '评分' }}</a>
          </perm-box>
          <perm-box perm="education:children-report:viewgrade">
            <a v-if="checkDetailAccess(record)" @click="navToReportDetail(record)">详情</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <a-modal title="新建报表" :visible="addVisible" :width="600" @ok="handleFormOk" @cancel="addVisible = false">
      <a-form-model ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="报表时间" :rules="[{ required: true, message: '请选择', trigger: 'change' }]" prop="startDate">
          <a-range-picker v-model="reportRange" @change="onReportDateChange" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getChildrenPerformanceList, childrenPerformanceGenerateReport, childrenPerformanceUnGrade, childrenPerformanceExportList, childrenPerformanceExportDetail, batchDeleteChildrenPerformance } from '@/api/education'
import { STable, SearchComPro, PermBox } from '@/components'
import { getSchoolList } from '@/api/education/card'
const columns = [
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createDate'
  },
  {
    title: '分馆',
    align: 'center',
    dataIndex: 'schoolDeptName'
  },
  {
    title: '班级名称',
    align: 'center',
    dataIndex: 'className'
  },
  {
    title: '数据时间',
    align: 'center',
    dataIndex: 'startReportDate'
  },
  {
    title: '老师姓名',
    align: 'center',
    dataIndex: 'teacherName'
  },
  {
    title: '舞种',
    align: 'center',
    dataIndex: 'danceName'
  },
  {
    title: '教研负责人',
    align: 'center',
    dataIndex: 'teachingResearch'
  },
  {
    title: '评分状态',
    align: 'center',
    dataIndex: 'scoreState',
    customRender: val => {
      if (val == 'Y') { return '已评分' }
      else if (val == 'N') { return '未评分' }
      return val
    }
  },
  {
    title: '评分人',
    align: 'center',
    dataIndex: 'scoreUserName'
  },
  {
    title: '评分时间',
    align: 'center',
    dataIndex: 'scoreDate'
  },
  {
    title: '操作',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]
export default {
  name: 'childrenPerformanceReportNew',
  components: {
    STable,
    SearchComPro,
    PermBox
  },
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          show: true,
          key: 'Date',
          label: '创建时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'treeSelect',
          show: true,
          isShow: true,
          key: 'deptIds',
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
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称'
        },
        {
          type: 'select',
          key: 'scoreState',
          label: '评分状态',
          show: true,
          placeholder: '请选择',
          initialValue: '',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '已评分',
              value: 'Y'
            },
            {
              string: '未评分',
              value: 'N'
            }
          ]
        },
      ],
      queryParams: {
        startDate: null,
        endDate: null
      },
      columns,
      loadData: parameter => {
        const params = {
          ...parameter,
          ...this.queryParams,
        }
        return getChildrenPerformanceList(params).then(res => {
          if(res.msg){
            this.$notification['success']({
              message: '系统通知',
              description: res.msg
            })
          }
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      form: {
        startDate: null,
        endDate: null
      },
      reportRange: null,
      addVisible: false,
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
    },
    exportEnabled() {
      return this.selectedRows?.length > 0
    },
  },
  methods: {
    _refreshTable() {
      this.$refs.table.refresh()
    },
    searchSubmit(data) {
      this.queryParams = data
      this._refreshTable()
    },
    // 1.教研负责人id包含自己账号id，且已评分，并且有详情页权限
    // 2.教研负责人id不包含，则只看有没有详情页权限
    // 页面权限由perm-box控制
    checkDetailAccess(record) {
      const { teachingResearchIds } = record
      let ids = teachingResearchIds.split(',')
      let userId = this.$store.state.user.userId
      // 不在教研负责人中，其他人都可以看
      if (!ids.includes(userId)) return true
      // 在教研负责人中，已评分才能看，否则看不了
      return this.hasScored(record)
    },
    handleAdd() {
      this.reportRange = null
      this.form = {
        startDate: null,
        endDate: null
      }
      this.addVisible = true
    },
    async handleFormOk() {
      let pass = await this.$refs.form.validate()
      if (!pass) return
      let res = await childrenPerformanceGenerateReport(this.form)
      this.$message.info(res.msg)
      this.addVisible = false

      setTimeout(() => {
        this._refreshTable()
      }, 3000)
    },
    onReportDateChange(date, dateString) {
      this.reportRange = date
      this.form.startDate = dateString[0]
      this.form.endDate = dateString[1]
    },
    hasScored(record) {
      return record.scoreState == 'Y'
    },
    navToScore(record) {
      if (this.hasScored(record)) {
        this.$confirm({
          content: '确认取消该条评分吗?',
          onOk: () => {
            childrenPerformanceUnGrade(record.id).then(res => {
              this.$message.success('取消评分成功')
              this._refreshTable()
            })
          },
        })
      } else {
        this.navToReportDetail(record, 'score')
      }
    },
    navToReportDetail(record, type = 'detail') {
      const { id, className } = record
      this.$router.push({ path: `/education/childrenPerformanceReportDetailNew/${id}/${className}/${type}` })
    },
    getReportIds() {
      let ids = []
      for (const record of this.selectedRows) {
        ids.push(record.id)
      }
      return { reportIds: ids.join(',') }
    },
    handleBatchDelete() {
      this.$confirm({
        content: '确定要批量删除吗？',
        onOk: () => {
          batchDeleteChildrenPerformance(this.getReportIds()).then(res => {
            this.$message.success(res.msg || '删除成功')
            this._refreshTable()
          })
        }
      })
    },
    async handleBatchExportList() {
      let res = await childrenPerformanceExportList(this.queryParams)
      this.$tools.exportExcel(res, '少儿绩效表')
    },
    async handleBatchExportDetail() {
      let res = await childrenPerformanceExportDetail(this.queryParams)
      this.$tools.exportExcel(res, '少儿绩效详情表')
    }
  }
}
</script>

<style lang="less" scoped></style>