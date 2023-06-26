<template>
  <a-modal v-model="visible" title="排课异常反馈" :width="800" @ok="visible = false">
    <div style="font-weight: bold">
      <div>
        <span>班级名称： {{ record.className }}</span>
        <span></span>
      </div>
      <div class="my-10">
        <span>
          上课时间： <span class="mr-10">{{ `${$tools.tailor.getDate(record.startDate)}` }}</span>
          <span>
            {{ `${$tools.tailor.getTime(record.startDate)} ~ ${$tools.tailor.getTime(record.endDate)}` }}
          </span>
        </span>
      </div>
    </div>
    <a-table ref="table" :columns="columns" :dataSource="list" :loading="loading" :rowKey="record => record.abnormalId">
      <span slot="action" slot-scope="text, record">
        <a-checkbox :checked="isSolved(record)" @change="handleStateChange($event, record)">
          {{ isSolved(record) ? '已处理' : '未处理' }}
        </a-checkbox>
      </span>
    </a-table>
  </a-modal>
</template>
<script>
import { getAbnormalFeedbackList, updateAbnormalState } from '@/api/recep'
import TestChild from '@/views/test/TestChild.vue'
const columns = [
  {
    title: '反馈人',
    align: 'center',
    dataIndex: 'userName'
  },
  {
    title: '反馈时间',
    align: 'center',
    dataIndex: 'createDate'
  },
  {
    title: '反馈内容',
    width: 200,
    align: 'center',
    dataIndex: 'content'
  },
  {
    title: '处理状态',
    align: 'center',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'AbnormalList',
  components: {},
  data() {
    return {
      record: {},
      visible: false,
      loading: false,
      columns,
      list: []
    }
  },
  computed: {},
  methods: {
    isSolved(record) {
      return record.state === 'B'
    },
    open(record) {
      this.record = { ...record }
      this.queryList()
      this.visible = true
    },
    async queryList() {
      this.loading = true
      const params = {
        planId: this.record.planId
      }
      let res = await getAbnormalFeedbackList(params)
      this.list = res.data
      this.loading = false

      let allSolved = true
      for (const item of this.list) {
          if (!this.isSolved(item)) {
            allSolved = false
            break
          }
      }
      allSolved && this.$emit('allSolved')
    },
    async handleStateChange(e, record) {
      const checked = e.target.checked
      const { abnormalId } = record
      const params = {
        abnormalId,
        state: checked ? 'B' : 'A'
      }
      let res = await updateAbnormalState(params)
      this.queryList()
    }
  }
}
</script>

<style lang="less" scoped></style>
