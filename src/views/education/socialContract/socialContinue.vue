<template>
  <div class='teacher-demand-wrapper'>
    <a-card :bordered='false' :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit='searchSubmit' :searchParams='searchParams'></search-com-pro>
    </a-card>
    <a-card :bordered='false'>
      <div class='btnGroup' style='margin-bottom: 15px;'>
        <a-space :size='15'>
          <perm-box perm='salary:socialSecurity:down'>
            <a-button icon='download' type='primary' @click.native='exportExcel'>导出</a-button>
          </perm-box>
        </a-space>
        <div style="text-align:right; margin: 10px 0; " ref="elementBtn">
          <a-radio-group @change="changeCheck" :default-value="socialStatus"  v-model="socialStatus">
              <a-radio-button value="A">待续签</a-radio-button>
            <a-radio-button value="B">已续签</a-radio-button>
            <a-radio-button value="C">全部</a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <s-table ref='table' size='default' :columns='columns' :data='loadData' rowKey='id'>
        <span slot='action' slot-scope='text, record'>
          <perm-box perm='salary:socialSecurity:save' v-if='record.type==="A"'>
            <a href='#' @click='handleApply(record,true)'>续签</a>
          </perm-box>
            <a href='#' @click='handleApply(record,false)'>续签记录</a>
        </span>
      </s-table>
    </a-card>
    <a-modal
      :maskClosable='$store.state.modalMaskClickEnable'
      title="续签"
      v-model='stusourceModal'
      width='600px'
      @ok='sendForm()'
      :confirmLoading='loading'
      okText='提交'
    >
      <div class='mb20'>
        <span>老师姓名：{{ teacherInfo.teacherName }}</span>
        <span class='ml20'>手机号：{{ teacherInfo.teacherMobile }}</span>
        <span class='ml20'>入职时间：{{ teacherInfo.inductionDate?teacherInfo.inductionDate.slice(0,10):'' }}</span>
      </div>
      <a-form :form='stusourceForm' >
        <a-form-item label='员工类型' :labelCol='{ span: 5 }' :wrapperCol='{ span: 15 }'>
          <a-select
            :allowClear='true'
            placeholder='请选择'
            v-decorator="[
                    'official',
                    {
                      rules: [{ required: true, message: '请选择' }],
                      initialValue: 'A'
                    }
                  ]"
          >
            <a-select-option value='A'>全职</a-select-option>
            <a-select-option value='C'>兼职</a-select-option>
            <a-select-option value='D'>储备全职</a-select-option>
          </a-select>
        </a-form-item>
          <a-form-item label="合同签订时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
            <a-date-picker
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              placeholder="请选择时间"
              style='width:100%;'
              v-decorator="['effectiveDate', { rules: [{ required: true, message: '请选择时间' }] }]"
            />
          </a-form-item>
        <a-form-item label='合同附件' :labelCol='{ span: 5 }' :wrapperCol='{ span: 15 }'>
          <UploadDrgger ref='uploadBank' @uploadSuccess='UploadDrggerSuccess' :multiple='false'
                        :value='attachment' />
        </a-form-item>
        <a-form-item label='备注' :labelCol='{ span: 5}' :wrapperCol='{ span: 15 }'>
          <a-textarea v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]" :auto-size='{ minRows: 5, maxRows: 10 }' />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :maskClosable='$store.state.modalMaskClickEnable'
      title="续签记录"
      v-model='stusourceInfoModal'
      width='800px'
      @ok='sendForm()'
      :footer='null'
    >
      <ContinueRecord ref='continueRecord'></ContinueRecord>
    </a-modal>
  </div>
</template>

<script>
import { scopeDanceList, scopeListArea } from '@/api/common'
import {  contractRenewal, socialDetail, pageContractRenewal } from '@/api/education'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable, SearchComPro, PermBox ,UploadDrgger} from '@/components'
import ContinueRecord from '../modules/continueRecord'
import moment from 'moment'
const columns = [
  {
    title: '地区',
    dataIndex: 'deptName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '姓名',
    dataIndex: 'teacherName',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
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
    title: '入职时间',
    dataIndex: 'inductionDate',
    customRender: (text, record) => (text?.slice(0,10))
  },
  {
    title: '当前合同签订时间',
    dataIndex: 'contractDate',
    customRender: (text, record) => (text?.slice(0,10))
  },
  {
    title: '员工类型',
    dataIndex: 'official',
    customRender: (text, record) => (text === 'A' ? '全职' : text === 'B' ? '试用' : text === 'C' ? '兼职' : text === 'D' ? '储备全职' : '')
  },
  {
    title: '生成时间',
    dataIndex: 'createDate',
    customRender: (text, record) => (text?.slice(0,10))
  },
  {
    title: '最后操作时间',
    dataIndex: 'updateDate'
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
  export default {
    name: 'socialApply',
    components: {
      STable, SearchComPro, PermBox,UploadDrgger,ContinueRecord
    },
    data() {
      return {
        loading:false,
        stusourceInfoModal:false,
        teacherInfo:{},
        stusourceModal:false,
        columns,
        searchParams: [
          {
            type: 'select', //动态select框
            key: 'deptAreaId',
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
            key: 'teacherInfo', // 根据key来筛选
            label: '关键字',
            placeholder: '请输入姓名、昵称或手机号码'
          },
          {
            type: 'date',
            key: 'Date',
            label: '生成时间',
            placeholder: '请选择时间',
            format: 'YYYY-MM-DD'
          },
          {
            type: 'date',
            key: 'OperateDate',
            label: '最后操作时间',
            placeholder: '请选择时间',
            format: 'YYYY-MM-DD'
          },          {
            type: 'date',
            key: 'RenewalDate',
            label: '合同签订时间',
            placeholder: '请选择时间',
            format: 'YYYY-MM-DD'
          }
        ],
        queryParam: {

        },
        socialStatus:'A',
        loadData: parameter => {
          return pageContractRenewal(Object.assign(parameter, this.queryParam,{type:this.socialStatus})).then(res => {
            return res
          })
        },
        attachment: []
      }
    },
    beforeCreate() {
      this.stusourceForm = this.$form.createForm(this)
    },
    created() {

    },
    methods: {
      sendForm() {
        const {
          stusourceForm: { validateFields },
          _refreshTable
        } = this
        validateFields().then(values => {
          let params = Object.assign({socialId:this.teacherInfo.socialId}, values)
          if (this.attachment.length > 0) {
            params.attachment = this.attachment.map(item => item.fileId).join(',')
          } else {
            params.attachment = ''
          }
          this.loading=true
          contractRenewal(params)
            .then(res => {
              this.stusourceModal = false
              this.loading=false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.$emit('refresh')
            })
            .finally(() => {
              this.loading=false
              _refreshTable()
            })
        })
      },
      changeCheck(e){
        this._refreshTable()
      },
      UploadDrggerSuccess(data) {
        this.attachment = data
      },
      handleApply(record,type){
        this.teacherInfo=record
        if(type){
          this.stusourceModal=true
          this.attachment=[]
          this.$nextTick(res=>{
            this.stusourceForm.setFieldsValue({ official: record.official,effectiveDate:'',remark:'' })
          })
        }else{
          // socialDetail({socialId:record.socialId}).then(res=>{
            this.stusourceInfoModal=true
            this.$nextTick(res=>{
              this.$refs.continueRecord.open(record)
            })
          // })
        }
      },
      searchSubmit(data) {
        this.queryParam = data
        this.$emit('refresh')
        this._refreshTable()
      },
      _refreshTable() {
        this.$refs.table.refresh()
      },
      exportExcel() {
        const { queryParam } = this
        const token = Vue.ls.get(ACCESS_TOKEN)
        let fields = [{ name: 'auth_token', value: token }]
        for (let k in queryParam) {
          fields.push({ name: k, value: queryParam[k] })
        }
        fields.push({ name: 'type', value: this.socialStatus })
        const form = document.createElement('form')
        form.action = `${process.env.VUE_APP_URL}/social/security/contractRenewalDown`
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

<style scoped lang=less>
  .classPlans {
    header {
      margin-bottom: 20px;

      .title {
        font-size: 18px;
        font-weight: 700;
      }
    }

    .ant-checkbox-group {
      width: 100% !important;
    }
  }

  .classPlanForm {
    .title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
    }
  }

  .card {
    margin-bottom: 24px;
  }

  .wr-container {
    .wr-class {
      .wr-week {
        margin-bottom: 15px;
      }
    }
  }
</style>
