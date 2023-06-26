<template>
  <div v-if="stuId" class="studentinfo-account-wrapper">
    <s-table :style="{ marginTop: '20px' }" ref="table" size="default" :columns="columns" :data="loadData" rowKey="id"> </s-table>
  </div>
</template>
<script>
import { accountColumns } from '@/utils/reception/student'
import { pageStuPaidLog } from '@/api/reception/student'
import STable from '@/components/Table'

export default {
  components: {
    STable
  },
  data() {
    return {
      columns: accountColumns,
      queryParam: {},
      loadData: this.loadDataFn()
      // loadData: (parameter) => {
      //   return pageStuPaidLog( Object.assign(parameter, {studentId: this.stuId})).then(res => {
      //     return res
      //   })
      // }
    }
  },
  watch: {
    stuId(nv, ov) {
      if (nv) {
        const _this = this
        // 拿到studentId以后请求数据渲染列表
        this.$nextTick(() => {
          if (_this.$refs.table) {
            _this.$refs.table.refresh()
          }
        })
      }
    }
  },
  props: {
    stuId: String
  },
  methods: {
    loadDataFn() {
      return parameter => {
        return pageStuPaidLog(Object.assign(parameter, { studentId: this.stuId })).then(res => {
          if(!res.data.length) {
            this.$emit('hideThis')
          }
          return res
        })
      }
    },
    _refreshTable() {
      this.$refs.table ? this.$refs.table.refresh() : ''
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

.studentinfo-account-wrapper {
  .infoItem {
    margin: 10px 0;

    .info-item-label {
      text-align: right;
    }

    .info-item-content {
      padding-left: 5px;
      box-sizing: border-box;
      .ellipsis();
    }
  }
}
</style>
