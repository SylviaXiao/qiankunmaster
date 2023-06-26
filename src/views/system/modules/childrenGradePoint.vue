<template>
  <div>
    <a-space>
      <a-button type="primary" @click="handleAdd">新增</a-button>
      <a-button @click="queryList">刷新</a-button>
    </a-space>
    <a-table class="mt-10" :columns="columns" :dataSource="list" rowKey="id" :loading="tableLoading">
      <span slot="action" slot-scope="text, record">
        <a-space>
          <a @click="handleEdit(record)">修改</a>
          <a @click="handleDelete(record)">删除</a>
        </a-space>
      </span>
    </a-table>
    <!-- 新增绩点 -->
    <a-modal v-model="modalVisible" :title="modalTitle" @ok="handleOk">
      <a-form-model ref="form" :model="form" :rules="rules" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
        <a-form-model-item label="绩点名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="等级" prop="level">
          <a-input-number v-model="form.level" :min="0" />
        </a-form-model-item>
        <a-form-model-item label="绩点分数" prop="score">
          <a-input-number v-model="form.score" :min="0" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getChildrenGradePointList, createChildrenGradePoint, updateChildrenGradePoint, deleteChildrenGradePointList } from '@/api/system'

const columns = [
  {
    title: '绩点名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '等级',
    width: 200,
    align: 'center',
    dataIndex: 'level',
  },
  {
    title: '绩点分数',
    width: 200,
    align: 'center',
    dataIndex: 'score',
  },
  {
    title: '操作',
    width: 200,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'childrenGradePoint',
  components: {

  },
  data() {
    return {
      columns,
      list: [],
      tableLoading: false,
      currentRecord: null,
      modalVisible: false,
      form: {},
      rules: {
        name: [{ required: true, message: '请输入绩点名称', trigger: 'blur' }],
        level: [{ required: true, message: '请输入', trigger: 'blur' }],
        score: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  computed: {
    modalTitle() {
      return this.currentRecord ? '修改' : '新增'
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.tableLoading = true
      getChildrenGradePointList().then(res => {
        this.list = res.data
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleAdd() {
      this.currentRecord = null
      this.form = {}
      this.modalVisible = true
    },
    handleEdit(record) {
      this.currentRecord = record
      this.form = { ...record }
      this.modalVisible = true
    },
    async handleOk() {
      let valid = await this.$refs.form.validate()
      if (!valid) return
      let res = {}
      if (this.currentRecord) {
        res = await updateChildrenGradePoint(this.form)
      } else {
        res = await createChildrenGradePoint(this.form)
      }
      this.$message.info(res.msg)
      this.queryList()
      this.modalVisible = false
    },
    handleDelete(record) {
      const { id, name } = record
      const params = { id }
      this.$confirm({
        content: `确定要删除'${name}'吗？`,
        onOk: () => {
          deleteChildrenGradePointList(params).then(res => {
            this.queryList()
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>