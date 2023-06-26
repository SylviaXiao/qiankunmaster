<template>
  <div class="resourceInfo-wrapper">
    <!-- align="top" -->
    <a-row :gutter="20" type="flex" justify="start">
      <a-col ref="infoRow" :lg="18" :md="18" :sm="24">
        <a-card :bordered="false" title="学员信息">
          <!--<span slot="extra">
            {{stuId}}
          </span>-->
          <div class="student-info-wrapper" v-if="resourceInfo">
            <h2 class="mt10">{{ resourceInfo.userName || '未知' }}</h2>
            <a-row class="infoItem" type="flex" justify="space-between" align="top">
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">联系电话/微信/QQ:</span>
                  <span class="info-item-content">
                    {{ resourceInfo.userPhone || '无' }}/{{ resourceInfo.userWechat || '无' }}/{{ resourceInfo.userQQ || '无' }}
                  </span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">性别:</span>
                  <span class="info-item-content" v-if="resourceInfo.userSex == 'A'">男</span>
                  <span class="info-item-content" v-if="resourceInfo.userSex == 'B'">女</span>
                  <span class="info-item-content" v-if="!resourceInfo.userSex">未知</span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">资源来源:</span>
                  <span class="info-item-content">{{ resourceInfo.userSource || '无' }}</span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">资源分馆:</span>
                  <span class="info-item-content">{{ resourceInfo.deptName || '无' }}</span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">资源顾问:</span>
                  <span class="info-item-content">{{ resourceInfo.adviser || '无' }}</span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">渠道来源:</span>
                  <span class="info-item-content">{{ resourceInfo.channelNames || '无' }}</span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">班型:</span>
                  <span class="info-item-content">
                    {{ resourceInfo.classTypeName && resourceInfo.classTypeName.length > 0 ? resourceInfo.classTypeName.join('/') : '无' }}
                  </span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">舞种:</span>
                  <span class="info-item-content">{{ resourceInfo.dance || '无' }}</span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">试学状态:</span>
                  <span class="info-item-content" v-if="resourceInfo.userAudition == 'Y'">已试学</span>
                  <span class="info-item-content" v-if="resourceInfo.userAudition == 'N'">已预约</span>
                  <span class="info-item-content" v-if="resourceInfo.userAudition == 'W'">未预约</span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">最后跟进:</span>
                  <span class="info-item-content">{{ resourceInfo.endDate || '无' }}</span>
                </div>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24" :xs="24">
                <div class="class-info">
                  <span class="info-item-label">下次跟进时间:</span>
                  <span class="info-item-content">{{ $tools.tailor.getDate(resourceInfo.logDate) || '无' }}</span>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
      <a-col :lg="6" :md="6" :sm="24">
        <a-card :bordered="false" title="快捷操作" style="height: 100%;">
          <div class="grid">
            <div class="grid-item" @click="handleEdit" v-if="handlePermBox('student:user:save')">
              <img :src="operationImg.editImg" />
              <span>修改信息</span>
            </div>
            <div class="grid-item" @click="handleEditCS" v-if="handlePermBox('student:user:save_cs')">
              <img :src="operationImg.editImg" />
              <span>修改[客服]</span>
            </div>
            <div class="grid-item" @click="openChoosePop" v-if="handlePermBox('education:class-url:stuUser:bind')">
              <img :src="operationImg.inviteImg" />
              <span>线上试课</span>
            </div>
            <div class="grid-item" @click="markstu" v-if="handlePermBox('student:user:markstu')">
              <img :src="operationImg.resourceImg" />
              <span>资源分单</span>
            </div>
            <div class="grid-item" @click="handleInvalid" v-if="handlePermBox('student:user:school || student:user:service')">
              <img :src="operationImg.invalidImg" />
              <span>设为无效</span>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-card :bordered="false" style="margin-top: 20px;">
      <div class="tab-wrapper">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="跟进" key="1">
            <followUpForm :resourceId="$route.params.id" @refreshTable="followUpRefreshTable" />
          </a-tab-pane>
          <a-tab-pane tab="预约" key="2" v-if="handlePermBox('student:auditionlog:view')">
            <appointmentForm :resourceInfo="resourceInfo" @refreshTable="appointmentRefreshTable" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-card :bordered="false" style="margin-top: 20px;">
      <div class="tab-wrapper">
        <a-tabs :activeKey="tabKey" @change="tabsChange">
          <a-tab-pane tab="跟进记录" :key="1">
            <s-table ref="followUpTable" :columns="followUpColumns" :data="followUpData" rowKey="id">
              <span slot="attachment" slot-scope="text, record">
                <a href="javascript:;" @click="downloadAttach(record)" v-if="record.visitType == 'N'">下载</a>
              </span>
            </s-table>
          </a-tab-pane>
          <a-tab-pane tab="预约试课记录" :key="2" v-if="handlePermBox('student:auditionlog:view')">
            <s-table ref="appointmentTable" :columns="appointmentColumns" :data="appointmentData" rowKey="auditionId">
              <span slot="action" slot-scope="text, record, index">
                <a href="javascript:;" style="padding: 0 5px;" v-if="handlePermBox('student:auditionlog:update')" @click="changeAuditionClass(record)">修改</a>
                <a href="javascript:;" style="padding: 0 5px;" @click="qrcodeHandle(record)">试课学生二维码</a>
                <a href="javascript:;" style="padding: 0 5px;" @click="cancelAppointment(record, index)">取消预约</a>
              </span>
            </s-table>
          </a-tab-pane>
          <a-tab-pane tab="线上试课" :key="3" v-if="handlePermBox('education:class-url:stuUser:bind')">
            <s-table ref="invitationCodeTable" :columns="invitationCodeColumns" :data="invitationCodeData" rowKey="cardId" :showPagination="false">
              <span slot="action" slot-scope="text, record">
                <a href="#" @click="copyClassUrlHandle(record)" v-if="record.status === 'B'">复制上课链接</a>
              </span>
            </s-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <!-- 下载附件列表 -->
    <download-list ref="download"></download-list>

    <!-- 修改信息 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      title="修改意向学员"
      :visible="visibleAddEdit"
      :confirmLoading="confirmAddEditLoading"
      @ok="handleAddEditOk"
      @cancel="handleAddEditCancel"
    >
      <AdviserAddEdit ref="addEditCom" :roleName="addEditType" :stuId="stuId" :isOpen="visibleAddEdit"></AdviserAddEdit>
    </a-modal>

    <!-- 资源分单 -->
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

    <!--试课学生二维码-->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="体验试课学生二维码"
      :width="400"
      :visible="qrcodeVisible"
      :destroyOnClose="true"
      :footer="null"
      @cancel="qrcodeCancel"
    >
      <div class="image_wrapper">
        <img :src="qrcodeUrl" style="width: 100%;" />
      </div>
    </a-modal>

    <!-- 线上邀请码选择卡种 -->
    <GetEduCard ref="cardEduModal" @getBackData="getCardBackEdu" :OnLineExperience="true" :noPrice="true"></GetEduCard>
    <!-- 修改试课班级 -->
    <ChangeAuditionClass ref="changeAuditionClass" @confirm="changeAuditionClassConfirm" />
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import editImg from '@/assets/resource/edit.png'
import listenImg from '@/assets/resource/listen.png'
import resourceImg from '@/assets/resource/resource.png'
import invalidImg from '@/assets/resource/invalid.png'
import inviteImg from '@/assets/resource/invite.png'
import { PermBox, STable, DownloadList, ChangeAuditionClass } from '@/components'
import tools from '@/tools/common.js'
import AdviserAddEdit from './adviserAddEdit.vue'
import followUpForm from './followUpForm'
import appointmentForm from './appointmentForm'
import GetEduCard from '@/components/GetEduCard/GetEduCard.vue'
import {
  getStuUserById,
  getSchoolList,
  saveStuUser,
  saveStuUsercustomers,
  operationStuUser,
  pageStuUsserLog,
  bindStuUser,
  markStuUser
} from '@/api/intentionStu/adviser'
import { pageAuditionLog } from '@/api/reception/student'
import { removeAuditionLog, removeSignAuditionLog, deleteSignAuditionLog } from '@/api/student'
import { getStuUserClassUrl } from '@/api/education/card'
import { bindColumns } from '@/utils/intentionStu/adviser'

const followUpColumns = [
  {
    title: '类型',
    dataIndex: 'visitType',
    key: 'visitType',
    width: 80,
    customRender: (text, record) => {
      return text == 'Y' ? '到访' : text == 'N' ? '跟进' : ''
    }
  },
  {
    title: '日期',
    dataIndex: 'logDate',
    key: 'logDate',
    width: 180,
    customRender: (text, record) => {
      return tools.tailor.getDate(text)
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
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 150,
    customRender: (text, record) => {
      return tools.tailor.getDate(text)
    }
  },
  {
    title: '附件',
    dataIndex: 'attachment',
    key: 'attachment',
    scopedSlots: { customRender: 'attachment' }
  }
]
const appointmentColumns = [
  {
    title: '姓名',
    key: 'stuName',
    dataIndex: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号码',
    key: 'stuPhone',
    dataIndex: 'stuPhone',
    scopedSlots: { customRender: 'stuPhone' }
  },
  {
    title: '排课',
    key: 'className',
    dataIndex: 'className',
    scopedSlots: { customRender: 'className' }
  },
  {
    title: '上课日期',
    dataIndex: 'planStartDate',
  },
  {
    title: '状态',
    key: 'signState',
    dataIndex: 'signState',
    customRender: (text, record) => {
      return text === 'Y' ? '已签到' : text === 'N' ? '未签到' : ''
    }
  },
  {
    title: '备注',
    key: 'logRemark',
    dataIndex: 'logRemark',
    scopedSlots: { customRender: 'logRemark' }
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    PermBox,
    STable,
    DownloadList,
    AdviserAddEdit,
    followUpForm,
    appointmentForm,
    GetEduCard,
    ChangeAuditionClass
  },
  data() {
    return {
      operationImg: {
        editImg,
        listenImg,
        resourceImg,
        invalidImg,
        inviteImg
      },
      id: this.$route.params.id,
      stuId: this.$route.params.stuId,
      roleName: this.$route.params.roleName,
      resourceInfo: {},
      deptList: [], // 分馆列表

      /*修改信息*/
      visibleAddEdit: false,
      addEditType: '',
      confirmAddEditLoading: false,

      /*资源分单*/
      markstuModal: false,

      /*tab列表*/
      tabKey: 1,
      followUpColumns,
      followUpData: parameter => {
        return pageStuUsserLog(Object.assign(parameter, { stuId: this.id })).then(res => {
          return res
        })
      },
      appointmentColumns,
      appointmentData: parameter => {
        if (!this.resourceInfo.userPhone) return Promise.resolve({ code: 200, count: 0, data: [] })
        return pageAuditionLog(Object.assign(parameter, { phone: this.resourceInfo.userPhone }),true).then(res => {
          return res
        })
      },
      invitationCodeColumns: bindColumns,
      invitationCodeData: parameter => {
        return getStuUserClassUrl(this.id).then(res => {
          return res
        })
      },

      qrcodeVisible: false,
      qrcodeUrl: null
    }
  },
  beforeCreate() {
    this.markstuForm = this.$form.createForm(this)
  },
  created() {
    this.getInfo()
    this.getALLDeptSchools()
    // this.$nextTick(() => {
    //   let timeout = setTimeout(() => {
    //     this.infoHeight = this.$refs.infoRow.$el.offsetHeight + 'px'
    //     clearTimeout(timeout)
    //   }, 300)
    // })
  },
  watch: {
    $route(nv) {
      if (nv.name === 'resourceInfo') {
        this.stuId = nv.params.stuId
        this.id = nv.params.id
        this.getInfo()
        this.$refs.followUpTable && this.$refs.followUpTable.refresh()
        this.$refs.appointmentTable && this.$refs.appointmentTable.refresh()
        this.$refs.invitationCodeTable && this.$refs.invitationCodeTable.refresh()
      }
    }
  },
  methods: {
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    // 获取资源详情
    getInfo() {
      getStuUserById(this.stuId).then(res => {
        if (res.code === 200 && res.data) {
          this.resourceInfo = {
            userId: res.data.user.id,
            userName: res.data.user.userName,
            userPhone: res.data.user.userPhone,
            userWechat: res.data.user.userWechat,
            userQQ: res.data.user.userQQ,
            userSex: res.data.user.userSex,
            userSource: res.data.user.userSource,
            deptName: res.data.school.deptName,
            deptId: res.data.school.id,
            classTypeName: [],
            dance: res.data?.eduDance?.name,
            endDate: res.data.user.endDate,
            userAudition: res.data.userAudition, // 试学状态 Y:已试学,N:已预约,W:未预约
            adviser: res.data.adviser, // 顾问
            adviserId: res.data.adviserId, // 顾问
            logDate: res.data.logDate, // 下次回访时间（最后跟进时间）
            channelNames: res.data.channelNames // 渠道来源
          }
          if (res.data.user.typeName) this.resourceInfo.classTypeName.push(res.data.user.typeName)
          if (res.data.user.classTypeName) this.resourceInfo.classTypeName.push(res.data.user.classTypeName)
        } else {
          this.resourceInfo = {}
        }
      })
    },
    // 查询所有分馆
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
    tabsChange(tabKey) {
      this.tabKey = tabKey
    },

    // 修改信息
    handleEdit() {
      this.addEditType = this.roleName
      this.visibleAddEdit = true
    },
    handleEditCS() {
      this.addEditType = 'service'
      this.visibleAddEdit = true
    },
    handleAddEditOk() {
      let msg = ''
      this.$refs.addEditCom
        .getAddEditForm()
        .then(res => {
          this.confirmAddEditLoading = true
          msg = res.id ? '您已修改成功' : '您已经添加成功'
          if (this.addEditType == 'service') return saveStuUsercustomers(res)
          else return saveStuUser(res)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: msg
            })
            this.getInfo()
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
    // 资源分单
    markstu() {
      this.markstuModal = true
    },
    sendMarkstu() {
      const {
        markstuForm: { validateFields }
      } = this
      validateFields((err, value) => {
        if (!err) {
          markStuUser(Object.assign(value, { stuUserId: this.id })).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.markstuModal = false
          })
        }
      })
    },
    // 设为无效
    handleInvalid() {
      this.$confirm({
        title: '系统提示',
        content: '是否将该学员设为无效',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          operationStuUser({
            id: this.id,
            userValid: 'N'
          }).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '已将该学员设为无效'
              })
              this.$router.go(-1)
            }
          })
        }
      })
    },
    // 点击线上邀请码
    openChoosePop() {
      this.$refs.cardEduModal.open()
    },
    // 选择卡种数据
    getCardBackEdu(data) {
      bindStuUser({ stuUserId: this.id, eduCardIds: data.id }).then(res => {
        if (res.code == 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.invitationCodeRefreshTable()
        }
      })
    },

    // 跟进之后刷新列表
    followUpRefreshTable() {
      this.getInfo()
      this.$refs.followUpTable && this.$refs.followUpTable.refresh()
    },
    // 跟进下载附件
    downloadAttach(data) {
      const { id } = data
      this.$refs.download.openInten(id)
    },
    // 预约之后刷新列表
    appointmentRefreshTable() {
      this.getInfo()
      this.$refs.appointmentTable && this.$refs.appointmentTable.refresh()
    },
    // 预约试课：学员二维码
    qrcodeHandle(record) {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.qrcodeUrl = process.env.VUE_APP_URL + '/student/auditionlog/qrcodeAuditionLog/' + record.auditionId + '?auth_token=' + token
      this.qrcodeVisible = true
    },
    // 预约试课：学员二维码
    qrcodeCancel() {
      this.qrcodeVisible = false
    },
    // 修改试课班级
    changeAuditionClass(record) {
      this.$refs.changeAuditionClass.open(record)
    },
    changeAuditionClassConfirm(res) {
      if (res.code == 200) {
        this.$refs.changeAuditionClass.close()
        this.$refs.appointmentTable.refresh()
      }
    },
    refreshWhenCancelAppointment() {
      this.appointmentRefreshTable()
    },
    // 取消预约
    cancelAppointment(record, index) {
      this.$confirm({
        title: '系统提示',
        content: '确定取消预约?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeAuditionLog({ auditionLogId: record.auditionId }).then(res => {
            const { data } = res
              if (data) {
                this.removeSignInLogCompletely(record)
              } else {
                this.refreshWhenCancelAppointment()
              }
          })
        }
      })
    },
    // 取消学员和导师的签到
    removeSignInLogCompletely(record) {
      const { auditionId } = record
      this.$confirm({
        title: '系统提示',
        content: '取消当前预约会同步取消该节课导师的签到记录，是否确认取消？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const params = {
            auditionLogId: auditionId
          }
          deleteSignAuditionLog(params).then(res => {
            this.refreshWhenCancelAppointment()
          })
        }
      })
    },
    // 复制上课码
    copyClassUrlHandle(record) {
      this.$tools.handleCopy(record.url)
    },
    // 线上邀请码刷新列表
    invitationCodeRefreshTable() {
      this.$refs.invitationCodeTable && this.$refs.invitationCodeTable.refresh()
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import '~@/assets/style/index';

.grid {
  display: flex;
  flex-wrap: wrap;

  > * {
    box-sizing: border-box;
    width: calc(100% / 3);
    min-width: 56px;
    padding: 10px;
  }

  .grid-item {
    display: flex;
    flex-flow: column;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;

    img {
      width: 46px;
      height: 46px;
    }

    a {
      display: inline-block;
      width: 100%;
      margin-top: 10px;
    }
  }
}

.number-ipt {
  width: 100%;
}

.resourceInfo-wrapper {
  width: 100%;
  padding-top: 20px;

  .student-info-wrapper {
    width: 100%;

    .avatar-btn {
      width: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 15px;
    }

    .name-wrapper {
      width: 100%;
      padding: 10px 45px;
      box-sizing: border-box;

      .student-name {
        font-size: 22px;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .infoItem {
    .class-info {
      margin: 10px 0;
    }

    .info-item-label {
      text-align: right;
    }

    .info-item-content {
      padding-left: 5px;
      box-sizing: border-box;
      .ellipsis();
    }
  }
}
</style>
