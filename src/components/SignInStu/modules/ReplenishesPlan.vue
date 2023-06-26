<template>
  <div class="replenishes-plan-wrapper">
    <edit-table
      :columnsOptions="rePlanColumns"
      :tableArr="ReplenishesPlanList"
      :eidtParams="eidtParams"
      ref="editTable"
      :hasEditAction="false"
      tableRowKey="signLogId"
      @cancel="cancelReplenishesPlan"
      @saved="saveReplenishesPlan"
      @delete="deleteReplenishesPlan"
    >
      <template slot="stuName-custom" slot-scope="record">
        <general-choice-ipt :inputValues="record.data || studentName" @search="openModal" @close="resetValue" closable> </general-choice-ipt>
      </template>
    </edit-table>
    <general-choice-modal
      @ok="selectStudent"
      ref="modal"
      :eduTypeId="eduTypeId"
      :dataMethods="methods"
      modalTitle="请选择补课学员"
      :tableColumns="addStudentColumns"
      :tableParams="{ danceId: record.danceId, typeId: record.typeId, classId: record.classId }"
      :searchParams="searchParams"
    >
    </general-choice-modal>
  </div>
</template>

<script>
import EditTable from '@/components/EditTable'
import GeneralChoiceIpt from '@/components/GeneralChoiceIpt'
import GeneralChoiceModal from '@/components/GeneralChoiceModal'
import { pageReplenishesPlan, saveReplenishesPlan, getReplenishesPlan, deleteReplenishesPlan, removeSignInLog } from '@/api/education'
const rePlanColumns = [
  {
    title: '姓名',
    width: 200,
    dataIndex: 'stuName',
    input: 'custom',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    input: 'input',
    scopedSlots: { customRender: 'remark' }
  }
]
const addStudentColumns = [
  {
    title: '学员名称',
    dataIndex: 'stuName',
    key: 'stuName'
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName'
  },
  {
    title: '联系电话',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  }
]

export default {
  name: 'ReplenishesPlan',
  props: {
    dancePlanId: { type: String, default: null },
    record: {
      type: Object,
      default: () => {}
    },
    eduTypeId: {
      type: String,
      default: ''
    }
  },
  components: {
    EditTable,
    GeneralChoiceIpt,
    GeneralChoiceModal
  },
  mounted() {
    console.log(this.eduTypeId)
  },
  data() {
    return {
      rePlanColumns,
      ReplenishesPlanList: [],
      eidtParams: {
        name: null,
        remark: null
      },
      studentName: '',
      addStudentColumns,
      searchParams: [
        {
          type: 'text',
          key: 'name',
          label: '学员信息',
          placeholder: '学员姓名/手机号码'
        }
      ],
      queryParams: {}
    }
  },
  computed: {
    methods() {
      return pageReplenishesPlan
    }
  },
  created() {
    this.getReplenishesPlan()
    console.log('record =>', this.record)
  },
  methods: {
    getReplenishesPlan() {
      const { dancePlanId } = this
      this.$nextTick(() => {
        this.$refs.editTable.cancelTableItem()
      })
      getReplenishesPlan({ dancePlanId }).then(res => {
        this.ReplenishesPlanList = res.data
      })
    },

    saveReplenishesPlan(params) {
      const { queryParams, dancePlanId, $notification } = this
      const { remark, stuCardId } = params
      if (!this.$tools.checkPerm('education:class:replenishes:save')) {
        $notification['error']({
          message: '系统通知',
          description: '暂无权限!'
        })
        return false
      }
      stuCardId ? (this.queryParams['studentCardIds'] = stuCardId) : ''
      const values = Object.assign(queryParams, { remark }, { dancePlanId })
      saveReplenishesPlan(values).then(res => {
        $notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.$emit('refresh')
        this.getReplenishesPlan()
        this.$refs.editTable.cancelTableItem()
      })
    },
    cancelReplenishesPlan() {
      this.resetValue()
    },
    refreshList() {
      this.$emit('refresh')
      this.getReplenishesPlan()
      this.$refs.editTable.cancelTableItem()
    },
    deleteReplenishesPlan(params) {
      const { signLogId } = params
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          deleteReplenishesPlan(signLogId).then(res => {
            const { data } = res
            if (data) {
              _this.removeSignInLogCompletely(params)
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
    },
    openModal() {
      this.$refs.modal.openModal()
    },
    resetValue(value) {
      this.queryParams['studentCardIds'] = null
      this.studentName = ''
    },
    selectStudent(params) {
      const { cardId, stuName } = params
      this.studentName = stuName
      this.queryParams['studentCardIds'] = cardId
    }
  }
}
</script>

<style scoped lang="less"></style>
