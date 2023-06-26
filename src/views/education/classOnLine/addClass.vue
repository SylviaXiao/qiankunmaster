<template>
  <div>
    <div v-show="!success">
      <class-form ref="classForm" :roomList="roomList" formTitle="新增线上班级" @chooseRoom="setRoomVal"></class-form>
      <class-plans ref="classPlans" :roomList="roomList" :defRoom="defRoom"></class-plans>
      <a-button type="primary" @click="sendForm()" :loading="loading" style="margin-top: 15px;">提交</a-button>
    </div>
    <div v-show="success">
      <a-card class="card" :bordered="false">
        <result type="success" title="提交成功">
          <template slot="description">
            <span>请关闭该页面</span>
            <a-divider type="vertical" />
            <span>或</span>
            <a-divider type="vertical" />
            <a href="#" @click="continueAdd">点击继续添加</a>
          </template>
        </result>
      </a-card>
    </div>
  </div>
</template>

<script>
import { saveClassOnLine, getClassInfo } from '@/api/education'
import { listEduRoom } from '@/api/common'
import ClassPlans from '../modules/addClassOnLinePlans'
import ClassForm from '../modules/editClassOnLineForm'
import { Result } from '@/components'

export default {
  name: 'addClass',
  components: {
    Result,
    ClassPlans,
    ClassForm
  },
  watch: {},
  data() {
    return {
      success: false,
      loading: false,
      roomList: [],
      multiTab: false,
      defRoom: ''
    }
  },
  created() {
    this.getRoomList()
  },
  methods: {
    getRoomList() {
      listEduRoom().then(res => (this.roomList = res.data))
    },
    setRoomVal(val) {
      this.defRoom = val
    },
    continueAdd() {
      this.$refs.classForm.resetForm()
      this.$refs.classPlans.initTable()
      this.success = false
    },
    sendForm() {
      this.$refs.classForm
      .getFormValues()
      .then(classForm => {
          this.loading = true
          this.$refs.classPlans.getClassPlansValues().then(classPlans => {
            classForm.plans = classPlans
            return saveClassOnLine(classForm).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                setTimeout(() => {
                  this.pageChange(classForm).then(fullPath => this.$multiTab.close(fullPath))
                }, 400)
              }
            })
          })
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    pageChange(data) {
      return new Promise((resolve, reject) => {
        const {
          $route: { fullPath }
        } = this
        this.$router.push({ name: 'classOnLineList' })
        resolve(fullPath)
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
