<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btnClass">
        <perm-box perm="finance:borrow:save">
          <a-button type="primary" icon="plus-circle" @click.native="openModal()">借/还款录入</a-button>
        </perm-box>
      </div>
      <perm-box perm="finance:borrow:view">
        <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false" :rowKey="(record, index) => index">
          <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:borrow:update">
              <a href="javascript:;" @click="openModal(record)">修改</a>
            </perm-box>
            <perm-box perm="finance:borrow:del">
              <a href="javascript:;" @click="delect(record)">删除</a>
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
      width="900px"
      okText="保存"
      cancelText="取消"
      @ok="submit"
      :confirmLoading="isloading"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="借/还款日期：" prop="date">
              <a-date-picker placeholder="请选择借/还款日期" style="width: 100%" v-model="form.date" @change="changeDate(form.date)" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="借还款人" required>
              <a-input placeholder="请选择借还款人" style="color: #000;" disabled v-model="form.name">
                <a-icon slot="addonAfter" type="search" class="search-input-searchIcon" @click="openSelectModal" />
              </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="部门/分馆：" prop="deptId">
              <!-- <a-tree-select
              style="min-width:120px;"
              v-model="form.deptId"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="schoolList"
              treeDefaultExpandAll
              @change="deptChange(form.deptId)"
            /> -->
              <a-cascader
                @change="deptChange(form.deptId)"
                style="width:100%;"
                :options="schoolList"
                :showSearch="true"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                changeOnSelect
                v-model="form.deptId"
                placeholder="请选择部门/分馆"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="借还款银行账户" prop="bankNo">
              <a-select
                v-model="form.bankNo"
                style="width:100%;"
                @focus="focusAccount(form.deptId)"
                showSearch
                option-filter-prop="children"
                :filter-option="filterOption"
              >
                <a-select-option v-for="(item, index) in bankNos" :key="index" :value="item.id">{{ item.bankNo }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="类型" prop="type">
              <a-select v-model="form.type" style="width:100%;">
                <a-select-option value="C">借款</a-select-option>
                <a-select-option value="D">还款</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="借还款金额" prop="total">
              <a-input-number v-model="form.total" :min="1"></a-input-number>&nbsp;元
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { md: { span: 4 } }, wrapperCol: { md: { span: 16 } } }" label="备注">
              <a-input type="textarea" v-model="form.remark"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <ChooseBorrower ref="ChooseBorrower" @getBackData="getBackData" />
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import ChooseBorrower from '@/components/ChooseBorrower/ChooseBorrower'
import PermBox from '@/components/PermBox'
import { listOrgDept, getBankList, pageListBorrow, removeBnk, saveBorrow, getFinBorrowById, updateBorrow } from '@/api/education/card'
const defaultLayout = {
  labelCol: { md: { span: 8 } },
  wrapperCol: { md: { span: 16 } }
}
const columns = [
  {
    title: '借/还款日期',
    dataIndex: 'date',
    key: 'date',
    scopedSlots: { customRender: 'date' },
    customRender: (text, record) => {
      return record.date.split(' ')[0]
    }
  },
  {
    title: '部门/分馆',
    dataIndex: 'deptName',
    customRender: (text, record) => {
      const { deptName, parentDeptName, deptNameInto, parentDeptNameInto } = record
      if (deptName) {
        return parentDeptName + '-' + deptName
      } else {
        return parentDeptNameInto + '-' + deptNameInto
      }
    }
  },
  {
    title: '借还款人',
    dataIndex: 'userNameBorrow'
  },
  {
    title: '借还款账户',
    dataIndex: 'bankNo',
    customRender: (text, record) => {
      const { bankNoInto, bankNo } = record
      if (bankNo) {
        return bankNo
      } else {
        return bankNoInto
      }
    }
  },
  {
    title: '金额',
    dataIndex: 'price',
    customRender: (text, record) => {
      const { intoPrice, price } = record
      if (price) {
        return price
      } else {
        return intoPrice
      }
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: (text, record) => {
      const { incType } = record
      if (incType === 'C') {
        return '借款'
      } else if (incType === 'D') {
        return '还款'
      }
    }
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作人',
    dataIndex: 'userName'
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
      defaultLayout,
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'cascader',
          key: 'outDeptKey',
          label: '部门/分馆',
          placeholder: '请选择部门/分馆',
          search: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'key',
            children: 'children'
          }
        },
        {
          type: 'select', //动态select框
          key: 'bankId',
          label: '银行账户',
          placeholder: '请选择银行账户',
          search: true,
          apiOption: {
            api: getBankList, // promise类型的接口
            string: 'bankNo',
            value: 'id'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'incType',
          label: '类型',
          placeholder: '请选择类型',
          staticArr: [
            {
              string: '借款',
              value: 'C'
            },
            {
              string: '还款',
              value: 'D'
            }
          ]
        },
        //区间
        {
          type: 'section',
          key: 'Price',
          label: '金额',
          minNum: 0 //最小值
        },
        {
          type: 'text',
          key: 'name',
          label: '关键字',
          placeholder: '请输入关键字'
        }
      ],
      loadData: parameter => {
        return pageListBorrow(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      queryParam: {},
      title: null,
      modal: false,
      isloading: false,
      schoolList: [],
      id: null,
      form: {
        date: null,
        deptId: null,
        borrowerId: null,
        name: null,
        bankNo: null,
        type: null,
        total: null,
        remark: null
      },
      rules: {
        date: [{ required: true, message: '请选择借/还款日期', trigger: 'change' }],
        deptId: [{ required: true, message: '请选择校区-分馆', trigger: 'change' }],
        // name: [{ required: true, message: '请选择借款人', trigger: 'change' }],
        bankNo: [{ required: true, message: '请选择银行账户', trigger: 'change' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        total: [{ required: true, message: '请填写金额', trigger: 'change' }]
      },
      bankNos: [
        {
          id: 1,
          text: 1
        },
        {
          id: 2,
          text: 2
        }
      ]
    }
  },
  components: {
    STable,
    SearchComPro,
    PermBox,
    ChooseBorrower
  },
  watch: {
    modal(n, o) {
      if (!n) {
        this.id = null
        Object.keys(this.form).forEach(item => (this.form[item] = ''))
      }
    }
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    deptChange(val) {
      // if(val) {
      //   listBank({schoolId:this.form.deptId[this.form.deptId.length-1]}).then(res=>{
      //     if(res.code === 200) {
      //       this.bankNos = res.data
      //     }
      //   })
      // }
      // if(!val) {
      //   this.form.bankNo = null
      // }
    },
    focusAccount(deptId) {
      // if (!deptId) {
      //   this.bankNos = []
      //   return this.$notification['error']({
      //     message: '系统通知',
      //     description: '请先选择校区'
      //   })
      // }
    },
    getBackData(data) {
      console.log(data)
      this.form.borrowerId = data.id
      this.form.name = data.userName
    },
    openSelectModal() {
      console.log(this.$refs.ChooseBorrower)
      this.$refs.ChooseBorrower.open()
    },
    changeDate(val) {
      this.form.date = this.$tools.tailor.getDate(val)
    },
    delect(record) {
      const { $confirm, $notification, _refreshTable } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeBnk(record.id)
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
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.form.borrowerId) {
            return this.$notification['error']({
              message: '系统通知',
              description: '请选择借还款人'
            })
          }
          this.isloading = true
          let request = saveBorrow
          if (this.id) {
            request = updateBorrow
          }
          request({
            bankId: this.form.bankNo,
            borrowUserId: this.form.borrowerId,
            date: this.form.date,
            deptId: this.form.deptId[this.form.deptId.length - 1],
            id: this.id || '',
            price: this.form.total,
            remark: this.form.remark,
            type: this.form.type
          })
            .then(res => {
              if (res.code === 200) {
                this._refreshTable()
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                this.modal = false
              }
            })
            .finally((this.isloading = false))
        }
      })
    },
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      listOrgDept().then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = res.data
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
    openModal(record) {
      this.loadSchoolId()
      // let res = await listBank()
      // if(res.code === 200) {
      //   this.bankNos = res.data
      // }
      if (record) {
        getFinBorrowById({ borrowId: record.id }).then(res => {
          this.deptChange(res.data.deptId)
          if (res.code === 200) {
            this.form.date = res.data.date
            this.form.bankNo = res.data.bankId
            this.form.borrowerId = res.data.userBorrowId
            this.form.name = res.data.userBorrowName
            this.form.deptId = res.data.deptId
            this.form.total = res.data.price
            this.form.remark = res.data.remark
            this.form.type = res.data.incItemId
            this.id = record.id
            this.title = '借还款修改'
          }
        })
      } else {
        this.title = '借还款录入'
      }
      listBank().then(res => {
        if (res.code === 200) {
          this.bankNos = res.data
          this.modal = true
        }
      })
    },
    //搜索功能
    searchSubmit(data) {
      if (data.outDeptKey) {
        let val = data.outDeptKey.split(',')
        data.outDeptKey = val[val.length - 1]
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
<style lang="less" scoped>
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
