<template>
  <div class="stu-leave-wrapper">
    <perm-box perm="finance:employeeRecord:view">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
      <a-card :bordered="false">
        <div class="btn-wrapper " ref="elementBtn">
          <perm-box perm="finance:employeeRecord:update">
            <a-button @click="editHandle">
              批量修改
            </a-button>
          </perm-box>
        </div>
        <a-table
          :row-selection="rowSelection"
          :pagination="pagination"
          @change="handleTableChange"
          :loading="loading"
          :columns="columns"
          :data-source="loadData"
          bordered
          rowKey="userId"
        >
          <template
            v-for="col in [
              'employeeProfit',
              'otherBonus',
              'otherPerformanceBonus',
              'teacherBonus',
              'reissueSalary',
              'employeeSubsidy',
              'socialSecurityDeduction',
              'socialSecurity',
              'taxRevenue'
            ]"
            :slot="col"
            slot-scope="text, record, index"
          >
            <div :key="col">
              <template v-if="record.editable">
                <template
                  v-if="
                    [
                      'employeeProfit',
                      'otherBonus',
                      'otherPerformanceBonus',
                      'teacherBonus',
                      'socialSecurityDeduction',
                      'socialSecurity',
                      'taxRevenue',
                      'employeeSubsidy'
                    ].includes(col)
                  "
                >
                  <a-input-number style="margin: -5px 0" :value="text" :min="0" @change="e => handleChange(e, record.userId, col)" />
                </template>
                <template v-if="['reissueSalary'].includes(col)">
                  <a-input-number style="margin: -5px 0" :value="text" @change="e => handleChange(e, record.userId, col)" />
                </template>
              </template>
              <template v-else>
                <template v-if="['socialSecurityDeduction', 'socialSecurity', 'taxRevenue'].includes(col)">
                  {{ text ? -text : 0 }}
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
            </div>
          </template>
          <template slot="action" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <perm-box perm="finance:employeeRecord:update">
                <span v-if="record.editable">
                  <a-popconfirm title="确定保存吗?" @confirm="() => save([record.userId])">
                    <a>保存</a>
                  </a-popconfirm>
                  <a @click="() => cancel(record.userId)" class="ml10">取消</a>
                </span>
                <span v-else>
                  <a :disabled="editingKey !== ''" @click="() => edit(record.userId)">修改</a>
                </span>
              </perm-box>
            </div>
          </template>
        </a-table>
      </a-card>
    </perm-box>
    <!-- 添加学生,修改学生modal层 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="批量修改"
      :visible="showEditModule"
      @ok="editSave"
      :confirmLoading="confirmLoading"
      @cancel="editCancel"
    >
      <a-form :form="editForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="利润提成">
          <a-input-number style="width:100%" :min="0" v-decorator="['employeeProfit', { rules: [{ required: false, message: '请输入利润提成' }] }]" />
        </a-form-item>
        <a-form-item label="其他奖金">
          <a-input-number style="width:100%" :min="0" v-decorator="['otherBonus', { rules: [{ required: false, message: '请输入其他奖金' }] }]" />
        </a-form-item>
        <a-form-item label="其他绩效奖金">
          <a-input-number
            style="width:100%"
            :min="0"
            v-decorator="['otherPerformanceBonus', { rules: [{ required: false, message: '请输入其他绩效奖金' }] }]"
          />
        </a-form-item>
        <a-form-item label="教研团队奖金">
          <a-input-number style="width:100%" :min="0" v-decorator="['teacherBonus', { rules: [{ required: false, message: '请输入教研团队奖金' }] }]" />
        </a-form-item>
        <a-form-item label="补贴">
          <a-input-number style="width:100%" :min="0" v-decorator="['employeeSubsidy', { rules: [{ required: false, message: '请输入补贴' }] }]" />
        </a-form-item>
        <a-form-item label="往月补发工资">
          <a-input-number style="width:100%" v-decorator="['reissueSalary', { rules: [{ required: false, message: '请输入往月补发工资' }] }]" />
        </a-form-item>
        <a-form-item label="员工承担社保扣款">
          <a-input-number
            style="width:100%"
            :min="0"
            v-decorator="['socialSecurityDeduction', { rules: [{ required: false, message: '请输入员工承担社保扣款' }] }]"
          />
        </a-form-item>
        <a-form-item label="社保">
          <a-input-number style="width:100%" :min="0" v-decorator="['socialSecurity', { rules: [{ required: false, message: '请输入社保' }] }]" />
        </a-form-item>
        <a-form-item label="个税">
          <a-input-number style="width:100%" :min="0" v-decorator="['taxRevenue', { rules: [{ required: false, message: '请输入个税' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { getSchoolList, listBank } from '@/api/education/card'
import { pageEmployeeRecord, updateEmployeeRecord } from '@/api/finance/finance'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
const columns = [
  {
    title: '分馆',
    dataIndex: 'deptName',
    width: '120'
  },
  {
    title: '员工姓名',
    dataIndex: 'userName',
    width: '120'
  },
  {
    title: '职位',
    dataIndex: 'positionName',
    width: '120'
  },
  {
    title: '利润提成',
    dataIndex: 'employeeProfit',
    width: '120',
    scopedSlots: { customRender: 'employeeProfit' }
  },
  {
    title: '其他奖金',
    dataIndex: 'otherBonus',
    width: '120',
    scopedSlots: { customRender: 'otherBonus' }
  },
  {
    title: '其他绩效奖金',
    dataIndex: 'otherPerformanceBonus',
    width: '120',
    scopedSlots: { customRender: 'otherPerformanceBonus' }
  },
  {
    title: '教研团队奖金',
    dataIndex: 'teacherBonus',
    width: '120',
    scopedSlots: { customRender: 'teacherBonus' }
  },
  {
    title: '补贴',
    dataIndex: 'employeeSubsidy',
    width: '120',
    scopedSlots: { customRender: 'employeeSubsidy' }
  },
  {
    title: '往月补发工资',
    dataIndex: 'reissueSalary',
    width: '120',
    scopedSlots: { customRender: 'reissueSalary' }
  },
  {
    title: '员工承担社保扣款',
    dataIndex: 'socialSecurityDeduction',
    width: '120',
    scopedSlots: { customRender: 'socialSecurityDeduction' }
  },
  {
    title: '社保',
    dataIndex: 'socialSecurity',
    width: '120',
    scopedSlots: { customRender: 'socialSecurity' }
  },
  {
    title: '个税',
    dataIndex: 'taxRevenue',
    width: '120',
    scopedSlots: { customRender: 'taxRevenue' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    SearchComPro,
    STable,
    PermBox
  },

  data() {
    return {
      confirmLoading: false,

      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) => {
          return `总共 ${total} 条 当前 ${this.pagination.current} / ${Math.ceil(total / this.pagination.pageSize)} 页`
        },
        hideOnSinglePage: false,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '30', '50']
      },
      loading: false,
      page: 1,
      limit: 10,
      cacheData: [],
      loadData: [],
      columns,
      editingKey: '',
      queryParam: {
        recordDate: this.getMonth()
      },
      searchParams: [
        {
          show: true,
          isShow: true,
          type: 'month',
          key: 'recordDate',
          label: '月份',
          placeholder: '请选择月份',
          format: 'YYYY-MM',
          defaultVal: this.getMonth()
        },
        { show: true, type: 'text', key: 'userName', label: '员工姓名', placeholder: '请输入员工姓名' },
        {
          show: true,
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'schoolId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      showEditModule: false
    }
  },
  beforeCreate() {
    this.editForm = this.$form.createForm(this)
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
  created() {
    this.initData()
  },
  methods: {
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
    editSave() {
      this.editForm.validateFields().then(data => {
        this.confirmLoading = true
        this.submit(this.selectedRows, data)
      })
    },
    editCancel() {
      this.editForm.resetFields()
      this.confirmLoading = false
      this.showEditModule = false
    },
    editHandle() {
      this.examine().then(() => {
        this.showEditModule = true
      })
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      this.initData()
    },
    async initData() {
      const params = {
        school_id: this.$store.getters.school_id,
        limit: this.pagination.pageSize,
        page: this.pagination.current
      }
      let res = await pageEmployeeRecord(Object.assign(params, this.queryParam))
      this.loadData = JSON.parse(JSON.stringify(res.data))
      this.cacheData = JSON.parse(JSON.stringify(res.data))
      this.pagination.total = res.count
      this.editingKey = ''
    },
    getMonth() {
      let date = new Date()
      var myyear = date.getFullYear()
      var mymonth = date.getMonth() + 1
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      return myyear + '-' + mymonth
    },
    handleChange(value, key, column) {
      const newData = [...this.loadData]
      const target = newData.filter(item => key === item.userId)[0]
      if (target) {
        target[column] = value
        this.loadData = newData
      }
    },
    edit(key) {
      const newData = [...this.loadData]
      const target = newData.filter(item => key === item.userId)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.loadData = newData
      }
    },
    save(key) {
      const newData = [...this.loadData]
      const targets = newData.filter(item => key.includes(item.userId))

      this.submit(targets, targets[0])
    },
    submit(targets, target) {
      let params = []
      targets.forEach(item => {
        params.push({
          id: item.id,
          userId: item.userId,
          month: this.queryParam.recordDate,
          employeeProfit: target.employeeProfit,
          otherBonus: target.otherBonus,
          otherPerformanceBonus: target.otherPerformanceBonus,
          teacherBonus: target.teacherBonus,
          reissueSalary: target.reissueSalary,
          employeeSubsidy: target.employeeSubsidy,
          socialSecurityDeduction: target.socialSecurityDeduction,
          socialSecurity: target.socialSecurity,
          taxRevenue: target.taxRevenue
        })
      })
      updateEmployeeRecord({ employeeRecords: JSON.stringify(params) }).then(res => {
        if (res.code == 200) {
          this.editCancel()
          this._refreshTable()
        }
      })
    },
    cancel(key) {
      const newData = [...this.loadData]
      const target = newData.filter(item => key === item.userId)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.userId)[0])
        delete target.editable
        this.loadData = newData
      }
    },
    searchSubmit(data) {
      this.queryParam = data
      this.pagination.current = 1
      this._refreshTable()
    },
    _refreshTable() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.initData()
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-wrapper {
  .btn-wrapper {
    margin-bottom: 20px;
  }
}
</style>
