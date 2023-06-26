<template>
  <div class="studentinfo-wrapper">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="资源反馈" :width="800" v-model="stuTagModal">
      <div class="mb20">
        <span>姓名：{{ resourceInfo.userName || '无' }}</span
        ><span style="padding-left:40px;">手机号：{{ resourceInfo.userPhone || '无' }}</span>
      </div>
      <a-form :form="stuTagForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="反馈">
          <a-textarea
            :maxLength="300"
            v-decorator="['feedbackInfo', { rules: [{ required: true, message: '请输入反馈' }] }]"
            placeholder="请输入300字内"
            :rows="5"
          />
        </a-form-item>
      </a-form>
      <div style="    padding: 0 0 0 5px;border-left: 3px solid #1ba97b;margin-bottom: 5px;">反馈记录</div>
      <div>
        <s-table :defaultPagination="true" ref="table" size="default" :columns="columns" :data="loadData"> </s-table>
      </div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="sendForm()">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { stuTagNoPermissionList } from '@/api/system'
import { saveFeedback, listFeedbackByStuUser } from '@/api/intentionStu/adviser'
import { STable } from '@/components'
export default {
  components: { STable },
  data() {
    return {
      columns: [
        {
          title: '反馈内容',
          dataIndex: 'feedbackInfo',
          key: 'feedbackInfo',
          width: 200,
          ellipsis: true,
          scopedSlots: { customRender: 'feedbackInfo' }
        },
        {
          title: '反馈时间',
          dataIndex: 'feedbackDate',
          key: 'feedbackDate',
          customRender: (text, record) => {
            return text
          },
          width: 150
        },
        {
          title: '反馈人',
          dataIndex: 'feedbackUser',
          key: 'feedbackUser',
          width: 100
        }
      ],
      queryParam: {},
      loadData: parameter => {
        return listFeedbackByStuUser(this.resourceInfo.id).then(res => {
          return res
        })
      },
      stuTagModal: false,
      resourceInfo: {},
      loading: false
    }
  },
  beforeCreate() {
    this.stuTagForm = this.$form.createForm(this)
  },
  created() {},
  mounted() {},
  methods: {
    handleInput(val, data, extra) {
      // this.stuTagName = data
    },
    open(data) {
      this.resourceInfo = data
      this._refreshTable()
      this.stuTagModal = true
      this.stuTagForm.resetFields()
    },
    _refreshTable() {
      if (this.$refs.table) this.$refs.table.refresh()
    },
    handleCancel() {
      this.stuTagModal = false
      this.loading = false
    },
    sendForm() {
      const {
        stuTagForm: { validateFields },
        formValues
      } = this
      validateFields((err, values) => {
        if (!err) {
          this.loading = true
          let params = {
            stuId: this.resourceInfo.id,
            orgDept: this.resourceInfo.userDeptId
          }
          saveFeedback(Object.assign(params, values))
            .then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.stuTagModal = false
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';
</style>
