<template>
  <div class="choose-tea-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="选择学生"
      :width="1000"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
    >
      <div class="search-group" @keyup.13="searchTable" tabindex="1">
        <a-form :form="searchForm" v-if="branch">
          <div style="display: flex">
            <div style="width: calc(100% - 170px)">
              <a-row>
                <a-col :lg="9" :md="9" :sm="24" v-if="!schooShow">
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
                    <a-select
                      :allowClear="true"
                      v-decorator="['school_id', { initialValue: defValue }]"
                      @change="changeDepts"
                    >
                      <a-select-option
                        allowClear
                        :value="school.deptId || school.id"
                        v-for="(school, index) in deptList"
                        :key="index"
                      >
                        {{ school.deptName }}
                      </a-select-option>
                    </a-select>
                    <a-checkbox style="position: absolute; right: -80px;" @change="changeOtherDept">跨分馆</a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="8" :sm="24" v-if="!studentNumber">
                  <a-form-item label="学号" v-bind="itemLayout">
                    <a-input placeholder="请输入学号" v-decorator="['stuNo']"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="8" :sm="24">
                  <a-form-item label="学员信息" v-bind="itemLayout">
                    <a-input :placeholder="!studentNumber?'学员名称/联系电话':'学员信息'" v-decorator="['stuInfo']"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="8" :sm="24" v-if="adviser">
                  <a-form-item label="顾问" v-bind="itemLayout">
                    <a-input placeholder="顾问名称" v-decorator="['adviserName']"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="8" :sm="24" v-if="stuType">
                  <a-form-item label="人群分类" v-bind="itemLayout">
                    <a-select :allowClear="true" v-decorator="['stuType']" placeholder="成人/少儿">
                      <a-select-option value="A">成人</a-select-option>
                      <a-select-option value="B">少儿</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div style="width: 170px; text-align: right;">
              <a-form-item>
                <span>
                  <a-button @click="searchTable">查询</a-button>
                </span>
                <span style="margin-left:5px;">
                  <a-button @click="resetSearch">重置</a-button>
                </span>
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>
      <div class="table-wrapper">
        <a-table
          v-if="checkBox"
          ref="tableSelected"
          :columns="columns"
          :dataSource="selectedRows"
          :rowSelection="rowSelection"
          rowKey="id"
          :pagination="false"
        >
          <span slot-scope="text, record" slot="avatar">
            <a-avatar shape="square" :style="{ verticalAlign: 'middle' }" size="small" icon="user" :src="text"
                      v-if="text"/>
          </span>
        </a-table>
        <s-table
          ref="table"
          :columns="columns"
          :data="tableLoad"
          :rowSelection="rowSelection"
          rowKey="id"
          :autoLoad="autoLoad"
          v-if="visible"
        >
          <span slot-scope="text, record" slot="avatar">
            <a-avatar shape="square" :style="{ verticalAlign: 'middle' }" size="small" icon="user" :src="text"
                      v-if="text"/>
          </span>
        </s-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import { getALLDeptSchools } from '@/api/organize'
  import STable from '@/components/Table'
  import Vue from 'vue'
  import { pageStudent, listEduDance, pageStudentInvoice, getUserList, pageClassCardLog, pageCoachClassStudent } from '@/api/common'
  import { getPageList, getParentingList } from '@/api/reception/student'

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
      title: '学号',
      dataIndex: 'stuNo',
      key: 'stuNo',
      width: 150
    },
    {
      title: '姓名',
      dataIndex: 'stuName',
      key: 'stuName'
    },
    {
      title: '联系电话',
      dataIndex: 'stuPhone',
      key: 'stuPhone'
    },
    {
      title: '地区',
      dataIndex: 'stuArea',
      key: 'stuArea'
    }
  ]
  const parentingColumns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      scopedSlots: { customRender: 'avatar' }
    },
    {
      title: '学号',
      dataIndex: 'stuNo'
    },
    {
      title: '姓名',
      dataIndex: 'stuName'
    },
    {
      title: '联系电话',
      dataIndex: 'stuPhone'
    },
    {
      title: '人群分类',
      dataIndex: 'stuType',
      customRender: (text, record) => {
        return text === 'A' ? '成人' : text === 'B' ? '少儿' : text === 'C' ? '通用' : ''
      }
    },
    {
      title: '身份证号',
      dataIndex: 'stuIdcard'
    },
    {
      title: '顾问',
      dataIndex: 'adviserName'
    }
  ]
  export default {
    name: 'ChooseTea',
    props: {
      autoLoad: {
        type: Boolean,
        default: false
      },
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
      },
      //是否开启多选
      checkBox: {
        type: Boolean,
        default: false
      },
      //是否开启listClassCardLog接口（没有分页）
      listClass: {
        type: Boolean,
        default: false
      },
      //是否开启变更学员接口
      changeStudent: {
        type: Boolean,
        default: false
      },
      schooShow: {
        type: Boolean,
        default: false
      },
      classId: {
        type: String,
        default: ''
      },
      studIds: {
        type: Array,
        default: () => []
      },
      // 是否开启顾问搜索
      adviser: {
        type: Boolean,
        default: false
      },
      // 是否开启人群搜索
      stuType: {
        type: Boolean,
        default: false
      },
      parenting: {
        type: Boolean,
        default: false
      },
      // 教练班绩效选择学员
      coachClass: {
        type: Boolean,
        default: false
      },
      params: {
        type: Object,
        default: () => {}
      }
      // //使用pageOrgUser接口
      // ChannelId: {
      //   type: String,
      //   default: ''
      // }
    },
    components: {
      STable
    },
    data() {
      return {
        //modal
        deptList: JSON.parse(Vue.ls.get('userSchoolId')),
        defValue: Vue.ls.get('userDefaultId'),
        visible: false,
        confirmLoading: false,
        itemLayout,
        columns: this.parenting || this.coachClass ? parentingColumns : columns,
        queryParam: {},
        tableLoad: parameter => {
          const { queryParam } = this
          let request = pageStudent
          if (this.invoiceList) {
            request = pageStudentInvoice
          }
          if (this.listClass) {
            request = pageClassCardLog
            this.queryParam.classId = this.classId
          }
          if (this.changeStudent) {
            request = getPageList
          }
          if (this.parenting) {
            request = getParentingList
          }
          if (this.coachClass) {
            request = pageCoachClassStudent
          }
          // if(this.ChannelId) {
          //   request = getUserList
          //   this.queryParam.orgDeptId = this.ChannelId
          // }
          return request(Object.assign(parameter, queryParam, this.params)).then(res => {
            this.getSelect(res)
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
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          type: this.checkBox ? 'checkbox' : 'radio',
          onChange: this.onChange
        }
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
      this.queryParam.deptId = this.defValue
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
      },
      dataRefesh() {
        this.queryParam.deptId = this.defValue
        this.$nextTick(() => {
          this.searchForm.resetFields()
        })
        // if (this.$refs.table) {
        //   console.log(this.showed)
        //   this.$refs.table.refresh()
        // }
      },
      handleOk() {
        if (this.selectedRows.length == 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请选择一条数据'
          })
        } else {

          const backData = {
            stuId: this.selectedRows[0].id,
            stuName: this.selectedRows[0].stuName,
            stuPhone: this.selectedRows[0].stuPhone,
            price: this.selectedRows[0].financePrice
          }
          if (!this.checkBox) {
            this.$emit('getBackData', backData)
          } else {
            this.$emit('getBackData', this.selectedRows)
          }
          this.visible = false
        }
      },
      close() {
        this.selectedRows = []
        this.selectedRowKeys = []
        this.searchForm.resetFields()
        this.queryParam = {}
        this.visible = false
      },
      handleCancel() {
        this.close()
      },
      searchTable() {
        this.searchForm.validateFields((err, values) => {
          if (!err) {
            this.queryParam = values
            this.selectedRows = []
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
      //选择回显
      getSelect(res) {
        if (this.studIds && this.studIds.length > 0) {
          let indexArr = []
          this.studIds.forEach(item => {
            res.data.forEach(todo => {
              if (item === todo.stuId) {
                let inx = res.data.findIndex(todo => {
                  return todo.stuId === item
                })
                indexArr.push(inx)
              }
            })
          })
          this.selectedRowKeys = indexArr
        }
      },
      onChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        if (this.checkBox && selectedRowKeys.length > 0) {
          let selectedRowsOld = JSON.parse(JSON.stringify(this.selectedRows)).concat(selectedRows)
          selectedRowsOld = this.unique(selectedRowsOld)
          selectedRowsOld.forEach((item, index) => {
            if (!this.selectedRowKeys.includes(item.id)) {
              selectedRowsOld.splice(index, 1)
            }
          })
          this.selectedRows = selectedRowsOld
        } else {
          this.selectedRows = selectedRows
        }
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
