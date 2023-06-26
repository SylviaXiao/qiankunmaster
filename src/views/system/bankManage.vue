<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card>
      <perm-box perm="organize:receiptbank:view">
        <s-table
          ref="table"
          :columns="bankColumns"
          :data="loadData"
          :rowKey="(record, index) => record.id"
          :pagination="false"
          :loading="bankLoading"
          style="padding-top: 10px"
        >
          <span slot="action" slot-scope="text, record">
            <perm-box perm="organize:receiptbank:save">
              <span>
                <a href="#" style="padding: 0 5px;" @click="handleEdit(record)">修改</a>
              </span>
            </perm-box>
            <perm-box perm="organize:receiptbank:del">
              <span>
                <a href="#" style="padding: 0 5px;" @click="handleDelete(record)">删除 </a>
              </span>
            </perm-box>
          </span>
        </s-table>
      </perm-box>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="bankModal" :title="bankTitle" okText="保存" cancelText="取消" @ok="savebank()">
      <a-form-model ref="bankForm" :model="bankForm" :rules="bankRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="用户名" ref="userName">
          <div>
            {{ bankForm.userName }}
          </div>
        </a-form-model-item>
        <a-form-model-item label="手机号" ref="userTel">
          <div>
            {{ bankForm.userTel }}
          </div>
        </a-form-model-item>

        <a-form-model-item label="类型" ref="receiptType">
          <div>
            {{ bankForm.receiptType == 'A' ? '公司' : bankForm.receiptType == 'B' ? '个人' : '' }}
          </div>
        </a-form-model-item>
        <a-form-model-item label="收款人户名" ref="receiptName" prop="receiptName">
          <a-input placeholder="请输入收款人户名" style="width:90%;" v-model="bankForm.receiptName" />
          <template v-if="bankForm.receiptType == '个人'">
            <a-popover title="">
              <template slot="content">
                <p>添加后收款人户名不可修改</p>
              </template>
              <a-icon style="margin-left:10px;" type="question-circle" />
            </a-popover>
          </template>
        </a-form-model-item>
        <a-form-model-item label="开户行" ref="bank" prop="bank">
          <a-input placeholder="请输入开户行" v-model="bankForm.bank" style="width:90%;" />
        </a-form-model-item>
        <a-form-model-item label="银行卡号" ref="bankNo" prop="bankNo">
          <a-input style="width:90%;" placeholder="请输入银行卡号" :value="bankForm.bankNo" @change="bankInput" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import { saveReceiptBank, listReceiptBank, removeReceiptBank } from '@/api/organize'
import PermBox from '@/components/PermBox'
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 }
  }
}
let bankColumns = [
  {
    title: '工号',
    key: 'userNo',
    dataIndex: 'userNo'
  },
  {
    title: '用户名称',
    key: 'userName',
    dataIndex: 'userName'
  },
  {
    title: '手机号',
    key: 'userTel',
    dataIndex: 'userTel'
  },
  {
    title: '性别',
    key: 'userSex',
    dataIndex: 'userSex',
    customRender: (text, record) => {
      return text == 'A' ? '男' : '女'
    }
  },

  {
    title: '类型',
    key: 'receiptType',
    dataIndex: 'receiptType',
    customRender: (text, record) => {
      return text == 'A' ? '公司' : text == 'B' ? '个人' : ''
    }
  },
  {
    title: '收款人户名',
    key: 'receiptName',
    dataIndex: 'receiptName'
  },

  {
    title: '开户行',
    key: 'bank',
    dataIndex: 'bank'
  },
  {
    title: '银行卡号',
    key: 'bankNo',
    dataIndex: 'bankNo'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
// table数据
const searchParams = [
  {
    type: 'text', // 文本输入框,返回值为string
    key: 'userNo',
    label: '工号',
    placeholder: '请输入工号'
  },
  {
    type: 'text', // 文本输入框,返回值为string
    key: 'userName',
    label: '用户名称',
    placeholder: '请输入用户名称'
  },
  {
    type: 'text', // 文本输入框,返回值为string
    key: 'userTel',
    label: '手机号',
    placeholder: '请输入手机号'
  },
  {
    type: 'select', // 静态select框
    key: 'receiptTyp',
    label: '类型',
    placeholder: '请选择类型',
    staticArr: [
      {
        string: '公司',
        value: 'A'
      },
      {
        string: '个人',
        value: 'B'
      }
    ]
  }
]
export default {
  name: 'Verify',
  data() {
    return {
      bankColumns,
      formItemLayout,
      loadData: parameter => {
        let params = Object.assign({}, this.queryParam, parameter)
        return listReceiptBank(params).then(res => {
          return res
        })
      },
      searchParams,
      bankTitle: '修改',
      bankRecord: null,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      bankRules: {
        receiptType: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        receiptName: [{ required: true, message: '请输入收款人户名', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        bankNo: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }]
      },
      bankForm: {
        userName: '',
        userTel: '',
        receiptType: '公司',
        receiptName: '',
        bank: '',
        bankNo: ''
      },
      bankLoading: false,
      bankModal: false,
      queryParam: {}
    }
  },

  components: { STable, SearchComPro, PermBox },
  mounted() {},

  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    //搜索功能
    searchSubmit(data) {
      this.queryParam = Object.assign({}, data)
      this.refresh()
    },
    savebank() {
      this.$refs.bankForm.validate(valid => {
        if (valid) {
          let params = {
            receiptName: this.bankForm?.receiptName || '',
            bank: this.bankForm?.bank || '',
            bankNo: this.bankForm?.bankNo || '',
            id: this.bankForm?.id || null
          }
          saveReceiptBank(params).then(res => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.refresh()
              this.bankModal = false
            }
          })
        }
      })
    },
    bankInput(e) {
      const { value } = e.target
      if (value) {
        this.bankForm.bankNo = value.replace(/[^0-9]/gi, '')
      } else {
        this.bankForm.bankNo = ''
      }
    },
    openBankModal(record) {
      this.bankForm = {
        userName: record?.userName || '',
        userTel: record?.userTel || '',
        // receiptBankId: record?.id || null,
        receiptName: record?.receiptName || '',
        receiptType: record?.receiptType || '公司',
        bank: record?.bank || '',
        bankNo: record?.bankNo || '',
        id: record?.id || null
      }
      // if (!record) delete this.bankForm.receiptBankId
      this.bankModal = true
    },
    handleEdit(record) {
      this.bankTitle = '修改'
      this.bankRecord = record
      this.openBankModal(record)
    },
    handleDelete(record) {
      this.$confirm({
        title: '系统提示',
        content: '确定删除吗?',
        onOk: () => {
          removeReceiptBank(record.id).then(res => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '删除成功'
              })
              this.refresh()
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.icon {
  color: #1890ff;
  font-size: 16px;
}
</style>
