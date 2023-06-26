<template>
  <div class="todayplan-wrapper">
    <div class="table-wrapper">
      <a-table
        :pagination="false"
        :columns="columns"
        :rowKey="record => record.planId"
        :dataSource="dataSource"
        :loading="tableLoading">
        <span slot="duration" slot-scope="text, record">
              {{text}} <a-tag v-if="record.signTeachers && record.signTeachers.length>0">签</a-tag>
            </span>
        <span slot="stuLogCount" slot-scope="text, record">
              {{record.stuLogCount}}/{{record.studentCount?record.studentCount:'不限'}}
            </span>
        <span slot="teachers" slot-scope="text, record"
              style="display: flex;flex-flow: nowrap row;align-items: center;">
<!--              <span v-for="(item,idx) in record.teachers"><span v-if="idx!=0">,</span><span :style="{color:item.signDate?'#52c41a':'#000'}">{{item.teacherName}}</span></span>-->
              <span v-for="(item,idx) in record.teachers">
                <span v-if="idx!=0"> ， </span>
                <span>
                  <!-- {{item.teacherName}} -->
                  <span :class="{isSign:isSign(record,item)}"><a-icon v-if="isSign(record,item)" type="check-circle"
                                                                      style="font-size: 12px;"/> {{item.teacherName}}</span>
                </span>
              </span>
            </span>
        <span slot="className" slot-scope="text, record">
              <perm-box :text="text" perm='education:class:view'>
                <router-link :to="{path:`/reception/class/classInfo/${record.classId}`}">{{text}}</router-link>
            </perm-box>
            </span>
        <span slot="action" slot-scope="text, record">
              <perm-box perm='education:signinlog:sign'>
                <a href="javascript:;" @click="signInBtn(record,'teacher')">导师签到</a>
              </perm-box>
              <perm-box perm='student:signinlog:sign||student:signinlog:view'>
                <a href="javascript:;" @click="signInBtn(record,'student')">学生签到</a>
              </perm-box>
            </span>
      </a-table>
    </div>
    <!-- 签到modal层 -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
             :footer="null"
             :width="modalWidth"
             :title="title"
             :visible="visible"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel"
             class="sign-modal">
      <!-- <sign-in ref="signIn" :planId="planId" :classTeaListProps="classTeaList" :classStuListProps="classStuList"></sign-in> -->
      <SignInTea @signInTea="initData" v-if="signInSwitch==='teacher'" ref="SignInTea" :record="record"
                 :planId="record.planId"
                 :classTeaListProps="classTeaList"></SignInTea>
      <sign-in-stu
        v-if="signInSwitch==='student'"
        :danceplanId="planIdReport"
        :classId="classIdReport"
        :type="typeIdReport"
        ref="signInStu"
        :record="record"
        :planId="record.planId"
        :classStuListProps="classStuList"></sign-in-stu>

    </a-modal>

  </div>

</template>
<script>
  import moment from 'moment'

  let todayFormat = moment().format('YYYY-MM-DD') //今日日期
  // let todayFormat = '2019-07-01' //今日日期,真实天数没数据,暂用7月1日的数据
  import { roleColumns } from '@/utils/reception/todayPlan'
  import { SignInTea, SignInStu } from '@/components'
  import PermBox from '@/components/PermBox'
  import { getTodayPlanList, getStuSignInList, getTeaSignInList } from '@/api/reception/todayplan'
  import { getClassStuList } from '@/api/education'

  export default {
    name: 'todayPlan',
    components: {
      SignInTea,
      SignInStu,
      PermBox
    },
    mounted() {
      this.initData()
    },
    data() {
      return {
        //签到记录组件的传值
        planIdReport: '',
        classIdReport: '',
        typeIdReport: '',

        record: null,
        classStuList: [],
        classTeaList: [],
        title: '',
        dataSource: null,
        tableLoading: true,
        visible: false,
        confirmLoading: false,
        signInSwitch: '',
        modalWidth: 800,
        columns: roleColumns,
        // 查询条件参数
        queryParam: {}
        // 加载数据方法 必须为 Promise 对象
      }
    },
    watch: {
      visible(nv) {
        //关闭弹窗时清空之前表单,打开弹窗时运行refresh方法
        if (!nv) {
          this.$nextTick(() => {
            if (this.signInSwitch === 'teacher') {
              this.$refs.SignInTea.resetTeaForm()
            }
            if (this.signInSwitch === 'student') {
              this.$refs.signInStu.resetStuForm()
              this.$refs.signInStu.initModal()
            }
          })
        } else {
          if (this.signInSwitch === 'teacher') {
            this.modalWidth = 800
          }
          if (this.signInSwitch === 'student') {
            this.modalWidth = '1100px'

          }
        }
      }
    },
    methods: {
      handleCancel(e) {
        if (this.signInSwitch === 'student') {
          this.$refs.signInStu.isSignin().then(() => {
            this.visible = false
          })
        } else {
          this.visible = false
        }
      },
      signInBtn(record, type) {
        var signInTitle = ''
        //获取学生列表数据
        if (type === 'student') {
          this.classIdReport = record.classId
          this.planIdReport = record.planId
          this.typeIdReport = record.typeId
          this.loadStuList(record.planId)
          signInTitle = '学生签到 : '
        }
        //获取导师数据
        if (type === 'teacher') {
          this.loadTeacherData(record.planId)
          signInTitle = '导师签到 : '
        }
        //弹出框标题
        signInTitle += `${record.className} ${record.startDate.split(' ')[1].substr(0, 5)}-${record.endDate.split(' ')[1].substr(0, 5)}`
        this.title = signInTitle
        this.visible = true
        this.signInSwitch = type
        this.record = record

      },
      initData() {
        // 获取表单数据
        getTodayPlanList(todayFormat).then(res => {
          if (res.code === 200 && res.data) {
            res.data.forEach(item => {
              if (item.startDate && item.endDate) {
                item.duration = `${this.$tools.tailor.getTime(item.startDate)}-${this.$tools.tailor.getTime(item.endDate)}`
              }
            })
            this.dataSource = res.data
          }
        }).catch((err) => {
        }).finally(() => {
          this.tableLoading = false
        })
      },
      loadStuList(planId) {
        let params = { dancePlanId: planId }
        getStuSignInList(params).then(res => {
          if (res.code === 200 && res.data) {
            this.classStuList = res.data
          }
        }).catch(() => {
        })
      },
      loadTeacherData(planId) {
        let params = { dancePlanId: planId }
        getTeaSignInList(params).then(res => {
          if (res.code === 200 && res.data) {
            this.classTeaList = [res.data]
          }
        }).catch(() => {
        })
      },
      isSign(record, item) {
        if (record.signTeachers && record.signTeachers.length > 0) {
          return record.signTeachers.some(signTea => signTea.signTeacherId === item.teacherId)
        } else {
          return false
        }
      }
    }
  }
</script>

<style scoped lang=less>
  @import '~@/assets/style/btn';

  .todayplan-wrapper {
    .isSign {
      border: 1px solid #52c41a;
      border-radius: 4px;
      padding: 2px;
      color: #52c41a;
    }

    .search-wrapper {
    }

    .table-wrapper {
      /*margin-top: 20px;*/
    }
  }
</style>
