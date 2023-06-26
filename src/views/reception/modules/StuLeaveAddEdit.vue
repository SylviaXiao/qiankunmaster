<template>
  <div class="stu-leave-addedit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1200"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleUpdate"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
    >
      <div>
        <div style="margin-bottom: 30px;">
          <a-table
            :row-selection="rowSelection"
            ref="table"
            :pagination="false"
            :columns="columns"
            :rowKey="record => record.id"
            :dataSource="dataSource"
            :loading="loading"
          >
            <span slot="stuCardNo" slot-scope="text, record">
              <a-popover title="卡备注信息">
                <template slot="content">
                  <div>{{ record.remark || '无' }}</div>
                </template>
                {{ text }}
              </a-popover>
            </span>
            <span slot="className" slot-scope="text, record">
              <perm-box :text="record.stuName" perm="education:class:view">
                <router-link :to="{ path: `/reception/class/classInfo/${record.classId}` }">{{ record.className }}</router-link>
              </perm-box>
            </span>
            <span slot="createDate" slot-scope="text">
              {{ handleDateC(text) }}
            </span>
            <span slot="startDate" slot-scope="text">
              {{ handleDateC(text) }}
            </span>
            <span slot="endDate" slot-scope="text">
              {{ handleEndDate(text) }}
            </span>
            <div slot="availableCount" slot-scope="text, record">
              <span v-if="record.usedCount > 0">
                <perm-box perm="student:signinlog:view" :text="`${record.usedCount}/${record.totalCount === 0 ? '不限' : record.totalCount}`">
                  <a href="#">{{ record.usedCount }}/{{ record.totalCount === 0 ? '不限' : record.totalCount }}</a>
                  <!-- @click="openSignInLog(record)" -->
                </perm-box>
              </span>
              <span v-if="record.usedCount === 0">
                <span :style="{ padding: '0px 5px' }"> {{ record.usedCount }}/{{ record.totalCount === 0 ? '不限' : record.totalCount }} </span>
              </span>
            </div>
          </a-table>
        </div>
        <a-form :form="formEdit">
          <a-row :gutter="8">
            <a-col :lg="12" :md="12" :sm="24">
              <a-row :gutter="8">
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-item v-bind="formLayout" label="开始时间">
                    <a-date-picker
                      style="width: 100%;"
                      format="YYYY-MM-DD"
                      valueFormat="YYYY-MM-DD"
                      :disabledDate="disabledStartDate"
                      @change="changeData($event, 'stateDate')"
                      v-decorator="[`stateDate`, { rules: [{ required: true, message: '请选择开始时间' }] }]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-item v-bind="formLayout" label="请假天数">
                    <a-input-number
                      style="width: 100%;"
                      placeholder="请输入请假天数"
                      :min="1"
                      :precision="0"
                      @change="changeData($event, 'day')"
                      v-decorator="[`day`, { rules: [{ required: true, message: '请输入请假天数' }] }]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-item v-bind="formLayout" label="结束时间">
                    <a-date-picker
                      style="width: 100%;"
                      format="YYYY-MM-DD"
                      valueFormat="YYYY-MM-DD"
                      :disabledDate="disabledEndDate"
                      @change="changeData($event, 'endDate')"
                      v-decorator="[`endDate`, { rules: [{ required: true, message: '请选择结束时间' }] }]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-item v-bind="formLayout" label="预计有效期截止">
                    <div v-for="(item, index) in selectedRows" :key="index">
                      {{item.stuCardNo}}：{{getExpiryDate(item.endDate)}}
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-row :gutter="8">
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-item v-bind="formLayout" label="备注">
                    <a-textarea
                      style="width: 100%;"
                      placeholder="请输入备注信息"
                      :rows="4"
                      v-decorator="['remark', { rules: [{ required: false, message: '请输入备注信息' }] }]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :offset="6" :lg="18" :md="18" :sm="18">
                  <UploadSth btnText="附件上传" ref="uploadSth" filePath="reason"></UploadSth>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { cardColumnsSimple } from '@/utils/reception/student'
import moment from 'moment'
import { batchSaveStuLeave, listActiveStudentCard } from '@/api/reception/student'
import UploadSth from '@/components/UploadSth'
const formLayout = {
  labelCol: {
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    sm: {
      span: 16
    }
  }
}
export default {
  components: {
    UploadSth
  },
  props: {
    title: {
      type: String,
      default: '学员请假'
    },
    stuId: String,
    cardId: String,
  },
  data() {
    return {
      // 列表字段
      columns: cardColumnsSimple,
      dataSource: null,
      loading: false,
      recordInfo: {},
      selectedRowKeys: [],
      selectedRows: [],
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        onSelection: this.onSelection,
        type:'radio'
      }
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    disabledDate(current) {
      if (this.$store.getters.userInfo?.account?.id == 'admin') {
        let date = new Date()
        let obj = moment(current).format('YYYY-MM-DD')
        let start = moment(date).format('YYYY-MM-DD')
        return start > obj && start < obj
      }
      return current && current < moment().endOf('day')
    },
    disabledStartDate(value) {
      const { endDate } = this.formEdit.getFieldsValue()
      let data = new Date()
      if(Array.isArray(this.selectedRows)&&this.selectedRows.length>0){
        let start =this.selectedRows[0].startDate
        return start && moment(value).add(1, 'days').valueOf() < moment(start).valueOf() || moment(value).valueOf() > moment(data).valueOf()
        // return  value && start && moment(value).add(1, 'days').valueOf() < moment(start).valueOf()|| value && endDate && moment(value).valueOf() > moment(endDate).valueOf()
      }
      // return value && endDate && moment(value).valueOf() > moment(endDate).valueOf()
      return moment(value).valueOf() > moment(data).valueOf()
    },
    disabledEndDate(value) {
      const { stateDate } = this.formEdit.getFieldsValue()
      if(stateDate){
        return stateDate && value && moment(stateDate).valueOf() > moment(value).valueOf()
      }else{
        return value
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.formEdit.resetFields()

    },
    changeData(value, field) {
      if (!value) return
      const { stateDate, endDate, day } = this.formEdit.getFieldsValue()
      this.$nextTick(() => {
        if (field === 'stateDate') {
          if (endDate) this.formEdit.setFieldsValue({ day: moment(endDate).diff(moment(value), 'days') + 1 })
          else if (day) this.formEdit.setFieldsValue({ endDate: moment(value).add(day - 1, 'days').format('YYYY-MM-DD') })
        }
        if (field === 'endDate') {
          if (stateDate) this.formEdit.setFieldsValue({ day: moment(value).diff(moment(stateDate), 'days') + 1 })
          else if (day) this.formEdit.setFieldsValue({ stateDate: moment(value).subtract(day - 1, 'days').format('YYYY-MM-DD') })
        }
        if (field === 'day') {
          if (stateDate) this.formEdit.setFieldsValue({ endDate: moment(stateDate).add(value - 1, 'days').format('YYYY-MM-DD') })
          else if (endDate) this.formEdit.setFieldsValue({ stateDate: moment(endDate).subtract(value - 1, 'days').format('YYYY-MM-DD') })
        }
      })
    },
    getExpiryDate(val) {
      const { day } = this.formEdit.getFieldsValue()
      if (day) {
        return moment(val).subtract(1, 'seconds').add(day, 'days').format('YYYY-MM-DD HH:mm')
      } else {
        return moment(val).subtract(1, 'seconds').format('YYYY-MM-DD HH:mm')
      }
    },
    handleUpdate() {
      if (this.selectedRows.length <= 0) {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择卡'
        })
        return
      }
      let list = this.selectedRows.filter(res => res.stuLeaveList >= 2)
      if (list.length > 0) {
        let that = this
        this.$confirm({
          title: '温馨提示',
          content: h => this.getContent(list),
          onOk() {
            that.comfirmStopCardBtn()
          },
          onCancel() {}
        })
      } else {
        this.comfirmStopCardBtn()
      }
    },
    getContent(list) {
      return (
        <div>
          <div style={{ color: 'red', fontSize: '14px' }}>以下卡停卡次数已超过2次，请确认是否停卡</div>

          {list.map(item => {
            return <div>{item.stuCardNo + '——' + item.cardName}</div>
          })}
        </div>
      )
    },
    comfirmStopCardBtn() {
      this.confirmAddEditLoading = true
      this.$refs.uploadSth
        .handleUpload()
        .then(res => {
          return this.handleAddEditOk(res)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.confirmAddEditLoading = false
        })
    },
    handleAddEditOk(openId) {
      this.confirmAddEditLoading = true
      this.validateData()
        .then(res => {
          const { stateDate, endDate, remark ,day} = res
          let params = {
            id: this.id,
            stuCardIds: this.selectedRowKeys.join(','),
            stateDate:new Date(stateDate),
            endDate:new Date(endDate),
            planDay:day,
            remark
          }
          if (openId) {
            params.attachment = openId
          }
          return params
        })
        .then(batchSaveStuLeave)
        .then(res => {
          this.$notification['success']({
            message: '系统提示',
            description: '已操作成功'
          })
          this.refreshTable()
          this.handleAddEditCancel()
        })
        .finally(() => {
          this.confirmAddEditLoading = false
        })
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    handleDateC(text) {
      return this.$tools.tailor.getDate(text)
    },
    handleEndDate(data) {
      return data ? moment(data).subtract(1, 'seconds').format('YYYY-MM-DD HH:mm') : ''
    },
    openModal(stuCardNo) {
      this.resetForm()
      this.visibleAddEdit = true
      this.loadData(stuCardNo)
    },
    loadData(stuCardNo) {
      this.loading = true
      listActiveStudentCard(this.stuId)
        .then(res => {
          this.dataSource = res.data
          if (this.selectedRowKeys.length <= 0) {
              this.selectedRowKeys=stuCardNo?[this.dataSource.filter(item => item.stuCardNo === stuCardNo)[0].id]:[this.dataSource[0]?.id]
          }
          this.selectedRows = this.dataSource.filter(item => item.id === this.selectedRowKeys[0])
        })
        .finally(() => {
          this.loading = false
        })
    },
    backindData(record) {
      const { remark, stateDate, endDate } = record
      this.id = record.id
      let formData = {
        remark,
        stateDate,
        endDate,
        day: moment(endDate).diff(moment(stateDate), 'days') + 1
      }
      this.selectedRowKeys.push(record.stuCardId)
      this.formEdit.setFieldsValue(formData)
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    resetForm() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.id = ''
      this.formEdit.resetFields()
      this.$nextTick(() => {
        this.formEdit.setFieldsValue({ stateDate: moment().format('YYYY-MM-DD') })
        this.$refs.uploadSth.reset()
      })
    },
    refreshTable() {
      this.$emit('refresh', this.stuId)
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-addedit {
}
</style>
