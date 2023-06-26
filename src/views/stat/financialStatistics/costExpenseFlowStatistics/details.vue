<template>
  <div class="reports-iframe-wrapper">
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :exportUrl="exportUrl"
    ></ReportTable>
  </div>
  <!-- :isFinanceTable="true" -->
</template>
<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
// import { getDeptTree } from '@/api/organize'
import {
  costExpenseFlowStatistics,
  getSysFeeItem,
  costExpenseFlowStatisticsByCostClassify,
  listAllOrgDeptTreeNoSchoolId,
  costExpenseFlowStatisticsDetails
} from '@/api/table/table'
import { getAllSysFeeItem } from '@/api/education/card'
import Vue from 'vue'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
function getFeeItemName(item) {
  return item.feeItemName + '-' + item.costName
}
const searchParams = [
  {
    type: 'date',
    key: 'Date',
    label: '选择日期',
    placeholder: '请选择日期',
    format: 'YYYY-MM-DD',
    show: true,
    defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
  },
  {
    type: 'select', //动态select框
    key: 'costClassify',
    show: true,
    mode: 'multiple',
    label: '成本归类',
    placeholder: '请选择成本归类',
    apiOption: {
      api: getAllSysFeeItem,
      string: 'feeItemName',
      value: 'feeItemName',
      params: {
        type: 'D'
      }
    }
  },
  {
    type: 'treeSelect',
    isShow: true,
    key: 'deptIds',
    label: '选择分馆',
    placeholder: '请选择分馆',
    expandAll: true,
    mutiple: true,
    show: true,
    treeCheckable: false,
    selectFather: true,
    financeTable: true,
    treeOps: {
      api: listAllOrgDeptTreeNoSchoolId,
      label: 'deptName',
      value: 'id',
      children: 'children'
    }
  }
]
const searchParamsFee = [
  {
    type: 'date',
    key: 'Date',
    label: '选择日期',
    placeholder: '请选择日期',
    format: 'YYYY-MM-DD',
    show: true,
    defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
  },
  {
    type: 'select',
    key: 'itemNames',
    mode: 'multiple',
    label: '费用归类',
    placeholder: '请选择费用归类',
    search: true,
    apiOption: {
      api: getSysFeeItem,
      string: 'feeItemName',
      value: getFeeItemName,
      params: {
        type: 'C'
      }
    },
    show: true
  },
  {
    type: 'treeSelect',
    isShow: true,
    key: 'deptIds',
    label: '选择分馆',
    placeholder: '请选择分馆',
    expandAll: true,
    mutiple: true,
    show: true,
    treeCheckable: false,
    selectFather: true,
    financeTable: true,
    treeOps: {
      api: listAllOrgDeptTreeNoSchoolId,
      label: 'deptName',
      value: 'id',
      children: 'children'
    }
  }
]
const searchParamsProject = [
  {
    type: 'date',
    key: 'Date',
    label: '选择日期',
    placeholder: '请选择日期',
    format: 'YYYY-MM-DD',
    show: true,
    defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
  },
  {
    type: 'treeSelect',
    isShow: true,
    key: 'deptIds',
    label: '选择分馆',
    placeholder: '请选择分馆',
    expandAll: true,
    mutiple: true,
    show: true,
    treeCheckable: false,
    selectFather: true,
    financeTable: true,
    treeOps: {
      api: listAllOrgDeptTreeNoSchoolId,
      label: 'deptName',
      value: 'id',
      children: 'children'
    }
  },
  {
    type: 'text',
    key: 'projectName',
    label: '项目名称',
    show: true,
    placeholder: '请输入项目名称'
  }
]

export default {
  name: 'costExpenseFlowStatisticsDetail',
  props: {},
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'costExpenseFlowStatisticsDetail') {
          let ids = localStorage.getItem('costExpenseFlowStatisticsDetailId')
          let { type, level, endDate, startDate } = this.$route.params
          let feeType = type.split('@')
          this.feeType = feeType[0]
          this.level = level
          //设置查询项
          this.queryParam.endDate = endDate
          this.queryParam.startDate = startDate
          this.queryParam.deptIds = ids || ''
          // this.queryParam.type = 'A'
          this.queryParam.level = level
          if (feeType[2]) this.queryParam.itemNames = feeType[2]
          if (feeType[1]) this.queryParam.costClassify = feeType[1]
          //设置搜索栏
          if (this.feeType == 'A') this.searchParams = searchParams
          if (this.feeType == 'B') this.searchParams = searchParamsFee
          if (this.feeType == 'C') this.searchParams = searchParamsProject
          //设置打印链接
          if (this.feeType == 'A') this.exportUrl = '/finspendingCost/capitalDaily/costExpenseFlowStatisticsByExportExcel'
          if (this.feeType == 'B') this.exportUrl = '/finspendingCost/capitalDaily/costExpenseFlowStatisticsByCostClassifyAndExportExcel'
          if (this.feeType == 'C') this.exportUrl = '/finspendingCost/capitalDaily/costExpenseFlowStatisticsDetailsByExportExcel'
          this.searchParams[0].defaultVal = [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
          this.$forceUpdate()
          this.init()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      isSchoolIds: false,
      flag: false,
      typeList: ['A', 'B', 'C', 'D'],
      type: 'A', //经营费用类型
      level: 'A', //组织层级
      feeType: 'A', //归类层级
      exportUrl: '/finspendingCost/capitalDaily/costExpenseFlowStatisticsByExportExcel',
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: []
        }
      ],
      //表内容
      loadData: [],
      //搜索项
      searchParams: searchParams,
      queryParam: {},
      //表格是否加载
      rpSpinning: false
    }
  },
  components: {
    ReportTable
  },
  created() {
    // this.isSchoolId()
  },
  methods: {
    toCostPricePrice(record) {
      let { date, finDeptId, deptNo, feeName, totalPrice, paymentDate, bankId } = record
      // return
      this.$router.push({
        name: 'spendManagement',
        query: {
          feeName: feeName,
          price: totalPrice,
          startDate: paymentDate.slice(0, 10),
          endDate: paymentDate.slice(0, 10),
          bankId: bankId
        }
      })
    },
    searchSubmit(data) {
      if (!this.flag) {
        this.flag = true
        return
      }
      let params = {}
      let { Date, deptIds, costClassify, itemNames, projectName, level, startDate, endDate } = data
      let startDates = startDate ? startDate : Date[0].format('YYYY-MM-DD')
      let endDates = endDate || Date[1].format('YYYY-MM-DD')
      this.level = level || this.$route.params.level
      let feeName = ''
      let costName = ''
      if (itemNames) {
        let feeNameList = itemNames.split(',').map(item => {
          return {
            feeName: item.split('-')[0],
            costName: item.split('-')[1]
          }
        })
        feeName = feeNameList.map(item => item.feeName).join(',')
        costName = Array.from(new Set(feeNameList.map(item => item.costName))).join(',')
      }
      if (startDates) params.startDate = startDates
      if (endDates) params.endDate = endDates
      if (deptIds) params.deptIds = deptIds
      if (!this.isSchoolIds && !deptIds) params.deptIds = ''
      params.costClassify = costName || costClassify
      params.itemNames = feeName || ''
      params.projectName = projectName || ''
      if (this.feeType == 'C') {
        params.deptIds = deptIds || this.queryParam.deptIds
        params.costClassify = this.queryParam.costClassify
        params.itemNames = this.queryParam.itemNames
      }
      if (level) params.level = level
      this.queryParam = Object.assign(this.queryParam, params)
      this.init()
    },
    toDetail(data) {
      if (data.isClick) {
        //项目名称层级点击跳转
        if (this.feeType == 'C') {
          this.toCostPricePrice(data)
          return
        }
        //非费用名称层级点击跳转
        let { endDate, startDate, deptIds, costClassify, itemNames } = this.queryParam
        let key = data.type
        let type = this.feeType
        let level = this.level
        //费用归类层级，横轴总计不可点击
        if (key == 'rowTotal' && this.feeType == 'B') {
          return
        }
        //费用归类层级,组织到了最末级，右下角总计不可点击
        if (key == 'all' && this.feeType == 'B' && !data.isChildren) {
          return
        }
        // if (data.isChildren || data.type == 'row') {
        if ((key == 'col' || key == 'colTotal') && !data.isChildren) {
          if (key == 'col' && this.loadData.length > 2) {
            this.queryParam.deptIds = data.deptId
            //获取归类名称
            if (key != 'row') {
              type += '@' + (costClassify || '')
              type += '@' + (itemNames || '')
            }
            if (key == 'row') {
              if (this.feeType != 'A') type += '@' + data.itemParentName
              type += '@' + data.costClassify
            }
            const { href } = this.$router.resolve({
              name: 'costExpenseFlowStatisticsDetail',
              params: { type: type, level: level, startDate: startDate, endDate: endDate }
            })
            localStorage.setItem('costExpenseFlowStatisticsDetailId', data.deptId)
            //结合open打开新的页面
            window.open(href, '_blank')
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: '组织已经到最末级了'
            })
          }
          return
        }
        //组织未到最末级，点击横轴
        if (key !== 'col' && key !== 'colTotal' && key !== 'all' && data.isChildren && type == 'B') {
          this.$notification['error']({
            message: '系统通知',
            description: '组织必须到最末级'
          })
          return
        }
        //获取组织层级
        if (key !== 'row' && key !== 'rowTotal') {
          let index = this.getIndex(this.level, this.typeList) + 1
          level = index >= 4 ? 'D' : this.typeList[index]
        }
        //获取归类层级
        if (key !== 'col' && key !== 'colTotal') {
          if (key == 'all' && this.feeType == 'B' && data.isChildren) {
          } else {
            let index = this.getIndex(this.feeType, this.typeList) + 1
            type = this.typeList[index]
          }
        }
        let ids = ''
        //包含组织下拉
        // && (level != this.level||type==this.type)
        if (data.type !== 'col') {
          let hasChildList = this.loadData.filter(item => item.data[0].isChildren && item.data[0].id)
          let noChildList = this.loadData.filter(item => !item.data[0].isChildren && item.data[0].deptId)
          if (Array.isArray(hasChildList) && hasChildList.length > 0) {
            ids += hasChildList.map(item => item.data[0].id).join(',')
          }
          if (Array.isArray(noChildList) && noChildList.length > 0) {
            let noIds = noChildList.map(item => item.data[0].deptId).join(',')
            ids = ids.length > 0 ? ids + ',' + noIds : noIds
          }
          if (key !== 'colTotal' && key !== 'all') {
            let childList = this.loadData.filter(item => item.data[0].deptId)
            ids = childList.map(item => item.data[0].deptId).join(',')
          }
        }
        let id = data.id || ids
        //获取归类名称
        if (key != 'row') {
          type += '@' + (costClassify || '')
          type += '@' + (itemNames || '')
        }
        if (key == 'row') {
          if (this.feeType != 'A') type += '@' + data.itemParentName
          type += '@' + data.costClassify
        }
        const { href } = this.$router.resolve({
          name: 'costExpenseFlowStatisticsDetail',
          params: { type: type, level: level, startDate: startDate, endDate: endDate }
        })
        localStorage.setItem('costExpenseFlowStatisticsDetailId', id)
        //结合open打开新的页面
        window.open(href, '_blank')
      }
    },
    isSchoolId() {
      const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
      if (userSchoolId && userSchoolId.length > 0) {
        this.isSchoolIds = true
        this.searchParams.forEach((item, index) => {
          if (item.key == 'deptIds') {
            this.searchParams.splice(index, 1)
          }
        })
        this.queryParam.deptIds = userSchoolId.map(item => item.deptId).join(',')
        let index = this.getIndex(userSchoolId[0].level, this.typeList)
        let level = this.typeList[index]
        this.level = level
        this.queryParam.level = level
      }
    },
    getIndex(type, list) {
      let index = list.findIndex(function(val) {
        return val === type
      })
      return index
    },
    async init() {
      this.rpSpinning = true
      let request = costExpenseFlowStatistics
      if (this.feeType == 'B') request = costExpenseFlowStatisticsByCostClassify
      if (this.feeType == 'C') request = costExpenseFlowStatisticsDetails
      let queryParam = this.queryParam
      if (queryParam.month) delete queryParam.month
      let res = await request(queryParam)
      if (this.feeType == 'C') {
        this.getListOrder(res)
      } else {
        this.getListRandom(res)
      }
    },
    getListRandom(res) {
      //初始化表头
      this.headData[0].data = [
        {
          label: '组织',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;',
          isClick: false
        }
      ]
      let organizeIndex = this.getIndex(this.level, this.typeList) + 1
      if (organizeIndex > 1) {
        //添加组织二级表头
        this.headData[0].data.push({
          label: '组织(二级)',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;',
          isClick: false
        })
      }
      if (organizeIndex > 2) {
        //添加组织三/四级表头
        this.headData[0].data.push({
          label: '组织(三/四级)',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;',
          isClick: false
        })
      }
      let headers = []
      if (res.data.data.length > 0) {
        headers = Object.keys(res.data.data[0].data)
      }
      let rows = res.data.data || []
      let count = res.data.itemCount || []
      let loadData = []
      let totalCount = Number(res.data.count) || 0
      let isChildren = rows.some(item => item.isChildren)
      // let itemParentName = res.data.itemParentName || []
      //左下角总计
      let total = [
        {
          key: '总计',
          label: '总计',
          rowspan: 1,
          colspan: organizeIndex > 3 ? 3 : organizeIndex,
          style: 'color:#1BA97B;cursor:pointer;',
          isClick: true,
          type: 'colTotal',
          id: '',
          deptId: '',
          isChildren: isChildren
        }
      ]
      if (res.data && Array.isArray(headers) && headers.length > 0) {
        headers.forEach((item, index) => {
          //获取表头
          this.headData[0].data.push({
            label: item.split('_')[0],
            rowspan: 1,
            colspan: 1,
            style: 'min-width: 120px;color:#1BA97B;cursor:pointer;font-weight:400;',
            isClick: true,
            id: '',
            costClassify: item.split('_')[0],
            itemParentName: item.split('_')[1],
            type: 'row',
            isChildren: isChildren,
            hover: true,
            hoverName: item.split('_')[1]
          })
          //获取总计
          if (res.data.count)
            total.push({
              key: item,
              label: count[item] || 0,
              rowspan: 1,
              colspan: 1,
              style: '',
              isClick: false
            })
        })
      }
      //右上角总计
      this.headData[0].data.push({
        label: '总计',
        rowspan: 1,
        colspan: 1,
        style: 'min-width: 120px;color:#1BA97B;cursor:pointer;font-weight:400;',
        isClick: true,
        type: 'rowTotal',
        id: '',
        costClassify: '',
        isChildren: isChildren
      })
      //获取表内容
      if (res.data && Array.isArray(rows) && rows.length > 0) {
        rows.forEach(item => {
          let data = []
          if (organizeIndex > 1) {
            let title = item.parentNames[1]
            //添加组织一级数据
            data.push({
              key: '组织',
              label: title,
              rowspan: 1,
              colspan: 1,
              style: '',
              isClick: false,
              id: item.deptChildrenId,
              deptId: item.deptId,
              isChildren: item.isChildren,
              type: 'col'
            })
          }
          if (organizeIndex > 2) {
            //添加组织二级数据
            data.push({
              key: '组织',
              label: item.parentNames[2],
              rowspan: 1,
              colspan: 1,
              style: '',
              isClick: false,
              id: item.deptChildrenId,
              deptId: item.deptId,
              isChildren: item.isChildren,
              type: 'col'
            })
          }
          //添加组织末级数据
          data.push({
            key: '组织',
            label: item.name,
            rowspan: 1,
            colspan: 1,
            style: 'color:#1BA97B;cursor:pointer;',
            isClick: true,
            id: item.deptChildrenId,
            deptId: item.deptId,
            isChildren: item.isChildren,
            type: 'col'
          })
          headers.forEach((col, colIndex) => {
            data.push({
              key: item.data[col],
              label: item.data[col],
              rowspan: 1,
              colspan: 1,
              style: '',
              isClick: false
            })
          })
          data.push({
            key: '总计',
            label: item.count,
            rowspan: 1,
            colspan: 1,
            style: '',
            isClick: false,
            type: 'col'
          })
          loadData.push({
            style: 'background:#fff;',
            data: JSON.parse(JSON.stringify(data))
          })
        })
      }
      let isClickAll = this.feeType == 'B' && !isChildren
      //右下角总计
      total.push({
        key: '总计',
        type: 'all',
        label: totalCount ? totalCount.toFixed(3) : 0,
        rowspan: 1,
        colspan: 1,
        style: isClickAll ? '' : 'color:#1BA97B;cursor:pointer;',
        isClick: isClickAll ? false : true,
        id: '',
        isChildren: isChildren
      })
      loadData.push({
        style: 'background:#fff;',
        data: JSON.parse(JSON.stringify(total))
      })
      this.loadData = JSON.parse(JSON.stringify(loadData))
      this.rpSpinning = false
    },
    getListOrder(res) {
      //初始化表头
      this.headData[0].data = [
        {
          label: '组织',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;',
          isClick: false
        }
      ]
      let organizeIndex = this.getIndex(this.level, this.typeList) + 1
      if (organizeIndex > 1) {
        //添加组织二级表头
        this.headData[0].data.push({
          label: '组织(二级)',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;',
          isClick: false
        })
      }
      if (organizeIndex > 2) {
        //添加组织三/四级表头
        this.headData[0].data.push({
          label: '组织(三/四级)',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;',
          isClick: false
        })
      }
      this.headData[0].data.push({
        label: '费用归类',
        rowspan: 1,
        colspan: 1,
        style: 'min-width: 120px;',
        isClick: false
      })
      let headerOrderList = [
        {
          label: '项目名称',
          rowspan: 1,
          colspan: 1,
          key: 'feeName',
          style: 'min-width: 120px;',
          isClick: false,
          isTotal: false
        },
        {
          label: '总金额',
          rowspan: 1,
          colspan: 1,
          key: 'totalPrice',
          style: 'min-width: 120px;',
          isClick: false,
          isTotal: true
        },
        {
          label: '提交日期',
          rowspan: 1,
          colspan: 1,
          key: 'submitDate',
          style: 'min-width: 120px;',
          isClick: false,
          isTotal: false
        },
        {
          label: '付款金额',
          rowspan: 1,
          colspan: 1,
          key: 'paymentPrice',
          style: 'min-width: 120px;',
          isClick: false,
          isTotal: false
        },
        {
          label: '付款日期',
          rowspan: 1,
          colspan: 1,
          key: 'paymentDate',
          style: 'min-width: 120px;',
          isClick: false,
          isTotal: false
        }
      ]
      headerOrderList.forEach(item => {
        this.headData[0].data.push(item)
      })
      let rows = res.data || []
      let loadData = []
      //左下角总计
      let total = [
        {
          key: '总计',
          label: '总计',
          rowspan: 1,
          colspan: organizeIndex > 3 ? 3 : organizeIndex,
          style: '',
          isClick: false,
          type: 'colTotal',
          id: '',
          deptId: ''
        },
        {
          key: '费用归类',
          label: '',
          rowspan: 1,
          colspan: 1,
          style: '',
          isClick: false,
          type: 'colTotal',
          id: '',
          deptId: ''
        }
      ]
      //获取表内容
      if (res.data && Array.isArray(rows) && rows.length > 0) {
        rows.forEach(item => {
          let data = []
          if (organizeIndex > 1) {
            let title = item.parentNames ? item.parentNames[1] : ''
            //添加组织一级数据
            data.push({
              key: '组织',
              label: title,
              rowspan: 1,
              colspan: 1,
              style: '',
              isClick: false,
              id: item.deptChildrenId,
              deptId: item.deptId,
              type: 'col'
            })
          }
          if (organizeIndex > 2) {
            //添加组织二级数据
            data.push({
              key: '组织',
              label: item.parentNames ? item.parentNames[2] : '',
              rowspan: 1,
              colspan: 1,
              style: '',
              isClick: false,
              id: item.deptChildrenId,
              deptId: item.deptId,
              type: 'col'
            })
          }
          //添加组织末级数据
          data.push({
            key: '组织',
            label: item.deptName,
            rowspan: 1,
            colspan: 1,
            style: '',
            isClick: false,
            id: item.deptChildrenId,
            deptId: item.deptId,
            type: 'col'
          })
          //添加费用归类
          data.push({
            key: '费用归类',
            label: this.queryParam.itemNames,
            rowspan: 1,
            colspan: 1,
            style: '',
            isClick: false,
            id: item.deptChildrenId,
            deptId: item.deptId,
            isChildren: item.isChildren,
            type: 'col'
          })
          headerOrderList.forEach((col, colIndex) => {
            data.push({
              key: col.key,
              label: item[col.key],
              rowspan: 1,
              colspan: 1,
              style: col.isTotal ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isTotal ? true : false,
              feeName: item.feeName,
              totalPrice: Math.abs(item.masterPrice),
              paymentDate: item.submitDate,
              bankId: item.bankId
            })
          })
          loadData.push({
            style: 'background:#fff;',
            data: JSON.parse(JSON.stringify(data))
          })
        })
      }
      headerOrderList.forEach((col, colIndex) => {
        let value = 0
        if (col.isTotal && Array.isArray(rows) && rows.length > 0) {
          value = rows
            .map(item => item[col.key])
            .reduce(function(prev, curr, idx, arr) {
              return prev + curr
            })
          if (value) value = value.toFixed(2)
        }
        total.push({
          key: col.key,
          label: value || '',
          rowspan: 1,
          colspan: 1,
          style: '',
          isClick: false
        })
      })
      loadData.push({
        style: 'background:#fff;',
        data: JSON.parse(JSON.stringify(total))
      })
      this.loadData = JSON.parse(JSON.stringify(loadData))
      this.rpSpinning = false
    }
  }
}
</script>

<style lang="less" scoped>
.reports-iframe-wrapper {
}
</style>
