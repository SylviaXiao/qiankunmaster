<template>
  <div>
    <a-card>
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle" > 
        <a-tab-pane  :tab="item.name" v-for="item in tabList" :key="item.id">
      <div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm="education:scoreitem:save">
          <a-button icon="plus-circle" type="primary" @click="addFlow">新增评分项</a-button>
        </perm-box>
      </div>
      <div class="table_wrapper">
        <perm-box perm="education:scoreitem:view">
        <a-table :pagination="false" rowKey="id" :columns="columns" :data-source="dataStep" bordered >
          <span slot="action" slot-scope="text, record" style="overflow: hidden;">
            <perm-box perm="education:scoreitem:view">
              <a href="javascript:;" class="mr15" @click="addItem(record)" v-if="!record.parentId">添加子分类</a>
            </perm-box>
            <perm-box perm="education:scoreitem:view">
              <a href="javascript:;" class="mr15" @click="editItem(record)">修改</a>
            </perm-box>
            <perm-box perm="education:scoreitem:del">
              <a href="javascript:;" class="mr15" @click="delItem(record)">删除</a>
            </perm-box>
          </span>
        </a-table>
        </perm-box>
      </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="visibleFlow" title="新增评分项" @ok="sendForm('flowForm')" okText="提交">
      <a-spin :spinning="spinning">
        <a-form :form="flowForm">
          <a-form-item label="评分名称" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-input
              v-decorator="[
                'name',
                {
                  rules: [{ required: true, message: '请输入唯一标识' }]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="分数" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-input-number
              v-decorator="[
                'score',
                {
                  rules: [{ required: true, message: '请输入分数' }]
                }
              ]"
            />分
          </a-form-item>
          <a-form-item label="展示样式" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }" v-if="formShow">
              <a-select  style="width: 120px" 
              v-decorator="[
                'showType',
                {
                  rules: [{ required: true, message: '请选择展示样式' }]
                }
              ]">
                <a-select-option value="A">横板</a-select-option>
                <a-select-option value="B">竖版</a-select-option>
              </a-select>
          </a-form-item>
          <a-form-item label="角色" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }" v-if="formShow">
            <a-select
              :allowClear="true"
              mode="multiple"
              placeholder="请选择职位类型后显示"
              v-decorator="['roleIds', { rules: [{ required: true, message: '请选择角色' }] }]"
            >
              <a-select-option :value="role.id" v-for="(role, roleIdx) in roleList" :key="roleIdx">{{ role.roleName }} </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="详情" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }" v-if="formShow">
            <a-input
              type="textarea"
              style="width: 100%;"
              placeholder="请输入详情"
              :maxLength="300"
              v-decorator="['detail', { rules: [{ required: false, message: '请输入备注' }] }]"
            />
          </a-form-item>
          <a-form-item label="排序" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }" >
            <a-input-number
              v-decorator="[
                'order',
                {
                  rules: [{ required: true, message: '请输入分数' }]
                }
              ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="visibleStep" title="添加子分类" @ok="sendForm('stepFrom')" okText="提交">
      <a-spin :spinning="spinning">
        <a-form :form="stepFrom">
          <a-form-item style="display: none">
            <a-input v-decorator="['stepId']" />
          </a-form-item>
          <a-form-item label="名称" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }] }]" />
          </a-form-item>
          <a-form-item label="分数" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 6 } }">
            <a-input-number
              v-decorator="[
                'score',
                {
                  rules: [{ required: true, message: '请输入分数' }]
                }
              ]"
            />分
          </a-form-item>
          <a-form-item label="排序" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }" >
            <a-input-number
              v-decorator="[
                'order',
                {
                  rules: [{ required: true, message: '请输入分数' }]
                }
              ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import { listScoreItem,removeScoreItem,saveScoreItem,getScoreItem } from '@/api/system'
import {  listOrgRoleNew } from '@/api/organize'
import {  listEduDance } from '@/api/common'
const columns = [
  {
    title: '评分名称',
    dataIndex: 'name',
    width:200,
    ellipsis:true
  },
  {
    title: '分数',
    dataIndex: 'score',
    width:80,
  },
  {
    title: '展示样式',
    dataIndex: 'showType',
    width:80,
    customRender: (text, record) => {
      return text === 'A'
        ? '横板'
        : text === 'B'
        ? '竖版'
        : ''
    },
  },
  {
    title: '角色',
    dataIndex: 'roleIds',
    ellipsis:true,
    width:200,
    customRender: (text, record) => {
      let val = []
      if( record.scoreItemRole ) {
        record.scoreItemRole.forEach(item=>{
          val.push(item.roleName)
        })
      }
      return val.join(',')
    },
    // width:200,
  },
  {
    title: '详情',
    dataIndex: 'detail',
    ellipsis:true
  },
  {
    title: '排序',
    dataIndex: 'order',
    width:60,
  },
  {
    title: '操作',
    key: 'action',
    width:200,
    scopedSlots: { customRender: 'action' }
  }
]
const innerColumns = [
  {
    title: '',
    dataIndex: 'name',
    width:175,

  },
  {
    title: '',
    dataIndex: 'score',
    width:110,
  },
  {
    title: '',
    dataIndex: 'showType',
    customRender: (text, record) => {
      return text === 'A'
        ? '横板'
        : text === 'B'
        ? '竖版'
        : ''
    },
    width:110,
  },
  {
    title: '',
    dataIndex: 'detail',
  },

  {
    title: '操作',
    key: 'innerAction',
    scopedSlots: { customRender: 'innerAction' }
  }
]
export default {
  data() {
    return {
      visibleFlow: false,
      visibleStep: false,
      spinning: false,
      columns,
      innerColumns,
      roleList: [],
      dataStep: [],
      parentId: null,
      id: null,
      formShow: true,
      tabList: [

      ],
      selectKey: null
    }
  },
  components: {
    PermBox
  },
  beforeCreate() {
    this.flowForm = this.$form.createForm(this)
    this.stepFrom = this.$form.createForm(this)
  },
  mounted() {
    this.loadTable(true)
  },
  methods: {
    selectKeyHandle(e) {
      this.selectKey = e
      this.loadList()
    },
    resetForm(form) {
      form.resetFields()
      this.parentId = null
      this.id = null 
    },
    // 新增角色
    addFlow() {
      this.visibleFlow = true
      this.spinning = true
      this.$nextTick(() => {
        this.resetForm(this.flowForm)
        this.getlistOrgRoleNew()
        // this.spinning = false
      })
    },
    sendForm(formName) {
      this[formName]
        .validateFields()
        .then(fields=>{
          console.log(fields)
          saveScoreItem({
            detail: fields.detail || null,
            id: this.id || null,
            name: fields.name,
            parentId: this.parentId || null,
            score: fields.score,
            showType: fields.showType || null,
            order: fields.order,
            roleIds:  fields.roleIds?fields.roleIds.join(','): null,
            danceId:this.selectKey
          }).then(res => {
          if(res.code == 200) {
              this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.visibleFlow = false
            this.visibleStep = false
            this.loadTable()
          }
        })
        })
    },
    editItem(record) {
      if(record.parentId) {
        this.formShow = false
      }else {
        this.formShow = true
      }
      this.visibleFlow = true
      this.spinning = true
      this.$nextTick(() => {
        this.resetForm(this.flowForm)
        getScoreItem({scoreItemId:record.id}).then(res=>{
          let scoreItemRole = res.data.roles.map(item=> item.id)
          this.flowForm.setFieldsValue({
            score: res.data.scoreItem.score,
            showType: res.data.scoreItem.showType,
            name: res.data.scoreItem.name,
            detail: res.data.scoreItem.detail,
            order: res.data.scoreItem.order,
            roleIds: scoreItemRole,
            danceId:this.selectKey
          })
          this.id = res.data.scoreItem.id
          this.parentId = res.data.scoreItem.parentId
          this.getlistOrgRoleNew()
        })
      })
    },
    //角色授权
    getlistOrgRoleNew() {
      listOrgRoleNew().then(res => {
            this.roleList = res.data
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
            removeScoreItem(record.id).then(res => {
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
      this.formShow = true
      this.visibleStep = true
      this.$nextTick(() => {
        this.resetForm(this.stepFrom)
        this.parentId = record.id
      })
    },
    searchStaff() {
      this.$refs.imodal.open()
    },

    loadTable(type) {
      listEduDance().then(res=>{
        this.tabList = res.data
        if(type) {

          this.selectKey = res.data[0].id
        }
        this.loadList(this.selectKey)
      })
    },
    loadList() {
        listScoreItem({danceId:this.selectKey}).then(res => {
          this.dataStep = res.data
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
  overflow: hidden;
  .ant-table-expanded-row td > .ant-table-wrapper {
    margin: -13px -6px;
  }
}
</style>
