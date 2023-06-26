<template>
  <div class="role-wrapper">
    <a-card :bordered="false">
      <div class="btnClass">
        <perm-box perm="organize:role:save">
          <a-button icon="plus-circle" type="primary" @click="openModal('add')">新增</a-button>
        </perm-box>
      </div>
      <a-table :columns="roleColumns" :dataSource="roleList" :pagination="false" rowKey="id" :loading="tableLoading">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="organize:role:save">
            <a href="javascript:;" @click="openModal('edit', record)">编辑</a>
          </perm-box>
          <perm-box perm="organize:role:del">
            <a href="javascript:;" @click="remove(record)">删除</a>
          </perm-box>
        </span>
      </a-table>

      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        v-model="modalOptions.roleModal"
        class="role-modal"
        width="1200px"
        :title="modalOptions.roleModalTiTle"
        @ok="sendForm()"
        okText="提交"
      >
        <a-spin :spinning="spinning">
          <a-form :form="form">
            <a-row>
              <!-- 角色名称 -->
              <a-col :span="12">
                <a-form-item label="角色名称" v-bind="halfLayout">
                  <a-input v-decorator="['roleName', { rules: [{ required: true, message: '请输入角色名称' }] }]" />
                </a-form-item>
              </a-col>
              <!-- 备注 -->
              <a-col :span="12">
                <a-form-item label="备注" v-bind="halfLayout">
                  <a-input v-decorator="['remark', { rules: [{ validator: $verify.lenth }] }]" />
                </a-form-item>
              </a-col>
            </a-row>

            <!-- 树状图 -->
            <a-form-item label="权限" v-bind="formItemLayout" class="required">
              <div class="role-table">
                <div class="role-menu" v-for="(item, index) in menuTree" :key="index">
                  <div class="first-role">{{ item.name }}</div>
                  <div class="second-role">
                    <div class="second-role-list" v-for="(second, secondIdx) in item.children" :key="secondIdx">
                      <div class="second-role-name">
                        <a-checkbox
                          :value="second.id"
                          @change="onCheckAllChange($event, second)"
                          :indeterminate="second.indeterminate"
                          :checked="second.checkAll"
                          >{{ second.name }}
                        </a-checkbox>
                      </div>
                      <a-checkbox-group
                        @change="onChange($event, second)"
                        class="third-role"
                        v-model="second.checkedList"
                      >
                        <div class="third-role-list">
                          <div class="third-role-name" v-for="(third, thirdIdx) in second.children" :key="thirdIdx">
                            <a-checkbox :value="third.id">{{ third.name }}</a-checkbox>
                          </div>
                        </div>
                      </a-checkbox-group>
                    </div>
                  </div>
                </div>
              </div>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { getOrgRole, getPermissionTree, removeOrgRole, saveOrgRole, getRoleInfo } from '@/api/organize'
import PermBox from '@/components/PermBox'

const roleColumns = [
  {
    title: '角色名称',
    dataIndex: 'roleName'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    idth: '300px'
  },
  {
    title: '操作',
    key: 'action',
    width: '250px',
    scopedSlots: { customRender: 'action' }
  }
]
const addTitle = '添加角色'
const editTitle = '修改角色'
const formItemLayout = {
  labelCol: {
    xs: { span: 2 },
    sm: { span: 2 }
  },
  wrapperCol: {
    xs: { span: 22 },
    sm: { span: 22 }
  }
}
const halfLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 }
  }
}
const fieldNameList = ['roleName', 'remark', 'perms']
export default {
  name: 'role',
  components: {
    PermBox
  },
  data() {
    return {
      roleColumns,
      halfLayout,
      formItemLayout,
      roleList: [],
      modalOptions: {
        roleModal: false,
        roleModalTiTle: ''
      },
      checkList: [],
      menuTree: [],
      formValues: {},
      tableLoading: false,
      treeValue: [],
      spinning: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.getRoleList()
    this.getMenuTree()
  },
  methods: {
    refreshCheckbox() {
      let arr = this.menuTree
      this.menuTree = []
      this.menuTree = arr
    },
    onCheckAllChange(e, data) {
      const { refreshCheckbox } = this
      Object.assign(data, {
        checkedList: e.target.checked ? this.getCheckedList(data) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
      refreshCheckbox()
    },
    onChange(arr, second) {
      const { refreshCheckbox } = this
      second.indeterminate = !!arr.length && arr.length < second.children.length
      second.checkAll = arr.length === second.children.length
      refreshCheckbox()
    },
    getCheckedList(data) {
      const { children } = data
      let arr = []
      if (children) {
        children.map(item => {
          arr.push(item.id)
        })
        return arr
      }
    },

    getRoleList() {
      this.tableLoading = true
      getOrgRole()
        .then(res => {
          this.roleList = res.data
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    openModal(type, data) {
      if (type == 'add') {
        this.add()
      } else {
        this.edit(data)
      }

      this.modalOptions.roleModal = true
    },
    add() {
      this.checkList = []
      this.formValues = {}
      this.modalOptions.roleModalTiTle = addTitle
      this.form.resetFields()
      this.treeValue.length = 0
      this.treeValue = new Array()
      this.setParentData(this.treeValue)
    },
    edit(data) {
      this.spinning = true
      this.formValues.id = data.id
      this.modalOptions.roleModalTiTle = editTitle
      getRoleInfo(data.id).then(res => {
        const result = res.data
        this.treeValue = []
        let perms = ''
        result.orgMenuList.forEach(item => {
          this.treeValue.push(item.menuId)
        })
        this.setParentData(this.treeValue)

        this.$nextTick(() => {
          this.form.setFieldsValue({ ['roleName']: data['roleName'] })
          this.form.setFieldsValue({ ['remark']: data['remark'] })
        })
        this.spinning = false
      })
    },
    setParentData(arrs) {
      const { menuTree } = this
      menuTree.map(item => {
        if (item.children && item.children.length > 0) {
          item.children.map(val => {
            let num = 0
            val.checkedList = new Array()
            arrs.map(arr => {
              if (val.children) {
                val.children.map(c => {
                  if (c.id === arr) {
                    num++
                    val.checkedList.push(arr)
                  }
                })
              }
            })
            if (val.children) {
              val.indeterminate = !!num && num < val.children.length
              val.checkAll = num === val.children.length
            }
          })
        }
      })
    },
    remove(data) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeOrgRole(data.id).then(res => {
            if (res.code == 200) {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            } else {
              _this.$notification['error']({
                message: '系统通知',
                description: '操作失败'
              })
            }
            _this.getRoleList()
          })
        }
      })
    },
    getMenuTree() {
      getPermissionTree().then(res => {
        this.menuTree = res.data
      })
    },
    getCheckedData(data) {
      let arr = []
      data.map(item => {
        if (item.children && item.children.length > 0) {
          item.children.map(val => {
            if (val.checkedList && val.checkedList.length > 0) {
              arr.push.apply(arr, val.checkedList)
            }
          })
        }
      })
      return arr.join(',')
    },
    sendForm() {
      const _this = this
      const { menuTree, getCheckedData } = this
      this.form.validateFields((err, values) => {
        if (!err) {
          let formValues = {}
          formValues = Object.assign(this.formValues, values)
          formValues.perms = getCheckedData(menuTree)
          saveOrgRole(formValues).then(res => {
            this.modalOptions.roleModal = false
            this.$notification['success']({
              message: '系统通知',
              description: res.data
            })
            _this.getRoleList()
          })
        }
      })
    },
    dataFilter(data) {
      data.forEach((value, index) => {
        if (value.menuName && value.id) {
          value.label = value.name
          value.value = value.id
          if (value.children) {
            this.dataFilter(value.children)
          }
        }
      })
    },
    onCheck(checkedKeys, info) {
      let perms = ''
      if (checkedKeys.length > 0) {
        checkedKeys.forEach(item => {
          perms = perms + item + ','
        })
      }
      this.formValues.perms = perms
      this.$nextTick(() => {
        this.form.setFieldsValue({ ['perms']: perms })
      })
    }
  }
}
</script>

<style lang="less">
@import 'btn';
.required {
  .ant-form-item-label {
    label::before {
      display: inline-block;
      margin-right: 4px;
      content: '*';
      font-family: SimSun;
      line-height: 1;
      font-size: 14px;
      color: #f5222d;
    }
  }
}

.role-table {
  .role-menu {
    border: 1px solid #dddddd;
    border-top: none;
    display: flex;
    flex-flow: row nowrap;

    &:first-child {
      border-top: 1px solid #dddddd;
    }

    .first-role {
      width: 150px;
      font-weight: 700;
      text-align: center;
      border-right: 1px solid #dddddd;
    }

    .second-role {
      width: 100%;

      .second-role-list {
        display: flex;
        flex-flow: row nowrap;
        padding-left: 10px;

        .third-role {
          width: 100%;

          .third-role-list {
            line-height: 40px;
            display: flex;
            flex-flow: row wrap;
          }

          .third-role-name {
            margin: 0 8px;
          }
        }

        .second-role-name {
          width: 150px;
          min-width: 150px;
          border-right: 1px solid #dddddd;
          line-height: 40px;
        }

        border-bottom: 1px solid #dddddd;

        &:nth-of-type(2n) {
          background-color: #fafafa;
        }

        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }
}

.role-modal {
  .role-perm {
    max-height: 450px;
    overflow-y: auto;
    margin-top: 25px;

    .parent-list {
      .parent-name {
        font-size: 16px;
      }

      .second-list {
        text-indent: 20px;
        margin: 5px 0;

        .ant-checkbox-wrapper {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
