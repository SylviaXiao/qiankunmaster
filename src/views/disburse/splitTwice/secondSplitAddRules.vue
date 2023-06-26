<template>
  <div class="stu-leave-addedit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
      okText='保存'
      :width='800'
    >
      <div>
        <a-form :form="formEdit">
          <a-row :gutter="8">
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="分摊费用归类">
                <a-select  :disabled='disabledSelect' v-decorator="[`feeItemName`, { rules: [{ required: true, message: '请选择分摊费用归类' }] }]" style="width:100%;" showSearch option-filter-prop="children" :filter-option="filterOption">
                  <a-select-option v-for="(item, index) in feeItemList" :key="index" :value="item.feeItemName">{{ item.feeItemName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="分摊校区">
                <a-tree-select
                  style="width:100%"
                  :disabled='disabledSelect'
                  v-decorator="[`splitDeptId`, { rules: [{ required: true, message: '请选择分摊校区' }] }]"
                  placeholder="请选择分摊校区"
                  :allowClear="true"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="listOrgDeptList"
                  :selectFather='true'
                  :showSearch='true'
                  :replaceFields="{ title: 'name',key:'id', value: 'id', children: 'children' }"
                  treeDefaultExpandAll
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="分摊模式">
                <a-radio-group v-decorator="[`type`, { rules: [{ required: true, message: '请选择分摊模式' }] }]" >
                  <a-radio v-for="(item, index) in cityArr" :key="index" :value="item.value">{{ item.string }}
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="选择分摊分馆">
                <a-tree-select
                  style="width:100%"
                  v-decorator="[`schoolIds`, { rules: [{ required: true, message: '请选择分摊分馆' }] }]"
                  placeholder="请选择分摊分馆"
                  :allowClear="true"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="schoolList"
                  :selectFather='true'
                  :treeCheckable='true'
                  treeDefaultExpandAll
                  :multiple="true"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import IModal from '@/components/InnerModal'
import {
  getSchoolList,
  listOrgDept,
  updateSplitRule,
  listFeeItem,
  saveSplitRule,
  saveRule,
  getAllSysFeeItem
} from '@/api/education/card'
const formLayout = {
  labelCol: {
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    sm: {
      span: 16
    }
  }
}
export default {
  name:'secondSplitAddRules',
  components: {
    IModal
  },
  props: {
    title: {
      type: String,
      default:'新增总部规则'
    },
  },
  data() {
    return {
      disabledSelect:false,
      splitRuleId:'',
      finSpendingSplitId:'',
      listOrgDeptList:[],
      feeItemList:[],
      schoolList: [],
      cityArr: [
        {
          string: '总部定向分摊',
          value: 'A'
        },
        {
          string: '区域定向分摊',
          value: 'B'
        },
        {
          string: '总部资源分摊',
          value: 'C'
        },
        {
          string: '区域资源分摊',
          value: 'D'
        }
      ],
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      getSchoolList().then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = this._handleData(res.data)
        }
      })
      listOrgDept().then(res => {
        if (res.code === 200 && res.data) {
          this.listOrgDeptList = res.data
        }
      })
      getAllSysFeeItem({
        type: 'A'
      }).then(res => {
        if (res.code === 200 && res.data) {
          this.feeItemList =res.data
        }
      })
    },
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.deptName
        itemObj.value = item.id
        itemObj.key = item.id
        if (item.children) {
          itemObj.children = this._handleData(item.children)
          itemObj.selectable = true
        }
        return itemObj
      })
    },
    handleAddEditOk() {
      this.validateData()
        .then(res => {
          const { type,schoolIds,splitDeptId ,feeItemName} = res
          let params = {
            type,schoolIds:schoolIds.join(','),splitDeptId,feeItemName
          }
          let request =saveSplitRule
          if(this.splitRuleId){
             request =updateSplitRule
            params.splitRuleId=this.splitRuleId
          }
          if(this.disabledSelect){
            request =saveRule
            params.finSpendingSplitId=this.finSpendingSplitId
          }
          this.confirmAddEditLoading=true
          return request(params)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统提示',
              description: '操作成功'
            })
            this.$emit('refresh')
            this.handleAddEditCancel()
          }
        })
        .finally(() => {
          this.confirmAddEditLoading = false
        })
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    open() {
      this.visibleAddEdit = true
      this.loadSchoolId()
      this.resetForm()
    },
    backindData(params,disabled) {
      console.log(params)
      if(params){
        let schoolIds=''
        if(disabled){
          schoolIds=params.finSecondSplits.map(item=>item.deptId)
          this.disabledSelect=disabled?true:false
          this.finSpendingSplitId=params.id
        }else{
          schoolIds=params.finSecondSplitRuleInfoList.map(item=>item.schoolId)
        }
         let formData ={
            type:params.type,
            schoolIds:schoolIds,
            splitDeptId:params.splitDeptId ,
            feeItemName:params.feeItemName
          }
          this.splitRuleId=params.splitRuleId
        this.$nextTick(() => {

          this.formEdit.setFieldsValue(formData)
        })
      }else{
        this.formEdit.resetFields()
      }

    },
    validateData() {
      return this.formEdit.validateFields()
    },
    resetForm() {
      this.disabledSelect=false
      this.splitRuleId=''
      this.finSpendingSplitId=''
      this.formEdit.resetFields()
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-addedit {
}
</style>
