<template>
  <div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="薪酬变更记录"
      :width="800"
      v-model="visible"
      :footer="null"
    >
      <div class="bg mb20">
        <a-row>
          <a-col :lg="12" :md="12" :sm="24"> 当前老师：{{ teacherName }}</a-col>
          <a-col :lg="12" :md="12" :sm="24" v-if="salTypeId"> 薪酬类型： {{ salTypeName }}</a-col>
        </a-row>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id"> </s-table>
    </a-modal>
  </div>
</template>

<script>
  import STable from '@/components/Table'
  import tools from '@/tools/common.js'
  import { listTemplateItemLog } from '@/api/education'

  const columns = [
    {
      title: '修改时间',
      dataIndex: 'updateDate'
    },
    {
      title: '生效时间',
      dataIndex: 'takeEffectDate',
      customRender: (text, record) => {
        return tools.tailor.getDate(text)
      }
    },
    {
      title: '薪酬',
      dataIndex: 'salary'
    },
    {
      title: '操作人',
      dataIndex: 'userName'
    }
  ]
  const columns2 = [].concat(columns.slice(0, 2), [{ title: '薪酬类型', dataIndex: 'salTypeName' }], columns.slice(2))

  export default {
    name: 'TeacherSalaryModifyLog',
    props: {},
    watch: {},
    components: {
      STable
    },
    data() {
      return {
        visible: false,
        teacherId: '',
        teacherName: '',
        salTypeId: '',
        salTypeName: '',
        columns: [],
        loadData: parameter => {
          let {teacherId, salTypeId} = this
          return listTemplateItemLog(Object.assign(parameter, {teacherId, salTypeId})).then(res => {
            return res
          })
        }
      }
    },
    created() {
    },
    methods: {
      backData(teacherId, teacherName, salTypeId, salTypeName) {
        this.teacherId = teacherId
        this.teacherName = teacherName
        this.salTypeId = salTypeId
        this.salTypeName = salTypeName

        if (salTypeId) {
          this.columns = columns
        } else {
          this.columns = columns2
        }
      },
      open() {
        this.visible = true
        this._refreshTable()
      },
      close() {
        this.visible = false
      },
      _refreshTable() {
        this.$refs.table && this.$refs.table.refresh()
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import '~@/assets/style/index';

  .bg {
    padding: 10px;
    background: #FAFAFA;
  }

  .timeline-item-wrap {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .date {
    flex-shrink: 0;
    width: 150px;
  }

  .content {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    background: #FAFAFA;
  }
</style>
