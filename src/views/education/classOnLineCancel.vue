<template>
  <div class="teacher-demand-wrapper" ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div style="text-align:right; margin: 10px 0; " ref="elementBtn">
        <a-radio-group @change="changeCheck" :default-value="queryParam.status" button-style="solid" v-model="queryParam.status">
          <a-radio-button value="C">待确认</a-radio-button>
          <a-radio-button value="D">已确认</a-radio-button>
          <a-radio-button value="">全部</a-radio-button>
        </a-radio-group>
      </div>
      <div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm="education:class-url:import">
          <!-- <a-button @click="dataImportHandle" type="primary" style="margin-bottom: 15px">邀请码导入</a-button> -->
        </perm-box>
      </div>
      <s-table :showSlider="true" ref="table" :scroll="{ x: 2000 }" :columns="columns" :data="loadData" :rowKey="(record, index) => index">
        <!-- <a-table ref="table" size="default" :columns="columns" :dataSource="dataArr" :rowKey="(record, index) => index" :pagination="false">-->
        <span slot="action" slot-scope="text, record">
          <perm-box perm="">
            <a href="#" @click="copy(record)">复制</a>
          </perm-box>
          <perm-box perm="education:class-url-unbind:confirm" v-if="queryParam.status !== 'D'">
            <a href="#" @click="affirm(record)">确认</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { SearchComPro, STable } from '@/components'
import { getCancelClassUrl, confirmUnBindSutUser } from '@/api/education'
import PermBox from '@/components/PermBox'
import { listEduDance } from '@/api/common'
import { getSchoolList, getTitleList } from '@/api/education/card'

const columns = [
  {
    title: '提交作废分馆',
    dataIndex: 'deptName'
  },
  {
    title: '提交作废日期',
    dataIndex: 'date'
  },
  {
    title: '学员信息（学员姓名/手机号/卡号/卡名）',
    dataIndex: 'stuName',
    customRender: (text, record) => {
      const { stuName, stuPhone, stuCardNo, cardName } = record
      return `${stuName}/${stuPhone}/${stuCardNo}/${cardName}`
    },
    width: 400
  },
  {
    title: '作废码',
    dataIndex: 'url',
    width: 520
  },
  {
    title: '邀请码标题',
    dataIndex: 'invitationTitle',
    width: 230
  },
  {
    title: '邀请码类型',
    dataIndex: 'invitationType',
    customRender: (text, record) => {
      switch (text) {
        case 'A':
          return '线上体验课'
        case 'B':
          return '教练预习课'
        case 'C':
          return '教练班资料包'
        case 'D':
          return '线上课码'
      }
    }
  },
  {
    title: '邀请码批次',
    dataIndex: 'batchId'
  },
  {
    title: '作废状态',
    dataIndex: 'status',
    customRender: (text, record) => {
      const { status } = record
      switch (status) {
        case 'C':
          return '已作废待确认'
        case 'D':
          return '已确认已作废'
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      height: 0, //滚动条高度
      columns,
      searchParams: [
        // {
        //   type: 'chooseModal',
        //   key: 'cardName', // 当chooseModal类型下 key为cardName时将调用另外的弹出组件
        //   label: '选择卡种',
        //   placeholder: '请选择卡种'
        // },
        {
          type: 'treeSelect',
          isShow: !this.$store.getters.school_id,
          key: 'schoolId',
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
          label: '作废日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select', //动态select框
          key: 'invitationTitle',
          label: '邀请码标题',
          placeholder: '请选择邀请码标题',
          // search:true,
          apiOption: {
            api: getTitleList, // promise类型的接口
            string: 'title',
            value: 'title'
          }
        }
      ],
      queryParam: {
        status: 'C'
      },
      loadData: parameter => {
        return getCancelClassUrl(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },

  components: {
    SearchComPro,
    PermBox,
    STable
  },

  computed: {},

  created() {},

  methods: {
    copy(record) {
      let url = record.url
      this.$copyText(url)
        .then(message => {
          this.$message.success('复制完毕')
        })
        .catch(err => {
          this.$message.error('复制失败')
        })
    },
    changeCheck(e) {
      const val = e.target.value
      this.queryParam.status = val
      this._refreshTable()
    },
    affirm(record) {
      this.$confirm({
        title: '系统提示',
        content: '确定要确认吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          confirmUnBindSutUser(record.id).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '确认成功'
            })
            this._refreshTable()
          })
        }
      })
    },
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
<style lang="less" scoped></style>
