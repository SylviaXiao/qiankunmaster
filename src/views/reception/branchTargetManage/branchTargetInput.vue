<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"/>
    </a-card>
    <a-card :bordered="false">
      <a-space :size="15">
        <perm-box perm="finance:target:save">
          <a-button type="primary" icon="plus-circle" @click="handleSaveOpen">年度目标录入</a-button>
        </perm-box>
      </a-space>
      <s-table ref="table" class="mt20" :data="loadData" :columns="columns" :rowKey="(record, index) => index">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="finance:target:update">
            <a href="#" @click="handleUpdateOpen(record)">修改</a>
          </perm-box>
          <perm-box perm="finance:target:del">
            <a href="#" @click="handleDelete(record)">删除</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="年度目标录入"
      :width="600"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSave"
      @cancel="handleCancel"
    >
      <a-table
        ref="saveTable"
        :rowClassName="rowClassName"
        :columns="saveColumns"
        :dataSource="formData"
        :rowKey="(record, index) => index" :pagination="false">
        <span slot="year" slot-scope="text, record">
          <a-input-number v-model="record.year" placeholder="请输入年份" :min="1970" :max="3000" style="width: 100px" />
        </span>
        <span slot="orgDeptId" slot-scope="text, record">
          <a-tree-select
            style="width: 200px"
            v-model="record.orgDeptId"
            treeNodeFilterProp="title"
            placeholder="请选择分馆"
            :allowClear="true"
            :dropdownStyle="{maxHeight: '400px', overflow: 'auto'}"
            :treeData="deptList"
            :treeDefaultExpandAll="true"
          />
        </span>
        <span slot="price" slot-scope="text, record">
          <a-input-number v-model="record.price" placeholder="请输入金额" style="width: 100px" /> 万
        </span>
        <span slot="action" slot-scope="text, record, index">
          <a href="#" class="ml10 mr10" @click="removeRow(index)" v-if="formData.length > 1">
            <a-icon type="close-circle" :style="{ fontSize: '16px' }" />
          </a>
        </span>
      </a-table>
      <a-button type="dashed" icon="plus-circle" block class="mt10" @click="addRow">新增一行</a-button>
    </a-modal>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="修改"
      :width="400"
      v-model="updateVisible"
      :confirmLoading="confirmLoading"
      @ok="handleUpdateSave"
      @cancel="handleUpdateCancel"
    >
      <a-form-model ref="ruleForm" :model="updateForm" :rules="updateRules">
        <a-form-model-item v-bind="defaultLayout" label="金额" prop="price">
          <a-input-number v-model="updateForm.price" placeholder="请输入金额" style="width: 100px" /> 万
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
  import { SearchComPro, PermBox, STable } from '@/components'
  import { getSchoolList } from '@/api/education/card'
  import { pageFinTarget, saveFinTarget, removeFinTarget, updateFinTarget } from '@/api/finance/finance'

  const columns = [
    {
      title: '目标年份',
      dataIndex: 'year',
      customRender: (text, record) => {
        return text + '年'
      }
    },
    {
      title: '地区',
      dataIndex: 'area'
    },
    {
      title: '分馆',
      dataIndex: 'deptName'
    },
    {
      title: '业绩目标金额',
      dataIndex: 'price'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const saveColumns = [
    {
      title: '目标年份',
      dataIndex: 'year',
      scopedSlots: { customRender: 'year' }
    },
    {
      title: '地区/分馆',
      dataIndex: 'orgDeptId',
      scopedSlots: { customRender: 'orgDeptId' }
    },
    {
      title: '业绩目标金额',
      dataIndex: 'price',
      scopedSlots: { customRender: 'price' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const defaultLayout = {
    labelCol: { md: { span: 6 } },
    wrapperCol: { md: { span: 14 } }
  }

  export default {
    name: 'branchTargetInput',
    components: {
      SearchComPro,
      PermBox,
      STable
    },
    data() {
      return {
        columns,
        searchParams: [
          {
            type: 'treeSelect',
            isShow: !!!this.$store.getters.school_id,
            key: 'school_id',
            label: '选择分馆',
            placeholder: '请选择分馆',
            expandAll: true,
            mutiple: true,
            treeCheckable: true,
            selectFather: true,
            treeOps: {
              api: getSchoolList,
              label: 'deptName',
              value: 'id',
              children: 'children'
            }
          },
          {
            type: 'text',
            key: 'year',
            label: '年份',
            placeholder: '请输入年份'
          }
        ],
        queryParam: {},
        loadData: parameter => {
          return pageFinTarget(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        },

        /* 年度目标录入 */
        confirmLoading: false,
        visible: false,
        saveColumns,
        formData: [],
        deptList: [],

        /* 修改 */
        defaultLayout,
        updateVisible: false,
        updateForm: {},
        updateRules: {
          price: [{ required: true, message: '请输入金额', trigger: 'change' }],
        }
      }
    },
    created() {
      this.getALLDeptSchools()
    },
    methods: {
      rowClassName(record, idx) {
        if (idx % 2 === 1) return 'ant-table-even'
      },
      //搜索功能
      searchSubmit(data) {
        this.queryParam = data
        this._refreshTable()
      },
      _refreshTable() {
        this.$refs.table.refresh()
      },

      getALLDeptSchools() {
        getSchoolList().then(res => {
          this.deptList = this._handleTreeData(res.data, true)
        })
      },
      _handleTreeData(data, disabled) {
        return data.map((item, index) => {
          let temObj = { disabled }
          temObj.title = item.name || item.deptName
          temObj.value = item.id
          temObj.deptType = item.deptType
          if (item.children && item.children.length > 0) {
            temObj.children = this._handleTreeData(item.children, false)
          }
          return temObj
        })
      },
      addRow() {
        this.formData.push({
          year: '',
          orgDeptId: '',
          price: 0
        })
      },
      removeRow(index) {
        this.formData.splice(index, 1)
      },
      handleSaveOpen() {
        this.visible = true
        this.formData = [{
          year: '',
          orgDeptId: '',
          price: 0
        }]
      },
      handleSave() {
        this.confirmLoading = true
        saveFinTarget({ finAmountTargets: JSON.stringify(this.formData) })
          .then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.handleCancel()
              this._refreshTable()
            }
          })
          .finally(() => {
            this.confirmLoading = false
          })
      },
      handleCancel() {
        this.visible = false
      },
      handleUpdateOpen(record) {
        this.updateVisible = true
        this.updateForm.id = record.id
        this.updateForm.price = record.price
      },
      handleUpdateSave() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true
            updateFinTarget(this.updateForm)
              .then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '保存成功'
                  })
                  this.handleUpdateCancel()
                  this._refreshTable()
                } else {
                  this.$notification['error']({
                    message: '系统通知',
                    description: res.msg
                  })
                }
              })
              .finally(() => {
                this.confirmLoading = false
              })
          }
        })
      },
      handleUpdateCancel() {
        this.updateVisible = false
        this.updateForm = {}
        this.$refs.ruleForm.resetFields()
      },
      handleDelete(record) {
        this.$confirm({
          title: '系统提示',
          content: '确定要删除选中数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            removeFinTarget(record.id).then(res => {
              if (res.code === 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                this._refreshTable()
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
</style>
