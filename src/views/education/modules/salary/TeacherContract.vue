<template>
  <div class="teacher-salary-form-wrapper">
    <a-form :form="tsForm">
      <a-row>
        <a-col span="8">
          <a-form-item label="导师姓名" v-bind="formItemLayout">
            <a-input placeholder="请输入导师姓名" v-decorator="['name',{rules: [{required: true, message: '请输入导师姓名'}]}]"/>
          </a-form-item>

        </a-col>
        <a-col span="8">
          <a-form-item label="舞种名称" v-bind="formItemLayout">
            <a-select allowClear v-decorator="['danceId',{rules: [{required: true, message: '请选择舞种'}]}]"
                      placeholder="请选择舞种"  @change="searchTea">
              <a-select-option :value="dance.id" v-for="(dance,danceIndex) in danceList"
                               :key="danceIndex">
                {{dance.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item style="display: none;">
            <a-input v-decorator="['danceName']"/>
          </a-form-item>
          <a-form-item style="display: none;">
            <a-input v-decorator="['id']"/>
          </a-form-item>
          <a-form-item style="display: none;">
            <a-input v-decorator="['areaName']"/>
          </a-form-item>
          <a-form-item style="display: none;">
            <a-input v-decorator="['teacherId']"/>
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-form-item label="在职类型" v-bind="formItemLayout">
            <a-radio-group :options="userStateOptions"
                           v-decorator="['status',{rules: [{ required: true, message: '请选择在职类型' }]}]"/>
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-form-item label="手机号码" v-bind="formItemLayout">
            <a-input placeholder="请输入手机号码"
                     v-decorator="['mobile', {rules: [{ required: true, message: ' '},{validator: verifyUserTel}]}]"/>
          </a-form-item>
        </a-col>

        <a-col span="8">
          <a-form-item label="地区" v-bind="formItemLayout">
            <a-select allowClear v-decorator="['areaId',{rules: [{required: true, message: '请选择地区'}]}]"
                      placeholder="请选择地区">
              <a-select-option :value="area.id" v-for="(area,areaIndex) in areaList"
                               :key="areaIndex">
                {{area.deptName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-form-item label="员工类型" v-bind="formItemLayout">
            <a-radio-group :options="options"
                           v-decorator="['official',{rules: [{ required: true, message: '请选择员工类型' }]}]"/>
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-form-item label="身份证" v-bind="formItemLayout">
            <a-input placeholder="请输入身份证" v-decorator="['userIdcard',{rules: [{required: false, message: '请输入身份证'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-form-item label="开户行" v-bind="formItemLayout">
            <a-input v-decorator="['bank',{initialValue:'中国工商银行',rules: [{required: false, message: '请输入开户行'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-form-item label="银行卡号" v-bind="formItemLayout">
            <a-input placeholder="请输入银行卡号" v-decorator="['bankNo',{rules: [{required: false, message: '请输入银行卡号'},{len:19, message:'请输入19位银行卡号'}]}]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">薪酬配置</a-divider>
      <div class="st-wrapper">
        <div class="edu-type" v-for="(item,idx) in teacherSalaryList" :key="idx">
          <div class="edu-type-name">
            <span>{{item.typeName}}</span>
          </div>
          <a-row class="edu-type-children">
            <a-col span="4" class="edu-type-children-item" v-for="(child,childIdx) in item.salList" :key="childIdx">
              <div class="edu-type-children-item-title">
                <span>{{child.salTypeName}}</span>
              </div>
              <div class="edu-type-children-item-input">
                <a-form-item>
                  <a-input v-decorator="[ `${child.salTypeId}` ]" autocomplete='address-level1'/>
                </a-form-item>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>


    </a-form>
  </div>
</template>

<script>
  import { scopeDanceList, scopeListArea } from '@/api/common'
  import { SearchInput } from '@/components'
  import { saveSalary, salTypeList, salaryList } from '@/api/education'

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 }
    }
  }
  const userStateOptions = [
    { label: '在职', value: 'Y' },
    { label: '离职', value: 'N' }
  ]
  const options = [
    { label: '全职', value: 'A' },
    { label: '试用', value: 'B' },
    { label: '兼职', value: 'C' }
  ]
  export default {
    name: 'TeacherContract',
    props: {
      teacherValue: {
        type: Object,
        default: () => {
        }
      }
    },
    watch: {
      teacherValue(nv, ov) {
        this.getSalaryList().then(() => nv ? this.dataBacking(nv) : '')
      }
    },
    components: {
      SearchInput
    },
    data() {
      return {
        options,
        userStateOptions,
        formItemLayout,
        danceList: [],
        areaList: [],
        formValues: {},
        teacherSalaryList: [],
        isEdit: false,
        usedPhone: null
      }
    },
    beforeCreate() {
      this.tsForm = this.$form.createForm(this)
    },
    created() {
      this.getDanceList()
        .then(this.getAreaList())
        .then(this.getSalaryList())
        .then(this.dataBacking(this.teacherValue))
    },
    methods: {
      getSalaryList() {
        return salTypeList().then(res => {
          this.teacherSalaryList = res.data
        })
      },
      initTeacherSalary() {
        this.tsForm.resetFields()
        // this.$refs.searchIpt.value = ''
        this.formValues.teacherId = null
        this.formValues.id = null
      },
      getDanceList() {
        return scopeDanceList().then(res => {
          this.danceList = res.data
        })
      },
      getAreaList() {
        return scopeListArea().then(res => {
          this.areaList = res.data
        })
      },
      searchTea(value) {
        const { tsForm: { getFieldsValue }, formValues, dataBacking } = this
        // this.formValues.id = null
        this.formValues.danceId = value
        dataBacking(this.formValues)
      },
      getTeaValue(value) {
        this.formValues.id = value.id
        this.formValues.teacherId = value.id
        this.formValues.teacherName = value.name
        this.tsForm.setFieldsValue({ teacherName: value.name })
        this.dataBacking(this.formValues)
      },
      getAllIptVal() {
        const { rewriteIptVal, formValues, tsForm: { getFieldsValue, validateFields }, saveSalaryForm } = this
        validateFields()
          .then(res => {
            return rewriteIptVal(Object.assign(res, formValues))
          })
          .then(saveSalaryForm)
      },
      rewriteIptVal(data) {
        return new Promise((resolve, reject) => {
          const arr = ['teacherId', 'danceName', 'danceId', 'salTypes', 'userOfficial', 'id', 'areaId', 'areaName', 'name', 'mobile', 'official', 'status', 'userIdcard', 'bank', 'bankNo']
          const typeArr = []
          for (let key in  data) {
            if (!arr.includes(key)) {
              data[key] ? typeArr.push({ salTypeId: key, salary: data[key] }) : ''
              delete data[key]
            }
          }
          data.salTypes = JSON.stringify(typeArr)
          resolve(data)
        })
      },
      saveSalaryForm(data) {
        saveSalary(data).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.$emit('saved')
        })
      },
      dataBacking(data) {
        const hasValue = Object.keys(data).length !== 0
        const { danceId, teacherId, id, teacherMobile } = data
        const { editTeaValues } = this
        hasValue ? this.$nextTick(() => {
          if (!!danceId && !!teacherId) {
            id ? this.isEdit = false : ''
            this.tsForm.resetFields()
            this.usedPhone = teacherMobile || null
            editTeaValues({ danceId, teacherId, page: 0, limit: 0 }).then(res => {
              console.log('res', res)
              res && res.id ? this.formValues.id = res.id : this.formValues.id = null
              this.tsForm.setFieldsValue(res)
            })
          }
        }) : this.$nextTick(() => {
          this.isEdit = true
          this.tsForm.resetFields()
          this.usedPhone = null
          this.formValues = {}
        })
      },
      editTeaValues(data) {
        return salaryList(data).then(res => {
          // return res.data.data.pageList[0]
          return res.data
        })
      },
      verifyUserTel(rule, value, callback) {
        this.$verify.teaPhone(rule, value, callback, this.usedPhone)
      }
    }


  }
</script>

<style scoped lang=less>
  .teacher-salary-form-wrapper {

    .st-wrapper {
      max-height: 500px;
      overflow: auto;
      padding-top: 20px;

      .edu-type {
        display: flex;
        flex-flow: nowrap row;
        margin-bottom: 20px;

        .edu-type-name {
          width: 50px;
          min-width: 50px;
          font-size: 24px;
          height: auto;
          border: 1px solid #e8e8e8;
          background-color: #fafafa;
          writing-mode: vertical-rl;
          text-align: center;
          line-height: 50px;
        }

        .edu-type-children {
          /*border-top: 1px solid #e8e8e8;*/
          display: flex;
          flex-flow: wrap row;
          width: 100%;

          .edu-type-children-item {
            border-right: 1px solid #e8e8e8;
            border-bottom: 1px solid #e8e8e8;
            border-top: 1px solid #e8e8e8;

            &:nth-of-type(n+6) {
              border-top: 0;
            }

            > div {
              line-height: 50px;
              text-align: center;
              padding: 0 15px;
              min-width: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .edu-type-children-item-title {
              background-color: #fafafa;
              border-bottom: 1px solid #e8e8e8;
            }

            .edu-type-children-item-input {
              > div {
                margin: 12px 0;
              }
            }
          }


        }
      }


    }


  }

</style>
