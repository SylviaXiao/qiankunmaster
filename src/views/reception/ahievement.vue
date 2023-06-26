<template>
  <div class="ahievement-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="table-wrapper">
        <perm-box perm="finance:achievement:view">
          <s-table ref="table" :columns="columns" :data="tableLoad" rowKey="id">
            <span slot="stuName" slot-scope="text, record">
              <perm-box :text="record.stuName" perm="student:info:view">
                <router-link :to="{ path: `/reception/studentInfo/${record.stuId}` }">{{ text }}</router-link>
              </perm-box>
            </span>
            <span slot="action" slot-scope="text, record">
              <template>
                <perm-box perm="finance:achievement:change">
                  <a href="javascript:;" @click="changeAchi(record)">修改绩效</a>
                </perm-box>
              </template>
            </span>
          </s-table>
        </perm-box>
      </div>
    </a-card>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="1000"
      title="修改绩效"
      :visible="achiModal"
      okText="保存"
      cancelText="取消"
      :confirmLoading="achivementConfirmLoading"
      @cancel="cancelModal"
      @ok="saveAhievement()"
    >
      <belongs-table ref="belongsTable" :total="999999999" :data-backing="achiInfo" :hideSourceDetailList="achiInfo.totalPrice < 0" @changeSource="handleChangeSource"></belongs-table>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { pageAchievement, detailAchievement, changeAchievement } from '@/api/recep'
import BelongsTable from '@/components/BelongsTable'
import { getSchoolList } from '@/api/education/card'
import { getConfig, cardNextType } from '@/api/education'
import { listStuCardNextLog } from '@/api/reception/student'
import { listSysValConf } from '@/api/common'
import moment from 'moment'

const columns = [
  {
    title: '操作日期',
    key: 'createDate',
    dataIndex: 'createDate'
  },
  {
    title: '缴费日期/付款时间',
    key: 'tradeDate',
    dataIndex: 'tradeDate'
  },
  {
    title: '学号',
    key: 'stuNo',
    dataIndex: 'stuNo'
  },
  {
    title: '姓名',
    key: 'stuName',
    dataIndex: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    key: 'stuPhone',
    dataIndex: 'stuPhone'
  },
  {
    title: '缴费类型',
    dataIndex: 'type',
    key: 'type',
    customRender: text => {
      return text === 'A' ? '全款' : text === 'B' ? '定金' : text === 'C' ? '补缴' : text === 'D' ? '退款' : ''
    }
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue',
    key: 'dictValue'
  },
  {
    title: '收款金额',
    dataIndex: 'totalPrice',
    key: 'totalPrice'
  },
  {
    title: '绩效',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '所属人',
    dataIndex: 'adviserName',
    key: 'adviserName'
  },
  {
    title: '资源来源',
    dataIndex: 'source',
    key: 'source'
  },
  {
    title: '业绩分馆',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '提交分馆',
    dataIndex: 'financeDeptName',
    key: 'financeDeptName'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'ahievement',
  components: {
    STable,
    PermBox,
    SearchComPro,
    BelongsTable
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'ahievement') {
          let { deptId, endDate, startDate, stuPhone, master, finDeptId, startPayDate, endPayDate ,orgDeptId,masterId} = this.$route.query
          if (deptId) this.queryParam.orgDeptId = deptId
          if (startDate) this.queryParam.startDate = startDate
          if (endDate) this.queryParam.endDate = endDate
          if (stuPhone)  this.queryParam.stuInfo = stuPhone
          if (master) this.queryParam.master = master
          if(masterId)this.queryParam.masterId=masterId
          if (finDeptId) this.queryParam.school_id = finDeptId
          if(orgDeptId) this.queryParam.orgDeptId=orgDeptId
          if (startPayDate) this.queryParam.startPayDate = startPayDate
          if (endPayDate) this.queryParam.endPayDate = endPayDate
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      columns,
      tableLoad: parameter => {
        return pageAchievement(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      queryParam: {},
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '提交分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '操作时间',
          placeholder: '请提交时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'text',
          key: 'stuInfo',
          label: '学员信息',
          placeholder: '学号/姓名/手机号'
        },
        {
          type: 'chooseModal',
          key: 'service',
          label: '客服',
          placeholder: '请选择客服'
        },
        {
          type: 'chooseModal',
          key: 'master',
          label: '顾问',
          placeholder: '请选择顾问'
        },
        {
          type: 'text',
          key: 'resourceSou',
          label: '资源来源',
          placeholder: '资源来源'
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'orgDeptId',
          label: '业绩分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'income',
          label: '收支类型',
          placeholder: '请选择',
          allowClear: true,
          staticArr: [{ string: '收入', value: 'true' }, { string: '退费', value: 'false' }]
        },
        {
          type: 'select',
          key: 'isHalf',
          label: '退费业绩减半',
          placeholder: '请选择是否减半',
          staticArr: [
            {
              string: '减半',
              value: 'true'
            },
            {
              string: '不减半',
              value: 'false'
            }
          ]
        },
        {
          type: 'date',
          key: 'PayDate',
          label: '缴费时间',
          placeholder: '请缴费时间',
          format: 'YYYY-MM-DD'
        }
      ],
      achiModal: false,
      totalPrice: 0,
      achiInfo: {},
      // 
      currentRecord: null,
      showPreviousCard: false,
      achivementConfirmLoading: false,
    }
  },
  methods: {
    changeAchi(record) {
      this.currentRecord = record
      const { financeId } = record
      this.achiModal = true
      detailAchievement(financeId).then(res => {
        this.achiInfo = res.data
        this.totalPrice = res.data.totalPrice
      })
    },
    saveAhievement() {
      const { $notification } = this
      this.achivementConfirmLoading = true
      this.$refs.belongsTable
        .getAllValue()
        .then(res => {
          return changeAchievement(res.financeId, res)
        })
        .then(res => {
          $notification.success({
            message: '系统通知',
            description: '提交成功'
          })
          this.achiModal = false
          this.$refs.belongsTable.initBelongs()
          this.$refs.table.refresh()
        }).finally(() => {
          this.achivementConfirmLoading = false
        })
    },
    cancelModal() {
      this.achiModal = false
      this.$refs.belongsTable.initBelongs()
    },
    //搜索功能
    searchSubmit(data) {
      this.queryParam = data
      this.$refs.table.refresh()
    },
    handleChangeSource(value) {
      let isContinued = value === '会员续卡'
      if (isContinued) {
        this.queryPreviousCard()        
      }
      this.showPreviousCard = isContinued
    },
    async queryPreviousCard() {
      const res = await listStuCardNextLog({ stuId: this.currentRecord.stuId })
      if (res.code == 200) {
        this.issueCards = res.data.map(item => {
          if (item.endDate) {
            let date = item.endDate.split(' ')[0]
            item.cardMsg = `${item.stuCardNo}${item.cardName}(${date})`
          } else {
            item.cardMsg = `${item.stuCardNo}${item.cardName}`
          }
          return item
        })
      }
    },
  }
}
</script>

<style scoped></style>
