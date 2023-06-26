<template>
  <div class="studentinfo-wrapper">
    <div class="mb20">
      <a-button @click="handleReset()">重置查询</a-button>
    </div>
    <a-table ref="table" :pagination="false" :columns="columns" :rowKey="record => record.id" :dataSource="dataSource" :loading="loading">
      <div slot="availableCount" slot-scope="text, record">
        <template v-if="!record.usedCount">
          <span :style="{ padding: '0px 5px' }">{{ record.usedCount }}</span>
        </template>
        <template v-else>
          <perm-box perm="student:signinlog:view" :text="`${record.usedCount}`">
            <a href="#" @click="openSignInLog(record)">{{ record.usedCount }}</a>
          </perm-box>
        </template>
        <span>/</span>
        <perm-box perm="student:card:changenum" :text="_handleUsedCount(record)">
          <a href="#" @click="onEditStuCardCount(record)" v-if="record.status !== 'D'">{{ record.totalCount === 0 ? '不限' : record.totalCount }}</a>
          <span v-else>{{ record.totalCount === 0 ? '不限' : record.totalCount }}</span>
        </perm-box>
      </div>
      <span slot="stuCardNo" slot-scope="text, record">
        <!--<a-popover title="卡备注信息">
          <template slot="content">
            <div>{{ record.remark || '无' }}</div>
          </template>
          <a-icon type="qrcode" @click="qrcodeHandle(record)" style="margin-left: 8px;" />
          {{ text }}
        </a-popover>-->
        <a-icon
          v-if="handlePermBox('student:card:jy_remark') && record.cardRemarkNum && record.cardRemarkNum > 0&&record.stuCardRemarks==='A'"
          type="info-circle"
          style="color:red;margin-right: 2px;"
        />
        <a @click="handleHoverChange(record, 1)">{{ text }}</a>
        <template v-if="record.isStuCardNextLog">
          <a-icon type="link" title="续卡" />
        </template>
      </span>
      <span slot="cardName" slot-scope="text, record">
        <perm-box perm="student:card:view" :text="text">
          <a href="javascript:;" @click="cardLogOpen(record)">{{ text }}</a>
        </perm-box>
      </span>
      <span slot="className" slot-scope="text, record">
        <perm-box :text="record.stuName" perm="education:class:view">
          <router-link
            :to="record.typeId === 'C' ? { path: `/reception/personal/classInfo/${record.classId}` } : { path: `/reception/class/classInfo/${record.classId}` }"
            >{{ record.className }}</router-link
          >
        </perm-box>
      </span>
      <span slot="createDate" slot-scope="text, record">
        <perm-box :text="handleDateC(text)" perm="student:card:modifytime">
          <a href="#" @click="changeEndData($event, record)">{{ handleDateC(text) }}</a>
          <a-icon  style="color:red;" type="info-circle" @click="showStuCardModifyRecord(record)" />
        </perm-box>
      </span>
      <span slot="startDate" slot-scope="text">
        {{ handleDateC(text) }}
      </span>
      <span slot="endDate" slot-scope="text">
        {{ handleEndDate(text) }}
      </span>
      <span slot="totalPrice" slot-scope="text, record">
        {{ record.paidPrice | fixTofloat }}/{{ record.totalPrice | fixTofloat }}/{{ record.originalPrice | fixTofloat }}
      </span>
      <span slot="payoff" slot-scope="text, record">
        <template v-if="text"
          >结清 {{ record.payDate ? moment(record.payDate).format('YYYY-MM-DD') : '' }}</template
        >
        <template v-else-if="record.status === 'D' || record.status === 'E' || record.status === 'F'"
          >-</template
        >
        <template v-else>
          <span style="color:red">{{ (record.paidPrice - record.totalPrice) | fixTofloat }}</span>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <perm-box perm="student:card:update_admin">
          <a href="#" @click="openEditModal(record)">修改</a>
        </perm-box>
        <perm-box perm="student:card:active" v-if="record.status === 'E'">
          <a href="#" @click="activeCardBtn(record)">激活</a>
        </perm-box>
        <perm-box perm="student:cardnextlog:save" v-if="record.isStuCardNextLog == true && record.isShowNextCard !== true">
          <a href="javascript:;" @click="edit(record)">续卡确认</a>
        </perm-box>
        <perm-box perm="student:info:cardchange" v-if="record.status === 'A' || record.status === 'B' || record.status === 'C'">
          <router-link :to="{ path: '/reception/carryOver', query: { stuId: record.stuId } }">结转</router-link>
        </perm-box>
        <perm-box perm="student:card:refund-all" v-if="record.status === 'A' || record.status === 'B' || record.status === 'C'">
          <a href="#" @click="openAllDrawbackModal(record)">退卡</a>
        </perm-box>
        <span v-else>
          <perm-box perm="student:card:change-class" v-if="(record.classId && record.status === 'A') || record.status === 'B' || record.status === 'C'">
            <a href="#" @click="openDrawbackModal(record, 'returnInClass')">转班</a>
          </perm-box>
        </span>
        <perm-box perm="student:info:paid">
          <router-link
            :to="{ path: `/reception/stuPayment/${record.id}_${record.stuId}` }"
            v-if="!record.payoff && (record.status === 'A' || record.status === 'B')"
            >补缴</router-link
          >
        </perm-box>
        <perm-box perm="student:card:showHide">
          <a-popconfirm :title="`确定要${record.showHide ? '解冻' : '冻结'}吗`" @confirm="handleCardFreezeChange(record)">
            <a>{{record.showHide ? '解冻' : '冻结'}}</a>
          </a-popconfirm>
                  <a-popover title="" v-if="!record.showHide">
                    <template slot="content">
                      <p>冻结仅将此卡针对学员隐藏，不展示</p>
                    </template>
                      <span style="cursor: pointer"><a-icon type="question-circle" /></span>
                  </a-popover>
        </perm-box>
        <perm-box perm="student:card:del">
          <a href="#" @click="delCardBtn(record)">删除</a>
        </perm-box>
      </span>
      <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#1ba97b' : undefined }" />
      <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="column_search_wrap">
        <template v-if="column.dataIndex === 'status'">
          <a-checkbox-group
            :value="selectedKeys&&selectedKeys[0]"
            :default-value="queryParam.cardStatus.split(',')"
            @change="e => setSelectedKeys(e&&e.length>0 ? [e] : [])"
          >
            <a-checkbox
              class="column_search_checkbox"
              v-for="(option, optioni) in statusOptions"
              :key="optioni"
              :value="option.value"
              :checked="queryParam.cardStatus.includes(option.value)"
            >
              {{ option.label }}
            </a-checkbox>
          </a-checkbox-group>
        </template>
        <span class="between mt10">
          <a-button type="primary" size="small" @click="() => handleSearch(clearFilters, selectedKeys[0], confirm, column.dataIndex)">
            搜索
          </a-button>
          <a-button size="small" @click="() => handleReset(clearFilters, setSelectedKeys, column.dataIndex)">
            重置
          </a-button>
        </span>
      </div>
    </a-table>
    <SignInRecord :card="recordInfo" ref="signInRecord"></SignInRecord>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="titleChangeClass"
      :visible="visibleClass"
      @ok="submitChangeClass"
      :confirmLoading="confirmChangeLoading"
      @cancel="handleClassCancel"
    >
      <a-form :form="form">
        <a-form-item v-bind="defaultLayout" label="班级名称" v-if="modalType === 'change'">
          <a-select :allowClear="true" v-decorator="['classId']" placeholder="请选择班级">
            <a-select-option :allowClear="true" v-for="(item, index) in classIdArr" :key="index" :value="item.classId">
              {{ item.className }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :style="{ marginBottom: '0px' }" v-bind="defaultLayout" label="卡余额">
          <p>{{ stuInfo.paidPrice }}</p>
        </a-form-item>
        <a-form-item v-bind="defaultLayout" label="扣除金额">
          <a-input
            @change="handlePriceChange"
            placeholder="请输入金额"
            v-decorator="[
              'price',
              {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    type: 'number',
                    transform(value) {
                      if (value) {
                        return Number(value)
                      }
                    },
                    message: '请输入正确的金额'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item :style="{ marginBottom: '5px' }" v-bind="defaultLayout" label="剩余余额">
          <p>{{ banlance === 'init' ? stuInfo.paidPrice : banlance }}</p>
        </a-form-item>
        <a-form-item v-bind="defaultLayout" label="备注">
          <a-textarea
            style="width: 100%;"
            placeholder="请输入备注信息"
            :rows="4"
            v-decorator="['logRemark', { rules: [{ required: true, message: '请输入备注信息' }] }]"
          />
        </a-form-item>
        <a-row>
          <a-col :offset="8" :span="12">
            <div>
              <UploadSth btnText="附件上传" ref="uploadSth" :required="true" filePath="reason"></UploadSth>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <StudentInfoDrawback ref="drawback" @refund="_refreshTable" :record="drawbackRecord" :type="drawbackType" />
    <StudentCardDrawback ref="alldrawbackForm" @refund="_refreshTable" :record="drawbackRecord" :staffStateOptions="staffStateOptions"></StudentCardDrawback>

    <!-- 老师选择组件 -->
    <!-- <choose-tea ref="choosetea" :multiple="true" teaFields="teacher" @getBackData="getTeaData" :checkType="true"> </choose-tea>
        </a-form-model>
      </a-spin>
    </a-modal> -->
    <StuCardEndDate ref="cardEndDate" @refresh="_refreshTable" :record="recordInfo"></StuCardEndDate>
    <StuCardEditCardCount ref="stuCardEditCardCount" @refresh="_refreshTable" :record="recordInfo"></StuCardEditCardCount>
    <!-- 缴费轨迹 -->
    <PaymentTrack ref="paymentTrack" />
    <CardLog ref="cardLog" />
    <!-- 修改 -->
    <StudentInfoEdit ref="editRecord" @refund="_refreshTable" :record="editRecord" />

    <a-modal :destroyOnClose="true" :width="600" title="备注" :footer="null" v-model="remarkInfoVisual">
      <div>
        <div class="mb20" style="display: flex; align-items: center; justify-content: space-between;">
          <div>卡备注信息：{{ remarkInfoMation.remark || '无' }}</div>
          <a-button type="primary" @click="editRemark()">新增</a-button>
        </div>
        <table>
          <tr>
            <td>添加时间</td>
            <td>类型</td>
            <td>备注</td>
            <td>操作</td>
          </tr>
          <template v-if="remarkList.length">
            <tr v-for="(item, index) in remarkList" :key="index">
              <td>{{ item.updateDate }}</td>
              <td>{{ item.remarkType === 'B' ? '教研' : '前台' }}</td>
              <td>{{ item.stuCardRemark }}</td>
              <td>
                <a href="#" @click="editRemark(item)">修改 </a>
                <perm-box perm="student:card:del-remark">
                  <a href="#" @click="deleteRemark(item)">删除</a>
                </perm-box>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </a-modal>
    <editContinuedCard @editSubmit="editSubmit" ref="editContinuedCard"></editContinuedCard>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="600"
      title="备注"
      @ok="remarkSubmit"
      @cancel="remarkCancel"
      :zIndex="9999999"
      v-model="remarkPop"
    >
      <div style="display:flex;align-items:center;margin-bottom: 10px;">
        类型：
        <a-radio-group v-model="remarkType" :disabled="remarkTitle == '修改备注'">
          <a-radio value="A">前台</a-radio>
          <a-radio value="B">教研</a-radio>
        </a-radio-group>
      </div>
      <div style="display:flex;align-items:center;">
        {{ remarkTitle }}：
        <a-textarea v-model="remarks" style="width:80%;" :auto-size="{ minRows: 3, maxRows: 5 }" />
      </div>
    </a-modal>
    <StuCardActive ref="cardActive" @refresh="_refreshTable" :record="recordInfo"></StuCardActive>
    <StuCardModifyRecord ref="stuCardModifyRecord" :cardId="stuCardModifyRecordId" />
  </div>
</template>
<script>
import Vue from 'vue'
import moment from 'moment'
import StuCardModifyRecord from './stuCardModifyRecord.vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { PermBox, SignInRecord, UploadSth, ChooseTea, CardLog } from '@/components'
import StuCardEditCardCount from './StuCardEditCardCount.vue'
import StuCardEndDate from './StuCardEndDate.vue'
import PaymentTrack from './PaymentTrack.vue'
import { cardColumns } from '@/utils/reception/student'
import { listStudentCard, listStuCardNextLog, confirmStuCardNextLog } from '@/api/reception/student'
import { removeStudentCard, getStuCardInfo, changeCardFreeze } from '@/api/recep'
import { refundClassStatus } from '@/api/education'
import { insertRemark, allCardRemark, deleteRemark, updateRemark } from '@/api/student'
import StudentInfoDrawback from '@/views/reception/modules/StudentInfoDrawback'
import StudentCardDrawback from '@/views/reception/modules/StudentCardDrawback'
import StudentInfoEdit from '@/views/reception/modules/StudentInfoEdit'
import StuCardActive from './StuCardActive.vue'
import { mixin } from '@/utils/mixin'
import { listSysValConf } from '@/api/common'
import editContinuedCard from '../../education/continue/editContinuedCard.vue'

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
const statusOptions = [
  { value: 'A', label: '未使用' },
  { value: 'B', label: '使用中' },
  { value: 'C', label: '停课' },
  { value: 'D', label: '退卡' },
  { value: 'E', label: '结业' },
  { value: 'F', label: '撤销' },
  { value: 'G', label: '结转' }
]

export default {
  data() {
    let queryParam = Vue.ls.get(`STUDENT_INFO_CARD_LIST_PARAM`)
    queryParam = queryParam ? JSON.parse(queryParam) : {}
    if (!queryParam.cardStatus) queryParam.cardStatus = 'A,B,C,D'
    return {
      moment,
      //学员卡相关日期修改存储日志
      stuCardModifyRecordId: '',
      //续卡分类名称
      sysValConfName: '',
      cardNextList: [], //续卡分类
      editRecord: {}, //编辑信息
      columns: cardColumns,
      dataSource: null,
      loading: false,
      recordInfo: {},
      queryParam,
      clearFilters: undefined,
      statusOptions,
      //
      defaultLayout,
      titleChangeClass: '',
      confirmChangeLoading: false,
      modalType: '',
      banlance: 'init',
      stuInfo: {},
      visibleClass: false,
      drawbackRecord: {},
      drawbackType: 'returnInClass',

      stuCardInfo: {},
      spinning: false,
      rules: {
        toIssueCard: [{ required: true, message: '请选择往期卡种', trigger: 'change' }],
        cardType: [{ required: true, message: '请选择续卡类型', trigger: 'change' }],
        cardTea: [{ required: true, message: '请选择续卡老师', trigger: 'change' }],
        sysValConfId: [{ required: true, message: '请选择续卡分类', trigger: 'change' }],
        price: [{ required: true, message: '请输入金额', trigger: 'blur' }]
      },
      editVisible: false, //修改弹窗
      form: {
        toIssueCard: '',
        cardType: '',
        cardTea: '',
        teacherIds: [],
        cardId: null,
        sysValConfId: ''
      },
      cardsType: [{ id: 'A', name: '本期续卡' }, { id: 'B', name: '往期续卡' }], //续卡类型下拉
      cardsTypeChild: [{ id: 'A', name: '到期续卡' }, { id: 'B', name: '未到期续卡' }, { id: 'C', name: '延期续卡' }], //续卡类型下拉
      issueCards: [], //往期卡种下拉
      cardNextLogId: null,
      cardName: null,

      remarkInfoMation: {},
      remarkInfoVisual: false,
      remarkPop: false,
      remarkTitle: '',
      remarkType: 'A',
      remarks: '',
      remarkList: [],
      cardId: null,
      staffStateOptions: [{ value: 'Y', label: '在职' }, { value: 'B', label: '离职（3个月内）' }]
    }
  },
  mixins: [mixin],
  props: {
    stuId: String
  },
  watch: {
    stuId(nv) {
      console.log(nv)
      if (nv) {
        // 拿到studentId以后请求数据渲染列表

        this.loadListData(nv)
      }
    },
    visibleClass(nv) {
      if (nv) {
        this.$nextTick(() => {
          this.form.resetFields()
          this.classIdArr = []
          this.$refs.uploadSth.reset()
          this.banlance = 'init'
        })
      } else {
      }
    }
  },
  mounted() {
    console.log(this.stuId)
    if (this.stuId) {
      this.loadListData(this.stuId)
    }
  },
  components: {
    StuCardModifyRecord,
    editContinuedCard,
    StuCardActive,
    StudentInfoEdit,
    SignInRecord,
    PermBox,
    UploadSth,
    StudentInfoDrawback,
    StudentCardDrawback,
    ChooseTea,
    StuCardEndDate,
    StuCardEditCardCount,
    PaymentTrack,
    CardLog
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    showStuCardModifyRecord(record) {
      this.stuCardModifyRecordId = record.id
      this.$nextTick(() => {
        this.$refs.stuCardModifyRecord.open(record.id)
      })
    },
    sysValConfIdChange(e) {
      this.sysValConfName = this.cardNextList.filter(item => item.id == e)[0]?.name
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    //激活按钮
    activeCardBtn(record) {
      this.recordInfo = record
      this.$refs.cardActive.openModal()
    },
    changeEndData(e, record) {
      this.recordInfo = record
      this.$refs.cardEndDate.openModal()
      this.$refs.cardEndDate.resetForm()
      this.$nextTick(() => {
        this.$refs.cardEndDate.backingData(record)
      })
    },
    onEditStuCardCount(record) {
      this.recordInfo = record
      this.$refs.stuCardEditCardCount.open()
      this.$refs.stuCardEditCardCount.backindData(record)
    },
    _handleUsedCount(record) {
      return `${record.totalCount === 0 ? '不限' : record.totalCount}`
    },
    openChooseTea() {
      this.$refs.choosetea.open()
    },
    //重置修改弹窗
    editreset() {
      Object.keys(this.form).forEach(item => {
        this.form[item] = ''
      })
    },
    editCancel() {
      this.editVisible = false
      this.editreset()
    },
    editSubmit() {
      this._refreshTable()
      // let params = {
      //   cardNextLogId: this.cardNextLogId,
      //   cardLastId: this.form.toIssueCard,
      //   cardType: this.form.cardType,
      //   teacherIds: this.form.teacherIds.join(','),
      //   sysValConfId: this.form.sysValConfId
      // }
      // this.loading = true
      // confirmStuCardNextLog(params)
      //   .then(res => {
      //     this.editCancel()
      //     this._refreshTable()
      //     this.$notification['success']({
      //       message: '系统通知',
      //       description: '操作成功'
      //     })
      //   })
      //   .finally((this.loading = false))
    },
    getTeaData(data) {
      this.form.cardTea = data
        .map(item => {
          return item.teacherName
        })
        .join('、')
      this.form.teacherIds = data.map(item => {
        return item.teacherId
      })
    },
    async edit(record) {
      this.$refs.editContinuedCard.open(record, false, 'confirm')
      // this.cardNextLogId = record.cardNextLogId
      // this.cardName = record.cardName
      // this.form.cardType = record.ctype
      // this.form.toIssueCard = record.lastCardId
      // this.form.sysValConfId = record.sysValConfId || ''
      // if (this.form.sysValConfId) this.sysValConfIdChange(this.form.sysValConfId)
      // this.form.cardTea = record.teacher
      //   .map(item => {
      //     return item.teacherName
      //   })
      //   .join(',')
      // this.form.teacherIds = record.teacher.map(item => {
      //   return item.teacherId
      // })
      // this.editVisible = true
      // this.spinning = true
      // const res = await listStuCardNextLog({ cardId: record.id, stuId: record.stuId })
      // if (res.code == 200) {
      //   this.issueCards = res.data.map(item => {
      //     if (item.endDate) {
      //       let date = item.endDate.split(' ')[0]
      //       item.cardMsg = `${item.stuCardNo}${item.cardName}(${date})`
      //     } else {
      //       item.cardMsg = `${item.stuCardNo}${item.cardName}`
      //     }
      //     return item
      //   })
      // }
      // const res1 = await listSysValConf('cardNext')
      // if (res1.code == 200) {
      //   this.cardNextList = res1.data || []
      // }
      // this.spinning = false
    },
    getStuCardInfo(id) {
      return getStuCardInfo(id).then(res => {
        this.stuCardInfo = res.data
      })
    },
    openDrawbackModal(record, type) {
      this.drawbackRecord = record
      this.drawbackType = type
      this.$refs.drawback.showModal()
    },
    openEditModal(record) {
      this.editRecord = record
      this.$refs.editRecord.showModal()
    },
    openAllDrawbackModal(record) {
      this.drawbackRecord = record
      this.$refs.alldrawbackForm.showModal()
    },

    //删除按钮
    delCardBtn(record) {
      let _this = this
      let cardId = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeStudentCard(cardId).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        }
      })
    },
    handlePriceChange() {
      this.$nextTick(() => {
        if (this.stuInfo.paidPrice >= this.form.getFieldValue('price')) {
          this.banlance = this.stuInfo.paidPrice - this.form.getFieldValue('price')
        } else {
          this.$notification['error']({
            message: '系统通知',
            description: '扣除余额不能大于卡余额'
          })
        }
      })
    },
    changeClassBtn(e, record, type) {
      this.modalType = type
      this.visibleClass = true
      this.stuInfo = record
      if (type === 'remove') {
        this.titleChangeClass = '退班管理'
      }
    },
    handleCardFreezeChange(record) {
      const { showHide, id } = record
      changeCardFreeze({studentCardId: id, showHide: !showHide}).then(res => {
        this._refreshTable()
      })
    },
    submitChangeClass() {
      let _this = this
      if (this.modalType === 'remove') {
        this.form.validateFields().then(() => {
          this.$confirm({
            title: '系统提示',
            content: '确认退班吗?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              _this.confirmChangeLoading = true
              _this.$refs.uploadSth
                .handleUpload()
                .then(res => {
                  _this.fileId = res
                  _this.removeClassApi()
                })
                .catch(err => {
                  console.log(err)
                  _this.confirmChangeLoading = false
                })
            },
            onCancel() {}
          })
        })
      }
    },
    removeClassApi() {
      let formData = this.form.getFieldsValue()
      let stuCardId = this.stuInfo.id
      let params = {
        price: formData.price,
        logRemark: formData.logRemark,
        attachment: this.fileId
      }
      this.confirmChangeLoading = true
      refundClassStatus(stuCardId, params)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '已退班成功'
            })
            this._refreshTable()
            this.visibleClass = false
          }
        })
        .catch(err => {
          console.log(err, 'changeClassApi')
        })
        .finally(() => {
          this.confirmChangeLoading = false
        })
    },
    handleClassCancel() {
      this.visibleClass = false
      this.visibleReClass = false
    },

    //沟通时间轴
    openSignInLog(record) {
      this.recordInfo = record
      this.$refs.signInRecord.openSignInLog(record)
    },

    handleDateC(text) {
      return this.$tools.tailor.getDate(text)
    },
    handleEndDate(data) {
      return data
        ? moment(data)
            .subtract(1, 'seconds')
            .format('YYYY-MM-DD HH:mm')
        : ''
    },
    //加载列表数据
    loadListData() {
      this.loading = true

      listStudentCard(Object.assign({ studentId: this.stuId }, this.queryParam))
        .then(res => {
          this.dataSource = res.data || []
          this.loading = false
        })
        .catch(err => {
          console.log(err, 'StudentInfoCardList.vue,loadListData()')
          this.loading = false
        })
    },

    // 打开缴费轨迹
    cardLogOpen(record) {
      // this.$refs.paymentTrack.backData(record)
      // this.$refs.paymentTrack.open()
      this.$refs.cardLog.open(record)
    },

    handleHoverChange(record, type) {
      allCardRemark({ stuCardId: record.id }).then(res => {
        if (res.code === 200) {
          this.remarkList = res.data
        }
      })
      if (type) {
        this.remarkInfoMation = record
        this.remarkInfoVisual = true
      }
    },
    deleteRemark(record) {
      let _this = this
      let stuCardRemarkId = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        zIndex: 9999999,
        cancelText: '取消',
        onOk() {
          deleteRemark({ stuCardRemarkId }).then(res => {
            if (res.code == 200) {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.handleHoverChange(_this.remarkInfoMation)
            } else {
              _this.$notification['error']({
                message: '系统通知',
                description: res.msg
              })
            }
          })
        }
      })
    },
    editRemark(record) {
      this.remarkPop = true
      if (record) {
        this.remarkTitle = '修改备注'
        this.cardId = record.id
        this.remarkType = record.remarkType || 'A'
        this.remarks = record.stuCardRemark
      } else {
        this.remarkTitle = '添加备注'
        this.cardId = this.remarkInfoMation.id
        this.remarkType = 'A'
        this.remarks = ''
      }
    },
    remarkSubmit() {
      if (!this.remarks) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请先填写备注'
        })
      }
      if (this.remarks.length > 200) {
        return this.$notification['error']({
          message: '系统通知',
          description: '备注不能超过两百字'
        })
      }
      if (this.remarkTitle == '修改备注') {
        updateRemark({ stuCardRemarkId: this.cardId, remark: this.remarks, remarkType: this.remarkType }).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.handleHoverChange(this.remarkInfoMation)
            this.remarkCancel()
          }
        })
      } else {
        insertRemark({ stuCardId: this.cardId, stuCardRemark: this.remarks, remarkType: this.remarkType }).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.handleHoverChange(this.remarkInfoMation)
            this.remarkCancel()
          }
        })
      }
    },
    remarkCancel() {
      this.remarkPop = false
      this.remarkType = 'A'
      this.remarks = ''
    },

    _refreshTable() {
      this.loadListData()
    },

    // 搜索
    handleSearch(clearFilters, value, confirm, dataIndex) {
      if (dataIndex === 'status') {
        this.queryParam.cardStatus = value ? value.join(',') : 'A,B,C,D'
      } else {
        this.queryParam[dataIndex] = value
      }
      Vue.ls.set('STUDENT_INFO_CARD_LIST_PARAM', JSON.stringify(this.queryParam))
      this.clearFilters = clearFilters
      confirm()
      this._refreshTable()
    },
    // 重置
    handleReset(clearFilters, setSelectedKeys, dataIndex) {
      if (clearFilters && dataIndex) {
        clearFilters()
        if (dataIndex === 'status') {
          const cardStatus = ['A', 'B', 'C', 'D']
          this.queryParam.cardStatus = cardStatus.join(',')
          if (setSelectedKeys) setSelectedKeys([cardStatus])
        } else {
          this.queryParam[dataIndex] = undefined
        }
      } else {
        this.clearFilters ? this.clearFilters() : ''
        this.queryParam = {
          cardStatus: ''
        }
        Vue.ls.remove('STUDENT_INFO_CARD_LIST_PARAM')
      }
      this._refreshTable()
    },
  }
}
</script>

<style lang="less" type="text/less" scoped>
  .column_search_wrap {
    width: 220px;
    padding: 10px;

    .column_search_input {
      display: block;
      width: 100%;
    }

    .column_search_checkbox {
      display: block;
      height: 30px;
      line-height: 30px;
      margin-left: 0;
    }
  }
  .checkIcon {
    margin-right: 10px;
    font-size: 14px;
    font-weight: 500;
  }
  .checkIcon.check {
    color: #1ba97b;
    margin-left: 6px;
  }
  .ant-table-thead > tr > th .ant-table-filter-icon {
    right: unset;
  }

td {
  border: 1px solid #ddd;
  line-height: 30px;
  width: 300px;
  text-align: center;
}

.image_wrapper {
  position: relative;

  .refresh {
    position: absolute;
    top: 270px;
    left: 66px;
    width: 223px;
    height: 223px;
    cursor: pointer;
  }

  .tip {
    position: absolute;
    bottom: 20px;
  }
}
</style>
