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
              <a-radio-button value="A">待增员</a-radio-button>
            <a-radio-button value="B">已增员</a-radio-button>
            <a-radio-button value="C">全部</a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <s-table ref='table' size='default' :columns='columns' :data='loadData' rowKey='id'>
        <span slot='action' slot-scope='text, record'>
          <perm-box perm='salary:socialSecurity:save' v-if='record.type==="A"'>
            <a href='#' @click='handleApply(record,true)'>社保办理</a>
          </perm-box>
            <a href='#' v-if='record.type==="B"' @click='handleApply(record,false)'>办理详情</a>
        </span>
      </s-table>
    </a-card>
    <a-modal
      :maskClosable='$store.state.modalMaskClickEnable'
      title="社保办理"
      v-model='stusourceModal'
      width='800px'
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
        <a-form-item label='开始缴纳月份' :labelCol='{ span: 4 }' :wrapperCol='{ span: 14 }' >
          <a-month-picker
            format='YYYY-MM'
            valueFormat='YYYY-MM'
            placeholder='请选择月份'
            v-decorator="['effectiveDate', { rules: [{ required: true, message: '请选择月份' }] }]"
          />
        </a-form-item>
        <a-form-item label='备注' :labelCol='{ span: 4}' :wrapperCol='{ span: 14 }'>
          <a-textarea v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]" :auto-size='{ minRows: 5, maxRows: 10 }' />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :maskClosable='$store.state.modalMaskClickEnable'
      title="社保办理详情"
      v-model='stusourceInfoModal'
      width='800px'
      @ok='sendForm()'
      :footer='null'
    >
      <div class='mb20'>
        <span>老师姓名：{{ teacherInfo.name }}</span>
        <span class='ml20'>手机号：{{ teacherInfo.mobile }}</span>
        <span class='ml20'>入职时间：{{ teacherInfo.inductionDate?teacherInfo.inductionDate.slice(0,10):'' }}</span>
      </div>
      <div >
        <div class='mb20'>开始缴纳月份 <span class='ml20'>{{teacherInfo.effectiveDate?teacherInfo.effectiveDate.slice(0,7):''}}</span></div>
        <div>备注 <span class='ml20'>{{teacherInfo.remark}}</span></div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { scopeDanceList, scopeListArea } from '@/api/common'
import { pageSocialSecurityTransact, handleTransact,socialDetail } from '@/api/education'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable, SearchComPro, PermBox } from '@/components'
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
    title: '提醒生成时间',
    dataIndex: 'createDate',
    customRender: (text, record) => (text?.slice(0,10))
  },
  {
    title: '最后操作时间',
    dataIndex: 'updateDate',
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
      STable, SearchComPro, PermBox
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
          }
        ],
        queryParam: {

        },
        socialStatus:'A',
        loadData: parameter => {
          return pageSocialSecurityTransact(Object.assign(parameter, this.queryParam,{type:this.socialStatus})).then(res => {
            return res
          })
        },
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
          this.loading=true
          handleTransact(params)
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
      handleApply(record,type){
        this.teacherInfo=record
        if(type){
          this.stusourceModal=true
          const date = new Date()
          const defaultStart = moment(date)
            .format('YYYY-MM')
          this.$nextTick(res=>{
            this.stusourceForm.setFieldsValue({ effectiveDate: defaultStart,remark:'' })
          })
        }else{
          socialDetail({socialId:record.socialId}).then(res=>{
            this.teacherInfo=res.data
            this.stusourceInfoModal=true
          })
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
        form.action = `${process.env.VUE_APP_URL}/social/security/socialSecurityTransactDown`
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
