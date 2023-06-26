<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)" class="intention-foreground-wrapper">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <div class="mb20" ref="elementBtn1">
      <perm-box perm="student:user:save">
        <a-button type="primary" @click.native="handleAddIntentionStu">新增</a-button>
      </perm-box>
    </div>
    <a-card :bordered="false">
      <div ref="elementBtn" class="btn-wrapper">
        <div>
          <perm-box perm="student:user:school:down" style="margin-left: 15px;">
            <a-button @click.native="handledistribution('all')">批量分配</a-button>
          </perm-box>
          <perm-box perm="student:user:school:down" style="margin-left: 15px;">
            <a-button @click.native="markstu">批量分单</a-button>
          </perm-box>
          <perm-box perm="student:user:school:down" style="margin-left: 15px;">
            <a-button @click.native="downloadStu">下载</a-button>
          </perm-box>
          <!-- <perm-box perm="student:user:tag" style="margin-left: 15px;">
            <a-button @click.native="handleTags()">打标签</a-button>
          </perm-box> -->
        </div>
        <a-radio-group @change="_refreshTable" v-model="hasAssignment">
          <a-radio-button value="N">未分配</a-radio-button>
          <a-radio-button value="Y">已分配</a-radio-button>
          <a-radio-button value="all">全部</a-radio-button>
        </a-radio-group>
      </div>
      <div class="table-wrapper width-table">
        <perm-box perm="student:user:school">
          <s-table
            :showSlider="true"
            ref="table"
            size="default"
            :rowSelection="rowSelection"
            :columns="columns"
            :data="loadData"
            rowKey="userDeptId"
            :scroll="{ x: 1000 }"
          >
            <span slot="stuTags" slot-scope="text, record">
              <a-tooltip>
                <template slot="title">
                  {{ formatTags(text) }}
                  <!-- <div v-for="item in formatTags(text)" :key="item.id"> -->
                  <!-- <span> {{ item.tagName }}</span> -->
                  <!-- <span style="padding-right:2px;font-size:12px" v-for="col in item.tagList" :key="col.id"> {{ col.tagName }}</span> -->
                  <!-- </div> -->
                </template>
                <span v-show="formatTags(text).length > 0"> {{ formatTags(text) }}</span>
              </a-tooltip>
            </span>
            <span slot="userCopy" slot-scope="text, record">
              <a href="javascript:;" :style="{ color: record.adviserName ? '' : '#CC0033' }" @click="copyByHand(record)">{{ text }}</a>
            </span>
            <span slot="userName" slot-scope="text, record">
              <router-link :to="{ path: `/intentionStu/foreground/resourceInfo/${record.id}/${record.userDeptId}` }">{{ text || '无' }}</router-link>
              <router-link :to="{ path: `/reception/studentInfo/${record.studentId}` }" v-if="record.studentId"><a-tag>正</a-tag></router-link>
            </span>
            <span slot="action" slot-scope="text, record">
              <perm-box perm="student:user:change">
                <a href="#" @click="handleChangeStudent(record)">变更学员</a>
              </perm-box>
              <perm-box :text="record.stuName" perm="student:user:save">
                <a href="#" @click="handleEdit(record)">修改</a>
              </perm-box>
              <perm-box perm="student:info:join">
                <router-link :to="{ path: '/reception/stuApply', query: { stuId: record.id } }">报名</router-link>
              </perm-box>
              <perm-box perm="student:user:feedback">
                <a href="#" @click="handleFeedback(record)">反馈</a>
              </perm-box>
              <perm-box perm="student:user:unbind">
                <a href="#" v-if="record.studentId" @click="handleUnbundle(record)">解绑</a>
              </perm-box>
            </span>
          </s-table>
        </perm-box>
      </div>
    </a-card>

    <!-- 添加学生,修改学生modal层 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      :title="addEditTitle"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
    >
      <AdviserAddEdit ref="addEditCom" roleName="foreground" :stuId="stuId" :isOpen="visibleAddEdit"></AdviserAddEdit>
    </a-modal>

    <!-- 预约体验弹出框 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="到访/预约"
      :visible="visibleAppointment"
      @cancel="handleAppointmentCancel"
      :width="850"
      :footer="null"
    >
      <Appointment ref="appointment" :userId="userId" :initAppointment="initAppointment"></Appointment>
      <a-row>
        <a-col :offset="6">
          <a-button @click="handleAppointmentOk" type="primary">提交</a-button>
        </a-col>
      </a-row>
      <a-divider />
      <a-table :columns="userLogColumns" :dataSource="auditionList" size="small" :pagination="false" rowKey="auditionId" class="small-table">
        <span slot="action" slot-scope="text, record">
          <span v-if="record.auditionType == 'B'">
            <a href="javascript:;" v-if="record.auditionStatus == 'N'" @click="changeAudition(record)">确认体验</a>
            <span v-else>已体验</span>
          </span>
        </span>
      </a-table>
    </a-modal>

    <!-- 修改预约状态 -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="auditionTitle" :visible="visibleAudition" :footer="null" @cancel="handleAuditionCancel">
      <Audition @refresh="_refreshTable" ref="audition" :stuObj="stuObj"></Audition>
    </a-modal>

    <!-- 员工选择 -->
    <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getBackData"> </i-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="800" title="摘要" :visible="isCopy" @cancel="copyModalCancel" :footer="null">
      <p>{{ copyText }}</p>
      <a href="#" @click="handleCopy()">复制</a>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :destroyOnClose="true" :width="600" title="分单" @ok="sendMarkstu" v-model="markstuModal">
      <a-form :form="markstuForm">
        <a-form-item v-bind="$tools.formItemLayout" label="分单校区">
          <a-tree-select
            :treeDefaultExpandAll="true"
            v-decorator="['orgDeptId', { rules: [{ required: true, message: '请选择分单校区' }] }]"
            placeholder="请选择分单校区"
            allowClear
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="deptList"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="900" title="体验课" :visible="selectBind" @cancel="closeSelectBind" :footer="null">
      <a-row>
        <a-col :span="12">
          <perm-box perm="education:class-url:stuUser:bind">
            <a-form-model-item v-bind="defaultLayout" label="卡种">
              <a-input style="cursor: 'pointer', color: '#000'" disabled placeholder="请选择卡种">
                <a-icon slot="addonAfter" type="search" @click="openChoosePop" />
              </a-input>
            </a-form-model-item>
          </perm-box>
        </a-col>
      </a-row>
      <a-table
        ref="bindTable"
        size="default"
        :columns="bindColumns"
        :dataSource="tableArr"
        :loading="tableLoading"
        :rowKey="(item, index) => index"
        :pagination="false"
      >
        <span slot="action" slot-scope="text, record">
          <!-- <perm-box perm="student:info:join">
                  <a href="#" @click="bindCardHandle(record)">绑定</a>
                </perm-box> -->
          <!-- <perm-box perm="education:class-url:stuUser:unbind">
                  <a href="#" @click="unBindCardHandle(record)" v-if="record.status === 'B'">作废</a>
                </perm-box> -->
          <!-- <perm-box perm="student:info:join"> -->
          <span>
            <a href="#" @click="copyClassUrlHandle(record)" v-if="record.status === 'B'">复制上课链接</a>
          </span>
          <!-- </perm-box> -->
        </span>
      </a-table>
    </a-modal>
    <!-- 选择卡种 -->
    <GetEduCard ref="cardEduModal" @getBackData="getCardBackEdu" :OnLineExperience="true" :noPrice="true"></GetEduCard>
    <ChangeStudent ref="changeStudent" @confirm="changeStudentConfirm" />
    <!-- 打标签 -->
    <handleTag ref="handleTagModal" @refresh="_refreshTable"></handleTag>
    <handleFeedback ref="handleFeedbackModal" @refresh="_refreshTable"></handleFeedback>
  </div>
</template>
<script>
import { stuTagNoPermissionList } from '@/api/system'
import { listChannelTree, treeEduClassType } from '@/api/common'
import { getSchoolList, getStuUserClassUrl } from '@/api/education/card'
import { foregroundColumns, bindColumns } from '@/utils/intentionStu/adviser'
import { STable, IModal, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import ChangeStudent from '@/components/ChangeStudent'
import {
  pageSchoolStuUser,
  saveStuUser,
  saveTryStuUser,
  changeAdviser,
  convert2Student,
  listStuAudition,
  enableStuAudition,
  markStuUser,
  bindStuUser,
  unBindSutUser, userUnBindSutUser
} from "@/api/intentionStu/adviser"
import AdviserAddEdit from './modules/adviserAddEdit.vue'
import Appointment from './modules/adviserAppointment.vue'
import Audition from './modules/adviserAudition.vue'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import GetEduCard from '@/components/GetEduCard/GetEduCard.vue'
import handleTag from './modules/handleTag.vue'
import handleFeedback from './modules/handleFeedback.vue'
import moment from 'moment'

import DISTRICTS from '@/tools/citydata'
const addressOptions = DISTRICTS
const defaultLayout = {
  labelCol: { md: { span: 4 } },
  wrapperCol: { md: { span: 14 } }
}
const defaultStart = moment()
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment().format('YYYY-MM-DD')

export default {
  components: {
    SearchComPro,
    Audition,
    IModal,
    Appointment,
    AdviserAddEdit,
    PermBox,
    STable,
    GetEduCard,
    ChangeStudent,
    handleTag,
    handleFeedback
  },
  data() {
    return {
      height: 0, //滚动条高度
      selectedRowKeys: [],
      selectedRows: [],
      defaultLayout,
      bindColumns,
      userLogColumns: [
        {
          title: '时间',
          dataIndex: 'auditionDate',
          key: 'auditionDate',
          customRender: (text, record) => {
            let newText = this.$tools.tailor.getDate(text)
            return newText
          }
        },
        {
          title: '类型',
          dataIndex: 'auditionType',
          key: 'auditionType',
          width: 80,
          customRender: (text, record) => {
            return text == 'A' ? '到访' : '预约'
          }
        },
        {
          title: '操作人',
          dataIndex: 'orgUserName',
          key: 'orgUserName'
        },

        {
          title: '备注',
          dataIndex: 'auditionRemark',
          key: 'auditionRemark'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // table数据
      searchParams: [
        {
          type: 'treeSelect',
          isShow: true,
          show: true,
          key: 'schoolId',
          label: '分配分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'treeSelect',
          isShow: true,
          show: true,
          key: 'spitSchoolId',
          label: '分单分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'stuUserInfo',
          label: '学员信息',
          placeholder: '请输入姓名/QQ号/微信号/手机号'
        },
        {
          type: 'date',
          key: 'Date',
          label: '录入时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
        {
          type: 'chooseModal',
          key: 'all',
          label: '选择顾问',
          mutiple: true,
          placeholder: '请选择'
        },
        {
          apiOption: {
            api: treeEduClassType, // promise类型的接口
            string: 'name',
            value: 'id'
          },
          type: 'select',
          key: 'classTypeId',
          label: '类型',
          placeholder: '请选择类型'
        },
        {
          type: 'select', // 静态select框
          key: 'stuUser',
          label: '资源状态',
          placeholder: '是否报名',
          staticArr: [
            {
              string: '已报名',
              value: 'Y'
            },
            {
              string: '未报名',
              value: 'N'
            }
          ]
        },
        // {
        //   type: 'cascader',
        //   key: 'classTypeId',
        //   label: '类型',
        //   placeholder: '请选择类型',
        //   treeOps: {
        //     api: treeEduClassType,
        //     type: 'D',
        //     label: 'name',
        //     value: 'id',
        //     children: 'children'
        //   }
        // },
        {
          type: 'text',
          key: 'userSource',
          label: '资源来源',
          placeholder: '请输入资源来源'
        },
        {
          type: 'date',
          key: 'RegistrationDate',
          label: '报名日期',
          placeholder: '报名日期',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'cascader',
          key: 'channelIds',
          label: '资源渠道',
          placeholder: '请选择资源渠道',
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'cascader',
          key: 'userArea',
          search: true,
          label: '省市',
          placeholder: '请选择省市',
          treeOps: { options: addressOptions, label: 'value', value: 'value', children: 'children' }
        },
        {
          type: 'select', // 静态select框
          key: 'stuOwner',
          label: '资源所属',
          placeholder: '请选择资源所属',
          staticArr: [
            {
              string: '本馆资源',
              value: 'A'
            },
            {
              string: '外馆分本馆资源',
              value: 'B'
            }
          ]
        }
      ],
      columns: foregroundColumns,
      queryParam: {},
      loadData: parameter => {
        this.queryParam.hasAssignment = this.hasAssignment
        let params = JSON.parse(JSON.stringify(this.queryParam))
        if (params.all) delete params.all
        if (params.Date) delete params.Date
        return pageSchoolStuUser(Object.assign(parameter, params)).then(res => {
          return res
        })
      },
      tableArr: [],

      // 新增,编辑数据
      stuId: '',
      userId: '',
      addEditTitle: '',
      fromDataProps: null,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      hasAssignment: 'N',
      // 预约体验
      appointmentTitle: '',
      visibleAppointment: false,
      confirmAppointmentLoading: false,
      initAppointment: false,
      auditionList: [],
      // imodal
      userType: 'all',
      imodalId: '',

      // 修改预约状态
      stuObj: null,
      auditionTitle: '',
      visibleAudition: false,
      //copy
      isCopy: false,
      copyText: '',
      markstuModal: false,
      deptList: [],
      stuUserId: null,
      selectBind: false, //上课码弹窗
      tableLoading: false,
      eduCardIds: null,
      stuTagList: []
    }
  },
  filters: {},
  watch: {
    visibleAddEdit(nv) {
      if (nv) {
      } else {
        // 关闭窗口,reset数据
        //this.addEditTitle = ''
        //this.stuId = ''
        //this.$refs.addEditCom.resetForm()
      }
    },

    visibleAppointment(nv) {
      this.initAppointment = nv
      if (nv) {
      } else {
        // 关闭窗口,reset数据
        // this.appointmentTitle = ''
        // this.stuId = ''
        // this.$refs.appointment.resetForm()
      }
    },

    visibleAudition(nv) {
      if (nv) {
      } else {
        // 关闭窗口,reset数据
        this.auditionTitle = ''
        this.stuObj = null
        setTimeout(() => {
          this.$refs.audition.reset()
        }, 200)
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
    }
  },
  beforeCreate() {
    this.markstuForm = this.$form.createForm(this)
  },
  created() {
    this.queryParam.startDate = defaultStart
    this.queryParam.endDate = defaultEnd
    this.isSchoolId()
    this.getStuTagList()
  },
  methods: {
    handleUnbundle(record) {
      console.log(record)
      const params = {
        stuUserId: record.id
      }
      console.log(333,params)
      this.$confirm({
        title: '系统提示',
        content: '确定要解除绑定吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          console.log(11111)
          userUnBindSutUser(params).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '解除成功'
            })
            this.tableLoading = true
            this.getTable().then(res => {
              this.tableLoading = false
            })
          })
        }
      })
    },
    handleFeedback(record) {
      this.$refs.handleFeedbackModal.open(record)
    },
    formatTags(tags) {
      if (tags) {
        let tag = tags ? tags.split(',') : ''
        let tagList = []
        this.stuTagList.forEach(item => {
          if (tag.includes(item.id)) {
            tagList.push({
              tagName: item.tagName,
              id: item.id
            })
          }
        })
        return tagList.map(item => item.tagName).join(',')
      } else {
        return ''
      }
    },
    getStuTagList() {
      stuTagNoPermissionList().then(res => {
        this.stuTagList = res.data
      })
    },
    isSchoolId() {
      const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
      if (userSchoolId && userSchoolId.length > 0) {
        this.searchParams.forEach((item, index) => {
          if (item.key == 'schoolId') {
            this.searchParams.splice(index, 1)
          }
        })
      }
    },
    //校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve()
        }
      })
    },
    closeSelectBind() {
      this.selectBind = false
      this.eduCardIds = null
    },
    //上课码
    theClassCode(record) {
      this.stuUserId = record.id
      this.tableLoading = true
      this.getTable().then(res => {
        this.tableLoading = false
        this.selectBind = true
      })
    },
    getTable() {
      return new Promise((resolve, reject) => {
        getStuUserClassUrl(this.stuUserId).then(res => {
          if (res.code == 200) {
            this.tableArr = res.data
            resolve(res)
          }
        })
      })
    },
    openChoosePop() {
      this.$refs.cardEduModal.open()
    },
    //复制上课码
    copyClassUrlHandle(record) {
      this.$tools.handleCopy(record.url)
    },
    //作废
    unBindCardHandle(record) {
      const params = {
        sutUserId: this.stuUserId,
        cardId: record.cardId
      }
      this.$confirm({
        title: '系统提示',
        content: '确定要解除绑定吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unBindSutUser(params).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '解除成功'
            })
            this.tableLoading = true
            this.getTable().then(res => {
              this.tableLoading = false
            })
          })
        }
      })
    },
    //选择卡种数据
    getCardBackEdu(data) {
      this.eduCardIds = data.id
      // if( !this.tableArr.length ) {

      this.bindCard(this.eduCardIds)
      // }
    },
    // // 绑定
    // bindCardHandle (record) {
    //   this.$refs.cardEduModal.open()
    //   // this.bindCard(this.eduCardIds)
    // },
    bindCard(eduCardIds) {
      //       if( !this.eduCardIds ) {
      //   return  this.$notification['error']({
      //             message: '系统通知',
      //             description: '请先选择卡种'
      //           })
      // }
      const { stuUserId } = this
      bindStuUser({ stuUserId, eduCardIds }).then(res => {
        if (res.code == 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.tableLoading = true
          this.getTable().then(res => {
            this.tableLoading = false
          })
        }
      })
    },
    getALLDeptSchools() {
      getSchoolList().then(res => {
        this.deptList = res.data
        this.rewriteDataTree(this.deptList)
      })
    },
    rewriteDataTree(data, parent) {
      data.forEach((item, index) => {
        if (item.title && item.key && item.value) {
          return false
        }
        item.title = item.name || item.deptName
        item.value = item.id
        item.disabled = !!!parent
        if (item.children && item.children.length > 0) {
          this.rewriteDataTree(item.children, 'parent')
        }
      })
    },
    markstu(record) {
      this.examine().then(() => {
        this.getALLDeptSchools()
        this.markstuModal = true
        // this.stuUserId = record.id
      })
    },
    sendMarkstu() {
      const {
        markstuForm: { validateFields }
      } = this
      const stuUserId = this.selectedRows
        .map(item => {
          return item.id
        })
        .join(',')
      validateFields((err, value) => {
        if (!err) {
          markStuUser(Object.assign(value, { stuUserId })).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.markstuModal = false
            this._refreshTable()
          })
        }
      })
    },
    changeAudition(record) {
      enableStuAudition(record.auditionId, { status: 'Y' }).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '已成功修改状态'
        })
        this.getAuditionList(record)
      })
    },
    //搜索功能
    searchSubmit(data, isReset) {
      this.queryParam = data
      if (data.all) this.queryParam.user = data.all
      if (isReset == 'isReset') {
        this.queryParam.startDate = defaultStart
        this.queryParam.endDate = defaultEnd
      }
      this._refreshTable()
    },
    // 转正按钮
    handleStudentType(record) {
      let _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认要转正该学员吗',
        okText: '确定转为正式',
        cancelText: '取消',
        onOk() {
          convert2Student(record.id).then(res => {
            if (res.code === 200) {
              _this._refreshTable()
            }
          })
        }
      })
    },
    // 修改预约状态方法
    handleAudition(record) {
      this.visibleAudition = true
      this.auditionTitle = '修改体验状态'
      this.stuObj = record
    },
    handleAuditionCancel() {
      this.visibleAudition = false
    },
    handleTags(record) {
      this.examine().then(() => {
        this.$refs.handleTagModal.open(this.selectedRows)
      })
    },
    // i-modal相关
    // imodal 方法
    handledistribution(record, type) {
      this.examine().then(() => {
        this.userType = type
        // this.imodalId = record.userDeptId
        this.$refs.modal.open()
      })
    },
    imodalOk() {},
    imodalClose() {},
    getBackData(data, type) {
      let params = {
        stuUserId: this.selectedRowKeys.join(','),
        orgUserId: data.id
      }
      changeAdviser(params)
        .then(res => {
          if (res.code === 200) {
            this._refreshTable()
            this.$notification['success']({
              message: '系统通知',
              description: '已成功修改顾问'
            })
          }
        })
        .catch(err => {})
    },
    //预约体验方法
    handleAppointment(record) {
      this.visibleAppointment = true
      this.appointmentTitle = '预约体验'
      this.userId = record.id
      this.getAuditionList(record)
    },
    getAuditionList(record) {
      listStuAudition(this.userId).then(res => (this.auditionList = res.data))
    },
    handleAppointmentOk() {
      this.$refs.appointment
        .getAppointmentData()
        .then(res => {
          this.confirmAppointmentLoading = true
          return saveTryStuUser(res)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this._refreshTable()
            this.confirmAppointmentLoading = false
            this.visibleAppointment = false
          }
        })
        .catch(err => {
          this.confirmAppointmentLoading = false
        })
    },
    handleAppointmentCancel() {
      this.visibleAppointment = false
    },

    //新增删除方法
    handleAddIntentionStu() {
      this.stuId = null
      this.visibleAddEdit = true
      this.addEditTitle = '添加意向学员'
    },
    handleEdit(record) {
      this.stuId = record.userDeptId
      this.visibleAddEdit = true
      this.addEditTitle = '修改意向学员'
    },
    handleAddEditOk() {
      let msg = ''
      this.$refs.addEditCom
        .getAddEditForm()
        .then(res => {
          this.confirmAddEditLoading = true
          msg = res.id ? '您已修改成功' : '您已经添加成功'
          return saveStuUser(res)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: msg
            })
            this._refreshTable()
            this.confirmAddEditLoading = false
            this.visibleAddEdit = false
          }
        })
        .catch(res => {
          this.confirmAddEditLoading = false
        })
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    downloadStu() {
      const { queryParam } = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      const schoolId = Vue.ls.get('userDefaultId')
      let fields = [{ name: 'auth_token', value: token }, { name: 'school_id', value: schoolId }]
      for (let k in queryParam) {
        fields.push({ name: k, value: queryParam[k] })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}/student/user/downSchoolStuUser`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },

    copyModalCancel() {
      this.isCopy = false
    },
    copyByHand(data) {
      this.isCopy = true
      const {
        userPhone,
        userQQ,
        userWechat,
        userArea,
        danceName,
        typeName,
        userRemark,
        userSource,
        classTypeName,
        userAge,
        dancePurpose,
        learningDanceTime,
        likeDanceType
      } = data

      let text = `手机号码:${userPhone == null ? '' : userPhone}，QQ号:${userQQ == null ? '' : userQQ}，微信号:${userWechat == null ? '' : userWechat}，省市:${
        userArea == null ? '' : userArea
      }，舞种:${danceName == null ? '' : danceName}，类型:${typeName == null ? '不限' : typeName}，班型:${
        classTypeName == null ? '' : classTypeName
      }，客服:${userSource || ''}，客户年龄:${userAge == null ? '' : userAge}，学舞目的:${dancePurpose == null ? '' : dancePurpose}，学舞时间:${
        learningDanceTime == null ? '' : learningDanceTime
      }，舞蹈类型:${likeDanceType == null ? '' : likeDanceType}，备注:${userRemark == null ? '' : userRemark}`
      this.copyText = text
    },
    handleCopy(data) {
      const {
        $tools: { handleCopy },
        copyText
      } = this
      handleCopy(copyText)
    },
    handleChangeStudent(record) {
      this.$refs.changeStudent.open(record)
    },
    changeStudentConfirm(res) {
      if (res.code == 200) {
        this.$refs.changeStudent.close()
        this._refreshTable()
      }
    },
    _refreshTable() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.intention-foreground-wrapper {
  .search-wrapper {
  }

  .btn-wrapper {
    padding: 20px 0;
    margin-left: -5px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  .table-wrapper {
    // margin-top: 20px;

    .ant-table-thead > tr > th {
      // min-width: 130px;

      // &:nth-of-type(1) {
      //   min-width: 60px;
      // }

      // &:nth-of-type(6) {
      //   min-width: 300px;
      // }
    }
  }
}
</style>
