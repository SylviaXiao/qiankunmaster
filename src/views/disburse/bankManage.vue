<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btnClass">
        <perm-box perm="system:bank:save">
          <a-button type="primary" icon="plus-circle" @click.native="openModal()">新增银行</a-button>
        </perm-box>
      </div>
      <perm-box perm="system:bank:view">
        <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false" :rowKey="(record, index) => index">
          <span slot="action" slot-scope="text, record">
            <perm-box perm="system:bank:save">
              <a href="javascript:;" @click="openModal(record)">修改</a>
            </perm-box>
            <perm-box perm="system:bank:del">
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
      width="1680px"
      okText="保存"
      cancelText="取消"
      @ok="submit"
      :confirmLoading="isloading"
    >
      <div class="teacher-info">
        <span class="teacher-form" style="width: 200px">
          选择校区
        </span>
        <span class="teacher-form" style="width: 200px">
          选择公司
        </span>
        <span class="teacher-form" style="width: 200px">
          添加银行账户
        </span>
        <span class="teacher-form" style="width: 200px">
          银行账户名称
        </span>
        <span class="teacher-form" style="width: 200px">
          银行账号
        </span>
        <span class="teacher-form" style="width: 80px">
          排序
        </span>
        <span class="teacher-form" style="width: 200px">
          描述
        </span>
      </div>
      <div class="teacher-info" v-for="(item, index) in bankMsgs" :key="index">
        <span class="teacher-form" style="width: 200px">
          <a-tree-select
            style="width:100%"
            v-model="item.deptId"
            :allowClear="true"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="schoolList"
            treeDefaultExpandAll
            :multiple="true"
          />
        </span>
        <span class="teacher-form" style="width: 200px">
          <a-select
            style="width:100%"
            v-model="item.companyId"
            :filter-option="filterOption"
            :showSearch="true"
            :allowClear="true"
            :dropdownMatchSelectWidth="false"
          >
            <a-select-option v-for="item in companyList" :key="item.id" :value="item.id">{{ item.companyName }}</a-select-option>
          </a-select>
        </span>
        <span class="teacher-form" style="width: 200px">
          <a-input v-model="item.bankNo" style="width:100%" />
        </span>
        <span class="teacher-form" style="width: 200px">
          <a-input v-model="item.bankName" style="width:100%" />
        </span>
        <span class="teacher-form" style="width: 200px">
          <a-input v-model="item.bankCardNo" style="width:100%" />
        </span>
        <span class="teacher-form" style="width: 80px">
          <a-input-number v-model="item.bankOrder" style="width:100%" />
        </span>
        <span class="teacher-form" style="width: 200px">
          <a-input v-model="item.bankDesc" style="width:100%" />
        </span>
        <span class="teacher-form" style="width: 80px">
          <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="bankMsgs.length - 1 == index && title === '新增银行'" />
          <a-icon type="minus-circle" class="icon" style="margin: 7px;" @click.stop="subtract(index)" v-if="bankMsgs.length !== 1 && title === '新增银行'" />
        </span>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { changeBank, pageListBank, removeBank, saveBank, listOrgDept } from '@/api/education/card'
import { getBankList } from '@/api/education/card'
import { pageFinCompany } from '@/api/finance/finance'

const columns = [
  {
    title: '部门/分馆',
    dataIndex: 'parentDeptName',
    customRender: (text, record) => {
      const { deptName, parentDeptName } = record
      return parentDeptName + '-' + deptName
    }
  },
  {
    title: '公司名称',
    dataIndex: 'companyName'
  },
  {
    title: '银行账户',
    dataIndex: 'bankNo'
  },
  {
    title: '银行账户名称',
    dataIndex: 'bankName'
  },
  {
    title: '银行账号',
    dataIndex: 'bankCardNo'
  },
  {
    title: '排序',
    dataIndex: 'bankOrder'
  },
  {
    title: '描述',
    dataIndex: 'bankDesc'
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
          type: 'select', //动态select框
          key: 'bankId',
          label: '银行账户',
          search: true,
          placeholder: '请选择银行账户',
          apiOption: {
            api: getBankList, // promise类型的接口
            string: 'bankNo',
            value: 'id'
          }
        },
        {
          type: 'text',
          key: 'bankNo',
          label: '账号名称',
          placeholder: '请输入名称'
        }
      ],
      loadData: parameter => {
        return pageListBank(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      queryParam: {},
      title: null,
      modal: false,
      isloading: false,
      companyList: [],
      bankMsgs: [
        {
          deptId: null,
          companyId: null,
          bankNo: null,
          bankOrder: null,
          bankName: null,
          bankCardNo: null,
          bankDesc: null
        }
      ],
      schoolList: [],
      id: null
    }
  },
  components: {
    STable,
    SearchComPro,
    PermBox
  },
  watch: {
    modal(n, o) {
      if (n) {
        this.loadSchoolId()
      } else {
        this.id = null
        this.bankMsgs = [
          {
            deptId: null,
            companyId: null,
            bankNo: null,
            bankOrder: null,
            bankName: null,
            bankCardNo: null,
            bankDesc: null
          }
        ]
      }
    }
  },
  created() {
    this.getCompanyList()
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getCompanyList() {
      pageFinCompany({ page: 0, limit: 0 })
        .then(res => {
          this.companyList = res.data || []
        })
    },
    delect(record) {
      const { $confirm, $notification, _refreshTable } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeBank(record.id)
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
    subtract(index) {
      this.bankMsgs.splice(index, 1)
    },
    add() {
      this.bankMsgs.push({
        deptId: null,
        companyId: null,
        bankNo: null,
        bankOrder: null,
        bankName: null,
        bankCardNo: null,
        bankDesc: null
      })
    },
    submit() {
      for (let i = 0; i < this.bankMsgs.length; i++) {
        for (let key in this.bankMsgs[i]) {
          console.log(this.bankMsgs[i])
          if (key !== 'bankOrder' && key !== 'bankDesc' && !this.bankMsgs[i][key]) {
            return this.$notification['error']({
              message: '系统通知',
              description: '请先填写完整表格'
            })
          }
        }
      }

      this.isloading = true
      if (this.title === '新增银行') {
        let bankMsgs = JSON.parse(JSON.stringify(this.bankMsgs))
        bankMsgs.forEach(item => {
          item.deptId = item.deptId.join(',')
        })
        saveBank({ banks: JSON.stringify(bankMsgs) })
          .then(res => {
            if (res.code === 200) {
              this._refreshTable()
              this.modal = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            }
          })
          .finally((this.isloading = false))
      } else {
        changeBank({
          id: this.id,
          deptId: this.bankMsgs[0].deptId.join(','),
          companyId: this.bankMsgs[0].companyId,
          bankOrder: this.bankMsgs[0].bankOrder,
          bankName: this.bankMsgs[0].bankName,
          bankCardNo: this.bankMsgs[0].bankCardNo,
          bankNo: this.bankMsgs[0].bankNo,
          bankDesc: this.bankMsgs[0].bankDesc
        })
          .then(res => {
            if (res.code === 200) {
              this.modal = false
              this._refreshTable()
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            }
          })
          .finally((this.isloading = false))
      }
    },
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      listOrgDept().then(res => {
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
    openModal(record) {
      if (record) {
        this.id = record.id
        this.bankMsgs[0].bankDesc = record.bankDesc
        this.bankMsgs[0].bankNo = record.bankNo
        this.bankMsgs[0].bankOrder = record.bankOrder
        this.bankMsgs[0].bankName = record.bankName
        this.bankMsgs[0].bankCardNo = record.bankCardNo
        this.bankMsgs[0].deptId = record.deptId
        this.bankMsgs[0].companyId = record.companyId
        this.title = '修改银行'
      } else {
        this.title = '新增银行'
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
    white-space:nowrap;
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
