<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)" class="intention-service-wrapper">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" @reset="resetValue" ref="search" :searchParams="searchParams">
          <template slot="custom">
            <a-col :lg="8" :md="12" :sm="24" style="line-height: 40px;display: flex;flex-flow: row nowrap;justify-content: center;">
              <a-checkbox @click="secondChannelHandle" :checked="secondChannelIsNull">二级渠道为空</a-checkbox>
              <a-checkbox @click="thirdChannelHandle" :checked="thirdChannelIsNull">三级渠道为空</a-checkbox>
            </a-col>
          </template>
        </search-com-pro>
      </a-card>
    </div>

    <div ref="elementBtn1" class="mb20">
      <perm-box perm="student:user:save_cs">
        <a-button type="primary" @click.native="handleAddIntentionStu">新增</a-button>
      </perm-box>
    </div>
    <a-card :bordered="false">
      <div class="btn-wrapper " ref="elementBtn">
        <perm-box perm="student:user:save-channel">
          <a-button @click="editChannelsHandle">
            批量修改渠道
          </a-button>
        </perm-box>
        <perm-box perm="student:user:allocate" style="margin-left: 15px;">
          <a-button @click="openTreeModal('service')">
            批量修改客服
          </a-button>
        </perm-box>
        <perm-box perm="student:user:service:down" style="margin-left: 15px;">
          <a-button @click.native="downloadStu" :loading="downloadLoading">
            下载
          </a-button>
        </perm-box>
        <!-- <perm-box perm="student:user:tag" style="margin-left: 15px;">
          <a-button @click.native="handleTags()">打标签</a-button>
        </perm-box> -->
      </div>
      <!-- :scroll="{  x: 1100 }" -->
      <div class="table-wrapper">
        <perm-box perm="student:user:service">
          <s-table
            :showSlider="true"
            :rowSelection="rowSelection"
            ref="table"
            size="default"
            :columns="columns"
            :data="loadData"
            rowKey="id"
            :scroll="{ x: 1100 }"
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
            <span slot="userName" slot-scope="text, record">
              <router-link :to="{ path: `/intentionStu/service/resourceInfo/${record.id}/${record.userDeptId}` }">{{ text || '无' }}</router-link>
              <span v-if="record.studentId"><a-tag>正</a-tag></span>
            </span>
            <span slot="userCopy" slot-scope="text, record">
              <a href="javascript:;" @click="copyByHand(record)">{{ text }}</a>
            </span>

            <!-- @click="copyByHand(record)" -->
            <span slot="createDate" slot-scope="text, record">
              <perm-box :text="record.createDate" perm="student:userlog:view">
                <a @click="openLogTime(record)">{{ text }}</a>
              </perm-box>
            </span>

            <span slot="userSource" slot-scope="text, record">
              {{ text }}
            </span>

            <span slot="userStatus" slot-scope="text, record">
              <perm-box :text="record.userStatus == 'Y' ? '正常' : '作废'" perm="intentionStu:service:orgUserName">
                <a-switch @change="typeChange($event, record)" v-model="record.userStatus == 'Y' ? true : false">
                  <a-icon type="check" slot="checkedChildren" />
                  <a-icon type="close" slot="unCheckedChildren" />
                </a-switch>
              </perm-box>
            </span>
            <span slot="action" slot-scope="text, record">
              <perm-box perm="student:user:save_cs"><a href="javascript:;" @click="handleEdit(record)">修改</a></perm-box>
              <!-- <perm-box perm="student:userlog:save"><a href="#" @click="handleFollowUp(record)">跟进</a></perm-box> -->
              <perm-box perm="student:user:del"><a href="javascript:;" @click="removeStu(record)">删除</a></perm-box>
            </span>
          </s-table>
        </perm-box>
      </div>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="800" title="摘要" :visible="isCopy" @cancel="copyModalCancel" :footer="null">
      <p>{{ copyText }}</p>
      <a href="#" @click="handleCopy()">复制</a>
    </a-modal>
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
      <AdviserAddEdit v-if="visibleAddEdit" ref="addEditCom" roleName="service" :stuId="stuId" :isOpen="visibleAddEdit"></AdviserAddEdit>
    </a-modal>

    <!-- 跟进弹出框 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="followUpTitle"
      :visible="visibleFollowUp"
      @cancel="handleFollowUpCancel"
      :width="750"
      :footer="null"
    >
      <FollowUp ref="followUp" :stuId="userId"></FollowUp>
      <a-row>
        <a-col :offset="6" :span="12">
          <div>
            <UploadSth btnText="附件上传" ref="uploadSth" :required="false" filePath="reason"></UploadSth>
          </div>
        </a-col>
        <a-col :offset="6">
          <a-button @click="handleFollowUpData" type="primary">提交</a-button>
        </a-col>
      </a-row>
      <a-divider />
      <perm-box perm="student:userlog:view">
        <div class="data-tree">
          <a-table :columns="userLogColumns" :dataSource="logTreeData" size="small" :pagination="false" rowKey="id" class="small-table">
            <span slot="attachment" slot-scope="text, record">
              <a href="javascript:;" @click="downloadAttach(record)">{{ '下载' }}</a>
            </span>
          </a-table>
        </div>
      </perm-box>
    </a-modal>

    <!-- 沟通时间轴 -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="沟通记录" :visible="visibleTree" @cancel="handleTreeCancel" :footer="null">
      <div class="data-tree">
        <a-timeline v-if="logTreeData.length > 0">
          <a-timeline-item v-for="(item, index) in logTreeData" :key="item.id">
            <a-card :bordered="false" :style="{ marginTop: '10px' }" :title="joinTitle(item)">
              <a-col :span="24">{{ item.logRemark ? item.logRemark : '(暂无)' }}</a-col>
            </a-card>
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-modal>
    <!-- 员工选择 -->
    <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getBackData"> </i-modal>
    <!-- 下载附件列表 -->
    <download-list ref="download"></download-list>
    <!-- 添加学生,修改学生modal层 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      title="批量修改渠道"
      :visible="showChannelModule"
      @ok="channelsSaveHandle"
      :confirmLoading="confirmLoading"
      @cancel="channelsDelHandle"
    >
      <a-cascader
        style="margin-left:10px; width: 200px"
        :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
        :options="channelData"
        placeholder="选择渠道"
        changeOnSelect
        @change="changeChannelHandle"
      />
    </a-modal>
    <!-- 打标签 -->
    <handleTag ref="handleTagModal" @refresh="_refreshTable"></handleTag>
  </div>
</template>
<script>
import { serviceColumns } from '@/utils/intentionStu/adviser'
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import IModal from '@/components/InnerModal/modal.vue'
import { getSchoolList } from '@/api/education/card'
import handleTag from './modules/handleTag.vue'
import {
  getServiceList,
  saveStuUsercustomers,
  saveStuUserLog,
  pageStuUsserLog,
  changeStuOrgUser,
  enableStuUser,
  removeStuUser,
  downloadStu,
  saveChannelUsers
} from '@/api/intentionStu/adviser'
import AdviserAddEdit from './modules/adviserAddEdit.vue'
import FollowUp from './modules/adviserFollowUp.vue'
import Appointment from './modules/adviserAppointment.vue'
import UploadSth from '@/components/UploadSth'
import DownloadList from '@/components/DownloadList/DownloadList.vue'
import { listChannelTree } from '@/api/common'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { stuTagNoPermissionList } from '@/api/system'
import moment from 'moment'
import { mapGetters } from "vuex"
const defaultStart = moment()
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment().format('YYYY-MM-DD')
export default {
  components: {
    DownloadList,
    UploadSth,
    STable,
    IModal,
    SearchComPro,
    Appointment,
    FollowUp,
    AdviserAddEdit,
    PermBox,
    handleTag
  },
  data() {
    return {
      stuTagList: [],
      height: 0, //滚动条高度
      confirmLoading: false,
      searchParams: [
        {
          type: 'treeSelect',
          isShow: true,
          key: 'schoolId',
          label: '分配分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
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
          key: 'spitSchoolId',
          label: '分单分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'stuUserInfo',
          label: '学员信息',
          show: true,
          placeholder: '请输入姓名/QQ号/微信号/手机号'
        },
        {
          type: 'date',
          key: 'Date',
          label: '录入时间',
          placeholder: '请选择时间',
          show: true,
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'serviceName',
          label: '客服名称',
          placeholder: '请输入客服名称',
          show: true,
          // initialValue:this.nickname()
        },
        {
          type: 'cascader',
          key: 'channel',
          label: '资源渠道',
          placeholder: '请选择资源渠道',
          show: true,
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'channelName',
          label: '运营人员',
          placeholder: '请输入运营人员'
        },
        {
          type: 'select', // 静态select框
          key: 'hasAssignment',
          label: '资源状态',
          allowClear: true,
          placeholder: '请选择资源状态',
          staticArr: [
            {
              string: '已分配',
              value: 'Y'
            },
            {
              string: '未分配',
              value: 'N'
            },
            {
              string: '已关联',
              value: 'A'
            },
            {
              string: '未报名',
              value: 'B'
            },
            {
              string: '已报名',
              value: 'C'
            }
          ]
        },
        {
          type: 'date',
          key: 'RegistrationDate',
          label: '报名日期',
          placeholder: '报名日期',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select',
          key: 'role',
          label: '录入人角色',
          placeholder: '请选择',
          initialValue: '',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '客服',
              value: 'A'
            },
            {
              string: '非客服',
              value: 'B'
            }
          ]
        }
      ],
      userLogColumns: [
        {
          title: '下次跟进时间',
          dataIndex: 'logDate',
          key: 'logDate',
          width: 120,
          customRender: (text, record) => {
            return this.$tools.tailor.getDate(text)
          }
        },
        {
          title: '跟进人',
          dataIndex: 'userName',
          key: 'userName'
        },
        {
          title: '备注',
          dataIndex: 'logRemark',
          key: 'logRemark'
        },
        {
          title: '跟进时间',
          dataIndex: 'createDate',
          key: 'createDate',
          width: 150,
          customRender: (text, record) => {
            return this.$tools.tailor.getDate(text)
          }
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          key: 'attachment',
          scopedSlots: { customRender: 'attachment' }
        }
      ],
      columns: serviceColumns,
      queryParam: {},
      loadData: parameter => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },

      // 新增,编辑数据
      stuId: '',
      userId: '',
      addEditTitle: '',
      fromDataProps: null,
      visibleAddEdit: false,
      isOpen: false,
      confirmAddEditLoading: false,

      // 跟进数据
      followUpTitle: '',
      visibleFollowUp: false,
      confirmFollowUpLoading: false,

      // 沟通时间轴
      logTreeData: [],
      visibleTree: false,

      // imodal
      userType: 'all',
      imodalId: '',
      isCopy: false,
      copyText: '',
      downloadLoading: false,
      secondChannelIsNull: false,
      thirdChannelIsNull: false,

      // 批量修改渠道
      showChannelModule: false,
      channelData: [],
      channelParams: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
    this.queryParam.startDate = defaultStart
    this.queryParam.endDate = defaultEnd
    listChannelTree().then(res => {
      // 将null转换成空数组,防报错
      this.$tools.transNullToArr(res.data)

      this.channelData = res.data
    })
    this.getStuTagList()
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'service') {
          let { endDate, startDate, stuUserInfo } = this.$route.query
          if (endDate) this.queryParam.endDate = endDate
          if (startDate) this.queryParam.startDate = startDate
          if (stuUserInfo) this.queryParam.stuUserInfo = stuUserInfo
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    },
    visibleAddEdit(nv) {
      if (nv) {
      } else {
        // 关闭窗口,reset数据
        // this.addEditTitle = ''
        // this.stuId = ''
        // this.$refs.addEditCom.resetForm()
      }
    },
    visibleFollowUp(nv) {
      if (nv) {
      } else {
        // 关闭窗口,reset数据
        this.followUpTitle = ''
        this.stuId = ''
        this.$refs.followUp.resetForm()
        this.$refs.uploadSth.reset()
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
  mounted() {},
  methods: {
    ...mapGetters(['nickname','positionName']),
    getStuTagList() {
      stuTagNoPermissionList().then(res => {
        this.stuTagList = res.data
      })
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
    handleTags(record) {
      this.examine().then(() => {
        this.$refs.handleTagModal.open(this.selectedRows)
      })
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
    secondChannelHandle(e) {
      this.secondChannelIsNull = !this.secondChannelIsNull
    },
    thirdChannelHandle(e) {
      this.thirdChannelIsNull = !this.thirdChannelIsNull
    },
    changeChannelHandle(e) {
      this.channelParams = e.join(',')
    },
    channelsSaveHandle() {
      const params = {
        stuUserIds: this.selectedRowKeys.join(','),
        channel: this.channelParams
      }
      saveChannelUsers(params).then(() => {
        this._refreshTable()
        this.$notification['success']({
          message: '系统通知',
          description: '已成功批量修改渠道'
        })
        this.showChannelModule = false
      })
    },
    channelsDelHandle() {
      this.showChannelModule = false
    },
    editChannelsHandle() {
      this.examine().then(() => {
        this.showChannelModule = true
      })
    },
    joinTitle(item) {
      return `${item.createDate}  ${item.userName}`
    },
    downloadAttach(data) {
      const { id } = data
      this.$refs.download.openInten(id)
    },
    //搜索功能
    searchSubmit(data, isReset) {
      const { secondChannelIsNull, thirdChannelIsNull } = this
      this.queryParam = Object.assign(data, { secondChannelIsNull }, { thirdChannelIsNull })
      if (isReset == 'isReset') {
        this.queryParam.startDate = defaultStart
        this.queryParam.endDate = defaultEnd
        this.queryParam.secondChannelIsNull = false
        this.queryParam.thirdChannelIsNull = false
      }
      this._refreshTable()
    },
    resetValue() {
      this.secondChannelIsNull = false
      this.thirdChannelIsNull = false
    },
    // switch 开关相关的方法
    typeChange(value, record) {
      let _this = this
      let params = {
        userStatus: value === true ? 'Y' : 'N'
      }
      if (!value) {
        this.$confirm({
          title: '系统提示',
          content: '确认禁用该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            enableStuUser(record.id, params).then(res => {
              if (res.code === 200) {
                _this._refreshTable()
              }
            })
          }
        })
      } else {
        enableStuUser(record.id, params).then(res => {
          if (res.code === 200) {
            this._refreshTable()
          }
        })
      }
    },
    // imodal 方法
    openTreeModal(type) {
      this.examine().then(() => {
        this.userType = type
        // this.imodalId = record.id
        this.$refs.modal.open()
      })
    },
    imodalOk() {},
    imodalClose() {},
    getBackData(data, type) {
      const stuUserId = this.selectedRows
        .map(item => {
          return item.id
        })
        .join(',')
      let params = {
        stuUserId,
        orgUserId: data.id
      }
      changeStuOrgUser(params)
        .then(res => {
          if (res.code === 200) {
            this._refreshTable()
            this.$notification['success']({
              message: '系统通知',
              description: '已成功修改负责人'
            })
          }
        })
        .catch(err => {})
    },

    //查看跟进记录
    openLogTime(record) {
      this.visibleTree = true
      this.logTreeData = []
      pageStuUsserLog({ page: 1, limit: 999, stuId: record.id })
        .then(res => {
          if (res.code === 200 && res.data) {
            this.logTreeData = res.data
          }
        })
        .catch(err => {})
    },
    getStuUsserLog(record) {
      const { id } = record
      return new Promise((resolve, reject) => {
        this.logTreeData = []
        pageStuUsserLog({ page: 1, limit: 999, stuId: id })
          .then(res => {
            if (res.code === 200 && res.data) {
              this.logTreeData = res.data
              resolve()
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    handleTreeCancel() {
      this.visibleTree = false
    },

    //跟进方法
    handleFollowUp(record) {
      this.visibleFollowUp = true
      this.getStuUsserLog(record).then(() => {
        this.followUpTitle = '跟进'
        this.userId = record.id
      })
    },
    handleFollowUpData() {
      this.$refs.uploadSth.handleUpload().then(res => {
        this.handleFollowUpOk(res)
      })
    },
    handleFollowUpOk(openId) {
      this.$refs.followUp
        .getFollowUpData()
        .then(res => {
          this.confirmFollowUpLoading = true
          if (openId) {
            res.attachment = openId
          }
          return saveStuUserLog(res)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '已添加新的沟通记录'
            })
            this._refreshTable()
            this.confirmFollowUpLoading = false
            this.visibleFollowUp = false
          }
        })
        .catch(err => {
          this.confirmFollowUpLoading = false
        })
    },
    handleFollowUpCancel() {
      this.visibleFollowUp = false
    },
    removeStu(data) {
      const _this = this
      const { userDeptId, id } = data
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeStuUser(userDeptId || id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        }
      })
    },
    //新增删除方法
    handleAddIntentionStu() {
      this.addEditTitle = '新增'
      this.isOpen = true
      this.stuId = null
      this.visibleAddEdit = true
    },
    handleEdit(record) {
      const { userDeptId, id } = record
      this.stuId = userDeptId || id
      this.visibleAddEdit = true
      this.addEditTitle = '修改'
    },
    handleAddEditOk() {
      let msg = ''
      this.$refs.addEditCom
        .getAddEditForm()
        .then(res => {
          this.confirmAddEditLoading = true
          msg = res.id ? '您已修改成功' : '您已经添加成功'
          return saveStuUsercustomers(res)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: msg
            })
            let positionName = this.positionName()
            if(positionName === '客服'){
              this.queryParam.serviceName = this.nickname()
              this.searchParams[4].initialValue=this.nickname()
            }
            this._refreshTable()
            this.$refs.addEditCom.resetForm()
            this.confirmAddEditLoading = false
            this.visibleAddEdit = false
          }
        })
        .catch(res => {
          this.confirmAddEditLoading = false
          // this.visibleAddEdit = false
        })
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
      this.isOpen = false
    },

    handleSearch() {},
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
    _refreshTable() {
      this.selectedRowKeys = []
      this.channelParams = []
      this.$refs.table.refresh()

    },
    downloadStu() {
      const { queryParam } = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        fields.push({ name: k, value: queryParam[k] })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}/student/user/downCsStuUser`
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

      // const {download} = this
      // this.downloadLoading = true
      // downloadStu(this.queryParam).then(blob=>download(blob,'意向学员')).finally(()=>this.downloadLoading = false)
    },
    download(blob, fileName) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = e => {
        const a = document.createElement('a')
        a.download = `${fileName}.xlsx`
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
      }
    }
  }
}
</script>
<style lang="less" scoped>
:global {
  .data-tree {
    .ant-card {
      top: -17px;
    }

    .ant-timeline {
      margin-top: 10px;
    }
  }
  .intention-service-wrapper .table-wrapper .ant-table-thead > tr > th:nth-of-type(1) {
    min-width: 30px !important;
    max-width: 30px !important;
  }
}

.intention-service-wrapper {
  .btn-wrapper {
    padding: 20px 0;
    margin-left: -5px;
  }

  // .table-wrapper {
  //   margin-top: 20px;

  //   .ant-table-thead > tr > th {
  //     min-width: 130px;
  //     max-width: 130px;

  //     &:nth-of-type(1) {
  //       min-width: 160px;
  //       max-width: 160px;
  //     }

  //     &:nth-of-type(6),
  //     &:nth-of-type(7) {
  //       min-width: 300px;
  //       max-width: 300px;
  //     }
  //   }
  // }
}

.small-table {
  .ant-table-thead > tr > th {
    min-width: 150px;
    max-width: 150px;
    width: 150px;

    &:last-child {
    }
  }
}

.course-wrapper {
}
</style>
