<template>
  <div>
    <a-modal v-model="visible" title="签到记录" :width="1200" @ok="onOk">
      <a-table :dataSource="list" :columns="columns" :rowKey="(record, index) => index"
        :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
      </a-table>
    </a-modal>

  </div>
</template>

<script>
import { getCardNextLog } from '@/api/student'
const columns = [
  {
    title: '上课时间',
    align: 'center',
    dataIndex: 'courseTime',
  },
  {
    title: '签到时间',
    align: 'center',
    dataIndex: 'signTime',
  },
  {
    title: '班级名称',
    align: 'center',
    dataIndex: 'className'
  },
  {
    title: '学员名称',
    align: 'center',
    dataIndex: 'stuName',
  },
  {
    title: '卡号',
    align: 'center',
    dataIndex: 'cardNo'
  },
  {
    title: '签到状态',
    align: 'center',
    dataIndex: 'signStatus',
    customRender: val => {
      if (val == 'Y') return '已签到'
      return '未签到'
    }
  },
  {
    title: '签到计次',
    align: 'center',
    dataIndex: 'signCount',
  },
  {
    title: '导师',
    align: 'center',
    dataIndex: 'teacherInfo',
    customRender: (val, record) => {
      let teachers = []
      for (const teacher of record.teacherInfo) {
        teachers.push(teacher.teacherName)
      }
      return teachers.join(',')
    }
  },
  {
    title: '绩点',
    width: 100,
    align: 'center',
    dataIndex: 'classGradePoint',
    customRender: (val, record) => {
      return val?.score 
    }
  }
]
export default {
  name: 'classPicker',
  data() {
    return {
      visible: false,
      list: [],
      columns,
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  computed: {
  },
  methods: {
    // 传什么卡查什么卡，不区分往期
    open(cardId, createDate) {
      this.visible = true
      getCardNextLog({ cardId, createDate }).then(res => {
        this.list = res.data || []
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onOk() {
      if (this.selectedRows.length > 0) {
        this.$emit('change', this.selectedRows[0])
      }
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped></style>