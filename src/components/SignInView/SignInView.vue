<template>
  <div class="todayPlan-wrapper">
    <!-- <a-table
      :bordered="true"
      :pagination="false"
      :columns="isOnline ? columnsOnlineTea : columnsTea"
      :rowKey="record => record.id"
      :dataSource="teaData"
    > -->
    <!-- <template slot="teacherName">
        <span class="disabled-select" style="position: relative;">
          <a-select
            mode="multiple"
            style="width: 200px;margin-right: 37px;z-index: 144;border-radius: 4px 0 0 4px;"
            :open="false"
            @deselect="deselect"
            :value="teaIdsArr"
            placeholder="请选择上课导师"
          >
            <a-icon slot="suffixIcon" type="search" />
            <a-select-option v-for="(item, idx) in teaSelectArr" :value="item.id" :key="idx">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-input
            style="width: 237px; cursor: pointer; position: absolute;left: -2px;top: -6.5px;border: none;"
            class="no-border-input"
          >
            <a-icon slot="addonAfter" type="search" @click="openChooseTea('teacher')" />
          </a-input>
        </span>
        <perm-box perm="education:signinlog:sign">
          <a href="#" @click="reSignTeas">补签</a>
        </perm-box>
      </template> -->
    <!-- <template slot="adviserName" slot-scope="text, record">
        {{ !!record.teas && record.teas.orgUserAdviser ? record.teas.orgUserAdviser.userName : '' }}
        <perm-box perm="education:signinlog:sign">
          <a href="#" @click="reSignTea(record)">补签</a>
        </perm-box>
      </template>
      <template slot="asTeacherName" slot-scope="text, record">
        {{
          !!record.teas
            ? record.teas.salTemplateAsTeacher
              ? record.teas.salTemplateAsTeacher.name
              : record.teas.asTeacherName
            : ''
        }}
        <perm-box perm="education:signinlog:sign">
          <a href="#" @click="reSignTea(record, 'assistant')">补签</a>
        </perm-box>
      </template> -->
    <!-- </a-table> -->
    <template v-if="!isOnline">
      <a-divider orientation="right"><span :style="{ color: '#e8e8e8', marginTop: '20px' }">学生签到</span></a-divider>
      <a-button v-if="!isConventionClass" @click="reSignAllStu" type="primary" :style="{ color: '#e8e8e8', marginBottom: '20px', marginRight: '15px' }">
        批量补签
      </a-button>

      <a-button :style="{ color: '#e8e8e8', marginBottom: '20px' }" @click="openReplenishesPlanModal" type="primary">
        补课
      </a-button>

      <a-table :pagination="false" :columns="columnsStu" :rowKey="record => record.stuCardId" :rowSelection="rowSelection" :dataSource="stuData">
        <template slot="avatar" slot-scope="text, record">
          <a-avatar shape="square" :style="{ verticalAlign: 'middle' }" size="small" icon="user" :src="text" v-if="text" />
          <a-tag :style="{ marginLeft: '10px' }" v-if="record.signed == 'Y'">已签</a-tag>
        </template>
        <template slot="action" slot-scope="text, record">
          <perm-box perm="student:signinlog:signup">
            <a href="#" v-if="record.signed !== 'Y' && record.payoff" @click="reSignStu(record)">补签</a>
          </perm-box>
        </template>
      </a-table>
    </template>

    <i-modal ref="modal" :multiple="false" :userType="userType" @getBackData="getBackData"> </i-modal>
    <choose-tea :multiple="true" ref="choosetea" :teaFields="teaFields" @getBackData="getTeaData"></choose-tea>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :footer="null"
      :width="1100"
      title="学员补课"
      @cancel="closeReplenishesPlanModal"
      :visible="replenishesPlanModal"
    >
      <perm-box perm="education:class:replenishes:view" text="无权访问">
        <replenishes-plan ref="replenishesPlan" :dancePlanId="planId" :record="record" @refresh="refresh"></replenishes-plan>
      </perm-box>
    </a-modal>
  </div>
</template>
<script>
import { columnsStu, columnsTea, columnsOnlineTea } from './signInViewUtil.js'
import { SignReInTeaList, SignReInStuList } from '@/api/reception/todayplan'
import IModal from '@/components/InnerModal'
import PermBox from '@/components/PermBox'
import ChooseTea from '@/components/ChooseTea'
import ReplenishesPlan from '@/components/SignInStu/modules/ReplenishesPlan'

export default {
  name: 'SignInView',
  components: {
    ChooseTea,
    PermBox,
    IModal,
    ReplenishesPlan
  },
  mounted() {
    console.log('classStuListProps =>', this.classTeaListProps)
  },
  data() {
    return {
      selectedRowKeys: [],
      columnsTea,
      columnsOnlineTea,
      columnsStu,
      teaData: [{ id: 1 }],
      stuData: null,
      teaFields: null,
      userType: 'all',
      teaSelectArr: [],
      teaIdsArr: [],
      replenishesPlanModal: false
    }
  },
  props: {
    isOnline: {
      type: Boolean,
      default: false
    },
    classStuListProps: Array,
    classTeaListProps: Array,
    planId: String,
    isConventionClass: { type: Boolean, default: false },
    record: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    rowSelection() {
      let flag = this.$tools.checkPerm('student:signinlog:sign')
      if (flag) {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKeys = selectedRowKeys
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.signed == 'Y' || !record.payoff
            }
          })
        }
      } else {
        return null
      }
    }
  },
  watch: {
    // 获取异步props值
    classTeaListProps(nv) {
      this.teaSelectArr = []
      this.teaIdsArr = []
      this.teaData = [Object.assign({}, this.teaData[0], nv[0])]
      console.log(this.teaData[0].teachers)
      this.teaSelectArr = this.teaData[0].teachers
      this.teaData[0].teachers.map(item => {
        this.teaIdsArr.push(item.id)
      })
    },
    classStuListProps(nv) {
      this.stuData = nv
      console.log('this.stuData', this.stuData)
    }
  },
  methods: {
    /*
     * @methods openReplenishesPlanModal 学员补课
     *
     * */

    openReplenishesPlanModal() {
      this.replenishesPlanModal = true
    },
    closeReplenishesPlanModal() {
      this.replenishesPlanModal = false
    },

    setTeaIds(record) {
      let arr = []
      record.teachers.map(item => {
        arr.push(item.id)
        this.teaIds.push(item.id)
      })
      return arr
    },
    openChooseTea(type) {
      this.teaFields = 'teacher'
      this.$refs.choosetea.open()
    },
    deselect(value, option) {
      this.teaIdsArr.remove(value)
    },
    reSignTeas() {
      let params = {
        dancePlanId: this.planId,
        teacherIds: this.teaIdsArr.join(',')
      }
      SignReInTeaList(params)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '恭喜,签到成功'
            })
            this.$emit('refreshTeaList', this.planId)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //dom操作
    reSignTea(record, type) {
      //this.userType = record.teaType === 'A'?'master':record.teaType === 'B'?'teacher':record.teaType === 'C'?'assistant':''
      this.userType = 'master'
      this.teaFields = type
      if (type) {
        this.$refs.choosetea.open()
      } else {
        this.$refs.modal.open()
      }
    },
    reSignStu(record) {
      let _this = this
      this.$confirm({
        title: '提示',
        content: `确实要为${record.stuName}补签吗?`,
        onOk() {
          let params = {
            studentCardIds: record.stuCardId
          }
          _this.signInStu(params, _this.planId)
        }
      })
    },
    reSignAllStu() {
      if (!this.selectedRowKeys.length) {
        return
      }
      let _this = this
      this.$confirm({
        title: '提示',
        content: `确实要批量补签吗?`,
        onOk() {
          let params = {
            studentCardIds: _this.selectedRowKeys.join(',')
          }
          _this.signInStu(params, _this.planId)
        }
      })
    },
    getTeaData(data, type) {
      if (type == 'teacher') {
        data.map(item => {
          if (this.teaIdsArr.indexOf(item.id) < 0) {
            this.teaSelectArr.push({ name: item.teacherName, id: item.id })
            this.teaIdsArr.push(item.id)
          }
        })
        return
      }
      this.getBackData(data, type)
      // this.$nextTick(() => {
      //   this.addClassForm.setFieldsValue({ [type]: data.name })
      //   this.formValues[`${type}Id`] = data.id
      // })
    },
    //选人组件
    getBackData(data, type) {
      console.log(data, type)
      let params = {
        dancePlanId: this.planId
      }
      if (type === 'master') {
        params.masterId = data.id
      }
      // if (type === 'teacher') {
      //   console.log("data =>",data)
      //   if (this.teaIdsArr.indexOf(data.id) < 0) {
      //       this.teaSelectArr.push({ name: data.teacherName, id: data.teacherId })
      //       this.teaIdsArr.push(data.teacherId)
      //     }
      //   return
      //   params.teacherId = this.teaIdsArr.join(',')
      // }
      if (type === 'assistant') {
        if (data.id) {
          params.assistantId = data.id
        }
        if (data.name) {
          params.asTeacherName = data.name
        }
      }
      SignReInTeaList(params)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '恭喜,签到成功'
            })
            this.$emit('refreshTeaList', this.planId)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    signInStu(params, planId) {
      SignReInStuList(params, planId).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '补签成功!'
          })
          this.selectedRowKeys = []
        }
        this.$emit('refreshStuList', this.planId)
      })
    },
    refresh() {
      console.log('shuax')

      this.$emit('refreshStuList', this.planId)
    },
    // 组件内的函数 或 数据处理函数
    _formatTeaData(defaultTeaArr, teaData) {}
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
