<template>
  <div class="classType-wrapper">
    <a-card :bordered="false">
      <div class="table-wrapper">
        <div class="btn-group">
          <perm-box perm="education:renewal:save">
            <a-button icon="plus-circle" type="primary" @click="saveClassType()">新增</a-button>
          </perm-box>
        </div>
        <perm-box perm="education:renewal:view">
          <s-table ref="table" :columns="roleColumns" :data="loadData" rowKey="id">
            <span slot="action" slot-scope="text, record">
              <perm-box perm="education:renewal:save">
                <a href="javascript:;" @click="saveClassType(record)">编辑</a>
              </perm-box>
              <perm-box perm="education:renewal:del">
                <a href="javascript:;" @click="removeClassType(record)">删除</a>
              </perm-box>
            </span>
          </s-table>
        </perm-box>
      </div>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="saveModalVisible" :title="modalName" @ok="sendForm()" okText="提交">
      <a-spin :spinning="spinning">
        <a-form :form="classTypeForm">
          <!-- 类型名称 -->
          <a-form-item label="往期卡卡种分类" v-bind="formItemLayout">
            <a-select
              :allowClear="true"
              placeholder="请选择往期卡卡种分类"
              v-decorator="['lastCardType', { rules: [{ required: true, message: '请选择往期卡卡种分类' }] }]"
            >
              <a-select-option :allowClear="true" :value="type" v-for="(type, typeIndex) in typeList" :key="typeIndex">
                {{ `${type} ` }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 类型名称 -->
          <a-form-item label="续卡卡种分类" v-bind="formItemLayout">
            <a-select
              :allowClear="true"
              placeholder="请选择续卡卡种分类"
              v-decorator="['newCardType', { rules: [{ required: true, message: '请选择续卡卡种分类' }] }]"
            >
              <a-select-option :allowClear="true" :value="type" v-for="(type, typeIndex) in typeList" :key="typeIndex">
                {{ `${type} ` }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 类型名称 -->
          <a-form-item label="续卡分类" v-bind="formItemLayout">
            <a-select
              :allowClear="true"
              placeholder="请选择续卡分类"
              v-decorator="['sysValConfId', { rules: [{ required: true, message: '请选择续卡分类' }] }]"
            >
              <a-select-option :allowClear="true" :value="type.id" v-for="(type, typeIndex) in cardTypeList" :key="typeIndex">
                {{ `${type.name} ` }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 续卡类型 -->
          <a-form-item label="续卡类型" v-bind="formItemLayout">
            <a-select
              :allowClear="true"
              placeholder="请选择续卡类型"
              v-decorator="['sysValTypeConfId', { rules: [{ required: false, message: '请选择续卡类型' }] }]"
            >
              <a-select-option :allowClear="true" :value="type.id" v-for="(type, typeIndex) in typeCateList" :key="typeIndex">
                {{ `${type.name} ` }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 提成比例 -->
          <a-form-item label="提成比例" v-bind="formItemLayout">
            <a-select :allowClear="true" placeholder="请选择提成比例" v-decorator="['commission', { rules: [{ required: false, message: '请选择提成比例' }] }]">
              <a-select-option :allowClear="true" :value="type.value" v-for="(type, typeIndex) in staticArr" :key="typeIndex">
                {{ `${type.string} ` }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import { STable } from '@/components'
import PermBox from '@/components/PermBox'
import { listConfig, removeConfig, enableClassType, saveConfig, listEduCardType, cardNext, cardNextType } from '@/api/education'

const roleColumns = [
  {
    title: '往期卡卡种分类',
    dataIndex: 'lastCardType',
    key: 'lastCardType',
    width: '20%'
  },
  {
    title: '续卡卡种分类',
    dataIndex: 'newCardType',
    key: 'newCardType',
    width: '20%'
  },
  {
    title: '续卡分类',
    dataIndex: 'cardNextName',
    key: 'cardNextName',
    width: '20%'
  },
  {
    title: '续卡类型',
    dataIndex: 'cardNextTypeName',
    key: 'cardNextTypeName',
    width: '20%'
  },
  {
    title: '提成比例',
    dataIndex: 'commission',
    key: 'commission',
    width: '150px'
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const staticArr = [
  {
    string: '2%',
    value: 2
  },
  {
    string: '5%',
    value: 5
  },
  {
    string: '7%',
    value: 7
  }
]
export default {
  name: 'classType',
  components: {
    STable,
    PermBox
  },
  data() {
    return {
      typeCateList: [],
      cardTypeList: [],
      staticArr,
      roleColumns,
      formItemLayout: this.$tools.formItemLayout2,
      queryParam: {},
      loadData: parameter => {
        return listConfig(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      saveModalVisible: false,
      modalName: '班型信息',
      typeList: [],
      spinning: false,
      formValues: {}
    }
  },
  beforeCreate() {
    this.classTypeForm = this.$form.createForm(this)
  },
  created() {},
  methods: {
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
        listEduCardType()
          .then(res => {
            this.typeList = res.data
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getTypeCateList() {
      return new Promise((resolve, reject) => {
        cardNext()
          .then(res => {
            this.typeCateList = res.data
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getCardTypeList() {
      return new Promise((resolve, reject) => {
        cardNextType()
          .then(res => {
            this.cardTypeList = res.data
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
        .then(this.getTypeCateList)
        .then(this.getCardTypeList)
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
        .then(this.getTypeCateList)
        .then(this.getCardTypeList)
        .then(() => {
          this.formValues.id = id
          setTimeout(() => {
            this.classTypeForm.setFieldsValue({ ['lastCardType']: data.lastCardType })
            this.classTypeForm.setFieldsValue({ ['newCardType']: data.newCardType })
            this.classTypeForm.setFieldsValue({ ['sysValConfId']: data.sysValConfId })
            this.classTypeForm.setFieldsValue({ ['sysValTypeConfId']: data.sysValTypeConfId })
            this.classTypeForm.setFieldsValue({ ['commission']: data.commission })
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
          removeConfig(id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.$refs.table.refresh()
          })
        }
      })
    },
    sendForm() {
      this.classTypeForm.validateFields((err, values) => {
        if (!err) {
          let formValues = Object.assign(values, this.formValues) || {}
          saveConfig(formValues).then(res => {
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
