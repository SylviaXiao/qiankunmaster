<template>
  <a-card :bordered="false">
    <div class="btnClass">
      <perm-box perm='organize:dept:save' v-if="!userDefaultId">
        <a-button icon='plus-circle' type="primary" @click="openModal('add')">新增</a-button>
      </perm-box>
    </div>
    <a-table :columns="columns"
             :dataSource="deptList"
             :pagination="false"
             rowKey='id'
             :defaultExpandedRowKeys="defaultExpandedRowKeys"
             :loading="tableLoading">
          <span slot='action' slot-scope="text, record">
            <perm-box perm='organize:dept:save' >
              <a href="javascript:;" @click="openModal('add',text)">新增</a>
            </perm-box>
            <perm-box perm='organize:dept:save' >
              <a href="javascript:;" @click="openModal('edit',text)">编辑</a>
            </perm-box>
            <perm-box perm='organize:dept:del' v-if="!record.children">
              <a href="javascript:;" @click="remove(text)">删除</a>
            </perm-box>
          </span>
    </a-table>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
             v-model="modalOptions.deptModal"
             :title="modalOptions.deptModalTiTle"
             @ok="sendForm()"
             okText="提交"
    >
      <a-form :form='form'>
        <!-- 部门类型 -->
        <a-form-item
          label="类型" v-bind="formItemLayout">
          <a-radio-group :options="deptStatusOptions" v-decorator="[
                'deptType',
                {rules: [{ required: true, message: '请选择类型' }]}
              ]"/>
        </a-form-item>
        <!-- 角色名称 -->
        <a-form-item
          label="上级组织" v-bind="formItemLayout">
          <a-tree-select
            v-model="parentDept"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            treeDefaultExpandAll
            @select="chooseTree"
            disabled
            class="show-disabled"
          >
          </a-tree-select>
        </a-form-item>
        <!-- 部门名称 -->
        <a-form-item
          label="名称" v-bind="formItemLayout">
          <a-input
            v-decorator="[
                'deptName',
                {rules: [{ required: true, message: '请输入名称' }]}
              ]"
          />
        </a-form-item>
        <!-- 归属地 -->
        <a-form-item
          label="归属地" v-bind="formItemLayout">
          <a-input
            v-decorator="['deptArea']"
          />
        </a-form-item>
        <!-- 联系人 -->
        <a-form-item
          label="联系人" v-bind="formItemLayout">
          <a-input
            v-decorator="['deptContact']"
          />
        </a-form-item>
        <!-- 电话号码 -->
        <a-form-item
          label="电话号码" v-bind="formItemLayout">
          <a-input
            v-decorator="['deptTel',{rules:[{validator:this.$verify.isNum}]}]"
          />
        </a-form-item>
        <!-- 部门地址 -->
        <a-form-item
          label="地址" v-bind="formItemLayout">
          <a-input
            v-decorator="['deptAddress']"
          />
        </a-form-item>
        <!-- 备注 -->
        <a-form-item
          label="备注" v-bind="formItemLayout">
          <a-input
            v-decorator="['deptRemake']"
          />
        </a-form-item>

        <!-- 顺序 -->
        <a-form-item
          label="顺序" v-bind="formItemLayout">
          <a-input
            v-decorator="['deptOrder',{rules:[{validator:this.$verify.isNum}]}]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
  import { getDeptTree, saveOrgDept, removeOrgDept, selectTree } from '@/api/organize'
  import PermBox from '@/components/PermBox'
  import Vue from 'vue'

  const treeData = [
    {
      title: 'ERP系统',
      key: '0',
      value: '0',
      children: []
    }
  ]
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'name'
    },
    {
      title: '部门编号',
      dataIndex: 'deptNo'
    },
    {
      title: '联系人',
      dataIndex: 'deptContact'
    },
    {
      title: '联系电话',
      dataIndex: 'deptTel'
    },
    {
      title: '类型',
      dataIndex: 'deptType',
      customRender: text => {
        let showText = ''
        if (text == 'A') {
          showText = '地区'
        } else if (text == 'B') {
          showText = '分馆'
        } else if (text == 'C') {
          showText = '部门'
        } else if (text == 'D') {
          showText = '小组'
        } else {
          showText = ''
        }
        return showText
      }
    },
    {
      title: '归属地',
      dataIndex: 'deptArea'
    },
    {
      title: '操作',
      key: 'action',
      width: '300px',
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
  const addTitle = '新增组织架构'
  const editTitle = '编辑组织架构'
  const fieldNameList = ['deptName', 'deptContact', 'deptTel', 'deptAddress', 'deptRemake', 'deptType', 'deptOrder', 'deptArea']
  const deptStatusOptions = [
    { label: '地区', value: 'A' },
    { label: '分馆', value: 'B' },
    { label: '部门', value: 'C' },
    { label: '小组', value: 'D' },
  ]
  export default {
    name: 'dept',
    components: {
      PermBox
    },
    watch: {
      deptType(nv, ov) {
      }
    },
    data() {
      return {
        columns,
        formItemLayout,
        treeData,
        deptStatusOptions,
        deptList: [],
        modalOptions: {
          deptModal: false,
          deptModalTiTle: ''
        },
        parentDept: '',
        deptType: null,
        formValues: {},
        dataTree: {},
        tableLoading: false,
        userDefaultId: Vue.ls.get('userDefaultId'),
        defaultExpandedRowKeys: [],
        defaultKey: null
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    created() {
      this.getDeptList()
    },
    methods: {
      deptShow(record) {
        const { userDefaultId } = this
        if (!userDefaultId) {
          return true
        } else {
          if (userDefaultId == record.id) {
            this.defaultKey = record.key
            return true
          }
          if (this.defaultKey) {
            return record.key.startsWith(this.defaultKey)
          }
          return true
        }

      },
      getDeptList() {
        this.tableLoading = true
        // selectTree().then(res=>{
        //   this.deptList = res.data
        // })
        selectTree().then(res => {
          this.deptList = res.data
          this.rewriteDataTree(this.deptList)
          if (this.treeData[0].children.length > 0) {
            this.treeData[0].children.length = 0
          }

            this.deptList.forEach(item => {
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
        this.modalOptions.deptModal = true
      },
      deptsIsShow(data) {
        const showId = Vue.ls.get('userDefaultId')
        data.map(item => {
          if (item.id == showId) {
            return true
          }
          if (item.children && item.children.length > 0) {
            this.deptsIsShow(item.children)
          }
        })

      },
      // checkDeptType() {
      //   const { treeData } = this
      //   this.checkUp(treeData).then(type => {
      //     console.log('type', type)
      //   })
      // },
      // checkUp(data, id) {
      //   return new Promise(resolve => {
      //     data.map(item => {
      //       if (id == item.value) {
      //         console.log(id)
      //         resolve(item.deptType)
      //       }
      //       if (item.children && item.children.length > 0) {
      //         this.checkUp(item.children)
      //       }
      //     })
      //   })
      // },
      add(data) {
        this.formValues = {}
        this.modalOptions.deptModalTiTle = addTitle
        this.form.resetFields()
        if (data) {
          this.parentDept = data.id
          this.deptType = data.deptType
          this.formValues.parentDeptId = data.id
        } else {
          this.parentDept = '0'
          this.formValues.parentDeptId = null
        }

      },
      edit(data) {
        this.modalOptions.deptModalTiTle = editTitle
        this.formValues = data
        fieldNameList.forEach(item => {
          this.$nextTick(() => {
            this.form.setFieldsValue({ [item]: data[item] })
          })
        })
        if (data.parentId == null) {
          this.parentDept = '0'
          this.formValues.parentDeptId = null
        } else {
          this.formValues.parentDeptId = data.parentId
          this.parentDept = data.parentId
          this.deptType = data.deptType
        }
      },
      remove(data) {
        const _this = this
        this.$confirm({
          title: '系统提示',
          content: '确认删除该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            removeOrgDept(data.id).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.getDeptList()
            })
          }
        })
      },
      chooseTree(value) {
        if (value == '0') {
          delete this.formValues.parentDeptId
          return false
        }
        // this.checkUp(this.treeData, value).then(res => {
        //   console.log(res)
        // })
        this.formValues.parentDeptId = value
      },
      sendForm() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.formValues = Object.assign(this.formValues, values)
            delete this.formValues.children
            saveOrgDept(this.formValues).then(res => {
              this.modalOptions.deptModal = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.getDeptList()
            })
          }
        })
      },
      setSchools(data) {
        data.map(item => {
          item.isShow = true
          if (item.children && item.children.length > 0) {
            this.setSchools(item.children)
          }
        })
      },
      rewriteDataTree(data) {
        data.forEach((item, index) => {
          if (item.title && item.key && item.value) {
            return false
          }
          if (this.userDefaultId && item.id == this.userDefaultId) {
            // item.isShow = true
            this.defaultExpandedRowKeys.push(item.parentId)
            this.defaultExpandedRowKeys.push(item.id)
            // this.setSchools(item.children)
          }
          item.title = item.name || item.deptName
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
