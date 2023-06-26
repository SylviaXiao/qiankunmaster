<template>
  <div class="home-wrapper">
    <a-card :bordered="false">
      <div class="user-header">
        <div v-if="avatar" class="avatar">
          <a-avatar :src="avatar" />
        </div>
        <div class="text">
          <div class="title">{{ timeFix }}，{{ user.userName }}</div>
          <div class="second-title">{{ userInfo.position ? userInfo.position.positionName : '无职位' }} | {{ school.name || school }}</div>
        </div>
      </div>
    </a-card>
    <div class="home-content">
      <div class="small-card-wrapper">
        <a-row :gutter="15">
          <perm-box :perm="item.perm" v-for="(item, index) in SmallMethodsArr" :key="index">
            <a-col :xs="24" :sm="12" :md="12" :lg="6">
              <homecard :title="item.title" :methods="item.methods" :params="item.params" type="number" />
            </a-col>
          </perm-box>
        </a-row>
      </div>
      <div class="small-card-wrapper">
        <a-row :gutter="15">
          <perm-box :perm="item.perm" v-for="(item, index) in quickEntryArr" :key="index">
            <a-col :xs="24" :sm="12" :md="8" :lg="6">
              <homecard :title="item.title" :tips="item.tips" :params="item.params" :routerName="item.routerName" type="link" />
            </a-col>
          </perm-box>
        </a-row>
      </div>
      <div class="small-card-wrapper">
        <a-row :gutter="15">
          <perm-box :perm="item.perm" v-for="(item, index) in chartsArr" :key="index">
            <a-col :xs="24" :sm="12" :md="12" :lg="12">
              <homecard :title="item.title" :type="item.type" :methods="item.methods" :format="item.format" :tooltip="item.tooltip" />
            </a-col>
          </perm-box>
        </a-row>
      </div>
      <div class="small-card-wrapper">
        <a-row :gutter="15">
          <perm-box :perm="item.perm" v-for="(item, index) in aLLLineArr" :key="index">
            <a-col :xs="24" :sm="24" :md="24" :lg="24">
              <homecard :title="item.title" :type="item.type" :methods="item.methods" :format="item.format" :tooltip="item.tooltip" />
            </a-col>
          </perm-box>
        </a-row>
      </div>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { timeFix } from '@/utils/util'
import { PermBox } from '@/components'
import Homecard from '@/components/Homecards/Homecard.vue'
import { externalResource, internalResource, totalFinance, adviserAchi, csAchi, addedStu, cardCount, yearcount, yeartotal, monthcount } from '@/api/home'

export default {
  name: 'HomePage',
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    school() {
      const schools = JSON.parse(Vue.ls.get('userSchoolId'))
      const userDefaultId = Vue.ls.get('userDefaultId')
      let school = '无分馆'
      if (!!schools && schools.length > 0) {
        school = schools.find(item => {
          return item.id === userDefaultId
        })
      }
      return school
    }
  },
  components: {
    PermBox,
    Homecard,
  },
  data() {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      SmallMethodsArr: [
        { title: '今日资源(客服)', methods: externalResource, perm: 'home:stu:resource:external' },
        { title: '今日资源(内部)', methods: internalResource, perm: 'home:stu:resource:internal' },
        { title: '今日收入', methods: totalFinance, perm: 'home:finance:total', params: { income: true } },
        { title: '今日支出', methods: totalFinance, perm: 'home:finance:total', params: { income: false } },
        { title: '今日顾问业绩', methods: adviserAchi, perm: 'home:achievement:adviser' },
        { title: '今日客服业绩', methods: csAchi, perm: 'home:achievement:cs' },
        { title: '今日报名数', methods: addedStu, perm: 'home:finance:added', params: { income: true } },
        { title: '今日退款数', methods: addedStu, perm: 'home:finance:added', params: { income: false } }
      ],
      quickEntryArr: [
        { title: '员工签到', perm: 'education:organizesigninlog:view', routerName: 'userSign' },
        {
          title: '即将到期卡（剩余10天）',
          perm: 'student:card:view',
          routerName: 'stuCardsList',
          params: {
            dateType: 'C',
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().add(9, 'days').format('YYYY-MM-DD'),
            cardState: ['A', 'B', 'C', 'E']
          }
        },
        { title: '导师/学员签到', perm: 'education:plan:view', routerName: 'course' },
        {
          title: '代办本馆未分配卡',
          perm: 'student:card:view',
          routerName: 'stuCards',
          params: { masterState: 'N' }
        }
      ],
      chartsArr: [
        {
          title: '本月新增卡数',
          tooltip: '数量',
          methods: cardCount,
          perm: 'home:edu:card:yearcount',
          type: 'line',
          format: { x: 'cardMonth', y: 'cardCount' }
        },
        { title: '本月收款金额', tooltip: '金额', methods: yeartotal, perm: 'home:finance:yeartotal', type: 'bar', format: { x: 'finMonth', y: 'finTotal' } },
        {
          title: '最近一年资源数量',
          tooltip: '数量',
          methods: yearcount,
          perm: 'home:stu:resource:yearcount',
          type: 'line',
          format: { x: 'stuMonth', y: 'stuCount' }
        }
      ],
      aLLLineArr: [
        {
          title: '本月资源数量',
          tooltip: '数量',
          methods: monthcount,
          perm: 'home:stu:resource:monthcount',
          type: 'line',
          format: { x: 'stuDay', y: 'stuCount' }
        }
      ],

    }
  },
  created() {
    this.avatar = this.userInfo.avatar
    this.user = this.userInfo.user
  }
}
</script>

<style scoped lang="less">
.home-wrapper {
  .user-header {
    display: flex;
    flex-flow: row nowrap;

    .avatar {
      flex: 0 1 72px;
      margin: 0 24px 8px 0;

      & > span {
        border-radius: 72px;
        display: block;
        width: 72px;
        height: 72px;
      }
    }

    .title {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 16px;
      -webkit-box-flex: 1;
      -ms-flex: auto;
      flex: auto;
    }

    .second-title {
      color: rgba(0, 0, 0, 0.45);
    }
  }

  .home-content {
    .middle-card-wrapper {
      width: 100%;
      column-count: 1;
      margin-top: 15px;

      .middle-card {
        -moz-page-break-inside: avoid;
        -webkit-column-break-inside: avoid;
        break-inside: avoid;
        margin-bottom: 15px;
      }
    }

    .small-card-wrapper {
      div {
        height: 100%;
      }
    }
  }
}

canvas {
  width: 100% !important;
  /*    margin: 0 -5px;
        overflow: hidden;*/
}
</style>
