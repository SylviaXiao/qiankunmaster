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
      :width='1400'
    >
      <div v-if='visibleAddEdit'>
        <div ref="elementSearch">
          <a-card :bordered="false" >
            <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
          </a-card>
        </div>
        <a-card :bordered="false">
          <div class="btnGroup" style="margin-bottom: 15px;text-align: right;" ref="elementBtn">
            <perm-box perm="finance:splrule:save">
              <a-button type="primary" @click="editRules('add')">新增</a-button>
            </perm-box>
            <perm-box perm="finance:splrule:del">
              <a-button class='ml10' type="primary" @click="deleteRules()">删除</a-button>
            </perm-box>
          </div>
            <s-table
              :showSlider="false"
              ref="table"
              size="default"
              :columns="two_solumns"
              :data="loadData"
              :alert="false"
              :rowKey="(record, index) => record.splitRuleId"
              :rowSelection="rowSelection"
            >
          <span slot="finSecondSplitRuleInfoList" slot-scope="text, record">
                  <div v-for='(item ,index) in text' :key='index'>{{item.deptName}}</div>
          </span>
              <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:splrule:update" >
              <a href="javascript:;" @click="editRules('edit',record)" >修改</a>
            </perm-box>
          </span>
            </s-table>
        </a-card>
      </div>
    </a-modal>
    <SecondSplitAddRules ref='SecondSplitAddRules' :title='editTitle'  @refresh='_refreshTable'></SecondSplitAddRules>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { listOrgDept, getAllSysFeeItem, pageSplitRule, getSchoolList ,removeRule} from '@/api/education/card'
import SecondSplitAddRules from './secondSplitAddRules'
const two_solumns = [
  {
    title: '日期',
    dataIndex: 'createDate',
    customRender: (text, record) => {
      return text
    }
  },
  {
    title: '费用归类',
    dataIndex: 'feeItemName',
    ellipsis: true
  },
  {
    title: '分摊校区',
    dataIndex: 'deptName',
  },
  {
    title: '分摊模式',
    dataIndex: 'type',
    customRender: (text, record) => {
      if (text === 'A') {
        return '总部定向分摊'
      } else if (text === 'B') {
        return '区域定向分摊'
      } else if (text === 'C') {
        return '总部资源分摊'
      } else if (text === 'D') {
        return '区域资源分摊'
      }else{
        return ''
      }
    }
  },
  {
    title: '分摊分馆',
    dataIndex: 'finSecondSplitRuleInfoList',
    scopedSlots: { customRender: 'finSecondSplitRuleInfoList' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name:'secondSplitRules',
  components: {
    SearchComPro,
    STable,
    PermBox,
    SecondSplitAddRules
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
      editTitle:'新增总部规则',
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      two_solumns,
      searchParams: [
        {
          type: 'cascader',
          key: 'feeItemName',
          label: '分摊费用归类',
          placeholder: '请输入分摊费用归类',
          search: true,
          treeOps: {
            api: getAllSysFeeItem,
            label: 'feeItemName',
            value: 'feeItemName',
            children: 'children',
            params: {
              type: 'A'
            }
          },
        },
        {
          type: 'cascader',
          key: 'splitDeptId',
          label: '分摊校区',
          placeholder: '请选择分摊校区',
          search: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'key',
            children: 'children'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'type',
          label: '分摊模式',
          placeholder: '请选择分摊模式',
          staticArr: [
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
          ]
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'deptId',
          label: '选择分配分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
      ],
      queryParam: {},
      loadData: parameter => {
        return pageSplitRule(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  beforeCreate() {
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
    }
  },
  methods: {
    editRules(type,record){
      this.editTitle='新增总部规则'
      this.$refs.SecondSplitAddRules.open()
      if(type==='edit'){
        this.editTitle='编辑总部规则'
        this.$refs.SecondSplitAddRules.backindData(record)
      }
    },
    deleteRules(){
      this.examine().then(() => {
        let params ={splitRuleId:this.selectedRowKeys.join(',')}
        this.$confirm({
          title: '系统提示',
          content: '确认要删除吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            removeRule(params).then(() => {
              this.$notification['success']({
                message: '系统通知',
                description: '删除成功'
              })
              this._refreshTable()
            })
          }
        })
      })
    },
    //校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve()
        }
      })
    },
    handleAddEditOk() {
      this.handleAddEditCancel()
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    open() {
      this.queryParam={}
      this.selectedRowKeys = []
      this.selectedRows = []
      this.visibleAddEdit = true
    },
    searchSubmit(data) {
      if (data.splitDeptId) {
        let val1 = data.splitDeptId.split(',')
        data.splitDeptId = val1[val1.length - 1]
      }
      this.queryParam = Object.assign({ orgDeptId: this.queryParam.orgDeptId }, data)
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-addedit {
}
</style>
