<template>
  <div class="belongs-table-wrapper">
    <div v-show="showSource">
      <div class="belongs-form">
        <a-form layout="inline" :form="belongsForm">
          <!-- <div style="margin-bottom:10px;">
            <a-checkbox  @change="changeAllowHalf"  style="min-width: 100px;" v-model="allowHalfAchievement">顾问业绩减半</a-checkbox>
        </div> -->
          <div class="">
            <!-- form -->
            <a-row>
              <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20" :xxl="20">
                <a-form-item label="资源来源" style="position: relative;">
                  <a-auto-complete
                    :dataSource="sourceList"
                    :open="isOpen"
                    :disabled="disableSource()"
                    :defaultOpen="false"
                    style="width: 150px;"
                    @change="selectSource"
                    @blur="blur"
                    @focus="focus"
                  >
                    <!-- !handleEnableField('source') -->
                    <span slot="default">
                      <a-input
                        class="show-disabled"
                        style="cursor: pointer;"
                        v-decorator="['source', { rules: [{ required: hasBelongs(), message: '请选择资源来源' }] }]"
                        read-only
                        :open="isOpen"
                        placeholder="请选择资源来源"
                        :disabled="disableSource()"
                        @focus="focus"
                        @blur="blur"
                      >
                      </a-input>
                    </span>
                  </a-auto-complete>
                  <a-tooltip>
                    <template slot="title">
                      原始来源：{{ stuInfo && stuInfo.source ? stuInfo.source : '' }}
                    </template>
                    <a-icon type="question-circle" style="font-size: 14px;line-height:43px;margin-left: 8px;" />
                  </a-tooltip>
                  <!-- float: right; -->
                  <a href="javascript:;" v-if="isShowService || showServiceE1" :disabled="!handleEnableField('source')" @click="openAllImodal">
                    选择客服
                  </a>
                  <!-- position: absolute;right: -100px; -->
                  <span v-if="isShowService && isShowSource" :disabled="!handleEnableField('source')">
                    <a href="javascript:;" @click="openSourceModal">
                      选择资源
                    </a>
                    <span v-if="msg">({{ msg }})</span>
                  </span>
                  <!-- position: absolute;display: inline-block; width: 400px;left: 275px; -->
                </a-form-item>
              </a-col>
              <a-form-item style="display: none;">
                <a-input v-decorator="['sourceId']" />
              </a-form-item>
              <a-form-item style="display: none;"> <a-input v-decorator="['financeId']" /> </a-form-item>
              <a-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4" :xxl="4">
                <div class="btn" style="text-align:right;">
                  <a-button type="dashed" @click="addAchievement" :disabled="!handleEnableAdviser">
                    <a-icon type="plus-circle" />
                    分单
                  </a-button>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-form>
      </div>

      <div v-if="showPreviousCard">
        <!-- 特殊卡 -->
        <template v-if="specialCard">
          <a-table :columns="specialColumns" :dataSource="specialNextCardList" :pagination="false" :rowKey="(_, index) => index" size="small">
            <span slot="toIssueCard" slot-scope="text, record">
              <a-select style="width: 100%;" allowClear v-model="record.toIssueCard" @change="handleSpecialCardChange(record, $event)">
                <a-select-option v-for="item in issueCards" :value="item.cardId" :key="item.cardId"> {{ item.stuCardNo }} {{ item.cardName }} </a-select-option>
              </a-select>
            </span>
            <span slot="sysValConfId" slot-scope="text, record">
              <a-select style="width: 100%;" :allowClear="true" v-model="record.sysValConfId" :disabled="true">
                <a-select-option v-for="item in cardNextTypeList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="sysValTypeConfId" slot-scope="text, record">
              <a-select style="width: 100%;" :allowClear="true" v-model="record.sysValTypeConfId" :disabled="true">
                <a-select-option v-for="item in cardNextList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </span>
          </a-table>
        </template>
        <template v-else>
          <a-table v-if="!hideSourceDetailList" :columns="continuedColumns" :dataSource="studentNextCardList" :pagination="false" rowKey="id" size="small">
            <span slot="toIssueCard" slot-scope="text, record">
              <a-select
                v-if="record.lastCard"
                style="width: 100%;"
                allowClear
                v-model="record.lastCard.lastCardId"
                :disabled="record.lastCard.cardStatus !== 'A'"
                @change="handleToIssueCardChange(record, $event)"
              >
                <a-select-option v-for="item in issueCards" :value="item.cardId" :key="item.cardId"> {{ item.stuCardNo }} {{ item.cardName }} </a-select-option>
              </a-select>
            </span>
            <span slot="sysValConfId" slot-scope="text, record">
              <a-select v-if="record.lastCard" style="width: 100%;" :allowClear="true" v-model="record.lastCard.sysValConfId" :disabled="true">
                <a-select-option v-for="item in cardNextTypeList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="sysValTypeConfId" slot-scope="text, record">
              <a-select v-if="record.lastCard" style="width: 100%;" :allowClear="true" v-model="record.lastCard.sysValTypeConfId" :disabled="true">
                <a-select-option v-for="item in cardNextList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </span>
          </a-table>
        </template>
      </div>
      <div class="belongs-table">
        <a-table ref="table" :showHeader="false" :columns="columns" :dataSource="belongsList" :pagination="false" rowKey="key" :locale="Empty">
          <!-- <template slot="Empty">
            <div class="no-data">(暂无数据 请点击<a href="javascript:;" @click="addAchievement"> 这里 </a>添加业绩)</div>
          </template>  -->
          <span slot="name" slot-scope="text, record" style="display: flex; align-items: center;">
            <span>所属人: </span>
            <a-input style="width: 150px" disabled placeholder="请选择归属人" v-model="record.name" class="show-disabled">
              <a-icon slot="addonAfter" type="search" @click="selectUser(record.key)" v-if="handleEnableAdviser" />
            </a-input>
          </span>
          <span slot="deptId" slot-scope="text, record" style="display: flex; align-items: center;">
            <span style="position: relative;">所属分馆: </span>
            <a-tree-select
              style="min-width:120px;"
              v-model="record.deptId"
              placeholder="请选择分馆"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="schoolList"
              :disabled="!handleEnableAdviser"
            />
          </span>
          <span slot="price" slot-scope="text, record" style="display: flex; align-items: center;">
            <span>金额: </span>
            <a-input-number
              style="width: 120px"
              :min="0"
              :max="total"
              @change="changeBalance(record)"
              v-model="record.price"
              :disabled="disabled || !handleEnableAdviser"
            />
          </span>
          <span slot="remark" slot-scope="text, record" style="display: flex; align-items: center;">
            <span>备注: </span>
            <a-input style="width: 150px" placeholder="备注" v-model="record.remark" :disabled="disabled || !handleEnableAdviser" />
          </span>
          <span slot="action" slot-scope="text, record" style="display: flex; align-items: center;">
            <a href="javascript:;" style="min-width: 40px;display: inline-block;" @click="removeUser(record)" v-if="handleEnableAdviser">删除</a>
          </span>
        </a-table>
      </div>
    </div>
    <div v-if="sourceIsContinued || sourceIsTeacherConversion" class="belongs-teacher">
      <div class="belongs-teacher-header" style="height: 40px">
        <a-checkbox v-if="showSource" @change="showTeacherHandle" :checked="isShowTeacher" :disabled="!handleEnableTeacher" style="min-width: 100px;"
          >导师业绩</a-checkbox
        >
        <div v-else>导师业绩</div>
        <a-button v-if="isShowTeacher || !showSource" type="dashed" @click="addTeacherHandle" :disabled="!handleEnableTeacher">
          <a-icon type="plus-circle" />分单
        </a-button>
      </div>

      <div v-if="isShowTeacher || !showSource" style="overflow-x: auto;">
        <div class="teacher-info" v-for="(item, index) in teacherInfo" :key="index">
          <span class="teacher-form">
            <span style="min-width:64px;">所属分馆: </span>
            <a-tree-select
              style="min-width:120px;"
              v-model="item.teaSchoolId"
              placeholder="请选择分馆"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="schoolList"
              :disabled="!handleEnableTeacher"
            />
            <!-- treeDefaultExpandAll -->
          </span>
          <span class="teacher-form">
            <span style="min-width:36px;">导师: </span>
            <general-choice-ipt
              style="width: 120px;"
              placeholder="请选择导师"
              :inputValues="item.teacherName"
              :disabled="!handleEnableTeacher"
              @search="openTeaModal(item.id)"
              @close="resetTeaValue"
              closable
            />
            <span style="color: red;font-size: 12px;" v-if="item.teacherDiss">(已离职)</span>
          </span>
          <span class="teacher-form">
            <span style="min-width:36px;">金额: </span>
            <a-input-number v-model="item.teacherPrice" :min="0" :disabled="!handleEnableTeacher" style="width:80px" />
          </span>
          <span class="teacher-form">
            <span style="min-width:36px;">比例: </span>
            <a-select v-model="item.teacherRatio" style="width:60px" :disabled="!handleEnableTeacher">
              <!-- 资源来源 = 导师转化时，2%和5%不能选择 -->
              <template v-if="!sourceIsTeacherConversion">
                <a-select-option :value="2">2%</a-select-option>
                <a-select-option :value="5">5%</a-select-option>
              </template>
              <!-- 资源来源 = 会员续卡时，7%不能选择 -->
              <template v-if="!sourceIsContinued">
                <a-select-option :value="7">7%</a-select-option>
              </template>
            </a-select>
          </span>
          <span class="teacher-form">
            <span style="min-width:36px;">备注: </span>
            <a-input style="width: 150px" placeholder="备注" v-model="item.teacherRemark" :disabled="!handleEnableTeacher" />
          </span>
          <span>
            <a
              v-if="teacherInfo.length > 1 || handleEnableTeacher"
              href="javascript:;"
              @click="deleteTeacherHandle(item)"
              style="min-width: 40px;display: inline-block;"
              >删除</a
            >
          </span>
        </div>
      </div>
    </div>

    <!-- 老师选择组件 -->
    <choose-tea
      ref="choosetea"
      :dimission="dimission"
      :multiple="true"
      :checkType="true"
      :params="teaParams"
      teaFields="teacher"
      @getBackData="getTeaData"
    ></choose-tea>
    <i-modal
      ref="imodal"
      :counselorDimission="counselorDimission"
      :checkBox="usertype === 'all'"
      :userType="usertype"
      :staffStateOptions="staffStateOptions"
      @getBackData="getUser"
    ></i-modal>
    <f-modal title="资源来源" :open-loading="false" ref="sourceModal" size="large" @ok="getSelectedValues">
      <source-page ref="source" :searchSource="searchSource"></source-page>
    </f-modal>
  </div>
</template>

<script>
import IModal from '@/components/InnerModal'
import { getStudentNextCardList, getSelectStuSourceData, getListStuCardNextLog } from '@/api/reception/student'
import GeneralChoiceIpt from '@/components/GeneralChoiceIpt'
import ChooseTea from '@/components/ChooseTea'
import SourcePage from './SourcePage'
import { getSchoolList } from '@/api/education/card'
import { isEmpty } from '@/utils/util'
import { getConfig, cardNextType } from '@/api/education'
import { listSysValConf } from '@/api/common'

// 资源来源 = 会员续卡
const continuedColumns = [
  {
    title: '续卡卡种',
    dataIndex: 'cardName',
    width: 200,
    customRender: (val, record) => {
      const { stuCardNo, stuCardName } = record
      return `${stuCardNo} ${stuCardName}`
    }
  },
  {
    title: '往期卡种',
    dataIndex: 'toIssueCard',
    width: 200,
    scopedSlots: { customRender: 'toIssueCard' }
  },
  {
    title: '续卡分类',
    dataIndex: 'sysValConfId',
    width: 200,
    scopedSlots: { customRender: 'sysValConfId' }
  },
  {
    title: '续卡类型',
    dataIndex: 'sysValTypeConfId',
    width: 200,
    scopedSlots: { customRender: 'sysValTypeConfId' }
  }
]

// 资源来源 = 会员续卡 且 特殊卡
const specialColumns = [
  {
    title: '往期卡种',
    dataIndex: 'toIssueCard',
    width: 200,
    scopedSlots: { customRender: 'toIssueCard' }
  },
  {
    title: '续卡分类',
    dataIndex: 'sysValConfId',
    width: 200,
    scopedSlots: { customRender: 'sysValConfId' }
  },
  {
    title: '续卡类型',
    dataIndex: 'sysValTypeConfId',
    width: 200,
    scopedSlots: { customRender: 'sysValTypeConfId' }
  }
]

const columns = [
  {
    title: '所属人',
    dataIndex: 'name',
    width: '200px',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '分馆',
    dataIndex: 'deptId',
    width: '200px',
    scopedSlots: { customRender: 'deptId' }
  },
  {
    title: '金额',
    dataIndex: 'price',
    width: '150px',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '150px',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'BelongsTable',
  props: {
    refund:{//是否退费
      type: Boolean,
      default: false
    },
    counselorDimission: {
      type: Boolean,
      default: false
    },
    dimission: {//离职导师验证
      type: Boolean,
      default: false
    },
    showSource: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    stuInfo: {
      type: Object,
      default: () => {}
    },
    studentCards: {
      type: Array,
      default: () => []
    },
    studentNewCards: {
      type: Array,
      default: () => []
    },
    // 新报 0 续报 1 补录 2
    courseType: {
      type: Number,
      default: null
    },
    dataBacking: {
      type: Object,
      default: () => {}
    },
    message: {
      type: String,
      default: '实缴金额'
    },
    isShowSource: {
      type: Boolean,
      default: true
    },
    financePrice: {
      type: Number || String,
      default: 0
    },
    //顾问分单
    isShowCounselor: {
      type: Boolean,
      default: true
    },
    staffStateOptions: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Array,
      default: () => []
    },
    // 特殊续卡
    specialCard: {
      type: Boolean,
      default: false
    },
    // 补缴
    backPayment: {
      type: Boolean,
      default: false
    },
    // 不展示资源来源 = 会员续卡时的列表
    hideSourceDetailList: {
      type: Boolean,
      default: false
    },
    // 当资源来源=客服，可以修改客服人员
    allowChangeService: {
      type: Boolean,
      default: false
    }
  },
  components: {
    IModal,
    GeneralChoiceIpt,
    ChooseTea,
    SourcePage
  },
  watch: {
    stuInfo(nv) {
      this.setSourceValue(nv)
    },
    dataBacking(nv) {
      this.setBelongsValues(nv)
    },
    isShowTeacher(nv) {
      !nv ? this.initTeacher() : ''
    }
    // disabled(nv) {
    //   if (!!nv) {
    //     this.belongsList = []
    //   }
    // }
    // showSource () {
    //   this.getDom()
    // }
  },
  data() {
    return {
      columns,
      studentNextCardList: [], // 资源来源 = 会员续卡时，该学员的续卡情况列表
      issueCards: [], // 资源来源 = 会员续卡时，该学员的续卡
      cardNextList: [],
      cardNextTypeList: [],
      showPreviousCard: false,
      continuedColumns,
      specialColumns,
      specialNextCardList: [{ toIssueCard: '', sysValConfId: '', sysValTypeConfId: '' }],
      belongsList: [
        {
          deptId: null,
          name: null,
          id: null,
          price: 0,
          remark: null,
          key: 0
        }
      ],
      openedKey: null,
      stuSource: ['客服'],
      usertype: 'all',
      isOpen: false,
      isShowService: false,
      isShowTeacher: false,
      // 兼容以前的逻辑，用额外参数来控制
      // 额外条件1，补缴时，当资源来源=客服时（排除法，当不等于下拉框当中任何一个类型），允许改变客服
      showServiceE1: false,
      originServiceList: [],
      teacherInfo: [
        {
          id: 0,
          teacherName: null,
          teacherId: null,
          teacherRatio: null,
          teacherPrice: 0,
          teacherRemark: null,
          teaSchoolId: null
        }
      ],

      teacherInfoId: 0,
      msg: null,
      stuUserId: null,
      searchSource: null,
      schoolList: null,
      Empty: {
        emptyText: ''
      },
      // allowHalfAchievement: false,
      teaParams: {},
      // 特殊情况，补缴场景下，资源来源为空时，允许选择资源来源
      stuInfoSource: null,
      // 资源来源 = 会员续卡
      sourceIsContinued: false,
      // 资源来源 = 导师转化
      sourceIsTeacherConversion: false,
    }
  },
  beforeCreate() {
    this.belongsForm = this.$form.createForm(this)
  },
  created() {
    this.getSourceValue()
    this.loadSchoolId()
  },
  mounted() {
    this.resetData()
    // this.$nextTick(()=>{
    //   setTimeout(() => {
    //
    //   }, 5000);
    // })
  },
  computed: {
    // 是否启用顾问业绩
    handleEnableAdviser() {
      return this.handleEnableField(['adviserPerList', 'adviser', 'adviserDept', 'adviserPrice'])
    },
    // 是否启用导师业绩
    handleEnableTeacher() {
      return this.handleEnableField(['teacherPerList', 'teacher', 'teacherDept', 'teacherPrice', 'ratio'])
    },
    // 修改比例为7时扣除业绩列表禁用
    disabled() {
      if (this.teacherInfo.length > 0) {
        let count = this.teacherInfo.filter(d => d.teacherRatio == 7).length
        if (count > 0) this.belongsList = []
        return count > 0
      } else {
        return false
      }
    },
    // 资源来源控制
    sourceList() {
      // 新报不能选会员续卡
      if (this.courseType == 0) {
        return this.stuSource.filter(value => {
          return value != '会员续卡'
        })
      } else if (this.courseType == 1) {
        // 续卡只能选会员续卡
        return this.stuSource.filter(value => {
          return value == '会员续卡'
        })
      }
      return this.stuSource
    }
  },
  methods: {
    // // belongsForm改变
    // onFormValuesChange(props, values) {
    //   console.log('props,', props)
    //   console.log('values', values)
    //   this.showDept = values.sysBankId
    // },
    resetData() {
      this.studentNextCardList = []
      this.issueCards = []
      this.cardNextList = []
      this.cardNextTypeList = []
    },
    disableSource() {
      const {
        belongsForm: { getFieldsValue }
      } = this
      // 补缴渠道进来的且已有资源来源时，资源来源不可编辑
      if (this.backPayment && this.stuInfoSource?.length > 0) return true

      // if (getFieldsValue().source === '会员续卡') {
      let disabled = false
      for (let item of this.studentNextCardList) {
        const {
          lastCard: { cardStatus }
        } = item
        if (cardStatus === 'B') {
          disabled = true
        }
      }
      // 如果被禁了，则直接返回，否则，继续走兼容原先handleEnableField的逻辑
      if (disabled) return disabled
      // }
      //
      return !this.handleEnableField('source')
    },
    // 是否启用字段
    handleEnableField(data) {
      const { limit } = this
      if (!limit || limit.length === 0) return true
      if (Array.isArray(data)) {
        return data.findIndex(d => limit.includes(d)) >= 0
      }
      return limit.includes(data)
    },
    changeAllowHalf(e) {
      this.allowHalfAchievement = e.target.checked
    },
    //修改表格为空的样式
    getDom() {
      // setTimeout(()=>{
      //   this.$nextTick(()=>{
      //   var x = document.getElementsByClassName("ant-table-placeholder")[0]
      //   console.log(x)
      //   x.innerHTML="<span>(暂无数据 请点击</span><a href='javascript:void(0)' onclick=\"addAchievement(ant-table-placeholder);return false;\"> <span>这里</span> </a><span>添加业绩)</span>";
      //   this.$nextTick(()=>{
      //     document.querySelector(".ant-table-placeholder > a" ).onclick=this.addAchievement
      //   })
      // })
      // },0)
    },
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      getSchoolList().then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = this._handleData(res.data)
        }
      })
    },
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.deptName
        itemObj.value = item.id
        itemObj.key = item.id
        if (item.children) {
          itemObj.children = this._handleData(item.children)
          itemObj.selectable = false
        }
        return itemObj
      })
    },
    handleChange(e) {},
    addTeacherHandle(data) {
      let temObj = {
        teacherName: null,
        teacherId: null,
        teacherRatio: data ? data.teacherRatio : 2,
        teacherPrice: 0,
        teacherRemark: null,
        teaSchoolId: null
      }
      temObj.id = ++this.teacherInfoId
      this.teacherInfo.push(temObj)
      return temObj.id
    },
    deleteTeacherHandle(record) {
      this.teacherInfo = this.teacherInfo.filter(item => item.id !== record.id)
    },
    showTeacherHandle(e) {
      this.isShowTeacher = e.target.checked
    },
    setTeacherHandle(data) {
      if (data.length > this.teacherInfo.length) {
        this.addTeacherHandle({
          teacherRatio: data.commission
        })
      } else {
        this.teacherInfo[data.index].teacherRatio = data.commission
      }
      this.isShowTeacher = true
      this.$forceUpdate()
    },
    openSourceModal() {
      const {
        belongsForm: { getFieldsValue }
      } = this
      this.searchSource = getFieldsValue().source
      this.$refs.sourceModal.open()
    },
    getSelectedValues() {
      this.$refs.source
        .getSelectedValues()
        .then(res => {
          const { userPhone, userQQ, userWechat, id } = res
          this.msg = userPhone ? `手机号码：${userPhone}` : userWechat ? `微信号：${userWechat}` : `QQ号码：${userQQ}`
          this.stuUserId = id
          this.$refs.sourceModal.close()
        })
        .catch(err => {
          this.$notification['error']({
            message: '系统通知',
            description: err.message
          })
        })
    },
    initAdviser() {
      this.setSourceValue({ source: '' })
      this.belongsForm.resetFields()
      this.belongsList = [{ deptId: null, name: null, id: null, price: 0, remark: null, key: 0 }]
      this.openedKey = null
    },
    initBelongs() {
      this.initAdviser()
      this.initTeacher()
      this.isShowTeacher = false
    },
    hasBelongs() {
      const {
        belongsList,
        belongsList: { length }
      } = this
      return length != 0 && belongsList[0].id
    },
    openTeaModal(index) {
      const {
        belongsForm: { getFieldsValue }
      } = this
      this.teaParams = {}
      if (getFieldsValue().source === '会员续卡') {
        let toIssueCardIds = []
        if (this.studentNewCards?.length > 0) {
          toIssueCardIds = this.studentNewCards.map(d => {
            // 学员缴费
            if (d.hasOwnProperty('isSelect')) {
              return d.isSelect ? d.lastCardId : '-1'
            }
            return d.toIssueCard || d.lastCardId
          })
          toIssueCardIds = toIssueCardIds.filter(d => d != '-1')
        } else if (this.studentNextCardList?.length > 0) {
          toIssueCardIds = this.studentNextCardList.map(d => d.lastCard.lastCardId)
        } else if (this.specialNextCardList?.length > 0) {
          toIssueCardIds = this.specialNextCardList.map(d => d.toIssueCard)
        }
        if (!this.refund&&toIssueCardIds.findIndex(d => isEmpty(d)) >= 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请选择往期卡种！'
          })
        }
        this.teaParams = {
          lastCarId: toIssueCardIds.join(',')
        }
        // 如果当前登录人 = 网课组，则数据显示全部
        let depts = this.$store.state.user.info.depts
        if (depts) {
          for (const dept of depts) {
            const { deptId } = dept
            if ('f92fb2d7-0e57-472b-a8f6-6ad6bb9fd542' == deptId) {
              this.teaParams.lastCarId = null
              break
            }
          }
        }
      }
      this.focusTeacherId = index
      this.$refs.choosetea.open()
    },
    resetTeaValue() {
      this.teacherName = null
      this.teacherId = null
    },
    //默认function
    baseFuc() {},
    //选择导师回显
    getTeaData(data) {
      data.forEach((record, index) => {
        let teacher
        if (index === 0) {
          teacher = this.teacherInfo.find(d => d.id === this.focusTeacherId)
        } else {
          let id = this.addTeacherHandle()
          teacher = this.teacherInfo.find(d => d.id === id)
        }
        if (teacher) {
          teacher.teacherName = record.teacherName
          teacher.teacherId = record.teacherId
          teacher.leaveDate = record.leaveDate
          teacher.teacherStatus = record.status
        }
      })
    },
    //init
    initTeacher() {
      this.teacherInfo = [
        {
          id: 0,
          teacherName: null,
          teacherId: null,
          teacherRatio: null,
          teacherPrice: 0,
          teacherRemark: null
        }
      ]
      this.teacherInfoId = 0
    },
    configSource(val) {
      this.sourceIsContinued = val === '会员续卡'
      this.sourceIsTeacherConversion = val === '导师转化'
    },
    setSourceValue(data) {
      if (!data) return
      const { source, sourceId, isOldResources } = data
      const {
        belongsForm: { setFieldsValue, getFieldsValue },
        studentCards: { length }
      } = this
      if (length > 0 || isOldResources) {
        setFieldsValue({ source: '会员续卡' })
        setFieldsValue({ sourceId: null })
      }

      this.configSource(source)

      //  else  if(sourceId){
      // !sourceId
      //   ? this.$nextTick(() => {
      //       setFieldsValue({ source: '' })
      //       setFieldsValue({ sourceId: null })
      //     })
      //   : this.$nextTick(() => {
      //       this.isShowService = true
      //       if (getFieldsValue().sourceId && getFieldsValue().sourceId === sourceId) {
      //         return false
      //       }
      //       setFieldsValue({ source: '客服' })
      //       setFieldsValue({ sourceId: null })
      //     })
      // }else
      if (data.source) {
        let match = false
        this.originServiceList.forEach(item => {
          if (data.source == item.sourceName) {
            match = true
          }
        })
        this.showServiceE1 = this.allowChangeService && !match

        setFieldsValue({ source: data.source })
        setFieldsValue({ sourceId: sourceId || null })
      } else {
        setFieldsValue({ source: null })
        setFieldsValue({ sourceId: null })
        this.isShowService = false
      }
    },
    getSourceValue() {
      getSelectStuSourceData()
        .then(res => {
          console.log('资源来源', res.data)
          return res.data
        })
        .then(res => {
          // this.getPreviousCardInfo()
          if (res instanceof Array) {
            this.originServiceList = res
            res.forEach(item => {
              this.stuSource.push(item.sourceName)
            })
          }
        })
    },

    addAchievement() {
      if (this.disabled) {
        return this.$notification['error']({
          message: '系统通知',
          description: '无法操作！'
        })
      }
      const {
        belongsList,
        belongsList: { length }
      } = this
      const defaultVal = {
        deptId: null,
        name: '',
        id: null,
        price: 0,
        remark: '',
        key: length
      }
      this.belongsList = [...belongsList, defaultVal]
      return length
    },
    changeBalance(record) {
      const { key, price } = record
      const { belongsList, total, $notification } = this
      let totalPrice = 0
      belongsList.map(item => {
        if (item.price) {
          totalPrice += item.price - 0
        }
      })
      if (totalPrice > total && totalPrice > this.financePrice) {
        $notification['error']({
          message: '系统通知',
          description: `分单金额不能大于${this.message}！`
        })
        // belongsList[key].price = 0
      }
    },
    openAllImodal() {
      this.usertype = 'service'
      this.$refs.imodal.open()
    },
    selectUser(key) {
      if (this.disabled) {
        return this.$notification['error']({
          message: '系统通知',
          description: '无法操作！'
        })
      }
      this.openedKey = key
      this.usertype = 'all'
      this.$refs.imodal.open()
    },
    getUser(data, userType, mutiple) {
      const {
        openedKey,
        usertype,
        belongsForm: { setFieldsValue }
      } = this
      this.$nextTick(() => {
        if (usertype == 'all') {
          if (!!!openedKey && openedKey != 0) {
            return
          }
          if (mutiple === 'mutiple') {
            data.forEach((item, index) => {
              let key = index === 0 ? openedKey : this.addAchievement()
              this.belongsList[key].name = item.userName
              this.belongsList[key].id = item.id
              this.belongsList[key].deptId = item.deptid
            })
          } else {
            this.belongsList[openedKey].name = data.name
            this.belongsList[openedKey].id = data.id
            this.belongsList[openedKey].deptId = data.deptId
          }
        } else {
          setFieldsValue({ source: data.name, sourceId: data.id, deptId: data.deptId })
        }
      })
    },
    removeUser(record) {
      const {
        belongsList,
        belongsList: { length },
        setListIdx
      } = this
      const { key } = record
      for (let i = length - 1; i >= 0; i--) {
        if (i === key) {
          belongsList.splice(i, 1)
          setListIdx()
        }
      }
      if (!belongsList.length) {
        this.getDom()
      }
    },
    setListIdx() {
      const { belongsList } = this
      belongsList.map((item, idx) => {
        item.key = idx
      })
    },

    // 获取往期卡的详情列表
    getPreviousCardInfo() {
      if (this.studentNextCardList.length < 1) {
        // 特殊续卡
        if (this.specialCard) {
          const { id } = this.stuInfo
          this.queryPreviousCardInfo('', id)
        } else {
          const { finance, studentId } = this.dataBacking || {}
          if (finance?.id && studentId) {
            this.queryPreviousCardInfo(finance.id, studentId)
          }
        }
      }
    },
    // 资源来源切换
    selectSource(value, option) {
      // 清空导师业绩 导师
      this.initTeacher()

      value === '客服' ? (this.isShowService = true) : (this.isShowService = false)

      this.getPreviousCardInfo()

      let isContinued = value === '会员续卡'
      this.configSource(value)
      if (isContinued) {
      } else {
        this.studentNextCardList = []
      }
      this.showPreviousCard = isContinued

      const {
        belongsForm: { setFieldsValue }
      } = this
      this.$emit('changeSource', value, option)
      this.stuUserId = ''
      setFieldsValue({ source: value })
      setFieldsValue({ sourceId: null })
      this.isOpen = false
    },
    getAllValue() {
      const {
        studentNextCardList,
        belongsList,
        belongsList: { length },
        $notification,
        total,
        isShowTeacher
        // allowHalfAchievement
      } = this
      const { stuUserId } = this
      return new Promise((resolve, reject) => {
        this.belongsForm.validateFields((err, values) => {
          if (!err) {
            const { teacherInfo } = this
            let nameFlag = true
            let priceFlag = true
            let total = 0
            if (values.source == '客服' && !values.sourceId && total > 0) {
              $notification['error']({
                message: '系统通知',
                description: '请选择客服后提交！'
              })
              reject()
            }
            // 验证teacherInfo name, price
            if (teacherInfo && teacherInfo.length && this.isShowTeacher) {
              teacherInfo.forEach(item => {
                if (!item.teacherId) {
                  nameFlag = false
                }

                if (parseFloat(item.teacherPrice) <= 0) {
                  priceFlag = false
                }
                total += parseFloat(item.teacherPrice)
              })
            }
            if (!nameFlag && this.isShowTeacher) {
              $notification['error']({
                message: '系统通知',
                description: '请选择老师！'
              })
              reject()
            }
            if (!priceFlag && this.isShowTeacher) {
              $notification['error']({
                message: '系统通知',
                description: '金额必须大于0'
              })
              reject()
            }

            if (this.financePrice < total && total > this.total) {
              $notification['error']({
                message: '系统通知',
                description: '导师业绩金额不能大于实缴金额'
              })
              reject()
            }

            let achievements = null
            if (length != 0 && belongsList[0].id) {
              achievements = JSON.stringify(belongsList)
            }
            const data = Object.assign({}, values, { achievements })
            if (this.isShowTeacher) {
              data.finTeachers = JSON.stringify(this.teacherInfo)
            }
            data.stuUserId = stuUserId

            // 如果是会员续卡，需要封装
            const {
              belongsForm: { getFieldsValue }
            } = this
            let cardNextLogComplete = true
            if (getFieldsValue().source === '会员续卡') {
              let cardNextLog = []
              studentNextCardList.forEach(item => {
                const { id, lastCard } = item
                if (!lastCard) return
                const { cardStatus, lastCardId, sysValConfId, sysValTypeConfId } = lastCard
                if (cardStatus != 'A') return
                if (!lastCardId) {
                  cardNextLogComplete = false
                  return
                }
                const row = {
                  oldCardId: lastCardId,
                  newCardId: id,
                  sysValConfId,
                  sysValTypeConfId
                }
                cardNextLog.push(row)
              })
              if (!this.hideSourceDetailList && !cardNextLogComplete) {
                this.$notification['error']({
                  message: '系统通知',
                  description: '请完善往期卡种'
                })
                reject()
                return
              }
              data.cardNextLog = JSON.stringify(cardNextLog)
            }

            if (this.specialCard) {
              data.toIssueCard = this.specialNextCardList[0].toIssueCard
            }

            resolve(data)
          } else {
            reject()
          }
        })
      })
    },
    getTeacherValue() {
      const { $notification, total } = this
      return new Promise((resolve, reject) => {
        const { teacherInfo } = this
        let nameFlag = true
        let priceFlag = true
        let totalPrice = 0
        // 验证teacherInfo name, price
        if (teacherInfo && teacherInfo.length) {
          teacherInfo.forEach(item => {
            if (!item.teacherId) {
              nameFlag = false
            }

            if (parseFloat(item.teacherPrice) <= 0) {
              priceFlag = false
            }
            totalPrice += parseFloat(item.teacherPrice)
          })
        }
        if (!nameFlag) {
          $notification['error']({
            message: '系统通知',
            description: '请选择老师！'
          })
          reject()
        }
        if (!priceFlag) {
          $notification['error']({
            message: '系统通知',
            description: '金额必须大于0'
          })
          reject()
        }

        if (totalPrice > total) {
          $notification['error']({
            message: '系统通知',
            description: '导师业绩金额不能大于实缴金额'
          })
          reject()
        }
        resolve(this.teacherInfo)
      })
    },
    setBelongsValues(data) {
      // this.allowHalfAchievement = data.allowHalfAchievement
      this.isShowTeacher = data.teacherAchievements && data.teacherAchievements.length > 0
      this.initTeacher()
      if (this.isShowTeacher) {
        let tmpInfoList = []
        data.teacherAchievements.forEach((item, index) => {
          let tmpItem = {...item}
          tmpItem.id = ++this.teacherInfoId
          tmpItem.teacherPrice = Math.abs(item.teacherPrice)
          tmpItem.teaSchoolId = item.deptId
          tmpItem.teacherDiss = false
          let start = new Date(tmpItem.inductionDate).getTime()
          let end = new Date(tmpItem.leaveDate).getTime()
          if ((end - start) / 1000 / 60 / 60 / 24 > 30) tmpItem.teacherDiss = true
          tmpInfoList.push(tmpItem)
        })
        this.teacherInfo = tmpInfoList
      }

      const { adviserAchievements, source, sourceId, studentId, finance } = data
      const financeId = finance?.id
      this.configSource(source)
      const {
        belongsForm: { setFieldsValue },
        _rewriteAdviserAchievements
      } = this
      this.stuInfoSource = source
      if (source) {
        setFieldsValue({ source: source })
        setFieldsValue({ sourceId: sourceId })
      }
      if (/*source === '会员续卡' && */ studentId && financeId) {
        this.queryPreviousCardInfo(financeId, studentId)
      }

      this.showPreviousCard = source === '会员续卡'

      if (adviserAchievements) {
        _rewriteAdviserAchievements(adviserAchievements).then(arr => {
          this.$nextTick(() => {
            setFieldsValue({ source: source })
            setFieldsValue({ sourceId: sourceId })
            setFieldsValue({ financeId })
          })
          this.belongsList = arr
        })
      }
    },
    _rewriteAdviserAchievements(data) {
      return new Promise((resolve, reject) => {
        const arr = []
        data.map((item, index) => {
          arr.push({
            name: item.adviserName,
            id: item.adviserId,
            price: this.total == 0 ? 0 : Math.abs(item.price || 0),
            remark: item.remark,
            key: index,
            deptId: item.deptId
          })
        })
        resolve(arr)
      })
    },
    // 会员续卡情况下，获取往期信息
    queryPreviousCardInfo(fid, stuId) {
      if (fid) {
        getStudentNextCardList({ fid }).then(res => {
          this.studentNextCardList = res.data
        })
      }

      getListStuCardNextLog({ fid, stuId }).then(res => {
        this.issueCards = res.data
      })
      listSysValConf('cardNext').then(res => {
        this.cardNextList = res.data || []
      })

      cardNextType().then(res => {
        this.cardNextTypeList = res.data || []
      })
    },
    // 切换往期卡种
    handleToIssueCardChange(record, value) {
      if (!record.lastCard) return
      this.initTeacher()
      if (!value) {
        record.lastCard.sysValConfId = undefined
        record.lastCard.sysValTypeConfId = undefined
      } else {
        let name = this.issueCards.filter(item => item.cardId == value)[0].cardTypeName
        getConfig({
          lastCardType: name,
          newCardType: record.cardTypeName
        }).then(res => {
          const { sysValConfId, sysValTypeConfId } = res.data
          record.lastCard.sysValConfId = sysValConfId
          record.lastCard.sysValTypeConfId = sysValTypeConfId
        })
      }
    },
    // 特殊卡 会员续卡 切换往期卡种
    handleSpecialCardChange(record, value) {
      this.initTeacher()
      if (!value) {
        record.lastCard.sysValConfId = undefined
        record.lastCard.sysValTypeConfId = undefined
      } else {
        // let name = this.issueCards.filter(item => item.cardId == value)[0].cardTypeName
        // console.log(record)
        // getConfig({
        //   lastCardType: name,
        //   newCardType: record.cardTypeName
        // }).then(res => {
        //   const { sysValConfId, sysValTypeConfId } = res.data
        //   record.sysValConfId = sysValConfId
        //   record.sysValTypeConfId = sysValTypeConfId
        // })
      }
    },
    blur() {
      this.isOpen = false
    },
    focus() {
      this.isOpen = true
    }
  }
}
</script>

<style scoped lang="less">
.belongs-table-wrapper {
  .add-achievement {
    margin: 15px 0;
  }

  .belongs-table {
    margin-bottom: 20px;
  }

  .form {
    line-height: 40px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .belongs-teacher {
    // display: flex;
    // flex-flow: row nowrap;
    // align-items: center;
    .belongs-teacher-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .teacher-info {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-bottom: 10px;
      .teacher-form {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        margin-right: 10px;
      }
    }
  }
}
</style>
