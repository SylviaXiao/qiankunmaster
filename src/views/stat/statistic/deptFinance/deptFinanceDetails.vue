<template>
  <div class="student-wrapper">
    <a-card :bordered="false">
      <div class="mt10 mb10">
        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
      </div>
      <a-spin tip="加载中..." :spinning="spinning">
        <a-table
          ref="table"
          class="mt20"
          :pagination="false"
          :data-source="loadData"
          bordered
          :columns="columns"
          :rowKey="(record, index) => index"
          :scroll="{ x: true }"
        >
        </a-table>
      </a-spin>
    </a-card>
<!--    :rowClassName="rowClassName"-->
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { listOrgDept } from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import {
  getFirstCost,
  listOnlyAdviserPer, listOnlyTeacherPer, listRepeatTeacherPer, listServicePer, listTotalPer, listShopItem,
  pageAdviserPer, pageCost, pageFinInfo, pageRefundPay, pageRefundSub, pageReimbursePay, pageReimburseSub,
  pageServicePer, pageShopItem, pageTeacheRepeat,
  pageTeacherPer,
  pageTotalPer, pageTotalRefund, totalReceipts, listRefund, listSubmitRefund
} from '@/api/table/table'
import {
  eighthColumns,
  fifthColumns,
  firstColumns,
  fourthColumns, nighthColumns,
  secondColumns, seventhColumns,
  sixthColumns, tenthColumns,
  thirdColumns
} from '@/utils/tableDetails/details'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
export default {
  name: 'deptFinanceCostTypeTotal',
  data() {
    const firstColumns =[
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'center',
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan){
            rowSpan=record.rowSpan>=1?record.rowSpan:0
          }
          if(record.isTotal){
            colSpan=3
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal){
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '分馆',
        dataIndex: 'branchName',
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan1){
            rowSpan=record.rowSpan1>=1?record.rowSpan1:0
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal){
            colSpan=0
            style+='background:#eee;'
          }

          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '顾问/来源',
        dataIndex: 'userName',
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.isTotal){
            colSpan=0
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal1){
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '客服',
        dataIndex: 'one',
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('one', record,'客服')
        }
      },
      {
        dataIndex: 'two',
        title: '个人网络',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('two', record,'个人网络')
        }
      },
      {
        dataIndex: 'three',
        title: '会员介绍',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('three', record,'会员介绍')
        }
      },
      {
        dataIndex: 'four',
        title: '会员续卡',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('four', record,'会员续卡')
        }
      },
      {
        dataIndex: 'five',
        title: '传单',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('five', record,'传单')
        }
      },
      {
        dataIndex: 'six',
        title: '自然来访',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('six', record,'自然来访')
        }
      },
      {
        dataIndex: 'eigth',
        title: '店面收入',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('eigth', record,'店面收入')
        }
      },
      {
        dataIndex: 'seven',
        title: '舞林一分钟',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('seven', record,'舞林一分钟')
        }
      },
      {
        dataIndex: 'total',
        title: '合计',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('total', record)
        }
      }
    ]
    const secondColumns =[
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'center',
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan){
            rowSpan=record.rowSpan>=1?record.rowSpan:0
          }
          if(record.isTotal){
            colSpan=3
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal){
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '分馆',
        dataIndex: 'branchName',
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan1){
            rowSpan=record.rowSpan1>=1?record.rowSpan1:0
          }
          if(record.isTotal){
            colSpan=0
          }

          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal||record.isTotal){
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '导师/来源',
        dataIndex: 'userName',
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.isTotal){
            colSpan=0
          }

          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal1){
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '导师转化',
        dataIndex: 'one',
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('one', record,)
        }
      },
      {
        dataIndex: 'total',
        title: '合计',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('total', record)
        }
      },
    ]
    const thirdColumns =[
      {
        title: '分馆',
        dataIndex: 'branchName',
        align: 'center',
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan){
            rowSpan=record.rowSpan>=1?record.rowSpan:0
          }
          if(record.isTotal){
            colSpan=3
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal){
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '顾问/来源',
        dataIndex: 'userName',
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal1){
            style+='background:#eee;'
            colSpan=2
          }
          if(record.isTotal){
            colSpan=0
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '角色',
        dataIndex: 'position',
        align: 'center',
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.isTotal1||record.isTotal){
            colSpan=0
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal){
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '客服',
        dataIndex: 'one',
        align: 'center',
      },
      {
        dataIndex: 'two',
        title: '个人网络',
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'three',
        title: '会员介绍',
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'four',
        title: '会员续卡',
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'five',
        title: '传单',
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'six',
        title: '自然来访',
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'eigth',
        title: '店面收入',
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'seven',
        title: '舞林一分钟',
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'nine',
        title: '导师转化',
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'total',
        title: '合计',
        ellipsis: true,
        align: 'center',
      }
    ]
    const fourthColumns =[
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'center',
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan){
            rowSpan=record.rowSpan>=1?record.rowSpan:0
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal){
            colSpan=2
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '业绩分馆/比例',
        dataIndex: 'branchName',
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal)colSpan=0
          if(record.isTotal1)  style+='background:#eee;'
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '2%',
        dataIndex: 'one',
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('one', record,'2')
        }
      },
      {
        title: '5%',
        dataIndex: 'two',
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('two', record,'5')
        }
      },
      {
        dataIndex: 'total',
        title: '合计',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('total', record)
        }
      }
    ]
    const fifthColumns =[
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'center',
        width:150,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan){
            rowSpan=record.rowSpan>=1?record.rowSpan:0
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal){
            colSpan=2
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '收款分馆/支付方式',
        dataIndex: 'branchName',
        align: 'center',
        ellipsis: true,
        width:150,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal)colSpan=0
          if(record.isTotal1)  style+='background:#eee;'
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },

      },
      {
        title: 'POSA',
        dataIndex: 'POSA',
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('POSA', record,'POSA')
        },
        width:150,
      },
      {
        title: 'POSB',
        dataIndex: 'POSB',
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('POSB', record,'POSB')
        },
        width:150,
      },
      {
        dataIndex: 'POS抖音',
        title: 'POS抖音',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('POS抖音', record,'POS抖音')
        },
        width:150,
      },
      {
        dataIndex: '拉卡拉储蓄卡',
        title: '拉卡拉储蓄卡',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('拉卡拉储蓄卡', record,'拉卡拉储蓄卡')
        },
        width:150,
      },
      {
        dataIndex: '拉卡拉信用卡',
        title: '拉卡拉信用卡',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('拉卡拉信用卡', record,'拉卡拉信用卡')
        },
        width:150,
      },
      {
        dataIndex: '美团支付',
        title: '美团支付',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('美团支付', record,'美团支付')
        },
        width:150,
      },
      {
        dataIndex: '扫呗收款',
        title: '扫呗收款',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('扫呗收款', record,'扫呗收款')
        },
        width:150,
      },
      {
        dataIndex: '微信',
        title: '微信',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('微信', record,'微信')
        },
        width:150,
      },
      {
        dataIndex: '微信信用卡',
        title: '微信',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('微信信用卡', record,'微信信用卡')
        },
        width:150,
      },

      {
        dataIndex: '现金',
        title: '现金',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('现金', record,'现金')
        },
        width:150,
      },
      {
        dataIndex: '线上支付',
        title: '线上支付',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('线上支付', record,'线上支付')
        },
        width:150,
      },
      {
        dataIndex: '支付宝',
        title: '支付宝',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('支付宝', record,'支付宝')
        },
        width:150,
      },
      {
        dataIndex: '支付宝花呗',
        title: '支付宝花呗',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('支付宝花呗', record,'支付宝花呗')
        },
        width:150,
      },
      {
        dataIndex: '支付宝信用卡',
        title: '支付宝信用卡',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('支付宝信用卡', record,'支付宝信用卡')
        },
        width:150,
      },
      {
        dataIndex: '知识助手账户收款',
        title: '知识助手账户收款',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('知识助手账户收款', record,'知识助手账户收款')
        },
        width:150,
      },
      {
        dataIndex: '自有服务号账户收款',
        title: '自有服务号账户收款',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('自有服务号账户收款', record,'自有服务号账户收款')
        },
        width:150,
      },
      {
        dataIndex: '小计',
        title: '合计',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('小计', record)
        },
        width:150,
      }
    ]
    const sixthColumns =[
      {
        title: '类别',
        dataIndex: 'areaName',
        align: 'center',
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          let colSpan = 1

          if(record.isTotalAll||record.isTotal){
            rowSpan=0
            colSpan=0
          }
          return {
            children: <span>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '公司/地区/部门',
        dataIndex: 'deptName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '分馆/部门',
        dataIndex: 'deptName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '分摊月份',
        dataIndex: 'date',
        align: 'center',
      },
      {
        dataIndex: 'achievement',
        title: '经营归类',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'deptPrice',
            title: '人力成本',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }

          },
          {
            dataIndex: 'head',
            title: '社保公积金',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'area',
            title: '教学辅助',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'advertisement',
            title: '税金',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'head',
            title: '房租物业',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'area',
            title: '水电',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'advertisement',
            title: '线上推广',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'head',
            title: '线下营销',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'area',
            title: '办公费用',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'advertisement',
            title: '员工福利',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'head',
            title: '装修支出 ',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'area',
            title: '开店支出',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'advertisement',
            title: '手续费',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          }
        ]
      },
      {
        dataIndex: 'total',
        title: '合计',
        ellipsis: true,
        align: 'center',
      },
    ]
    const seventhColumns =[
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'center',
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan){
            rowSpan=record.rowSpan>=1?record.rowSpan:0
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal){
            colSpan=2
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '业绩分馆/角色',
        dataIndex: 'branchName',
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal)colSpan=0
          if(record.isTotal1)  style+='background:#eee;'
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        }
      },
      {
        dataIndex: 'achievement',
        title: '顾问退费业绩',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'one',
            title: '顾问总退费业绩',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('one', record,'A')
            }

          },
          {
            dataIndex: 'two',
            title: '顾问退费全额业绩',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('two', record,'B')
            }
          },
          {
            dataIndex: 'three',
            title: '顾问退费减半业绩',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('three', record,'C')
            }
          }
        ]
      },
      {
        title: '导师退费业绩',
        dataIndex: 'four',
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('four', record,'D')
        }
      },
      {
        dataIndex: 'total',
        title: '合计',
        ellipsis: true,
        align: 'center',
        customRender: (value, record, index) => {
          return this.getDataRowCustomRender('total', record,)
        }
      },
    ]
    const eighthColumns =[
      {
        title: '类别',
        dataIndex: 'areaName',
        align: 'center',
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          let colSpan = 1

          if(record.isTotalAll||record.isTotal){
            rowSpan=0
            colSpan=0
          }
          return {
            children: <span>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '公司/地区/部门',
        dataIndex: 'deptName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '分馆/部门',
        dataIndex: 'deptName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '月份',
        dataIndex: 'date',
        align: 'center',
      },
      {
        dataIndex: 'achievement',
        title: '经营归类',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'deptPrice',
            title: '人力成本',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }

          },
          {
            dataIndex: 'head',
            title: '社保公积金',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'area',
            title: '教学辅助',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'advertisement',
            title: '税金',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'head',
            title: '房租物业',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'area',
            title: '水电',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'advertisement',
            title: '线上推广',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'head',
            title: '线下营销',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'area',
            title: '办公费用',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'advertisement',
            title: '员工福利',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'head',
            title: '装修支出 ',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'area',
            title: '开店支出',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          },
          {
            dataIndex: 'advertisement',
            title: '手续费',
            ellipsis: true,
            align: 'center',
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender('date', record)
            }
          }
        ]
      },
      {
        dataIndex: 'total',
        title: '合计',
        ellipsis: true,
        align: 'center',
      },
    ]
    const columns = [
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'center',
        width:150,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan){
            rowSpan=record.rowSpan>=1?record.rowSpan:0
          }
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal){
            colSpan=2
            style+='background:#eee;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '分馆',
        dataIndex: 'branchName',
        align: 'center',
        ellipsis: true,
        width:150,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          let style = 'display:block;padding: 10px 0;'
          if(record.isTotal)colSpan=0
          if(record.isTotal1)  style+='background:#eee;'
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
    ]
    return {
      columnsService:columns,
      spinning: false,
      columns: firstColumns,
      columnList: [
        {
          type: ['adviserPerformance'],
          columns: firstColumns
        },
        {
          type: ['teacherPerformance'],
          columns: secondColumns
        },
        {
          type: ['totalPerformance'],
          columns: thirdColumns
        },
        {
          type: ['servicePerformance'],
          columns: columns
        },
        {
          type: ['teacherRepeat'],
          columns: fourthColumns
        },
        {
          type: ['shopItemPrice'],
          columns: fifthColumns
        },
        {
          type: ['costPrice'],
          columns: sixthColumns
        },
        {
          type: ['deptTotalRefund','refundSub','refundPay'],
          columns: seventhColumns
        },
        {
          type: ['totalReceipts','reimburseSub','reimbursePay'],
          columns: eighthColumns
        },
        // {
        //   type: ['reimburseSub'],
        //   columns: nighthColumns
        // },
        // {
        //   type: ['reimbursePay'],
        //   columns: tenthColumns
        // },
        // {
        //   type: ['refundSub'],
        //   columns: eleventhColumns
        // },
        // {
        //   type: ['refundPay'],
        //   columns: twelfthColumns
        // },
        // {
        //   type: ['finInfoPrice'],
        //   columns: thirteenthColumns
        // }
      ],
      //表内容
      loadData: [],
      loadData1: [],
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Month',
          label: '分摊月份',
          placeholder: '请选择时间',
          format: 'YYYY-MM',
          mode: ['month', 'month']
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'deptId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        }
      ],
      queryParam: {
      },
      //表格是否加载
      rpSpinning: false,
      type:''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'deptFinanceDetails') {
          let { type } = this.$route.params
          this.type = type
          this.initSearchParams()
          this.columns = this.columnList.filter(item => item.type.includes(route.params.type))[0].columns
          this.$forceUpdate()
          if (this.$refs.table)this.initData()
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    ReportTable,
    STable,
    SearchComPro
  },
  created() {
  },
  methods: {
    initData() {
      this.spinning = true
      let that = this
      let { type} = this.$route.params
      let request = ''
      if (type === 'adviserPerformance') request = listOnlyAdviserPer //顾问业绩唯一
      if (type === 'teacherPerformance') request = listOnlyTeacherPer //导师业绩唯一
      if (type === 'totalPerformance') request = listTotalPer //总业绩
      if (type === 'servicePerformance') request = listServicePer //客服业绩重复
      if (type === 'teacherRepeat') request = listRepeatTeacherPer //导师业绩重复
      if (type === 'shopItemPrice') request = listShopItem //其他收入
      if (type === 'costPrice') request = listOnlyAdviserPer //成本费用
      if (type === 'deptTotalRefund') request = listRefund //分馆总退费
      if (type === 'totalReceipts') request = listOnlyAdviserPer //总收款
      if (type === 'reimburseSub') request = listOnlyAdviserPer //报销提交
      if (type === 'reimbursePay') request = listOnlyAdviserPer //报销支付
      if (type === 'refundSub') request = listSubmitRefund //退费提交
      if (type === 'refundPay') request = listRefund //退费支付
      if (type === 'finInfoPrice') request = listOnlyAdviserPer //业绩收入
      if (type === 'deptTotalRefund'||type === 'refundPay')  this.queryParam.status='A'
      if (type === 'refundSub') this.queryParam.status='B'
      request(this.queryParam).then(res => {
        let loadData = []
        let deptIdTotal = ''
        let arr = ['adviserPerformance','teacherPerformance']
        if (Array.isArray(res.data) && res.data.length > 0) {
          if(arr.includes(type)){
            res.data.forEach((item,idx)=>{
              let index = idx
              item.rowspan=0
              item.deptId=''
              if(item.list) {
                item.list.forEach((col, colIndex) => {
                  item.rowspan += col.userMapList.length+1
                  item.deptId +=(item.deptId?(','+col.branchId):col.branchId)
                  deptIdTotal+=(deptIdTotal?(','+col.branchId):col.branchId)
                })
                item.list.forEach((col, colIndex) => {
                  col.userMapList.forEach((row, rowIndex) => {
                    let rowSpan = colIndex === 0 && rowIndex === 0 ? item.rowspan : -1
                    let rowSpan1 = rowIndex === 0 ? col.userMapList.length+1 : -1
                    loadData.push(Object.assign(row, { regionName: item.regionName, branchName: col.branchName,deptId:col.branchId, rowSpan, rowSpan1 }))
                  })
                  let datas = Object.assign(col.deptMap,{deptId:item.deptId, rowSpan:-1, rowSpan1:-1,userName:'小计',isTotal1:true})
                  loadData.push(datas)
                })
              }
              let rows = Object.assign(item.total,{deptId:item.deptId,regionName: '合计',isTotal:true})
              if(index===res.data.length-1){
                rows.regionName='合计'
                item.deptId=deptIdTotal
              }
              loadData.push(rows)
            })
          }else{
            let  arr2 = ['servicePerformance','teacherRepeat','shopItemPrice','deptTotalRefund','refundPay','refundSub']
            if(arr2.includes(type)){
              if(type==='servicePerformance'){
                let   headers = Object.keys(res.data[0].total)
                this.columns=[
                  this.columnsService[0],
                  this.columnsService[1]
                ]
                headers.forEach(item=>{
                  if(item!=='小计'){
                    this.columns.push({
                      title: item,
                      dataIndex: item,
                      align: 'center',
                      customRender: (value, record, index) => {
                        return this.getDataRowCustomRender(item, record,item)
                      }
                    })
                  }
                })
                this.columns.push({
                  title:'小计',
                  dataIndex: '小计',
                  align: 'center',
                  customRender: (value, record, index) => {
                    return this.getDataRowCustomRender('小计', record,'')
                  }
                })
              }
              res.data.forEach((item,idx)=>{
                let index = idx
                item.deptId=''
                if(item.list) {
                  item.list.forEach((col, colIndex) => {
                    item.deptId +=(item.deptId?(','+col.branchId):col.branchId)
                    deptIdTotal+=(deptIdTotal?(','+col.branchId):col.branchId)
                  })
                  item.list.forEach((col, colIndex) => {
                    let rowSpan =  colIndex === 0 ? item.list.length+1 : -1
                    loadData.push(Object.assign(col, { regionName: item.regionName,deptId:col.branchId, rowSpan }))
                  })
                }
                let rows ={}
                if(index===res.data.length-1){
                  rows= Object.assign(item.total,{regionName:'合计',deptId:deptIdTotal,isTotal:true})
                }else{
                  rows= Object.assign(item.total,{deptId:item.deptId,branchName: '小计',isTotal1:true,rowSpan:-1})
                }
                loadData.push(rows)
              })
            }else{
              res.data.forEach((item,idx)=>{
                let index = idx
                item.deptId=''
                if(item.userMapList) {
                  item.userMapList.forEach((col, colIndex) => {
                    item.deptId +=(item.deptId?(','+col.branchId):col.branchId)
                    deptIdTotal+=(deptIdTotal?(','+col.branchId):col.branchId)
                  })
                  item.userMapList.forEach((col, colIndex) => {
                    let rowSpan =  colIndex === 0 ? item.userMapList.length+1 : -1
                    loadData.push(Object.assign(col, {  branchName: item.branchName,deptId:item.branchId, rowSpan }))
                  })
                }
                let rows = {}
                if(index===res.data.length-1){
                  rows= Object.assign(item.total,{deptId:deptIdTotal,branchName: '合计',isTotal:true})
                }else{
                  rows= Object.assign(item.deptMap,{deptId:item.deptId,userName: '小计', rowSpan:-1,isTotal1:true})
                }
                loadData.push(rows)
              })
            }
          }
        }
        that.loadData = loadData
        that.spinning = false
      })
    },
    initSearchParams() {
      let {  endDate, startDate,id } = this.$route.query
      if(endDate&& startDate){
        this.queryParam.startDate = startDate
        this.queryParam.endDate = endDate
      }
      if(id){
        this.queryParam.deptId = id
      }
      this.$forceUpdate()
      this._refreshTable()
    },
    getDataRowCustomRender(dataIndex, record,source) {
      let arr = ['totalRevenue','grossProfit']
      const obj = {
        children: (
          <div class="table-cell-y">
            {this.getCurrencyString(record[dataIndex])}
          </div>
        ),
        attrs: {}
      }
      if(!arr.includes(dataIndex)){
        obj.children= (
          <div class="table-cell-y">
            <a className='ml10' onClick={() => this.toDetails(dataIndex,record,source)}>{this.getCurrencyString(record[dataIndex])}</a>
          </div>
        )
      }
      return obj
    },
    getCurrencyString(val) {
      let result =val
      if(val){
        result = Number(val).toFixed(2).toLocaleString()
      }
      return val
    },
    toDetails(dataIndex,record,source){
      console.log(111,dataIndex,source)
      console.log(this.type)
        let { endDate, startDate } = this.queryParam
      this.$router.push({
        name: 'deptFinanceSecondDetails',
        params: { type: this.type},
        query: {
          startDate: startDate,
          endDate: endDate,
          id: record.deptId,
          userId:record.userId,
          source:source
        }
      })
      return
        const { href } = this.$router.resolve({
          name: 'deptFinanceSecondDetails',
          params: { type: this.type},
          query: {
            startDate: startDate,
            endDate: endDate,
            id: record.deptId
          }
        })
        //结合open打开新的页面
        window.open(href, '_blank')
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      let exportUrl = ''
      let { type } = this.$route.params
      if (type === 'adviserPerformance') exportUrl ='/finance/salarycheck/downOnlyAdviserPer' //顾问业绩唯一
      if (type === 'teacherPerformance') exportUrl = '/finance/salarycheck/downOnlyTeacherPer' //导师业绩唯一
      if (type === 'totalPerformance') exportUrl = '/finance/salarycheck/downNewTotalPer' //总业绩
      if (type === 'servicePerformance') exportUrl = '/finance/salarycheck/downNewServicePer' //客服业绩重复
      if (type === 'teacherRepeat') exportUrl = '/finance/salarycheck/downRepeatTeacherPer' //导师业绩重复
      if (type === 'shopItemPrice') exportUrl = '/finance/salarycheck/downNewShopItem' //其他收入
      if (type === 'costPrice') exportUrl = '/finance/salarycheck/downCost' //成本费用
      if (type === 'deptTotalRefund') exportUrl = '/finance/salarycheck/downRefund' //分馆总退费
      if (type === 'reimburseSub') exportUrl = '/finance/salarycheck/downReimburseSub' //报销提交
      if (type === 'reimbursePay') exportUrl = '/finance/salarycheck/downReimbursePay' //报销支付
      if (type === 'refundSub') exportUrl = '/finance/salarycheck/downSubmitRefund' //退费提交
      if (type === 'refundPay') exportUrl = '/finance/salarycheck/downRefund' //退费支付
      if (type === 'finInfoPrice') exportUrl = '/finance/salarycheck/downFinInfo' //业绩收入
      const { queryParam } = this
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
    searchSubmit(data, reset) {
      this.queryParam = data
      if(data.startMonth){
        this.queryParam.startDate = data.startMonth+'-01'
        let endDate = moment(data.endMonth,"YYYY-MM")
          .add(1, 'months')
          .date(0)
          .format('YYYY-MM-DD')
        this.queryParam.endDate =endDate
        delete this.queryParam.startMonth
        delete this.queryParam.endMonth
      }
      if (reset == 'isReset') {
        this.initSearchParams()
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.initData()
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-table-tbody > tr > td{
  padding: 0!important;
}
</style>
