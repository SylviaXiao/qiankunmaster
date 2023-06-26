<template>
  <div class="general-choice-modal">
    <a-modal :maskClosable="false" :title="modalTitle"
             :width="1000" :visible="visible"
             :confirmLoading="confirmLoading"
             @ok="handleOk"
             @cancel="handleCancel">
      <div class="search-wrapper" style="margin-bottom: 15px;">
        <search-com-pro @searchSubmit="searchSubmit"
                        v-if="searchParams.length!==0"
                        ref="search"
                        :searchParams="searchParams"></search-com-pro>
      </div>
      <div class="table-wrapper">
        <s-table ref="table"
                 :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: multiple?'checkbox':'radio' }"
                 :columns="tableColumns"
                 :data="dataSource"
                 :rowKey="record => record.id||record.cardId">

        </s-table>


      </div>
    </a-modal>


  </div>
</template>

<script>
  import STable from '../Table'
  import SearchComPro from '../SearchComPro'
  import Vue from 'vue'


  export default {
    name: 'GeneralChoiceModal',
    props: {
      modalTitle: { type: String, default: '请选择...' },
      dataMethods: {
        type: Function, default: () => {
        }
      },
      tableParams: {
        type: Object, default: () => {
        }
      },
      tableColumns: { type: Array, default: () => [] },
      multiple: { type: Boolean, default: false },
      searchParams: { type: Array, default: () => [] },
      eduTypeId: { type: String, default: ''}

    },
    components: {
      STable,
      SearchComPro
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        queryParams: {},
        dataSource: parameter => {
          const { tableParams, dataMethods, queryParams } = this
          const schoolId = Vue.ls.get('userDefaultId')
          return dataMethods(Object.assign(parameter, { schoolId }, tableParams, queryParams,{eduTypeId:this.eduTypeId}))
            .then(res => {
              return res
            })

        },
        selectedRowKeys: [],
        selectedRows: []


      }
    },
    methods: {
      //重置方法
      initModal() {
        this.$refs.search.reset()
        this.initSelected()

      },
      initSelected() {
        this.selectedRowKeys = []
        this.selectedRows = []
      },


      openModal() {
        this.visible = true
        this.$refs.table ? this.$refs.table.refresh() : ''
      },
      //点击确认按钮
      handleOk() {
        const { selectedRowKeys: { length }, selectedRows, $notification, multiple } = this
        if (length == 0) {
          $notification['error']({ message: '系统通知', description: '请选择一条数据!' })
          return false
        }
        const [singleData, ...other] = selectedRows
        const params = multiple ? selectedRows : singleData
        console.log(params)
        this.$emit('ok', params)
        this.handleCancel()
      },

      //关闭modal
      handleCancel() {
        this.visible = false
        this.initModal()
      },
      //选择回调
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },

      //搜索查询
      searchSubmit(data) {
        this.initSelected()
        this.queryParams = data
        this.$refs.table.refresh()

      }


    }
  }
</script>

<style scoped >

</style>
