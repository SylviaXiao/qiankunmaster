<template>
  <div class="test-address-wrapper">
    <div class="cert_title">
      报名信息填写
    </div>
    <div class="cert_info">
      <img src="~@/assets/cert/cert_bg.png" class="icon" style="padding:0;" />
      <div class="cert_info_content">
        <div class="cert_info_1">{{ SiteInfo.gradeName }}</div>
        <div class="cert_info_2">
          <p>亲爱的家长：</p>
          <p class="p1">为保证宝贝顺利完成本次考级报名，</p>
          <p class="p1">请您如实填写相关信息，并在提交前认真核对确保无误。</p>
        </div>
        <div class="cert_info_3">本期报名截至日期：{{ SiteInfo.siteDate }}</div>
      </div>
    </div>
    <div class="bg_form">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
        <a-form-model-item ref="deptIdName" label="" prop="deptIdName">
          <div class="flex between formitemContent ">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/siteIdname.png" class="icon" style="padding:0;" />
              <span> 培训机构：</span>
            </div>
            <div class="mr20">{{ form.deptIdName }}</div>
          </div>
        </a-form-model-item>
        <a-form-model-item ref="siteIdname" label="" prop="siteIdname">
          <div class="flex between formitemContent ">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/siteIdname.png" class="icon" style="padding:0;" />
              <span>承办单位： </span>
            </div>
            <div class="mr20">{{ form.siteIdname }}</div>
          </div>
        </a-form-model-item>

        <a-form-model-item label="" prop="cerIdCardType">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/siteIdname.png" class="icon" style="padding:0;" />
              <span> 证件类型:</span>
            </div>
            <a-select placeholder="请选择证件类型" v-model="form.cerIdCardType" @change="cerIdcardChange(form.cerIdCard)">
              <a-icon slot="suffixIcon" type="right" />
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
          </div>
        </a-form-model-item>
        <a-form-model-item ref="cerIdCard" label="" prop="cerIdCard">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerIdCard.png" class="icon" style="padding:0;" />
              <span> 证件号码:</span>
            </div>
            <a-input v-model="form.cerIdCard" placeholder="请填写证件号码" @change="cerIdcardChange(form.cerIdCard)" />
          </div>
        </a-form-model-item>

        <a-form-model-item ref="cerName" label="" prop="cerName">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerName.png" class="icon" style="padding:0;" />
              <span> 学员姓名:</span>
            </div>
            <a-input v-model="form.cerName" placeholder="请填写姓名" @change="cerNameChange(form.cerName)" />
          </div>
        </a-form-model-item>
        <a-form-model-item ref="pinYing" label="" prop="pinYing">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/pinYing.png" class="icon" style="padding:0;" />
              <span> 姓名拼音:</span>
            </div>
            <a-input v-model="form.pinYing" placeholder="请填写姓名的全拼" />
          </div>
        </a-form-model-item>

        <a-form-model-item label="" required prop="cerBirthday">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerBirthday.png" class="icon" style="padding:0;" />
              <span> 出生日期:</span>
            </div>
            <a-date-picker
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              v-model="form.cerBirthday"
              type="date"
              placeholder="请填写出生日期"
              style="width: 100%;"
            >
              <span slot="suffixIcon"></span>
            </a-date-picker>
          </div>
        </a-form-model-item>
        <a-form-model-item label="" prop="cerNationality">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerNationality.png" class="icon" style="padding:0;" />
              <span> 国籍:</span>
            </div>
            <a-select
              show-search
              option-filter-prop="children"
              :filter-option="filterOption"
              :allowClear="true"
              v-model="form.cerNationality"
              placeholder="请选择国籍"
            >
              <a-icon slot="suffixIcon" type="right" />
              <a-select-option :allowClear="true" v-for="item in cerNationalityList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </div>
        </a-form-model-item>
        <a-form-model-item label="" prop="cerEthnic">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerEthnic.png" class="icon" style="padding:0;" />
              <span> 民族:</span>
            </div>
            <a-select
              show-search
              option-filter-prop="children"
              :filter-option="filterOption"
              :allowClear="true"
              v-model="form.cerEthnic"
              placeholder="请选择民族"
            >
              <a-icon slot="suffixIcon" type="right" />
              <a-select-option :allowClear="true" v-for="item in cerEthnicList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </div>
        </a-form-model-item>
        <a-form-model-item label="" prop="cerSex">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerSex.png" class="icon" style="padding:0;" />
              <span> 性别:</span>
            </div>
            <a-select v-model="form.cerSex" placeholder="请选择性别">
              <a-icon slot="suffixIcon" type="right" />
              <a-select-option value="A">
                男
              </a-select-option>
              <a-select-option value="B">
                女
              </a-select-option>
            </a-select>
          </div>
        </a-form-model-item>
        <a-form-model-item label="" prop="cerCertificate">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerCertificate.png" class="icon" style="padding:0;" />
              <span> 已通过级别:</span>
            </div>
            <a-select v-model="form.cerCertificate" placeholder="请填写当前已通过的最高级别">
              <a-icon slot="suffixIcon" type="right" />
              <a-select-option v-for="item in cerRankList" :value="item.value" :key="item.value">
                {{ item.string }}
              </a-select-option>
              <a-select-option value="无" key="无">
                无
              </a-select-option>
            </a-select>
          </div>
        </a-form-model-item>
        <a-form-model-item label="" prop="cerRank">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerRank.png" class="icon" style="padding:0;" />
              <span> 报考级别:</span>
            </div>
            <a-select v-model="form.cerRank" placeholder="请选择报考级别">
              <a-icon slot="suffixIcon" type="right" />
              <a-select-option v-for="item in cerRankList" :value="item.value" :key="item.value">
                {{ item.string }}
              </a-select-option>
            </a-select>
          </div>
        </a-form-model-item>

        <a-form-model-item ref="cerPhone" label="" prop="cerPhone">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerPhone.png" class="icon" style="padding:0;" />
              <span> 联系方式:</span>
            </div>
            <a-input v-model="form.cerPhone" placeholder="请填写您的联系方式" />
          </div>
        </a-form-model-item>
        <a-form-model-item ref="cerTeacher" label="" prop="cerTeacher">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/cerName.png" class="icon" style="padding:0;" />
              <span> 顾问老师:</span>
            </div>
            <a-input v-model="form.cerTeacher" placeholder="请填写顾问老师名字" />
          </div>
        </a-form-model-item>
        <a-form-model-item ref="cerClass" label="" prop="cerClass">
          <div class="flex between formitemContent">
            <div class="formitemLabel">
              <img width="17px" src="~@/assets/cert/siteIdname.png" class="icon" style="padding:0;" />
              <span> 所在班级:</span>
            </div>
            <a-input v-model="form.cerClass" placeholder="请填写宝贝所在班级名称" />
          </div>
        </a-form-model-item>
        <div v-if="isWhLatin" style="padding:16px;color:#f85d83;">未参加过CEFA级别考试的学生需要上传照片等</div>
        <template  v-if="isWhLatin">
          <a-form-model-item ref="cerClass" label="" prop="photo">
            <div class=" formitemContent">
              <div class="formitemLabel">
                <img width="17px" src="~@/assets/cert/siteIdname.png" class="icon" style="padding:0;" />
                <span> 上传两寸个人彩照:</span>
              </div>
              <div v-if="isWhChinese" class="desText">（宝贝2寸蓝底彩照）</div>
              <div v-else-if="isWhLatin" class="desText">（宝贝大一寸蓝底照片）</div>
              <div style="display:flex;    justify-content: space-between;">
                <div></div>
                <UploadImg
                  ref="UploadPhoto"
                  :multiple="false"
                  :required="false"
                  filePath="reason"
                  @uploadSuccess="params => UploadImgSuccess(params, 'photo')"
                  :value="fileList.photo"
                />
              </div>
            </div>
          </a-form-model-item>
        </template>
        <template v-if="hasExtraItem">
          <a-form-model-item ref="cerClass" label="上传户口本或身份证件" prop="book">
            <div class=" formitemContent">
              <div class="formitemLabel">
                <img width="17px" src="~@/assets/cert/siteIdname.png" class="icon" style="padding:0;" />
                <span>
                  上传户口本或身份证件:
                </span>
              </div>
              <div class="desText">（上传有宝贝个人信息的一面，图像清晰；如为境外身份，请上传护照或港澳通行证个人信息页）</div>
              <div style="display:flex;    justify-content: space-between;">
                <div></div>
                <UploadImg
                  ref="UploadBook"
                  :multiple="false"
                  :required="false"
                  filePath="reason"
                  @uploadSuccess="params => UploadImgSuccess(params, 'book')"
                  :value="fileList.book"
                />
              </div>
            </div>
          </a-form-model-item>
        </template>
        <template v-if="hasExtraItem">
          <a-form-model-item ref="cerClass" label="上传已通过的考级证书" prop="cer">
            <div class=" formitemContent">
              <div class="formitemLabel">
                <img width="17px" src="~@/assets/cert/siteIdname.png" class="icon" style="padding:0;" />
                <span> 上传已通过的考级证书:</span>
              </div>
              <div class="desText">（例如，本次考3级，请上传2级证书，以此类推）</div>
              <div style="display:flex;    justify-content: space-between;">
                <div></div>
                <UploadImg
                  ref="UploadCer"
                  :multiple="false"
                  :required="false"
                  filePath="reason"
                  @uploadSuccess="params => UploadImgSuccess(params, 'cer')"
                  :value="fileList.cer"
                />
              </div>
            </div>
          </a-form-model-item>
        </template>
      </a-form-model>
      <div class="mt10 mb20" style="text-align:right;">
        <a-button type="primary" @click="handleAddEditOk" round>
          提交
        </a-button>
      </div>
      <!-- <p style="color: rgb(163, 125, 125);padding: 15px;font-size: 12px;font-weight: 500;text-align:center;">
        提交后请联系您的顾问老师，了解报名相关的后续安排。 感谢您的配合，预祝宝贝考试顺利！
      </p> -->
    </div>
    <a-modal title="" :visible="visible" :footer="null" :maskClosable="false" @cancel="handleCancel" :closable="type == 'comfirm'">
      <div class="model_end">
        <img width="100px" src="~@/assets/cert/end.png" class="img" style="padding:0;" />
        <p v-if="type == 'time'" class="p1">本期报名已结束</p>
        <p v-if="type == 'time'" class="p2">请联系相关工作人员，谢谢</p>
        <p v-if="type == 'success'" class="p1">报名成功</p>
        <p v-if="type == 'success'" class="p2 p3">提交后请联系您的顾问老师，了解报名相关的后续安排。 感谢您的配合，预祝宝贝考试顺利！</p>
        <p v-if="type == 'comfirm'" class="p1">温馨提示</p>
        <p v-if="type == 'comfirm'" class="p2">确定提交吗?</p>
        <a-button v-if="type == 'comfirm'" type="primary" round @click="handleOk">
          确定
        </a-button>
        <a-button v-else type="primary" round @click="handleCancel">
          我知道了
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
let pinyin = require('js-pinyin')
import { commonViewUpload } from '@/api/common'
import { UploadImg } from '@/components'
import { cerNationalityList, cerEthnicList, doubleFirstName } from './nation'
import { getGradingByIdCard, listSite, commonSiteById, listOrgDept, saveGrading } from '@/api/certificate/certificate'
import { cerRankList } from './certificate'
const formLayout = {
  labelCol: {
    xs: {
      span: 0
    },
    sm: {
      span: 0
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 24
    }
  }
}

export default {
  components: { UploadImg },
  props: {
    title: String,
    record: Object
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
      doubleFirstName, //复姓表
      type: 'time', //time success comfirm
      visible: false,
      cerRankList,
      cerNationalityList,
      cerEthnicList,
      formLayout,
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
      console.log(111,this.SiteInfo.cerAreaName,this.SiteInfo.danceName)
      return this.SiteInfo.cerAreaName === '武汉' && this.SiteInfo.danceName === '中国舞'
    },
    // 武汉 少儿 拉丁舞
    isWhLatin() {
      return this.SiteInfo.cerAreaName === '武汉' && this.SiteInfo.danceName === '拉丁舞'
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    UploadImgSuccess(info, type) {
      this.form[type] = info.map(item => item.response?.fileId).join(',')
      this.fileList[type] = info
    },
    init() {
      let { deptId, id } = this.$route.params
      this.params = this.$route.params
      if (deptId && id) {
        commonSiteById({ siteId: id })
          .then(res => {
            if (res.code == 200 && res.data) {
              this.SiteInfo = JSON.parse(JSON.stringify(res.data))
              this.form.siteId = id
              this.form.siteIdname = res.data.organizerName
              this.valadeTime()
              return listOrgDept()
            } else {
              reject()
            }
          })
          .then(res => {
            let institution = this.platFn(res.data)
            // res.data.map(item => {
            //   return item.children
            // })
            institution = institution.filter(item => {
              return item.id == deptId
            })[0]
            this.form.deptIdName = institution.name
            this.form.deptId = institution.deptId
          })
          .catch(err => {
            this.linkError()
          })
      }
    },
    //扁平化数组
    platFn(list) {
      let res = []
      res = list.concat(
        ...list
          .map(item => {
            if (item.children instanceof Array && item.children.length > 0) {
              return this.platFn(item.children)
            }
            return null
          })
          .filter(o => o instanceof Array && o.length > 0)
      )
      return res
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
      return commonViewUpload({ fileId }).then(res => {
        if (res.code == 200) {
          return Promise.resolve(res.data)
        }
      })
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
    handleOk() {
      this.visible = false
      saveGrading(this.form)
        .then(res => {
          if (res.code === 200) {
            // that.$notification['success']({
            //   message: '系统通知',
            //   description: '操作成功!'
            // })
            this.visible = true
            this.type = 'success'
          }
        })
        .catch(err => {})
        .finally(() => {})
    },
    handleCancel() {
      this.visible = false
      if (this.type == 'success') {
        this.resetForm()
        this.init()
      }
    },
    valadeTime() {
      let start = new Date(moment(new Date()).format('YYYY-MM-DD')).getTime()
      let end = new Date(this.SiteInfo.siteDate).getTime()
      if (start > end) {
        this.visible = true
        this.type = 'time'
        return false
      }
      return true
    },
    handleAddEditOk() {
      let that = this
      this.$refs.ruleForm.validate(valid => {
        let valadeTime = that.valadeTime()
        if (valid && valadeTime) {
          this.visible = true
          this.type = 'comfirm'
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    initForm() {
      listSite()
        .then(res => {
          if (res.code === 200) {
            this.siteArr = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 重置表单数据
      this.resetForm()
    },
    resetForm() {
      // 重置表单数据
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
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  padding: 63px 0 0 0;
  overflow-y: scroll;
  background-color: #fff;
  .cert_title {
    width: 100vw;
    height: 63px;
    background: #fdd5d4;
    line-height: 63px;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #000000;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  .cert_info {
    img {
      width: 100vw;
      min-height: 180px;
    }
    position: relative;
    div {
    }
    > .cert_info_content {
      position: absolute;
      text-align: center;
      left: 0;
      width: 100vw;
      top: 26px;
      left: 0;
    }
    .cert_info_1 {
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #313131;
      min-height: 29px;
    }
    .cert_info_2 {
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: rgba(49, 49, 49, 0.96);
      line-height: 21px;
      margin-top: 5px;
      text-align: left;

      p {
        margin: 0;
        padding: 0 0 0 40px;
      }
      .p1 {
        text-indent: 2em;
      }
    }
    .cert_info_3 {
      background-color: #f85d83;
      color: #fff;
      top: calc(100vw / 375 * 103);
      // width: 240px;
      padding: 0 25px;
      display: inline-block;
      border-radius: 10px;
      margin: 5px auto 0;
    }
  }
  .bg_form {
    img {
      vertical-align: middle;
    }
    .ant-form-item {
      // height: 50px;
      // line-height: 50px;
      padding: 0 0 0 20px;
      border-bottom: 1px solid #eeeff1;
    }
    .formitemContent_text {
      // line-height: 50px;
      // padding: 0 0 0 20px;
      // border-bottom: 1px solid #eeeff1;
    }
    /deep/.has-error .ant-form-explain,
    .has-error .ant-form-split {
      color: #f5222d;
      padding-left: 100px;
    }
    .formitemContent {
      width: 100%;
      height: 100%;

      box-sizing: border-box;
      .formitemLabel {
        min-width: 100px;
      }
      /deep/.ant-select-selection,
      /deep/.ant-input {
        border: 0;
        text-align: right;
        height: 48px;
        line-height: 48px;
      }
      /deep/.ant-select-selection-selected-value {
        text-align: right;
        height: 48px;
        line-height: 48px;
        width: 100%;
        padding-right: 3px;
      }

      /deep/.ant-select-focused .ant-select-selection,
      .ant-select-selection:focus,
      .ant-select-selection:active,
      .ant-input:focus,
      .ant-input:active {
        border-color: #3ab58a;
        border-right-width: 0;
        outline: 0;
        box-shadow: none;
      }
      /deep/.ant-select-selection__placeholder,
      /deep/.ant-select-search__field__placeholder {
        width: 100%;
        text-align: right;
        height: 48px;
        line-height: 48px;
        // display: block !important;
      }
    }
  }
}
:global {
  .dynamic-add {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
}
/deep/.ant-form-item {
  margin: 0;
}
/deep/.ant-form-item-required::before {
  display: inline-block;
  margin-right: 0.04rem;
  color: #f5222d;
  font-size: 0.14rem;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '';
}
/deep/.ant-btn-primary {
  color: #fff;
  background-color: #f85d83;
  border-color: #f85d83;
  height: 40px;
  width: calc(100vw - 40px);
  margin: 0 auto;
  display: block;
  border-radius: 20px;
}
/deep/.ant-modal-content {
  width: 240px;
  height: 300px;
  margin: 0 auto;
  border-radius: 17px;
  .img {
    position: absolute;
    left: 50%;
    top: -15px;
    transform: translateX(-50%);
  }
}
/deep/.ant-modal-body {
  padding: 0;
}
.model_end {
  padding-top: 100px;
  text-align: center;
  /deep/.ant-btn-primary {
    width: 120px !important;
    letter-spacing: 2px;
  }
  .p1 {
    color: #000000;
    margin: 0 0 5px 0;
    font-size: 17px;
  }
  .p2 {
    color: rgb(190 190 190);
    font-size: 14px;
    margin: 0 0 20px 0;
  }
  .p3 {
    font-size: 12px;
    margin: 0 0 10px 0;
    padding: 10px 28px 15px;
    line-height: 20px;
  }
}
/deep/.ant-select-selection__placeholder,
.ant-select-search__field__placeholder {
  position: absolute;
  top: 0;
  height: 0.2rem;
  margin-top: 0;
}
.desText {
  font-size: 12px;
  color: #ccc;
  line-height: 14px;
}
@media screen and (max-width: 364px) {
  .test-address-wrapper .cert_info .cert_info_2 p {
    padding: 0 0 0 20px !important;
  }
  .test-address-wrapper .cert_info .cert_info_1 {
    font-size: 18px;
    min-height: auto;
  }
}
</style>
