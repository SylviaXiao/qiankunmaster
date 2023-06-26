<template>
  <div class="personal-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"> </search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="table-wrapper">
        <div class="btn-group">
          <perm-box perm="education:class:personal:save">
            <a-button icon="plus-circle" type="primary" @click="savePersonalClass()">新增</a-button>
          </perm-box>
        </div>
        <s-table ref="table" :columns="columns" :data="loadData" rowKey="id">
          <span slot="className" slot-scope="text, record">
            <perm-box :text="text" perm="education:class:personal:view">
              <router-link :to="{ path: `/reception/personal/classInfo/${record.id}` }">{{ text }}</router-link>
            </perm-box>
          </span>
          <span slot="split" slot-scope="text, record" v-if="record.split.length">
            <div v-for="(item, index) in record.split" :key="index">{{ item.deptName }}{{ item.splitRatio }}%</div>
          </span>
          <span slot="action" slot-scope="text, record">
            <template v-if="record.state !== 'C'">
              <perm-box perm="education:plan:save">
                <a href="javascript:;" @click="addPersonalClassPlans(record)">预约课程</a>
              </perm-box>
            </template>
            <template v-if="record.state !== 'C'">
              <perm-box perm="education:class:personal:save">
                <a href="javascript:;" @click="savePersonalClass(record)">编辑</a>
              </perm-box>
            </template>
            <template>
              <perm-box perm="education:class:personal:ratio">
                <a href="javascript:;" @click="apportion(record)">成本分摊</a>
              </perm-box>
            </template>
            <!-- <a href="javascript:;" @click="qrcodeHandle(record)">扫一扫签到</a> -->
            <template v-if="record.state == 'A'">
              <perm-box perm="education:class:del">
                <a href="javascript:;" @click="removePersonalClass(record)">删除</a>
              </perm-box>
            </template>
          </span>
        </s-table>
      </div>
    </a-card>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1000"
      :title="modalName"
      v-model="saveModalVisible"
      okText="保存"
      cancelText="取消"
      @ok="sendForm()"
    >
      <a-spin :spinning="spinning">
        <a-form :form="personalForm">
          <a-row>
            <!-- 班级名称 -->
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="班级名称" v-bind="formItemLayout">
                <a-input
                  placeholder="学员姓名+档位金额+人数（1v*)+节数"
                  v-decorator="['className', { rules: [{ required: true, message: '请输入班级名称' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="舞种" v-bind="formItemLayout">
                <a-select
                  allowClear
                  @change="(params1,params2)=>isValues(params1,params2,'danceId')"
                  v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]"
                  placeholder="请选择舞种"
                >
                  <a-select-option :allowClear="true" :value="dance.id" v-for="(dance, danceIndex) in danceList" :key="danceIndex">
                    {{ dance.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="人群" v-bind="formItemLayout">
                <a-select  @change="(params1,params2)=>isValues(params1,params2,'crowdType')" :allowClear="true" v-decorator="['classType', { rules: [{ required: true, message: '请选择人群' }] }]" placeholder="成人/少儿"  >
                  <a-select-option value="A">成人</a-select-option>
                  <a-select-option value="B">少儿</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="班型" v-bind="formItemLayout">
                <a-cascader
                  :options="classTypeList"
                  :allowClear="false"
                  placeholder="请选择班型"
                  :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                  @change="(params1,params2)=>isValues(params1,params2,'classTypeId')"
                  v-decorator="['classTypeId', { rules: [{ required: true, message: '请选择班型' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="薪酬类型" v-bind="formItemLayout">
                <a-select
                  allowClear
                  v-decorator="['salTypeId', { rules: [{ required: true, message: '请选择薪酬类型' }] }]"
                  placeholder="选择班型后才会生成薪酬类型"
                  :disabled="!isAdmin && savePersonalClassType === 1"
                >
                  <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in saleryTypeList" :key="index">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 计划开班时间 计划结业时间 -->
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="起止时间" v-bind="formItemLayout">
                <a-range-picker v-decorator="['classDate', { rules: [{ required: true, message: '请选择起止时间' }] }]" />
              </a-form-item>
            </a-col>
            <!-- 上课导师 -->
            <a-col :lg="12" :md="12" :sm="24">
              <!--              <a-form-item label="上课导师" v-bind="formItemLayout">-->
              <!--                   <span>-->
              <!--                      <a-input disabled class="show-disabled" v-decorator="['teacher',-->
              <!--                      {rules: [{ required: true, message: '请选择上课导师' }]}]">-->
              <!--                        <a-icon slot="addonAfter" type="search" @click="openChooseTea('teacher')"/>-->
              <!--                      </a-input>-->
              <!--                   </span>-->
              <!--              </a-form-item>-->
              <a-form-item label="上课导师" style="position: relative;" class="disabled-select" v-bind="formItemLayout">
                <a-select
                  mode="multiple"
                  style="width: calc(100% - 37px);margin-right: 37px;z-index: 144;border-radius: 4px 0 0 4px;"
                  @deselect="deselect"
                  :open="false"
                  v-decorator="['teacher', { rules: [{ required: true, message: '请选择上课导师' }] }]"
                  placeholder="请选择上课导师"
                >
                  <a-icon slot="suffixIcon" type="search" />
                  <a-select-option v-for="(item, idx) in teaSelectArr" :value="item.id" :key="idx">{{ item.name || item.teacherName }} </a-select-option>
                </a-select>
                <a-input style="cursor: pointer; position: absolute;left: -2px;top: -6.5px;border: none;" class="no-border-input">
                  <a-icon slot="addonAfter" type="search" @click="openChooseTea('teacher')" />
                </a-input>
              </a-form-item>
            </a-col>
          <!-- 顾问 -->
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="顾问" v-bind="formItemLayout">
                <span>
                  <a-input disabled class="show-disabled" v-decorator="['master', { rules: [{ required: true, message: '顾问' }] }]">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('all', 'master')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
            <!-- 教研组负责人 -->
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="教研组负责人" class="show-disabled" v-bind="formItemLayout">
                <span>
                  <a-input disabled v-decorator="['educator']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('educator')" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
            <a-col v-if="createType" :span="24">
              <a-form-item label="是否有创编" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
                <!--                <a-input placeholder="请输入预招人数" v-decorator="['total',{rules: [{validator: this.$verify.isNum}]}]"/>-->
                <a-radio-group v-decorator="['creationFee', { initialValue: false }]">
                  <a-radio :value="true">
                    是
                  </a-radio>
                  <a-radio :value="false">
                    否
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          <!-- 备注 -->
            <a-col :span="24">
              <a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
                <a-textarea
                  style="width: 80%;"
                  placeholder="请输入备注 (100字以内)"
                  :rows="3"
                  v-decorator="['classDesc', { rules: [{ validator: $verify.lenth }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="addHasParams || teaPlanShow">
            <a-divider />
            <!-- 添加学员 -->
            <a-col :lg="12" :md="12" :sm="24" v-if="addHasParams">
              <a-form-item label="学员" v-bind="formItemLayout">
                <span>
                  <a-input disabled class="show-disabled" v-decorator="['stuCard', { rules: [{ required: true, message: '请选择私教学员' }] }]">
                    <a-icon slot="addonAfter" type="search" @click="addStudent()" />
                  </a-input>
                </span>
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24" v-if="teaPlanShow">
              <a-form-item label="是否提交教案" v-bind="formItemLayout">
                <span>
                  <a-select
                    allowClear
                    v-decorator="['teachingPlan', { initialValue: 'false', rules: [{ required: true, message: '请选择是否提交教案' }] }]"
                    placeholder="请选择是否提供教案"
                  >
                    <a-select-option value="true">
                      是
                    </a-select-option>
                    <a-select-option value="false">
                      否
                    </a-select-option>
                  </a-select>
                </span>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row class="form-row" :gutter="16" v-if="savePersonalClassType === 0">
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item label="成本分摊" v-bind="aLineLayout" required>
                <span>
                  <apportBelongsTable ref="apportion" @closeAchiModal="apportionClear"></apportBelongsTable>
                </span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
    <!-- 卡种选择组件 -->
    <card-modal ref="cardModal" @ok="cardModalOk" classType="B" @close="cardModalClose" @getBackData="getCardData"></card-modal>
    <!-- 选择员工组件 -->
    <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getUserData"></i-modal>
    <!--  新增课程  -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="新增课程"
      width="800px"
      v-model="saveCPModal"
      okText="保存"
      cancelText="取消"
      @ok="savePersonalClassPlans()"
    >
      <classplans-form ref="planModalForm" :isPersonal="true" :recordProps="recordProps"></classplans-form>
    </a-modal>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      title="选择学员"
      :visible="modalVisible"
      @ok="addStuHandleOk"
      @cancel="handleCancel"
    >
      <class-info-modal-table checkType="radio" :modalTableProps="addStuParams" ref="modalRef"></class-info-modal-table>
    </a-modal>
    <choose-tea ref="choosetea" :multiple="true" :teaFields="teaFields" @ok="chooseteaOk" @close="chooseteaClose" @getBackData="getTeaData"></choose-tea>
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
      <apportBelongsTable ref="apportBelongsTable" @closeAchiModal="ApportionPlansClose" :schoolId="schoolId"></apportBelongsTable>
    </a-modal>
    <!-- 扫码签到 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="400"
      title="签到二维码"
      :footer="null"
      @cancel="qrcodeVisible = false"
      v-model="qrcodeVisible"
    >
      <div class="image_wrapper">
        <img id="image_qrcodeUrl" style="width: 350px" :src="qrcodeUrl" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import apportBelongsTable from './modules/apportBelongsTable'
import { getPersonalClassList, getClassInfo, removeClass, saveClass, saveClassP, editAddClassPlan } from '@/api/education'
import { STable, IModal, CardModal, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import ChooseTea from '@/components/ChooseTea'
import ClassInfoModalTable from '@/views/education/modules/classInfoModalTable'
import ClassplansForm from '@/views/education/modules/classInfoPlanModalform'
import moment from 'moment'
import { listEduDance, listEduCardType, pageDeptCard, treeEduClassType, salTypeListById, salTypeListByEduType } from '@/api/common'
import { getSchoolList } from '@/api/education/card'

const columns = [
  {
    title: '所在分馆',
    dataIndex: 'schoolName',
    key: 'schoolName'
  },
  {
    title: '班级',
    dataIndex: 'className',
    key: 'className',
    scopedSlots: { customRender: 'className' }
  },
  {
    title: '上课学员',
    dataIndex: 'students',
    key: 'students',
    customRender: (text, record) => {
      if (Array.isArray(text) && text.length > 0) {
        return text.map(d => d.stuName).join(',')
      }
      return ''
    }
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    key: 'typeName'
  },
  {
    title: '班型',
    dataIndex: 'classTypeName',
    key: 'classTypeName'
  },
  {
    title: '薪酬类型',
    dataIndex: 'salTypeName',
    key: 'salTypeName'
  },
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
    dataIndex: 'masterName',
    key: 'masterName'
  },
  {
    title: '使用次数/总次数',
    dataIndex: 'totalCount',
    customRender: (text, record) => {
      return `${record.usedCount || 0}/${record.totalCount || 0}`
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
    title: '提供教案',
    dataIndex: 'teachingPlan',
    key: 'teachingPlan',
    customRender: (text, record) => {
      return text === true ? '是' : text === false ? '否' : ''
    }
  },

  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]
const modalName = {
  addName: '新增',
  editName: '编辑'
}
const aLineLayout = {
  labelCol: {
    xs: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 19 }
  }
}
export default {
  name: 'personal',
  components: {
    ClassInfoModalTable,
    STable,
    PermBox,
    IModal,
    CardModal,
    ClassplansForm,
    SearchComPro,
    ChooseTea,
    apportBelongsTable
  },
  data() {
    return {
      columns,
      queryParam: {},
      loadData: parameter => {
        return getPersonalClassList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      modalName: '班级信息',
      saveModalVisible: false,
      formItemLayout: this.$tools.formItemLayout2,
      aLineLayout,
      spinning: false,
      formValues: {},
      saveCPModal: false,
      recordProps: null,
      classId: null,
      userType: 'all',
      actualType: '',
      saleryTypeList: [],
      teaFields: null,
      teaSelectArr: [],
      teaIdsArr: [],

      //搜索
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
          type: 'cascader',
          key: 'classTypeId',
          label: '选择班级',
          placeholder: '请选择班型',
          treeOps: {
            api: treeEduClassType,
            type: 'G',
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'chooseModal',
          key: 'teacher',
          label: '上课导师',
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
          type: 'select',
          key: 'teachingPlan',
          label: '提供教案',
          placeholder: '请选择是否提供教案',
          staticArr: [
            {
              string: '是',
              value: 'true'
            },
            {
              string: '否',
              value: 'false'
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
          type: 'treeSelect',
          isShow: true,
          key: 'deptId',
          label: '建班分馆',
          placeholder: '请选择建班分馆',
          expandAll: true,
          selectFather: false,
          mutiple: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'date',
          key: 'scheduling',
          label: '排课时间',
          placeholder: '请选择日期区间',
          format: 'YYYY-MM-DD'
        }
      ],

      //添加学生参数
      addStuParams: {},
      addHasParams: false,
      modalVisible: false,
      classTypeList: [],
      danceList: [],
      apportionModal: false, //分摊
      qrcodeVisible: false, //二维码
      qrcodeUrl: null,
      schoolId: null,
      createType: false,
      teaPlanShow: false,
      savePersonalClassType: null //0.新增 1.编辑
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters.userInfo.perms.includes('*')
    }
  },
  beforeCreate() {
    this.personalForm = this.$form.createForm(this)
  },
  created() {
    this.getSelectList()
  },
  methods: {
    //扫一扫
    qrcodeHandle(record) {
      // 将来拓展用
      this.qrcodeUrl = process.env.VUE_APP_URL + '/common/qrcode/personalClass/' + record.id
      this.qrcodeVisible = true
    },
    ApportionPlansClose(res) {
      this.schoolId = null
      this.$refs.apportBelongsTable.clear()
      this.apportionModal = false
      if (res.code == 200) this._refreshTable()
    },
    saveApportionPlans() {
      this.$refs.apportBelongsTable.save()
    },
    //分摊
    apportion(record) {
      console.log(record.schoolId)
      this.getClassFormValue(record).then(res => {
        console.log(res)
        if (res.code == 200) {
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
    getDefaultClassType(){
      // let ids = ['2c153504-ca12-4b51-ac10-4c37e38d65a7','7f1b5d25-75c0-4fce-9bd6-bac701bea0e4']
      // let data = this.personalForm.getFieldsValue()
      // let type = 'A'
      // if(data.danceId&&data.danceId!=='B'&&data.classTypeId&&ids.includes(data.classTypeId[0])){
      //   type = 'B'
      // }
      // this.personalForm.setFieldsValue({ classType:type })
    },
    isValues(value, info,type) {
      console.log(111,type,value, info)
      this.personalForm.setFieldsValue( {'stuCard': null} )
      if (type==='classTypeId') {
        this.addStuParams.typeId = value[0]
        this.addStuParams.classTypeId = value[1]
        if (value[0] === 'F') {
          this.createType = true
        } else {
          this.createType = false
        }
        if (value[0] === 'C') {
          this.teaPlanShow = true
          this.getSalaryType(value[0], value[1])
        } else {
          this.teaPlanShow = false
          this.getSalaryType(value[0])
        }
      } else {
        this.addStuParams[type] = value
      }
      console.log(888,this.addStuParams)
      // 不清除学员和薪酬类型
      // this.formValues.stuCardId = ''
      // this.personalForm.setFieldsValue({ salTypeId: undefined, stuCard: undefined })
      this.$nextTick(() => {
        this.getDefaultClassType()
      })
      this._handleHasParams()
    },
    // getSalaryType(eduTypeId) {
    //   return salTypeListById({ eduTypeId }).then(res => {
    //     if (res.code === 200) {
    //       this.saleryTypeList = res.data
    //     }
    //   })
    // },
    getSalaryType(eduTypeId, eduClassType) {
      return salTypeListByEduType({ eduTypeId, eduClassType }).then(res => {
        if (res.code === 200) {
          this.saleryTypeList = res.data
        }
      })
    },
    getSelectList() {
      listEduDance({ limit: true }).then(res => (this.danceList = res.data))
      treeEduClassType({ type: 'G' }).then(res => {
        this.$tools.transNullToArr(res.data)
        this.classTypeList = res.data
      })
    },
    openChooseTea(type) {
      this.teaFields = type
      this.$refs.choosetea.open()
    },
    chooseteaOk() {},
    chooseteaClose() {},
    deselect(value, option) {
      this.teaIdsArr.remove(value)
      this.formValues.teacherIds = this.teaIdsArr.join(',')
    },
    getTeaData(data, type) {
      if (type == 'teacher') {
        data.map(item => {
          if (this.teaIdsArr.indexOf(item.id) < 0) {
            this.teaSelectArr.push({ name: item.teacherName, id: item.id })
            this.teaIdsArr.push(item.id)
          }
        })
        this.$nextTick(() => {
          this.personalForm.setFieldsValue({ teacher: this.teaIdsArr })
          this.formValues[`teacherIds`] = this.teaIdsArr.join(',')
        })
        return
      }
      this.$nextTick(() => {
        this.personalForm.setFieldsValue({ [type]: data.name })
        this.formValues[`${type}Id`] = data.id
      })
    },
    typeFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    searchSubmit(data) {
      this.queryParam = data
      if (this.queryParam.className) this.queryParam.className = encodeURI(this.queryParam.className.replace(' ',''))
      this._refreshTable()
    },
    savePersonalClass(data) {
      !data ? this.addPersonalClass() : this.editPersonalClass(data)
    },
    initModalForm(data = {}) {
      return new Promise((resolve, reject) => {
        this.formValues = {}
        this.personalForm.resetFields()
        this.addStuParams = {}
        this.addHasParams = false
        this.saleryTypeList = []
        this.teaSelectArr = []
        this.teaIdsArr = []
        this.apportionClear()
        resolve(data)
      })
    },
    setCardValue() {
      this.$refs.cardModal.open()
    },
    cardModalOk() {},
    cardModalClose() {},
    getCardData(value) {
      // 添加学员参数
      this.addStuParams.danceId = value.danceId
      this.addStuParams.cardTypeId = value.cardTypeId
      this.addStuParams.deptCardId = value.id
      this._handleHasParams()
      this.$nextTick(() => {
        this.formValues.deptCardId = value.id
        this.personalForm.setFieldsValue({ ['deptCardName']: value.cardName })
      })
    },
    imodalOk() {},
    imodalClose() {},
    openTreeModal(type, actualType) {
      this.userType = type
      this.actualType = actualType || type
      this.$refs.modal.open()
    },
    getUserData(data, type) {
      if (type === 'all') {
        type = this.actualType || type
      }
      this.$nextTick(() => {
        this.personalForm.setFieldsValue({ [type]: data.name })
        this.formValues[`${type}Id`] = data.id
      })
    },
    addPersonalClass() {
      this.savePersonalClassType = 0
      this.modalName = modalName.addName
      this.initModalForm().then(() => {
        this.saveModalVisible = true
      })
    },
    addPersonalClassPlans(data) {
      const { id } = data
      this.saveCPModal = true
      this.recordProps = data
      this.classId = id

      this.$nextTick(() => {
        this.$refs.planModalForm.resetForm()
        this.$refs.planModalForm.initForm(data)
      })
    },
    //添加学生
    addStudent() {
      this.modalVisible = true
      //刷新弹出内的列表
      this.$nextTick(() => {
        this.$refs.modalRef.clearSelectItem()
        this.$refs.modalRef.refreshTable()
      })
    },
    addStuHandleOk() {
      let addStuInfo = this.$refs.modalRef.radioStu
      this.formValues.stuCardId = addStuInfo.cardId
      this.$nextTick(() => {
        this.personalForm.setFieldsValue({ ['stuCard']: addStuInfo.stuName })
        this.modalVisible = false
      })
    },
    handleCancel() {
      this.modalVisible = false
    },
    savePersonalClassPlans() {
      let planModalForm = this.$refs.planModalForm
      planModalForm
        .validateData()
        .then(() => {
          let params = planModalForm.getFormData()
          console.log(params)
          params.classId = this.classId
          return params
        })
        .then(editAddClassPlan)
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.saveCPModal = false
          this.$refs.table.refresh()
        })
    },
    getClassFormValue(data) {
      const { id } = data
      return new Promise((resolve, reject) => {
        getClassInfo(id)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    editPersonalClass(data) {
      const _this = this
      this.spinning = true
      this.savePersonalClassType = 1
      this.modalName = modalName.editName
      this.initModalForm(data)
        .then(this.getClassFormValue)
        .then(res => {
          //薪酬类型
          let result = res.data
          if (result.eduType) {
            this.getSalaryType(result.eduType.id).then(() => {
              if (result.salType) {
                this.$nextTick(() => {
                  this.personalForm.setFieldsValue({ ['salTypeId']: result.salType.id })
                })
              }
            })
          }
          console.log(res.data)
          const {
            stuName,
            stuCardId,
            eduCardType,
            eduDance,
            eduClass,
            eduType,
            orgUserTeacher,
            orgUserMaster,
            eduDeptCardByName,
            orgUserEducation,
            classCreationFee,
            classType
          } = res.data
          this.createType = true
          let classDate
          setTimeout(() => {
            this.formValues.id = eduClass.id
            this.$nextTick(() => {
              this.personalForm.setFieldsValue({ ['className']: eduClass.className })
              this.personalForm.setFieldsValue({ ['creationFee']: classCreationFee })
              // this.personalForm.setFieldsValue({ ['className22']: 22 })
            })
            eduClass.startDate && eduClass.endDate
              ? (classDate = [moment(eduClass.startDate, 'YYYY-MM-DD'), moment(eduClass.endDate, 'YYYY-MM-DD')])
              : (classDate = [])
            console.log(eduType.id)
            if (eduType.id === 'C') {
              this.teaPlanShow = true
            } else {
              this.teaPlanShow = false
            }
            this.$nextTick(() => {
              this.personalForm.setFieldsValue({ ['classDate']: classDate })
              this.personalForm.setFieldsValue({ ['danceId']: eduDance.id })
              // this.personalForm.setFieldsValue({ ['crowdType']: classType })
              this.personalForm.setFieldsValue({ ['classTypeId']: [eduType.id, eduCardType ? eduCardType.id : null] })
              if(eduClass.classType){
                this.personalForm.setFieldsValue({ classType:eduClass.classType })
              }else{
                this.getDefaultClassType()
              }
            })

            // this.personalForm.setFieldsValue({ ['deptCardName']: eduDeptCardByName || '' })
            // this.formValues.deptCardId = eduDeptCard.id
            // this.personalForm.setFieldsValue({ ['teacher']: orgUserTeacher.name })
            // this.formValues.teacherId = orgUserTeacher.id

            // 报错代码
            if (result.orgUserTeacher && result.orgUserTeacher.length > 0) {
              let ids = []
              result.orgUserTeacher.map(item => {
                this.teaSelectArr.push(item)
                this.teaIdsArr.push(item.teacherName)
                ids.push(item.teacherId)
              })
              this.$nextTick(() => {
                this.personalForm.setFieldsValue({ ['teacher']: this.teaIdsArr })
                this.personalForm.setFieldsValue({ ['master']: orgUserMaster.userName })

                this.formValues.masterId = orgUserMaster.id
                this.formValues.teacherIds = ids.join(',')

                this.personalForm.setFieldsValue({ ['educator']: orgUserEducation ? orgUserEducation.userName : '' })
                this.formValues.educator = orgUserEducation ? orgUserEducation.userName : ''
                this.personalForm.setFieldsValue({ ['classDesc']: eduClass.classDesc })
                this.personalForm.setFieldsValue({ ['teachingPlan']: eduClass.teachingPlan + '' })

                this.formValues.classDesc = eduClass.classDesc
              })
            }

            // 添加学员参数
            this.addStuParams.danceId = eduDance.id
            this.addStuParams.typeId = eduType.id
            this.addStuParams.classTypeId = eduCardType && eduCardType.id
            this.addStuParams.crowdType = classType
            // this.addStuParams.deptCardId = eduDeptCard.id
            this._handleHasParams()
            // 添加学员回显
            this.$nextTick(() => {
              this.personalForm.setFieldsValue({ ['stuCard']: stuName })
              this.formValues.stuCardId = stuCardId
            })
          }, 0)
        })
        .finally(() => {
          _this.saveModalVisible = true
          _this.spinning = false
        })
    },
    removePersonalClass(data) {
      const _this = this,
        { id } = data
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeClass(id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.$refs.table.refresh()
          })
        }
      })
    },
    sendForm() {
      this.personalForm.validateFields((err, values) => {
        this.apportionValidate().then(msg => {
          if (msg) {
            this.$notification['error']({
              message: '系统通知',
              description: msg
            })
          } else {
            if (!err) {
              if (values.classDate && values.classDate.length == 2) {
                values.startDate = values.classDate[0].format('YYYY-MM-DD')
                values.endDate = values.classDate[1].format('YYYY-MM-DD')
                delete values.classDate
              }
              if (values.classTypeId) {
                values.classTypeId = values.classTypeId.join(',')
              }
              const formValues = Object.assign(this.formValues, values)
              saveClassP(formValues).then(res => {
                if (res.code == 200) {
                  this.apportionSave(res.data).then(res => {
                    this.$notification['success']({
                      message: '系统通知',
                      description: '操作成功'
                    })
                    this.saveModalVisible = false
                    this._refreshTable()
                  })
                }
              })
            }
          }
        })
      })
    },
    apportionValidate() {
      return new Promise(resolve => {
        const apportion = this.$refs.apportion
        if (apportion) {
          resolve(apportion.validate())
        } else {
          resolve()
        }
      })
    },
    apportionSave(id) {
      return new Promise(resolve => {
        const apportion = this.$refs.apportion
        if (apportion) {
          if (id) apportion.id = id
          apportion.save2().then(res => resolve(res))
        } else {
          resolve()
        }
      })
    },
    apportionClear() {
      this.$refs.apportion && this.$refs.apportion.clear()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    _handleHasParams() {
      if (Object.keys(this.addStuParams).length) {
        this.addHasParams = (!!this.addStuParams.danceId && !!this.addStuParams.typeId) || !!this.addStuParams.classTypeId
      } else {
        this.addHasParams = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.personal-wrapper {
  .search-card {
    margin: 20px 0;

    .search-group {
    }
  }

  .table-wrapper {
    .btn-group {
      margin-bottom: 20px;
    }
  }
}
</style>
