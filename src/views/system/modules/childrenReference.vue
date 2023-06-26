<template>
  <div>
    <a-card :bordered="false" class="mb-10">
      <search-com-pro ref="searchForm" :style="{ padding: '10px 0' }" :searchParams="searchParams"
        @searchSubmit="searchSubmit" />
    </a-card>
    <a-space class="mt-10">
      <a-button @click="queryList">刷新</a-button>
    </a-space>
    <a-table class="mt-10" :columns="columns" :dataSource="list" rowKey="deptId" :loading="tableLoading">
      <span slot="action" slot-scope="text, record">
        <a-space>
          <a @click="handleEdit(record)">修改</a>
        </a-space>
      </span>
    </a-table>
    <!-- 修改参考值 -->
    <a-modal v-model="modalVisible" :title="modalTitle" @ok="handleOk">
      <a-form-model ref="form" :model="form" :rules="rules" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
        <a-form-model-item label="地区">
          <div>{{ form.deptArea }}</div>
        </a-form-model-item>
        <a-form-model-item label="分馆">
          <div>{{ form.deptName }}</div>
        </a-form-model-item>
        <a-form-model-item label="参考值" prop="referenceValue">
          <a-input-number v-model="form.referenceValue" :min="0" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getChildrenPriAchValueConfigList, updateChildrenPriAchValueConfigList } from '@/api/system'
import { getSchoolList } from '@/api/education/card'
import { SearchComPro } from '@/components'
const columns = [
  {
    title: '地区',
    width: 200,
    align: 'center',
    dataIndex: 'deptArea',
  },
  {
    title: '分馆',
    width: 200,
    align: 'center',
    dataIndex: 'deptName',
  },
  {
    title: '参考值',
    align: 'center',
    dataIndex: 'referenceValue',
  },
  {
    title: '操作',
    width: 200,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'childrenReference',
  components: {
    SearchComPro
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
        referenceValue: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      queryParams: {},
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'deptIds',
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
      ]
    }
  },
  computed: {
    modalTitle() {
      return '修改'
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    searchSubmit(data) {
      this.queryParams = data
      this.queryList()
    },
    queryList() {
      this.tableLoading = true
      getChildrenPriAchValueConfigList({ ...this.queryParams }).then(res => {
        this.list = res.data
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleEdit(record) {
      this.currentRecord = record
      this.form = { ...record }
      this.modalVisible = true
    },
    async handleOk() {
      let valid = await this.$refs.form.validate()
      if (!valid) return
      await updateChildrenPriAchValueConfigList(this.form)
      this.queryList()
      this.modalVisible = false
    }
  }
}
</script>

<style lang="less" scoped></style>