<template>
  <div class="test-address-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="复制链接"
      :visible="visibleAddEdit"
      :confirmLoading="confirmAddEditLoading"
      :footer="false"
      @cancel="handleAddEditCancel"
    >
      <div>
        <a-row>
          <a-col :span="4"> <div style="text-align: right;line-height: 30px;" class="mr20">所属分馆</div></a-col>
          <a-col :span="13">
            <a-tree-select
              style="width: 100%"
              v-model="schoolId"
              :show-search="true"
              treeNodeFilterProp="title"
              placeholder="请选择分馆"
              treeDefaultExpandAll
              :allowClear="true"
              :multiple="false"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="siteArr"
              @change="handleInput"
            />
          </a-col>
          <a-col :span="4">
            <a-button type="primary" class="ml20" @click.native="handleAddEditOk">确认</a-button>
          </a-col>
        </a-row>
        <a-row style="line-height:30px;" class="mt20" v-if="link">
          <a-col :span="4"> <div style="text-align: right;" class="mr20">链接</div></a-col>
          <a-col :span="20">
            {{ link }}
            <a href="#" class="ml20" @click="copy(link)">复制</a>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getSchoolList } from '@/api/education/card'
import { formLayout, formBigLayout } from '../certificate'
export default {
  props: {
    record: Object,
    isResiger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLayout,
      formBigLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      // 考点集合
      siteArr: [],
      schoolId: '',
      link: ''
    }
  },
  components: {},
  created() {},
  methods: {
    copy(record) {
      let url = record
      this.$copyText(url)
        .then(message => {
          this.$message.success('复制完毕')
        })
        .catch(err => {
          this.$message.error('复制失败')
        })
    },
    openModal() {
      this.link = ''
      this.visibleAddEdit = true
      this.initForm()
    },

    handleAddEditOk() {
      if (!this.schoolId) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请先选择分馆!'
        })
      }
      this.link = window.location.origin + `/user/certficateApply/${this.record.id}/${this.schoolId}`
    },
    handleAddEditCancel() {
      // 重置表单数据
      this.resetForm()
      this.visibleAddEdit = false
    },
    initForm() {
      getSchoolList()
        .then(res => {
          if (res.code === 200) {
            let data = res.data
            this._handleTreeData(data, 'deptName', 'id', 'deptName', 'id')
            this.siteArr = data
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 重置表单数据
      this.resetForm()
    },
    onTreeSearch(inputValue, path) {
      if (path.data.props['deptName']) {
        return path.data.props['deptName'].indexOf(inputValue) > -1
      } else {
        return path.data.props['deptName'].indexOf(inputValue) > -1
      }
    },
    _handleTreeData(data, type1, type2, type3, type4) {
      data.forEach((item, index) => {
        item.title = item[type1] || ''
        item.value = item[type2]
        item.key = item[type2]
        if (item.children && item.children.length > 0) {
          item.selectable = false
          item.disabled = true
          this._handleTreeData(item.children, type3, type4, type3, type4)
        }
      })
    },
    handleInput(val) {
      console.log(val)
    },
    resetForm() {
      let that = this
      this.$nextTick(() => {
        that.schoolId = ''
      })
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.test-address-wrapper {
}
:global {
  .dynamic-add {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
