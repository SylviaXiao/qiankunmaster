<template>
  <div class="teacher-salary-form-wrapper">
    <a-form :form="tsForm">
      <a-form-item style="display: none;">
        <a-input v-decorator="['teacherId']" />
      </a-form-item>
      <div class="info_wrapper" style="margin-bottom: 30px">
        <div class="info_item" :span="6">
          <span style="">老师姓名: {{ teacherInfo.name }}</span>
        </div>
        <div class="info_item" :span="6">
          <span style="">联系方式: {{ teacherInfo.mobile }}</span>
        </div>
        <div class="info_item" :span="6">
          <span style="">舞种: {{ teacherInfo.danceName }}</span>
        </div>
        <div class="info_item" :span="6">
          <span style="">地区: {{ teacherInfo.areaName }}</span>
        </div>
      </div>
      <a-divider orientation="left" style="color: #aaa; font-size: 12px">薪酬配置</a-divider>
      <!-- <a-row>
        <a-col span="8">
          <a-form-item label="导师姓名" v-bind="formItemLayout">
            <a-input disabled placeholder="请输入导师姓名" v-decorator="['name',{rules: [{required: true, message: '请输入导师姓名'}]}]"/>
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
            <a-input v-decorator="['danceName']" disabled />
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
      <a-divider orientation="left">薪酬配置</a-divider> -->
      <div class="st-wrapper">
        <div class="edu-type" v-for="(item, idx) in teacherSalaryList" :key="idx">
          <div class="edu-type-name" :title="item.typeName">
            <span>{{ item.typeName }}</span>
          </div>
          <a-row class="edu-type-children">
            <a-col span="4" class="edu-type-children-item" v-for="(child, childIdx) in item.salList" :key="childIdx">
              <div class="edu-type-children-item-title">
                <span :title="child.salTypeName">
                  <a href="javascript:;" @click="modifyLog(child)"><a-icon type="info-circle"/></a>
                  {{ child.salTypeName }}
                </span>
              </div>
              <div class="edu-type-children-item-title">
                <span> 金额区间：{{ child.amountSection || '无' }} </span>
              </div>
              <div class="edu-type-children-item-input">
                <a-form-item>
                  <a-input-number
                    :disabled="!child.isEditing"
                    v-decorator="[`${child.salTypeId}`, { rules: [{ required: true, message: '请填写金额' }] }]"
                    autocomplete="address-level1"
                    style="width: 100%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-date-picker
                    :disabled="!child.isEditing"
                    v-decorator="[`${child.salTypeId}takeEffectDate`, { rules: [{ required: true, message: '请选择生效时间' }] }]"
                    placeholder="请选择生效时间"
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>
              </div>
              <div class="flex flex-end">
                <a v-if="child.isEditing" @click="saveSingleItem(child)">保存</a>
                <a v-else @click="$set(child, 'isEditing', true)">编辑</a>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-form>

    <TeacherSalaryModifyLog ref="modifyLog" />
  </div>
</template>

<script>
import { scopeDanceList, scopeListArea } from '@/api/common'
import { SearchInput } from '@/components'
import TeacherSalaryModifyLog from './TeacherSalaryModifyLog.vue'
import { saveSalTemplateItem, saveSalTemplateItemAdmin, salTypeList, listTeacherSalary, saveSalTemplateSingleItem } from '@/api/education'

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
const userStateOptions = [{ label: '在职', value: 'Y' }, { label: '离职', value: 'N' }]
const options = [{ label: '全职', value: 'A' }, { label: '试用', value: 'B' }, { label: '兼职', value: 'C' }]
export default {
  name: 'TeacherSalaryForm',
  props: {
    teacherValue: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    teacherValue(nv, ov) {
      this.getSalaryList(nv.areaId).then(() => (nv ? this.dataBacking(nv) : ''))
    }
  },
  components: {
    SearchInput,
    TeacherSalaryModifyLog
  },
  data() {
    return {
      superEdit: false, //是否是超级编辑
      options,
      userStateOptions,
      formItemLayout,
      danceList: [],
      areaList: [],
      formValues: {},
      teacherInfo: {},
      teacherSalaryList: [],
      teacherSalaryDiffList: [],
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
      .then(this.getSalaryList(this.teacherValue.areaId))
      .then(this.dataBacking(this.teacherValue))
  },
  methods: {
    getSalaryList(areDeptId) {
      return salTypeList({ areDeptId }).then(res => {
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
      const {
        tsForm: { getFieldsValue },
        formValues,
        dataBacking
      } = this
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
    // changeSalary(item) {
    //   let [start, end] = item.amountSection?.split('-') || [null, null]
    //   let value = this.tsForm.getFieldValue(item.salTypeId)
    //   if (start && end && value) {
    //     if (Number(value) < Number(start) || Number(value) > Number(end)) {
    //       this.tsForm.setFieldsValue({ [item.salTypeId]: null })
    //       this.$notification['error']({
    //         message: '系统通知',
    //         description: '请输入金额区间之内的值'
    //       })
    //     }
    //   }
    // },
    getAllIptVal() {
      const {
        rewriteIptVal,
        formValues,
        tsForm: { getFieldsValue, validateFields },
        saveSalaryForm
      } = this
      validateFields()
        .then(res => {
          return rewriteIptVal(Object.assign({}, formValues, res))
        })
        .then(saveSalaryForm)
    },
    rewriteIptVal(data) {
      return new Promise((resolve, reject) => {
        if (!this.superEdit) {
          for (let obj of this.teacherSalaryList) {
            if (Array.isArray(obj.salList)) {
              for (let sal of obj.salList) {
                let [start, end] = sal.amountSection?.split('-') || [null, null]
                let value = data[sal.salTypeId]
                if (start && end && value) {
                  if (Number(value) < Number(start) || Number(value) > Number(end)) {
                    this.$notification['error']({
                      message: '系统通知',
                      description: '请输入金额区间之内的值'
                    })
                    reject('请输入金额区间之内的值')
                    return
                  }
                }
              }
            }
          }
        }
        for (let obj of this.teacherSalaryList) {
          if (Array.isArray(obj.salList)) {
            for (let sal of obj.salList) {
              let value = data[sal.salTypeId]
              if (typeof value == 'number' && Number(value) <= 0) {
                this.$notification['error']({
                  message: '系统通知',
                  description: '请输入大于0的值'
                })
                reject('请输入大于0的值')
                return
              }
            }
          }
        }
        const reg = /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/
        const typeArr = []
        for (let key in data) {
          if (reg.test(key) && data[key]) {
            typeArr.push({ salTypeId: key, salary: data[key], takeEffectDate: data[key + 'takeEffectDate'] })
          }
        }
        resolve({
          id: data.id,
          teacherId: data.teacherId,
          salTypes: JSON.stringify(typeArr)
        })
      })
    },
    saveSalaryForm(data) {
      let diffList = this.teacherSalaryDiffList,
        newSalTypes = JSON.parse(data.salTypes)
      Object.keys(diffList).forEach(key => {
        if (key.length === 36) {
          let result = null,
            isAdd = false
          if ((result = newSalTypes.find(item => item.salTypeId === key))) {
            if (result.salary <= 0) {
              isAdd = true
            }
          } else {
            isAdd = true
          }
          if (isAdd) {
            newSalTypes.push({ salTypeId: key, salary: diffList[key], takeEffectDate: diffList[key + 'takeEffectDate'] })
          }
        }
      })
      data.salTypes = JSON.stringify(newSalTypes)

      const request = this.superEdit ? saveSalTemplateItemAdmin : saveSalTemplateItem
      request(data).then(res => {
        if (res.code == 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.$emit('saved')
        }
      })
    },
    dataBacking(data) {
      this.superEdit = data.superEdit
      const hasValue = Object.keys(data).length !== 0
      const { danceId, teacherId, id, teacherMobile } = data
      const { editTeaValues } = this
      if (hasValue) {
        let timeout = setTimeout(() => {
          if (!!danceId && !!teacherId) {
            this.$nextTick(() => {
              id ? (this.isEdit = false) : ''
              this.tsForm.resetFields()
              this.usedPhone = teacherMobile || null
            })
            editTeaValues({ danceId, teacherId, page: 0, limit: 0 }).then(res => {
              this.$nextTick(() => {
                this.teacherInfo = res
                res && res.id ? (this.formValues.id = res.id) : (this.formValues.id = null)
                this.tsForm.setFieldsValue(res)
              })
            })
          }
          clearTimeout(timeout)
        }, 100)
      } else {
        this.$nextTick(() => {
          this.isEdit = true
          this.tsForm.resetFields()
          this.usedPhone = null
          this.formValues = {}
        })
      }
    },
    editTeaValues(data) {
      return listTeacherSalary(data).then(res => {
        // return res.data.data.pageList[0]
        let diffMap = {}
        Object.keys(res.data).map(key => {
          if (key.length >= 36) {
            diffMap[key] = res.data[key]
          }
        })
        this.teacherSalaryDiffList = diffMap
        return res.data
      })
    },
    verifyUserTel(rule, value, callback) {
      this.$verify.teaPhone(rule, value, callback, this.usedPhone)
    },
    modifyLog(child) {
      let teacherId = this.tsForm.getFieldsValue(['teacherId']).teacherId
      this.$refs.modifyLog.backData(teacherId, this.teacherInfo.name, child.salTypeId, child.salTypeName)
      this.$refs.modifyLog.open()
    },
    // 保存单条薪酬
    saveSingleItem(item) {
      const { salTypeId } = item
      let takeEffectDate = `${salTypeId}takeEffectDate`

      this.tsForm.validateFields([salTypeId, takeEffectDate]).then(_ => {
        let teacherId = this.tsForm.getFieldsValue(['teacherId']).teacherId
        const params = {
          teacherId,
          salary: this.tsForm.getFieldValue(salTypeId),
          takeEffectDate: this.tsForm.getFieldValue(takeEffectDate),
          salTypeId,
          isAdmin: this.superEdit
        }
        saveSalTemplateSingleItem(params).then(res => {
          this.$message.success(res.msg)
          this.$set(item, 'isEditing', false)
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.teacher-salary-form-wrapper {
  .info_wrapper {
    display: flex;
    justify-content: space-around;
  }
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

          &:nth-of-type(n + 6) {
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
