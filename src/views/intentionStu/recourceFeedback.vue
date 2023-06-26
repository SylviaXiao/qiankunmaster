<template>
  <div class="intention-adviser-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="table-wrapper">
        <div class="mt10 mb10 flex" style="justify-content:space-between;">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
          <a-radio-group v-model="status" @change="changeStatus">
            <a-radio-button value="N">
              待处理
            </a-radio-button>
            <a-radio-button value="Y">
              已处理
            </a-radio-button>
            <a-radio-button value="X">
              全部
            </a-radio-button>
          </a-radio-group>
        </div>
        <s-table ref="table" :columns="columns" :data="loadData">
          <span slot="handlingStatus" slot-scope="text, record">
            <a-switch @change="onChange($event, record)" :checked="text == 'Y'">
              <a-icon type="check" slot="checkedChildren" />
              <a-icon type="close" slot="unCheckedChildren" />
            </a-switch>
          </span>
          <span slot="action" slot-scope="text, record">
            <perm-box :text="record.stuName" perm="student:user:feedback">
              <a href="#" @click="handleFeedback(record)">反馈详情</a>
            </perm-box>
          </span>
        </s-table>
      </div>
    </a-card>
    <a-modal :footer="null" :maskClosable="$store.state.modalMaskClickEnable" title="资源反馈详情" :width="600" v-model="modelVisual">
      <div style="line-height:30px;font-size:14px;padding:0 20px;">
        <a-row>
          <a-col :span="6">资源简介</a-col>
          <a-col :span="18">
            <div>姓名：{{ feedbackInfo.userName || '无' }}</div>
            <div>手机号码：{{ feedbackInfo.userPhone || '无' }}</div>
            <div>分配分馆：{{ feedbackInfo.deptName || '无' }}</div>
          </a-col>
        </a-row>
        <a-row class="mt20">
          <a-col :span="6">反馈详情</a-col>
          <a-col :span="18">
            <div>反馈人：{{ feedbackInfo.serviceName }}</div>
            <div>反馈时间：{{ feedbackInfo.feedbackDate }}</div>
            <div>反馈内容：{{ feedbackInfo.feedbackInfo }}</div>
          </a-col>
        </a-row>
      </div>
      <perm-box perm="student:user:service">
        <!-- <template slot="footer"> -->
        <div class="flex" style="justify-content: flex-end;border-top: 1px solid #eee;padding: 10px 30px 0 0;">
          <a-button key="submit" type="primary" @click="toRecource()">
            查看资源
          </a-button>
        </div>
        <!-- </template> -->
      </perm-box>
    </a-modal>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { operationStuUser, listFeedback, handlingFeedback } from '@/api/intentionStu/adviser'
const invalidColumns = [
  {
    title: '反馈时间',
    dataIndex: 'feedbackDate',
    key: 'feedbackDate',
    width: 140
  },
  {
    title: '录入时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 140
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    scopedSlots: { customRender: 'userName' },
    key: 'userName',
    width: 140
  },
  {
    title: 'QQ号',
    dataIndex: 'userQQ',
    key: 'userQQ',
    width: 100
  },
  {
    title: '微信号',
    dataIndex: 'userWeChat',
    key: 'userWeChat',
    width: 100
  },
  {
    title: '手机号码',
    dataIndex: 'userPhone',
    key: 'userPhone',
    width: 100
  },

  {
    title: '分配分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 140
  },
  {
    title: '客服人员',
    dataIndex: 'serviceName',
    key: 'serviceName',
    width: 140
  },
  {
    title: '处理状态',
    dataIndex: 'handlingStatus',
    key: 'handlingStatus',
    width: 100,
    scopedSlots: { customRender: 'handlingStatus' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 100
  }
]
import { getSchoolList } from '@/api/education/card'
export default {
  components: {
    SearchComPro,
    PermBox,
    STable
  },
  data() {
    return {
      status: 'N',
      modelVisual: false,
      feedbackInfo: {},
      searchParams: [
        {
          type: 'treeSelect',
          isShow: true,
          key: 'deptIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'userInfo',
          label: '学员信息',
          show: true,
          placeholder: '请输入姓名/手机号/微信号'
        },
        {
          type: 'date',
          key: 'EntryDate',
          label: '录入时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'date',
          key: 'Date',
          label: '反馈时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        }
      ],
      columns: invalidColumns,
      queryParam: { feedbackStatus: 'N' },
      loadData: parameter => {
        return listFeedback(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    changeStatus() {
      let status = this.status
      if (this.status == 'X') {
        status = ''
      }
      this.queryParam.feedbackStatus = status
      this._refreshTable()
    },
    toRecource() {
      let date = this.feedbackInfo.createDate.slice(0, 10)
      // this.$router.push({ path: `/intentionStu/service=${this.feedbackInfo.userName}&startDate=${date}&endDate=${date}` })
      this.$router.push({
        name: 'service',
        query: { stuUserInfo: this.feedbackInfo.userName, startDate: date, endDate: date }
      })
      this.modelVisual = false
    },
    //导出
    downloadStu() {
      let exportUrl = '/stuUserFeedback/listFeedbackByExportExcel'
      const queryParam = this.queryParam
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k != 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
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
    handleFeedback(record) {
      this.feedbackInfo = record
      this.modelVisual = true
    },
    onChange(checked, data) {
      let _this = this
      let text = '确定处理吗?'
      if (!checked) text = '确定取消处理吗?'
      this.$confirm({
        title: '系统提示',
        content: text,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          handlingFeedback(data.feedbackId)
            .then(res => {
              if (res.code === 200) {
                _this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功!'
                })
              }
            })
            .then(() => {
              _this._refreshTable()
            })
        },
        onCancel() {}
      })
    },
    //搜索功能
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },

    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

:global {
  .data-tree {
    .ant-card {
      top: -17px;
    }

    .ant-timeline {
      margin-top: 10px;
    }
  }
}

.intention-adviser-wrapper {
  .search-wrapper {
  }

  .btn-wrapper {
    margin-top: 20px;
    margin-left: -5px;
  }

  .table-wrapper {
    margin-top: 20px;
  }
}
/deep/.ant-modal-body {
  padding: 30px 0 10px;
}
</style>
