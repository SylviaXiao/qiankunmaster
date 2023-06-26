<template>
  <div>
    <a-card :bordered="false" style="margin: 20px 0;">
      <search-com-pro :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="mb20">
        <a-space :size="15">
          <perm-box perm="education:children:save">
            <a-button icon="plus-circle" type="primary" @click="handleReportOpen()">新建</a-button>
          </perm-box>
          <perm-box perm="education:children:delete">
            <a-button type="primary" @click="handleReportDelete">批量删除</a-button>
          </perm-box>
        </a-space>
      </div>
      <s-table ref="table" :rowSelection="rowSelection" :columns="columns" :data="loadData" rowKey="id">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="education:children:detail">
            <a href="#" @click="handleReportDetail(record)">详情</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <!-- 新建报表 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      :confirmLoading="confirmLoading"
      v-model="addReportVisible"
      title="新建报表"
      @cancel="handleReportCancel"
      @ok="handleReportOk"
    >
      <a-form-model ref="ruleForm" :model="addReportForm" :rules="addReportFormRules">
        <a-form-model-item v-bind="defaultLayout" label="报表名称" prop="name">
          <a-input v-model="addReportForm.name" />
        </a-form-model-item>
        <a-form-model-item v-bind="defaultLayout" label="报表时间" prop="date">
          <a-range-picker v-model="addReportForm.date" valueFormat="YYYY-MM-DD" :allowClear="false"></a-range-picker>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import tools from '@/tools/common.js'
  import { STable, SearchComPro, PermBox } from '@/components'
  import { listAchievement, saveAchievement, deleteAchievements } from '@/api/education'

  const searchParams = [
    {
      type: 'date',
      show: true,
      key: 'Date',
      label: '创建时间',
      placeholder: '请选择时间',
      format: 'YYYY-MM-DD'
    },
    {
      type: 'text',
      show: true,
      key: 'name',
      label: '报表名称',
      placeholder: '请输入报表名称'
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
      dataIndex: 'name',
      key: 'name',
      scopedSlots: { customRender: 'name' }
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
    name: 'childrenPerformanceReport',
    components: {
      SearchComPro,
      STable,
      PermBox,
    },
    data() {
      return {
        searchParams,
        columns,
        defaultLayout,
        queryParam: {},
        loadData: parameter => {
          return listAchievement(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
        confirmLoading: false,

        /* 新建报表 */
        addReportVisible: false,
        addReportForm: {
          name: '',
          date: []
        },
        addReportFormRules: {
          name: [{ required: true, message: '请输入报表名称', trigger: 'change' }],
          date: [{ required: true, message: '请选择报表时间', trigger: 'change' }]
        },
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
    methods: {
      searchSubmit(data) {
        this.queryParam = data
        this._refreshTable()
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
      _refreshTable() {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$refs.table.refresh()
      },

      handleReportDelete() {
        this.examine().then(() => {
          this.$confirm({
            title: '系统提示',
            content: '确定要删除选中数据吗?',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              deleteAchievements(this.selectedRowKeys.join(',')).then(res => {
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
      handleReportOpen() {
        this.addReportVisible = true
      },
      handleReportCancel() {
        this.$refs.ruleForm.resetFields()
        this.addReportVisible = false
      },
      handleReportOk() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true
            saveAchievement({
              name: this.addReportForm.name,
              startDate: this.addReportForm.date[0],
              endDate: this.addReportForm.date[1]
            })
              .then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '报表正在生成中，请稍后'
                  })
                  this.handleReportCancel()
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
      handleReportDetail({ id, name }) {
        this.$router.push({ path: `/education/childrenPerformanceReportDetail/${id}/${name}` })
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
</style>
