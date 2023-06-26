<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
      </a-card>
    </div>
    <a-card>
      <div ref="elementBtn" style="text-align:right; margin: 10px 0;">
        <a-radio-group @change="stateChange" :default-value="state" button-style="solid" v-model="state">
          <a-radio-button value="A">
            待上传
          </a-radio-button>
          <a-radio-button value="B">
            已上传
          </a-radio-button>
        </a-radio-group>
      </div>
      <s-table ref="table" :showSlider="true" :columns="state === 'A' ? columns1 : columns2" :data="loadData" :rowKey="(record, index) => index">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="student:refund:revocation">
            <a href="#" v-if="state==='B'&&(record.finStatus==='D'||(record.finStatus==='B'&&record.reufundMap&&record.reufundMap.content==='馆长'))" @click="repeal(record)">撤销</a>
          </perm-box>
          <span v-if="state === 'A'">
            <perm-box perm="student:card:refund-all">
              <a href="javascript:;" @click="handleRefundEdit(record)">修改</a>
            </perm-box>
          </span>
          <span v-if="state === 'B'">
            <a href="javascript:;" @click="handleRefundEdit(record)" class="mr10" v-if="record.reufundMap && record.reufundMap.state == -1">修改</a>
            <a href="javascript:;" @click="handleRefundDetail(record)">查看附件</a>
          </span>
          <perm-box perm="student:refund:delete">
            <a href="#"  v-if="(state==='B'&&record.finStatus==='D')||state==='A'"  @click="delect(record)">删除</a>
          </perm-box>
        </span>
        <span slot="refEncolsureDate" slot-scope="text, record" >
          <span  v-if="tagRed(record)" style="color:red;">{{text}}</span>
          <span  v-else>{{text}}</span>
        </span>
        <span slot="suggest" slot-scope="text, record">
            <a-tooltip placement="bottomLeft" v-if="record.finStatus==='D'" >
              <template slot="title">
                <div>
                  <div>驳回人：{{record.userName}}</div>
                  <div>驳回意见：{{text}}</div>
                </div>
              </template>
              {{text}}
            </a-tooltip>
          </span>
      </s-table>
    </a-card>

    <!-- 修改/重新发起 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1000"
      title="修改退费信息"
      :visible="editVisible"
      :confirmLoading="confirmLoading"
      @cancel="handleRefundCancel"
    >
      <a-spin :spinning="refundSpin">
        <div style="display: flex; justify-content: flex-end;">
          <a-button @click="handleRefundPrint">打印</a-button>
        </div>
        <a-form>
          <DetailedPayInfoDrawback ref="detailedPayInfoDrawback" :drawbackEditInfo="drawbackEditInfo" :hideSourceDetailList="true" :limit="limit"></DetailedPayInfoDrawback>
          <a-divider orientation="left">
            <span :style="{ color: 'rgba(1,1,1,.3)' }">附件</span>
          </a-divider>
          <a-form-item v-bind="{ labelCol: { span: 3 }, wrapperCol: { span: 16 } }" label="附件">
            <upload-sth ref="uploadsth" :multiple="true" :required="false" btn-text="附件上传" filePath="reason" v-show="handleEnableField('attachmentList')"></upload-sth>
            <div class="uploadedFile" v-for="(item, idx) in newUploadFiles" :key="idx">
              <span style="display: flex;flex-flow: row nowrap;justify-content: space-between;">
                <span>{{ item.fileName }}</span>
                <span style="margin-left: 15px;" class="close" v-if="handleEnableField('attachmentList')" @click="deleteFile(item)"><a-icon type="close" style="font-size: 10px;"/></span>
              </span>
            </div>
          </a-form-item>
        </a-form>
      </a-spin>
      <template slot="footer">
        <a-button @click="handleRefundCancel">取消</a-button>
        <a-button @click="handleRefundSubmit(false)" type="primary" v-if="state == 'A'">确定</a-button>
        <a-button @click="handleRefundSubmit(false)" type="primary" v-if="state == 'B'">保存</a-button>
        <a-button @click="handleRefundSubmit(true)" v-if="state == 'B'">重新提交</a-button>
      </template>
    </a-modal>

    <!-- 查看附件 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1000"
      title="退费明细表"
      :visible="detailVisible"
      :footer="null"
      @cancel="handleDetailCancel"
    >
      <RefundDetail :stuCardId="record && record.stuCardId"></RefundDetail>
    </a-modal>

    <!-- 打印 -->
    <RefundDetailPrint ref="refundDetailPrint" />
  </div>
</template>

<script>
  import { STable, SearchComPro, UploadSth } from '@/components'
  import DetailedPayInfoDrawback from '@/views/finance/modules/DetailedPayInfoDrawback'
  import RefundDetail from '@/views/finance/modules/RefundDetail'
  import RefundDetailPrint from '@/views/finance/modules/RefundDetailPrint'
  import { getSchoolList } from '@/api/education/card'
  import {
    pageStuRefundFile,
    removeStuCardNextLog,
    reStartFastdpRefund,
    remvoeStuRefund,
    revocationStuRefund
  } from '@/api/reception/student'
  import { previousRefundCard, refundCardAll } from '@/api/recep'

  //A:待审核，B:审批中，C:通过，D:驳回，E:待上传附件
  const finStatus = [
    { label: '待审核', value: 'A' },
    { label: '审批中', value: 'B' },
    { label: '通过', value: 'C' },
    { label: '驳回', value: 'D' },
    { label: '待上传附件', value: 'E' }
  ]
  const columns1 = [
    {
      title: '提交日期',
      dataIndex: 'createDate',
    },
    {
      title: '提交分馆',
      dataIndex: 'deptName'
    },
    {
      title: '状态',
      dataIndex: 'state',
      customRender: (text, record) => {
        return (text === 'A'||text === 'C') ? '待上传' : text === 'B' ? '已上传' : ''
      }
    },
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title:"预计附件上传日期",
      dataIndex: 'refEncolsureDate',
      width:150,
      scopedSlots: { customRender: 'refEncolsureDate' }
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const columns2 = [
    {
      title: '提交日期',
      dataIndex: 'createDate',
      width:150
    },
    {
      title: '附件上传时间',
      dataIndex: 'date',
      width:150
    },
    {
      title: '提交分馆',
      dataIndex: 'deptName'
    },
    {
      title: '状态',
      dataIndex: 'state',
      customRender: (text, record) => {
        return text == 'A' ? '待上传' : text == 'B' ? '已上传' : ''
      },
      width:70
    },
    {
      title: '审核状态',
      dataIndex: 'finStatus',
      customRender: (text, record) => {
        return text ? finStatus.find(d => d.value === text)?.label : ''
      },
      width:70
    },
    {
      title: '审批意见',
      dataIndex: 'suggest',
      width:200,
      ellipsis:true,
      scopedSlots: { customRender: 'suggest' }
    },
    // {
    //   title: '审核步骤',
    //   dataIndex: 'reufundMap',
    //   customRender: (text, record) => {
    //     const { content, reviewer, state } = text || {}
    //     if (content && reviewer && state) {
    //       const stateText = state == -1 ? '驳回' : state == 0 ? '待审批' : state == 1 ? '审批中' : state == 2 ? '通过' : state == 3 ? '撤回' : state == 5 ? '确定' : ''
    //       return `${content}${stateText}-${reviewer}`
    //     }
    //     return ''
    //   }
    // },
    {
      title: '标题',
      dataIndex: 'title',
      width:500,
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const searchParams = [
    {
      type: 'text', // 文本输入框,返回值为string
      key: 'title',
      label: '标题',
      placeholder: '请输入标题'
    },
    {
      type: 'date',
      key: 'Date',
      label: '提交时间',
      placeholder: '请选择时间',
      format: 'YYYY-MM-DD'
    },
    {
      type: 'date',
      key: 'UpDate',
      label: '附件上传时间',
      placeholder: '请选择时间',
      format: 'YYYY-MM-DD HH:mm',
      showTime: { format: 'HH:mm' }
    },
    {
      type: 'treeSelect',
      isShow: true,
      key: 'deptId',
      label: '选择分馆',
      placeholder: '请选择分馆',
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
      key: 'finStatus',
      label: '审核状态',
      placeholder: '请选择审核状态',
      staticArr: [
        {
          string: '审批中',
          value: 'B'
        },
        {
          string: '通过',
          value: 'C'
        },
        {
          string: '驳回',
          value: 'D'
        }
      ]
    },
    {
      type: 'date',
      key: 'EncolsureDate',
      label: '预计附件上传时间',
      placeholder: '请选择时间',
      format: 'YYYY-MM-DD',
    },
  ]

  export default {
    name: 'refund',
    components: {
      STable,
      SearchComPro,
      UploadSth,
      DetailedPayInfoDrawback,
      RefundDetail,
      RefundDetailPrint
    },
    data() {
      return {
        reufundMap:'',
        EncolsureDate:    {
          type: 'date',
          key: 'EncolsureDate',
          label: '预计附件上传时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
        },
        state: 'A',
        queryParam: {},
        searchParams,
        columns1,
        columns2,
        loadData: parameter => {
          let params = Object.assign(parameter, this.queryParam, { state: this.state })
          return pageStuRefundFile(params).then(res => {
            return res
          })
        },
        // 修改退费
        confirmLoading: false,
        refundSpin: false,
        editVisible: false,
        drawbackEditInfo: {},
        newUploadFiles: [],
        limit: [],
        // 查看详情
        detailVisible: false,
        record: null
      }
    },
    methods: {
      tagRed(record){
        let flag = false
        if(record.refEncolsureDate){
         let time=(new Date(record.refEncolsureDate).getTime()-new Date().getTime())/1000/60/60/24
          if(time < 15)flag=true
        }
        return flag
      },
      //撤销
      repeal(record) {
        this.$confirm({
          title: '系统提示',
          content: '确定要撤销吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            revocationStuRefund({id:record.id}).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this._refreshTable()
            })
          }
        })
      },
      //删除
      delect(record) {
        let that = this
        this.$confirm({
          title: '系统提示',
          content: '确定要删除吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            let request = remvoeStuRefund
            request({
              id:record.id
            }).then(res => {
              that.$notification['success']({
                message: '系统通知',
                description: '删除成功'
              })
              that._refreshTable()
            })
          }
        })
      },
      //搜索功能
      searchSubmit(data) {
        this.queryParam = Object.assign({}, data)
        this._refreshTable()
      },
      stateChange(){
        if(this.state==='A'){
          if(this.searchParams.length!==6){
            this.searchParams.push(this.EncolsureDate)
          }
        }else{
          delete this.queryParam.startEncolsureDate
          delete this.queryParam.endEncolsureDate
          if(this.searchParams.length===6){
            this.searchParams.splice(-1,1)
          }
        }
        this._refreshTable()
      },
      _refreshTable() {
        this.$refs.table.refresh()
      },
      // 是否启用字段
      handleEnableField(data) {
        const { limit } = this
        if (!limit || limit.length === 0) return true
        if (Array.isArray(data)) {
          return data.findIndex(d => limit.includes(d)) >= 0
        }
        return limit.includes(data)
      },
      handleRefundEdit(record) {
        const { limit, reufundMap } = record
        const { state } = reufundMap || {}
        if (state == -1) {
          this.limit = limit ? JSON.parse(limit) : []
        }
        this.record = record
        this.fileList = []
        this.editVisible = true
        this.refundSpin = true
        this.$refs.uploadsth && this.$refs.uploadsth.reset()
        previousRefundCard(record.stuCardId)
          .then(res => {
            this.newUploadFiles = [].concat(res.data.attachments)
            this.drawbackEditInfo = res.data
          })
          .then(() => {
            this.$nextTick(() => {
              // 退费明细表,回显
              this.$refs.detailedPayInfoDrawback.backindData()
            })
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.refundSpin = false
          })
      },
      handleRefundSubmit(reStart = false) {
        const { finId, stuCardId } = this.record
        let params = {}
        this.confirmLoading = true
        this.$refs.uploadsth
          .multipleHandleUpload()
          .then(res => {
            const old = []
            this.newUploadFiles.map(item => {
              old.push(item.id)
            })
            params.attachments = res ? `${old.join(',')},${res}` : old.join(',')
            params.stuCardId = this.drawbackEditInfo.cardId
            return params
          })
          .then(this.$refs.detailedPayInfoDrawback.getAllData)
          .then(drawbackInfo => {
            params.stuCardId = this.drawbackEditInfo.cardId
            const { achievements, finTeachers } = drawbackInfo
            if (reStart) {
              if (!achievements && !finTeachers) {
                this.$notification.error({
                  message: '系统通知',
                  description: '扣除业绩不能为空'
                })
                return Promise.reject()
              }
              if (!params.attachments) {
                this.$notification.error({
                  message: '系统通知',
                  description: '请上传附件'
                })
                return Promise.reject()
              }
            }
            if (params.attachments && !achievements && !finTeachers) {
              this.$notification.error({
                message: '系统通知',
                description: '扣除业绩不能为空'
              })
              return Promise.reject()
            }
            return Object.assign(params, drawbackInfo)
          })
          .then(refundCardAll)
          .then(res => {
            if (res.code == 200) {
              this.$notification.success({
                message: '系统通知',
                description: '提交成功'
              })
              if (reStart) {
                return reStartFastdpRefund({ finId, studentCardId: stuCardId })
                  .then(res => Promise.resolve(res))
              } else {
                return Promise.resolve(res)
              }
            } else {
              return Promise.reject(res)
            }
          })
          .then(res => {
            if (res.code == 200) {
              this.handleRefundCancel()
              this._refreshTable()
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            let timeout = setTimeout(() => {
              this.confirmLoading = false
              clearTimeout(timeout)
            }, 1000)
          })
      },
      handleRefundCancel() {
        this.editVisible = false
        this.record = null
      },
      handleRefundPrint() {
        this.$refs.detailedPayInfoDrawback.getAllData()
          .then(dataInfo => {
            const { userEnrollDate, userEnrollPrice, totalRefund, refundPrice, reason, refundRemark, bankUserName, bank, bankNo, userRelate, userRelateRemark } = dataInfo
            const { studentName } = this.drawbackEditInfo
            const { createDate } = this.record
            const refundDetail = {
              studentName: studentName,
              cardCreatDate: userEnrollDate,
              cardPrice: userEnrollPrice,
              deductTotal: totalRefund,
              refundPrice: -refundPrice,
              refundReason: reason,
              refundRemark: refundRemark,
              bankUserName: bankUserName,
              bank: bank,
              bankNo: bankNo,
              userRelate: userRelate,
              userRelateRemark: userRelateRemark,
              creatDate: createDate
            }
            this.$refs.refundDetailPrint.print(refundDetail)
          })
      },
      handleRefundDetail(record) {
        this.record = record
        this.detailVisible = true
      },
      handleDetailCancel() {
        this.detailVisible = false
        this.record = null
      },
      deleteFile(item) {
        this.newUploadFiles.remove(item)
      },
    }
  }
</script>

<style lang="less" scoped>
</style>
