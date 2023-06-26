<template>
  <div class="stusource-wrapper">
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm="system:stu-tag:save">
          <a-button icon="plus-circle" type="primary" @click="openModal()">新增</a-button>
        </perm-box>
      </div>
      <a-table :columns="columns" :dataSource="stusourceList" :pagination="false" :loading="tableLoading" rowKey="id">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="system:stu-tag:save">
            <a href="javascript:;" @click="openModal(record)">编辑</a>
          </perm-box>
          <perm-box perm="system:stu-tag:del">
            <a href="javascript:;" @click="remove(record)">删除</a>
          </perm-box>
        </span>
      </a-table>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="modalTitle" v-model="stusourceModal" @ok="sendForm()" okText="提交">
      <a-form :form="stusourceForm">
        <a-form-item label="标签分类" :labelCol="{ span: 5 }" :wrapperCol="{ span: 17 }">
          <a-input v-decorator="['tagName', { rules: [{ required: true, message: '请输入标签分类' }] }]" placeholder="请输入标签分类" />
          <!-- <a-select
            mode="tags"
            v-decorator="['tagName', { rules: [{ required: true, message: '请输入/选择标签分类' }] }]"
            style="width: 100%"
            placeholder="请输入/选择标签分类"
            @change="handleChange"
          >
            <a-select-option v-for="i in stusourceList" :key="i.tagName">
              {{ i.tagName }}
            </a-select-option>
          </a-select> -->
        </a-form-item>
        <!-- <a-row>
          <a-col :span="5" style="text-align:right;line-height: 0.4rem;">
            <span
              style="padding-right: 5px;color: rgb(245, 34, 45);font-size: 0.14rem;font-family: SimSun, sans-serif;line-height: 1;transform: translate(20px, 32px);"
              >*</span
            >
            <span>标签名称：</span></a-col
          >
          <a-col :span="17">
            <div v-for="(item, index) in tagNameList" :key="index">
              <a-row>
                <a-col :span="19">
                  <a-form-item label="" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
                    <a-input v-model="item.tagName" placeholder="请输入标签名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-button size="small" style="margin:8px" @click.stop="subtract(index)" v-if="tagNameList.length !== 1" type="primary">删除</a-button>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row> -->
        <!-- <a-button @click="add()" style="margin:0 0 0 20px" size="small" type="primary">添加</a-button> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { stuTagList, stuTagRemove, stuTagSave } from '@/api/system'
import PermBox from '@/components/PermBox'

const columns = [
  {
    title: '标签分类',
    dataIndex: 'tagName'
  },
  // {
  //   title: '标签名称',
  //   dataIndex: 'tagNameList',
  //   customRender: (text, record) => {
  //     let { tagList } = record
  //     return tagList.map(item => item.tagName).join(',')
  //   }
  // },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'stusource',
  components: {
    PermBox
  },
  data() {
    return {
      columns,
      stusourceList: [],
      tableLoading: false,
      formValues: {},
      stusourceModal: false,
      modalTitle: '保存标签',
      tagNameList: [{ tagName: '' }]
    }
  },
  beforeCreate() {
    this.stusourceForm = this.$form.createForm(this)
  },
  created() {
    this.tableLoad()
  },
  methods: {
    handleChange(value) {
      if (value.length > 0) {
        let tagName = [value[value.length - 1]]
        const {
          $nextTick,
          stusourceForm: { setFieldsValue }
        } = this
        let data = this.stusourceList.filter(item => item.tagName == value)[0]
        if (data) this.formValues.id = data.id
        this.$nextTick(() => {
          setFieldsValue({ tagName: tagName })
        })
      }
    },
    tableLoad() {
      this.tableLoading = true
      stuTagList()
        .then(res => (this.stusourceList = res.data))
        .finally(() => (this.tableLoading = false))
    },
    initForm() {
      const {
        stusourceForm: { resetFields }
      } = this
      return new Promise(resolve => {
        resetFields()
        this.formValues = {}
        resolve()
      })
    },
    subtract(index) {
      this.tagNameList.splice(index, 1)
    },
    add() {
      this.tagNameList.push({ tagName: '' })
    },
    openModal(record) {
      if (!record) this.tagNameList = [{ tagName: '' }]
      const { initForm, databack } = this
      this.stusourceModal = true
      initForm().then(() => {
        record ? databack(record) : ''
      })
    },
    databack(record) {
      const {
        $nextTick,
        stusourceForm: { setFieldsValue }
      } = this
      this.formValues.id = record.id
      this.$nextTick(() => {
        this.tagNameList = record.tagList
        setFieldsValue({ tagName: record.tagName })
      })
    },
    remove(record) {
      const { $confirm, $notification, tableLoad } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          stuTagRemove(record.id)
            .then(res => {
              $notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            })
            .finally(() => tableLoad())
        }
      })
    },
    sendForm() {
      const {
        stusourceForm: { validateFields },
        formValues,
        tableLoad
      } = this
      validateFields((err, values) => {
        if (!err) {
          // let flag = true
          // this.tagNameList.forEach(item => {
          //   if (!item.tagName) flag = false
          // })
          // if (!flag) {
          //   this.$notification['error']({
          //     message: '系统通知',
          //     description: '请填写标签名称'
          //   })
          //   return
          // }
          // let tagList = this.tagNameList.map(item => {
          //   if (item.id) {
          //     return { id: item.id, tagName: item.tagName }
          //   } else {
          //     return { tagName: item.tagName }
          //   }
          // })
          // let tagName = Array.isArray(values.tagName) ? values.tagName[0] : values.tagName
          let tagName = values.tagName
          // , tagList: tagList
          const data = Object.assign(formValues, { tagName: tagName })
          stuTagSave(data)
            .then(res => {
              this.stusourceModal = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            })
            .finally(() => tableLoad())
        }
      })
    }
  }
}
</script>

<style scoped></style>
