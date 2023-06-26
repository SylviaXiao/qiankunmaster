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
        <div style="display: flex">
          <div style="width: calc(100% - 100px)">
            <a-row class="form-row" :gutter="16">
              <a-col :lg="8" :md="16" :sm="24">
                <a-form-item label="分馆" v-bind="itemLayout">
                  <a-select style="width: calc(100% - 90px);" :dropdownMatchSelectWidth="false" :allowClear="true" v-decorator="['school_id', { initialValue: defValue }]" @change="changeDepts">
                    <a-select-option allowClear :value="school.deptId || school.id" v-for="(school, index) in deptList" :key="index">
                      {{ school.deptName }}
                    </a-select-option>
                  </a-select>
                  <a-checkbox style="float: right" @change="changeOtherDept">跨分馆</a-checkbox>
                </a-form-item>
              </a-col>
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
                <a-form-item label="卡种名称" v-bind="itemLayout">
                  <a-input allowClear v-decorator="['cardName']" placeholder="请输入卡种名称" />
                </a-form-item>
              </a-col>
              <a-col :lg="8" :md="8" :sm="24">
                <a-form-item label="卡种类型" v-bind="itemLayout">
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
            </a-row>
          </div>
          <div style="width: 100px; text-align: right;">
            <a-form-item>
              <a-button @click="searchTable()">查询</a-button>
            </a-form-item>
          </div>
        </div>
      </a-form>
    </div>
    <a-table
      v-if="multiple"
      ref="tableSelected"
      :columns="columns"
      :dataSource="selectedRows"
      :rowSelection="rowSelection"
      rowKey="id"
      :pagination="false"
    ></a-table>
    <s-table
      ref="table"
      :columns="columns"
      :data="cardData"
      :rowSelection="rowSelection"
      rowKey="id">
<!--    >{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: multiple ? 'checkbox' : 'radio' }"-->

    </s-table>
  </a-modal>
</template>

<script>
import { listEduDance, listEduCardType, pageDeptCard, treeEduClassType } from '@/api/common'
import STable from '@/components/Table'
import Vue from 'vue'
import { getUsersInDept, getALLDeptSchools } from '@/api/organize'

const itemLayout = {
  labelCol: { lg: { span: 6 }, md: { span: 8 }, sm: { span: 8 } },
  wrapperCol: { lg: { span: 18 }, md: { span: 16 }, sm: { span: 16 } }
}
const columns = [
  {
    title: '分馆',
    dataIndex: 'deptName'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName'
  },
  {
    title: '可用次数',
    dataIndex: 'availableCount'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '卡种类型',
    dataIndex: 'edtName'
  },
  {
    title: '卡类型',
    dataIndex: 'experience',
    key: 'experience',
    customRender: (text, record) => {
      return text ? '体验卡' : '正式卡'
    }
  },
  {
    title: '单价(元)',
    dataIndex: 'deptPrice',
    customRender: text => {
      return `${text}`
    }
  },
  {
    title: '有效期(天)',
    dataIndex: 'validDay',
    customRender: text => {
      return text != 0 ? `${text}天` : '-'
    }
  }
]
export default {
  name: 'GetCard',
  props: {
    classType: {
      type: String, // A:常规班；B:私教班，C: 非常规班，D：非私教班，E：非 常规班和私教班
      default: null
    },
    multiple: {//多选，默认关闭
      type: Boolean,
      default: false
    },
    // 学员类型：A.成人 B.少儿
    stuType: {
      type: String
    }
  },
  components: {
    STable
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        type: this.multiple ? 'checkbox' : 'radio',
      }
    }
  },
  watch: {
    // isOpen(nv, ov) {
    //   nv ? this.$refs.table.refresh() : ''
    // }
  },
  data() {
    return {
      //分馆
      deptList: JSON.parse(Vue.ls.get('userSchoolId')),
      defValue: Vue.ls.get('userDefaultId'),
      itemLayout,
      columns,
      cardVisible: false,
      loading: false,
      //selectList
      danceList: [],
      cardTypeList: [],
      //loadData
      isOpen: true,
      queryParam: {},
      cardData: parameter => {
        // if (this.isOpen) {
        this.queryParam.type = this.classType
        return pageDeptCard(Object.assign({stuType: this.stuType}, parameter, this.queryParam)).then(res => {
          // this.isOpen = false
          return res
        })
        // }
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
    this.queryParam.deptId = this.defValue
  },
  methods: {
    open() {
      // this.isOpen = true
      this.getSelectList()
      this.selectedRowKeys=[]
      this.selectedRows=[]
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
          // this.selectedRowKeys = []
          this.$refs.table.refresh()
        }
      })
    },
    unique(arr) {
      // 缓存用于记录
      const arr1 = []
      for (const t of arr) {
        // 检查缓存中是否已经存在
        if (arr1.find(c => c.id === t.id)) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue
        }
        // 不存在就说明以前没遇到过，把它记录下来
        arr1.push(t)
      }
      // 记录结果就是过滤后的结果
      return arr1
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      if (this.multiple && selectedRowKeys.length > 0) {
        let selectedRowsOld = JSON.parse(JSON.stringify(this.selectedRows)).concat(selectedRows)
        selectedRowsOld = this.unique(selectedRowsOld)
        selectedRowsOld.forEach((item, index) => {
          if (!this.selectedRowKeys.includes(item.id )) {
            selectedRowsOld.splice(index, 1)
          }
        })
        this.selectedRows = selectedRowsOld
      } else {
        this.selectedRows = selectedRows
      }
    },
    changeOtherDept(check) {
      if (check.target.checked) {
        getALLDeptSchools().then(res => {
          let params = { id: '', deptName: '全部' }
          res.data.unshift(params)
          this.deptList = res.data
        })
      } else {
        this.deptList = JSON.parse(Vue.ls.get('userSchoolId'))
      }
    },
    changeDepts(data) {
      this.queryParam.deptId = data
    },
    handleOk() {
      const length = this.selectedRows.length
      if (length == 0) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请选择一条信息'
        })
      }

      const backData = this.multiple ? this.selectedRows : this.selectedRows[0]
      this.$emit('getBackData', backData)
      this.close()
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
