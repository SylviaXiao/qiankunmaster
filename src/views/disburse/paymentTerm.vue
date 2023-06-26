<template>
  <div>


      <!-- <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card> -->

      <a-card :bordered="false">
        <div class="btnClass">
          <perm-box perm="system:incomeitem:save">
            <a-button type="primary" icon="plus-circle" @click.native="openModal()">新增收支项</a-button>
          </perm-box>
        </div>
        <perm-box perm="system:incomeitem:view">
            <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false" :rowKey="(record,index)=>index">
              <span slot="action" slot-scope="text, record">
              <perm-box perm="system:incomeitem:save" >
                <a href="javascript:;" @click="openModal(record)" v-if="!record.defaultItem">修改</a>
              </perm-box>
              <perm-box perm="system:incomeitem:del">
                <a href="javascript:;" @click="delect(record)" v-if="!record.defaultItem">删除</a>
              </perm-box>
            </span>
            </s-table>
        </perm-box>
      </a-card>
    <!-- 编辑 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        :title="title"
        v-model="modal"
        width="1100px"
        okText="保存"
        cancelText="取消"
        @ok="submit"
        :confirmLoading="isloading"
      >
      <div class="teacher-info" v-for="(item, index) in terms" :key="index">
        <span class="teacher-form">
          <span style="width:90px;">添加收支项</span>
          <a-input v-model="item.incItem" style="width:200px" />
        </span>
        <span class="teacher-form">
          <span class="teacher-form">
            <span style="width:80px;">收支类型</span>
              <a-select  style="width: 100px" v-model="item.incType">
                <a-select-option value="B">支出</a-select-option>
                <a-select-option value="A">收入</a-select-option>
              </a-select>
          </span>
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">排序</span>
          <a-input-number v-model="item.incOrder"  style="width:60px"   />
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">描述</span>
          <a-input v-model="item.incDesc" style="width:200px" />
        </span>
        <span>
          <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="terms.length - 1 == index && title==='新增收支项'" />
          <a-icon type="minus-circle" class="icon" style="margin: 7px;"  @click.stop="subtract(index)" v-if="terms.length !== 1 && title==='新增收支项'" />
        </span>
      </div>
      </a-modal>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { pageListIncomeItem,saveIncomeItem,removeIncomeItem,changeIncomeItem} from '@/api/education/card'
const columns = [
  {
    title: '收支项',
    dataIndex: 'incItem',
    key: 'incItem',
    scopedSlots: { customRender: 'incItem' }
  },
  {
    title: '收支类型',
    dataIndex: 'danceName',
    customRender: (text, record) => {
      const { incType } = record
      if(incType==='A') {
        return '收入'
      }else if (incType === 'B') {
        return '支出'
        
      }
    },
  },
  {
    title: '排序',
    dataIndex: 'incOrder'
  },
  {
    title: '描述',
    dataIndex: 'incDesc'
  },
  {
    title: '操作人',
    dataIndex: 'finCardStatus',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      columns,
      searchParams: [
        {
          type: 'text',
          key: 'userNo',
          label: '工号',
          placeholder: '请输入工号'
        },
        {
          type: 'text',
          key: 'userName',
          label: '用户名称',
          placeholder: '请输入用户名称'
        },
        {
          type: 'select', // 静态select框
          key: 'userState',
          label: '在职/离职',
          placeholder: '请选择在职状态',
          staticArr: [
            {
              string: '在职',
              value: 'Y'
            },
            {
              string: '离职',
              value: 'N'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'userOfficial',
          label: '人员类型',
          placeholder: '请选择正式状态',
          staticArr: [
            {
              string: '正式',
              value: 'A'
            },
            {
              string: '试用',
              value: 'B'
            },
            {
              string: '兼职',
              value: 'C'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'userLoginState',
          label: '允许登录',
          placeholder: '请选择',
          staticArr: [
            {
              string: '允许',
              value: 'Y'
            },
            {
              string: '禁止',
              value: 'N'
            }
          ],
          
        }
      ],
      loadData: parameter => {
          return pageListIncomeItem(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        },
      queryParam: {},
      title: null,
      modal: false,
      isloading: false,
      terms: [
        {
          incItem: null,
          incType: null,
          incOrder: null,
          incDesc: null
        }
      ],
    }
  },
  components: {
    STable,
    SearchComPro,
    PermBox,
  },
  watch: {
    modal (n,o) {
      if(!n)  {
        this.terms= [
          {
            incItem: null,
            incType: null,
            incOrder: null,
            incDesc: null
          }
        ]
      }
    }
  },
  methods: {
    delect (record) {
      const { $confirm, $notification, _refreshTable } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeIncomeItem(record.id)
            .then(res => {
              $notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            })
            .finally(() => _refreshTable())
        }
      })
    },
    subtract (index) {
      this.terms.splice(index,1)
    },
    add () {
      this.terms.push({
            incItem: null,
            incType: null,
            incOrder: null,
            incDesc: null
          })
    },
    submit () {
      
      for(let i = 0;i < this.terms.length;i++) {
            for(let key in this.terms[i]) {
              console.log(this.terms[i])
              if((key!== 'incOrder' && key!== 'incDesc') && !this.terms[i][key]) {
                return this.$notification['error']({
                  message: '系统通知',
                  description: '请先填写完整表格'
                })
              }
            }
          }
          this.isloading = true
          if(this.title === '新增收支项') {
          saveIncomeItem({incomeItems:JSON.stringify(this.terms)}).then(res=>{
            if(res.code === 200) {
              this._refreshTable()
              this.modal = false
             this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
            }
          }).finally(this.isloading = false)
      } else {
        changeIncomeItem({
          id:this.id,
          incItem:this.terms[0].incItem,
          incOrder:this.terms[0].incOrder,
          incType:this.terms[0].incType,
          incDesc:this.terms[0].incDesc
        }).then(res=>{
            if(res.code === 200) {
              this.modal = false
              this._refreshTable()
              this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
            }
          }).finally(this.isloading = false)
      }
    },
    openModal (record) {
      if(record) {
        this.id = record.id
        this.terms[0].incItem = record.incItem
        this.terms[0].incOrder = record.incOrder
        this.terms[0].incType = record.incType
        this.terms[0].incDesc = record.incDesc
        this.title = '修改收支项'
      }else {
        this.title = '新增收支项'
      }
      this.modal = true
    },
    //搜索功能
    searchSubmit(data) {
      this.queryParam = Object.assign({ orgDeptId: this.queryParam.orgDeptId }, data)
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    changeTable(e) {
      if(e.key === 1) {
        this._refreshTable()
      }else {
        this._refreshTable()
      }
    },
  },
}
</script>
<style lang="less" scoped>
/deep/ .ant-menu .ant-menu-vertical .ant-menu-root .ant-menu-light {
  width: auto!important;
}
.belongs-teacher-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .teacher-info {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-bottom: 10px;
    .teacher-form {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin: 0 10px;
      /deep/ .ant-calendar-picker {
        width: 120px;
      }
    }
  }
.icon {
  color: #1890ff;
  font-size: 16px;
}
.btnClass {
  margin-bottom: 10px;
}
</style>