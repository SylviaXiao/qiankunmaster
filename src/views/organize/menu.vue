<template>
  <a-card :bordered="false">
    <div class="btnGroup">
      <!--      <a-button modules="addBtn" @click='openModal("add")'>新增</a-button>-->
      <!--      <a-button modules="addBtn" @click='getMenuList()'>刷新</a-button>-->
      <!--      <a-button modules="addBtn" @click='expanded()'>展开</a-button>-->

      <perm-box perm='organize:menu:save'>
        <a-button type="primary" icon="plus-circle" @click.native="openModal('add')">新增</a-button>
      </perm-box>
      <perm-box perm='organize:menu:reloadPerms'>
        <a-button style="color: #000c17 ;float: right;" @click="reset" :loading="resetLoading">重载</a-button>
      </perm-box>
    </div>
    <a-table :columns=columns
             :dataSource="menuList"
             :loading='tableLoading'
             :pagination='false'
             rowKey='id'>
      <span slot='status' slot-scope="text, record">
        <perm-box perm='organize:menu:status' :text="record.status=='Y'?'启用':'禁用'">
          <a-switch v-model="record.status=='Y'?true:false" @change='changeStatus($event,record)'>
            <a-icon type="check" slot="checkedChildren"/>
            <a-icon type="close" slot="unCheckedChildren"/>
          </a-switch>
        </perm-box>
      </span>
      <span slot='action' slot-scope="text, record">
        <perm-box perm='organize:menu:save'><a href="javascript:;" @click="openModal('add',text)"
                                               v-if="text.menuType !== 'C'">新增</a></perm-box>
        <perm-box perm='organize:menu:save'><a href="javascript:;" @click="openModal('edit',text)">编辑</a></perm-box>
        <perm-box perm='organize:menu:del'><a href="javascript:;" @click="remove(text)"
                                              v-if="!text.children||text.children==null">删除</a></perm-box>
          </span>
    </a-table>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
             v-model='menuModal'
             :title="modalTitle"
             @ok="sendForm()"
             okText='提交'>
      <a-form :form="form">
        <a-form-item
          label="上级目录"
          v-bind="formItemLayout">
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            placeholder='选择上级目录'
            v-decorator="[
                'parentMenuId',
                {rules: [{ required: true, message: '请选择上级目录' }]}
              ]"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item
          label="类型"
          v-bind="formItemLayout">
          <a-radio-group :options="menuTypeOptions"
                         @change="changeMenuType($event)"
                         v-decorator="[
                'type',
                {rules: [{ required: true, message: '请选择权限类型' }]}
              ]"></a-radio-group>

        </a-form-item>
        <a-form-item
          label="名称"
          v-bind="formItemLayout">
          <a-input
            v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入权限名称' }]}
              ]"
          />
        </a-form-item>

        <a-form-item
          label="标识"
          v-bind="formItemLayout">
          <a-input
            v-decorator="[
                'perm',
                {rules: [{ required: true, message: '请输入权限标识' }]}
              ]"
          />
        </a-form-item>

      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
  import { saveOrgMenu, removeOrgMenu, getPermissionTree, changeMenuStatus, resetMenu } from '@/api/organize'
  import PermBox from '@/components/PermBox'

  const treeData = [
    {
      title: '主目录',
      key: '0',
      value: '0',
      children: []
    }
  ]
  const columns = [
    {
      title: '权限名称',
      dataIndex: 'name'
    },
    // {
    //   title: '请求地址',
    //   dataIndex: 'path'
    // },
    {
      title: '权限',
      dataIndex: 'perm'
    },
    {
      title: '类型',
      dataIndex: 'type',
      customRender: text => {
        let showText = ''
        if (text == 'A') {
          showText = '目录'
        } else {
          showText = '资源'
        }
        return showText
      }
    },
    //
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   key: 'status',
    //   scopedSlots: { customRender: 'status' }
    //   // customRender: text => {
    //   //   let showText = ''
    //   //   text === 'Y' ? showText = '启用' : showText = '禁用'
    //   //   return showHtml
    //   // }
    // },
    {
      title: '操作',
      key: 'action',
      width: '250px',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 18 },
      sm: { span: 18 }
    }
  }
  const menuTypeOptions = [
    { label: '目录', value: 'A' },
    { label: '资源', value: 'B' }

  ]
  const menuStatusOptions = [
    { label: '启用', value: 'Y' },
    { label: '禁用', value: 'N' }
  ]
  const fieldNameList = ['type', 'name', 'perm']
  export default {
    name: 'menuList',
    components: {

      PermBox
    },
    data() {
      return {
        treeData,
        columns,
        formItemLayout,
        menuTypeOptions,
        menuStatusOptions,
        tableTree: [],
        isExpanded: false,
        tableLoading: false,
        menuList: [],
        modalTitle: '权限管理',
        menuModal: false,
        formValues: {},
        defaultValue: 'Y',
        tags: false,
        resetLoading: false
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    created() {
      this.getMenuList()
    },
    methods: {

      reset() {
        this.resetLoading = true
        resetMenu().then(res => {
          this.getMenuList()
        }).finally(() => {
          setTimeout(() => {
            this.resetLoading = false
          }, 400)
        })
      },


      expanded(data) {
        if (this.tableTree.length == 0) {

          this.open(this.menuList)
        } else {
          this.tableTree.length = 0
        }
      },
      open(data) {
        data.forEach((item, index) => {
          this.tableTree.push(item.id)
          if (item.children && item.children.length > 0) {
            this.open(item.children)
          }
        })
      },
      getMenuList() {
        this.tableLoading = true
        getPermissionTree().then(res => {
          this.menuList = res.data
          this.rewriteDataTree(this.menuList)
          if (this.treeData[0].children.length > 0) {
            this.treeData[0].children.length = 0
          }
          this.menuList.forEach(item => {
            this.treeData[0].children.push(item)
          })
          setTimeout(this.tableLoading = false, 400)
        })
      },
      openModal(type, data) {
        if (type == 'add') {
          this.add(data)
        } else {
          this.edit(data)
        }
        this.tags = false
        this.menuModal = true
      },
      add(data) {
        this.modalTitle = '添加权限'
        this.formValues = {}
        fieldNameList.forEach(item => {
          this.$nextTick(() => {
            this.form.setFieldsValue({ [item]: '' })
          })
        })
        let hasParentId = '0'
        data ? hasParentId = data.id : ''
        this.$nextTick(() => {
          this.form.setFieldsValue({ ['parentMenuId']: hasParentId })
        })
        this.formValues.status = 'Y'

      },
      edit(data) {
        this.modalTitle = '添加权限'
        this.formValues.id = data.id
        fieldNameList.forEach(item => {
          this.$nextTick(() => {
            this.form.setFieldsValue({ [item]: data[item] })
          })
        })
        this.$nextTick(() => {
          this.form.setFieldsValue({ ['parentMenuId']: data.parentId || '0' })
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
            removeOrgMenu(data.id).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.getMenuList()
            })
          }
        })
      },
      sendForm() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.formValues = Object.assign(this.formValues, values)
            this.formValues.parentMenuId == '0' ? this.formValues.parentMenuId = '' : ''
            !values.order ? this.formValues.order = '0' : ''
            delete this.formValues.children
            saveOrgMenu(this.formValues).then(res => {
              this.menuModal = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.getMenuList()
            })
          }
        })
      },
      changeMenuType(el) {
        if (el.target.value && el.target.value !== 'B') {
          this.tags = false
        } else {
          this.tags = true
        }
      },
      exampleBtn(type) {
        let menuName = ''
        if (type == 'view') {
          menuName = '查看'
        } else if (type == 'edit') {
          menuName = '新增/编辑'
        } else {
          menuName = '删除'
        }
        const parentId = this.form.getFieldsValue(['parentMenuId']).parentMenuId
        this.getPath(this.treeData, parentId).then(data => {
        })
        return
        const menuPath = `${data.path}/${type}`
        const menuPerms = `${data.perm}:${type}`
        this.$nextTick(() => {
          this.form.setFieldsValue({ ['menuName']: menuName })
          this.form.setFieldsValue({ ['path']: menuPath })
          this.form.setFieldsValue({ ['perm']: menuPerms })
        })
      },
      getPath(tree, id) {
        return new Promise((resolve, reject) => {
          tree.forEach(item => {
            if (item.key == id) {
              resolve(item)
            }
            if (item.children && item.children.length > 0) {
              this.getPath(item.children, id)
            }
          })
        })
      },
      changeStatus(checked, data) {
        const status = {
          enabled: checked
        }
        const _this = this
        if (!checked) {
          this.$confirm({
            title: '系统提示',
            content: '确认禁用该条数据吗?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              _this.changeMenuStatus(status, data)

            },
            onCancel() {
            }
          })
        } else {
          _this.changeMenuStatus(status, data)
        }

      },
      changeMenuStatus(status, data) {
        changeMenuStatus(data.id, status).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.getMenuList()
        })
      },
      deleteChilrden(arr) {
        arr.map(item => {
          if (item.children && item.children.length > 0) {
            if (item.children[0].type === 'B') {
              delete item.children
            } else {
              this.deleteChilrden(item.children)
            }
          }
        })
      },
      rewriteDataTree(data) {
        data.forEach((item, index) => {
          if (item.title && item.value) {
            return false
          }
          item.title = item.name
          item.value = item.id
          if (item.children && item.children.length > 0) {
            this.rewriteDataTree(item.children)
          }
        })
      }
    }

  }
</script>

<style scoped lang=less>
  @import "btn";
</style>
