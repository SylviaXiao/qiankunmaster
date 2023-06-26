<template>
  <div class="choose-tea-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="选择借还款人"
      :width="1000"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
    >
      <div class="search-group" @keyup.13="searchTable" tabindex="1">
        <a-form :form="searchForm" >
          <a-row>
            <a-col :lg="10" :md="10" :sm="24">
              <a-form-item label="借还款人信息" v-bind="itemLayout">
                <a-input :placeholder="'借还款人名称/联系电话'" v-decorator="['name']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="6" :sm="24">
              <a-form-item>
                <span>
                  <a-button @click="searchTable">查询</a-button>
                </span>
                <span style="margin-left:5px;">
                  <a-button @click="resetSearch">重置</a-button>
                </span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-wrapper">
        <s-table
          ref="table"
          :columns="columns"
          :data="tableLoad"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: checkBox?'checkbox':'radio' }"
          :rowKey="(record,index)=>index"
          v-if="visible"
        >
        </s-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getALLDeptSchools } from '@/api/organize'
import STable from '@/components/Table'
import Vue from 'vue'
import { getUsersInDept,getUserList } from '@/api/common'
// import { pageStudent, listEduDance,pageStudentInvoice,getUserList,pageClassCardLog } from '@/api/common'

const itemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 17 },
    sm: { span: 17 }
  }
}
const columns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '联系电话',
    dataIndex: 'userTel',
    key: 'userTel'
  }
]
export default {
  name: 'ChooseBorrower',
  props: {
    //是否开启多选
    checkBox: {
      type: Boolean,
      default: false
    },
    classId: {
      type: String,
      default: ''
    },
    studIds: {
      type: Array,
      default: ()=>[]
    }

  },
  components: {
    STable
  },
  data() {
    return {
      //modal
      deptList: JSON.parse(Vue.ls.get('userSchoolId')),
      defValue: Vue.ls.get('userDefaultId'),
      visible: false,
      confirmLoading: false,
      itemLayout,
      columns,
      queryParam: {},
      userTypeData: 'all',
      tableLoad: parameter => {
        return getUsersInDept(this.userTypeData, Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      danceList: [],
      // defaultDept: Vue.ls.get('userDefaultId'),
      // deptList: []
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
  },
  mounted () {
    //删除地区
    if( this.noArea ) {
      let index = this.columns.findIndex( item => item.title === '地区' )
      if( Number(index) >= 0 ) {
        this.columns.splice(index,1)
      }
    }
  },
  created() {
    this.queryParam.deptId = this.defValue
  },
  methods: {
    open() {
      this.visible = true
      this.$nextTick(() => {
        this.init()
        this.selectedRowKeys = []
        this.dataRefesh()
      })
    },
    init() {
      // this.changeOtherDept(false)
    },
    dataRefesh() {
      this.queryParam.deptId = this.defValue
      this.$nextTick(() => {
        this.searchForm.resetFields()
      })
      // if (this.$refs.table) {
      //   console.log(this.showed)
      //   this.$refs.table.refresh()
      // }
    },
    handleOk() {
      if (this.selectedRows.length == 0) {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择一条数据'
        })
      } else {

        const backData = {
          id: this.selectedRows[0].id,
          userName: this.selectedRows[0].userName,
          // userTel: this.selectedRows[0].stuPhone,
          // price: this.selectedRows[0].financePrice
        }
        if(!this.checkBox) {
          this.$emit('getBackData', backData)
        }else {
          this.$emit('getBackData', this.selectedRows)
        }
        this.visible = false
      }
    },
    close() {
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    searchTable() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          this.selectedRowKeys = []
          this.$refs.table.refresh()
        }
      })
    },
    resetSearch() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    //选择回显
    getSelect (res) {
      console.log(this.studIds)
      if(this.studIds) {
        let indexArr = []
        this.studIds.forEach(item=>{
          res.data.forEach(todo=>{
            if(item === todo.stuId) {
              let inx = res.data.findIndex(todo=>{ 
                return todo.stuId === item})
                indexArr.push(inx)
            }
          })
        })
        this.selectedRowKeys = indexArr
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // changeDepts(data) {
    //   console.log(data);
    //   this.queryParam.deptId = data
    // },
    // changeOtherDept(check) {
    //   if (check && check.target && check.target.checked) {
    //     getALLDeptSchools().then(res => {
    //       let params = { id: '', deptName: '全部' }
    //       res.data.unshift(params)
    //       this.deptList = res.data
    //     })
    //   } else {
    //     this.deptList = JSON.parse(Vue.ls.get('userSchoolId'))
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.search-group {
  outline: none;
}

</style>
