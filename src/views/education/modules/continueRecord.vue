<template>
  <div>
      <div class="main">
        <div class="card_info">
          <span>老师姓名：{{ teacherInfo.teacherName }}</span>
          <span class='ml20'>手机号：{{ teacherInfo.teacherMobile }}</span>
          <span class='ml20'>入职时间：{{ teacherInfo.inductionDate?teacherInfo.inductionDate.slice(0,10):'' }}</span>
        </div>
      </div>
      <div class="card_log_wrapper" >
        <div class="card_log" v-if="recordList && recordList.length > 0">
          <div class="card_log_group" v-for="(last, lastIndex) in recordList" :key="lastIndex" >
            <div class="item_time">
              <div class="year">
                <span class="number">{{ last.createDate | yearFilter }}</span>年
              </div>
              <div>{{ last.createDate | dateFilter }}</div>
            </div>
            <div class="item_line"></div>
            <div class="item_content">
              <div class="before_card_group" >
                <div >
                  <div class="card card_line last_card_line" >
                    <div class="card green">
                      <div class="inner" >
                        <span>类型：</span>
                        <span  >{{  last.official  === 'A' ? '全职' : last.official  === 'D' ? '储备全职' : last.official  === 'C' ? '兼职' : '' }}</span>
                      </div>
                      <div class="inner" >
                        <span>合同签订时间：</span>
                        <span >{{last.effectiveDate?last.effectiveDate.slice(0,10):'' }}</span>
                      </div>
                      <div class="inner" >
                        <span style='width:56px;'>备注：</span>
                        <span  >{{last.remark }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if='last.filelist&&last.filelist.length>0'>
                    <FileList :value='last.filelist||[]'></FileList>
                  </div>
                </div>


              </div>
            </div>
          </div>

        </div>
      </div>

  </div>
</template>

<script>
import moment from 'moment'
import tools from '@/tools/common'
import { STable } from '@/components'
import { getListChangeLog, getChangeCardInfo,socialSecurityRecord } from '@/api/education'
import { commonDetailAchievement, commonPageSignInLogById } from '@/api/common'
import FileList from '@/components/UploadDrgger/fileList.vue'
export default {
  components: {
    FileList
  },
  data() {
    return {
      teacherInfo:{},
      statusMap: { A: '未使用', B: '使用中', C: '停课', D: '退卡', E: '结业', F: '撤销' },
      title: '',
      date: '',
      recordList: null,
      card: null,
      nextCard: null,
      nextCardDate: [],
    }
  },
  filters: {
    yearFilter(val) {
      return moment(val).format('YYYY')
    },
    dateFilter(val) {
      return moment(val).format('MM/DD')
    },

  },
  computed: {

  },
  methods: {
    showYear(ncDate) {
      return moment(this.card.createDate).year() !== moment(ncDate).year()
    },
    getrecordListClass(ncDate, item, index) {
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
      this.teacherInfo=record
      this.initData(record.teacherId)
    },
    initData(teacherId) {
      socialSecurityRecord({teacherId:teacherId,securityType:'C'}).then(res => {
        if (res.code == 200) {
          this.date = res.data.updateDate
          res.data.forEach(item=>{
            item.filelist=item.uploadFileOwners.map(col=>{
              return { name: col.uploadFile.fileName, fileId: col.uploadFile.id }
            })
          })
          this.recordList = res.data || null
          this.$forceUpdate()
        }
      })
    },
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
          //text-align: center;
          margin: 0 -10px @beforeCardLine -10px;

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
          //height: @cardHeight;
          //line-height: 16px;
          border-radius: 5px;
          overflow: hidden;
          background: #038255;
          padding: 5px;

          .inner {
            position: relative;
            display: flex;
            //justify-content: center;
            align-items: center;
            padding: 0 10px;
            width: 100%;
            height: 100%;
            //background: #fff;
            cursor: pointer;
            z-index: 1;
            text-align: left;

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
