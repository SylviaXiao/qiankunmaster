<template>
  <div class="audition-list" ref="elementAll" style="height:calc(100vh - 148px)">
    <div ref="elementSearch">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit"
          :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <s-table
        :showSlider="true"
        :sliderIndex="1"
        :scroll="{ x: 2400 }"
        ref="table"
        :columns="columns"
        :data="loadData"
        :rowKey="(record, index) => index"
      >
        <span slot="cardNo199Title" slot-scope="text,record">
            <a-tooltip placement="topLeft">
              <template slot="title">
                <div  style="font-size:12px;width:200px;">私教体验卡签到，第二天生成试课数据</div>
              </template>
             199卡号
            </a-tooltip>
        </span>
        <span slot="bindDetailsDeptName" slot-scope="text, record">
          <div v-if="Array.isArray(record.bindDetails) && record.bindDetails.length > 0">
            <div v-for="(item, index) in record.bindDetails" :key="index">{{ item.deptName }}</div>
          </div>
        </span>
        <span slot="bindDetailsAchPrice" slot-scope="text, record">
          <div v-if="Array.isArray(record.bindDetails) && record.bindDetails.length > 0">
            <div v-for="(item, index) in record.bindDetails" :key="index">{{ item.achPrice }}</div>
          </div>
        </span>
        <span slot="bindDetailsRadio" slot-scope="text, record">
          <div v-if="Array.isArray(record.bindDetails) && record.bindDetails.length > 0">
            <div v-for="(item, index) in record.bindDetails" :key="index">{{ item.radio }}</div>
          </div>
        </span>
        <span slot="action" slot-scope="text, record">
          <perm-box perm="student:auditioncvn:change"
            v-if="Array.isArray(record.bindDetails) && record.bindDetails.length > 0">
            <a @click="handleUnBind(record)">取消绑定</a>
          </perm-box>
          <perm-box perm="student:auditioncvn:change"
            v-if="Array.isArray(record.doBingDetails) && record.doBingDetails.length > 0 && (!record.bindDetails || record.bindDetails.length === 0)">
            <a @click="handleBind(record)">绑定报名</a>
          </perm-box>
          <perm-box perm="student:auditioncvn:cancel">
            <a @click="handleAuditionCancel(record)">取消试课</a>
          </perm-box>
        </span>
      </s-table>
      <!-- 新增模板页 -->
    </a-card>
    <a-modal title="绑定报名" :visible="bindVisible"
      :confirmLoading="confirmLoading" @ok="handleBindOk" @cancel="handleBindCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item v-bind="formItemLayout" label="卡号" prop="cardIds">
          <a-select v-model="form.keys" style="width:100%;" @change="cardNoChange">
            <a-select-option v-for="(item, index) in enrollCardNoList" :key="index" :value="item.cardIds+item.financeId">
              {{ item.cardNo }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-bind="formItemLayout" label="报名时间" prop="enrollDate">
          {{ form.enrollDate }}
        </a-form-model-item>
        <a-form-model-item v-bind="formItemLayout" label="报名金额" prop="_finPrice">
          {{ form._finPrice }}
        </a-form-model-item>
        <a-form-model-item v-bind="formItemLayout" label="备注" prop="remark">
          <a-textarea v-model="form.remark" placeholder="请输入备注信息" :rows="4" :maxLength="300" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { STable, SearchComPro, PermBox } from '@/components'
import { pagePersonalAuditionRegisterChange, bindPersonalAuditionRegister, unbindPersonalAuditionRegister, cancelAuditionlog } from '@/api/reception/student'
import { listEduDance } from '@/api/common'
import { getSchoolList } from '@/api/education/card'

  const defaultStart = moment()
    .date(1)
    .format('YYYY-MM-DD')
  const defaultEnd = moment()
    .format('YYYY-MM-DD')
  const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } }
  const columns = [
    {
      dataIndex: 'cardNo199',
      scopedSlots: { title: 'cardNo199Title'}
    },
    {
      title: '199报名时间',
      dataIndex: 'enrollDate199'
    },
    {
      title: '199办卡分馆',
      dataIndex: 'enroll199Dept'
    },
    {
      title: '上课分馆',
      dataIndex: 'schoolDeptName'
    },
    {
      title: '学号',
      dataIndex: 'studentNo'
    },
    {
      title: '姓名',
      dataIndex: 'studentName'
    },
    {
      title: '手机号',
      dataIndex: 'studentPhone'
    },
    {
      title: '签到分馆',
      dataIndex: 'auditionDeptName'
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      width: 200,
      ellipsis: true
    },
    {
      title: '舞种',
      dataIndex: 'danceName'
    },
    {
      title: '班型',
      dataIndex: 'classTypeName'
    },
    {
      title: '上课时间',
      dataIndex: 'classDate',
      width: 180
    },
    {
      title: '签到老师',
      dataIndex: 'signTeachers'
    },
    {
      title: '报名状态',
      dataIndex: 'enrollState'
    },
    {
      title: '报名卡号',
      dataIndex: 'enrollCardNo',
      width: 140,
      ellipsis: true
    },
    {
      title: '报名时间',
      dataIndex: 'enrollDate',
      customRender: (text, record) => {
        return text ? moment(text).format('YYYY-MM-DD') : ''
      }
    },
    {
      title: '业绩分馆',
      dataIndex: 'bindDetailsDeptName',
      scopedSlots: { customRender: 'bindDetailsDeptName' }
    },
    {
      title: '业绩金额',
      dataIndex: 'bindDetailsAchPrice',
      scopedSlots: { customRender: 'bindDetailsAchPrice' }
    },
    {
      title: '成单数',
      dataIndex: 'bindDetailsRadio',
      scopedSlots: { customRender: 'bindDetailsRadio' }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
]
export default {
  name: 'personalAuditionRegisterChange',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
      searchParams: [
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'stuInfo',
          label: '姓名/手机号',
          placeholder: '请输入姓名或手机号'
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'stuNo',
          label: '学员学号',
          placeholder: '请输入学员学号'
        },
        {
          type: 'select',
          key: 'enrollState',
          label: '报名状态',
          placeholder: '请选择',
          staticArr: [
            {
              string: '已报名',
              value: 'Y'
            },
            {
              string: '未报名',
              value: 'N'
            }
          ]
        },
        {
          type: 'date',
          key: 'AuditionDate',
          label: '试课时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
        },
        {
          type: 'date',
          key: 'Date',
          label: '199报名时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称'
        },
        {
          type: 'select',
          key: 'danceIds',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'chooseModal', // 点击弹框选择类型
          key: 'teacher', // 根据key来筛选
          label: '导师',
          placeholder: '请选择导师'
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'enrollCardNo',
          label: '报名卡号',
          placeholder: '请输入报名卡号'
        },
        {
          type: 'text',
          key: 'auditionCardNo',
          label: '199卡号',
          placeholder: '请输入199卡号'
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'deptIds',
          label: '上课分馆',
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
      formItemLayout,
      columns,
      queryParam: {
        startAuditionDate: defaultStart,
        endAuditionDate: defaultEnd,
      },
      loadData: parameter => {
        return pagePersonalAuditionRegisterChange(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },

      confirmLoading: false,
      bindVisible: false,
      enrollCardNoList: [],
      form: {
        keys:'',//唯一标识
        cardIds: '',//卡号
        enrollDate: '',//报名时间
        financeId: '',//财务ID
        studentId: '',//学员ID
        priEduCard: '',//私教卡号
        remark: '',//备注
        _finPrice: ''//报名金额
      },
      rules: {
        cardIds: [{ required: true, message: '请选择卡号', trigger: 'change' }]
      }
    }
  },
  methods: {
    searchSubmit(data, isReset) {
      this.queryParam = data
      if (isReset == 'isReset') {
        this.queryParam = {
          startAuditionDate: defaultStart,
          endAuditionDate: defaultEnd
        }
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },

    // 绑定报名/取消绑定报名
    handleUnBind(record) {
      this.$confirm({
        title: '系统提示',
        content: '确认解除该条数据的关联吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          let ids = record.bindDetails.map(d => d.obj_id).join(',')
          unbindPersonalAuditionRegister(ids)
            .then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this._refreshTable()
            })
        }
      })
    },
    handleBind(record) {
      this.bindVisible = true
      this.enrollCardNoList = record.doBingDetails
    },
    handleAuditionCancel(record) {
      this.$confirm({
        content: '是否取消试课？',
        onOk: () => {
          const { dancePlanId, cardNo199Id } = record
          const params = {
            dancePlanId,
            cardId: cardNo199Id
          }
          cancelAuditionlog(params).then(res => {
            this._refreshTable()
          })
        }
      })
    },
    handleBindCancel() {
      this.bindVisible = false
      this.form = {}
    },
    handleBindOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form))
          delete form._finPrice
          delete form.keys
          this.confirmLoading = true
          bindPersonalAuditionRegister(form)
            .then(res => {
              if (res.code == 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                this.handleBindCancel()
                this._refreshTable()
              }
            })
            .finally((this.confirmLoading = false))
        }
      })
    },
    cardNoChange(value, e) {
      const data = this.enrollCardNoList[e.key]
      this.form.cardIds = data.cardIds
      this.form = {
        keys: data.cardIds+data.financeId,
        cardIds: data.cardIds,
        enrollDate: data.tradeDate,
        financeId: data.financeId,
        studentId: data.studentId,
        priEduCard: data.priEduCard,
        remark: '',
        _finPrice: data.finPrice
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
