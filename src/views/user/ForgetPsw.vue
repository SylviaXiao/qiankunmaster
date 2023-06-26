<template>
  <div class="main forgetPsw-wrapper">
    <a-card :bordered="false">
      <a-form ref="formForget" :form="form" id="formForget">
        <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }">
          <a-tab-pane key="tab1" tab="忘记密码">
            <a-form-item>
              <a-input size="large" placeholder="输入手机号码" v-decorator="['phone', { rules: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ }], validateTrigger: ['change', 'blur'] }]">
                <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
            </a-form-item>
            <a-row :gutter="16">
              <a-col class="gutter-row" :span="16">
                <a-form-item>
                  <a-input size="large" type="text" placeholder="验证码" v-decorator="['captcha', { rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur' }]">
                    <a-icon slot="prefix" type="form" :style="{ color: 'rgba(0,0,0,.25)' }" />
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8" @click="getKaptcha()">
                <img :src="identifyCodeImg" alt="" style="height: 40px;width: 100%;border-radius: 4px;" />
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col class="gutter-row" :span="16">
                <a-form-item>
                  <a-input size="large" type="text" placeholder="获取手机验证码" :disabled="!state.smsSendBtn" @change="checkCaptcha" v-decorator="['smsCode', { rules: [{ required: true, message: '请输入手机验证码' }], validateTrigger: 'blur' }]">
                    <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8">
                <a-button class="getCaptcha" size="large" :disabled="state.smsSendBtn" @click.stop.prevent="getCaptcha" v-text="(!state.smsSendBtn && '获取验证码') || state.time + ' s'"></a-button>
              </a-col>
            </a-row>
            <div v-if="isTrueCode">
              <a-form-item>
                <a-input size="large" placeholder="密码" type="password" v-decorator="['newPwd', { rules: [{ required: true, message: '请输入密码' }], validateTrigger: ['change', 'blur'] }]">
                  <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input size="large" placeholder="确认密码" type="password" v-decorator="['newPwd2', { rules: [{ required: true, message: '请再次输入密码' }], validateTrigger: ['change', 'blur'] }]">
                  <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </div>
            <a-form-item>
              <a-button size="large" type="primary" htmlType="submit" class="register-button" :loading="registerBtn" @click.stop.prevent="handleSubmit" :disabled="registerBtn">提交 </a-button>
              <router-link class="login" :to="{ name: 'login' }">使用已有账户登录</router-link>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { getKaptcha, getNoteCode, retrievePwd } from '@/api/common'

export default {
  name: 'ForgetPsw',
  data() {
    return {
      form: this.$form.createForm(this),
      customActiveKey: 'tab1',
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      registerBtn: false,
      isTrueCode: false,
      identifyCodeImg: null,
      identifyCodeSecret: null
    }
  },
  mounted() {
    this.getKaptcha()
  },
  methods: {
    getKaptcha() {
      this.identifyCodeImg = null
      this.identifyCodeSecret = null
      getKaptcha().then(res => {
        this.identifyCodeImg = res.data.image
        this.identifyCodeSecret = res.data.secret
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        identifyCodeSecret,
        $message,
        $notification
      } = this
      validateFields(['phone', 'captcha'], { force: true }, (err, values) => {
        if (!err && identifyCodeSecret) {
          values.secret = identifyCodeSecret
          state.smsSendBtn = true
          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          getNoteCode(values).then(res => {
            if (res.code == 200) {
              $message.success('验证码发送成功')
            } else {
              $notification['error']({
                message: '系统通知',
                description: '验证码错误',
                duration: 4
              })
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          })
        } else {
          if (!identifyCodeSecret) {
            $notification['error']({
              message: '系统通知',
              description: '验证码错误',
              duration: 4
            })
          }
        }
      })
    },
    checkCaptcha(e) {
      const {
        form: { validateFields },
        $notification
      } = this

      const values = e.target.value

      if (values.length === 6) {
        this.isTrueCode = true
      } else if (values.length > 6) {
        $notification['error']({
          message: '系统通知',
          description: '验证码必须为6位',
          duration: 4
        })
      }
    },
    handleSubmit() {
      const {
        form: { validateFields },
        identifyCodeSecret,
        _this,
        $router
      } = this
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          if (identifyCodeSecret) {
            values.secret = identifyCodeSecret
          } else {
            return false
          }
          if (values.newPwd === values.newPwd2) {
            retrievePwd(values).then(res => {
              this.$success({
                title: '系统提示',
                content: '密码修改成功，请前往登录页面',
                okText: '确认',
                onOk() {
                  $router.push({ name: 'login' })
                }
              })
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.getCaptcha {
  display: block;
  width: 100%;
  height: 40px;
  padding: 0;
}

.register-button {
  width: 50%;
}

.login {
  float: right;
  line-height: 40px;
}

.footer {
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    margin-top: 15px;
  }
}
</style>
