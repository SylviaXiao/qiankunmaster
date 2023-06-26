<template>
  <div>
    <a-space>
      <!-- <a-button type="primary" @click="handleAdd">新增</a-button> -->
      <a-button @click="queryList">刷新</a-button>
    </a-space>
    <a-table class="mt-10" :columns="columns" :dataSource="list" rowKey="id" :loading="tableLoading">
      <span slot="action" slot-scope="text, record">
        <perm-box v-if="record.children" perm="education:children:score:create">
          <a  @click="handleAdd(record)">新增评分项</a>
        </perm-box>
        <a-space v-else>
          <perm-box perm="education:children:score:update">
            <a @click="handleEdit(record)">修改</a>
          </perm-box>
          <perm-box perm="education:children:score:delete">
            <a @click="handleDelete(record)">删除</a>
          </perm-box>
        </a-space>
      </span>
    </a-table>
    <!-- 新增绩点 -->
    <a-modal v-model="modalVisible" :title="modalTitle" @ok="handleOk">
      <a-form-model ref="form" :model="form" :rules="rules" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
        <a-form-model-item label="评分项" prop="scoreItem">
          <a-input v-model="form.scoreItem" />
        </a-form-model-item>
        <a-form-model-item label="评分描述" prop="scoreDescribe">
          <a-textarea v-model="form.scoreDescribe" />
        </a-form-model-item>
        <a-form-model-item label="最大分值" prop="scoreMax">
          <a-input-number v-model="form.scoreMax" :min="0" />
        </a-form-model-item>
        <a-form-model-item label="是否必填" prop="isRequired">
          <a-radio-group v-model="form.isRequired">
            <a-radio value="Y">是 </a-radio>
            <a-radio value="N">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sortOrder">
          <a-input-number v-model="form.sortOrder" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getChildrenScoreConfigList, createChildrenScoreConfig, updateChildrenScoreConfig, deleteChildrenScoreItem } from '@/api/system'
import { PermBox } from '@/components'
const columns = [
  {
    title: '舞种',
    width: 100,
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '评分项',
    width: 160,
    align: 'center',
    dataIndex: 'scoreItem',
  },
  {
    title: '评分描述',
    align: 'center',
    dataIndex: 'scoreDescribe',
  },
  {
    title: '最大分数',
    width: 100,
    align: 'center',
    dataIndex: 'scoreMax',
  },
  {
    title: '排序',
    width: 100,
    align: 'center',
    dataIndex: 'sortOrder',
  },
  {
    title: '操作',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  },
  // {
  //   title: ' ',
  //   width: 100,
  //   align: 'center',
  //   scopedSlots: { customRender: 'add' }
  // },

]
export default {
  name: 'childrenGradePoint',
  components: {
    PermBox,
  },
  data() {
    return {
      columns,
      list: [],
      tableLoading: false,
      currentRecord: null,
      addTitle: '',
      modalVisible: false,
      form: {},
      rules: {
        scoreItem: [{ required: true, message: '请输入', trigger: 'blur' }],
        scoreDescribe: [{ required: true, message: '请输入', trigger: 'blur' }],
        scoreMax: [{ required: true, message: '请输入', trigger: 'blur' }],
        isRequired: [{ required: true, message: '请选择', trigger: 'blur' }],
        sortOrder: [{ required: true, message: '请输入', trigger: 'blur' }],

      }
    }
  },
  computed: {
    modalTitle() {
      return (this.currentRecord ? '修改' : '新增') + this.addTitle + '评分项'
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.tableLoading = true
      getChildrenScoreConfigList().then(res => {
        this.list = res.data
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleAdd(record) {
      const { id, name } = record
      this.addTitle = name
      this.currentRecord = null
      this.form = {
        eduDance: { id }
      }
      this.modalVisible = true
    },
    handleEdit(record) {
      this.currentRecord = record
      this.addTitle = record.eduDance.name
      this.form = { ...record }
      this.modalVisible = true
    },
    async handleOk() {
      let valid = await this.$refs.form.validate()
      if (!valid) return
      let res = {}
      if (this.currentRecord) {
        res = await updateChildrenScoreConfig(this.form)
      } else {
        res = await createChildrenScoreConfig(this.form)
      }
      this.$message.info(res.msg)
      this.queryList()
      this.modalVisible = false
    },
    handleDelete(record) {
      const { id, scoreItem } = record
      this.$confirm({
        content: `确定要删除'${scoreItem}'吗？`,
        onOk: () => {
          deleteChildrenScoreItem(id).then(res => {
            this.queryList()
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table-cell-y {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 400;
  height: 48px;
}

.pointer {
  cursor: pointer;
}

.table-cell-r {
  justify-content: flex-end;
}

.table-cell-l {
  justify-content: flex-start;
}

div .table-cell-y:last-child {
  border-bottom: 0px;
}

.background-grey {
  background: #e5e5e5;
}
</style>