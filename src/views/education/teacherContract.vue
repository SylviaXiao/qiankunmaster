<template>
  <div class='teacher-demand-wrapper'>
    <a-card :bordered='false' :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit='searchSubmit'
                      :searchParams='searchParams'></search-com-pro>
    </a-card>
    <a-card :bordered='false'>
      <div class='btnGroup' style='margin-bottom: 15px;'>
        <a-space :size='15'>
          <perm-box perm='salary:template:save'>
            <a-button icon='plus-circle' type='primary' @click='handleEditStu(null)'>新增</a-button>
          </perm-box>
          <perm-box perm='salary:template:down'>
            <a-button icon='download' type='primary' @click.native='exportExcel'>导出</a-button>
          </perm-box>
        </a-space>
      </div>
      <s-table ref='table' size='default' :columns='columns' :data='loadData' rowKey='id'>
        <span slot='status' slot-scope='text, record'>
          <a-switch v-if="handlePermBox('salary:template:editStatus')" @change='typeChange($event, record)' :checked="text === 'Y'"> </a-switch>
          <span v-else> {{text === 'Y'?'在职':'离职'}}</span>
        </span>
        <span slot='userLoginState' slot-scope='text, record'>
          <perm-box perm='salary:template:onlogin' :text="record.userLoginState == 'Y' ? '允许' : '禁止'">
            <a-switch :checked="record.userLoginState == 'Y'" @change='changeUserLoginState($event, record)'>
              <a-icon type='check' slot='checkedChildren' />
              <a-icon type='close' slot='unCheckedChildren' />
            </a-switch>
          </perm-box>
        </span>
        <span slot='fullTimeService' slot-scope='text, record'>
           <a v-if="handlePermBox('salary:template:editTransferDate')" href='#' @click='handleEditfullTime(record)'>{{text}}</a>
          <span v-else>{{text}}</span>
        </span>
        <span slot='action' slot-scope='text, record'>
          <perm-box perm='salary:template:save'>
            <a href='#' @click='handleEditStu(record)'>修改</a>
          </perm-box>
          <perm-box perm='salary:template:del'>
            <a href='#' @click='handleRemove(record)'>删除</a>
          </perm-box>
          <perm-box perm='salary:template:resetpwd'>
            <a href='javascript:;' @click='resetPwd(record)'>重置密码</a>
          </perm-box>
        </span>
        <span slot='inductionDate' slot-scope='text, record'
              :style="`color:${remindSocialSecurity(record) ? 'red' : ''}`">
          {{ text | filterDate }}
        </span>
        <span slot='leaveDate' slot-scope='text, record'>
          {{ text | filterDate }}
<!--          record.status == 'Y' ? '' : -->
        </span>
      </s-table>
    </a-card>
    <a-modal
      :maskClosable='$store.state.modalMaskClickEnable'
      title='新增/修改'
      v-model='stusourceModal'
      width='800px'
      @ok='sendForm()'
      okText='提交'
    >
      <template slot='footer'>
        <a-button  @click='showRecord()' v-if='formValues.id'>
          续签记录
        </a-button>
        <a-button key='back' @click='handleCancel'>
          取消
        </a-button>
        <a-button key='submit' type='primary' :loading='loading' @click='sendForm()'>
          确定
        </a-button>
      </template>
      <a-form :form='stusourceForm'>
        <a-row>
          <a-form-item style='display: none;'>
            <a-input v-decorator="['id']" />
          </a-form-item>
          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='老师姓名' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-input placeholder='请输入老师身份证姓名'
                         v-decorator="['teacherName', { rules: [{ required: true, message: '请输入老师身份证姓名' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='昵称' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-input placeholder='请输入昵称' v-decorator="['nickname']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='联系方式' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-input
                  placeholder='请输入联系方式'
                  v-decorator="['teacherMobile', { rules: [{ required: true, message: '请输入联系方式' }, { validator: verifyPhone }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='人群' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-select :allowClear='true' placeholder='请选择人群'
                          v-decorator="['Crowd', { rules: [{ required: true, message: '请选择人群' }] }]">
                  <a-select-option :allowClear='true' :value='item.id' v-for='(item, index) in crowdList' :key='index'>
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='舞种' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-select :allowClear='true' placeholder='请选择'
                          v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]">
                  <a-select-option :allowClear='true' :value='item.id' v-for='(item, index) in danceList' :key='index'>
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='地区' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-select :allowClear='true' placeholder='请选择地区'
                          v-decorator="['areaId', { rules: [{ required: true, message: '请选择地区' }] }]">
                  <a-select-option :allowClear='true' :value='item.id' v-for='(item, index) in areaList' :key='index'>
                    {{ item.deptName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='开户行' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-input placeholder='请输入开户行' disabled
                         v-decorator="['bank', { rules: [{ required: true, message: '请输入开户行' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='银行卡号' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-input
                  placeholder='请输入银行卡号'
                  @change='bankNoChange'
                  v-decorator="['bankNo', { rules: [{ required: true, message: '请输入银行卡号' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24' >
              <a-form-item label='上传银行卡' :labelCol='{ span: 3 }' :wrapperCol='{ span: 19 }'>
                <UploadBank v-if='stusourceModal' ref='uploadBank' @uploadSuccess='uploadBankSuccess' />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='员工类型' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-select
                  :allowClear='true'
                  placeholder='请选择'
                  v-decorator="[
                    'official',
                    {
                      rules: [{ required: true, message: '请选择' }],
                      initialValue: 'C'
                    }
                  ]"
                  @change='officialChange'
                >
                  <a-select-option value='A'>全职</a-select-option>
                  <a-select-option value='C'>兼职</a-select-option>
                  <a-select-option value='D'>储备全职</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='在职状态' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-switch  v-if="handlePermBox('salary:template:editStatus')" @change='statusChange($event)' :checked="status == 'Y'"></a-switch>
                <span v-else> {{status == 'Y'?'在职':'离职'}}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='身份证号' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-input placeholder='请输入身份证号'
                         v-decorator="['userIdcard', { rules: [{ required: false, message: '请输入身份证号' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='住址' :labelCol='{ span: 3 }' :wrapperCol='{ span: 12 }'>
                <a-input placeholder='请输入住址'
                         v-decorator="['address', { rules: [{ required: false, message: '请输入住址' }] }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='紧急联系人' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-input placeholder='请输入紧急联系人'
                         v-decorator="['emergencyContact', { rules: [{ required: false, message: '请输入紧急联系人' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='紧急联系人手机号' :labelCol='{ span: 8 }' :wrapperCol='{ span: 12 }'>
                <a-input
                  placeholder='请输入紧急联系人手机号'
                  v-decorator="['emergencyPhone', { rules: [{ required: false, message: '请输入紧急联系人手机号' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='入职时间' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-date-picker
                  format='YYYY-MM-DD'
                  placeholder='请选择时间'
                  v-decorator="['inductionDate', { rules: [{ required: true, message: '请选择时间' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item :label="officialType == 'A' ? '最近一次全职合同签订时间' : '最近一次兼职合同签订时间'" :labelCol='{ span:12}'
                           :wrapperCol='{ span: 12 }'>
                <a-date-picker
                  format='YYYY-MM-DD'
                  placeholder='请选择时间'
                  v-decorator="['contractDate', { rules: [{ required: true, message: '请选择时间' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='离职时间' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-date-picker
                  v-show="handlePermBox('salary:template:editStatus')"
                  format='YYYY-MM-DD'
                  valueFormat='YYYY-MM-DD'
                  placeholder='请选择时间'
                  v-decorator="['leaveDate', { rules: [{ required: false, message: '请选择时间' }] }]"
                />
                <span v-show="!handlePermBox('salary:template:editStatus')"> {{this.userInfo.leaveDate?this.userInfo.leaveDate.slice(0,10):''}}</span>
              </a-form-item>
            </a-col>
            <!-- <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="续签时间" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                <a-date-picker
                  format="YYYY-MM-DD"
                  placeholder="请选择时间"
                  v-decorator="['renewalDate', { rules: [{ required: false, message: '请选择时间' }] }]"
                />
              </a-form-item>
            </a-col> -->
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
              <a-form-item label='社保情况' :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
                <a-radio-group v-model='socialSecurity'>
                  <a-radio value='0'>未交</a-radio>
                  <a-radio value='1'>已交</a-radio>
                  <a-radio value='2'>已停办</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24'>
              <a-form-item label='入职合同' :labelCol='{ span: 3 }' :wrapperCol='{ span: 19 }'>
                <UploadDrgger ref='uploadBank' @uploadSuccess='UploadDrggerSuccess' :multiple='false'
                              :value='attachment' />
              </a-form-item>
            </a-col>
            <a-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24'>
              <a-form-item label='备注' :labelCol='{ span: 3 }' :wrapperCol='{ span: 19 }'>
                <a-textarea :maxLength='300' v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]" :auto-size='{ minRows: 3, maxRows: 5 }' />
              </a-form-item>
            </a-col>
          </a-row>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal :maskClosable='$store.state.modalMaskClickEnable' title='修改' v-model='dissmissionModal' width='800px'
             @ok='sendDissForm()' okText='提交'>
      <a-form :form='dissForm'>
        <a-row>
          <!-- dissmissionModal -->
          <a-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
            <a-form-item :label="dissmissionType == 'Y' ? '入职时间' : '离职时间'" :labelCol='{ span: 6 }'
                         :wrapperCol='{ span: 16 }'>
              <a-date-picker
                format='YYYY-MM-DD'
                valueFormat='YYYY-MM-DD'
                placeholder='请选择时间'
                v-decorator="['leaveDate', { rules: [{ required: true, message: '请选择时间' }] }]"
              />
              <!-- :disabledDate="disabledDateDiss" -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal :maskClosable='$store.state.modalMaskClickEnable' title='续签记录' v-model='ContinueRecordModel' width='800px' :footer='false'>
      <ContinueRecord ref='continueRecord'></ContinueRecord>
    </a-modal>
    <a-modal :maskClosable='$store.state.modalMaskClickEnable' title='修改' v-model='fullTimeModal' width='800px'
             @ok='sendFullTimeForm()' okText='提交'>
      <a-form :form='fullTimeForm'>
        <a-row>
          <a-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24'>
            <a-form-item label="转全职时间" :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
              <a-date-picker
                format='YYYY-MM-DD'
                valueFormat='YYYY-MM-DD'
                placeholder='请选择时间'
                v-decorator="['transferFullDate', { rules: [{ required: true, message: '请选择时间' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24'>
            <a-form-item label="全职工龄(月)" :labelCol='{ span: 6 }' :wrapperCol='{ span: 16 }'>
              {{fullTimeInfo.fullTimeService}}
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable, SearchComPro, PermBox, UploadBank, UploadDrgger } from '@/components'
import {
  pageTeacherContract,
  removeSalTemplate,
  saveSalTemplate,
  enableSalTemplate,
  changeUserLoginState,
  resetPwd,
  salaryList,
  querySalTemplateDetails,
  editTransferDate
} from '@/api/education'
import { scopeDanceList, scopeListArea, checkCardbin } from '@/api/common'
import moment from 'moment'
import ContinueRecord from './modules/continueRecord'
const columns = [
  {
    title: '地区',
    dataIndex: 'areaName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '姓名',
    dataIndex: 'teacherName',
    scopedSlots: { customRender: 'teacherName' }
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    scopedSlots: { customRender: 'nickname' }
  },
  {
    title: '人群',
    dataIndex: 'teacherCrowd',
    customRender: (text, record) => (text === '1' ? '成人' : text === '2' ? '少儿' : text === '3' ? '通用' : '')
  },
  {
    title: '联系方式',
    dataIndex: 'teacherMobile'
  },
  {
    title: '工龄（月）',
    dataIndex: 'lengthOfService'
  },
  {
    title: '全职工龄（月）',
    dataIndex: 'fullTimeService',
    scopedSlots: { customRender: 'fullTimeService' }
  },
  {
    title: '入职时间',
    dataIndex: 'inductionDate',
    scopedSlots: { customRender: 'inductionDate' }
  },
  {
    title: '离职时间',
    dataIndex: 'leaveDate',
    scopedSlots: { customRender: 'leaveDate' }
  },
  {
    title: '社保情况',
    dataIndex: 'socialSecurity',
    customRender: text => (text == '0' ? '未交' : text == '1' ? '已交' : text == '2' ? '已停办' : '')
  },
  {
    title: '正式员工',
    dataIndex: 'official',
    customRender: (text, record) => (text === 'A' ? '全职' : text === 'D' ? '储备全职' : text === 'C' ? '兼职' : '')
  },
  {
    title: '入职合同',
    dataIndex: 'isContact'
  },
  {
    title: '在职状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '允许登录',
    dataIndex: 'userLoginState',
    key: 'userLoginState',
    scopedSlots: { customRender: 'userLoginState' }
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'stusource',
  components: {
    SearchComPro,
    PermBox,
    STable,
    UploadBank,
    UploadDrgger,
    ContinueRecord
  },
  data() {
    return {
      fullTimeInfo:{},
      fullTimeModal:false,
      continueRecordInfo:{},
      ContinueRecordModel:false,
      loading:false,
      crowdList: [{ id: '1', name: '成人' }, { id: '2', name: '少儿' }, { id: '3', name: '通用' }], //人群
      //离职
      dissTeacherId: '',
      dissInductionDate: '',
      dissmissionModal: false,
      dissmissionType: '',
      areaList: [],
      danceList: [],
      columns,
      stusourceList: [],
      tableLoading: false,
      formValues: {},
      status: 'Y',
      socialSecurity: '0',
      stusourceModal: false,
      searchParams: [
        {
          type: 'select', //动态select框
          key: 'areaId',
          isShow: !!!this.$store.getters.school_id,
          label: '地区',
          placeholder: '请选择地区',
          apiOption: {
            api: scopeListArea, // promise类型的接口
            string: 'deptName',
            value: 'id'
          }
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: scopeDanceList, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'text', // 点击弹框选择类型
          key: 'name', // 根据key来筛选
          label: '关键字',
          placeholder: '请输入姓名、昵称或手机号码'
        },
        {
          type: 'select',
          key: 'official',
          label: '是否全职',
          placeholder: '请选择是否全职员工',
          allowClear: true,
          staticArr: [{ string: '全职', value: 'A' }, { string: '兼职', value: 'C' }, { string: '储备全职', value: 'D' }]
        },
        {
          type: 'select',
          key: 'status',
          label: '在职状态',
          placeholder: '请选择在职状态',
          allowClear: true,
          staticArr: [{ string: '在职', value: 'Y' }, { string: '离职', value: 'N' }]
        },        {
          type: 'select',
          key: 'isContact',
          label: '入职合同',
          placeholder: '请选择入职合同',
          allowClear: true,
          staticArr: [{ string: '有', value: 'Y' }, { string: '无', value: 'N' }]
        },
        {
          type: 'date',
          key: 'InductionDate',
          label: '入职时间',
          placeholder: '报名日期',
          format: 'YYYY-MM-DD',
        },
        {
          type: 'date',
          key: 'LeaveDate',
          label: '离职时间',
          placeholder: '报名日期',
          format: 'YYYY-MM-DD',
        },
      ],
      queryParam: {},
      userInfo:{},
      loadData: parameter => {
        return pageTeacherContract(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      officialType: 'A',
      attachment: []
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.name == 'teacherContract') {
          this.initparams()
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeCreate() {
    this.stusourceForm = this.$form.createForm(this)
    this.dissForm = this.$form.createForm(this)
    this.fullTimeForm = this.$form.createForm(this)
  },
  methods: {
    handleEditfullTime(record){
      this.fullTimeInfo=record
      this.fullTimeModal=true
      this.$nextTick(res=>{
        this.fullTimeForm.setFieldsValue({transferFullDate:record.transferFullDate?.slice(0,10)})
      })
    },
    initparams() {
      let { danceId, areaId, status, startDate, endDate } = this.$route.query
      this.queryParam = Object.assign(this.queryParam, {
        danceId: danceId || '',
        areaId: areaId || ''
      })
      if(areaId) this.searchParams[0].initialValue = areaId.split(',')
      if(danceId) this.searchParams[1].initialValue = danceId.split(',')
      // if(status) this.searchParams[4].initialValue = status.split(',')
      if(status==='Y'){
        this.queryParam.startInductionDate=startDate || ''
        this.queryParam.endInductionDate=endDate || ''
        if(startDate&&endDate) this.searchParams[6].defaultVal = [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      }else if(status==='N'){
        this.queryParam.startLeaveDate=startDate || ''
        this.queryParam.endLeaveDate=endDate || ''
        if(startDate&&endDate) this.searchParams[7].defaultVal = [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      }
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    UploadDrggerSuccess(data) {
      this.attachment = data
    },
    officialChange(e) {
      this.officialType = e
    },
    verifyPhone(rule, value, callback) {
      this.$verify.phone(rule, value, callback, 'edit')
    },
    disabledDateDiss(current) {
      let obj = moment(current).format('YYYY-MM-DD')
      let dissInductionDate = this.dissInductionDate.slice(0, 10)
      if (dissInductionDate) {
        return dissInductionDate > obj
      } else {
        return false
      }
    },
    disabledDate(current) {
      let obj = moment(current).format('YYYY-MM-DD')
      let inductionDate = this.stusourceForm.getFieldValue('inductionDate')
      if (inductionDate) {
        let start = this.$tools.tailor.getDate(inductionDate)
        return start > obj
      } else {
        return false
      }
    },
    // 入职时间大于1年,正式员工,在职...给一个红色提醒
    remindSocialSecurity(record) {
      const diffDate = this.$tools.tailor.compareToday(record.inductionDate, 'years')
      if (diffDate >= 1 && record.status === 'Y' && record.official === 'official') {
        return true
      } else {
        return false
      }
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    initForm() {
      const {
        stusourceForm: { resetFields },
        _loadModalData
      } = this
      resetFields()
      this.status = 'Y'
      this.socialSecurity = '0'
      this.formValues = {}
      this.attachment = []
      return _loadModalData()
    },
    _loadModalData() {
      return Promise.all([
        scopeDanceList().then(res => {
          this.danceList = res.data
        }),
        scopeListArea().then(res => {
          this.areaList = res.data
        })
      ])
    },
    statusChange(e) {
      this.status = e ? 'Y' : 'N'
    },
    sendFullTimeForm() {
      const {
        fullTimeForm: { validateFields },
        _refreshTable
      } = this
      validateFields().then(values => {
        let params = Object.assign(values,{teacherId: this.fullTimeInfo.teacherId})
        editTransferDate(params)
          .then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.fullTimeModal = false
          })
          .finally(() => _refreshTable())
      })
    },
    sendDissForm() {
      // let params = {
      //   enable: 'N',
      //   teacherId: record.teacherId
      // }
      const {
        dissForm: { validateFields },
        _refreshTable
      } = this
      validateFields().then(values => {
        let params = { teacherId: this.dissTeacherId, enable: this.dissmissionType }
        if (this.dissmissionType == 'Y') {
          params = Object.assign(params, {
            inductionDate: values.leaveDate
          })
        } else {
          params = Object.assign(params, values)
        }
        enableSalTemplate(params)
          .then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.dissmissionModal = false
          })
          .finally(() => _refreshTable())
      })
    },
    typeChange(e, record) {
      // if (!e) {
      this.dissTeacherId = record.teacherId
      this.dissInductionDate = record.inductionDate
      this.dissmissionType = e ? 'Y' : 'N'
      this.dissmissionModal = true
      const {
        $nextTick,
        dissForm: { setFieldsValue }
      } = this
      const defaultStart = moment(new Date()).format('YYYY-MM-DD')
      this.$nextTick(() => {
        setFieldsValue({ leaveDate: defaultStart })
      })
      // } else {
      //   let params = {
      //     enable: e ? 'Y' : 'N',
      //     teacherId: record.teacherId
      //   }
      //   enableSalTemplate(params).then(() => {
      //     this._refreshTable()
      //   })
      // }
    },
    handleEditStu(record) {
      this.userInfo={}
      this.stusourceModal = true
      this.tableLoading = true
      this.continueRecordInfo=record
      this.$refs.uploadBank && this.$refs.uploadBank.clearImage()
      const { initForm, databack } = this
      if (record) {
        querySalTemplateDetails({ teacherId: record.id }).then(res => {
          initForm()
            .then(() => {
              databack(Object.assign(res.data, res.data.salSocialSecurity))
            })
            .finally(() => {
              this.tableLoading = false
            })
        })
      } else {
        initForm()
          .then(() => {
          })
          .finally(() => {
            this.tableLoading = false
          })
      }
    },
    databack(record) {
      const {
        $nextTick,
        stusourceForm: { setFieldsValue }
      } = this
      this.formValues.id = record.teacherId
      let tmpObj = Object.assign({}, record)
      this.status = tmpObj.status || 'Y'
      const {
        leaveDate,
        bank,
        bankNo,
        teacherName,
        nickname,
        teacherMobile,
        teacherCrowd,
        areaId,
        id,
        danceId,
        official,
        userIdcard,
        address,
        emergencyContact,
        emergencyPhone,
        uploadFileOwners,
        remark,teacherId
      } = tmpObj
      let backParams = {
        bank,
        bankNo,
        teacherName,
        nickname,
        teacherMobile,
        Crowd: teacherCrowd,
        areaId,
        id:teacherId,
        danceId,
        official,
        userIdcard,
        address,
        emergencyContact,
        emergencyPhone,
        remark
      }
      // this.assumeOffice = tmpObj.assumeOffice || ''
      // this.reInterview = tmpObj.reInterview || ''
      // this.reInterviewPass = tmpObj.reInterviewPass || ''
      backParams.inductionDate = this.$tools.tailor.dateToMoment(tmpObj.inductionDate)
      backParams.contractDate = this.$tools.tailor.dateToMoment(tmpObj.contractDate)
      backParams.renewalDate = this.$tools.tailor.dateToMoment(tmpObj.renewalDate)
      backParams.leaveDate = leaveDate
      this.officialType = official
      this.socialSecurity = tmpObj.socialSecurity
      if (Array.isArray(uploadFileOwners) && uploadFileOwners.length > 0) {
        this.attachment = uploadFileOwners.map(item => {
          return { name: item.uploadFile.fileName, fileId: item.uploadFile.id }
        })
      }
      this.userInfo=backParams
        this.$nextTick(() => {
          setFieldsValue(backParams)
        })
    },
    handleRemove(record) {
      const { $confirm, $notification, _refreshTable } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeSalTemplate({ teacherId: record.id })
            .then(res => {
              $notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            })
            .finally(() => _refreshTable())
        }
      })
    },
    showRecord(){
      this.ContinueRecordModel=true
     this.$nextTick(res=>{
       this.$refs.continueRecord.open(this.continueRecordInfo)
     })
    },
    handleCancel(){
      this.stusourceModal=false
    },
    sendForm() {
      const {
        stusourceForm: { validateFields },
        formValues,
        _refreshTable
      } = this
      validateFields().then(values => {
        values.interviewDate = this.$tools.tailor.getDate(values.interviewDate)
        let params = Object.assign({}, formValues, values)
        params.name = params.teacherName
        params.nickname = params.nickname
        params.mobile = params.teacherMobile
        params.status = this.status
        params.socialSecurity = this.socialSecurity
        params.inductionDate = this.$tools.tailor.getDate(params.inductionDate)
        params.contractDate = this.$tools.tailor.getDate(params.contractDate)
        params.renewalDate = this.$tools.tailor.getDate(params.renewalDate)
        if (this.attachment.length > 0) {
          params.attachment = this.attachment.map(item => item.fileId).join(',')
        } else {
          params.attachment = ''
        }
        this.loading=true
        saveSalTemplate(params)
          .then(res => {
            this.stusourceModal = false
            this.loading=false
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
          })
          .finally(() => {
            this.loading=false
            _refreshTable()
          })
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },

    //是否允许登录
    changeUserLoginState(checked, data) {
      const status = {
        on: checked
      }
      const _this = this

      if (!checked) {
        this.$confirm({
          title: '系统提示',
          content: '确认禁止登录?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            _this.sendUserLoginState(status, data)
          },
          onCancel() {
          }
        })
      } else {
        this.sendUserLoginState(status, data)
      }
    },
    sendUserLoginState(status, data) {
      changeUserLoginState(data.id, status).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this._refreshTable()
      })
    },

    //密码
    resetPwd(record) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认重置密码?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          resetPwd({ teacherId: record.id }).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        },
        onCancel() {
        }
      })
    },
    bankNoChange(event) {
      const {
        target: { value }
      } = event
      this.setBankNo(value)
    },
    setBankNo(value) {
      const {
        stusourceForm: { setFieldsValue }
      } = this
      if (/\S{5}/.test(value)) {
        this.$nextTick(() => {
          setFieldsValue({ ['bankNo']: value })
          if (value.length > 9) {
            checkCardbin({ bankNo: value }).then(res => {
              if (res.code == 200) {
                let data = JSON.parse(res.data)
                setFieldsValue({ ['bank']: data.bank })
              }
            })
          }
        })
      }
    },
    uploadBankSuccess(info) {
      1
      this.setBankNo(info.bankNo)
    },
    exportExcel() {
      const { queryParam } = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        fields.push({ name: k, value: queryParam[k] })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}/salary/template/teacherContract/down`
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

<style scoped></style>
