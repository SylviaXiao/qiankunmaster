<template>
  <div class="teacher-finance-wrapper" ref="elementAll" style="height:calc(100vh - 148px)">
    <div class="search-wrapper" ref="elementSearch">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"> </search-com-pro>
      </a-card>
    </div>
    <div class="table-wrapper">
      <a-card :bordered="false">
        <s-table
          :showSlider="true"
          :sliderIndex="0"
          ref="table"
          :columns="tableColumns"
          :data="tableLoad"
          :rowKey="(record, index) => index + record.id"
          :scroll="{ x: 1800 }"
        >
          <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:finteacher:change">
              <a href="javascript:;" @click="editFinteacher(record)">修改业绩</a>
            </perm-box>
            <perm-box perm="finance:finteacher:remove">
              <a href="javascript:;" @click="removeTeacherFinance(record)">删除</a>
            </perm-box>
          </span>
          <span slot="tradeDate" slot-scope="text">
            {{ text | filterDate }}
          </span>
        </s-table>
      </a-card>
    </div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="960"
      title="修改绩效"
      :visible="achiModal"
      :showSource="false"
      okText="保存"
      cancelText="取消"
      @cancel="cancelModal"
      @ok="saveAhievement()"
    >
      <a-spin :spinning="spinning">
        <BelongsTable ref="belongsTable" :showSource="false" :total="total" :data-backing="achiInfo"></BelongsTable>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import BelongsTable from '@/components/BelongsTable'
import PermBox from '@/components/PermBox'

import { pageFinTeacher, finTeacherChange, finTeacherDelete, finTeacherDetail } from '@/api/recep'
import { getSchoolList } from '@/api/education/card'

const tableColumns = [
  {
    title: '日期',
    dataIndex: 'tradeDate',
    scopedSlots: { customRender: 'tradeDate' }
  },
  {
    title: '学号',
    dataIndex: 'stuNo'
  },
  {
    title: '姓名',
    dataIndex: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone'
  },
  {
    title: '学生卡卡号',
    dataIndex: 'stuCardNo'
  },
  {
    title: '资源来源',
    dataIndex: 'source'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    width: 180
  },

  {
    title: '缴费类型',
    dataIndex: 'type',
    customRender: text => {
      return text === 'A' ? '全款' : text === 'B' ? '定金' : text === 'C' ? '补缴' : text === 'D' ? '退款' : ''
    }
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue'
  },
  {
    title: '收款金额',
    dataIndex: 'totalPrice'
  },
  {
    title: '业绩金额',
    dataIndex: 'teacherPrice'
  },
  {
    title: '提成比例',
    dataIndex: 'teacherRatio',
    customRender: text => {
      return text + '%'
    }
  },
  {
    title: '实际绩效',
    dataIndex: 'teacherPerf'
  },
  {
    title: '所属人',
    dataIndex: 'teacherName',
    width: 180
  },
  {
    title: '所属分馆',
    dataIndex: 'deptName'
  },
  {
    title: '备注',
    dataIndex: 'teacherRemark',
    width: 150
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'teacherFinance',
  components: {
    STable,
    SearchComPro,
    PermBox,
    BelongsTable
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'finaAuditionDeduct') {
          let { deptId, endDate, startDate, stuPhone, teacher ,teacherRatio} = this.$route.query
          this.queryParam = {}
          if (deptId) this.queryParam.school_id = deptId
          if (endDate) this.queryParam.endDate = endDate
          if (startDate) this.queryParam.startDate = startDate
          if (stuPhone) this.queryParam.stuInfo = stuPhone
          if (teacher) this.queryParam.teacher = teacher
          if (teacherRatio) this.queryParam.teacherRatio = teacherRatio
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
      height: 0, //滚动条高度
      // 修改业绩
      total: 0,
      achiModal: false,
      achiInfo: {},
      spinning: false,

      tableColumns,
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '选择分馆',
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
          label: '选择时间',
          placeholder: '请选择时间',
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
          key: 'teacher',
          label: '导师',
          placeholder: '请选择导师'
        },
        {
          type: 'text',
          key: 'cardNo',
          label: '学员卡卡号',
          placeholder: '卡号/卡种名称'
        },
        {
          type: 'text',
          key: 'resourceSou',
          label: '资源来源',
          placeholder: '资源来源'
        },
        {
          type: 'select', // 静态select框
          key: 'teacherRatio',
          label: '提成比例',
          placeholder: '请选择提成比例',
          staticArr: [
            {
              string: '2%',
              value: 2
            },
            {
              string: '5%',
              value: 5
            },
            {
              string: '7%',
              value: 7
            }
          ]
        }
      ],
      queryParam: {},
      tableLoad: this.getTeacherFinanceList
    }
  },

  methods: {
    cancelModal() {
      this.achiModal = false
    },
    saveAhievement() {
      this.$refs.belongsTable.getTeacherValue().then(res => {
        const params = {
          financeId: this.financeId,
          finTeachers: JSON.stringify(res)
        }
        if (res.length === 1 && !res[0].teacherId) {
          delete params.finTeachers
        }
        finTeacherChange(this.financeId, params).then(() => {
          this.cancelModal()
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.$refs.table.refresh()
        })
      })
    },
    editFinteacher(record) {
      this.financeId = record.financeId
      this.achiModal = true
      this.spinning = true
      finTeacherDetail(record.financeId)
        .then(res => {
          this.total = res.data.finance && res.data.finance.price
          this.achiInfo = res.data
        })
        .finally(() => {
          this.spinning = false
        })
    },
    getTeacherFinanceList(parameter) {
      const { queryParam } = this
      const params = Object.assign(parameter, queryParam)
      return pageFinTeacher(params).then(res => {
        console.log(res)
        return res
      })
    },
    removeTeacherFinance(record) {
      const { financeId } = record
      const { $confirm, $notification, $refs } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          finTeacherDelete(financeId).then(res => {
            $notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            $refs.table.refresh()
          })
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less"></style>
