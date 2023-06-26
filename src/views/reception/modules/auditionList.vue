<template>
  <div class="audition-list" ref="elementAll" style="height:calc(100vh - 148px)">
    <div ref="elementSearch">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="mt10 mb10">
        <a-button type="primary" icon="download" @click.native="downloadStu">导出</a-button>
      </div>

      <s-table
        :showSlider="true"
        :sliderIndex="1"
        :scroll="{ x: 1800 }"
        ref="sTable"
        size="default"
        :columns="roleColumns"
        :data="loadData"
        :rowKey="(record, index) => index"
      >
        <span slot="auditionApplyDate" slot-scope="text">
          {{ text | filterDate }}
        </span>
        <span slot="logDateTitle" slot-scope="text,record">
            <a-tooltip placement="topLeft">
              <template slot="title">
                <div  style="font-size:12px;width:200px;">试课时间:默认显示试课创建时间，签到后显示签到的操作时间</div>
              </template>
             试课时间
            </a-tooltip>
        </span>
        <span slot="logDate" slot-scope="text,record">
           {{ record.auditionType==="B"?record.signDate:record.createDate | filterDate }}
        </span>
        <span slot="planStartDate" slot-scope="text, record" style="display: flex;flex-flow: nowrap row;align-items: center;">
          {{ planStartDateFormat(record) }}
        </span>
        <span slot="stuNo" slot-scope="text, record" v-if="record.stuNo">
          <router-link :to="{ path: `/reception/studentInfo/${record.stuId}` }">{{ record.stuNo }}</router-link>
        </span>
        <span slot="action" slot-scope="text, record">
          <span v-if="record.financeId">
            <perm-box perm="student:auditionlog:change">
              <a href="javascript:;" @click="onUnchainAuditionLog(record)">取消绑定</a>
            </perm-box>
          </span>
          <span v-if="!record.financeId">
            <perm-box perm="student:auditionlog:change">
              <a href="javascript:;" @click="bindStudentHandle(record)">绑定学员</a>
            </perm-box>
          </span>
          <span v-if="record.auditionType==='B'">
            <perm-box perm="student:auditionlog:change">
              <a href="javascript:;" @click="changeClassHandle(record)">更换试课</a>
            </perm-box>
          </span>
          <span>
            <perm-box perm="student:auditionlog:del">
              <a href="javascript:;" @click="auditionCancal(record)">取消试课</a>
            </perm-box>
          </span>
          <span v-if="record.stuId">
            <perm-box perm="student:auditionlog:change">
              <a href="javascript:;" @click="openEditRemark(record)">修改备注</a>
            </perm-box>
          </span>
        </span>
      </s-table>
      <!-- 新增模板页 -->
    </a-card>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="绑定学员"
      v-model="bingStuModal"
      okText="保存"
      cancelText="取消"
      @ok="confirmHandle()"
      :confirmLoading="bingStuModalLoading"
      class="sign-modal"
    >
      <a-form :form="bingStuForm" style="margin-top: 20px;">
        <!-- 手机号 -->
        <a-form-item :label="`手机号`" v-bind="$tools.formItemLayout">
          <a-input :disabled="stuRecord.auditionType==='B'" placeholder="请输入手机号" v-decorator="['phone', { rules: [{ required: true, message: '请输入手机号' }] }]" />
        </a-form-item>
        <!-- 卡号 -->
        <a-form-item label="卡号" v-bind="$tools.formItemLayout">
          <a-select
            mode="multiple"
            :filterOption="filterOption"
            :allowClear="true"
            placeholder="请选择卡号"
            v-decorator="['stuCardId', { rules: [{ required: true, message: '请选择卡号' }] }]"
          >
            <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in cardList" :key="index">
              {{ item.stuCardNo }}/ {{ item.cardName }}/ {{ item.createDate.slice(0,10) }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!-- 报名时间 -->
        <a-form-item :label="`报名时间`" v-bind="$tools.formItemLayout">
          <a-date-picker
            style="width: 100%"
            placeholder="不填写，默认试课后第一次缴费日期"
            v-decorator="['applyDate', { rules: [{ required: false, message: '请输入报名时间' }] }]"
            valueFormat="YYYY-MM-DD"
            :allowClear="false"
            :disabledDate="disabledDate"
          />
        </a-form-item>
        <!-- 备注 -->
        <a-form-item :label="`备注`" v-bind="$tools.formItemLayout">
          <a-input placeholder="请输入备注" v-decorator="['remark', { rules: [{ required: true, message: '请输入备注' }] }]" />
        </a-form-item>

<!--        <template v-if="stuRecord.auditionType==='B'">-->
<!--          <div style="border-left: 3px solid #1ba97b;padding: 2px 5px;margin: 10px;color: #000;">更换试课</div>-->
<!--          &lt;!&ndash; 试课卡 &ndash;&gt;-->
<!--          <a-form-item label="试课卡" v-bind="$tools.formItemLayout">-->
<!--            <a-select-->
<!--              :filterOption="filterOption"-->
<!--              :allowClear="true"-->
<!--              placeholder="请选择试课卡"-->
<!--              @change='cardIdChange'-->
<!--              v-decorator="['cardId', { rules: [{ required: true, message: '请选择试课卡' }] }]"-->
<!--            >-->
<!--              <a-select-option :allowClear="true" :value="item.cardId" v-for="(item, index) in audiCardList" :key="index">-->
<!--                {{ item.cardNo }}/ {{ item.cardName }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--          </a-form-item>-->
<!--        &lt;!&ndash; 试课卡 &ndash;&gt;-->
<!--        <a-form-item label="试课记录" v-bind="$tools.formItemLayout">-->
<!--          <a-select-->
<!--            :filterOption="filterOption"-->
<!--            :allowClear="true"-->
<!--            placeholder="请选择试课记录"-->
<!--            v-decorator="['dancePlanId', { rules: [{ required: true, message: '请选择试课记录' }] }]"-->
<!--          >-->
<!--            <a-select-option :allowClear="true" :value="item.dancePlanId" v-for="(item, index) in audiCardrecordList" :key="index">-->
<!--              {{ item.className }}/ {{ item.planDate }}-->
<!--            </a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
<!--        </template>-->
      </a-form>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="更换试课"
      v-model="changeClassModal"
      okText="保存"
      cancelText="取消"
      @ok="confirmChangeClass()"
      :confirmLoading="changeClassModalLoading"
      class="sign-modal"
    >
      <a-form :form="changeClassForm" style="margin-top: 20px;">
          <!-- 试课卡 -->
          <a-form-item label="试课卡" v-bind="$tools.formItemLayout">
            <a-select
              :filterOption="filterOption"
              :allowClear="true"
              placeholder="请选择试课卡"
              @change='cardIdChange'
              v-decorator="['cardId', { rules: [{ required: true, message: '请选择试课卡' }] }]"
            >
              <a-select-option :allowClear="true" :value="item.cardId" v-for="(item, index) in audiCardList" :key="index">
                {{ item.cardNo }}/ {{ item.cardName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 试课卡 -->
          <a-form-item label="试课记录" v-bind="$tools.formItemLayout">
            <a-select
              :filterOption="filterOption"
              :allowClear="true"
              placeholder="请选择试课记录"
              v-decorator="['dancePlanId', { rules: [{ required: true, message: '请选择试课记录' }] }]"
            >
              <a-select-option :allowClear="true" :value="item.dancePlanId" v-for="(item, index) in audiCardrecordList" :key="index">
                {{ item.className }}/ {{ item.planDate }}
              </a-select-option>
            </a-select>
          </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改备注 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="修改备注"
      v-model="editRemarkModal"
      okText="保存"
      cancelText="取消"
      @ok="handleEditRemark()"
      @cancel="handleEditRemarkCancel()"
      :confirmLoading="editRemarkLoading"
      class="sign-modal"
    >
      <a-form :form="editRemarkForm" style="margin-top: 20px;">
        <!-- 备注 -->
        <a-form-item label="备注" v-bind="$tools.formItemLayout">
          <a-input placeholder="请输入备注" v-decorator="['remark', { rules: [{ required: true, message: '请输入备注' }] }]" />
          <a-input type="hidden" v-decorator="['auditionApplyId']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { STable, SearchComPro, PermBox } from '@/components'
import { pageAuditionLog, unbindAuditionLog, bindAuditionLog, bindTrialCard,updateAuditionLogRemark,queryTrialCardBindList } from '@/api/reception/student'
import { removeAuditionLog } from '@/api/student'
import { listEduDance } from '@/api/common'
import { studentCardByLogDate, getPageList } from '@/api/reception/student'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getSchoolList } from '@/api/education/card'
//table遍历数组    姓名、手机号、试课时间、老师、学号、备注
const roleColumns = [
  {
    title: '上课时间',
    width: 180,
    dataIndex: 'planStartDate',
    key: 'planStartDate',
    scopedSlots: { customRender: 'planStartDate' }
  },
  {
    dataIndex: 'logDate',
    key: 'logDate',
    scopedSlots: { customRender: 'logDate' ,title: 'logDateTitle'}
  },
  {
    title: '试课卡',
    dataIndex: 'auditionType',
    key: 'auditionType',
    customRender: (text, record) => {
      return text==='B' ? '是' : '否'
    }
  },
  {
    title: '姓名',
    dataIndex: 'stuName',
    key: 'stuName'
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    key: 'stuPhone',
    slots: { title: '舞种' },
    scopedSlots: { customRender: 'danceName' }
  },
  {
    title: '试课分馆',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '班级名称',
    width: 200,
    dataIndex: 'className',
    key: 'className',
    ellipsis: true
  },
  {
    title: '舞种',
    dataIndex: 'eduDanceName',
    key: 'eduDanceName'
  },
  {
    title: '签到状态',
    dataIndex: 'signState',
    key: 'signState',
    customRender: (text, record) => {
      return record.signState === 'Y' ? '已签' : '未签'
    }
  },
  {
    title: '老师',
    dataIndex: 'teacherName',
    key: 'teacherName'
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    scopedSlots: { customRender: 'stuNo' }
  },
  {
    title: '报名时间',
    dataIndex: 'auditionApplyDate',
    key: 'auditionApplyDate',
    scopedSlots: { customRender: 'auditionApplyDate' }
  },
  {
    title: '报名卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo',
    ellipsis: true,
  },
  {
    title: '报名金额',
    dataIndex: 'price',
    key: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '顾问',
    width: 120,
    dataIndex: 'adviser',
    input: 'adviser'
  },
  {
    title: '备注',
    dataIndex: 'logRemark',
    key: 'logRemark',
    customRender: (text, record) => {
      if (record.logRemark && record.applyRemark) {
        return record.logRemark + ',' + record.applyRemark
      }
      if (record.logRemark && !record.applyRemark) {
        return record.logRemark
      }
      if (!record.logRemark && record.applyRemark) {
        return record.applyRemark
      }
      return ''
    }
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'auditionList',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
      //更换试课
      changeClassModalLoading:false,
      changeClassModal:false,
      stuRecord:{},
      audiCardList:[],//试课卡列表
      audiCardrecordList:[],//试课记录列表
      cardList: [], //绑定学员卡列表
      height: 0, //滚动条高度
      // 绑定学员
      bingStuModal: false,
      bingStuModalLoading: false,
      roleColumns,
      queryParam: {},
      loadData: parameter => {
        return pageAuditionLog(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      searchParams: [
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'auditionInfo',
          label: '姓名/手机号',
          placeholder: '请输入姓名或手机号'
        },
        {
          type: 'chooseModal', // 点击弹框选择类型
          key: 'teacher', // 根据key来筛选
          label: '导师',
          placeholder: '请选择导师'
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'stuNo',
          label: '学员学号',
          placeholder: '请输入学员学号'
        },
        {
          type: 'date',
          key: 'AuditionDate',
          label: '试课时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'date',
          key: 'Date',
          label: '报名时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select',
          key: 'audiState',
          label: '绑定学员',
          placeholder: '请选择',
          staticArr: [
            {
              string: '已绑定',
              value: 'Y'
            },
            {
              string: '未绑定',
              value: 'N'
            }
          ]
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称'
        },
        {
          type: 'select',
          key: 'eduDanceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'adviser',
          label: '顾问名称',
          placeholder: '请输入顾问名称',
          width: 80
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'remark',
          label: '备注',
          placeholder: '请输入备注'
        },
        {
          type: 'treeSelect',
          isShow:!!!this.$store.getters.school_id,
          key: 'auditionDeptId',
          label: '试课分馆',
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
          type: 'select',
          key: 'auditionType',
          label: '试课卡',
          placeholder: '请选择',
          staticArr: [
            {
              string: '是',
              value: 'B'
            },
            {
              string: '否',
              value: 'A'
            }
          ]
        },
        {
          type: 'select',
          key: 'signState',
          label: '试课是否签到',
          placeholder: '请选择',
          staticArr: [
            {
              string: '已签',
              value: 'Y'
            },
            {
              string: '未签',
              value: 'N'
            }
          ]
        },
        {
          type: 'date',
          key: 'PlanDate',
          label: '上课时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
      ],

      // 修改备注
      editRemarkModal: false,
      editRemarkLoading: false
    }
  },
  beforeCreate() {
    this.bingStuForm = this.$form.createForm(this)
    this.editRemarkForm = this.$form.createForm(this)
    this.changeClassForm= this.$form.createForm(this)
  },

  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/student/auditionlog/pageAuditionLogByExport'
      const queryParam = this.queryParam
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k !== 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const userSchoolId = this.$store.getters.school_id
      if (userSchoolId) {
        fields.push({ name: 'school_id', value: userSchoolId })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
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
    planStartDateFormat(record) {
      return this.$tools.tailor.getDateTimes(record.planStartDate) + '~' + this.$tools.tailor.getTime(record.planEndDate)
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    disabledDate(current) {
      if (this.$store.getters.userInfo?.account?.id == 'admin') return false
      let date = new Date()
      let day = date.getDate()
      let obj = moment(current).format('YYYY-MM-DD')
      let start = moment(date)
        .startOf('month')
        .format('YYYY-MM-DD')
      if (day <= 2)
        start = moment(date)
          .month(moment(date).month() - 1)
          .startOf('month')
          .format('YYYY-MM-DD')
      let end = moment(date)
        .endOf('month')
        .format('YYYY-MM-DD')
      return start > obj || obj > end
    },
    validateBindStudent(planStartDate) {
      if (this.$store.getters.userInfo?.account?.id == 'admin') {
        return false
      }
      if (moment().date() <= 2) {
        if (
          !(
            moment().isSame(planStartDate, 'month') ||
            moment()
              .subtract(1, 'months')
              .isSame(planStartDate, 'month')
          )
        ) {
          return '只能绑定/取消绑定当月或上月的学员'
        }
      } else if (moment().date() > 2) {
        if (!moment().isSame(planStartDate, 'month')) {
          return '只能绑定/取消绑定当月的学员'
        }
      }
      return null
    },
    onUnchainAuditionLog(record) {
      const { id, auditionApplyDate } = record
      const flag = this.validateBindStudent(auditionApplyDate)
      if (flag) {
        return this.$notification['error']({
          message: '系统通知',
          description: flag
        })
      }

      this.$confirm({
        title: '系统提示',
        content: '确认解除该条数据的关联吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unbindAuditionLog(id).then(this._refreshTable)
        }
      })
    },
    cardIdChange(e){
      const {
        changeClassForm: { setFieldsValue }
      } = this
      let arr = this.audiCardList.filter(item=>item.cardId===e)
      let dancePlanId=''
      if(Array.isArray(arr)&&arr.length>0){
        this.audiCardrecordList=arr[0].auditionLogs
        dancePlanId=this.audiCardrecordList[0].dancePlanId
      }else{
        this.audiCardrecordList=[]
      }
      this.$nextTick(() => {
        setFieldsValue({
          dancePlanId:dancePlanId
        })
      })
    },
    async changeClassHandle(record) {
      const {
        changeClassForm: { setFieldsValue }
      } = this
      this.stuRecord = record
      this.audiCardList = []
      this.audiCardrecordList = []
        queryTrialCardBindList({ auditionLogId: record.auditionId}).then(async res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.audiCardList = res.data
            this.cardIdChange(record.trailBindCardId)
          }
        })
      this.changeClassModal = true
      this.$nextTick(() => {
        setFieldsValue({
          cardId:record.trailBindCardId,
          dancePlanId:record.dancePlanId
        })
      })
    },
    async bindStudentHandle(record) {
      const {
        bingStuForm: { setFieldsValue }
      } = this
      this.stuRecord = record
      this.cardList = []
      // 忽略school_id
      getPageList({ page: 1, limit: 10, stuInfo: record.stuPhone, likeType: 'Y'}, true).then(async res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          let res1 = await studentCardByLogDate({
            studentId: res.data[0].id,
            logDate: record.planStartDate
          })
          if (Array.isArray(res1.data)) {
            this.cardList = res1.data
          }
        }
      })
      this.bingStuModal = true
      this.$nextTick(() => {
        setFieldsValue({
          phone: record.stuPhone,
          applyDate: '',
          remark: '',
          stuCardId: []
        })
      })
    },
    confirmChangeClass() {
      const {
        stuRecord,
        changeClassForm: { validateFields }
      } = this
      validateFields()
        .then(res => {
          let params = Object.assign({}, res, {
            auditionId: stuRecord.auditionId
          })
          // params.stuCardId = params.stuCardId.join(',')
          this.changeClassModalLoading = true
          this.changeClassModal = false
          return params
        })
        .then(bindTrialCard)
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this._refreshTable()
        })
        .finally(() => {
          this.changeClassModalLoading = false
        })
    },
    confirmHandle() {
      const {
        stuRecord,
        bingStuForm: { validateFields }
      } = this
      validateFields()
        .then(res => {
          let createDate = this.cardList.filter(item=>res.stuCardId.includes(item.id)).map(item=>{return item.createDate})
          createDate=Array.from(new Set(createDate))
          if(createDate.length>1){
            this.$notification['error']({
              message: '系统通知',
              description: '所选卡号缴费日期不一致，请重新选择卡号'
            })
            return
          }
          let params = Object.assign({}, res, {
            auditionId: stuRecord.auditionId,
            id: stuRecord.id
          })
          params.stuCardId = params.stuCardId.join(',')
          this.bingStuModalLoading = true
          this.bingStuModal = false
          return params
        })
        .then(bindAuditionLog)
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this._refreshTable()
        })
        .finally(() => {
          this.bingStuModalLoading = false
        })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    _refreshTable() {
      this.$refs.sTable.refresh()
    },

    // 取消试课
    auditionCancal(record) {
      this.$confirm({
        title: '系统提示',
        content: '是否要取消该试课',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeAuditionLog({ auditionLogId: record.auditionId }).then(res => {
            if (res.code === 200) {
              this._refreshTable()
            }
          })
        }
      })
    },

    openEditRemark(record) {
      this.editRemarkModal = true
      this.$nextTick(() => {
        const { id: auditionApplyId, applyRemark: remark } = record
        this.editRemarkForm.setFieldsValue({ auditionApplyId, remark })
      })
    },
    handleEditRemark() {
      this.editRemarkForm.validateFields().then(data => {
        this.editRemarkLoading = true
        updateAuditionLogRemark(data)
          .then(res => {
            if (res.code === 200) {
              this.handleEditRemarkCancel()
              this._refreshTable()
            }
          })
          .finally(() => {
            this.editRemarkLoading = false
          })
      })
    },
    handleEditRemarkCancel() {
      this.editRemarkForm.resetFields()
      this.editRemarkModal = false
    }
  }
}
</script>

<style scoped lang="less"></style>
