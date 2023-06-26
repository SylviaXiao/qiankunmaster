<template>
  <div class="noPadding">
    <a-row :gutter="8">
      <a-col :span="6">
        <div class="menuHeader" style='position: relative;'>
          <a-button class="addBtn" @click="openModal(undefined,'first')">新增</a-button>
        </div>
        <a-menu
          mode="inline"
          theme="light"
          :defaultSelectedKeys='defaultSelectedKeys'
        >
          <a-menu-item v-for="(item,index) in dicList" style='position: relative;' :key="item.id"
                       @click="getSecondDict">{{item.dictValue}}
            <a-icon type="edit" style="position: absolute;right: 24px;top: 50%;margin-top: -7px;"
                    @click='openModal(item,"first")'/>
            <a-icon type="delete" style="position: absolute;right: 0;top: 50%;margin-top: -7px;" @click='remove(item)'/>
            <!--            <a-tooltip>-->
            <!--              <template slot='title'>-->
            <!--                <a style='margin-right: 15px;'>编辑</a>-->
            <!--                <a>删除</a>-->
            <!--              </template>-->
            <!--              -->
            <!--            </a-tooltip>-->
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col :span="18" class='tableCol'>
        <div class="btnGroup">
          <a-button class="addBtn" @click=openModal()>新增</a-button>
        </div>
        <a-table :columns="columns"
                 :dataSource='secondList'
                 :pagination='false'
                 :loading='tableLoading'
                 rowKey='id'>
            <span slot='action' slot-scope="text, record">
              <a-button class="editBtn" @click="openModal(record)">编辑</a-button>
              <a-button class="deleteBtn" @click="remove(record)">删除</a-button>
            </span>
        </a-table>
      </a-col>
    </a-row>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="modalTitle"
             v-model="dictModal"
             @ok="sendForm()"
             okText='提交'>
      <a-form :form='form'>
        <!-- 字典顺序 -->
        <a-form-item
          label="字典顺序" v-bind="formItemLayout">
          <a-input
            placeholder='请输入字典顺序'
            v-decorator="[
                'dictOrder',
                {rules: [{ required: true, message: '请输入字典顺序' }]}
              ]"
          />
        </a-form-item>
        <!-- 字典名称 -->
        <a-form-item
          label="字典名称" v-bind="formItemLayout">
          <a-input
            placeholder='请输入字典名称'
            v-decorator="[
                'dictValue',
                {rules: [{ required: true, message: '请输入字典名称' }]}
              ]"
          />
        </a-form-item>
        <!-- 字典主键 -->
        <a-form-item
          label="字典主键" v-bind="formItemLayout">
          <a-input
            placeholder='请输入字典主键'

            v-decorator="[
                'dictKey',
                {rules: [{ required: true, message: '请输入字典主键' }]}
              ]"
          />
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>

<script>
  import { getSysDictList, saveSysDict, removeSysDict } from '@/api/organize'

  const columns = [
    {
      title: '顺序',
      dataIndex: 'dictOrder'
    },
    {
      title: '字典名称',
      dataIndex: 'dictValue'
    },
    {
      title: '字典主键',
      dataIndex: 'dictKey'
    },
    {
      title: '创建时间',
      dataIndex: 'createDate'
    },
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
  const fieldNameList = ['dictOrder', 'dictValue', 'dictKey']

  export default {
    name: 'dictionary',
    data() {
      return {
        columns,
        formItemLayout,
        tableLoading: false,
        defaultSelectedKeys: [],
        selectedKey:[],
        dicList: [],
        secondList: [],
        dictModal: false,
        modalTitle: '字典表单',
        formValues: {},
        parentId: '',
        type: '',
        spinning: true
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    created() {
      this.getDefList()
    },
    methods: {
      getDefList() {
        getSysDictList().then(res => {
          this.dicList = res.data
          if (res.data[0] && res.data[0].id) {
            this.getSecondDict(this.formValues.parentId || res.data[0].id)
            this.defaultSelectedKeys.push(this.formValues.parentId || res.data[0].id)
          }
        })
      },
      getSecondDict(item) {
        this.tableLoading = true
        this.formValues.parentId = item.key || item
        this.parentId = item.key || item
        const data = {
          parentId: item.key || item
        }
        getSysDictList(data).then(res => {
          this.secondList = res.data
          this.tableLoading = false
        })
      },
      openModal(data, type) {
        type ? this.type = type : this.type = ''
        if (data) {
          this.edit(data)
        } else {
          this.add()
        }

        this.dictModal = true
      },
      add() {
        this.modalTitle = '新增字典'
        delete this.formValues.id
        fieldNameList.forEach(item => {
          setTimeout(() => {
            this.form.setFieldsValue({ [item]: '' })
          }, 0)
        })
      },
      edit(data) {
        this.formValues.id = data.id
        fieldNameList.forEach(item => {
          setTimeout(() => {
            this.form.setFieldsValue({ [item]: data[item] })
          }, 0)
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
            removeSysDict(data.id).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.getDefList()
            })
          }
        })
      },
      sendForm() {
        const _this = this
        this.form.validateFields((err, values) => {
          if (!err) {
            this.type == 'first' ? delete this.formValues.parentId : this.formValues.parentId = this.parentId
            const data = Object.assign(this.formValues, values)
            saveSysDict(data).then(res => {
              this.dictModal = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.getDefList()
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
  @import "btn";

  .noPadding {
    background-color: #fff;
    border-radius: 4px;
    padding: 0;

    .tableCol {
      border-left: 8px solid #f0f2f5;
    }

    .menuHeader {
      height: 50px;
      line-height: 50px;
      padding-left: 24px;
      border-bottom: 1px solid #dddddd;
      font-size: 16px;
      color: #6f92bc;
    }

    .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
      border-right: 0;
    }
  }

</style>