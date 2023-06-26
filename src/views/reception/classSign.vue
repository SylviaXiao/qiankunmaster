<template>
  <div class="class-sign-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro
        :style="{ padding: '10px 0' }"
        @searchSubmit="searchSubmit"
        @searchSelectChange="searchSelectChange"
        ref="searchCom"
        :searchParams="selectKey === 1 ? searchParams : searchParams_two"
      ></search-com-pro>
    </a-card>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle">
        <a-tab-pane :tab="item.name" v-for="(item, index) in tabList" :key="item.id">
          <a-card :bordered="false">
            <s-table
              :ref="`table${index}`"
              :columns="selectKey === 1 ? columns : two_columns"
              :data="selectKey === 1 ? tableLoad : tableLoad_two"
              :rowKey="rowKey => `${rowKey.id}-${Math.random()}`"
            >
              <span slot="substartDate" slot-scope="text, record">
                {{ `${record.substartDate}/${$tools.tailor.getTime(record.subendDate)}` }}
              </span>
              <span slot="signDate" slot-scope="text, record" v-if="selectKey === 1">
                <span>{{ $tools.tailor.getDateTimes(record.signDate) }}</span>
              </span>
              <span slot="signDate" slot-scope="text, record" v-else>
                <span>{{ $tools.tailor.getDate(record.signDate) }}</span>
              </span>
              <span slot="date" slot-scope="text, record">
                <span>{{ $tools.tailor.getDate(record.date) }}</span>
              </span>
              <span slot="startDate" slot-scope="text, record">
                {{ `${$tools.tailor.getDate(record.startDate)}    ${$tools.tailor.getTime(record.startDate)} ~ ${$tools.tailor.getTime(record.endDate)} ` }}
              </span>
            </s-table>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import SearchComPro from '@/components/SearchComPro'
import STable from '@/components/Table'
import { pageClassSignSummary, pageSubstituteTeacher } from '@/api/recep'
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'

const defaultStart = moment()
  .subtract(0, 'days')
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .subtract(0, 'days')
  .format('YYYY-MM-DD')
const columns = [
  {
    title: '分馆名称',
    dataIndex: 'deptName',
    width: 150
  },
  {
    title: '签到时间',
    dataIndex: 'signDate',
    scopedSlots: { customRender: 'signDate' },
    width: 200
  },
  {
    title: '签到人',
    dataIndex: 'name',
    width: 150
  },
  {
    title: '班级名称',
    dataIndex: 'className'
  },
  {
    title: '教室名称',
    dataIndex: 'roomName',
    width: 200
  },
  {
    title: '上课时间',
    dataIndex: 'startDate',
    scopedSlots: { customRender: 'startDate' },
    width: 200
  }
]
const two_columns = [
  {
    title: '分馆',
    dataIndex: 'deptName',
    width: 150
  },
  {
    title: '录入时间',
    dataIndex: 'signDate',
    scopedSlots: { customRender: 'signDate' },
    width: 200
  },
  {
    title: '老师姓名',
    dataIndex: 'name',
    width: 150
  },
  {
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    title: '代课班级',
    dataIndex: 'className',
    width: 200
  },
  {
    title: '代课时间',
    dataIndex: 'substartDate',
    scopedSlots: { customRender: 'substartDate' },
    width: 200
    // customRender: (text, record) => {
    //   return record.substartDate +'~'+record.subendDate
    // }
  },
  {
    title: '结算情况',
    dataIndex: 'settle',
    scopedSlots: { customRender: 'settle' },
    width: 200,
    customRender: (text, record) => {
      return record.settle === 1 ? '已结算' : record.settle === 0 ? '未结算' : ''
    }
  },
  {
    title: '结算时间',
    dataIndex: 'date',
    scopedSlots: { customRender: 'date' },
    width: 200
  }
]
export default {
  name: 'classSign',
  components: {
    SearchComPro,
    STable
  },
  data() {
    return {
      columns,
      two_columns,
      queryParam: {},
      tableLoad: parameter => {
        let defaultDate = {
          startDate: defaultStart,
          endDate: defaultEnd
        }
        let correctParams = this.queryParam.hasOwnProperty('Date') ? this.queryParam : Object.assign({}, defaultDate, this.queryParam)
        console.log(Object.assign(parameter, correctParams))
        return pageClassSignSummary(Object.assign(parameter, correctParams)).then(res => {
          return res
        })
      },
      tableLoad_two: parameter => {
        console.log(parameter)
        return pageSubstituteTeacher(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '选择时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
        {
          type: 'text',
          key: 'deptName',
          label: '分馆名称',
          placeholder: '请输入分馆'
        },
        {
          type: 'select', // 静态select框
          key: 'tecType',
          allowClear: false,
          initialValue: 'A',
          label: '类型',
          placeholder: '请选择类型',
          staticArr: [
            { string: '导师', value: 'A' },
            { string: '顾问', value: 'B' },
            { string: '助教', value: 'C' }
          ]
        },
        {
          type: 'text',
          key: 'name',
          label: '姓名',
          placeholder: '请输入姓名'
        }
      ],
      searchParams_two: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: true,
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
          label: '结算时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select', // 静态select框
          key: 'settle',
          allowClear: false,
          label: '结算情况',
          placeholder: '请选择类型',
          staticArr: [
            { string: '已结算', value: '1' },
            { string: '未结算', value: '0' },
            { string: '全部', value: '' }
          ]
        },
        {
          type: 'text',
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称'
        },
        {
          type: 'text',
          key: 'name',
          label: '老师姓名',
          placeholder: '请输入老师姓名'
        },
        {
          type: 'text',
          key: 'phone',
          label: '老师手机号',
          placeholder: '请输入老师手机号'
        }
      ],
      tabList: [],
      tab: [
        { name: '班级导师签到', id: 1, perm: 'education:signinlog:view' },
        { name: '代课导师签到', id: 2, perm: 'education:substitute-teacher:view' }
      ],
      selectKey: 1
    }
  },
  created() {
    this.getTab()
  },
  methods: {
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    getTab() {
      let arr = ['education:signinlog:view', 'education:substitute-teacher:view']
      arr.forEach(item => {
        if (this.handlePermBox(item)) {
          this.tabList.push(this.tab.find(todo => todo.perm === item))
        }
      })
    },
    selectKeyHandle(e) {
      this.selectKey = e
      this._refreshTable()
    },
    searchSelectChange() {},
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      if (this.tabList.length === 2) {
        let index = null
        switch (this.selectKey) {
          case 1:
            index = '0'
            break
          case 2:
            index = '1'
            break
        }
        let str = `table${index}`
        this.$nextTick(() => {
          this.$refs[str][0].refresh()
        })
      } else {
        this.$nextTick(() => {
          this.$refs['table0'].refresh()
        })
      }
    }
  }
}
</script>

<style scoped></style>
