<template>
  <div class="operating-record-wrapper">
    <div class="mb-10">
      <a-button type="primary" icon="download" @click.native="downloadStu">
        导出
      </a-button>
      <a-button class="ml-10" @click="getTable">刷新</a-button>
    </div>
    <a-table :columns="columns" :dataSource="classRecod" :pagination="false" rowKey="logId">
      <span slot="parseDate" slot-scope="text">
        <span>{{ $tools.tailor.getDate(text) }}</span>
      </span>
    </a-table>
    <download-list ref="download"></download-list>
  </div>
</template>

<script>
import moment from 'moment'
import PermBox from '@/components/PermBox'
import DownloadList from '@/components/DownloadList/DownloadList.vue'
import { listHistoryStudents } from '@/api/education'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const columns = [
  {
    title: '学员名称',
    dataIndex: 'stuName'
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo'
  },
  {
    title: '卡名称',
    dataIndex: 'cardName'
  },
  {
    title: '联系电话 ',
    dataIndex: 'stuPhone'
  },
  {
    title: '使用/总次数',
    dataIndex: 'usedCount',
    customRender: (text, record) => {
      return record.usedCount + '/' + record.totalCount
    }
  },
  {
    title: '首次上课时间',
    dataIndex: 'activationDate',
    customRender: (text, record) => {
      return text.slice(0, 10)
    }
  },
  {
    title: '最后一次上课时间',
    dataIndex: 'lastClassDate',
    customRender: (text, record) => {
      return text.slice(0, 10)
    }
  },
  {
    title: '有效期截止',
    dataIndex: 'endDate'
  },
  {
    title: '卡状态',
    dataIndex: 'status',
    customRender: text => {
      return text === 'A'
        ? '未使用'
        : text === 'B'
        ? '使用中'
        : text === 'C'
        ? '停课'
        : text === 'D'
        ? '退卡'
        : text === 'E'
        ? '结业'
        : text === 'F'
        ? '撤销'
                  : text === 'G'
                    ? '结转'
        : ''
    }
  },
  {
    title: '实收/应收/原价',
    dataIndex: 'paidPrice',
    customRender: (text, record) => {
      return record.paidPrice + '/' + record.totalPrice + '/' + record.originalPrice
    }
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    customRender: (text, record) => {
      return text ? '是' : '否'
    }
  }
]
export default {
  name: 'operatingRecord',
  props: {
    classId: {
      type: String,
      default: ''
    }
  },
  components: {
    DownloadList,
    PermBox
  },
  data() {
    return {
      columns,
      classRecod: []
    }
  },
  created() {
    // this.getTable()
  },
  methods: {
    downloadStu() {
      let queryParam = {
        classId: this.classId
      }
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        fields.push({ name: k, value: queryParam[k] })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}/education/class//danceRenewalDataDown`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },
    handleEndDate(data) {
      return data
        ? moment(data)
            .subtract(1, 'seconds')
            .format('YYYY-MM-DD HH:mm')
        : ''
    },
    downloadAttach(data) {
      const { logId } = data
      this.$refs.download.open(logId)
    },
    getTable() {
      listHistoryStudents(this.classId).then(res => {
        this.classRecod = res.data
      })
    }
  }
}
</script>

<style scoped></style>
