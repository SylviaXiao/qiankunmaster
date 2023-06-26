<template>
  <div class="master-class-info-stu-edit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      :confirmLoading="confirmAddEditLoading"
      width="800px"
      @ok="onSubmit"
      @cancel="onAddEditCancel"
    >
      <div>
        <a-form :form="formEdit">
          <a-row>
            <a-col :lg="12" :md="12" :sm="12">
              <a-form-item v-bind="formLayout" label="使用次数">
                <a-input
                  v-decorator="[
                    `usedCount`,
                    { rules: [{ required: true, message: '请输入使用次数' }, { validator: $verify.isNum }] }
                  ]"
                  placeholder="请输入使用次数"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="12">
              <a-form-item v-bind="formLayout" label="总次数">
                <a-input
                  v-decorator="[
                    `totalCount`,
                    { rules: [{ required: true, message: '请输入总次数' }, { validator: $verify.isNum }] }
                  ]"
                  placeholder="请输入总次数"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <perm-box perm="student:card:view">
          <div class="table-wrapper">
            <a-table ref="table" :pagination="false" :columns="columns" :dataSource="loadData" rowKey="id">
              <span slot="updateDate" slot-scope="text, record">
                {{text | filterDate}}
              </span>
              <span slot="old" slot-scope="text, record">
                {{record.oldUsedCount+'/'+record.oldTotalCount}}
              </span>
              <span slot="new" slot-scope="text, record">
                {{record.newUsedCount+'/'+record.newTotalCount}}
              </span>
            </a-table>
          </div>
        </perm-box>
      </div>
    </a-modal>
    <!-- 选择员工组件 -->
  </div>
</template>
<script>
const columns  = [
  {
    title: '修改时间',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' },
  },
  {
    title: '改前次数',
    dataIndex: 'old',
    scopedSlots: { customRender: 'old' },
  },
  {
    title: '改后次数',
    dataIndex: 'new',
    scopedSlots: { customRender: 'new' },
  },
  {
    title: '操作人',
    dataIndex: 'userName',
  },
]
import PermBox from '@/components/PermBox'
import { listEduDance } from '@/api/common'
import { changeNumStudentCard, listStuCardNumLog } from '@/api/recep'
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
  name: 'stuCardEditCardCount',
  components: {
    PermBox
  },
  props: {
    title: {
      type: String,
      default: '修改次数'
    },
    record: Object
  },
  data() {
    return {
      formLayout,
      columns,
      loadData: [],
      visibleAddEdit: false,
      confirmAddEditLoading: false
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    onSubmit() {
      this.validateData().then(res => {
        let params = res
        changeNumStudentCard(params, this.record.id).then(res => {
          this.refreshTable()
          this.onAddEditCancel()
        })
      })
    },
    onAddEditCancel() {
      this.visibleAddEdit = false
    },
    open() {
      this.reset()
      this.visibleAddEdit = true
    },
    backindData(record) {
      const { usedCount, totalCount } = record
      this.loadDataFn(record.id)
      let formData = {}
      formData.usedCount = usedCount || 0
      formData.totalCount = totalCount || 0
      this.$nextTick(() => {
        this.formEdit.setFieldsValue(formData)
      })
    },
    loadDataFn(id) {
      listStuCardNumLog(id).then(res => {
        this.loadData = res.data
      })
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    reset() {
      this.formEdit.resetFields()
    },
    refreshTable() {
      this.$emit('refresh', this.stuId)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';
.btn-wrapper {
  width: 100%;
  margin-bottom: 24px;
  .center();
}
.master-class-info-stu-edit {
}
</style>
