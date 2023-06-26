<template>
  <div class="stu-leave-addedit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
    >
      <div>
        <a-form :form="formEdit">
          <a-row>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 10 } }" label="负责人">
                <template v-if="hideName">{{ imodalValue.financeName || '' }}</template>
                <template v-else>
                  <a-input-search
                    v-decorator="[`finance`, { rules: [{ required: true, message: '请选择地区' }] }]"
                    placeholder="点右侧图标选择"
                    style="width: 100%"
                    @search="orgUserClick(`finance`)"
                  />
                </template>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <template v-if="deptTree.length > 0">
                <a-row>
                  <a-col :span="4">
                    <div :style="{ position: 'relative', top: '9px' }">授权分馆：</div>
                  </a-col>
                  <a-col :span="20" v-if="getSelested">
                    <!-- <a-tree :defaultExpandAll="true" :checkable="true" :autoExpandParent="true" v-model="treeValue" :treeData="deptTree" /> -->
                    <a-tree
                      :defaultExpandAll="true"
                      @select="onSelect"
                      :multiple="true"
                      :autoExpandParent="true"
                      :default-selected-keys="treeValue"
                      :treeData="deptTree"
                    />
                  </a-col>
                </a-row>
                <div style="minHeight:50px"></div>
              </template>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
    <i-modal ref="imodal" :multiple="false" :userType="userType" @getBackData="getUserBack"> </i-modal>
  </div>
</template>
<script>
import { saveFinUserAllocation, finUserAllocation } from '@/api/organize'
import { getSchoolList } from '@/api/education/card'
import { listDept } from '@/api/common'
import { formLayout } from '../organizeConst'
import IModal from '@/components/InnerModal'
export default {
  components: {
    IModal
  },
  props: {
    title: {
      type: String,
      default: '学员请假'
    },
    stuId: String
  },
  data() {
    return {
      getSelested: false,
      userType: 'finance',
      imodalValue: {},
      cityArr: [],
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      // 选择分馆
      deptTree: [],
      treeValue: [],
      hideName: false // 隐藏修改人的搜索按钮
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    onSelect(selectedKeys, info) {
      this.treeValue = selectedKeys
    },
    handleAddEditOk(openId) {
      this.validateData()
        .then(res => {
          const { eduDanceId } = res
          let params = {
            orgUserId: this.imodalValue.financeId,
            orgDeptIds: this.treeValue.join(',')
          }
          return saveFinUserAllocation(params)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统提示',
              description: '已操作成功'
            })
            this.refreshTable()
            this.handleAddEditCancel()
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.confirmAddEditLoading = false
        })
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
      this.getSelested = false
    },
    open() {
      this.visibleAddEdit = true
      this.resetForm()
      this.initForm()
    },
    backindData(record) {
      this.hideName = true
      finUserAllocation(record.orgUserId).then(res => {
        this.treeValue = res.data.map(item => item.schoolId)
        this.getSelested = true
      })
      this.imodalValue = {
        financeId: record.orgUserId,
        financeName: record.userName
      }
      this.$nextTick(() => {
        this.formEdit.setFieldsValue({
          finance: record.userName
        })
      })
    },
    orgUserClick(type) {
      this.userType = type
      this.$refs.imodal.open()
    },
    getUserBack(data, type) {
      const { name, id } = data
      this.imodalValue[`${type}Name`] = name
      this.imodalValue[`${type}Id`] = id
      this.formEdit.setFieldsValue({ [type]: name })
    },
    openSelect() {
      this.getSelested = true
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    schoolList() {
      var _this = this
      listDept().then(res => {
        this.rewriteDataTree(res.data)
        this.deptTree = res.data
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
    initForm() {
      this.hideName = false
      this.treeValue = []
      this.schoolList()
    },
    resetForm() {
      this.id = ''
      this.userType = 'all'
      this.formEdit.resetFields()
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less"></style>
