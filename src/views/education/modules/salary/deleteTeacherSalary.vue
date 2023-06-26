<template>
  <div class="studentinfo-wrapper">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="删除薪酬" :width="800" v-model="stuTagModal">
      <div class="mb20">
        <span>老师姓名：{{ resourceInfo.teacherName }}</span>
        <span style="padding-left:40px;">联系方式：{{ resourceInfo.teacherMobile }}</span>
        <span style="padding-left:40px;">舞种：{{ resourceInfo.danceName }}</span>
        <span style="padding-left:40px;">地区：{{ resourceInfo.areaName }}</span>
      </div>
      <div style="    padding: 0 0 0 5px;border-left: 3px solid #1ba97b;margin-bottom: 5px;">薪酬配置</div>
      <div>
        <s-table :rowSelection="rowSelection" rowKey="id" :defaultPagination="true" ref="table" size="default" :columns="columns" :data="loadData">
          <span slot="salary" slot-scope="text, record">
            {{text}}
            <a-tag v-if="isOverflow(record)" color="red">超</a-tag>
          </span>
        </s-table>
      </div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="sendForm()">
          清空
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { teacherSalaryList, removeSalTemplateByBatch } from '@/api/education'
import { STable } from '@/components'
export default {
  components: { STable },
  data() {
    return {
      columns: [
        {
          title: '班型',
          dataIndex: 'typeName',
          key: 'typeName',
          ellipsis: true
        },

        {
          title: '薪酬类型',
          dataIndex: 'salaryName',
          key: 'salaryName'
        },
        {
          title: '金额区间',
          dataIndex: 'amountSection',
          key: 'amountSection'
        },
        {
          title: '薪酬值',
          dataIndex: 'salary',
          key: 'salary',
          scopedSlots: { customRender: 'salary' }
        },
        {
          title: '生效时间',
          dataIndex: 'takeEffectDate',
          key: 'takeEffectDate',
          customRender: (text, record) => {
            return text
          }
        }
      ],
      queryParam: {},
      loadData: parameter => {
        return teacherSalaryList({ teacherId: this.resourceInfo.id }).then(res => {
          return res
        })
      },
      stuTagModal: false,
      resourceInfo: {},
      loading: false,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    //校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve()
        }
      })
    },
    isOverflow(record) {
      const { amountSection, salary } = record
      const [before, after] = amountSection.split('-')
      return before && after && (salary < before || salary > after)
    },
    open(data) {
      this.resourceInfo = data
      this.selectedRowKeys = []
      this.selectedRows = []
      this._refreshTable()
      this.stuTagModal = true
    },
    _refreshTable() {
      if (this.$refs.table) this.$refs.table.refresh()
    },
    handleCancel() {
      this.stuTagModal = false
      this.loading = false
    },
    sendForm() {
      let that = this
      this.examine().then(() => {
        this.$confirm({
          title: '系统提示',
          content: '确定删除吗',
          onOk() {
            removeSalTemplateByBatch({ teacherIds: that.selectedRowKeys.join(',') })
              .then(res => {
                that.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                that.$emit('refresh')
                that.stuTagModal = false
              })
              .finally(() => {
                that.loading = false
              })
          },
          onCancel() {}
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';
</style>
