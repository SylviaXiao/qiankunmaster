<template>
  <div class="table-signin-wrapper">
    <a-table
      :columns="stuColumns"
      :dataSource="finallyStudentArr"
      :pagination="false"
      :scroll="{ y: 470 }"
      rowKey="stuCardId"
      :rowClassName="changeTableStyle"
      :rowSelection="rowSelection"
    >
      <span slot-scope="text, record" slot="avatar">
        <a-avatar shape="square" :style="{ verticalAlign: 'middle' }" size="small" icon="user" :src="text" v-if="text" />
      </span>
      <span slot-scope="text, record" slot="stuName">
        <span style="margin-right: 5px;">{{ text }}</span>
        <a-tag v-if="!record.payoff">欠</a-tag>
        <a-tag v-if="isOverdue(record.endValidDate) || isOverTimes(record)">过</a-tag>
        <a-tag v-if="record.status == 'C'">停</a-tag>
      </span>
      <span slot-scope="text, record" slot="endValidDate">
        <span>{{ $tools.tailor.getDate(text) || '无' }}</span>
      </span>
      <span slot-scope="text, record" slot="action">
        <perm-box perm="student:signinlog:del">
          <a href="javascript:;" v-if="record.signed == 'Y'" @click="cancalSignin(record)">取消签到</a>
        </perm-box>
      </span>
    </a-table>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import { deleteReplenishesPlan, removeSignInLog } from '@/api/education'
import commonTools from './tools'

const { isOverTimes, isOverdue } = commonTools

const stuColumns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    width: '100px',
    scopedSlots: { customRender: 'avatar' }
  },
  {
    title: '学号',
    width: '100px',
    dataIndex: 'stuNo'
  },
  {
    title: '姓名',
    width: '120px',
    dataIndex: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号码',
    width: '200px',
    dataIndex: 'stuPhone'
  },
  {
    title: '有效期至',
    dataIndex: 'endValidDate',
    scopedSlots: { customRender: 'endValidDate' }
  },

  {
    title: '次数/总数',
    dataIndex: 'stuCount',
    customRender: (text, record) => {
      return `${record.usedCount}次/${record.totalCount || '不限次数'}`
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '80px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'TableSignin',
  props: {
    finallyStudentArr: {
      type: Array,
      default: () => []
    },
    finallySelectStudentArr: {
      type: Array,
      default: () => []
    }
  },
  components: {
    PermBox
  },
  data() {
    return {
      stuColumns,
      isOverTimes,
      isOverdue
    }
  },
  computed: {
    rowSelection() {
      const { finallySelectStudentArr, selectStudent, selectAll, setDisabled } = this
      return {
        selectedRowKeys: finallySelectStudentArr,
        onSelect: selectStudent,
        onSelectAll: selectAll,
        getCheckboxProps: setDisabled
      }
    }
  },
  methods: {
    selectStudent(record) {
      this.$emit('check', record)
    },
    selectAll(record) {
      this.$emit('selectAll', { target: { checked: record } })
    },
    changeTableStyle(record) {
      let className = ''
      if (isOverdue(record.endValidDate) || isOverTimes(record) || !record.payoff || record.status === 'C') {
        className = 'overdue-table'
      }
      return className
    },
    setDisabled(record) {
      return {
        props: {
          disabled: isOverdue(record.endValidDate) || isOverTimes(record) || !record.payoff || record.status === 'C'
        }
      }
    },
    refreshList() {
      this.$emit('refresh')
    },
    cancalSignin(record) {
      const { signLogId } = record
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认取消该学员的签到吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          deleteReplenishesPlan(signLogId).then(res => {
            const { data } = res
            if (data) {
              _this.removeSignInLogCompletely(record)
            } else {
              _this.refreshList()
            }
          })
        }
      })
    },
    // 取消学员和导师的签到
    removeSignInLogCompletely(record) {
      const { dancePlanId } = record
      this.$confirm({
        title: '系统提示',
        content: '取消当前签到记录会同步取消该节课导师的签到记录，是否确认取消？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeSignInLog(dancePlanId).then(res => {
            this.refreshList()
          })
        }
      })
    }
  }
}
</script>

<style scoped></style>
