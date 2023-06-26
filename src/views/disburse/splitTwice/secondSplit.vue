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
              <a-form-item v-bind="formLayout" label="分摊月份">
                <span style='background:#dddddd;padding: 7px 10px;border-radius: 8px;'>
                  {{form.splitMonth}}
                </span>
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
import { getSchoolList, secSaveSplitRule ,updateSecSplit} from '@/api/education/card'
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
  name:'secondSplit',
  components: {
    IModal
  },
  props: {
    title: {
      type: String,
      default:'总部分摊'
    },
    stuId: String
  },
  data() {
    return {
      splIds:'',
      schoolList: [],
      form:{
        splitMonth:'',
        finSpendingSplits:''
      },
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
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      getSchoolList().then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = this._handleData(res.data)
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
          const { type,schoolIds } = res
          let params = {
            type,schoolIds:schoolIds.join(','),finSpendingSplits:JSON.stringify(this.form.finSpendingSplits)
          }
          let request = secSaveSplitRule
          if(this.splIds){
            params.splIds=this.splIds
            request=updateSecSplit
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
    backindData(record,params) {
      console.log(record,params)
      this.form.splitMonth=record[0].date
      this.form.finSpendingSplits=record
      if(params){
        let formData = {
          type:params.type||'',
          schoolIds:params.finSecondSplits?params.finSecondSplits.map(item=>item.deptId):[]
        }
        this.splIds=params.id
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
      this.form={
        splitMonth:'',
        finSpendingSplits:''
      }
      this.splIds=''
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
