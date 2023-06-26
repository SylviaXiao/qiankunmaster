<template>
  <div class="classType-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro
        :style="{ padding: '10px 0' }"
        @searchSubmit="searchSubmit"
        :searchParams="searchParams"
      ></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="table-wrapper">
        <div class="btn-group">
          <perm-box perm="education:classtype:save">
            <a-button icon="plus-circle" type="primary" @click="saveClassType()">新增</a-button>
          </perm-box>
        </div>
        <perm-box perm="education:classtype:view">
          <s-table ref="table" :columns="roleColumns" :data="loadData" rowKey="id">
            <span slot="state" slot-scope="text, record">
              <perm-box :text="record.state == 'Y' ? '启用' : '禁用'" perm="education:classtype:status">
                <a-switch @change="changeStatus($event, record)" v-model="record.state == 'Y' ? true : false">
                  <a-icon type="check" slot="checkedChildren" />
                  <a-icon type="close" slot="unCheckedChildren" />
                </a-switch>
              </perm-box>
            </span>
            <span slot="action" slot-scope="text, record">
              <perm-box perm="education:classtype:save">
                <a href="javascript:;" @click="saveClassType(record)">编辑</a>
              </perm-box>
              <perm-box perm="education:classtype:del">
                <a href="javascript:;" @click="removeClassType(record)">删除</a>
              </perm-box>
            </span>
          </s-table>
        </perm-box>
      </div>
    </a-card>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      v-model="saveModalVisible"
      :title="modalName"
      @ok="sendForm()"
      okText="提交"
    >
      <a-spin :spinning="spinning">
        <a-form :form="classTypeForm">
          <!-- 类型名称 -->
          <a-form-item label="类型" v-bind="formItemLayout">
            <a-select
              :allowClear="true"
              placeholder="请选择类型"
              v-decorator="['typeId', { rules: [{ required: true, message: '请选择类型' }] }]"
            >
              <a-select-option
                :allowClear="true"
                :value="type.id"
                v-for="(type, typeIndex) in typeList"
                :key="typeIndex"
              >
                {{ `${type.name} ` }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 班型型名称 -->
          <a-form-item label="班型名称" v-bind="formItemLayout">
            <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入班型名称' }] }]" />
          </a-form-item>
          <!-- 描述 -->
          <a-form-item label="描述" v-bind="formItemLayout">
            <a-input
              placeholder="请输入描述 (100字以内)"
              v-decorator="['desc', { rules: [{ validator: $verify.lenth }] }]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { pageEduClassType, removeEduClassType, enableClassType, saveEduClassType, listEduType } from '@/api/education'
import { listEduType as listEduTypeCommon } from '@/api/common'

const roleColumns = [
  {
    title: '班型名称',
    dataIndex: 'name',
    key: 'name',
    width: '25%'
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    key: 'typeName',
    width: '25%'
  },
  {
    title: '备注',
    dataIndex: 'desc',
    key: 'desc',
    width: '25%'
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    slots: { title: '状态' },
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'classType',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
      roleColumns,
      formItemLayout: this.$tools.formItemLayout,
      queryParam: {},
      loadData: parameter => {
        return pageEduClassType(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      saveModalVisible: false,
      modalName: '班型信息',
      typeList: [],
      initialValue: null,
      spinning: false,
      formValues: {},
      //搜索
      searchParams: [
        {
          type: 'text',
          key: 'classTypeName',
          label: '班型名称',
          placeholder: '请输入班型名称'
        },
        {
          type: 'select', //动态select框
          key: 'classTypeId',
          label: '类型',
          placeholder: '请选择班级类型',
          apiOption: {
            api: listEduTypeCommon, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        }
      ]
    }
  },
  beforeCreate() {
    this.classTypeForm = this.$form.createForm(this)
  },
  created() {},
  methods: {
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    saveClassType(data) {
      !data ? this.addClassType() : this.editClassType(data)
    },
    initClassTypeFrom() {
      return new Promise((resolve, reject) => {
        this.formValues = {}
        this.classTypeForm.resetFields()
        resolve()
      })
    },
    getTypeList() {
      return new Promise((resolve, reject) => {
        listEduType()
          .then(res => {
            this.typeList = res.data
            this.initialValue = res.data[0].id
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    addClassType() {
      this.modalName = '新增班型'
      this.initClassTypeFrom()
        .then(this.getTypeList)
        .then(() => {
          this.saveModalVisible = true
        })
    },
    editClassType(data) {
      const { id } = data
      this.spinning = true
      this.modalName = '编辑班型'
      this.initClassTypeFrom()
        .then(this.getTypeList)
        .then(() => {
          this.formValues.id = id
          setTimeout(() => {
            this.classTypeForm.setFieldsValue({ ['name']: data.name })
            this.classTypeForm.setFieldsValue({ ['desc']: data.desc })
            this.classTypeForm.setFieldsValue({ ['typeId']: data.typeId })
          }, 0)
          this.saveModalVisible = true
          this.spinning = false
        })
    },
    removeClassType(data) {
      const _this = this,
        { id } = data
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeEduClassType(id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.$refs.table.refresh()
          })
        }
      })
    },
    changeStatus(checked, data) {
      const _this = this
      if (!checked) {
        this.$confirm({
          title: '系统提示',
          content: '确认禁用该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            _this.changeClassTypeState(data, checked)
          },
          onCancel() {}
        })
      } else {
        this.changeClassTypeState(data, checked)
      }
    },
    changeClassTypeState(data, checked) {
      var params = { state: checked ? 'Y' : 'N' }
      enableClassType(data.id, params).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.$refs.table.refresh()
      })
    },
    sendForm() {
      this.classTypeForm.validateFields((err, values) => {
        if (!err) {
          let formValues = Object.assign(values, this.formValues) || {}
          saveEduClassType(formValues).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '提交成功'
            })
            this.saveModalVisible = false
            this.$refs.table.refresh()
          })
        }
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.classType-wrapper {
  .search-card {
    margin: 20px 0;

    .search-group {
    }
  }

  .table-wrapper {
    .btn-group {
      margin-bottom: 20px;
    }
  }
}
</style>
