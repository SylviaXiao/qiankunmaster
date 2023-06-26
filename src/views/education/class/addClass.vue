<template>
  <div>
    <div v-show="!success">
      <class-form
        ref="classForm"
        :roomList="roomList"
        formTitle="新增班级"
        @chooseRoom="setRoomVal"
        @cardDuration="changeCardDuration"
        @classInfo="changeClassInfo"
        :isChildren="isChildren"
      ></class-form>
      <class-plans
        ref="classPlans"
        :roomList="roomList"
        :defRoom="defRoom"
        :cardDuration="cardDuration"
        :classInfo="classInfo"
      ></class-plans>
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
import { saveClass, getClassInfo } from '@/api/education'
import { listEduRoom } from '@/api/common'
import ClassPlans from '../modules/addClassPlans'
import ClassForm from '../modules/editClassForm'
import { Result } from '@/components'

export default {
  name: 'addClass',
  components: {
    Result,
    ClassPlans,
    ClassForm
  },
  watch: {
    $route(nv, ov) {
      if(nv.name==="addClass"){
        this.isChildren=!!nv.query.isChildren
      }
    }
  },
  data() {
    return {
      isChildren:!!this.$route.query.isChildren,
      success: false,
      loading: false,
      roomList: [],
      multiTab: false,
      defRoom: '',
      cardDuration: null,
      classInfo: null
    }
  },
  created() {
    this.getRoomList()
  },
  methods: {
    changeCardDuration(cardDuration) {
      this.cardDuration = cardDuration
    },
    changeClassInfo(classInfo) {
      this.classInfo = classInfo
    },
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
          this.$refs.classForm.apportionValidate()
            .then(msg => {
              if (msg) {
                this.$notification['error']({
                  message: '系统通知',
                  description: msg
                })
              } else {
                this.$refs.classPlans.getClassPlansValues().then(classPlans => {
                  classForm.plans = classPlans
                  this.loading = true
                  return saveClass(classForm)
                    .then(res => {
                      this.loading = false
                      if (res.code === 200) {
                        this.$refs.classForm.apportionSave(res.data)
                          .then(res => {
                            this.$notification['success']({
                              message: '系统通知',
                              description: '操作成功'
                            })
                            setTimeout(() => {
                              this.pageChange(classForm).then(fullPath => this.$multiTab.close(fullPath))
                            }, 400)
                          })
                      }
                    })
                    .catch(err => {

                    })
                    .finally(() => {
                      this.loading = false
                    })
                })
              }
            })
        })
    },
    pageChange(data) {
      return new Promise((resolve, reject) => {
        const {
          $route: { fullPath }
        } = this
        if(this.isChildren){
          this.$router.push({ name: 'childrenClassList' })
        }else{
          this.$router.push({ name: 'classList' })
        }
        resolve(fullPath)
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
