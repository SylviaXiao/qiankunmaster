<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btnClass"></div>
      <!-- studentList -->

      <s-table ref="sTable" size="default" :columns="roleColumns" :data="loadData" :rowKey="record => record.id">
        <span slot="state" slot-scope="text, record">
          <perm-box :text="record.stateDept == 'Y' ? '启用' : '禁用'" perm="education:deptcard:status">
            <a-switch @change="type_change($event, record)" v-model="record.stateDept == 'Y' ? true : false">
              <a-icon type="check" slot="checkedChildren" />
              <a-icon type="close" slot="unCheckedChildren" />
            </a-switch>
          </perm-box>
        </span>

        <span slot="action" slot-scope="text, record">
          <perm-box perm="education:deptcard:save">
            <a href="javascript:;" @click="openModal('edit', record)">编辑</a>
          </perm-box>
        </span>
      </s-table>

      <!-- 新增模板页 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        v-model="modalOptions.type_modal"
        :title="modalOptions.type_modal_title"
        @ok="sendForm()"
        okText="提交"
      >
        <a-form :form="form">
          <!-- 卡种名称 -->
          <a-form-item label="卡种名称" v-bind="formItemLayout">
            <a-input :disabled="true" v-decorator="['cardName', { rules: [{ required: true, message: '请输入卡种名' }] }]" />
          </a-form-item>
          <!-- 金额 -->
          <a-form-item label="金额" v-bind="formItemLayout">
            <a-input addonAfter="元" v-decorator="['deptPrice', { rules: [{ required: false, message: '请输入金额' }, { validator: this.$verify.isNum }] }]" />
          </a-form-item>
          <!-- 有效期 -->
          <a-form-item label="有效期" v-bind="formItemLayout">
            <a-input addonAfter="天" :disabled="true" v-decorator="['validDay', { rules: [{ required: false, message: '请输入类型姓名' }] }]" />
          </a-form-item>
          <!-- 数量 -->
          <a-form-item label="可使用次数" v-bind="formItemLayout">
            <a-input :disabled="true" v-decorator="['availableCount', { rules: [{ required: false, message: '请输入描述' }] }]" />
            <span class="count">注：0表示不限次数</span>
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 新增分馆 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        v-model="modalOptions.schoolModal"
        :title="modalOptions.schoolModalTitle"
        @ok="school_send()"
        okText="提交"
      >
        <template>
          <span>授权分馆：</span>
          <a-tree-select
            style="width: 300px"
            :treeData="deptTree"
            :value="value"
            @change="onChange"
            treeCheckable
            :showCheckedStrategy="SHOW_PARENT"
            searchPlaceholder="Please select"
          />
          <div style="height:260px"></div>
        </template>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
const SHOW_PARENT = ''
import QS from 'qs'
import { listEduDance, treeEduClassType } from '@/api/common'
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { axios } from '@/utils/request'

const api = {
  getList: '/education/deptcard/pageDeptCard', //条数
  getListQuery: '/education/common/pageDeptCard', //搜索条数
  edit: '/education/deptcard/getDeptCardById', //编辑
  delById: '/education/card/removeEduCard', //删除
  isOpen: '/education/deptcard/enableDeptCard', //是否启用
  save: '/education/deptcard/saveDeptCard', //保存
  getSchoolList: '/education/card/listOrgDept', //获得分馆
  cardTypeList: '/education/type/listEduCalssType', //卡种类型列表
  danceList: '/education/dance/listEduDance', //舞蹈列表
  saveEduDeptCard: '/education/card/saveEduDeptCard' //授权分馆
}
//分馆
const treeData = []

import { constants } from 'crypto'

//授权分馆
export function saveEduDeptCard(params) {
  return axios({
    url: `${api.saveEduDeptCard}/${params.cardId}/${params.deptIds}`,
    method: 'get',
    params: params
  })
}

// 获得分馆

export function getSchoolList(params) {
  return axios({
    url: api.getSchoolList,
    method: 'get',
    params: params
  })
}

//获得条目
export function getList(params) {
  return axios({
    url: `${api.getList}`,
    method: 'get',
    params: params
  })
}

//搜索时候
export function getListQuery(params) {
  return axios({
    url: `${api.getListQuery}`,
    method: 'get',
    params: params
  })
}

// 编辑
export function editeditById(params) {
  return axios({
    url: `${api.edit}/${params}`,
    method: 'get'
  })
}

//删除
export function delById(params) {
  return axios({
    url: `${api.delById}/${params}`,
    method: 'get'
  })
}

//是否启用
export function isOpen(params) {
  return axios({
    url: `${api.isOpen}/${params.id}`,
    method: 'post',
    params: params
  })
}

// 保存
export function save(params) {
  return axios({
    url: `${api.save}?deptPrice=${params.deptPrice}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

//table遍历数组
const roleColumns = [
  {
    title: '分馆',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName',
    slots: { title: '舞种' },
    scopedSlots: { customRender: 'danceName' }
  },
  {
    title: '班型',
    dataIndex: 'edtName',
    key: 'edtName'
  },
  {
    title: '人群',
    dataIndex: 'crowdType',
    key: 'crowdType',
    customRender: (text, record) => {
      return text === 'B' ? '少儿' : text === 'A' ? '成人' : text === 'C' ? '通用' : ''
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '单色' : text === 'B' ? '优鸽' : ''
    }
  },
  {
    title: '卡类型',
    dataIndex: 'experience',
    key: 'experience',
    customRender: (text, record) => {
      return text ? '体验卡' : '正式卡'
    }
  },
  {
    title: '售卖方式',
    dataIndex: 'saleMode',
    key: 'saleMode',
    customRender: (text, record) => {
      return text == 0 ? '通用' : text == 1 ? '线上' : text == 2 ? '线下' : ''
    }
  },
  {
    title: '金额(元)',
    dataIndex: 'deptPrice',
    key: 'deptPrice'
  },
  {
    title: '有效期(天)',
    dataIndex: 'validDay',
    key: 'validDay'
  },
  {
    title: '单节课时(分)',
    dataIndex: 'duration',
    key: 'duration'
  },
  {
    title: '可用次数',
    dataIndex: 'availableCount',
    key: 'availableCount'
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    key: 'action',
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

export default {
  name: 'schoolCard',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
      queryParam: {},
      loadData: parameter => {
        return getList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      searchParams: [
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'cardName',
          label: '卡种名称',
          placeholder: '请输入卡种名称'
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          label: '舞种',
          placeholder: '请选舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'cascader', //树形选择框
          key: 'classTypeId',
          label: '班型',
          placeholder: '请选择班型',
          treeOps: {
            api: treeEduClassType,
            type: '',
            label: 'name',
            value: 'id',
            children: 'children'
          }
        }
      ],

      danceId: '', //舞蹈ID
      typeId: '', //类型id
      cardId: '', //卡id
      cardType: [], //卡种类型
      danceType: [], //舞种类型
      value: '',
      SHOW_PARENT,
      deptTree: [],
      SelectedKey: [],
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData,
      modal1Visible: false, //弹框
      offical: false,
      tryStu: 'true',
      selectedRowKeys: [], //点击勾选
      roleColumns,
      formItemLayout,
      // table mock 数据
      studentList: [],
      dataArr: [{ key: 'type_name', type_name: '教练班', type_status: '' }],
      modalOptions: {
        type_modal: false,
        type_modal_title: '',
        schoolModal: false,
        schoolModalTitle: ''
      },
      formValues: {},
      tableLoading: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },

  methods: {
    searchSubmit(data) {
      console.log(data)
      this.queryParam = data
      this._refreshTable()
    },

    //授权分馆
    school_send() {
      var _this = this
      var params = {}
      var deptIds = this.value
      params.deptIds = deptIds.join('%2C') //舞种数组
      params.cardId = this.cardId //卡id
      saveEduDeptCard(params).then(res => {
        this.modalOptions.schoolModal = false
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        _this._refreshTable()
      })
    },
    // 选择树
    onChange(value) {
      this.value = value
    },
    //   school树
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    // 启用
    type_change(checked, record) {
      var _this = this
      _this.status = `${checked}`
      if (_this.status == 'true') {
        _this.state = 'Y'
      } else {
        _this.state = 'N'
      }
      if (!checked) {
        this.$confirm({
          title: '系统提示',
          content: '确认禁用该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            var params = { id: record.id, state: checked ? 'Y' : 'N' }
            isOpen(params).then(res => {
              _this.modalOptions.stuModal = false
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this._refreshTable()
            })
          }
        })
      } else {
        var params = { id: record.id, state: checked ? 'Y' : 'N' }
        isOpen(params).then(res => {
          _this.modalOptions.stuModal = false
          _this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          _this._refreshTable()
        })
      }
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    fetch(params = {}) {},

    //勾选
    // 勾选取id
    onSelectChange(selectedRowKeys, data) {
      var _this = this
      this.selectedRowKeys = selectedRowKeys
      if (data.length) {
        if (data[0].hasOwnProperty('auditionType')) {
          _this.isListen = data[0].auditionType
        }
      }
    },
    // 回写tree
    setIcon(data, parent) {
      data.forEach(item => {
        if (item.deptType == 'A') {
          item.slots = { icon: 'environment' }
        } else if (item.deptType == 'S') {
          item.slots = { icon: 'home' }
        } else {
          item.slots = { icon: 'cluster' }
        }
        if (item.children && item.children.length > 0) {
          this.setIcon(item.children)
        }
      })
    },
    rewriteDataTree(data) {
      data.forEach((item, index) => {
        if (item.title && item.key && item.value) {
          return false
        }
        item.title = item.deptName
        item.key = item.id
        item.value = item.id
        if (item.children && item.children.length > 0) {
          this.rewriteDataTree(item.children)
        }
      })
    },

    // 分馆列表
    schoolList() {
      var _this = this
      getSchoolList().then(res => {
        this.rewriteDataTree(res.data)
        this.setIcon(res.data)
        this.deptTree = res.data
        this.SelectedKey.push(res.data[0].id)
      })
    },
    // 打开新增表单
    openModal(type, data) {
      if (type == 'add') {
        this.add()
      } else if (type == 'edit') {
        this.record = data
        this.edit(data)
        this.modalOptions.type_modal = true
      } else {
        this.cardId = data.id //卡id
        this.school(data)
        this.schoolList()
        this.modalOptions.schoolModal = true
        this.modalOptions.schoolModalTitle = '授权分馆'
      }
    },
    school(data) {},
    add() {
      this.formValues = {}
      this.modalOptions.type_modal_title = '新增'
      this.form.resetFields()
      this.modalOptions.type_modal = true
    },
    edit(data) {
      this.formValues.id = data.id
      this.modalOptions.type_modal_title = '卡种编辑'
      editeditById(data.id)
        .then(res => {
          const result = res.data
          this.treeValue = []
          // console.log(res, 'j')
          for (var k in data) {
            this.form.setFieldsValue({ [k]: data[k] })
          }
          return result
        })
        .then(result => {
          var fa_result = result.eduCard
          for (var k in result.eduCard) {
            if (k == 'eduCardType') {
              this.form.setFieldsValue({ edtName: fa_result[k].name })
            }
            if (k == 'eduDance') {
              this.form.setFieldsValue({ danceName: fa_result[k].name })
            } else {
              this.form.setFieldsValue({ [k]: fa_result[k] })
            }
          }
        })
        .then(res => {})
    },
    remove(data) {
      var _this = this
      Modal.confirm({
        title: '警告',
        content: `是否删除?`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          delById(data.id).then(res => {
            _this.modalOptions.stuModal = false
            _this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            _this._refreshTable()
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    _refreshTable() {
      this.$refs.sTable.refresh()
    },
    sendForm() {
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          let formValues = {}
          formValues = Object.assign(this.formValues, values)
          if (_this.danceId != '') {
            formValues.danceName = _this.danceId
            formValues.cardType = _this.typeId
          }
          save(formValues).then(res => {
            this.modalOptions.type_modal = false
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this._refreshTable()
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../organize/btn';

.page {
  margin-top: 20px;
}

#page {
  position: relative;
}
</style>
