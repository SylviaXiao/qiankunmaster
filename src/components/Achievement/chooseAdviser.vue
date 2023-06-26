<template lang="html">
  <div>
    <a-modal class="select-goods" :maskClosable="$store.state.modalMaskClickEnable"
             :width="1200"
             title="选择意向学员"
             :visible="visible"
             @ok="handleOk"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel">
      <a-form :form="form">
        <a-row>
          <a-col :span="8">
            <a-form-item v-bind="formItemLayout2" label="联系方式">
              <a-input
                placeholder="QQ/手机/微信"
                v-decorator="['stuUserInfo']">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-button class="button-search" @click="search">查询</a-button>
            <a-button :style="{marginLeft:'10px'}" class="button-search" @click="resetSearch">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
      <s-table
        ref="table"
        size="default"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio' }"
        :columns="columnsSelect"
        :rowKey="record => record.id"
        :data="loadData"
        :loading="loading">
      </s-table>
    </a-modal>

  </div>
</template>

<script>
  import {
    pageCsStuUser
  } from '@/api/intentionStu/adviser'
  import { filterEmptyObject } from '@/utils/util'
  import { SearchCom } from '@/components'
  import PermBox from '@/components/PermBox'
  import STable from '@/components/Table'

  const columnsSelect = [
    {
      title: '录入时间',
      dataIndex: 'createDate',
      key: 'createDate'
    },
    {
      title: '所属客服',
      dataIndex: 'orgUserName',
      key: 'orgUserName'
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      scopedSlots: { customRender: 'userName' },
      key: 'userName'
    },
    {
      title: 'QQ号',
      dataIndex: 'userQQ',
      key: 'userQQ'
    },
    {
      title: '微信号',
      dataIndex: 'userWechat',
      key: 'userWechat'
    },
    {
      title: '手机号码',
      dataIndex: 'userPhone',
      key: 'userPhone'
    },

    {
      title: '来源省市',
      dataIndex: 'userArea',
      key: 'userArea'
    }
  ]


  export default {
    data() {
      return {
        visible: false,
        confirmLoading: false,
        loading: false,
        //搜索相关
        formItemLayout2: this.$tools.formItemLayout2,
        //table相关
        queryParam: {},
        loadData: parameter => {
          return pageCsStuUser(Object.assign(parameter, this.queryParam, { stuUser: 'Y' })).then(res => {
            return res
          })
        },
        selectedRows: [],
        selectedRowKeys: [],
        resultSelect: [],
        columnsSelect
      }
    },
    components: {
      SearchCom,
      PermBox,
      STable
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    methods: {
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      search() {
        this.form.validateFields().then(data => {
          this.queryParam = filterEmptyObject(data)
          this._refreshTable()
        })
      },
      resetSearch() {
        this.queryParam = {}
        this.form.resetFields()
        this._refreshTable()
      },
      openModal() {
        this.visible = true
        this.$nextTick(() => {
          this.initTalbe()
        })
      },
      handleOk() {
        this.$emit('getChoose', this.selectedRows)
        this.visible = false
      },
      handleCancel() {
        this.visible = false
      },
      initTalbe() {
        this.queryParam = {}
        this.selectedRowKeys = []
        this.selectedRows = []
        this.form.resetFields()
      },
      _refreshTable() {
        this.$refs.table.refresh()
      }
    }
  }
</script>

<style lang="less" scoped>
  .select-goods {
    .button-search {
      position: relative;
      top: 3px;
    }
  }

</style>
