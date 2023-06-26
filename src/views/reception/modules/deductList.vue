<template>
  <div class="audition-list">
    <a-card :bordered="false">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btnClass"></div>
      <!-- 列表 -->

      <s-table :showSlider="true" ref="sTable" size="default" :columns="roleColumns" :data="loadData" :rowKey="(record, index) => index">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="salary:deduct:save">
            <a href="javascript:;" @click="saveSalDeductHandle(record)">修改</a>
          </perm-box>
          <perm-box perm="salary:deduct:delete">
            <a href="javascript:;" @click="removeSalDeductHandle(record)">删除</a>
          </perm-box>
        </span>
      </s-table>
      <!-- 新增模板页 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        title="修改"
        v-model="teaSignModal"
        okText="保存"
        cancelText="取消"
        @ok="sendTeaduct()"
        :confirmLoading="teaSignModalLoading"
        class="sign-modal"
      >
        <a-form :form="teaSignForm" style="margin-top: 20px;">
          <!-- 扣除类型 -->
          <a-form-item label="扣除类型" v-bind="$tools.formItemLayout">
            <a-radio-group buttonStyle="solid" @change="changeDeduct" v-model="deductType">
              <a-radio-button value="salary">扣费</a-radio-button>
              <a-radio-button value="num">扣次</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <!-- 备注 -->
          <a-form-item :label="`${textByDeductType}`" v-bind="$tools.formItemLayout">
            <a-input-number :min="0" :max="999999" v-decorator="['number']" />
          </a-form-item>
          <!-- 备注 -->
          <a-form-item :label="`备注`" v-bind="$tools.formItemLayout">
            <a-input :placeholder="`请输入${textByDeductType}备注`" v-decorator="['remark']" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { removeSalDeduct, pageSalDeducts, saveSalDeduct } from '@/api/reception/student'

//table遍历数组    姓名、手机号、试课时间、老师、学号、备注
const roleColumns = [
  {
    title: '上课时间',
    dataIndex: 'startDate',
    key: 'startDate'
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className'
  },
  // {
  //   title: '手机号',
  //   dataIndex: 'stuPhone',
  //   key: 'stuPhone',
  //   slots: { title: '舞种' },
  //   scopedSlots: { customRender: 'danceName' }
  // },
  {
    title: '老师',
    dataIndex: 'teacherName',
    key: 'teacherName'
  },
  {
    title: '扣次',
    dataIndex: 'deductNum',
    key: 'deductNum'
  },
  {
    title: '扣费',
    dataIndex: 'deductSalary',
    key: 'deductSalary'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '实际扣费',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'auditionList',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
      roleColumns,
      queryParam: {},
      loadData: parameter => {
        return pageSalDeducts(Object.assign({}, parameter, this.queryParam)).then(res => {
          return res
        })
      },
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '上课时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'chooseModal', // 点击弹框选择类型
          key: 'teacher', // 根据key来筛选
          label: '导师',
          placeholder: '请选择导师'
        }
      ],
      //导师签到modal
      teaSignModal: false,
      //导师签到loading
      teaSignModalLoading: false,
      //导师签到obj
      openModalTeaInfo: {},
      //导师扣除类型
      deductType: 'salary'
    }
  },
  computed: {
    dancePlanId() {
      const {
        teaRecord: { planId }
      } = this
      return planId
    },
    textByDeductType() {
      const { deductType } = this
      return deductType == 'salary' ? '扣费金额' : '扣次数量'
    }
  },
  beforeCreate() {
    this.signinTeaForm = this.$form.createForm(this)
    this.teaSignForm = this.$form.createForm(this)
  },
  methods: {
    saveSalDeductHandle(record) {
      this.teaSignForm.resetFields()
      this.deductType = 'salary'
      this.teaSignModal = true
      this.openModalTeaInfo = record
      this.databacking(record)
    },
    databacking(teacher) {
      const {
        teaSignForm: { setFieldsValue }
      } = this
      const { deductSalary, deductNum, remark } = teacher
      deductNum > 0
        ? this.$nextTick().then(() => {
            this.deductType = 'num'
            setFieldsValue({ ['number']: deductNum })
          })
        : this.$nextTick().then(() => {
            this.deductType = 'salary'
            setFieldsValue({ ['number']: deductSalary })
          })
      this.$nextTick(() => {
        setFieldsValue({ ['remark']: remark })
      })
    },
    sendTeaduct() {
      const {
        teaSignForm: { validateFields },
        openModalTeaInfo,
        deductType
      } = this
      validateFields()
        .then(v => {
          const params = Object.assign(
            {},
            {
              [deductType]: v.number,
              // salTemplateId: openModalTeaInfo.teacherId,
              // dancePlanId: openModalTeaInfo.dancePlanId
              teacherSignInLogId: openModalTeaInfo.deductId
            },
            v
          )
          this.teaSignModalLoading = true
          return params
        })
        .then(saveSalDeduct)
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.teaSignModal = false
          this._refreshTable()
        })
        .finally(() => (this.teaSignModalLoading = false))
    },
    changeDeduct(event) {
      const {
        target: { value }
      } = event
      const {
        openModalTeaInfo: { salary, num, remark },
        teaSignForm: { setFieldsValue }
      } = this
      value == 'salary'
        ? this.$nextTick().then(() => {
            setFieldsValue({ ['number']: salary })
            setFieldsValue({ ['remark']: remark })
          })
        : this.$nextTick().then(() => {
            setFieldsValue({ ['number']: num })
            setFieldsValue({ ['remark']: remark })
          })
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    removeSalDeductHandle(record) {
      let { deductId } = record
      let _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认解除该条数据的关联吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeSalDeduct(deductId).then(_this._refreshTable)
        }
      })
    },
    _refreshTable() {
      this.$refs.sTable.refresh()
    }
  }
}
</script>

<style scoped lang="less"></style>
