<template>
  <div class="change-audition-class-wrapper">
    <a-modal
      :maskClosable="false"
      :destroyOnClose="true"
      :width="500"
      title="修改试课班级"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="close"
    >
      <a-form-model :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item label="试课班级">
          <a-input-search v-model="className" placeholder="请选择排课" enter-button read-only @search="openCourse"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!--选择排课-->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="预约试课"
      :width="1100"
      :visible="courseVisible"
      @ok="handleCourseOk"
      @cancel="handleCourseCancel"
    >
      <ChooseCourse ref="chooseCourse"/>
    </a-modal>
  </div>
</template>

<script>
  import ChooseCourse from '@/components/ChooseCourse'
  import { updateAuditionLogClass } from '@/api/student'

  export default {
    name: 'ChangeAuditionClass',
    components: {
      ChooseCourse
    },
    data() {
      return {
        confirmLoading: false,
        visible: false,
        auditionId: '',
        dancePlanId: '',
        className: '',
        courseVisible: false
      }
    },
    methods: {
      open(record) {
        this.auditionId = record.auditionId
        this.dancePlanId = record.dancePlanId
        this.className = record.className
        this.visible = true
      },
      close() {
        this.auditionId = ''
        this.dancePlanId = ''
        this.className = ''
        this.visible = false
      },
      handleOk() {
        const { auditionId, dancePlanId } = this
        this.confirmLoading = true
        updateAuditionLogClass({ auditionLogId: auditionId, eduDancePlanId: dancePlanId })
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

      // 选择排课
      openCourse() {
        this.courseVisible = true
      },
      handleCourseOk() {
        let selectedRow = this.$refs.chooseCourse.selectedRows[0]
        this.dancePlanId = selectedRow.planId
        this.className = selectedRow.className
        this.handleCourseCancel()
      },
      handleCourseCancel() {
        this.courseVisible = false
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped></style>
