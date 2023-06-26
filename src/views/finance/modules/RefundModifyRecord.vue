<template>
  <div>
    <a-modal
      title="详情"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :visible="visible"
      :width="800"
      @cancel="close"
    >
      <div style="margin-top: -16px">
        <a-divider orientation="left">修改记录</a-divider>
        <a-table
          ref="table"
          :columns="modifyColumns"
          :dataSource="modifyList"
          :rowKey="record => record.id"
          :pagination="false"
        ></a-table>
        <a-divider orientation="left">请假记录</a-divider>
        <a-table
          ref="table"
          :columns="leaveColumns"
          :dataSource="leaveList"
          :rowKey="record => record.id"
          :pagination="false"
        ></a-table>
      </div>
      <template slot="footer">
        <template>
          <a-button @click="close">关闭</a-button>
        </template>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import { refundApprovalStudentCardLog, listStuLeave } from '@/api/reception/student'

  const dateRender = (text, record) => {
    return text ? moment(text).format('YYYY-MM-DD') : ''
  }
  const endDateRender = (text, record) => {
    return text ? moment(text).subtract(1, 'seconds').format('YYYY-MM-DD HH:mm') : ''
  }
  const modifyColumns = [
    {
      title: '修改类型',
      dataIndex: 'type'
    },
    {
      title: '修改前',
      dataIndex: 'after'
    },
    {
      title: '修改后',
      dataIndex: 'before'
    },
    {
      title: '操作人',
      dataIndex: 'userName'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    }
  ]
  const leaveColumns = [
    {
      title: '卡号',
      dataIndex: 'stuCardNo'
    },
    {
      title: '班级',
      dataIndex: 'className'
    },
    {
      title: '类型',
      dataIndex: 'typeName'
    },
    {
      title: '卡有效期截止',
      dataIndex: 'cardEndDate',
      customRender: endDateRender
    },
    {
      title: '请假开始时间',
      dataIndex: 'stateDate',
      customRender: dateRender
    },
    {
      title: '请假结束时间',
      dataIndex: 'endDate',
      customRender: dateRender
    },
    {
      title: '请假实际结束时间',
      dataIndex: 'actEndDate',
      customRender: dateRender
    },
    {
      title: '备注',
      dataIndex: 'remark'
    }
  ]

  export default {
    data() {
      return {
        visible: false,
        modifyColumns,
        modifyList: [],
        leaveColumns,
        leaveList: []
      }
    },
    created() {
    },
    methods: {
      open(data) {
        this.visible = true
        this.initModifyList(data.studentCardId)
        this.initLeaveList(data.studentId)
      },
      close() {
        this.visible = false
        this.modifyList = []
        this.leaveList = []
      },
      // 修改记录
      initModifyList(studentCardId) {
        this.modifyList = []
        refundApprovalStudentCardLog(studentCardId)
          .then(res => {
            const { listStuCardModifyLog, listStuCardNumLog } = res.data
            this.modifyList.push(...listStuCardNumLog.map(d => ({
              type: '修改次数',
              after: `${d.oldUsedCount}/${d.oldTotalCount}`,
              before: `${d.newUsedCount}/${d.newTotalCount}`,
              userName: d.userName,
              remark: d.remark
            })))
            this.modifyList.push(...listStuCardModifyLog.map(d => ({
              type: '修改有效期',
              after: this.$tools.tailor.getDate(d.afterClosingDate),
              before: this.$tools.tailor.getDate(d.beforeClosingDate),
              userName: d.userName,
              remark: d.remark
            })))
          })
      },
      // 请假记录
      initLeaveList(stuId) {
        listStuLeave({ stuId })
          .then(res => {
            this.leaveList = res.data || []
          })
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
</style>
