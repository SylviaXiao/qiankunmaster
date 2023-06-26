<template>
  <div>
    <a-card :bordered="false">
      <div class="mb20">
        <a-space :size="15">
          <perm-box perm="finance:company:save">
            <a-button icon="plus-circle" type="primary" @click="handleSave">新增</a-button>
          </perm-box>
        </a-space>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="finance:company:update">
            <a href="#" @click="handleSave(record)">修改</a>
          </perm-box>
          <perm-box perm="finance:company:del">
            <a href="#" @click="handleDelete(record)">删除</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <!-- 新增 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="新增类型"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item v-bind="defaultLayout" label="区域" prop="areaName">
          <a-input v-model="form.areaName" />
        </a-form-model-item>
        <a-form-model-item v-bind="defaultLayout" label="分馆" prop="deptIds">
          <div class="tree_wrap">
            <a-tree
              checkable
              v-model="form.deptIds"
              :treeData="deptTree"
              :defaultExpandAll="true"
              :autoExpandParent="true"
              :checkStrictly="true"
              @check="branchCheck"
            />
          </div>
        </a-form-model-item>
        <a-form-model-item v-bind="defaultLayout" label="公司名称" prop="companyName">
          <a-input v-model="form.companyName" />
        </a-form-model-item>
        <a-form-model-item v-bind="defaultLayout" label="税号" prop="taxNumber">
          <a-input v-model="form.taxNumber" />
        </a-form-model-item>
        <a-form-model-item v-bind="defaultLayout" label="工资分馆" prop="salaryStatus">
          <a-radio-group v-model="form.salaryStatus">
            <a-radio value="A">
              是
            </a-radio>
            <a-radio value="B">
              否
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { STable, PermBox } from '@/components'
import { pageFinCompany, finCompanyInfo, addFinCompany, updateFinCompany, deleteFinCompany } from '@/api/finance/finance'
import { listOrgDept } from '@/api/education/card'

const columns = [
  {
    title: '区域',
    dataIndex: 'areaName',
    key: 'areaName',
    scopedSlots: { customRender: 'areaName' }
  },
  {
    title: '分馆',
    dataIndex: 'branchNames',
    key: 'branchNames',
    scopedSlots: { customRender: 'branchNames' }
  },
  {
    title: '公司名称',
    dataIndex: 'companyName',
    key: 'companyName',
    scopedSlots: { customRender: 'companyName' }
  },
  {
    title: '税号',
    dataIndex: 'taxNumber',
    key: 'taxNumber'
  },
  {
    title: '工资分馆',
    dataIndex: 'salaryStatus',
    key: 'salaryStatus',
    customRender: (text, record) => {
      return text == 'A' ? '是' : text == 'B' ? '否' : ''
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]
const defaultLayout = {
  labelCol: { md: { span: 6 } },
  wrapperCol: { md: { span: 14 } }
}

export default {
  components: {
    STable,
    PermBox
  },
  data() {
    return {
      columns,
      loadData: parameter => {
        return pageFinCompany(parameter).then(res => {
          return res
        })
      },
      defaultLayout,
      confirmLoading: false,

      /* 新增 */
      visible: false,
      form: {
        id: '',
        areaName: '',
        companyName: '',
        taxNumber: '',
        salaryStatus: '',
        deptIds: []
      },
      rules: {
        areaName: [{ required: true, message: '请输入类型名称', trigger: 'change' }],
        deptIds: [{ required: true, message: '请选择分馆', trigger: 'change' }],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'change' }],
        taxNumber: [{ required: true, message: '请输入税号', trigger: 'change' }],
        salaryStatus: [{ required: true, message: '请选择工资分馆', trigger: 'change' }]
      },
      deptTree: []
    }
  },
  created() {
    this.findBranchTree()
  },
  methods: {
    findBranchTree() {
      listOrgDept().then(res => {
        this._handleTreeData(res.data)
        this.deptTree = res.data
      })
    },
    _handleTreeData(data) {
      data.forEach((item, index) => {
        item.title = item.deptName || ''
        item.value = item.id
        item.key = item.id
        if (item.children && item.children.length > 0) {
          this._handleTreeData(item.children)
        }
      })
    },
    branchCheck(checkedKeys, { checked, checkedNodes, node, event }) {
      this.form.deptIds = checkedKeys.checked
      this.$refs.ruleForm.validateField('deptIds')
    },
    /* 新增 */
    handleSave({ id, areaName, companyName, taxNumber, salaryStatus }) {
      if (id) {
        this.form = { id, areaName, companyName, deptIds: [], taxNumber, salaryStatus }
        finCompanyInfo({ id }).then(res => {
          if (res.code == 200) {
            this.form.deptIds = res.data?.listFinCompanyInfo?.map(item => item.branchId) || []
          }
        })
      }
      this.visible = true
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        let that = this

        if (valid) {
          let params = JSON.parse(JSON.stringify(this.form))
          params.deptIds = params.deptIds.join(',')

          this.confirmLoading = true
          let request = this.form.id ? updateFinCompany(params) : addFinCompany(params)
          request
            .then(res => {
              if (res.code === 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: '保存成功'
                })
                this.handleCancel()
                this._refreshTable()
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: res.msg
                })
              }
            })
            .finally(() => (this.confirmLoading = false))
        }
      })
    },
    handleCancel() {
      this.form = {
        id: '',
        areaName: '',
        companyName: '',
        taxNumber: '',
        salaryStatus: '',
        deptIds: []
      }
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },

    // 删除
    handleDelete({ id }) {
      this.$confirm({
        title: '系统提示',
        content: '确定要删除选中数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          deleteFinCompany({ id }).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '删除成功'
              })
              this._refreshTable()
            } else {
              this.$notification['error']({
                message: '系统通知',
                description: res.msg
              })
            }
          })
        }
      })
    },

    // 刷新列表
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
.tree_wrap {
  height: 40vh;
  overflow-y: auto;
}
</style>
