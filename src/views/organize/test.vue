<template>
  <a-card :bordered="false">
    <div class="btnGroup">
      <a-button class="addBtn">新增</a-button>
      <a-button class="addBtn">刷新</a-button>
    </div>
<!--    <a-table :columns="columns"-->
<!--             :dataSource="menuList"-->
<!--             :pagination="false"-->
<!--             rowKey='id'>-->
<!--    <span slot='action' slot-scope="text, record">-->
<!--          <a-button modules="addBtn"-->
<!--                    @click='openModal("add",text)'-->
<!--                    v-if="text.menuType !== '3'">新增</a-button>-->
<!--          <a-button modules="editBtn" @click='openModal("edit",text)'>编辑</a-button>-->
<!--          <a-button modules="deleteBtn"-->
<!--                    @click=deleteMenu(text)-->
<!--                    v-if="!text.children">删除</a-button>-->
<!--    </span>-->
<!--    </a-table>-->
<!--    <a-modal :maskClosable="$store.state.modalMaskClickEnable"-->
<!--      v-model="modal.visible"-->
<!--      :title="modal.title"-->
<!--      @ok="sendForm()"-->
<!--      okText="提交"-->
<!--      modules="f-modal"-->
<!--    >-->
<!--      <a-form>-->
<!--        <a-form-item-->
<!--          label="上级菜单"-->
<!--          :label-col="{ span: 4 }"-->
<!--          :wrapper-col="{ span: 18 }">-->
<!--          <a-tree-select-->
<!--            v-model="value"-->
<!--            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"-->
<!--            :treeData="treeData"-->
<!--            placeholder='选择组织架构'-->
<!--            treeDefaultExpandAll-->
<!--            @select="chooseTree"-->
<!--          >-->
<!--          </a-tree-select>-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          label="菜单类型"-->
<!--          :label-col="{ span: 4 }"-->
<!--          :wrapper-col="{ span: 18 }">-->
<!--          <a-radio-group :options="menuTypeOptions" v-model='menuForm.menuType'/>-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          label="菜单名称"-->
<!--          :label-col="{ span: 4 }"-->
<!--          :wrapper-col="{ span: 18 }">-->
<!--          <a-input v-model='menuForm.menuName'></a-input>-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          label="请求地址"-->
<!--          :label-col="{ span: 4 }"-->
<!--          :wrapper-col="{ span: 18 }">-->
<!--          <a-input v-model='menuForm.path'></a-input>-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          label="权限标识"-->
<!--          :label-col="{ span: 4 }"-->
<!--          :wrapper-col="{ span: 18 }">-->
<!--          <a-input v-model='menuForm.pers'></a-input>-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          label="图标"-->
<!--          :label-col="{ span: 4 }"-->
<!--          :wrapper-col="{ span: 18 }">-->
<!--          <a-input v-model='menuForm.icon'></a-input>-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          label="菜单状态"-->
<!--          :label-col="{ span: 4 }"-->
<!--          :wrapper-col="{ span: 18 }">-->
<!--          <a-radio-group :options="menuStatusOptions" v-model='menuForm.status'/>-->
<!--        </a-form-item>-->
<!--      </a-form>-->
<!--    </a-modal>-->

  </a-card>
</template>

<script>
  import { saveOrgMenu, removeOrgMenu, getPermissionTree } from '@/api/organize'

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menuName'
    },
    {
      title: '请求地址',
      dataIndex: 'path'
    },
    {
      title: '权限',
      dataIndex: 'pers'
    },
    {
      title: '类型',
      dataIndex: 'menuType',
      customRender: text => {
        let showText = ''
        if (text == 1) {
          showText = '目录'
        } else if (text == 2) {
          showText = '菜单'
        } else if (text == 3) {
          showText = '按钮'
        }
        return showText
      }
    },

    {
      title: '状态',
      dataIndex: 'status',
      customRender: text => {
        let showText = ''
        text === 'Y' ? showText = '启用' : showText = '禁用'
        return showText
      }
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const treeData = [
    {
      title: '主目录',
      key: '1',
      value: '1',
      children: []
    }
  ]
  const menuTypeOptions = [
    { label: '目录', value: '1' },
    { label: '菜单', value: '2' },
    { label: '按钮', value: '3' }
  ]
  const menuStatusOptions = [
    { label: '启用', value: 'Y' },
    { label: '禁用', value: 'N' }
  ]
  const defMenuForm = {
    parentMenuName: '',
    parentMenuId: '',
    menuName: '',
    menuType: '1',
    path: '',
    icon: '',
    pers: '',
    status: 'Y'
  }
  export default {
    name: 'organizePermission',
    data() {
      return {
        columns,
        menuList:[],






        modal: {
          title: 'title',
          visible: false
        },
        value: '1',
        treeData,
        orgTree: [],
        menuForm: {},
        menuTypeOptions,
        menuStatusOptions,
        modal: {
          title: 'title',
          visible: false
        },
        menuModal: {
          title: 'title',
          visible: false
        },
        treeHeader: '',
        isDisabled: false
      }
    },
    mounted() {

    },
    created() {
      this.getTreeList()
    },
    methods: {
      getTreeList() {
      },
      getTreeList(value) {
        this.getTreeList()
      },
      deleteMenu(params) {
        const _this = this
        this.$confirm({
          title: '系统提示',
          content: '确认删除该条菜单吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            removeOrgMenu(params.id).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.getTreeList()
            })
          }
        })

      },
      openModal(val, record) {
        if (val === 'add') {
          if (record) {
            this.add(record)
          } else {
            this.formReload()
            this.modal.title = '添加菜单'
            this.menuForm = defMenuForm
            this.menuForm.parentMenuId = ''
            this.value = '1'
          }

        } else {
          this.edit(record)
        }
        this.modal.visible = true
      },
      add(record) {
        this.formReload()
        this.modal.title = '添加菜单'
        this.menuForm = defMenuForm
        this.menuForm.parentMenuId = record.id
        this.value = record.menuName
      },
      edit(record) {
        this.formReload()
        this.modal.title = '修改菜单'
        this.menuForm = record
        delete this.menuForm.children
        if (record.parentId == null) {
          this.value = '1'
          this.menuForm.parentMenuId = ''
        } else {
          this.menuForm.parentMenuId = record.parentId
          // this.findParentName(this.options.dataSource, record.parentId)
          this.value = record.parentId
        }

      },
      chooseTree(value) {
      },
      formReload() {
        this.modal.title = ''
        this.menuForm = defMenuForm
        this.treeHeader = ''
        this.isDisabled = false
      },
      findParentName(data, id) {
        data.forEach(item => {
          if (item.id === id) {
            this.value = item.id
          } else if (item.children && item.children.length != 0) {
            this.findParentName(item.children, id)
          }
        })
      },
      sendForm() {
        saveOrgMenu(this.menuForm).then(res => {
          this.modal.visible = false
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.getTreeList()
        })
      },
      deleteMenu(params) {
        const _this = this
        this.$confirm({
          title: '系统提示',
          content: '确认删除该条菜单吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            removeOrgMenu(params.id).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.getTreeList()
            })
          }
        })

      },
      changeActivekey(key) {
        if (key.length !== 0) {
          getPermissionTree().then(res => {
            this.hasChilren(res.data)
            this.dataFilter(res.data)
            this.orgTree = res.data
          })
        }
      },
      hasChilren(values) {
        values.forEach(item => {
          if (item.children == null || item.children.length === 0) {
            delete item.children
            return false
          }
          this.hasChilren(item.children)
        })
      },
      dataFilter(data) {
        let treeData = {}
        data.forEach((value, index) => {
          if (value.menuName && value.id) {
            value.title = value.menuName
            value.key = value.id
            if (value.children) {
              this.dataFilter(value.children)
            }
          }
        })
      },
      onSelect(val, data) {
        this.treeHeader = data.node.title
        this.menuForm.parentMenuId = val[0]
      },
      rewriteDataTree(data) {
        data.forEach((value, index) => {
          if (value.menuName && value.id) {
            value.title = value.menuName
            value.key = value.id
            value.value = value.id
            if (value.children) {
              this.rewriteDataTree(value.children)
            }
          }
        })
      },
    }
  }
</script>

<style scoped lang=less>
  @import "btn";
</style>
