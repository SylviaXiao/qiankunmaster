<template>
  <div>
    <div class="between mb20">
      <div></div>
      <a-button type="primary" @click="addRow">新增</a-button>
    </div>
    <a-table
      ref="table"
      :columns="columns"
      :dataSource="dataSource"
      :scroll="{ x: 1000 }"
      :rowKey="(record, index) => index"
      :pagination="{ defaultPageSize: 5 }"
    >
      <span slot="className" slot-scope="text, record, index">
        <template v-if="!record.id">
          <a-input-search v-model="record.className" placeholder="请选择排课" enter-button read-only @search="appointmentOpen(index)" />
        </template>
        <template v-else>{{ record.className }}</template>
      </span>
      <span slot="name" slot-scope="text, record">
        <template v-if="!record.id && !resourceInfo.userName">
          <a-input v-model="record.name" placeholder="请输入姓名" />
        </template>
        <template v-else>{{ record.name }}</template>
      </span>
      <span slot="phone" slot-scope="text, record">
        <template v-if="!record.id && !resourceInfo.userPhone">
          <a-input v-model="record.phone" placeholder="请输入手机号码" />
        </template>
        <template v-else>{{ record.phone }}</template>
      </span>
      <span slot="logRemark" slot-scope="text, record">
        <template v-if="!record.id">
          <a-input v-model="record.logRemark" placeholder="请输入备注" :max-length="100" />
        </template>
        <template v-else>{{ record.logRemark }}</template>
      </span>
      <template slot="adviser" slot-scope="text, record, index">
        <a-input v-model="record.adviser" :read-only="true" @click="selectUser(record, index)" />
      </template>
      <span slot="action" slot-scope="text, record, index">
        <a href="javascript:;" style="padding: 0 5px;" @click="submitRow(record, index)" v-if="!record.id">确定</a>
        <a href="javascript:;" style="padding: 0 5px;" @click="removeRow(index)">取消</a>
      </span>
    </a-table>

    <!--预约试课 选择排课-->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="预约试课"
      :width="1100"
      :visible="appointmentVisible"
      :confirmLoading="confirmLoading"
      @ok="appointmentOk"
      @cancel="appointmentCancel"
    >
      <ChooseCourse ref="chooseCourse" />
    </a-modal>
    <i-modal ref="imodal" :userType="usertype" @getBackData="getUser"></i-modal>
  </div>
</template>

<script>
import { saveAuditionLog } from '@/api/student'
import ChooseCourse from '@/components/ChooseCourse'
import IModal from '@/components/InnerModal'
const columns = [
  {
    title: '选择排课',
    key: 'className',
    width: 300,
    dataIndex: 'className',
    scopedSlots: { customRender: 'className' }
  },
  {
    title: '姓名',
    key: 'name',
    width: 140,
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '手机号码',
    key: 'phone',
    width: 140,
    dataIndex: 'phone',
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '状态',
    key: 'signState',
    width: 100,
    dataIndex: 'signState',
    customRender: (text, record) => {
      return text === 'Y' ? '已签到' : text === 'N' ? '未签到' : ''
    }
  },
  {
    title: '备注',
    key: 'logRemark',
    dataIndex: 'logRemark',
    scopedSlots: { customRender: 'logRemark' }
  },
  {
    title: '顾问',
    width: 200,
    key: 'adviser',
    dataIndex: 'adviser',
    scopedSlots: { customRender: 'adviser' }
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    ChooseCourse,
    IModal
  },
  props: {
    resourceInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      usertype: 'master',
      columns,
      dataSource: [],
      confirmLoading: false,
      appointmentVisible: false,
      curIndex: null, // 选中行索引
      selectIndex: null,
      selectRecord: null
    }
  },
  created() {
    this.addRow()
  },
  methods: {
    getUser(data) {
      this.dataSource[this.selectIndex].adviser = data.name
      this.dataSource[this.selectIndex].adviserId = data.id
      this.$forceUpdate()
    },
    selectUser(record, index) {
      this.selectIndex = index
      this.selectRecord = record
      this.$refs.imodal.open()
    },
    addRow() {
      this.dataSource.push({
        id: undefined,
        dancePlanId: undefined,
        className: undefined,
        name: this.resourceInfo.userName,
        phone: this.resourceInfo.userPhone,
        signState: undefined,
        logRemark: undefined,
        adviser: this.resourceInfo.adviser || undefined,
        adviserId: this.resourceInfo.adviserId || undefined,
        key: 'not',
        isEditing: true
      })
    },
    submitRow(record, index) {
      let obj = {}
      obj.deptId = this.resourceInfo.deptId
      if (!this.resourceInfo.userName || !this.resourceInfo.userPhone) obj.stuUserId = this.resourceInfo.userId
      saveAuditionLog(Object.assign(obj, record)).then(res => {
        if (res.code === 200) {
          this.removeRow(index)
          if (this.dataSource.length === 0) this.addRow()
          this.$emit('refreshTable')
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
        }
      })
    },
    removeRow(index) {
      this.dataSource.splice(index, 1)
    },

    /*预约试课 选择排课*/
    appointmentOpen(index) {
      this.curIndex = index
      this.appointmentVisible = true
    },
    appointmentOk() {
      let selectedRow = this.$refs.chooseCourse.selectedRows[0]
      this.dataSource[this.curIndex].dancePlanId = selectedRow.planId
      this.dataSource[this.curIndex].className = selectedRow.className
      this.appointmentCancel()
    },
    appointmentCancel() {
      this.appointmentVisible = false
      this.$refs.chooseCourse.reset()
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import '~@/assets/style/index';
</style>
