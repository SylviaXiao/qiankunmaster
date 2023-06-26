<template>
  <div class="todayPlan-wrapper">
    <perm-box perm="education:signinlog:view">
      <a-card :bordered="false" title="教师签到">
        <div href="#" slot="extra">
          <perm-box perm="education:signinlog:sign">
            <a-button class="resetBtn" @click="resetTeaForm">重置</a-button>
            <a-button :style="{ marginLeft: '10px' }" icon="plus-circle" type="primary" @click="submitTeacherSignIn">导师签到</a-button>
          </perm-box>
        </div>
        <a-form :form="form_1" :style="{ marginTop: '10px' }">
          <a-row :gutter="8">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="上课导师" v-bind="formItemLayout">
                <span>
                  <a-input disabled v-decorator="['teacher']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('teacher')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="顾问" v-bind="formItemLayout2">
                <span>
                  <a-input disabled v-decorator="['master']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('master')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="8">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="助教" v-bind="formItemLayout">
                <span>
                  <a-input v-decorator="['assistant']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('assistant')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </perm-box>
    <perm-box perm="student:signinlog:view">
      <a-card :bordered="false" :style="{ marginTop: '20px' }" title="学生签到">
        <div href="#" slot="extra">
          <perm-box perm="student:signinlog:sign">
            <a-checkbox :checked="selectAllCheckbox" @change="selectAll">全选</a-checkbox>
            <a-popover title="注意">
              <template slot="content">
                <p>点击以后,背景色为蓝色的将"签到"成功!</p>
                <p>背景色为灰色的都将变成"未签到"</p>
              </template>
              <a-icon class="exclamationIcon" type="exclamation" />
            </a-popover>
            <a-button :style="{ marginLeft: '10px' }" icon="plus-circle" type="primary" @click="submitStudentSignIn">学生签到</a-button>
          </perm-box>
        </div>
        <a-row class="student-sign-in">
          <a-col v-for="item in classStuListdata" :key="item.stuCardId" :lg="6" :md="6" :sm="12">
            <div @click="handleClickBox(item)" class="student-box-wrapper">
              <div class="student-box" :class="{ selected: isSelected(item.stuCardId) }">
                <div class="student-content">
                  <div class="student-avatar">
                    <img class="avatar-img" :src="require(`@/assets/small_logo.png`)" alt="" />
                  </div>
                  <div class="student-info">
                    <div class="student-name" :class="{ selected: isSelected(item.stuCardId) }">{{ item.stuName }}</div>
                    <div class="student-phone" :class="{ selected: isSelected(item.stuCardId) }">{{ item.stuPhone }}</div>
                    <div class="student-state" :class="{ selected: isSelected(item.stuCardId) }">
                      {{ _filterStuState(item.stuState) }}
                    </div>
                  </div>
                </div>
                <div class="student-sign" :class="{ selected: isSelected(item.stuCardId) }">
                  {{ item.signed === 'Y' ? '已签到' : '未签到' }}
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </perm-box>

    <!-- 员工选择 -->
    <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getBackData"> </i-modal>
  </div>
</template>
<script>
const delay = 500 //节流函数的间隔时间,单位毫秒
import { defaultLayout, defaultLayout2, bigLayout } from '@/utils/reception/todayPlan'
import { getStuSignInList, getTeaSignInList, SignInStuList, SignInTeaList } from '@/api/reception/todayplan'
import { IModal } from '@/components'
import PermBox from '@/components/PermBox'
export default {
  components: {
    PermBox,
    IModal
  },
  data() {
    return {
      //节流函数标记位
      taskTea: null,
      taskStu: null,

      //imodal参数
      userType: null,

      //表单布局数据
      selectAllCheckbox: false,
      formItemLayout: defaultLayout,
      formItemLayout2: defaultLayout2,
      fromBigItemLayout: bigLayout,

      //学生,导师提交数据
      studentSelectedArr: [],
      formValues: {},
      //学生签到回填数据
      classStuListdata: null,
      //导师签到回填数据
      classTeaListdata: null
    }
  },
  props: {
    classStuListProps: Array,
    classTeaListProps: Array,
    planId: String
  },
  beforeCreate() {
    this.form_1 = this.$form.createForm(this)
  },
  watch: {
    classTeaListProps(nv) {
      //将props传入的值赋值给classStuListdata
      this.classTeaListdata = this.classTeaListProps
    },
    //第一次进来回填导师数据,以及改了classTeaListdata后的数据回填
    classTeaListdata(nv) {
      this.$nextTick(() => {
        let resultParams = {}
        nv.forEach(item => {
          if (item.teaType === 'A') {
            resultParams.master = item.teaName
            this.formValues.masterId = item.teaId
          }
          if (item.teaType === 'B') {
            resultParams.teacher = item.teaName
            this.formValues.teacher = item.teaId
          }
          if (item.teaType === 'C') {
            resultParams.assistant = item.teaName || item.asTeaName
            this.formValues.assistant = item.teaId
          }
        })
        this.form_1.setFieldsValue(resultParams)
      })
    },

    classStuListProps(nv) {
      //将props传入的值赋值给classStuListdata
      this.classStuListdata = this.classStuListProps
      //检查全选按钮是否为全选状态
      this._verifyCheckBox()
    },
    //第一次进来回填学生列表,以及改了classStuListdata后的数据回填
    classStuListdata(nv) {
      this.classStuListdata.forEach(item => {
        if (item.signed === 'Y') {
          this.studentSelectedArr.push(item.stuCardId)
        }
      })
    }
  },
  methods: {
    // 页面事件处理类
    handleClickBox(item) {
      //判断studentSelectedArr有没有item.id,有则删,没有则添
      if (this.studentSelectedArr.indexOf(item.stuCardId) === -1) {
        this.studentSelectedArr.push(item.stuCardId)
      } else {
        this.studentSelectedArr = this.studentSelectedArr.filter(i => i !== item.stuCardId)
      }
      //检查全选按钮是否为全选状态
      this._verifyCheckBox()
    },
    selectAll(e) {
      // 如果是勾选状态
      if (e.target.checked) {
        //先清空,再加满
        this.selectAllCheckbox = true
        this.studentSelectedArr = []
        this.classStuListdata.forEach(item => {
          this.studentSelectedArr.push(item.stuCardId)
        })
      } else {
        this.selectAllCheckbox = false
        this.studentSelectedArr = []
      }
    },

    //提交
    submitTeacherSignIn() {
      let formResult = this.form_1.getFieldsValue()
      //如果通过验证,则请求保存教师签到接口
      //
      let params = Object.assign(this.formValues, { dancePlanId: this.planId })
      for (let key in params) {
        if (key === 'assistantId') {
          //如果有助教id
        } else {
          if (formResult.assistant) {
            params.asTeacherName = formResult.assistant
          }
        }
      }

      if (this.taskTea) {
        clearTimeout(this.taskTea)
      }
      this.taskTea = setTimeout(() => {
        SignInTeaList(params).then(res => {
          if (res.code === 200) {
            //'刷新列表'
            this.refreshTeaList()
            this.$notification['success']({
              message: '系统通知',
              description: '恭喜,签到成功'
            })
            this.$emit('signInTea')
          }
        })
      }, delay)
    },
    submitStudentSignIn() {
      let params = {
        studentCardIds: this.studentSelectedArr.join()
      }
      if (this.taskStu) {
        clearTimeout(this.taskStu)
      }
      this.taskStu = setTimeout(() => {
        console.log(123)
        SignInStuList(params, this.planId).then(res => {
          if (res.code === 200) {
            this.resetStuForm()
            this.refreshStuList()
            this.$notification['success']({
              message: '系统通知',
              description: '恭喜,签到成功'
            })
            this.$emit('signInStu')
          }
        })
      }, delay)
    },

    //重置
    resetTeaForm() {
      this.form_1.resetFields()
      this.taskTea = null
      this.taskStu = null
    },
    resetStuForm() {
      this.studentSelectedArr = []
    },

    //刷新学生列表fn
    refreshStuList() {
      let params = {
        dancePlanId: this.planId
      }
      this.resetStuForm()
      getStuSignInList(params)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.classStuListdata = res.data
          }
        })
        .catch(() => {
          console.log('出错, SignIn.vue-----refreshStuList')
        })
    },
    //刷新导师列表fn
    refreshTeaList() {
      let params = {
        dancePlanId: this.planId
      }
      getTeaSignInList(params)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.classTeaListdata = res.data
          }
        })
        .catch(() => {
          console.log('出错, SignIn.vue-----refreshTeaList')
        })
    },

    //验证
    validateTeacher() {
      return this.form_1.validateFields()
    },

    // 内部工具类
    isSelected(stuCardId) {
      return this.studentSelectedArr.indexOf(stuCardId) !== -1
    },
    _verifyCheckBox() {
      if (this.classStuListdata.length === this.studentSelectedArr.length) {
        this.selectAllCheckbox = true
      } else {
        this.selectAllCheckbox = false
      }
    },
    _filterStuState(stuState) {
      switch (stuState) {
        case 'A':
          return '正常'
          break
        case 'B':
          return '停课'
          break
        case 'C':
          return '退班'
          break
        default:
          return ''
      }
    },
    // imodal组件
    openTreeModal(type) {
      this.userType = type
      this.$refs.modal.open()
    },
    imodalOk() {},
    imodalClose() {},
    getBackData(data, type) {
      console.log(data, type)
      this.$nextTick(() => {
        this.form_1.setFieldsValue({ [type]: data.name })
        this.formValues[`${type}Id`] = data.id
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

.todayPlan-wrapper {
  .resetBtn {
    color: #108ee9;
    border: 1px solid #108ee9;
  }

  .exclamationIcon {
    border: 1px solid rgba(0, 0, 0, 0.65);
    border-radius: 50%;
  }

  .student-sign-in {
    height: 400px;
    overflow-y: scroll;

    .student-box-wrapper {
      width: 100%;
      height: 180px;
      cursor: pointer;
      position: relative;

      .student-box {
        transition: all @animationTime linear;
        box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2) inset;
        position: absolute;
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 10px;
        border: 1px solid rgb(230, 230, 230);
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;

        &.selected {
          background: #1ba97b;
          border: 1px solid rgba(0, 0, 0, 0);
          box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
        }

        .student-content {
          flex: 0 0 100px;
          width: 100%;
          height: 100px;
          display: flex;

          .student-avatar {
            flex: 0 0 60px;
            padding: 5px;
            box-sizing: border-box;
            .center();

            .avatar-img {
              padding: 2px;
              box-sizing: border-box;
              border: 1px solid rgb(230, 230, 230);
              border-radius: 50%;
              width: 100%;
            }
          }

          .student-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;

            .student-name {
              transition: all @animationTime linear;
              margin: 0 5px;
              color: #333;
              font-size: 16px;
              .ellipsis();

              &.selected {
                color: #fff;
              }
            }

            .student-phone {
              transition: all @animationTime linear;
              margin: 0 5px;
              color: #999;
              font-size: 12px;
              .ellipsis;

              &.selected {
                color: #fff;
              }
            }

            .student-state {
              transition: all @animationTime linear;
              margin: 0 5px;
              color: #999;
              font-size: 12px;
              .ellipsis;

              &.selected {
                color: #fff;
              }
            }
          }
        }
      }

      .student-sign {
        transition: all @animationTime linear;
        flex: 1;
        width: 100%;
        color: rgba(0, 0, 0, 0.65);
        background: rgb(250, 250, 250);
        border-top: 1px solid rgb(230, 230, 230);
        box-sizing: border-box;
        font-size: 22px;
        font-weight: bold;
        .center();

        &.selected {
          color: #1ba97b;
        }
      }
    }
  }
}
</style>
