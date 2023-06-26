<template>
  <div>
    <a-card :bordered="false" style="margin: 20px 0 ;">
      <search-com-pro :searchParams="searchParams" @searchSubmit="searchSubmit" />
    </a-card>
    <a-card>
      <div class="mb-10">
        <a-space :size="10">
          <a-button type="primary" icon="download" @click="handleExport">导出</a-button>
        </a-space>
      </div>
      <s-table ref="table" :columns="columns" :rowKey="(record, index) => index" :data="loadData">
        <span v-for="(value, key) in headerTips" :slot="key" :key="key">
          <a-tooltip>
            <template slot="title">
              <p v-for="(para, paraIndex) in value.desc" :key="paraIndex">{{ para }}</p>
            </template>
            <div>
              <span style="white-space: pre-line;">{{ value.header }}</span>
              <a-icon class="ml-4" type="info-circle" />
            </div>
          </a-tooltip>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { SearchComPro, PermBox, STable } from '@/components'
import { listEduDance, treeEduClassType, listEduType } from '@/api/common'
import { getSchoolList } from '@/api/education/card'
import { getCoachClassRenewalDetails, exportCoachClassRenewalDetails } from '@/api/education'
import moment from 'moment'
const defaultStart = moment()
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  // .add(1, 'months')
  // .date(0)
  .format('YYYY-MM-DD')

  const schoolIds =['0c18166a-679b-414e-ac2e-c05ba7a2f4c4', '8f63afe7-09ca-4d11-ac51-1187e4381e63', '407913a7-76ff-40ce-967f-0ce0bf0bcdd3', '8109e909-8c8e-463a-9e10-a0804bc59b79', '150d8748-87ab-4935-8f6f-7233d1294413', '4c58a4b3-157b-493f-8b72-707196a26453', 'e07cad7c-7415-421c-a77e-48146d33a3bc', '0c185455-7ae8-4207-a517-91a2f5f26030', '88c5e24d-15c1-4e7c-adfb-f5e291562c33', '5aa46e02-28b9-4e31-936f-60721e07696d', '2d30de5a-9e47-4669-a9e9-534085ab6353', '7b0f4b73-83d9-4d46-adb0-78138e7ed633', '080aabad-e46b-479e-b130-169e970427e0', '66298d15-894b-4e48-9551-5d3795470304', '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f', 'e950d114-9106-4dc2-a9ed-9bea5da888bc', 'b337887b-ce9d-49e6-89c5-4f822c94d457', '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f', '50232e74-16d1-438d-9c09-bc7454b13fe0', '999e8fb9-6c98-4cc5-bab3-2a2937a36836', 'd923d38e-1699-4137-8f2a-315dcf2fa017', '5c0f0a94-346f-4e82-8848-f8882a7ac0ae', '7aa9901b-6d7f-44a3-8640-e0935516514c', '1207948e-746c-4dc3-9dd8-ab9c4493b49e', '47a6e64a-c166-4bb6-874c-f7e5c91666d7', 'c066c789-e642-45c8-9486-d7e684d44dca', '457cadbe-f9a8-4d18-87b4-85051f99898b', '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a', 'b29cfda3-9609-4939-a8c4-4fe240f54f91']

const columns = [
  {
    title: '地区',
    width: 120,
    align: 'center',
    fixed: 'left',
    dataIndex: 'area'
  },
  {
    title: '上课分馆',
    width: 140,
    align: 'center',
    fixed: 'left',
    dataIndex: 'deptName'
  },
  {
    title: '班级名称',
    width: 160,
    align: 'center',
    fixed: 'left',
    dataIndex: 'className'
  },
  {
    title: '舞种',
    width: 120,
    align: 'center',
    dataIndex: 'danceName'
  },
  {
    title: '班型',
    width: 120,
    align: 'center',
    dataIndex: 'classTypeName'
  },
  {
    title: '开班时间',
    width: 120,
    align: 'center',
    dataIndex: 'startDate'
  },
  {
    title: '结业时间',
    width: 120,
    align: 'center',
    dataIndex: 'endDate'
  },
  {
    title: '班级状态',
    width: 120,
    align: 'center',
    dataIndex: 'state',
    customRender: (val, record) => {
      switch (val) {
        case 'A':
          return '计划中'
        case 'B':
          return '上课中'
        case 'C':
          return '已结业'
        case 'D':
          return '停课'
        default:
          return val
      }
    }
  },
  {
    title: '上课导师',
    width: 120,
    align: 'center',
    dataIndex: 'teacherName'
  },
  {
    title: '班级顾问',
    width: 120,
    align: 'center',
    dataIndex: 'orgUserMaster'
  },
  {
    // title: '上课人数',
    width: 120,
    align: 'center',
    dataIndex: 'classPersonCount',
    slots: { title: 'classPersonCount' }
  },
  {
    // title: '流失总人数',
    width: 120,
    align: 'center',
    dataIndex: 'lostPersonCount',
    slots: { title: 'lostPersonCount' }
  },
  {
    // title: '开班后一周内流失',
    width: 120,
    align: 'center',
    dataIndex: 'oneWeekLostPersonCount',
    slots: { title: 'oneWeekLostPersonCount' }
  },
  {
    // title: '一阶连报人数',
    width: 120,
    align: 'center',
    dataIndex: 'oneLevelPersonCount',
    slots: { title: 'oneLevelPersonCount' }
  },
  {
    // title: '续卡总数（本期）',
    width: 120,
    align: 'center',
    dataIndex: 'bqxcCardCount',
    slots: { title: 'bqxcCardCount' }
  },
  {
    // title: '续卡未开卡卡数（本期）',
    width: 120,
    align: 'center',
    dataIndex: 'bqxcwkcCardCount',
    slots: { title: 'bqxcwkcCardCount' }
  },
  {
    // title: '续卡人数（本期）',
    width: 120,
    align: 'center',
    dataIndex: 'bqxcPersonCount',
    slots: { title: 'bqxcPersonCount' }
  },
  {
    // title: '续卡总数（往期）',
    width: 120,
    align: 'center',
    dataIndex: 'wqxcCardCount',
    slots: { title: 'wqxcCardCount' }
  },
  {
    // title: '续卡未开卡卡数（往期）',
    width: 120,
    align: 'center',
    dataIndex: 'wqxcwkcCardCount',
    slots: { title: 'wqxcwkcCardCount' }
  },
  {
    // title: '续卡人数（往期）',
    width: 120,
    align: 'center',
    dataIndex: 'wqxcPersonCount',
    slots: { title: 'wqxcPersonCount' }
  },
  {
    // title: '开班前已续人数',
    width: 120,
    align: 'center',
    dataIndex: 'kbqyxPersonCount',
    slots: { title: 'kbqyxPersonCount' }
  },
  {
    // title: '开班后续卡人与开班前续人头重复人数',
    width: 120,
    align: 'center',
    dataIndex: 'kbhxcykbqwxPersonCount',
    slots: { title: 'kbhxcykbqwxPersonCount' }
  },
  {
    // title: '开班前未续人数',
    width: 120,
    align: 'center',
    dataIndex: 'kbqwxPersonCount',
    slots: { title: 'kbqwxPersonCount' }
  },
  {
    // title: '开班前未续学员在开班后续卡人数（本期）',
    width: 120,
    align: 'center',
    dataIndex: 'kbqwxkbhyxPersonCount',
    slots: { title: 'kbqwxkbhyxPersonCount' }
  },
  {
    // title: '续卡卡数（教续其他）',
    width: 120,
    align: 'center',
    dataIndex: 'jlqtxcCardCount',
    slots: { title: 'jlqtxcCardCount' }
  },
  {
    // title: '续卡未开卡卡数（教续其他）',
    width: 120,
    align: 'center',
    dataIndex: 'jlqtxcwkcCardCount',
    slots: { title: 'jlqtxcwkcCardCount' }
  },
  {
    // title: '教续其他金额',
    width: 120,
    align: 'center',
    dataIndex: 'jlqtxcMoney',
    slots: { title: 'jlqtxcMoney' }
  },
  {
    // title: '总续卡卡数',
    width: 120,
    align: 'center',
    dataIndex: 'totalXCCardCount',
    slots: { title: 'totalXCCardCount' }
  },
  {
    // title: '总续卡人数',
    width: 120,
    align: 'center',
    dataIndex: 'totalXCPersonCount',
    slots: { title: 'totalXCPersonCount' }
  },
  {
    // title: '总续卡金额',
    width: 120,
    align: 'center',
    dataIndex: 'totalXCMoney',
    slots: { title: 'totalXCMoney' }
  }
]

const headerTips = {
  classPersonCount: {
    header: '上课人数',
    desc: ['①被检索的班级数量里面，历史签到总人数，人数去重', '②签到卡种退卡、结转不需要回退人数']
  },
  lostPersonCount: {
    header: '流失总人数',
    desc: ['①被检索的班级数量里，截止当前，签到卡种存在退费或结转的卡数量-人数', '②人数去重']
  },
  oneWeekLostPersonCount: {
    header: '开班后一周内流失',
    desc: ['①开班一周内流失人数，签到卡种存在退费或结转的卡数量-人数', '②人数去重']
  },
  oneLevelPersonCount: {
    header: '一阶连报人数',
    desc: [
      '①该字段仅班型为【教练班-教练班】才有数据，其余为空',
      '②被检索的班级【教练班-教练班】，签到卡种为【教练班-教练班】卡：判断签到的【教练班-教练班】卡是学员的第一张（正式）卡，且开班前存在其余已缴清的教练班、集训班的卡，则算连报.一个学员最多算1'
    ]
  },
  bqxcCardCount: {
    header: '续卡卡数\n（本期）',
    desc: ['①所筛选的班级里，签到卡种-作为往期卡-续卡卡数。续卡班型为教练班（含集训班）', '②续卡时间【开班至实际结业30天内】', '③续卡为已缴清；续卡卡数不去重']
  },
  bqxcwkcCardCount: {
    header: '续卡未开卡卡数\n（本期）',
    desc: ['①续卡卡数（本期）当前未激活的卡数量']
  },
  bqxcPersonCount: {
    header: '续卡人数\n（本期）',
    desc: ['①所筛选的班级，上课学员存在【续卡卡数（本期）】人数，去重']
  },
  wqxcCardCount: {
    header: '续卡卡数\n（往期）',
    desc: [
      '①所筛选的班级里，签到卡种-作为往期卡-续卡卡数。续卡班型为教练班（含集训班）',
      '②续卡时间【实际结业了30天至当前】即从结业第31天至当前',
      '③续卡为已缴清；续卡卡数不去重 '
    ]
  },
  wqxcwkcCardCount: {
    header: '续卡未开卡卡数\n（往期）',
    desc: ['①续卡卡数（往期）当前未激活的卡数量']
  },
  wqxcPersonCount: {
    header: '续卡人数\n（往期）',
    desc: ['①所筛选的班级，上课学员存在【续卡卡数（往期）】人数，去重']
  },
  kbqyxPersonCount: {
    header: '开班前已续人数',
    desc: ['①开班时间前存在其余【已缴清且未开卡】的【教练班、集训班】卡的学员数量']
  },
  kbhxcykbqwxPersonCount: {
    header: '开班后续卡人与开班前续人头重复人数',
    desc: ['①所筛选的班级里-上课学员人数：在开班日期后， 除签到卡种外 又报名了【教练班、集训班】卡且已缴清的学员数量与【开班前已续人数】，重复的人员数量']
  },
  kbqwxPersonCount: {
    header: '开班前未续人数',
    desc: [
      '①所筛选的班级里：【（上课学员人数） 减去 （开班前已续人数）】',
      '②开班前已续人数：开班时间前存在其余【已缴清且未开卡】的【教练班、集训班】卡的学员数量。去重 '
    ]
  },
  kbqwxkbhyxPersonCount: {
    header: '开班前未续学员在开班后续卡人数（本期）',
    desc: ['①开班前未续人数里：在【开班至实际结业30天内】再次报名【教练班、集训班】卡，且已缴清的学员数量。去重']
  },
  jlqtxcCardCount: {
    header: '续卡卡数\n（教练其他）',
    desc: ['①所筛选的班级里，签到卡种-作为往期卡-续卡卡数。续卡班型≠【教练班】、【集训班】', '②续卡时间：开班时间至当前', '③续卡为已缴清；续卡卡数不去重']
  },
  jlqtxcwkcCardCount: {
    header: '续卡未开卡卡数\n（教练其他）',
    desc: ['①续卡未开卡卡数（教续其他）当前未激活的卡数量']
  },
  jlqtxcMoney: {
    header: '教练其他金额',
    desc: ['①续卡卡数（教续其他）卡种：截止当前的全部实缴金额']
  },
  totalXCCardCount: {
    header: '总续卡卡数',
    desc: ['①续卡卡数（本期）+续卡卡数（往期）']
  },
  totalXCPersonCount: {
    header: '总续卡人数',
    desc: ['①续卡人数（本期）+续卡人数（往期）', '③人数去重。因为学员会同时存在本期续卡&往期续卡']
  },
  totalXCMoney: {
    header: '总续卡金额',
    desc: ['①续卡卡数（本期）实缴金额+续卡卡数（往期）实缴金额']
  }
}

export default {
  name: 'eduCoachClassRenewStat',
  components: {
    SearchComPro,
    STable
  },
  data() {
    return {
      columns,
      headerTips,
      searchParams: [
        {
          type: 'treeSelect',
          key: 'deptIds',
          label: '地区/分馆',
          placeholder: '请选择地区/分馆',
          expandAll: true,
          mutiple: true,
          isShow: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          defaultVal: schoolIds,
          treeOps: {
            api: getSchoolList,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'danceIds',
          mode: 'multiple',
          show: true,
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'classStates',
          show: true,
          label: '班级状态',
          placeholder: '请选择',
          staticArr: [
            {
              string: '计划中',
              value: 'A'
            },
            {
              string: '上课中',
              value: 'B'
            },
            {
              string: '已结业',
              value: 'C'
            },
            {
              string: '停课',
              value: 'D'
            }
          ]
        },
        {
          type: 'treeSelect',
          key: 'classTypeIds',
          label: '班型',
          placeholder: '请选择班型',
          expandAll: true,
          mutiple: true,
          isShow: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: treeEduClassType,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text',
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称',
          show: true
        },
        {
          type: 'date',
          key: 'Date',
          label: '开班时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'date',
          key: 'FinishDate',
          label: '结业时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'text',
          key: 'mateSaltemplate',
          show: true,
          label: '上课导师',
          placeholder: '请输入'
        }
      ],
      queryParams: {
        deptIds: schoolIds.join(',')
      },
      loadData: parameter => {
        return getCoachClassRenewalDetails({ ...this.queryParams, ...parameter }).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    searchSubmit(data, type) {
      this.queryParams = data
      if (type === 'isReset') {
        this.queryParams = {
          deptIds: schoolIds.join(',')
        }
      }
      this.$refs.table.refresh()
    },
    async handleExport() {
      let res = await exportCoachClassRenewalDetails(this.queryParams)
      this.$tools.exportExcel(res, '教练班续卡统计表')
    }
  }
}
</script>
