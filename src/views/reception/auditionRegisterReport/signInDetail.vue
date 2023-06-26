<template>
  <div>
    <a-modal v-model="visible" width="90%" :title="title">
      <a-button v-if="list && list.length > 0" type="primary" icon="download" @click="handleExport">导出</a-button>
      <a-table class="mt-10" :dataSource="list" :columns="columns" :rowKey="(record, index) => index">
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { getAuditionprivateEduAuditionDetail, exportAuditionprivateEduAuditionDetail } from '@/api/organize'
// cardno, deptId, tradeDate,achPrice,stuName,num
const columns = [
  {
    title: '分馆',
    align: 'center',
    dataIndex: 'deptName'
  },
  {
    title: '199报名日期',
    align: 'center',
    dataIndex: 'tradeDate'
  },
  {
    title: '199卡号',
    align: 'center',
    dataIndex: 'cardno'
  },
  {
    title: '学员名称',
    align: 'center',
    dataIndex: 'stuName'
  },
  {
    title: '报名业绩金额',
    align: 'center',
    dataIndex: 'achPrice'
  },
  {
    title: '报名人数',
    align: 'center',
    dataIndex: 'num'
  },

]
export default {
  name: 'personalAuditionRgisterSignInDetail',
  components: {

  },
  data() {
    return {
      visible: false,
      record: {},
      extData: {},
      list: [],
      columns,
      params: {},
    }
  },
  computed: {
    title() {
      return '报名人数详情' + '/' + this.signInType
    },
    signInType() {
      return (this.extData.type === 'A' ? '单报' : '套报')
    }
  },
  methods: {
    open(record, extData) {
      this.record = record
      this.extData = extData
      this.visible = true
      this.queryList()
    },
    async queryList() {
      const { branchId, areaId ,branchIds} = this.record
      const { type, startDate, endDate, tableName} = this.extData
      const params = {
        startDate,
        endDate,
        type,
      }
      if (tableName === 'table1') {
        params.branchId=branchId
      } else {
        params.branchId=branchIds
      }
      console.log(222,params)
      this.params = params
      let res = await getAuditionprivateEduAuditionDetail(params)
      this.list = res.data
    },
    async handleExport() {
      if (!(this.list?.length > 0)) return
      let res = await exportAuditionprivateEduAuditionDetail(this.params)
      let deptName = this.record.deptName || this.record.deptArea
      this.$tools.exportExcel(res, `${deptName}${this.signInType}私教199试课报名人数详情`)
    }
  }
}
</script>

<style lang="less" scoped></style>