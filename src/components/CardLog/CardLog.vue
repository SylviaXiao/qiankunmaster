<template>
  <div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="卡流转日志"
      :width="modalWidth"
      :visible="logVisible"
      :footer="null"
      @cancel="cancel"
    >
      <div class="main">
        <div class="card_info">{{ title }}</div>
      </div>

      <div class="card_log_wrapper" v-if="card">
        <div class="card_log">
          <div class="card_log_group">
            <div class="item_time">
              <div class="year">
                <span class="number">{{ card.createDate | yearFilter }}</span>年
              </div>
              <div>{{ card.createDate | dateFilter }}</div>
            </div>
            <div class="item_line"></div>
            <div class="item_content">
              <div class="before_card_group" v-if="lastCard && lastCard.length > 0">
                <div class="card card_line last_card_line" v-for="(last, lastIndex) in lastCard" :key="lastIndex">
                  <span class="inner" @click="initData(last.id)">
                    <span>{{last.stuCardNo}}</span>
                    <span class="ellipsis" :title="last.stuCardName">{{last.stuCardName}}</span>
                  </span>
                </div>
              </div>
              <div class="card green">
                <span class="inner" @click="cardInfoOpen()">
                  <span>{{card.stuCardNo}}</span>
                  <span class="ellipsis" :title="card.stuCardName">{{card.stuCardName}}</span>
                </span>
              </div>
            </div>
          </div>

          <template v-if="nextCard && nextCard.length > 0">
            <div class="card_log_group" v-for="(ncDate, ncIndex) in nextCardDate" :key="ncIndex">
              <div class="item_time">
                <div class="year" v-if="showYear(ncDate)">
                  <span class="number">{{ ncDate | yearFilter }}</span>年
                </div>
                <div>{{ ncDate | dateFilter }}</div>
              </div>
              <div class="item_line"></div>
              <div class="item_content">
                <div class="after_card_group">
                  <div
                    class="card card_line next_card_line"
                    :class="getLastCardClass(ncDate, next, nextIndex)"
                    v-for="(next, nextIndex) in nextCard"
                    :key="nextIndex"
                  >
                    <span class="inner" @click="initData(next.id)">
                      <span>{{next.stuCardNo}}</span>
                      <span style="width: 100px;" class="ellipsis" :title="next.stuCardName">{{next.stuCardName}}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </a-modal>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="卡明细"
      :width="800"
      :visible="cardInfoVisible"
      :footer="null"
      @cancel="cardInfoCancel"
    >
      <table ref="cardInfoTable" class="table">
        <tr>
          <td :rowspan="originalCardInfoData.length + 1">原卡</td>
          <th>卡号</th>
          <th>缴费金额</th>
          <th>结转金额</th>
          <th>剩余金额</th>
          <th>扣除课耗金额</th>
        </tr>
        <tr class="row-hover" v-for="(card, index) in originalCardInfoData" :key="'original' + index">
          <td>{{card.stuCardNo}}</td>
          <td>{{card.paidPrice}}</td>
          <td>{{card.changePrice}}</td>
          <td>{{card.remainingPrice}}</td>
          <td><a href="#" @click="signLogOpen(card.id)">{{card.consumePrice}}</a></td>
        </tr>
        <tr>
          <td :rowspan="currentCardInfoData.length + 1">新卡</td>
          <th>卡号</th>
          <th>缴费金额</th>
          <th>抵扣金额</th>
          <th>业绩明细</th>
          <th>操作时间</th>
        </tr>
        <tr class="row-hover" v-for="(card, index) in currentCardInfoData" :key="'current' + index">
          <td>{{card.stuCardNo}}</td>
          <td>{{card.paidPrice}}</td>
          <td>{{card.dudprice}}</td>
          <td v-if="card.paidPrice != 0"><a href="#" @click="achievementOpen(card.financeInfoId)">查看绩效</a></td>
          <td v-else>-</td>
          <td>{{card.changeDate}}</td>
        </tr>
      </table>
    </a-modal>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="绩效"
      :width="800"
      :visible="achievementVisible"
      :footer="null"
      @cancel="achievementCancel"
    >
      <table ref="achievementTable" class="table">
        <tr>
          <th>角色</th>
          <th>所属人</th>
          <th>所属分馆</th>
          <th>业绩金额</th>
          <th>比例</th>
          <th>资源来源</th>
        </tr>
        <tr class="row-hover" v-for="(item, index) in adviserAchievements" :key="index">
          <td>顾问</td>
          <td>{{item.adviserName}}</td>
          <td>{{item.deptName}}</td>
          <td>{{item.price}}</td>
          <td>-</td>
          <td>{{achievementSource}}</td>
        </tr>
        <tr class="row-hover" v-for="(item, index) in teacherAchievements" :key="index">
          <td>导师</td>
          <td>{{item.teacherName}}</td>
          <td>{{item.deptName}}</td>
          <td>{{item.teacherPrice}}</td>
          <td>{{item.teacherRatio}}%</td>
          <td>{{achievementSource}}</td>
        </tr>
      </table>
    </a-modal>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="签到记录"
      :width="800"
      :visible="signLogVisible"
      :footer="null"
      @cancel="signLogCancel"
    >
      <s-table v-if="signLogVisible" ref="signLogTable" :columns="signLogColumns" :data="signLogLoadData" rowKey="id"></s-table>
    </a-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import tools from '@/tools/common'
  import { STable } from '@/components'
  import { getListChangeLog, getChangeCardInfo } from '@/api/education'
  import { commonDetailAchievement, commonPageSignInLogById } from '@/api/common'

  export default {
    components: {
      STable
    },
    data() {
      return {
        logVisible: false,
        statusMap: { A: '未使用', B: '使用中', C: '停课', D: '退卡', E: '结业', F: '撤销' },
        title: '',
        date: '',
        lastCard: null,
        card: null,
        nextCard: null,
        nextCardDate: [],

        // 卡详情
        cardInfoVisible: false,
        originalCardInfoData: [],
        currentCardInfoData: [],

        // 查看绩效
        achievementVisible: false,
        adviserAchievements: [],
        teacherAchievements: [],
        achievementSource: '',

        // 签到记录
        signLogVisible: false,
        signLogColumns: [
          {
            title: '签到班级',
            dataIndex: 'className'
          },
          {
            title: '上课时间',
            dataIndex: 'planStartDate',
            customRender: (text, record) => {
              const { tailor: { getDateTimes, getTime } } = tools
              return getDateTimes(record.planStartDate) + '~' + getTime(record.planEndDate)
            }
          },
          {
            title: '签到时间',
            dataIndex: 'updateDate',
          },
          {
            title: '班级类型',
            dataIndex: 'typeName',
          },
          {
            title: '卡号',
            dataIndex: 'stuCardNo',
          },
          {
            title: '签到计次',
            dataIndex: 'signCount',
          },
          {
            title: '签到老师',
            dataIndex: 'teachers',
            customRender: (text, record) => {
              if (Array.isArray(text)) {
                return text.map(d => d.signName).join(',')
              }
              return ''
            }
          },
        ],
        studentCardId: '',
        signLogLoadData: parameter => {
          const { studentCardId } = this
          return commonPageSignInLogById(Object.assign({ studentCardId }, parameter))
            .then(res => {
              return res
            })
        },
      }
    },
    filters: {
      yearFilter(val) {
        return moment(val).format('YYYY')
      },
      dateFilter(val) {
        return moment(val).format('MM/DD')
      },
      typeFilter(val) {
        const type = { A: '改卡', B: '转卡', C: '撤销', D: '退卡', E: '结算', F: '购卡', G: '改卡结算' }
        return type[val]
      }
    },
    computed: {
      modalWidth() {
        let width1 = 0, width2 = 0
        if (this.lastCard && this.lastCard.length > 0) {
          width1 = 190 + this.lastCard.length * 140
        }
        if (this.nextCard && this.nextCard.length > 0) {
          width2 = 190 + this.nextCard.length * 140
        }
        let width = width1 > width2 ? width1 : width2
        return width > 600 ? width : 600
      }
    },
    methods: {
      showYear(ncDate) {
        return moment(this.card.createDate).year() !== moment(ncDate).year()
      },
      getLastCardClass(ncDate, item, index) {
        let hidden = ''
        if (ncDate !== moment(item.createDate).format('YYYY-MM-DD')) {
          hidden = 'hidden_card'
          for (let n of this.nextCard.slice(index)) {
            if (n.stuCardNo === item.stuCardNo && moment(item.createDate).isBefore(ncDate)) {
              hidden = hidden + ' hidden_line'
              break
            }
          }
        }

        return hidden
      },
      open(record) {
        this.logVisible = true
        this.initData(record.id)
      },
      cancel() {
        this.logVisible = false
        this.title = ''
        this.date = ''
        this.lastCard = null
        this.card = null
        this.nextCard = null
        this.nextCardDate = []
      },
      initData(stuCardId) {
        getListChangeLog({ stuCardId }).then(res => {
          if (res.code == 200) {
            this.date = res.data.date
            this.lastCard = res.data.lastStudentCardList || null
            this.card = res.data.studentCard || null
            this.nextCard = res.data.nextStudentCardList || null
            this.nextCardDate = this.nextCard.map(d => moment(d.createDate).format('YYYY-MM-DD'))
            this.nextCardDate = [...new Set(this.nextCardDate)]

            const { stuCardNo, status } = this.card
            this.title = stuCardNo + '/' + this.statusMap[status]
          }
        })
      },

      // 卡详情
      cardInfoOpen() {
        this.cardInfoVisible = true
        const { id: stuCardId } = this.card
        getChangeCardInfo({ stuCardId, changeDate: this.date })
          .then(res => {
            if (res.code == 200) {
              const { lastMapList, newMap, payMapList } = res.data
              if (lastMapList) {
                this.originalCardInfoData = lastMapList.map(d => ({
                  id: d.studentCard.id,
                  stuCardNo: d.studentCard.stuCardNo,
                  paidPrice: d.paidPrice,
                  changePrice: d.changePrice,
                  remainingPrice: d.remainingPrice,
                  consumePrice: d.consumePrice
                }))
              }
              if (newMap) {
                this.currentCardInfoData = [{
                  financeInfoId: newMap.financeInfoId,
                  stuCardNo: newMap.studentCard.stuCardNo,
                  paidPrice: newMap.paidPrice,
                  dudprice: newMap.dudprice,
                  changeDate: newMap.changeDate
                }]
              }
              if (payMapList) {
                this.currentCardInfoData.push(...payMapList.map(d => ({
                  financeInfoId: d.financeInfoId,
                  stuCardNo: d.stuCardNo,
                  paidPrice: d.paidPrice,
                  dudprice: 0,
                  changeDate: d.createDate
                })))
              }
            }
          })
      },
      cardInfoCancel() {
        this.cardInfoVisible = false
        this.originalCardInfoData = []
        this.currentCardInfoData = []
      },

      // 查看绩效
      achievementOpen(financeId) {
        this.achievementVisible = true
        commonDetailAchievement(financeId)
          .then(res => {
            if (res.code == 200) {
              const { adviserAchievements, teacherAchievements, source } = res.data
              this.adviserAchievements = adviserAchievements
              this.teacherAchievements = teacherAchievements
              this.achievementSource = source
            }
          })
      },
      achievementCancel() {
        this.achievementVisible = false
        this.adviserAchievements = []
        this.teacherAchievements = []
        this.achievementSource = ''
      },

      // 签到记录
      signLogOpen(studentCardId) {
        this.signLogVisible = true
        this.studentCardId = studentCardId
      },
      signLogCancel() {
        this.signLogVisible = false
        this.studentCardId = ''
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @cardLogHeight: 120px;
  @cardHeight: 40px;
  @beforeCardLine: 30px;
  @afterCardLine: 120px;

  .main {
    position: relative;

    .card_info {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }
  }

  .card_log_wrapper {
    max-height: 60vh;
    margin: 24px -24px -24px -24px;
    padding: 24px;
    background: #eeeeee;
    overflow-y: auto;

    .card_log {
      display: inline-flex;
      flex-direction: column;
      flex-wrap: wrap;

      &_group {
        display: flex;
        align-items: center;

        .item_time {
          flex-shrink: 0;
          color: #333;
          text-align: right;
          width: 80px;

          .year {
            font-size: 14px;
            font-weight: bold;

            .number {
              font-size: 18px;
            }
          }
        }

        .item_line {
          flex-shrink: 0;
          position: relative;
          width: 30px;
          height: @cardLogHeight;
          padding: 0 30px;

          /*时间线上的圆圈*/
          &::before {
            display: block;
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 20px;
            height: 20px;
            margin: auto;
            background: #eeeeee;
            border: 2px solid #0ca472;
            border-radius: 50%;
            z-index: 2;
          }

          /*时间线上的线段*/
          &::after {
            display: block;
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 2px;
            height: 220px;
            margin: 0 auto;
            background: #dadada;
            z-index: 1;
          }
        }

        &:last-child .item_line::after {
          height: @cardLogHeight;
        }

        .item_content {
          display: flex;
          flex-direction: column;
          width: 100%;

          .before_card_group {
            text-align: center;
            margin: 0 -10px @beforeCardLine -10px;

            .card {
              width: 120px;
            }

            .last_card_line {
              margin: 0 10px;

              /*线段*/
              &::before {
                top: @cardHeight;
                height: @beforeCardLine;
              }

              /*三角*/
              &:not(.hidden_card)::after {
                top: calc(23px + @cardHeight)!important;
              }
            }
          }

          .after_card_group {
            text-align: center;
            margin: 0 -10px;

            .card {
              width: 120px;
            }

            .next_card_line {
              margin: 0 10px;

              /*线段*/
              &::before {
                height: @afterCardLine;
              }

              /*三角*/
              &:not(.hidden_card)::after {
                top: -8px!important;
              }
            }
          }

          .card {
            position: relative;
            display: inline-block;
            height: @cardHeight;
            line-height: 16px;

            .inner {
              position: relative;
              display: inline-flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 0 10px;
              width: 100%;
              height: 100%;
              background: #fff;
              border-radius: 5px;
              cursor: pointer;
              z-index: 1;
            }

            &.hidden_card .inner {
              visibility: hidden;
            }
          }

          .card_line {
            /*线段*/
            &::before {
              position: absolute;
              /*top: 0;*/
              bottom: 0;
              left: 0;
              right: 0;
              margin: 0 auto;
              display: block;
              content: '';
              width: 2px;
              background: #038255;
            }

            &.hidden_line::before {
              visibility: hidden;
            }

            /*三角*/
            &:not(.hidden_card)::after {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              margin: 0 auto;
              display: block;
              content: '';
              width: 0;
              height: 0;
              border: 8px solid;
              border-color: #038255 transparent transparent transparent;
            }
          }

          .green .inner {
            color: #FFF;
            background: #038255;
          }
        }
      }
    }
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    background: #FFF;
    border: 1px solid #999;

    tr {
      text-align: center;

      &.row-hover {
        transition: background 0.3s;

        &:hover {
          background: #c4f7dd;
        }
      }
    }

    th,
    td {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
      padding: 12px 5px !important;
      white-space: nowrap;
      border: 1px solid #999;

      &.gray {
        background: #D9D9D9;
      }
    }

    th {
      color: #FFF;
      background: #379C68;
    }
  }
</style>
