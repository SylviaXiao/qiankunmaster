<!-- 不再维护此页面 -->
<template>
  <!-- <div class="todayPlan-wrapper">
    <a-card :bordered="false" title="教师签到">
      <div href="#" slot="extra">
        <a-button class="resetBtn" @click="resetTeacherSignIn">重置</a-button>
                  @click.native="submitTeacherSignIn">导师签到
        </perm-box>
      </div>
      <a-form :form="form_1" :style="{marginTop:'10px'}">
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="上课导师" v-bind="formItemLayout">
               <span>
                  <a-input disabled v-decorator="['teacher']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('teacher')"/>
                  </a-input>
               </span>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="顾问" v-bind="formItemLayout2">
              <span>
                  <a-input disabled v-decorator="['master']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('master')"/>
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
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('assistant')"/>
                  </a-input>
               </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false" :style="{marginTop:'20px'}" title="学生签到">
      <div href="#" slot="extra">
        <a-checkbox :checked="selectAllCheckbox" @change="selectAll">全选</a-checkbox>

        <a-popover title="注意">
          <template slot="content">
            <p>点击以后,背景色为蓝色的将"签到"成功!</p>
            <p>背景色为灰色的都将变成"未签到"</p>
          </template>
          <a-icon class="exclamationIcon" type="exclamation" />
        </a-popover>
                  @click.native="submitStudentSignIn">学生签到
        </perm-box>
      </div>
      <a-row class="student-sign-in">
        <a-col v-for="item in classStuListdata" :key="item.id" :lg="6" :md="6" :sm="12">
          <div @click="handleClickBox(item)" class="student-box-wrapper">
            <div class="student-box" :class="{selected:isSelected(item.id)}">
              <div class="student-content">
                <div class="student-avatar">
                  <img class="avatar-img" :src="require(`@/assets/small_logo.png`)" alt="">
                </div>
                <div class="student-info">
                  <div class="student-name" :class="{selected:isSelected(item.id)}">{{item.stuName}}</div>
                  <div class="student-phone" :class="{selected:isSelected(item.id)}">{{item.stuPhone}}</div>
                  <div class="student-state" :class="{selected:isSelected(item.id)}">{{_filterStuState(item.stuState)}}</div>
                </div>
              </div>
              <div class="student-sign" :class="{selected:isSelected(item.id)}">未签到</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <i-modal
    ref="modal"
    :multiple='false'
    :userType="userType"
    @ok="imodalOk"
    @close="imodalClose"
    @getBackData="getBackData">
    </i-modal>
  </div> -->
</template>
<script>
// import { defaultLayout, defaultLayout2, bigLayout } from '@/utils/reception/todayPlan'
// import { PermBtn } from '@/components'
// import { IModal } from '@/components'
// export default{
//   components: {
//
//     IModal
//   },
//   data() {
//     return {
//       formValues: {},
//       userType: null,
//       selectAllCheckbox: false,
//       formItemLayout: defaultLayout,
//       formItemLayout2: defaultLayout2,
//       fromBigItemLayout: bigLayout,
//       asTeacherData: [],
//       studentSelectedArr: ['2873b60a-88fc-4d2d-8ba2-65f273007902'],
//       classStuListdata: null
//     }
//   },
//   props: {
//     classStuListProps: Array
//   },
//   beforeCreate () {
//     this.form_1 = this.$form.createForm(this);
//   },
//   watch: {
//     classStuListProps(nv) {
//       //将props传入的值赋值给classStuListdata
//       this.classStuListdata = this.classStuListProps
//       //检查全选按钮是否为全选状态
//       this._verifyCheckBox()
//     }
//   },
//   methods: {
//     openTreeModal(type) {
//       this.userType = type
//       this.$refs.modal.open()
//     },
//     imodalOk() {
//     },
//     imodalClose() {
//     },
//     getBackData(data, type) {
//       this.$nextTick(() => {
//         this.form_1.setFieldsValue({ [type]: data.name })
//         this.formValues[`${type}Id`] = data.id
//       })
//     },
//     handleClickBox(item) {
//       //判断studentSelectedArr有没有item.id,有则删,没有则添
//       //没有
//       if(this.studentSelectedArr.indexOf(item.id) === -1) {
//         this.studentSelectedArr.push(item.id)
//       } else {
//         this.studentSelectedArr = this.studentSelectedArr.filter(i => i!==item.id)
//       }
//       //检查全选按钮是否为全选状态
//       this._verifyCheckBox()
//     },
//     isSelected(id) {
//       return this.studentSelectedArr.indexOf(id) !== -1
//     },
//     selectAll(e) {
//       // 如果是勾选状态
//       if (e.target.checked) {
//         //先清空,再加满
//         this.selectAllCheckbox = true
//         this.studentSelectedArr = []
//         this.classStuListdata.forEach(item => {
//           this.studentSelectedArr.push(item.id)
//         })
//       } else {
//         this.selectAllCheckbox = false
//         this.studentSelectedArr = []
//       }
//     },
//     resetForm_1() {
//       this.form_1.resetFields()
//     },
//     refreshForm_1() {
//       //回填form_1的数据
//     },
//     validateTeacher() {
//       return this.form_1.validateFields()
//     },
//     resetTeacherSignIn() {
//       this.form_1.resetFields()
//     },
//     submitTeacherSignIn() {
//       let result = this.form_1.getFieldsValue()
//       //如果通过验证,则请求保存教师签到接口
//       this.validateTeacher().then(()=>{
//       })
//     },
//     submitStudentSignIn() {
//     },
//     _verifyCheckBox() {
//       if(this.classStuListdata.length === this.studentSelectedArr.length) {
//         this.selectAllCheckbox = true
//       } else {
//         this.selectAllCheckbox = false
//       }
//     },
//     _filterStuState(stuState) {
//       switch (stuState) {
//         case "A":
//           return '正常'
//           break;
//         case "B":
//           return '停课'
//           break;
//         case "C":
//           return '退班'
//           break;
//         default:
//           return ''
//       }
//     }
//   }
// }
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
