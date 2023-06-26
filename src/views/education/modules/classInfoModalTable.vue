<template>
  <div class="classInfoModal-wrapper">
    <a-form :form='searchForm'>
      <div class="searchGroup">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="分馆" v-bind="itemLayout">
              <a-select v-decorator="['schoolId',{initialValue:defValue}]" @change="changeDepts">
                <a-select-option allowClear :value="school.deptId||school.id"
                                 v-for="(school,index) in deptList" :key="index">
                  {{school.deptName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :lg="4" :md="4" :sm="24">
            <a-form-item>
              <a-checkbox @change="changeOtherDept">跨分馆</a-checkbox>
            </a-form-item>
          </a-col> -->
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item
              label="学员信息"
              v-bind="itemLayout">
              <a-input v-decorator="[ 'name']" @keyup.enter.native="searchTable"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="3" :md="3" :sm="24">
            <a-form-item>
              <a-button style="color: #000;" @click="searchTable()">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>

    <div class="table-wrapper">
      <s-table
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          onSelect: onSelect,
          onSelectAll: onSelectAll,
          type: checkType
          }"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        rowKey="cardId"
      >
      </s-table>
    </div>
    <div v-if="checkType === 'checkbox'" class="tag-wrapper">
      <a-tag class="a-tag" v-for="(item, index) in hasSelectedItems" :key="index" closable @close="tagClose($event,item)">
        {{item.stuName}}
      </a-tag>
    </div>
  </div>
</template>
<script>
  import { getClassUnselected } from '@/api/education'
  import { addStudentColumns } from '@/utils/education/classInfo'
  import { STable } from '@/components'
  import Vue from 'vue'

  import { getUsersInDept, getALLDeptSchools } from '@/api/organize'

  export default {
    props: {
      modalTableProps: Object,
      checkType: {
        type: String,
        default: 'checkbox'
      }
    },
    data() {
      return {
        deptList: JSON.parse(Vue.ls.get('userSchoolId')),
        defValue: Vue.ls.get('userDefaultId'),
        selectedRowKeys: [],
        hasSelectedItems: [],
        columns: addStudentColumns,
        queryParam: {},
        loadData: this.loadDataFn(),
        radioStu: {},
        itemLayout: {
          labelCol: {
            xs: { span: 8 },
            sm: { span: 8 }
          },
          wrapperCol: {
            xs: { span: 16 },
            sm: { span: 16 }
          }
        }
      }
    },
    beforeCreate() {
      this.searchForm = this.$form.createForm(this)
    },
    computed: {
      hasSelected() {
        return this.selectedRowKeys.length > 0
      }
    },
    methods: {
      getSelectedItems() {
        return this.hasSelectedItems.map(i => i.cardId).join(',')
      },
      loadDataFn() {
        return (parameter) => {
          let defaultSchoolId = {
            schoolId: this.defValue
          }
          return getClassUnselected(Object.assign(parameter, this.modalTableProps,defaultSchoolId, this.queryParam)).then(res => {
            return res
          })
        }
      },
      tagClose(e,record) {
        e.preventDefault()
        this._deleteSelectItem(record)
        this._deleteRowKey(record.cardId)
      },
      onSelectChange(selectedRowKeys, selected, selectedRows) {
        if (this.checkType === 'radio') {
          this.radioStu = selected[0]
        }
        this.selectedRowKeys = selectedRowKeys
      },
      onSelect(record, isSelected, selectedRows) {
        if (isSelected) {
          this._addSelectItem(record)
        } else {
          this._deleteSelectItem(record)
        }
      },
      onSelectAll(isSelected, selectedItem, changedSelectedItem) {
        if (isSelected) {
          this._addSelectItem(changedSelectedItem)
        } else {
          this._deleteSelectItem(changedSelectedItem)
        }
      },
      _addSelectItem(record) {
        let self = this
        if (Array.isArray(record)) {
          this.hasSelectedItems = [...self.hasSelectedItems, ...record]
        } else {
          this.hasSelectedItems.push(record)
        }
      },
      _deleteSelectItem(record) {

        let self = this
        if (Array.isArray(record)) {
          record.forEach(item => {
            this.hasSelectedItems = this.hasSelectedItems.filter(i => i.cardId !== item.cardId)
          })
        } else {
          this.hasSelectedItems = this.hasSelectedItems.filter(item => item.cardId !== record.cardId)
        }

      },
      _deleteRowKey(cardId) {
        this.selectedRowKeys = this.selectedRowKeys.filter(item => item !== cardId)
      },
      clearSelectItem() {
        this.hasSelectedItems = []
        this.selectedRowKeys = []
      },
      refreshTable() {
        this.$refs.table.refresh()
      },
      changeOtherDept(check) {
        if (check.target.checked) {
          getALLDeptSchools().then(res => {
            this.deptList = res.data
          })
        } else {
          this.deptList = JSON.parse(Vue.ls.get('userSchoolId'))
        }
      },
      changeDepts(data) {
        this.queryParam.schoolId = data
      },
      searchTable() {
        this.searchForm.validateFields((err, values) => {
          if (!err) {
            this.queryParam = values
            this.selectedRowKeys = []
            this.$refs.table.refresh()
          }
        })
      }

    },
    components: {
      STable
    }
  }
</script>

<style scoped lang=less>
  @import '~@/assets/style/btn';

  .classInfoModal-wrapper {
    .tag-wrapper {
      margin-top: -10px;

      .a-tag {
        margin-top: 10px;
      }
    }

    .table-wrapper {
      margin-top: 10px;
    }
  }
</style>
