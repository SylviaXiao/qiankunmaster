<template>
  <div class="stu-leave-addStaff">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="title" :visible="visibleAddEdit" @cancel="handleCancel" width="800px" :footer="false">
      <div>
        <a-card :bordered="false">
          <div class="mb20" style="text-align:right;">
            <a-button type="primary" @click="openTreeModal">选择员工</a-button>
          </div>
          <s-table ref="sTable" size="default" :columns="roleColumns" :data="loadData" :rowKey="(record, index) => index">
            <span slot="action" slot-scope="text, record">
              <span>
                <a href="javascript:;" @click="handleRemove(record)">删除</a>
              </span>
            </span>
          </s-table>
        </a-card>
      </div>
    </a-modal>
    <!-- 选择员工组件 -->
    <i-modal ref="imodal" :showOtherDept="false" :selectedKeys="selectedKeys" :checkBox="true" userType="all" @getBackData="getBackData"></i-modal>
  </div>
</template>
<script>
import { listEduDance } from '@/api/common'
import { saveMasterClass, checkGuaranteedEmployees, pageGuaranteedEmployees } from '@/api/recep'
import { pageAuditionLog } from '@/api/reception/student'
import { STable } from '@/components'
import PermBox from '@/components/PermBox'
import IModal from '@/components/InnerModal/modal.vue'
import moment from 'moment'
const roleColumns = [
  {
    title: '分馆',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '员工姓名',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '手机号',
    dataIndex: 'userTel',
    key: 'userTel'
  },
  {
    title: '工号',
    dataIndex: 'userNo',
    key: 'userNo'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    queryParam: {
      type: Object,
      default: {}
    }
  },
  components: {
    PermBox,
    STable,
    IModal
  },
  data() {
    return {
      selectedKeys: [],
      signDate: '',
      roleColumns,
      id: '',
      visibleAddEdit: false,
      loadData: parameter => {
        return pageGuaranteedEmployees(Object.assign(parameter, { signDate: this.signDate, signStatus: 'A' })).then(res => {
          return res
        })
      }
    }
  },
  created() {
    let signDate = ''
    if (this.queryParam.signDate) {
      signDate = this.queryParam.signDate
    } else {
      signDate = moment(new Date()).format('YYYY-MM-DD')
    }
    this.signDate = signDate
    this.getAllData().then(res => {
      if (res) {
        this.selectedKeys = res.map(item => item.id)
      }
    })
  },
  methods: {
    handleCancel() {
      this.visibleAddEdit = false
    },
    openTreeModal() {
      this.getAllData().then(res => {
        if (res) {
          this.selectedKeys = res.map(item => item.id)
        }
        this.$refs.imodal.open()
      })
    },
    getBackData(data, type) {
      let userIds = data.map(item => item.id).join(',')
      this.handleData(userIds, 'A')
    },
    handleData(userIds, signStatus) {
      checkGuaranteedEmployees({ userIds, signDate: this.signDate, signStatus })
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: signStatus == 'A' ? '操作成功' : '删除成功'
          })
          this._refreshTable()
        })
        .catch(err => {})
    },
    handleRemove(record) {
      let _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this.handleData(record.id, 'B')
        }
      })
    },
    getAllData() {
      return new Promise((resolve, reject) => {
        pageGuaranteedEmployees({ signDate: this.signDate, signStatus: 'A', page: 0, limit: 0 })
          .then(res => {
            if (res.code == 200) {
              resolve(res.data)
            } else {
              reject()
            }
          })
          .catch(err => {
            reject()
          })
      })
    },
    open() {
      let signDate = ''
      if (this.queryParam.signDate) {
        signDate = this.queryParam.signDate
      } else {
        signDate = moment(new Date()).format('YYYY-MM-DD')
      }
      this.signDate = signDate
      this.visibleAddEdit = true
      this._refreshTable()
    },
    _refreshTable() {
      this.$nextTick(() => {
        this.$refs.sTable.refresh()
      })
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-addStaff {
}
</style>
