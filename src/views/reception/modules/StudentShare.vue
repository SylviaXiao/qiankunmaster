<template>
  <div class="studentShare">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="共享" :visible="showShare" @cancel="handleShareCancel" @ok="handleShareOk">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="请选择分馆：" prop="orgDeptIds">
          <a-tree-select
            class="ml20"
            style="width: 100%"
            v-model="form.orgDeptIds"
            :show-search="option.search"
            treeNodeFilterProp="title"
            :placeholder="option.placeholder"
            treeDefaultExpandAll
            :allowClear="option.allowClear"
            :multiple="option.multiple"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="deptTree"
          />
        </a-form-model-item>
      </a-form-model>

      <span> </span>
    </a-modal>
  </div>
</template>
<script>
import { getSchoolList, batchAssociateSchool } from '@/api/education/card.js'
import Vue from 'vue'
export default {
  props: {
    studentId: {
      type: String,
      default: ''
    },
    showShare: {
      type: Boolean,
      default: false
    }
  },
  name: 'studentShare',
  components: {},
  data() {
    return {
      userSchoolId: null,
      rules: {
        orgDeptIds: [{ required: true, message: '请选择分馆', trigger: 'change' }]
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      form: {
        orgDeptIds: []
      },
      option: {
        placeholder: `请选择分馆`,
        search: true,
        string: this.label,
        key: 'costType',
        allowClear: true,
        disabled: true,
        multiple: true,
        apiOption: {
          api: getSchoolList, // promise类型的接口
          string: 'name',
          value: 'id',
          childString: 'name',
          childValue: 'id'
        }
      },
      deptTree: [], //所有分馆列表
      innerValue: ''
    }
  },
  created() {},
  computed: {},
  methods: {
    handleShareCancel() {
      this.$emit('handleShareCancel')
    },
    handleShareOk() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          batchAssociateSchool({ studentId: this.studentId, orgDeptIds: this.form.orgDeptIds.join(',') }).then(res => {
            if (res.code == 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.$emit('handleShareCancel')
            }
          })
        } else {
          return false
        }
      })
    },
    onTreeSearch(inputValue, path) {
      let { string, childString } = this.option.apiOption
      if (path.data.props[string]) {
        return path.data.props[string].indexOf(inputValue) > -1
      } else {
        return path.data.props[childString].indexOf(inputValue) > -1
      }
    },
    initTreeData() {
      const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
      if (userSchoolId && userSchoolId.length > 0) {
        this.userSchoolId = userSchoolId[0].id
      }
      let { api, params, string, value, childString, childValue } = this.option.apiOption
      api(params ? params : {}).then(res => {
        if ((res.code === 200 || res.code === '200') && res.data) {
          this._handleTreeData(res.data, string, value, childString, childValue)
          this.deptTree = res.data
        }
      })
    },
    _handleTreeData(data, type1, type2, type3, type4) {
      data.forEach((item, index) => {
        item.title = item[type1] || ''
        item.value = item[type2]
        item.key = item[type2]
        if (item.id == this.userSchoolId) {
          item.selectable = false
          item.disabled = true
        }
        if (item.children && item.children.length > 0) {
          if (this.option.disabled) {
            item.selectable = false
            item.disabled = true
          }
          this._handleTreeData(item.children, type3, type4, type3, type4)
        }
      })
    }
  },
  watch: {}
}
</script>
<style lang="less" scoped>
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
/deep/.ant-select-disabled .ant-select-selection {
  background: #f5f7fa;
  color: #c0c4cc;
  border: 0.01rem solid #f5f7fa;
}
</style>
