<template>
  <div class="user-sign-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>

    <a-card :bordered="false">
      <div class="rest">
        <!-- v-if="!!userDefaultId" -->
        <div>
          <perm-box perm="education:organizedeptrestday:view">
            <span style="margin-right: 15px;">{{ `本月分馆休息${day}天` }}</span>
          </perm-box>
          <perm-box perm="education:organizedeptrestday:save">
            <a-button type="primary" @click="openSchoolRest">设置分馆休息</a-button>
          </perm-box>
        </div>
      </div>

      <a-spin :spinning="loading">
        <perm-box perm="education:organizesigninlog:view" text="没有权限查看">
          <div class="user-sign" style="font-size:15px;">
            <div class="user-sign-check">
              <a-checkbox-group v-model="checkedList" @change="onChangeCheckbox">
                <div class="check-item-wrapper">
                  <div class="check-item" v-for="item in userList" :key="item.id" style="width:320px;height:130px;">
                    <div class="check-item-select"><a-checkbox :value="item.id"></a-checkbox></div>

                    <div class="proxy-check-user" @click="checkUser(item)" style="width:310px;height:120px;"></div>
                  </div>
                </div>
              </a-checkbox-group>
            </div>
            <div class="user-item" v-for="item in userList" :key="item.id" style="width:320px;height:130px;">
              <div style="height: 10px"></div>
              <div class="user-info" :class="item.signId ? 'user-selected' : ''" style="height:120px;">
                <div class="sign">
                  <div class="user-info-ava">
                    <a-avatar shape="square" :size="70" icon="user" :src="item.avatar" />
                  </div>
                  <div class="user-info-item">
                    <div class="user-info-name">{{ item.userName }}</div>
                    <div class="user-info-no-pos">{{ item.userTel }}</div>
                    <div class="user-info-no-pos">
                      <div class="info">
                        <span>{{ item.userNo }}</span>
                        <span>{{ item.positionName || '暂无' }}</span>
                      </div>
                    </div>
                    <div class="user-info-no-pos" v-if="!userDefaultId && item.deptId">
                      <span>{{ item.deptName }}</span>
                    </div>
                    <div class="user-check"></div>
                  </div>
                </div>
                <div class="action">
                  <div class="icon" @click="openSignModal(item)">
                    <a-icon type="file-protect" />
                  </div>
                  <div>
                    <a-tooltip placement="bottomRight">
                      <template slot="title">
                        <span>备注:{{ item.signDesc || '无' }}</span>
                      </template>
                      <a-tag
                        :color="item.signType == 'A' ? '#87d068' : item.signType == 'B' ? '#FFA500' : item.signType == 'C' ? '#A9A9A9' : '#f50'"
                        v-if="item.signId"
                      >
                        {{
                          item.signType == 'A'
                            ? '签到'
                            : item.signType == 'B'
                            ? '早班'
                            : item.signType == 'C'
                            ? '休息'
                            : item.signType == 'D'
                            ? '请假'
                            : item.signType == 'E'
                            ? '旷工'
                            : '-'
                        }}
                      </a-tag>
                    </a-tooltip>
                  </div>
                  <div @click.self="addRemark(item)" style="color: #1ba97b;font-size: 16px;position: absolute;bottom: 0px;right: 4px;">
                    备注
                  </div>
                </div>
              </div>
            </div>
          </div>
        </perm-box>
        <div class="muti-submit" style="padding: 20px 0;">
          <div>
            <perm-box perm="education:organizesigninlog:save">
              <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                全选
              </a-checkbox>
            </perm-box>
          </div>
          <perm-box perm="education:organizesigninlog:save">
            <a-button type="primary" style="margin-right:15px" @click="openMutiSignModal">批量签到</a-button>
            <a-button @click="mutiSubmit('N')">批量取消</a-button>
          </perm-box>
        </div>
      </a-spin>
    </a-card>
    <div class="mt20">
      <perm-box perm="education:organizesigninlog:check">
        <a-button type="primary" @click="openStaff">添加本月保底员工</a-button>
      </perm-box>
    </div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="添加备注"
      v-model="signRemarkModal"
      okText="保存"
      cancelText="取消"
      @ok="sendUserSignRemark()"
      :confirmLoading="signModalLoading"
      class="sign-modal"
    >
      <a-form :form="SignRemarkForm" style="margin-top: 20px;">
        <!-- 签到备注 -->
        <a-form-item label="签到备注" v-bind="$tools.formItemLayout">
          <a-input placeholder="请输入签到备注" v-decorator="['signDesc', { rules: [{ required: false, message: '请输入签到备注' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="员工签到"
      v-model="signModal"
      okText="保存"
      cancelText="取消"
      @ok="sendUserSign()"
      :confirmLoading="signModalLoading"
      class="sign-modal"
    >
      <a-form :form="SignForm" style="margin-top: 20px;">
        <!-- 签到类型 -->
        <a-form-item label="签到类型" v-bind="$tools.formItemLayout">
          <a-radio-group buttonStyle="solid" @change="SignTypeIsB" v-decorator="['signType', { initialValue: 'A' }]">
            <a-radio-button v-for="(signItem, idx) in signMenu" :key="idx" :value="signItem.value">
              {{ signItem.label }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 签到请假时长 -->
        <template v-if="signTypeIsE">
          <a-form-item label="请假时长" v-bind="$tools.formItemLayout">
            <a-select v-decorator="['signLeaveTime', { rules: [{ required: true, message: '请选择请假时长' }] }]">
              <a-select-option v-for="item in signTimeMenu" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <!-- 签到备注 -->
        <a-form-item label="签到备注" v-bind="$tools.formItemLayout">
          <a-input placeholder="请输入签到备注" v-decorator="['signDesc', { rules: [{ required: false, message: '请输入签到备注' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="设置分馆休息"
      v-model="schoolRestModal"
      okText="保存"
      cancelText="取消"
      @ok="setSchoolRest()"
    >
      <div>
        <span>分馆休息天数：</span>
        <a-input-number :min="0" :max="1000" v-model="day" />
        <!--        <span style="font-size: 12px; color: indianred;margin-left: 5px;">(休息天数最少为1天！)</span>-->
      </div>
    </a-modal>
    <AddStaff title="添加保底员工" ref="AddStaff" :queryParam="queryParam"></AddStaff>
  </div>
</template>

<script>
import { userSign, saveUserSign, schoolRest, saveSchoolRest, batchSignInLog, saveRemark } from '@/api/recep'
import { SearchComPro } from '@/components'
import moment from 'moment'
import PermBox from '@/components/PermBox'
import Vue from 'vue'
import { getSchoolList } from '@/api/education/card'
import AddStaff from './modules/addStaff.vue'
const userDefaultId = Vue.ls.get('userDefaultId')

const today = moment().subtract(0, 'days')
const signMenu = [{ label: '签到', value: 'A' }, { label: '早班', value: 'B' }, { label: '休息', value: 'C' }, { label: '请假', value: 'D' }, { label: '旷工', value: 'E' }]
const signTimeMenu = [{ label: '0-2小时', value: 'A' }, { label: '2-4小时', value: 'B' }, { label: '4小时以上', value: 'C' }]
export default {
  name: 'userSign',
  components: {
    SearchComPro,
    PermBox,
    AddStaff
  },
  watch: {
    signModal(nv, ov) {
      !nv ? this.initSignForm() : ''
    },
    day(nv, ov) {
      !nv ? (this.day = 0) : ''
    }
  },
  data() {
    return {
      signTypeIsE: false, //是否为请假
      signTimeMenu,
      signRemarkModal: false,
      searchParams: [
        {
          type: 'singledate',
          key: 'signDate',
          label: '选择时间',
          placeholder: '请选择时间',
          defaultVal: today,
          format: 'YYYY-MM-DD'
        },
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text',
          key: 'userName',
          label: '员工姓名',
          placeholder: '员工姓名'
        }
      ],
      signMenu,
      loading: false,
      userList: [],
      queryParam: {},
      userDefaultId,
      signModal: false,
      signModalLoading: false,
      signTypeIsB: true,
      openSignModalUserInfo: {},
      //分馆休息
      day: 0,
      schoolRestModal: false,

      // 全选
      indeterminate: false,
      checkAll: false,
      checkedList: []
    }
  },
  beforeCreate() {
    this.SignForm = this.$form.createForm(this)
    this.SignRemarkForm = this.$form.createForm(this)
  },
  created() {
    this.getUserList()
    this.getSchoolList()
  },

  methods: {
    sendUserSignRemark() {
      const {
        SignRemarkForm: { validateFields },
        openSignModalUserInfo
      } = this
      validateFields((err, values) => {
        if (err) return
        if (!this.$tools.checkPerm('education:organizesigninlog:save')) {
          this.$notification['error']({
            message: '系统通知',
            description: '没有权限！'
          })
          return false
        }
        const { signId } = openSignModalUserInfo
        saveRemark(Object.assign(values, { orgSignInLogId: signId })).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.signRemarkModal = false
          this.getUserList()
        })
      })
    },
    addRemark(record) {
      this.SignRemarkForm.resetFields()
      this.signRemarkModal = true
      this.openSignModalUserInfo = record
    },
    openStaff() {
      this.$refs.AddStaff.open()
    },
    mutiSubmit(type) {
      let params = Object.assign({}, this.queryParam, {
        state: type,
        userIds: this.checkedList.join(',')
      })
      if (this.checkedList.length === 0) return
      batchSignInLog(params).then(() => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.getUserList()
        this.resetCheckBox()
      })
    },
    resetCheckBox() {
      this.checkedList = []
      this.indeterminate = false
      this.checkAll = false
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.userList.map(item => item.id) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    onChangeCheckbox(e) {
      const { checkedList, userList } = this
      const plainOptions = userList.map(item => item.id)
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length
      this.checkedList = e
    },
    initSignForm() {
      this.signTypeIsB = true
      this.openSignModalUserInfo = {}
    },
    getUserList() {
      this.loading = true
      userSign(this.queryParam)
        .then(res => {
          if (res.code == 200) {
            this.userList = res.data
            this.resetCheckBox()
          }
        })
        .finally(() => (this.loading = false))
    },
    checkUser(recoed, values = {}) {
      if (!this.$tools.checkPerm('education:organizesigninlog:save')) {
        this.$notification['error']({
          message: '系统通知',
          description: '没有权限！'
        })
        return false
      }
      const { id } = recoed
      const {
        SignForm: { getFieldsValue }
      } = this
      let data = getFieldsValue()
      const request = this.checkedList.length === 0 && id
        ? saveUserSign(id, Object.assign(values, this.queryParam))
        : batchSignInLog(Object.assign({
          state: 'Y',
          userIds: this.checkedList.join(',')
        }, data, this.queryParam))
      request.then(res => {
        if (res.code == 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.signModal = false
          this.signRemarkModal = false
          this.getUserList()
        } else {
          this.$notification['error']({
            message: '系统通知',
            description: res.msg
          })
        }
      })
    },
    SignTypeIsB() {
      const {
        SignForm: { getFieldValue }
      } = this
      this.$nextTick(() => {
        this.signTypeIsB = !!(getFieldValue('signType') == 'B')
        this.signTypeIsE = !!(getFieldValue('signType') == 'D')
      })
    },
    openSignModal(record) {
      this.SignForm.resetFields()
      this.signModal = true
      if (record.signType) {
        this.$nextTick(() => {
          this.SignForm.setFieldsValue({ signDesc: record.signDesc || '', signType: record.signType })
          if (record.signType == 'D') {
            this.SignForm.setFieldsValue({ signLeaveTime: record.signLeaveTime || '' })
          }
          this.signTypeIsB = !!(record.signType == 'B')
          this.signTypeIsE = !!(record.signType == 'D')
        })
      }
      this.openSignModalUserInfo = record
    },
    openMutiSignModal() {
      if (this.checkedList.length === 0) return
      this.SignForm.resetFields()
      this.signModal = true
      this.openSignModalUserInfo = {}
      this.SignTypeIsB()
    },
    sendUserSign() {
      const {
        SignForm: { validateFields },
        checkUser,
        openSignModalUserInfo
      } = this
      validateFields((err, values) => {
        if (err) return
        checkUser(openSignModalUserInfo, values)
      })
    },
    openSchoolRest() {
      // this.schoolRestModal = true
      this.$router.push({ path: '/reception/branchRestDay' })
    },
    setSchoolRest() {
      const { day } = this

      let month = ''
      if (this.queryParam.signDate) {
        month = this.queryParam.signDate
      } else {
        month = moment(new Date()).format('YYYY-MM-DD')
      }
      saveSchoolRest({ day, month, school_id: userDefaultId, schoolId: this.queryParam.school_id })
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.getSchoolList()
          this.schoolRestModal = false
        })
        .catch(err => {})
    },
    getSchoolList() {
      let date = this.$tools.tailor.getMonth(this.queryParam.signDate || moment())
      schoolRest({ month: date, schoolId: this.queryParam.school_id }).then(res => {
        if (!!res.data) {
          this.day = res.data.deptRestDay
        } else {
          this.day = 0
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this.getUserList()
      this.getSchoolList()
    }
  }
}
</script>

<style scoped lang="less">
.user-sign-wrapper {
  .muti-submit {
    display: flex;
    align-items: center;
  }
  .rest {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .user-sign {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    .user-sign-check {
      position: absolute;
      width: 100%;
      .check-item-wrapper {
        display: flex;
        flex-flow: row wrap;
        margin-top: 5px;
        .check-item {
          position: relative;
          // width: 240px;
          padding: 5px;
          // height: 100px;
          .check-item-select {
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            z-index: 20;
            top: 10px;
            right: 30px;
          }
          .proxy-check-user {
            position: absolute;
            // width: 240px;
            // height: 100px;
          }
        }
      }
    }
    .user-item {
      width: 240px;
      padding: 5px;
      cursor: pointer;

      .user-info {
        border: 1px dashed #000c17;
        border-radius: 4px;
        padding-left: 5px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        padding-bottom: 5px;
        height: 80px;

        .sign {
          display: flex;
          flex-flow: nowrap row;
        }

        .action {
          position: relative;
          width: 45px;
          text-align: right;
          padding-right: 4px;
          font-size: 24px;

          .icon:hover {
            opacity: 0.7;
          }

          /*> i {*/
          /*  position: absolute;*/
          /*  right: 5px;*/
          /*  bottom: 4px;*/
          /*  font-size: 12px;*/
          /*  color: #aaaaaa;*/
          /*}*/
        }

        .user-info-ava {
          padding-top: 4px;
          margin-right: 10px;
        }

        .user-info-name {
          padding-top: 4px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: keep-all;
        }

        .user-info-no-pos {
          font-size: 12px;
          color: #aaaaaa;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;

          span:first-child {
            margin-right: 5px;
          }
        }
      }

      .user-selected {
        /*background-color: #1BA97B;*/
        background-color: #e6f7ff;
        border-color: #1ba97b;
        color: #3a86ff;

        .user-info-no-pos {
          color: #3a86ff;

          span:first-child {
            margin-right: 5px;
          }
        }

        .action {
          > i {
            color: #3a86ff;
          }
        }
      }
    }
  }
}
</style>
