<template>
  <div class="studentinfo-wrapper">
    <a-spin :spinning="spinning">
      <a-form :form="formEdit">
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24" v-if="roleName === 'foreground'">
            <a-form-item v-bind="{ labelCol: { sm: { span: 8 } }, wrapperCol: { sm: { span: 16 } } }" label="选择时间">
              <a-date-picker :disabledDate="disabledDate" v-decorator="['createDate', { rules: [{ required: true, message: '请选择时间' }] }]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <!-- 学员姓名 -->
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="{ labelCol: { sm: { span: 8 } }, wrapperCol: { sm: { span: 16 } } }" label="学员姓名">
              <a-input v-decorator="['userName']" style="width: 40%;" />
              <a-radio-group :options="[{ label: '男', value: 'A' }, { label: '女', value: 'B' }]" v-decorator="['userSex']" style="margin-left: 8px;" />
            </a-form-item>
          </a-col>
          <!-- 学员手机号 -->
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="formItemLayout" label="手机号码">
              <a-input
                :maxLength="12"
                v-decorator="['userPhone', { rules: [{ required: hasSomeValue, message: '输入手机号码' }, { validator: setAndValidator }] }]"
              >
                <a-tooltip slot="suffix" title="查看详情" v-if="verifyPhone">
                  <a href="javascript:;" @click="contactConflictOpen('userPhone')">
                    <a-icon type="info-circle" style="color: #f5222d" />
                  </a>
                </a-tooltip>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <!-- QQ号 -->
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="formItemLayout" label="QQ号">
              <a-input
                v-decorator="[
                  'userQQ',
                  { validateTrigger: ['blur'], rules: [{ required: hasSomeValue, message: '输入QQ号' }, { validator: setAndValidator }] }
                ]"
              >
                <a-tooltip slot="suffix" title="查看详情" v-if="verifyQQ">
                  <a href="javascript:;" @click="contactConflictOpen('userQQ')">
                    <a-icon type="info-circle" style="color: #f5222d" />
                  </a>
                </a-tooltip>
              </a-input>
            </a-form-item>
          </a-col>
          <!-- 学员手机号 -->
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="formItemLayout" label="微信号">
              <a-input
                v-decorator="[
                  'userWechat',
                  { validateTrigger: ['blur'], rules: [{ required: hasSomeValue, message: '输入微信号' }, { validator: setAndValidator }] }
                ]"
              >
                <a-tooltip slot="suffix" title="查看详情" v-if="verifyWechat">
                  <a href="javascript:;" @click="contactConflictOpen('userWechat')">
                    <a-icon type="info-circle" style="color: #f5222d" />
                  </a>
                </a-tooltip>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 来源省市 -->
        <a-row :gutter="8">
          <a-col :lg="16" :md="16" :sm="24">
            <a-form-item v-bind="fromBigItemLayout" label="省市">
              <a-cascader
                :options="addressOptions"
                notFoundContent="暂无数据"
                :showSearch="{ dataFilter }"
                placeholder="请选择省市区"
                :fieldNames="{ label: 'value', value: 'value', children: 'children' }"
                changeOnSelect
                v-decorator="['userArea', { rules: [{ required: true, message: '请选择省市区' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24" v-if="roleName === 'foreground' && !stuId">
            <a-form-item v-bind="formItemLayout" label="选择客服">
              <a-input disabled v-decorator="['service']" style="color: #000;">
                <a-icon style="cursor: pointer" slot="addonAfter" type="search" @click="openTreeModal('service')" />
              </a-input>
            </a-form-item>
          </a-col>
          <!-- 资源来源  kefu-->
          <!-- <a-row :gutter="8"> -->
          <a-col :lg="24" :md="24" :sm="24" v-if="roleName === 'service'">
            <a-form-item :labelCol="{ sm: { span: 4 } }" :wrapperCol="{ sm: { span: 12 } }" label="资源渠道">
              <a-cascader
                :options="sourceOptions"
                :showSearch="{ dataFilter }"
                notFoundContent="暂无数据"
                placeholder="请选择资源渠道"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                changeOnSelect
                v-decorator="['channel', { rules: [{ required: true, message: '请选择资源渠道' }] }]"
                @change="changeChannel"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="24" :md="24" :sm="24" v-if="roleName === 'service' && channelPerson">
            <a-form-item :labelCol="{ sm: { span: 4 } }" :wrapperCol="{ sm: { span: 12 } }" label="渠道人员">
              <a-input
                style="cursor: 'pointer', color: '#000'"
                disabled
                placeholder="请选择渠道人员"
                v-decorator="['changeName', { rules: [{ required: true, message: '请选择渠道人员' }] }]"
              >
                <a-icon slot="addonAfter" type="search" @click="openChoosePop" />
              </a-input>
            </a-form-item>
          </a-col>
          <!-- 资源来源  else-->
          <a-col :lg="12" :md="12" :sm="24" v-if="roleName !== 'service'">
            <a-form-item v-bind="formItemLayout" label="资源来源">
              <a-select :allowClear="true" style="width: 100%" v-decorator="['userSource', { rules: [{ required: true, message: '请选择资源来源' }] }]">
                <a-select-option :allowClear="true" v-for="(i, index) in sourceSelectDataA" :key="index" :value="i.sourceName"
                  >{{ i.sourceName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getBackData"> </i-modal> -->
        <!-- 舞种 班级 -->
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="formItemLayout" label="舞种">
              <a-select :allowClear="true" style="width: 100%" v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]">
                <a-select-option :allowClear="true" v-for="i in danceList" :key="i.id" :value="i.id">{{ i.name }} </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="formItemLayout" label="班型" class="required">
              <a-cascader
                :options="typeList"
                :showSearch="{ dataFilter }"
                notFoundContent="暂无数据"
                placeholder="请选择班型"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                changeOnSelect
                v-decorator="['classTypeId', { rules: [{ required: true, message: '请选择班型' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 分配分馆 -->
        <a-row :gutter="8">
          <a-col :lg="12" :md="12" :sm="24" v-if="roleName === 'service'">
            <a-form-item v-bind="formItemLayout" label="分配分馆">
              <a-tree-select
                v-decorator="['schoolId', { rules: [{ required: true, message: '请分配分馆' }] }]"
                @change="onTreeChange"
                :filterTreeNode="onTreeSearch"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                multiple
                style="width: 200px"
                :treeData="deptTree"
                :treeDefaultExpandAll="true"
                placeholder="请选择分馆"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="formItemLayout" label="标签">
              <!-- <a-textarea
                placeholder="请输入备注说明 (100字以内)"
                :autosize="{ minRows: 2, maxRows: 6 }"
                v-decorator="['userRemark', { rules: [{ validator: $verify.lenth }] }]"
              /> -->
              <a-tree-select
                style="width: 100%"
                :show-search="true"
                treeNodeFilterProp="title"
                placeholder="请选择标签"
                treeDefaultExpandAll
                :allowClear="true"
                :multiple="true"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="tagList"
                v-decorator="['stuTags', { rules: [{ required: false, message: '请选择标签' }] }]"
              />
              <!-- <span class="ml10">{{ stuTagName }}</span>
              <a-input type="hidden" v-decorator="['stuTags', { rules: [{ required: false, message: '请选择标签' }] }]" />
              <a-button @click.native="handleTags()">打标签</a-button> -->
              <!-- <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" />、 -->
              <!-- <a-tree-select
                v-decorator="['schoolId', { rules: [{ required: true, message: '请分配分馆' }] }]"
                @change="onTreeChange"
                :filterTreeNode="onTreeSearch"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                multiple
                style="width: 200px"
                :treeData="deptTree"
                :treeDefaultExpandAll="true"
                placeholder="请选择分馆"
              /> -->
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <!-- 客户年龄 -->
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item v-bind="formItemLayout" label="客户年龄">
              <a-input-number v-decorator="['userAge']" style="color: #000;width:100%;"> </a-input-number>
            </a-form-item>
          </a-col>
          <!-- 学舞目的 -->
          <a-col :lg="12" :md="12" :sm="24">
            <a-row :gutter="0">
              <a-col :lg="21" :md="21" :sm="21">
                <a-form-item v-bind="littleLayout" label="学舞目的">
                  <a-select mode="tags" :allowClear="true" style="width: 100%" v-decorator="['dancePurpose']">
                    <a-select-option :allowClear="true" v-for="i in danceAimList" :key="i.value" :value="i.value">{{ i.string }} </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="3" :md="3" :sm="3">
                <a-popover title="">
                  <template slot="content">
                    <p>若为其他时，则可以手动输入选择</p>
                  </template>
                  <a-icon style="line-height:0.32rem;cursor:pointer;color:#1BA97B;" type="question-circle" />
                </a-popover>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <!-- 学舞时间 -->
          <a-col :lg="12" :md="12" :sm="24">
            <a-row :gutter="0">
              <a-col :lg="21" :md="21" :sm="21">
                <a-form-item v-bind="littleLayout" label="学舞时间">
                  <a-select mode="tags" :allowClear="true" style="width: 100%" v-decorator="['learningDanceTime']">
                    <a-select-option :allowClear="true" v-for="i in danceTimeList" :key="i.value" :value="i.value">{{ i.string }} </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="3" :md="3" :sm="3">
                <a-popover title="">
                  <template slot="content">
                    <p>若为其他时，则可以手动输入选择</p>
                  </template>
                  <a-icon style="line-height:0.32rem;cursor:pointer;color:#1BA97B;" type="question-circle" />
                </a-popover>
              </a-col>
            </a-row>
          </a-col>
          <!-- 舞蹈类型 -->
          <a-col :lg="12" :md="12" :sm="24">
            <a-row :gutter="0">
              <a-col :lg="21" :md="21" :sm="21">
                <a-form-item v-bind="littleLayout" label="舞蹈类型">
                  <a-select mode="tags" :allowClear="true" style="width: 100%" v-decorator="['likeDanceType']">
                    <a-select-option :allowClear="true" v-for="i in danceTypeList" :key="i.value" :value="i.value">{{ i.string }} </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="3" :md="3" :sm="3">
                <a-popover title="">
                  <template slot="content">
                    <p>若为其他时，则可以手动输入选择</p>
                  </template>
                  <a-icon style="line-height:0.32rem;cursor:pointer;color:#1BA97B;" type="question-circle" />
                </a-popover>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <!-- 备注 -->
          <a-col :lg="16" :md="16" :sm="24">
            <a-form-item v-bind="fromBigItemLayout" label="备注">
              <a-textarea
                placeholder="请输入备注说明 (100字以内)"
                :autosize="{ minRows: 2, maxRows: 6 }"
                v-decorator="['userRemark', { rules: [{ validator: $verify.lenth }] }]"
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :lg="8" :md="8" :sm="24">
            <a href="#" v-for="item in remarkList" :key="item" @click="addRemark(item)" class="ml20">{{ item }}</a>
          </a-col> -->
        </a-row>
      </a-form>
    </a-spin>
    <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getBackData" :ChannelId="ChannelId">
    </i-modal>
    <i-modal
      ref="modalNew"
      :multiple="false"
      :userType="userType"
      :showBranch="true"
      @ok="imodalOk"
      @close="imodalClose"
      @getBackData="getBackData"
      :ChannelId="ChannelId"
    >
    </i-modal>
    <!-- @refresh="_refreshTable" -->
    <contactConflict ref="contactConflict" />
  </div>
</template>

<script>
import DISTRICTS from '@/tools/citydata'
import { TypeCascader } from '@/components'
import IModal from '@/components/InnerModal/modal.vue'
import { treeEduClassType } from '@/api/common'
import ChooseStu from '@/components/ChooseStu'
const addressOptions = DISTRICTS
const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 12
    }
  }
}
const bigLayout = {
  labelCol: {
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    sm: {
      span: 18
    }
  }
}
const littleLayout = {
  labelCol: {
    sm: {
      span: 9
    }
  },
  wrapperCol: {
    sm: {
      span: 14
    }
  }
}
import moment from 'moment'
import { listEduDance, listEduType, listChannelTree } from '@/api/common'
import { getStuUserById, getSchoolList } from '@/api/intentionStu/adviser'
import { danceTimeList, danceTypeList, danceAimList } from '@/utils/intentionStu/adviser'
import { getSelectStuSourceData } from '@/api/reception/student'
import { filterEmptyObject } from '@/utils/util'
import { verifyContacts } from '@/api/organize'
import contactConflict from './contactConflict.vue'
import { stuTagNoPermissionList } from '@/api/system'
export default {
  components: {
    TypeCascader,
    IModal,
    ChooseStu,
    contactConflict
  },
  data() {
    return {
      tagList: [],
      remarkList: ['客户年龄', '学舞目的', '学舞时间', '舞蹈类型'],
      //手机验证需要的参数
      addOrEdit: 'add', //是添加还是修改
      oldVal: '', //修改时用于对比的值

      addressOptions,
      hasSomeValue: true,
      sourceOptions: [],
      sourceSelectDataA: [],
      formItemLayout: defaultLayout,
      fromBigItemLayout: bigLayout,
      littleLayout: littleLayout,

      //分配分馆
      searchValue: undefined,
      treeValue: '',
      treeName: '',
      deptTree: [],
      typeList: [],
      danceList: [],
      danceAimList: danceAimList,
      danceTimeList: danceTimeList,
      danceTypeList: danceTypeList,
      spinning: false,
      // imodal
      userType: 'service',
      imodalId: '',
      isCopy: false,
      copyText: '',
      timer: null,
      channelPerson: false, //渠道人员
      ChannelId: null,
      changeName: '',
      userChannelId: null,

      verifyPhone: false,
      verifyQQ: false,
      verifyWechat: false
    }
  },
  props: {
    stuId: {
      type: String,
      default: null
    },
    roleName: {
      type: String,
      default: ''
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // 回填分馆信息
    isOpen(nv, ov) {
      if (nv) {
        this.verifyPhone = false
        this.verifyQQ = false
        this.verifyWechat = false
        let that = this
        this.initFormValues().then(() => {
          that.stuId && that.stuId !== '' ? that.dataBacking() : (that.spinning = false)
        })
      }
    },
    sourceOptions(nv) {}
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  created() {
    if (this.isOpen) {
      this.initFormValues().then(() => {
        this.stuId && this.stuId !== '' ? this.dataBacking() : ''
      })
    }
  },
  mounted() {},
  methods: {
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.tagName
        itemObj.value = item.id
        itemObj.key = item.id
        // if (item.tagList) {
        //   itemObj.children = this._handleData(item.tagList)
        //   if (item.tagList.length > 0) itemObj.selectable = false
        // }
        return itemObj
      })
    },
    // getBackTagData(data) {
    //   this.stuTagName = data.map(item => item.title).join('，')
    //   let tagIds = data.map(item => item.value).join(',')
    //   this.formEdit.setFieldsValue({ stuTags: tagIds || '' })
    // },
    handleTags(record) {
      this.$refs.handleTagModal.open()
    },
    addRemark(val) {
      let { userRemark } = this.formEdit.getFieldsValue()
      this.formEdit.setFieldsValue({ userRemark: (userRemark || '') + val + '：' })
    },
    openChoosePop() {
      this.userType = 'all'
      this.$refs.modalNew.open()
    },
    changeChannel(val) {
      this.userChannelId = null
      this.formEdit.setFieldsValue({ changeName: '' })
      // '2c74f2f7-4e2b-483d-94d5-f4d922f4e127',公司Id
      let arr = ['1ae98845-de06-4870-8161-d47559cfdd7e']
      this.ChannelId = this.sourceOptions.find(item => item.id === val[0]).deptId
      if (arr.includes(val[0])) {
        this.channelPerson = true
      } else {
        this.channelPerson = false
      }
    },
    openTreeModal(type) {
      this.userType = type
      this.$refs.modal.open()
    },
    imodalOk() {},
    imodalClose() {},
    getBackData(data, type) {
      this.$nextTick(() => {
        if (this.ChannelId) {
          this.userChannelId = data.id
          this.formEdit.setFieldsValue({ userChannelId: data.id })
          this.formEdit.setFieldsValue({ changeName: data.name })
        }

        this.formEdit.setFieldsValue({ [type]: data.name })
        this.formEdit.setFieldsValue({ userSource: data.name })
        this.imodalId = data.id
      })
    },
    initFormValues() {
      this.spinning = true
      return new Promise((resolve, reject) => {
        this.initSource()
        this.initTreeData().then(() => {
          resolve()
        })
        this.resetForm()
      })
    },
    setAndValidator(rule, value, callback) {
      this.$nextTick(() => {
        const ipone = this.formEdit.getFieldValue('userPhone')
        const qq = this.formEdit.getFieldValue('userQQ')
        const wechat = this.formEdit.getFieldValue('userWechat')
        this.hasSomeValue = ipone || qq || wechat ? false : true
      })
      const { addOrEdit, oldVal, throttle } = this
      const { field } = rule
      const isNum = /(^[\-0-9][0-9]*(.[0-9]+)?)$/
      let msg = field == 'userPhone' ? '手机号码' : field == 'userQQ' ? 'QQ号码' : '微信号码'
      const formData = {}
      formData[field] = value
      formData.stuUserId = this.oldVal.userId
      if (field == 'userPhone') this.verifyPhone = false
      if (field == 'userQQ') this.verifyQQ = false
      if (field == 'userWechat') this.verifyWechat = false
      if (!value) {
        callback()
      } else {
        if (field === 'userQQ' || field === 'userPhone') {
          value = value.replace(/[^0-9]/gi, '')
        } else {
          value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
        }
        this.formEdit.setFieldsValue({ [field]: value })
        if (addOrEdit === 'edit' && oldVal[field] === value) {
          return callback()
        }
        if (field == 'userQQ' && !isNum.test(value)) {
          return callback(new Error(`QQ号码必须为数字`))
        }
        if (field == 'userPhone' && !/^1[3456789]\d{9,10}$/.test(value)) {
          return callback(new Error('请输入正确的手机号码'))
        }
        verifyContacts(formData)
          .then(() => {
            callback()
          })
          .catch(err => {
            if (field == 'userPhone') this.verifyPhone = true
            if (field == 'userQQ') this.verifyQQ = true
            if (field == 'userWechat') this.verifyWechat = true
            callback(new Error(`该信息已存在`))
          })
          .finally(() => {
            callback()
          })
      }
    },
    throttle() {
      return new Promise((resolve, reject) => {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          resolve()
        }, 400)
      })
    },
    hasValue() {
      this.$nextTick(() => {
        const ipone = this.formEdit.getFieldValue('userPhone')
        const qq = this.formEdit.getFieldValue('userQQ')
        const wechat = this.formEdit.getFieldValue('userWechat')
        this.hasSomeValue = ipone || qq || wechat ? false : true
      })
    },
    dataFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    // 初始化来源方法
    async initSource() {
      if (this.roleName === 'service') {
        let { data } = await listChannelTree()
        // listChannelTree().then(res => {
        // 将null转换成空数组,防报错
        if (data) {
          this.$tools.transNullToArr(data)
          this.sourceOptions = data
        }
        // })
      } else {
        let { data } = await getSelectStuSourceData()
        // getSelectStuSourceData().then(res => {
        if (data) {
          this.sourceSelectDataA = data
        }
        // })
      }
      this.spinning = true
      let res = await treeEduClassType()
      if (res.code == 200) {
        this.typeList = res.data
      }
      let res2 = await listEduDance()
      if (res2.code == 200) {
        this.danceList = res2.data
      }
      let res3 = await stuTagNoPermissionList()
      this.tagList = this._handleData(res3.data)
      this.spinning = false
      // treeEduClassType().then(res => (this.typeList = res.data))
      // listEduDance().then(res => (this.danceList = res.data))
    },
    // 分馆树方法
    initTreeData() {
      return new Promise((resolve, reject) => {
        getSchoolList().then(res => {
          if (res.code === 200 && res.data) {
            this._handleTreeData(res.data)
            this.deptTree = res.data
            resolve()
          }
        })
      })
    },
    _handleTreeData(data) {
      data.forEach((item, index) => {
        item.title = item.deptName || ''
        item.value = item.id
        item.key = item.id
        if (item.deptType !== 'B') {
          item.disabled = true
        }
        if (item.children && item.children.length > 0) {
          this._handleTreeData(item.children)
        }
      })
    },
    onTreeChange(value, name, extra) {
      if (value.length > 1) {
        value.shift()
      }
      this.treeValue = value[0]
      this.treeName = name[0]
    },
    onTreeSearch(inputValue, path) {
      return path.data.props.deptName.indexOf(inputValue) > -1
    },
    disabledDate(current) {
      return current && current > moment().startOf('month')
    },
    contactConflictOpen(field) {
      const value = this.formEdit.getFieldValue(field)
      this.$refs.contactConflict.open({ [field]: value })
    },
    dataBacking() {
      // 回填表单数据, 回显分馆tree数据,以及根据schoolId查询schoolName
      getStuUserById(this.stuId)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.addOrEdit = 'edit'
            this.oldVal = {
              userPhone: res.data.user.userPhone,
              userWechat: res.data.user.userWechat,
              userQQ: res.data.user.userQQ,
              userId: res.data.user.id
            }
            this.hasSomeValue = false
            let data = res.data.user
            const school = res.data.school
            let arr = []
            if (res.data.eduType) {
              arr.push(res.data.eduType.id)
              if (res.data.eduClassType) {
                arr.push(res.data.eduClassType.id)
              }
            }

            let params = {
              userName: data.userName,
              userPhone: data.userPhone,
              userSex: data.userSex,
              userQQ: data.userQQ,
              userWechat: data.userWechat,
              userArea: data.userArea ? data.userArea.split(',') : [],
              channel: res.data.channels ? res.data.channels.split(',') : [],
              danceId: res.data.eduDance ? res.data.eduDance.id : '',
              classTypeId: arr,
              userSource: data.userSource,
              changeName: res.data.userChannelName,
              userRemark: data.userRemark,
              userAge: data.userAge,
              dancePurpose: data.dancePurpose ? data.dancePurpose.split(',') : [],
              learningDanceTime: data.learningDanceTime ? data.learningDanceTime.split(',') : [],
              likeDanceType: data.likeDanceType ? data.likeDanceType.split(',') : [],
              stuTags: data.stuTags ? data.stuTags.split(',') : []
            }
            if (this.roleName === 'service') {
              this.changeChannel(res.data.channels.split(','))
            }
            this.userChannelId = res.data.userChannel
            if (this.roleName === 'foreground') {
              params.createDate = data.createDate ? moment(data.createDate, 'YYYY-MM-DD HH:mm:ss') : []
            }

            // 回填分馆
            if (this.roleName === 'service') {
              params.schoolId = school ? school.id : ''
            }
            this.$nextTick(() => {
              this.formEdit.setFieldsValue(params)
            })
          }
        })
        .catch(res => {
          console.log(res, 'AddEditContent.vue---------dataBacking')
        })
        .finally(() => {
          this.spinning = false
        })
    },

    // 重置form
    resetForm() {
      //表单重置
      this.formEdit.resetFields()
      //分馆id重置
      this.treeValue = ''
      //重置验证手机需要的参数
      this.addOrEdit = 'add'
      this.oldVal = ''
      //来源下拉框重置
      this.sourceSelectDataA = []
      this.sourceOptions = []
      this.hasSomeValue = true
      this.imodalId = null
      this.ChannelId = null
    },

    // 验证
    validateData() {
      return new Promise((res, rej) => {
        this.formEdit
          .validateFields()
          .then(() => res())
          .catch(() => console.log('err'))
      })
      // return
    },

    // 向父级暴露form表单的数据
    getAddEditForm() {
      return new Promise((res, rej) => {
        this.formEdit
          .validateFields()
          .then(() => {
            let formData = this.formEdit.getFieldsValue()
            if (formData.userTel == '') {
              delete formData.userTel
            }
            if (formData.userArea) {
              formData.userArea = formData.userArea.join(',')
            }
            if (formData.channel) {
              formData.channel = formData.channel.join(',')
            }

            if (formData.classTypeId) {
              formData.classTypeId = formData.classTypeId.join(',')
            }
            // 1111

            if (formData.likeDanceType) {
              formData.likeDanceType = formData.likeDanceType.join(',')
            }
            if (formData.dancePurpose) {
              formData.dancePurpose = formData.dancePurpose.join(',')
            }
            if (formData.learningDanceTime) {
              formData.learningDanceTime = formData.learningDanceTime.join(',')
            }
            // // 处理日期数据
            if (formData.createDate) {
              formData.createDate = this.$tools.tailor.getDateTime(formData.createDate)
            }
            // 处理打标签数据
            if (formData.stuTags) {
              formData.stuTags = formData.stuTags.join(',')
            }
            let fnResult = Object.assign(formData)
            // 添加id字段
            if (this.stuId) {
              fnResult.id = this.oldVal.userId
              fnResult.userDeptId = this.stuId
            }
            if (this.imodalId) {
              fnResult.csId = this.imodalId
            }
            // 添加分馆
            if (this.treeValue) {
              fnResult.schoolId = this.treeValue
            }
            if (this.userChannelId) {
              fnResult.userChannelId = this.userChannelId
            }
            //清空空字段
            fnResult = filterEmptyObject(fnResult)
            // return fnResult
            res(fnResult)
          })
          .catch(() => {})
      })
      // return new Promise((res, rej) => {})
      // return this.validateData()
      //   .then(() => {
      //     let formData = this.formEdit.getFieldsValue()
      //     if (formData.userTel == '') {
      //       delete formData.userTel
      //     }
      //     if (formData.userArea) {
      //       formData.userArea = formData.userArea.join(',')
      //     }
      //     if (formData.channel) {
      //       formData.channel = formData.channel.join(',')
      //     }

      //     if (formData.classTypeId) {
      //       formData.classTypeId = formData.classTypeId.join(',')
      //     }

      //     // // 处理日期数据
      //     if (formData.createDate) {
      //       formData.createDate = this.$tools.tailor.getDateTime(formData.createDate)
      //     }
      //     let fnResult = Object.assign(formData)
      //     // 添加id字段
      //     if (this.stuId) {
      //       fnResult.id = this.oldVal.userId
      //       fnResult.userDeptId = this.stuId
      //     }
      //     if (this.imodalId) {
      //       fnResult.csId = this.imodalId
      //     }
      //     // 添加分馆
      //     if (this.treeValue) {
      //       fnResult.schoolId = this.treeValue
      //     }
      //     if(this.userChannelId) {
      //       fnResult.userChannelId = this.userChannelId
      //     }
      //     //清空空字段
      //     fnResult = filterEmptyObject(fnResult)
      //     return fnResult
      //   })
      //   .catch(err => {
      //     console.log('err', err)
      //   })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

.ant-radio-wrapper {
  margin: 0;
}
.icon {
  color: #1890ff;
  font-size: 16px;
}
</style>
