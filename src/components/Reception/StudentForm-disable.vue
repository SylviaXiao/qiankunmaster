<template>
<div class="student-form">
  <a-form :form="form">
    <a-row :gutter="8">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item v-bind="formItemLayout" label="手机号码">
          <a-input v-decorator="[
              'stuPhone',
              {
                rules: [{
                  required: true, message: '请输入11位数的电话号码',len:11
                }],
              }
            ]" />
        </a-form-item>
      </a-col>

    </a-row>
    <a-row :gutter="8">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item v-bind="formItemLayout" label="学员姓名">
          <a-input v-decorator="[
                'stuName',
                {
                  rules: [{
                    required: true, message: '请输入学员姓名',
                  }]
                }
              ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item v-bind="formItemLayout" label="生日日期">
          <a-date-picker v-decorator="[
              'stuBirthday',
              {
                rules: [{
                  required: false,
                }],
              }
            ]"
            format="YYYY-MM-DD"
            @change="onTimeChange"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="8" :md="8" :sm="12">
        <a-form-item :labelCol="{sm:{span:12}}" :wrapperCol="{sm:{span:12}}" label="性别">
          <!-- <a-select v-decorator="['stuSex']">
            <a-select-option :allowClear="true" value="A">
              男
            </a-select-option>
            <a-select-option :allowClear="true" value="B">
              女
            </a-select-option>
          </a-select> -->
          <a-radio-group v-decorator="['userSex']" name="radioGroup">
            <a-radio value="A">男</a-radio>
            <a-radio value="B">女</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="16" :md="16" :sm="24">
        <a-form-item v-bind="fromBigItemLayout" label="身份证号码">
          <a-input v-decorator="[
              'stuIdcard',
              {
                rules: [{
                  required: false, message: '请输入身份证号码',
                }],
              }
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :lg="16" :md="16" :sm="24">
        <a-form-item v-bind="fromBigItemLayout" label="来源">
          <a-select mode="combobox" style="width: 100%" v-decorator="['stuSource']">
            <a-select-option :allowClear="true" v-for="i in sourceSelectDataA" :key="i.value">{{i.value}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</div>
</template>
<script>
const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    },
  },
  wrapperCol: {
    sm: {
      span: 16
    },
  },
}
const bigLayout = {
  labelCol: {
    sm: {
      span: 6
    },
  },
  wrapperCol: {
    sm: {
      span: 18
    },
  },
}
import moment from 'moment'
export default {
  props: {
    studentData:Object
  },
  data () {
    return {
      stuBirthday: '',
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: defaultLayout,
      fromBigItemLayout: bigLayout,
      sourceSelectDataA: [],
      // formItemLayout: this.$tools.formItemLayout,
    };
  },
  watch: {
    studentData(nv,ov) {
      //每次studentData发生改变
      if(nv !== ov ){
        this.dataBacking()
      }
      if(nv.sourceSelectData && nv.sourceSelectData.length>0) {
        this.sourceSelectDataA = nv.sourceSelectData
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  mounted() {
    this.dataBacking()
    this.sourceSelectData = this.studentData.sourceSelectData
  },
  methods: {
    setSelectData(data) {
      this.sourceSelectDataA = data
    },
    onTimeChange(day, stringDay) {
      this.stuBirthday = stringDay
    },
    validateData() {
      return this.form.validateFields()
    },
    dataBacking() {
      let self = this
      let formData = {
        stuName:this.studentData.stuName || '',
        stuPhone:this.studentData.stuPhone || '',
        stuSex:this.studentData.stuSex || '男',
        stuSource:this.studentData.stuSource || '',
        stuIdcard:this.studentData.stuIdcard || '',
      }
      if(this.studentData.stuBirthday) {
        formData.stuBirthday = moment(self.studentData.stuBirthday, 'YYYY-MM-DD')
      }
      this.form.setFieldsValue(formData)
    },
    handleOk() {
      let result = this.form.getFieldsValue()
      //处理生日日期信息
      result.stuBirthday = this.stuBirthday
      return result
    }
  },
};
</script>

<style scoped lang=less>
@import "../btn";
</style>
