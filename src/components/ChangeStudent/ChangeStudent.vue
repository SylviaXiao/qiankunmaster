<template>
  <div class="change-student-wrapper">
    <a-modal
      :maskClosable="false"
      :destroyOnClose="true"
      :width="800"
      title="变更学员"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="close"
    >
      <a-row class="mb20">
        <a-col :lg="24" :md="24" :sm="24" :xs="24">当前绑定学员</a-col>
        <a-col :lg="6" :md="6" :sm="12" :xs="24">姓名：{{oldStu.stuName}}</a-col>
        <a-col :lg="6" :md="6" :sm="12" :xs="24">手机号码：{{oldStu.stuPhone}}</a-col>
      </a-row>
      <a-form-model :model="form" layout="inline" class="mb20">
        <a-form-model-item label="变更学员" prop="stuName">
          <a-input-search v-model="form.stuName" placeholder="请选择变更学员" enter-button read-only @search="openStudent"/>
        </a-form-model-item>
      </a-form-model>

      <a-divider orientation="left">变更记录</a-divider>
      <div class="table-wrap">
        <a-table ref="table" :columns="logColumns" :dataSource="logData" :rowKey="(record, index) => index" :pagination="false"></a-table>
      </div>
    </a-modal>
    <!--变更学员-->
    <ChooseStu
      ref="chooseStu"
      :multiple="false"
      :changeStudent="true"
      :noArea="true"
      :branch="true"
      :studentNumber="true"
      @getBackData="handleStudentOk"
    />
  </div>
</template>

<script>
  import ChooseStu from '@/components/ChooseStu'
  import { listStuUserChangeLog, changeStuUser } from '@/api/student'

  export default {
    name: 'ChangeStudent',
    components: {
      ChooseStu
    },
    data() {
      return {
        confirmLoading: false,
        visible: false,
        oldStu: {},
        form: {},
        studentVisible: false,
        logColumns: [
          {
            title: '变更类容',
            dataIndex: 'remark',
            key: 'remark'
          },
          {
            title: '操作时间',
            dataIndex: 'createDate',
            key: 'createDate'
          },
          {
            title: '操作人',
            dataIndex: 'userName',
            key: 'userName'
          }
        ],
        logData: []
      }
    },
    methods: {
      open(record) {
        const { id, studentId, stuName, stuPhone } = record
        this.oldStu = { stuName, stuPhone }
        this.form = { id, studentId, stuName }
        this.getChangeLog()
        this.visible = true
      },
      close() {
        this.form = {}
        this.visible = false
      },
      handleOk() {
        const { id, studentId } = this.form
        this.confirmLoading = true
        changeStuUser({ stuUserId: id, stuInfoId: studentId })
          .then(res => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            } else {
              this.$notification['error']({
                message: '系统通知',
                description: res.msg
              })
            }
            this.$emit('confirm', res)
          })
          .finally(() => (this.confirmLoading = false))
      },
      getChangeLog() {
        listStuUserChangeLog({ stuUserId: this.form.id })
          .then(res => {
            this.logData = res.data || []
          })
      },
      // 变更学员
      openStudent() {
        this.$refs.chooseStu.open()
      },
      handleStudentOk(data) {
        this.form.studentId = data.stuId
        this.form.stuName = data.stuName
        this.handleStudentCancel()
      },
      handleStudentCancel() {
        this.$refs.chooseStu.close()
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .mb20 {
    margin-bottom: 20px;
  }
  .table-wrap {
    margin-bottom: -25px;
  }
</style>
