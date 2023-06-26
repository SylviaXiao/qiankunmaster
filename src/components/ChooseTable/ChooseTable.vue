<template>
  <div class="choose-table-wrapper">
    <a-form :form="searchForm">
      <div class="search-group" @keyup.13="searchTable" tabindex="1">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="分馆" v-bind="itemLayout">
              <a-select style="width: 100%;" v-decorator="['schoolId', { initialValue: defaultDept }]" @change="changeDepts">
                <a-select-option allowClear :value="school.deptId || school.id" v-for="(school, index) in deptList" :key="index">
                  {{ school.deptName }}
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
            <a-form-item label="名称" v-bind="itemLayout">
              <a-input v-decorator="['className']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="3" :md="3" :sm="24">
            <a-form-item>
              <a-button @click="searchTable()" :loading="spinning">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <div class="table-wrapper">
      <a-spin :spinning="spinning">
        <s-table
          ref="table"
          :columns="columns"
          :data="classLoadData"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
          rowKey="classId"
        >
          <span slot="positionName" slot-scope="text, record"> {{ text }} <a-tag v-if="record.isLeader">主管</a-tag> </span>
        </s-table>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { getALLDeptSchools } from '@/api/organize'
import { listEduDance, listClass, treeEduClassType } from '@/api/common'
import Vue from 'vue'
import STable from '@/components/Table'

const itemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 }
  }
}

export default {
  name: 'ChooseTable',
  components: {
    STable
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    cardValues: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    isOpen(nv, ov) {
      nv ? this.initData() : ''
    }
  },
  data() {
    return {
      columns: [
        {
          title: '班级名称',
          dataIndex: 'className'
        },
        {
          title: '上课导师',
          dataIndex: 'teachers',
          customRender: (text, record) => {
            let teacherName = ''
            text.map((item, idx) => {
              idx == 0 ? (teacherName += ` ${item.teacherName}`) : (teacherName += `, ${item.teacherName}`)
            })
            return teacherName
          }
        },
        {
          title: '已有/预招人数',
          dataIndex: 'userSex',
          customRender: (text, record) => {
            const { actualStudents, totalStudents } = record
            return `${~~actualStudents}/${~~totalStudents}`
          }
        },
        {
          title: '开班时间',
          dataIndex: 'startDate',
          customRender: (text, record) => {
            return this.$tools.tailor.getDate(text)
          },
          width: 200
        }
      ],
      itemLayout,
      deptList: JSON.parse(Vue.ls.get('userSchoolId')),
      defaultDept: Vue.ls.get('userDefaultId'),
      spinning: false,
      queryParam: {},
      classList: [],
      danceList: [],
      classTypeList: [],
      // isChangeDept: false,
      selectedRowKeys: [],
      selectedRows: [],
      classLoadData: parameter => {
        let data = {}
        if (this.cardValues && this.cardValues.value) {
          const {
            cardValues: {
              value: { danceId, typeId, cardTypeId }
            },
            queryParam
          } = this
          data = {
            danceId: danceId,
            typeId: typeId,
            classTypeId: cardTypeId
          }
        }

        return listClass(Object.assign(data, this.queryParam, parameter)).then(res => {
          return res
        })
      }
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      const { dataRefesh, getClassList } = this
      dataRefesh()
      this.getSelectList()
      this.$refs.table ? this.$refs.table.refresh() : ''
    },
    dataRefesh() {
      this.queryParam.schoolId = this.defaultDept
      const {
        searchForm: { setFieldsValue, resetFields },
        $nextTick,
        defaultDept,
        changeOtherDept
      } = this
      return new Promise((resolve, reject) => {
        $nextTick(() => {
          resetFields()
          setFieldsValue({ ['schoolId']: defaultDept })
          // this.isChangeDept = false
          changeOtherDept(false)
          this.selectedRows = []
          this.selectedRowKeys = []
        })
        resolve()
      })
    },

    typeFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    getSelectList() {
      listEduDance().then(res => (this.danceList = res.data))
      // listEduCardType().then(res => this.cardTypeList = res.data)
      treeEduClassType({ type: this.classType }).then(res => {
        this.$tools.transNullToArr(res.data)
        this.classTypeList = res.data
      })
    },
    getClassList() {
      const {
        cardValues: {
          value: { danceId, typeId, cardTypeId }
        },
        queryParam
      } = this
      let data = {
        danceId: danceId,
        typeId: typeId,
        classTypeId: cardTypeId
      }
      this.spinning = true
      listClass(Object.assign(data, queryParam))
        .then(res => {
          this.classList = res.data
        })
        .finally(() => {
          this.spinning = false
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    changeDepts(data) {
      this.queryParam.deptId = data
    },
    changeOtherDept(check) {
      if (check && check.target && check.target.checked) {
        getALLDeptSchools().then(res => {
          // let params = { id: '', deptName: '全部' }
          // res.data.unshift(params)
          this.deptList = res.data
        })
      } else {
        this.deptList = JSON.parse(Vue.ls.get('userSchoolId'))
      }
    },
    searchTable() {
      const {
        searchForm: { validateFields }
      } = this
      validateFields((err, values) => {
        if (!err) {
          values.classTypeId ? (values.classTypeId = values.classTypeId.join(',')) : ''
          this.queryParam = values
          this.selectedRowKeys = []
          this.$refs.table.refresh()
        }
      })
    },
    handleOk() {
      const {
        selectedRows,
        selectedRows: { length },
        $notification,
      } = this
      const index = this.cardValues && this.cardValues.index
      return new Promise(resolve => {
        if (selectedRows && length > 0) {
          const backData = {
            id: selectedRows[0].classId,
            name: selectedRows[0].className,
            index: index || 0
          }
          resolve(backData)
        } else {
          $notification['error']({
            message: '系统通知',
            description: '请选择班级!'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.search-group {
  outline: none;
}
</style>
