<template>
  <div class="tabpan-one-wrapper">
    <template>
      <perm-box v-if="!classInfo.isGeneral && !classInfo.isOnline && !isGraduate && !isPersonal" perm="education:class:add-stu">
        <a-button style="margin-bottom: 20px" icon="plus-circle" type="primary" @click="addStudent()">新增</a-button>
      </perm-box>
    </template>
<!--    <template v-if="classInfo.isOnline">-->
<!--      <perm-box :style="{ marginLeft: '10px' }" perm="student:card:suspend && education:class-online:view">-->
<!--        <a-button style="margin-bottom: 20px" :disabled="!hasSelected" type="primary" @click="handleShowDate($event)">批量停课</a-button>-->
<!--      </perm-box>-->
<!--    </template>-->
<!--    <template v-else>-->
<!--      <perm-box :style="{ marginLeft: '10px' }" perm="student:card:suspend">-->
<!--        <a-button style="margin-bottom: 20px" :disabled="!hasSelected" type="primary" @click="handleShowDate($event)">批量停课</a-button>-->
<!--      </perm-box>-->
<!--    </template>-->
    <div v-if="dataSource">
      <a-table
        ref="table"
        :rowSelection="rowSelection"
        :pagination="false"
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="dataSource"
        :loading="loading"
      >
        <div slot="usedCount" slot-scope="text, record">
          <span v-if="record.status !== 'D'">
            <template>
              <span :style="{ padding: '0px 5px' }">{{ record.usedCount }}/{{ record.totalCount === 0 ? '不限' : record.totalCount }}</span>
            </template>
          </span>
          <span v-else>-</span>
        </div>

        <span slot="stuCardNo" slot-scope="text">
          {{ text }}
        </span>

        <span slot="stuName" slot-scope="text">
          {{ text }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="classInfo.isOnline">
            <perm-box v-if="!isGraduate" perm="student:card:change-class && education:class-online:view">
              <a href="#" @click="openDrawbackModal(record)">退班</a>
            </perm-box>
          </template>
          <template v-else>
            <perm-box v-if="!isGraduate" perm="student:card:change-class">
              <a href="#" @click="openDrawbackModal(record)">退班</a>
            </perm-box>
          </template>
        </span>
        <span slot="payoff" slot-scope="text, record">
          <template v-if="record.status == 'E'">
            -
          </template>
          <template v-if="record.status !== 'E' && text">
            结清
          </template>
          <template v-if="record.status !== 'E' && !text">
            <span style="color:red">
              {{ (record.paidPrice - record.totalPrice) | fixTofloat }}
            </span>
          </template>
        </span>
        <span slot="availableCount" slot-scope="text, record">
          <template v-if="record.status === 'D'">
            -
          </template>
          <template v-else> {{ record.paidPrice }}/{{ record.totalPrice }}/{{ record.originalPrice }} </template>
        </span>
      </a-table>
    </div>
    <!-- <drawback-form ref="drawback" @refund="_refreshTable" :record="drawbackRecord" type="returnInClass"></drawback-form> -->
    <StudentInfoDrawback ref="drawback" @refund="_refreshTable" :record="drawbackRecord" :showChange="false"></StudentInfoDrawback>
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
    <suspendDate ref="suspend" @getSuspendData="suspendClass"></suspendDate>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getClassStuList, listClass, changeClass, refundClassStatus, classBatchSuspend } from '@/api/education'
import { roleColumns } from '@/utils/education/classInfo'
import { STable } from '@/components'
import suspendDate from './suspendDate'
import PermBox from '@/components/PermBox'
import UploadSth from '@/components/UploadSth'
import StudentInfoDrawback from '@/views/reception/modules/StudentInfoDrawback'

export const defaultLayout = {
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

export default {
  name: 'classStuTable',
  components: {
    StudentInfoDrawback,
    suspendDate,
    UploadSth,
    STable,
    PermBox
  },
  data() {
    return {
      //多选
      selectedRowKeys: [],

      banlance: 'init',
      //退班,切换班级modal相关
      visibleClass: false,
      titleChangeClass: '',
      confirmChangeLoading: false,
      classIdArr: [],
      defaultLayout,
      stuInfo: {},
      modalType: '',
      //table列表相关
      columns: roleColumns,
      dataSource: null,
      loading: false,
      //附件
      fileId: '',

      // TODO 退班退卡
      drawbackModal: false,
      drawbackModalLoading: false,
      drawbackRecord: {},
    }
  },
  props: {
    classStuList: Array,
    isGraduate: {
      type: Boolean,
      default: false
    },
    isPersonal: {
      type: Boolean,
      default: false
    },
    classInfo: {
      type: Object,
      default: null
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    rowSelection() {
      let flag = this.$tools.checkPerm('student:card:suspend')
      if (flag) {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKeys = selectedRowKeys
          },
          getCheckboxProps: record => ({
            props: {
              disabled: !!(record.status === 'C')
            }
          })
        }
      } else {
        return null
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    this.dataSource = this.classStuList
  },
  watch: {
    classStuList(nv) {
      this.dataSource = nv
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
  methods: {
    suspendClass(params) {
      params = Object.assign({}, params, { stuCardIds: this.selectedRowKeys.join(',') })
      classBatchSuspend(params)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '您已成功停课选中学员!'
            })
            this.$refs.suspend.handleCancel()
            this.selectedRowKeys = []
            this._refreshTable()
          }
        })
        .finally(this.$refs.suspend.cancelFirmLoading)
    },
    handleShowDate() {
      this.$refs.suspend.open()
    },
    /*
     * 方法说明
     * @method
     * */
    openDrawbackModal(record) {
      const callback = () => {
        this.drawbackRecord = record
        this.$refs.drawback.showModal()
      }
      if (record.isOffDuty == 1) {
        this.$confirm({
          title: '系统提示',
          content: '该常规班单班卡存在退班记录，确认再次退班吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: callback
        })
      } else {
        callback()
      }
    },
    submitDrawback() {},
    cancelDrawback() {
      this.drawbackModal = false
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

    // 换班相关 x
    changeClassBtn(e, record, type) {
      this.modalType = type
      this.visibleClass = true
      this.stuInfo = record
      if (type === 'change') {
        this.loadClassId()
        this.titleChangeClass = '转班管理'
      } else if (type === 'remove') {
        this.titleChangeClass = '退班管理'
      }
    },
    loadClassId() {
      let params = {
        danceId: this.classInfo.eduDance.id,
        typeId: this.classInfo.eduType.id,
        classTypeId: (this.classInfo && this.classInfo.eduCardType && this.classInfo.eduCardType.id) || null
      }
      listClass(params)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.classIdArr = res.data
            this.$nextTick(() => {
              if (res.data.length > 0) {
                this.form.setFieldsValue({ classId: this.$route.params.classid })
              }
            })
          }
        })
        .catch(err => {
          console.log(err, 'loadClassId')
        })
    },
    submitChangeClass() {
      let _this = this
      let formData = this.form.getFieldsValue()
      let oldClassId = this.$route.params.classid
      if (this.modalType === 'change') {
        let newClassId = formData.classId
        if (oldClassId === newClassId) {
          this.$notification['error']({
            message: '系统通知',
            description: '不能转入已在班级!'
          })
        } else if (oldClassId !== newClassId && newClassId) {
          this.form.validateFields().then(() => {
            this.$confirm({
              title: '系统提示',
              content: '确认换班吗?',
              okText: '确认',
              cancelText: '取消',
              onOk() {
                _this.confirmChangeLoading = true
                _this.$refs.uploadSth
                  .handleUpload()
                  .then(res => {
                    _this.fileId = res
                    _this.changeClassApi(newClassId)
                  })
                  .catch(err => {
                    console.log(err)
                    this.confirmChangeLoading = false
                  })
              },
              onCancel() {}
            })
          })
        } else {
        }
      }
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
                  this.confirmChangeLoading = false
                })
            },
            onCancel() {}
          })
        })
      }
    },
    changeClassApi(newClassId) {
      let formData = this.form.getFieldsValue()
      let params = {
        price: formData.price,
        logRemark: formData.logRemark,
        stuCardId: this.stuInfo.id,
        attachment: this.fileId
      }
      changeClass(newClassId, params)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '已转班成功'
            })
            this._refreshTable()
            this.visibleClass = false
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.confirmChangeLoading = false
        })
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
    addStudent() {
      this.$emit('addStudent')
    },
    _handleDateCompare(text) {
      return this.$tools.tailor.compareToday(text) <= 7
    },
    _refreshTable() {
      this.$emit('refreshTable')
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
  @import '~@/assets/style/index';

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
