<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 20px">
        <perm-box perm="education:class:save">
          <a-button icon="plus-circle" type="primary" @click="addClass()">新增</a-button>
        </perm-box>
        <a-button type="primary" class="ml20" icon="download" @click.native="downloadStu"> 导出 </a-button>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id">
        <span slot="className" slot-scope="text, record">
          <perm-box v-if="record.isOnline" :text="record.className" perm="education:class:view || education:class-online:view">
            <router-link :to="{ path: `/reception/classOnLine/classInfo/${record.id}` }">{{ record.className }}</router-link>
          </perm-box>
          <perm-box v-else :text="record.className" perm="education:class:view">
            <router-link :to="{ path: `/reception/class/classInfo/${record.id}` }">{{ record.className }}</router-link>
          </perm-box>
        </span>
        <span slot="startDate" slot-scope="text, record">
          <span>{{ $tools.tailor.getDate(record.startDate) }}</span>
        </span>
        <span slot="split" slot-scope="text, record" v-if="record.split.length">
          <div v-for="(item, index) in record.split" :key="index">{{ item.deptName }}{{ item.splitRatio }}%</div>
        </span>
        <span slot="action" slot-scope="text, record">
          <perm-box perm="education:childclasslog:save">
            <a href="javascript:;" @click="upGrade(record)">升班</a>
          </perm-box>
          <!-- 不为已结业才能编辑 -->
          <template v-if="record.state !== 'C' && !record.isOnline">
            <perm-box perm="education:class:save">
              <a href="javascript:;" @click="addClass(record)">编辑</a>
            </perm-box>
          </template>
          <!-- 计划中的班级才能删除 -->
          <template v-if="$store.getters.roles.permissionList.indexOf('*') !== -1 || (record.state === 'A' && !record.isOnline)">
            <perm-box perm="education:class:del">
              <a href="javascript:;" @click="remove(record)">删除</a>
            </perm-box>
          </template>
          <perm-box perm="education:class:personal:ratio">
            <a href="javascript:;" @click="apportion(record)">成本分摊</a>
          </perm-box>
          <perm-box perm="education:gradepoint:update">
            <a href="javascript:;" @click="changeGrade(record)">修改绩点</a>
          </perm-box>
        </span>
      </s-table>
      <card-modal ref="cardModal" @ok="cardModalOk" @close="cardModalClose" @getBackData="getBackData"></card-modal>
      <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getUserBack"></i-modal>
      <!-- 分摊 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        title="成本分摊"
        width="800px"
        v-model="apportionModal"
        okText="保存"
        cancelText="取消"
        @ok="saveApportionPlans()"
        @cancel="ApportionPlansClose()"
      >
        <apportBelongsTable ref="apportBelongsTable" @closeAchiModal="ApportionPlansClose"></apportBelongsTable>
      </a-modal>
      <!-- 修改绩点 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        title="修改绩点"
        width="500px"
        v-model="showGradeModel"
        okText="保存"
        cancelText="取消"
        @ok="saveGrade()"
        @cancel="gradeClose()"
      >
        <a-form :form="changeGradeForm">
          <!-- 班级名称 -->
          <a-form-item label="绩点" v-bind="formItemLayout">
            <a-select
              allowClear
              v-decorator="['gradePointId', { rules: [{ required: true, message: '请选择绩点' }] }]"
              placeholder="请选择绩点"
            >
              <a-select-option :allowClear="true" :value="dance.id" v-for="(dance, danceIndex) in classGradePointList" :key="danceIndex">
                {{ dance.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import apportBelongsTable from '../reception/modules/apportBelongsTable'
import { STable, CardModal, IModal, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import FormModal from './modules/formModal'
import { getClassList, removeClass,nextEduClassGradePoint ,saveChildClass ,modifyGradePoint } from '@/api/education'
import { classGradePointList, listEduDance, treeEduClassType } from '@/api/common'
import { getSchoolList } from '@/api/education/card'
import { getClassInfo } from '@/api/education'
import { getClassGradePoint } from '@/api/student'
import Vue from "vue"
import { ACCESS_TOKEN } from "@/store/mutation-types"

const itemLayout = []
const columns = [
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    scopedSlots: { customRender: 'className' }
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '绩点',
    dataIndex: 'gradePointName'
  },
  // {
  //   title: '班型',
  //   dataIndex: 'classTypeName'
  // },
  // {
  //   title: '薪酬类型',
  //   dataIndex: 'salTypeName'
  // },
  {
    title: '上课导师',
    dataIndex: 'teachers',
    customRender: (text, record) => {
      let teacherName = ''
      text.map((item, idx) => {
        idx == 0 ? (teacherName += ` ${item.teacherName}`) : (teacherName += `, ${item.teacherName}`)
      })
      return teacherName
    }
  },
  {
    title: '顾问',
    dataIndex: 'masterName'
  },
  {
    title: '开班时间',
    key: 'startDate',
    scopedSlots: { customRender: 'startDate' }
  },
  {
    title: '默认教室',
    dataIndex: 'roomName'
  },
  {
    title: '计划人数',
    dataIndex: 'totalStudents',
    customRender: (text, record) => {
      return `${record.totalStudents}`
    }
  },
  {
    title: '计划课次',
    dataIndex: 'totalCourse',
    customRender: (text, record) => {
      return `${record.totalCourse}`
    }
  },
  {
    title: '班级状态',
    dataIndex: 'state',
    customRender: (text, record) => {
      return text === 'A' ? '计划中' : text === 'B' ? '开课中' : text === 'C' ? '已结业' : text === 'D' ? '停课' : ''
    }
  },
  {
    title: '成本分摊',
    dataIndex: 'split',
    key: 'split',
    scopedSlots: { customRender: 'split' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const classForWeek = [
  {
    title: '星期',
    dataIndex: 'week'
  },
  {
    title: '开始时间',
    dataIndex: 'startDate'
  },
  {
    title: '结束时间',
    dataIndex: 'endDate'
  },
  {
    title: '教室',
    dataIndex: 'room'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const formItemLayout = {
  labelCol: {
    lg: { span: 4 },
    md: { span: 4 },
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    lg: { span: 18 },
    md: { span: 18 },
    xs: { span: 18 },
    sm: { span: 18 }
  }
}
const plainOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export default {
  name: 'class',
  components: {
    STable,
    SearchComPro,
    PermBox,
    FormModal,
    CardModal,
    IModal,
    apportBelongsTable
  },

  data() {
    return {
      formItemLayout,
      columns,
      classForWeek,
      classForWeekData: [],
      queryParam: {},
      loadData: parameter => {
        this.queryParam.classType='B'
        return getClassList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !this.$store.getters.school_id,
          key: 'school_id',
          label: '选择分馆',
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
          type: 'text',
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称',
          autoComplete: true
        },
        {
          type: 'select',
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'chooseModal',
          key: 'teacher',
          label: '导师',
          placeholder: '请选择上课导师'
        },
        {
          type: 'chooseModal',
          key: 'master',
          label: '顾问',
          placeholder: '请选择顾问'
        },
        {
          type: 'select',
          key: 'state',
          label: '班级状态',
          placeholder: '请选择班级状态',
          staticArr: [
            {
              string: '计划中',
              value: 'A'
            },
            {
              string: '上课中',
              value: 'B'
            },
            {
              string: '已结业',
              value: 'C'
            },
            {
              string: '停课',
              value: 'D'
            }
          ]
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'splitSchoolId',
          label: '分摊分馆',
          placeholder: '请选择分摊分馆',
          expandAll: true,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'gradePointIds',
          label: '绩点',
          placeholder: '请选择绩点',
          mode: 'multiple',
          apiOption: {
            api: getClassGradePoint, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        }
      ],
      danceList: [],
      indeterminate: false,
      checkAll: false,
      plainOptions,
      checkedList: [],
      advanced: false,
      userType: 'all',
      apportionModal: false,
      showGradeModel:false,
      classGradePointList:[],
      classId:''
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
    this.changeGradeForm = this.$form.createForm(this)
  },
  created() {
    listEduDance().then(res => (this.danceList = res.data))
    classGradePointList({ limit: true }).then(res => (this.classGradePointList = res.data))
  },
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/education/class/downChildClass'
      const queryParam = this.queryParam
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k !== 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
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
    saveGrade(){
      let _this = this
      this.changeGradeForm.validateFields((error, values) => {
        if(!error) {
          modifyGradePoint(this.classId,values).then(res=>{
            this.showGradeModel = false
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        }
        console.log('error', error);
        console.log('Received values of form: ', values);
      });
    },
    gradeClose(){this.showGradeModel = false},
    changeGrade(record){
      this.showGradeModel = true
      this.$nextTick(() => {
        this.classId=record.id
        this.changeGradeForm.setFieldsValue({ ['gradePointId']: record.gradePointId||'' })
      })
    },
    upGrade(record){
      nextEduClassGradePoint({gradePointId:record.gradePointId}).then(res=>{
        let content =( <div><div>当前等级：{record.gradePointName}</div><div>下一等级：{res.data?.name}</div></div>)
        let _this = this
        this.$confirm({
          title: '是否确认升班？',
          content:content ,
          onOk() {
            saveChildClass({eduClassId:record.id,name:res.data?.name}).then(res=>{
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.selectedRowKeys = []
              _this.selectedRows = []
              _this.$refs.table.refresh()
            })
          },
          onCancel() {},
        });
      })
    },
    ApportionPlansClose(res) {
      this.schoolId = null
      this.$refs.apportBelongsTable.clear()
      this.apportionModal = false
      if (res.code === 200) this._refreshTable()
    },
    saveApportionPlans() {
      this.$refs.apportBelongsTable.save()
    },
    getClassFormValue(data) {
      const { id } = data
      return new Promise((resolve, reject) => {
        getClassInfo(id)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    //分摊
    apportion(record) {
      this.getClassFormValue(record).then(res => {
        if (res.code === 200) {
          this.apportionModal = true
          if (res.data.classSplit.length) {
            this.$nextTick(() => {
              this.$refs.apportBelongsTable.backData(res.data.classSplit)
            })
          } else {
            this.$nextTick(() => {
              this.$refs.apportBelongsTable.getDeptId(record.schoolId)
            })
          }
          this.$nextTick(() => {
            this.$refs.apportBelongsTable.id = record.id
          })
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      if (this.queryParam.className) this.queryParam.className = encodeURI(this.queryParam.className.replace(' ',''))
      this._refreshTable()
    },
    addClass(data) {
      data ? this.$router.push({ path: `/reception/class/editClass/${data.id}` ,query:{isChildren:true}}) : this.$router.push({ path: `/reception/class/addClass` ,query:{isChildren:true}})
    },
    remove(data) {
      const _this = this
      const id = data.id
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeClass(id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.selectedRowKeys = []
            _this.selectedRows = []
            _this.$refs.table.refresh()
          })
        }
      })
    },
    testOk() {},
    formModalClose() {},
    editForm(data) {
      data ? this.$refs.formModal.edit(data) : this.$refs.formModal.add()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    getCard() {
      this.$refs.cardModal.open()
    },
    cardModalOk() {},
    cardModalClose() {},
    getBackData(value) {
      this.$nextTick(() => {
        this.queryParam.deptCardId = value.id
        this.searchForm.setFieldsValue({ ['cardName']: value.cardName })
      })
    },
    getUser(type) {
      this.userType = type
      this.$refs.modal.open()
    },
    imodalOk() {},
    imodalClose() {},
    getUserBack(data, type) {
      this.$nextTick(() => {
        this.searchForm.setFieldsValue({ [type]: data.name })
        this.queryParam[`${type}`] = data.id
      })
    },

    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.classList {
  header {
    margin-bottom: 20px;

    .title {
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>
