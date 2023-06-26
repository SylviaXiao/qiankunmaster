<template>
  <div class="studentinfo-wrapper">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="打标签" v-model="stuTagModal" @ok="sendForm()" okText="提交">
      <a-form :form="stuTagForm">
        <a-form-item label="标签" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }">
          <a-tree-select
            style="width: 100%"
            :show-search="true"
            treeNodeFilterProp="title"
            placeholder="请选择标签"
            treeDefaultExpandAll
            :allowClear="true"
            :multiple="true"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="tagList"
            @change="handleInput"
            v-decorator="['tagIds', { rules: [{ required: true, message: '请选择标签' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { stuTagNoPermissionList } from '@/api/system'
import { stuUserSetTag } from '@/api/intentionStu/adviser'
export default {
  components: {},
  data() {
    return {
      stuTagModal: false,
      tagList: [],
      formValues: { userIds: '' },
      mutiple: false
    }
  },
  beforeCreate() {
    this.stuTagForm = this.$form.createForm(this)
  },
  created() {},
  mounted() {},
  methods: {
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.tagName
        itemObj.value = item.id
        itemObj.key = item.id
        // if (item.tagList) {
        //   itemObj.children = this._handleData(item.tagList)
        //   if (item.tagList.length > 0) itemObj.selectable = false
        // }
        return itemObj
      })
    },
    handleInput(val, data, extra) {
      // this.stuTagName = data
    },
    open(data) {
      if (data) {
        // this.formValues.userIds = data.map(item => item.id).join(',')
        console.log(data)
      }
      stuTagNoPermissionList().then(res => (this.tagList = this._handleData(res.data)))

      this.stuTagModal = true
      const {
        $nextTick,
        stuTagForm: { setFieldsValue }
      } = this
      this.$nextTick(() => {
        setFieldsValue({ tagIds: [] })
      })
    },
    sendForm() {
      const {
        stuTagForm: { validateFields },
        formValues
      } = this
      if (this.mutiple) {
        validateFields((err, values) => {
          if (!err) {
            const data = Object.assign(formValues, { tagIds: values.tagIds.join(',') })
            stuUserSetTag(data)
              .then(res => {
                this.stuTagModal = false
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
              })
              .finally(() => {
                this.$emit('refresh')
              })
          }
        })
      } else {
        let stuTagForm = this.stuTagForm.getFieldsValue()
        let tagList = this.tagList.filter(item => stuTagForm.tagIds.includes(item.value))
        this.$emit('getBackData', tagList)
        this.stuTagModal = false
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';
</style>
