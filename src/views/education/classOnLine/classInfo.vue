<template>
  <div class="studentinfo-wrapper">
    <a-card class="studentinfo-wrapper" :bordered="false" title="班级信息">
      <class-info-base-content @graduate="graduate" :classInfo="classInfo"></class-info-base-content>
    </a-card>
    <a-card v-if="classInfo" :bordered="false" style="margin-top: 15px;">
      <div class="tab-wrapper">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="学员情况" key="1" :forceRender='true'>
            <class-stu-table
              ref="stuTable"
              :classStuList="classStuList"
              :classInfo="classInfo"
              :isGraduate="isGraduate"
              :isPersonal="classInfo.isPersonal"
              @refreshTable="loadTable"
              @addStudent="addStudentBtn"></class-stu-table>
          </a-tab-pane>
          <a-tab-pane v-if="handlePermBox('education:class-online:view')" tab="课程安排" :key="2" :forceRender='true'>
            <class-info-plan
              ref="stuPlanTable"
              @signInStu="signInStu"
              :classInfo="classInfo"
              :isGraduate="isGraduate"
              :classId="classId"></class-info-plan>
          </a-tab-pane>
          <a-tab-pane tab="操作记录" :key="3" :forceRender='true'>
            <operating-record :loadData="classChangeLog" ref="operatingRecord"></operating-record>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <a-modal
      :width="800"
      :title="title"
      :visible="modalVisible"
      @ok="handleOk"
      :confirmLoading="modalConfirmLoading"
      @cancel="handleCancel">
      <class-info-modal-table :modalTableProps="modalTableProps" ref="modalRef" @hasSelected="hasSelected"></class-info-modal-table>
    </a-modal>
  </div>
</template>
<script>
  import { getClassInfo, getClassStuList, saveStuToClass, graduateEduClass, classChangeLog } from '@/api/education'
  import ClassInfoBaseContent from '../modules/classInfoBaseContent.vue'
  import ClassInfoModalTable from '../modules/classInfoModalTable.vue'
  import OperatingRecord from '../modules/classOperatingRecord'
  import ClassStuTable from '../modules/classStuTable.vue'
  import ClassInfoPlan from '../modules/classInfoPlanOnLine.vue'
  import PermBox from '@/components/PermBox'

  export default {
    data() {
      return {
        classInfo: null,
        classStuList: null,
        modalVisible: false,
        modalConfirmLoading: false,
        title: '',
        modalTableProps: null,
        classId: this.$route.params.classid,

        //是否显示今日安排标记为
        hasShow: false,
        classChangeLog: () => {
          return classChangeLog(this.classId)
        }
      }
    },
    mounted() {
      this.classId = this.$route.params.classid
      this.loadPageData()
      this.loadTable()
    },
    watch: {
      $route(nv) {
        if (nv.name === 'classInfo' || nv.name === 'personalClassInfo') {
          this.classId = this.$route.params.classid
          this.loadPageData()
          this.loadTable()
          this.classInfo = null
        }
      }
    },
    computed: {
      isGraduate() {
        return this.classInfo && this.classInfo.eduClass && this.classInfo.eduClass.state === 'C'
      }
    },
    components: {
      PermBox,
      ClassInfoBaseContent,
      ClassInfoModalTable,
      ClassStuTable,
      ClassInfoPlan,
      OperatingRecord
    },
    methods: {
      //学生签到成功以后的回调
      signInStu() {
        this.loadTable()
      },
      graduate(id) {
        let _this = this
        this.$confirm({
          title: '系统提示',
          content: '确认要结业吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            _this._graduateApi(id)
          }
        })
      },
      _graduateApi(params) {
        graduateEduClass(params).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '结业成功'
            })
            this.loadPageData()
          }
        })
      },
      //model表格是否有选择学生,决定是否调用接口
      hasSelected(boolean) {

      },
      addStudentBtn() {
        this.title = '选择学员'
        this.showModal()
        //刷新弹出内的列表
        this.$nextTick(() => {
          this.$refs.modalRef.refreshTable()
          this.$refs.modalRef.clearSelectItem()
        })
      },
      showModal() {
        this.modalVisible = true
      },
      handleOk(e) {
        //是否有选中的项
        let flag = this.$refs.modalRef.hasSelected
        //选择的项 请求接口 刷新页面
        if (flag) {
          let classId = this.classId
          let studentCardIds = this.$refs.modalRef.getSelectedItems()
          this.modalConfirmLoading = true
          saveStuToClass(classId, studentCardIds).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '您已成功添加学员'
              })
              //刷新弹出内的列表
              this.$refs.modalRef.refreshTable()
              this.$refs.modalRef.clearSelectItem()
              //刷新底部列表
              this.loadTable()
            } else {
              console.log('classInfo.vue------saveStuToClass')
            }
            this.modalConfirmLoading = false
            this.modalVisible = false
          }).catch((res) => {
            this.modalConfirmLoading = false
            console.log(res, 'classInfo.vue------saveStuToClass2')
          })
        } else {
          this.modalVisible = false
        }
      },
      handleCancel(e) {
        this.modalVisible = false
      },
      loadPageData() {
        let classid = this.classId
        getClassInfo(classid).then(res => {
          if (res.code === 200 && res.data) {
            this.classInfo = res.data
            return res.data
          }
        }).then((params) => {
          this.modalTableProps = {
            danceId: params.eduDance.id,
            classTypeId: params.eduCardType && params.eduCardType.id,
            classId: params.eduClass.id,
            typeId: params.eduType.id
          }
        }).catch((err) => {
          console.log(err, 'loadPageData')
        })
      },
      loadTable() {
        let classid = this.classId
        getClassStuList(classid).then(res => {
          if (res.code === 200 && res.data) {
            this.classStuList = res.data
          }
        }).catch((err) => {
          console.log(err, 'loadTable')
        })
        if (this.$refs.operatingRecord) {
          this.$refs.operatingRecord.getTable()
        }
      },
      handlePermBox(str) {
        return this.$tools.checkPerm(str)
      }
    }
  }
</script>

<style scoped lang=less>
  @import '~@/assets/style/index';

  .studentinfo-wrapper {
    width: 100%;

    .student-info-wrapper {
      width: 100%;

      .name-wrapper {
        width: 100%;
        padding: 10px 45px;
        box-sizing: border-box;

        .student-name {
          font-size: 22px;
          font-weight: bold;
          color: #333;
        }
      }

      .info-content-wrapper {
        width: 100%;
        display: flex;

        .content-left-wrapper {
          flex: 0 0 300px;
          width: 300px;

          .info-item-wrapper {
            display: flex;
            width: 100%;
            padding: 10px;

            .student-label {
              flex: 0 0 25%;
              width: 25%;
              color: #666;
              font-size: 14px;
              text-align: right;
            }

            .student-text {
              padding-left: 10px;
              box-sizing: border-box;
              flex: 0 0 75%;
              width: 75%;
              color: #666;
              font-size: 14px;
              text-align: left;
              .ellipsis()
            }
          }
        }

        .content-right-wrapper {
          flex: 1 0 400px;
          width: 400px;

          .info-item-wrapper {
            display: flex;
            width: 100%;
            padding: 10px;

            .student-label {
              width: 150px;
              color: #666;
              font-size: 14px;
              text-align: right;
              .ellipsis();
            }

            .student-text {
              color: #666;
              padding-left: 10px;
              box-sizing: border-box;
              font-size: 14px;
              text-align: left;
              .ellipsis();
            }
          }
        }
      }
    }
  }
</style>
