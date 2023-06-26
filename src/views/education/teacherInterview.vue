<template>
  <div class="teacher-demand-wrapper" ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="btnGroup" style="padding-bottom: 15px;" ref="elementBtn">
        <perm-box perm="salary:interview-log:save">
          <a-button icon="plus-circle" type="primary" @click="handleEditStu()">新增</a-button>
        </perm-box>
        <perm-box style="margin-left:20px;" perm="salary:channel:save">
          <a-button type="primary" @click="handleSource()">渠道管理</a-button>
        </perm-box>
      </div>
      <s-table :showSlider="true" ref="table" size="default" :columns="columns" :data="loadData" rowKey="id" :scroll="{ x: 1600 }">
        <span slot="action" slot-scope="text, record">
          <a href="#" @click="infoHandle(record)">详情</a>
          <!-- <perm-box v-if="record.progress === 0 && !record.result" perm="salary:interview-log:feedback">
            <a href="#" @click="feedbackHandle(record, '0A')">初筛</a>
          </perm-box> -->
          <perm-box v-if="record.progress === 1 && !record.result" perm="salary:interview-log:feedback">
            <a href="#" @click="feedbackHandle(record, 'A')">初试</a>
          </perm-box>
          <perm-box v-if="record.progress === 2 && !record.result" perm="salary:interview-log:feedback">
            <a href="#" @click="feedbackHandle(record, 'B')">复试</a>
          </perm-box>
          <perm-box v-if="record.progress === 3 && !record.result" perm="salary:interview-log:feedback">
            <a href="#" @click="feedbackHandle(record, 'C')">入职</a>
          </perm-box>
          <perm-box perm="salary:interview-log:save">
            <a href="#" @click="handleEditStu(record)">修改</a>
          </perm-box>
          <perm-box perm="salary:interview-log:del">
            <a href="#" @click="handleRemove(record)">删除</a>
          </perm-box>
        </span>
        <span slot="interviewDate" slot-scope="text">
          {{ text | filterDate }}
        </span>
      </s-table>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="详情" v-model="infoModal" :footer="null" width="800px">
      <div class="info_modal">
        <div class="base_info">
          <div class="item" v-for="(item, index) in infoRecord" :key="index">
            <div class="title">{{ item.title }}</div>
            <div class="value">{{ item.value }}</div>
          </div>
        </div>
        <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">附件列表</span></a-divider>
        <div class="download_wrapper">
          <div class="download_item" v-for="(item, index) in fileList" :key="index">
            <div class="file_name">{{ item.fileName }}</div>
            <div class="action_wrapper">
              <a href="javascript:;" @click="downloadAttach(item)">下载</a>
              <a href="javascript:;" @click="openPreviewModal(item)" v-if="item.preview" style="margin-left:10px;">预览</a>
            </div>
          </div>
        </div>
        <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">面试结果</span></a-divider>
        <div class="base_info">
          <div class="item_feed" v-for="(item, index) in infoFeedRecord" :key="index">
            <template v-if="item.value">
              <div class="title">{{ item.title }}</div>
              <div class="value">{{ item.value }}</div>
              <div style="margin-left:10px;">{{ item.date }}</div>
            </template>
          </div>
        </div>
      </div>
    </a-modal>
    <!-- //图片附件预览 -->
    <f-modal
      ref="previewModal"
      id="AttachmentViewer"
      :open-loading="true"
      title="预览照片"
      @initValue="initPreviewModal"
      @closeModal="closeModalHandle"
      :showFooter="false"
    >
      <div>
        <a-button href="javascript:;" @click="rotatePic">旋转</a-button>
      </div>
      <div>
        <img :src="previewSrc" :style="`transform:rotate(${rotateValue}deg)`" width="100%" />
      </div>
    </f-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="面试反馈" v-model="feedModal" width="800px" @ok="sendFormFeed()" okText="提交">
      <div>
        <a-row>
          <a-col v-if="step === '0A'" :md="12" :sm="24" :xs="24">
            <a-form-item label="是否通过初筛" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
              <a-radio-group buttonStyle="solid" v-model="reInterview">
                <a-radio-button value="Y">通过</a-radio-button>
                <a-radio-button value="N">不通过</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col v-if="step === 'A'" :md="12" :sm="24" :xs="24">
            <a-form-item label="是否通过初试" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
              <a-radio-group buttonStyle="solid" v-model="reInterview">
                <a-radio-button value="Y">通过</a-radio-button>
                <a-radio-button value="N">不通过</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col v-if="step === 'B'" :md="12" :sm="24" :xs="24">
            <a-form-item label="是否通过复试" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
              <a-radio-group buttonStyle="solid" v-model="reInterviewPass">
                <a-radio-button value="Y">通过</a-radio-button>
                <a-radio-button value="N">不通过</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col v-if="step === 'C'" :md="12" :sm="24" :xs="24">
            <a-form-item label="是否入职" :labelCol="{ span: 12 }" :wrapperCol="{ span: 12 }">
              <a-radio-group buttonStyle="solid" v-model="assumeOffice">
                <a-radio-button value="Y">是</a-radio-button>
                <a-radio-button value="N">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col v-if="assumeOffice === 'N' || reInterview === 'N' || reInterviewPass === 'N'" :span="24">
            <a-form-item label="未通过原因" :labelCol="{ span: 6 }" :wrapperCol="{ span: 12 }">
              <a-textarea placeholder="请输入未能入职/未通过复试原因" :autosize="{ minRows: 4, maxRows: 8 }" v-model="failReason" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :confirmLoading="confirmLoading"
      title="新增/修改"
      v-model="stusourceModal"
      width="800px"
      @ok="sendForm()"
      okText="提交"
    >
      <a-spin :spinning="spinning">
        <a-form :form="stusourceForm">
          <a-row class="teacher_int_modal">
            <a-row>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="推送日期" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    placeholder="请选择时间"
                    v-decorator="['interviewDate', { rules: [{ required: true, message: '请选择时间' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="渠道来源" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-select :allowClear="true" placeholder="请选择" v-decorator="['channelId', { rules: [{ required: true, message: '请选择' }] }]">
                    <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in channelList" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-form-item style="display: none;">
                <a-input v-decorator="['id']" />
              </a-form-item>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="应聘者姓名" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-input placeholder="请输入应聘者姓名" v-decorator="['name', { rules: [{ required: true, message: '请输入应聘者姓名' }] }]" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="联系方式" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-input placeholder="请输入联系方式" v-decorator="['phone', { rules: [{ required: false, message: ' ' }, { validator: verify }] }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-form-item style="display: none;">
                <a-input v-decorator="['id']" />
              </a-form-item>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="微信号" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-input placeholder="请输入微信号" v-decorator="['wechat', { rules: [{ required: false, message: '请输入微信号' }] }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="应聘舞种" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-select :allowClear="true" placeholder="请选择地区" v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]">
                    <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in danceList" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="地区" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-select :allowClear="true" placeholder="请选择地区" v-decorator="['areaId', { rules: [{ required: true, message: '请选择地区' }] }]">
                    <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in areaList" :key="index">
                      {{ item.deptName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item
                  label="关联导师缺口"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 14 }"
                  v-if="(!this.demandId && this.stusourceForm.getFieldValue('danceId') && this.stusourceForm.getFieldValue('areaId')) || this.demandId"
                >
                  <a-input placeholder="请选择导师" style="color: #000;" disabled v-decorator="['demandName']">
                    <a-icon slot="addonAfter" type="search" class="search-input-searchIcon" @click="openSelectModal" />
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="毕业学校" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-input placeholder="请输入毕业学校" v-decorator="['graduate', { rules: [{ required: false, message: '请输入毕业学校' }] }]" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="专业" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-input placeholder="请输入专业" v-decorator="['major', { rules: [{ required: false, message: '请输入专业' }] }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item label="应聘阶层" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                  <a-select
                    :allowClear="true"
                    placeholder="请选择应聘阶层"
                    v-decorator="['phaseId', { rules: [{ required: false, message: '请选择应聘阶层' }] }]"
                  >
                    <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in phaseList" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item v-bind="{ labelCol: { md: 6, sm: 6, xs: 24 }, wrapperCol: { md: 16, sm: 16, xs: 24 } }" label="附件">
                  <upload-sth ref="uploadsth" :multiple="true" :required="false" btn-text="附件上传" filePath="interview-resume"></upload-sth>
                </a-form-item>
              </a-col>
              <a-col class="download_wrapper" v-if="fileList.length" :md="12" :sm="24" :xs="24">
                <a-form-item v-bind="{ labelCol: { md: 6, sm: 6, xs: 24 }, wrapperCol: { md: 16, sm: 16, xs: 24 } }" label="附件下载">
                  <div class="download_item" v-for="(item, index) in fileList" :key="index">
                    <div class="file_name">{{ item.fileName }}</div>
                    <div class="action_wrapper">
                      <a href="javascript:;" @click="deleteAttach(item)">删除</a>
                      <a-divider type="vertical" />
                      <a href="javascript:;" @click="downloadAttach(item)">下载</a>
                    </div>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12" :sm="24" :xs="24">
                <a-form-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }" label="备注">
                  <a-textarea
                    placeholder="请输入备注"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <!-- <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">面试结果</span></a-divider> -->
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="渠道管理" v-model="sourceModal" width="800px" :footer="null">
      <a-spin :spinning="spinning">
        <edit-table
          :columnsOptions="editColumn"
          :tableArr="editTableList"
          :eidtParams="eidtParams"
          ref="editTable"
          @saved="saveEditLog"
          @delete="deleteEditLog"
        >
        </edit-table>
      </a-spin>
    </a-modal>
    <!-- 老师选择组件 -->
    <choose-tea
      ref="choosetea"
      :multiple="true"
      teaFields="teacher"
      @getBackData="getTeaData"
      :teacherGap="true"
      :danceId="this.stusourceForm.getFieldValue('danceId')"
      :areaId="this.stusourceForm.getFieldValue('areaId')"
    >
    </choose-tea>
  </div>
</template>

<script>
import { verifyMixin } from '@/utils/mixin'
import { STable, SearchComPro } from '@/components'
import {
  listInterviewLog,
  removeInterviewLog,
  saveInterviewLog,
  listInterviewPhase,
  getInterviewLog,
  listSalChannel,
  removeSalChannel,
  saveSalChannel,
  feedbackInterviewLog
} from '@/api/education'
import { listEduDance, listArea } from '@/api/common'
import { downloadFiles, previewFile } from '@/api/file'
import PermBox from '@/components/PermBox'
import DownloadList from '@/components/DownloadList/DownloadList.vue'
import UploadSth from '@/components/UploadSth'
import EditTable from '@/components/EditTable'
import ChooseTea from '@/components/ChooseTea'
const editColumn = [
  {
    title: '渠道名称',
    width: 200,
    dataIndex: 'name',
    input: 'input',
    scopedSlots: { customRender: 'name' }
  }
]
const columns = [
  {
    title: '推送日期',
    dataIndex: 'interviewDate',
    scopedSlots: { customRender: 'interviewDate' }
  },
  {
    title: '渠道',
    dataIndex: 'channelName'
  },
  {
    title: '应聘者姓名',
    dataIndex: 'name'
  },
  {
    title: '联系方式',
    dataIndex: 'phone'
  },
  {
    title: '地区',
    dataIndex: 'areaName'
  },

  {
    title: '应聘舞种',
    dataIndex: 'danceName'
  },
  // {
  //   title: '初筛结果',
  //   dataIndex: 'firstView',
  //   customRender: (text, record) => {
  //     let date = ''
  //     if (record.preliminaryDate) {
  //       date = record.preliminaryDate.split(' ')[0]
  //     }
  //     if (record.progress === 0) {
  //       if (record.result === 'Y') return date ? `通过(${date})` : '通过'
  //       if (record.result === 'N') return date ? `不通过(${date})` : '不通过'
  //       if (record.result === '') return ''
  //     } else if (record.progress > 0) {
  //       return date ? `通过(${date})` : '通过'
  //     } else {
  //       return ''
  //     }
  //   }
  // },
  {
    title: '初试结果',
    dataIndex: 'reInterview',
    customRender: (text, record) => {
      let date = ''
      if (record.firstDate) {
        date = record.firstDate.split(' ')[0]
      }
      if (record.progress === 1) {
        if (record.result === 'Y') return date ? `通过(${date})` : '通过'
        if (record.result === 'N') return date ? `不通过(${date})` : '不通过'
        if (record.result === '') return ''
      } else if (record.progress > 1) {
        return date ? `通过(${date})` : '通过'
      } else {
        return ''
      }
    }
  },
  {
    title: '复试结果',
    dataIndex: 'reInterviewPass',
    customRender: (text, record) => {
      let date = ''
      if (record.retestDate) {
        date = record.retestDate.split(' ')[0]
      }
      if (record.progress === 2) {
        if (record.result === 'Y') return date ? `通过(${date})` : '通过'
        if (record.result === 'N') return date ? `不通过(${date})` : '不通过'
        if (record.result === '') return ''
      } else if (record.progress > 2) {
        return date ? `通过(${date})` : '通过'
      } else {
        return ''
      }
    }
  },
  {
    title: '入职状态',
    dataIndex: 'assumeOffice',
    customRender: (text, record) => {
      let date = ''
      if (record.inductionDate) {
        date = record.inductionDate.split(' ')[0]
      }
      if (record.progress === 3) {
        if (record.result === 'Y') return date ? `通过(${date})` : '通过'
        if (record.result === 'N') return date ? `不通过(${date})` : '不通过'
        if (record.result === '') return ''
      } else {
        return ''
      }
    }
  },
  {
    title: '毕业学校',
    dataIndex: 'graduate',
    width: 200
  },
  {
    title: '专业',
    dataIndex: 'major'
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
    EditTable,
    SearchComPro,
    PermBox,
    STable,
    DownloadList,
    UploadSth,
    ChooseTea
  },
  mixins: [verifyMixin],
  data() {
    return {
      height: 0, //滚动条高度
      infoModal: false,
      infoRecord: [],
      infoFeedRecord: [],
      feedModal: false,
      // editTable
      editColumn,
      editTableList: [],
      sourceModal: false,
      eidtParams: {
        name: null
      },
      spinning: false,
      confirmLoading: false,
      areaList: [],
      danceList: [],
      phaseList: [],
      channelList: [],
      columns,
      stusourceList: [],

      tableLoading: false,
      step: '',
      assumeOffice: '',
      reInterviewPass: '',
      reInterview: '',
      failReason: '',
      formValues: {},
      stusourceModal: false,
      newUploadFiles: [],
      fileList: [],
      searchParams: [
        {
          type: 'date',
          key: 'Interview',
          label: '选择时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          show: true
        },
        {
          type: 'text',
          key: 'name',
          label: '姓名/联系方式',
          placeholder: '姓名/手机/微信',
          show: true
        },
        {
          type: 'select',
          key: 'channelId',
          label: '渠道',
          placeholder: '请选择渠道',
          apiOption: {
            api: listSalChannel,
            string: 'name',
            value: 'id'
          },
          show: true
        },
        {
          type: 'select',
          key: 'areaId',
          label: '地区',
          placeholder: '请选择地区',
          apiOption: {
            api: listArea,
            string: 'deptName',
            value: 'id'
          },
          show: true
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
          },
          show: true
        },
        {
          type: 'select',
          key: 'phaseId',
          label: '应聘阶层',
          placeholder: '请选择应聘阶层',
          apiOption: {
            api: listInterviewPhase,
            string: 'name',
            value: 'id'
          },
          show: true
        },
        {
          type: 'select',
          key: 'interviewed',
          label: '是否面试',
          placeholder: '请选择',
          allowClear: true,
          staticArr: [{ string: '是', value: 'true' }, { string: '否', value: 'false' }]
        },
        ,
        {
          type: 'select',
          key: 'status',
          label: '面试类型',
          placeholder: '请选择',
          allowClear: true,
          staticArr: [
            // { string: '初筛', value: '0A' },
            { string: '初试', value: 'A' },
            { string: '复试', value: 'B' },
            { string: '入职', value: 'C' }
          ]
        },
        {
          // initialValue: 'A',
          placeholder: '面试日期',
          type: 'dateSlot',
          key: 'Date',
          selectKey: 'dateType',
          label: '面试步骤',
          pllotaceholder: '请选择时间',
          format: 'YYYY-MM-DD',
          lg: 0,
          md: 0,
          sm: 0,
          staticArr: [
            // {
            //   string: '初筛',
            //   value: 'A'
            // },
            {
              string: '初试',
              value: 'B'
            },
            {
              string: '复试',
              value: 'C'
            },
            {
              string: '入职',
              value: 'D'
            }
          ]
        }
      ],
      queryParam: null,
      loadData: parameter => {
        return listInterviewLog(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      previewSrc: null,
      fileId: null,
      rotateValue: 0,
      demandId: null,
      demandName: null
    }
  },
  beforeCreate() {
    this.stusourceForm = this.$form.createForm(this)
  },

  methods: {
    getTeaData(data) {
      console.log(data)
      let type = data[0].target === 'A' ? '成人' : '少儿'
      let msg = `${type}/${data[0].phaseName}/${data[0].specialty}`
      this.stusourceForm.setFieldsValue({ ['demandName']: msg })
      this.demandId = data[0].id
    },
    openSelectModal() {
      this.$refs.choosetea.open()
    },
    //图片附件预览
    openPreviewModal(record) {
      const { id } = record
      this.fileId = id
      this.previewSrc = null
      this.$refs.previewModal.open()
    },
    initPreviewModal() {
      const { fileId } = this
      previewFile({ fileId })
        .then(res => {
          this.previewSrc = res.data
        })
        .finally(() => {
          this.$refs.previewModal.spinning = false
        })
    },
    closeModalHandle() {
      this.rotateValue = 0
    },
    //图片旋转
    rotatePic() {
      this.rotateValue += 90
    },
    // 详情
    async infoHandle(record) {
      let date = {}
      const { data } = await getInterviewLog(record.id)
      if (data) {
        date.firstDate = data.firstDate
        date.retestDate = data.retestDate
        date.inductionDate = data.inductionDate
        date.preliminaryDate = data.preliminaryDate
        console.log(date)
        const { uploadFile } = data
        console.log(uploadFile)
        uploadFile.forEach(item => {
          let index = item.fileName.indexOf('.')
          let type = item.fileName.substring(index + 1, item.fileName.length)
          let typeArr = ['jpeg', 'bmp', 'jpg', 'png', 'tif', 'gif', 'svg', 'psd']
          if (typeArr.includes(type)) {
            item.preview = true
          } else {
            item.preview = false
          }
        })
        this.fileList = uploadFile
      }
      // .then(res => {
      //   console.log(res)
      //   date.firstDate = res.data.firstDate
      //   date.retestDate = res.data.retestDate
      //   date.inductionDate = res.data.inductionDate
      //   console.log(date)
      //   const { uploadFile } = res.data
      //   console.log(uploadFile)
      //   uploadFile.forEach(item => {
      //     let index = item.fileName.indexOf('.')
      //     let type = item.fileName.substring(index+1,item.fileName.length)
      //     let typeArr = ['jpeg','bmp','jpg','png','tif','gif','svg','psd']
      //     if(typeArr.includes(type)) {
      //       item.preview = true
      //     }else {
      //       item.preview = false
      //     }
      //   });
      //   this.fileList = uploadFile
      // })
      // this.fileList.
      this.infoRecord = [
        { title: '推送日期 : ', value: record.interviewDate },
        { title: '渠道来源 : ', value: record.channelName },
        { title: '应聘者姓名 : ', value: record.name },
        { title: '联系方式 : ', value: record.phone },
        { title: '微信号 : ', value: record.wechat },
        { title: '地区 : ', value: record.areaName },
        { title: '应聘舞种 : ', value: record.danceName },
        { title: '毕业学校 : ', value: record.graduate },
        { title: '专业 : ', value: record.major },
        { title: '应聘阶层 : ', value: record.phaseName },
        { title: '备注 : ', value: record.remark }
      ]
      console.log(date)
      this.infoFeedRecord = [
        // {
        //   title: '初筛结果 : ',
        //   value: record.preliminary === 'Y' ? '通过' : record.preliminary === 'N' ? '未通过' : '',
        //   date: date.preliminaryDate
        // },
        {
          title: '初试结果 : ',
          value: record.reInterview === 'Y' ? '通过' : record.reInterview === 'N' ? '未通过' : '',
          date: date.firstDate
        },
        {
          title: '复试结果 : ',
          value: record.reInterviewPass === 'Y' ? '通过' : record.reInterviewPass === 'N' ? '未通过' : '',
          date: date.retestDate
        },
        { title: '是否入职 : ', value: record.assumeOffice === 'Y' ? '是' : record.assumeOffice === 'N' ? '否' : '', date: date.inductionDate },
        { title: '未通过原因 : ', value: record.failReason }
      ]
      this.infoModal = true
    },
    feedbackHandle(record, step) {
      // conso
      this.initFeedBack()
      this.feedModal = true
      this.feedId = record.id
      this.step = step
    },
    initFeedBack() {
      this.feedId = ''
      this.assumeOffice = ''
      this.reInterviewPass = ''
      this.reInterview = ''
      this.failReason = ''
    },
    sendFormFeed() {
      if (this.step === '0A') {
        this.step = null
      }
      const { step, feedId, assumeOffice, reInterviewPass, reInterview, failReason } = this
      let params = {
        interviewLogId: feedId,
        step,
        reason: failReason
      }
      if (this.step === null) {
        params.status = reInterview
      }
      if (this.step === 'A') {
        params.status = reInterview
      }
      if (this.step === 'B') {
        params.status = reInterviewPass
      }
      if (this.step === 'C') {
        params.status = assumeOffice
      }
      feedbackInterviewLog(params)
        .then(res => {
          this.feedModal = false
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
        })
        .finally(() => {
          this._refreshTable()
        })
    },
    // editTable
    handleSource() {
      this.sourceModal = true
      this.spinning = true
      listSalChannel()
        .then(res => {
          this.editTableList = res.data
        })
        .finally(() => {
          this.spinning = false
        })
    },
    getEditList() {
      const { dancePlanId } = this
      listSalChannel().then(res => {
        this.editTableList = res.data
      })
    },
    saveEditLog(item) {
      const { dancePlanId } = this
      saveSalChannel(Object.assign({ dancePlanId }, item)).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.getEditList()
        this.$refs.editTable.cancelTableItem()
      })
    },
    deleteEditLog(item) {
      const { id } = item
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeSalChannel(id).then(res => {
            _this.getEditList()
            _this.$refs.editTable.cancelTableItem()
          })
        }
      })
    },
    deleteAttach(data) {
      this.fileList = this.fileList.filter(item => item.id !== data.id)
      console.log(this.fileList)
    },
    downloadAttach(data) {
      const { id } = data
      downloadFiles({ fileId: id }).then(res => {
        this.downloadBySrc(res.data)
      })
    },
    downloadBySrc(src, fileName = 'test') {
      console.log('src =>', src)
      const a = document.createElement('a')
      a.download = `${fileName}`
      a.href = src
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(a.href)
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
      this.formValues = {}
      this.fileList = []
      this.demandId = null
      this.demandName = null
      // this.assumeOffice = ''
      // this.reInterviewPass = ''
      // this.reInterview = ''
      this.$nextTick(() => {
        this.$refs.uploadsth.reset()
      })
      return _loadModalData()
    },
    _loadModalData() {
      return Promise.all([
        listInterviewPhase().then(res => {
          this.phaseList = res.data
        }),
        listEduDance().then(res => {
          this.danceList = res.data
        }),
        listArea().then(res => {
          this.areaList = res.data
        }),
        listSalChannel().then(res => {
          this.channelList = res.data
        })
      ])
    },
    handleEditStu(record) {
      this.stusourceModal = true
      this.tableLoading = true
      const { initForm, databack } = this
      initForm()
        .then(() => {
          record ? databack(record) : ''
        })
        .finally(() => {
          this.tableLoading = false
        })
    },

    databack(record) {
      this.spinning = true
      getInterviewLog(record.id)
        .then(res => {
          const { uploadFile, remark, demandDetail, demandId, demandPhase } = res.data
          if (demandDetail) {
            let type = demandDetail.target === 'A' ? '成人' : '少儿'
            this.demandName = `${type}/${demandPhase.name}/${demandDetail.specialty}`
          }
          this.demandId = demandId
          this.fileList = uploadFile
          this.remark = remark
        })
        .then(() => {
          const {
            $nextTick,
            stusourceForm: { setFieldsValue }
          } = this
          this.formValues.id = record.id
          let tmpObj = Object.assign({}, record)
          // this.assumeOffice = tmpObj.assumeOffice || ''
          // this.reInterview = tmpObj.reInterview || ''
          // this.reInterviewPass = tmpObj.reInterviewPass || ''
          delete tmpObj.areaName
          delete tmpObj.createDate
          delete tmpObj.danceName
          delete tmpObj.reserve
          delete tmpObj.phaseName
          delete tmpObj.assumeOffice
          delete tmpObj.reInterview
          delete tmpObj.reInterviewPass
          delete tmpObj.channelName
          delete tmpObj.failReason

          tmpObj.interviewDate = this.$tools.tailor.dateToMoment(tmpObj.interviewDate)
          tmpObj.remark = this.remark
          if (this.demandName) {
            tmpObj.demandName = this.demandName
          }
          console.log(tmpObj)
          this.$nextTick(() => {
            setFieldsValue(tmpObj)
            // setFieldsValue({['demandName']:this.demandName})
          })
        })
        .finally(() => {
          this.spinning = false
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
          removeInterviewLog(record.id)
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
    sendForm() {
      const {
        stusourceForm: { validateFields },
        formValues,
        _refreshTable,
        reInterviewPass,
        reInterview,
        assumeOffice
      } = this
      validateFields().then(values => {
        console.log(values)
        // return
        values.interviewDate = this.$tools.tailor.getDate(values.interviewDate)
        let params = Object.assign({}, formValues, values, {
          assumeOffice,
          reInterviewPass,
          reInterview,
          demandId: this.demandId
        })
        this.confirmLoading = true
        this.$refs.uploadsth
          .multipleHandleUpload()
          .then(res => {
            res = res ? res : ''
            let attachments = res.split(',')
            let hasAttachments = this.fileList.map(i => i.id)
            return [...attachments, ...hasAttachments]
          })
          .then(attachmentsList => {
            params.attachments = attachmentsList.join(',')
            return saveInterviewLog(params)
          })
          .then(res => {
            this.stusourceModal = false
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
          })
          .finally(() => {
            this._refreshTable()
            this.confirmLoading = false
          })
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less">
.info_modal {
  .base_info {
    display: flex;
    flex-wrap: wrap;
    .item {
      flex: 0 0 50%;
      display: flex;
      height: 40px;
      margin-bottom: 10px;
      .value {
        margin-left: 10px;
      }
    }
    .item_feed {
      flex: 0 0 100%;
      display: flex;
      padding: 5px 0;
      margin-bottom: 10px;
      .value {
        margin-left: 10px;
        // width: 50px;
      }
    }
  }
  .download_wrapper {
    .download_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      width: 350px;
      border-bottom: 1px solid #eee;
      .file_name {
        width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .action_wrapper {
        width: 100px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .info_modal {
    .base_info {
      display: flex;
      flex-wrap: wrap;
      .item {
        flex: 0 0 100%;
      }
    }
    .download_wrapper .download_item {
      width: 100%;
    }
  }
}
.teacher_int_modal {
  .download_wrapper {
    .download_item {
      display: flex;
      justify-content: space-between;
      width: 250px;
      border-bottom: 1px solid #eee;
      .file_name {
        width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .action_wrapper {
        width: 100px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}
</style>
