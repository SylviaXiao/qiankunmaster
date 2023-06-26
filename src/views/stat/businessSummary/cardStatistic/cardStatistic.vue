<template>
  <div class="fin-profit-paytype-wrapper">
    <!-- <f-frame :searchParamsArray="searchParams" src="/report?name=fin_source_income" perm="finance:stat:source:income" date="month"></f-frame> -->
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      @onShowSizeChange="onShowSizeChange"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :total="total"
      :showPagination="true"
      :isMerge="true"
      :hideReset="false"
      :exportUrl="'/student/card/stat/collectStudentCardDown'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { collectStudentCard } from '@/api/table/table'
import { getSchoolList } from '@/api/education/card'
import { getSelectStuSourceData } from '@/api/reception/student'
import { listChannelTree, listAllByArea, listEduDance, treeEduClassType } from '@/api/common'
import Vue from 'vue'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
let stuSource = [
  {
    string: '客服',
    value: '客服'
  }
]
export default {
  name: 'cardStatistic',
  data() {
    let schoolId = this.$store.getters.school_id || null
    return {
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: [
            {
              label: '区域',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '办卡分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '卡种',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '大班型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '舞种',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '合同收入',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '报名收入',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            }
          ]
        }
      ],
      //表内容字段
      headList: [
        {
          key: 'deptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'schoolName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'cardName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'typeName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'danceName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'originalPrice',
          value: 0,
          isTotal: true,
          isClick: false
        },
        {
          key: 'paidPrice',
          value: 0,
          isTotal: true,
          isClick: false
        }
      ],
      //表内容
      loadData: [],
      //搜索项
      searchParams: [
        // {
        //   type: 'treeSelect',
        //   key: 'area',
        //   label: '区域',
        //   placeholder: '请选择区域',
        //   expandAll: true,
        //   mutiple: true,
        //   show: true,
        //   isShow: true,
        //   treeCheckable: true,
        //   selectFather: true,
        //   treeOps: {
        //     api: listAllByArea,
        //     label: 'deptName',
        //     value: 'id',
        //     children: 'children'
        //   }
        // },
        {
          type: 'date',
          key: 'ApplyDate',
          label: '办卡日期',
          show: true,
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'treeSelect',
          key: 'deptId',
          label: '办卡分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          isShow: true,
          treeCheckable: true,
          selectFather: true,
          defaultVal: schoolId,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'treeSelect',
          key: 'schoolId',
          label: '上课分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          isShow: true,
          treeCheckable: true,
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
          key: 'ValidityDate',
          label: '有效期截止日期 ',
          show: true,
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'select',
          key: 'firstChannel',
          label: '来源一级',
          placeholder: '请选择来源一级',
          search: true,
          staticArr: stuSource
        },
        {
          type: 'cascader',
          key: 'secondChannel',
          label: '来源二级',
          placeholder: '请选择来源二级',
          search: true,
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'chooseModal',
          key: 'service',
          label: '客服',
          placeholder: '请选择客服'
        },
        {
          type: 'text',
          key: 'eduCardName',
          label: '卡种名称',
          placeholder: '请输入卡种名称',
        },
        {
          type: 'text',
          key: 'cardNo',
          label: '卡号',
          placeholder: '请输入卡号',
        },
        {
          type: 'select',
          key: 'isOpenCard',
          label: '是否开卡',
          placeholder: '请选择是否开卡',
          staticArr: [
            {
              string: '是',
              value: 1
            },
            {
              string: '否',
              value: 2
            }
          ]
        },
        {
          type: 'select',
          key: 'cardState',
          label: '卡状态',
          mode: 'multiple',
          placeholder: '请选择卡状态',
          staticArr: [
            {
              string: '未使用',
              value: 'A'
            },
            {
              string: '使用中',
              value: 'B'
            },
            {
              string: '停课',
              value: 'C'
            },
            {
              string: '退卡',
              value: 'D'
            },
            {
              string: '结业',
              value: 'E'
            },
            {
              string: '撤销',
              value: 'F'
            },
            {
              string: '结转',
              value: 'G'
            }
          ]
        },
        {
          type: 'treeSelect',
          key: 'eduClassTypeId',
          label: '班型',
          placeholder: '请选择班型',
          expandAll: true,
          mutiple: true,
          isShow: true,
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
          type: 'select',
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          mode: 'multiple',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'isNew',
          label: '是否新报',
          placeholder: '请选择是否新报',
          staticArr: [
            {
              string: '是',
              value: 1
            },
            {
              string: '否',
              value: 2
            }
          ]
        },
        {
          type: 'select',
          key: 'isPayUp',
          label: '是否缴清',
          placeholder: '请选择状态',
          staticArr: [
            {
              string: '已缴清',
              value: 1
            },
            {
              string: '未缴清',
              value: 2
            }
          ]
        },
        {
          type: 'text',
          key: 'studentName',
          label: '学员姓名',
          placeholder: '请输入学员姓名'
        },
        {
          type: 'text',
          key: 'phone',
          label: '学员手机号',
          placeholder: '请输入学员手机号'
        },
        {
          type: 'select',
          key: 'stuType',
          label: '人群',
          placeholder: '请选择人群',
          staticArr: [
            {
              string: '成人',
              value: 'A'
            },
            {
              string: '少儿',
              value: 'B'
            }
          ]
        },
        {
          type: 'date',
          key: 'LastClassDate',
          label: '上次签到日期',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'arrText',
          key: 'count',
          selectKey: 'countType',
          arrPlaceholder: '请选择',
          label: '未消耗天数',
          placeholder: '请输入天数',
          addonAfter: '天',
          allowClear: false,
          arrInitialValue: 'A',
          staticArr: [
            {
              string: '大于',
              value: 'A'
            },
            {
              string: '等于',
              value: 'B'
            },
            {
              string: '小于',
              value: 'C'
            }
          ]
        },
        // {
        //   type: 'arrText',
        //   key: 'stuDate',
        //   selectKey: 'stuDateType',
        //   arrPlaceholder: '请选择',
        //   label: '出生年月',
        //   placeholder: '请输入',
        //   allowClear: false,
        //   arrInitialValue: 'B',
        //   staticArr: [
        //     {
        //       string: '年',
        //       value: 'A'
        //     },
        //     {
        //       string: '月',
        //       value: 'B'
        //     },
        //     {
        //       string: '日',
        //       value: 'C'
        //     }
        //   ]
        // }
      ],
      queryParam: {},
      //表格是否加载
      rpSpinning: false,
      total: 0
    }
  },
  components: {
    ReportTable
  },
  created() {
    this.getSourceValue()
  },
  methods: {
    getSourceValue() {
      getSelectStuSourceData()
        .then(res => {
          return res.data
        })
        .then(res => {
          if (res instanceof Array) {
            res.forEach(item => {
              stuSource.push({
                string: item.sourceName,
                value: item.sourceName
              })
            })
          }
        })
    },
    async init(data) {
      this.rpSpinning = true
      let totalColspan = 0
      this.headList.forEach((col, colIndex) => {
        if (col.isTotal) col.value = 0
        if (!col.isTotal) totalColspan += 1
      })
      let res = await collectStudentCard(data)
      this.total = res.count
      if (Array.isArray(res.data) && res.data.length > 0) {
        let loadData = []
        res.data.forEach((item, index) => {
          let data = []
          this.headList.forEach((col, colIndex) => {
            if (col.isTotal) col.value += item[col.key] ? Number(item[col.key]) : 0
            let dataItem = {
              key: col.key,
              label: col.formatValue ? col.formatValue(item) : item[col.key],
              rowspan: 1,
              colspan: 1,
              style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isClick,
              id: item.deptId
            }
            data.push(dataItem)
          })
          loadData.push({
            style: 'background:#fff;',
            data: JSON.parse(JSON.stringify(data))
          })
        })
        let total = []
        this.headList.forEach((col, colIndex) => {
          if (colIndex == 0 || col.isTotal) {
            let totalData = {
              key: col.key,
              label: col.value,
              rowspan: 1,
              colspan: colIndex == 0 ? totalColspan : 1,
              style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
              isClick: col.isClick,
              id: ''
            }
            if (col.isTotal) totalData.label = Number(col.value).toFixed(2)
            total.push(totalData)
          }
        })
        total[0].label = '总计(点击详情)'
        total[0].isClick = true
        total[0].style = 'color:#1BA97B;cursor:pointer;'
        loadData.push({
          style: 'background:#fff;',
          data: JSON.parse(JSON.stringify(total))
        })
        this.loadData = JSON.parse(JSON.stringify(loadData))
      } else {
        this.loadData = []
      }
      this.rpSpinning = false
    },
    onShowSizeChange(data) {
      this.queryParam = Object.assign(this.queryParam, data)
      this.init(this.queryParam)
    },
    searchSubmit(data, isReset) {
      let { stuDateType, stuDate } = data
      this.queryParam = data
      // if (stuDate) {
      //   if (stuDateType === 'A') {
      //     this.queryParam.stuYear = stuDate
      //   } else if (stuDateType === 'B') {
      //     this.queryParam.stuMonth = stuDate
      //   } else if (stuDateType === 'C') {
      //     this.queryParam.stuDay = stuDate
      //   }
      // }
      if (isReset == 'isReset') {
        this.queryParam.startApplyDate = defaultStart
        this.queryParam.endApplyDate = defaultEnd
      }
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        const { href } = this.$router.resolve({
          name: 'cardStatisticDetail'
        })
        localStorage.setItem('businessSummarySearchParams', JSON.stringify(this.queryParam))
        //结合open打开新的页面
        window.open(href, '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
