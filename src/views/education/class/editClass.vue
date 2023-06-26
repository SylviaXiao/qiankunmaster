<template>
  <div>
    <class-form
      ref="classForm"
      :roomList="roomList"
      :formTitle="formTitle"
      :classInfo="classInfo"
      @chooseRoom="setRoomVal"
      :isEdit="isEdit"
      @cardDuration="changeCardDuration"
      :isChildren='isChildren'
      @classInfo="changeClassInfo"
    ></class-form>
    <class-plans
      ref="classPlans"
      :roomList="roomList"
      :classPlansInfo="classPlansInfo"
      :isEdit="isEdit"
      :defRoom="defRoom"
      :cardDuration="cardDuration"
      :classInfo="classInfo"
    ></class-plans>
    <a-button type="primary" @click="sendForm()" :loading="loading" style="margin-top: 15px;">提交</a-button>

    <!--    <footer-tool-bar>-->
    <!--      <a-button type="primary" @click="sendForm()" :loading="loading">提交</a-button>-->
    <!--    </footer-tool-bar>-->
  </div>
</template>

<script>
import { saveClass, getClassInfo } from '@/api/education'
import { listEduRoom } from '@/api/common'
import ClassPlans from '../modules/addClassPlans'
import ClassForm from '../modules/editClassForm'
import FooterToolBar from '@/components/FooterToolbar'

export default {
  name: 'editClass',
  components: {
    ClassPlans,
    ClassForm,
    FooterToolBar
  },
  watch: {
    $route(nv, ov) {
      if (nv.params.classid !== 'addClass' && nv.path.indexOf('editClass') !== -1) {
        this.$nextTick(() => {
          this.getRoomList()
          this.getClassInfo()
        })
      } else if (nv.params.classid === 'addClass') {
        this.initForm()
      }
    }
  },
  data() {
    return {
      isChildren:!!this.$route.query.isChildren,
      loading: false,
      classId: '',
      roomList: [],
      classInfo: {},
      classPlansInfo: [],
      isEdit: true,
      formTitle: '编辑班级',
      defRoom: '',
      cardDuration: null
    }
  },
  beforeCreate() {},
  mounted() {},
  created() {
    if (this.$route.params.classid === 'addClass') {
      this.initForm()
    } else {
      this.formTitle = '编辑班级'
      this.getClassInfo()
      this.getRoomList()
    }
  },
  methods: {
    changeCardDuration(cardDuration) {
      this.cardDuration = cardDuration
    },
    changeClassInfo(classInfo) {
      this.classInfo = classInfo
    },
    setRoomVal(val) {
      this.defRoom = val
    },
    initForm() {
      this.isEdit = false
      this.formTitle = '新增班级'
      this.$refs.classPlans.initTable()
      this.$refs.classForm.initForm()
    },
    getRoomList() {
      listEduRoom().then(res => (this.roomList = res.data))
    },
    getClassInfo() {
      this.classId = this.$route.params.classid
      this.isEdit = true
      getClassInfo(this.classId).then(res => {
        this.classInfo = res.data
        this.classPlansInfo = res.data.classPlan
        this.isEdit = false
      })
    },
    sendForm() {
      this.loading = true
      this.$refs.classForm
        .getFormValues()
        .then(classForm => {
          this.$refs.classPlans.getClassPlansValues().then(classPlans => {
            classForm.plans = classPlans
            return saveClass(classForm).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              setTimeout(() => {
                this.pageChange(classForm).then(fullPath => this.$multiTab.close(fullPath))
              }, 400)
            })
          })
        })
        .catch(err => {
          if (err.msg) {
            this.$notification['error']({
              message: '系统通知',
              description: err.msg
            })
            this.loading = false
          }
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
