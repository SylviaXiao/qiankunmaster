<template>
  <a-modal :maskClosable="$store.state.modalMaskClickEnable"
    title="Modal"
    v-model="visible"
    width="800px"
    okText="保存"
    cancelText="取消"
  >
    123
    <!--    <a-form-->
    <!--      @submit="handleSubmit">-->
    <!--      &lt;!&ndash; 姓名  昵称 &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="姓名 *" v-bind="formItemLayout">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'name',-->
    <!--          {rules: [{ required: true, message: '请输入姓名' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item-->
    <!--            label="昵称"-->
    <!--            v-bind="formItemLayout">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'note',-->
    <!--          {rules: [{ required: true, message: 'Please input your note!' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--      &lt;!&ndash; 性别  手机号码 &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="性别*" v-bind="formItemLayout">-->
    <!--            <a-select :allowClear="true" placeholder="请选择性别"-->
    <!--                      v-decorator="[ 'courseType', {rules: [{ required: true, message: '请选择性别'}]} ]">-->
    <!--              <a-select-option :allowClear="true" value="M">男</a-select-option>-->
    <!--              <a-select-option :allowClear="true" value="F">女</a-select-option>-->
    <!--            </a-select>-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item-->
    <!--            label="手机号码*"-->
    <!--            :label-col="{ span: 7 }"-->
    <!--            :wrapper-col="{ span: 14 }">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'note',-->
    <!--          {rules: [{ required: true, message: 'Please input your note!' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--      &lt;!&ndash; 邮箱  qq &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="邮箱" v-bind="formItemLayout">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'note',-->
    <!--          {rules: [{ required: true, message: 'Please input your note!' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item-->
    <!--            label="QQ号码"-->
    <!--            :label-col="{ span: 7 }"-->
    <!--            :wrapper-col="{ span: 14 }">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'note',-->
    <!--          {rules: [{ required: true, message: 'Please input your note!' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--      &lt;!&ndash; 正式员工  身份证号码 &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="正式员工" v-bind="formItemLayout">-->
    <!--            <a-radio-group :options="options"/>-->
    <!--            <br/>-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item-->
    <!--            label="身份证号码"-->
    <!--            v-bind="formItemLayout">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'note',-->
    <!--          {rules: [{ required: true, message: 'Please input your note!' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--      &lt;!&ndash; 入职时间  转正时间 &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="入职时间" v-bind="formItemLayout">-->
    <!--            <a-date-picker v-decorator="['date-picker', config]"/>-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item-->
    <!--            label="转正时间"-->
    <!--            :label-col="{ span: 7 }"-->
    <!--            :wrapper-col="{ span: 14 }">-->
    <!--            <a-date-picker v-decorator="['date-picker', config]"/>-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--      &lt;!&ndash; 组织架构  在职类型 &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="组织架构(部门)" v-bind="formItemLayout">-->
    <!--            <a-input disabled placeholder="请选择部门">-->
    <!--              <a-icon slot="addonAfter" type="search"/>-->
    <!--            </a-input>-->

    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="在职类型"-->
    <!--                       :label-col="{ span: 7 }"-->
    <!--                       :wrapper-col="{ span: 14 }">-->
    <!--            <a-select :allowClear="true" placeholder="请选择在职类型"-->
    <!--                      v-decorator="[ 'courseChargeMode', {rules: [{ required: true, message: '请选择在职类型'}]} ]">-->
    <!--              <a-select-option :allowClear="true" value="Y">全职</a-select-option>-->
    <!--              <a-select-option :allowClear="true" value="M">兼职</a-select-option>-->
    <!--            </a-select>-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--      &lt;!&ndash; 职位 &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="职位 *" v-bind="formItemLayout">-->
    <!--            <a-select :allowClear="true" placeholder="请选择职位类型"-->
    <!--                      v-decorator="[ 'courseChargeMode', {rules: [{ required: true, message: '请选择职位类型'}]} ]">-->
    <!--              <a-select-option :allowClear="true" value="Y">全职</a-select-option>-->
    <!--              <a-select-option :allowClear="true" value="M">兼职</a-select-option>-->
    <!--            </a-select>-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--      <a-divider/>-->

    <!--      &lt;!&ndash; 姓名  昵称 &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="登录名*" v-bind="formItemLayout">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'note',-->
    <!--          {rules: [{ required: true, message: 'Please input your note!' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--      &lt;!&ndash; 姓名  昵称 &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="登陆密码 *" v-bind="formItemLayout">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'note',-->
    <!--          {rules: [{ required: true, message: 'Please input your note!' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="重复密码 *"-->
    <!--                       :label-col="{ span: 7 }"-->
    <!--                       :wrapper-col="{ span: 14 }">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'note',-->
    <!--          {rules: [{ required: true, message: 'Please input your note!' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--      &lt;!&ndash; 姓名  昵称 &ndash;&gt;-->
    <!--      <a-row modules="form-row" :gutter="16">-->
    <!--        <a-col :lg="12" :md="12" :sm="24">-->
    <!--          <a-form-item label="角色权限" v-bind="formItemLayout">-->
    <!--            <a-input-->
    <!--              v-decorator="[-->
    <!--          'note',-->
    <!--          {rules: [{ required: true, message: 'Please input your note!' }]}-->
    <!--        ]"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->


    <!--    </a-form>-->
  </a-modal>
</template>

<script>
  export default {
    name: 'addUserModal',
    props: ['userModal'],
    data() {
      return {
        visible: this.userModal || false
      }
    },
    created() {
    }

  }
</script>

<style scoped>

</style>
