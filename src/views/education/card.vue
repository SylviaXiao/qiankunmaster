<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btnGroup">
        <perm-box perm="education:card:save">
          <a-button type="primary" icon="plus-circle" @click.native="openModal('add')">新增</a-button>
        </perm-box>
        <perm-box perm="education:card:grant">
          <a-button type="primary" icon="plus-circle" @click.native="openModal('authorize')">批量授权</a-button>
        </perm-box>
      </div>
      <!-- studentList -->
      <s-table ref="sTable" size="default" :columns="roleColumns" :data="loadData" :rowKey="record => record.id">
        <span slot="state" slot-scope="text, record">
          <perm-box :text="record.state == 'Y' ? '启用' : '禁用'" perm="education:card:status">
            <a-switch @change="type_change($event, record)" :checked="record.state == 'Y'">
              <a-icon type="check" slot="checkedChildren" />
              <a-icon type="close" slot="unCheckedChildren" />
            </a-switch>
          </perm-box>
        </span>

        <span slot="action" slot-scope="text, record">
          <perm-box perm="education:card:grant"><a href="javascript:;" @click="openModal('school', record)">授权</a></perm-box>
          <perm-box perm="education:card:save"><a href="javascript:;" @click="openModal('edit', record)">编辑</a></perm-box>
          <perm-box perm="education:card:del"><a href="javascript:;" @click="remove(record)">删除</a></perm-box>
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
            <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入卡种名' }] }]" />
          </a-form-item>
          <a-form-item label="卡种分类" v-bind="formItemLayout">
            <a-input v-decorator="['cardTypeName', { rules: [{ required: false, message: '请输入卡种分类' }] }]" />
          </a-form-item>
          <!-- 舞种 -->
          <a-form-item label="舞种" v-bind="formItemLayout">
            <a-select :allowClear="true" placeholder="请选择舞种" v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]">
              <a-select-option :allowClear="true" :value="item.id" v-for="item in danceType" v-bind:key="item.index">{{ item.name }} </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 类型 -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="类型" v-bind="formItemLayoutH">
                <a-select
                  :allowClear="true"
                  placeholder="请选择类型"
                  v-decorator="['typeId', { rules: [{ required: true, message: '请选择类型' }] }]"
                  @change="getCardTypeList"
                >
                  <a-select-option :allowClear="true" :value="item.id" v-for="item in typeList" v-bind:key="item.index">{{ item.name }} </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="2"></a-col>
            <a-col :span="10" v-if="isCGB">
              <a-form-item v-bind="formItemLayoutH" label="">
                <a-checkbox :checked="multiClassChecked" @change="handleCheckChange">通班</a-checkbox>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 班型 -->
          <a-form-item label="班型" v-bind="formItemLayout">
            <a-select
              :allowClear="true"
              placeholder="请选择类型后选择班型"
              v-decorator="['cardTypeId', { rules: [{ required: true, message: '请选择类型后选择班型' }] }]"
            >
              <a-select-option :allowClear="true" :value="item.id" v-for="item in classTypeList" v-bind:key="item.index">{{ item.name }} </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 金额 -->
          <a-form-item label="金额" v-bind="formItemLayout">
            <a-input addonAfter="元" v-decorator="['price', { rules: [{ required: false, message: '请输入金额' }, { validator: $verify.isNum }] }]" />
          </a-form-item>
          <!-- 有效期 -->
          <a-form-item label="有效期" v-bind="formItemLayout">
            <a-input addonAfter="天" v-decorator="['validDay', { rules: [{ required: false, message: '请输入有效期' }, { validator: $verify.isNum }] }]" />
          </a-form-item>
          <!-- 上课时长 -->
          <a-form-item label="单节课时" v-bind="formItemLayout">
            <a-input addonAfter="分钟" v-decorator="['duration', { rules: [{ required: true, message: '请输入上课时长' }, { validator: $verify.isNum }] }]" />
          </a-form-item>
          <!-- 数量 -->
          <a-form-item label="可用次数" v-bind="formItemLayout">
            <a-input
              style="width: 90%;"
              placeholder="0表示不限次数"
              v-decorator="['availableCount', { rules: [{ required: false, message: '请输入可用次数' }, { validator: $verify.isNum }] }]"
            />
            <a-tooltip>
              <template slot="title">
                0表示不限次数
              </template>
              <a-icon type="exclamation-circle" style="font-size: 14px;line-height:43px;float: right;margin-left: 8px;" />
            </a-tooltip>
            <!-- <span class="count">注：0表示不限次数</span>-->
          </a-form-item>
          <a-form-item label="基础次数" v-bind="formItemLayout">
            <a-input
              placeholder="请输入基础次数"
              v-decorator="['basicCount', { rules: [{ required: false, message: '请输入基础次数' }, { validator: $verify.isNum }] }]"
            />
          </a-form-item>
          <!-- 类型 -->
          <a-form-item v-bind="formItemLayout" label="类型">
            <a-select :allowClear="true" placeholder="请选择类型" v-decorator="['type']">
              <a-select-option :allowClear="true" :value="item.value" v-for="item in typeOptions" :key="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 是否体验课 -->
          <a-form-item v-bind="formItemLayout" label="卡类型">
            <a-radio-group :options="experienceOptions" v-decorator="['experience', { rules: [{ required: true, message: '请选择是否体验课' }] }]" />
          </a-form-item>
          <!-- 试课卡  -->
          <a-form-item v-bind="formItemLayout" label="试课卡">
            <a-radio-group :options="trialCardOptions" v-decorator="['trialCard', { rules: [{ required: true, message: '请选择是否试课卡' }] }]" />
          </a-form-item>
          <!-- 售卖方式 -->
          <a-form-item label="售卖方式" v-bind="formItemLayout">
            <a-select :allowClear="true" placeholder="请选择售卖方式" v-decorator="['saleMode', { rules: [{ required: true, message: '请选择售卖方式' }] }]">
              <a-select-option :allowClear="true" :value="item.value" v-for="item in saleModeList" :key="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 人群 -->
          <a-form-item label="人群" v-bind="formItemLayout">
            <a-select :allowClear="true" placeholder="请选择人群" v-decorator="['crowdType', { rules: [{ required: true, message: '请选择人群' }] }]">
              <a-select-option :allowClear="true" :value="item.value" v-for="item in crowdTypeList" :key="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 描述 -->
          <a-form-item label="描述" v-bind="formItemLayout">
            <a-input
              v-decorator="['desc', { rules: [{ required: false, message: '请输入描述' }, { validator: $verify.lenth }] }]"
              placeholder="请输入描述(100字以内)"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 授权 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        v-model="modalOptions.schoolModal"
        :title="modalOptions.schoolModalTitle"
        @ok="school_send()"
        okText="提交"
      >
        <template v-if="deptTree.length > 0">
          <a-row>
            <a-col :span="4">
              <div :style="{ position: 'relative', top: '9px' }">授权分馆：</div>
            </a-col>
            <a-col :span="20">
              <a-tree checkable :defaultExpandAll="autoExpandParent" :autoExpandParent="autoExpandParent" v-model="value" :treeData="deptTree" />
            </a-col>
          </a-row>
          <div style="minHeight:50px"></div>
        </template>
      </a-modal>

      <!-- 授权分馆详情 -->
      <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="授权分馆详情" v-model="schoolAuthListModal" width="850px" :footer="null">
        <div class="userList">
          <detail-list v-for="item in schoolAuthList" v-bind:key="item.index" name="item.index">
            <detail-list-item term="地区" name="item.index">{{ item.parentDeptName }}</detail-list-item>
            <detail-list-item term="分馆名" name="item.index">{{ item.deptName }}</detail-list-item>
          </detail-list>
        </div>
      </a-modal>
      <!--批量授权 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        :width="1000"
        v-model="authorizeModal"
        title="批量授权分馆"
        @ok="batchAuthorize"
        @cancel="cancelBatchAuthorize"
        okText="授权"
      >
        <batch-authorize ref="batchAuthorize"></batch-authorize>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'

const SHOW_PARENT = TreeSelect.SHOW_PARENT
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import Modal from 'ant-design-vue/es/modal'
import DetailList from '@/components/tools/DetailList'
import { listEduDance } from '@/api/common'

const DetailListItem = DetailList.Item
import {
  saveEduDeptCard,
  getSchoolList,
  danceList,
  cardTypeList,
  getList,
  editeditById,
  listEduDeptCardById,
  delById,
  isOpen,
  save
} from '@/api/education/card'
import { listEduType, treeEduClassType } from '@/api/common'
import { roleColumns, formItemLayout, formItemLayoutH, rowSelection } from '@/utils/education/card'
import BatchAuthorize from './modules/BatchAuthorize'

export default {
  components: {
    SearchComPro,
    STable,
    DetailList,
    DetailListItem,
    PermBox,
    BatchAuthorize
  },
  data() {
    return {
      //
      authorizeModal: false,
      //
      multiClassChecked: false,
      danceId: '', //舞蹈ID
      typeId: '', //类型id
      schoolAuthListModal: false,
      schoolAuthList: [],
      cardId: '', //卡id
      typeList: [], //卡种类型
      classTypeList: [], //卡种类型
      danceType: [], //舞种类型
      value: [],
      SHOW_PARENT,
      deptTree: [],
      SelectedKey: [],
      selectedRowKeys: [], //点击勾选
      roleColumns,
      formItemLayout,
      formItemLayoutH,
      // table mock 数据
      modalOptions: {
        type_modal: false,
        type_modal_title: '',
        schoolModal: false,
        schoolModalTitle: ''
      },
      formValues: {},
      tableLoading: false,
      isCGB: false,
      typeOptions: [{ label: '单色', value: 'A' }, { label: '优鸽', value: 'B' }],
      experienceOptions: [{ label: '体验卡', value: 1 }, { label: '正式卡', value: 0 }],
      trialCardOptions: [{ label: '是', value: 'Y' }, { label: '否', value: 'N' }],
      saleModeList: [{ label: '通用', value: 0 }, { label: '线上', value: 1 }, { label: '线下', value: 2 }],
      crowdTypeList: [{ label: '成人', value: 'A' }, { label: '少儿', value: 'B' }],
      //重构需要的变量
      searchParams: [
        {
          type: 'text',
          key: 'cardName',
          label: '卡种名称',
          placeholder: '卡种名称'
        },
        {
          type: 'select',
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
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
        },
        {
          type: 'select',
          key: 'type',
          label: '卡类型',
          placeholder: '请选择类型',
          staticArr: [
            {
              string: '单色',
              value: 'A'
            },
            {
              string: '优鸽',
              value: 'B'
            }
          ]
        },
        {
          type: 'text',
          key: 'cardTypeName',
          label: '卡种分类',
          placeholder: '卡种分类'
        },
        {
          type: 'select',
          key: 'trialCard',
          label: '试课卡',
          placeholder: '请选择',
          staticArr: [
            {
              string: '是',
              value: 'Y'
            },
            {
              string: '否',
              value: 'N'
            }
          ]
        },
      ],
      queryParam: null,
      loadData: parameter => {
        return getList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      autoExpandParent: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [],
        onSelection: this.onSelection
      }
    }
  },
  methods: {
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    handleCheckChange(e) {
      this.multiClassChecked = e.target.checked
    },
    // 授权回显
    authorization(data) {
      var _this = this
      listEduDeptCardById(data.id).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          res.data.forEach(item => {
            if (this.value.indexOf(item.deptId) === -1) {
              this.value.push(item.deptId)
            }
          })
        }
      })
    },

    //获得班型
    getCardType() {
      listEduType().then(res => (this.typeList = res.data))
    },
    getCardTypeList(params) {
      this.isCGB = params == 'E'
      this.multiClassChecked = false

      this.$nextTick(() => {
        this.form.setFieldsValue({ ['cardTypeId']: '' })
      })
      cardTypeList({ typeId: params }).then(res => (this.classTypeList = res.data))
    },
    //获得舞种类型
    getDanceType(name) {
      var _this = this
      var params = { name: name }
      danceList(params).then(res => {
        _this.danceType = res.data
      })
    },
    //授权分馆按钮
    school_send() {
      var _this = this
      var params = {}
      const BLACK_LIST = this.deptTree.map(item => item.deptId)
      params.deptIds = this.value.filter(item => !BLACK_LIST.includes(item)).join(',') //舞种数组
      params.cardId = this.cardId //卡id
      saveEduDeptCard(params)
        .then(res => {
          this.modalOptions.schoolModal = false
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          _this._refreshTable()
        })
        .catch(err => {
          console.log(err)
        })
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
    // 按名字查询
    onSearch(data) {
      console.log('onSearch')
    },
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
        // if (parent) {
        //   item.slots = { icon: 'home' }
        // }
        if (item.children && item.children.length > 0) {
          this.setIcon(item.children)
        }
      })
    },
    rewriteDataTree(data) {
      data.forEach((item, index) => {
        if (item.deptType == 'A') {
          item.disabled = false
        }
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
        this.getCardType()
        this.getDanceType()
        this.add()
      } else if (type == 'edit') {
        this.getCardType()
        this.getDanceType()
        this.edit(data)
        this.modalOptions.type_modal = true
      } else if (type == 'school') {
        //先重置
        this.value = []
        this.deptIds = []
        //回显
        this.authorization(data)
        //获取参数准备提交
        this.cardId = data.id //卡id
        //渲染树装结构
        this.schoolList()
        this.modalOptions.schoolModal = true
        this.modalOptions.schoolModalTitle = '授权分馆'
      } else if (type == 'authorize') {
        this.authorizeModal = true
      }
    },
    initFormValues(data = {}) {
      return new Promise((resolve, reject) => {
        this.formValues = {}
        this.form.resetFields()
        this.multiClassChecked = false
        resolve(data)
      })
    },
    add() {
      this.modalOptions.type_modal_title = '新增'
      this.initFormValues().then(() => {
        this.modalOptions.type_modal = true
      })
    },
    getEditInfo(data) {
      return new Promise(resolve => {
        const { id } = data
        editeditById(id).then(res => {
          const result = res.data
          const typeId = result.type.id
          this.getCardTypeList(typeId)
          resolve(result)
        })
      })
    },
    edit(data) {
      var _this = this
      this.modalOptions.type_modal_title = '编辑'
      // editeditById(data.id)
      //   .then(res => {
      //     const result = res.data
      //     this.treeValue = []
      //     _this.danceId = res.data.dance.id//舞ID
      //     _this.typeId = res.data.cardType.id//类型ID
      //     return result
      //   })
      this.initFormValues(data)
        .then(this.getEditInfo)
        .then(result => {
          this.formValues.id = data.id
          let formParams = {
            name: result.card.name,
            cardTypeName: result.card.cardTypeName,
            // danceName: result.dance.name,
            danceId: result.dance.id,
            typeId: result.type.id,
            cardTypeId: result.cardType ? result.cardType.id : '',
            price: result.card.price,
            validDay: result.card.validDay,
            availableCount: result.card.availableCount,
            basicCount: result.card.basicCount,
            type: result.card.type,
            experience: result.card.experience ? 1 : 0,
            trialCard: result.card.trialCard,
            duration: result.card.duration,
            saleMode: result.card.saleMode,
            crowdType: result.card.crowdType,
            desc:result.card.desc

          }
          this.multiClassChecked = result.card.multiClass
          this.$nextTick(() => {
            this.form.setFieldsValue(formParams)
          })
        })
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
        onCancel() {}
      })
    },
    sendForm() {
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          let formValues = Object.assign(this.formValues, values, { multiClass: this.multiClassChecked })
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
    },
    batchAuthorize() {
      this.$refs.batchAuthorize.sendForm().then(res => {
        this.cancelBatchAuthorize()
      })
    },
    cancelBatchAuthorize() {
      this.$refs.batchAuthorize.init()
      this.authorizeModal = false
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.sTable.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '../organize/btn';

.page {
  margin-top: 20px;
}
</style>
