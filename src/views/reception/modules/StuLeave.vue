<template>
  <div class="stu-leave-wrapper">
    <!--<div class="btn-wrapper">
      <perm-box perm="student:leave:save">
        <a-button icon="plus-circle" type="primary" @click="addLeave()">新增</a-button>
      </perm-box>
    </div>-->
    <a-table ref="table" :pagination="false" :columns="columns" :rowKey="record => record.id" :dataSource="dataSource" :loading="loading">
      <span slot="actDayTitle" >
                <div>
                  <span style="color:red;">*</span>
                  实际已请假天数
                  <a-popover title="">
                    <template slot="content">
                      <p>实际已请假天数为变动数据，过一天新增一天</p>
                      <p>1、请假过去时间段会直接新增实际已请假天数&有效期</p>
                      <p>2、请假当天或未来日期: 每日23:59有效期+1，实际请假天数+1</p>
                    </template>
                      <span style="cursor: pointer"><a-icon type="question-circle" /></span>
                  </a-popover>
                </div>
      </span>stuCardNoTitle
      <span slot="stuCardNoTitle" >
                <div>
                  <span style="color:red;">*</span>
                  卡号
                  <a-popover title="">
                    <template slot="content">
                      <p>学员请假操作说明：</p>
                      <p>1、请假区间含过去时长，过去时长会直接新增有效期；请假区间含在今天及未来，每天23:59:有效期+1</p>
                      <p>2、请假区间的结束时间当天，23:59:59会自动结束请假</p>
                      <p>3、手动结束请假，结束请假当天不算请假</p>
                      <p>4、删除学员请假，该卡的有效期回退该条记录的“实际请假天数”</p>
                    </template>
                      <span style="cursor: pointer"><a-icon type="question-circle" /></span>
                  </a-popover>
                </div>
      </span>
      <span slot="stuCardNo" slot-scope="text, record">
        <a-popover title="卡备注信息">
          <template slot="content">
            <div>{{ record.remark || '无' }}</div>
          </template>
          {{ text }}
        </a-popover>
      </span>
      <span slot="className" slot-scope="text, record">
        <perm-box :text="record.stuName" perm="education:class:view">
          <router-link :to="{ path: `/reception/class/classInfo/${record.classId}` }">{{ record.className }}</router-link>
        </perm-box>
      </span>
      <span slot="effectiveDate" slot-scope="text">
        {{ text | filterDate }}
      </span>
      <span slot="expectedEndDate" slot-scope="text">
        {{ text | filterDate }}
      </span>
      <span slot="stateDate" slot-scope="text">
        {{ text | filterDate }}
      </span>
      <span slot="endDate" slot-scope="text">
        {{ text | filterDate }}
      </span>
      <span slot="actEndDate" slot-scope="text">
        {{ text | filterDate }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="record.leaveType === 'A'">
<!--          <perm-box perm="student:leave:save" v-if="!record.actEndDate">-->
<!--            <a href="#" @click="editLeave(record)">编辑</a>-->
<!--          </perm-box>-->
          <perm-box perm="student:leave:remove" v-if="record.leaveStatus==='B'">
            <a href="#" @click="deleteLeave(record)">删除请假</a>
          </perm-box>
          <perm-box perm="student:leave:manual"  v-if="record.leaveStatus==='A'">
            <a href="#" @click="endLeave(record)">结束请假</a>
          </perm-box>
        </template>
      </span>
      <span slot="attachment" slot-scope="text, record">
        <a v-show="record.file==='A'" href="javascript:;" @click="downloadAttach(record)">{{ '下载' }}</a>
      </span>
    </a-table>
    <StuLeaveAddEdit @refresh="loadData" :stuId="stuId" :title="title" ref="stuLeaveAddEdit"></StuLeaveAddEdit>
    <!-- 下载附件列表 -->
    <DownloadList ref="download"></DownloadList>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="结束请假"
      :visible="endLeaveVisible"
      :confirmLoading="confirmEndLoading"
      @ok="handleEndLeave"
      @cancel="
        endLeaveVisible = false
        confirmEndLoading = false
      "
    >
      <a-form-model ref="endLeaveForm" v-bind="formLayout" :model="endModel" :rules="endRules">
        <a-form-model-item label="实际结束时间" prop="endDate">
          <a-date-picker style="width: 100%;" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" :disabledDate="disabledLeaveDate" @change="handleActEndDateChange" />
          <p>结束请假则请假区间为[开始时间] 到[结束前一天]</p>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import PermBox from '@/components/PermBox'
import { listStuLeave, removeStuLeave, manualEndLeave, listLeaveFile } from '@/api/reception/student'
import StuLeaveAddEdit from './StuLeaveAddEdit'
import DownloadList from '@/components/DownloadList/DownloadList.vue'
import moment from 'moment'
const customHeaderCell = column => {
  return {
    style: {
      background: '#1ba97b',
      color:'#fff'
    }
  }
}
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
  components: {
    DownloadList,
    StuLeaveAddEdit,
    PermBox
  },
  props: {
    stuId: String
  },
  data() {
    return {
      spinning: true,
      title: '学员请假',
      columns: [
        {
          dataIndex: 'stuCardNo',
          key: 'stuCardNo',
          scopedSlots: { customRender: 'stuCardNo' ,title: 'stuCardNoTitle'},
          width:80
        },
        {
          title: '卡种名称',
          dataIndex: 'eduCardName',
          key: 'eduCardName',
          width:150
        },
        {
          title: '班级',
          dataIndex: 'className',
          scopedSlots: { customRender: 'className' },
          width:180
        },
        {
          title: '类型',
          dataIndex: 'typeName',
          key: 'typeName',
          width:80
        },
        {
          title: '舞种',
          dataIndex: 'danceName',
          key: 'danceName',
          width:80
        },
        {
          title: '请假开始时间',
          dataIndex: 'stateDate',
          key: 'stateDate',
          customHeaderCell: customHeaderCell,
          align: 'center',
          customRender: val => {
            return val && moment(val).format('YYYY-MM-DD HH:mm:ss')
          },
          width:170
        },
        {
          title: '请假结束时间',
          dataIndex: 'endDate',
          customHeaderCell: customHeaderCell,
          align: 'center',
          customRender: val => {
            return val && moment(val).format('YYYY-MM-DD HH:mm:ss')
          },
          width:170
        },
        {
          title: '请假实际结束时间',
          dataIndex: 'actEndDate',
          customHeaderCell: customHeaderCell,
          align: 'center',
          key: 'actEndDate',
          customRender: val => {
            return val && moment(val).format('YYYY-MM-DD HH:mm:ss')
          },
          width:170
        },
        {
          title: '预计请假天数',
          align: 'center',
          dataIndex: 'planDay',
          customHeaderCell: customHeaderCell,
          align: 'center',
          key: 'planDay',
          width:120
        },
        {
          scopedSlots: {  title: 'actDayTitle'},
          align: 'center',
          dataIndex: 'actDay',
          customHeaderCell: customHeaderCell,
          key: 'actDay',
          width:170
        },
        {
          title: '延期前有效期截止',
          dataIndex: 'effectiveDate',
          customHeaderCell: customHeaderCell,
          align: 'center',
          key: 'effectiveDate',
          customRender: val => {
            return val && moment(val).subtract(1,'seconds').format('YYYY-MM-DD HH:mm:ss')
          },
          width:170
        },
        {
          title: '延期后预计有效期截止',
          dataIndex: 'afterEndDate',
          customHeaderCell: customHeaderCell,
          align: 'center',
          key: 'afterEndDate',
          width:170,
          customRender: (val, record) => {
            // if (record.leaveType === 'B') {
            //   // 等于卡有效期截止时间
            //   return record.effectiveDate && moment(record.effectiveDate).subtract('1', 'seconds').format('YYYY-MM-DD HH:mm')
            // }
            return val && moment(val).subtract(1,'seconds').format('YYYY-MM-DD HH:mm:ss')
          },
        },
        {
          title: '现有效期截止',
          dataIndex: 'cardEndDate',
          key: 'cardEndDate',
          customHeaderCell: customHeaderCell,
          align: 'center',
          customRender: val => {
            return val && moment(val).subtract(1,'seconds').format('YYYY-MM-DD HH:mm:ss')
          },
          width:170
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          scopedSlots: { customRender: 'attachment' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      loading: false,
      currentRecord: null, // 当前选中记录
      formLayout,
      // 结束请假确认
      endLeaveVisible: false,
      confirmEndLoading: false,
      endModel: {
        endDate: null
      },
      endRules: {
        endDate: [{ required: true, message: '请选择请假实际结束时间', trigger: 'blur' }]
      }
    }
  },
  watch: {
    stuId(nv) {
      if (nv) {
        this.loadData(nv)
      }
    }
  },
  created() {
    this.loadData(this.stuId)
  },
  methods: {
    downloadAttach(data) {
      const { id } = data
      let fn = listLeaveFile.bind(null, id)
      this.$refs.download.openWithCb(fn)
    },
    addLeave() {
      this.title = '请假申请'
      this.$refs.stuLeaveAddEdit.openModal()
      this.$nextTick(() => {
        this.$refs.stuLeaveAddEdit.resetForm()
      })
    },
    editLeave(record) {
      this.title = '编辑'
      this.$refs.stuLeaveAddEdit.openModal()
      this.$nextTick(() => {
        this.$refs.stuLeaveAddEdit.resetForm()
        this.$refs.stuLeaveAddEdit.backindData(record)
      })
    },
    deleteLeave(record) {
      let _this = this
      _this.$confirm({
        title: '提示',
        content: `删除请假会将学员卡的有效期扣除实际请假天数`,
        onOk() {
          let id = record.id
          removeStuLeave(id).then(res => {
            if (res.code === 200) {
              _this.loadData(_this.stuId)
            }
          })
        }
      })
    },
    // 不能选择早于请假开始时间
    disabledLeaveDate(current) {
      return current && current < moment(this.currentRecord.stateDate)||current > moment(new Date())
    },
    endLeave(record) {
      this.currentRecord = record
      this.endLeaveVisible = true
    },
    handleActEndDateChange(date, dateString) {
      this.endModel.endDate = new Date(date)
    },
    // 指定实际请假结束时间
    handleEndLeave() {
      this.$refs.endLeaveForm.validate(valid => {
        if (!valid) return false
        const params = {
          stuLeaveId: this.currentRecord.id,
          ...this.endModel
        }
        this.confirmEndLoading = true
        manualEndLeave(params)
          .then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统提示',
                description: '已修改成功'
              })
              this.loadData(this.stuId)
            }
          })
          .finally(() => {
            this.endLeaveVisible = false
            this.confirmEndLoading = false
          })
      })
    },
    loadData(stuId) {
      this.loading = true
      listStuLeave({ stuId })
        .then(res => {
          this.dataSource = res.data
        })
        .finally(() => {
          this.loading = false
        })
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
