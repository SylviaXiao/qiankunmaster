<template>
  <div class="choose-tea-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="选择转卡信息"
      :width="1000"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
    >
      <div class="search-group" @keyup.13="searchTable" tabindex="1">
        <a-form :form="searchForm" v-if="branch">
          <a-row>
            <a-col :lg="6" :md="6" :sm="24">
              <a-form-item
                label="分馆"
                :label-col="{
                  lg: { span: 4 },
                  md: { span: 4 },
                  xs: { span: 4 },
                  sm: { span: 4 }
                }"
                :wrapper-col="{
                  lg: { span: 12 },
                  md: { span: 12 },
                  xs: { span: 12 },
                  sm: { span: 12 }
                }"
                style="position: relative;"
              >
                <a-select :allowClear="true" v-decorator="['school_id', { initialValue: defValue }]" @change="changeDepts" style="z-index:9999;">
                  <a-select-option allowClear :value="school.deptId || school.id" v-for="(school, index) in deptList" :key="index">
                    {{ school.deptName }}
                  </a-select-option>
                </a-select>
                <a-checkbox style="position: absolute; right: -80px;" @change="changeOtherDept">跨分馆</a-checkbox>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="6" :sm="24">
              <a-form-item label="卡信息" v-bind="itemLayout">
                <a-input placeholder="请输入卡信息" v-decorator="['stuCard']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="6" :sm="24">
              <a-form-item label="学员信息" v-bind="itemLayout">
                <a-input :placeholder="!studentNumber ? '学员名称/联系电话' : '学员信息'" v-decorator="['stuInfo']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="6" :sm="24">
              <a-form-item>
                <span>
                  <a-button @click="searchTable">查询</a-button>
                </span>
                <span style="margin-left:5px;">
                  <a-button @click="resetSearch">重置</a-button>
                </span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-wrapper">
        <s-table
          ref="table"
          :columns="columns"
          :data="tableLoad"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
          rowKey="id"
          v-if="visible"
        >
        </s-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getALLDeptSchools } from '@/api/organize'
import STable from '@/components/Table'
import Vue from 'vue'
import { listEduDance, pageStuCardChangeLog } from '@/api/common'

const itemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 17 },
    sm: { span: 17 }
  }
}
const columns = [
  {
    title: '转卡日期',
    dataIndex: 'logDate',
    key: 'logDate'
  },
  {
    title: '转卡信息',
    dataIndex: 'stuName',
    key: 'stuName',
    customRender: (text, record) => {
      const { stuName, targetName } = record
      return `${stuName} 转给 ${targetName}`
    }
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo',
    width: 150
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName',
    width: 150
  },
  // {
  //   title: '学员姓名',
  //   dataIndex: 'stuName',
  //   key: 'stuName'
  // },

  {
    title: '办卡金额',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    width: 150
  }

  // {
  //   title: '地区',
  //   dataIndex: 'stuArea',
  //   key: 'stuArea'
  // }
]
export default {
  name: 'ChooseTea',
  props: {
    teaFields: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    invoiceList: {
      type: Boolean,
      default: false
    },
    //不要table地区
    noArea: {
      type: Boolean,
      default: false
    },
    //分馆是否开启
    branch: {
      type: Boolean,
      default: false
    },
    //学号是否开启
    studentNumber: {
      type: Boolean,
      default: false
    }
  },
  components: {
    STable
  },
  watch: {
    deptList(nv) {}
  },
  data() {
    return {
      //modal
      deptList: JSON.parse(Vue.ls.get('userSchoolId')) ? [JSON.parse(Vue.ls.get('userSchoolId'))] : [],
      defValue: Vue.ls.get('userDefaultId'),
      visible: false,
      confirmLoading: false,
      itemLayout,
      columns,
      queryParam: {},
      tableLoad: parameter => {
        const { queryParam } = this
        return pageStuCardChangeLog(Object.assign(parameter, queryParam)).then(res => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      danceList: []
      // defaultDept: Vue.ls.get('userDefaultId'),
      // deptList: []
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
  },
  mounted() {
    //删除地区
    if (this.noArea) {
      let index = this.columns.findIndex(item => item.title === '地区')
      if (Number(index) >= 0) {
        this.columns.splice(index, 1)
      }
    }
  },
  created() {
    // if()
    this.queryParam.deptId = this.defValue
    this.deptList = JSON.parse(Vue.ls.get('userSchoolId'))
  },
  methods: {
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
    open() {
      this.visible = true
      this.$nextTick(() => {
        this.init()
        this.selectedRowKeys = []
        this.dataRefesh()
      })
    },
    init() {
      // this.getOtherDept()
    },
    dataRefesh() {
      this.queryParam.deptId = this.defValue
      this.$nextTick(() => {
        this.searchForm.resetFields()
      })
    },
    handleOk() {
      if (this.selectedRows.length == 0) {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择一条数据'
        })
      } else {
        const backData = {
          stuId: this.selectedRows[0].stuId,
          logId: this.selectedRows[0].logId,
          stuName: this.selectedRows[0].stuName,
          targetName: this.selectedRows[0].targetName
          // stuPhone: this.selectedRows[0].stuPhone,
          // price: this.selectedRows[0].financePrice
        }
        this.$emit('getBackData', backData)
        this.visible = false
      }
    },
    close() {
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    searchTable() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          this.selectedRowKeys = []
          this.$refs.table.refresh()
        }
      })
    },
    resetSearch() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
    // changeDepts(data) {
    //   console.log(data);
    //   this.queryParam.deptId = data
    // },
    // changeOtherDept(check) {
    //   if (check && check.target && check.target.checked) {
    //     getALLDeptSchools().then(res => {
    //       let params = { id: '', deptName: '全部' }
    //       res.data.unshift(params)
    //       this.deptList = res.data
    //     })
    //   } else {
    //     this.deptList = JSON.parse(Vue.ls.get('userSchoolId'))
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.search-group {
  outline: none;
}
.assistant-name-style {
  &::before {
    content: '助教 : ';
    position: absolute;
    left: -45px;
    top: 6px;
  }
}
</style>
