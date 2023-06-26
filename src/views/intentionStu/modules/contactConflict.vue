<template>
  <div class="contact-conflict-wrapper">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="1200" :visible="visible" title="重复信息" @cancel="close">
      <a-table
        ref="table"
        :rowClassName="rowClassName"
        :columns="columns"
        :dataSource="dataSource"
        :rowKey="(record, index) => index"
        :pagination="false"
      ></a-table>
      <div slot="footer">
        <a-button @click.stop="close">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { STable } from '@/components'
import { danceTimeList } from '@/utils/intentionStu/adviser'
import { getRepeatStuUser } from '@/api/student'

// 只有资源，没有学员
const columns1 = [
  {
    title: '录入时间',
    dataIndex: 'createDate'
  },
  {
    title: '学员姓名',
    dataIndex: 'userName'
  },
  {
    title: '性别',
    dataIndex: 'userSex',
    customRender: (text, record) => (text === 'A' ? '男' : text === 'B' ? '女' : '')
  },
  {
    title: '手机号码',
    dataIndex: 'userPhone'
  },
  {
    title: 'QQ号',
    dataIndex: 'userQQ'
  },
  {
    title: '微信号',
    dataIndex: 'userWechat'
  },
  {
    title: '省市',
    dataIndex: 'userArea'
  },
  {
    title: '资源渠道',
    dataIndex: 'channelName'
  },
  // {
  //   title: '资源来源',
  //   dataIndex: 'userSource'
  // },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '班型',
    dataIndex: 'typeName'
  },
  {
    title: '分配分馆',
    dataIndex: 'schoolName'
  },
  {
    title: '跟进顾问',
    dataIndex: 'stuUserAdviser'
  },
  {
    title: '客服人员',
    dataIndex: 'userSource'
  },
  {
    title: '是否报名',
    dataIndex: 'isSignUp',
    customRender: (text, record) => (text ? '是' : '否')
  },
  {
    title: '标签',
    dataIndex: 'stuTags'
  },
  {
    title: '客户年龄',
    dataIndex: 'userAge'
  },
  {
    title: '学舞目的',
    dataIndex: 'dancePurpose'
  },
  {
    title: '学舞时间',
    dataIndex: 'learningDanceTime'
  },
  {
    title: '舞蹈类型',
    dataIndex: 'likeDanceType'
  },
  {
    title: '备注',
    dataIndex: 'userRemark'
  }
]
// 学员
const columns2 = [
  {
    title: '学员姓名',
    dataIndex: 'userName'
  },
  {
    title: '性别',
    dataIndex: 'userSex',
    customRender: (text, record) => (text === 'A' ? '男' : text === 'B' ? '女' : '')
  },
  {
    title: '手机号码',
    dataIndex: 'userPhone'
  },
  {
    title: 'QQ号',
    dataIndex: 'userQQ'
  },
  {
    title: '微信号',
    dataIndex: 'userWechat'
  },
  {
    title: '所属顾问',
    dataIndex: 'orgUserAdviser'
  },
  {
    title: '所属分馆',
    dataIndex: 'deptName'
  },
  {
    title: '跟进顾问',
    dataIndex: 'stuUserAdviser'
  },
  {
    title: '客服人员',
    dataIndex: 'serviceName'
  },
  {
    title: '是否报名',
    dataIndex: 'isSignUp',
    customRender: (text, record) => (text ? '是' : '否')
  }
]

export default {
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      columns: [],
      dataSource: []
    }
  },
  created() {},
  methods: {
    rowClassName(record, idx) {
      if (idx % 2 === 1) return 'ant-table-even'
    },
    open({ userPhone = null, userQQ = null, userWechat = null }) {
      this.visible = true
      getRepeatStuUser({ userPhone, userQQ, userWechat }).then(res => {
        this.dataSource = res.data.res || []
        this.columns = res.data.flag == 1 ? columns1 : columns2
      })
    },
    close() {
      this.dataSource = []
      this.visible = false
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
/deep/.ant-table-thead > tr > th {
  white-space: nowrap;
}
</style>
