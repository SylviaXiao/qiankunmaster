<template>
  <a-card :bordered="false">
    <div class="searchGroup"></div>

    <div class="btnGroup" style="margin-bottom: 15px;">
      <perm-box perm="education:dance:save">
        <a-button type="primary" icon="plus-circle" @click.native="openModal()">新增</a-button>
      </perm-box>
    </div>
    <a-table ref="table" :columns="columns" :dataSource="danceList" :pagination="false" rowKey="id">
      <span slot="cerLimit" slot-scope="text, record">
        <perm-box :text="record.cerLimit == 'Y' ? '是' : '否'" perm="education:dance:status">
          <span v-if="record.cerLimit == 'Y'" style="color:#1ba97b;">是</span>
          <span v-else>否</span>
        </perm-box>
        <!--<a-switch @change='changeStatus($event,record)' v-model="record.state=='Y'?true:false"/>-->
      </span>

      <span slot="danceState" slot-scope="text, record">
        <perm-box :text="record.state == 'Y' ? '启用' : '禁用'" perm="education:dance:status">
          <a-switch @change="changeStatus($event, record)" v-model="record.state == 'Y' ? true : false">
            <a-icon type="check" slot="checkedChildren" />
            <a-icon type="close" slot="unCheckedChildren" />
          </a-switch>
        </perm-box>
        <!--<a-switch @change='changeStatus($event,record)' v-model="record.state=='Y'?true:false"/>-->
      </span>

      <span slot="school" slot-scope="text, record">
        <a href="javascript:;">{{ record.state }}</a>
      </span>

      <span slot="action" slot-scope="text, record">
        <perm-box perm="education:dance:save"><a href="javascript:;" @click="openModal(record)">编辑</a></perm-box>
        <perm-box perm="education:dance:del"><a href="javascript:;" @click="remove(record)">删除</a></perm-box>
      </span>
    </a-table>

    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="modalTitle" v-model="modalVisible" okText="保存" cancelText="取消" @ok="sendForm()">
      <a-spin :spinning="spinning">
        <a-form :form="form">
          <!-- 舞种名称 -->
          <a-form-item label="舞种名称" v-bind="formItemLayout">
            <a-input placeholder="请输入舞种名称" v-decorator="['name', { rules: [{ required: true, message: '请输入舞种名称' }] }]" />
          </a-form-item>
          <!-- 是否考级相关 -->
          <a-form-item label="是否考级" v-bind="formItemLayout">
            <a-radio-group v-decorator="['cerLimit', { rules: [{ required: true, message: '请选择是否为考级舞种' }] }]">
              <a-radio value="Y">
                是
              </a-radio>
              <a-radio value="N">
                否
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- 舞种描述 -->
          <a-form-item label="舞种描述" v-bind="formItemLayout">
            <a-textarea
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="请输入舞种描述(100字以内)"
              v-decorator="['desc', { rules: [{ validator: $verify.lenth }] }]"
            />
          </a-form-item>
          <!-- 排序  -->
          <a-form-item label="排序" v-bind="formItemLayout">
            <a-input-number style="width: 90%;" :min="0" :max="999999999" v-decorator="['order']" />
            <a-tooltip>
              <template slot="title">
                数字越大越靠前
              </template>
              <a-icon type="exclamation-circle" style="font-size: 20px;line-height: 40px;float: right;" />
            </a-tooltip>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-card>
</template>

<script>
import { getDanceList, saveDance, removeDance, changeDanceState } from '@/api/education'
import { STable } from '@/components'
import PermBox from '@/components/PermBox'

const columns = [
  {
    title: '舞种名称',
    dataIndex: 'name'
  },
  {
    title: '舞种描述',
    dataIndex: 'desc'
  },
  // {
  //   title: '授权分馆',
  //   dataIndex: 'deptNum',
  //   customRender: text => {
  //     let showText = `${text}个`
  //     return showText
  //   }
  // },
  {
    title: '是否考级',
    dataIndex: 'cerLimit',
    key: 'cerLimit',
    scopedSlots: { customRender: 'cerLimit' }
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'danceState',
    scopedSlots: { customRender: 'danceState' }
  },
  {
    title: '排序',
    dataIndex: 'order',
    key: 'order'
  },
  {
    title: '操作',
    key: 'action',
    width: '200px',
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
  name: 'dance',
  components: {
    STable,
    PermBox
  },
  data() {
    return {
      columns,
      formItemLayout,
      danceList: [],
      tableLoading: false,
      modalVisible: false,
      modalTitle: '舞种信息',
      spinning: false,
      formValues: {}
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.getDanceList()
  },
  methods: {
    getDanceList() {
      getDanceList().then(res => {
        this.danceList = res.data
      })
    },
    openModal(data) {
      data == undefined ? this.add() : this.edit(data)
      this.modalVisible = true
    },
    add() {
      this.modalTitle = '新增舞种'
      this.formValues = {}
      this.form.resetFields()
      this.$nextTick(() => {
        this.form.setFieldsValue({ ['cerLimit']: 'N' })
      })
    },
    edit(data) {
      this.modalTitle = '编辑舞种'
      this.spinning = true
      this.formValues.id = data.id
      this.$nextTick(() => {
        this.form.setFieldsValue({ ['name']: data.name })
        this.form.setFieldsValue({ ['desc']: data.desc })
        this.form.setFieldsValue({ ['cerLimit']: data.cerLimit || 'N' })
        this.form.setFieldsValue({ ['order']: data.order })
        // TODO
        this.spinning = false
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
          removeDance(data.id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.getDanceList()
          })
        }
      })
    },
    sendForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const formValue = Object.assign(this.formValues, values)
          saveDance(formValue).then(res => {
            this.modalVisible = false
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.getDanceList()
          })
        }
      })
    },
    changeStatus(checked, data) {
      // const status = { enabled: checked }
      const _this = this
      if (!checked) {
        this.$confirm({
          title: '系统提示',
          content: '确认禁用该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            _this.changeDanceState(data, checked)
          },
          onCancel() {}
        })
      } else {
        this.changeDanceState(data, checked)
      }
    },
    changeDanceState(data, checked) {
      var params = { state: checked ? 'Y' : 'N' }
      changeDanceState(data.id, params).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.getDanceList()
      })
    }
  }
}
</script>

<style scoped></style>
