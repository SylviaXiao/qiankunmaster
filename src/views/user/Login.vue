<template>
  <div class="main">
    <a-card :bordered="false">
      <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
        <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }" @change="handleTabClick">
          <a-tab-pane key="tab1" tab="系统登录">
            <a-form-item>
              <a-input
                size="large"
                type="text"
                placeholder="账号"
                v-decorator="[
                  'loginName',
                  { rules: [{ required: true, message: '请输账号' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change' }
                ]"
              >
                <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                type="password"
                autocomplete="false"
                placeholder="密码"
                v-decorator="['loginPwd', { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' }]"
              >
                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div class="mb30">
          <a-checkbox defaultChecked>阅读并同意<a target="_blank" href="/privacy.html">《用户协议及隐私政策》</a></a-checkbox>
        </div>
        <a-form-item>
          <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn">登录 </a-button>
          <router-link :to="{ path: 'forgetPsw' }" class="forge-password" style="float: right;">忘记密码 </router-link>
        </a-form-item>
      </a-form>
    </a-card>

    <two-step-captcha v-if="requiredTwoStepCaptcha" :visible="stepCaptchaVisible" @success="stepCaptchaSuccess" @cancel="stepCaptchaCancel"></two-step-captcha>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      v-model="pswModal"
      :closable="false"
      title="修改密码"
      okText="保存"
      cancelText="取消"
      @ok="savePsw()"
    >
      <a-alert message="警告!" :description="`${tag},请修改密码!`" type="warning" showIcon />
      <a-divider />
      <a-form :form="pwdForm">
        <!-- 旧密码 -->
        <a-form-item label="旧密码" v-bind="formItemLayout">
          <a-input placeholder="请输入旧密码" type="password" v-decorator="['oldPwd', { rules: [{ required: true, message: '请输入旧密码' }] }]" />
        </a-form-item>
        <!-- 新密码 -->
        <a-form-item label="新密码" v-bind="formItemLayout">
          <a-input placeholder="请输入新密码" type="password" v-decorator="['newPwd', { rules: [{ required: true, message: '请输入新密码' }] }]" />
        </a-form-item>
        <!-- 确认密码 -->
        <a-form-item label="确认密码" v-bind="formItemLayout">
          <a-input placeholder="请再次输入密码" type="password" v-decorator="['secondPsw', { rules: [{ required: true, message: '请再次输入密码' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha, get2step } from '@/api/login'
import QS from 'qs'
import { axios } from '@/utils/request'

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
  components: {
    TwoStepCaptcha
  },
  data() {
    return {
      formItemLayout,
      customActiveKey: 'tab1',
      loginBtn: false,
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      pwdForm: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      },
      pswModal: false,
      tag: '您的密码安全级别过低',
      loginParams: {}
    }
  },
  created() {},
  methods: {
    ...mapActions(['Login', 'Logout']),
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this
      state.loginBtn = true
      const validateFieldsKey = customActiveKey === 'tab1' ? ['loginName', 'loginPwd'] : ['mobile', 'captcha']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          Login(QS.stringify(values))
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)
          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile })
            .then(res => {
              setTimeout(hide, 2500)
              this.$notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8
              })
            })
            .catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess(res) {
      this.$router.push({ name: '/' })
    },
    requestFailed(params) {
      const { pwdLevel, token } = params
      if (pwdLevel == 0) {
        this.tag = '您使用的是初始密码'
      }
      if (token) {
        this.loginParams = params
        this.changePsw()
      }
    },
    changePsw() {
      this.pswModal = true
    },
    savePsw(params) {
      const {
        loginParams: { pwdLevel, token },
        changeUserPwd
      } = this
      this.pwdForm.validateFields((err, values) => {
        if (!err) {
          if (values.newPwd == values.secondPsw) {
            delete values.secondPsw
            changeUserPwd(values, token).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.pswModal = false
            })
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: '两次密码输入的不一样！'
            })
          }
        }
      })
    },
    changeUserPwd(params, token) {
      return axios({
        url: '/organize/account/changePwd',
        method: 'post',
        data: QS.stringify(params),
        headers: {
          auth_token: token
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }
  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }
  .forge-password {
    font-size: 14px;
    float: right;
  }
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 60%;
  }
  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;
    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
    .register {
      float: right;
    }
  }
}
.footer {
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    margin-top: 15px;
  }
}
</style>
