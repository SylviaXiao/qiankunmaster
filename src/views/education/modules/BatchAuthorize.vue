<template>
  <div class="batch-authorize-wrapper">
    <div class="search-wrapper">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" ref="searchComPro"></search-com-pro>
    </div>
    <div class="table-wrapper">
      <a-table
        ref="table"
        :columns="columns"
        :dataSource="tableLoad"
        :pagination="false"
        :loading="tableLoading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        rowKey="id"
      >
      </a-table>
    </div>
  </div>
</template>

<script>
import SearchComPro from '@/components/SearchComPro'
import { getSchoolList } from '@/api/education/card'
import { listGrantEduCard, batchGrantEduCards } from '@/api/education'

const columns = [
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '班型',
    dataIndex: 'ectName',
    key: 'ectName'
  },
  {
    title: '金额(元)',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '有效期(天)',
    dataIndex: 'validDay',
    key: 'validDay'
  },
  {
    title: '卡类型',
    dataIndex: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '单色' : text === 'B' ? '优鸽' : '通用'
    }
  }
]

export default {
  name: 'BatchAuthorize',
  components: {
    SearchComPro
  },
  data() {
    return {
      columns,
      searchParams: [
        {
          type: 'treeSelect',
          isShow: true,
          key: 'school_id',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'type',
          label: '卡类型',
          placeholder: '请选择类型',
          staticArr: [
            {
              string: '单色',
              value: 'A'
            },
            {
              string: '优鸽',
              value: 'B'
            }
          ]
        }
      ],
      queryParam: {},
      tableLoading: false,
      tableLoad: [],
      selectedRowKeys: []
    }
  },
  methods: {
    init() {
      this.tableLoad = []
      this.$refs.searchComPro.form.resetFields()
    },
    dataLoad() {
      const { queryParam, pushSelect } = this
      this.tableLoading = true
      this.selectedRowKeys = []
      this.tableLoad = []
      listGrantEduCard(queryParam)
        .then(res => {
          this.tableLoad = res.data
          return this.tableLoad
        })
        .then(pushSelect)
        .finally(() => (this.tableLoading = false))
    },
    refresh() {
      this.dataLoad()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    pushSelect(arr) {
      return new Promise(resolve => {
        arr.map(item => {
          item.schoolId ? this.selectedRowKeys.push(item.id) : ''
        })
        resolve()
      })
    },
    searchSubmit(data) {
      const hasValue = data.school_id
      hasValue
        ? this.$nextTick(() => {
            this.queryParam = data
            this.refresh()
          })
        : this.$nextTick(() => {
            this.$notification['error']({
              message: '系统通知',
              description: '请选择分馆后在查询'
            })
            this.init()
          })
    },
    sendForm() {
      const { selectedRowKeys, queryParam } = this
      const cards = { cardIds: selectedRowKeys.join(',') }
      const params = Object.assign(cards, queryParam)
      return batchGrantEduCards(params).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '授权成功'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.batch-authorize-wrapper {
  .table-wrapper {
    max-height: 600px;
    overflow: auto;
  }
}
</style>
