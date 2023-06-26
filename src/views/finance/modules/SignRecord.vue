<template>
  <div>
    <a-modal
      :title="'签到记录  合计：' + signTotalCount"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :visible="visible"
      :width="800"
      @cancel="close"
    >
      <div>
        <a-table
          ref="table"
          :loading="tableLoading"
          :columns="signColumns"
          :dataSource="signList"
          :rowKey="record => record.id"
          :pagination="false"
        ></a-table>
      </div>
      <template slot="footer">
        <template>
          <a-button @click="close">关闭</a-button>
        </template>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import { getStudentCardSign } from '@/api/reception/student'

  const signColumns = [
    {
      title: '签到班级',
      dataIndex: 'className'
    },
    {
      title: '上课时间',
      dataIndex: 'startDate',
      customRender: (text, record) => {
        const { startDate, endDate } = record
        if (startDate && endDate) {
          return moment(startDate).format('YYYY-MM-DD HH:mm') + '~' + moment(endDate).format('HH:mm')
        }
        return ''
      }
    },
    {
      title: '签到时间',
      dataIndex: 'signDate',
      customRender: (text, record) => {
        return text ? moment(text).format('YYYY-MM-DD') : ''
      }
    },
    {
      title: '班级类型',
      dataIndex: 'eduTypeName'
    },
    {
      title: '卡号',
      dataIndex: 'stuCardNo'
    },
    {
      title: '签到计次',
      dataIndex: 'signCount'
    },
    {
      title: '签到老师',
      dataIndex: 'teacherName'
    }
  ]

  export default {
    components: {
    },
    data() {
      return {
        visible: false,
        tableLoading: false,
        signColumns,
        signList: [],
      }
    },
    created() {
    },
    computed: {
      signTotalCount() {
        return this.signList.map(d => d.signCount).reduce((a, b) => this.$number(a).plus(b), this.$number(0)).toNumber()
      }
    },
    methods: {
      open(id) {
        this.visible = true
        this.initList(id)
      },
      close() {
        this.visible = false
        this.signList = []
      },
      // 缴费/退费记录
      initList(stuCardId) {
        this.tableLoading = true
        getStudentCardSign({ stuCardId })
          .then(res => {
            this.signList = res.data || []
          })
          .finally(() => {
            this.tableLoading = false
          })
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
</style>
