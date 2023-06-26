<template>
  <div>
    <a-card class="card" :bordered="false">
      <a-form @submit="handleSubmit" ref="addCourse" :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="课程名称">
              <a-input
                placeholder="请输入课程名称"
                v-decorator="['courseName', { rules: [{ required: true, message: '请输入课程名称', whitespace: true }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="课程类型">
              <a-select
                :allowClear="true"
                placeholder="请选择课程类型"
                v-decorator="['courseType', { rules: [{ required: true, message: '请选择课程类型' }] }]"
              >
                <a-select-option :allowClear="true" value="1">01-基础班</a-select-option>
                <a-select-option :allowClear="true" value="2">02-提高班</a-select-option>
                <a-select-option :allowClear="true" value="3">03-基础班</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="年份">
              <a-input placeholder="请输入年份" v-decorator="['courseYear', { rules: [{ required: true, message: '请输入年份', whitespace: true }] }]" />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="班型">
              <a-select :allowClear="true" placeholder="请选择班型" v-decorator="['courseClassType', { rules: [{ required: true, message: '请选择班型' }] }]">
                <a-select-option :allowClear="true" value="1">基础班</a-select-option>
                <a-select-option :allowClear="true" value="2">提高班</a-select-option>
                <a-select-option :allowClear="true" value="3">一对一</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="计费模式">
              <a-select
                :allowClear="true"
                placeholder="请选择计费模式"
                v-decorator="['courseChargeMode', { rules: [{ required: true, message: '请选择计费模式' }] }]"
              >
                <a-select-option :allowClear="true" value="按次计费">按次计费</a-select-option>
                <a-select-option :allowClear="true" value="按小时计费">按小时计费</a-select-option>
                <a-select-option :allowClear="true" value="按期计费">按期计费</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="单价">
              <a-input placeholder="请输入单价" v-decorator="['coursePrice', { rules: [{ required: true, message: '请输入单价', whitespace: true }] }]" />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="次数">
              <a-input placeholder="请输入次数" v-decorator="['courseNumber', { rules: [{ required: true, message: '请输入次数', whitespace: true }] }]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="描述">
              <a-textarea rows="4" placeholder="请输入描述" v-decorator="['courseDesc', { rules: [{ required: true, message: '请输入目标描述' }] }]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item v-if="showSubmit">
          <a-button htmlType="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="card" title="课程所需物品" :bordered="false">
      <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading">
        <template v-for="(col, i) in ['name', 'workId', 'department']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.key)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">
        新增物品
      </a-button>
    </a-card>
    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 100}px)` : '100%' }">
      <span class="popover-wrapper">
        <a-popover
          title="表单校验信息"
          overlayClassName="antd-pro-pages-forms-style-errorPopover"
          trigger="click"
          :getPopupContainer="trigger => trigger.parentNode"
        >
          <template slot="content">
            <li v-for="item in errors" :key="item.key" @click="scrollToField(item.key)" class="antd-pro-pages-forms-style-errorListItem">
              <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
              <div class="">{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0"> <a-icon type="exclamation-circle" />{{ errors.length }} </span>
        </a-popover>
      </span>
      <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'

const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型'
}
export default {
  name: 'addCourse',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mixin, mixinDevice],

  components: {
    FooterToolBar
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      memberLoading: false,
      // table
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: '25%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '单价',
          dataIndex: 'workId',
          key: 'workId',
          width: '25%',
          scopedSlots: { customRender: 'workId' }
        },
        {
          title: '单位',
          dataIndex: 'department',
          key: 'department',
          width: '25%',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          key: '1',
          name: '舞蹈服',
          workId: '300',
          editable: false,
          department: '套'
        },
        {
          key: '2',
          name: '舞蹈鞋子',
          workId: '130',
          editable: false,
          department: '双'
        }
      ],
      errors: []
    }
  },
  created() {},
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    newMember() {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      })
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow(record) {
      this.memberLoading = true
      const { key, name, workId, department } = record
      if (!name || !workId || !department) {
        this.memberLoading = false
        this.$message.error('请填写完整成员信息。')
        return
      }
      // 模拟网络请求、卡顿 800ms
      new Promise(resolve => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = this.data.filter(item => item.key === key)[0]
        target.editable = false
        target.isNew = false
        this.memberLoading = false
      })
    },
    toggle(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    getRowByKey(key, newData) {
      const data = this.data
      return (newData || data).filter(item => item.key === key)[0]
    },
    cancel(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    // 最终全页面提交
    validate() {
      const {
        $refs: { addCourse },
        $notification
      } = this
      const addCourseForm = new Promise((resolve, reject) => {
        addCourse.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })
      // clean this.errors
      this.errors = []
      Promise.all([addCourseForm])
        .then(values => {
          $notification['error']({
            message: 'Received values of form:',
            description: JSON.stringify(values)
          })
        })
        .catch(() => {
          const errors = Object.assign({}, addCourse.form.getFieldsError())
          const tmp = { ...errors }
          this.errorList(tmp)
        })
    },
    errorList(errors) {
      console.log(errors)
      if (!errors || errors.length === 0) {
        return null
      }
      this.errors = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null
        }

        return {
          key: key,
          message: errors[key][0],
          fieldLabel: fieldLabels[key]
        }
      })
    },
    scrollToField(fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    }
  }
}
</script>

<style scoped lang="less">
.card {
  margin-bottom: 24px;
}
.popover-wrapper {
  /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}
.antd-pro-pages-forms-style-errorIcon {
  user-select: none;
  margin-right: 24px;
  color: #f5222d;
  cursor: pointer;
  i {
    margin-right: 4px;
  }
}
.antd-pro-pages-forms-style-errorListItem {
  padding: 8px 16px;
  list-style: none;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }
  .antd-pro-pages-forms-style-errorIcon {
    float: left;
    margin-top: 4px;
    margin-right: 12px;
    padding-bottom: 22px;
    color: #f5222d;
  }
  .antd-pro-pages-forms-style-errorField {
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
</style>
