<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)" class="intention-adviser-wrapper">
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
      <div class="btn-wrapper" ref="elementBtn">
        <perm-box perm="student:user:log">
          <a-button @click="handleConfirmFollow($event)">批量跟进</a-button>
        </perm-box>
        <perm-box perm="student:user:master:down" style="margin-left: 15px;">
          <a-button @click.native="downloadStu" :loading="downloadLoading">
            下载
          </a-button>
        </perm-box>
        <!-- <perm-box perm="student:user:tag" style="margin-left: 15px;">
          <a-button @click.native="handleTags()">打标签</a-button>
        </perm-box> -->
      </div>

      <div class="table-wrapper">
        <perm-box perm="student:user:master">
          <s-table ref="table" :showSlider="true" :rowSelection="rowSelection" :columns="columns" :data="loadData" rowKey="id" :scroll="{ x: 1100 }">
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
              <router-link :to="{ path: `/intentionStu/adviser/resourceInfo/${record.id}/${record.userDeptId}` }">{{ text || '未知' }}</router-link>
              <span v-if="record.studentId"><a-tag>正</a-tag></span>
            </span>
            <span slot="userCopy" slot-scope="text, record">
              <a href="javascript:;" @click="copyByHand(record)">{{ text }}</a>
            </span>

            <span slot="auditionType" slot-scope="text, record">
              <perm-box
                :text="record.auditionType === 'W' ? '未预约' : record.auditionType === 'N' ? '已预约' : record.auditionType === 'Y' ? '已体验' : ''"
                perm="student:audition:view"
              >
                <a href="#" @click="handleAudition(record)">{{
                  record.auditionType === 'W' ? '未预约' : record.auditionType === 'N' ? '已预约' : record.auditionType === 'Y' ? '已体验' : ''
                }}</a>
              </perm-box>
            </span>

            <span slot="createDate" slot-scope="text, record">
              <perm-box :text="record.createDate" perm="student:userlog:view">
                <a @click="openLogTime(record)">{{ text }}</a>
              </perm-box>
            </span>

            <span slot="action" slot-scope="text, record">
              <perm-box perm="student:user:save">
                <a href="#" @click="handleEdit(record)">修改</a>
              </perm-box>
              <!-- <perm-box perm="student:audition:save">
                <a href="#" @click="handleAppointment(record)">到访/预约</a>
              </perm-box> -->
              <perm-box perm="student:user:del"><a href="javascript:;" @click="removeStu(record)">删除</a></perm-box>
              <!-- <perm-box perm="student:userlog:save">
                <a href="#" @click="handleFollowUp(record)">跟进</a>
              </perm-box> -->
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
      <AdviserAddEdit ref="addEditCom" :stuId="stuId" :is-open="visibleAddEdit"></AdviserAddEdit>
    </a-modal>
    <!-- 批量跟进 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      title="修改意向学员"
      :visible="visibleFollowUp"
      :footer="null"
      @cancel="handleFollowUpCancel"
    >
      <followUpForm :resourceId="userId" @refreshTable="followUpRefreshTable" :showAll="false" />
    </a-modal>
    <!-- 跟进弹出框 -->
    <!-- <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="followUpTitle"
      :visible="visibleFollowUp"
      :width="750"
      :footer="null"
      @cancel="handleFollowUpCancel"
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
    </a-modal> -->

    <!-- 预约体验弹出框 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="到访/预约"
      :visible="visibleAppointment"
      :width="850"
      :footer="null"
      @cancel="handleAppointmentCancel"
    >
      <Appointment ref="appointment" :userId="userId" :initAppointment="initAppointment"></Appointment>
      <a-row>
        <a-col :offset="6">
          <a-button @click="handleAppointmentOk" type="primary">提交</a-button>
        </a-col>
      </a-row>
      <a-divider />
      <perm-box perm="student:audition:view">
        <a-table :columns="userColumns" :dataSource="auditionList" size="small" :pagination="false" rowKey="auditionId" class="small-table">
          <span slot="action" slot-scope="text, record">
            <span v-if="record.auditionType == 'B'">
              <perm-box perm="student:audition:status">
                <a href="javascript:;" v-if="record.auditionStatus == 'N'" @click="changeAudition(record)">确认体验</a>
              </perm-box>
              <span v-if="record.auditionStatus != 'N'">已体验</span>
            </span>
          </span>
        </a-table>
      </perm-box>
    </a-modal>

    <!-- 修改预约状态 -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="auditionTitle" :visible="visibleAudition" :footer="null" @cancel="handleAuditionCancel">
      <Audition @refresh="_refreshTable" ref="audition" :stuObj="stuObj"></Audition>
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
    <!-- 下载附件列表 -->
    <download-list ref="download"></download-list>
    <!-- 打标签 -->
    <handleTag ref="handleTagModal" @refresh="_refreshTable"></handleTag>
  </div>
</template>
<script>
import { stuTagNoPermissionList } from '@/api/system'
import handleTag from './modules/handleTag.vue'
import { batchStuUserLog, removeStuUser } from '@/api/intentionStu/adviser'
import { listEduType, treeEduClassType } from '@/api/common'
import { getSchoolList } from '@/api/education/card'
import { adviserColumns } from '@/utils/intentionStu/adviser'
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { getStuTableList, saveStuUser, saveStuUserLog, saveTryStuUser, pageStuUsserLog, listStuAudition, enableStuAudition } from '@/api/intentionStu/adviser'
import AdviserAddEdit from './modules/adviserAddEdit.vue'
import FollowUp from './modules/adviserFollowUp.vue'
import Appointment from './modules/adviserAppointment.vue'
import Audition from './modules/adviserAudition.vue'
import UploadSth from '@/components/UploadSth'
import followUpForm from './modules/followUpForm'
import DownloadList from '@/components/DownloadList/DownloadList.vue'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  components: {
    DownloadList,
    UploadSth,
    SearchComPro,
    Audition,
    Appointment,
    FollowUp,
    AdviserAddEdit,
    PermBox,
    STable,
    followUpForm,
    handleTag
  },
  data() {
    return {
      stuTagList: [],
      height: 0, //滚动条高度
      //多选
      selectedRowKeys: [],
      downloadLoading: false,
      selectedRows: [],
      userLogColumns: [
        {
          title: '下次跟进时间',
          dataIndex: 'logDate',
          key: 'logDate',
          width: 150,
          customRender: (text, record) => {
            let newText = this.$tools.tailor.getDate(text)
            return newText
          }
        },
        {
          title: '跟进人',
          dataIndex: 'userName',
          key: 'userName',
          width: 120
        },

        {
          title: '备注',
          dataIndex: 'logRemark',
          key: 'logRemark'
        },
        {
          title: '操作时间',
          dataIndex: 'createDate',
          key: 'createDate',
          width: 150,
          customRender: (text, record) => {
            let newText = this.$tools.tailor.getDate(text)
            return newText
          }
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          key: 'attachment',
          scopedSlots: { customRender: 'attachment' }
        }
      ],
      userColumns: [
        {
          title: '时间',
          dataIndex: 'auditionDate',
          key: 'auditionDate',
          width: 150,
          customRender: (text, record) => {
            let newText = this.$tools.tailor.getDate(text)
            return newText
          }
        },
        {
          title: '类型',
          dataIndex: 'auditionType',
          key: 'auditionType',
          width: 100,
          customRender: (text, record) => {
            return text == 'A' ? '到访' : '预约'
          }
        },
        {
          title: '操作人',
          width: 120,
          dataIndex: 'orgUserName',
          key: 'orgUserName'
        },
        {
          title: '备注',
          width: 100,
          dataIndex: 'auditionRemark',
          key: 'auditionRemark'
        },
        {
          title: '操作',
          width: 100,
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
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: false,
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
          show: true,
          label: '录入时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'date',
          key: 'RegistrationDate',
          label: '报名日期',
          placeholder: '报名日期',
          format: 'YYYY-MM-DD'
        }
        // {
        //   type: 'cascader',
        //   key: 'classTypeId',
        //   label: '班型',
        //   placeholder: '请选择班型',
        //   treeOps: {
        //     api: treeEduClassType,
        //     type: 'D',
        //     label: 'name',
        //     value: 'id',
        //     children: 'children'
        //   }
        // }
      ],
      columns: adviserColumns,
      queryParam: {},
      loadData: parameter => {
        return getStuTableList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },

      // 新增,编辑数据
      stuId: '',
      userId: '',
      addEditTitle: '',
      fromDataProps: null,
      visibleAddEdit: false,
      confirmAddEditLoading: false,

      // 跟进数据
      followUpTitle: '',
      visibleFollowUp: false,
      confirmFollowUpLoading: false,

      // 预约体验
      appointmentTitle: '',
      visibleAppointment: false,
      confirmAppointmentLoading: false,
      initAppointment: false,
      auditionList: [],
      // 沟通时间轴
      logTreeData: [],
      visibleTree: false,

      // 修改预约状态
      stuObj: null,
      auditionTitle: '',
      visibleAudition: false,
      //copy
      isCopy: false,
      copyText: ''
    }
  },
  computed: {
    rowSelection() {
      let flag = this.$tools.checkPerm('student:user:log')
      if (flag) {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
          }
        }
      } else {
        return null
      }
    }
  },
  watch: {
    visibleAddEdit(nv) {
      if (nv) {
      } else {
        // 关闭窗口,reset数据
        this.addEditTitle = ''
        this.stuId = ''
        this.$refs.addEditCom.resetForm()
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
    },
    visibleAppointment(nv) {
      if (nv) {
      } else {
        // 关闭窗口,reset数据
        this.appointmentTitle = ''
        this.stuId = ''
        this.$refs.appointment.resetForm()
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
  created() {
    this.isSchoolId()
    this.getStuTagList()
  },
  mounted() {},
  methods: {
    handleTags(record) {
      this.examine().then(() => {
        this.$refs.handleTagModal.open(this.selectedRows)
      })
    },
    formatTags(tags) {
      if (tags) {
        let tag = tags ? tags.split(',') : ''
        let tagList = []
        this.stuTagList.forEach(item => {
          // let list = item.tagList.filter(col => {
          //   return tag.includes(col.id)
          // })
          // if (Array.isArray(list) && list.length > 0) {
          if (tag.includes(item.id)) {
            tagList.push({
              tagName: item.tagName,
              // tagList: list,
              id: item.id
            })
          }
          // }
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
      if (userSchoolId) {
        this.searchParams.forEach((item, index) => {
          if (item.key == 'schoolId') {
            this.searchParams.splice(index, 1)
          }
        })
      }
    },
    removeStu(data) {
      const _this = this
      const { userDeptId } = data
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeStuUser(userDeptId).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        }
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
    handleConfirmFollow() {
      let _this = this
      this.examine().then(() => {
        let params = {
          stuUserIds: _this.selectedRowKeys.join(',')
        }

        _this.visibleFollowUp = true
        _this.userId = _this.selectedRowKeys.join(',')
        // this.$confirm({
        //   title: '系统提示',
        //   content: '确实要批量操作吗?',
        //   okText: '确认',
        //   cancelText: '取消',
        //   onOk() {
        //     batchStuUserLog(params)
        //       .then(res => {
        //         if (res.code === 200) {
        //           _this.$notification['success']({
        //             message: '系统通知',
        //             description: '已成功批量跟进选中学员'
        //           })
        //         }
        //       })
        //       .then(() => {
        //         _this.selectedRowKeys = []
        //         _this._refreshTable()
        //       })
        //   },
        //   onCancel() {}
        // })
      })
    },
    downloadAttach(data) {
      const { id } = data
      this.$refs.download.openInten(id)
    },

    //确认到访
    changeAudition(record) {
      enableStuAudition(record.auditionId, { status: 'Y' }).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '已成功修改状态'
        })
        this.getAuditionList(record)
      })
    },
    toStuApply(data) {
      this.$router.push({ path: '/reception/stuApply', query: { stuId: data.id } })
    },
    joinTitle(item) {
      return `${item.createDate}  ${item.userName}`
    },

    //搜索功能
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
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

    //沟通时间轴
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
    handleTreeCancel() {
      this.visibleTree = false
    },
    //预约体验方法
    handleAppointment(record) {
      this.visibleAppointment = true
      this.appointmentTitle = '预约体验'
      this.userId = record.id
      if (this.handlePermBox('student:audition:view')) {
        this.getAuditionList(record)
      }
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
              description: '已预约成功'
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

    //跟进方法
    handleFollowUp(record) {
      this.visibleFollowUp = true
      if (this.handlePermBox('student:userlog:view')) {
        this.getStuUsserLog(record).then(() => {
          this.followUpTitle = '跟进'
          this.userId = record.id
        })
      }
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
    // 跟进之后刷新列表
    followUpRefreshTable() {
      this._refreshTable()
      this.visibleFollowUp = false
    },
    //新增删除方法
    handleAddIntentionStu() {
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

    handleSearch() {},
    copyModalCancel() {
      this.isCopy = false
    },
    copyByHand(data) {
      this.isCopy = true
      const { userPhone, userQQ, userWechat, userArea, danceName, typeName, userRemark, userAge, dancePurpose, learningDanceTime, likeDanceType } = data
      let text = `手机号码:${userPhone == null ? '' : userPhone}，QQ号:${userQQ == null ? '' : userQQ}，微信号:${userWechat == null ? '' : userWechat}，省市:${
        userArea == null ? '' : userArea
      }，舞种:${danceName == null ? '' : danceName}，类型:${typeName == null ? '不限' : typeName}，客户年龄:${userAge == null ? '' : userAge}，学舞目的:${
        dancePurpose == null ? '' : dancePurpose
      }，学舞时间:${learningDanceTime == null ? '' : learningDanceTime}，舞蹈类型:${likeDanceType == null ? '' : likeDanceType}，备注:${
        userRemark == null ? '' : userRemark
      }`
      this.copyText = text
    },
    handleCopy(data) {
      const {
        $tools: { handleCopy },
        copyText
      } = this
      handleCopy(copyText)
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    _refreshTable() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.refresh()
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
      form.action = `${process.env.VUE_APP_URL}/student/user/downAdviserStuUser`
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
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

:global {
  .data-tree {
    .ant-card {
      top: -17px;
    }

    .ant-timeline {
      margin-top: 10px;
    }
  }
}

.intention-adviser-wrapper {
  .search-wrapper {
  }

  .btn-wrapper {
    padding: 20px;
    margin-left: -5px;
  }

  .table-wrapper {
  }
}
</style>
