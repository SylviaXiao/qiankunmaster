<template>
  <div>
    <a-card>
      <div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm="workflow:info:save">
          <a-button icon="plus-circle" type="primary" @click="addFlow">新增工作流</a-button>
        </perm-box>
      </div>
      <div class="table_wrapper">
        <a-table :pagination="false" rowKey="workflowId" :columns="columns" :data-source="dataStep" bordered>
          <span slot="action" slot-scope="text, record" style="overflow: hidden;">
            <perm-box perm="workflow:info:save">
              <a href="javascript:;" class="mr15" @click="addItem(record)">创建步骤</a>
              <a href="javascript:;" class="mr15" @click="editItem(record)">修改</a>
            </perm-box>
            <perm-box perm="workflow:info:del">
              <a href="javascript:;" class="mr15" @click="delItem(record)">删除</a>
            </perm-box>
          </span>
          <a-table rowKey="id" slot="expandedRowRender" slot-scope="text" :columns="innerColumns" :data-source="text.steps" :pagination="false">
            <span slot="innerAction" slot-scope="textInner, record">
              <perm-box perm="workflow:info:save">
                <a href="javascript:;" class="mr15" @click="editInnerItem(record, text)">修改</a>
              </perm-box>
              <perm-box perm="workflow:info:del">
                <a href="javascript:;" class="mr15" @click="delInnerItem(record)">删除</a>
              </perm-box>
              <perm-box perm="workflow:param:save">
                <a href="javascript:;" class="mr15" @click="openKeyPop(record)">参数管理</a>
              </perm-box>
            </span>
          </a-table>
        </a-table>
      </div>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="visibleFlow" title="步骤" @ok="sendflowForm()" okText="提交">
      <a-spin :spinning="spinning">
        <a-form :form="flowForm">
          <a-form-item style="display: none">
            <a-input v-decorator="['id']" />
          </a-form-item>
          <a-form-item label="唯一标识" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-input
              v-decorator="[
                'key',
                {
                  rules: [{ required: true, message: '请输入唯一标识' }]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="名称" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-input
              v-decorator="[
                'name',
                {
                  rules: [{ required: true, message: '请输入名称' }]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="备注" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-textarea
              style="width: 100%;"
              placeholder="请输入备注"
              :rows="2"
              v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="visibleStep" title="步骤" @ok="sendStepForm()" okText="提交">
      <a-spin :spinning="spinning">
        <a-form :form="stepFrom">
          <a-form-item style="display: none">
            <a-input v-decorator="['stepId']" />
          </a-form-item>
          <a-form-item label="步骤名称" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-input v-decorator="['stepName', { rules: [{ required: true, message: '请输入' }] }]" />
          </a-form-item>
          <a-form-item label="步骤" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 6 } }">
            <a-input addon-before="第" addon-after="步" :min="1" v-decorator="['stepNum', { rules: [{ required: true, message: '请选择角色' }] }]" />
          </a-form-item>
          <a-form-item label="选择角色" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-select :allowClear="true" v-decorator="['roleId', { rules: [{ required: true, message: '请选择角色' }] }]" placeholder="请选择">
              <a-select-option v-for="(item, index) in roleList" :value="item.roleId" :key="index">{{ item.roleName }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="加签选项" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
            <a-select allowClear v-decorator="['addition']" placeholder="默认">
              <a-select-option value="">默认</a-select-option>
              <a-select-option value="Y">允许加签</a-select-option>
              <a-select-option value="N">不允许加签</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="visibleKey" title="参数管理" @ok="keySubmit()" :confirmLoading="isloading" :width="1200">
      <div style="display:flex;justify-content: space-between;margin-bottom:10px;">
      <div></div>
      <a-button icon="plus-circle" type="primary" @click="add">新增</a-button>
      </div>
      <div class="teacher-info" v-for="(item, index) in keyMsg" :key="index">
        <span class="teacher-form">
          <span style="margin-right: 10px;width:60px;">参数标题</span>
          <a-input v-model="item.label" style="width:150px" />
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;width:60px;">参数Key</span>
          <a-input v-model="item.key"  style="width:150px"   />
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;width:60px;">参数类型</span>
          <a-select  style="width: 100px" v-model="item.type">
              <a-select-option value="input">文本框</a-select-option>
              <a-select-option value="number">数字框</a-select-option>
              <a-select-option value="select">下拉框</a-select-option>
              <a-select-option value="checkbox">复选框</a-select-option>
            </a-select>
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;width:80px;">是否必须</span>
            <a-select  style="width: 65px" v-model="item.required">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
        </span>
        <!-- <span class="teacher-form">
          <span style="margin-right: 10px;width:90px;">是否允许多个</span>
            <a-select  style="width: 65px" v-model="item.multiple">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
        </span> -->
        <span class="teacher-form">
          <span style="margin-right: 10px;width:100px;">是否是加签参数</span>
            <a-select  style="width: 65px" v-model="item.addition">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
        </span>

        <span>
          <!-- <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="keyMsg.length - 1 == index" /> -->
          <a-icon type="minus-circle" class="icon" style="margin: 7px;"  @click.stop="subtract(index)"  />
        </span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import { saveWorkflowStep, saveWorkflow, listWorkflowDetail, delWorkflow, delWorkflowStep, listWorkflowRole,saveWorkflowParams,getWorkflowParams } from '@/api/system'
const columns = [
  {
    title: '名称',
    dataIndex: 'workflowName'
  },
  {
    title: '唯一标识',
    dataIndex: 'workflowKey'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const innerColumns = [
  {
    title: '第几步',
    dataIndex: 'stepNum'
  },
  {
    title: '步骤名称',
    dataIndex: 'stepName'
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
      isloading: false,
      visibleKey: false,
      keyMsg: [
        {
          required: "",
          // multiple:"",
          addition:"",
          key:"",
          label:"",
          type:"",
        }
      ],
      id:"",
    }
  },
  watch:{
    visibleKey(n,o) {
      if(!n) {
        this.id = ""
        this.keyMsg = [
          {
            required: "",
            // multiple:"",
            addition:"",
            key:"",
            label:"",
            type:"",
          }
        ]
      }
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
    this.loadTable()
    this.loadListData()
  },
  methods: {
    reset () {
      this.keyMsg = [
          {
            required: "",
            // multiple:"",
            addition:"",
            key:"",
            label:"",
            type:"",
          }
        ]
    },
    keySubmit () {
      this.isloading = true
      for(let i = 0;i<this.keyMsg.length;i++) {
        let item = this.keyMsg[i]
        for(let key in item) {
          if(item[key]==="") {
            return this.$notification['error']({
                message: '系统通知',
                description: '请先填写完表格'
              })
          }
        }
      }
      saveWorkflowParams({
        stepId:this.id,
        params:JSON.stringify(this.keyMsg)
      }).then(res=>{
        if(res.code === 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.visibleKey = false
          this.loadTable()
        }
      }).finally(this.isloading = false)
    },
    subtract (index) {
      this.keyMsg.splice(index,1)
    },
    add () {
      this.keyMsg.push({
            required: "",
            // multiple:"",
            addition:"",
            key:"",
            label:"",
            type:"",
          })
    },
    //key管理
    openKeyPop (record) {
      this.id = record.stepId
      getWorkflowParams({stepId:record.stepId}).then(res=>{
        if(res.code === 200) {
          if(res.data.length) {
            this.keyMsg = res.data
          }
          this.visibleKey = true
        }
      })
    },
    // 新增角色
    addFlow() {
      this.visibleFlow = true
      this.spinning = true
      this.$nextTick(() => {
        this.flowForm.resetFields()
        this.spinning = false
      })
    },
    sendflowForm() {
      this.flowForm
        .validateFields()
        .then(saveWorkflow)
        .then(() => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.visibleFlow = false
          this.loadTable()
        })
    },
    editItem(record) {
      this.visibleFlow = true
      this.spinning = true
      this.$nextTick(() => {
        this.flowForm.resetFields()
        this.flowForm.setFieldsValue({
          id: record.workflowId,
          key: record.workflowKey,
          name: record.workflowName,
          remark: record.workflowRemark
        })
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
            delWorkflow(record.workflowId).then(res => {
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
      console.log(record)
      this.flowRecord = record
      this.visibleStep = true
      this.$nextTick(() => {
        this.stepFrom.resetFields()
      })
    },
    searchStaff() {
      this.$refs.imodal.open()
    },
    sendStepForm() {
      this.stepFrom.validateFields().then(value => {
        const params = Object.assign({}, value)
        params.workflowId = this.flowRecord.workflowId
        saveWorkflowStep(params).then(() => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.visibleStep = false
          this.loadTable()
        })
      })
    },
    editInnerItem(record, fatherRecord) {
      console.log(record, fatherRecord)
      this.stepRecord = record
      this.flowRecord = fatherRecord
      this.visibleStep = true
      this.spinning = true
      this.$nextTick(() => {
        this.stepFrom.resetFields()
        this.stepFrom.setFieldsValue({
          stepId: record.stepId,
          roleId: record.roleId,
          stepName: record.stepName,
          stepNum: record.stepNum,
          addition: record.addition || ''
        })
        this.spinning = false
      })
    },
    delInnerItem(record) {
      this.$confirm({
        title: '系统提示',
        content: '是否确定删除?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$nextTick().then(() => {
            delWorkflowStep(record.stepId).then(res => {
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
    loadTable() {
      listWorkflowDetail().then(res => {
        this.dataStep = res.data
      })
    },
    loadListData() {
      listWorkflowRole().then(res => {
        this.roleList = res.data
      })
    }
  }
}
</script>

<style lang="less">
.mr15 {
  margin-right: 15px;
}
.table_wrapper {
  width: 800px;
  overflow: hidden;
  .ant-table-expanded-row td > .ant-table-wrapper {
    margin: -13px -6px;
  }
}
.teacher-info {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-bottom: 10px;
    .teacher-form {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin: 0 10px;
      /deep/ .ant-calendar-picker {
        width: 120px;
      }
    }
  }
.icon {
  color: #1890ff;
  font-size: 16px;
}
</style>
