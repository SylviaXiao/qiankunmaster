<template>
  <div class="stu-leave-wrapper">
    <perm-box perm="finance:invoicecancel:view">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit"
          :searchParams="searchParams"></search-com-pro>
      </a-card>
      <a-card :bordered="false">
        <div class="btn-wrapper">
          <a-space>
            <!-- <perm-box perm="finance:invoicecancel:save">
              <a-button icon="plus-circle" type="primary" @click="add()">新增</a-button>
            </perm-box> -->
            <a-button @click="updateTable">刷新</a-button>
          </a-space>
        </div>
        <s-table ref="table" size="default" :columns="InvoiceCancelManagementTable" :data="loadData"
          rowKey="finInvoiceId">
          <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:invoicecancel:save">
              <a href="#" @click="edit(record)" v-if="!record.status">修改</a>
            </perm-box>
            <perm-box perm="finance:invoicecancel:del">
              <a href="#" @click="remove(record)">删除</a>
            </perm-box>
            <perm-box perm="finance:invoicecancel:cancel">
              <a href="#" @click="cancellation(record)" v-if="record.isCancel">作废</a>
            </perm-box>
            <perm-box perm="finance:invoicecancel:affirm">
              <a href="#" @click="sure(record)" v-if="!record.status">确认</a>
            </perm-box>
          </span>
        </s-table>
      </a-card>
    </perm-box>
    <ChooseStu ref="choosestu" :multiple="false" @getBackData="getStuData" :noArea="true" :branch="true"
      :studentNumber="true"></ChooseStu>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="700" :title="title" :visible="visible"
      :confirmLoading="confirmLoading" @ok="handleSubmit('ruleForm')" @cancel="close">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="学员姓名" v-if="!form.stuName">
              <span @click="openChoosePop">
                <a-input style="cursor: 'pointer', color: '#000'" disabled placeholder="请选择学员姓名" v-model="form.stuName">
                  <a-icon slot="addonAfter" type="search" />
                </a-input>
              </span>
            </a-form-model-item>
            <a-form-model-item v-bind="defaultLayout" label="学员姓名" v-else>
              {{ form.stuName }}
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="手机号码" v-if="form.stuName">
              {{ form.stuPhone }}
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <div>
            <a-col :span="12">
              <a-form-model-item v-bind="defaultLayout" label="作废金额" prop="price">
                <a-input autocomplete="name" v-model="form.price" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item v-bind="defaultLayout" label="作废备注">
                <a-input autocomplete="name" v-model="form.remark" />
              </a-form-model-item>
            </a-col>
          </div>
        </a-row>
        <!-- <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="作废日期" v-if="title == '编辑'">
              <a-date-picker @change="onChange" v-model="form.date" />
            </a-form-model-item>
          </a-col>
        </a-row> -->
      </a-form-model>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="1000" title="作废发票列表" :visible="cancellationVisible"
      :confirmLoading="cancellationLoading" @ok="handleCancellationSubmit" @cancel="cancellationClose">
      <a-table :pagination="false" :columns="CancelList" :rowKey="record => record.id" :dataSource="dataSource"
        :loading="loading" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
      </a-table>
    </a-modal>
  </div>
</template>
<script>
import { pageFinShop, removeFinShop } from '@/api/finance/finance'
import { saveInvoiceCancel, pageInvoiceCancel, removeInvoiceCancel, listStuInvoice, cancelInvoice, confirmCance, getInvoiceList } from '@/api/invoice/invoice'
import { InvoiceCancelManagementTable, CancelList } from './finance'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import ChooseStu from '@/components/ChooseStu'
import { getSchoolList } from '@/api/education/card'
import { listEduType, treeEduClassType } from '@/api/common'
const defaultLayout = {
  labelCol: { md: { span: 8 } },
  wrapperCol: { md: { span: 16 } }
}
export default {
  components: {
    SearchComPro,
    STable,
    PermBox,
    ChooseStu
  },

  data() {
    let validateIdePrice = (rule, value, callback) => {
      let reg = /^\d+$/
      if (value === '') {
        callback(new Error('请填写作废金额'))
      } else if (!reg.test(value)) {
        callback(new Error('请填写正整数'))
      } else {
        callback()
      }
    }
    return {
      searchParams: [
        {
          type: 'text',
          key: 'studentInfo',
          label: '学员信息',
          placeholder: '学员姓名/手机号'
        },
        {
          type: 'treeSelect',
          key: 'deptIds',
          isShow: true,
          label: '申请分馆',
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
          key: 'eduTypeIds',
          isShow: true,
          label: '类型',
          placeholder: '请选择类型',
          apiOption: {
            api: listEduType,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'date',
          key: 'FeedDate',
          label: '作废时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'arrText',
          key: 'price',
          selectKey: 'type',
          arrPlaceholder: '请输入',
          label: '金额',
          placeholder: '请输入',
          staticArr: [
            {
              string: '大于',
              value: 'A'
            },
            {
              string: '等于',
              value: 'C'
            },
            {
              string: '小于',
              value: 'B'
            },
          ]
        },
      ],
      InvoiceCancelManagementTable,
      defaultLayout,
      CancelList,
      queryParam: {},
      queryParams: {},
      confirmLoading: false,
      loadData: parameter => {
        const params = {
          ...parameter,
          ...this.queryParam,
          status: 'E',
        }
        return getInvoiceList(params).then(res => {
          return res
        })
      },
      loadTableData: parameter => {
        return listStuInvoice(Object.assign(parameter, this.queryParams)).then(res => {
          return res
        })
      },
      studentInfo: {},
      title: '',
      visible: false,
      form: {
        remark: '',
        id: '',
        date: '',
        stuName: '',
        stuPhone: '',
        price: '',
        cancelDate: ''
      },
      rules: {
        price: [{ required: true, validator: validateIdePrice, trigger: 'blur' }]
      },
      //作废列表
      cancellationVisible: false,
      cancellationLoading: false,
      cancellationTable: [],
      selectedRowKeys: [],
      dataSource: [],
      loading: false
    }
  },

  methods: {
    openChoosePop() {
      this.$refs.choosestu.open()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    cancellationClose() {
      this.cancellationVisible = false
      this.selectedRowKeys = []
    },
    //作废选择弹窗
    handleCancellationSubmit(formName) {
      if (!!!this.selectedRowKeys.length) {
        this.$notification['error']({
          message: '系统通知',
          description: '请先选择一条数据'
        })
        return
      }
      this.cancellationLoading = true
      cancelInvoice({ finInvoiceIds: this.selectedRowKeys.join(',') })
        .then(data => {
          if (data.code == 200) {
            this.cancellationLoading = false
            this.$notification.success({
              message: '系统通知',
              description: '作废成功'
            })
            this.updateTable()
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.cancellationClose()
        })
    },
    //新增编辑关闭
    close() {
      Object.keys(this.form).forEach(item => (this.form[item] = ''))
      this.visible = false
    },
    // onChange(date) {
    //   this.form.cancelDate = this.$tools.tailor.getDate(date)
    // },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.form.date = ''
          saveInvoiceCancel(this.form)
            .then(data => {
              if (data.code == 200) {
                this.$notification.success({
                  message: '系统通知',
                  description: '提交成功'
                })
                this.updateTable()
                this.close()
              }
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    },
    updateForm(data) {
      let arr = []
      if (this.title == '新增') {
        arr = ['stuName', 'stuPhone']
      } else {
        arr = ['stuName', 'stuPhone', 'price', 'remark']
      }
      arr.forEach(item => (this.form[item] = data[item]))
      // this.form.date = data.cancelDate
      this.form.studentId = data.stuId
      if (data.id) this.form.id = data.id
    },
    updateTable() {
      this.$refs.table.loadData()
    },
    getStuData(data) {
      this.title = '新增'
      this.updateForm(data)
      this.visible = true
    },
    add() {
      this.title = '新增'
      this.visible = true
      this.chooseType = true
    },
    edit(record) {
      this.title = '编辑'
      this.visible = true
      this.updateForm(record)
    },
    remove(record) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '是否删除该条数据',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeInvoiceCancel(record.id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            _this.updateTable()
          })
        }
      })
    },
    //作废
    cancellation(record) {
      this.loading = true
      listStuInvoice(record.stuId)
        .then(data => {
          if (data.code == 200) {
            this.dataSource = data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.cancellationVisible = true
          this.loading = false
        })
    },
    //确定
    sure(record) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '是否确定该条数据',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          confirmCancel(record.id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '确认成功'
            })
            _this.updateTable()
          })
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this.updateTable()
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-wrapper {
  .btn-wrapper {
    margin-bottom: 20px;
  }
}
</style>
