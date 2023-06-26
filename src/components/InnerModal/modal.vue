<template>
  <div>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="选择员工" :width="1200" :visible="visible"
      :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel" :userType="userType">
      <div class="inner-modal-search" @keyup.13="searchTable" tabindex="1">
        <a-form :form="searchForm">
          <div class="searchGroup">
            <a-row v-if="serverGroupSwitch" style="margin-bottom:10px;">
              批量快速选择：
              <a-radio-group v-model="serverGroup" @change="changeGroup">
                <a-radio :value="item.id" v-for="item in serverGroups" :key="item.id">
                  {{ item.name }}
                </a-radio>
              </a-radio-group>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="6" :md="6" :sm="24" v-if="(userType === 'master' || userType === 'all') && !showBranch">
                <a-form-item label="分馆" v-bind="itemLayout">
                  <a-select :allowClear="true" v-decorator="['deptId', { initialValue: defValue }]"
                    @change="changeDepts">
                    <a-select-option allowClear :value="school.deptId || school.id" v-for="(school, index) in deptList"
                      :key="index">
                      {{ school.deptName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="3" :md="3" :sm="24"
                v-if="(userType === 'master' || userType === 'all') && !showBranch && showOtherDept">
                <a-form-item>
                  <a-checkbox @change="changeOtherDept">跨分馆</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :lg="6" :md="6" :sm="24">
                <a-form-item label="姓名" v-bind="itemLayout">
                  <a-input v-decorator="['name']" allowClear></a-input>
                </a-form-item>
              </a-col>
              <a-col :lg="6" :md="6" :sm="24">
                <a-form-item label="状态" v-bind="itemLayout">
                  <a-select :allowClear="true" v-decorator="['state']"
                    v-if="staffStateOptions && staffStateOptions.length > 0">
                    <a-select-option v-for="item in staffStateOptions" :key="item.value" :value="item.value">{{
                      item.label
                    }}</a-select-option>
                  </a-select>
                  <a-select :allowClear="true" v-decorator="['state']" v-else>
                    <a-select-option value="Y">在职</a-select-option>
                    <a-select-option value="N">离职</a-select-option>
                    <a-select-option value="T">退费</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="6" :md="6" :sm="24" v-if="userType === 'service'">
                <a-form-item label="客服组" v-bind="itemLayout1">
                  <a-tree-select treeCheckable showSearch treeNodeFilterProp="title" :maxTagCount="1" allowClear
                    multiple :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :replaceFields="{ children: 'orgUser', title: 'name', key: 'id', value: 'id' }" :treeData="serviceTypeOptions" v-decorator="['serviceType']">

                  </a-tree-select>

                  <!-- <a-tree-select
                onChange={this.onTreeSelectChange.bind(this, itemObj.key, itemObj)}
                tree-checkable={itemObj.treeCheckable}
                show-search={itemObj.search}
                treeNodeFilterProp="title"
                maxTagCount={1}
                placeholder={itemObj.placeholder}
                allowClear={true}
                multiple={itemObj.mutiple}
                dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
                treeData={this.selectArr[`${itemObj.key}Arr`]}
                treeDefaultExpandAll={itemObj.expandAll}
                v-decorator={[itemObj.key, { initialValue: itemObj.defaultVal }]}
              /> -->
                  <!-- <a-select :allowClear="true" v-decorator="['serviceType']" mode="multiple">
                    <a-select-option v-for="item in serviceTypeOptions" :key="item.id" :value="item.id">{{
                      item.deptName
                    }}</a-select-option>
                  </a-select> -->
                </a-form-item>
              </a-col>
              <a-col :lg="3" :md="3" :sm="24">
                <a-form-item>
                  <a-button @click="searchTable()">查询</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-form>
      </div>
      <a-table v-if="checkBox && !serverGroupSwitch" ref="tableSelected" :columns="columns" :dataSource="selectedRows"
        :rowSelection="rowSelection" :rowKey="(record, index) => record.id + ',' + record.deptid"
        :pagination="false"></a-table>
      <s-table ref="table" :columns="columns" :data="userData" :rowSelection="rowSelection"
        :rowKey="(record, index) => record.id + ',' + record.deptid" @result="result"
        :defaultPagination="defaultPagination">
        <span slot="positionName" slot-scope="text, record"> {{ text }} <a-tag v-if="record.isLeader">主管</a-tag> </span>
        <!-- <span slot="action" slot-scope="text, record">
          选择 -->
        <!-- <span v-if="!select.length || !select.some(item => item[chooseKey] == record[chooseKey])">
            <a href="#" @click="selectPerson(record)"><span class="buttonStyle">选择</span></a>
          </span>
          <span v-if="select.length && select.some(item => item[chooseKey] == record[chooseKey]) && deleteBtn">
            <span class="top_1">已选择</span>
            <a href="#" @click="cancel(record)"><span class="top_2">取消</span></a>
          </span> -->
        <!-- </span> -->
      </s-table>
    </a-modal>
  </div>
</template>

<script>
import { getALLDeptSchools, getDeptGroup } from '@/api/organize'
import { getUsersInDept, getUserList, getCustomerGroups } from '@/api/common'
import { listDeptUserByService } from '@/api/organize'
import Vue from 'vue'
import { listGuaranteedEmployees } from '@/api/recep'
import STable from '@/components/Table'
import moment from 'moment'

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
const itemLayout1 = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 17 },
    sm: { span: 17 }
  }
}
const columns = [
  {
    title: '工号',
    dataIndex: 'userNo'
  },
  {
    title: '姓名',
    dataIndex: 'userName'
  },
  {
    title: '性别',
    dataIndex: 'userSex',
    customRender: text => {
      let showText
      text == 'A' ? (showText = '男') : (showText = '女')
      return showText
    }
  },
  {
    title: '手机号码',
    dataIndex: 'userTel'
  },
  {
    title: '职位',
    dataIndex: 'positionName',
    scopedSlots: { customRender: 'positionName' }
  },
  {
    title: '分馆/部门',
    dataIndex: 'deptName'
  },
  {
    title: '状态',
    dataIndex: 'userState',
    customRender: text => {
      return text === 'Y' ? '在职' : text === 'N' ? '离职' : ''
    }
  },
  {
    title: '离职时间',
    dataIndex: 'leaveDate',
    customRender: (text, record) => {
      return text && record.userState === 'N' ? moment(text).format('YYYY-MM-DD') : ''
    }
  }
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   scopedSlots: { customRender: 'action' }
  // }
]
export default {
  name: 'modal',
  props: {
    counselorDimission: {
      type: Boolean,
      default: false
    },
    selectedKeys: {
      type: Array,
      default: function () {
        return []
      }
    },
    showOtherDept: {
      type: Boolean,
      default: true
    },
    //是否显示
    showBranch: {
      type: Boolean,
      default: false
    },
    //是否开启客服小组选择
    serverGroupSwitch: {
      type: Boolean,
      default: false
    },
    //是否开启多选
    checkBox: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    userType: {
      type: String,
      default: 'all'
    },
    //资源渠道选择的Id
    ChannelId: {
      type: String,
      default: ''
    },
    staffStateOptions: {
      type: Array,
      default: () => []
    },
    defaultPagination: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: false
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
        type: this.checkBox ? 'checkbox' : 'radio',
        getCheckboxProps: record => ({
          props: {
            disabled: this.selectedKeys.includes(record.id)
          }
        })
      }
    }
  },
  data() {
    return {
      serviceTypeOptions: [],
      itemLayout1,
      itemLayout,
      columns,
      deptList: JSON.parse(Vue.ls.get('userSchoolId')),
      defValue: Vue.ls.get('userDefaultId'),
      visible: false,
      confirmLoading: false,
      queryParam: {},
      userTypeData: 'all',
      userData: parameter => {
        let request = getUsersInDept
        if (this.userType == 'service') {
          delete this.queryParam.deptId
        }
        if (this.ChannelId) {
          this.queryParam.deptId = this.ChannelId
        }
        if (this.defaultPagination) {
          parameter.limit = 1000
        }
        if (!this.showOtherDept) {
          request = listGuaranteedEmployees
        }
        // if (this.counselorDimission) {
        //   this.queryParam.state = 'B'
        // } else {
        //   this.queryParam.state = null
        // }
        return request(this.userType, Object.assign(parameter, this.queryParam)).then(res => {
          this.$nextTick(() => {
            this.setNumber()
          })
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      firstTimeInThisComponents: false,
      serverGroup: '',
      serverGroups: [{ id: 'A', text: '全部客服' }, { id: 'B', text: '元气' }, { id: 'C', text: '追梦' }],
      data: []
      // :false,
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
  },
  created() {
    // this.deptList = JSON.parse(Vue.ls.get('userSchoolId'))
    // this.defValue = Vue.ls.get('userDefaultId')

    if (this.userType === 'master' || this.userType === 'all') {
      this.queryParam.deptId = this.defValue
    } else {
      this.queryParam.deptId = null
    }
  },
  mounted() {
    this.firstTimeInThisComponents = true
  },
  watch: {
    data: {
      deep: true,
      handler() {
        // this.serverGroup!=='' && this.changeGroup()
      }
    }
  },
  methods: {
    result(data) {
      this.data = data.data
    },
    changeGroup() {
      this.selectedRowKeys = []
      this.selectedRows = []
      if (this.serverGroup === 'all') {
        this.selectedRows = this.data
        this.selectedRowKeys = this.data.map(item => {
          return item.id + ',' + item.deptid
        })
      } else {
        let RowKeys = []
        let Rows = []
        let arr = this.serverGroups.find(item => item.id === this.serverGroup).customers.map(item => item.userid)
        this.data.forEach(item => {
          if (arr.some(todo => todo === item.id)) {
            RowKeys.push(item.id + ',' + item.deptid)
            Rows.push(item)
          }
        })
        this.selectedRowKeys = RowKeys
        this.selectedRows = Rows
        // customers
      }
    },
    initData() { },
    open(value) {
      this.queryParam.name = ''
      this.visible = true
      this.$nextTick(() => {
        this.selectedRowKeys = []
        this.selectedRows = []
        if (value) {
          if (this.checkBox) {
            if (value.deptId) {
              let selectedRowKeys = []
              value.id.forEach((item, index) => {
                selectedRowKeys.push(item + ',' + value.deptId[index])
              })
              value.id = selectedRowKeys
            }
            this.selectedRowKeys = value.id
            this.selectedRows = value.data
          } else {
            if (value.deptId) {
              this.selectedRowKeys = [value.id + ',' + value.deptId]
            } else {
              this.selectedRowKeys = [value.id]
            }
            this.selectedRows = [
              {
                id: value.id,
                userName: value.data,
                deptid: value.deptId
              }
            ]
          }
        }
        if (this.firstTimeInThisComponents) {
          this.firstTimeInThisComponents = false
          return
        }
        this.dataRefesh()
      })
      if (this.serverGroupSwitch) {
        getCustomerGroups().then(res => {
          if (res.code === 200) {
            this.serverGroups = res.data
            this.serverGroups.unshift({ name: '全部客服', id: 'all' })
          }
        })
      }

      listDeptUserByService().then(res => {
        const { data } = res
        this.serviceTypeOptions = data
      })

      // getDeptGroup().then(res => {
      //   if (res.code === 200) {
      //     let serviceTypeOptions = res.data.concat(res.data[0].children)
      //     this.serviceTypeOptions = serviceTypeOptions
      //   }
      // })
    },
    dataRefesh() {
      if (this.userType === 'master' || this.userType === 'all') {
        this.queryParam.deptId = this.defValue
      } else {
        this.queryParam.deptId = null
      }
      this.$nextTick(() => {
        this.searchForm.setFieldsValue({ ['deptId']: this.defValue })
        this.searchForm.setFieldsValue({ ['name']: '' })
      })
      if (this.$refs.table) {
        this.$refs.table.refresh()
      }
    },
    close() {
      this.serverGroup = null
      this.selectedRows = []
      this.selectedRowKeys = []
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    handleOk() {
      if (this.selectedRows.length === 0) {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择一条数据'
        })
      }
      if (this.selectedRows.length) {
        const backData = {
          deptId: this.selectedRows[0].deptid,
          id: this.selectedRows[0].id,
          name: this.selectedRows[0].userName,
          positionName: this.selectedRows[0].positionName
        }
        if (!this.checkBox) {
          this.$emit('getBackData', backData, this.userType)
        } else {
          this.$emit('getBackData', this.selectedRows, this.userType, 'mutiple')
        }
        this.close()
      }
      // else {
      //   this.$notification['error']({
      //     message: '系统通知',
      //     description: '目前只能操作一条数据'
      //   })
      // }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      if (this.checkBox && selectedRowKeys.length > 0) {
        let selectedRowsOld = JSON.parse(JSON.stringify(this.selectedRows)).concat(selectedRows)
        selectedRowsOld = this.unique(selectedRowsOld)
        selectedRowsOld.forEach((item, index) => {
          if (!this.selectedRowKeys.includes(item.id + ',' + item.deptid)) {
            selectedRowsOld.splice(index, 1)
          }
        })
        this.selectedRows = selectedRowsOld
      } else {
        this.selectedRows = selectedRows
      }
      this.$nextTick(() => {
        this.setNumber()
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
    searchTable() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          let queryParam = values
          this.queryParam = values
          if (Array.isArray(values.serviceType) && values.serviceType.length > 0) {
            this.queryParam.serviceDeptIds = values.serviceType.join(',')
            delete this.queryParam.serviceType
          }
          this.$refs.table.refresh()
        }
      })
    },
    setNumber() {
      if (this.selectedRows.length > 0) {
        this.selectedRows.forEach((item, index) => {
          item.isNumber = index + 1
        })
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style scoped lang="less">
.inner-modal-search {
  outline: none;
}

#inner-modal {
  width: 100px;
  margin: 0 auto;
}

/**操作按钮的样式*/
.buttonStyle {
  border: 1px solid #38b48d;
  border-radius: 4px;
  padding: 2px 6px;
  color: #38b48d;
}
</style>
