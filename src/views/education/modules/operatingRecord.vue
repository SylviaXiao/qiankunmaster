<template>
  <div class="operating-record-wrapper">
    <a-table ref="table" :columns="columns" :dataSource="classRecod" :pagination="false" rowKey="logId">
      <span slot="logDate" slot-scope="text, record">
        <span>
          {{ text }}
          <perm-box perm="student:info:delchangeLog">
            <a href="#" @click="delCardBtn(record)">删除</a>
          </perm-box>
        </span>
      </span>
      <span slot="stuName" slot-scope="text, record">
        {{ record.type == 'B' ? record.targetStuName : record.stuName }}
      </span>
      <span slot="parseDate" slot-scope="text">
        <span>{{ $tools.tailor.getDate(text) }}</span>
      </span>
      <span slot="attachment" slot-scope="text, record">
        <a href="javascript:;" @click="downloadAttach(record)" v-if="record.type == 'B' || record.type == 'D'">{{ '附件' }}</a>
      </span>
    </a-table>
    <download-list ref="download"></download-list>
    <perm-box v-if="showAccount" perm="student:info:view">
      <a-divider orientation="left"><span :style="{ color: '#e8e8e8' }">缴费记录</span></a-divider>
      <StudentInfoAccount @hideThis="hideThisHandle" ref="stuAccount" :stuId="stuId"></StudentInfoAccount>
    </perm-box>
  </div>
</template>

<script>
import { PermBox, STable } from '@/components'
import DownloadList from '@/components/DownloadList/DownloadList.vue'
import StudentInfoAccount from '@/views/reception/modules/StudentInfoAccount'
import { delCardChangeLog } from '@/api/education'

const columns = [
  {
    title: '操作日期',
    dataIndex: 'logDate',
    scopedSlots: { customRender: 'logDate' }
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName'
  },
  {
    title: '转入/转出',
    dataIndex: 'in',
    customRender: (text, record) => {
      if (record.isClassLog) {
        //（A:结业,B:退班）
      } else {
        //（B:转卡,D:退卡）
        const { type, originalClassName, stuName, targetClassName, targetStuName } = record
        if (type == 'B') {
          return `${stuName} 转给 ${targetStuName}`
        } else {
          return '-'
        }
      }
    }
  },
  {
    title: '入班时间',
    dataIndex: 'joinDate',
    scopedSlots: { customRender: 'parseDate' }
  },
  {
    title: '退班/结业时间',
    dataIndex: 'outDate',
    scopedSlots: { customRender: 'parseDate' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: (text, record) => {
      if (record.isClassLog) {
        //（A:结业,B:退班）
        if (text) {
          switch (text) {
            case 'A':
              return '结业'
            case 'B':
              return '退班'
            default:
              return '-'
          }
        } else {
          return '入班'
        }
      } else {
        //（B:转卡,D:退卡）
        switch (text) {
          case 'A':
            return '改卡'
          case 'B':
            return '转卡'
          case 'C':
            return '撤销'
          case 'D':
            return '退卡'
          case 'E':
            return '结算'
          case 'F':
            return '购卡'
          case 'G':
            return '改卡'
          default:
            return '-'
        }
      }
    }
  },
  {
    title: '交易金额',
    dataIndex: 'price',
    customRender: (text, record) => {
      if (record.type == 'B') {
        return text ? '-' + text : ''
      } else {
        return text
      }
    }
  },
  {
    title: '操作人',
    dataIndex: 'userName'
  },
  {
    title: '备注',
    dataIndex: 'logRemark'
  },
  {
    title: '附件',
    dataIndex: 'isClassLog',
    scopedSlots: { customRender: 'attachment' }
  }
]
export default {
  name: 'operatingRecord',
  props: {
    loadData: {
      type: Function
    },
    stuId: {
      type: String,
      default: ''
    }
  },
  components: {
    StudentInfoAccount,
    DownloadList,
    PermBox,
    STable
  },
  watch: {
    stuId(nv) {
      if (nv) {
        // 拿到studentId以后请求数据渲染列表
        this.getTable()
      }
    }
  },
  data() {
    return {
      columns,
      classRecod: []
    }
  },
  created() {
    this.getTable()
    this.init()
  },
  methods: {
    downloadAttach(data) {
      const { logId } = data
      this.$refs.download.open(logId)
    },
    getTable() {
      this.loadData().then(res => {
        this.classRecod = res.data
      })
    },
    _refreshTable() {
      this.$refs.stuAccount ? this.$refs.stuAccount._refreshTable() : ''
    },
    hideThisHandle() {
      this.showAccount = false
    },
    init() {
      this.showAccount = true
    },

    //删除按钮
    delCardBtn(record) {
      let _this = this
      let logId = record.logId
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          delCardChangeLog(logId).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.getTable()
          })
        }
      })
    }
  }
}
</script>

<style scoped></style>
