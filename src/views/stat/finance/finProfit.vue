<template>
  <a-card>
    <a-tabs default-active-key="1" :activeKey="activeKey" @tabClick="onChange">
      <a-tab-pane key="1" tab="资产负债表(非私教)" forceRender>
        <div class="fin-profit-date-wrapper" v-if="activeKey == 1">
          <f-frame :searchParamsArray="searchParams" src="/report?name=fin_profit_date" perm="finance:stat:profitcard"></f-frame>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="资产负债表(私教)" forceRender>
        <div class="fin-profit-count-wrapper" v-if="activeKey == 2">
          <f-frame :searchParamsArray="searchParams" src="/report?name=fin_profit_count" perm="finance:stat:profitcard"></f-frame>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="资产负债表(定金)" forceRender>
        <div class="fin-profit-price-wrapper" v-if="activeKey == 3">
          <f-frame :searchParamsArray="searchParamsT" src="/report?name=fin_profit_price" perm="finance:stat:profitcard" date="month"></f-frame>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listEduDance, listEduType } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'finProfit',
  data() {
    return {
      activeKey: '1',
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '录入时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'cascader',
          key: 'areaSchoolId',
          isShow: !!!this.$store.getters.school_id,
          search: true,
          label: '地区/分馆',
          show: true,
          placeholder: '请选择地区/分馆',
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          show: true,
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select', //动态select框
          key: 'eduTypeId',
          show: true,
          label: '类型',
          placeholder: '请选择类型',
          apiOption: {
            api: listEduType, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'stuType',
          label: '卡属性',
          placeholder: '请选择卡属性',
          show: true,
          staticArr: [
            {
              string: '正常',
              value: 'A'
            },
            {
              string: '赠卡',
              value: 'B'
            },
            {
              string: '老卡',
              value: 'C'
            }
          ]
        }
      ],
      searchParamsT: [
        {
          type: 'date',
          key: 'Date',
          label: '录入时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'cascader',
          key: 'areaSchoolId',
          isShow: !!!this.$store.getters.school_id,
          search: true,
          label: '地区/分馆',
          show: true,
          placeholder: '请选择地区/分馆',
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        }
      ]
    }
  },
  methods: {
    onChange(e) {
      this.activeKey = e
    }
  }
}
</script>

<style lang="less" scoped></style>
