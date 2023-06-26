<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="6" style="padding-top: 30px;">
        <upload-avator ref="uploadAva" @getFilesId="getFilesId" :userSrc="userSrc" avaType="org-avatar"></upload-avator>
      </a-col>
      <a-col :span="18">
        <a-form :form="userInfoForm">
          <a-list
            size="large"
            :dataSource="showUserInfo"
          >
            <a-list-item slot="renderItem" slot-scope="item, index">
              <span class="user-title">{{item.name}}：</span>
              <span class="user-info" v-if="isEidt&&item.edit">
                <a-form-item style="margin: 0;margin-top: 5px;">
                  <a-date-picker
                    style="width: 200px;"
                    v-decorator="[ `${item.key}`]"
                    v-if="item.key == 'userBirthday'"/>
                  <a-radio-group v-if="item.key == 'userSex'"
                                 :options="[{ label: '男', value: 'A' },{ label: '女', value: 'B' }]"
                                 v-decorator="[ `${item.key}`]"/>
                  <a-input style="width: 200px;"
                           v-decorator="[ `${item.key}`,{rules: [{validator: item.key=='userTel'?verifyUserTel:item.key=='userIdcard'?verifyUserIdCard:''}]}]"
                           v-if="item.key !== 'userBirthday'&&item.key !=='userSex'"/>
                </a-form-item>

            </span>
              <span class="user-info" v-else>{{item.key == 'userSex'?item.value=='A'?'男':'女':item.value}}</span>
            </a-list-item>
            <div slot="header" style="display: flex;justify-content: space-between;">
              <span style='font-size: 16px;font-weight: 700;'> 基本资料</span>
              <div class="btn">
                <span v-if="!isEidt"><a-button @click="isEditChange">编辑</a-button></span>
                <span v-else><a-button @click="isEditChange">保存</a-button><a-button style="margin-left: 15px;"
                                                                                    @click="cancelEditChange">取消</a-button></span>
              </div>
            </div>
            <div slot="footer">
              <span class="password">密码</span>
              <span style='margin-right: 20px;'>******</span>
              <a href="javascript:;" @click="pswModal = true">修改密码</a>
            </div>
          </a-list>
        </a-form>

      </a-col>
    </a-row>


    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
             v-model="pswModal"
             title="修改密码"
             okText="保存"
             cancelText="取消"
             @ok='savePsw()'
    >
      <a-form :form="form">
        <!-- 旧密码 -->
        <a-form-item
          label="旧密码" v-bind="formItemLayout">
          <a-input
            placeholder="请输入旧密码"
            type='password'
            v-decorator="[
                'oldPwd',
                {rules: [{ required: true, message: '请输入旧密码' }]}
              ]"
          />
        </a-form-item>
        <!-- 新密码 -->
        <a-form-item
          label="新密码" v-bind="formItemLayout">
          <a-input
            placeholder="请输入新密码"
            type='password'
            v-decorator="[
                'newPwd',
                {rules: [{ required: true, message: '请输入新密码' }]}
              ]"
          />
        </a-form-item>
        <!-- 确认密码 -->
        <a-form-item
          label="确认密码" v-bind="formItemLayout">
          <a-input
            placeholder="请再次输入密码"
            type='password'
            v-decorator="[
                'secondPsw',
                {rules: [{ required: true, message: '请再次输入密码' }]}
              ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="avaModal" width="800px" title="更换头像">
      <cropper></cropper>
    </a-modal>
  </a-card>
</template>
<script>


  import store from '@/store'
  import { getInfo } from '@/api/login'
  import { changePsw, saveCurrentUser } from '@/api/organize'
  import { Cropper, UploadAvator } from '@/components'
  import { changeAva } from '@/api/file'
  import moment from 'moment'

  const showUserInfo = [
    { name: '工号', key: 'userNo', edit: false },
    { name: '姓名', key: 'userName', edit: true },
    { name: '性别', key: 'userSex', edit: true },
    { name: '手机号码', key: 'userTel', edit: true },
    { name: '开户行', key: 'bank', edit: true },
    { name: '银行卡号', key: 'bankNo', edit: true },
    { name: '邮箱', key: 'userMail', edit: true },
    { name: '生日', key: 'userBirthday', edit: true },
    { name: '身份证号码', key: 'userIdcard', edit: true },
    { name: '入职时间', key: 'userEntryTime', edit: false },
    { name: '转正时间', key: 'userOfficialTime', edit: false },
    { name: '部门', key: 'depts', edit: false },
    { name: '职位', key: 'orgPosition', edit: false }
  ]

  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 18 },
      sm: { span: 18 }
    }
  }
  export default {
    name: 'userCenter',
    components: {
      Cropper,
      UploadAvator
    },
    data() {
      return {
        moment,
        formItemLayout,
        showUserInfo: [],
        pswModal: false,
        avaModal: false,
        fileList: [],
        uploading: false,
        client: {},
        userSrc: null,
        isEidt: false,
        usedPhone: null
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
      this.userInfoForm = this.$form.createForm(this)
    },
    created() {
      this.addValue()
    },

    methods: {
      verifyUserTel(rule, value, callback) {
        this.$verify.userPhone(rule, value, callback, this.usedPhone)
      },
      verifyUserIdCard(rule, value, callback) {
        this.$verify.idCard(rule, value, callback)

      },
      addValue() {
        getInfo().then(res => {
          const result = res.data
          this.userSrc = result.avatar || ''
          this.usedPhone = result.user.userTel || null
          let deptStr = ''
          if (result.depts) {
            result.depts.forEach(dept => {
              deptStr = deptStr + dept.deptName + ' 、'
            })
          }
          deptStr = deptStr.slice(0, deptStr.length - 1)
          // result.user.userSex == 'A' ? result.user.userSex = '男' : result.user.userSex = '女'
          Object.keys(result.user).forEach(key => {
            showUserInfo.forEach(item => {
              if (item.key == key) {
                item.value = result.user[key]
              }
              if (item.key == 'orgPosition' && result.position && result.position.positionName) {
                item.value = result.position.positionName
              }
              if (item.key == 'depts') {
                item.value = deptStr
              }

            })
          })
          this.showUserInfo = showUserInfo
        })

      },
      isEditChange() {
        this.isEidt ? this.saveCurrentUser() : this.editUserInfo()
      },
      cancelEditChange() {
        this.isEidt = false
        this.showUserInfo = [...this.showUserInfo]

      },
      editUserInfo() {
        const { userInfoForm: { getFieldsValue, setFieldsValue }, showUserInfo } = this
        const data = {}
        this.isEidt = true
        this.$nextTick(() => {
          showUserInfo.map(item => {
            if (item.edit) {
              data[item.key] = item.value
            }
          })
          if (data.userBirthday) {
            data.userBirthday = moment(data.userBirthday, 'YYYY-MM-DD')
          }

          setFieldsValue(data)
        })
      },

      saveCurrentUser() {
        const data = this.userInfoForm.getFieldsValue()
        if (data.userBirthday) {
          data.userBirthday = this.$tools.tailor.getDate(data.userBirthday)
        }
        saveCurrentUser(data).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.isEidt = false
          this.addValue()

        })

      },
      getFilesId(fileId) {
        changeAva(fileId).then(res => {
          if (res && res.code == 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '上传成功!'
            })
            this.userSrc = res.data
          }
        })
      },
      openModal() {
        this.pswModal = true
      },
      savePsw() {
        this.form.validateFields((err, values) => {
          if (!err) {
            if (values.newPwd == values.secondPsw) {
              delete values.secondPsw
              changePsw(values).then(res => {
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                this.pswModal = false
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>

  .cropper-content {
    .cropper {
      width: auto;
      height: 300px;
    }
  }

  .ant-list-item {
    padding: 0;
    line-height: 50px;
  }

  .user-title {
    width: 100px;
    display: inline-block;
  }

  .password {
    width: 100px;
    display: inline-block;
  }

  .ava-box {
    .changeAva {
      text-align: center;
      margin-top: 15px;
    }

    .ava {
      width: 200px;
      margin: 0 auto;
      margin-top: 30px;

      span {
        display: block;
        margin: 0 auto;
      }
    }
  }

</style>
