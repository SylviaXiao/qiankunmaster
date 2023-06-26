<template lang="html">
  <div class="cert-addedit-choose-wrpper">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      title="选择学员"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <a-table
        ref="table"
        :pagination = "false"
        :rowSelection="rowSelection"
        :columns="columnsChoose"
        :rowKey="record => record.stuId"
        :dataSource="dataSource"
        :loading="loading">
        <template slot="stuBirthday" slot-scope="text, record">
          {{_handleDate(text)}}
        </template>
     </a-table>
   </a-modal>
  </div>
</template>

<script>
import { getClassStuList } from '@/api/education'
import { columnsChoose } from '../certificate'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      classId: '',
      loading: false,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      columnsChoose
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
    }
  },
  methods: {
    delFromStuId(stuId) {
      this._deleteSelected(stuId)
    },
    reset() {
      this.dataSource = []
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    openModal() {
      this.visible = true
      this.initTalbe()
    },
    handleOk() {
      this.$emit('getChooseStu',this.selectedRows)
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    initTalbe() {
      this.classId = this.$route.params.classid
      let { classId } = this
      getClassStuList(classId).then(res=>{
        if(res.code === 200 && res.data) {
          this.dataSource = res.data
        }
      })
      .catch(err => {
      })
      .finally(() => {
        this.loading = false
      })
    },
    _handleDate(date) {
      return this.$tools.tailor.getDate(date)
    },
    _deleteSelected(stuId) {
      this.selectedRowKeys = this.selectedRowKeys.filter(item => item !== stuId)
      this.selectedRows = this.selectedRows.filter(item => item.stuId !== stuId)
    }
  }
}
</script>

<style lang="less" scoped>
.cert-addedit-choose-wrpper {

}
</style>
