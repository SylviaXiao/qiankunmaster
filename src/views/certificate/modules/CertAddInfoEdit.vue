<template>
  <div class="test-address-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
    >
      <div>
        <p>本期报名截至日期：{{ SiteInfo.siteDate }}</p>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
          <a-form-model-item ref="siteIdname" label="承办单位" prop="siteIdname">
            <div>{{ form.siteIdname }}</div>
          </a-form-model-item>
          <a-form-model-item ref="deptId" label="培训机构" prop="deptId">
            <a-tree-select
              style="width: 100%"
              v-model="form.deptId"
              :show-search="true"
              treeNodeFilterProp="title"
              placeholder="请选择培训机构"
              treeDefaultExpandAll
              :allowClear="true"
              :multiple="false"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="siteArr"
            />
          </a-form-model-item>
          <a-form-model-item label="证件类型" prop="cerIdCardType">
            <a-select v-model="form.cerIdCardType" @change="cerIdcardChange(form.cerIdCard)" placeholder="请选择证件类型">
              <a-select-option value="身份证">
                身份证
              </a-select-option>
              <a-select-option value="护照">
                护照
              </a-select-option>
              <a-select-option value="港澳台居住证">
                港澳台居住证
              </a-select-option>
              <a-select-option value="港澳台身份证">
                港澳台身份证
              </a-select-option>
              <a-select-option value="士兵证">
                士兵证
              </a-select-option>
              <a-select-option value="军官证">
                军官证
              </a-select-option>
              <a-select-option value="警官证">
                警官证
              </a-select-option>

              <a-select-option value="其他">
                其他
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="cerIdCard" label="证件号码" prop="cerIdCard">
            <a-input v-model="form.cerIdCard" placeholder="请填写证件号码" @change="cerIdcardChange(form.cerIdCard)" />
          </a-form-model-item>

          <a-form-model-item ref="cerName" label="学员姓名" prop="cerName">
            <a-input v-model="form.cerName" placeholder="请填写姓名" @change="cerNameChange(form.cerName)" />
          </a-form-model-item>
          <a-form-model-item ref="pinYing" label="姓名拼音" prop="pinYing">
            <a-input v-model="form.pinYing" placeholder="请填写姓名的全拼" />
          </a-form-model-item>

          <a-form-model-item label="出生日期" required prop="cerBirthday">
            <a-date-picker
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              v-model="form.cerBirthday"
              type="date"
              placeholder="请填写出生日期"
              style="width: 100%;"
            />
          </a-form-model-item>
          <a-form-model-item label="国籍" prop="cerNationality">
            <a-select
              show-search
              option-filter-prop="children"
              :filter-option="filterOption"
              :allowClear="true"
              v-model="form.cerNationality"
              placeholder="请选择国籍"
            >
              <a-select-option :allowClear="true" v-for="item in cerNationalityList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="民族" prop="cerEthnic">
            <a-select
              show-search
              option-filter-prop="children"
              :filter-option="filterOption"
              :allowClear="true"
              v-model="form.cerEthnic"
              placeholder="请选择民族"
            >
              <a-select-option :allowClear="true" v-for="item in cerEthnicList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="性别" prop="cerSex">
            <a-select v-model="form.cerSex" placeholder="请选择性别">
              <a-select-option value="A">
                男
              </a-select-option>
              <a-select-option value="B">
                女
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="已通过级别" prop="cerCertificate">
            <a-select v-model="form.cerCertificate" placeholder="请选择已通过级别">
              <a-select-option v-for="item in cerRankList" :value="item.value" :key="item.value">
                {{ item.string }}
              </a-select-option>
              <a-select-option value="无" key="无">
                无
              </a-select-option>
            </a-select>
            <p style="line-height: 20px;margin: 0 0 10px 0;color: #f52530;">请填写当前已通过的最高级别</p>
          </a-form-model-item>
          <a-form-model-item label="报考级别" prop="cerRank">
            <a-select v-model="form.cerRank" placeholder="请选择报考级别">
              <a-select-option v-for="item in cerRankList" :value="item.value" :key="item.value">
                {{ item.string }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="cerPhone" label="联系方式" prop="cerPhone">
            <a-input v-model="form.cerPhone" placeholder="请填写联系方式" />
          </a-form-model-item>
          <a-form-model-item ref="cerTeacher" label="顾问老师" prop="cerTeacher">
            <a-input v-model="form.cerTeacher" placeholder="请填写顾问老师名字" />
          </a-form-model-item>
          <a-form-model-item ref="cerClass" label="所在班级" prop="cerClass">
            <a-input v-model="form.cerClass" placeholder="请填写宝贝所在班级名称" />
          </a-form-model-item>
          <template v-if="hasExtraItem">
            <a-form-model-item ref="cerClass" label="上传两寸个人彩照" prop="photo">
              <UploadImg
                ref="UploadPhoto"
                :multiple="false"
                :required="false"
                filePath="reason"
                @uploadSuccess="params => UploadImgSuccess(params, 'photo')"
                :value="fileList.photo"
              />
            </a-form-model-item>
          </template>
          <template v-if="hasExtraItem">
            <a-form-model-item ref="cerClass" label="上传户口本或身份证件" prop="book">
              <UploadImg
                ref="UploadBook"
                :multiple="false"
                :required="false"
                filePath="reason"
                @uploadSuccess="params => UploadImgSuccess(params, 'book')"
                :value="fileList.book"
              />
            </a-form-model-item>
          </template>
          <template v-if="hasExtraItem">
            <a-form-model-item ref="cerClass" label="上传已通过的考级证书" prop="cer">
              <UploadImg
                ref="UploadCer"
                :multiple="false"
                :required="false"
                filePath="reason"
                @uploadSuccess="params => UploadImgSuccess(params, 'cer')"
                :value="fileList.cer"
              />
            </a-form-model-item>
          </template>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
let pinyin = require('js-pinyin')
import { cerNationalityList, cerEthnicList, doubleFirstName } from '../nation'
import { getGradingByIdCard, commonSiteById, saveGrading } from '@/api/certificate/certificate'
import { cerRankList } from '../certificate'
import { getSchoolList } from '@/api/education/card'
import { UploadImg } from '@/components'
import { previewFile } from '@/api/file'
const formLayout = {
  labelCol: {
    xs: {
      span: 6
    },
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    xs: {
      span: 18
    },
    sm: {
      span: 16
    }
  }
}
export default {
  components: { UploadImg },
  props: {
    title: String,
    record: Object,
    printInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    let setPhoneValue = (rule, value, callback) => {
      let phone = /^1[3456789]\d{9}$/
      if (!phone.test(value)) {
        callback('手机号格式错误')
      } else {
        callback()
      }
    }
    let verifyIdCard = (rule, value, callback) => {
      let idCard = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/

      if (!value) {
        callback('请填写证件号码')
      } else if (!idCard.test(value) && this.form.cerIdCardType == '身份证') {
        callback('身份证格式错误')
      } else {
        callback()
      }
    }
    let setCerRank = (rule, value, callback) => {
      let cerCertificate = parseInt(this.form.cerCertificate)
      let cerRank = parseInt(value)
      if (value) {
        if (!isNaN(cerCertificate) && cerCertificate >= cerRank) {
          callback('报考级别必须大于已通过级别')
        } else {
          callback()
        }
      } else {
        callback('请选择报考级别')
      }
    }
    return {
      cerRankList,
      cerNationalityList,
      cerEthnicList,
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      // 考点集合
      siteArr: [],
      form: {
        siteIdname: '',
        deptIdName: '',
        deptId: undefined,
        siteId: undefined,
        cerName: '',
        pinYing: '',
        cerIdCardType: undefined,
        cerIdCard: undefined,
        cerBirthday: undefined,
        cerNationality: undefined,
        cerEthnic: undefined,
        cerSex: undefined,
        cerRank: undefined,
        cerCertificate: undefined,
        cerPhone: '',
        cerTeacher: '',
        cerClass: '',
        photo: '',
        book: '',
        cer: ''
      },
      rules: {
        cerClass: [{ required: true, message: '请填写宝贝所在班级名称', trigger: 'change' }],
        deptId: [{ required: true, message: '请输选择培训机构', trigger: 'change' }],
        // siteId: [{ required: true, message: '请输入承办单位', trigger: 'blur' }],
        cerName: [{ required: true, message: '请输入学员姓名', trigger: 'change' }],
        pinYing: [{ required: true, message: '请输入姓名拼音', trigger: 'change' }],
        cerIdCardType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
        cerIdCard: [{ required: true, validator: verifyIdCard, trigger: 'change' }],
        cerBirthday: [{ required: true, message: '请输入出生日期', trigger: 'change' }],
        cerNationality: [{ required: true, message: '请选择国籍', trigger: 'change' }],
        cerEthnic: [{ required: true, message: '请选择民族', trigger: 'change' }],
        cerSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        cerRank: [{ required: true, validator: setCerRank, trigger: 'change' }],
        cerCertificate: [{ required: true, message: '请选择已通过级别', trigger: 'change' }],
        cerPhone: [{ required: true, validator: setPhoneValue, trigger: 'change' }]
      },
      SiteInfo: {},
      timer: null,
      fileList: { photo: [], book: [], cer: [] }
    }
  },
  computed: {
    // 有额外提交类目，
    hasExtraItem() {
      return this.isWhChinese || this.isWhLatin
    },
    // 武汉 少儿 中国舞
    isWhChinese() {
      return this.SiteInfo.cerAreaName == '武汉' && this.SiteInfo.danceName == '中国舞'
    },
    // 武汉 少儿 拉丁舞
    isWhLatin() {
      return this.SiteInfo.cerAreaName == '武汉' && this.SiteInfo.danceName == '拉丁舞'
    }
  },
  created() {},
  methods: {
    UploadImgSuccess(info, type) {
      this.form[type] = info.map(item => item.response?.fileId).join(',')
      this.fileList[type] = info
    },
    init() {
      let { id } = this.$route.params
      this.params = this.$route.params
      if (id) {
        commonSiteById({ siteId: id })
          .then(res => {
            if (res.code == 200 && res.data) {
              this.SiteInfo = JSON.parse(JSON.stringify(res.data))
              this.form.siteId = id
              this.form.siteIdname = res.data.organizerName
            }
          })
          .catch(err => {})
      }
    },
    linkError() {
      console.log('linkError')
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    cerIdcardChange(val) {
      let that = this
      if (val) {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          that.getOldInfo()
        }, 1000)
      }
    },
    getOldInfo() {
      let val = this.form.cerIdCard
      if (val.length == 18 && this.form.cerIdCardType == '身份证') {
        this.form.cerBirthday = val.slice(6, 10) + '-' + val.slice(10, 12) + '-' + val.slice(12, 14)
        this.form.cerSex = Number(val.slice(16, 17)) % 2 == 0 ? 'B' : 'A'
        getGradingByIdCard({ cerIdCard: val }).then(res => {
          if (res.code == 200 && res.data) {
            let data = {
              cerName: res.data.grading.cerName,
              pinYing: res.data.grading.pinYing,
              // cerIdCardType: res.data.cerIdCardType,
              // cerIdCard: res.data.cerIdCard,
              cerBirthday: res.data.grading.cerBirthday,
              cerNationality: res.data.grading.cerNationality,
              cerEthnic: res.data.grading.cerEthnic,
              cerSex: res.data.grading.cerSex,
              cerRank: res.data.grading.cerRank,
              cerCertificate: res.data.grading.cerCertificate,
              cerPhone: res.data.grading.cerPhone,
              cerTeacher: res.data.grading.cerTeacher,
              cerClass: res.data.grading.cerClass,
              photo: res.data.photoList.length > 0 ? res.data.photoList.map(item => item.id).join(',') : '',
              book: res.data.bookList.length > 0 ? res.data.bookList.map(item => item.id).join(',') : '',
              cer: res.data.cerList.length > 0 ? res.data.cerList.map(item => item.id).join(',') : ''
            }
            this.setForm(res.data)
            this.form = Object.assign(this.form, data)
          }
        })
      }
    },
    cerNameChange(val) {
      let that = this
      if (val) {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (/^[\u4e00-\u9fa5]+$/i.test(val)) {
            let arr = []
            for (let char of val) {
              arr.push(pinyin.getFullChars(char))
            }
            if (doubleFirstName.includes(val.slice(0, 2))) {
              arr.forEach((item, index) => {
                if (index == 1) {
                  arr[1] = item.toLowerCase() + ' '
                }
                if (index > 2) {
                  arr[index] = item.toLowerCase()
                }
              })
            } else {
              arr.forEach((item, index) => {
                if (index == 0) {
                  arr[0] = item + ' '
                }
                if (index > 1) {
                  arr[index] = item.toLowerCase()
                }
              })
            }
            that.form.pinYing = arr.join('')
          } else {
            that.form.pinYing = ''
          }
        }, 1000)
      } else {
        that.form.pinYing = ''
      }
    },
    openModal() {
      this.visibleAddEdit = true
      this.init()
      this.initForm()
    },
    backindData(record) {
      let params = {
        siteIdname: record.organizerName,
        deptIdName: record.deptName,
        deptId: record.deptId,
        siteId: record.siteId,
        cerName: record.cerName,
        pinYing: record.pinYing,
        cerIdCardType: record.cerIdCardType,
        cerIdCard: record.cerIdCard,
        cerBirthday: record.cerBirthday,
        cerNationality: record.cerNationality,
        cerEthnic: record.cerEthnic,
        cerSex: record.cerSex,
        cerRank: record.cerRank,
        cerCertificate: record.cerCertificate,
        cerPhone: record.cerPhone,
        cerTeacher: record.cerTeacher,
        cerClass: record.cerClass,
        id: record.gradingId,
        photo: record.photoList.length > 0 ? record.photoList.map(item => item.id).join(',') : '',
        book: record.bookList.length > 0 ? record.bookList.map(item => item.id).join(',') : '',
        cer: record.cerList.length > 0 ? record.cerList.map(item => item.id).join(',') : ''
      }
      this.setForm(record)
      this.form = Object.assign(this.form, params)
    },
    setForm(record) {
      //回显个人彩照
      if (record.photoList && record.photoList.length > 0) {
        record.photoList.forEach(async item => {
          let url = await this.initImage(item.id)
          item.url = url
          this.fileList.photo = record.photoList
        })
      } else {
        this.$refs.UploadPhoto?.clearImg()
      }
      //回显户口本或身份证
      if (record.bookList && record.bookList.length > 0) {
        record.bookList.forEach(async item => {
          let url = await this.initImage(item.id)
          item.url = url
          this.fileList.book = record.bookList
        })
      } else {
        this.$refs.UploadBook?.clearImg()
      }
      //回显已通过证书
      if (record.cerList && record.cerList.length > 0) {
        record.cerList.forEach(async item => {
          let url = await this.initImage(item.id)
          item.url = url
          this.fileList.cer = record.cerList
        })
      } else {
        this.$refs.UploadCer?.clearImg()
      }
    },
    initImage(fileId) {
      return previewFile({ fileId }).then(res => {
        if (res.code == 200) {
          return Promise.resolve(res.data)
        }
      })
    },
    valadeTime() {
      let start = new Date().getTime()
      let end = new Date(this.SiteInfo.siteDate).getTime()
      if (start > end) {
        this.$notification['error']({
          message: '系统通知',
          description: '本期报名已结束!'
        })
        return false
      }
      return true
    },
    handleAddEditOk() {
      let that = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm({
            title: '系统提示',
            content: '确定提交吗?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              saveGrading(that.form)
                .then(res => {
                  if (res.code === 200) {
                    that.$notification['success']({
                      message: '系统通知',
                      description: '操作成功!'
                    })
                    that.handleAddEditCancel()
                    that.refreshTable()
                  }
                })
                .catch(err => {})
                .finally(() => {})
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAddEditCancel() {
      // 重置表单数据
      this.resetForm()
      this.visibleAddEdit = false
    },
    _handleTreeData(data, type1, type2, type3, type4) {
      data.forEach((item, index) => {
        item.title = item[type1] || ''
        item.value = item[type2]
        item.key = item[type2]
        if (item.children && item.children.length > 0) {
          item.selectable = false
          item.disabled = true
          this._handleTreeData(item.children, type3, type4, type3, type4)
        }
      })
    },
    initForm() {
      getSchoolList()
        .then(res => {
          if (res.code === 200) {
            let data = res.data
            this._handleTreeData(data, 'deptName', 'id', 'deptName', 'id')
            this.siteArr = data
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 重置表单数据
      this.resetForm()
    },
    resetForm() {
      this.form = {
        siteIdname: '',
        deptIdName: '',
        deptId: undefined,
        siteId: undefined,
        cerName: '',
        pinYing: '',
        cerIdCardType: undefined,
        cerIdCard: undefined,
        cerBirthday: undefined,
        cerNationality: undefined,
        cerEthnic: undefined,
        cerSex: undefined,
        cerRank: undefined,
        cerCertificate: undefined,
        cerPhone: '',
        cerTeacher: '',
        cerClass: '',
        photo: '',
        book: '',
        cer: ''
      }
      this.fileList = { photo: [], book: [], cer: [] }
      this.$nextTick(() => {
        this.$refs.UploadPhoto?.clearImg()
        this.$refs.UploadBook?.clearImg()
        this.$refs.UploadCer?.clearImg()
      })
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.test-address-wrapper {
}
:global {
  .dynamic-add {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
