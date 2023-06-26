<template>
  <div>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="操作记录" :width="800" v-model="visible" @cancel="cancel" :footer="null">
      <div class="main">
        <div class="card_info">当前卡种：{{ cardInfo.stuCardNo }}/{{ cardInfo.cardName }}</div>
        <div class="price">
          <span>实收/应收/原价</span>
          <span>{{ record.paidPrice | fixTofloat }}/{{ record.totalPrice | fixTofloat }}/{{ record.originalPrice | fixTofloat }}</span>
        </div>
      </div>

      <div class="timeline">
        <div class="timeline_group" v-for="(group, groupIndex) in data" :key="groupIndex">
          <div class="year">
            <span class="number">{{ group.year }}</span
            >年
          </div>
          <div class="timeline_item" v-for="(item, itemIndex) in group.data" :key="itemIndex">
            <div class="item_time">{{ item.logDate | dateFilter }}</div>
            <div class="item_line"></div>
            <div class="item_content">
              <div class="card">
                <div class="card_type">{{ item.type | typeFilter }}</div>
                <div class="card_price">
                  金额：
                  <span class="price"> ￥{{ item.price }} </span>
                </div>
                <div class="card_remark">备注：{{ item.logRemark }}</div>
                <!-- <a-table :columns="columns" :data-source="data" bordered size="middle" :scroll="{ x: 'calc(700px + 50%)', y: 240 }" /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { studentChangeLog } from '@/api/education'
const columns = [
  // {
  //   title: 'Name',
  //   dataIndex: 'name',
  //   key: 'name',
  //   width: 100
  // },
  {
    title: '原卡',
    children: [
      {
        title: '操作时间',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: '卡号',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '实收/应收/原价',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: '结转金额',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '剩余金额',
        dataIndex: 'age',
        key: 'age'
      }
    ]
  },
  {
    title: '新卡',
    children: [
      {
        title: '卡号',
        dataIndex: 'Gender1',
        key: 'Gender1'
      },
      {
        title: '抵扣金额',
        dataIndex: 'Gender2',
        key: 'Gender2'
      },
      {
        title: '本次缴费',
        dataIndex: 'Gender1',
        key: 'Gender1'
      },
      {
        title: '业绩明细',
        dataIndex: 'Gender2',
        key: 'Gender2'
      }
    ]
  }
]
export default {
  components: {},
  props: {
    stuId: String
  },
  data() {
    return {
      columns,
      visible: false,
      record: {},
      cardInfo: {},
      data: []
    }
  },
  filters: {
    dateFilter(val) {
      return moment(val).format('MM/DD')
    },
    typeFilter(val) {
      const type = { A: '改卡', B: '转卡', C: '撤销', D: '退卡', E: '结算', F: '购卡', G: '改卡结算' }
      return type[val]
    }
  },
  methods: {
    backData(record) {
      this.record = record
      const { id: cardId, stuId: studentId } = record
      studentChangeLog({ studentId, cardId }).then(res => {
        this.cardInfo = res.data[0] || ''
        this.data = this.formatData(res.data || [])
      })
    },
    formatData(metaData) {
      let arr = []
      metaData.sort((s1, s2) => (moment(s1.logDate).isAfter(s2.logDate) ? -1 : 1))
      metaData.forEach(metaItem => {
        let year = moment(metaItem.logDate).year()
        let item = arr.find(log => log.year == year)
        if (item) {
          item.data.push(metaItem)
        } else {
          arr.push({ year, data: [metaItem] })
        }
      })

      return arr
    },
    open() {
      this.visible = true
    },
    cancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@cardHeight: 120px;

.main {
  position: relative;

  .card_info {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .tip {
    font-size: 12px;
    color: red;
  }

  .price {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    text-align: right;
  }
}

.timeline {
  max-height: 60vh;
  margin: 24px -24px -24px -24px;
  padding: 24px 24px 0;
  background: #eeeeee;
  overflow-y: auto;

  &_group {
    .year {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;

      .number {
        font-size: 18px;
      }
    }
  }

  &_item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .item_time {
      flex-shrink: 0;
      color: #333;
    }

    .item_line {
      flex-shrink: 0;
      position: relative;
      width: 30px;
      height: @cardHeight;
      padding: 0 30px;

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
      height: @cardHeight;
    }

    .item_content {
      width: 100%;

      .card {
        position: relative;
        width: 100%;
        // height: @cardHeight;
        padding: 50px 24px 24px;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;

        .card_type {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          position: absolute;
          top: -60px;
          left: -30px;
          width: 100px;
          height: 90px;
          font-size: 14px;
          color: #fff;
          padding-right: 20px;
          padding-bottom: 5px;
          background: #ff5857;
          transform: rotate(330deg);
        }

        .card_price,
        .card_remark {
          font-size: 12px;
          font-weight: bold;

          .price {
            font-size: 18px;
            color: #13a676;
          }
        }
      }
    }
  }
}
</style>
