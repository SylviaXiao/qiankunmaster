<template>
  <div>
    <a-card>
      <!--<div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm="workflow:role:save">
          <a-button icon="plus-circle" type="primary" @click="addRole">新增角色</a-button>
        </perm-box>
      </div>-->
      <div class="table_wrapper">
        <a-tabs default-active-key="A" :activeKey="selectKey" @change="selectKeyHandle">
          <a-tab-pane tab="退费" key="A"></a-tab-pane>
          <a-tab-pane tab="报销" key="B"></a-tab-pane>
          <template slot="tabBarExtraContent">
            <perm-box perm="workflow:role:save">
              <a-button icon="plus-circle" type="primary" @click="addRole">新增角色</a-button>
            </perm-box>
          </template>
        </a-tabs>
        <a-table :pagination="false" rowKey="roleId" :columns="columns" :data-source="dataRole" bordered>
          <span slot="action" slot-scope="text, record" style="overflow: hidden;">
            <perm-box perm="workflow:role:save">
              <a href="javascript:;" class="mr15" @click="addItem(record)">添加员工</a>
              <a href="javascript:;" class="mr15" @click="editItem(record)">修改</a>
            </perm-box>
            <perm-box perm="workflow:role:del">
              <a href="javascript:;" class="mr15" @click="delItem(record)">删除</a>
            </perm-box>
          </span>
          <a-table
            rowKey="id"
            slot="expandedRowRender"
            slot-scope="text"
            :columns="innerColumns"
            :data-source="text.owners"
            :pagination="false"
            class="filterTable"
          >
            <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#1ba97b' : undefined }" />
            <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="column_search_wrap">
              <a-input
                class="column_search_input "
                style="margin-bottom:10px;"
                :placeholder="`请输入${column.title}`"
                :value="selectedKeys[0]"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="() => handleSearch(clearFilters, selectedKeys[0], confirm, column.dataIndex)"
              />
              <span class="between">
                <a-button type="primary" size="small" @click="() => handleSearch(clearFilters, selectedKeys[0], confirm, column.dataIndex)">
                  搜索
                </a-button>
                <a-button size="small" @click="() => handleReset(clearFilters, column.dataIndex)">
                  重置
                </a-button>
              </span>
            </div>
            <span slot="_title" slot-scope="text, record">
              <a href="#" @click="toInfo(record)">{{ record.title || '无' }}</a>
            </span>
            <span slot="schools" slot-scope="text, record">
              <a href="#" @click="toInfo(record)">{{ record.title || '无' }}</a>
            </span>
            <span slot="innerAction" slot-scope="textInner, record">
              <perm-box perm="workflow:role:save">
                <a href="javascript:;" class="mr15" @click="editInnerItem(record, text)">修改</a>
              </perm-box>
              <perm-box perm="workflow:role:del">
                <a href="javascript:;" class="mr15" @click="delInnerItem(record)">删除</a>
              </perm-box>
            </span>
          </a-table>
        </a-table>
      </div>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="visibleRole" title="角色" @ok="sendRoleForm()" okText="提交">
      <a-spin :spinning="spinning">
        <a-form :form="roleForm">
          <a-form-item style="display: none">
            <a-input v-decorator="['roleId']" />
          </a-form-item>
          <a-form-item label="角色名称" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-input v-decorator="['name', { rules: [{ required: true, message: '请选择支付类型' }] }]"/>
          </a-form-item>
          <a-form-item label="key" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-input v-decorator="['key', { rules: [{ required: true, message: '请输入key' }] }]"/>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="visibleStaff" title="人员" @ok="sendStaffForm()" okText="提交">
      <a-spin :spinning="spinning">
        <a-form :form="staffFrom">
          <a-form-item style="display: none">
            <a-input v-decorator="['roleOwnerId']" />
          </a-form-item>
          <a-form-item label="选择员工" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-input
              style="cursor: 'pointer', color: '#000'"
              disabled
              v-decorator="[`orgUserName`, { rules: [{ required: true, message: '选择员工' }] }]"
              placeholder="点右侧图标选择"
            >
              <a-icon slot="addonAfter" type="search" @click="searchStaff" />
            </a-input>
          </a-form-item>
          <a-form-item label="选择分馆" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <div class="tree_wrap">
              <a-tree
                checkable
                placeholder="若不选,则为所有分馆"
                v-model="staffSchoolId"
                :treeData="deptTree"
                :defaultExpandAll="true"
                :autoExpandParent="true"
                :checkStrictly="true"
              />
            </div>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <i-modal ref="imodal" :multiple="false" userType="all" @getBackData="getBackData"></i-modal>
  </div>
</template>

<script>
import IModal from '@/components/InnerModal/modal.vue'
import { listDept } from '@/api/common'
import PermBox from '@/components/PermBox'
import { saveWorkflowOwner, saveWorkflowRole, listWorkflowRoleDetail, listWorkflowRoleUserDetail, removeWorkflowRole, removeWorkflowOwner } from '@/api/system'
const columns = [
  {
    title: '角色名',
    dataIndex: 'roleName'
  },
  {
    title: '操作',
    key: 'action',
    width: '160px',
    scopedSlots: { customRender: 'action' }
  }
]
const innerColumns = [
  {
    title: '人员',
    width: '80px',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'userName'
    },
    onFilter: (value, record) =>
      record.userName
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    key: 'userName',
    dataIndex: 'userName'
  },
  {
    title: '分馆',

    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'schools'
    },
    onFilter: (value, record) =>
      record.schools
        .map(item => item.schoolName)
        .join(',')
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    dataIndex: 'schools',
    key: 'schools',
    customRender: (text, record) => {
      return text.map(item => item.schoolName).join(',')
    }
  },
  {
    title: '操作',
    key: 'innerAction',
    width: '80px',
    scopedSlots: { customRender: 'innerAction' }
  }
]
export default {
  data() {
    return {
      selectKey: 'A',
      visibleRole: false,
      visibleStaff: false,
      spinning: false,
      columns,
      innerColumns,
      staffSchoolId: undefined,
      deptTree: [],
      dataRole: [
        {
          sourceName: 'text',
          id: '12122',
          roleList: [
            {
              schoolName: 'schoolName',
              staffName: 'staffName',
              id: '2222'
            }
          ]
        }
      ]
    }
  },
  components: {
    IModal,
    PermBox
  },
  beforeCreate() {
    this.roleForm = this.$form.createForm(this)
    this.staffFrom = this.$form.createForm(this)
  },
  mounted() {
    this.loadTable()
    this.loadSchoolList()
  },
  methods: {
    selectKeyHandle(e) {
      if (this.selectKey !== e) {
        this.selectKey = e
        this.loadTable()
      }
    },
    // 搜索
    handleSearch(clearFilters, value, confirm, dataIndex) {
      // let paramName = dataIndex
      // if (dataIndex === '_title') paramName = 'title'
      // this.queryParam[paramName] = value
      // this.clearFilters = clearFilters
      confirm()
    },
    // 重置
    handleReset(clearFilters, dataIndex) {
      // if (clearFilters && dataIndex) {
      //   let paramName = dataIndex
      //   if (dataIndex === '_title') paramName = 'title'
      //   this.queryParam[paramName] = undefined
      clearFilters()
      // } else {
      //   this.queryParam = {}
      //   this.clearFilters && this.clearFilters()
      // }
    },
    // 添加点击区域全选子集
    changeTreeHandle(checkedKeys, { checked, checkedNodes, node, event }) {
      const v = node.eventKey
      let includeNum = 0
      const areaIds = this.deptTree.map(item => item.id)
      if (areaIds.includes(v)) {
        this.$nextTick(() => {
          const oldDeptIds = this.getStaffSchoolId()
          // step1删除掉v这一项(区域不选择)
          let newDeptIds = [...oldDeptIds]
          newDeptIds = newDeptIds.filter(item => item !== v)
          // step2找到v下面的子集id
          const childIds = this.deptTree.filter(item => item.id === v)[0].children.map(it => it.id)
          // step3判断oldDeptIds里有多少childIds
          oldDeptIds.forEach(item => {
            if (childIds.includes(item)) {
              includeNum++
            }
          })
          // step4判断includeNum和childIds长度的关系,做出处理
          if (includeNum === childIds.length) {
            // 如果长度为childIds的长度,则删除
            childIds.forEach(item => {
              newDeptIds = newDeptIds.filter(it => it !== item)
            })
          } else {
            newDeptIds = Array.from(new Set([...newDeptIds, ...childIds])) //去重
          }
          console.log(newDeptIds)
          this.staffSchoolId = newDeptIds
        })
      }
    },
    // 新增角色
    addRole() {
      this.visibleRole = true
      this.spinning = true
      this.$nextTick(() => {
        this.roleForm.resetFields()
        this.spinning = false
      })
    },
    sendRoleForm() {
      this.roleForm
        .validateFields()
        .then(value => {
          let params = {
            name: value.name,
            roleId: value.roleId,
            key: value.key,
            type: this.selectKey
          }
          return saveWorkflowRole(params)
        })
        .then(() => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.visibleRole = false
          this.loadTable()
        })
    },
    editItem(record) {
      console.log(record)
      this.visibleRole = true
      this.spinning = true
      this.$nextTick(() => {
        this.roleForm.resetFields()
        this.roleForm.setFieldsValue({
          roleId: record.roleId,
          name: record.roleName,
          key: record.roleKey,
          type: record.roleType
        })
        this.spinning = false
      })
    },
    delItem(record) {
      this.$confirm({
        title: '系统提示',
        content: '是否确定删除?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$nextTick().then(() => {
            removeWorkflowRole(record.roleId).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.loadTable()
            })
          })
        }
      })
    },

    // 新增人员
    addItem(record) {
      this.staffInfo = {} //重置staffInfo
      this.roleRecord = record
      this.visibleStaff = true
      this.$nextTick(() => {
        this.staffSchoolId = undefined
        this.staffFrom.resetFields()
      })
    },
    searchStaff() {
      this.$refs.imodal.open()
    },
    getBackData(data) {
      this.staffInfo = data
      this.staffFrom.setFieldsValue({
        orgUserName: data.name
      })
      listWorkflowRoleUserDetail({
        userId: this.staffInfo.id,
        roleId: this.roleRecord.roleId
      }).then(data => {
        this.staffSchoolId = data?.data[0]?.schools?.map(item => item.schoolId)
      })
    },
    sendStaffForm() {
      this.staffFrom.validateFields().then(value => {
        let params = {
          orgUserId: this.staffInfo.id,
          roleId: this.roleRecord.roleId,
          roleOwnerId: value.roleOwnerId,
          schoolId: this.getStaffSchoolId() ? this.getStaffSchoolId().join(',') : null
        }
        saveWorkflowOwner(params).then(() => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.visibleStaff = false
          this.loadTable()
        })
      })
    },
    getStaffSchoolId() {
      const filterFun = x => x !== undefined && x !== null
      return this.staffSchoolId?.checked?.filter(filterFun) || this.staffSchoolId?.filter(filterFun) || []
    },
    editInnerItem(record, fatherRecord) {
      this.staffInfo = {}
      this.staffRecord = record
      this.roleRecord = fatherRecord
      this.visibleStaff = true
      this.spinning = true
      this.$nextTick(() => {
        this.staffFrom.resetFields()
        this.staffFrom.setFieldsValue({
          roleOwnerId: record.id,
          orgUserName: record.userName
        })
        this.staffSchoolId = record.schools.map(item => item.schoolId)
        this.staffInfo = {
          id: record.userId
        }
        this.spinning = false
      })
    },
    delInnerItem(record) {
      this.$confirm({
        title: '系统提示',
        content: '是否确定删除?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$nextTick().then(() => {
            removeWorkflowOwner({
              roleId: record.roleId,
              userId: record.userId
            }).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.loadTable()
            })
          })
        }
      })
    },
    loadTable() {
      listWorkflowRoleDetail({type: this.selectKey}).then(res => {
        this.dataRole = res.data
      })
    },
    loadSchoolList() {
      listDept().then(res => {
        this._handleTreeData(res.data)
        this.deptTree = res.data
      })
    },
    _handleTreeData(data) {
      data.forEach((item, index) => {
        item.title = item.deptName || ''
        item.value = item.id
        item.key = item.id
        if (item.deptType !== 'B') {
          item.disabled = false
        }
        if (item.children && item.children.length > 0) {
          this._handleTreeData(item.children)
        }
      })
    },
  }
}
</script>

<style lang="less">
.mr15 {
  margin-right: 15px;
}
.table_wrapper {
  width: 100%;
  overflow: hidden;
  .ant-table-expanded-row td > .ant-table-wrapper {
    margin: -13px -6px;
  }
}
.tree_wrap {
  height: 40vh;
  overflow-y: auto;
}
.column_search_wrap {
  width: 200px;
  padding: 10px;

  .column_search_input {
    display: block;
    width: 100%;
  }

  .column_search_radio {
    display: block;
    height: 30px;
    line-height: 30px;
  }
}
.filterTable {
  .ant-table-thead > tr > th .anticon-filter,
  .ant-table-thead > tr > th .ant-table-filter-icon {
    position: static;
    text-align: left;
    padding-left: 10px;
  }
  .ant-table-thead > tr > th .anticon-filter > svg,
  .ant-table-thead > tr > th .ant-table-filter-icon > svg {
    position: static;
    margin-top: 0;
    margin-left: 0;
  }
}
</style>
