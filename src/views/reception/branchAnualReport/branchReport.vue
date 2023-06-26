<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
    </a-card>

    <a-card :bordered="false">
      <div class="mt10 mb10">
        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
      </div>
<!--      表一-->
      <a-spin tip="加载中..." :spinning="spinning">
        <a-table
          ref="table"
          class="mt20"
          bordered
          :pagination="false"
          :data-source="loadData"
          :columns="columns"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
        >
        </a-table>
      </a-spin>
<!--      表二-->
      <a-spin tip="加载中..." :spinning="spinning1">
        <a-table
          ref="table"
          class="mt20"
          :pagination="false"
          :data-source="loadData1"
          bordered
          :columns="columns1"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
        >
          <span slot="resourcesCount">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源录入时间=筛选区间，分配给分馆的资源</div>
                  <div>②分单情况下，仅分配分馆取1，分单分馆不计入资源数</div>
                </div>
              </template>
              资源总数
            </a-tooltip>
          </span>
          <span slot="resourcesNotInWkCount">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源录入时间=筛选区间，分配给分馆的资源</div>
                  <div>②资源班型≠线上付费课</div>
                  <div>③分单情况下，仅分配分馆取1，分单分馆不计入资源数</div>
                </div>
              </template>
              资源数（不含网课）
            </a-tooltip>
          </span>
          <span slot="resourcesInJlbCount">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源录入时间=筛选区间，分配给分馆的资源</div>
                  <div>②资源班型=教练班</div>
                  <div>③分单情况下，仅分配分馆取1，分单分馆不计入资源数</div>
                </div>
              </template>
              教练班资源数
            </a-tooltip>
          </span>
          <span slot="noWkCDNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源班型≠线上付费课</div>
                  <div>②学员的第一张资源来源=客服的卡（含体验卡），第一笔缴费时间=筛选区间；按业绩比例计算成单数（只算第一比缴费）</div>
                </div>
              </template>
              成单数（不含网课成单）
            </a-tooltip>
          </span>
          <span slot="cdRadio">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①成单数（不含网课）/资源数（不含网课）</div>
                  <div>②保留两位小数</div>
                </div>
              </template>
              成单率
            </a-tooltip>
          </span>
          <span slot="noWkResoucesValue">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源班型≠线上付费课，该分馆的客服业绩金额/不含网课资源数</div>
                  <div>②客服业绩金额&资源数录入都是筛选时间段内的</div>
                </div>
              </template>
              资源价值（不含网课）
            </a-tooltip>
          </span>
          <span slot="jResoucesValue">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源班型=教练班该分馆的客服业绩金额/资源班型=教练班的资源数</div>
                  <div>②客服业绩金额&资源数都是筛选时间段内的</div>
                </div>
              </template>
              （教）资源价值
            </a-tooltip>
          </span>
          <span slot="noJResoucesValue">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>（非教）资源价值=客服业绩/资源数</div>
                  <div>①【资源班型≠教练班/线上付费课，该分馆的客服业绩金额（含体验卡）】/【资源班型≠教练班/线上付费课的资源数】；</div>
                  <div>②客服业绩金额&资源数录入都是筛选时间段内的</div>
                </div>
              </template>
              （非教）资源价值
            </a-tooltip>
          </span>
          <span slot="personalDevelopmentNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>个人开发数：分馆按照阶段维护数据</div>
                  <div>①取前台-分馆目标管理-个人开发数-时间筛选区间所在阶段的数据</div>
                  <div>1-9号为第一阶段；1-19为第二阶段；1-31为第三阶段；判断当前筛选时间区间数据第几阶段，对应取值。</div>
                  <div>例如筛选1-15号，则为第二阶段</div>
                  <div>②默认取【当前筛选时间区间】所在阶段数据。</div>
                  <div>③筛选时间查询以往月份，同步取值；跨月查询则该字段为空</div>
                </div>
              </template>
              个人开发数
            </a-tooltip>
          </span>
          <span slot="personalDevelopmentRate">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>个开成单率=个开成单数/个人开发数</div>
                </div>
              </template>
              个开成单率
            </a-tooltip>
          </span>
          <span slot="personalDevelopmentCDNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>个开成单数：资源来源=自然来访、个人网络、传单成单数。</div>
                  <div>①学员的第一张卡（含体验卡），第一笔缴费时间=筛选时间段内，取第一笔缴费且按业绩比例分单；仅第一张卡算成单数</div>
                </div>
              </template>
              个开成单数
            </a-tooltip>
          </span>
          <span slot="zrlfMoney">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>自然来访金额：资源来源自然来访，该分馆筛选时间段内的业绩金额</div>
                </div>
              </template>
              自然来访金额
            </a-tooltip>
          </span>
          <span slot="dspMoney">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>短视频金额：资源来源个人网络，该分馆筛选时间段内的业绩金额</div>
                </div>
              </template>
              短视频金额
            </a-tooltip>
          </span>
          <span slot="cdMoney">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>传单金额：资源来源传单，该分馆筛选时间段内的业绩金额</div>
                </div>
              </template>
              传单金额
            </a-tooltip>
          </span>
          <span slot="cgbXzCardNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①业绩分馆为对应分馆；报名卡种第一笔缴费时间=筛选时间段内</div>
                  <div>②报名班型=常规班的卡数（新报、续报、补录）</div>
                  <div>③卡数：按照（第一笔缴费）业绩比例分单；</div>
                </div>
              </template>
              常规班新增卡数
            </a-tooltip>
          </span>
          <span slot="slbXzCardNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①业绩分馆为对应分馆；报名卡种第一笔缴费时间=筛选时间段内</div>
                  <div>②报名班型=少儿班的卡数（新报、续报、补录）</div>
                  <div>③卡数：按照（第一笔缴费）业绩比例分单；</div>
                </div>
              </template>
              少儿新增卡数
            </a-tooltip>
          </span>
          <span slot="jlbXzCardNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①业绩分馆为对应分馆；报名卡种第一笔缴费时间=筛选时间段内</div>
                  <div>②报名班型=教练班的卡数（新报、续报、补录）</div>
                  <div>③卡数：按照（第一笔缴费）业绩比例分单；</div>
                  <div>教练班不含集训班</div>
                </div>
              </template>
              教练班新增卡数
            </a-tooltip>
          </span>
          <span slot="yxVipNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>有效会员人数（去重）</div>
                  <div>①含体验卡；上课分馆=当前分馆；报名班型=全部班型</div>
                  <div>②含有【卡种状态=使用中/未使用/停课】最少一种卡种状态的学员数量；</div>
                  <div>③取系统所有数据</div>
                </div>
              </template>
              有效会员人数
            </a-tooltip>
          </span>
          <span slot="yxVipCardNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①卡种状态=使用中/未使用/停课卡种数量；上课分馆=当前分馆；报名班型=全部班型</div>
                  <div>②取系统所有数据</div>
                </div>
              </template>
              有效会员卡数
            </a-tooltip>
          </span>
          <span slot="dqVipCardNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①上课分馆=当前分馆；报名班型=全部班型</div>
                  <div>②结业状态和退卡状态的卡数量（结业含结转结业），且结业时间/退卡时间=筛选时间段；不含撤销</div>
                </div>
              </template>
              到期会员卡数
            </a-tooltip>
          </span>
          <span slot="xukaNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①报名时业绩归属-资源来源=会员续卡的卡数量，卡种第一笔缴费时间=筛选时间段内，报名班型=全部班型</div>
                  <div>②取第一笔缴费且按业绩比例分单</div>
                </div>
              </template>
              续卡卡数
            </a-tooltip>
          </span>
        </a-table>
      </a-spin>
      <!--      表三-->
      <a-spin tip="加载中..." :spinning="spinning2">
        <a-table
          ref="table"
          class="mt20"
          :pagination="false"
          :data-source="loadData2"
          bordered
          :columns="columns2"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
        >
           <span slot="resourcesCount">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源录入时间=筛选区间，分配给分馆的资源</div>
                  <div>②资源班型=线上付费课</div>
                  <div>③分单情况下，仅分配分馆取1，分单分馆不计入资源数</div>
                </div>
              </template>
              网课资源数
            </a-tooltip>
          </span>
           <span slot="cdNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源班型=线上付费课</div>
                  <div>②学员的第一张资源来源=客服的卡（含体验卡），第一笔缴费时间=筛选区间；按业绩比例计算成单数（只算第一笔缴费）</div>
                </div>
              </template>
              成单数
            </a-tooltip>
          </span>
           <span slot="wkCdRadio">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>成单数（网课）/资源数（网课）</div>
                </div>
              </template>
              网课成单率
            </a-tooltip>
          </span>
           <span slot="wkResoucesValue">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源班型=线上付费课，该分馆的客服业绩金额（含体验卡）/网课资源数</div>
                  <div>②客服业绩金额&资源数都是筛选时间段内的</div>
                </div>
              </template>
              网课资源价值
            </a-tooltip>
          </span>
           <span slot="wkSjYj">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源班型=线上付费课，报名卡种班型=私教，该分馆的客服业绩金额（含体验卡）</div>
                  <div>②客服业绩金额=筛选时间段内</div>
                </div>
              </template>
              网课私教业绩
            </a-tooltip>
          </span>
           <span slot="wkCgbYj">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①资源班型=线上付费课，报名卡种班型=常规班，该分馆的客服业绩金额</div>
                  <div>②客服业绩金额=筛选时间段内</div>
                </div>
              </template>
              网课常规班业绩
            </a-tooltip>
          </span>
           <span slot="zcNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①取报表【分馆业绩统计-转卡分单业绩-本馆分外馆】筛选时间段内金额-点击明细，明细的学员数量</div>
                  <div>②人数：去重</div>
                </div>
              </template>
              转出人数
            </a-tooltip>
          </span>
           <span slot="zcJe">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①取报表【分馆业绩统计-转卡分单业绩-本馆分外馆】筛选时间段内，该分馆的金额</div>
                </div>
              </template>
              转出金额
            </a-tooltip>
          </span>
           <span slot="zrNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①取报表分馆业绩统计-转卡分单业绩-外馆分本馆】筛选时间段内金额-点击明细，明细的学员数量</div>
                  <div>②人数：去重</div>
                </div>
              </template>
              转入人数
            </a-tooltip>
          </span>
           <span slot="zrJe">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①取报表【分馆业绩统计-转卡分单业绩-外馆分本馆】筛选时间段内，该分馆的金额</div>
                </div>
              </template>
              转入金额
            </a-tooltip>
          </span>
           <span slot="tkRs">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①退卡时间=筛选时间段内；报名班型=全部班型</div>
                  <div>②退卡的业绩分馆=当前分馆；退卡的人数按照业绩比例分单</div>
                  <div>计算逻辑=筛选时间段内该馆的退费业绩/该学员筛选时间段内的总退费业绩</div>
                </div>
              </template>
              退卡人数
            </a-tooltip>
          </span>
           <span slot="tkNumber">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>退卡卡数（不去重）</div>
                  <div>①退卡时间=筛选时间段内；报名班型=全部班型</div>
                  <div>②退卡的业绩分馆=当前分馆；退卡的卡数按照业绩比例分单。退了多张卡则取卡数合计</div>
                </div>
              </template>
              退卡卡数
            </a-tooltip>
          </span>
           <span slot="tkMoney">
            <a-tooltip placement="top">
              <template slot="title">
                <div>
                  <div>①退卡业绩分馆=当前分馆；报名班型=全部班型，筛选时间段内的提交退费金额</div>
                  <div>②退费计算=【（顾问业绩）+（导师绩效提成比例7%）需要判断顾问业绩是否减半，减半时需要顾问业绩*2】</div>
                </div>
              </template>
              退卡金额
            </a-tooltip>
          </span>
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import { schoolOperationData ,onNotIncludedOnlineCourse,onOnlineCourse} from '@/api/finance/finance'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
const customHeaderCell1 = column => {
  return {
    style: {
      background: '#f7fbff'
    }
  }
}
const customHeaderCell2 = column => {
  return {
    style: {
      background: '#fafafa'
    }
  }
}
const customHeaderCell3 = column => {
  return {
    style: {
      background: '#1ba97b'
    }
  }
}
const defaultSchoolId =['0c18166a-679b-414e-ac2e-c05ba7a2f4c4', '8f63afe7-09ca-4d11-ac51-1187e4381e63', '407913a7-76ff-40ce-967f-0ce0bf0bcdd3', '8109e909-8c8e-463a-9e10-a0804bc59b79', '150d8748-87ab-4935-8f6f-7233d1294413', '4c58a4b3-157b-493f-8b72-707196a26453', 'e07cad7c-7415-421c-a77e-48146d33a3bc', '0c185455-7ae8-4207-a517-91a2f5f26030', '88c5e24d-15c1-4e7c-adfb-f5e291562c33', '5aa46e02-28b9-4e31-936f-60721e07696d', '2d30de5a-9e47-4669-a9e9-534085ab6353', '7b0f4b73-83d9-4d46-adb0-78138e7ed633', '080aabad-e46b-479e-b130-169e970427e0', '66298d15-894b-4e48-9551-5d3795470304', '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f',  'b337887b-ce9d-49e6-89c5-4f822c94d457', '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f', '50232e74-16d1-438d-9c09-bc7454b13fe0', '999e8fb9-6c98-4cc5-bab3-2a2937a36836', 'd923d38e-1699-4137-8f2a-315dcf2fa017', '5c0f0a94-346f-4e82-8848-f8882a7ac0ae', '7aa9901b-6d7f-44a3-8640-e0935516514c', '1207948e-746c-4dc3-9dd8-ab9c4493b49e', '47a6e64a-c166-4bb6-874c-f7e5c91666d7', 'c066c789-e642-45c8-9486-d7e684d44dca', '457cadbe-f9a8-4d18-87b4-85051f99898b', '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a', 'b29cfda3-9609-4939-a8c4-4fe240f54f91']
export default {
  name: 'balanceConsumpution',
  data() {
    const columnspre = [
      {
        title: '序号',
        dataIndex: 'sort',
        width: 50,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          if (record.isTotal) {
            return {
              children: <span>{text}</span>,
              attrs: {
                colSpan: 3
              }
            }
          }
          return <span>{text}</span>
        },
        fixed: 'left'
      },
      {
        title: '地区',
        dataIndex: 'schoolArea',
        align: 'center',
        width: 60,
        customRender: (text, record, index) => {
          if (record.isTotal) {
            return {
              attrs: {
                colSpan: 0
              }
            }
          }
          return <span>{text}</span>
        },
        fixed: 'left'
      },
      {
        title: '分馆',
        dataIndex: 'schoolName',
        align: 'center',
        width: 150,
        customRender: (text, record, index) => {
          if (record.isTotal) {
            return {
              attrs: {
                colSpan: 0
              }
            }
          }
          return <span>{text}</span>
        },
        fixed: 'left'
      },
      {
        dataIndex: 'achievement',
        title: '业绩统计',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'sumAch',
            title: '总业绩',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'targetRatio',
            title: '年度目标完成进度',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            customRender: (text, record) => {
              return text + '%'
            }
          },
          {
            dataIndex: 'refundAmount',
            title: '退卡金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'splitCardPrice',
            title: '转卡差额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'validAch',
            title: '有效业绩',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'singleApplyNum',
            title: '199单报人数（不含套报）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'coachClassNum',
            title: '教练班新招人数（含暑期集训）',
            width: 220,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'trainerClassConsumeNum',
            title: '私教课耗节数',
            width: 220,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          }
        ]
      },
      {
        dataIndex: 'coachClassStatics',
        title: '教练班退卡数',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'coachClassRefundNum',
            title: '教练班',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'enhancementClassRefundNum',
            title: '精进班',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'studyClassRefundNum',
            title: '进修班',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },

        ]
      },
      {
        dataIndex: 'sourceStatics',
        title: '渠道金额统计',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'serviceAmount',
            title: '客服金额（不含网课）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'networkServiceAmount',
            title: '客服金额（含网课）',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'personalAmount',
            title: '个人开发金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'renewalAmount',
            title: '续卡金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'memberAmount',
            title: '会员介绍金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'otherAmount',
            title: '其他渠道金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          }
        ]
      },
      {
        dataIndex: 'cardTypeStatics',
        title: '班型金额统计',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'coachClassAmount',
            title: '教练班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'regularClassAmount',
            title: '常规班金额',
            ellipsis: true,
            width: 150,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'youngClassAmount',
            title: '少儿班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'trainerAdultAmount',
            title: '私教金额（成人）',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'trainerYoungAmount',
            title: '私教金额（少儿）',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'networkClassAmount',
            title: '网课总业绩',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'otherClassAmount',
            title: '其他班型金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          }
        ]
      }
    ]
    const columnsnext = [
      {
        dataIndex: 'cardNextStatics',
        title: '续卡统计',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'tocoachContinueNum',
            title: '教练班续非教练班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'coachContinueNum',
            title: '非教练班续教练班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'coachToCoachContinueNum',
            title: '教练班续教练班人数',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'tocoachContinueAmount',
            title: '教练班续非教练班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'coachContinueAmount',
            title: '非教练班续教练班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'coachToCoachContinueAmount',
            title: '教练班续教练班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'trainingClassContinueAmount',
            title: '集训班续卡金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'toRegularClassContinueNum',
            title: '常规班续非常规班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'regularClassContinueNum',
            title: '非常规班续常规班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'regularToRegularContinueNum',
            title: '常规班续常规班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'toRegularClassContinueAmount',
            title: '常规班续非常规班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'regularClassContinueAmount',
            title: '非常规班续常规班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'regularToRegularContinueAmount',
            title: '常规班续常规班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },

          {
            dataIndex: 'toYoungClassContinueNum',
            title: '少儿班续非少儿班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'youngClassContinueNum',
            title: '非少儿班续少儿班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'youngToYoungContinueNum',
            title: '少儿班续少儿班人数',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'toYoungClassContinueAmount',
            title: '少儿班续非少儿班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'youngClassContinueAmount',
            title: '非少儿班续少儿班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'youngToYoungContinueAmount',
            title: '少儿班续少儿班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },

          {
            dataIndex: 'toTrainerAdultContinueNum',
            title: '私教续非私教人数（成人）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'trainerAdultContinueNum',
            title: '非私教续私教人数（成人）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'trainerAdultToTrainerAdultContinueNum',
            title: '私教（成人）续私教（成人）人数',
            width: 240,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'toTrainerAdultContinueAmount',
            title: '私教续非私教金额（成人）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'trainerAdultContinueAmount',
            title: '非私教续私教金额（成人）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'trainerAdultToTrainerAdultContinueAmount',
            title: '私教（成人）续私教（成人）金额',
            width: 240,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },

          {
            dataIndex: 'toTrainerYoungContinueNum',
            title: '私教续非私教人数（少儿）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'trainerYoungContinueNum',
            title: '非私教续私教人数（少儿）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'trainerYoungToTrainerYoungContinueNum',
            title: '私教（少儿）续私教（少儿）人数',
            width: 240,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'toTrainerYoungContinueAmount',
            title: '私教续非私教金额（少儿）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'trainerYoungContinueAmount',
            title: '非私教续私教金额（少儿）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'trainerYoungToTrainerYoungContinueAmount',
            title: '私教（少儿）续私教（少儿）金额',
            width: 240,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },

          {
            dataIndex: 'otherContinueNum',
            title: '其他续卡人数',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'otherContinueAmount',
            title: '其他续卡金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          },
          {
            dataIndex: 'sumNum',
            title: '续卡总人数',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2
          }
        ]
      }
    ]
    const columns1 = [
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'center',
        width: 120,
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          let colSpan = 1
          let children = <span >{text}</span>
          return {
            children:children ,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
        fixed: 'left'
      },
      {
        title: '分馆',
        dataIndex: 'branchName',
        width: 150,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          let children = <span >{text}</span>
          if(record.isTotal===1){
            children= <span style='color:red'>{text}</span>
          }
          if(record.isTotal===2){
            children= <span style='color:#1fa9de;'>{text}</span>
          }
          return {
            children:children ,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
        fixed: 'left'
      },
      {
        dataIndex: 'coachClass',
        title: '公司资源统计',
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell3,
        children: [
          {
            dataIndex: 'resourcesCount',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'resourcesCount' },
          },
          {
            dataIndex: 'resourcesNotInWkCount',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'resourcesNotInWkCount' },
          },
          {
            dataIndex: 'resourcesInJlbCount',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'resourcesInJlbCount' },
          },
          {
            dataIndex: 'noWkCDNumber',
            width: 180,
            ellipsis: true,
            align: 'center',
            slots: { title: 'noWkCDNumber' },
          },
          {
            dataIndex: 'cdRadio',
            width: 180,
            ellipsis: true,
            align: 'center',
            slots: { title: 'cdRadio' },
          },
          {
            dataIndex: 'noWkResoucesValue',
            width: 220,
            ellipsis: true,
            align: 'center',
            slots: { title: 'noWkResoucesValue' },
          },
          {
            dataIndex: 'jResoucesValue',
            width: 220,
            ellipsis: true,
            align: 'center',
            slots: { title: 'jResoucesValue' },
          },
          {
            dataIndex: 'noJResoucesValue',
            width: 220,
            ellipsis: true,
            align: 'center',
            slots: { title: 'noJResoucesValue' },
          }
        ]
      },
      {
        dataIndex: 'coachClassStatics',
        title: '个人开发统计',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'personalDevelopmentNumber',
            width: 180,
            ellipsis: true,
            align: 'center',
            slots: { title: 'personalDevelopmentNumber' },
          },
          {
            dataIndex: 'personalDevelopmentCDNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'personalDevelopmentCDNumber' },
          },
          {
            dataIndex: 'personalDevelopmentRate',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'personalDevelopmentRate' },
          },
          {
            dataIndex: 'zrlfMoney',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'zrlfMoney' },
          },
          {
            dataIndex: 'dspMoney',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'dspMoney' },
          },
          {
            dataIndex: 'cdMoney',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'cdMoney' },
          },
        ]
      },
      {
        dataIndex: 'sourceStatics',
        title: '会员卡统计',
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell3,
        children: [
          {
            dataIndex: 'cgbXzCardNumber',
            width: 180,
            ellipsis: true,
            align: 'center',
            slots: { title: 'cgbXzCardNumber' },
          },
          {
            dataIndex: 'slbXzCardNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'slbXzCardNumber' },
          },
          {
            dataIndex: 'jlbXzCardNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'jlbXzCardNumber' },
          },
          {
            dataIndex: 'yxVipNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'yxVipNumber' },
          },
          {
            dataIndex: 'yxVipCardNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'yxVipCardNumber' },
          },
          {
            dataIndex: 'dqVipCardNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'dqVipCardNumber' },
          },
          {
            dataIndex: 'xukaNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'xukaNumber' },
          },
        ]
      },
    ]
    const columns2 = [
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'center',
        width: 120,
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          let colSpan = 1
          let children = <span >{text}</span>
          return {
            children:children ,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
        fixed: 'left'
      },
      {
        title: '分馆',
        dataIndex: 'branchName',
        width: 100,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          let children = <span >{text}</span>
          if(record.isTotal===1){
            children= <span style='color:red'>{text}</span>
          }
          if(record.isTotal===2){
            children= <span style='color:#1fa9de;'>{text}</span>
          }
          return {
            children:children ,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
        fixed: 'left'
      },
      {
        dataIndex: 'coachClass',
        title: '网课',
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell3,
        children: [
          {
            dataIndex: 'resourcesCount',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'resourcesCount' },
          },
          {
            dataIndex: 'cdNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'cdNumber' },
          },
          {
            dataIndex: 'wkCdRadio',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'wkCdRadio' },
          },
          {
            dataIndex: 'wkResoucesValue',
            width: 180,
            ellipsis: true,
            align: 'center',
            slots: { title: 'wkResoucesValue' },
          },
          {
            dataIndex: 'wkSjYj',
            width: 180,
            ellipsis: true,
            align: 'center',
            slots: { title: 'wkSjYj' },
          },
          {
            dataIndex: 'wkCgbYj',
            width: 220,
            ellipsis: true,
            align: 'center',
            slots: { title: 'wkCgbYj' },
          },
        ]
      },
      {
        dataIndex: 'coachClassStatics',
        title: '转卡',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'zcNumber',
            width: 180,
            ellipsis: true,
            align: 'center',
            slots: { title: 'zcNumber' },
          },
          {
            dataIndex: 'zcJe',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'zcJe' },
          },
          {
            dataIndex: 'zrNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'zrNumber' },
          },
          {
            dataIndex: 'zrJe',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'zrJe' },
          },
        ]
      },
      {
        dataIndex: 'sourceStatics',
        title: '退卡',
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell3,
        children: [
          {
            dataIndex: 'tkRs',
            width: 180,
            ellipsis: true,
            align: 'center',
            slots: { title: 'tkRs' },
          },
          {
            dataIndex: 'tkNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'tkNumber' },

          },
          {
            dataIndex: 'tkMoney',
            width: 150,
            ellipsis: true,
            align: 'center',
            slots: { title: 'tkMoney' },
          },
        ]
      },
    ]
    return {
      spinning2:false,
      spinning1:false,
      spinning: false,
      columns: columnspre.concat(columnsnext),
      columnspre,
      columnsnext,
      columns1,
      columns2,
      //表内容
      loadData: [],
      loadData1: [],
      loadData2: [],
      //搜索项
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'schoolId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          show: true,
          defaultVal: defaultSchoolId,
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
          label: '时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        }
        // {
        //   type: 'singledate',
        //   key: 'year',
        //   label: '年份',
        //   show: true,
        //   mode: 'year',
        //   placeholder: '请选择时间',
        //   format: 'YYYY',
        //   defaultVal: defaultStart
        // }
      ],
      queryParams: {
        startDate: defaultStart,
        endDate: defaultEnd,
        schoolId:defaultSchoolId.join(',')
      },
      //表格是否加载
      rpSpinning: false
    }
  },
  components: {
    ReportTable,
    STable,
    SearchComPro
  },
  created() {
    this.init()
  },
  methods: {
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      let exportUrl = '/finance/target/statDown'
      const queryParam = this.queryParams
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
    init() {
      this.spinning = true
      this.spinning1 = true
      this.spinning2 = true
      let that = this
      Promise.all([schoolOperationData(this.queryParams)]).then(data => {
        data.forEach((res, index) => {
          if(index===0){
            let columns = {}
            let columnsNow = JSON.parse(JSON.stringify(that.columns))
            let targetPrice = 0
            let targetTotalPrice = 0
            columnsNow.forEach(item => {
              if (item.children) {
                item.children.forEach(col => {
                  columns[col.dataIndex] = 0
                })
              } else {
                columns[item.dataIndex] = 0
              }
            })
            if (Array.isArray(res.data) && res.data.length > 0) {
              res.data.forEach((item, index) => {
                item.sort = index + 1
                targetPrice+=item.targetPrice
                targetTotalPrice+=item.ach
                Object.keys(columns).forEach(key => {
                  if (key !== 'sort' && key !== 'schoolArea' && key !== 'schoolName') {
                    columns[key] += item[key]
                  }
                })
              })
            }
            let total = { sort: '合计', isTotal: true }
            let average = { sort: '平均值', isTotal: true }
            Object.keys(columns).forEach(key => {
              if (key !== 'sort' && key !== 'schoolArea' && key !== 'schoolName') {
                total[key] = columns[key].toFixed(2)
                average[key] = (columns[key] / res.data.length).toFixed(2)
              }
            })
            total.targetRatio=targetPrice===0?0:(targetTotalPrice/targetPrice*100).toFixed(2)
            average.targetRatio=targetPrice===0?0:(targetTotalPrice/targetPrice/res.data.length*100).toFixed(2)
            let loadData = JSON.parse(JSON.stringify(res.data))
            loadData.push(total)
            loadData.push(average)
            that.loadData = loadData
          }
        })
        that.spinning = false
      })
      Promise.all([onNotIncludedOnlineCourse(this.queryParams)]).then(data => {
        data.forEach((res, index) => {
           if(index===1||index===0){
            let loadData = []
            if (Array.isArray(res.data) && res.data.length > 0) {
              let length = res.data.length-1
              res.data.forEach((item, index) => {
                let rowSpan = 0
                let isTotal = 1
                if (Array.isArray(item.list) && item.list.length > 0){
                  item.list.forEach((col, colIndex) => {
                    rowSpan = colIndex===0?item.list.length+2:0
                    loadData.push(Object.assign(col,{regionName:item.regionName,rowSpan}))
                  })
                }
                rowSpan = 0
                if(index===length){
                  rowSpan=2
                  isTotal=2
                }
                loadData.push(Object.assign(item.total,{branchName:'合计',regionName:item.regionName,rowSpan,isTotal}))
                loadData.push(Object.assign(item.avgTotal,{branchName:'平均值',regionName:item.regionName,rowSpan:0,isTotal}))
              })
            }
             this.loadData1=loadData
          }
        })
        that.spinning1 = false
      })
      Promise.all([onOnlineCourse(this.queryParams)]).then(data => {
        data.forEach((res, index) => {
          if(index===0){
            let loadData = []
            if (Array.isArray(res.data) && res.data.length > 0) {
              let length = res.data.length-1
              res.data.forEach((item, index) => {
                let rowSpan = 0
                let isTotal = 1
                if (Array.isArray(item.list) && item.list.length > 0){
                  item.list.forEach((col, colIndex) => {
                    rowSpan = colIndex===0?item.list.length+2:0
                    loadData.push(Object.assign(col,{regionName:item.regionName,rowSpan}))
                  })
                }
                rowSpan = 0
                if(index===length){
                  rowSpan=2
                  isTotal=2
                }
                loadData.push(Object.assign(item.total,{branchName:'合计',regionName:item.regionName,rowSpan,isTotal}))
                loadData.push(Object.assign(item.avgTotal,{branchName:'平均值',regionName:item.regionName,rowSpan:0,isTotal}))
              })
            }
              this.loadData2=loadData
          }
        })
        that.spinning2 = false
      })
    },
    searchSubmit(data, reset) {
      this.queryParams = data
      if (reset == 'isReset') {
        this.queryParams.startDate = defaultStart
        this.queryParams.endDate = defaultEnd
        this.queryParams.schoolId=defaultSchoolId.join(',')
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.init()
    }
  }
}
</script>

<style scoped lang="less"></style>
