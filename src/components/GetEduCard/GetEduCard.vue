<template>
  <a-modal
    title="选择卡种"
    :maskClosable="$store.state.modalMaskClickEnable"
    :width="1000"
    v-model="cardVisible"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="searchGroup" @keyup.13="searchTable" tabindex="1">
      <a-form :form="searchForm">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="舞种" v-bind="itemLayout">
              <a-select allowClear v-decorator="['danceId']" placeholder="请选择舞种">
                <a-select-option :allowClear="true" :value="dance.id" v-for="(dance, danceIndex) in danceList" :key="danceIndex">
                  {{ dance.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="卡种类型" :labelCol="{ sm: { span: 4 }, md: { span: 8 } }" :wrapperCol="{ sm: { span: 16 }, md: { span: 16 } }">
              <a-cascader
                :options="classTypeList"
                :showSearch="{ typeFilter }"
                placeholder="请选择班型"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                changeOnSelect
                v-decorator="['classTypeId', { rules: [{ required: false, message: '请选择类型班型' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="3" :md="3" :sm="24">
            <a-form-item>
              <a-button @click="searchTable()">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      :columns="noPrice ? noPricecolumns : columns"
      :data="cardData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
      rowKey="id"
      :showPagination="false"
    >
    </s-table>
  </a-modal>
</template>

<script>
import { listEduDance, listEduCardType, pageDeptCard, treeEduClassType } from '@/api/common'
import { getList, pageOnLineCard, pageOnLineExperience } from '@/api/education/card'
import STable from '@/components/Table'
import Vue from 'vue'
import { getUsersInDept, getALLDeptSchools } from '@/api/organize'

const itemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 }
  }
}
const columns = [
  {
    title: '卡种名称',
    dataIndex: 'cardName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '卡种类型',
    dataIndex: 'ectName'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '单色' : text === 'B' ? '优鸽' : ''
    }
  },
  {
    title: '单价',
    dataIndex: 'price',
    customRender: text => {
      return `${text}元`
    }
  }
]
const noPricecolumns = [
  {
    title: '卡种名称',
    dataIndex: 'cardName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '卡种类型',
    dataIndex: 'ectName'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '单色' : text === 'B' ? '优鸽' : ''
    }
  }
]
export default {
  name: 'GetEduCard',
  props: {
    classType: {
      type: String, // A:常规班；B:私教班，C: 非常规班，D：非私教班，E：非 常规班和私教班, F：线上课
      default: null
    },
    //线上卡接口
    OnLine: {
      type: Boolean,
      default: false
    },
    //传邀请码类型
    invitationType: {
      type: String,
      default: ''
    },
    //舞种
    danceType: {
      type: String,
      default: ''
    },
    //舞种
    OnLineExperience: {
      type: Boolean,
      default: false
    },
    //去掉表格单价
    noPrice: {
      type: Boolean,
      default: false
    }
  },
  components: {
    STable
  },
  watch: {
    // isOpen(nv, ov) {
    //   nv ? this.$refs.table.refresh() : ''
    // }
  },
  data() {
    return {
      defValue: Vue.ls.get('userDefaultId'),
      itemLayout,
      columns,
      noPricecolumns,
      cardVisible: false,
      loading: false,
      //selectList
      danceList: [],
      cardTypeList: [],
      //loadData
      isOpen: true,
      queryParam: {},
      cardData: parameter => {
        let request = getList
        if (this.OnLine) {
          request = pageOnLineCard
        }
        if (this.OnLineExperience) {
          request = pageOnLineExperience
        }
        if (this.invitationType) {
          this.queryParam.invitationType = this.invitationType
        }
        if (this.danceType) {
          this.queryParam.danceId = this.danceType
          this.searchForm.setFieldsValue({ danceId: this.danceType })
        }
        return request(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      classTypeList: []
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
  },
  created() {
    // this.queryParam.deptId = this.defValue
  },
  methods: {
    open() {
      // this.isOpen = true
      this.getSelectList()
      this.cardVisible = true
      this.$nextTick(() => {
        if (Object.keys(this.queryParam).length !== 1) {
          this.$refs.table.refresh()
        }
      })
    },
    close() {
      this.resetAll()
      this.cardVisible = false
    },
    resetAll() {
      this.queryParam = {}
      this.searchForm.resetFields()
      this.selectedRowKeys = []
    },
    getSelectList() {
      listEduDance().then(res => (this.danceList = res.data))
      // listEduCardType().then(res => this.cardTypeList = res.data)
      treeEduClassType({ type: this.classType }).then(res => {
        this.$tools.transNullToArr(res.data)
        this.classTypeList = res.data
      })
    },
    typeFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    searchTable() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          values.classTypeId ? (values.classTypeId = values.classTypeId.join(',')) : ''
          this.isOpen = true
          this.queryParam = values
          this.selectedRowKeys = []
          this.$refs.table.refresh()
        }
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk() {
      const length = this.selectedRows.length
      if (length == 1) {
        // const backData = {
        //   id: this.selectedRows[0].deptCardId,
        //   name: this.selectedRows[0].cardName
        // }
        const backData = this.selectedRows[0]
        this.$emit('getBackData', backData)
        this.close()
      } else if (length == 0) {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择一条信息'
        })
      } else {
        this.$notification['error']({
          message: '系统通知',
          description: '目前只能操作一条信息'
        })
      }
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style scoped>
.searchGroup {
  outline: none;
}
</style>
